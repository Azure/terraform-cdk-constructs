/**
 * API schemas for Azure Virtual Network Manager Security Admin Configurations across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/networkManagers/securityAdminConfigurations
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
 * Common property definitions shared across all Security Admin Configuration versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the security admin configuration",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Security admin configuration name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,62}[a-zA-Z0-9_]$",
        message:
          "Security admin configuration name must be 2-64 chars, alphanumeric, periods, underscores, hyphens",
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
    description: "Description of the security admin configuration",
  },
  applyOnNetworkIntentPolicyBasedServices: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Services to apply the security admin configuration on",
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Security Admin Configuration version 2024-05-01
 */
export const SECURITY_ADMIN_CONFIGURATION_SCHEMA_2024_05_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkManagers/securityAdminConfigurations",
  version: "2024-05-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["name", "networkManagerId"],
  optional: ["description", "applyOnNetworkIntentPolicyBasedServices"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Security admin configuration name is required",
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
 * API Schema for Security Admin Configuration version 2023-11-01
 */
export const SECURITY_ADMIN_CONFIGURATION_SCHEMA_2023_11_01: ApiSchema = {
  resourceType: "Microsoft.Network/networkManagers/securityAdminConfigurations",
  version: "2023-11-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["name", "networkManagerId"],
  optional: ["description", "applyOnNetworkIntentPolicyBasedServices"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Security admin configuration name is required",
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
 * Version configuration for Security Admin Configuration 2024-05-01
 */
export const SECURITY_ADMIN_CONFIGURATION_VERSION_2024_05_01: VersionConfig = {
  version: "2024-05-01",
  schema: SECURITY_ADMIN_CONFIGURATION_SCHEMA_2024_05_01,
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
        "Latest stable release with full security admin configuration support",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Security Admin Configuration 2023-11-01
 */
export const SECURITY_ADMIN_CONFIGURATION_VERSION_2023_11_01: VersionConfig = {
  version: "2023-11-01",
  schema: SECURITY_ADMIN_CONFIGURATION_SCHEMA_2023_11_01,
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
        "Stable release with core security admin configuration features",
      breaking: false,
    },
  ],
};

/**
 * All supported Security Admin Configuration versions for registration
 */
export const ALL_SECURITY_ADMIN_CONFIGURATION_VERSIONS: VersionConfig[] = [
  SECURITY_ADMIN_CONFIGURATION_VERSION_2024_05_01,
  SECURITY_ADMIN_CONFIGURATION_VERSION_2023_11_01,
];

/**
 * Resource type constant
 */
export const SECURITY_ADMIN_CONFIGURATION_TYPE =
  "Microsoft.Network/networkManagers/securityAdminConfigurations";
