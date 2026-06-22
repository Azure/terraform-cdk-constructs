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
    required: false,
    description: "Azure region for the database resource",
  },
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Database name",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required for Data Explorer databases",
      },
    ],
  },
  clusterId: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Parent cluster resource ID",
  },
  kind: {
    dataType: PropertyType.STRING,
    required: false,
    description: 'Database kind ("ReadWrite" or "ReadOnlyFollowing")',
  },
  softDeletePeriod: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Soft delete period in ISO 8601 duration format",
  },
  hotCachePeriod: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Hot cache period in ISO 8601 duration format",
  },
};

export const DATA_EXPLORER_DATABASE_SCHEMA_2024_04_13: ApiSchema = {
  resourceType: "Microsoft.Kusto/clusters/databases",
  version: "2024-04-13",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["name"],
  optional: [
    "location",
    "clusterId",
    "kind",
    "softDeletePeriod",
    "hotCachePeriod",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [],
};

export const DATA_EXPLORER_DATABASE_VERSION_2024_04_13: VersionConfig = {
  version: "2024-04-13",
  schema: DATA_EXPLORER_DATABASE_SCHEMA_2024_04_13,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-04-13",
  changeLog: [
    {
      changeType: "added",
      description: "Initial Data Explorer database construct support",
      breaking: false,
    },
  ],
};

export const ALL_DATA_EXPLORER_DATABASE_VERSIONS: VersionConfig[] = [
  DATA_EXPLORER_DATABASE_VERSION_2024_04_13,
];

export const DATA_EXPLORER_DATABASE_TYPE = "Microsoft.Kusto/clusters/databases";
