/**
 * API schemas for Azure Virtual Network Manager across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/networkManagers
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
 * Common property definitions shared across all Virtual Network Manager versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Name of the network manager",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,62}[a-zA-Z0-9_]$",
        message:
          "Network Manager name must be 2-64 chars, alphanumeric, periods, underscores, hyphens",
      },
    ],
  },
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Azure region for the network manager",
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
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description: "Resource tags",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Tags must be an object with string key-value pairs",
      },
    ],
  },
  resourceGroupId: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Resource ID of the resource group where the network manager will be created",
  },
  networkManagerScopes: {
    dataType: PropertyType.OBJECT,
    required: true,
    description:
      "Defines the scope of management (management groups and/or subscriptions)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Network manager scopes are required",
      },
    ],
  },
  networkManagerScopeAccesses: {
    dataType: PropertyType.ARRAY,
    required: true,
    description:
      "Features enabled for the network manager (Connectivity, SecurityAdmin, Routing)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Network manager scope accesses are required",
      },
    ],
  },
  description: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Description of the network manager",
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Virtual Network Manager version 2024-05-01
 */
export const VIRTUAL_NETWORK_MANAGER_SCHEMA_2024_05_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkManagers",
  version: "2024-05-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "networkManagerScopes", "networkManagerScopeAccesses"],
  optional: ["name", "tags", "description", "resourceGroupId"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Network Managers",
        },
      ],
    },
    {
      property: "networkManagerScopes",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Network manager scopes are required",
        },
      ],
    },
    {
      property: "networkManagerScopeAccesses",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Network manager scope accesses are required",
        },
      ],
    },
  ],
};

/**
 * API Schema for Virtual Network Manager version 2023-11-01
 */
export const VIRTUAL_NETWORK_MANAGER_SCHEMA_2023_11_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkManagers",
  version: "2023-11-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "networkManagerScopes", "networkManagerScopeAccesses"],
  optional: ["name", "tags", "description", "resourceGroupId"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Network Managers",
        },
      ],
    },
    {
      property: "networkManagerScopes",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Network manager scopes are required",
        },
      ],
    },
    {
      property: "networkManagerScopeAccesses",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Network manager scope accesses are required",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Virtual Network Manager 2024-05-01
 */
export const VIRTUAL_NETWORK_MANAGER_VERSION_2024_05_01: VersionConfig = {
  version: "2024-05-01",
  schema: VIRTUAL_NETWORK_MANAGER_SCHEMA_2024_05_01,
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
        "Latest stable release with full support for routing configurations, security admin configurations, and connectivity configurations",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Virtual Network Manager 2023-11-01
 */
export const VIRTUAL_NETWORK_MANAGER_VERSION_2023_11_01: VersionConfig = {
  version: "2023-11-01",
  schema: VIRTUAL_NETWORK_MANAGER_SCHEMA_2023_11_01,
  supportLevel: VersionSupportLevel.MAINTENANCE,
  releaseDate: "2023-11-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-network-manager/migration-2023-11-01",
  changeLog: [
    {
      changeType: "added",
      description: "Stable release with core Network Manager features",
      breaking: false,
    },
  ],
};

/**
 * All supported Virtual Network Manager versions for registration
 */
export const ALL_VIRTUAL_NETWORK_MANAGER_VERSIONS: VersionConfig[] = [
  VIRTUAL_NETWORK_MANAGER_VERSION_2024_05_01,
  VIRTUAL_NETWORK_MANAGER_VERSION_2023_11_01,
];

/**
 * Resource type constant
 */
export const VIRTUAL_NETWORK_MANAGER_TYPE = "Microsoft.Network/networkManagers";
