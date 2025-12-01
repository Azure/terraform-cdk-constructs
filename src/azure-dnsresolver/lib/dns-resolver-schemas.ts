/**
 * API schemas for Azure DNS Private Resolver across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/dnsResolvers
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
 * Common property definitions shared across all DNS Resolver versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The Azure region where the DNS Resolver will be created. DNS Resolvers are regional resources.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for DNS Resolvers",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description:
      "A dictionary of tags to apply to the DNS Resolver for organizational, billing, or other purposes",
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
      "The name of the DNS Resolver. Must be unique within the resource group.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "DNS Resolver name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$",
        message:
          "DNS Resolver name must start and end with alphanumeric characters and can contain hyphens",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 80 },
        message: "DNS Resolver name must be between 1 and 80 characters",
      },
    ],
  },
  virtualNetworkId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The resource ID of the virtual network where the DNS Resolver will be deployed. The resolver requires a dedicated subnet.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Virtual Network ID is required for DNS Resolvers",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value:
          "^/subscriptions/[^/]+/resourceGroups/[^/]+/providers/Microsoft.Network/virtualNetworks/[^/]+$",
        message: "Virtual Network ID must be a valid Azure resource ID",
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
  dnsResolverState: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The state of the DNS Resolver. Can be 'Connected' or 'Disconnected' (read-only)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "DnsResolverState must be a string",
      },
    ],
  },
  provisioningState: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The provisioning state of the DNS Resolver resource (read-only)",
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
      "The unique identifier for the DNS Resolver resource (read-only)",
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
 * API Schema for DNS Resolver version 2022-07-01
 */
export const DNS_RESOLVER_SCHEMA_2022_07_01: ApiSchema = {
  resourceType: "Microsoft.Network/dnsResolvers",
  version: "2022-07-01",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
  },
  required: ["location", "name", "virtualNetworkId"],
  optional: ["tags", "ignoreChanges"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for DNS Resolvers",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for DNS Resolvers",
        },
      ],
    },
    {
      property: "virtualNetworkId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Virtual Network ID is required for DNS Resolvers",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for DNS Resolver 2022-07-01
 */
export const DNS_RESOLVER_VERSION_2022_07_01: VersionConfig = {
  version: "2022-07-01",
  schema: DNS_RESOLVER_SCHEMA_2022_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2022-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/dns-resolver/migration-2022-07-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release of DNS Resolver API with support for hybrid DNS scenarios and conditional forwarding",
      breaking: false,
    },
  ],
};

/**
 * All supported DNS Resolver versions for registration
 */
export const ALL_DNS_RESOLVER_VERSIONS: VersionConfig[] = [
  DNS_RESOLVER_VERSION_2022_07_01,
];

/**
 * Resource type constant
 */
export const DNS_RESOLVER_TYPE = "Microsoft.Network/dnsResolvers";
