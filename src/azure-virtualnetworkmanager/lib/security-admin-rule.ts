/**
 * Azure Virtual Network Manager Security Admin Rule implementation using AzapiResource framework
 *
 * This class provides a unified implementation for individual security admin rules that define
 * high-priority security policies. These rules are evaluated BEFORE traditional NSGs and can
 * enforce organization-wide security requirements.
 *
 * Supported API Versions:
 * - 2023-11-01 (Maintenance)
 * - 2024-05-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Three action types: Allow, Deny, AlwaysAllow
 * - Full backward compatibility
 * - JSII compliance for multi-language support
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_SECURITY_ADMIN_RULE_VERSIONS,
  SECURITY_ADMIN_RULE_TYPE,
  AddressPrefixItem,
} from "./security-admin-rule-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the Azure Virtual Network Manager Security Admin Rule
 *
 * Extends AzapiResourceProps with Security Admin Rule specific properties
 */
export interface SecurityAdminRuleProps extends AzapiResourceProps {
  /**
   * Resource ID of the parent Rule Collection
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/networkManagers/vnm/securityAdminConfigurations/config/ruleCollections/collection"
   */
  readonly ruleCollectionId: string;

  /**
   * Optional description of the security admin rule
   * @example "Block SSH access from internet"
   */
  readonly description?: string;

  /**
   * Priority of the rule (1-4096, lower number = higher priority)
   * Rules with lower priority numbers are evaluated first
   * @example 100
   */
  readonly priority: number;

  /**
   * Action to take when the rule matches
   * - Allow: Allow traffic (NSG can still deny)
   * - Deny: Deny traffic (stops evaluation)
   * - AlwaysAllow: Force allow (overrides NSG denies)
   * @example "Deny"
   * @example "AlwaysAllow"
   */
  readonly action: "Allow" | "Deny" | "AlwaysAllow";

  /**
   * Direction of traffic this rule applies to
   * @example "Inbound"
   * @example "Outbound"
   */
  readonly direction: "Inbound" | "Outbound";

  /**
   * Protocol this rule applies to
   * @example "Tcp"
   * @example "Any"
   */
  readonly protocol: "Tcp" | "Udp" | "Icmp" | "Esp" | "Ah" | "Any";

  /**
   * Source port ranges
   * Use ["*"] for all ports or specify ranges like ["80", "443", "8000-8999"]
   * @default ["*"]
   * @example ["*"]
   * @example ["80", "443"]
   */
  readonly sourcePortRanges?: string[];

  /**
   * Destination port ranges
   * Use ["*"] for all ports or specify ranges
   * @default ["*"]
   * @example ["22"]
   * @example ["3389", "5985-5986"]
   */
  readonly destinationPortRanges?: string[];

  /**
   * Source addresses or network groups
   * @example [{ addressPrefix: "*", addressPrefixType: "IPPrefix" }]
   * @example [{ addressPrefix: "10.0.0.0/8", addressPrefixType: "IPPrefix" }]
   */
  readonly sources?: AddressPrefixItem[];

  /**
   * Destination addresses or network groups
   * @example [{ addressPrefix: "*", addressPrefixType: "IPPrefix" }]
   * @example [{ addressPrefix: "Internet", addressPrefixType: "ServiceTag" }]
   */
  readonly destinations?: AddressPrefixItem[];

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Properties for Security Admin Rule body
 */
export interface SecurityAdminRuleProperties {
  readonly description?: string;
  readonly priority: number;
  readonly action: string;
  readonly direction: string;
  readonly protocol: string;
  readonly sourcePortRanges?: string[];
  readonly destinationPortRanges?: string[];
  readonly sources?: AddressPrefixItem[];
  readonly destinations?: AddressPrefixItem[];
}

/**
 * The resource body interface for Azure Security Admin Rule API calls
 */
export interface SecurityAdminRuleBody {
  readonly kind: "Custom";
  readonly properties: SecurityAdminRuleProperties;
}

/**
 * Azure Virtual Network Manager Security Admin Rule implementation
 *
 * Security admin rules define high-priority security policies that are evaluated BEFORE
 * traditional Network Security Groups (NSGs). This enables centralized security enforcement
 * that cannot be overridden by individual teams.
 *
 * Key concepts:
 * - Priority: Lower numbers = higher priority (evaluated first)
 * - Allow: Permits traffic, but NSG can still deny it
 * - Deny: Blocks traffic immediately, no further evaluation
 * - AlwaysAllow: Forces traffic to be allowed, overriding NSG denies
 *
 * @example
 * // Block SSH from internet:
 * const blockSSH = new SecurityAdminRule(this, "block-ssh", {
 *   name: "block-ssh-from-internet",
 *   ruleCollectionId: ruleCollection.id,
 *   description: "Block SSH access from internet",
 *   priority: 100,
 *   action: "Deny",
 *   direction: "Inbound",
 *   protocol: "Tcp",
 *   destinationPortRanges: ["22"],
 *   sources: [{ addressPrefix: "Internet", addressPrefixType: "ServiceTag" }],
 *   destinations: [{ addressPrefix: "*", addressPrefixType: "IPPrefix" }]
 * });
 *
 * @example
 * // Always allow monitoring traffic:
 * const allowMonitoring = new SecurityAdminRule(this, "allow-monitoring", {
 *   name: "always-allow-monitoring",
 *   ruleCollectionId: ruleCollection.id,
 *   description: "Always allow traffic from monitoring systems",
 *   priority: 50,
 *   action: "AlwaysAllow",
 *   direction: "Inbound",
 *   protocol: "Any",
 *   sources: [{ addressPrefix: "10.0.0.0/24", addressPrefixType: "IPPrefix" }],
 *   destinations: [{ addressPrefix: "*", addressPrefixType: "IPPrefix" }]
 * });
 *
 * @stability stable
 */
export class SecurityAdminRule extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      SECURITY_ADMIN_RULE_TYPE,
      ALL_SECURITY_ADMIN_RULE_VERSIONS,
    );
  }

  /**
   * The input properties for this Security Admin Rule instance
   */
  public readonly props: SecurityAdminRuleProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;

  // Public properties
  public readonly resourceName: string;

  /**
   * Creates a new Azure Virtual Network Manager Security Admin Rule using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Security Admin Rule
   */
  constructor(scope: Construct, id: string, props: SecurityAdminRuleProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    this.resourceName = `\${${this.terraformResource.fqn}.name}`;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Security Admin Rule",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: this.resourceName,
      description: "The name of the Security Admin Rule",
    });

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioningState",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the Security Admin Rule",
      },
    );

    // Override logical IDs to match naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.provisioningStateOutput.overrideLogicalId("provisioningState");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Resolves the parent resource ID for the Security Admin Rule
   * Security Admin Rules are scoped to Rule Collections
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as SecurityAdminRuleProps;
    return typedProps.ruleCollectionId;
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2024-05-01";
  }

  /**
   * Gets the Azure resource type for Security Admin Rules
   */
  protected resourceType(): string {
    return SECURITY_ADMIN_RULE_TYPE;
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
    const typedProps = props as SecurityAdminRuleProps;

    // Convert "*" to "0-65535" for port ranges as Azure API doesn't accept "*"
    const normalizePortRanges = (ranges: string[] | undefined): string[] => {
      const defaultRanges = ranges || ["*"];
      return defaultRanges.map((range) => (range === "*" ? "0-65535" : range));
    };

    return {
      kind: "Custom",
      properties: {
        description: typedProps.description,
        priority: typedProps.priority,
        access: typedProps.action, // Azure API uses 'access' not 'action'
        direction: typedProps.direction,
        protocol: typedProps.protocol,
        sourcePortRanges: normalizePortRanges(typedProps.sourcePortRanges),
        destinationPortRanges: normalizePortRanges(
          typedProps.destinationPortRanges,
        ),
        sources: typedProps.sources || [
          { addressPrefix: "*", addressPrefixType: "IPPrefix" },
        ],
        destinations: typedProps.destinations || [
          { addressPrefix: "*", addressPrefixType: "IPPrefix" },
        ],
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR SECURITY ADMIN RULE OPERATIONS
  // =============================================================================

  /**
   * Get the provisioning state of the Security Admin Rule
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Get the priority of the rule
   */
  public get rulePriority(): number {
    return this.props.priority;
  }

  /**
   * Get the action of the rule
   */
  public get ruleAction(): "Allow" | "Deny" | "AlwaysAllow" {
    return this.props.action;
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
