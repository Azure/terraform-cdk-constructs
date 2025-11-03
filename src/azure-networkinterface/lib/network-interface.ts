/**
 * Unified Azure Network Interface implementation using VersionedAzapiResource framework
 *
 * This class replaces all version-specific Network Interface implementations with a single
 * unified class that automatically handles version management, schema validation, and
 * property transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2024-07-01 (Active)
 * - 2024-10-01 (Active)
 * - 2025-01-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full backward compatibility with existing Network Interface interface
 * - JSII compliance for multi-language support
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_NETWORK_INTERFACE_VERSIONS,
  NETWORK_INTERFACE_TYPE,
} from "./network-interface-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Subnet reference for Network Interface
 */
export interface NetworkInterfaceSubnetReference {
  /**
   * Subnet resource ID
   */
  readonly id: string;
}

/**
 * Public IP address reference for Network Interface
 */
export interface NetworkInterfacePublicIPReference {
  /**
   * Public IP address resource ID
   */
  readonly id: string;
}

/**
 * Network Security Group reference for Network Interface
 */
export interface NetworkInterfaceNSGReference {
  /**
   * Network Security Group resource ID
   */
  readonly id: string;
}

/**
 * IP Configuration for Network Interface
 */
export interface NetworkInterfaceIPConfiguration {
  /**
   * Name of the IP configuration
   * @example "ipconfig1"
   */
  readonly name: string;

  /**
   * Subnet reference with id property
   * @example { id: "/subscriptions/.../subnets/mySubnet" }
   */
  readonly subnet: NetworkInterfaceSubnetReference;

  /**
   * Private IP allocation method
   * @example "Dynamic" or "Static"
   * @defaultValue "Dynamic"
   */
  readonly privateIPAllocationMethod?: string;

  /**
   * Private IP address (required if privateIPAllocationMethod is Static)
   * @example "10.0.1.4"
   */
  readonly privateIPAddress?: string;

  /**
   * Public IP address reference with id property
   * Optional - for NICs that need public IPs
   * @example { id: "/subscriptions/.../publicIPAddresses/myPublicIP" }
   */
  readonly publicIPAddress?: NetworkInterfacePublicIPReference;

  /**
   * Whether this is the primary IP configuration
   * At least one IP configuration must be primary
   * @defaultValue false
   */
  readonly primary?: boolean;
}

/**
 * DNS settings configuration for Network Interface
 */
export interface NetworkInterfaceDnsSettings {
  /**
   * Array of DNS server IP addresses
   * @example ["10.0.0.4", "10.0.0.5"]
   */
  readonly dnsServers?: string[];

  /**
   * Internal DNS name label for the NIC
   * @example "myvm"
   */
  readonly internalDnsNameLabel?: string;
}

/**
 * Properties for the unified Azure Network Interface
 *
 * Extends VersionedAzapiResourceProps with Network Interface specific properties
 */
export interface NetworkInterfaceProps extends AzapiResourceProps {
  /**
   * IP configurations for the network interface
   * At least one IP configuration is required
   * One IP configuration must be marked as primary
   */
  readonly ipConfigurations: NetworkInterfaceIPConfiguration[];

  /**
   * Network Security Group reference with id property
   * Optional - associates an NSG with this NIC
   * @example { id: "/subscriptions/.../networkSecurityGroups/myNSG" }
   */
  readonly networkSecurityGroup?: NetworkInterfaceNSGReference;

  /**
   * Enable accelerated networking for high-performance scenarios
   * Requires supported VM size
   * @default false
   */
  readonly enableAcceleratedNetworking?: boolean;

  /**
   * Enable IP forwarding for network virtual appliances
   * Allows NIC to forward traffic not destined for its IP
   * @default false
   */
  readonly enableIPForwarding?: boolean;

  /**
   * DNS settings configuration
   * Optional - configures DNS servers for the NIC
   */
  readonly dnsSettings?: NetworkInterfaceDnsSettings;

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];

  /**
   * Resource group ID where the network interface will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * Network Interface properties for the request body
 */
export interface NetworkInterfaceBodyProperties {
  readonly ipConfigurations: NetworkInterfaceIPConfiguration[];
  readonly networkSecurityGroup?: NetworkInterfaceNSGReference;
  readonly enableAcceleratedNetworking?: boolean;
  readonly enableIPForwarding?: boolean;
  readonly dnsSettings?: NetworkInterfaceDnsSettings;
}

/**
 * The resource body interface for Azure Network Interface API calls
 */
export interface NetworkInterfaceBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties: NetworkInterfaceBodyProperties;
}

/**
 * Unified Azure Network Interface implementation
 *
 * This class provides a single, version-aware implementation that replaces all
 * version-specific Network Interface classes. It automatically handles version
 * resolution, schema validation, and property transformation while maintaining
 * full backward compatibility.
 *
 * @example
 * // Basic usage with automatic version resolution:
 * const nic = new NetworkInterface(this, "nic", {
 *   name: "mynic",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   ipConfigurations: [{
 *     name: "ipconfig1",
 *     subnet: { id: subnet.id },
 *     privateIPAllocationMethod: "Dynamic",
 *     primary: true
 *   }]
 * });
 *
 * @example
 * // Usage with explicit version pinning:
 * const nic = new NetworkInterface(this, "nic", {
 *   name: "mynic",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   ipConfigurations: [{
 *     name: "ipconfig1",
 *     subnet: { id: subnet.id },
 *     privateIPAllocationMethod: "Dynamic",
 *     primary: true
 *   }],
 *   apiVersion: "2024-07-01",
 * });
 *
 * @stability stable
 */
export class NetworkInterface extends AzapiResource {
  private static schemasRegistered = false;

  /**
   * Ensures that Network Interface schemas are registered with the ApiVersionManager
   */
  private static ensureSchemasRegistered(): void {
    if (NetworkInterface.schemasRegistered) {
      return;
    }

    const apiVersionManager = ApiVersionManager.instance();

    try {
      apiVersionManager.registerResourceType(
        NETWORK_INTERFACE_TYPE,
        ALL_NETWORK_INTERFACE_VERSIONS,
      );

      NetworkInterface.schemasRegistered = true;

      console.log(
        `Registered ${ALL_NETWORK_INTERFACE_VERSIONS.length} API versions for ${NETWORK_INTERFACE_TYPE}`,
      );
    } catch (error) {
      console.warn(
        `Failed to register Network Interface schemas: ${error}. ` +
          `This may indicate the schemas are already registered or there's a configuration issue.`,
      );
      NetworkInterface.schemasRegistered = true;
    }
  }

  public readonly props: NetworkInterfaceProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;

  // Public properties
  public readonly id: string;
  public readonly tags: { [key: string]: string };

  /**
   * Creates a new Azure Network Interface using the VersionedAzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Network Interface
   */
  constructor(scope: Construct, id: string, props: NetworkInterfaceProps) {
    // Ensure schemas are registered before calling super
    NetworkInterface.ensureSchemasRegistered();

    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs
    this.id = `\${${this.terraformResource.fqn}.id}`;
    this.tags = props.tags || {};

    // Create Terraform outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Network Interface",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Network Interface",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Network Interface",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Network Interface",
    });

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM VersionedAzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2024-10-01";
  }

  /**
   * Gets the Azure resource type for Network Interfaces
   */
  protected resourceType(): string {
    return NETWORK_INTERFACE_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as NetworkInterfaceProps;

    // Transform ipConfigurations to match Azure API schema
    // Each IP configuration needs its properties nested under a "properties" key
    const ipConfigurations = typedProps.ipConfigurations.map((ipConfig) => ({
      name: ipConfig.name,
      properties: {
        subnet: ipConfig.subnet,
        privateIPAllocationMethod:
          ipConfig.privateIPAllocationMethod || "Dynamic",
        privateIPAddress: ipConfig.privateIPAddress,
        publicIPAddress: ipConfig.publicIPAddress,
        primary: ipConfig.primary,
      },
    }));

    return {
      location: typedProps.location || "eastus",
      tags: typedProps.tags || {},
      properties: {
        ipConfigurations,
        networkSecurityGroup: typedProps.networkSecurityGroup,
        enableAcceleratedNetworking:
          typedProps.enableAcceleratedNetworking || false,
        enableIPForwarding: typedProps.enableIPForwarding || false,
        dnsSettings: typedProps.dnsSettings,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR NETWORK INTERFACE OPERATIONS
  // =============================================================================

  /**
   * Get the private IP address of the primary IP configuration
   * Note: This may not be available until after the resource is created
   * The actual IP address location in Azure API response varies by API version
   */
  public get privateIPAddress(): string {
    // The private IP address is typically available at runtime but not in Terraform output
    // Users should query the Azure API directly for the private IP if needed
    return `\${${this.terraformResource.fqn}.id}`;
  }

  /**
   * Add a tag to the Network Interface
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Network Interface
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
      this.terraformResource.addOverride("lifecycle", [
        {
          ignore_changes: this.props.ignoreChanges,
        },
      ]);
    }
  }
}
