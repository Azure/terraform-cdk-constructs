/**
 * API schemas for Azure Storage Account across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Storage/storageAccounts
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
 * Common property definitions shared across all Storage Account versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The Azure region where the Storage Account will be created",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Storage Accounts",
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
    description: "A dictionary of tags to apply to the Storage Account",
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
      "The name of the Storage Account. Must be globally unique across Azure",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Storage Account name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-z0-9]{3,24}$",
        message:
          "Storage Account name must be 3-24 lowercase letters and numbers only",
      },
    ],
  },
  sku: {
    dataType: PropertyType.OBJECT,
    required: true,
    description: "The SKU (pricing tier) for the Storage Account",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "SKU is required for Storage Accounts",
      },
    ],
  },
  kind: {
    dataType: PropertyType.STRING,
    required: true,
    defaultValue: "StorageV2",
    description:
      "The kind of Storage Account (StorageV2, BlobStorage, BlockBlobStorage, FileStorage)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Kind is required for Storage Accounts",
      },
    ],
  },
  accessTier: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Hot",
    description: "The access tier for blob storage (Hot or Cool)",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Hot|Cool)$",
        message: "Access tier must be either 'Hot' or 'Cool'",
      },
    ],
  },
  enableHttpsTrafficOnly: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: true,
    description: "Whether to allow only HTTPS traffic to the storage account",
  },
  minimumTlsVersion: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "TLS1_2",
    description: "The minimum TLS version required for requests",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(TLS1_0|TLS1_1|TLS1_2)$",
        message: "Minimum TLS version must be TLS1_0, TLS1_1, or TLS1_2",
      },
    ],
  },
  allowBlobPublicAccess: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Whether to allow public access to blobs",
  },
  networkAcls: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Network ACL rules for the storage account",
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Managed identity configuration for the storage account",
  },
  encryption: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Encryption settings for the storage account",
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
 * API Schema for Storage Account version 2023-01-01
 */
export const STORAGE_ACCOUNT_SCHEMA_2023_01_01: ApiSchema = {
  resourceType: "Microsoft.Storage/storageAccounts",
  version: "2023-01-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name", "sku", "kind"],
  optional: [
    "tags",
    "accessTier",
    "enableHttpsTrafficOnly",
    "minimumTlsVersion",
    "allowBlobPublicAccess",
    "networkAcls",
    "identity",
    "encryption",
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
          message: "Location is required for Storage Accounts",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Storage Accounts",
        },
      ],
    },
  ],
};

/**
 * API Schema for Storage Account version 2023-05-01
 */
export const STORAGE_ACCOUNT_SCHEMA_2023_05_01: ApiSchema = {
  resourceType: "Microsoft.Storage/storageAccounts",
  version: "2023-05-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name", "sku", "kind"],
  optional: [
    "tags",
    "accessTier",
    "enableHttpsTrafficOnly",
    "minimumTlsVersion",
    "allowBlobPublicAccess",
    "networkAcls",
    "identity",
    "encryption",
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
          message: "Location is required for Storage Accounts",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Storage Accounts",
        },
      ],
    },
  ],
};

/**
 * API Schema for Storage Account version 2024-01-01
 */
export const STORAGE_ACCOUNT_SCHEMA_2024_01_01: ApiSchema = {
  resourceType: "Microsoft.Storage/storageAccounts",
  version: "2024-01-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name", "sku", "kind"],
  optional: [
    "tags",
    "accessTier",
    "enableHttpsTrafficOnly",
    "minimumTlsVersion",
    "allowBlobPublicAccess",
    "networkAcls",
    "identity",
    "encryption",
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
          message: "Location is required for Storage Accounts",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Storage Accounts",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Storage Account 2023-01-01
 */
export const STORAGE_ACCOUNT_VERSION_2023_01_01: VersionConfig = {
  version: "2023-01-01",
  schema: STORAGE_ACCOUNT_SCHEMA_2023_01_01,
  supportLevel: VersionSupportLevel.SUNSET,
  releaseDate: "2023-01-01",
  deprecationDate: "2023-07-01",
  sunsetDate: "2024-07-01",
  breakingChanges: [],
  migrationGuide: "/docs/storage-account/migration-2023-01-01",
  changeLog: [
    {
      changeType: "sunset",
      description:
        "This version has reached sunset. Immediate migration to 2024-01-01 is required.",
      breaking: false,
    },
    {
      changeType: "deprecated",
      description:
        "This version was deprecated. Please migrate to 2024-01-01 or later.",
      breaking: false,
    },
    {
      changeType: "added",
      description: "Stable release of Storage Account API",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Storage Account 2023-05-01
 */
export const STORAGE_ACCOUNT_VERSION_2023_05_01: VersionConfig = {
  version: "2023-05-01",
  schema: STORAGE_ACCOUNT_SCHEMA_2023_05_01,
  supportLevel: VersionSupportLevel.DEPRECATED,
  releaseDate: "2023-05-01",
  deprecationDate: "2024-05-01",
  sunsetDate: "2025-05-01",
  breakingChanges: [],
  migrationGuide: "/docs/storage-account/migration-2023-05-01",
  changeLog: [
    {
      changeType: "deprecated",
      description:
        "This version is deprecated. Please migrate to 2024-01-01 for continued support.",
      breaking: false,
    },
    {
      changeType: "updated",
      description: "Enhanced security and encryption features",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Storage Account 2024-01-01
 */
export const STORAGE_ACCOUNT_VERSION_2024_01_01: VersionConfig = {
  version: "2024-01-01",
  schema: STORAGE_ACCOUNT_SCHEMA_2024_01_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-01-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/storage-account/migration-2024-01-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Latest API version with improved performance and features",
      breaking: false,
    },
  ],
};

/**
 * All supported Storage Account versions for registration
 */
export const ALL_STORAGE_ACCOUNT_VERSIONS: VersionConfig[] = [
  STORAGE_ACCOUNT_VERSION_2023_01_01,
  STORAGE_ACCOUNT_VERSION_2023_05_01,
  STORAGE_ACCOUNT_VERSION_2024_01_01,
];

/**
 * Resource type constant
 */
export const STORAGE_ACCOUNT_TYPE = "Microsoft.Storage/storageAccounts";

/**
 * Configuration options for Storage Account monitoring
 *
 * This interface defines the configurable options for setting up monitoring alerts
 * and diagnostic settings for Azure Storage Accounts. All properties are optional
 * and have sensible defaults for production use.
 *
 * @stability stable
 */
export interface StorageAccountMonitoringOptions {
  /**
   * Threshold for storage account availability percentage
   *
   * Alert triggers when availability drops below this threshold
   *
   * @default 99.9 - Triggers alert when availability is below 99.9%
   */
  readonly availabilityThreshold?: number;

  /**
   * Threshold for storage account egress in bytes
   *
   * Alert triggers when egress exceeds this threshold
   *
   * @default 10737418240 - Triggers alert when egress exceeds 10GB
   */
  readonly egressThreshold?: number;

  /**
   * Threshold for storage account transactions count
   *
   * Alert triggers when transaction count exceeds this threshold
   *
   * @default 100000 - Triggers alert when transactions exceed 100k
   */
  readonly transactionsThreshold?: number;

  /**
   * Enable or disable availability monitoring alert
   *
   * @default true - Availability alert is enabled by default
   */
  readonly enableAvailabilityAlert?: boolean;

  /**
   * Enable or disable egress monitoring alert
   *
   * @default true - Egress alert is enabled by default
   */
  readonly enableEgressAlert?: boolean;

  /**
   * Enable or disable transactions monitoring alert
   *
   * @default true - Transactions alert is enabled by default
   */
  readonly enableTransactionsAlert?: boolean;

  /**
   * Enable or disable deletion activity log alert
   *
   * @default true - Deletion alert is enabled by default
   */
  readonly enableDeletionAlert?: boolean;

  /**
   * Severity level for availability alerts
   *
   * Severity levels:
   * - 0: Critical
   * - 1: Error
   * - 2: Warning
   * - 3: Informational
   * - 4: Verbose
   *
   * @default 1 - Error severity for availability issues
   */
  readonly availabilityAlertSeverity?: 0 | 1 | 2 | 3 | 4;

  /**
   * Severity level for egress alerts
   *
   * Severity levels:
   * - 0: Critical
   * - 1: Error
   * - 2: Warning
   * - 3: Informational
   * - 4: Verbose
   *
   * @default 2 - Warning severity for high egress
   */
  readonly egressAlertSeverity?: 0 | 1 | 2 | 3 | 4;

  /**
   * Severity level for transactions alerts
   *
   * Severity levels:
   * - 0: Critical
   * - 1: Error
   * - 2: Warning
   * - 3: Informational
   * - 4: Verbose
   *
   * @default 2 - Warning severity for high transaction count
   */
  readonly transactionsAlertSeverity?: 0 | 1 | 2 | 3 | 4;
}
