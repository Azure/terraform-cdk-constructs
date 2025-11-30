/**
 * API schemas for Azure Virtual Network Manager Network Group Static Members across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/networkManagers/networkGroups/staticMembers
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
 * Common property definitions shared across all Static Member versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the static member",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Static member name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,62}[a-zA-Z0-9_]$",
        message:
          "Static member name must be 2-64 chars, alphanumeric, periods, underscores, hyphens",
      },
    ],
  },
  networkGroupId: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Resource ID of the parent Network Group",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Network Group ID is required",
      },
    ],
  },
  resourceId: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Full resource ID of the VNet or Subnet to add to the group",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Resource ID is required for static members",
      },
    ],
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Static Member version 2024-05-01
 */
export const STATIC_MEMBER_SCHEMA_2024_05_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkManagers/networkGroups/staticMembers",
  version: "2024-05-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["name", "networkGroupId", "resourceId"],
  optional: [],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Static member name is required",
        },
      ],
    },
    {
      property: "networkGroupId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Network Group ID is required",
        },
      ],
    },
    {
      property: "resourceId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Resource ID is required",
        },
      ],
    },
  ],
};

/**
 * API Schema for Static Member version 2023-11-01
 */
export const STATIC_MEMBER_SCHEMA_2023_11_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkManagers/networkGroups/staticMembers",
  version: "2023-11-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["name", "networkGroupId", "resourceId"],
  optional: [],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Static member name is required",
        },
      ],
    },
    {
      property: "networkGroupId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Network Group ID is required",
        },
      ],
    },
    {
      property: "resourceId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Resource ID is required",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Static Member 2024-05-01
 */
export const STATIC_MEMBER_VERSION_2024_05_01: VersionConfig = {
  version: "2024-05-01",
  schema: STATIC_MEMBER_SCHEMA_2024_05_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-05-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-network-manager/migration-2024-05-01",
  changeLog: [
    {
      changeType: "added",
      description: "Latest stable release with full static member support",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Static Member 2023-11-01
 */
export const STATIC_MEMBER_VERSION_2023_11_01: VersionConfig = {
  version: "2023-11-01",
  schema: STATIC_MEMBER_SCHEMA_2023_11_01,
  supportLevel: VersionSupportLevel.MAINTENANCE,
  releaseDate: "2023-11-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-network-manager/migration-2023-11-01",
  changeLog: [
    {
      changeType: "added",
      description: "Stable release with core static member features",
      breaking: false,
    },
  ],
};

/**
 * All supported Static Member versions for registration
 */
export const ALL_STATIC_MEMBER_VERSIONS: VersionConfig[] = [
  STATIC_MEMBER_VERSION_2024_05_01,
  STATIC_MEMBER_VERSION_2023_11_01,
];

/**
 * Resource type constant
 */
export const STATIC_MEMBER_TYPE =
  "Microsoft.Network/networkManagers/networkGroups/staticMembers";
