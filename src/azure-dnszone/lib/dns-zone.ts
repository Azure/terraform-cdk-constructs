/**
 * Unified Azure DNS Zone implementation using VersionedAzapiResource framework
 *
 * This class provides a single, version-aware implementation that automatically handles
 * version management, schema validation, and property transformation across all
 * supported API versions.
 *
 * Supported API Versions:
 * - 2018-05-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full backward compatibility with existing interface
 * - JSII compliance for multi-language support
 * - Support for both Public and Private DNS zones
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { ALL_DNS_ZONE_VERSIONS, DNS_ZONE_TYPE } from "./dns-zone-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Virtual network reference for private DNS zones
 */
export interface VirtualNetworkReference {
  /**
   * The resource ID of the virtual network
   */
  readonly id: string;
}

/**
 * Properties for the unified Azure DNS Zone
 *
 * Extends AzapiResourceProps with DNS Zone specific properties
 */
export interface DnsZoneProps extends AzapiResourceProps {
  /**
   * The type of this DNS zone (Public or Private)
   * @default "Public"
   */
  readonly zoneType?: "Public" | "Private";

  /**
   * A list of references to virtual networks that register hostnames in this DNS zone
   * Only valid when zoneType is Private
   */
  readonly registrationVirtualNetworks?: VirtualNetworkReference[];

  /**
   * A list of references to virtual networks that resolve records in this DNS zone
   * Only valid when zoneType is Private
   */
  readonly resolutionVirtualNetworks?: VirtualNetworkReference[];

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];

  /**
   * Resource group ID where the DNS Zone will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * The resource body interface for Azure DNS Zone API calls
 * This matches the Azure REST API schema
 */
export interface DnsZoneBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties?: { [key: string]: any };
}

/**
 * Unified Azure DNS Zone implementation
 *
 * This class provides a single, version-aware implementation that replaces all
 * version-specific DNS Zone classes. It automatically handles version
 * resolution, schema validation, and property transformation while maintaining
 * full backward compatibility.
 *
 * Azure DNS Zones are global resources used to host DNS records for a domain.
 * They can be either Public (Internet-accessible) or Private (accessible only
 * from specified virtual networks).
 *
 * @example
 * // Basic public DNS zone with automatic version resolution:
 * const dnsZone = new DnsZone(this, "dns", {
 *   name: "contoso.com",
 *   location: "global",
 *   resourceGroupId: resourceGroup.id,
 * });
 *
 * @example
 * // Private DNS zone with virtual network links:
 * const privateDnsZone = new DnsZone(this, "privateDns", {
 *   name: "internal.contoso.com",
 *   location: "global",
 *   resourceGroupId: resourceGroup.id,
 *   zoneType: "Private",
 *   registrationVirtualNetworks: [{ id: vnet.id }],
 *   tags: { environment: "production" }
 * });
 *
 * @example
 * // DNS zone with explicit version pinning:
 * const dnsZone = new DnsZone(this, "dns", {
 *   name: "contoso.com",
 *   location: "global",
 *   resourceGroupId: resourceGroup.id,
 *   apiVersion: "2018-05-01",
 * });
 *
 * @stability stable
 */
export class DnsZone extends AzapiResource {
  static {
    AzapiResource.registerSchemas(DNS_ZONE_TYPE, ALL_DNS_ZONE_VERSIONS);
  }

  public readonly props: DnsZoneProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly nameServersOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure DNS Zone using the VersionedAzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the DNS Zone
   */
  constructor(scope: Construct, id: string, props: DnsZoneProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs

    // Create Terraform outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the DNS Zone",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the DNS Zone",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the DNS Zone",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the DNS Zone",
    });

    this.nameServersOutput = new cdktf.TerraformOutput(this, "name_servers", {
      value: `\${${this.terraformResource.fqn}.output.properties.nameServers}`,
      description: "The name servers for the DNS Zone",
    });

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.nameServersOutput.overrideLogicalId("name_servers");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2018-05-01";
  }

  /**
   * Gets the Azure resource type for DNS Zones
   */
  protected resourceType(): string {
    return DNS_ZONE_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Provides default location for DNS Zones (global resource)
   */
  protected defaultLocation(): string {
    return "global";
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as DnsZoneProps;

    const body: any = {
      location: this.location!,
      // Tags are passed separately to createAzapiResource() for proper idempotency
      // Do not include tags in the body
    };

    // Add properties object if zone type or virtual networks are specified
    if (
      typedProps.zoneType ||
      typedProps.registrationVirtualNetworks ||
      typedProps.resolutionVirtualNetworks
    ) {
      body.properties = {
        zoneType: typedProps.zoneType || "Public",
        registrationVirtualNetworks: typedProps.registrationVirtualNetworks,
        resolutionVirtualNetworks: typedProps.resolutionVirtualNetworks,
      };
    }

    return body;
  }

  // =============================================================================
  // PUBLIC METHODS FOR DNS ZONE OPERATIONS
  // =============================================================================

  /**
   * Get the name servers for the DNS Zone
   * These are the Azure DNS name servers that should be configured at your domain registrar
   */
  public get nameServers(): string {
    return `\${${this.terraformResource.fqn}.output.properties.nameServers}`;
  }

  /**
   * Get the maximum number of record sets that can be created in this DNS zone
   */
  public get maxNumberOfRecordSets(): string {
    return `\${${this.terraformResource.fqn}.output.properties.maxNumberOfRecordSets}`;
  }

  /**
   * Get the current number of record sets in this DNS zone
   */
  public get numberOfRecordSets(): string {
    return `\${${this.terraformResource.fqn}.output.properties.numberOfRecordSets}`;
  }

  /**
   * Get the zone type (Public or Private)
   */
  public get zoneType(): string {
    return this.props.zoneType || "Public";
  }

  /**
   * Add a tag to the DNS Zone
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the DNS Zone
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
