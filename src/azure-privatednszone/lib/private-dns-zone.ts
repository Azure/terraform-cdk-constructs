/**
 * Unified Azure Private DNS Zone implementation using VersionedAzapiResource framework
 *
 * This class provides a single, version-aware implementation that automatically handles
 * version management, schema validation, and property transformation across all
 * supported API versions.
 *
 * Supported API Versions:
 * - 2024-06-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full backward compatibility with existing interface
 * - JSII compliance for multi-language support
 * - Private DNS zones for internal name resolution
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_PRIVATE_DNS_ZONE_VERSIONS,
  PRIVATE_DNS_ZONE_TYPE,
} from "./private-dns-zone-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the unified Azure Private DNS Zone
 *
 * Extends AzapiResourceProps with Private DNS Zone specific properties
 */
export interface PrivateDnsZoneProps extends AzapiResourceProps {
  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];

  /**
   * Resource group ID where the Private DNS Zone will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * The resource body interface for Azure Private DNS Zone API calls
 * This matches the Azure REST API schema
 */
export interface PrivateDnsZoneBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties?: { [key: string]: any };
}

/**
 * Unified Azure Private DNS Zone implementation
 *
 * This class provides a single, version-aware implementation that replaces all
 * version-specific Private DNS Zone classes. It automatically handles version
 * resolution, schema validation, and property transformation while maintaining
 * full backward compatibility.
 *
 * Azure Private DNS Zones are used to provide internal DNS resolution within
 * Azure virtual networks. They enable name resolution for resources within a
 * virtual network without requiring custom DNS servers.
 *
 * @example
 * // Basic private DNS zone with automatic version resolution:
 * const privateDnsZone = new PrivateDnsZone(this, "privateDns", {
 *   name: "internal.contoso.com",
 *   location: "global",
 *   resourceGroupId: resourceGroup.id,
 * });
 *
 * @example
 * // Private DNS zone with tags:
 * const privateDnsZone = new PrivateDnsZone(this, "privateDns", {
 *   name: "internal.contoso.com",
 *   location: "global",
 *   resourceGroupId: resourceGroup.id,
 *   tags: {
 *     environment: "production",
 *     department: "engineering"
 *   }
 * });
 *
 * @example
 * // Private DNS zone with explicit version pinning:
 * const privateDnsZone = new PrivateDnsZone(this, "privateDns", {
 *   name: "internal.contoso.com",
 *   location: "global",
 *   resourceGroupId: resourceGroup.id,
 *   apiVersion: "2024-06-01",
 * });
 *
 * @stability stable
 */
export class PrivateDnsZone extends AzapiResource {
  // Static initializer runs once when the class is first loaded
  static {
    AzapiResource.registerSchemas(
      PRIVATE_DNS_ZONE_TYPE,
      ALL_PRIVATE_DNS_ZONE_VERSIONS,
    );
  }

  public readonly props: PrivateDnsZoneProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly maxNumberOfRecordSetsOutput: cdktf.TerraformOutput;
  public readonly numberOfRecordSetsOutput: cdktf.TerraformOutput;
  public readonly maxNumberOfVirtualNetworkLinksOutput: cdktf.TerraformOutput;
  public readonly maxNumberOfVirtualNetworkLinksWithRegistrationOutput: cdktf.TerraformOutput;
  public readonly numberOfVirtualNetworkLinksWithRegistrationOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;
  public readonly internalIdOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure Private DNS Zone using the VersionedAzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Private DNS Zone
   */
  constructor(scope: Construct, id: string, props: PrivateDnsZoneProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs

    // Create Terraform outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Private DNS Zone",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Private DNS Zone",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Private DNS Zone",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Private DNS Zone",
    });

    this.maxNumberOfRecordSetsOutput = new cdktf.TerraformOutput(
      this,
      "max_number_of_record_sets",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.maxNumberOfRecordSets}`,
        description:
          "The maximum number of record sets that can be created in this Private DNS zone",
      },
    );

    this.numberOfRecordSetsOutput = new cdktf.TerraformOutput(
      this,
      "number_of_record_sets",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.numberOfRecordSets}`,
        description:
          "The current number of record sets in this Private DNS zone",
      },
    );

    this.maxNumberOfVirtualNetworkLinksOutput = new cdktf.TerraformOutput(
      this,
      "max_number_of_virtual_network_links",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.maxNumberOfVirtualNetworkLinks}`,
        description:
          "The maximum number of virtual network links that can be created in this Private DNS zone",
      },
    );

    this.maxNumberOfVirtualNetworkLinksWithRegistrationOutput =
      new cdktf.TerraformOutput(
        this,
        "max_number_of_virtual_network_links_with_registration",
        {
          value: `\${${this.terraformResource.fqn}.output.properties.maxNumberOfVirtualNetworkLinksWithRegistration}`,
          description:
            "The maximum number of virtual network links with auto-registration that can be created in this Private DNS zone",
        },
      );

    this.numberOfVirtualNetworkLinksWithRegistrationOutput =
      new cdktf.TerraformOutput(
        this,
        "number_of_virtual_network_links_with_registration",
        {
          value: `\${${this.terraformResource.fqn}.output.properties.numberOfVirtualNetworkLinksWithRegistration}`,
          description:
            "The current number of virtual network links with auto-registration in this Private DNS zone",
        },
      );

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioning_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the Private DNS zone resource",
      },
    );

    this.internalIdOutput = new cdktf.TerraformOutput(this, "internal_id", {
      value: `\${${this.terraformResource.fqn}.output.properties.internalId}`,
      description: "Internal identifier for the Private DNS zone",
    });

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.maxNumberOfRecordSetsOutput.overrideLogicalId(
      "max_number_of_record_sets",
    );
    this.numberOfRecordSetsOutput.overrideLogicalId("number_of_record_sets");
    this.maxNumberOfVirtualNetworkLinksOutput.overrideLogicalId(
      "max_number_of_virtual_network_links",
    );
    this.maxNumberOfVirtualNetworkLinksWithRegistrationOutput.overrideLogicalId(
      "max_number_of_virtual_network_links_with_registration",
    );
    this.numberOfVirtualNetworkLinksWithRegistrationOutput.overrideLogicalId(
      "number_of_virtual_network_links_with_registration",
    );
    this.provisioningStateOutput.overrideLogicalId("provisioning_state");
    this.internalIdOutput.overrideLogicalId("internal_id");

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
    return "2024-06-01";
  }

  /**
   * Gets the Azure resource type for Private DNS Zones
   */
  protected resourceType(): string {
    return PRIVATE_DNS_ZONE_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Provides default location for Private DNS Zones (global resource)
   */
  protected defaultLocation(): string {
    return "global";
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(_props: any): any {
    const body: PrivateDnsZoneBody = {
      location: this.location!,
      // Tags are passed separately to createAzapiResource() for proper idempotency
      // Do not include tags in the body
    };

    // Private DNS zones don't have additional properties in the request body
    // Virtual network links are managed separately as child resources

    return body;
  }

  // =============================================================================
  // PUBLIC METHODS FOR PRIVATE DNS ZONE OPERATIONS
  // =============================================================================

  /**
   * Get the maximum number of record sets that can be created in this Private DNS zone
   */
  public get maxNumberOfRecordSets(): string {
    return `\${${this.terraformResource.fqn}.output.properties.maxNumberOfRecordSets}`;
  }

  /**
   * Get the current number of record sets in this Private DNS zone
   */
  public get numberOfRecordSets(): string {
    return `\${${this.terraformResource.fqn}.output.properties.numberOfRecordSets}`;
  }

  /**
   * Get the maximum number of virtual network links that can be created in this Private DNS zone
   */
  public get maxNumberOfVirtualNetworkLinks(): string {
    return `\${${this.terraformResource.fqn}.output.properties.maxNumberOfVirtualNetworkLinks}`;
  }

  /**
   * Get the maximum number of virtual network links with auto-registration
   * that can be created in this Private DNS zone
   */
  public get maxNumberOfVirtualNetworkLinksWithRegistration(): string {
    return `\${${this.terraformResource.fqn}.output.properties.maxNumberOfVirtualNetworkLinksWithRegistration}`;
  }

  /**
   * Get the current number of virtual network links with auto-registration
   * in this Private DNS zone
   */
  public get numberOfVirtualNetworkLinksWithRegistration(): string {
    return `\${${this.terraformResource.fqn}.output.properties.numberOfVirtualNetworkLinksWithRegistration}`;
  }

  /**
   * Get the provisioning state of the Private DNS zone
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Get the internal identifier for the Private DNS zone
   */
  public get internalId(): string {
    return `\${${this.terraformResource.fqn}.output.properties.internalId}`;
  }

  /**
   * Add a tag to the Private DNS Zone
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Private DNS Zone
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
