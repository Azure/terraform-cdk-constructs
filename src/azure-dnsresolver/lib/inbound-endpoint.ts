/**
 * Azure DNS Resolver Inbound Endpoint implementation using AzapiResource framework
 *
 * This class provides a unified implementation for DNS Resolver Inbound Endpoints.
 * Inbound Endpoints allow external DNS servers to query Azure-hosted DNS zones
 * through the DNS Resolver.
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
 * - Static or dynamic IP allocation
 * - Dedicated subnet requirement with delegation
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_DNS_RESOLVER_INBOUND_ENDPOINT_VERSIONS,
  DNS_RESOLVER_INBOUND_ENDPOINT_TYPE,
} from "./inbound-endpoint-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the Azure DNS Resolver Inbound Endpoint
 *
 * Extends AzapiResourceProps with Inbound Endpoint specific properties
 */
export interface DnsResolverInboundEndpointProps extends AzapiResourceProps {
  /**
   * Resource ID of the parent DNS Resolver
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/dnsResolvers/my-resolver"
   */
  readonly dnsResolverId: string;

  /**
   * Resource ID of the subnet where the Inbound Endpoint will be deployed
   * Must be a dedicated subnet between /28 and /24 with delegation to Microsoft.Network/dnsResolvers
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet/subnets/inbound-subnet"
   */
  readonly subnetId: string;

  /**
   * The private IP address for DNS queries
   * If not specified, an IP will be allocated dynamically from the subnet
   * @example "10.0.1.4"
   */
  readonly privateIpAddress?: string;

  /**
   * The IP allocation method
   * - "Static": Use the specified privateIpAddress
   * - "Dynamic": Automatically allocate an IP from the subnet
   * @defaultValue "Dynamic"
   */
  readonly privateIpAllocationMethod?: string;

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * The resource body interface for Azure Inbound Endpoint API calls
 * This matches the Azure REST API schema
 */
export interface DnsResolverInboundEndpointBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties?: any;
}

/**
 * Azure DNS Resolver Inbound Endpoint implementation
 *
 * Inbound Endpoints allow external DNS servers (such as on-premises DNS servers)
 * to query Azure-hosted DNS zones through the DNS Resolver. This enables hybrid
 * DNS scenarios where external networks need to resolve Azure private DNS zones.
 *
 * Requirements:
 * - Dedicated subnet between /28 and /24
 * - Subnet must be delegated to Microsoft.Network/dnsResolvers
 * - Must be in the same VNet as the parent DNS Resolver
 * - Each DNS Resolver can have multiple inbound endpoints
 *
 * @example
 * // Basic inbound endpoint with dynamic IP:
 * const inboundEndpoint = new DnsResolverInboundEndpoint(this, "inbound-endpoint", {
 *   name: "my-inbound-endpoint",
 *   location: "eastus",
 *   dnsResolverId: dnsResolver.id,
 *   subnetId: inboundSubnet.id
 * });
 *
 * @example
 * // Inbound endpoint with static IP address:
 * const inboundEndpoint = new DnsResolverInboundEndpoint(this, "inbound-endpoint", {
 *   name: "my-inbound-endpoint",
 *   location: "eastus",
 *   dnsResolverId: dnsResolver.id,
 *   subnetId: inboundSubnet.id,
 *   privateIpAddress: "10.0.1.4",
 *   privateIpAllocationMethod: "Static"
 * });
 *
 * @example
 * // Inbound endpoint with tags and version pinning:
 * const inboundEndpoint = new DnsResolverInboundEndpoint(this, "inbound-endpoint", {
 *   name: "my-inbound-endpoint",
 *   location: "eastus",
 *   dnsResolverId: dnsResolver.id,
 *   subnetId: inboundSubnet.id,
 *   tags: {
 *     environment: "production",
 *     purpose: "hybrid-dns"
 *   },
 *   apiVersion: "2022-07-01"
 * });
 *
 * @stability stable
 */
export class DnsResolverInboundEndpoint extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      DNS_RESOLVER_INBOUND_ENDPOINT_TYPE,
      ALL_DNS_RESOLVER_INBOUND_ENDPOINT_VERSIONS,
    );
  }

  /**
   * The input properties for this Inbound Endpoint instance
   */
  public readonly props: DnsResolverInboundEndpointProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure DNS Resolver Inbound Endpoint using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Inbound Endpoint
   */
  constructor(
    scope: Construct,
    id: string,
    props: DnsResolverInboundEndpointProps,
  ) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Inbound Endpoint",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Inbound Endpoint",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Inbound Endpoint",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Inbound Endpoint",
    });

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioning_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the Inbound Endpoint",
      },
    );

    // Override logical IDs to match naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.locationOutput.overrideLogicalId("location");
    this.tagsOutput.overrideLogicalId("tags");
    this.provisioningStateOutput.overrideLogicalId("provisioning_state");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Resolves the parent resource ID for the Inbound Endpoint
   * Inbound Endpoints are child resources of DNS Resolvers
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as DnsResolverInboundEndpointProps;
    return typedProps.dnsResolverId;
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2022-07-01";
  }

  /**
   * Gets the Azure resource type for Inbound Endpoints
   */
  protected resourceType(): string {
    return DNS_RESOLVER_INBOUND_ENDPOINT_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Inbound Endpoints
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as DnsResolverInboundEndpointProps;

    const ipConfiguration: any = {
      subnet: {
        id: typedProps.subnetId,
      },
    };

    // Add private IP address if specified
    if (typedProps.privateIpAddress) {
      ipConfiguration.privateIpAddress = typedProps.privateIpAddress;
    }

    // Add IP allocation method if specified
    if (typedProps.privateIpAllocationMethod) {
      ipConfiguration.privateIpAllocationMethod =
        typedProps.privateIpAllocationMethod;
    }

    const body: any = {
      location: this.location!,
      tags: this.allTags(),
      properties: {
        ipConfigurations: [ipConfiguration],
      },
    };

    return body;
  }

  // =============================================================================
  // PUBLIC METHODS FOR INBOUND ENDPOINT OPERATIONS
  // =============================================================================

  /**
   * Get the subnet ID
   * Returns the input value as Azure API doesn't return nested subnet structure reliably
   */
  public get subnetId(): string {
    return this.props.subnetId;
  }

  /**
   * Get the private IP address
   * Returns the input value for static IPs, or empty string if dynamic
   */
  public get privateIpAddress(): string {
    return this.props.privateIpAddress || "";
  }

  /**
   * Get the provisioning state of the Inbound Endpoint
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Add a tag to the Inbound Endpoint
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Inbound Endpoint
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
