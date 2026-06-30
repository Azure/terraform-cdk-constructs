/**
 * API schemas for Azure Bastion Host across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/bastionHosts
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
 * Common property definitions shared across all Bastion Host versions
 */
const COMMON_BASTION_HOST_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Azure region for the Bastion host",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-z0-9]+$",
        message: "Location must contain only lowercase letters and numbers",
      },
    ],
  },
  name: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Name of the Bastion host",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,78}[a-zA-Z0-9_]$",
        message:
          "Bastion host name must be 2-80 chars, alphanumeric, periods, underscores, hyphens",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description: "Resource tags",
  },
  sku: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "SKU of the Bastion host (Developer, Basic, Standard, or Premium)",
  },
  zones: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Availability zones for the Bastion host",
  },
  ipConfigurations: {
    dataType: PropertyType.ARRAY,
    required: false,
    description:
      "IP configurations referencing the AzureBastionSubnet and a Standard public IP",
  },
  virtualNetwork: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Virtual network reference (Developer SKU only, mutually exclusive with ipConfigurations)",
  },
  scaleUnits: {
    dataType: PropertyType.NUMBER,
    required: false,
    description: "Number of scale units (2-50, Standard/Premium SKU only)",
  },
  dnsName: {
    dataType: PropertyType.STRING,
    required: false,
    description: "FQDN for the Bastion host",
  },
  enableTunneling: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description:
      "Enable native client support / tunneling (Standard/Premium SKU)",
  },
  enableIpConnect: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Enable IP-based connection (Standard/Premium SKU)",
  },
  enableShareableLink: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Enable shareable link (Standard/Premium SKU)",
  },
  enableKerberos: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Enable Kerberos authentication",
  },
  enableSessionRecording: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Enable session recording (Premium SKU)",
  },
  disableCopyPaste: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description:
      "Disable copy/paste in the web-based session (Standard/Premium)",
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

const BASTION_HOST_OPTIONAL_PROPERTIES = [
  "name",
  "tags",
  "sku",
  "zones",
  "ipConfigurations",
  "virtualNetwork",
  "scaleUnits",
  "dnsName",
  "enableTunneling",
  "enableIpConnect",
  "enableShareableLink",
  "enableKerberos",
  "enableSessionRecording",
  "disableCopyPaste",
  "ignoreChanges",
];

const BASTION_HOST_VALIDATION_RULES = [
  {
    property: "scaleUnits",
    rules: [
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { min: 2, max: 50 },
        message: "Scale units must be between 2 and 50",
      },
    ],
  },
];

/**
 * API Schema for Bastion Host version 2024-07-01
 */
export const BASTION_HOST_SCHEMA_2024_07_01: ApiSchema = {
  resourceType: "Microsoft.Network/bastionHosts",
  version: "2024-07-01",
  properties: {
    ...COMMON_BASTION_HOST_PROPERTIES,
  },
  required: ["location"],
  optional: [...BASTION_HOST_OPTIONAL_PROPERTIES],
  deprecated: [],
  transformationRules: {},
  validationRules: [...BASTION_HOST_VALIDATION_RULES],
};

/**
 * API Schema for Bastion Host version 2024-10-01
 */
export const BASTION_HOST_SCHEMA_2024_10_01: ApiSchema = {
  resourceType: "Microsoft.Network/bastionHosts",
  version: "2024-10-01",
  properties: {
    ...COMMON_BASTION_HOST_PROPERTIES,
  },
  required: ["location"],
  optional: [...BASTION_HOST_OPTIONAL_PROPERTIES],
  deprecated: [],
  transformationRules: {},
  validationRules: [...BASTION_HOST_VALIDATION_RULES],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Bastion Host 2024-07-01
 */
export const BASTION_HOST_VERSION_2024_07_01: VersionConfig = {
  version: "2024-07-01",
  schema: BASTION_HOST_SCHEMA_2024_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/bastion-host/migration-2024-07-01",
  changeLog: [
    {
      changeType: "added",
      description: "Stable release with native client and IP connect support",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Bastion Host 2024-10-01
 */
export const BASTION_HOST_VERSION_2024_10_01: VersionConfig = {
  version: "2024-10-01",
  schema: BASTION_HOST_SCHEMA_2024_10_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-10-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/bastion-host/migration-2024-10-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Enhanced performance and reliability improvements",
      breaking: false,
    },
  ],
};

/**
 * All supported Bastion Host versions for registration
 */
export const ALL_BASTION_HOST_VERSIONS: VersionConfig[] = [
  BASTION_HOST_VERSION_2024_07_01,
  BASTION_HOST_VERSION_2024_10_01,
];

/**
 * Resource type constant
 */
export const BASTION_HOST_TYPE = "Microsoft.Network/bastionHosts";
