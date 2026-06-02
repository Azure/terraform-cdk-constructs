/**
 * API schemas for Azure Cosmos DB Database Account across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.DocumentDB/databaseAccounts
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
 * Common property definitions shared across all Cosmos DB Account versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The Azure region where the Cosmos DB Account will be created",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Cosmos DB Accounts",
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
    description: "A dictionary of tags to apply to the Cosmos DB Account",
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
      "The name of the Cosmos DB Account. Must be globally unique across Azure (3-44 lowercase letters, numbers, and hyphens)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Cosmos DB Account name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-z0-9]([a-z0-9-]{1,42}[a-z0-9])?$",
        message:
          "Cosmos DB Account name must be 3-44 characters of lowercase letters, numbers, and hyphens (cannot start or end with a hyphen)",
      },
    ],
  },
  kind: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "GlobalDocumentDB",
    description:
      "The kind of Cosmos DB Account (GlobalDocumentDB, MongoDB, Parse)",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(GlobalDocumentDB|MongoDB|Parse)$",
        message: "Kind must be GlobalDocumentDB, MongoDB, or Parse",
      },
    ],
  },
  databaseAccountOfferType: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Standard",
    description: "The offer type for the Cosmos DB Account (Standard)",
  },
  consistencyPolicy: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The consistency policy for the Cosmos DB Account",
  },
  geoLocations: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Geo-replication locations for the Cosmos DB Account",
  },
  capabilities: {
    dataType: PropertyType.ARRAY,
    required: false,
    description:
      "Capabilities to enable on the Cosmos DB Account (e.g. EnableServerless, EnableCassandra, EnableTable, EnableGremlin)",
  },
  publicNetworkAccess: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Enabled",
    description: "Whether public network access is enabled (Enabled, Disabled)",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Enabled|Disabled)$",
        message: "publicNetworkAccess must be Enabled or Disabled",
      },
    ],
  },
  enableAutomaticFailover: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Whether automatic failover is enabled",
  },
  enableMultipleWriteLocations: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Whether multi-region writes are enabled",
  },
  enableFreeTier: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Whether the free tier is enabled for the account",
  },
  isVirtualNetworkFilterEnabled: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Whether virtual network filtering is enabled",
  },
  minimalTlsVersion: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Tls12",
    description:
      "The minimum TLS version for the Cosmos DB Account (Tls, Tls11, Tls12)",
  },
  backupPolicy: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The backup policy configuration for the Cosmos DB Account",
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Managed identity configuration for the Cosmos DB Account",
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

const COMMON_REQUIRED = ["location", "name"];

const COMMON_OPTIONAL = [
  "tags",
  "kind",
  "databaseAccountOfferType",
  "consistencyPolicy",
  "geoLocations",
  "capabilities",
  "publicNetworkAccess",
  "enableAutomaticFailover",
  "enableMultipleWriteLocations",
  "enableFreeTier",
  "isVirtualNetworkFilterEnabled",
  "minimalTlsVersion",
  "backupPolicy",
  "identity",
  "ignoreChanges",
];

const COMMON_VALIDATION_RULES = [
  {
    property: "location",
    rules: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Cosmos DB Accounts",
      },
    ],
  },
  {
    property: "name",
    rules: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required for Cosmos DB Accounts",
      },
    ],
  },
];

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Cosmos DB Account version 2023-11-15
 */
export const COSMOS_DB_SCHEMA_2023_11_15: ApiSchema = {
  resourceType: "Microsoft.DocumentDB/databaseAccounts",
  version: "2023-11-15",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: [...COMMON_REQUIRED],
  optional: [...COMMON_OPTIONAL],
  deprecated: [],
  transformationRules: {},
  validationRules: [...COMMON_VALIDATION_RULES],
};

/**
 * API Schema for Cosmos DB Account version 2024-05-15
 */
export const COSMOS_DB_SCHEMA_2024_05_15: ApiSchema = {
  resourceType: "Microsoft.DocumentDB/databaseAccounts",
  version: "2024-05-15",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: [...COMMON_REQUIRED],
  optional: [...COMMON_OPTIONAL],
  deprecated: [],
  transformationRules: {},
  validationRules: [...COMMON_VALIDATION_RULES],
};

/**
 * API Schema for Cosmos DB Account version 2024-08-15
 */
export const COSMOS_DB_SCHEMA_2024_08_15: ApiSchema = {
  resourceType: "Microsoft.DocumentDB/databaseAccounts",
  version: "2024-08-15",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: [...COMMON_REQUIRED],
  optional: [...COMMON_OPTIONAL],
  deprecated: [],
  transformationRules: {},
  validationRules: [...COMMON_VALIDATION_RULES],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Cosmos DB Account 2023-11-15
 */
export const COSMOS_DB_VERSION_2023_11_15: VersionConfig = {
  version: "2023-11-15",
  schema: COSMOS_DB_SCHEMA_2023_11_15,
  supportLevel: VersionSupportLevel.DEPRECATED,
  releaseDate: "2023-11-15",
  deprecationDate: "2024-08-15",
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/cosmos-db/migration-2023-11-15",
  changeLog: [
    {
      changeType: "deprecated",
      description:
        "This version is deprecated. Please migrate to 2024-08-15 for continued support.",
      breaking: false,
    },
    {
      changeType: "added",
      description: "Stable release of Cosmos DB databaseAccounts API",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Cosmos DB Account 2024-05-15
 */
export const COSMOS_DB_VERSION_2024_05_15: VersionConfig = {
  version: "2024-05-15",
  schema: COSMOS_DB_SCHEMA_2024_05_15,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-05-15",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/cosmos-db/migration-2024-05-15",
  changeLog: [
    {
      changeType: "updated",
      description:
        "Adds additional capabilities and continuous backup improvements.",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Cosmos DB Account 2024-08-15
 */
export const COSMOS_DB_VERSION_2024_08_15: VersionConfig = {
  version: "2024-08-15",
  schema: COSMOS_DB_SCHEMA_2024_08_15,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-08-15",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/cosmos-db/migration-2024-08-15",
  changeLog: [
    {
      changeType: "updated",
      description:
        "Latest API version with improved performance, security, and features.",
      breaking: false,
    },
  ],
};

/**
 * All supported Cosmos DB Account versions for registration
 */
export const ALL_COSMOS_DB_VERSIONS: VersionConfig[] = [
  COSMOS_DB_VERSION_2023_11_15,
  COSMOS_DB_VERSION_2024_05_15,
  COSMOS_DB_VERSION_2024_08_15,
];

/**
 * Resource type constant
 */
export const COSMOS_DB_TYPE = "Microsoft.DocumentDB/databaseAccounts";
