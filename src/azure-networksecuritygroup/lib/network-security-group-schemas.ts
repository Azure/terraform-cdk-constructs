/**
 * API schemas for Azure Network Security Group across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/networkSecurityGroups
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
 * Common property definitions shared across all Network Security Group versions
 */
const COMMON_NSG_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Azure region for the network security group",
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
    description: "Name of the network security group",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,78}[a-zA-Z0-9_]$",
        message:
          "NSG name must be 2-80 chars, alphanumeric, periods, underscores, hyphens",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description: "Resource tags",
  },
  securityRules: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Security rules for the network security group",
  },
  flushConnection: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description:
      "When enabled, flows created from NSG connections will be re-evaluated when rules are updated",
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
 * API Schema for Network Security Group version 2024-07-01
 */
export const NETWORK_SECURITY_GROUP_SCHEMA_2024_07_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkSecurityGroups",
  version: "2024-07-01",
  properties: {
    ...COMMON_NSG_PROPERTIES,
  },
  required: ["location"],
  optional: [
    "name",
    "tags",
    "securityRules",
    "flushConnection",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "securityRules",
      rules: [
        {
          ruleType: ValidationRuleType.TYPE_CHECK,
          value: PropertyType.ARRAY,
          message: "Security rules must be an array",
        },
      ],
    },
  ],
};

/**
 * API Schema for Network Security Group version 2024-10-01
 */
export const NETWORK_SECURITY_GROUP_SCHEMA_2024_10_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkSecurityGroups",
  version: "2024-10-01",
  properties: {
    ...COMMON_NSG_PROPERTIES,
  },
  required: ["location"],
  optional: [
    "name",
    "tags",
    "securityRules",
    "flushConnection",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "securityRules",
      rules: [
        {
          ruleType: ValidationRuleType.TYPE_CHECK,
          value: PropertyType.ARRAY,
          message: "Security rules must be an array",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Network Security Group 2024-07-01
 */
export const NETWORK_SECURITY_GROUP_VERSION_2024_07_01: VersionConfig = {
  version: "2024-07-01",
  schema: NETWORK_SECURITY_GROUP_SCHEMA_2024_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/network-security-group/migration-2024-07-01",
  changeLog: [
    {
      changeType: "added",
      description: "Stable release with enhanced security features",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Network Security Group 2024-10-01
 */
export const NETWORK_SECURITY_GROUP_VERSION_2024_10_01: VersionConfig = {
  version: "2024-10-01",
  schema: NETWORK_SECURITY_GROUP_SCHEMA_2024_10_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-10-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/network-security-group/migration-2024-10-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Enhanced performance and reliability improvements",
      breaking: false,
    },
  ],
};

/**
 * All supported Network Security Group versions for registration
 */
export const ALL_NETWORK_SECURITY_GROUP_VERSIONS: VersionConfig[] = [
  NETWORK_SECURITY_GROUP_VERSION_2024_07_01,
  NETWORK_SECURITY_GROUP_VERSION_2024_10_01,
];

/**
 * Resource type constant
 */
export const NETWORK_SECURITY_GROUP_TYPE =
  "Microsoft.Network/networkSecurityGroups";
