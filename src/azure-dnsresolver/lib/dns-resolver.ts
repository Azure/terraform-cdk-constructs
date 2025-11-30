/**
 * Unified Azure DNS Private Resolver implementation using VersionedAzapiResource framework
 *
 * This class provides a single, version-aware implementation that automatically handles
 * version management, schema validation, and property transformation across all
 * supported API versions.
 *
 * Supported API Versions:
 * - 2022-07-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full backward compatibility with existing interface
 * - JSII compliance for multi-language support
 * - Hybrid DNS scenarios with conditional forwarding
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_DNS_RESOLVER_VERSIONS,
  DNS_RESOLVER_TYPE,
} from "./dns-resolver-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the unified Azure DNS Resolver
 *
 * Extends AzapiResourceProps with DNS Resolver specific properties
 */
export interface DnsResolverProps extends AzapiResourceProps {
  /**
   * The resource ID of the virtual network where the DNS Resolver will be deployed
   * The resolver requires a dedicated subnet with delegation to Microsoft.Network/dnsResolvers
   */
  readonly virtualNetworkId: string;

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];

  /**
   * Resource group ID where the DNS Resolver will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * The resource body interface for Azure DNS Resolver API calls
 * This matches the Azure REST API schema
 */
export interface DnsResolverBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties?: any;
}

/**
 * Unified Azure DNS Resolver implementation
 *
 * This class provides a single, version-aware implementation that replaces all
 * version-specific DNS Resolver classes. It automatically handles version
 * resolution, schema validation, and property transformation while maintaining
 * full backward compatibility.
 *
 * Azure DNS Private Resolvers enable hybrid DNS scenarios, allowing conditional
 * forwarding between Azure, on-premises, and other cloud providers. They provide
 * DNS resolution for resources in Azure virtual networks.
 *
 * Key Requirements:
 * - Requires a dedicated subnet with delegation to Microsoft.Network/dnsResolvers
 * - Subnet must be between /28 and /24 in size
 * - Each subscription can have up to 15 DNS resolvers
 * - Regional resource (unlike DNS zones which are global)
 *
 * @example
 * // Basic DNS resolver with automatic version resolution:
 * const dnsResolver = new DnsResolver(this, "resolver", {
 *   name: "my-dns-resolver",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   virtualNetworkId: vnet.id,
 * });
 *
 * @example
 * // DNS resolver with tags:
 * const dnsResolver = new DnsResolver(this, "resolver", {
 *   name: "my-dns-resolver",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   virtualNetworkId: vnet.id,
 *   tags: {
 *     environment: "production",
 *     purpose: "hybrid-dns"
 *   }
 * });
 *
 * @example
 * // DNS resolver with explicit version pinning:
 * const dnsResolver = new DnsResolver(this, "resolver", {
 *   name: "my-dns-resolver",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   virtualNetworkId: vnet.id,
 *   apiVersion: "2022-07-01",
 * });
 *
 * @stability stable
 */
export class DnsResolver extends AzapiResource {
  static {
    AzapiResource.registerSchemas(DNS_RESOLVER_TYPE, ALL_DNS_RESOLVER_VERSIONS);
  }

  public readonly props: DnsResolverProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly dnsResolverStateOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;
  public readonly resourceGuidOutput: cdktf.TerraformOutput;

  // Public properties
  public readonly virtualNetworkId: string;

  /**
   * Creates a new Azure DNS Resolver using the VersionedAzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the DNS Resolver
   */
  constructor(scope: Construct, id: string, props: DnsResolverProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs
    this.virtualNetworkId = props.virtualNetworkId;

    // Create Terraform outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the DNS Resolver",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the DNS Resolver",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the DNS Resolver",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the DNS Resolver",
    });

    this.dnsResolverStateOutput = new cdktf.TerraformOutput(
      this,
      "dns_resolver_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.dnsResolverState}`,
        description:
          "The state of the DNS Resolver (Connected or Disconnected)",
      },
    );

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioning_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the DNS Resolver resource",
      },
    );

    this.resourceGuidOutput = new cdktf.TerraformOutput(this, "resource_guid", {
      value: `\${${this.terraformResource.fqn}.output.properties.resourceGuid}`,
      description: "The unique identifier for the DNS Resolver resource",
    });

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.dnsResolverStateOutput.overrideLogicalId("dns_resolver_state");
    this.provisioningStateOutput.overrideLogicalId("provisioning_state");
    this.resourceGuidOutput.overrideLogicalId("resource_guid");

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
    return "2022-07-01";
  }

  /**
   * Gets the Azure resource type for DNS Resolvers
   */
  protected resourceType(): string {
    return DNS_RESOLVER_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for DNS Resolvers
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as DnsResolverProps;

    const body: DnsResolverBody = {
      location: this.location!,
      tags: this.allTags(),
      properties: {
        virtualNetwork: {
          id: typedProps.virtualNetworkId,
        },
      },
    };

    return body;
  }

  // =============================================================================
  // PUBLIC METHODS FOR DNS RESOLVER OPERATIONS
  // =============================================================================

  /**
   * Get the state of the DNS Resolver
   * Returns either "Connected" (resolver operational) or "Disconnected" (resolver not functioning)
   */
  public get dnsResolverState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.dnsResolverState}`;
  }

  /**
   * Get the provisioning state of the DNS Resolver
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Get the unique identifier for the DNS Resolver resource
   */
  public get resourceGuid(): string {
    return `\${${this.terraformResource.fqn}.output.properties.resourceGuid}`;
  }

  /**
   * Add a tag to the DNS Resolver
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the DNS Resolver
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
