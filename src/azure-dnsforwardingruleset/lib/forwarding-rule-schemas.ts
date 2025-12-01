/**
 * API schemas for Azure DNS Forwarding Rule across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/dnsForwardingRulesets/forwardingRules
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
 * Common property definitions shared across all Forwarding Rule versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The name of the Forwarding Rule. Must be unique within the ruleset.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Forwarding Rule name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$",
        message:
          "Forwarding Rule name must start and end with alphanumeric characters and can contain hyphens",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 80 },
        message: "Forwarding Rule name must be between 1 and 80 characters",
      },
    ],
  },
  dnsForwardingRulesetId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The resource ID of the parent DNS Forwarding Ruleset that this rule belongs to",
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
  domainName: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The domain name to forward (e.g., 'contoso.com.'). Must end with a dot for FQDN.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Domain name is required for Forwarding Rules",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "Domain name must be a string",
      },
    ],
  },
  targetDnsServers: {
    dataType: PropertyType.ARRAY,
    required: true,
    description:
      "Array of target DNS servers to forward queries to. Maximum of 6 servers per rule. Each server requires ipAddress, and optionally port (default 53).",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message:
          "At least one target DNS server is required for Forwarding Rules",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.ARRAY,
        message: "TargetDnsServers must be an array",
      },
    ],
  },
  forwardingRuleState: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Enabled",
    description:
      "The state of the forwarding rule. Possible values: 'Enabled' or 'Disabled'. Default is 'Enabled'.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "ForwardingRuleState must be a string",
      },
    ],
  },
  metadata: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description: "Metadata attached to the forwarding rule as key-value pairs",
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
      "The provisioning state of the Forwarding Rule resource (read-only)",
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
 * API Schema for Forwarding Rule version 2022-07-01
 */
export const FORWARDING_RULE_SCHEMA_2022_07_01: ApiSchema = {
  resourceType: "Microsoft.Network/dnsForwardingRulesets/forwardingRules",
  version: "2022-07-01",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
  },
  required: [
    "name",
    "dnsForwardingRulesetId",
    "domainName",
    "targetDnsServers",
  ],
  optional: ["forwardingRuleState", "metadata", "ignoreChanges"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Forwarding Rules",
        },
      ],
    },
    {
      property: "dnsForwardingRulesetId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "DNS Forwarding Ruleset ID is required for Forwarding Rules",
        },
      ],
    },
    {
      property: "domainName",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Domain name is required for Forwarding Rules",
        },
      ],
    },
    {
      property: "targetDnsServers",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "At least one target DNS server is required",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Forwarding Rule 2022-07-01
 */
export const FORWARDING_RULE_VERSION_2022_07_01: VersionConfig = {
  version: "2022-07-01",
  schema: FORWARDING_RULE_SCHEMA_2022_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2022-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/forwarding-rule/migration-2022-07-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release of Forwarding Rule API with support for conditional DNS forwarding",
      breaking: false,
    },
  ],
};

/**
 * All supported Forwarding Rule versions for registration
 */
export const ALL_FORWARDING_RULE_VERSIONS: VersionConfig[] = [
  FORWARDING_RULE_VERSION_2022_07_01,
];

/**
 * Resource type constant
 */
export const FORWARDING_RULE_TYPE =
  "Microsoft.Network/dnsForwardingRulesets/forwardingRules";
