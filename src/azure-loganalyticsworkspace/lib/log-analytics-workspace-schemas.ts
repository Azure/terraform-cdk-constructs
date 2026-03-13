/**
 * API schemas for Azure Log Analytics Workspace across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.OperationalInsights/workspaces
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
 * Common property definitions shared across all Log Analytics Workspace versions
 */
const COMMON_LOG_ANALYTICS_WORKSPACE_PROPERTIES: {
  [key: string]: PropertyDefinition;
} = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the Log Analytics workspace",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9-]{2,61}[a-zA-Z0-9]$",
        message:
          "Workspace name must be 4-63 characters, start and end with a letter or number, and contain only letters, numbers, and hyphens",
      },
    ],
  },
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Azure region where the workspace will be created",
  },
  retentionInDays: {
    dataType: PropertyType.NUMBER,
    required: false,
    defaultValue: 30,
    description:
      "Data retention in days. Values between 30 and 730 are allowed. Default is 30 days.",
    validation: [
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { min: 30, max: 730 },
        message: "Retention must be between 30 and 730 days",
      },
    ],
  },
  sku: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "SKU configuration for the workspace. Options: Free, Standard, Premium, PerNode, PerGB2018, Standalone, CapacityReservation",
  },
  workspaceCapping: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Daily volume cap for data ingestion in GB",
  },
  publicNetworkAccessForIngestion: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Public network access for data ingestion: Enabled or Disabled",
  },
  publicNetworkAccessForQuery: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Public network access for queries: Enabled or Disabled",
  },
  features: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Workspace features like enableDataExport, immediatePurgeDataOn30Days, etc.",
  },
  forceCmkForQuery: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description:
      "Whether customer-managed keys are required for saved searches and alerts",
  },
  defaultDataCollectionRuleResourceId: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Resource ID of the default Data Collection Rule",
    addedInVersion: "2023-09-01",
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Managed identity configuration for the workspace",
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Log Analytics Workspace version 2023-09-01
 *
 * This is the latest stable version for Log Analytics Workspace.
 * It includes support for:
 * - Data retention configuration
 * - SKU management (Free, PerGB2018, CapacityReservation, etc.)
 * - Daily volume cap (workspace capping)
 * - Public network access controls
 * - Workspace features (enableDataExport, immediatePurgeDataOn30Days, etc.)
 * - Default Data Collection Rule
 * - Managed identity
 */
export const LOG_ANALYTICS_WORKSPACE_SCHEMA_2023_09_01: ApiSchema = {
  resourceType: "Microsoft.OperationalInsights/workspaces",
  version: "2023-09-01",
  properties: {
    ...COMMON_LOG_ANALYTICS_WORKSPACE_PROPERTIES,
  },
  required: ["name", "location"],
  optional: [
    "retentionInDays",
    "sku",
    "workspaceCapping",
    "publicNetworkAccessForIngestion",
    "publicNetworkAccessForQuery",
    "features",
    "forceCmkForQuery",
    "defaultDataCollectionRuleResourceId",
    "identity",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Log Analytics Workspace",
        },
      ],
    },
  ],
};

/**
 * API Schema for Log Analytics Workspace version 2022-10-01
 *
 * This is a stable version for backward compatibility.
 * It includes support for:
 * - Data retention configuration
 * - SKU management
 * - Daily volume cap
 * - Public network access controls
 * - Workspace features
 */
export const LOG_ANALYTICS_WORKSPACE_SCHEMA_2022_10_01: ApiSchema = {
  resourceType: "Microsoft.OperationalInsights/workspaces",
  version: "2022-10-01",
  properties: {
    name: COMMON_LOG_ANALYTICS_WORKSPACE_PROPERTIES.name,
    location: COMMON_LOG_ANALYTICS_WORKSPACE_PROPERTIES.location,
    retentionInDays: COMMON_LOG_ANALYTICS_WORKSPACE_PROPERTIES.retentionInDays,
    sku: COMMON_LOG_ANALYTICS_WORKSPACE_PROPERTIES.sku,
    workspaceCapping:
      COMMON_LOG_ANALYTICS_WORKSPACE_PROPERTIES.workspaceCapping,
    publicNetworkAccessForIngestion:
      COMMON_LOG_ANALYTICS_WORKSPACE_PROPERTIES.publicNetworkAccessForIngestion,
    publicNetworkAccessForQuery:
      COMMON_LOG_ANALYTICS_WORKSPACE_PROPERTIES.publicNetworkAccessForQuery,
    features: COMMON_LOG_ANALYTICS_WORKSPACE_PROPERTIES.features,
    forceCmkForQuery:
      COMMON_LOG_ANALYTICS_WORKSPACE_PROPERTIES.forceCmkForQuery,
    identity: COMMON_LOG_ANALYTICS_WORKSPACE_PROPERTIES.identity,
    // Note: defaultDataCollectionRuleResourceId is not available in this version
  },
  required: ["name", "location"],
  optional: [
    "retentionInDays",
    "sku",
    "workspaceCapping",
    "publicNetworkAccessForIngestion",
    "publicNetworkAccessForQuery",
    "features",
    "forceCmkForQuery",
    "identity",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Log Analytics Workspace",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Log Analytics Workspace 2023-09-01
 */
export const LOG_ANALYTICS_WORKSPACE_VERSION_2023_09_01: VersionConfig = {
  version: "2023-09-01",
  schema: LOG_ANALYTICS_WORKSPACE_SCHEMA_2023_09_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2023-09-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/log-analytics-workspace/migration-2023-09-01",
  changeLog: [
    {
      changeType: "added",
      description: "Added support for default Data Collection Rule resource ID",
      breaking: false,
    },
    {
      changeType: "updated",
      description: "Latest stable API version with enhanced feature support",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Log Analytics Workspace 2022-10-01
 */
export const LOG_ANALYTICS_WORKSPACE_VERSION_2022_10_01: VersionConfig = {
  version: "2022-10-01",
  schema: LOG_ANALYTICS_WORKSPACE_SCHEMA_2022_10_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2022-10-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/log-analytics-workspace/migration-2022-10-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Stable API version for backward compatibility",
      breaking: false,
    },
  ],
};

/**
 * All supported Log Analytics Workspace versions for registration
 * Ordered with latest stable version first
 */
export const ALL_LOG_ANALYTICS_WORKSPACE_VERSIONS: VersionConfig[] = [
  LOG_ANALYTICS_WORKSPACE_VERSION_2023_09_01,
  LOG_ANALYTICS_WORKSPACE_VERSION_2022_10_01,
];

/**
 * Resource type constant
 */
export const LOG_ANALYTICS_WORKSPACE_TYPE =
  "Microsoft.OperationalInsights/workspaces";
