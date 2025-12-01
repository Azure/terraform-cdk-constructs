/**
 * API schemas for Azure DNS Forwarding Ruleset across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/dnsForwardingRulesets
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
 * Common property definitions shared across all DNS Forwarding Ruleset versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The Azure region where the DNS Forwarding Ruleset will be created. DNS Forwarding Rulesets are regional resources.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for DNS Forwarding Rulesets",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description:
      "A dictionary of tags to apply to the DNS Forwarding Ruleset for organizational, billing, or other purposes",
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
      "The name of the DNS Forwarding Ruleset. Must be unique within the resource group.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "DNS Forwarding Ruleset name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$",
        message:
          "DNS Forwarding Ruleset name must start and end with alphanumeric characters and can contain hyphens",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 80 },
        message:
          "DNS Forwarding Ruleset name must be between 1 and 80 characters",
      },
    ],
  },
  dnsResolverOutboundEndpointIds: {
    dataType: PropertyType.ARRAY,
    required: true,
    description:
      "Array of resource IDs of DNS Resolver Outbound Endpoints that this ruleset will use for forwarding DNS queries",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message:
          "At least one DNS Resolver Outbound Endpoint ID is required for DNS Forwarding Rulesets",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.ARRAY,
        message: "DnsResolverOutboundEndpointIds must be an array of strings",
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
  provisioningState: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The provisioning state of the DNS Forwarding Ruleset resource (read-only)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "ProvisioningState must be a string",
      },
    ],
  },
  resourceGuid: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The unique identifier for the DNS Forwarding Ruleset resource (read-only)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "ResourceGuid must be a string",
      },
    ],
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for DNS Forwarding Ruleset version 2022-07-01
 */
export const DNS_FORWARDING_RULESET_SCHEMA_2022_07_01: ApiSchema = {
  resourceType: "Microsoft.Network/dnsForwardingRulesets",
  version: "2022-07-01",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
  },
  required: ["location", "name", "dnsResolverOutboundEndpointIds"],
  optional: ["tags", "ignoreChanges"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for DNS Forwarding Rulesets",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for DNS Forwarding Rulesets",
        },
      ],
    },
    {
      property: "dnsResolverOutboundEndpointIds",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "At least one DNS Resolver Outbound Endpoint ID is required",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for DNS Forwarding Ruleset 2022-07-01
 */
export const DNS_FORWARDING_RULESET_VERSION_2022_07_01: VersionConfig = {
  version: "2022-07-01",
  schema: DNS_FORWARDING_RULESET_SCHEMA_2022_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2022-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/dns-forwarding-ruleset/migration-2022-07-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release of DNS Forwarding Ruleset API with support for conditional DNS forwarding",
      breaking: false,
    },
  ],
};

/**
 * All supported DNS Forwarding Ruleset versions for registration
 */
export const ALL_DNS_FORWARDING_RULESET_VERSIONS: VersionConfig[] = [
  DNS_FORWARDING_RULESET_VERSION_2022_07_01,
];

/**
 * Resource type constant
 */
export const DNS_FORWARDING_RULESET_TYPE =
  "Microsoft.Network/dnsForwardingRulesets";
