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
    description: "Container name",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required for Storage Blob Containers",
      },
    ],
  },
  publicAccess: {
    dataType: PropertyType.STRING,
    required: false,
    description: 'Public access level: "None", "Blob", "Container"',
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(None|Blob|Container)$",
        message: "PublicAccess must be one of: None, Blob, Container",
      },
    ],
  },
  metadata: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Container metadata dictionary",
  },
  defaultEncryptionScope: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Default encryption scope",
  },
  denyEncryptionScopeOverride: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Deny encryption scope override",
  },
  immutableStorageWithVersioning: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Immutability policy",
  },
  storageAccountId: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The storage account ID (parent resource)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "StorageAccountId is required for Storage Blob Containers",
      },
    ],
  },
};

export const STORAGE_BLOB_CONTAINER_SCHEMA_2024_01_01: ApiSchema = {
  resourceType: "Microsoft.Storage/storageAccounts/blobServices/containers",
  version: "2024-01-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["name", "storageAccountId"],
  optional: [
    "publicAccess",
    "metadata",
    "defaultEncryptionScope",
    "denyEncryptionScopeOverride",
    "immutableStorageWithVersioning",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Storage Blob Containers",
        },
      ],
    },
    {
      property: "storageAccountId",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "StorageAccountId is required for Storage Blob Containers",
        },
      ],
    },
  ],
};

export const STORAGE_BLOB_CONTAINER_VERSION_2024_01_01: VersionConfig = {
  version: "2024-01-01",
  schema: STORAGE_BLOB_CONTAINER_SCHEMA_2024_01_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-01-01",
};

export const ALL_STORAGE_BLOB_CONTAINER_VERSIONS: VersionConfig[] = [
  STORAGE_BLOB_CONTAINER_VERSION_2024_01_01,
];

export const STORAGE_BLOB_CONTAINER_TYPE =
  "Microsoft.Storage/storageAccounts/blobServices/containers";
