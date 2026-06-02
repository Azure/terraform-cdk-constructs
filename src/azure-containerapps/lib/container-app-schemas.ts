/**
 * API schemas for Azure Container App across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.App/containerApps
 * across all supported API versions. The schemas are used by the AzapiResource
 * framework for validation, transformation, and version management.
 *
 * Supported API Versions:
 * - 2024-03-01 (Active)
 * - 2025-02-02-preview (Active, Latest azapi-compatible)
 * - 2025-07-01 (Active, Latest)
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
 * Common property definitions shared across all Container App versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The Azure region where the Container App will be created.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Container Apps",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description: "A dictionary of tags to apply to the Container App.",
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
    description:
      "The name of the Container App. Must be unique within the resource group.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Container App name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$",
        message:
          "Container App name must start and end with alphanumeric characters and can contain hyphens",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 2, maxLength: 32 },
        message: "Container App name must be between 2 and 32 characters",
      },
    ],
  },
  environmentId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "Resource ID of the Container App Environment where this app will be hosted.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Environment ID is required for Container Apps",
      },
    ],
  },
  template: {
    dataType: PropertyType.OBJECT,
    required: true,
    description:
      "Container App versioned application definition including containers, scale rules, and volumes.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Template is required for Container Apps",
      },
    ],
  },
  configuration: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Non-versioned Container App configuration properties including ingress, Dapr, secrets, and registries.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Configuration must be an object",
      },
    ],
  },
  workloadProfileName: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Workload profile name to pin for container app execution.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "workloadProfileName must be a string",
      },
    ],
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Managed identities for the Container App to interact with other Azure services without maintaining any secrets or credentials in code.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "identity must be an object",
      },
    ],
  },
  ignoreChanges: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Array of property names to ignore during updates.",
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
// READ-ONLY PROPERTY DEFINITIONS
// =============================================================================

/**
 * Read-only properties that are populated by Azure after creation
 */
const READ_ONLY_PROPERTIES: { [key: string]: PropertyDefinition } = {
  provisioningState: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The provisioning state of the Container App (read-only).",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "provisioningState must be a string",
      },
    ],
  },
  latestRevisionFqdn: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Fully Qualified Domain Name of the latest revision of the Container App (read-only).",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "latestRevisionFqdn must be a string",
      },
    ],
  },
  latestReadyRevisionName: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Name of the latest ready revision of the Container App (read-only).",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "latestReadyRevisionName must be a string",
      },
    ],
  },
  fqdn: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Fully Qualified Domain Name of the Container App (read-only, from ingress).",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "fqdn must be a string",
      },
    ],
  },
  runningStatus: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Current running status of the Container App (read-only).",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "runningStatus must be a string",
      },
    ],
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Container App version 2024-03-01
 */
export const CONTAINER_APP_SCHEMA_2024_03_01: ApiSchema = {
  resourceType: "Microsoft.App/containerApps",
  version: "2024-03-01",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
  },
  required: ["location", "name", "environmentId", "template"],
  optional: [
    "tags",
    "configuration",
    "workloadProfileName",
    "identity",
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
          message: "Location is required for Container Apps",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Container Apps",
        },
      ],
    },
    {
      property: "environmentId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Environment ID is required for Container Apps",
        },
      ],
    },
    {
      property: "template",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Template is required for Container Apps",
        },
      ],
    },
  ],
};

/**
 * API Schema for Container App version 2025-07-01
 */
export const CONTAINER_APP_SCHEMA_2025_07_01: ApiSchema = {
  resourceType: "Microsoft.App/containerApps",
  version: "2025-07-01",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
  },
  required: ["location", "name", "environmentId", "template"],
  optional: [
    "tags",
    "configuration",
    "workloadProfileName",
    "identity",
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
          message: "Location is required for Container Apps",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Container Apps",
        },
      ],
    },
    {
      property: "environmentId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Environment ID is required for Container Apps",
        },
      ],
    },
    {
      property: "template",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Template is required for Container Apps",
        },
      ],
    },
  ],
};

/**
 * API Schema for Container App version 2025-02-02-preview
 *
 * This is the latest version supported by the azapi provider ~> 2.7.0.
 * It has the same properties as 2024-03-01 with additional preview features.
 */
export const CONTAINER_APP_SCHEMA_2025_02_02_PREVIEW: ApiSchema = {
  resourceType: "Microsoft.App/containerApps",
  version: "2025-02-02-preview",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
  },
  required: ["location", "name", "environmentId", "template"],
  optional: [
    "tags",
    "configuration",
    "workloadProfileName",
    "identity",
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
          message: "Location is required for Container Apps",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Container Apps",
        },
      ],
    },
    {
      property: "environmentId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Environment ID is required for Container Apps",
        },
      ],
    },
    {
      property: "template",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Template is required for Container Apps",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Container App 2024-03-01
 */
export const CONTAINER_APP_VERSION_2024_03_01: VersionConfig = {
  version: "2024-03-01",
  schema: CONTAINER_APP_SCHEMA_2024_03_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-03-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/container-app/migration-2024-03-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release of Container App API with ingress, Dapr, scaling, secrets, and managed identity support",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Container App 2025-02-02-preview
 */
export const CONTAINER_APP_VERSION_2025_02_02_PREVIEW: VersionConfig = {
  version: "2025-02-02-preview",
  schema: CONTAINER_APP_SCHEMA_2025_02_02_PREVIEW,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-02-02",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/container-app/migration-2025-02-02-preview",
  changeLog: [
    {
      changeType: "added",
      description:
        "Preview release with additional identity settings, runtime configuration, and service binds",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Container App 2025-07-01
 */
export const CONTAINER_APP_VERSION_2025_07_01: VersionConfig = {
  version: "2025-07-01",
  schema: CONTAINER_APP_SCHEMA_2025_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/container-app/migration-2025-07-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Added identity settings, runtime configuration, additional port mappings, cooldown/polling interval for scaling, and service binds",
      breaking: false,
    },
  ],
};

/**
 * All supported Container App versions for registration
 */
export const ALL_CONTAINER_APP_VERSIONS: VersionConfig[] = [
  CONTAINER_APP_VERSION_2024_03_01,
  CONTAINER_APP_VERSION_2025_02_02_PREVIEW,
  CONTAINER_APP_VERSION_2025_07_01,
];

/**
 * Resource type constant
 */
export const CONTAINER_APP_TYPE = "Microsoft.App/containerApps";
