/**
 * API schemas for Azure Resource Group across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Resources/resourceGroups
 * across all supported API versions. The schemas are used by the VersionedAzapiResource
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
 * Common property definitions shared across all Resource Group versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The Azure region where the Resource Group will be created",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Resource Groups",
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
    description:
      "A dictionary of tags to apply to the Resource Group for organizational, billing, or other purposes",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Tags must be an object with string key-value pairs",
      },
    ],
  },
  managedBy: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The ID of the resource that manages this resource group",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "ManagedBy must be a string containing a resource ID",
      },
    ],
  },
  name: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The name of the Azure Resource Group. Must be unique within your Azure subscription",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9._\\-()]+$",
        message:
          "Resource Group name can only contain alphanumeric characters, periods, underscores, hyphens, and parentheses",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 90 },
        message: "Resource Group name must be between 1 and 90 characters",
      },
    ],
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
 * API Schema for Resource Group version 2024-11-01
 */
export const RESOURCE_GROUP_SCHEMA_2024_11_01: ApiSchema = {
  resourceType: "Microsoft.Resources/resourceGroups",
  version: "2024-11-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location"],
  optional: ["name", "tags", "managedBy", "ignoreChanges"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Resource Groups",
        },
      ],
    },
  ],
};

/**
 * API Schema for Resource Group version 2025-01-01
 */
export const RESOURCE_GROUP_SCHEMA_2025_01_01: ApiSchema = {
  resourceType: "Microsoft.Resources/resourceGroups",
  version: "2025-01-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location"],
  optional: ["name", "tags", "managedBy", "ignoreChanges"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Resource Groups",
        },
      ],
    },
  ],
};

/**
 * API Schema for Resource Group version 2025-03-01
 */
export const RESOURCE_GROUP_SCHEMA_2025_03_01: ApiSchema = {
  resourceType: "Microsoft.Resources/resourceGroups",
  version: "2025-03-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location"],
  optional: ["name", "tags", "managedBy", "ignoreChanges"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Resource Groups",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Resource Group 2024-11-01
 */
export const RESOURCE_GROUP_VERSION_2024_11_01: VersionConfig = {
  version: "2024-11-01",
  schema: RESOURCE_GROUP_SCHEMA_2024_11_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-11-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/resource-group/migration-2024-11-01",
  changeLog: [
    {
      changeType: "added",
      description: "Initial stable release of Resource Group API",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Resource Group 2025-01-01
 */
export const RESOURCE_GROUP_VERSION_2025_01_01: VersionConfig = {
  version: "2025-01-01",
  schema: RESOURCE_GROUP_SCHEMA_2025_01_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-01-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/resource-group/migration-2025-01-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Minor API improvements and enhanced validation",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Resource Group 2025-03-01
 */
export const RESOURCE_GROUP_VERSION_2025_03_01: VersionConfig = {
  version: "2025-03-01",
  schema: RESOURCE_GROUP_SCHEMA_2025_03_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-03-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/resource-group/migration-2025-03-01",
  changeLog: [
    {
      changeType: "updated",
      description:
        "Latest API version with improved performance and reliability",
      breaking: false,
    },
  ],
};

/**
 * All supported Resource Group versions for registration
 */
export const ALL_RESOURCE_GROUP_VERSIONS: VersionConfig[] = [
  RESOURCE_GROUP_VERSION_2024_11_01,
  RESOURCE_GROUP_VERSION_2025_01_01,
  RESOURCE_GROUP_VERSION_2025_03_01,
];

/**
 * Resource type constant
 */
export const RESOURCE_GROUP_TYPE = "Microsoft.Resources/resourceGroups";
