/**
 * API schemas for Azure Virtual Machine Scale Sets (VMSS) across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.Compute/virtualMachineScaleSets
 * across all supported API versions. The schemas are used by the AzapiResource
 * framework for validation, transformation, and version management.
 *
 * API Versions verified from Azure REST API Specifications:
 * - 2025-01-02: https://github.com/Azure/azure-rest-api-specs/.../2025-01-02/virtualMachineScaleSets.json
 * - 2025-02-01: https://github.com/Azure/azure-rest-api-specs/.../2025-02-01/virtualMachineScaleSets.json
 * - 2025-04-01: https://github.com/Azure/azure-rest-api-specs/.../2025-04-01/virtualMachineScaleSets.json
 */

import { NetworkInterfaceDnsSettings } from "../../azure-networkinterface/lib/network-interface";
import {
  VirtualMachineHardwareProfile,
  VirtualMachineStorageProfile,
  VirtualMachineIdentity,
  VirtualMachinePlan,
  VirtualMachineDiagnosticsProfile,
  VirtualMachineSecurityProfile,
  VirtualMachineBillingProfile,
  VirtualMachineImageReference,
  VirtualMachineOSDisk,
  VirtualMachineDataDisk,
  VirtualMachineLinuxConfiguration,
  VirtualMachineWindowsConfiguration,
  VirtualMachineBootDiagnostics,
  VirtualMachineUefiSettings,
} from "../../azure-virtualmachine/lib/virtual-machine-schemas";
import {
  ApiSchema,
  PropertyDefinition,
  PropertyType,
  ValidationRuleType,
  VersionConfig,
  VersionSupportLevel,
} from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

// Import and reuse VM interfaces for code reuse

// Re-export VM interfaces for external use
export type {
  VirtualMachineHardwareProfile,
  VirtualMachineStorageProfile,
  VirtualMachineIdentity,
  VirtualMachinePlan,
  VirtualMachineDiagnosticsProfile,
  VirtualMachineSecurityProfile,
  VirtualMachineBillingProfile,
  VirtualMachineImageReference,
  VirtualMachineOSDisk,
  VirtualMachineDataDisk,
  VirtualMachineLinuxConfiguration,
  VirtualMachineWindowsConfiguration,
  VirtualMachineBootDiagnostics,
  VirtualMachineUefiSettings,
};

// =============================================================================
// TYPESCRIPT INTERFACES FOR VMSS-SPECIFIC OBJECTS
// =============================================================================

/**
 * SKU for the Virtual Machine Scale Set
 */
export interface VirtualMachineScaleSetSku {
  readonly name: string;
  readonly tier?: string;
  readonly capacity?: number;
}

/**
 * Upgrade policy mode type
 */
export type UpgradePolicyMode = "Automatic" | "Manual" | "Rolling";

/**
 * Rolling upgrade policy
 */
export interface RollingUpgradePolicy {
  readonly maxBatchInstancePercent?: number;
  readonly maxUnhealthyInstancePercent?: number;
  readonly maxUnhealthyUpgradedInstancePercent?: number;
  readonly pauseTimeBetweenBatches?: string;
  readonly enableCrossZoneUpgrade?: boolean;
  readonly prioritizeUnhealthyInstances?: boolean;
}

/**
 * Automatic OS upgrade policy
 */
export interface AutomaticOSUpgradePolicy {
  readonly enableAutomaticOSUpgrade?: boolean;
  readonly disableAutomaticRollback?: boolean;
  readonly useRollingUpgradePolicy?: boolean;
}

/**
 * Upgrade policy for the Virtual Machine Scale Set
 */
export interface VirtualMachineScaleSetUpgradePolicy {
  readonly mode?: UpgradePolicyMode;
  readonly rollingUpgradePolicy?: RollingUpgradePolicy;
  readonly automaticOSUpgradePolicy?: AutomaticOSUpgradePolicy;
}

/**
 * IP configuration subnet reference
 */
export interface IPConfigurationSubnet {
  readonly id: string;
}

/**
 * DNS settings for public IP
 */
export interface PublicIPDnsSettings {
  readonly domainNameLabel: string;
}

/**
 * Public IP address configuration properties
 */
export interface PublicIPAddressConfigurationProperties {
  readonly idleTimeoutInMinutes?: number;
  readonly dnsSettings?: PublicIPDnsSettings;
}

/**
 * Public IP address configuration
 */
export interface PublicIPAddressConfiguration {
  readonly name: string;
  readonly properties?: PublicIPAddressConfigurationProperties;
}

/**
 * Resource reference with ID
 */
export interface ResourceReference {
  readonly id: string;
}

/**
 * IP configuration properties
 */
export interface IPConfigurationProperties {
  readonly subnet?: IPConfigurationSubnet;
  readonly primary?: boolean;
  readonly publicIPAddressConfiguration?: PublicIPAddressConfiguration;
  readonly privateIPAddressVersion?: string;
  readonly applicationGatewayBackendAddressPools?: ResourceReference[];
  readonly loadBalancerBackendAddressPools?: ResourceReference[];
  readonly loadBalancerInboundNatPools?: ResourceReference[];
}

/**
 * Network interface IP configuration
 */
export interface IPConfiguration {
  readonly name: string;
  readonly properties?: IPConfigurationProperties;
}

/**
 * Network security group reference
 */
export interface NetworkSecurityGroupReference {
  readonly id: string;
}

/**
 * Network interface configuration properties
 * Uses NetworkInterfaceDnsSettings from azure-networkinterface for consistency
 */
export interface NetworkInterfaceConfigurationProperties {
  readonly primary?: boolean;
  readonly enableAcceleratedNetworking?: boolean;
  readonly enableIPForwarding?: boolean;
  readonly networkSecurityGroup?: NetworkSecurityGroupReference;
  readonly ipConfigurations: IPConfiguration[];
  readonly dnsSettings?: NetworkInterfaceDnsSettings;
}

/**
 * Network interface configuration for VMSS
 */
export interface NetworkInterfaceConfiguration {
  readonly name: string;
  readonly properties?: NetworkInterfaceConfigurationProperties;
}

/**
 * Health probe reference
 */
export interface HealthProbeReference {
  readonly id: string;
}

/**
 * Network profile for VMSS (different from VM)
 */
export interface VirtualMachineScaleSetNetworkProfile {
  readonly networkInterfaceConfigurations?: NetworkInterfaceConfiguration[];
  readonly healthProbe?: HealthProbeReference;
  /**
   * The API version to use for network interface configurations
   *
   * This property is automatically set to the latest Network Interface API version
   * when orchestrationMode is "Flexible" and networkInterfaceConfigurations are specified.
   *
   * You can explicitly provide a version if you need to pin to a specific API version.
   *
   * @example "2024-10-01"
   * @defaultValue Latest Network Interface API version (auto-resolved)
   */
  readonly networkApiVersion?: string;
}

/**
 * Extension properties
 */
export interface VMExtensionProperties {
  readonly publisher: string;
  readonly type: string;
  readonly typeHandlerVersion: string;
  readonly autoUpgradeMinorVersion?: boolean;
  readonly settings?: any;
  readonly protectedSettings?: any;
}

/**
 * VM extension
 */
export interface VMExtension {
  readonly name: string;
  readonly properties?: VMExtensionProperties;
}

/**
 * Extension profile
 */
export interface ExtensionProfile {
  readonly extensions?: VMExtension[];
}

/**
 * Terminate notification profile
 */
export interface TerminateNotificationProfile {
  readonly notBeforeTimeout?: string;
  readonly enable?: boolean;
}

/**
 * Scheduled events profile
 */
export interface ScheduledEventsProfile {
  readonly terminateNotificationProfile?: TerminateNotificationProfile;
}

/**
 * OS Profile for Virtual Machine Scale Set
 * VMSS uses computerNamePrefix instead of computerName
 */
export interface VirtualMachineScaleSetOSProfile {
  readonly computerNamePrefix?: string;
  readonly adminUsername?: string;
  readonly adminPassword?: string;
  readonly customData?: string;
  readonly windowsConfiguration?: VirtualMachineWindowsConfiguration;
  readonly linuxConfiguration?: VirtualMachineLinuxConfiguration;
  readonly secrets?: any[];
  readonly allowExtensionOperations?: boolean;
  readonly requireGuestProvisionSignal?: boolean;
}

/**
 * VM profile for the Virtual Machine Scale Set
 * Wraps VM configuration and reuses VM interfaces
 */
export interface VirtualMachineScaleSetVMProfile {
  readonly osProfile?: VirtualMachineScaleSetOSProfile;
  readonly storageProfile?: VirtualMachineStorageProfile;
  readonly networkProfile?: VirtualMachineScaleSetNetworkProfile;
  readonly securityProfile?: VirtualMachineSecurityProfile;
  readonly diagnosticsProfile?: VirtualMachineDiagnosticsProfile;
  readonly extensionProfile?: ExtensionProfile;
  readonly licenseType?: string;
  readonly priority?: string;
  readonly evictionPolicy?: string;
  readonly billingProfile?: VirtualMachineBillingProfile;
  readonly scheduledEventsProfile?: ScheduledEventsProfile;
}

/**
 * Automatic repairs policy
 */
export interface AutomaticRepairsPolicy {
  readonly enabled?: boolean;
  readonly gracePeriod?: string;
  readonly repairAction?: string;
}

/**
 * Scale-in policy
 */
export interface VirtualMachineScaleSetScaleInPolicy {
  readonly rules?: string[];
  readonly forceDeletion?: boolean;
}

/**
 * Orchestration mode type
 */
export type OrchestrationMode = "Uniform" | "Flexible";

/**
 * Scaling configuration
 */
export interface VirtualMachineScaleSetScalingConfiguration {
  readonly overprovision?: boolean;
  readonly doNotRunExtensionsOnOverprovisionedVMs?: boolean;
  readonly singlePlacementGroup?: boolean;
  readonly zoneBalance?: boolean;
  readonly platformFaultDomainCount?: number;
}

/**
 * Configuration options for Virtual Machine Scale Set monitoring
 *
 * This interface provides options for configuring monitoring alerts and diagnostic
 * settings for VMSS resources. All properties are JSII-compliant for multi-language support.
 *
 * @stability stable
 */
export interface VmssMonitoringOptions {
  /**
   * CPU usage threshold percentage for triggering alerts
   *
   * VMSS uses a lower default threshold (75%) compared to single VMs (80%)
   * to allow headroom for scaling operations before reaching saturation.
   *
   * @default 75
   */
  readonly cpuThreshold?: number;

  /**
   * Available memory threshold in bytes for triggering alerts
   *
   * When available memory drops below this threshold, an alert will be triggered.
   * Default is 1GB (1073741824 bytes).
   *
   * @default 1073741824
   */
  readonly memoryThreshold?: number;

  /**
   * Disk queue depth threshold for triggering alerts
   *
   * High disk queue depth can indicate disk performance bottlenecks.
   *
   * @default 32
   */
  readonly diskQueueThreshold?: number;

  /**
   * Enable or disable CPU usage alert
   *
   * @default true
   */
  readonly enableCpuAlert?: boolean;

  /**
   * Enable or disable memory usage alert
   *
   * @default true
   */
  readonly enableMemoryAlert?: boolean;

  /**
   * Enable or disable disk queue depth alert
   *
   * @default true
   */
  readonly enableDiskQueueAlert?: boolean;

  /**
   * Enable or disable VMSS deletion activity log alert
   *
   * @default true
   */
  readonly enableDeletionAlert?: boolean;

  /**
   * Severity level for CPU usage alerts
   *
   * - 0: Critical
   * - 1: Error
   * - 2: Warning
   * - 3: Informational
   * - 4: Verbose
   *
   * @default 2
   */
  readonly cpuAlertSeverity?: 0 | 1 | 2 | 3 | 4;

  /**
   * Severity level for memory usage alerts
   *
   * - 0: Critical
   * - 1: Error
   * - 2: Warning
   * - 3: Informational
   * - 4: Verbose
   *
   * @default 2
   */
  readonly memoryAlertSeverity?: 0 | 1 | 2 | 3 | 4;

  /**
   * Severity level for disk queue depth alerts
   *
   * - 0: Critical
   * - 1: Error
   * - 2: Warning
   * - 3: Informational
   * - 4: Verbose
   *
   * @default 2
   */
  readonly diskQueueAlertSeverity?: 0 | 1 | 2 | 3 | 4;
}

/**
 * Proximity placement group reference
 */
export interface ProximityPlacementGroupReference {
  readonly id: string;
}

/**
 * Host group reference
 */
export interface HostGroupReference {
  readonly id: string;
}

/**
 * Additional capabilities
 */
export interface AdditionalCapabilities {
  readonly ultraSSDEnabled?: boolean;
}

/**
 * Properties for the Virtual Machine Scale Set
 */
export interface VirtualMachineScaleSetProps {
  readonly name: string;
  readonly location: string;
  readonly resourceGroupId?: string;
  readonly tags?: { [key: string]: string };
  readonly apiVersion?: string;
  readonly sku: VirtualMachineScaleSetSku;
  readonly identity?: VirtualMachineIdentity;
  readonly zones?: string[];
  readonly plan?: VirtualMachinePlan;
  readonly upgradePolicy?: VirtualMachineScaleSetUpgradePolicy;
  readonly virtualMachineProfile?: VirtualMachineScaleSetVMProfile;
  readonly orchestrationMode?: OrchestrationMode;
  readonly overprovision?: boolean;
  readonly doNotRunExtensionsOnOverprovisionedVMs?: boolean;
  readonly singlePlacementGroup?: boolean;
  readonly zoneBalance?: boolean;
  readonly platformFaultDomainCount?: number;
  readonly automaticRepairsPolicy?: AutomaticRepairsPolicy;
  readonly scaleInPolicy?: VirtualMachineScaleSetScaleInPolicy;
  readonly proximityPlacementGroup?: ProximityPlacementGroupReference;
  readonly hostGroup?: HostGroupReference;
  readonly additionalCapabilities?: AdditionalCapabilities;
  readonly monitoring?: any;
  readonly ignoreChanges?: string[];
  readonly enableMigrationAnalysis?: boolean;
  readonly enableValidation?: boolean;
  readonly enableTransformation?: boolean;
}

/**
 * Body properties for VMSS
 */
export interface VirtualMachineScaleSetBodyProperties {
  readonly upgradePolicy?: VirtualMachineScaleSetUpgradePolicy;
  readonly virtualMachineProfile?: VirtualMachineScaleSetVMProfile;
  readonly orchestrationMode?: OrchestrationMode;
  readonly overprovision?: boolean;
  readonly doNotRunExtensionsOnOverprovisionedVMs?: boolean;
  readonly singlePlacementGroup?: boolean;
  readonly zoneBalance?: boolean;
  readonly platformFaultDomainCount?: number;
  readonly automaticRepairsPolicy?: AutomaticRepairsPolicy;
  readonly scaleInPolicy?: VirtualMachineScaleSetScaleInPolicy;
  readonly proximityPlacementGroup?: ProximityPlacementGroupReference;
  readonly hostGroup?: HostGroupReference;
  readonly additionalCapabilities?: AdditionalCapabilities;
}

/**
 * The resource body interface for Azure VMSS API calls
 */
export interface VirtualMachineScaleSetBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly sku: VirtualMachineScaleSetSku;
  readonly identity?: VirtualMachineIdentity;
  readonly zones?: string[];
  readonly plan?: VirtualMachinePlan;
  readonly properties: VirtualMachineScaleSetBodyProperties;
}

// =============================================================================
// COMMON PROPERTY DEFINITIONS
// =============================================================================

/**
 * Common property definitions shared across all VMSS versions
 */
export const COMMON_VMSS_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description:
      "The Azure region where the Virtual Machine Scale Set will be created",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for Virtual Machine Scale Sets",
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
      "A dictionary of tags to apply to the Virtual Machine Scale Set",
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
    description: "The name of the Virtual Machine Scale Set",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Virtual Machine Scale Set name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9]([a-zA-Z0-9-]{0,62}[a-zA-Z0-9])?$",
        message:
          "VMSS name must be 1-64 characters, start and end with alphanumeric, and can contain hyphens",
      },
    ],
  },
  sku: {
    dataType: PropertyType.OBJECT,
    required: true,
    description: "The SKU configuration for the Virtual Machine Scale Set",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "SKU is required for Virtual Machine Scale Sets",
      },
    ],
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The identity configuration for the Virtual Machine Scale Set",
  },
  zones: {
    dataType: PropertyType.ARRAY,
    required: false,
    description: "Availability zones for the Virtual Machine Scale Set",
  },
  plan: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Plan information for marketplace images",
  },
  upgradePolicy: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The upgrade policy for the Virtual Machine Scale Set",
  },
  virtualMachineProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The virtual machine profile for the scale set",
  },
  orchestrationMode: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The orchestration mode for the scale set (Uniform or Flexible)",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Uniform|Flexible)$",
        message: "Orchestration mode must be 'Uniform' or 'Flexible'",
      },
    ],
  },
  overprovision: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Whether to overprovision VMs in the scale set",
  },
  doNotRunExtensionsOnOverprovisionedVMs: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Whether to skip extensions on overprovisioned VMs",
  },
  singlePlacementGroup: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Whether to use a single placement group",
  },
  zoneBalance: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    description: "Whether to balance VMs across zones",
  },
  platformFaultDomainCount: {
    dataType: PropertyType.NUMBER,
    required: false,
    description: "The number of fault domains to use",
  },
  automaticRepairsPolicy: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The automatic repairs policy for the scale set",
  },
  scaleInPolicy: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The scale-in policy for the scale set",
  },
  proximityPlacementGroup: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Reference to a proximity placement group",
  },
  hostGroup: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Reference to a dedicated host group",
  },
  additionalCapabilities: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "Additional capabilities like Ultra SSD",
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
 * API Schema for VMSS version 2025-01-02
 */
export const VMSS_SCHEMA_2025_01_02: ApiSchema = {
  resourceType: "Microsoft.Compute/virtualMachineScaleSets",
  version: "2025-01-02",
  properties: {
    ...COMMON_VMSS_PROPERTIES,
  },
  required: ["location", "name", "sku"],
  optional: [
    "tags",
    "identity",
    "zones",
    "plan",
    "upgradePolicy",
    "virtualMachineProfile",
    "orchestrationMode",
    "overprovision",
    "doNotRunExtensionsOnOverprovisionedVMs",
    "singlePlacementGroup",
    "zoneBalance",
    "platformFaultDomainCount",
    "automaticRepairsPolicy",
    "scaleInPolicy",
    "proximityPlacementGroup",
    "hostGroup",
    "additionalCapabilities",
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
          message: "Location is required for Virtual Machine Scale Sets",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Virtual Machine Scale Sets",
        },
      ],
    },
    {
      property: "sku",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "SKU is required for Virtual Machine Scale Sets",
        },
      ],
    },
  ],
};

/**
 * API Schema for VMSS version 2025-02-01
 */
export const VMSS_SCHEMA_2025_02_01: ApiSchema = {
  resourceType: "Microsoft.Compute/virtualMachineScaleSets",
  version: "2025-02-01",
  properties: {
    ...COMMON_VMSS_PROPERTIES,
  },
  required: ["location", "name", "sku"],
  optional: [
    "tags",
    "identity",
    "zones",
    "plan",
    "upgradePolicy",
    "virtualMachineProfile",
    "orchestrationMode",
    "overprovision",
    "doNotRunExtensionsOnOverprovisionedVMs",
    "singlePlacementGroup",
    "zoneBalance",
    "platformFaultDomainCount",
    "automaticRepairsPolicy",
    "scaleInPolicy",
    "proximityPlacementGroup",
    "hostGroup",
    "additionalCapabilities",
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
          message: "Location is required for Virtual Machine Scale Sets",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Virtual Machine Scale Sets",
        },
      ],
    },
    {
      property: "sku",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "SKU is required for Virtual Machine Scale Sets",
        },
      ],
    },
  ],
};

/**
 * API Schema for VMSS version 2025-04-01
 */
export const VMSS_SCHEMA_2025_04_01: ApiSchema = {
  resourceType: "Microsoft.Compute/virtualMachineScaleSets",
  version: "2025-04-01",
  properties: {
    ...COMMON_VMSS_PROPERTIES,
  },
  required: ["location", "name", "sku"],
  optional: [
    "tags",
    "identity",
    "zones",
    "plan",
    "upgradePolicy",
    "virtualMachineProfile",
    "orchestrationMode",
    "overprovision",
    "doNotRunExtensionsOnOverprovisionedVMs",
    "singlePlacementGroup",
    "zoneBalance",
    "platformFaultDomainCount",
    "automaticRepairsPolicy",
    "scaleInPolicy",
    "proximityPlacementGroup",
    "hostGroup",
    "additionalCapabilities",
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
          message: "Location is required for Virtual Machine Scale Sets",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for Virtual Machine Scale Sets",
        },
      ],
    },
    {
      property: "sku",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "SKU is required for Virtual Machine Scale Sets",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for VMSS 2025-01-02
 */
export const VMSS_VERSION_2025_01_02: VersionConfig = {
  version: "2025-01-02",
  schema: VMSS_SCHEMA_2025_01_02,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-01-02",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/vmss/migration-2025-01-02",
  changeLog: [
    {
      changeType: "added",
      description: "Initial release with comprehensive VMSS features",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for VMSS 2025-02-01
 */
export const VMSS_VERSION_2025_02_01: VersionConfig = {
  version: "2025-02-01",
  schema: VMSS_SCHEMA_2025_02_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-02-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/vmss/migration-2025-02-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Enhanced orchestration and scaling features",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for VMSS 2025-04-01
 */
export const VMSS_VERSION_2025_04_01: VersionConfig = {
  version: "2025-04-01",
  schema: VMSS_SCHEMA_2025_04_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-04-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/vmss/migration-2025-04-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Latest API version with newest features and improvements",
      breaking: false,
    },
  ],
};

/**
 * All supported VMSS versions for registration
 */
export const ALL_VMSS_VERSIONS: VersionConfig[] = [
  VMSS_VERSION_2025_01_02,
  VMSS_VERSION_2025_02_01,
  VMSS_VERSION_2025_04_01,
];

/**
 * Resource type constant
 */
export const VMSS_TYPE = "Microsoft.Compute/virtualMachineScaleSets";
