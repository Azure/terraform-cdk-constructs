/**
 * API schemas for Azure Event Hubs across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.EventHub/namespaces
 * and Microsoft.EventHub/namespaces/eventhubs across all supported API versions.
 * The schemas are used by the AzapiResource framework for validation,
 * transformation, and version management.
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
// EVENT HUB NAMESPACE
// =============================================================================

/**
 * Common property definitions shared across all Event Hub Namespace versions
 */
const COMMON_EVENT_HUB_NAMESPACE_PROPERTIES: {
  [key: string]: PropertyDefinition;
} = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the Event Hubs namespace (must be globally unique)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z][a-zA-Z0-9-]{4,48}[a-zA-Z0-9]$",
        message:
          "Namespace name must be 6-50 characters, start with a letter, end with a letter or number, and contain only letters, numbers, and hyphens",
      },
    ],
  },
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Azure region where the namespace will be created",
  },
  sku: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "SKU configuration for the namespace. Options: Basic, Standard, Premium",
  },
  zoneRedundant: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Enable zone redundancy for the namespace",
  },
  isAutoInflateEnabled: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Enable auto-inflate for throughput units (Standard tier)",
  },
  maximumThroughputUnits: {
    dataType: PropertyType.NUMBER,
    required: false,
    description:
      "Upper limit of throughput units when auto-inflate is enabled (0-40)",
    validation: [
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { min: 0, max: 40 },
        message: "maximumThroughputUnits must be between 0 and 40",
      },
    ],
  },
  minimumTlsVersion: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Minimum TLS version for the namespace: 1.0, 1.1, or 1.2",
  },
  publicNetworkAccess: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Public network access for the namespace: Enabled or Disabled",
  },
  disableLocalAuth: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description:
      "Disable SAS authentication, requiring Azure AD authentication only",
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Managed identity configuration for the namespace",
  },
};

/**
 * API Schema for Event Hub Namespace version 2024-01-01
 *
 * This is the latest stable version for Event Hub Namespaces.
 */
export const EVENT_HUB_NAMESPACE_SCHEMA_2024_01_01: ApiSchema = {
  resourceType: "Microsoft.EventHub/namespaces",
  version: "2024-01-01",
  properties: {
    ...COMMON_EVENT_HUB_NAMESPACE_PROPERTIES,
  },
  required: ["name", "location"],
  optional: [
    "sku",
    "zoneRedundant",
    "isAutoInflateEnabled",
    "maximumThroughputUnits",
    "minimumTlsVersion",
    "publicNetworkAccess",
    "disableLocalAuth",
    "identity",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Event Hub Namespace",
        },
      ],
    },
  ],
};

/**
 * API Schema for Event Hub Namespace version 2021-11-01
 *
 * This is a stable version for backward compatibility.
 */
export const EVENT_HUB_NAMESPACE_SCHEMA_2021_11_01: ApiSchema = {
  resourceType: "Microsoft.EventHub/namespaces",
  version: "2021-11-01",
  properties: {
    ...COMMON_EVENT_HUB_NAMESPACE_PROPERTIES,
  },
  required: ["name", "location"],
  optional: [
    "sku",
    "zoneRedundant",
    "isAutoInflateEnabled",
    "maximumThroughputUnits",
    "minimumTlsVersion",
    "publicNetworkAccess",
    "disableLocalAuth",
    "identity",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Event Hub Namespace",
        },
      ],
    },
  ],
};

/**
 * Version configuration for Event Hub Namespace 2024-01-01
 */
export const EVENT_HUB_NAMESPACE_VERSION_2024_01_01: VersionConfig = {
  version: "2024-01-01",
  schema: EVENT_HUB_NAMESPACE_SCHEMA_2024_01_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-01-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/event-hub/migration-2024-01-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Latest stable API version for Event Hubs",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Event Hub Namespace 2021-11-01
 */
export const EVENT_HUB_NAMESPACE_VERSION_2021_11_01: VersionConfig = {
  version: "2021-11-01",
  schema: EVENT_HUB_NAMESPACE_SCHEMA_2021_11_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2021-11-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/event-hub/migration-2021-11-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Stable API version for backward compatibility",
      breaking: false,
    },
  ],
};

/**
 * All supported Event Hub Namespace versions for registration
 * Ordered with latest stable version first
 */
export const ALL_EVENT_HUB_NAMESPACE_VERSIONS: VersionConfig[] = [
  EVENT_HUB_NAMESPACE_VERSION_2024_01_01,
  EVENT_HUB_NAMESPACE_VERSION_2021_11_01,
];

/**
 * Resource type constant for Event Hub Namespace
 */
export const EVENT_HUB_NAMESPACE_TYPE = "Microsoft.EventHub/namespaces";

// =============================================================================
// EVENT HUB (ENTITY)
// =============================================================================

/**
 * Common property definitions shared across all Event Hub (entity) versions
 */
const COMMON_EVENT_HUB_PROPERTIES: {
  [key: string]: PropertyDefinition;
} = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Name of the Event Hub",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,254}$",
        message:
          "Event Hub name must be 1-255 characters and contain only letters, numbers, periods, hyphens, and underscores",
      },
    ],
  },
  partitionCount: {
    dataType: PropertyType.NUMBER,
    required: false,
    defaultValue: 2,
    description: "Number of partitions for the Event Hub (1-32 for Standard)",
    validation: [
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { min: 1, max: 1024 },
        message: "partitionCount must be between 1 and 1024",
      },
    ],
  },
  messageRetentionInDays: {
    dataType: PropertyType.NUMBER,
    required: false,
    defaultValue: 1,
    description:
      "Number of days to retain events (1-7 for Standard, up to 90 for Premium/Dedicated)",
    validation: [
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { min: 1, max: 90 },
        message: "messageRetentionInDays must be between 1 and 90",
      },
    ],
  },
  status: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "Status of the Event Hub: Active, Disabled, SendDisabled, ReceiveDisabled",
  },
};

/**
 * API Schema for Event Hub (entity) version 2024-01-01
 */
export const EVENT_HUB_SCHEMA_2024_01_01: ApiSchema = {
  resourceType: "Microsoft.EventHub/namespaces/eventhubs",
  version: "2024-01-01",
  properties: {
    ...COMMON_EVENT_HUB_PROPERTIES,
  },
  required: ["name"],
  optional: ["partitionCount", "messageRetentionInDays", "status"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Event Hub",
        },
      ],
    },
  ],
};

/**
 * API Schema for Event Hub (entity) version 2021-11-01
 */
export const EVENT_HUB_SCHEMA_2021_11_01: ApiSchema = {
  resourceType: "Microsoft.EventHub/namespaces/eventhubs",
  version: "2021-11-01",
  properties: {
    ...COMMON_EVENT_HUB_PROPERTIES,
  },
  required: ["name"],
  optional: ["partitionCount", "messageRetentionInDays", "status"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Event Hub",
        },
      ],
    },
  ],
};

/**
 * Version configuration for Event Hub (entity) 2024-01-01
 */
export const EVENT_HUB_VERSION_2024_01_01: VersionConfig = {
  version: "2024-01-01",
  schema: EVENT_HUB_SCHEMA_2024_01_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-01-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/event-hub/migration-2024-01-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Latest stable API version for Event Hubs",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Event Hub (entity) 2021-11-01
 */
export const EVENT_HUB_VERSION_2021_11_01: VersionConfig = {
  version: "2021-11-01",
  schema: EVENT_HUB_SCHEMA_2021_11_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2021-11-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/event-hub/migration-2021-11-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Stable API version for backward compatibility",
      breaking: false,
    },
  ],
};

/**
 * All supported Event Hub (entity) versions for registration
 * Ordered with latest stable version first
 */
export const ALL_EVENT_HUB_VERSIONS: VersionConfig[] = [
  EVENT_HUB_VERSION_2024_01_01,
  EVENT_HUB_VERSION_2021_11_01,
];

/**
 * Resource type constant for Event Hub (entity)
 */
export const EVENT_HUB_TYPE = "Microsoft.EventHub/namespaces/eventhubs";
