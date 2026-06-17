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
    description: "Azure region where the Data Explorer cluster will be created",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Data Explorer clusters",
      },
    ],
  },
  tags: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Tags to apply to the Data Explorer cluster",
  },
  name: {
    dataType: PropertyType.STRING,
    required: true,
    description: "Cluster name",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Name is required for Data Explorer clusters",
      },
    ],
  },
  sku: {
    dataType: PropertyType.OBJECT,
    required: true,
    description: "The SKU of the cluster",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "SKU is required for Data Explorer clusters",
      },
    ],
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Managed identity configuration",
  },
  trustedExternalTenants: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Trusted external tenants",
  },
  optimizedAutoscale: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Optimized autoscale configuration",
  },
  enableDiskEncryption: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Enable disk encryption",
  },
  enableStreamingIngest: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Enable streaming ingest",
  },
  enablePurge: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Enable purge operations",
  },
};

export const DATA_EXPLORER_CLUSTER_SCHEMA_2024_04_13: ApiSchema = {
  resourceType: "Microsoft.Kusto/clusters",
  version: "2024-04-13",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name", "sku"],
  optional: [
    "tags",
    "identity",
    "trustedExternalTenants",
    "optimizedAutoscale",
    "enableDiskEncryption",
    "enableStreamingIngest",
    "enablePurge",
  ],
  deprecated: [],
  transformationRules: {},
  validationRules: [
    {
      property: "location",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Location is required for Data Explorer clusters",
        },
      ],
    },
    {
      property: "sku",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "SKU is required for Data Explorer clusters",
        },
      ],
    },
  ],
};

export const DATA_EXPLORER_CLUSTER_VERSION_2024_04_13: VersionConfig = {
  version: "2024-04-13",
  schema: DATA_EXPLORER_CLUSTER_SCHEMA_2024_04_13,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-04-13",
  changeLog: [
    {
      changeType: "added",
      description: "Initial Data Explorer cluster construct support",
      breaking: false,
    },
  ],
};

export const ALL_DATA_EXPLORER_CLUSTER_VERSIONS: VersionConfig[] = [
  DATA_EXPLORER_CLUSTER_VERSION_2024_04_13,
];

export const DATA_EXPLORER_CLUSTER_TYPE = "Microsoft.Kusto/clusters";
