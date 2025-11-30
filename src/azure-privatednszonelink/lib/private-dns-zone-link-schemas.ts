/**
 * API schemas for Azure Private DNS Zone Virtual Network Links across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Network/privateDnsZones/virtualNetworkLinks
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
 * Common property definitions shared across all Private DNS Zone Virtual Network Link versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    defaultValue: "global",
    description:
      "The Azure region where the Virtual Network Link will be created. Virtual Network Links are typically 'global' resources",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Virtual Network Links",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description:
      "A dictionary of tags to apply to the Virtual Network Link for organizational, billing, or other purposes",
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
      "The name of the Virtual Network Link. Must be unique within the Private DNS Zone",
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
  privateDnsZoneId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The resource ID of the parent Private DNS Zone to link the virtual network to",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Private DNS Zone ID is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value:
          "^/subscriptions/[^/]+/resourceGroups/[^/]+/providers/Microsoft.Network/privateDnsZones/[^/]+$",
        message: "Private DNS Zone ID must be a valid resource ID",
      },
    ],
  },
  virtualNetworkId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The resource ID of the Virtual Network to link to the Private DNS Zone",
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
  registrationEnabled: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description:
      "Whether auto-registration of virtual machine records is enabled in the virtual network in the Private DNS zone",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.BOOLEAN,
        message: "RegistrationEnabled must be a boolean value",
      },
    ],
  },
  resolutionPolicy: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The resolution policy for the virtual network link. Only applicable to Private Link zones (zones ending with 'privatelink.*'). Possible values: 'Default' (standard resolution) or 'NxDomainRedirect' (fallback to Azure DNS for unresolved queries)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "ResolutionPolicy must be a string",
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
  virtualNetworkLinkState: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The state of the virtual network link (read-only). Possible values: 'InProgress', 'Completed'",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "VirtualNetworkLinkState must be a string",
      },
    ],
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Private DNS Zone Virtual Network Link version 2024-06-01
 */
export const PRIVATE_DNS_ZONE_LINK_SCHEMA_2024_06_01: ApiSchema = {
  resourceType: "Microsoft.Network/privateDnsZones/virtualNetworkLinks",
  version: "2024-06-01",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
  },
  required: ["location", "name", "privateDnsZoneId", "virtualNetworkId"],
  optional: [
    "tags",
    "registrationEnabled",
    "resolutionPolicy",
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
          message: "Location is required for Virtual Network Links",
        },
      ],
    },
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
      property: "privateDnsZoneId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Private DNS Zone ID is required for Virtual Network Links",
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
 * Version configuration for Private DNS Zone Virtual Network Link 2024-06-01
 */
export const PRIVATE_DNS_ZONE_LINK_VERSION_2024_06_01: VersionConfig = {
  version: "2024-06-01",
  schema: PRIVATE_DNS_ZONE_LINK_SCHEMA_2024_06_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-06-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/private-dns-zone-link/migration-2024-06-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Latest stable release of Private DNS Zone Virtual Network Links API with full support for VNet linking and auto-registration",
      breaking: false,
    },
  ],
};

/**
 * All supported Private DNS Zone Virtual Network Link versions for registration
 */
export const ALL_PRIVATE_DNS_ZONE_LINK_VERSIONS: VersionConfig[] = [
  PRIVATE_DNS_ZONE_LINK_VERSION_2024_06_01,
];

/**
 * Resource type constant
 */
export const PRIVATE_DNS_ZONE_LINK_TYPE =
  "Microsoft.Network/privateDnsZones/virtualNetworkLinks";
