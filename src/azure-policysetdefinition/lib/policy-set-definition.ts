/**
 * Unified Azure Policy Set Definition (Initiative) implementation using AzapiResource framework
 *
 * This class provides a version-aware implementation for Azure Policy Set Definitions
 * that automatically handles version management, schema validation, and property
 * transformation across all supported API versions.
 *
 * Policy Set Definitions (also known as Initiatives in Azure Portal) allow you to
 * group multiple policy definitions together and assign them as a single unit.
 *
 * Supported API Versions:
 * - 2023-04-01 (Active, Latest)
 * - 2021-06-01 (Active, Backward Compatibility)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full JSII compliance for multi-language support
 * - Support for policy definition references with parameters
 * - Policy definition groups for organization
 * - Initiative-level parameter definitions
 */

import { createHash } from "crypto";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_POLICY_SET_DEFINITION_VERSIONS,
  POLICY_SET_DEFINITION_TYPE,
} from "./policy-set-definition-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * A reference to a policy definition within a policy set
 *
 * This defines which policy definitions are included in the initiative
 * and how they are configured with parameters.
 */
export interface PolicyDefinitionReference {
  /**
   * The ID of the policy definition to include in the set
   *
   * This can be:
   * - A built-in policy: /providers/Microsoft.Authorization/policyDefinitions/{policyDefinitionId}
   * - A custom policy at subscription level: /subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyDefinitions/{policyDefinitionId}
   * - A custom policy at management group level: /providers/Microsoft.Management/managementGroups/{managementGroupId}/providers/Microsoft.Authorization/policyDefinitions/{policyDefinitionId}
   *
   * @example "/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d"
   */
  readonly policyDefinitionId: string;

  /**
   * A unique identifier for this policy definition reference within the set
   *
   * This ID is used to reference this specific policy in the initiative
   * and must be unique within the policy set definition.
   *
   * @example "auditVMsWithoutTags"
   */
  readonly policyDefinitionReferenceId?: string;

  /**
   * Parameter values for this policy definition
   *
   * These values override the default parameter values in the policy definition.
   * Parameters can reference initiative-level parameters using the format:
   * { "value": "[parameters('initiativeParameterName')]" }
   *
   * @example { "tagName": { "value": "environment" }, "tagValue": { "value": "[parameters('requiredTagValue')]" } }
   */
  readonly parameters?: { [key: string]: PolicyParameterValue };

  /**
   * Group names that this policy definition belongs to
   *
   * Groups help organize policies within an initiative and can be used
   * for compliance reporting and management.
   *
   * @example ["Security", "Compliance"]
   */
  readonly groupNames?: string[];
}

/**
 * A group for organizing policy definitions within a policy set
 *
 * Groups provide a way to categorize and organize policies within an initiative
 * for better management and compliance reporting.
 */
export interface PolicyDefinitionGroup {
  /**
   * The name of the group (must be unique within the policy set)
   *
   * This name is referenced by policy definitions to indicate membership.
   *
   * @example "Security"
   */
  readonly name: string;

  /**
   * The display name of the group shown in Azure Portal
   *
   * @example "Security Policies"
   */
  readonly displayName?: string;

  /**
   * The category this group belongs to
   *
   * Categories help organize groups and are displayed in the Azure Portal.
   *
   * @example "Security Center"
   */
  readonly category?: string;

  /**
   * A description of the group's purpose
   *
   * @example "Policies related to security configuration and compliance"
   */
  readonly description?: string;

  /**
   * Additional metadata for the group
   */
  readonly additionalMetadataId?: string;
}

/**
 * Metadata for the policy set definition
 *
 * Metadata provides additional information about the policy set
 * without affecting its evaluation logic.
 */
export interface PolicySetMetadata {
  /**
   * The category of the policy set for Azure Portal organization
   *
   * @example "Security Center"
   */
  readonly category?: string;

  /**
   * The version of the policy set definition
   *
   * @example "1.0.0"
   */
  readonly version?: string;

  /**
   * Whether this policy set is in preview
   *
   * @default false
   */
  readonly preview?: boolean;

  /**
   * Whether this policy set is deprecated
   *
   * @default false
   */
  readonly deprecated?: boolean;
}

/**
 * Metadata for a policy set parameter
 *
 * Provides additional information for Azure Portal integration.
 */
export interface PolicySetParameterMetadata {
  /**
   * Strong type for Azure Portal resource picker integration
   */
  readonly strongType?: string;

  /**
   * Display name in Azure Portal
   */
  readonly displayName?: string;

  /**
   * Description in Azure Portal
   */
  readonly description?: string;
}

/**
 * Parameter definition for the policy set
 *
 * These parameters can be referenced by policy definitions within the set.
 */
export interface PolicySetParameterDefinition {
  /**
   * The data type of the parameter
   */
  readonly type:
    | "String"
    | "Array"
    | "Object"
    | "Boolean"
    | "Integer"
    | "Float"
    | "DateTime";

  /**
   * Display name for the parameter in Azure Portal
   */
  readonly displayName?: string;

  /**
   * Description of the parameter
   */
  readonly description?: string;

  /**
   * Default value for the parameter
   */
  readonly defaultValue?: any;

  /**
   * Allowed values for the parameter
   */
  readonly allowedValues?: any[];

  /**
   * Metadata for the parameter (e.g., strongType for Azure Portal integration)
   */
  readonly metadata?: PolicySetParameterMetadata;
}

/**
 * A parameter value, either a direct value or a reference
 */
export interface PolicyParameterValue {
  /**
   * The value of the parameter
   *
   * Can be a direct value or a reference to an initiative parameter
   * using the format: "[parameters('parameterName')]"
   */
  readonly value: any;
}

/**
 * Properties for the unified Azure Policy Set Definition
 *
 * Extends AzapiResourceProps with Policy Set Definition specific properties
 */
export interface PolicySetDefinitionProps extends AzapiResourceProps {
  /**
   * The scope at which to create the policy set definition
   *
   * This can be:
   * - A subscription: /subscriptions/{subscriptionId}
   * - A management group: /providers/Microsoft.Management/managementGroups/{managementGroupId}
   *
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000"
   * @example "/providers/Microsoft.Management/managementGroups/my-management-group"
   */
  readonly scope: string;

  /**
   * The display name of the policy set definition
   *
   * This is the name shown in the Azure Portal.
   * Required property.
   *
   * @example "Security Baseline Initiative"
   */
  readonly displayName: string;

  /**
   * Description of the policy set definition
   *
   * @example "This initiative applies a set of security policies to ensure baseline compliance."
   */
  readonly description?: string;

  /**
   * The type of policy set definition
   *
   * @default "Custom"
   */
  readonly policyType?: "BuiltIn" | "Custom" | "Static";

  /**
   * Metadata for the policy set definition
   *
   * Includes category, version, preview, and deprecated flags.
   */
  readonly metadata?: PolicySetMetadata;

  /**
   * Parameter definitions for the policy set
   *
   * These parameters can be referenced by policy definitions in the set
   * using the format: "[parameters('parameterName')]"
   */
  readonly parameters?: { [key: string]: PolicySetParameterDefinition };

  /**
   * Array of policy definition references
   *
   * Each reference specifies a policy definition to include in the set
   * along with its parameter values and group memberships.
   * Required property.
   */
  readonly policyDefinitions: PolicyDefinitionReference[];

  /**
   * Groups for organizing policy definitions in the set
   *
   * Groups help categorize policies for management and compliance reporting.
   */
  readonly policyDefinitionGroups?: PolicyDefinitionGroup[];
}

/**
 * Properties interface for Azure Policy Set Definition
 * This is required for JSII compliance to support multi-language code generation
 */
export interface PolicySetDefinitionProperties {
  /**
   * The display name of the policy set definition
   */
  readonly displayName: string;

  /**
   * Description of the policy set definition
   */
  readonly description?: string;

  /**
   * The type of policy set definition
   */
  readonly policyType?: string;

  /**
   * Metadata for the policy set definition
   */
  readonly metadata?: PolicySetMetadata;

  /**
   * Parameter definitions for the policy set
   */
  readonly parameters?: { [key: string]: PolicySetParameterDefinition };

  /**
   * Array of policy definition references
   */
  readonly policyDefinitions: PolicyDefinitionReference[];

  /**
   * Groups for organizing policy definitions
   */
  readonly policyDefinitionGroups?: PolicyDefinitionGroup[];
}

/**
 * The resource body interface for Azure Policy Set Definition API calls
 * This matches the Azure REST API schema for policy set definitions
 */
export interface PolicySetDefinitionBody {
  /**
   * The properties of the policy set definition
   */
  readonly properties: PolicySetDefinitionProperties;
}

/**
 * Unified Azure Policy Set Definition (Initiative) implementation
 *
 * This class provides a single, version-aware implementation for managing Azure
 * Policy Set Definitions. It automatically handles version resolution, schema validation,
 * and property transformation.
 *
 * Policy Set Definitions allow you to group multiple policy definitions together
 * and assign them as a single unit (also known as "Initiatives" in Azure Portal).
 *
 * Note: Policy set definitions are created at subscription or management group scope.
 * They do not have a location property as they are not region-specific.
 *
 * @example
 * const initiative = new PolicySetDefinition(this, "security-initiative", {
 *   displayName: "Security Baseline",
 *   scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
 *   policyDefinitions: [
 *     {
 *       policyDefinitionId: "/providers/Microsoft.Authorization/policyDefinitions/abc123",
 *       policyDefinitionReferenceId: "auditVMsWithoutExtensions",
 *     },
 *   ],
 * });
 *
 * @stability stable
 */
export class PolicySetDefinition extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      POLICY_SET_DEFINITION_TYPE,
      ALL_POLICY_SET_DEFINITION_VERSIONS,
    );
  }

  /**
   * The input properties for this Policy Set Definition instance
   */
  public readonly props: PolicySetDefinitionProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly policySetDefinitionIdOutput: cdktf.TerraformOutput;

  /**
   * Creates a new Azure Policy Set Definition using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Policy Set Definition
   */
  constructor(scope: Construct, id: string, props: PolicySetDefinitionProps) {
    // Validate required properties
    if (!props.displayName || props.displayName.trim() === "") {
      throw new Error("displayName is required for policy set definitions");
    }

    if (!props.policyDefinitions || props.policyDefinitions.length === 0) {
      throw new Error(
        "At least one policy definition reference is required in policyDefinitions",
      );
    }

    // Validate policy definition references
    props.policyDefinitions.forEach((policyDef, index) => {
      if (!policyDef.policyDefinitionId) {
        throw new Error(
          `policyDefinitionId is required for policy definition at index ${index}`,
        );
      }
    });

    // Validate policy definition groups if provided
    if (props.policyDefinitionGroups) {
      const groupNames = new Set<string>();
      props.policyDefinitionGroups.forEach((group, index) => {
        if (!group.name) {
          throw new Error(
            `name is required for policy definition group at index ${index}`,
          );
        }
        if (groupNames.has(group.name)) {
          throw new Error(
            `Duplicate group name '${group.name}' in policyDefinitionGroups`,
          );
        }
        groupNames.add(group.name);
      });

      // Validate that policy definitions reference valid groups
      const validGroupNames = Array.from(groupNames);
      props.policyDefinitions.forEach((policyDef, index) => {
        if (policyDef.groupNames) {
          policyDef.groupNames.forEach((groupName) => {
            if (!validGroupNames.includes(groupName)) {
              throw new Error(
                `Policy definition at index ${index} references unknown group '${groupName}'. Valid groups are: ${validGroupNames.join(", ")}`,
              );
            }
          });
        }
      });
    }

    super(scope, id, props);

    this.props = props;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Policy Set Definition",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Policy Set Definition",
    });

    this.policySetDefinitionIdOutput = new cdktf.TerraformOutput(
      this,
      "policy_set_definition_id",
      {
        value: this.id,
        description:
          "The Policy Set Definition ID (same as id, for use in policy assignments)",
      },
    );

    // Override logical IDs to match original naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.policySetDefinitionIdOutput.overrideLogicalId(
      "policy_set_definition_id",
    );
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   * Returns the most recent stable version as the default
   */
  protected defaultVersion(): string {
    return "2023-04-01";
  }

  /**
   * Gets the Azure resource type for Policy Set Definitions
   */
  protected resourceType(): string {
    return POLICY_SET_DEFINITION_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   * Uses the framework's schema resolution to get the appropriate schema
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Overrides the name resolution to generate deterministic GUIDs for policy set definitions
   *
   * Policy set definitions can use custom names or auto-generated GUIDs.
   * This implementation generates a deterministic UUID based on the policy set definition's
   * key properties if no name is provided.
   */
  protected resolveName(props: AzapiResourceProps): string {
    const typedProps = props as PolicySetDefinitionProps;

    // If name is provided, use it
    if (typedProps.name) {
      return typedProps.name;
    }

    // Generate a deterministic GUID based on display name and scope
    const hashInput = [typedProps.displayName, typedProps.scope].join("|");

    const hash = createHash("sha256").update(hashInput).digest("hex");

    // Convert hash to UUID format (8-4-4-4-12)
    return [
      hash.substring(0, 8),
      hash.substring(8, 12),
      hash.substring(12, 16),
      hash.substring(16, 20),
      hash.substring(20, 32),
    ].join("-");
  }

  /**
   * Creates the resource body for the Azure API call
   * Transforms the input properties into the JSON format expected by Azure REST API
   *
   * Note: Policy set definitions do not have a location property as they are
   * scope-specific resources deployed at subscription or management group level.
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as PolicySetDefinitionProps;

    const body: any = {
      properties: {
        displayName: typedProps.displayName,
        policyType: typedProps.policyType || "Custom",
        policyDefinitions: typedProps.policyDefinitions,
      },
    };

    // Add optional properties only if specified
    if (typedProps.description) {
      body.properties.description = typedProps.description;
    }

    if (typedProps.metadata) {
      body.properties.metadata = typedProps.metadata;
    }

    if (typedProps.parameters) {
      body.properties.parameters = typedProps.parameters;
    }

    if (
      typedProps.policyDefinitionGroups &&
      typedProps.policyDefinitionGroups.length > 0
    ) {
      body.properties.policyDefinitionGroups =
        typedProps.policyDefinitionGroups;
    }

    return body;
  }

  /**
   * Resolves the parent resource ID for Policy Set Definition
   * Policy Set Definitions are created at subscription or management group scope
   *
   * @param props - The resource properties
   * @returns The parent resource ID (the scope)
   */
  protected resolveParentId(props: any): string {
    return (props as PolicySetDefinitionProps).scope;
  }

  // =============================================================================
  // PUBLIC METHODS FOR POLICY SET DEFINITION OPERATIONS
  // =============================================================================

  /**
   * Get the full resource identifier for use in policy assignments
   * Alias for the id property
   */
  public get policySetDefinitionId(): string {
    return this.id;
  }

  /**
   * Get the display name of the policy set definition
   */
  public get displayName(): string {
    return this.props.displayName;
  }

  /**
   * Get the policy type
   */
  public get policyType(): string {
    return this.props.policyType || "Custom";
  }

  /**
   * Get the number of policy definitions in this set
   */
  public get policyDefinitionCount(): number {
    return this.props.policyDefinitions.length;
  }
}
