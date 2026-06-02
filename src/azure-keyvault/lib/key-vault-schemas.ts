/**
 * API schemas for Azure Key Vault across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.KeyVault/vaults
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
 * Common property definitions shared across all Key Vault versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The Azure region where the Key Vault will be created",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Key Vaults",
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
    description: "A dictionary of tags to apply to the Key Vault",
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
      "The name of the Key Vault. Must be globally unique across Azure",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Key Vault name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z][a-zA-Z0-9-]{1,22}[a-zA-Z0-9]$",
        message:
          "Key Vault name must be 3-24 alphanumeric characters or hyphens, start with a letter, and end with a letter or digit",
      },
    ],
  },
  sku: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: { name: "standard", family: "A" },
    description: "The SKU (pricing tier) for the Key Vault",
  },
  tenantId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The Azure Active Directory tenant ID that should be used for authenticating requests to the Key Vault",
  },
  accessPolicies: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Array of access policies for the Key Vault",
  },
  networkAcls: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Network ACL rules for the Key Vault",
  },
  enabledForDeployment: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description:
      "Whether Azure Virtual Machines are permitted to retrieve certificates from the vault",
  },
  enabledForDiskEncryption: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description:
      "Whether Azure Disk Encryption is permitted to retrieve secrets from the vault",
  },
  enabledForTemplateDeployment: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description:
      "Whether Azure Resource Manager is permitted to retrieve secrets from the vault",
  },
  enableRbacAuthorization: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: true,
    description:
      "Whether Azure RBAC is used to authorize data actions instead of access policies",
  },
  enableSoftDelete: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: true,
    description: "Whether soft-delete is enabled on the Key Vault",
  },
  softDeleteRetentionInDays: {
    dataType: PropertyType.NUMBER,
    required: false,
    defaultValue: 90,
    description:
      "Number of days that items should be retained after soft-delete (7-90)",
    validation: [
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { min: 7, max: 90 },
        message: "softDeleteRetentionInDays must be between 7 and 90",
      },
    ],
  },
  enablePurgeProtection: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description:
      "Whether purge protection is enabled. Once enabled, this property cannot be disabled",
  },
  publicNetworkAccess: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Enabled",
    description:
      "Whether the Key Vault accepts traffic from public networks (Enabled/Disabled)",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Enabled|Disabled)$",
        message: "publicNetworkAccess must be either 'Enabled' or 'Disabled'",
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

const COMMON_REQUIRED = ["location", "name", "tenantId"];
const COMMON_OPTIONAL = [
  "sku",
  "tags",
  "accessPolicies",
  "networkAcls",
  "enabledForDeployment",
  "enabledForDiskEncryption",
  "enabledForTemplateDeployment",
  "enableRbacAuthorization",
  "enableSoftDelete",
  "softDeleteRetentionInDays",
  "enablePurgeProtection",
  "publicNetworkAccess",
  "ignoreChanges",
];

const COMMON_VALIDATION_RULES = [
  {
    property: "location",
    rules: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Key Vaults",
      },
    ],
  },
  {
    property: "name",
    rules: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required for Key Vaults",
      },
    ],
  },
];

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Key Vault version 2023-02-01
 */
export const KEY_VAULT_SCHEMA_2023_02_01: ApiSchema = {
  resourceType: "Microsoft.KeyVault/vaults",
  version: "2023-02-01",
  properties: { ...COMMON_PROPERTIES },
  required: [...COMMON_REQUIRED],
  optional: [...COMMON_OPTIONAL],
  deprecated: [],
  transformationRules: {},
  validationRules: [...COMMON_VALIDATION_RULES],
};

/**
 * API Schema for Key Vault version 2023-07-01
 */
export const KEY_VAULT_SCHEMA_2023_07_01: ApiSchema = {
  resourceType: "Microsoft.KeyVault/vaults",
  version: "2023-07-01",
  properties: { ...COMMON_PROPERTIES },
  required: [...COMMON_REQUIRED],
  optional: [...COMMON_OPTIONAL],
  deprecated: [],
  transformationRules: {},
  validationRules: [...COMMON_VALIDATION_RULES],
};

/**
 * API Schema for Key Vault version 2024-11-01
 */
export const KEY_VAULT_SCHEMA_2024_11_01: ApiSchema = {
  resourceType: "Microsoft.KeyVault/vaults",
  version: "2024-11-01",
  properties: { ...COMMON_PROPERTIES },
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
 * Version configuration for Key Vault 2023-02-01
 */
export const KEY_VAULT_VERSION_2023_02_01: VersionConfig = {
  version: "2023-02-01",
  schema: KEY_VAULT_SCHEMA_2023_02_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2023-02-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/key-vault/migration-2023-02-01",
  changeLog: [
    {
      changeType: "added",
      description: "Stable release of Key Vault API",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Key Vault 2023-07-01
 */
export const KEY_VAULT_VERSION_2023_07_01: VersionConfig = {
  version: "2023-07-01",
  schema: KEY_VAULT_SCHEMA_2023_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2023-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/key-vault/migration-2023-07-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Enhanced security features and minor API improvements",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Key Vault 2024-11-01
 */
export const KEY_VAULT_VERSION_2024_11_01: VersionConfig = {
  version: "2024-11-01",
  schema: KEY_VAULT_SCHEMA_2024_11_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-11-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/key-vault/migration-2024-11-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Latest API version with improved performance and features",
      breaking: false,
    },
  ],
};

/**
 * All supported Key Vault versions for registration
 */
export const ALL_KEY_VAULT_VERSIONS: VersionConfig[] = [
  KEY_VAULT_VERSION_2023_02_01,
  KEY_VAULT_VERSION_2023_07_01,
  KEY_VAULT_VERSION_2024_11_01,
];

/**
 * Resource type constant
 */
export const KEY_VAULT_TYPE = "Microsoft.KeyVault/vaults";
