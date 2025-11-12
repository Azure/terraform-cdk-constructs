/**
 * API schemas for Azure Diagnostic Settings across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Insights/diagnosticSettings
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
 * Common property definitions shared across all Diagnostic Settings versions
 */
const COMMON_DIAGNOSTIC_SETTINGS_PROPERTIES: {
  [key: string]: PropertyDefinition;
} = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the diagnostic setting",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required",
      },
    ],
  },
  workspaceId: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Log Analytics workspace resource ID for log/metric destination",
  },
  storageAccountId: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Storage account resource ID for log/metric destination",
  },
  eventHubAuthorizationRuleId: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Event Hub authorization rule ID for streaming",
  },
  eventHubName: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Event Hub name for streaming",
  },
  logs: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Log category configurations",
  },
  metrics: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Metric category configurations",
  },
  logAnalyticsDestinationType: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Log Analytics destination type (Dedicated or AzureDiagnostics)",
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Diagnostic Settings version 2016-09-01
 *
 * This is the latest stable (non-preview) version for diagnostic settings.
 * It includes support for:
 * - Log Analytics workspaces
 * - Storage accounts
 * - Event Hubs (via serviceBusRuleId)
 * - Log categories
 * - Metrics
 */
export const DIAGNOSTIC_SETTINGS_SCHEMA_2016_09_01: ApiSchema = {
  resourceType: "Microsoft.Insights/diagnosticSettings",
  version: "2016-09-01",
  properties: {
    ...COMMON_DIAGNOSTIC_SETTINGS_PROPERTIES,
  },
  required: ["name"],
  optional: [
    "workspaceId",
    "storageAccountId",
    "eventHubAuthorizationRuleId",
    "eventHubName",
    "logs",
    "metrics",
    "logAnalyticsDestinationType",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Diagnostic Settings",
        },
      ],
    },
  ],
};

/**
 * API Schema for Diagnostic Settings version 2021-05-01-preview
 *
 * This is the most recent preview version for diagnostic settings.
 * It includes support for:
 * - Log Analytics workspaces
 * - Storage accounts
 * - Event Hubs
 * - Log categories and category groups
 * - Metrics
 * - Marketplace partner integrations
 */
export const DIAGNOSTIC_SETTINGS_SCHEMA_2021_05_01_PREVIEW: ApiSchema = {
  resourceType: "Microsoft.Insights/diagnosticSettings",
  version: "2021-05-01-preview",
  properties: {
    ...COMMON_DIAGNOSTIC_SETTINGS_PROPERTIES,
  },
  required: ["name"],
  optional: [
    "workspaceId",
    "storageAccountId",
    "eventHubAuthorizationRuleId",
    "eventHubName",
    "logs",
    "metrics",
    "logAnalyticsDestinationType",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Diagnostic Settings",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Diagnostic Settings 2016-09-01
 */
export const DIAGNOSTIC_SETTINGS_VERSION_2016_09_01: VersionConfig = {
  version: "2016-09-01",
  schema: DIAGNOSTIC_SETTINGS_SCHEMA_2016_09_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2016-09-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/diagnostic-settings/migration-2016-09-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Stable API version for diagnostic settings",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Diagnostic Settings 2021-05-01-preview
 */
export const DIAGNOSTIC_SETTINGS_VERSION_2021_05_01_PREVIEW: VersionConfig = {
  version: "2021-05-01-preview",
  schema: DIAGNOSTIC_SETTINGS_SCHEMA_2021_05_01_PREVIEW,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2021-05-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/diagnostic-settings/migration-2021-05-01-preview",
  changeLog: [
    {
      changeType: "added",
      description:
        "Preview API with support for category groups and marketplace partners",
      breaking: false,
    },
  ],
};

/**
 * All supported Diagnostic Settings versions for registration
 * Ordered with latest stable version first, then preview versions
 */
export const ALL_DIAGNOSTIC_SETTINGS_VERSIONS: VersionConfig[] = [
  DIAGNOSTIC_SETTINGS_VERSION_2016_09_01,
  DIAGNOSTIC_SETTINGS_VERSION_2021_05_01_PREVIEW,
];

/**
 * Resource type constant
 */
export const DIAGNOSTIC_SETTINGS_TYPE = "Microsoft.Insights/diagnosticSettings";
