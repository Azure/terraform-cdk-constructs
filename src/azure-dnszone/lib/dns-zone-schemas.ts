/**
 * API schemas for Azure DNS Zone across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/dnsZones
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
 * Common property definitions shared across all DNS Zone versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    defaultValue: "global",
    description:
      "The Azure region where the DNS Zone will be created. DNS Zones are global resources, so this is typically 'global'",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for DNS Zones",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description:
      "A dictionary of tags to apply to the DNS Zone for organizational, billing, or other purposes",
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
      "The name of the DNS Zone (without a terminating dot). Must be a valid domain name",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "DNS Zone name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value:
          "^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$",
        message:
          "DNS Zone name must be a valid domain name without terminating dot",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 253 },
        message: "DNS Zone name must be between 1 and 253 characters",
      },
    ],
  },
  zoneType: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Public",
    description:
      "The type of this DNS zone (Public or Private). Public zones are Internet-accessible",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Public|Private)$",
        message: "Zone type must be either 'Public' or 'Private'",
      },
    ],
  },
  registrationVirtualNetworks: {
    dataType: PropertyType.ARRAY,
    required: false,
    description:
      "A list of references to virtual networks that register hostnames in this DNS zone. Only valid when zoneType is Private",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.ARRAY,
        message:
          "RegistrationVirtualNetworks must be an array of virtual network references",
      },
    ],
  },
  resolutionVirtualNetworks: {
    dataType: PropertyType.ARRAY,
    required: false,
    description:
      "A list of references to virtual networks that resolve records in this DNS zone. Only valid when zoneType is Private",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.ARRAY,
        message:
          "ResolutionVirtualNetworks must be an array of virtual network references",
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
 * API Schema for DNS Zone version 2018-05-01
 */
export const DNS_ZONE_SCHEMA_2018_05_01: ApiSchema = {
  resourceType: "Microsoft.Network/dnsZones",
  version: "2018-05-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name"],
  optional: [
    "tags",
    "zoneType",
    "registrationVirtualNetworks",
    "resolutionVirtualNetworks",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for DNS Zones",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for DNS Zones",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for DNS Zone 2018-05-01
 */
export const DNS_ZONE_VERSION_2018_05_01: VersionConfig = {
  version: "2018-05-01",
  schema: DNS_ZONE_SCHEMA_2018_05_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2018-05-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/dns-zone/migration-2018-05-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release of DNS Zone API with support for public and private DNS zones",
      breaking: false,
    },
  ],
};

/**
 * All supported DNS Zone versions for registration
 */
export const ALL_DNS_ZONE_VERSIONS: VersionConfig[] = [
  DNS_ZONE_VERSION_2018_05_01,
];

/**
 * Resource type constant
 */
export const DNS_ZONE_TYPE = "Microsoft.Network/dnsZones";
