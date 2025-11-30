/**
 * Unified Azure Policy Assignment implementation using VersionedAzapiResource framework
 *
 * This class provides a version-aware implementation for managing Azure Policy Assignments
 * using the AZAPI provider. Policy assignments apply policy definitions to specific scopes
 * (subscription, resource group, or resource) and can provide parameter values and
 * enforcement settings.
 *
 * Supported API Versions:
 * - 2022-06-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Support for enforcement modes (Default, DoNotEnforce)
 * - Managed identity support for remediation policies
 * - Custom non-compliance messages
 * - Scope exclusions (notScopes)
 * - JSII compliance for multi-language support
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_POLICY_ASSIGNMENT_VERSIONS,
  POLICY_ASSIGNMENT_TYPE,
} from "./policy-assignment-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Identity configuration for policy assignments
 * Required for policies with deployIfNotExists or modify effects
 */
export interface PolicyAssignmentIdentity {
  /**
   * The type of managed identity
   * @example "SystemAssigned", "UserAssigned", "None"
   */
  readonly type: string;

  /**
   * The user assigned identities associated with the policy assignment
   * Required when type is UserAssigned
   *
   * @example
   * {
   *   "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity": {}
   * }
   */
  readonly userAssignedIdentities?: { [key: string]: any };
}

/**
 * Non-compliance message configuration
 */
export interface PolicyAssignmentNonComplianceMessage {
  /**
   * The non-compliance message for the policy assignment
   */
  readonly message: string;

  /**
   * The policy definition reference ID within a policy set definition
   * Optional - if specified, this message applies only to the specified policy within the set
   */
  readonly policyDefinitionReferenceId?: string;
}

/**
 * Properties for the unified Azure Policy Assignment
 *
 * Extends AzapiResourceProps with Policy Assignment specific properties
 */
export interface PolicyAssignmentProps extends AzapiResourceProps {
  /**
   * The policy definition ID to assign
   * This can be a built-in or custom policy definition
   * Required property
   *
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/policy-name"
   * @example "/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d" (built-in)
   */
  readonly policyDefinitionId: string;

  /**
   * The scope at which the policy assignment is applied
   * Can be a subscription, resource group, or resource
   * Required property
   *
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000"
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-name"
   */
  readonly scope: string;

  /**
   * The display name of the policy assignment
   * Provides a human-readable name for the assignment
   *
   * @example "Require tag on resources in production"
   */
  readonly displayName?: string;

  /**
   * The policy assignment description
   * Provides detailed information about the assignment
   *
   * @example "Enforces required tags on all resources in production environment"
   */
  readonly description?: string;

  /**
   * The enforcement mode of the policy assignment
   * @default "Default"
   * @example "Default" - Policy effect is enforced during resource creation/update
   * @example "DoNotEnforce" - Policy effect is not enforced (audit only)
   */
  readonly enforcementMode?: string;

  /**
   * Parameters for the policy assignment
   * Provides values for parameters defined in the policy definition
   *
   * @example
   * {
   *   tagName: {
   *     value: "Environment"
   *   },
   *   tagValue: {
   *     value: "Production"
   *   }
   * }
   */
  readonly parameters?: any;

  /**
   * Metadata for the policy assignment
   * Used to store additional information like assignedBy, parameterScopes, etc.
   *
   * @example
   * {
   *   assignedBy: "admin@example.com",
   *   parameterScopes: {}
   * }
   */
  readonly metadata?: any;

  /**
   * The managed identity associated with the policy assignment
   * Required for policies with deployIfNotExists or modify effects
   *
   * @example
   * {
   *   type: "SystemAssigned"
   * }
   */
  readonly identity?: PolicyAssignmentIdentity;

  /**
   * The policy's excluded scopes
   * Resources within these scopes will not be evaluated by the policy
   *
   * @example ["/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/excluded-rg"]
   */
  readonly notScopes?: string[];

  /**
   * The non-compliance messages for the policy assignment
   * Provides custom messages when resources are non-compliant
   *
   * @example
   * [
   *   {
   *     message: "Resource must have the Environment tag"
   *   }
   * ]
   */
  readonly nonComplianceMessages?: PolicyAssignmentNonComplianceMessage[];

  /**
   * The lifecycle rules to ignore changes
   * @example ["metadata"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Properties interface for Azure Policy Assignment
 * This is required for JSII compliance to support multi-language code generation
 */
export interface PolicyAssignmentProperties {
  /**
   * The policy definition ID
   */
  readonly policyDefinitionId: string;

  /**
   * The scope of the policy assignment
   */
  readonly scope: string;

  /**
   * The display name of the policy assignment
   */
  readonly displayName?: string;

  /**
   * The policy assignment description
   */
  readonly description?: string;

  /**
   * The enforcement mode
   */
  readonly enforcementMode?: string;

  /**
   * Parameters for the policy assignment
   */
  readonly parameters?: any;

  /**
   * Metadata for the policy assignment
   */
  readonly metadata?: any;

  /**
   * The policy's excluded scopes
   */
  readonly notScopes?: string[];

  /**
   * The non-compliance messages
   */
  readonly nonComplianceMessages?: PolicyAssignmentNonComplianceMessage[];
}

/**
 * The resource body interface for Azure Policy Assignment API calls
 * This matches the Azure REST API schema for policy assignments
 */
export interface PolicyAssignmentBody {
  /**
   * The properties of the policy assignment
   */
  readonly properties: PolicyAssignmentProperties;

  /**
   * The managed identity associated with the policy assignment
   */
  readonly identity?: PolicyAssignmentIdentity;
}

/**
 * Unified Azure Policy Assignment implementation
 *
 * This class provides a single, version-aware implementation for managing Azure
 * Policy Assignments. It automatically handles version resolution, schema validation,
 * and property transformation.
 *
 * Note: Policy assignments can be deployed at subscription, resource group, or resource scope.
 * Like policy definitions, they do not have a location property as they are not region-specific.
 *
 * @example
 * // Basic policy assignment:
 * const assignment = new PolicyAssignment(this, "assignment", {
 *   name: "require-tag-assignment",
 *   policyDefinitionId: policyDefinition.id,
 *   scope: "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-name",
 *   displayName: "Require tag on resources",
 *   description: "Enforces required tags on resources"
 * });
 *
 * @example
 * // Policy assignment with parameters:
 * const assignment = new PolicyAssignment(this, "assignment", {
 *   name: "require-tag-assignment",
 *   policyDefinitionId: policyDefinition.id,
 *   scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
 *   parameters: {
 *     tagName: {
 *       value: "Environment"
 *     },
 *     tagValue: {
 *       value: "Production"
 *     }
 *   }
 * });
 *
 * @example
 * // Policy assignment with managed identity:
 * const assignment = new PolicyAssignment(this, "assignment", {
 *   name: "deploy-monitoring-assignment",
 *   policyDefinitionId: "/providers/Microsoft.Authorization/policyDefinitions/policy-id",
 *   scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
 *   identity: {
 *     type: "SystemAssigned"
 *   }
 * });
 *
 * @stability stable
 */
export class PolicyAssignment extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      POLICY_ASSIGNMENT_TYPE,
      ALL_POLICY_ASSIGNMENT_VERSIONS,
    );
  }

  /**
   * The input properties for this Policy Assignment instance
   */
  public readonly props: PolicyAssignmentProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure Policy Assignment using the VersionedAzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Policy Assignment
   */
  constructor(scope: Construct, id: string, props: PolicyAssignmentProps) {
    super(scope, id, props);

    this.props = props;

    // Validate that location is provided when identity is specified
    if (props.identity && !this.location) {
      throw new Error(
        `Location is required for Policy Assignment "${props.name || id}" when identity is specified. ` +
          `The managed identity must be provisioned in a specific Azure region.`,
      );
    }

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Policy Assignment",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Policy Assignment",
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
    return "2022-06-01";
  }

  /**
   * Gets the Azure resource type for Policy Assignments
   */
  protected resourceType(): string {
    return POLICY_ASSIGNMENT_TYPE;
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
   * Note: Policy assignments do not have a location property as they are
   * scoped resources (subscription, resource group, or resource level).
   * The scope property is NOT included in the body as it's read-only and
   * automatically derived from the parentId.
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as PolicyAssignmentProps;

    const body: any = {
      properties: {
        policyDefinitionId: typedProps.policyDefinitionId,
        // Note: scope is NOT included here - it's read-only and derived from parentId
        displayName: typedProps.displayName,
        description: typedProps.description,
        enforcementMode: typedProps.enforcementMode || "Default",
        parameters: typedProps.parameters,
        metadata: typedProps.metadata,
        notScopes: typedProps.notScopes,
        nonComplianceMessages: typedProps.nonComplianceMessages,
      },
    };

    // Add identity if provided
    if (typedProps.identity) {
      body.identity = typedProps.identity;
      // Azure requires location when identity is specified for managed identity provisioning
      body.location = typedProps.location;
    }

    return body;
  }

  /**
   * Overrides parent ID resolution to use the scope from props
   * Policy assignments are scoped resources where the scope IS the parent
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as PolicyAssignmentProps;
    return typedProps.scope;
  }

  // =============================================================================
  // PUBLIC METHODS FOR POLICY ASSIGNMENT OPERATIONS
  // =============================================================================

  /**
   * Get the full resource identifier for use in other Azure resources
   * Alias for the id property
   */
  public get resourceId(): string {
    return this.id;
  }

  /**
   * Get the policy definition ID this assignment references
   */
  public get policyDefinitionId(): string {
    return this.props.policyDefinitionId;
  }

  /**
   * Get the scope of this policy assignment
   */
  public get assignmentScope(): string {
    return this.props.scope;
  }

  /**
   * Get the enforcement mode
   */
  public get enforcementMode(): string {
    return this.props.enforcementMode || "Default";
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
