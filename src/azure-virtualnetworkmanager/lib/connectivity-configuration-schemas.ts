/**
 * API schemas for Azure Virtual Network Manager Connectivity Configurations across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/networkManagers/connectivityConfigurations
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
 * Network group reference for connectivity configuration
 */
export interface ConnectivityGroupItem {
  readonly networkGroupId: string;
  readonly groupConnectivity?: "None" | "DirectlyConnected";
  readonly isGlobal?: boolean;
  readonly useHubGateway?: boolean;
}

/**
 * Hub configuration for hub-and-spoke topology
 */
export interface Hub {
  readonly resourceId: string;
  readonly resourceType: string;
}

// =============================================================================
// COMMON PROPERTY DEFINITIONS
// =============================================================================

/**
 * Common property definitions shared across all Connectivity Configuration versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the connectivity configuration",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Connectivity configuration name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,62}[a-zA-Z0-9_]$",
        message:
          "Connectivity configuration name must be 2-64 chars, alphanumeric, periods, underscores, hyphens",
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
    description: "Description of the connectivity configuration",
  },
  connectivityTopology: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Connectivity topology type (HubAndSpoke or Mesh)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Connectivity topology is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(HubAndSpoke|Mesh)$",
        message: "Connectivity topology must be 'HubAndSpoke' or 'Mesh'",
      },
    ],
  },
  appliesToGroups: {
    dataType: PropertyType.ARRAY,
    required: true,
    description: "Network groups to apply this configuration to",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "At least one network group must be specified",
      },
    ],
  },
  hubs: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Hub VNets for hub-and-spoke topology",
  },
  isGlobal: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Enable global mesh connectivity",
  },
  deleteExistingPeering: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Delete existing peerings when applying configuration",
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Connectivity Configuration version 2024-05-01
 */
export const CONNECTIVITY_CONFIGURATION_SCHEMA_2024_05_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkManagers/connectivityConfigurations",
  version: "2024-05-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: [
    "name",
    "networkManagerId",
    "connectivityTopology",
    "appliesToGroups",
  ],
  optional: ["description", "hubs", "isGlobal", "deleteExistingPeering"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Connectivity configuration name is required",
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
    {
      property: "connectivityTopology",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Connectivity topology is required",
        },
      ],
    },
    {
      property: "appliesToGroups",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "At least one network group must be specified",
        },
      ],
    },
  ],
};

/**
 * API Schema for Connectivity Configuration version 2023-11-01
 */
export const CONNECTIVITY_CONFIGURATION_SCHEMA_2023_11_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkManagers/connectivityConfigurations",
  version: "2023-11-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: [
    "name",
    "networkManagerId",
    "connectivityTopology",
    "appliesToGroups",
  ],
  optional: ["description", "hubs", "isGlobal", "deleteExistingPeering"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Connectivity configuration name is required",
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
    {
      property: "connectivityTopology",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Connectivity topology is required",
        },
      ],
    },
    {
      property: "appliesToGroups",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "At least one network group must be specified",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Connectivity Configuration 2024-05-01
 */
export const CONNECTIVITY_CONFIGURATION_VERSION_2024_05_01: VersionConfig = {
  version: "2024-05-01",
  schema: CONNECTIVITY_CONFIGURATION_SCHEMA_2024_05_01,
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
        "Latest stable release with full connectivity configuration support",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Connectivity Configuration 2023-11-01
 */
export const CONNECTIVITY_CONFIGURATION_VERSION_2023_11_01: VersionConfig = {
  version: "2023-11-01",
  schema: CONNECTIVITY_CONFIGURATION_SCHEMA_2023_11_01,
  supportLevel: VersionSupportLevel.MAINTENANCE,
  releaseDate: "2023-11-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-network-manager/migration-2023-11-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release with core connectivity configuration features",
      breaking: false,
    },
  ],
};

/**
 * All supported Connectivity Configuration versions for registration
 */
export const ALL_CONNECTIVITY_CONFIGURATION_VERSIONS: VersionConfig[] = [
  CONNECTIVITY_CONFIGURATION_VERSION_2024_05_01,
  CONNECTIVITY_CONFIGURATION_VERSION_2023_11_01,
];

/**
 * Resource type constant
 */
export const CONNECTIVITY_CONFIGURATION_TYPE =
  "Microsoft.Network/networkManagers/connectivityConfigurations";
