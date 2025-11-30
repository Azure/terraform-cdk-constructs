/**
 * Unified Azure Virtual Machine Scale Set implementation using AzapiResource framework
 *
 * This class provides a single, version-aware implementation for Azure Virtual Machine Scale Sets
 * that automatically handles version management, schema validation, and property transformation
 * across all supported API versions.
 *
 * Supported API Versions:
 * - 2025-01-02 (Active)
 * - 2025-02-01 (Active)
 * - 2025-04-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full JSII compliance for multi-language support
 * - Comprehensive support for VMSS features (scaling, upgrades, orchestration)
 * - Code reuse from VM implementation for common profiles
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_VMSS_VERSIONS,
  VMSS_TYPE,
  VirtualMachineScaleSetSku,
  OrchestrationMode,
  VirtualMachineScaleSetProps,
  VmssMonitoringOptions,
} from "./vmss-schemas";
import {
  NETWORK_INTERFACE_TYPE,
  ALL_NETWORK_INTERFACE_VERSIONS,
} from "../../azure-networkinterface/lib/network-interface-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
  MonitoringConfig,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Unified Azure Virtual Machine Scale Set implementation
 *
 * This class provides a single, version-aware implementation that automatically handles version
 * resolution, schema validation, and property transformation while maintaining full JSII compliance.
 *
 * The class uses the AzapiResource framework to provide:
 * - Automatic latest version resolution (2025-04-01 as of this implementation)
 * - Support for explicit version pinning when stability is required
 * - Schema-driven property validation and transformation
 * - Migration analysis and deprecation warnings
 * - Full JSII compliance for multi-language support
 *
 * @example
 * // Basic Uniform VMSS with Linux VMs:
 * const vmss = new VirtualMachineScaleSet(this, "vmss", {
 *   name: "my-vmss",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   sku: {
 *     name: "Standard_D2s_v3",
 *     capacity: 3
 *   },
 *   orchestrationMode: "Uniform",
 *   upgradePolicy: {
 *     mode: "Automatic"
 *   },
 *   virtualMachineProfile: {
 *     storageProfile: {
 *       imageReference: {
 *         publisher: "Canonical",
 *         offer: "0001-com-ubuntu-server-jammy",
 *         sku: "22_04-lts-gen2",
 *         version: "latest"
 *       },
 *       osDisk: {
 *         createOption: "FromImage",
 *         managedDisk: {
 *           storageAccountType: "Premium_LRS"
 *         }
 *       }
 *     },
 *     osProfile: {
 *       computerName: "vmss-vm",
 *       adminUsername: "azureuser",
 *       linuxConfiguration: {
 *         disablePasswordAuthentication: true,
 *         ssh: {
 *           publicKeys: [{
 *             path: "/home/azureuser/.ssh/authorized_keys",
 *             keyData: "ssh-rsa AAAA..."
 *           }]
 *         }
 *       }
 *     },
 *     networkProfile: {
 *       networkInterfaceConfigurations: [{
 *         name: "nic-config",
 *         properties: {
 *           primary: true,
 *           ipConfigurations: [{
 *             name: "ip-config",
 *             properties: {
 *               subnet: {
 *                 id: subnet.id
 *               }
 *             }
 *           }]
 *         }
 *       }],
 *       // networkApiVersion is automatically set to latest when not specified
 *       // Explicitly set only if you need to pin to a specific version
 *       // networkApiVersion: "2024-10-01"
 *     }
 *   }
 * });
 *
 * @example
 * // Flexible orchestration mode with rolling upgrades:
 * const flexibleVmss = new VirtualMachineScaleSet(this, "flexible-vmss", {
 *   name: "my-flexible-vmss",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   sku: {
 *     name: "Standard_D2s_v3",
 *     capacity: 5
 *   },
 *   orchestrationMode: "Flexible",
 *   upgradePolicy: {
 *     mode: "Rolling",
 *     rollingUpgradePolicy: {
 *       maxBatchInstancePercent: 20,
 *       maxUnhealthyInstancePercent: 20,
 *       maxUnhealthyUpgradedInstancePercent: 20,
 *       pauseTimeBetweenBatches: "PT5S"
 *     }
 *   },
 *   automaticRepairsPolicy: {
 *     enabled: true,
 *     gracePeriod: "PT30M"
 *   }
 * });
 *
 * @stability stable
 */
export class VirtualMachineScaleSet extends AzapiResource {
  /**
   * Returns a production-ready monitoring configuration for Virtual Machine Scale Sets
   *
   * This static factory method provides a complete MonitoringConfig with sensible defaults
   * for VMSS monitoring including CPU, memory, disk queue alerts, and deletion tracking.
   *
   * VMSS uses a lower CPU threshold (75%) compared to single VMs (80%) to allow headroom
   * for scaling operations before reaching saturation.
   *
   * @param actionGroupId - The resource ID of the action group for alert notifications
   * @param workspaceId - Optional Log Analytics workspace ID for diagnostic settings
   * @param options - Optional configuration to customize thresholds and enable/disable specific alerts
   * @returns A complete MonitoringConfig object ready to use in VirtualMachineScaleSet props
   *
   * @example
   * // Basic usage with all defaults
   * const vmss = new VirtualMachineScaleSet(this, "vmss", {
   *   // ... other properties ...
   *   monitoring: VirtualMachineScaleSet.defaultMonitoring(actionGroup.id, workspace.id)
   * });
   *
   * @example
   * // Custom thresholds and severities
   * const vmss = new VirtualMachineScaleSet(this, "vmss", {
   *   // ... other properties ...
   *   monitoring: VirtualMachineScaleSet.defaultMonitoring(
   *     actionGroup.id,
   *     workspace.id,
   *     {
   *       cpuThreshold: 85,
   *       memoryThreshold: 536870912, // 512MB
   *       enableDiskQueueAlert: false,
   *       cpuAlertSeverity: 1 // Error level
   *     }
   *   )
   * });
   *
   * @stability stable
   */
  public static defaultMonitoring(
    actionGroupId: string,
    workspaceId?: string,
    options?: VmssMonitoringOptions,
  ): MonitoringConfig {
    const metricAlerts: any[] = [];

    // High CPU Alert
    if (options?.enableCpuAlert !== false) {
      metricAlerts.push({
        name: "high-cpu-alert",
        description: "Alert when VMSS CPU usage exceeds threshold",
        severity: (options?.cpuAlertSeverity ?? 2) as 0 | 1 | 2 | 3 | 4,
        scopes: [], // Will be set automatically by base class
        evaluationFrequency: "PT5M",
        windowSize: "PT15M",
        criteria: {
          type: "StaticThreshold" as const,
          metricName: "Percentage CPU",
          metricNamespace: "Microsoft.Compute/virtualMachineScaleSets",
          operator: "GreaterThan" as const,
          threshold: options?.cpuThreshold ?? 75,
          timeAggregation: "Average" as const,
        },
        actions: [{ actionGroupId }],
      });
    }

    // Low Memory Alert
    if (options?.enableMemoryAlert !== false) {
      metricAlerts.push({
        name: "low-memory-alert",
        description: "Alert when VMSS available memory drops below threshold",
        severity: (options?.memoryAlertSeverity ?? 2) as 0 | 1 | 2 | 3 | 4,
        scopes: [], // Will be set automatically by base class
        evaluationFrequency: "PT5M",
        windowSize: "PT15M",
        criteria: {
          type: "StaticThreshold" as const,
          metricName: "Available Memory Bytes",
          metricNamespace: "Microsoft.Compute/virtualMachineScaleSets",
          operator: "LessThan" as const,
          threshold: options?.memoryThreshold ?? 1073741824,
          timeAggregation: "Average" as const,
        },
        actions: [{ actionGroupId }],
      });
    }

    // High Disk Queue Alert
    if (options?.enableDiskQueueAlert !== false) {
      metricAlerts.push({
        name: "high-disk-queue-alert",
        description: "Alert when VMSS disk queue depth exceeds threshold",
        severity: (options?.diskQueueAlertSeverity ?? 2) as 0 | 1 | 2 | 3 | 4,
        scopes: [], // Will be set automatically by base class
        evaluationFrequency: "PT5M",
        windowSize: "PT15M",
        criteria: {
          type: "StaticThreshold" as const,
          metricName: "OS Disk Queue Depth",
          metricNamespace: "Microsoft.Compute/virtualMachineScaleSets",
          operator: "GreaterThan" as const,
          threshold: options?.diskQueueThreshold ?? 32,
          timeAggregation: "Average" as const,
        },
        actions: [{ actionGroupId }],
      });
    }

    // Build diagnostic settings if workspace ID is provided
    const diagnosticSettings = workspaceId
      ? {
          name: "vmss-diagnostics",
          targetResourceId: "", // Will be set automatically by base class
          workspaceId: workspaceId,
          logs: [{ categoryGroup: "allLogs", enabled: true }],
          metrics: [{ category: "AllMetrics", enabled: true }],
        }
      : undefined;

    // Build activity log alerts
    const activityLogAlerts =
      options?.enableDeletionAlert !== false
        ? [
            {
              name: "vmss-deletion-alert",
              description: "Alert when virtual machine scale set is deleted",
              scopes: [], // Will be set automatically by base class
              condition: {
                allOf: [
                  {
                    field: "operationName",
                    equalsValue:
                      "Microsoft.Compute/virtualMachineScaleSets/delete",
                  },
                ],
              },
              actions: {
                actionGroups: [{ actionGroupId }],
              },
            },
          ]
        : undefined;

    // Return complete config object
    return {
      enabled: true,
      diagnosticSettings: diagnosticSettings,
      metricAlerts: metricAlerts,
      activityLogAlerts: activityLogAlerts,
    };
  }

  static {
    // Register Network Interface schemas first (dependency)
    AzapiResource.registerSchemas(
      NETWORK_INTERFACE_TYPE,
      ALL_NETWORK_INTERFACE_VERSIONS,
    );
    // Register VMSS schemas
    AzapiResource.registerSchemas(VMSS_TYPE, ALL_VMSS_VERSIONS);
  }

  /**
   * The input properties for this VMSS instance
   */
  public readonly props: VirtualMachineScaleSetProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly uniqueIdOutput: cdktf.TerraformOutput;

  // Public properties that match common VMSS interface patterns

  /**
   * Creates a new Azure Virtual Machine Scale Set using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Virtual Machine Scale Set
   */
  constructor(
    scope: Construct,
    id: string,
    props: VirtualMachineScaleSetProps,
  ) {
    super(scope, id, props as AzapiResourceProps);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Virtual Machine Scale Set",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Virtual Machine Scale Set",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Virtual Machine Scale Set",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Virtual Machine Scale Set",
    });

    this.uniqueIdOutput = new cdktf.TerraformOutput(this, "uniqueId", {
      value: `\${${this.terraformResource.fqn}.output.properties.uniqueId}`,
      description: "The unique identifier of the Virtual Machine Scale Set",
    });

    // Override logical IDs to match naming convention
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.uniqueIdOutput.overrideLogicalId("uniqueId");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   * Returns the most recent stable version as the default
   */
  protected defaultVersion(): string {
    return "2025-04-01";
  }

  /**
   * Gets the Azure resource type for Virtual Machine Scale Sets
   */
  protected resourceType(): string {
    return VMSS_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   * Uses the framework's schema resolution to get the appropriate schema
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Virtual Machine Scale Sets
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   * Transforms the input properties into the JSON format expected by Azure REST API
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as VirtualMachineScaleSetProps;

    // Handle network API version for Flexible orchestration mode
    let virtualMachineProfile = typedProps.virtualMachineProfile;
    if (
      typedProps.orchestrationMode === "Flexible" &&
      virtualMachineProfile?.networkProfile?.networkInterfaceConfigurations
    ) {
      const networkProfile = virtualMachineProfile.networkProfile;

      // Use user-provided networkApiVersion if specified, otherwise auto-resolve
      const networkApiVersion =
        networkProfile.networkApiVersion ||
        ApiVersionManager.instance().latestVersion(NETWORK_INTERFACE_TYPE);

      virtualMachineProfile = {
        ...virtualMachineProfile,
        networkProfile: {
          ...networkProfile,
          networkApiVersion,
        },
      };
    }

    return {
      location: this.location,
      tags: this.allTags(),
      sku: typedProps.sku,
      identity: typedProps.identity,
      zones: typedProps.zones,
      plan: typedProps.plan,
      properties: {
        upgradePolicy: typedProps.upgradePolicy,
        virtualMachineProfile,
        orchestrationMode: typedProps.orchestrationMode,
        overprovision: typedProps.overprovision,
        doNotRunExtensionsOnOverprovisionedVMs:
          typedProps.doNotRunExtensionsOnOverprovisionedVMs,
        singlePlacementGroup: typedProps.singlePlacementGroup,
        zoneBalance: typedProps.zoneBalance,
        platformFaultDomainCount: typedProps.platformFaultDomainCount,
        automaticRepairsPolicy: typedProps.automaticRepairsPolicy,
        scaleInPolicy: typedProps.scaleInPolicy,
        proximityPlacementGroup: typedProps.proximityPlacementGroup,
        hostGroup: typedProps.hostGroup,
        additionalCapabilities: typedProps.additionalCapabilities,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR VMSS OPERATIONS
  // =============================================================================

  /**
   * Get the unique ID (unique identifier assigned by Azure)
   */
  public get uniqueId(): string {
    return `\${${this.terraformResource.fqn}.output.properties.uniqueId}`;
  }

  /**
   * Get the provisioning state of the Virtual Machine Scale Set
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Get the SKU configuration
   */
  public get sku(): VirtualMachineScaleSetSku {
    return this.props.sku;
  }

  /**
   * Get the capacity (number of VMs)
   */
  public get capacity(): number | undefined {
    return this.props.sku.capacity;
  }

  /**
   * Get the orchestration mode
   */
  public get orchestrationMode(): OrchestrationMode | undefined {
    return this.props.orchestrationMode;
  }

  /**
   * Add a tag to the Virtual Machine Scale Set
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Virtual Machine Scale Set
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public removeTag(key: string): void {
    if (this.props.tags && this.props.tags[key]) {
      delete this.props.tags[key];
    }
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Applies ignore changes lifecycle rules if specified in props
   * Always includes body.identity.type to handle Azure API format normalization
   */
  private _applyIgnoreChanges(): void {
    // Always ignore identity.type format changes due to Azure API normalization
    // Azure may return identity type in different format than sent (e.g., "SystemAssigned, UserAssigned" vs "SystemAssigned")
    const ignoreChanges = [
      "body.identity.type",
      ...(this.props.ignoreChanges || []),
    ];

    // Filter out name if explicitly provided by user (name cannot be changed after creation)
    const validIgnoreChanges = ignoreChanges.filter(
      (change) => change !== "name",
    );

    this.terraformResource.addOverride("lifecycle", {
      ignore_changes: validIgnoreChanges,
    });
  }
}
