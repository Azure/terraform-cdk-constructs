/**
 * Unified Azure DNS Forwarding Ruleset implementation using AzapiResource framework
 *
 * This class provides a unified implementation for creating DNS Forwarding Rulesets
 * that work with DNS Resolver Outbound Endpoints to enable conditional forwarding rules.
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
 * - Conditional DNS forwarding for hybrid scenarios
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_DNS_FORWARDING_RULESET_VERSIONS,
  DNS_FORWARDING_RULESET_TYPE,
} from "./dns-forwarding-ruleset-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the unified Azure DNS Forwarding Ruleset
 *
 * Extends AzapiResourceProps with DNS Forwarding Ruleset specific properties
 */
export interface DnsForwardingRulesetProps extends AzapiResourceProps {
  /**
   * Array of resource IDs of DNS Resolver Outbound Endpoints
   * The ruleset uses these endpoints to forward DNS queries based on the rules
   * @example ["/subscriptions/.../dnsResolvers/resolver1/outboundEndpoints/endpoint1"]
   */
  readonly dnsResolverOutboundEndpointIds: string[];

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];

  /**
   * Resource group ID where the DNS Forwarding Ruleset will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * The resource body interface for Azure DNS Forwarding Ruleset API calls
 * This matches the Azure REST API schema
 */
/**
 * DNS Resolver Outbound Endpoint reference
 */
export interface DnsResolverOutboundEndpointReference {
  readonly id: string;
}

/**
 * Properties for the DNS Forwarding Ruleset body
 */
export interface DnsForwardingRulesetProperties {
  readonly dnsResolverOutboundEndpoints: DnsResolverOutboundEndpointReference[];
}

/**
 * The resource body interface for Azure DNS Forwarding Ruleset API calls
 * This matches the Azure REST API schema
 */
export interface DnsForwardingRulesetBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties: DnsForwardingRulesetProperties;
}

/**
 * Unified Azure DNS Forwarding Ruleset implementation
 *
 * This class provides a unified implementation for creating DNS Forwarding Rulesets
 * that enable conditional forwarding of DNS queries. Rulesets work with DNS Resolver
 * Outbound Endpoints to route queries to specific target DNS servers based on domain names.
 *
 * Key Requirements:
 * - Requires at least one DNS Resolver Outbound Endpoint
 * - Each ruleset can contain up to 1000 forwarding rules
 * - Regional resource (must match outbound endpoint location)
 * - Can be linked to multiple virtual networks
 *
 * @example
 * // Basic DNS forwarding ruleset with automatic version resolution:
 * const ruleset = new DnsForwardingRuleset(this, "ruleset", {
 *   name: "my-ruleset",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   dnsResolverOutboundEndpointIds: [outboundEndpoint.id],
 * });
 *
 * @example
 * // DNS forwarding ruleset with tags:
 * const ruleset = new DnsForwardingRuleset(this, "ruleset", {
 *   name: "my-ruleset",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   dnsResolverOutboundEndpointIds: [outboundEndpoint.id],
 *   tags: {
 *     environment: "production",
 *     purpose: "hybrid-dns"
 *   }
 * });
 *
 * @example
 * // DNS forwarding ruleset with explicit version pinning:
 * const ruleset = new DnsForwardingRuleset(this, "ruleset", {
 *   name: "my-ruleset",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   dnsResolverOutboundEndpointIds: [outboundEndpoint.id],
 *   apiVersion: "2022-07-01",
 * });
 *
 * @stability stable
 */
export class DnsForwardingRuleset extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      DNS_FORWARDING_RULESET_TYPE,
      ALL_DNS_FORWARDING_RULESET_VERSIONS,
    );
  }

  public readonly props: DnsForwardingRulesetProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;
  public readonly resourceGuidOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure DNS Forwarding Ruleset using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the DNS Forwarding Ruleset
   */
  constructor(scope: Construct, id: string, props: DnsForwardingRulesetProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs

    // Create Terraform outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the DNS Forwarding Ruleset",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the DNS Forwarding Ruleset",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the DNS Forwarding Ruleset",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the DNS Forwarding Ruleset",
    });

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioning_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description:
          "The provisioning state of the DNS Forwarding Ruleset resource",
      },
    );

    this.resourceGuidOutput = new cdktf.TerraformOutput(this, "resource_guid", {
      value: `\${${this.terraformResource.fqn}.output.properties.resourceGuid}`,
      description:
        "The unique identifier for the DNS Forwarding Ruleset resource",
    });

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
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
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2022-07-01";
  }

  /**
   * Gets the Azure resource type for DNS Forwarding Rulesets
   */
  protected resourceType(): string {
    return DNS_FORWARDING_RULESET_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for DNS Forwarding Rulesets
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as DnsForwardingRulesetProps;

    const body: DnsForwardingRulesetBody = {
      location: this.location!,
      tags: this.allTags(),
      properties: {
        dnsResolverOutboundEndpoints:
          typedProps.dnsResolverOutboundEndpointIds.map((id) => ({ id })),
      },
    };

    return body;
  }

  // =============================================================================
  // PUBLIC METHODS FOR DNS FORWARDING RULESET OPERATIONS
  // =============================================================================

  /**
   * Get the provisioning state of the DNS Forwarding Ruleset
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Get the unique identifier for the DNS Forwarding Ruleset resource
   */
  public get resourceGuid(): string {
    return `\${${this.terraformResource.fqn}.output.properties.resourceGuid}`;
  }

  /**
   * Add a tag to the DNS Forwarding Ruleset
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the DNS Forwarding Ruleset
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
