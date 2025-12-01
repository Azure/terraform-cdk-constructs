/**
 * API schemas for Azure Policy Assignment across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Authorization/policyAssignments
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
 * Common property definitions shared across all Policy Assignment versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The name of the policy assignment. Must be unique within the scope",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9_-]+$",
        message:
          "Policy assignment name can only contain alphanumeric characters, underscores, and hyphens",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 64 },
        message: "Policy assignment name must be between 1 and 64 characters",
      },
    ],
  },
  policyDefinitionId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The policy definition ID to assign. This can be a built-in or custom policy definition",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Policy definition ID is required for policy assignments",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "Policy definition ID must be a string",
      },
    ],
  },
  scope: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The scope at which the policy assignment is applied (subscription, resource group, or resource)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Scope is required for policy assignments",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "Scope must be a string",
      },
    ],
  },
  displayName: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The display name of the policy assignment",
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
      "The policy assignment description. Provides detailed information about the assignment",
    validation: [
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 0, maxLength: 512 },
        message: "Description must not exceed 512 characters",
      },
    ],
  },
  enforcementMode: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Default",
    description:
      "The enforcement mode of the policy assignment. Valid values: Default, DoNotEnforce",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Default|DoNotEnforce)$",
        message: "Enforcement mode must be either Default or DoNotEnforce",
      },
    ],
  },
  parameters: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Parameters for the policy assignment. Provides values for parameters defined in the policy definition",
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
      "Metadata for the policy assignment. Used to store additional information like assignedBy, parameterScopes, etc.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Metadata must be a valid JSON object",
      },
    ],
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "The managed identity associated with the policy assignment. Required for policies with deployIfNotExists or modify effects",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Identity must be a valid JSON object",
      },
    ],
  },
  notScopes: {
    dataType: PropertyType.ARRAY,
    required: false,
    description:
      "The policy's excluded scopes. Resources within these scopes will not be evaluated by the policy",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.ARRAY,
        message: "NotScopes must be an array of strings",
      },
    ],
  },
  nonComplianceMessages: {
    dataType: PropertyType.ARRAY,
    required: false,
    description:
      "The non-compliance messages for the policy assignment. Provides custom messages when resources are non-compliant",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.ARRAY,
        message: "NonComplianceMessages must be an array of objects",
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
 * API Schema for Policy Assignment version 2022-06-01
 * This is the latest stable API version for policy assignments
 */
export const POLICY_ASSIGNMENT_SCHEMA_2022_06_01: ApiSchema = {
  resourceType: "Microsoft.Authorization/policyAssignments",
  version: "2022-06-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["policyDefinitionId", "scope"],
  optional: [
    "name",
    "displayName",
    "description",
    "enforcementMode",
    "parameters",
    "metadata",
    "identity",
    "notScopes",
    "nonComplianceMessages",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "policyDefinitionId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Policy definition ID is required for policy assignments",
        },
      ],
    },
    {
      property: "scope",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Scope is required for policy assignments",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Policy Assignment 2022-06-01
 */
export const POLICY_ASSIGNMENT_VERSION_2022_06_01: VersionConfig = {
  version: "2022-06-01",
  schema: POLICY_ASSIGNMENT_SCHEMA_2022_06_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2022-06-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/policy-assignment/migration-2022-06-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release of Policy Assignment API with full support for enforcement modes, identity, and non-compliance messages",
      breaking: false,
    },
  ],
};

/**
 * All supported Policy Assignment versions for registration
 */
export const ALL_POLICY_ASSIGNMENT_VERSIONS: VersionConfig[] = [
  POLICY_ASSIGNMENT_VERSION_2022_06_01,
];

/**
 * Resource type constant
 */
export const POLICY_ASSIGNMENT_TYPE =
  "Microsoft.Authorization/policyAssignments";
