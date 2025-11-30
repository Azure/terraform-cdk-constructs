/**
 * Azure Virtual Network implementation using AzapiResource framework
 *
 * This class provides a unified implementation for Azure Virtual Networks that
 * automatically handles version management, schema validation, and property
 * transformation across all supported API versions.
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
 * - Full backward compatibility
 * - JSII compliance for multi-language support
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_VIRTUAL_NETWORK_VERSIONS,
  VIRTUAL_NETWORK_TYPE,
} from "./virtual-network-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Address space configuration for Virtual Network
 */
export interface VirtualNetworkAddressSpace {
  /**
   * Array of address prefixes in CIDR notation
   * @example ["10.0.0.0/16", "10.1.0.0/16"]
   */
  readonly addressPrefixes: string[];
}

/**
 * DHCP options configuration for Virtual Network
 */
export interface VirtualNetworkDhcpOptions {
  /**
   * Array of DNS server IP addresses
   * @example ["10.0.0.4", "10.0.0.5"]
   */
  readonly dnsServers?: string[];
}

/**
 * Properties for the Azure Virtual Network
 *
 * Extends AzapiResourceProps with Virtual Network specific properties
 */
export interface VirtualNetworkProps extends AzapiResourceProps {
  /**
   * Address space for the virtual network
   * Must contain at least one address prefix
   */
  readonly addressSpace: VirtualNetworkAddressSpace;

  /**
   * Subnets to create within the virtual network
   * Optional - subnets can also be created separately
   */
  readonly subnets?: any[];

  /**
   * DHCP options configuration
   * Optional - configures DNS servers for the VNet
   */
  readonly dhcpOptions?: VirtualNetworkDhcpOptions;

  /**
   * Enable DDoS protection for the virtual network
   * Requires a DDoS protection plan
   * @defaultValue false
   */
  readonly enableDdosProtection?: boolean;

  /**
   * Enable VM protection for the virtual network
   * @defaultValue false
   */
  readonly enableVmProtection?: boolean;

  /**
   * Encryption settings for the virtual network
   * Optional - configures encryption for the VNet
   */
  readonly encryption?: any;

  /**
   * Flow timeout in minutes for the virtual network
   * Valid range: 4-30 minutes
   */
  readonly flowTimeoutInMinutes?: number;

  /**
   * Resource group ID where the VNet will be created
   * Optional - will use the subscription scope if not provided
   */
  readonly resourceGroupId?: string;

  /**
   * The lifecycle rules to ignore changes
   * Useful for properties that are externally managed
   *
   * @example ["tags", "subnets"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Azure Virtual Network implementation
 *
 * This class provides a single, version-aware implementation that replaces
 * version-specific Virtual Network classes. It automatically handles version
 * resolution, schema validation, and property transformation while maintaining
 * full backward compatibility.
 *
 * @example
 * // Basic usage with automatic version resolution:
 * const vnet = new VirtualNetwork(this, "vnet", {
 *   name: "my-vnet",
 *   location: "eastus",
 *   addressSpace: {
 *     addressPrefixes: ["10.0.0.0/16"]
 *   }
 * });
 *
 * @example
 * // Usage with explicit version pinning:
 * const vnet = new VirtualNetwork(this, "vnet", {
 *   name: "my-vnet",
 *   location: "eastus",
 *   apiVersion: "2024-07-01",
 *   addressSpace: {
 *     addressPrefixes: ["10.0.0.0/16"]
 *   }
 * });
 *
 * @stability stable
 */
export class VirtualNetwork extends AzapiResource {
  // Static initializer runs once when the class is first loaded
  static {
    AzapiResource.registerSchemas(
      VIRTUAL_NETWORK_TYPE,
      ALL_VIRTUAL_NETWORK_VERSIONS,
    );
  }

  /**
   * The input properties for this Virtual Network instance
   */
  public readonly props: VirtualNetworkProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly addressSpaceOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;

  // Public properties that match the original VirtualNetwork interface

  /**
   * Creates a new Azure Virtual Network using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation. It maintains full backward compatibility
   * with existing Virtual Network implementations.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Virtual Network
   */
  constructor(scope: Construct, id: string, props: VirtualNetworkProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Virtual Network",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Virtual Network",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Virtual Network",
    });

    this.addressSpaceOutput = new cdktf.TerraformOutput(this, "addressSpace", {
      value: `\${${this.terraformResource.fqn}.output.properties.addressSpace}`,
      description: "Address space of the Virtual Network",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Virtual Network",
    });

    // Override logical IDs to match original naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.locationOutput.overrideLogicalId("location");
    this.addressSpaceOutput.overrideLogicalId("addressSpace");
    this.tagsOutput.overrideLogicalId("tags");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM VersionedAzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   * Returns the most recent stable version as the default
   */
  protected defaultVersion(): string {
    return "2024-10-01";
  }

  /**
   * Gets the Azure resource type for Virtual Networks
   */
  protected resourceType(): string {
    return VIRTUAL_NETWORK_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   * Uses the framework's schema resolution to get the appropriate schema
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Virtual Networks
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   * Transforms the input properties into the JSON format expected by Azure REST API
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as VirtualNetworkProps;
    return {
      location: this.location,
      tags: this.allTags(),
      properties: {
        addressSpace: typedProps.addressSpace,
        subnets: typedProps.subnets,
        dhcpOptions: typedProps.dhcpOptions,
        enableDdosProtection: typedProps.enableDdosProtection || false,
        enableVmProtection: typedProps.enableVmProtection || false,
        encryption: typedProps.encryption,
        flowTimeoutInMinutes: typedProps.flowTimeoutInMinutes,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR VIRTUAL NETWORK OPERATIONS
  // =============================================================================

  /**
   * Get the subscription ID from the Virtual Network ID
   * Extracts the subscription ID from the Azure resource ID format
   */
  public get subscriptionId(): string {
    const idParts = this.id.split("/");
    const subscriptionIndex = idParts.indexOf("subscriptions");
    if (subscriptionIndex !== -1 && subscriptionIndex + 1 < idParts.length) {
      return idParts[subscriptionIndex + 1];
    }
    throw new Error(
      "Unable to extract subscription ID from Virtual Network ID",
    );
  }

  /**
   * Get the full resource identifier for use in other Azure resources
   * Alias for the id property to match original interface
   */
  public get resourceId(): string {
    return this.id;
  }

  /**
   * Get the address space output value
   * Returns the Terraform interpolation string for the address space
   */
  public get addressSpace(): string {
    return `\${${this.terraformResource.fqn}.output.properties.addressSpace}`;
  }

  /**
   * Add a tag to the Virtual Network
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Virtual Network
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
      this.terraformResource.addOverride("lifecycle", {
        ignore_changes: this.props.ignoreChanges,
      });
    }
  }
}
