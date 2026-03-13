/**
 * API schemas for Azure Policy Set Definition (Initiative) across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Authorization/policySetDefinitions
 * across all supported API versions. The schemas are used by the AzapiResource
 * framework for validation, transformation, and version management.
 *
 * Policy Set Definitions (also known as Initiatives) are collections of policy definitions
 * that allow you to group policies and assign them together as a single unit.
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
 * Common property definitions shared across all Policy Set Definition versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The name of the policy set definition resource. Automatically generated as a GUID if not provided.",
    validation: [],
  },
  displayName: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The display name of the policy set definition shown in the Azure portal",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Display name is required for policy set definitions",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 128 },
        message: "Display name must be between 1 and 128 characters",
      },
    ],
  },
  description: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The description of the policy set definition explaining its purpose and scope",
    validation: [
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 0, maxLength: 512 },
        message: "Description must not exceed 512 characters",
      },
    ],
  },
  policyType: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Custom",
    description:
      "The type of policy set definition. Valid values: BuiltIn, Custom, Static",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(BuiltIn|Custom|Static)$",
        message: "Policy type must be BuiltIn, Custom, or Static",
      },
    ],
  },
  metadata: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Metadata object for categorization including category, version, preview, and deprecated flags",
  },
  parameters: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Parameter definitions that can be used by policy definitions in the set",
  },
  policyDefinitions: {
    dataType: PropertyType.ARRAY,
    required: true,
    description:
      "Array of policy definition references included in this policy set",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message:
          "Policy definitions array is required for policy set definitions",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.ARRAY,
        message:
          "Policy definitions must be an array of policy definition references",
      },
    ],
  },
  policyDefinitionGroups: {
    dataType: PropertyType.ARRAY,
    required: false,
    description:
      "Groups for organizing policy definitions within the policy set",
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Policy Set Definition version 2023-04-01
 *
 * This is the latest stable version for Policy Set Definitions.
 * It includes support for:
 * - Policy definition references with parameters
 * - Policy definition groups for organization
 * - Metadata for categorization
 * - Parameter definitions for the initiative
 */
export const POLICY_SET_DEFINITION_SCHEMA_2023_04_01: ApiSchema = {
  resourceType: "Microsoft.Authorization/policySetDefinitions",
  version: "2023-04-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["displayName", "policyDefinitions"],
  optional: [
    "name",
    "description",
    "policyType",
    "metadata",
    "parameters",
    "policyDefinitionGroups",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "displayName",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Display name is required for policy set definitions",
        },
      ],
    },
    {
      property: "policyDefinitions",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message:
            "Policy definitions array is required for policy set definitions",
        },
      ],
    },
  ],
};

/**
 * API Schema for Policy Set Definition version 2021-06-01
 *
 * This is a stable version for backward compatibility.
 * It includes support for:
 * - Policy definition references with parameters
 * - Policy definition groups for organization
 * - Metadata for categorization
 * - Parameter definitions for the initiative
 */
export const POLICY_SET_DEFINITION_SCHEMA_2021_06_01: ApiSchema = {
  resourceType: "Microsoft.Authorization/policySetDefinitions",
  version: "2021-06-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["displayName", "policyDefinitions"],
  optional: [
    "name",
    "description",
    "policyType",
    "metadata",
    "parameters",
    "policyDefinitionGroups",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "displayName",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Display name is required for policy set definitions",
        },
      ],
    },
    {
      property: "policyDefinitions",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message:
            "Policy definitions array is required for policy set definitions",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Policy Set Definition 2023-04-01
 */
export const POLICY_SET_DEFINITION_VERSION_2023_04_01: VersionConfig = {
  version: "2023-04-01",
  schema: POLICY_SET_DEFINITION_SCHEMA_2023_04_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2023-04-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/policy-set-definition/migration-2023-04-01",
  changeLog: [
    {
      changeType: "updated",
      description:
        "Latest stable API version for Policy Set Definitions with enhanced validation",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Policy Set Definition 2021-06-01
 */
export const POLICY_SET_DEFINITION_VERSION_2021_06_01: VersionConfig = {
  version: "2021-06-01",
  schema: POLICY_SET_DEFINITION_SCHEMA_2021_06_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2021-06-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/policy-set-definition/migration-2021-06-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Stable API version for backward compatibility",
      breaking: false,
    },
  ],
};

/**
 * All supported Policy Set Definition versions for registration
 * Ordered with latest stable version first
 */
export const ALL_POLICY_SET_DEFINITION_VERSIONS: VersionConfig[] = [
  POLICY_SET_DEFINITION_VERSION_2023_04_01,
  POLICY_SET_DEFINITION_VERSION_2021_06_01,
];

/**
 * Resource type constant
 */
export const POLICY_SET_DEFINITION_TYPE =
  "Microsoft.Authorization/policySetDefinitions";
