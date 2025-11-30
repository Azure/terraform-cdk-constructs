/**
 * API schemas for Azure Role Definition across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Authorization/roleDefinitions
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
 * Common property definitions shared across all Role Definition versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The name of the role definition resource. Automatically generated as a GUID by Terraform's guid() function",
    validation: [
      // Note: No pattern validation here because the name will be a Terraform function
      // guid() that gets evaluated at apply time, not synthesis time.
      // Azure will validate the final GUID format when the resource is created.
    ],
  },
  roleName: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The name of the role definition. This is the display name shown in the Azure portal",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Role name is required for role definitions",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 128 },
        message: "Role name must be between 1 and 128 characters",
      },
    ],
  },
  description: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The role definition description. Provides detailed information about what the role allows",
    validation: [
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 0, maxLength: 1024 },
        message: "Description must not exceed 1024 characters",
      },
    ],
  },
  type: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "CustomRole",
    description:
      "The type of role definition. Valid values: BuiltInRole, CustomRole",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(BuiltInRole|CustomRole)$",
        message: "Role type must be either BuiltInRole or CustomRole",
      },
    ],
  },
  permissions: {
    dataType: PropertyType.ARRAY,
    required: true,
    description:
      "An array of permissions objects that define what actions the role can perform",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Permissions are required for role definitions",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.ARRAY,
        message: "Permissions must be an array of permission objects",
      },
    ],
  },
  assignableScopes: {
    dataType: PropertyType.ARRAY,
    required: true,
    description:
      "An array of scopes where this role can be assigned (subscription, resource group, or management group)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Assignable scopes are required for role definitions",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.ARRAY,
        message: "Assignable scopes must be an array of scope strings",
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
 * API Schema for Role Definition version 2022-04-01
 * This is the latest stable API version for role definitions
 */
export const ROLE_DEFINITION_SCHEMA_2022_04_01: ApiSchema = {
  resourceType: "Microsoft.Authorization/roleDefinitions",
  version: "2022-04-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["roleName", "permissions", "assignableScopes"],
  optional: ["name", "description", "type", "ignoreChanges"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "roleName",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Role name is required for role definitions",
        },
      ],
    },
    {
      property: "permissions",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Permissions are required for role definitions",
        },
      ],
    },
    {
      property: "assignableScopes",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Assignable scopes are required for role definitions",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Role Definition 2022-04-01
 */
export const ROLE_DEFINITION_VERSION_2022_04_01: VersionConfig = {
  version: "2022-04-01",
  schema: ROLE_DEFINITION_SCHEMA_2022_04_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2022-04-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/role-definition/migration-2022-04-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release of Role Definition API with full support for custom RBAC roles",
      breaking: false,
    },
  ],
};

/**
 * All supported Role Definition versions for registration
 */
export const ALL_ROLE_DEFINITION_VERSIONS: VersionConfig[] = [
  ROLE_DEFINITION_VERSION_2022_04_01,
];

/**
 * Resource type constant
 */
export const ROLE_DEFINITION_TYPE = "Microsoft.Authorization/roleDefinitions";
