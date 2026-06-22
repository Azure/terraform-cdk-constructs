import {
  ApiSchema,
  PropertyDefinition,
  PropertyType,
  ValidationRuleType,
  VersionConfig,
  VersionSupportLevel,
} from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The name of the Event Grid Event Subscription",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required for Event Grid Event Subscriptions",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 64 },
        message: "Name must be between 1 and 64 characters",
      },
    ],
  },
  scope: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The scope resource ID for the Event Grid Event Subscription",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Scope is required for Event Grid Event Subscriptions",
      },
    ],
  },
  destination: {
    dataType: PropertyType.OBJECT,
    required: true,
    description: "The event destination configuration",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Destination is required for Event Grid Event Subscriptions",
      },
    ],
  },
  filter: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Filter criteria for events",
  },
  eventDeliverySchema: {
    dataType: PropertyType.STRING,
    required: false,
    defaultValue: "EventGridSchema",
    description: "The event delivery schema",
  },
  retryPolicy: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Retry policy configuration",
  },
  deadLetterDestination: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Dead letter destination configuration",
  },
  labels: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Labels to apply to the event subscription",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.ARRAY,
        message: "Labels must be an array of strings",
      },
    ],
  },
  expirationTimeUtc: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The expiration time in UTC",
  },
};

export const EVENT_SUBSCRIPTION_SCHEMA_2025_02_15: ApiSchema = {
  resourceType: "Microsoft.EventGrid/systemTopics/eventSubscriptions",
  version: "2025-02-15",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["name", "scope", "destination"],
  optional: [
    "filter",
    "eventDeliverySchema",
    "retryPolicy",
    "deadLetterDestination",
    "labels",
    "expirationTimeUtc",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Event Grid Event Subscriptions",
        },
      ],
    },
    {
      property: "scope",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Scope is required for Event Grid Event Subscriptions",
        },
      ],
    },
    {
      property: "destination",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Destination is required for Event Grid Event Subscriptions",
        },
      ],
    },
  ],
};

export const EVENT_SUBSCRIPTION_VERSION_2025_02_15: VersionConfig = {
  version: "2025-02-15",
  schema: EVENT_SUBSCRIPTION_SCHEMA_2025_02_15,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-02-15",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/event-grid-event-subscription/migration-2025-02-15",
  changeLog: [
    {
      changeType: "added",
      description:
        "Initial stable release of Event Grid Event Subscription support",
      breaking: false,
    },
  ],
};

export const ALL_EVENT_SUBSCRIPTION_VERSIONS: VersionConfig[] = [
  EVENT_SUBSCRIPTION_VERSION_2025_02_15,
];

export const EVENT_SUBSCRIPTION_TYPE =
  "Microsoft.EventGrid/systemTopics/eventSubscriptions";
