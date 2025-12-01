/**
 * API schemas for Azure Virtual Network Manager Network Groups across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/networkManagers/networkGroups
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
 * Common property definitions shared across all Network Group versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the network group",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Network group name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,62}[a-zA-Z0-9_]$",
        message:
          "Network group name must be 2-64 chars, alphanumeric, periods, underscores, hyphens",
      },
    ],
  },
  networkManagerId: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Resource ID of the parent Network Manager",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Network Manager ID is required",
      },
    ],
  },
  description: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Description of the network group",
  },
  memberType: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Type of members in the network group (VirtualNetwork or Subnet)",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(VirtualNetwork|Subnet)$",
        message: "Member type must be 'VirtualNetwork' or 'Subnet'",
      },
    ],
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Network Group version 2024-05-01
 */
export const NETWORK_GROUP_SCHEMA_2024_05_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkManagers/networkGroups",
  version: "2024-05-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["name", "networkManagerId"],
  optional: ["description", "memberType"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Network group name is required",
        },
      ],
    },
    {
      property: "networkManagerId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Network Manager ID is required",
        },
      ],
    },
  ],
};

/**
 * API Schema for Network Group version 2023-11-01
 */
export const NETWORK_GROUP_SCHEMA_2023_11_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkManagers/networkGroups",
  version: "2023-11-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["name", "networkManagerId"],
  optional: ["description", "memberType"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Network group name is required",
        },
      ],
    },
    {
      property: "networkManagerId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Network Manager ID is required",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Network Group 2024-05-01
 */
export const NETWORK_GROUP_VERSION_2024_05_01: VersionConfig = {
  version: "2024-05-01",
  schema: NETWORK_GROUP_SCHEMA_2024_05_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-05-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-network-manager/migration-2024-05-01",
  changeLog: [
    {
      changeType: "added",
      description: "Latest stable release with full network group support",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Network Group 2023-11-01
 */
export const NETWORK_GROUP_VERSION_2023_11_01: VersionConfig = {
  version: "2023-11-01",
  schema: NETWORK_GROUP_SCHEMA_2023_11_01,
  supportLevel: VersionSupportLevel.MAINTENANCE,
  releaseDate: "2023-11-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-network-manager/migration-2023-11-01",
  changeLog: [
    {
      changeType: "added",
      description: "Stable release with core network group features",
      breaking: false,
    },
  ],
};

/**
 * All supported Network Group versions for registration
 */
export const ALL_NETWORK_GROUP_VERSIONS: VersionConfig[] = [
  NETWORK_GROUP_VERSION_2024_05_01,
  NETWORK_GROUP_VERSION_2023_11_01,
];

/**
 * Resource type constant
 */
export const NETWORK_GROUP_TYPE =
  "Microsoft.Network/networkManagers/networkGroups";
