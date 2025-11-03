/**
 * API schemas for Azure Public IP Address across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/publicIPAddresses
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
 * Common property definitions shared across all Public IP Address versions
 */
const COMMON_PUBLIC_IP_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Azure region for the public IP address",
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
    description: "Name of the public IP address",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,78}[a-zA-Z0-9_]$",
        message:
          "Public IP name must be 2-80 chars, alphanumeric, periods, underscores, hyphens",
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
    description: "SKU of the public IP address (Basic or Standard)",
  },
  publicIPAllocationMethod: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Dynamic",
    description: "IP allocation method: Static or Dynamic",
  },
  publicIPAddressVersion: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "IPv4",
    description: "IP address version: IPv4 or IPv6",
  },
  dnsSettings: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "DNS settings for the public IP address",
  },
  idleTimeoutInMinutes: {
    dataType: PropertyType.NUMBER,
    required: false,
    description: "Idle timeout in minutes (4-30)",
  },
  zones: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Availability zones for the public IP address",
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
 * API Schema for Public IP Address version 2024-07-01
 */
export const PUBLIC_IP_ADDRESS_SCHEMA_2024_07_01: ApiSchema = {
  resourceType: "Microsoft.Network/publicIPAddresses",
  version: "2024-07-01",
  properties: {
    ...COMMON_PUBLIC_IP_PROPERTIES,
  },
  required: ["location"],
  optional: [
    "name",
    "tags",
    "sku",
    "publicIPAllocationMethod",
    "publicIPAddressVersion",
    "dnsSettings",
    "idleTimeoutInMinutes",
    "zones",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "idleTimeoutInMinutes",
      rules: [
        {
          ruleType: ValidationRuleType.VALUE_RANGE,
          value: { min: 4, max: 30 },
          message: "Idle timeout must be between 4 and 30 minutes",
        },
      ],
    },
  ],
};

/**
 * API Schema for Public IP Address version 2024-10-01
 */
export const PUBLIC_IP_ADDRESS_SCHEMA_2024_10_01: ApiSchema = {
  resourceType: "Microsoft.Network/publicIPAddresses",
  version: "2024-10-01",
  properties: {
    ...COMMON_PUBLIC_IP_PROPERTIES,
  },
  required: ["location"],
  optional: [
    "name",
    "tags",
    "sku",
    "publicIPAllocationMethod",
    "publicIPAddressVersion",
    "dnsSettings",
    "idleTimeoutInMinutes",
    "zones",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "idleTimeoutInMinutes",
      rules: [
        {
          ruleType: ValidationRuleType.VALUE_RANGE,
          value: { min: 4, max: 30 },
          message: "Idle timeout must be between 4 and 30 minutes",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Public IP Address 2024-07-01
 */
export const PUBLIC_IP_ADDRESS_VERSION_2024_07_01: VersionConfig = {
  version: "2024-07-01",
  schema: PUBLIC_IP_ADDRESS_SCHEMA_2024_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/public-ip-address/migration-2024-07-01",
  changeLog: [
    {
      changeType: "added",
      description: "Stable release with enhanced networking features",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Public IP Address 2024-10-01
 */
export const PUBLIC_IP_ADDRESS_VERSION_2024_10_01: VersionConfig = {
  version: "2024-10-01",
  schema: PUBLIC_IP_ADDRESS_SCHEMA_2024_10_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-10-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/public-ip-address/migration-2024-10-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Enhanced performance and reliability improvements",
      breaking: false,
    },
  ],
};

/**
 * All supported Public IP Address versions for registration
 */
export const ALL_PUBLIC_IP_ADDRESS_VERSIONS: VersionConfig[] = [
  PUBLIC_IP_ADDRESS_VERSION_2024_07_01,
  PUBLIC_IP_ADDRESS_VERSION_2024_10_01,
];

/**
 * Resource type constant
 */
export const PUBLIC_IP_ADDRESS_TYPE = "Microsoft.Network/publicIPAddresses";
