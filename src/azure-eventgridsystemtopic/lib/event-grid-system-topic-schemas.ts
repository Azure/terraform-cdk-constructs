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
    description: "The Azure region where the Event Grid System Topic will be created",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Event Grid System Topics",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-z0-9]+$",
        message: "Location must contain only lowercase letters and numbers",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    defaultValue: {},
    description: "A dictionary of tags to apply to the Event Grid System Topic",
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
    description: "The name of the Event Grid System Topic",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required for Event Grid System Topics",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 64 },
        message: "Name must be between 1 and 64 characters",
      },
    ],
  },
  source: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The source Azure resource ID for the system topic",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Source is required for Event Grid System Topics",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "Source must be a string containing a resource ID",
      },
    ],
  },
  topicType: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The type of the source resource",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Topic type is required for Event Grid System Topics",
      },
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.STRING,
        message: "Topic type must be a string",
      },
    ],
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Managed identity configuration for the Event Grid System Topic",
  },
  resourceGroupId: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The resource group ID where the Event Grid System Topic is created",
  },
};

export const SYSTEM_TOPIC_SCHEMA_2025_02_15: ApiSchema = {
  resourceType: "Microsoft.EventGrid/systemTopics",
  version: "2025-02-15",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name", "source", "topicType"],
  optional: ["tags", "identity", "resourceGroupId"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Event Grid System Topics",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Event Grid System Topics",
        },
      ],
    },
    {
      property: "source",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Source is required for Event Grid System Topics",
        },
      ],
    },
    {
      property: "topicType",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Topic type is required for Event Grid System Topics",
        },
      ],
    },
  ],
};

export const SYSTEM_TOPIC_VERSION_2025_02_15: VersionConfig = {
  version: "2025-02-15",
  schema: SYSTEM_TOPIC_SCHEMA_2025_02_15,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-02-15",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/event-grid-system-topic/migration-2025-02-15",
  changeLog: [
    {
      changeType: "added",
      description: "Initial stable release of Event Grid System Topic support",
      breaking: false,
    },
  ],
};

export const ALL_SYSTEM_TOPIC_VERSIONS: VersionConfig[] = [
  SYSTEM_TOPIC_VERSION_2025_02_15,
];

export const SYSTEM_TOPIC_TYPE = "Microsoft.EventGrid/systemTopics";
