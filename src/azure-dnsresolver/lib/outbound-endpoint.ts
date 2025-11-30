/**
 * Azure DNS Resolver Outbound Endpoint implementation using AzapiResource framework
 *
 * This class provides a unified implementation for DNS Resolver Outbound Endpoints.
 * Outbound Endpoints allow Azure resources to forward DNS queries to external DNS servers
 * such as on-premises DNS servers or other external DNS resolvers.
 *
 * Supported API Versions:
 * - 2022-07-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full backward compatibility
 * - JSII compliance for multi-language support
 * - Dedicated subnet requirement with delegation
 * - Used with forwarding rules for conditional DNS forwarding
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_DNS_RESOLVER_OUTBOUND_ENDPOINT_VERSIONS,
  DNS_RESOLVER_OUTBOUND_ENDPOINT_TYPE,
} from "./outbound-endpoint-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the Azure DNS Resolver Outbound Endpoint
 *
 * Extends AzapiResourceProps with Outbound Endpoint specific properties
 */
export interface DnsResolverOutboundEndpointProps extends AzapiResourceProps {
  /**
   * Resource ID of the parent DNS Resolver
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/dnsResolvers/my-resolver"
   */
  readonly dnsResolverId: string;

  /**
   * Resource ID of the subnet where the Outbound Endpoint will be deployed
   * Must be a dedicated subnet between /28 and /24 with delegation to Microsoft.Network/dnsResolvers
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet/subnets/outbound-subnet"
   */
  readonly subnetId: string;

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * The resource body interface for Azure Outbound Endpoint API calls
 * This matches the Azure REST API schema
 */
export interface DnsResolverOutboundEndpointBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties?: any;
}

/**
 * Azure DNS Resolver Outbound Endpoint implementation
 *
 * Outbound Endpoints enable Azure resources to forward DNS queries to external DNS servers
 * (such as on-premises DNS servers). This enables hybrid DNS scenarios where Azure resources
 * need to resolve names from external DNS zones.
 *
 * Requirements:
 * - Dedicated subnet between /28 and /24
 * - Subnet must be delegated to Microsoft.Network/dnsResolvers
 * - Must be in the same VNet as the parent DNS Resolver
 * - Each DNS Resolver can have multiple outbound endpoints
 * - Outbound endpoints are used with forwarding rules to specify which queries to forward
 *
 * @example
 * // Basic outbound endpoint:
 * const outboundEndpoint = new DnsResolverOutboundEndpoint(this, "outbound-endpoint", {
 *   name: "my-outbound-endpoint",
 *   location: "eastus",
 *   dnsResolverId: dnsResolver.id,
 *   subnetId: outboundSubnet.id
 * });
 *
 * @example
 * // Outbound endpoint with tags:
 * const outboundEndpoint = new DnsResolverOutboundEndpoint(this, "outbound-endpoint", {
 *   name: "my-outbound-endpoint",
 *   location: "eastus",
 *   dnsResolverId: dnsResolver.id,
 *   subnetId: outboundSubnet.id,
 *   tags: {
 *     environment: "production",
 *     purpose: "hybrid-dns"
 *   }
 * });
 *
 * @example
 * // Outbound endpoint with version pinning:
 * const outboundEndpoint = new DnsResolverOutboundEndpoint(this, "outbound-endpoint", {
 *   name: "my-outbound-endpoint",
 *   location: "eastus",
 *   dnsResolverId: dnsResolver.id,
 *   subnetId: outboundSubnet.id,
 *   apiVersion: "2022-07-01"
 * });
 *
 * @stability stable
 */
export class DnsResolverOutboundEndpoint extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      DNS_RESOLVER_OUTBOUND_ENDPOINT_TYPE,
      ALL_DNS_RESOLVER_OUTBOUND_ENDPOINT_VERSIONS,
    );
  }

  /**
   * The input properties for this Outbound Endpoint instance
   */
  public readonly props: DnsResolverOutboundEndpointProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;
  public readonly resourceGuidOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure DNS Resolver Outbound Endpoint using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Outbound Endpoint
   */
  constructor(
    scope: Construct,
    id: string,
    props: DnsResolverOutboundEndpointProps,
  ) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Outbound Endpoint",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Outbound Endpoint",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Outbound Endpoint",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Outbound Endpoint",
    });

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioning_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the Outbound Endpoint",
      },
    );

    this.resourceGuidOutput = new cdktf.TerraformOutput(this, "resource_guid", {
      value: `\${${this.terraformResource.fqn}.output.properties.resourceGuid}`,
      description: "The unique identifier for the Outbound Endpoint",
    });

    // Override logical IDs to match naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.locationOutput.overrideLogicalId("location");
    this.tagsOutput.overrideLogicalId("tags");
    this.provisioningStateOutput.overrideLogicalId("provisioning_state");
    this.resourceGuidOutput.overrideLogicalId("resource_guid");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Resolves the parent resource ID for the Outbound Endpoint
   * Outbound Endpoints are child resources of DNS Resolvers
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as DnsResolverOutboundEndpointProps;
    return typedProps.dnsResolverId;
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2022-07-01";
  }

  /**
   * Gets the Azure resource type for Outbound Endpoints
   */
  protected resourceType(): string {
    return DNS_RESOLVER_OUTBOUND_ENDPOINT_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Outbound Endpoints
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as DnsResolverOutboundEndpointProps;

    const body: any = {
      location: this.location!,
      tags: this.allTags(),
      properties: {
        subnet: {
          id: typedProps.subnetId,
        },
      },
    };

    return body;
  }

  // =============================================================================
  // PUBLIC METHODS FOR OUTBOUND ENDPOINT OPERATIONS
  // =============================================================================

  /**
   * Get the subnet ID
   * Returns the input value as Azure API doesn't return nested subnet structure reliably
   */
  public get subnetId(): string {
    return this.props.subnetId;
  }

  /**
   * Get the provisioning state of the Outbound Endpoint
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Get the unique identifier for the Outbound Endpoint
   */
  public get resourceGuid(): string {
    return `\${${this.terraformResource.fqn}.output.properties.resourceGuid}`;
  }

  /**
   * Add a tag to the Outbound Endpoint
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Outbound Endpoint
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
