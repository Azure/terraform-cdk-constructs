/**
 * API schemas for Azure Private DNS Zone across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/privateDnsZones
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
 * Common property definitions shared across all Private DNS Zone versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    defaultValue: "global",
    description:
      "The Azure region where the Private DNS Zone will be created. Private DNS Zones are global resources, so this is typically 'global'",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Private DNS Zones",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description:
      "A dictionary of tags to apply to the Private DNS Zone for organizational, billing, or other purposes",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Tags must be an object with string key-value pairs",
      },
    ],
  },
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The name of the Private DNS Zone (without a terminating dot). Must be a valid domain name",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Private DNS Zone name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value:
          "^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$",
        message:
          "Private DNS Zone name must be a valid domain name without terminating dot",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 253 },
        message: "Private DNS Zone name must be between 1 and 253 characters",
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
// READ-ONLY PROPERTY DEFINITIONS
// =============================================================================

/**
 * Read-only properties that are populated by Azure after creation
 * These properties should not be included in the request body
 */
const READ_ONLY_PROPERTIES: { [key: string]: PropertyDefinition } = {
  maxNumberOfRecordSets: {
    dataType: PropertyType.NUMBER,
    required: false,
    description:
      "The maximum number of record sets that can be created in this Private DNS zone (read-only)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.NUMBER,
        message: "MaxNumberOfRecordSets must be a number",
      },
    ],
  },
  numberOfRecordSets: {
    dataType: PropertyType.NUMBER,
    required: false,
    description:
      "The current number of record sets in this Private DNS zone (read-only)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.NUMBER,
        message: "NumberOfRecordSets must be a number",
      },
    ],
  },
  maxNumberOfVirtualNetworkLinks: {
    dataType: PropertyType.NUMBER,
    required: false,
    description:
      "The maximum number of virtual network links that can be created in this Private DNS zone (read-only)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.NUMBER,
        message: "MaxNumberOfVirtualNetworkLinks must be a number",
      },
    ],
  },
  numberOfVirtualNetworkLinks: {
    dataType: PropertyType.NUMBER,
    required: false,
    description:
      "The current number of virtual network links in this Private DNS zone (read-only)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.NUMBER,
        message: "NumberOfVirtualNetworkLinks must be a number",
      },
    ],
  },
  maxNumberOfVirtualNetworkLinksWithRegistration: {
    dataType: PropertyType.NUMBER,
    required: false,
    description:
      "The maximum number of virtual network links with auto-registration that can be created in this Private DNS zone (read-only)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.NUMBER,
        message:
          "MaxNumberOfVirtualNetworkLinksWithRegistration must be a number",
      },
    ],
  },
  numberOfVirtualNetworkLinksWithRegistration: {
    dataType: PropertyType.NUMBER,
    required: false,
    description:
      "The current number of virtual network links with auto-registration in this Private DNS zone (read-only)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.NUMBER,
        message: "NumberOfVirtualNetworkLinksWithRegistration must be a number",
      },
    ],
  },
  provisioningState: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The provisioning state of the Private DNS zone resource (read-only)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "ProvisioningState must be a string",
      },
    ],
  },
  internalId: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Internal identifier for the Private DNS zone (read-only)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "InternalId must be a string",
      },
    ],
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Private DNS Zone version 2024-06-01
 */
export const PRIVATE_DNS_ZONE_SCHEMA_2024_06_01: ApiSchema = {
  resourceType: "Microsoft.Network/privateDnsZones",
  version: "2024-06-01",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
  },
  required: ["location", "name"],
  optional: ["tags", "ignoreChanges"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Private DNS Zones",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Private DNS Zones",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Private DNS Zone 2024-06-01
 */
export const PRIVATE_DNS_ZONE_VERSION_2024_06_01: VersionConfig = {
  version: "2024-06-01",
  schema: PRIVATE_DNS_ZONE_SCHEMA_2024_06_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-06-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/private-dns-zone/migration-2024-06-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Latest stable release of Private DNS Zone API with full support for private DNS zones and virtual network links",
      breaking: false,
    },
  ],
};

/**
 * All supported Private DNS Zone versions for registration
 */
export const ALL_PRIVATE_DNS_ZONE_VERSIONS: VersionConfig[] = [
  PRIVATE_DNS_ZONE_VERSION_2024_06_01,
];

/**
 * Resource type constant
 */
export const PRIVATE_DNS_ZONE_TYPE = "Microsoft.Network/privateDnsZones";
