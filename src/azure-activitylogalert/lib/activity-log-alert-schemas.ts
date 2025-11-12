/**
 * API schemas for Azure Activity Log Alert across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Insights/activityLogAlerts
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
 * Common property definitions shared across all Activity Log Alert versions
 */
const COMMON_ACTIVITY_LOG_ALERT_PROPERTIES: {
  [key: string]: PropertyDefinition;
} = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Azure region (global for activity log alerts)",
    defaultValue: "global",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Activity Log Alerts",
      },
    ],
  },
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the activity log alert",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required",
      },
    ],
  },
  description: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Description of the alert rule",
  },
  enabled: {
    dataType: PropertyType.BOOLEAN,
    required: true,
    defaultValue: true,
    description: "Enable the alert rule",
  },
  scopes: {
    dataType: PropertyType.ARRAY,
    required: true,
    description: "Resource IDs that this alert is scoped to",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "At least one scope is required",
      },
    ],
  },
  condition: {
    dataType: PropertyType.OBJECT,
    required: true,
    description: "Alert condition with field-value pairs",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Condition is required",
      },
    ],
  },
  actions: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Action groups to notify",
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
 * API Schema for Activity Log Alert version 2020-10-01
 */
export const ACTIVITY_LOG_ALERT_SCHEMA_2020_10_01: ApiSchema = {
  resourceType: "Microsoft.Insights/activityLogAlerts",
  version: "2020-10-01",
  properties: {
    ...COMMON_ACTIVITY_LOG_ALERT_PROPERTIES,
  },
  required: ["location", "name", "enabled", "scopes", "condition"],
  optional: ["description", "actions", "tags"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Activity Log Alerts",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Activity Log Alerts",
        },
      ],
    },
    {
      property: "scopes",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "At least one scope is required",
        },
      ],
    },
    {
      property: "condition",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Condition is required",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Activity Log Alert 2020-10-01
 */
export const ACTIVITY_LOG_ALERT_VERSION_2020_10_01: VersionConfig = {
  version: "2020-10-01",
  schema: ACTIVITY_LOG_ALERT_SCHEMA_2020_10_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2020-10-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/activity-log-alert/migration-2020-10-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Stable API version for Activity Log Alerts",
      breaking: false,
    },
  ],
};

/**
 * All supported Activity Log Alert versions for registration
 */
export const ALL_ACTIVITY_LOG_ALERT_VERSIONS: VersionConfig[] = [
  ACTIVITY_LOG_ALERT_VERSION_2020_10_01,
];

/**
 * Resource type constant
 */
export const ACTIVITY_LOG_ALERT_TYPE = "Microsoft.Insights/activityLogAlerts";
