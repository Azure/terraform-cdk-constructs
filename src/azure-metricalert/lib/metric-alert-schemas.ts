/**
 * API schemas for Azure Metric Alert across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Insights/metricAlerts
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
 * Common property definitions shared across all Metric Alert versions
 */
const COMMON_METRIC_ALERT_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Azure region (global for metric alerts)",
    defaultValue: "global",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Metric Alerts",
      },
    ],
  },
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the metric alert",
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
  severity: {
    dataType: PropertyType.NUMBER,
    required: true,
    description:
      "Alert severity (0=Critical, 1=Error, 2=Warning, 3=Informational, 4=Verbose)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Severity is required",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { min: 0, max: 4 },
        message: "Severity must be between 0 and 4",
      },
    ],
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
  evaluationFrequency: {
    dataType: PropertyType.STRING,
    required: true,
    description: "How often the alert is evaluated (ISO 8601 duration)",
    defaultValue: "PT5M",
  },
  windowSize: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Time window for aggregation (ISO 8601 duration)",
    defaultValue: "PT15M",
  },
  targetResourceType: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Resource type of the target (for multi-resource alerts)",
  },
  targetResourceRegion: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Region of the target resource (for multi-resource alerts)",
  },
  criteria: {
    dataType: PropertyType.OBJECT,
    required: true,
    description: "Alert criteria (static or dynamic threshold)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Criteria is required",
      },
    ],
  },
  actions: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Action groups to notify",
  },
  autoMitigate: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: true,
    description: "Auto-resolve alerts when condition is no longer met",
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
 * API Schema for Metric Alert version 2018-03-01
 */
export const METRIC_ALERT_SCHEMA_2018_03_01: ApiSchema = {
  resourceType: "Microsoft.Insights/metricAlerts",
  version: "2018-03-01",
  properties: {
    ...COMMON_METRIC_ALERT_PROPERTIES,
  },
  required: [
    "location",
    "name",
    "severity",
    "enabled",
    "scopes",
    "evaluationFrequency",
    "windowSize",
    "criteria",
  ],
  optional: [
    "description",
    "targetResourceType",
    "targetResourceRegion",
    "actions",
    "autoMitigate",
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
          message: "Location is required for Metric Alerts",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Metric Alerts",
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
      property: "criteria",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Criteria is required",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Metric Alert 2018-03-01
 */
export const METRIC_ALERT_VERSION_2018_03_01: VersionConfig = {
  version: "2018-03-01",
  schema: METRIC_ALERT_SCHEMA_2018_03_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2018-03-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/metric-alert/migration-2018-03-01",
  changeLog: [
    {
      changeType: "updated",
      description:
        "Stable API version for Metric Alerts with dynamic threshold support",
      breaking: false,
    },
  ],
};

/**
 * All supported Metric Alert versions for registration
 */
export const ALL_METRIC_ALERT_VERSIONS: VersionConfig[] = [
  METRIC_ALERT_VERSION_2018_03_01,
];

/**
 * Resource type constant
 */
export const METRIC_ALERT_TYPE = "Microsoft.Insights/metricAlerts";
