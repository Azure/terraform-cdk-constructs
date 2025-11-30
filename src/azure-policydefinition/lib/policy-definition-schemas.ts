/**
 * API schemas for Azure Policy Definition across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Authorization/policyDefinitions
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
 * Common property definitions shared across all Policy Definition versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The name of the policy definition. Must be unique within the scope (subscription or management group)",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9_-]+$",
        message:
          "Policy definition name can only contain alphanumeric characters, underscores, and hyphens",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 64 },
        message: "Policy definition name must be between 1 and 64 characters",
      },
    ],
  },
  displayName: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The display name of the policy definition",
    validation: [
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
      "The policy definition description. Provides detailed information about what the policy enforces",
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
      "The type of policy definition. Valid values: NotSpecified, BuiltIn, Static, Custom",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(NotSpecified|BuiltIn|Static|Custom)$",
        message:
          "Policy type must be one of: NotSpecified, BuiltIn, Static, Custom",
      },
    ],
  },
  mode: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "All",
    description:
      "The policy mode. Determines which resource types will be evaluated. Valid values: All, Indexed, or resource provider modes",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "Mode must be a string value",
      },
    ],
  },
  policyRule: {
    dataType: PropertyType.OBJECT,
    required: true,
    description:
      "The policy rule as a JSON object containing if/then logic that defines the policy enforcement",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Policy rule is required for policy definitions",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Policy rule must be a valid JSON object",
      },
    ],
  },
  parameters: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Parameters for the policy definition. Allows policy assignments to provide values that are used in the policy rule",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Parameters must be a valid JSON object",
      },
    ],
  },
  metadata: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Metadata for the policy definition. Used to store additional information like category, version, etc.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Metadata must be a valid JSON object",
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
 * API Schema for Policy Definition version 2021-06-01
 * This is the latest stable API version for policy definitions
 */
export const POLICY_DEFINITION_SCHEMA_2021_06_01: ApiSchema = {
  resourceType: "Microsoft.Authorization/policyDefinitions",
  version: "2021-06-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["policyRule"],
  optional: [
    "name",
    "displayName",
    "description",
    "policyType",
    "mode",
    "parameters",
    "metadata",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "policyRule",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Policy rule is required for policy definitions",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Policy Definition 2021-06-01
 */
export const POLICY_DEFINITION_VERSION_2021_06_01: VersionConfig = {
  version: "2021-06-01",
  schema: POLICY_DEFINITION_SCHEMA_2021_06_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2021-06-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/policy-definition/migration-2021-06-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release of Policy Definition API with full support for custom policies",
      breaking: false,
    },
  ],
};

/**
 * All supported Policy Definition versions for registration
 */
export const ALL_POLICY_DEFINITION_VERSIONS: VersionConfig[] = [
  POLICY_DEFINITION_VERSION_2021_06_01,
];

/**
 * Resource type constant
 */
export const POLICY_DEFINITION_TYPE =
  "Microsoft.Authorization/policyDefinitions";
