/**
 * API schemas for Azure Static Web App across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Web/staticSites
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
 * Common property definitions shared across all Static Web App versions
 */
const COMMON_STATIC_WEB_APP_PROPERTIES: {
  [key: string]: PropertyDefinition;
} = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "Azure region for the static web app. Static Web Apps are only available in a limited set of regions (e.g., centralus, eastus2, eastasia, westeurope, westus2)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-z0-9]+$",
        message: "Location must contain only lowercase letters and numbers",
      },
    ],
  },
  name: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Name of the static web app",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9-]{0,58}[a-zA-Z0-9]$",
        message:
          "Static Web App name must be 2-60 chars, alphanumeric and hyphens, starting and ending with alphanumeric",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description: "Resource tags",
  },
  sku: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "SKU of the static web app (Free or Standard)",
  },
  repositoryUrl: {
    dataType: PropertyType.STRING,
    required: false,
    description: "URL of the source code repository",
  },
  branch: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Source code branch in the repository",
  },
  repositoryToken: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Token used to authenticate against the repository (e.g., GitHub personal access token)",
  },
  buildProperties: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Build configuration for the static web app",
  },
  stagingEnvironmentPolicy: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "State indicating whether staging environments are allowed (Enabled or Disabled)",
  },
  allowConfigFileUpdates: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description:
      "Whether configuration file updates are allowed via the Static Web App's deployment workflow",
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

const COMMON_OPTIONAL = [
  "name",
  "tags",
  "sku",
  "repositoryUrl",
  "branch",
  "repositoryToken",
  "buildProperties",
  "stagingEnvironmentPolicy",
  "allowConfigFileUpdates",
  "ignoreChanges",
];

/**
 * API Schema for Static Web App version 2022-03-01
 */
export const STATIC_WEB_APP_SCHEMA_2022_03_01: ApiSchema = {
  resourceType: "Microsoft.Web/staticSites",
  version: "2022-03-01",
  properties: {
    ...COMMON_STATIC_WEB_APP_PROPERTIES,
  },
  required: ["location"],
  optional: COMMON_OPTIONAL,
  deprecated: [],
  transformationRules: {},
  validationRules: [],
};

/**
 * API Schema for Static Web App version 2023-12-01
 */
export const STATIC_WEB_APP_SCHEMA_2023_12_01: ApiSchema = {
  resourceType: "Microsoft.Web/staticSites",
  version: "2023-12-01",
  properties: {
    ...COMMON_STATIC_WEB_APP_PROPERTIES,
  },
  required: ["location"],
  optional: COMMON_OPTIONAL,
  deprecated: [],
  transformationRules: {},
  validationRules: [],
};

/**
 * API Schema for Static Web App version 2024-04-01
 */
export const STATIC_WEB_APP_SCHEMA_2024_04_01: ApiSchema = {
  resourceType: "Microsoft.Web/staticSites",
  version: "2024-04-01",
  properties: {
    ...COMMON_STATIC_WEB_APP_PROPERTIES,
  },
  required: ["location"],
  optional: COMMON_OPTIONAL,
  deprecated: [],
  transformationRules: {},
  validationRules: [],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Static Web App 2022-03-01
 */
export const STATIC_WEB_APP_VERSION_2022_03_01: VersionConfig = {
  version: "2022-03-01",
  schema: STATIC_WEB_APP_SCHEMA_2022_03_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2022-03-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/static-web-app/migration-2022-03-01",
  changeLog: [
    {
      changeType: "added",
      description: "Stable Static Web Apps release",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Static Web App 2023-12-01
 */
export const STATIC_WEB_APP_VERSION_2023_12_01: VersionConfig = {
  version: "2023-12-01",
  schema: STATIC_WEB_APP_SCHEMA_2023_12_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2023-12-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/static-web-app/migration-2023-12-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Performance and reliability improvements",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Static Web App 2024-04-01
 */
export const STATIC_WEB_APP_VERSION_2024_04_01: VersionConfig = {
  version: "2024-04-01",
  schema: STATIC_WEB_APP_SCHEMA_2024_04_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-04-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/static-web-app/migration-2024-04-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Latest stable Static Web Apps API",
      breaking: false,
    },
  ],
};

/**
 * All supported Static Web App versions for registration
 */
export const ALL_STATIC_WEB_APP_VERSIONS: VersionConfig[] = [
  STATIC_WEB_APP_VERSION_2022_03_01,
  STATIC_WEB_APP_VERSION_2023_12_01,
  STATIC_WEB_APP_VERSION_2024_04_01,
];

/**
 * Resource type constant
 */
export const STATIC_WEB_APP_TYPE = "Microsoft.Web/staticSites";
