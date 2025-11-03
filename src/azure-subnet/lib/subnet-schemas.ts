/**
 * API schemas for Azure Subnet across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/virtualNetworks/subnets
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
 * Common property definitions shared across all Subnet versions
 */
const COMMON_SUBNET_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Name of the subnet",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,78}[a-zA-Z0-9_]$",
        message:
          "Subnet name must be 2-80 chars, alphanumeric, periods, underscores, hyphens",
      },
    ],
  },
  virtualNetworkName: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the parent virtual network",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Virtual network name is required",
      },
    ],
  },
  addressPrefix: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Address prefix for the subnet in CIDR notation",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Address prefix is required",
      },
    ],
  },
  networkSecurityGroup: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Reference to network security group",
  },
  routeTable: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Reference to route table",
  },
  serviceEndpoints: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Service endpoints for the subnet",
  },
  delegations: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Subnet delegations for Azure services",
  },
  privateEndpointNetworkPolicies: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Disabled",
    description: "Private endpoint network policies (Enabled or Disabled)",
  },
  privateLinkServiceNetworkPolicies: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "Enabled",
    description: "Private link service network policies (Enabled or Disabled)",
  },
  natGateway: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Reference to NAT gateway",
  },
  ipAllocations: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "IP allocations for the subnet",
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
 * API Schema for Subnet version 2024-07-01
 */
export const SUBNET_SCHEMA_2024_07_01: ApiSchema = {
  resourceType: "Microsoft.Network/virtualNetworks/subnets",
  version: "2024-07-01",
  properties: {
    ...COMMON_SUBNET_PROPERTIES,
  },
  required: ["virtualNetworkName", "addressPrefix"],
  optional: [
    "name",
    "networkSecurityGroup",
    "routeTable",
    "serviceEndpoints",
    "delegations",
    "privateEndpointNetworkPolicies",
    "privateLinkServiceNetworkPolicies",
    "natGateway",
    "ipAllocations",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "addressPrefix",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Address prefix is required for Subnets",
        },
      ],
    },
  ],
};

/**
 * API Schema for Subnet version 2024-10-01
 */
export const SUBNET_SCHEMA_2024_10_01: ApiSchema = {
  resourceType: "Microsoft.Network/virtualNetworks/subnets",
  version: "2024-10-01",
  properties: {
    ...COMMON_SUBNET_PROPERTIES,
  },
  required: ["virtualNetworkName", "addressPrefix"],
  optional: [
    "name",
    "networkSecurityGroup",
    "routeTable",
    "serviceEndpoints",
    "delegations",
    "privateEndpointNetworkPolicies",
    "privateLinkServiceNetworkPolicies",
    "natGateway",
    "ipAllocations",
    "ignoreChanges",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "addressPrefix",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Address prefix is required for Subnets",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Subnet 2024-07-01
 */
export const SUBNET_VERSION_2024_07_01: VersionConfig = {
  version: "2024-07-01",
  schema: SUBNET_SCHEMA_2024_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/subnet/migration-2024-07-01",
  changeLog: [
    {
      changeType: "added",
      description: "Stable release with enhanced subnet features",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Subnet 2024-10-01
 */
export const SUBNET_VERSION_2024_10_01: VersionConfig = {
  version: "2024-10-01",
  schema: SUBNET_SCHEMA_2024_10_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-10-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/subnet/migration-2024-10-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Enhanced performance and reliability improvements",
      breaking: false,
    },
  ],
};

/**
 * All supported Subnet versions for registration
 */
export const ALL_SUBNET_VERSIONS: VersionConfig[] = [
  SUBNET_VERSION_2024_07_01,
  SUBNET_VERSION_2024_10_01,
];

/**
 * Resource type constant
 */
export const SUBNET_TYPE = "Microsoft.Network/virtualNetworks/subnets";
