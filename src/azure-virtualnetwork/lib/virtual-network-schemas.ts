/**
 * API schemas for Azure Virtual Network across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/virtualNetworks
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
 * Common property definitions shared across all Virtual Network versions
 */
const COMMON_VNET_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Azure region for the virtual network",
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
    description: "Name of the virtual network",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,62}[a-zA-Z0-9_]$",
        message:
          "VNet name must be 2-64 chars, alphanumeric, periods, underscores, hyphens",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description: "Resource tags",
  },
  addressSpace: {
    dataType: PropertyType.OBJECT,
    required: true,
    description: "Address space for the virtual network",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Address space is required",
      },
    ],
  },
  subnets: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Subnets in the virtual network",
  },
  dhcpOptions: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "DHCP options configuration",
  },
  enableDdosProtection: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Enable DDoS protection",
  },
  enableVmProtection: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Enable VM protection",
  },
  encryption: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Encryption settings for the virtual network",
  },
  flowTimeoutInMinutes: {
    dataType: PropertyType.NUMBER,
    required: false,
    description: "Flow timeout in minutes for the virtual network",
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
 * API Schema for Virtual Network version 2024-07-01
 */
export const VIRTUAL_NETWORK_SCHEMA_2024_07_01: ApiSchema = {
  resourceType: "Microsoft.Network/virtualNetworks",
  version: "2024-07-01",
  properties: {
    ...COMMON_VNET_PROPERTIES,
  },
  required: ["location", "addressSpace"],
  optional: [
    "name",
    "tags",
    "subnets",
    "dhcpOptions",
    "enableDdosProtection",
    "enableVmProtection",
    "encryption",
    "flowTimeoutInMinutes",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "addressSpace",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Address space is required for Virtual Networks",
        },
      ],
    },
  ],
};

/**
 * API Schema for Virtual Network version 2024-10-01
 */
export const VIRTUAL_NETWORK_SCHEMA_2024_10_01: ApiSchema = {
  resourceType: "Microsoft.Network/virtualNetworks",
  version: "2024-10-01",
  properties: {
    ...COMMON_VNET_PROPERTIES,
  },
  required: ["location", "addressSpace"],
  optional: [
    "name",
    "tags",
    "subnets",
    "dhcpOptions",
    "enableDdosProtection",
    "enableVmProtection",
    "encryption",
    "flowTimeoutInMinutes",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "addressSpace",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Address space is required for Virtual Networks",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Virtual Network 2024-07-01
 */
export const VIRTUAL_NETWORK_VERSION_2024_07_01: VersionConfig = {
  version: "2024-07-01",
  schema: VIRTUAL_NETWORK_SCHEMA_2024_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-network/migration-2024-07-01",
  changeLog: [
    {
      changeType: "added",
      description: "Stable release with enhanced networking features",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Virtual Network 2024-10-01
 */
export const VIRTUAL_NETWORK_VERSION_2024_10_01: VersionConfig = {
  version: "2024-10-01",
  schema: VIRTUAL_NETWORK_SCHEMA_2024_10_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-10-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-network/migration-2024-10-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Enhanced performance and reliability improvements",
      breaking: false,
    },
  ],
};

/**
 * All supported Virtual Network versions for registration
 */
export const ALL_VIRTUAL_NETWORK_VERSIONS: VersionConfig[] = [
  VIRTUAL_NETWORK_VERSION_2024_07_01,
  VIRTUAL_NETWORK_VERSION_2024_10_01,
];

/**
 * Resource type constant
 */
export const VIRTUAL_NETWORK_TYPE = "Microsoft.Network/virtualNetworks";
