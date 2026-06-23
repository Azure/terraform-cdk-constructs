/**
 * API schemas for Azure User Assigned Identity across all supported versions
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
      "The Azure region where the User Assigned Identity will be created",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for User Assigned Identities",
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
    description:
      "A dictionary of tags to apply to the User Assigned Identity for organizational, billing, or other purposes",
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
      "The name of the User Assigned Identity. Must be unique within the Azure resource group",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required for User Assigned Identities",
      },
      {
        ruleType: ValidationRuleType.VALUE_RANGE,
        value: { minLength: 1, maxLength: 128 },
        message:
          "User Assigned Identity name must be between 1 and 128 characters",
      },
    ],
  },
};

export const USER_ASSIGNED_IDENTITY_SCHEMA_2023_01_31: ApiSchema = {
  resourceType: "Microsoft.ManagedIdentity/userAssignedIdentities",
  version: "2023-01-31",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name"],
  optional: ["tags"],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for User Assigned Identities",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for User Assigned Identities",
        },
      ],
    },
  ],
};

export const USER_ASSIGNED_IDENTITY_VERSION_2023_01_31: VersionConfig = {
  version: "2023-01-31",
  schema: USER_ASSIGNED_IDENTITY_SCHEMA_2023_01_31,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2023-01-31",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/user-assigned-identity/migration-2023-01-31",
  changeLog: [
    {
      changeType: "added",
      description: "Initial stable release of User Assigned Identity API",
      breaking: false,
    },
  ],
};

export const ALL_USER_ASSIGNED_IDENTITY_VERSIONS: VersionConfig[] = [
  USER_ASSIGNED_IDENTITY_VERSION_2023_01_31,
];

export const USER_ASSIGNED_IDENTITY_TYPE =
  "Microsoft.ManagedIdentity/userAssignedIdentities";
