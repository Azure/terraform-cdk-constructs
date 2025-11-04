/**
 * Azure Public IP Address implementation using AzapiResource framework
 *
 * This class provides a unified implementation for Azure Public IP Addresses that
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
  ALL_PUBLIC_IP_ADDRESS_VERSIONS,
  PUBLIC_IP_ADDRESS_TYPE,
} from "./public-ip-address-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * SKU configuration for Public IP Address
 */
export interface PublicIPAddressSku {
  /**
   * Name of the SKU
   * @example "Basic", "Standard"
   */
  readonly name: string;

  /**
   * Tier of the SKU
   * @example "Regional", "Global"
   */
  readonly tier?: string;
}

/**
 * DNS settings configuration for Public IP Address
 */
export interface PublicIPAddressDnsSettings {
  /**
   * The domain name label
   * The concatenation of the domain name label and regionalized DNS zone
   * make up the fully qualified domain name (FQDN) associated with the public IP
   */
  readonly domainNameLabel?: string;

  /**
   * The Fully Qualified Domain Name
   * This is the concatenation of the domainNameLabel and the regionalized DNS zone
   */
  readonly fqdn?: string;

  /**
   * The reverse FQDN
   * A user-visible, fully qualified domain name that resolves to this public IP address
   */
  readonly reverseFqdn?: string;
}

/**
 * Properties for the Azure Public IP Address
 *
 * Extends AzapiResourceProps with Public IP Address specific properties
 */
export interface PublicIPAddressProps extends AzapiResourceProps {
  /**
   * SKU of the public IP address
   * Standard SKU supports zones and has SLA guarantees
   * Basic SKU does not support zones
   */
  readonly sku?: PublicIPAddressSku;

  /**
   * Public IP allocation method
   * - Static: IP address is allocated immediately and doesn't change
   * - Dynamic: IP address is allocated when associated with a resource
   * Note: Standard SKU requires Static allocation
   * @defaultValue "Dynamic"
   */
  readonly publicIPAllocationMethod?: string;

  /**
   * Public IP address version
   * @defaultValue "IPv4"
   */
  readonly publicIPAddressVersion?: string;

  /**
   * DNS settings for the public IP address
   * Optional - configures DNS label for the public IP
   */
  readonly dnsSettings?: PublicIPAddressDnsSettings;

  /**
   * Idle timeout in minutes
   * Valid range: 4-30 minutes
   * @defaultValue 4
   */
  readonly idleTimeoutInMinutes?: number;

  /**
   * Availability zones for the public IP address
   * Only supported with Standard SKU
   * @example ["1"], ["2"], ["3"], ["1", "2", "3"]
   */
  readonly zones?: string[];

  /**
   * Resource group ID where the Public IP will be created
   * Optional - will use the subscription scope if not provided
   */
  readonly resourceGroupId?: string;

  /**
   * The lifecycle rules to ignore changes
   * Useful for properties that are externally managed
   *
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Azure Public IP Address implementation
 *
 * This class provides a single, version-aware implementation that replaces
 * version-specific Public IP Address classes. It automatically handles version
 * resolution, schema validation, and property transformation while maintaining
 * full backward compatibility.
 *
 * @example
 * // Basic usage with automatic version resolution (Standard Static IP):
 * const publicIp = new PublicIPAddress(this, "publicIp", {
 *   name: "my-public-ip",
 *   location: "eastus",
 *   sku: {
 *     name: "Standard",
 *     tier: "Regional"
 *   },
 *   publicIPAllocationMethod: "Static"
 * });
 *
 * @example
 * // Basic Dynamic IP:
 * const publicIp = new PublicIPAddress(this, "publicIp", {
 *   name: "my-public-ip",
 *   location: "eastus",
 *   sku: {
 *     name: "Basic"
 *   },
 *   publicIPAllocationMethod: "Dynamic"
 * });
 *
 * @example
 * // Public IP with DNS label:
 * const publicIp = new PublicIPAddress(this, "publicIp", {
 *   name: "my-public-ip",
 *   location: "eastus",
 *   sku: {
 *     name: "Standard"
 *   },
 *   publicIPAllocationMethod: "Static",
 *   dnsSettings: {
 *     domainNameLabel: "myapp"
 *   }
 * });
 *
 * @example
 * // Zonal Public IP:
 * const publicIp = new PublicIPAddress(this, "publicIp", {
 *   name: "my-public-ip",
 *   location: "eastus",
 *   sku: {
 *     name: "Standard"
 *   },
 *   publicIPAllocationMethod: "Static",
 *   zones: ["1"]
 * });
 *
 * @stability stable
 */
export class PublicIPAddress extends AzapiResource {
  /**
   * Static initialization flag to ensure schemas are registered only once
   */
  private static schemasRegistered = false;

  /**
   * Ensures that Public IP Address schemas are registered with the ApiVersionManager
   * This is called once during the first PublicIPAddress instantiation
   */
  private static ensureSchemasRegistered(): void {
    if (PublicIPAddress.schemasRegistered) {
      return;
    }

    const apiVersionManager = ApiVersionManager.instance();

    try {
      // Register all Public IP Address versions
      apiVersionManager.registerResourceType(
        PUBLIC_IP_ADDRESS_TYPE,
        ALL_PUBLIC_IP_ADDRESS_VERSIONS,
      );

      PublicIPAddress.schemasRegistered = true;

      console.log(
        `Registered ${ALL_PUBLIC_IP_ADDRESS_VERSIONS.length} API versions for ${PUBLIC_IP_ADDRESS_TYPE}`,
      );
    } catch (error) {
      console.warn(
        `Failed to register Public IP Address schemas: ${error}. ` +
          `This may indicate the schemas are already registered or there's a configuration issue.`,
      );
      // Don't throw here as the schemas might already be registered
      PublicIPAddress.schemasRegistered = true;
    }
  }

  /**
   * The input properties for this Public IP Address instance
   */
  public readonly props: PublicIPAddressProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;

  // Public properties that match the original PublicIPAddress interface
  public readonly id: string;
  public readonly tags: { [key: string]: string };

  /**
   * Creates a new Azure Public IP Address using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation. It maintains full backward compatibility
   * with existing Public IP Address implementations.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Public IP Address
   */
  constructor(scope: Construct, id: string, props: PublicIPAddressProps) {
    // Ensure schemas are registered before calling super
    PublicIPAddress.ensureSchemasRegistered();

    // Call the parent constructor with the props
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    this.id = `\${${this.terraformResource.fqn}.id}`;
    this.tags = props.tags || {};

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Public IP Address",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Public IP Address",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Public IP Address",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Public IP Address",
    });

    // Override logical IDs to match original naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.locationOutput.overrideLogicalId("location");
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
   * Gets the Azure resource type for Public IP Addresses
   */
  protected resourceType(): string {
    return PUBLIC_IP_ADDRESS_TYPE;
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
    const typedProps = props as PublicIPAddressProps;
    return {
      location: typedProps.location || "eastus",
      tags: typedProps.tags || {},
      sku: typedProps.sku,
      zones: typedProps.zones,
      properties: {
        publicIPAllocationMethod:
          typedProps.publicIPAllocationMethod || "Dynamic",
        publicIPAddressVersion: typedProps.publicIPAddressVersion || "IPv4",
        dnsSettings: typedProps.dnsSettings,
        idleTimeoutInMinutes: typedProps.idleTimeoutInMinutes,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR PUBLIC IP ADDRESS OPERATIONS
  // =============================================================================

  /**
   * Get the subscription ID from the Public IP Address ID
   * Extracts the subscription ID from the Azure resource ID format
   */
  public get subscriptionId(): string {
    const idParts = this.id.split("/");
    const subscriptionIndex = idParts.indexOf("subscriptions");
    if (subscriptionIndex !== -1 && subscriptionIndex + 1 < idParts.length) {
      return idParts[subscriptionIndex + 1];
    }
    throw new Error(
      "Unable to extract subscription ID from Public IP Address ID",
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
   * Get the IP address output value
   * Returns the Terraform interpolation string for the IP address
   */
  public get ipAddress(): string {
    return `\${${this.terraformResource.fqn}.output.properties.ipAddress}`;
  }

  /**
   * Add a tag to the Public IP Address
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Public IP Address
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
