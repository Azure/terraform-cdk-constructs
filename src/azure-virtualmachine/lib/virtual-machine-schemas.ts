/**
 * API schemas for Azure Virtual Machine across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Compute/virtualMachines
 * across all supported API versions. The schemas are used by the VersionedAzapiResource
 * framework for validation, transformation, and version management.
 *
 * API Versions verified from Azure REST API Specifications:
 * - 2024-07-01: https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2024-07-01
 * - 2024-11-01: https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2024-11-01
 * - 2025-04-01: https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2025-04-01
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
// TYPESCRIPT INTERFACES FOR NESTED OBJECTS
// =============================================================================

/**
 * Hardware profile for the virtual machine
 */
export interface VirtualMachineHardwareProfile {
  readonly vmSize: string;
}

/**
 * Image reference for OS disk
 */
export interface VirtualMachineImageReference {
  readonly publisher?: string;
  readonly offer?: string;
  readonly sku?: string;
  readonly version?: string;
  readonly id?: string;
}

/**
 * OS disk configuration
 */
export interface VirtualMachineOSDisk {
  readonly name?: string;
  readonly createOption: string;
  readonly caching?: string;
  readonly diskSizeGB?: number;
  readonly managedDisk?: VirtualMachineManagedDiskParameters;
  readonly osType?: string;
}

/**
 * Data disk configuration
 */
export interface VirtualMachineDataDisk {
  readonly lun: number;
  readonly name?: string;
  readonly createOption: string;
  readonly caching?: string;
  readonly diskSizeGB?: number;
  readonly managedDisk?: VirtualMachineManagedDiskParameters;
}

/**
 * Managed disk parameters
 */
export interface VirtualMachineManagedDiskParameters {
  readonly storageAccountType?: string;
  readonly id?: string;
  readonly diskEncryptionSet?: VirtualMachineDiskEncryptionSetParameters;
}

/**
 * Disk encryption set parameters
 */
export interface VirtualMachineDiskEncryptionSetParameters {
  readonly id?: string;
}

/**
 * Storage profile for the virtual machine
 */
export interface VirtualMachineStorageProfile {
  readonly imageReference?: VirtualMachineImageReference;
  readonly osDisk: VirtualMachineOSDisk;
  readonly dataDisks?: VirtualMachineDataDisk[];
}

/**
 * Network interface properties
 */
export interface VirtualMachineNetworkInterfaceProperties {
  readonly primary?: boolean;
}

/**
 * Network interface reference
 */
export interface VirtualMachineNetworkInterfaceReference {
  readonly id: string;
  readonly properties?: VirtualMachineNetworkInterfaceProperties;
}

/**
 * Network profile for the virtual machine
 */
export interface VirtualMachineNetworkProfile {
  readonly networkInterfaces: VirtualMachineNetworkInterfaceReference[];
}

/**
 * SSH public key
 */
export interface VirtualMachineSshPublicKey {
  readonly path: string;
  readonly keyData: string;
}

/**
 * SSH configuration
 */
export interface VirtualMachineSshConfiguration {
  readonly publicKeys?: VirtualMachineSshPublicKey[];
}

/**
 * Linux configuration
 */
export interface VirtualMachineLinuxConfiguration {
  readonly disablePasswordAuthentication?: boolean;
  readonly ssh?: VirtualMachineSshConfiguration;
  readonly provisionVMAgent?: boolean;
  readonly patchSettings?: VirtualMachineLinuxPatchSettings;
}

/**
 * Linux patch settings
 */
export interface VirtualMachineLinuxPatchSettings {
  readonly patchMode?: string;
  readonly assessmentMode?: string;
}

/**
 * Windows configuration
 */
export interface VirtualMachineWindowsConfiguration {
  readonly provisionVMAgent?: boolean;
  readonly enableAutomaticUpdates?: boolean;
  readonly timeZone?: string;
  readonly patchSettings?: VirtualMachineWindowsPatchSettings;
  readonly winRM?: VirtualMachineWinRMConfiguration;
}

/**
 * Windows patch settings
 */
export interface VirtualMachineWindowsPatchSettings {
  readonly patchMode?: string;
  readonly assessmentMode?: string;
  readonly enableHotpatching?: boolean;
}

/**
 * WinRM configuration
 */
export interface VirtualMachineWinRMConfiguration {
  readonly listeners?: VirtualMachineWinRMListener[];
}

/**
 * WinRM listener
 */
export interface VirtualMachineWinRMListener {
  readonly protocol: string;
  readonly certificateUrl?: string;
}

/**
 * OS profile for the virtual machine
 */
export interface VirtualMachineOSProfile {
  readonly computerName: string;
  readonly adminUsername: string;
  readonly adminPassword?: string;
  readonly customData?: string;
  readonly linuxConfiguration?: VirtualMachineLinuxConfiguration;
  readonly windowsConfiguration?: VirtualMachineWindowsConfiguration;
  readonly secrets?: VirtualMachineSecret[];
  readonly allowExtensionOperations?: boolean;
}

/**
 * Secret for OS profile
 */
export interface VirtualMachineSecret {
  readonly sourceVault?: VirtualMachineSubResource;
  readonly vaultCertificates?: VirtualMachineVaultCertificate[];
}

/**
 * Sub-resource reference
 */
export interface VirtualMachineSubResource {
  readonly id?: string;
}

/**
 * Vault certificate
 */
export interface VirtualMachineVaultCertificate {
  readonly certificateUrl?: string;
  readonly certificateStore?: string;
}

/**
 * Identity configuration for the virtual machine
 */
export interface VirtualMachineIdentity {
  readonly type: string;
  readonly userAssignedIdentities?: { [key: string]: any };
}

/**
 * Plan information for marketplace images
 */
export interface VirtualMachinePlan {
  readonly name?: string;
  readonly publisher?: string;
  readonly product?: string;
  readonly promotionCode?: string;
}

/**
 * Additional capabilities
 */
export interface VirtualMachineAdditionalCapabilities {
  readonly ultraSSDEnabled?: boolean;
  readonly hibernationEnabled?: boolean;
}

/**
 * Boot diagnostics configuration
 */
export interface VirtualMachineBootDiagnostics {
  readonly enabled?: boolean;
  readonly storageUri?: string;
}

/**
 * Diagnostics profile
 */
export interface VirtualMachineDiagnosticsProfile {
  readonly bootDiagnostics?: VirtualMachineBootDiagnostics;
}

/**
 * Priority and eviction policy for spot VMs
 */
export interface VirtualMachinePriorityProfile {
  readonly priority?: string;
  readonly evictionPolicy?: string;
  readonly billingProfile?: VirtualMachineBillingProfile;
}

/**
 * Billing profile for spot VMs
 */
export interface VirtualMachineBillingProfile {
  readonly maxPrice?: number;
}

/**
 * Security profile
 */
export interface VirtualMachineSecurityProfile {
  readonly uefiSettings?: VirtualMachineUefiSettings;
  readonly encryptionAtHost?: boolean;
  readonly securityType?: string;
}

/**
 * UEFI settings
 */
export interface VirtualMachineUefiSettings {
  readonly secureBootEnabled?: boolean;
  readonly vTpmEnabled?: boolean;
}

/**
 * Availability set reference
 */
export interface VirtualMachineAvailabilitySetReference {
  readonly id?: string;
}

/**
 * Virtual machine scale set reference
 */
export interface VirtualMachineScaleSetReference {
  readonly id?: string;
}

/**
 * Proximity placement group reference
 */
export interface VirtualMachineProximityPlacementGroupReference {
  readonly id?: string;
}

/**
 * Host reference
 */
export interface VirtualMachineHostReference {
  readonly id?: string;
}

/**
 * License type
 */
export type VirtualMachineLicenseType =
  | "Windows_Client"
  | "Windows_Server"
  | "None";

/**
 * Configuration options for Virtual Machine monitoring
 */
export interface VirtualMachineMonitoringOptions {
  readonly cpuThreshold?: number;
  readonly memoryThreshold?: number;
  readonly diskQueueThreshold?: number;
  readonly enableCpuAlert?: boolean;
  readonly enableMemoryAlert?: boolean;
  readonly enableDiskQueueAlert?: boolean;
  readonly enableDeletionAlert?: boolean;
  readonly cpuAlertSeverity?: 0 | 1 | 2 | 3 | 4;
  readonly memoryAlertSeverity?: 0 | 1 | 2 | 3 | 4;
  readonly diskQueueAlertSeverity?: 0 | 1 | 2 | 3 | 4;
}

// =============================================================================
// COMMON PROPERTY DEFINITIONS
// =============================================================================

/**
 * Common property definitions shared across all Virtual Machine versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The Azure region where the Virtual Machine will be created",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Virtual Machines",
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
    description: "A dictionary of tags to apply to the Virtual Machine",
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
    description: "The name of the Virtual Machine",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Virtual Machine name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9]([a-zA-Z0-9-]{0,62}[a-zA-Z0-9])?$",
        message:
          "Virtual Machine name must be 1-64 characters, start and end with alphanumeric, and can contain hyphens",
      },
    ],
  },
  hardwareProfile: {
    dataType: PropertyType.OBJECT,
    required: true,
    description: "The hardware profile for the Virtual Machine (VM size)",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Hardware profile is required for Virtual Machines",
      },
    ],
  },
  storageProfile: {
    dataType: PropertyType.OBJECT,
    required: true,
    description: "The storage profile for the Virtual Machine",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Storage profile is required for Virtual Machines",
      },
    ],
  },
  osProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The OS profile for the Virtual Machine",
  },
  networkProfile: {
    dataType: PropertyType.OBJECT,
    required: true,
    description: "The network profile for the Virtual Machine",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Network profile is required for Virtual Machines",
      },
    ],
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The identity configuration for the Virtual Machine",
  },
  zones: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Availability zones for the Virtual Machine",
  },
  plan: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Plan information for marketplace images",
  },
  licenseType: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "License type for Windows VMs (Windows_Client, Windows_Server)",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Windows_Client|Windows_Server|None)$",
        message:
          "License type must be 'Windows_Client', 'Windows_Server', or 'None'",
      },
    ],
  },
  priority: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The priority of the Virtual Machine (Regular, Low, Spot)",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Regular|Low|Spot)$",
        message: "Priority must be 'Regular', 'Low', or 'Spot'",
      },
    ],
  },
  evictionPolicy: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The eviction policy for Spot VMs (Deallocate, Delete)",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Deallocate|Delete)$",
        message: "Eviction policy must be 'Deallocate' or 'Delete'",
      },
    ],
  },
  billingProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The billing profile for Spot VMs",
  },
  diagnosticsProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The diagnostics profile for boot diagnostics",
  },
  availabilitySet: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Reference to an availability set",
  },
  virtualMachineScaleSet: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Reference to a virtual machine scale set",
  },
  proximityPlacementGroup: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Reference to a proximity placement group",
  },
  host: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Reference to a dedicated host",
  },
  additionalCapabilities: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Additional capabilities like Ultra SSD",
  },
  securityProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Security settings for the Virtual Machine",
  },
  ignoreChanges: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Array of property names to ignore during updates",
    validation: [
      {
        ruleType: ValidationRuleType.TYPE_CHECK,
        value: PropertyType.ARRAY,
        message: "IgnoreChanges must be an array of strings",
      },
    ],
  },
};

// =============================================================================
// VERSION-SPECIFIC SCHEMAS
// =============================================================================

/**
 * API Schema for Virtual Machine version 2024-11-01
 */
export const VIRTUAL_MACHINE_SCHEMA_2024_11_01: ApiSchema = {
  resourceType: "Microsoft.Compute/virtualMachines",
  version: "2024-11-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: [
    "location",
    "name",
    "hardwareProfile",
    "storageProfile",
    "networkProfile",
  ],
  optional: [
    "tags",
    "osProfile",
    "identity",
    "zones",
    "plan",
    "licenseType",
    "priority",
    "evictionPolicy",
    "billingProfile",
    "diagnosticsProfile",
    "availabilitySet",
    "virtualMachineScaleSet",
    "proximityPlacementGroup",
    "host",
    "additionalCapabilities",
    "securityProfile",
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
          message: "Location is required for Virtual Machines",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Virtual Machines",
        },
      ],
    },
    {
      property: "hardwareProfile",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Hardware profile is required for Virtual Machines",
        },
      ],
    },
    {
      property: "storageProfile",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Storage profile is required for Virtual Machines",
        },
      ],
    },
    {
      property: "networkProfile",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Network profile is required for Virtual Machines",
        },
      ],
    },
  ],
};

/**
 * API Schema for Virtual Machine version 2025-04-01
 */
export const VIRTUAL_MACHINE_SCHEMA_2025_04_01: ApiSchema = {
  resourceType: "Microsoft.Compute/virtualMachines",
  version: "2025-04-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: [
    "location",
    "name",
    "hardwareProfile",
    "storageProfile",
    "networkProfile",
  ],
  optional: [
    "tags",
    "osProfile",
    "identity",
    "zones",
    "plan",
    "licenseType",
    "priority",
    "evictionPolicy",
    "billingProfile",
    "diagnosticsProfile",
    "availabilitySet",
    "virtualMachineScaleSet",
    "proximityPlacementGroup",
    "host",
    "additionalCapabilities",
    "securityProfile",
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
          message: "Location is required for Virtual Machines",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Virtual Machines",
        },
      ],
    },
    {
      property: "hardwareProfile",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Hardware profile is required for Virtual Machines",
        },
      ],
    },
    {
      property: "storageProfile",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Storage profile is required for Virtual Machines",
        },
      ],
    },
    {
      property: "networkProfile",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Network profile is required for Virtual Machines",
        },
      ],
    },
  ],
};

/**
 * API Schema for Virtual Machine version 2024-07-01
 */
export const VIRTUAL_MACHINE_SCHEMA_2024_07_01: ApiSchema = {
  resourceType: "Microsoft.Compute/virtualMachines",
  version: "2024-07-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: [
    "location",
    "name",
    "hardwareProfile",
    "storageProfile",
    "networkProfile",
  ],
  optional: [
    "tags",
    "osProfile",
    "identity",
    "zones",
    "plan",
    "licenseType",
    "priority",
    "evictionPolicy",
    "billingProfile",
    "diagnosticsProfile",
    "availabilitySet",
    "virtualMachineScaleSet",
    "proximityPlacementGroup",
    "host",
    "additionalCapabilities",
    "securityProfile",
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
          message: "Location is required for Virtual Machines",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Virtual Machines",
        },
      ],
    },
    {
      property: "hardwareProfile",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Hardware profile is required for Virtual Machines",
        },
      ],
    },
    {
      property: "storageProfile",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Storage profile is required for Virtual Machines",
        },
      ],
    },
    {
      property: "networkProfile",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Network profile is required for Virtual Machines",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for Virtual Machine 2024-11-01
 */
export const VIRTUAL_MACHINE_VERSION_2024_11_01: VersionConfig = {
  version: "2024-11-01",
  schema: VIRTUAL_MACHINE_SCHEMA_2024_11_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-11-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-machine/migration-2024-11-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Enhanced Virtual Machine features and improvements",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Virtual Machine 2025-04-01
 */
export const VIRTUAL_MACHINE_VERSION_2025_04_01: VersionConfig = {
  version: "2025-04-01",
  schema: VIRTUAL_MACHINE_SCHEMA_2025_04_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-04-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-machine/migration-2025-04-01",
  changeLog: [
    {
      changeType: "updated",
      description:
        "Latest stable API version with newest features and improvements",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for Virtual Machine 2024-07-01
 */
export const VIRTUAL_MACHINE_VERSION_2024_07_01: VersionConfig = {
  version: "2024-07-01",
  schema: VIRTUAL_MACHINE_SCHEMA_2024_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/virtual-machine/migration-2024-07-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Latest API version with newest features and improvements",
      breaking: false,
    },
  ],
};

/**
 * All supported Virtual Machine versions for registration
 */
export const ALL_VIRTUAL_MACHINE_VERSIONS: VersionConfig[] = [
  VIRTUAL_MACHINE_VERSION_2024_07_01,
  VIRTUAL_MACHINE_VERSION_2024_11_01,
  VIRTUAL_MACHINE_VERSION_2025_04_01,
];

/**
 * Resource type constant
 */
export const VIRTUAL_MACHINE_TYPE = "Microsoft.Compute/virtualMachines";
