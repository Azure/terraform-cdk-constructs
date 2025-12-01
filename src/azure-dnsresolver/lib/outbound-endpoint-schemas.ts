/**
 * API schemas for Azure DNS Resolver Outbound Endpoints across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/dnsResolvers/outboundEndpoints
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
 * Common property definitions shared across all DNS Resolver Outbound Endpoint versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The Azure region where the Outbound Endpoint will be created. Must match the parent DNS Resolver region.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Outbound Endpoints",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description:
      "A dictionary of tags to apply to the Outbound Endpoint for organizational, billing, or other purposes",
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
      "The name of the Outbound Endpoint. Must be unique within the DNS Resolver",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Outbound Endpoint name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$",
        message:
          "Outbound Endpoint name must start and end with alphanumeric characters and can contain hyphens",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 80 },
        message: "Outbound Endpoint name must be between 1 and 80 characters",
      },
    ],
  },
  dnsResolverId: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The resource ID of the parent DNS Resolver",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "DNS Resolver ID is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value:
          "^/subscriptions/[^/]+/resourceGroups/[^/]+/providers/Microsoft.Network/dnsResolvers/[^/]+$",
        message: "DNS Resolver ID must be a valid resource ID",
      },
    ],
  },
  subnetId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The resource ID of the subnet where the Outbound Endpoint will be deployed. Must be a dedicated subnet between /28 and /24 with delegation to Microsoft.Network/dnsResolvers",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Subnet ID is required for Outbound Endpoints",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value:
          "^/subscriptions/[^/]+/resourceGroups/[^/]+/providers/Microsoft.Network/virtualNetworks/[^/]+/subnets/[^/]+$",
        message: "Subnet ID must be a valid subnet resource ID",
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
      "The provisioning state of the Outbound Endpoint resource (read-only)",
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
      "The unique identifier for the Outbound Endpoint resource (read-only)",
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
 * API Schema for DNS Resolver Outbound Endpoint version 2022-07-01
 */
export const DNS_RESOLVER_OUTBOUND_ENDPOINT_SCHEMA_2022_07_01: ApiSchema = {
  resourceType: "Microsoft.Network/dnsResolvers/outboundEndpoints",
  version: "2022-07-01",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
  },
  required: ["location", "name", "dnsResolverId", "subnetId"],
  optional: ["tags", "ignoreChanges"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Outbound Endpoints",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Outbound Endpoints",
        },
      ],
    },
    {
      property: "dnsResolverId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "DNS Resolver ID is required for Outbound Endpoints",
        },
      ],
    },
    {
      property: "subnetId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Subnet ID is required for Outbound Endpoints",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for DNS Resolver Outbound Endpoint 2022-07-01
 */
export const DNS_RESOLVER_OUTBOUND_ENDPOINT_VERSION_2022_07_01: VersionConfig =
  {
    version: "2022-07-01",
    schema: DNS_RESOLVER_OUTBOUND_ENDPOINT_SCHEMA_2022_07_01,
    supportLevel: VersionSupportLevel.ACTIVE,
    releaseDate: "2022-07-01",
    deprecationDate: undefined,
    sunsetDate: undefined,
    breakingChanges: [],
    migrationGuide: "/docs/dns-resolver-outbound-endpoint/migration-2022-07-01",
    changeLog: [
      {
        changeType: "added",
        description:
          "Stable release of DNS Resolver Outbound Endpoint API with support for DNS forwarding to external DNS servers",
        breaking: false,
      },
    ],
  };

/**
 * All supported DNS Resolver Outbound Endpoint versions for registration
 */
export const ALL_DNS_RESOLVER_OUTBOUND_ENDPOINT_VERSIONS: VersionConfig[] = [
  DNS_RESOLVER_OUTBOUND_ENDPOINT_VERSION_2022_07_01,
];

/**
 * Resource type constant
 */
export const DNS_RESOLVER_OUTBOUND_ENDPOINT_TYPE =
  "Microsoft.Network/dnsResolvers/outboundEndpoints";
