/**
 * Unified Azure Policy Definition implementation using VersionedAzapiResource framework
 *
 * This class provides a version-aware implementation for managing Azure Policy Definitions
 * using the AZAPI provider. Policy definitions are deployed at subscription or management
 * group scope and define the rules and parameters for policy enforcement.
 *
 * Supported API Versions:
 * - 2021-06-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Support for custom policy rules and parameters
 * - JSII compliance for multi-language support
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_POLICY_DEFINITION_VERSIONS,
  POLICY_DEFINITION_TYPE,
} from "./policy-definition-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the unified Azure Policy Definition
 *
 * Extends AzapiResourceProps with Policy Definition specific properties
 */
export interface PolicyDefinitionProps extends AzapiResourceProps {
  /**
   * The display name of the policy definition
   * Provides a human-readable name for the policy
   *
   * @example "Require tag and its value on resources"
   */
  readonly displayName?: string;

  /**
   * The policy definition description
   * Provides detailed information about what the policy enforces
   *
   * @example "Enforces a required tag and its value on resources"
   */
  readonly description?: string;

  /**
   * The type of policy definition
   * @default "Custom"
   * @example "Custom", "BuiltIn", "Static", "NotSpecified"
   */
  readonly policyType?: string;

  /**
   * The policy mode
   * Determines which resource types will be evaluated
   * @default "All"
   * @example "All", "Indexed", "Microsoft.KeyVault.Data"
   */
  readonly mode?: string;

  /**
   * The policy rule as a JSON object
   * Defines the if/then logic that determines policy enforcement
   * This is required for all policy definitions
   *
   * @example
   * {
   *   if: {
   *     field: "tags['Environment']",
   *     exists: "false"
   *   },
   *   then: {
   *     effect: "deny"
   *   }
   * }
   */
  readonly policyRule: any;

  /**
   * Parameters for the policy definition
   * Allows policy assignments to provide values that are used in the policy rule
   *
   * @example
   * {
   *   tagName: {
   *     type: "String",
   *     metadata: {
   *       displayName: "Tag Name",
   *       description: "Name of the tag to enforce"
   *     }
   *   }
   * }
   */
  readonly parameters?: any;

  /**
   * Metadata for the policy definition
   * Used to store additional information like category, version, etc.
   *
   * @example
   * {
   *   category: "Tags",
   *   version: "1.0.0"
   * }
   */
  readonly metadata?: any;

  /**
   * The lifecycle rules to ignore changes
   * @example ["metadata"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Properties interface for Azure Policy Definition
 * This is required for JSII compliance to support multi-language code generation
 */
export interface PolicyDefinitionProperties {
  /**
   * The display name of the policy definition
   */
  readonly displayName?: string;

  /**
   * The policy definition description
   */
  readonly description?: string;

  /**
   * The type of policy definition
   */
  readonly policyType?: string;

  /**
   * The policy mode
   */
  readonly mode?: string;

  /**
   * The policy rule object
   */
  readonly policyRule: any;

  /**
   * Parameters for the policy definition
   */
  readonly parameters?: any;

  /**
   * Metadata for the policy definition
   */
  readonly metadata?: any;
}

/**
 * The resource body interface for Azure Policy Definition API calls
 * This matches the Azure REST API schema for policy definitions
 */
export interface PolicyDefinitionBody {
  /**
   * The properties of the policy definition
   */
  readonly properties: PolicyDefinitionProperties;
}

/**
 * Unified Azure Policy Definition implementation
 *
 * This class provides a single, version-aware implementation for managing Azure
 * Policy Definitions. It automatically handles version resolution, schema validation,
 * and property transformation.
 *
 * Note: Policy definitions are deployed at subscription or management group scope.
 * Unlike most Azure resources, they do not have a location property as they are
 * not region-specific.
 *
 * @example
 * // Basic custom policy definition:
 * const policyDefinition = new PolicyDefinition(this, "policy", {
 *   name: "require-tag-policy",
 *   displayName: "Require tag on resources",
 *   description: "Enforces a required tag on resources",
 *   policyRule: {
 *     if: {
 *       field: "tags['Environment']",
 *       exists: "false"
 *     },
 *     then: {
 *       effect: "deny"
 *     }
 *   }
 * });
 *
 * @example
 * // Policy definition with parameters:
 * const policyDefinition = new PolicyDefinition(this, "policy", {
 *   name: "require-tag-policy",
 *   displayName: "Require tag on resources",
 *   policyRule: {
 *     if: {
 *       field: "[concat('tags[', parameters('tagName'), ']')]",
 *       exists: "false"
 *     },
 *     then: {
 *       effect: "deny"
 *     }
 *   },
 *   parameters: {
 *     tagName: {
 *       type: "String",
 *       metadata: {
 *         displayName: "Tag Name"
 *       }
 *     }
 *   }
 * });
 *
 * @stability stable
 */
export class PolicyDefinition extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      POLICY_DEFINITION_TYPE,
      ALL_POLICY_DEFINITION_VERSIONS,
    );
  }

  /**
   * The input properties for this Policy Definition instance
   */
  public readonly props: PolicyDefinitionProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure Policy Definition using the VersionedAzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Policy Definition
   */
  constructor(scope: Construct, id: string, props: PolicyDefinitionProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Policy Definition",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Policy Definition",
    });

    // Override logical IDs to match original naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   * Returns the most recent stable version as the default
   */
  protected defaultVersion(): string {
    return "2021-06-01";
  }

  /**
   * Gets the Azure resource type for Policy Definitions
   */
  protected resourceType(): string {
    return POLICY_DEFINITION_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   * Uses the framework's schema resolution to get the appropriate schema
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Creates the resource body for the Azure API call
   * Transforms the input properties into the JSON format expected by Azure REST API
   *
   * Note: Policy definitions do not have a location property as they are
   * subscription or management group scoped resources.
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as PolicyDefinitionProps;
    return {
      properties: {
        displayName: typedProps.displayName,
        description: typedProps.description,
        policyType: typedProps.policyType || "Custom",
        mode: typedProps.mode || "All",
        policyRule: typedProps.policyRule,
        parameters: typedProps.parameters,
        metadata: typedProps.metadata,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR POLICY DEFINITION OPERATIONS
  // =============================================================================

  /**
   * Get the full resource identifier for use in other Azure resources
   * Alias for the id property
   */
  public get resourceId(): string {
    return this.id;
  }

  /**
   * Get the policy type
   */
  public get policyType(): string {
    return this.props.policyType || "Custom";
  }

  /**
   * Get the policy mode
   */
  public get policyMode(): string {
    return this.props.mode || "All";
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
