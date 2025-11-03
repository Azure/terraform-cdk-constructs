/**
 * Unified Azure Virtual Machine implementation using VersionedAzapiResource framework
 *
 * This class provides a single, version-aware implementation for Azure Virtual Machines
 * that automatically handles version management, schema validation, and property transformation
 * across all supported API versions.
 *
 * Supported API Versions:
 * - 2024-07-01 (Active)
 * - 2024-11-01 (Active)
 * - 2025-04-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full JSII compliance for multi-language support
 * - Comprehensive support for VM features (networking, storage, identity, etc.)
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_VIRTUAL_MACHINE_VERSIONS,
  VIRTUAL_MACHINE_TYPE,
  VirtualMachineHardwareProfile,
  VirtualMachineStorageProfile,
  VirtualMachineNetworkProfile,
  VirtualMachineOSProfile,
  VirtualMachineIdentity,
  VirtualMachinePlan,
  VirtualMachineAdditionalCapabilities,
  VirtualMachineDiagnosticsProfile,
  VirtualMachineSecurityProfile,
  VirtualMachineLicenseType,
  VirtualMachineAvailabilitySetReference,
  VirtualMachineScaleSetReference,
  VirtualMachineProximityPlacementGroupReference,
  VirtualMachineHostReference,
  VirtualMachineBillingProfile,
} from "./virtual-machine-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the unified Azure Virtual Machine
 *
 * Extends AzapiResourceProps with Virtual Machine specific properties
 */
export interface VirtualMachineProps extends AzapiResourceProps {
  /**
   * The hardware profile for the Virtual Machine (VM size)
   * @example { vmSize: "Standard_D2s_v3" }
   */
  readonly hardwareProfile: VirtualMachineHardwareProfile;

  /**
   * The storage profile for the Virtual Machine
   * Defines the OS disk, data disks, and image reference
   */
  readonly storageProfile: VirtualMachineStorageProfile;

  /**
   * The network profile for the Virtual Machine
   * Defines network interfaces attached to the VM
   */
  readonly networkProfile: VirtualMachineNetworkProfile;

  /**
   * The OS profile for the Virtual Machine
   * Defines computer name, admin credentials, and OS-specific configuration
   */
  readonly osProfile?: VirtualMachineOSProfile;

  /**
   * The identity configuration for the Virtual Machine
   * @example { type: "SystemAssigned" }
   * @example { type: "UserAssigned", userAssignedIdentities: { "/subscriptions/.../resourceGroups/.../providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity": {} } }
   */
  readonly identity?: VirtualMachineIdentity;

  /**
   * Availability zones for the Virtual Machine
   * @example ["1", "2"]
   */
  readonly zones?: string[];

  /**
   * Plan information for marketplace images
   */
  readonly plan?: VirtualMachinePlan;

  /**
   * License type for Windows VMs
   * @example "Windows_Server"
   * @example "Windows_Client"
   */
  readonly licenseType?: VirtualMachineLicenseType;

  /**
   * The priority of the Virtual Machine
   * @default "Regular"
   * @example "Regular", "Low", "Spot"
   */
  readonly priority?: string;

  /**
   * The eviction policy for Spot VMs
   * @example "Deallocate", "Delete"
   */
  readonly evictionPolicy?: string;

  /**
   * The billing profile for Spot VMs
   */
  readonly billingProfile?: VirtualMachineBillingProfile;

  /**
   * The diagnostics profile for boot diagnostics
   */
  readonly diagnosticsProfile?: VirtualMachineDiagnosticsProfile;

  /**
   * Reference to an availability set
   */
  readonly availabilitySet?: VirtualMachineAvailabilitySetReference;

  /**
   * Reference to a virtual machine scale set
   */
  readonly virtualMachineScaleSet?: VirtualMachineScaleSetReference;

  /**
   * Reference to a proximity placement group
   */
  readonly proximityPlacementGroup?: VirtualMachineProximityPlacementGroupReference;

  /**
   * Reference to a dedicated host
   */
  readonly host?: VirtualMachineHostReference;

  /**
   * Additional capabilities like Ultra SSD
   */
  readonly additionalCapabilities?: VirtualMachineAdditionalCapabilities;

  /**
   * Security settings for the Virtual Machine
   */
  readonly securityProfile?: VirtualMachineSecurityProfile;

  /**
   * The lifecycle rules to ignore changes
   * Useful for properties that are externally managed or should not trigger updates
   * @example ["osProfile.adminPassword"]
   */
  readonly ignoreChanges?: string[];

  /**
   * Resource group ID where the Virtual Machine will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * Virtual Machine properties for the request body
 */
export interface VirtualMachineBodyProperties {
  readonly hardwareProfile: VirtualMachineHardwareProfile;
  readonly storageProfile: VirtualMachineStorageProfile;
  readonly osProfile?: VirtualMachineOSProfile;
  readonly networkProfile: VirtualMachineNetworkProfile;
  readonly diagnosticsProfile?: VirtualMachineDiagnosticsProfile;
  readonly availabilitySet?: VirtualMachineAvailabilitySetReference;
  readonly virtualMachineScaleSet?: VirtualMachineScaleSetReference;
  readonly proximityPlacementGroup?: VirtualMachineProximityPlacementGroupReference;
  readonly priority?: string;
  readonly evictionPolicy?: string;
  readonly billingProfile?: VirtualMachineBillingProfile;
  readonly host?: VirtualMachineHostReference;
  readonly licenseType?: VirtualMachineLicenseType;
  readonly additionalCapabilities?: VirtualMachineAdditionalCapabilities;
  readonly securityProfile?: VirtualMachineSecurityProfile;
}

/**
 * The resource body interface for Azure Virtual Machine API calls
 */
export interface VirtualMachineBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly identity?: VirtualMachineIdentity;
  readonly zones?: string[];
  readonly plan?: VirtualMachinePlan;
  readonly properties: VirtualMachineBodyProperties;
}

/**
 * Unified Azure Virtual Machine implementation
 *
 * This class provides a single, version-aware implementation that automatically handles version
 * resolution, schema validation, and property transformation while maintaining full JSII compliance.
 *
 * The class uses the VersionedAzapiResource framework to provide:
 * - Automatic latest version resolution (2025-04-01 as of this implementation)
 * - Support for explicit version pinning when stability is required
 * - Schema-driven property validation and transformation
 * - Migration analysis and deprecation warnings
 * - Full JSII compliance for multi-language support
 *
 * @example
 * // Basic Linux VM with SSH authentication:
 * const vm = new VirtualMachine(this, "vm", {
 *   name: "my-linux-vm",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   hardwareProfile: {
 *     vmSize: "Standard_D2s_v3"
 *   },
 *   storageProfile: {
 *     imageReference: {
 *       publisher: "Canonical",
 *       offer: "0001-com-ubuntu-server-jammy",
 *       sku: "22_04-lts-gen2",
 *       version: "latest"
 *     },
 *     osDisk: {
 *       createOption: "FromImage",
 *       managedDisk: {
 *         storageAccountType: "Premium_LRS"
 *       }
 *     }
 *   },
 *   osProfile: {
 *     computerName: "myvm",
 *     adminUsername: "azureuser",
 *     linuxConfiguration: {
 *       disablePasswordAuthentication: true,
 *       ssh: {
 *         publicKeys: [{
 *           path: "/home/azureuser/.ssh/authorized_keys",
 *           keyData: "ssh-rsa AAAA..."
 *         }]
 *       }
 *     }
 *   },
 *   networkProfile: {
 *     networkInterfaces: [{
 *       id: networkInterface.id
 *     }]
 *   },
 *   identity: {
 *     type: "SystemAssigned"
 *   }
 * });
 *
 * @example
 * // Windows VM with password authentication:
 * const windowsVm = new VirtualMachine(this, "windows-vm", {
 *   name: "my-windows-vm",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   hardwareProfile: {
 *     vmSize: "Standard_D2s_v3"
 *   },
 *   storageProfile: {
 *     imageReference: {
 *       publisher: "MicrosoftWindowsServer",
 *       offer: "WindowsServer",
 *       sku: "2022-datacenter-azure-edition",
 *       version: "latest"
 *     },
 *     osDisk: {
 *       createOption: "FromImage",
 *       managedDisk: {
 *         storageAccountType: "Premium_LRS"
 *       }
 *     }
 *   },
 *   osProfile: {
 *     computerName: "mywinvm",
 *     adminUsername: "azureuser",
 *     adminPassword: "P@ssw0rd1234!",
 *     windowsConfiguration: {
 *       provisionVMAgent: true,
 *       enableAutomaticUpdates: true
 *     }
 *   },
 *   networkProfile: {
 *     networkInterfaces: [{
 *       id: networkInterface.id
 *     }]
 *   },
 *   licenseType: "Windows_Server"
 * });
 *
 * @stability stable
 */
export class VirtualMachine extends AzapiResource {
  /**
   * Static initialization flag to ensure schemas are registered only once
   */
  private static schemasRegistered = false;

  /**
   * Ensures that Virtual Machine schemas are registered with the ApiVersionManager
   * This is called once during the first VirtualMachine instantiation
   */
  private static ensureSchemasRegistered(): void {
    if (VirtualMachine.schemasRegistered) {
      return;
    }

    const apiVersionManager = ApiVersionManager.instance();

    try {
      // Register all Virtual Machine versions
      apiVersionManager.registerResourceType(
        VIRTUAL_MACHINE_TYPE,
        ALL_VIRTUAL_MACHINE_VERSIONS,
      );

      VirtualMachine.schemasRegistered = true;

      console.log(
        `Registered ${ALL_VIRTUAL_MACHINE_VERSIONS.length} API versions for ${VIRTUAL_MACHINE_TYPE}`,
      );
    } catch (error) {
      console.warn(
        `Failed to register Virtual Machine schemas: ${error}. ` +
          `This may indicate the schemas are already registered or there's a configuration issue.`,
      );
      // Don't throw here as the schemas might already be registered
      VirtualMachine.schemasRegistered = true;
    }
  }

  /**
   * The input properties for this Virtual Machine instance
   */
  public readonly props: VirtualMachineProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly vmIdOutput: cdktf.TerraformOutput;

  // Public properties that match common VM interface patterns
  public readonly id: string;
  public readonly tags: { [key: string]: string };

  /**
   * Creates a new Azure Virtual Machine using the VersionedAzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Virtual Machine
   */
  constructor(scope: Construct, id: string, props: VirtualMachineProps) {
    // Ensure schemas are registered before calling super
    VirtualMachine.ensureSchemasRegistered();

    // Call the parent constructor with the props
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    this.id = `\${${this.terraformResource.fqn}.id}`;
    this.tags = props.tags || {};

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Virtual Machine",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Virtual Machine",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Virtual Machine",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Virtual Machine",
    });

    this.vmIdOutput = new cdktf.TerraformOutput(this, "vmId", {
      value: `\${${this.terraformResource.fqn}.output.properties.vmId}`,
      description: "The unique identifier of the Virtual Machine",
    });

    // Override logical IDs to match naming convention
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.vmIdOutput.overrideLogicalId("vmId");

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
   * Gets the Azure resource type for Virtual Machines
   */
  protected resourceType(): string {
    return VIRTUAL_MACHINE_TYPE;
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
    const typedProps = props as VirtualMachineProps;
    return {
      location: typedProps.location || "eastus",
      tags: typedProps.tags || {},
      identity: typedProps.identity,
      zones: typedProps.zones,
      plan: typedProps.plan,
      properties: {
        hardwareProfile: typedProps.hardwareProfile,
        storageProfile: typedProps.storageProfile,
        osProfile: typedProps.osProfile,
        networkProfile: typedProps.networkProfile,
        diagnosticsProfile: typedProps.diagnosticsProfile,
        availabilitySet: typedProps.availabilitySet,
        virtualMachineScaleSet: typedProps.virtualMachineScaleSet,
        proximityPlacementGroup: typedProps.proximityPlacementGroup,
        priority: typedProps.priority,
        evictionPolicy: typedProps.evictionPolicy,
        billingProfile: typedProps.billingProfile,
        host: typedProps.host,
        licenseType: typedProps.licenseType,
        additionalCapabilities: typedProps.additionalCapabilities,
        securityProfile: typedProps.securityProfile,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR VIRTUAL MACHINE OPERATIONS
  // =============================================================================

  /**
   * Get the VM ID (unique identifier assigned by Azure)
   */
  public get vmId(): string {
    return `\${${this.terraformResource.fqn}.output.properties.vmId}`;
  }

  /**
   * Get the provisioning state of the Virtual Machine
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Get the OS profile computer name
   */
  public get computerName(): string | undefined {
    return this.props.osProfile?.computerName;
  }

  /**
   * Get the VM size
   */
  public get vmSize(): string {
    return this.props.hardwareProfile.vmSize;
  }

  /**
   * Add a tag to the Virtual Machine
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Virtual Machine
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
      // Common properties that are safe to ignore for Virtual Machines
      // adminPassword should often be ignored to prevent drift
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
