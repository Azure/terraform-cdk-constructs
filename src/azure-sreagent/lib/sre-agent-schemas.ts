/**
 * API schemas for Azure SRE Agent across all supported versions
 *
 * This file defines the API schemas for Microsoft.App/agents (Azure SRE Agent)
 * across all supported API versions. The schemas are used by the
 * VersionedAzapiResource framework for validation, transformation, and version
 * management.
 *
 * Reference: https://github.com/Azure/azure-rest-api-specs/tree/main/specification/app/resource-manager/Microsoft.App/SreAgent
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
 * Common property definitions shared across all SRE Agent versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The Azure region where the SRE Agent will be created. Agents are regional tracked resources.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for SRE Agents",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description:
      "A dictionary of tags to apply to the SRE Agent for organizational, billing, or other purposes",
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
      "The name of the SRE Agent. Must start with a letter and contain only alphanumeric characters and hyphens.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "SRE Agent name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[A-Za-z]([-A-Za-z0-9]*[A-Za-z0-9])?$",
        message:
          "SRE Agent name must start with a letter and end with an alphanumeric character; only letters, numbers, and hyphens are allowed",
      },
    ],
  },
  agentSpaceId: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The ARM resource ID of the Agent Space referenced by this Agent",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "agentSpaceId must be a string Azure resource ID",
      },
    ],
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "The managed service identity assigned to the SRE Agent (SystemAssigned, UserAssigned, or both)",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "identity must be a managed service identity object",
      },
    ],
  },
  agentIdentity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description:
      "Agent identity configuration for accessing resources. Requires initialSponsorGroupId.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "agentIdentity must be an object",
      },
    ],
  },
  defaultModel: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Default AI model configuration for the SRE Agent",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "defaultModel must be an object",
      },
    ],
  },
  knowledgeGraphConfiguration: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Knowledge graph configuration for the SRE Agent",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "knowledgeGraphConfiguration must be an object",
      },
    ],
  },
  actionConfiguration: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Action configuration for the SRE Agent",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "actionConfiguration must be an object",
      },
    ],
  },
  logConfiguration: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Log configuration for the SRE Agent",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "logConfiguration must be an object",
      },
    ],
  },
  incidentManagementConfiguration: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Incident management configuration for the SRE Agent",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "incidentManagementConfiguration must be an object",
      },
    ],
  },
  upgradeChannel: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The upgrade channel of the SRE Agent",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "upgradeChannel must be a string",
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
        message: "ignoreChanges must be an array of strings",
      },
    ],
  },
};

// =============================================================================
// READ-ONLY PROPERTY DEFINITIONS
// =============================================================================

/**
 * Read-only properties populated by Azure after creation
 */
const READ_ONLY_PROPERTIES: { [key: string]: PropertyDefinition } = {
  provisioningState: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Provisioning state of the SRE Agent (read-only)",
  },
  agentEndpoint: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The data plane endpoint of the SRE Agent (read-only)",
  },
  runningState: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The running state of the SRE Agent (read-only)",
  },
  powerState: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The power state of the SRE Agent (Running or Stopped, read-only)",
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for SRE Agent version 2026-01-01 (stable)
 *
 * Reference: https://github.com/Azure/azure-rest-api-specs/tree/main/specification/app/resource-manager/Microsoft.App/SreAgent/stable/2026-01-01
 */
export const SRE_AGENT_SCHEMA_2026_01_01: ApiSchema = {
  resourceType: "Microsoft.App/agents",
  version: "2026-01-01",
  properties: {
    ...COMMON_PROPERTIES,
    ...READ_ONLY_PROPERTIES,
  },
  required: ["location", "name"],
  optional: [
    "tags",
    "identity",
    "agentSpaceId",
    "agentIdentity",
    "defaultModel",
    "knowledgeGraphConfiguration",
    "actionConfiguration",
    "logConfiguration",
    "incidentManagementConfiguration",
    "upgradeChannel",
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
          message: "Location is required for SRE Agents",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for SRE Agents",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for SRE Agent 2026-01-01
 */
export const SRE_AGENT_VERSION_2026_01_01: VersionConfig = {
  version: "2026-01-01",
  schema: SRE_AGENT_SCHEMA_2026_01_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2026-01-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/sre-agent/migration-2026-01-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release of Microsoft.App/agents (Azure SRE Agent) API with support for agent spaces, knowledge graphs, action configuration, and managed identity.",
      breaking: false,
    },
  ],
};

/**
 * All supported SRE Agent versions for registration
 */
export const ALL_SRE_AGENT_VERSIONS: VersionConfig[] = [
  SRE_AGENT_VERSION_2026_01_01,
];

/**
 * Resource type constant
 */
export const SRE_AGENT_TYPE = "Microsoft.App/agents";
