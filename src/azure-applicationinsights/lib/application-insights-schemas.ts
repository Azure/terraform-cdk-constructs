/**
 * API schemas for Azure Application Insights across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Insights/components
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
 * Common property definitions shared across all Application Insights versions
 */
const COMMON_APPLICATION_INSIGHTS_PROPERTIES: {
  [key: string]: PropertyDefinition;
} = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the Application Insights component",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9-_.()]{0,258}[a-zA-Z0-9_()]$",
        message:
          "Application Insights name must be 1-260 characters and contain only letters, numbers, hyphens, underscores, periods, and parentheses",
      },
    ],
  },
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "Azure region where the Application Insights component will be created",
  },
  applicationType: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Type of application being monitored (web, java, other, etc.)",
    defaultValue: "web",
  },
  workspaceResourceId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "Resource ID of the Log Analytics workspace to associate with this workspace-based Application Insights component",
  },
  retentionInDays: {
    dataType: PropertyType.NUMBER,
    required: false,
    defaultValue: 90,
    description:
      "Data retention in days. Allowed values: 30, 60, 90, 120, 180, 270, 365, 550, 730. Default is 90.",
  },
  samplingPercentage: {
    dataType: PropertyType.NUMBER,
    required: false,
    description: "Telemetry sampling percentage (0-100)",
  },
  disableIpMasking: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Whether IP address masking is disabled",
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
  disableLocalAuth: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Whether local (key-based) authentication is disabled",
  },
  forceCustomerStorageForProfiler: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description:
      "Force users to create their own storage account for profiler and debugger",
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Application Insights version 2020-02-02
 *
 * This is the latest stable API version for workspace-based Application Insights.
 * Workspace-based components require a Log Analytics workspace and replace the
 * classic Application Insights resource (which was retired on Feb 29, 2024).
 */
export const APPLICATION_INSIGHTS_SCHEMA_2020_02_02: ApiSchema = {
  resourceType: "Microsoft.Insights/components",
  version: "2020-02-02",
  properties: {
    ...COMMON_APPLICATION_INSIGHTS_PROPERTIES,
  },
  required: ["name", "location", "applicationType", "workspaceResourceId"],
  optional: [
    "retentionInDays",
    "samplingPercentage",
    "disableIpMasking",
    "publicNetworkAccessForIngestion",
    "publicNetworkAccessForQuery",
    "disableLocalAuth",
    "forceCustomerStorageForProfiler",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Application Insights",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Application Insights 2020-02-02
 */
export const APPLICATION_INSIGHTS_VERSION_2020_02_02: VersionConfig = {
  version: "2020-02-02",
  schema: APPLICATION_INSIGHTS_SCHEMA_2020_02_02,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2020-02-02",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/application-insights/migration-2020-02-02",
  changeLog: [
    {
      changeType: "updated",
      description:
        "Latest stable API version for workspace-based Application Insights",
      breaking: false,
    },
  ],
};

/**
 * All supported Application Insights versions for registration
 * Ordered with latest stable version first
 */
export const ALL_APPLICATION_INSIGHTS_VERSIONS: VersionConfig[] = [
  APPLICATION_INSIGHTS_VERSION_2020_02_02,
];

/**
 * Resource type constant
 */
export const APPLICATION_INSIGHTS_TYPE = "Microsoft.Insights/components";
