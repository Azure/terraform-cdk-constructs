/**
 * API schemas for Azure Container Apps Job across all supported versions
 */

import {
  ApiSchema,
  PropertyDefinition,
  PropertyType,
  ValidationRuleType,
  VersionConfig,
  VersionSupportLevel,
} from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The Azure region where the Container Apps Job will be created.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Container Apps Jobs",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description: "A dictionary of tags to apply to the Container Apps Job.",
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
    description: "The name of the Container Apps Job.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Container Apps Job name is required",
      },
    ],
  },
  environmentId: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "Resource ID of the Container Apps Environment where this job will run.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Environment ID is required for Container Apps Jobs",
      },
    ],
  },
  configuration: {
    dataType: PropertyType.OBJECT,
    required: true,
    description:
      "Container Apps Job configuration including trigger, retry, and execution settings.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Configuration is required for Container Apps Jobs",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Configuration must be an object",
      },
    ],
  },
  template: {
    dataType: PropertyType.OBJECT,
    required: true,
    description:
      "Container Apps Job template including containers, init containers, and volumes.",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Template is required for Container Apps Jobs",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Template must be an object",
      },
    ],
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Managed identity configuration for the Container Apps Job.",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.OBJECT,
        message: "Identity must be an object",
      },
    ],
  },
};

export const CONTAINER_APPS_JOB_SCHEMA_2024_03_01: ApiSchema = {
  resourceType: "Microsoft.App/jobs",
  version: "2024-03-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name", "environmentId", "configuration", "template"],
  optional: ["tags", "identity"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Container Apps Jobs",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Container Apps Jobs",
        },
      ],
    },
    {
      property: "environmentId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Environment ID is required for Container Apps Jobs",
        },
      ],
    },
    {
      property: "configuration",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Configuration is required for Container Apps Jobs",
        },
      ],
    },
    {
      property: "template",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Template is required for Container Apps Jobs",
        },
      ],
    },
  ],
};

export const CONTAINER_APPS_JOB_VERSION_2024_03_01: VersionConfig = {
  version: "2024-03-01",
  schema: CONTAINER_APPS_JOB_SCHEMA_2024_03_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-03-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/container-apps-job/migration-2024-03-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release of Container Apps Job API with environment, configuration, template, and identity support",
      breaking: false,
    },
  ],
};

export const ALL_CONTAINER_APPS_JOB_VERSIONS: VersionConfig[] = [
  CONTAINER_APPS_JOB_VERSION_2024_03_01,
];

export const CONTAINER_APPS_JOB_TYPE = "Microsoft.App/jobs";
