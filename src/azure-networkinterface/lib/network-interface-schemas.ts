/**
 * API schemas for Azure Network Interface across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/networkInterfaces
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
 * Common property definitions shared across all Network Interface versions
 */
const COMMON_NETWORK_INTERFACE_PROPERTIES: {
  [key: string]: PropertyDefinition;
} = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Azure region for the network interface",
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
    description: "Name of the network interface",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,78}[a-zA-Z0-9_]$",
        message:
          "Network Interface name must be 2-80 chars, alphanumeric, periods, underscores, hyphens",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description: "Resource tags",
  },
  ipConfigurations: {
    dataType: PropertyType.ARRAY,
    required: true,
    description:
      "IP configurations for the network interface (at least one required)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "At least one IP configuration is required",
      },
    ],
  },
  networkSecurityGroup: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Network security group reference with id property",
  },
  enableAcceleratedNetworking: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Enable accelerated networking for high-performance scenarios",
  },
  enableIPForwarding: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Enable IP forwarding for network virtual appliances",
  },
  dnsSettings: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "DNS settings configuration with dnsServers array and internalDnsNameLabel",
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
 * API Schema for Network Interface version 2024-07-01
 */
export const NETWORK_INTERFACE_SCHEMA_2024_07_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkInterfaces",
  version: "2024-07-01",
  properties: {
    ...COMMON_NETWORK_INTERFACE_PROPERTIES,
  },
  required: ["location", "ipConfigurations"],
  optional: [
    "name",
    "tags",
    "networkSecurityGroup",
    "enableAcceleratedNetworking",
    "enableIPForwarding",
    "dnsSettings",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "ipConfigurations",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "At least one IP configuration is required",
        },
      ],
    },
  ],
};

/**
 * API Schema for Network Interface version 2024-10-01
 */
export const NETWORK_INTERFACE_SCHEMA_2024_10_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkInterfaces",
  version: "2024-10-01",
  properties: {
    ...COMMON_NETWORK_INTERFACE_PROPERTIES,
  },
  required: ["location", "ipConfigurations"],
  optional: [
    "name",
    "tags",
    "networkSecurityGroup",
    "enableAcceleratedNetworking",
    "enableIPForwarding",
    "dnsSettings",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "ipConfigurations",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "At least one IP configuration is required",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Network Interface 2024-07-01
 */
export const NETWORK_INTERFACE_VERSION_2024_07_01: VersionConfig = {
  version: "2024-07-01",
  schema: NETWORK_INTERFACE_SCHEMA_2024_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/network-interface/migration-2024-07-01",
  changeLog: [
    {
      changeType: "added",
      description: "Stable release with enhanced networking features",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Network Interface 2024-10-01
 */
export const NETWORK_INTERFACE_VERSION_2024_10_01: VersionConfig = {
  version: "2024-10-01",
  schema: NETWORK_INTERFACE_SCHEMA_2024_10_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-10-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/network-interface/migration-2024-10-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Enhanced performance and reliability improvements",
      breaking: false,
    },
  ],
};

/**
 * All supported Network Interface versions for registration
 */
export const ALL_NETWORK_INTERFACE_VERSIONS: VersionConfig[] = [
  NETWORK_INTERFACE_VERSION_2024_07_01,
  NETWORK_INTERFACE_VERSION_2024_10_01,
];

/**
 * Resource type constant
 */
export const NETWORK_INTERFACE_TYPE = "Microsoft.Network/networkInterfaces";
