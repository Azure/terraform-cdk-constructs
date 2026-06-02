/**
 * API schemas for Azure Container App Managed Environment across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.App/managedEnvironments
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
 * Common property definitions shared across all Container App Environment versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The Azure region where the Container App Environment will be created.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Container App Environments",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description:
      "A dictionary of tags to apply to the Container App Environment.",
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
      "The name of the Container App Environment. Must be unique within the resource group.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Container App Environment name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$",
        message:
          "Container App Environment name must start and end with alphanumeric characters and can contain hyphens",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 60 },
        message:
          "Container App Environment name must be between 1 and 60 characters",
      },
    ],
  },
  appLogsConfiguration: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Cluster configuration which enables the log daemon to export app logs to a configured destination.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "appLogsConfiguration must be an object",
      },
    ],
  },
  vnetConfiguration: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "VNet configuration for the environment.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "vnetConfiguration must be an object",
      },
    ],
  },
  workloadProfiles: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Workload profiles configured for the Managed Environment.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.ARRAY,
        message: "workloadProfiles must be an array",
      },
    ],
  },
  zoneRedundant: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Whether or not this Managed Environment is zone-redundant.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.BOOLEAN,
        message: "zoneRedundant must be a boolean",
      },
    ],
  },
  daprAIInstrumentationKey: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Azure Monitor instrumentation key used by Dapr to export Service to Service communication telemetry.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "daprAIInstrumentationKey must be a string",
      },
    ],
  },
  daprAIConnectionString: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Application Insights connection string used by Dapr to export Service to Service communication telemetry.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "daprAIConnectionString must be a string",
      },
    ],
  },
  customDomainConfiguration: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Custom domain configuration for the environment.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "customDomainConfiguration must be an object",
      },
    ],
  },
  infrastructureResourceGroup: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Name of the platform-managed resource group created for the Managed Environment to host infrastructure resources.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "infrastructureResourceGroup must be a string",
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
    description:
      "The provisioning state of the Container App Environment (read-only).",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "provisioningState must be a string",
      },
    ],
  },
  defaultDomain: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Default domain of the Container App Environment (read-only).",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "defaultDomain must be a string",
      },
    ],
  },
  staticIp: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Static IP of the Container App Environment (read-only).",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "staticIp must be a string",
      },
    ],
  },
  deploymentErrors: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Any errors that occurred during deployment (read-only).",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "deploymentErrors must be a string",
      },
    ],
  },
};

// =============================================================================
// VERSION 2025-07-01 ADDITIONAL PROPERTIES
// =============================================================================

/**
 * Properties added in API version 2025-07-01
 */
const V2025_07_01_PROPERTIES: { [key: string]: PropertyDefinition } = {
  peerAuthentication: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Peer authentication settings for the Managed Environment (mTLS).",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "peerAuthentication must be an object",
      },
    ],
  },
  peerTrafficConfiguration: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Peer traffic settings for the Managed Environment (encryption).",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "peerTrafficConfiguration must be an object",
      },
    ],
  },
  ingressConfiguration: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Ingress configuration for the Managed Environment including workload profile, termination grace period, and connection settings.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "ingressConfiguration must be an object",
      },
    ],
  },
  publicNetworkAccess: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Property to allow or block all public traffic. Allowed Values: 'Enabled', 'Disabled'.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "publicNetworkAccess must be a string",
      },
    ],
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Container App Environment version 2024-03-01
 */
export const CONTAINER_APP_ENVIRONMENT_SCHEMA_2024_03_01: ApiSchema = {
  resourceType: "Microsoft.App/managedEnvironments",
  version: "2024-03-01",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
  },
  required: ["location", "name"],
  optional: [
    "tags",
    "appLogsConfiguration",
    "vnetConfiguration",
    "workloadProfiles",
    "zoneRedundant",
    "daprAIInstrumentationKey",
    "daprAIConnectionString",
    "customDomainConfiguration",
    "infrastructureResourceGroup",
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
          message: "Location is required for Container App Environments",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Container App Environments",
        },
      ],
    },
  ],
};

/**
 * API Schema for Container App Environment version 2025-02-02-preview
 *
 * This is the latest version supported by the azapi provider ~> 2.7.0.
 * It includes the same properties as 2024-03-01 plus preview features
 * like peer authentication, peer traffic encryption, ingress configuration,
 * and public network access controls.
 */
export const CONTAINER_APP_ENVIRONMENT_SCHEMA_2025_02_02_PREVIEW: ApiSchema = {
  resourceType: "Microsoft.App/managedEnvironments",
  version: "2025-02-02-preview",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
    ...V2025_07_01_PROPERTIES,
  },
  required: ["location", "name"],
  optional: [
    "tags",
    "appLogsConfiguration",
    "vnetConfiguration",
    "workloadProfiles",
    "zoneRedundant",
    "daprAIInstrumentationKey",
    "daprAIConnectionString",
    "customDomainConfiguration",
    "infrastructureResourceGroup",
    "peerAuthentication",
    "peerTrafficConfiguration",
    "ingressConfiguration",
    "publicNetworkAccess",
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
          message: "Location is required for Container App Environments",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Container App Environments",
        },
      ],
    },
  ],
};

/**
 * API Schema for Container App Environment version 2025-07-01
 */
export const CONTAINER_APP_ENVIRONMENT_SCHEMA_2025_07_01: ApiSchema = {
  resourceType: "Microsoft.App/managedEnvironments",
  version: "2025-07-01",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
    ...V2025_07_01_PROPERTIES,
  },
  required: ["location", "name"],
  optional: [
    "tags",
    "appLogsConfiguration",
    "vnetConfiguration",
    "workloadProfiles",
    "zoneRedundant",
    "daprAIInstrumentationKey",
    "daprAIConnectionString",
    "customDomainConfiguration",
    "infrastructureResourceGroup",
    "peerAuthentication",
    "peerTrafficConfiguration",
    "ingressConfiguration",
    "publicNetworkAccess",
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
          message: "Location is required for Container App Environments",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Container App Environments",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Container App Environment 2024-03-01
 */
export const CONTAINER_APP_ENVIRONMENT_VERSION_2024_03_01: VersionConfig = {
  version: "2024-03-01",
  schema: CONTAINER_APP_ENVIRONMENT_SCHEMA_2024_03_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-03-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/container-app-environment/migration-2024-03-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release of Container App Environment API with workload profiles, VNet integration, and Dapr support",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Container App Environment 2025-02-02-preview
 */
export const CONTAINER_APP_ENVIRONMENT_VERSION_2025_02_02_PREVIEW: VersionConfig =
  {
    version: "2025-02-02-preview",
    schema: CONTAINER_APP_ENVIRONMENT_SCHEMA_2025_02_02_PREVIEW,
    supportLevel: VersionSupportLevel.ACTIVE,
    releaseDate: "2025-02-02",
    deprecationDate: undefined,
    sunsetDate: undefined,
    breakingChanges: [],
    migrationGuide:
      "/docs/container-app-environment/migration-2025-02-02-preview",
    changeLog: [
      {
        changeType: "added",
        description:
          "Preview release adding peer authentication (mTLS), peer traffic encryption, ingress configuration, and public network access controls",
        breaking: false,
      },
    ],
  };

/**
 * Version configuration for Container App Environment 2025-07-01
 */
export const CONTAINER_APP_ENVIRONMENT_VERSION_2025_07_01: VersionConfig = {
  version: "2025-07-01",
  schema: CONTAINER_APP_ENVIRONMENT_SCHEMA_2025_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/container-app-environment/migration-2025-07-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Added peer authentication (mTLS), peer traffic encryption, ingress configuration, and public network access controls",
      breaking: false,
    },
  ],
};

/**
 * All supported Container App Environment versions for registration
 */
export const ALL_CONTAINER_APP_ENVIRONMENT_VERSIONS: VersionConfig[] = [
  CONTAINER_APP_ENVIRONMENT_VERSION_2024_03_01,
  CONTAINER_APP_ENVIRONMENT_VERSION_2025_02_02_PREVIEW,
  CONTAINER_APP_ENVIRONMENT_VERSION_2025_07_01,
];

/**
 * Resource type constant
 */
export const CONTAINER_APP_ENVIRONMENT_TYPE =
  "Microsoft.App/managedEnvironments";
