/**
 * API schemas for Azure Network Watcher across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/networkWatchers
 * across all supported API versions. The schemas are used by the AzapiResource
 * framework for validation, transformation, and version management.
 *
 * IMPORTANT: Azure only allows one Network Watcher per subscription per region.
 * Network Watcher is primarily used as a dependency for other Network Watcher features like:
 * - Flow Logs
 * - Connection Monitor
 * - Packet Capture
 * - Network Diagnostic Tools
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
 * Common property definitions shared across all Network Watcher versions
 *
 * Network Watcher is a relatively simple resource with minimal properties.
 * It primarily serves as an anchor for Network Watcher features (Flow Logs,
 * Connection Monitor, Packet Capture, etc.) in a specific region.
 */
const COMMON_NETWORK_WATCHER_PROPERTIES: {
  [key: string]: PropertyDefinition;
} = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the Network Watcher",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,78}[a-zA-Z0-9_]$",
        message:
          "Network Watcher name must be 1-80 characters, start with a letter or number, end with a letter, number, or underscore, and contain only letters, numbers, underscores, periods, and hyphens",
      },
    ],
  },
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "Azure region where the Network Watcher will be created. Note: Only one Network Watcher per region per subscription is allowed.",
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Network Watcher version 2024-01-01
 *
 * This is the latest stable version for Network Watcher.
 * Network Watcher is a relatively simple resource - it primarily serves as
 * an anchor for Network Watcher features in a region.
 */
export const NETWORK_WATCHER_SCHEMA_2024_01_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkWatchers",
  version: "2024-01-01",
  properties: {
    ...COMMON_NETWORK_WATCHER_PROPERTIES,
  },
  required: ["name", "location"],
  optional: [],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Network Watcher",
        },
      ],
    },
  ],
};

/**
 * API Schema for Network Watcher version 2023-11-01
 *
 * This is a stable version for backward compatibility.
 * Network Watcher API is very stable with minimal changes between versions.
 */
export const NETWORK_WATCHER_SCHEMA_2023_11_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkWatchers",
  version: "2023-11-01",
  properties: {
    ...COMMON_NETWORK_WATCHER_PROPERTIES,
  },
  required: ["name", "location"],
  optional: [],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Network Watcher",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Network Watcher 2024-01-01
 */
export const NETWORK_WATCHER_VERSION_2024_01_01: VersionConfig = {
  version: "2024-01-01",
  schema: NETWORK_WATCHER_SCHEMA_2024_01_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-01-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/network-watcher/migration-2024-01-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Latest stable API version",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Network Watcher 2023-11-01
 */
export const NETWORK_WATCHER_VERSION_2023_11_01: VersionConfig = {
  version: "2023-11-01",
  schema: NETWORK_WATCHER_SCHEMA_2023_11_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2023-11-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/network-watcher/migration-2023-11-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Stable API version for backward compatibility",
      breaking: false,
    },
  ],
};

/**
 * All supported Network Watcher versions for registration
 * Ordered with latest stable version first
 */
export const ALL_NETWORK_WATCHER_VERSIONS: VersionConfig[] = [
  NETWORK_WATCHER_VERSION_2024_01_01,
  NETWORK_WATCHER_VERSION_2023_11_01,
];

/**
 * Resource type constant
 */
export const NETWORK_WATCHER_TYPE = "Microsoft.Network/networkWatchers";
