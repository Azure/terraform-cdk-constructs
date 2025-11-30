/**
 * API schemas for Azure Role Assignment across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Authorization/roleAssignments
 * across all supported API versions. The schemas are used by the VersionedAzapiResource
 * framework for validation, transformation, and version management.
 */

import {
  ApiSchema,
  PropertyDefinition,
  PropertyType,
  ValidationRuleType,
  VersionConfig,
  VersionSupportLevel,
} from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

// =============================================================================
// COMMON PROPERTY DEFINITIONS
// =============================================================================

/**
 * Common property definitions shared across all Role Assignment versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The name of the role assignment resource. Automatically generated as a GUID by Terraform's guid() function",
    validation: [
      // Note: No pattern validation here because the name will be a Terraform function
      // guid() that gets evaluated at apply time, not synthesis time.
      // Azure will validate the final GUID format when the resource is created.
    ],
  },
  roleDefinitionId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The role definition ID to assign. This can be a built-in or custom role definition",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Role definition ID is required for role assignments",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "Role definition ID must be a string",
      },
    ],
  },
  principalId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The principal ID (object ID) to which the role is assigned. This can be a user, group, service principal, or managed identity",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Principal ID is required for role assignments",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "Principal ID must be a string",
      },
    ],
  },
  scope: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The scope at which the role assignment is applied (subscription, resource group, or resource)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Scope is required for role assignments",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "Scope must be a string",
      },
    ],
  },
  principalType: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The type of principal. Valid values: User, Group, ServicePrincipal, ForeignGroup, Device",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(User|Group|ServicePrincipal|ForeignGroup|Device)$",
        message:
          "Principal type must be one of: User, Group, ServicePrincipal, ForeignGroup, Device",
      },
    ],
  },
  description: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The role assignment description. Provides detailed information about the assignment",
    validation: [
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 0, maxLength: 512 },
        message: "Description must not exceed 512 characters",
      },
    ],
  },
  condition: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The conditions on the role assignment. This limits the resources it applies to using ABAC expressions",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "Condition must be a string",
      },
    ],
  },
  conditionVersion: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Version of the condition syntax. Current supported version is 2.0",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^2\\.0$",
        message: "Condition version must be 2.0",
      },
    ],
  },
  delegatedManagedIdentityResourceId: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The delegated Azure Resource Id which contains a Managed Identity. Applicable only when the principalType is Group",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "Delegated managed identity resource ID must be a string",
      },
    ],
  },
  ignoreChanges: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Array of property names to ignore during updates",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.ARRAY,
        message: "IgnoreChanges must be an array of strings",
      },
    ],
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Role Assignment version 2022-04-01
 * This is the latest stable API version for role assignments
 */
export const ROLE_ASSIGNMENT_SCHEMA_2022_04_01: ApiSchema = {
  resourceType: "Microsoft.Authorization/roleAssignments",
  version: "2022-04-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["roleDefinitionId", "principalId", "scope"],
  optional: [
    "name",
    "principalType",
    "description",
    "condition",
    "conditionVersion",
    "delegatedManagedIdentityResourceId",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "roleDefinitionId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Role definition ID is required for role assignments",
        },
      ],
    },
    {
      property: "principalId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Principal ID is required for role assignments",
        },
      ],
    },
    {
      property: "scope",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Scope is required for role assignments",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Role Assignment 2022-04-01
 */
export const ROLE_ASSIGNMENT_VERSION_2022_04_01: VersionConfig = {
  version: "2022-04-01",
  schema: ROLE_ASSIGNMENT_SCHEMA_2022_04_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2022-04-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/role-assignment/migration-2022-04-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release of Role Assignment API with full support for RBAC role assignments, conditional assignments (ABAC), and delegated managed identities",
      breaking: false,
    },
  ],
};

/**
 * All supported Role Assignment versions for registration
 */
export const ALL_ROLE_ASSIGNMENT_VERSIONS: VersionConfig[] = [
  ROLE_ASSIGNMENT_VERSION_2022_04_01,
];

/**
 * Resource type constant
 */
export const ROLE_ASSIGNMENT_TYPE = "Microsoft.Authorization/roleAssignments";
