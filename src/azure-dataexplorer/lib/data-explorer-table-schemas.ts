import {
  ApiSchema,
  PropertyDefinition,
  PropertyType,
  ValidationRuleType,
  VersionConfig,
  VersionSupportLevel,
} from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  databaseId: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Parent database resource ID",
  },
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Script name",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required for Data Explorer scripts",
      },
    ],
  },
  scriptContent: {
    dataType: PropertyType.STRING,
    required: false,
    description: "KQL script content",
  },
  scriptUrl: {
    dataType: PropertyType.STRING,
    required: false,
    description: "URL to the KQL script",
  },
  scriptUrlSasToken: {
    dataType: PropertyType.STRING,
    required: false,
    description: "SAS token used to access the script URL",
  },
  forceUpdateTag: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Unique value to force script re-execution",
  },
  continueOnErrors: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Continue executing the script when errors occur",
  },
};

export const DATA_EXPLORER_SCRIPT_SCHEMA_2024_04_13: ApiSchema = {
  resourceType: "Microsoft.Kusto/clusters/databases/scripts",
  version: "2024-04-13",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["name"],
  optional: [
    "databaseId",
    "scriptContent",
    "scriptUrl",
    "scriptUrlSasToken",
    "forceUpdateTag",
    "continueOnErrors",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Data Explorer scripts",
        },
      ],
    },
  ],
};

export const DATA_EXPLORER_SCRIPT_VERSION_2024_04_13: VersionConfig = {
  version: "2024-04-13",
  schema: DATA_EXPLORER_SCRIPT_SCHEMA_2024_04_13,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-04-13",
  changeLog: [
    {
      changeType: "added",
      description: "Initial Data Explorer script construct support",
      breaking: false,
    },
  ],
};

export const ALL_DATA_EXPLORER_SCRIPT_VERSIONS: VersionConfig[] = [
  DATA_EXPLORER_SCRIPT_VERSION_2024_04_13,
];

export const DATA_EXPLORER_SCRIPT_TYPE =
  "Microsoft.Kusto/clusters/databases/scripts";
