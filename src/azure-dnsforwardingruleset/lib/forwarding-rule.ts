/**
 * Azure DNS Forwarding Rule implementation using AzapiResource framework
 *
 * This class provides a unified implementation for creating forwarding rules within
 * DNS Forwarding Rulesets. Forwarding rules define conditional forwarding behavior
 * based on domain names.
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
 * - Up to 6 target DNS servers per rule
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_FORWARDING_RULE_VERSIONS,
  FORWARDING_RULE_TYPE,
} from "./forwarding-rule-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Target DNS server configuration
 */
export interface TargetDnsServer {
  /**
   * IP address of the target DNS server
   * @example "10.0.0.4"
   */
  readonly ipAddress: string;

  /**
   * Port number for the target DNS server
   * @defaultValue 53
   */
  readonly port?: number;
}

/**
 * Properties for the Azure DNS Forwarding Rule
 *
 * Extends AzapiResourceProps with Forwarding Rule specific properties
 */
export interface ForwardingRuleProps extends AzapiResourceProps {
  /**
   * Resource ID of the parent DNS Forwarding Ruleset
   * @example "/subscriptions/.../resourceGroups/rg/providers/Microsoft.Network/dnsForwardingRulesets/ruleset1"
   */
  readonly dnsForwardingRulesetId: string;

  /**
   * The domain name to forward (must end with a dot for FQDN)
   * @example "contoso.com."
   * @example "internal.corp."
   */
  readonly domainName: string;

  /**
   * Array of target DNS servers to forward queries to
   * Maximum of 6 servers per rule
   * @example [{ ipAddress: "10.0.0.4", port: 53 }, { ipAddress: "10.0.0.5" }]
   */
  readonly targetDnsServers: TargetDnsServer[];

  /**
   * The state of the forwarding rule
   * @defaultValue "Enabled"
   */
  readonly forwardingRuleState?: "Enabled" | "Disabled";

  /**
   * Metadata attached to the forwarding rule as key-value pairs
   */
  readonly metadata?: { [key: string]: string };

  /**
   * The lifecycle rules to ignore changes
   * @example ["metadata"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Properties for Forwarding Rule body
 */
export interface ForwardingRuleProperties {
  readonly domainName: string;
  readonly targetDnsServers: TargetDnsServer[];
  readonly forwardingRuleState?: string;
  readonly metadata?: { [key: string]: string };
}

/**
 * The resource body interface for Azure Forwarding Rule API calls
 */
export interface ForwardingRuleBody {
  readonly properties: ForwardingRuleProperties;
}

/**
 * Azure DNS Forwarding Rule implementation
 *
 * Forwarding rules define conditional DNS forwarding behavior. When a DNS query
 * matches the domain name pattern, it's forwarded to the specified target DNS servers.
 * Up to 1000 rules can be configured per ruleset, with up to 6 target servers per rule.
 *
 * @example
 * // Basic forwarding rule:
 * const rule = new ForwardingRule(this, "rule", {
 *   name: "contoso-rule",
 *   dnsForwardingRulesetId: ruleset.id,
 *   domainName: "contoso.com.",
 *   targetDnsServers: [
 *     { ipAddress: "10.0.0.4", port: 53 },
 *     { ipAddress: "10.0.0.5" }
 *   ]
 * });
 *
 * @example
 * // Forwarding rule with metadata:
 * const rule = new ForwardingRule(this, "rule", {
 *   name: "contoso-rule",
 *   dnsForwardingRulesetId: ruleset.id,
 *   domainName: "contoso.com.",
 *   targetDnsServers: [{ ipAddress: "10.0.0.4" }],
 *   metadata: {
 *     environment: "production",
 *     owner: "platform-team"
 *   }
 * });
 *
 * @example
 * // Disabled forwarding rule:
 * const rule = new ForwardingRule(this, "rule", {
 *   name: "temp-rule",
 *   dnsForwardingRulesetId: ruleset.id,
 *   domainName: "temp.local.",
 *   targetDnsServers: [{ ipAddress: "10.0.0.4" }],
 *   forwardingRuleState: "Disabled"
 * });
 *
 * @stability stable
 */
export class ForwardingRule extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      FORWARDING_RULE_TYPE,
      ALL_FORWARDING_RULE_VERSIONS,
    );
  }

  /**
   * The input properties for this Forwarding Rule instance
   */
  public readonly props: ForwardingRuleProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;

  // Public properties
  public readonly resourceName: string;

  /**
   * Creates a new Azure DNS Forwarding Rule using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Forwarding Rule
   */
  constructor(scope: Construct, id: string, props: ForwardingRuleProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    this.resourceName = `\${${this.terraformResource.fqn}.name}`;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Forwarding Rule",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: this.resourceName,
      description: "The name of the Forwarding Rule",
    });

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioning_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the Forwarding Rule",
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
   * Resolves the parent resource ID for the Forwarding Rule
   * Forwarding Rules are child resources of DNS Forwarding Rulesets
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as ForwardingRuleProps;
    return typedProps.dnsForwardingRulesetId;
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2022-07-01";
  }

  /**
   * Gets the Azure resource type for Forwarding Rules
   */
  protected resourceType(): string {
    return FORWARDING_RULE_TYPE;
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
    const typedProps = props as ForwardingRuleProps;

    const properties: ForwardingRuleProperties = {
      domainName: typedProps.domainName,
      targetDnsServers: typedProps.targetDnsServers.map((server) => ({
        ipAddress: server.ipAddress,
        port: server.port ?? 53,
      })),
      forwardingRuleState: typedProps.forwardingRuleState,
      metadata: typedProps.metadata,
    };

    const body: ForwardingRuleBody = {
      properties,
    };

    return body;
  }

  // =============================================================================
  // PUBLIC METHODS FOR FORWARDING RULE OPERATIONS
  // =============================================================================

  /**
   * Get the provisioning state of the Forwarding Rule
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Get the target DNS servers
   */
  public get targetDnsServers(): string {
    return `\${${this.terraformResource.fqn}.output.properties.targetDnsServers}`;
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
