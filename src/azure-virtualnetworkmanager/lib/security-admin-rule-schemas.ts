/**
 * API schemas for Azure Virtual Network Manager Security Admin Rules across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections/rules
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
// TYPESCRIPT INTERFACES FOR NESTED OBJECTS
// =============================================================================

/**
 * Address prefix item for sources or destinations
 */
export interface AddressPrefixItem {
  readonly addressPrefix?: string;
  readonly addressPrefixType?: "IPPrefix" | "ServiceTag";
}

// =============================================================================
// COMMON PROPERTY DEFINITIONS
// =============================================================================

/**
 * Common property definitions shared across all Security Admin Rule versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the security admin rule",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Security admin rule name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,62}[a-zA-Z0-9_]$",
        message:
          "Security admin rule name must be 2-64 chars, alphanumeric, periods, underscores, hyphens",
      },
    ],
  },
  ruleCollectionId: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Resource ID of the parent Rule Collection",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Rule Collection ID is required",
      },
    ],
  },
  description: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Description of the security admin rule",
  },
  priority: {
    dataType: PropertyType.NUMBER,
    required: true,
    description:
      "Priority of the rule (1-4096, lower number = higher priority)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Priority is required",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { min: 1, max: 4096 },
        message: "Priority must be between 1 and 4096",
      },
    ],
  },
  action: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Action to take (Allow, Deny, or AlwaysAllow)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Action is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Allow|Deny|AlwaysAllow)$",
        message: "Action must be 'Allow', 'Deny', or 'AlwaysAllow'",
      },
    ],
  },
  direction: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Direction of traffic (Inbound or Outbound)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Direction is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Inbound|Outbound)$",
        message: "Direction must be 'Inbound' or 'Outbound'",
      },
    ],
  },
  protocol: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Protocol (Tcp, Udp, Icmp, Esp, Ah, or Any)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Protocol is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Tcp|Udp|Icmp|Esp|Ah|Any)$",
        message: "Protocol must be Tcp, Udp, Icmp, Esp, Ah, or Any",
      },
    ],
  },
  sourcePortRanges: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Source port ranges (e.g., ['*'], ['80', '443'])",
  },
  destinationPortRanges: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Destination port ranges (e.g., ['*'], ['22', '3389'])",
  },
  sources: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Source addresses or network groups",
  },
  destinations: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Destination addresses or network groups",
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Security Admin Rule version 2024-05-01
 */
export const SECURITY_ADMIN_RULE_SCHEMA_2024_05_01: ApiSchema = {
  resourceType:
    "Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections/rules",
  version: "2024-05-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: [
    "name",
    "ruleCollectionId",
    "priority",
    "action",
    "direction",
    "protocol",
  ],
  optional: [
    "description",
    "sourcePortRanges",
    "destinationPortRanges",
    "sources",
    "destinations",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Security admin rule name is required",
        },
      ],
    },
    {
      property: "ruleCollectionId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Rule Collection ID is required",
        },
      ],
    },
    {
      property: "priority",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Priority is required",
        },
      ],
    },
    {
      property: "action",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Action is required",
        },
      ],
    },
    {
      property: "direction",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Direction is required",
        },
      ],
    },
    {
      property: "protocol",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Protocol is required",
        },
      ],
    },
  ],
};

/**
 * API Schema for Security Admin Rule version 2023-11-01
 */
export const SECURITY_ADMIN_RULE_SCHEMA_2023_11_01: ApiSchema = {
  resourceType:
    "Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections/rules",
  version: "2023-11-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: [
    "name",
    "ruleCollectionId",
    "priority",
    "action",
    "direction",
    "protocol",
  ],
  optional: [
    "description",
    "sourcePortRanges",
    "destinationPortRanges",
    "sources",
    "destinations",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Security admin rule name is required",
        },
      ],
    },
    {
      property: "ruleCollectionId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Rule Collection ID is required",
        },
      ],
    },
    {
      property: "priority",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Priority is required",
        },
      ],
    },
    {
      property: "action",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Action is required",
        },
      ],
    },
    {
      property: "direction",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Direction is required",
        },
      ],
    },
    {
      property: "protocol",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Protocol is required",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Security Admin Rule 2024-05-01
 */
export const SECURITY_ADMIN_RULE_VERSION_2024_05_01: VersionConfig = {
  version: "2024-05-01",
  schema: SECURITY_ADMIN_RULE_SCHEMA_2024_05_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-05-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-network-manager/migration-2024-05-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Latest stable release with full security admin rule support",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Security Admin Rule 2023-11-01
 */
export const SECURITY_ADMIN_RULE_VERSION_2023_11_01: VersionConfig = {
  version: "2023-11-01",
  schema: SECURITY_ADMIN_RULE_SCHEMA_2023_11_01,
  supportLevel: VersionSupportLevel.MAINTENANCE,
  releaseDate: "2023-11-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-network-manager/migration-2023-11-01",
  changeLog: [
    {
      changeType: "added",
      description: "Stable release with core security admin rule features",
      breaking: false,
    },
  ],
};

/**
 * All supported Security Admin Rule versions for registration
 */
export const ALL_SECURITY_ADMIN_RULE_VERSIONS: VersionConfig[] = [
  SECURITY_ADMIN_RULE_VERSION_2024_05_01,
  SECURITY_ADMIN_RULE_VERSION_2023_11_01,
];

/**
 * Resource type constant
 */
export const SECURITY_ADMIN_RULE_TYPE =
  "Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections/rules";
