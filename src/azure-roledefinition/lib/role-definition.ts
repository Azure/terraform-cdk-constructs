/**
 * Unified Azure Role Definition implementation using VersionedAzapiResource framework
 *
 * This class provides a version-aware implementation for managing Azure Role Definitions
 * using the AZAPI provider. Role definitions define custom RBAC roles with specific
 * permissions that can be assigned to users, groups, or service principals.
 *
 * Supported API Versions:
 * - 2022-04-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Support for custom role permissions (actions, notActions, dataActions, notDataActions)
 * - Assignable scopes configuration (subscription, resource group, management group)
 * - JSII compliance for multi-language support
 */

import { createHash } from "crypto";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_ROLE_DEFINITION_VERSIONS,
  ROLE_DEFINITION_TYPE,
} from "./role-definition-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Permission configuration for role definitions
 * Defines what actions the role can perform on control plane and data plane
 */
export interface RoleDefinitionPermission {
  /**
   * Array of allowed control plane actions
   * Actions are operations that can be performed on Azure resources
   *
   * @example ["Microsoft.Compute/virtualMachines/read", "Microsoft.Compute/virtualMachines/start/action"]
   */
  readonly actions?: string[];

  /**
   * Array of excluded control plane actions
   * Actions that are explicitly denied even if included in actions array
   *
   * @example ["Microsoft.Compute/virtualMachines/delete"]
   */
  readonly notActions?: string[];

  /**
   * Array of allowed data plane actions
   * Data actions are operations that can be performed on data within resources
   *
   * @example ["Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read"]
   */
  readonly dataActions?: string[];

  /**
   * Array of excluded data plane actions
   * Data actions that are explicitly denied
   *
   * @example ["Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete"]
   */
  readonly notDataActions?: string[];
}

/**
 * Properties for the unified Azure Role Definition
 *
 * Extends AzapiResourceProps with Role Definition specific properties
 */
export interface RoleDefinitionProps extends AzapiResourceProps {
  /**
   * The name of the role definition
   * This is the display name shown in the Azure portal
   * Required property
   *
   * @example "Virtual Machine Reader"
   */
  readonly roleName: string;

  /**
   * The role definition description
   * Provides detailed information about what the role allows
   *
   * @example "Can view virtual machines and their properties"
   */
  readonly description?: string;

  /**
   * The type of role definition
   * @default "CustomRole"
   * @example "CustomRole", "BuiltInRole"
   */
  readonly type?: string;

  /**
   * An array of permissions objects that define what actions the role can perform
   * Required property
   *
   * @example
   * [
   *   {
   *     actions: ["Microsoft.Compute/virtualMachines/read"],
   *     notActions: [],
   *     dataActions: [],
   *     notDataActions: []
   *   }
   * ]
   */
  readonly permissions: RoleDefinitionPermission[];

  /**
   * An array of scopes where this role can be assigned
   * Can include subscription, resource group, or management group scopes
   * Required property
   *
   * @example ["/subscriptions/00000000-0000-0000-0000-000000000000"]
   * @example ["/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-name"]
   */
  readonly assignableScopes: string[];

  /**
   * The lifecycle rules to ignore changes
   * @example ["description"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Properties interface for Azure Role Definition
 * This is required for JSII compliance to support multi-language code generation
 */
export interface RoleDefinitionProperties {
  /**
   * The name of the role definition
   */
  readonly roleName: string;

  /**
   * The role definition description
   */
  readonly description?: string;

  /**
   * The type of role definition
   */
  readonly type?: string;

  /**
   * An array of permissions objects
   */
  readonly permissions: RoleDefinitionPermission[];

  /**
   * An array of assignable scopes
   */
  readonly assignableScopes: string[];
}

/**
 * The resource body interface for Azure Role Definition API calls
 * This matches the Azure REST API schema for role definitions
 */
export interface RoleDefinitionBody {
  /**
   * The properties of the role definition
   */
  readonly properties: RoleDefinitionProperties;
}

/**
 * Unified Azure Role Definition implementation
 *
 * This class provides a single, version-aware implementation for managing Azure
 * Role Definitions. It automatically handles version resolution, schema validation,
 * and property transformation.
 *
 * Note: Role definitions are tenant-specific resources deployed at subscription or
 * management group scope. Unlike most Azure resources, they do not have a location
 * property as they are not region-specific.
 *
 * @example
 * Basic custom role definition for read-only access to compute resources
 *
 * Advanced features like data plane actions and complex permissions are supported
 *
 * @stability stable
 */
export class RoleDefinition extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      ROLE_DEFINITION_TYPE,
      ALL_ROLE_DEFINITION_VERSIONS,
    );
  }

  /**
   * The input properties for this Role Definition instance
   */
  public readonly props: RoleDefinitionProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure Role Definition using the VersionedAzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Role Definition
   */
  constructor(scope: Construct, id: string, props: RoleDefinitionProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Role Definition",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Role Definition",
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
    return "2022-04-01";
  }

  /**
   * Gets the Azure resource type for Role Definitions
   */
  protected resourceType(): string {
    return ROLE_DEFINITION_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   * Uses the framework's schema resolution to get the appropriate schema
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Overrides the name resolution to generate deterministic GUIDs for role definitions
   *
   * Role definitions require GUID format IDs. This implementation generates a deterministic
   * UUID based on the role definition's key properties to ensure:
   * - Same GUID is generated on re-deployments with same parameters
   * - Idempotent deployments (no duplicate role definitions)
   * - Consistent behavior across deployment runs
   */
  protected resolveName(props: AzapiResourceProps): string {
    const typedProps = props as RoleDefinitionProps;

    // Create a deterministic hash from key role definition properties
    const hashInput = [
      typedProps.roleName,
      JSON.stringify(typedProps.assignableScopes),
    ].join("|");

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
   * Note: Role definitions do not have a location property as they are
   * tenant-specific resources deployed at subscription or management group scope.
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as RoleDefinitionProps;
    return {
      properties: {
        roleName: typedProps.roleName,
        description: typedProps.description,
        type: typedProps.type || "CustomRole",
        permissions: typedProps.permissions,
        assignableScopes: typedProps.assignableScopes,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR ROLE DEFINITION OPERATIONS
  // =============================================================================

  /**
   * Get the full resource identifier for use in other Azure resources
   * Alias for the id property
   */
  public get resourceId(): string {
    return this.id;
  }

  /**
   * Get the role name
   */
  public get roleName(): string {
    return this.props.roleName;
  }

  /**
   * Get the role type
   */
  public get roleType(): string {
    return this.props.type || "CustomRole";
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Applies ignore changes lifecycle rules if specified in props
   * Always includes body.properties.assignableScopes to handle Azure API format normalization
   */
  private _applyIgnoreChanges(): void {
    // Always ignore assignableScopes format changes due to Azure API normalization
    // Azure may return subscription-qualified format but accepts non-qualified format
    const ignoreChanges = [
      "body.properties.assignableScopes",
      ...(this.props.ignoreChanges || []),
    ];

    this.terraformResource.addOverride("lifecycle", {
      ignore_changes: ignoreChanges,
    });
  }
}
