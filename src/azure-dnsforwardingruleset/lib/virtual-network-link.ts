/**
 * Azure DNS Forwarding Ruleset Virtual Network Link implementation using AzapiResource framework
 *
 * This class provides a unified implementation for linking virtual networks to DNS Forwarding Rulesets.
 * Virtual Network Links enable VNets to use the forwarding rules defined in the ruleset.
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
 * - Metadata support for organizational tagging
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_VIRTUAL_NETWORK_LINK_VERSIONS,
  VIRTUAL_NETWORK_LINK_TYPE,
} from "./virtual-network-link-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the Azure DNS Forwarding Ruleset Virtual Network Link
 *
 * Extends AzapiResourceProps with Virtual Network Link specific properties
 */
export interface DnsForwardingRulesetVirtualNetworkLinkProps
  extends AzapiResourceProps {
  /**
   * Resource ID of the parent DNS Forwarding Ruleset
   * @example "/subscriptions/.../resourceGroups/rg/providers/Microsoft.Network/dnsForwardingRulesets/ruleset1"
   */
  readonly dnsForwardingRulesetId: string;

  /**
   * Resource ID of the Virtual Network to link
   * @example "/subscriptions/.../resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet1"
   */
  readonly virtualNetworkId: string;

  /**
   * Metadata attached to the virtual network link as key-value pairs
   */
  readonly metadata?: { [key: string]: string };

  /**
   * The lifecycle rules to ignore changes
   * @example ["metadata"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Virtual Network reference for DNS Forwarding Ruleset link
 */
export interface DnsForwardingRulesetVirtualNetworkReference {
  readonly id: string;
}

/**
 * Properties for Virtual Network Link body
 */
export interface DnsForwardingRulesetVirtualNetworkLinkProperties {
  readonly virtualNetwork: DnsForwardingRulesetVirtualNetworkReference;
  readonly metadata?: { [key: string]: string };
}

/**
 * The resource body interface for Azure Virtual Network Link API calls
 */
export interface DnsForwardingRulesetVirtualNetworkLinkBody {
  readonly properties: DnsForwardingRulesetVirtualNetworkLinkProperties;
}

/**
 * Azure DNS Forwarding Ruleset Virtual Network Link implementation
 *
 * Virtual Network Links connect DNS Forwarding Rulesets to virtual networks,
 * enabling those VNets to use the conditional forwarding rules defined in the ruleset.
 * This allows VMs and other resources in the linked VNets to resolve domains according
 * to the forwarding rules.
 *
 * @example
 * // Basic virtual network link:
 * const link = new DnsForwardingRulesetVirtualNetworkLink(this, "vnet-link", {
 *   name: "my-vnet-link",
 *   dnsForwardingRulesetId: ruleset.id,
 *   virtualNetworkId: vnet.id
 * });
 *
 * @example
 * // Virtual network link with metadata:
 * const link = new DnsForwardingRulesetVirtualNetworkLink(this, "vnet-link", {
 *   name: "my-vnet-link",
 *   dnsForwardingRulesetId: ruleset.id,
 *   virtualNetworkId: vnet.id,
 *   metadata: {
 *     environment: "production",
 *     team: "platform"
 *   }
 * });
 *
 * @example
 * // Virtual network link with explicit version:
 * const link = new DnsForwardingRulesetVirtualNetworkLink(this, "vnet-link", {
 *   name: "my-vnet-link",
 *   dnsForwardingRulesetId: ruleset.id,
 *   virtualNetworkId: vnet.id,
 *   apiVersion: "2022-07-01"
 * });
 *
 * @stability stable
 */
export class DnsForwardingRulesetVirtualNetworkLink extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      VIRTUAL_NETWORK_LINK_TYPE,
      ALL_VIRTUAL_NETWORK_LINK_VERSIONS,
    );
  }

  /**
   * The input properties for this Virtual Network Link instance
   */
  public readonly props: DnsForwardingRulesetVirtualNetworkLinkProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;

  // Public properties
  public readonly resourceName: string;

  /**
   * Creates a new Azure DNS Forwarding Ruleset Virtual Network Link using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Virtual Network Link
   */
  constructor(
    scope: Construct,
    id: string,
    props: DnsForwardingRulesetVirtualNetworkLinkProps,
  ) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    this.resourceName = `\${${this.terraformResource.fqn}.name}`;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Virtual Network Link",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: this.resourceName,
      description: "The name of the Virtual Network Link",
    });

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioning_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the Virtual Network Link",
      },
    );

    // Override logical IDs to match naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.provisioningStateOutput.overrideLogicalId("provisioning_state");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Resolves the parent resource ID for the Virtual Network Link
   * Virtual Network Links are child resources of DNS Forwarding Rulesets
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as DnsForwardingRulesetVirtualNetworkLinkProps;
    return typedProps.dnsForwardingRulesetId;
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2022-07-01";
  }

  /**
   * Gets the Azure resource type for Virtual Network Links
   */
  protected resourceType(): string {
    return VIRTUAL_NETWORK_LINK_TYPE;
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
    const typedProps = props as DnsForwardingRulesetVirtualNetworkLinkProps;

    const properties: DnsForwardingRulesetVirtualNetworkLinkProperties = {
      virtualNetwork: {
        id: typedProps.virtualNetworkId,
      },
      metadata: typedProps.metadata,
    };

    const body: DnsForwardingRulesetVirtualNetworkLinkBody = {
      properties,
    };

    return body;
  }

  // =============================================================================
  // PUBLIC METHODS FOR VIRTUAL NETWORK LINK OPERATIONS
  // =============================================================================

  /**
   * Get the provisioning state of the Virtual Network Link
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Get the metadata
   */
  public get metadata(): string {
    return `\${${this.terraformResource.fqn}.output.properties.metadata}`;
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
