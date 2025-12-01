/**
 * API schemas for Azure Virtual Network Manager Security Admin Rule Collections across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections
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
 * Network group reference for rule collection
 */
export interface SecurityAdminConfigurationRuleGroupItem {
  readonly networkGroupId: string;
}

// =============================================================================
// COMMON PROPERTY DEFINITIONS
// =============================================================================

/**
 * Common property definitions shared across all Rule Collection versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the rule collection",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Rule collection name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,62}[a-zA-Z0-9_]$",
        message:
          "Rule collection name must be 2-64 chars, alphanumeric, periods, underscores, hyphens",
      },
    ],
  },
  securityAdminConfigurationId: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Resource ID of the parent Security Admin Configuration",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Security Admin Configuration ID is required",
      },
    ],
  },
  description: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Description of the rule collection",
  },
  appliesToGroups: {
    dataType: PropertyType.ARRAY,
    required: true,
    description: "Network groups to apply this rule collection to",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "At least one network group must be specified",
      },
    ],
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Rule Collection version 2024-05-01
 */
export const RULE_COLLECTION_SCHEMA_2024_05_01: ApiSchema = {
  resourceType:
    "Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections",
  version: "2024-05-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["name", "securityAdminConfigurationId", "appliesToGroups"],
  optional: ["description"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Rule collection name is required",
        },
      ],
    },
    {
      property: "securityAdminConfigurationId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Security Admin Configuration ID is required",
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
 * API Schema for Rule Collection version 2023-11-01
 */
export const RULE_COLLECTION_SCHEMA_2023_11_01: ApiSchema = {
  resourceType:
    "Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections",
  version: "2023-11-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["name", "securityAdminConfigurationId", "appliesToGroups"],
  optional: ["description"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Rule collection name is required",
        },
      ],
    },
    {
      property: "securityAdminConfigurationId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Security Admin Configuration ID is required",
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
 * Version configuration for Rule Collection 2024-05-01
 */
export const RULE_COLLECTION_VERSION_2024_05_01: VersionConfig = {
  version: "2024-05-01",
  schema: RULE_COLLECTION_SCHEMA_2024_05_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-05-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-network-manager/migration-2024-05-01",
  changeLog: [
    {
      changeType: "added",
      description: "Latest stable release with full rule collection support",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Rule Collection 2023-11-01
 */
export const RULE_COLLECTION_VERSION_2023_11_01: VersionConfig = {
  version: "2023-11-01",
  schema: RULE_COLLECTION_SCHEMA_2023_11_01,
  supportLevel: VersionSupportLevel.MAINTENANCE,
  releaseDate: "2023-11-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-network-manager/migration-2023-11-01",
  changeLog: [
    {
      changeType: "added",
      description: "Stable release with core rule collection features",
      breaking: false,
    },
  ],
};

/**
 * All supported Rule Collection versions for registration
 */
export const ALL_RULE_COLLECTION_VERSIONS: VersionConfig[] = [
  RULE_COLLECTION_VERSION_2024_05_01,
  RULE_COLLECTION_VERSION_2023_11_01,
];

/**
 * Resource type constant
 */
export const RULE_COLLECTION_TYPE =
  "Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections";
