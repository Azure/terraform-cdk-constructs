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
} from "./vmss-schemas";
import {
  NETWORK_INTERFACE_TYPE,
  ALL_NETWORK_INTERFACE_VERSIONS,
} from "../../azure-networkinterface/lib/network-interface-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
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
   * Static initialization flag to ensure schemas are registered only once
   */
  private static schemasRegistered = false;

  /**
   * Ensures that VMSS schemas are registered with the ApiVersionManager
   * This is called once during the first VirtualMachineScaleSet instantiation
   */
  private static ensureSchemasRegistered(): void {
    if (VirtualMachineScaleSet.schemasRegistered) {
      return;
    }

    const apiVersionManager = ApiVersionManager.instance();

    try {
      // Register Network Interface schemas first (dependency)
      try {
        apiVersionManager.registerResourceType(
          NETWORK_INTERFACE_TYPE,
          ALL_NETWORK_INTERFACE_VERSIONS,
        );
        console.log(
          `Registered ${ALL_NETWORK_INTERFACE_VERSIONS.length} API versions for ${NETWORK_INTERFACE_TYPE} (VMSS dependency)`,
        );
      } catch (nicError) {
        // Network Interface schemas might already be registered - that's OK
        console.log(
          `Network Interface schemas already registered or registration failed: ${nicError}`,
        );
      }

      // Register all VMSS versions
      apiVersionManager.registerResourceType(VMSS_TYPE, ALL_VMSS_VERSIONS);

      VirtualMachineScaleSet.schemasRegistered = true;

      console.log(
        `Registered ${ALL_VMSS_VERSIONS.length} API versions for ${VMSS_TYPE}`,
      );
    } catch (error) {
      console.warn(
        `Failed to register VMSS schemas: ${error}. ` +
          `This may indicate the schemas are already registered or there's a configuration issue.`,
      );
      // Don't throw here as the schemas might already be registered
      VirtualMachineScaleSet.schemasRegistered = true;
    }
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
  public readonly id: string;
  public readonly tags: { [key: string]: string };

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
    // Ensure schemas are registered before calling super
    VirtualMachineScaleSet.ensureSchemasRegistered();

    // Call the parent constructor with the props
    super(scope, id, props as AzapiResourceProps);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    this.id = `\${${this.terraformResource.fqn}.id}`;
    this.tags = props.tags || {};

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
      location: typedProps.location || "eastus",
      tags: typedProps.tags || {},
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
   */
  private _applyIgnoreChanges(): void {
    if (this.props.ignoreChanges && this.props.ignoreChanges.length > 0) {
      // Common properties that are safe to ignore for VMSS
      const validIgnoreChanges = this.props.ignoreChanges.filter(
        (change) => change !== "name", // name cannot be changed after creation
      );

      if (validIgnoreChanges.length > 0) {
        this.terraformResource.addOverride("lifecycle", {
          ignore_changes: validIgnoreChanges,
        });
      }
    }
  }
}
