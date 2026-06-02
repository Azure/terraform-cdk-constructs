/**
 * API schemas for Azure Container Registry across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.ContainerRegistry/registries
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
 * Common property definitions shared across all Container Registry versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The Azure region where the Container Registry will be created",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Container Registries",
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
    description: "A dictionary of tags to apply to the Container Registry",
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
      "The name of the Container Registry. Must be globally unique, 5-50 alphanumeric characters",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Container Registry name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9]{5,50}$",
        message:
          "Container Registry name must be 5-50 alphanumeric characters only",
      },
    ],
  },
  sku: {
    dataType: PropertyType.OBJECT,
    required: true,
    description:
      "The SKU (pricing tier) for the Container Registry (Basic, Standard, Premium)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "SKU is required for Container Registries",
      },
    ],
  },
  adminUserEnabled: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Whether the admin user is enabled for the registry",
  },
  publicNetworkAccess: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Enabled",
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
  networkRuleSet: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Network rule set configuration for the Container Registry (Premium SKU only)",
  },
  encryption: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Encryption settings with customer-managed keys (Premium SKU only)",
  },
  policies: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Policy configuration including retention, trust, export, quarantine, and soft delete policies",
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Managed identity configuration for the Container Registry",
  },
  zoneRedundancy: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Disabled",
    description:
      "Whether zone redundancy is enabled (Enabled or Disabled, Premium SKU only)",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Enabled|Disabled)$",
        message: "Zone redundancy must be either 'Enabled' or 'Disabled'",
      },
    ],
  },
  dataEndpointEnabled: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description:
      "Whether to enable a dedicated data endpoint (Premium SKU only)",
  },
  anonymousPullEnabled: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description:
      "Whether anonymous pull is enabled for unauthenticated access (Standard or Premium SKU)",
  },
  networkRuleBypassOptions: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "AzureServices",
    description:
      "Whether to allow trusted Azure Services to access a network restricted registry",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(AzureServices|None)$",
        message:
          "Network rule bypass options must be either 'AzureServices' or 'None'",
      },
    ],
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
 * API Schema for Container Registry version 2023-07-01
 */
export const CONTAINER_REGISTRY_SCHEMA_2023_07_01: ApiSchema = {
  resourceType: "Microsoft.ContainerRegistry/registries",
  version: "2023-07-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name", "sku"],
  optional: [
    "tags",
    "adminUserEnabled",
    "publicNetworkAccess",
    "networkRuleSet",
    "encryption",
    "policies",
    "identity",
    "zoneRedundancy",
    "dataEndpointEnabled",
    "anonymousPullEnabled",
    "networkRuleBypassOptions",
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
          message: "Location is required for Container Registries",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Container Registries",
        },
      ],
    },
  ],
};

/**
 * API Schema for Container Registry version 2025-04-01
 */
export const CONTAINER_REGISTRY_SCHEMA_2025_04_01: ApiSchema = {
  resourceType: "Microsoft.ContainerRegistry/registries",
  version: "2025-04-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name", "sku"],
  optional: [
    "tags",
    "adminUserEnabled",
    "publicNetworkAccess",
    "networkRuleSet",
    "encryption",
    "policies",
    "identity",
    "zoneRedundancy",
    "dataEndpointEnabled",
    "anonymousPullEnabled",
    "networkRuleBypassOptions",
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
          message: "Location is required for Container Registries",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Container Registries",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Container Registry 2023-07-01
 */
export const CONTAINER_REGISTRY_VERSION_2023_07_01: VersionConfig = {
  version: "2023-07-01",
  schema: CONTAINER_REGISTRY_SCHEMA_2023_07_01,
  supportLevel: VersionSupportLevel.MAINTENANCE,
  releaseDate: "2023-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/container-registry/migration-2023-07-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Stable release with policy and encryption support",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Container Registry 2025-04-01
 */
export const CONTAINER_REGISTRY_VERSION_2025_04_01: VersionConfig = {
  version: "2025-04-01",
  schema: CONTAINER_REGISTRY_SCHEMA_2025_04_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-04-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/container-registry/migration-2025-04-01",
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
 * All supported Container Registry versions for registration
 */
export const ALL_CONTAINER_REGISTRY_VERSIONS: VersionConfig[] = [
  CONTAINER_REGISTRY_VERSION_2023_07_01,
  CONTAINER_REGISTRY_VERSION_2025_04_01,
];

/**
 * Resource type constant
 */
export const CONTAINER_REGISTRY_TYPE = "Microsoft.ContainerRegistry/registries";
