/**
 * API schemas for Azure Function App across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Web/sites (kind: functionapp)
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
 * Common property definitions shared across all Function App versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The Azure region where the Function App will be created",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Function Apps",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-z0-9]+$",
        message: "Location must contain only lowercase letters and numbers",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description: "A dictionary of tags to apply to the Function App",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Tags must be an object with string key-value pairs",
      },
    ],
  },
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The name of the Function App. Must be globally unique",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Function App name is required",
      },
    ],
  },
  kind: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "functionapp",
    description:
      "The kind of the Function App (functionapp, functionapp,linux)",
  },
  serverFarmId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The resource ID of the App Service Plan hosting this Function App",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Server farm ID (App Service Plan) is required",
      },
    ],
  },
  httpsOnly: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: true,
    description: "Whether the Function App only accepts HTTPS traffic",
  },
  clientAffinityEnabled: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Whether client affinity (session affinity) is enabled",
  },
  enabled: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: true,
    description: "Whether the Function App is enabled",
  },
  siteConfig: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Site configuration for the Function App including app settings, runtime, and scaling",
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Managed identity configuration for the Function App",
  },
  publicNetworkAccess: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Whether public network access is enabled (Enabled or Disabled)",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Enabled|Disabled)$",
        message: "Public network access must be either 'Enabled' or 'Disabled'",
      },
    ],
  },
  virtualNetworkSubnetId: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The subnet resource ID for VNet integration",
  },
  clientCertEnabled: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Whether client certificate authentication is enabled",
  },
  clientCertMode: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Client certificate mode (Required, Optional, OptionalInteractiveUser)",
  },
  functionAppConfig: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Function App configuration for Flex Consumption plans (deployment, runtime, scaling)",
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
 * API Schema for Function App version 2024-04-01
 */
export const FUNCTION_APP_SCHEMA_2024_04_01: ApiSchema = {
  resourceType: "Microsoft.Web/sites",
  version: "2024-04-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name", "serverFarmId"],
  optional: [
    "tags",
    "kind",
    "httpsOnly",
    "clientAffinityEnabled",
    "enabled",
    "siteConfig",
    "identity",
    "publicNetworkAccess",
    "virtualNetworkSubnetId",
    "clientCertEnabled",
    "clientCertMode",
    "functionAppConfig",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Function Apps",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Function Apps",
        },
      ],
    },
  ],
};

/**
 * API Schema for Function App version 2024-11-01
 */
export const FUNCTION_APP_SCHEMA_2024_11_01: ApiSchema = {
  resourceType: "Microsoft.Web/sites",
  version: "2024-11-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name", "serverFarmId"],
  optional: [
    "tags",
    "kind",
    "httpsOnly",
    "clientAffinityEnabled",
    "enabled",
    "siteConfig",
    "identity",
    "publicNetworkAccess",
    "virtualNetworkSubnetId",
    "clientCertEnabled",
    "clientCertMode",
    "functionAppConfig",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Function Apps",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Function Apps",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Function App 2024-04-01
 */
export const FUNCTION_APP_VERSION_2024_04_01: VersionConfig = {
  version: "2024-04-01",
  schema: FUNCTION_APP_SCHEMA_2024_04_01,
  supportLevel: VersionSupportLevel.MAINTENANCE,
  releaseDate: "2024-04-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/function-app/migration-2024-04-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Stable release with Function App support",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Function App 2024-11-01
 */
export const FUNCTION_APP_VERSION_2024_11_01: VersionConfig = {
  version: "2024-11-01",
  schema: FUNCTION_APP_SCHEMA_2024_11_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-11-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/function-app/migration-2024-11-01",
  changeLog: [
    {
      changeType: "updated",
      description:
        "Latest API version with improved features and performance enhancements",
      breaking: false,
    },
  ],
};

/**
 * All supported Function App versions for registration
 */
export const ALL_FUNCTION_APP_VERSIONS: VersionConfig[] = [
  FUNCTION_APP_VERSION_2024_04_01,
  FUNCTION_APP_VERSION_2024_11_01,
];

/**
 * Resource type constant
 */
export const FUNCTION_APP_TYPE = "Microsoft.Web/sites";
