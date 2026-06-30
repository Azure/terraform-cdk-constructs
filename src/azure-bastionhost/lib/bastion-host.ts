/**
 * Azure Bastion Host implementation using AzapiResource framework
 *
 * This class provides a unified implementation for Azure Bastion Hosts that
 * automatically handles version management, schema validation, and property
 * transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2024-07-01 (Active)
 * - 2024-10-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full backward compatibility
 * - JSII compliance for multi-language support
 */

import * as cdktn from "cdktn";
import { Construct } from "constructs";
import {
  ALL_BASTION_HOST_VERSIONS,
  BASTION_HOST_TYPE,
} from "./bastion-host-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * SKU configuration for Bastion Host
 */
export interface BastionHostSku {
  /**
   * Name of the SKU
   * @example "Developer", "Basic", "Standard", "Premium"
   */
  readonly name: string;
}

/**
 * IP configuration for a Bastion Host
 *
 * Required for Basic, Standard, and Premium SKUs. The subnet must be named
 * "AzureBastionSubnet" and the public IP must use the Standard SKU with a
 * Static allocation method.
 */
export interface BastionHostIpConfiguration {
  /**
   * Name of the IP configuration
   * @defaultValue "IpConf"
   */
  readonly name?: string;

  /**
   * Resource ID of the AzureBastionSubnet
   */
  readonly subnetId: string;

  /**
   * Resource ID of the Standard Static public IP address
   */
  readonly publicIpAddressId: string;

  /**
   * Private IP allocation method
   * @defaultValue "Dynamic"
   */
  readonly privateIpAllocationMethod?: string;
}

/**
 * Properties for the Azure Bastion Host
 *
 * Extends AzapiResourceProps with Bastion Host specific properties
 */
export interface BastionHostProps extends AzapiResourceProps {
  /**
   * SKU of the Bastion host
   * - Developer: lightweight, free, references a virtual network directly
   * - Basic: baseline connectivity via the Azure portal
   * - Standard: adds native client, IP connect, scaling, and shareable links
   * - Premium: adds session recording
   * @defaultValue Standard
   */
  readonly sku?: BastionHostSku;

  /**
   * IP configuration referencing the AzureBastionSubnet and a Standard public IP
   * Required for Basic, Standard, and Premium SKUs
   */
  readonly ipConfiguration?: BastionHostIpConfiguration;

  /**
   * Resource ID of the virtual network to attach to (Developer SKU only)
   * Mutually exclusive with ipConfiguration
   */
  readonly virtualNetworkId?: string;

  /**
   * Number of scale units
   * Valid range: 2-50 (Standard/Premium SKU only)
   */
  readonly scaleUnits?: number;

  /**
   * FQDN for the Bastion host
   */
  readonly dnsName?: string;

  /**
   * Enable native client support / tunneling (Standard/Premium SKU)
   */
  readonly enableTunneling?: boolean;

  /**
   * Enable IP-based connection (Standard/Premium SKU)
   */
  readonly enableIpConnect?: boolean;

  /**
   * Enable shareable link (Standard/Premium SKU)
   */
  readonly enableShareableLink?: boolean;

  /**
   * Enable Kerberos authentication
   */
  readonly enableKerberos?: boolean;

  /**
   * Enable session recording (Premium SKU)
   */
  readonly enableSessionRecording?: boolean;

  /**
   * Disable copy/paste in the web-based session (Standard/Premium SKU)
   */
  readonly disableCopyPaste?: boolean;

  /**
   * Availability zones for the Bastion host
   * @example ["1"], ["1", "2", "3"]
   */
  readonly zones?: string[];

  /**
   * Resource group ID where the Bastion host will be created
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
 * Azure Bastion Host implementation
 *
 * This class provides a single, version-aware implementation for Azure Bastion
 * Hosts. It automatically handles version resolution, schema validation, and
 * property transformation while maintaining full backward compatibility.
 *
 * @example
 * // Standard Bastion host with an IP configuration:
 * const bastion = new BastionHost(this, "bastion", {
 *   name: "my-bastion",
 *   location: "eastus",
 *   sku: { name: "Standard" },
 *   ipConfiguration: {
 *     subnetId: bastionSubnet.id,
 *     publicIpAddressId: bastionPublicIp.id,
 *   },
 *   enableTunneling: true,
 *   scaleUnits: 2,
 * });
 *
 * @example
 * // Developer SKU attached directly to a virtual network:
 * const bastion = new BastionHost(this, "bastion", {
 *   name: "my-bastion",
 *   location: "eastus",
 *   sku: { name: "Developer" },
 *   virtualNetworkId: vnet.id,
 * });
 *
 * @stability stable
 */
export class BastionHost extends AzapiResource {
  static {
    AzapiResource.registerSchemas(BASTION_HOST_TYPE, ALL_BASTION_HOST_VERSIONS);
  }

  /**
   * The input properties for this Bastion Host instance
   */
  public readonly props: BastionHostProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktn.TerraformOutput;
  public readonly nameOutput: cdktn.TerraformOutput;
  public readonly locationOutput: cdktn.TerraformOutput;
  public readonly tagsOutput: cdktn.TerraformOutput;

  /**
   * Creates a new Azure Bastion Host using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema
   * registration, validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Bastion Host
   */
  constructor(scope: Construct, id: string, props: BastionHostProps) {
    super(scope, id, props);

    this.props = props;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktn.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Bastion Host",
    });

    this.nameOutput = new cdktn.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Bastion Host",
    });

    this.locationOutput = new cdktn.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Bastion Host",
    });

    this.tagsOutput = new cdktn.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Bastion Host",
    });

    // Override logical IDs to match naming convention
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
   * Gets the Azure resource type for Bastion Hosts
   */
  protected resourceType(): string {
    return BASTION_HOST_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   * Uses the framework's schema resolution to get the appropriate schema
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Bastion Hosts
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   * Transforms the input properties into the JSON format expected by Azure REST API
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as BastionHostProps;

    const properties: { [key: string]: any } = {
      scaleUnits: typedProps.scaleUnits,
      dnsName: typedProps.dnsName,
      enableTunneling: typedProps.enableTunneling,
      enableIpConnect: typedProps.enableIpConnect,
      enableShareableLink: typedProps.enableShareableLink,
      enableKerberos: typedProps.enableKerberos,
      enableSessionRecording: typedProps.enableSessionRecording,
      disableCopyPaste: typedProps.disableCopyPaste,
    };

    if (typedProps.ipConfiguration) {
      properties.ipConfigurations = [
        {
          name: typedProps.ipConfiguration.name || "IpConf",
          properties: {
            subnet: { id: typedProps.ipConfiguration.subnetId },
            publicIPAddress: {
              id: typedProps.ipConfiguration.publicIpAddressId,
            },
            privateIPAllocationMethod:
              typedProps.ipConfiguration.privateIpAllocationMethod || "Dynamic",
          },
        },
      ];
    }

    if (typedProps.virtualNetworkId) {
      properties.virtualNetwork = { id: typedProps.virtualNetworkId };
    }

    return {
      location: this.location,
      tags: this.allTags(),
      sku: typedProps.sku,
      zones: typedProps.zones,
      properties,
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR BASTION HOST OPERATIONS
  // =============================================================================

  /**
   * Get the subscription ID from the Bastion Host ID
   * Extracts the subscription ID from the Azure resource ID format
   */
  public get subscriptionId(): string {
    const idParts = this.id.split("/");
    const subscriptionIndex = idParts.indexOf("subscriptions");
    if (subscriptionIndex !== -1 && subscriptionIndex + 1 < idParts.length) {
      return idParts[subscriptionIndex + 1];
    }
    throw new Error("Unable to extract subscription ID from Bastion Host ID");
  }

  /**
   * Get the full resource identifier for use in other Azure resources
   * Alias for the id property
   */
  public get resourceId(): string {
    return this.id;
  }

  /**
   * Get the DNS name output value
   * Returns the Terraform interpolation string for the Bastion host FQDN
   */
  public get dnsName(): string {
    return `\${${this.terraformResource.fqn}.output.properties.dnsName}`;
  }

  /**
   * Add a tag to the Bastion Host
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Bastion Host
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
