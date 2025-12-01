/**
 * Azure Private DNS Zone Virtual Network Link implementation using AzapiResource framework
 *
 * This class provides a unified implementation for linking virtual networks to private DNS zones.
 * Virtual Network Links enable DNS resolution from VNets and optionally support auto-registration
 * of VM records.
 *
 * Supported API Versions:
 * - 2024-06-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full backward compatibility
 * - JSII compliance for multi-language support
 * - Auto-registration support for VM DNS records
 * - Resolution policy configuration
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_PRIVATE_DNS_ZONE_LINK_VERSIONS,
  PRIVATE_DNS_ZONE_LINK_TYPE,
} from "./private-dns-zone-link-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the Azure Private DNS Zone Virtual Network Link
 *
 * Extends AzapiResourceProps with Virtual Network Link specific properties
 */
export interface PrivateDnsZoneLinkProps extends AzapiResourceProps {
  /**
   * Resource ID of the parent Private DNS Zone
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/privateDnsZones/internal.contoso.com"
   */
  readonly privateDnsZoneId: string;

  /**
   * Resource ID of the Virtual Network to link
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet1"
   */
  readonly virtualNetworkId: string;

  /**
   * Whether auto-registration of virtual machine records is enabled
   * When enabled, VMs in the VNet will automatically register DNS records
   * @defaultValue false
   */
  readonly registrationEnabled?: boolean;

  /**
   * The resolution policy for the virtual network link
   * Only applicable to Private Link zones (zones containing "privatelink." in the name)
   * - "Default": Standard DNS resolution
   * - "NxDomainRedirect": Fallback to Azure DNS for unresolved queries
   * Note: This property will be silently ignored if the zone is not a Private Link zone
   */
  readonly resolutionPolicy?: string;

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Virtual Network reference for the Private DNS Zone link
 */
export interface PrivateDnsZoneLinkVirtualNetworkReference {
  readonly id: string;
}

/**
 * Properties for Virtual Network Link body
 */
export interface PrivateDnsZoneLinkProperties {
  readonly virtualNetwork: PrivateDnsZoneLinkVirtualNetworkReference;
  readonly registrationEnabled?: boolean;
  readonly resolutionPolicy?: string;
}

/**
 * The resource body interface for Azure Virtual Network Link API calls
 */
export interface PrivateDnsZoneLinkBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties: PrivateDnsZoneLinkProperties;
}

/**
 * Azure Private DNS Zone Virtual Network Link implementation
 *
 * Virtual Network Links connect private DNS zones to virtual networks, enabling DNS
 * resolution from those VNets. They support auto-registration of VM DNS records and
 * configurable resolution policies.
 *
 * @example
 * // Basic virtual network link:
 * const link = new PrivateDnsZoneLink(this, "vnet-link", {
 *   name: "my-vnet-link",
 *   privateDnsZoneId: privateDnsZone.id,
 *   virtualNetworkId: vnet.id,
 *   location: "global"
 * });
 *
 * @example
 * // Virtual network link with auto-registration:
 * const link = new PrivateDnsZoneLink(this, "vnet-link", {
 *   name: "my-vnet-link",
 *   privateDnsZoneId: privateDnsZone.id,
 *   virtualNetworkId: vnet.id,
 *   registrationEnabled: true,
 *   location: "global"
 * });
 *
 * @example
 * // Virtual network link with resolution policy:
 * const link = new PrivateDnsZoneLink(this, "vnet-link", {
 *   name: "my-vnet-link",
 *   privateDnsZoneId: privateDnsZone.id,
 *   virtualNetworkId: vnet.id,
 *   resolutionPolicy: "NxDomainRedirect",
 *   location: "global",
 *   apiVersion: "2024-06-01"
 * });
 *
 * @stability stable
 */
export class PrivateDnsZoneLink extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      PRIVATE_DNS_ZONE_LINK_TYPE,
      ALL_PRIVATE_DNS_ZONE_LINK_VERSIONS,
    );
  }

  /**
   * The input properties for this Virtual Network Link instance
   */
  public readonly props: PrivateDnsZoneLinkProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;
  public readonly virtualNetworkLinkStateOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure Private DNS Zone Virtual Network Link using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Virtual Network Link
   */
  constructor(scope: Construct, id: string, props: PrivateDnsZoneLinkProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Virtual Network Link",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Virtual Network Link",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Virtual Network Link",
    });

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioning_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the Virtual Network Link",
      },
    );

    this.virtualNetworkLinkStateOutput = new cdktf.TerraformOutput(
      this,
      "virtual_network_link_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.virtualNetworkLinkState}`,
        description: "The state of the Virtual Network Link",
      },
    );

    // Override logical IDs to match naming convention
    // Override logical IDs to match naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.locationOutput.overrideLogicalId("location");
    this.provisioningStateOutput.overrideLogicalId("provisioning_state");
    this.virtualNetworkLinkStateOutput.overrideLogicalId(
      "virtual_network_link_state",
    );

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Gets the default location for this resource type
   * Private DNS Zone Links use "global" location
   */
  protected defaultLocation(): string {
    return "global";
  }

  /**
   * Resolves the parent resource ID for the Virtual Network Link
   * Virtual Network Links are child resources of Private DNS Zones
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as PrivateDnsZoneLinkProps;
    return typedProps.privateDnsZoneId;
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2024-06-01";
  }

  /**
   * Gets the Azure resource type for Virtual Network Links
   */
  protected resourceType(): string {
    return PRIVATE_DNS_ZONE_LINK_TYPE;
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
    const typedProps = props as PrivateDnsZoneLinkProps;

    // Determine if resolution policy should be included
    let includeResolutionPolicy = false;
    if (typedProps.resolutionPolicy) {
      // Extract zone name from the privateDnsZoneId to determine if it's a Private Link zone
      const zoneNameMatch = typedProps.privateDnsZoneId.match(
        /\/privateDnsZones\/([^/]+)$/,
      );
      const zoneName = zoneNameMatch ? zoneNameMatch[1] : "";
      includeResolutionPolicy = zoneName.includes("privatelink.");
    }

    // Build the body with all properties inline to avoid readonly issues
    const body: PrivateDnsZoneLinkBody = {
      location: this.location!,
      // Tags are passed separately to createAzapiResource() for proper idempotency
      // Do not include tags in the body
      properties: {
        virtualNetwork: {
          id: typedProps.virtualNetworkId,
        },
        registrationEnabled: typedProps.registrationEnabled ?? false,
        ...(includeResolutionPolicy && {
          resolutionPolicy: typedProps.resolutionPolicy,
        }),
      },
    };

    return body;
  }

  // =============================================================================
  // PUBLIC METHODS FOR VIRTUAL NETWORK LINK OPERATIONS
  // =============================================================================

  /**
   * Get the Virtual Network ID
   * Note: This returns the input value as Azure API doesn't return it in output
   */
  public get virtualNetworkId(): string {
    return this.props.virtualNetworkId;
  }

  /**
   * Get whether auto-registration is enabled
   * Returns a Terraform interpolation string for JSII compliance
   */
  public get registrationEnabled(): string {
    return `\${${this.terraformResource.fqn}.output.properties.registrationEnabled}`;
  }

  /**
   * Get the resolution policy
   * Returns a Terraform interpolation string for JSII compliance
   */
  public get resolutionPolicy(): string {
    return `\${${this.terraformResource.fqn}.output.properties.resolutionPolicy}`;
  }

  /**
   * Get the provisioning state of the Virtual Network Link
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Get the state of the Virtual Network Link
   */
  public get virtualNetworkLinkState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.virtualNetworkLinkState}`;
  }

  /**
   * Add a tag to the Virtual Network Link
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Virtual Network Link
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
