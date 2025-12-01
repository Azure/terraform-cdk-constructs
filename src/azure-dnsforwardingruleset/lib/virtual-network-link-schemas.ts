/**
 * API schemas for Azure DNS Forwarding Ruleset Virtual Network Link across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/dnsForwardingRulesets/virtualNetworkLinks
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
 * Common property definitions shared across all Virtual Network Link versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The name of the Virtual Network Link. Must be unique within the ruleset.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Virtual Network Link name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$",
        message:
          "Virtual Network Link name must start and end with alphanumeric characters and can contain hyphens",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 80 },
        message:
          "Virtual Network Link name must be between 1 and 80 characters",
      },
    ],
  },
  dnsForwardingRulesetId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The resource ID of the parent DNS Forwarding Ruleset to link the virtual network to",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "DNS Forwarding Ruleset ID is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value:
          "^/subscriptions/[^/]+/resourceGroups/[^/]+/providers/Microsoft.Network/dnsForwardingRulesets/[^/]+$",
        message: "DNS Forwarding Ruleset ID must be a valid resource ID",
      },
    ],
  },
  virtualNetworkId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The resource ID of the Virtual Network to link to the DNS Forwarding Ruleset",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Virtual Network ID is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value:
          "^/subscriptions/[^/]+/resourceGroups/[^/]+/providers/Microsoft.Network/virtualNetworks/[^/]+$",
        message: "Virtual Network ID must be a valid resource ID",
      },
    ],
  },
  metadata: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description:
      "Metadata attached to the virtual network link as key-value pairs",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Metadata must be an object with string key-value pairs",
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
      "The provisioning state of the Virtual Network Link resource (read-only)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "ProvisioningState must be a string",
      },
    ],
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Virtual Network Link version 2022-07-01
 */
export const VIRTUAL_NETWORK_LINK_SCHEMA_2022_07_01: ApiSchema = {
  resourceType: "Microsoft.Network/dnsForwardingRulesets/virtualNetworkLinks",
  version: "2022-07-01",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
  },
  required: ["name", "dnsForwardingRulesetId", "virtualNetworkId"],
  optional: ["metadata", "ignoreChanges"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Virtual Network Links",
        },
      ],
    },
    {
      property: "dnsForwardingRulesetId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message:
            "DNS Forwarding Ruleset ID is required for Virtual Network Links",
        },
      ],
    },
    {
      property: "virtualNetworkId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Virtual Network ID is required for Virtual Network Links",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Virtual Network Link 2022-07-01
 */
export const VIRTUAL_NETWORK_LINK_VERSION_2022_07_01: VersionConfig = {
  version: "2022-07-01",
  schema: VIRTUAL_NETWORK_LINK_SCHEMA_2022_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2022-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-network-link/migration-2022-07-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release of Virtual Network Link API for DNS Forwarding Rulesets",
      breaking: false,
    },
  ],
};

/**
 * All supported Virtual Network Link versions for registration
 */
export const ALL_VIRTUAL_NETWORK_LINK_VERSIONS: VersionConfig[] = [
  VIRTUAL_NETWORK_LINK_VERSION_2022_07_01,
];

/**
 * Resource type constant
 */
export const VIRTUAL_NETWORK_LINK_TYPE =
  "Microsoft.Network/dnsForwardingRulesets/virtualNetworkLinks";
