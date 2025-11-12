/**
 * API schemas for Azure Action Group across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Insights/actionGroups
 * across all supported API versions. The schemas are used by the AzapiResource
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
 * Common property definitions shared across all Action Group versions
 */
const COMMON_ACTION_GROUP_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Azure region (global for action groups)",
    defaultValue: "global",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Action Groups",
      },
    ],
  },
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the action group",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,258}[a-zA-Z0-9_]$",
        message: "Action group name must be 2-260 characters",
      },
    ],
  },
  groupShortName: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Short name for SMS notifications (max 12 chars)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Short name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9]{1,12}$",
        message: "Short name must be 1-12 alphanumeric characters",
      },
    ],
  },
  enabled: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: true,
    description: "Enable the action group",
  },
  emailReceivers: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Email notification receivers",
  },
  smsReceivers: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "SMS notification receivers",
  },
  webhookReceivers: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Webhook notification receivers",
  },
  azureFunctionReceivers: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Azure Function receivers",
  },
  logicAppReceivers: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Logic App receivers",
  },
  voiceReceivers: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Voice call receivers",
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description: "Resource tags",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Tags must be an object with string key-value pairs",
      },
    ],
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Action Group version 2021-09-01
 */
export const ACTION_GROUP_SCHEMA_2021_09_01: ApiSchema = {
  resourceType: "Microsoft.Insights/actionGroups",
  version: "2021-09-01",
  properties: {
    ...COMMON_ACTION_GROUP_PROPERTIES,
  },
  required: ["location", "name", "groupShortName"],
  optional: [
    "enabled",
    "emailReceivers",
    "smsReceivers",
    "webhookReceivers",
    "azureFunctionReceivers",
    "logicAppReceivers",
    "voiceReceivers",
    "tags",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Action Groups",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Action Groups",
        },
      ],
    },
    {
      property: "groupShortName",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Short name is required for Action Groups",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Action Group 2021-09-01
 */
export const ACTION_GROUP_VERSION_2021_09_01: VersionConfig = {
  version: "2021-09-01",
  schema: ACTION_GROUP_SCHEMA_2021_09_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2021-09-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/action-group/migration-2021-09-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Stable API version for Action Groups",
      breaking: false,
    },
  ],
};

/**
 * All supported Action Group versions for registration
 */
export const ALL_ACTION_GROUP_VERSIONS: VersionConfig[] = [
  ACTION_GROUP_VERSION_2021_09_01,
];

/**
 * Resource type constant
 */
export const ACTION_GROUP_TYPE = "Microsoft.Insights/actionGroups";
