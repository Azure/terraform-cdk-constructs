/**
 * Azure Virtual Network Manager Security Admin Rule Collection implementation using AzapiResource framework
 *
 * This class provides a unified implementation for grouping related security admin rules together.
 * Rule collections apply to specific network groups and contain individual security rules.
 *
 * Supported API Versions:
 * - 2023-11-01 (Maintenance)
 * - 2024-05-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full backward compatibility
 * - JSII compliance for multi-language support
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_RULE_COLLECTION_VERSIONS,
  RULE_COLLECTION_TYPE,
  SecurityAdminConfigurationRuleGroupItem,
} from "./security-admin-rule-collection-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the Azure Virtual Network Manager Security Admin Rule Collection
 *
 * Extends AzapiResourceProps with Rule Collection specific properties
 */
export interface SecurityAdminRuleCollectionProps extends AzapiResourceProps {
  /**
   * Resource ID of the parent Security Admin Configuration
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/networkManagers/vnm/securityAdminConfigurations/config"
   */
  readonly securityAdminConfigurationId: string;

  /**
   * Optional description of the rule collection
   * @example "Rules to block high-risk ports"
   */
  readonly description?: string;

  /**
   * Network groups to apply this rule collection to
   * Each item specifies a network group that will receive these rules
   */
  readonly appliesToGroups: SecurityAdminConfigurationRuleGroupItem[];

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Properties for Rule Collection body
 */
export interface SecurityAdminRuleCollectionProperties {
  readonly description?: string;
  readonly appliesToGroups: SecurityAdminConfigurationRuleGroupItem[];
}

/**
 * The resource body interface for Azure Rule Collection API calls
 */
export interface SecurityAdminRuleCollectionBody {
  readonly properties: SecurityAdminRuleCollectionProperties;
}

/**
 * Azure Virtual Network Manager Security Admin Rule Collection implementation
 *
 * Rule collections group related security admin rules together and define which network
 * groups receive those rules. This allows for organized rule management and targeted
 * application of security policies.
 *
 * @example
 * // Basic rule collection for blocking high-risk ports:
 * const blockHighRiskPorts = new SecurityAdminRuleCollection(this, "block-ports", {
 *   name: "block-high-risk-ports",
 *   securityAdminConfigurationId: securityConfig.id,
 *   description: "Block SSH, RDP, and other high-risk ports",
 *   appliesToGroups: [{
 *     networkGroupId: productionGroup.id
 *   }]
 * });
 *
 * @example
 * // Rule collection applied to multiple network groups:
 * const allowMonitoring = new SecurityAdminRuleCollection(this, "allow-monitoring", {
 *   name: "allow-monitoring-traffic",
 *   securityAdminConfigurationId: securityConfig.id,
 *   description: "Always allow monitoring and security scanner traffic",
 *   appliesToGroups: [
 *     { networkGroupId: productionGroup.id },
 *     { networkGroupId: stagingGroup.id }
 *   ],
 *   apiVersion: "2024-05-01"
 * });
 *
 * @stability stable
 */
export class SecurityAdminRuleCollection extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      RULE_COLLECTION_TYPE,
      ALL_RULE_COLLECTION_VERSIONS,
    );
  }

  /**
   * The input properties for this Rule Collection instance
   */
  public readonly props: SecurityAdminRuleCollectionProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;

  // Public properties
  public readonly resourceName: string;

  /**
   * Creates a new Azure Virtual Network Manager Security Admin Rule Collection using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Rule Collection
   */
  constructor(
    scope: Construct,
    id: string,
    props: SecurityAdminRuleCollectionProps,
  ) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    this.resourceName = `\${${this.terraformResource.fqn}.name}`;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Rule Collection",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: this.resourceName,
      description: "The name of the Rule Collection",
    });

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioningState",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the Rule Collection",
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
   * Resolves the parent resource ID for the Rule Collection
   * Rule Collections are scoped to Security Admin Configurations
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as SecurityAdminRuleCollectionProps;
    return typedProps.securityAdminConfigurationId;
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2024-05-01";
  }

  /**
   * Gets the Azure resource type for Rule Collections
   */
  protected resourceType(): string {
    return RULE_COLLECTION_TYPE;
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
    const typedProps = props as SecurityAdminRuleCollectionProps;
    return {
      properties: {
        description: typedProps.description,
        appliesToGroups: typedProps.appliesToGroups,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR RULE COLLECTION OPERATIONS
  // =============================================================================

  /**
   * Get the provisioning state of the Rule Collection
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
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
