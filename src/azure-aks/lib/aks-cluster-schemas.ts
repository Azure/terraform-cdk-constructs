/**
 * API schemas for Azure Kubernetes Service (AKS) across all supported versions
 *
 * This file defines the complete API schemas for Microsoft.ContainerService/managedClusters
 * across all supported API versions. The schemas are used by the VersionedAzapiResource
 * framework for validation, transformation, and version management.
 *
 * API Versions verified from Azure REST API Specifications:
 * - 2024-10-01: https://github.com/Azure/azure-rest-api-specs/.../2024-10-01/managedClusters.json
 * - 2025-01-01: https://github.com/Azure/azure-rest-api-specs/.../2025-01-01/managedClusters.json
 * - 2025-07-01: https://github.com/Azure/azure-rest-api-specs/.../2025-07-01/managedClusters.json
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
 * SKU for Azure Kubernetes Service
 */
export interface AksClusterSku {
  readonly name?: string;
  readonly tier?: string;
}

/**
 * Identity configuration for AKS Cluster
 */
export interface AksClusterIdentity {
  readonly type: string;
  readonly userAssignedIdentities?: { [key: string]: any };
}

/**
 * Agent pool profile for AKS node pools
 */
export interface AksClusterAgentPoolProfile {
  readonly name: string;
  readonly count?: number;
  readonly vmSize: string;
  readonly osDiskSizeGB?: number;
  readonly osDiskType?: string;
  readonly osType?: string;
  readonly type?: string;
  readonly mode?: string;
  readonly availabilityZones?: string[];
  readonly enableAutoScaling?: boolean;
  readonly minCount?: number;
  readonly maxCount?: number;
  readonly maxPods?: number;
  readonly vnetSubnetID?: string;
  readonly podSubnetID?: string;
  readonly enableNodePublicIP?: boolean;
  readonly nodePublicIPPrefixID?: string;
  readonly scaleSetPriority?: string;
  readonly scaleSetEvictionPolicy?: string;
  readonly spotMaxPrice?: number;
  readonly nodeTaints?: string[];
  readonly nodeLabels?: { [key: string]: string };
  readonly kubeletConfig?: AksClusterKubeletConfig;
  readonly linuxOSConfig?: AksClusterLinuxOSConfig;
  readonly enableEncryptionAtHost?: boolean;
  readonly enableUltraSSD?: boolean;
  readonly enableFIPS?: boolean;
}

/**
 * Kubelet configuration
 */
export interface AksClusterKubeletConfig {
  readonly cpuManagerPolicy?: string;
  readonly cpuCfsQuota?: boolean;
  readonly cpuCfsQuotaPeriod?: string;
  readonly imageGcHighThreshold?: number;
  readonly imageGcLowThreshold?: number;
  readonly topologyManagerPolicy?: string;
  readonly allowedUnsafeSysctls?: string[];
  readonly failSwapOn?: boolean;
  readonly containerLogMaxSizeMB?: number;
  readonly containerLogMaxFiles?: number;
  readonly podMaxPids?: number;
}

/**
 * Linux OS configuration
 */
export interface AksClusterLinuxOSConfig {
  readonly sysctls?: AksClusterSysctlConfig;
  readonly transparentHugePageEnabled?: string;
  readonly transparentHugePageDefrag?: string;
  readonly swapFileSizeMB?: number;
}

/**
 * Sysctl configuration
 */
export interface AksClusterSysctlConfig {
  readonly netCoreSomaxconn?: number;
  readonly netCoreNetdevMaxBacklog?: number;
  readonly netCoreRmemDefault?: number;
  readonly netCoreRmemMax?: number;
  readonly netCoreWmemDefault?: number;
  readonly netCoreWmemMax?: number;
  readonly netCoreOptmemMax?: number;
  readonly netIpv4TcpMaxSynBacklog?: number;
  readonly netIpv4TcpFinTimeout?: number;
  readonly netIpv4TcpKeepaliveTime?: number;
  readonly netIpv4TcpKeepaliveProbes?: number;
  readonly netIpv4TcpkeepaliveIntvl?: number;
  readonly netIpv4TcpTwReuse?: boolean;
  readonly netIpv4IpLocalPortRange?: string;
  readonly netIpv4NeighDefaultGcThresh1?: number;
  readonly netIpv4NeighDefaultGcThresh2?: number;
  readonly netIpv4NeighDefaultGcThresh3?: number;
  readonly netNetfilterNfConntrackMax?: number;
  readonly netNetfilterNfConntrackBuckets?: number;
  readonly fsInotifyMaxUserWatches?: number;
  readonly fsFileMax?: number;
  readonly fsAioMaxNr?: number;
  readonly fsNrOpen?: number;
  readonly kernelThreadsMax?: number;
  readonly vmMaxMapCount?: number;
  readonly vmSwappiness?: number;
  readonly vmVfsCachePressure?: number;
}

/**
 * Network profile for AKS cluster
 */
export interface AksClusterNetworkProfile {
  readonly networkPlugin?: string;
  readonly networkPolicy?: string;
  readonly networkMode?: string;
  readonly podCidr?: string;
  readonly serviceCidr?: string;
  readonly dnsServiceIP?: string;
  readonly dockerBridgeCidr?: string;
  readonly outboundType?: string;
  readonly loadBalancerSku?: string;
  readonly loadBalancerProfile?: AksClusterLoadBalancerProfile;
  readonly natGatewayProfile?: AksClusterNatGatewayProfile;
  readonly podCidrs?: string[];
  readonly serviceCidrs?: string[];
  readonly ipFamilies?: string[];
}

/**
 * Load balancer profile
 */
export interface AksClusterLoadBalancerProfile {
  readonly managedOutboundIPs?: AksClusterManagedOutboundIPs;
  readonly outboundIPPrefixes?: AksClusterOutboundIPPrefixes;
  readonly outboundIPs?: AksClusterOutboundIPs;
  readonly effectiveOutboundIPs?: AksClusterEffectiveOutboundIP[];
  readonly allocatedOutboundPorts?: number;
  readonly idleTimeoutInMinutes?: number;
  readonly enableMultipleStandardLoadBalancers?: boolean;
}

/**
 * Managed outbound IPs
 */
export interface AksClusterManagedOutboundIPs {
  readonly count?: number;
  readonly countIPv6?: number;
}

/**
 * Outbound IP prefixes
 */
export interface AksClusterOutboundIPPrefixes {
  readonly publicIPPrefixes?: AksClusterResourceReference[];
}

/**
 * Outbound IPs
 */
export interface AksClusterOutboundIPs {
  readonly publicIPs?: AksClusterResourceReference[];
}

/**
 * Effective outbound IP
 */
export interface AksClusterEffectiveOutboundIP {
  readonly id?: string;
}

/**
 * NAT Gateway profile
 */
export interface AksClusterNatGatewayProfile {
  readonly managedOutboundIPProfile?: AksClusterManagedOutboundIPProfile;
  readonly effectiveOutboundIPs?: AksClusterEffectiveOutboundIP[];
  readonly idleTimeoutInMinutes?: number;
}

/**
 * Managed outbound IP profile
 */
export interface AksClusterManagedOutboundIPProfile {
  readonly count?: number;
}

/**
 * Resource reference
 */
export interface AksClusterResourceReference {
  readonly id?: string;
}

/**
 * Service principal profile
 */
export interface AksClusterServicePrincipalProfile {
  readonly clientId: string;
  readonly secret?: string;
}

/**
 * API server access profile
 */
export interface AksClusterApiServerAccessProfile {
  readonly authorizedIPRanges?: string[];
  readonly enablePrivateCluster?: boolean;
  readonly privateDNSZone?: string;
  readonly enablePrivateClusterPublicFQDN?: boolean;
  readonly disableRunCommand?: boolean;
  readonly enableVnetIntegration?: boolean;
  readonly subnetId?: string;
}

/**
 * Auto-scaler profile
 */
export interface AksClusterAutoScalerProfile {
  readonly balanceSimilarNodeGroups?: string;
  readonly expander?: string;
  readonly maxEmptyBulkDelete?: string;
  readonly maxGracefulTerminationSec?: string;
  readonly maxNodeProvisionTime?: string;
  readonly maxTotalUnreadyPercentage?: string;
  readonly newPodScaleUpDelay?: string;
  readonly okTotalUnreadyCount?: string;
  readonly scanInterval?: string;
  readonly scaleDownDelayAfterAdd?: string;
  readonly scaleDownDelayAfterDelete?: string;
  readonly scaleDownDelayAfterFailure?: string;
  readonly scaleDownUnneededTime?: string;
  readonly scaleDownUnreadyTime?: string;
  readonly scaleDownUtilizationThreshold?: string;
  readonly skipNodesWithLocalStorage?: string;
  readonly skipNodesWithSystemPods?: string;
}

/**
 * Windows profile
 */
export interface AksClusterWindowsProfile {
  readonly adminUsername: string;
  readonly adminPassword?: string;
  readonly licenseType?: string;
  readonly enableCSIProxy?: boolean;
  readonly gmsaProfile?: AksClusterGmsaProfile;
}

/**
 * GMSA profile for Windows
 */
export interface AksClusterGmsaProfile {
  readonly enabled?: boolean;
  readonly dnsServer?: string;
  readonly rootDomainName?: string;
}

/**
 * Linux profile
 */
export interface AksClusterLinuxProfile {
  readonly adminUsername: string;
  readonly ssh: AksClusterSshConfiguration;
}

/**
 * SSH configuration
 */
export interface AksClusterSshConfiguration {
  readonly publicKeys: AksClusterSshPublicKey[];
}

/**
 * SSH public key
 */
export interface AksClusterSshPublicKey {
  readonly keyData: string;
}

/**
 * AAD (Azure Active Directory) profile
 */
export interface AksClusterAadProfile {
  readonly managed?: boolean;
  readonly enableAzureRBAC?: boolean;
  readonly adminGroupObjectIDs?: string[];
  readonly tenantID?: string;
  readonly clientAppID?: string;
  readonly serverAppID?: string;
  readonly serverAppSecret?: string;
}

/**
 * Addon profiles - a dictionary of addon names to their configurations
 */
export type AksClusterAddonProfiles = Record<string, AksClusterAddonProfile>;

/**
 * Individual addon profile
 */
export interface AksClusterAddonProfile {
  readonly enabled: boolean;
  readonly config?: { [key: string]: string };
}

/**
 * OIDC issuer profile
 */
export interface AksClusterOidcIssuerProfile {
  readonly enabled?: boolean;
  readonly issuerURL?: string;
}

/**
 * Security profile
 */
export interface AksClusterSecurityProfile {
  readonly defender?: AksClusterDefenderSecurityMonitoring;
  readonly imageCleaner?: AksClusterImageCleaner;
  readonly workloadIdentity?: AksClusterWorkloadIdentity;
  readonly azureKeyVaultKms?: AksClusterAzureKeyVaultKms;
}

/**
 * Defender security monitoring
 */
export interface AksClusterDefenderSecurityMonitoring {
  readonly enabled?: boolean;
  readonly logAnalyticsWorkspaceResourceId?: string;
}

/**
 * Image cleaner configuration
 */
export interface AksClusterImageCleaner {
  readonly enabled?: boolean;
  readonly intervalHours?: number;
}

/**
 * Workload identity configuration
 */
export interface AksClusterWorkloadIdentity {
  readonly enabled?: boolean;
}

/**
 * Azure Key Vault KMS configuration
 */
export interface AksClusterAzureKeyVaultKms {
  readonly enabled?: boolean;
  readonly keyId?: string;
  readonly keyVaultNetworkAccess?: string;
  readonly keyVaultResourceId?: string;
}

/**
 * Storage profile
 */
export interface AksClusterStorageProfile {
  readonly diskCSIDriver?: AksClusterDiskCSIDriver;
  readonly fileCSIDriver?: AksClusterFileCSIDriver;
  readonly snapshotController?: AksClusterSnapshotController;
  readonly blobCSIDriver?: AksClusterBlobCSIDriver;
}

/**
 * Disk CSI driver
 */
export interface AksClusterDiskCSIDriver {
  readonly enabled?: boolean;
  readonly version?: string;
}

/**
 * File CSI driver
 */
export interface AksClusterFileCSIDriver {
  readonly enabled?: boolean;
}

/**
 * Snapshot controller
 */
export interface AksClusterSnapshotController {
  readonly enabled?: boolean;
}

/**
 * Blob CSI driver
 */
export interface AksClusterBlobCSIDriver {
  readonly enabled?: boolean;
}

/**
 * HTTP proxy configuration
 */
export interface AksClusterHttpProxyConfig {
  readonly httpProxy?: string;
  readonly httpsProxy?: string;
  readonly noProxy?: string[];
  readonly trustedCa?: string;
}

/**
 * Workload auto-scaler profile
 */
export interface AksClusterWorkloadAutoScalerProfile {
  readonly keda?: AksClusterKeda;
  readonly verticalPodAutoscaler?: AksClusterVerticalPodAutoscaler;
}

/**
 * KEDA configuration
 */
export interface AksClusterKeda {
  readonly enabled?: boolean;
}

/**
 * Vertical pod autoscaler
 */
export interface AksClusterVerticalPodAutoscaler {
  readonly enabled?: boolean;
}

/**
 * Configuration options for AKS Cluster monitoring
 *
 * @stability stable
 */
export interface AksClusterMonitoringOptions {
  /**
   * Threshold for node CPU usage percentage (0-100)
   *
   * @default 80
   */
  readonly nodeCpuThreshold?: number;

  /**
   * Threshold for node memory usage percentage (0-100)
   *
   * @default 80
   */
  readonly nodeMemoryThreshold?: number;

  /**
   * Threshold for failed pod count
   *
   * @default 0
   */
  readonly failedPodThreshold?: number;

  /**
   * Whether to enable node CPU usage alert
   *
   * @default true
   */
  readonly enableNodeCpuAlert?: boolean;

  /**
   * Whether to enable node memory usage alert
   *
   * @default true
   */
  readonly enableNodeMemoryAlert?: boolean;

  /**
   * Whether to enable failed pod alert
   *
   * @default true
   */
  readonly enableFailedPodAlert?: boolean;

  /**
   * Whether to enable AKS cluster deletion alert
   *
   * @default true
   */
  readonly enableDeletionAlert?: boolean;

  /**
   * Severity level for node CPU alert (0=Critical, 1=Error, 2=Warning, 3=Informational, 4=Verbose)
   *
   * @default 2
   */
  readonly nodeCpuAlertSeverity?: 0 | 1 | 2 | 3 | 4;

  /**
   * Severity level for node memory alert (0=Critical, 1=Error, 2=Warning, 3=Informational, 4=Verbose)
   *
   * @default 2
   */
  readonly nodeMemoryAlertSeverity?: 0 | 1 | 2 | 3 | 4;

  /**
   * Severity level for failed pod alert (0=Critical, 1=Error, 2=Warning, 3=Informational, 4=Verbose)
   *
   * @default 1
   */
  readonly failedPodAlertSeverity?: 0 | 1 | 2 | 3 | 4;
}

// =============================================================================
// COMMON PROPERTY DEFINITIONS
// =============================================================================

/**
 * Common property definitions shared across all AKS Cluster versions
 */
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  location: {
    dataType: PropertyType.STRING,
    required: true,
    description: "The Azure region where the AKS cluster will be created",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "Location is required for AKS clusters",
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
    description: "A dictionary of tags to apply to the AKS cluster",
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
    description: "The name of the AKS cluster",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "AKS cluster name is required",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$",
        message:
          "AKS cluster name must be 1-63 characters, start and end with alphanumeric, and can contain hyphens",
      },
    ],
  },
  sku: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The SKU (pricing tier) for the AKS cluster",
  },
  identity: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The identity configuration for the AKS cluster",
  },
  kubernetesVersion: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The Kubernetes version for the cluster",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^\\d+\\.\\d+\\.\\d+$",
        message: "Kubernetes version must be in format X.Y.Z (e.g., 1.28.3)",
      },
    ],
  },
  dnsPrefix: {
    dataType: PropertyType.STRING,
    required: true,
    description: "DNS prefix for the cluster",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "DNS prefix is required for AKS clusters",
      },
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^[a-zA-Z0-9]([a-zA-Z0-9-]{0,52}[a-zA-Z0-9])?$",
        message:
          "DNS prefix must be 1-54 characters, start and end with alphanumeric, and can contain hyphens",
      },
    ],
  },
  fqdn: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The FQDN for the cluster (read-only)",
  },
  privateFQDN: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The private FQDN for the cluster (read-only)",
  },
  agentPoolProfiles: {
    dataType: PropertyType.ARRAY,
    required: true,
    description: "The agent pool profiles for the cluster node pools",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED,
        message: "At least one agent pool profile is required",
      },
    ],
  },
  servicePrincipalProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The service principal profile for the cluster",
  },
  networkProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The network configuration for the cluster",
  },
  aadProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The Azure Active Directory integration configuration",
  },
  autoScalerProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The auto-scaler configuration for the cluster",
  },
  apiServerAccessProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The API server access configuration",
  },
  diskEncryptionSetID: {
    dataType: PropertyType.STRING,
    required: false,
    description:
      "The resource ID of the disk encryption set for encrypting disks",
  },
  enableRBAC: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: true,
    description: "Whether to enable Kubernetes Role-Based Access Control",
  },
  nodeResourceGroup: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The name of the resource group for cluster nodes",
  },
  addonProfiles: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The addon profiles for cluster addons",
  },
  linuxProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The Linux profile for SSH access",
  },
  windowsProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The Windows profile for Windows node pools",
  },
  oidcIssuerProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The OIDC issuer profile for workload identity",
  },
  securityProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The security profile for the cluster",
  },
  storageProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The storage profile for CSI drivers",
  },
  httpProxyConfig: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The HTTP proxy configuration",
  },
  workloadAutoScalerProfile: {
    dataType: PropertyType.OBJECT,
    required: false,
    description: "The workload auto-scaler profile",
  },
  disableLocalAccounts: {
    dataType: PropertyType.BOOLEAN,
    required: false,
    defaultValue: false,
    description: "Whether to disable local accounts",
  },
  publicNetworkAccess: {
    dataType: PropertyType.STRING,
    required: false,
    description: "Whether the cluster is accessible from the public internet",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(Enabled|Disabled)$",
        message: "Public network access must be either 'Enabled' or 'Disabled'",
      },
    ],
  },
  supportPlan: {
    dataType: PropertyType.STRING,
    required: false,
    description: "The support plan for the cluster",
    validation: [
      {
        ruleType: ValidationRuleType.PATTERN_MATCH,
        value: "^(KubernetesOfficial|AKSLongTermSupport)$",
        message:
          "Support plan must be 'KubernetesOfficial' or 'AKSLongTermSupport'",
      },
    ],
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
 * API Schema for AKS Cluster version 2024-10-01
 */
export const AKS_CLUSTER_SCHEMA_2024_10_01: ApiSchema = {
  resourceType: "Microsoft.ContainerService/managedClusters",
  version: "2024-10-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name", "dnsPrefix", "agentPoolProfiles"],
  optional: [
    "tags",
    "sku",
    "identity",
    "kubernetesVersion",
    "fqdn",
    "privateFQDN",
    "servicePrincipalProfile",
    "networkProfile",
    "aadProfile",
    "autoScalerProfile",
    "apiServerAccessProfile",
    "diskEncryptionSetID",
    "enableRBAC",
    "nodeResourceGroup",
    "addonProfiles",
    "linuxProfile",
    "windowsProfile",
    "oidcIssuerProfile",
    "securityProfile",
    "storageProfile",
    "httpProxyConfig",
    "workloadAutoScalerProfile",
    "disableLocalAccounts",
    "publicNetworkAccess",
    "supportPlan",
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
          message: "Location is required for AKS clusters",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for AKS clusters",
        },
      ],
    },
    {
      property: "dnsPrefix",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "DNS prefix is required for AKS clusters",
        },
      ],
    },
    {
      property: "agentPoolProfiles",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "At least one agent pool profile is required",
        },
      ],
    },
  ],
};

/**
 * API Schema for AKS Cluster version 2025-01-01
 */
export const AKS_CLUSTER_SCHEMA_2025_01_01: ApiSchema = {
  resourceType: "Microsoft.ContainerService/managedClusters",
  version: "2025-01-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name", "dnsPrefix", "agentPoolProfiles"],
  optional: [
    "tags",
    "sku",
    "identity",
    "kubernetesVersion",
    "fqdn",
    "privateFQDN",
    "servicePrincipalProfile",
    "networkProfile",
    "aadProfile",
    "autoScalerProfile",
    "apiServerAccessProfile",
    "diskEncryptionSetID",
    "enableRBAC",
    "nodeResourceGroup",
    "addonProfiles",
    "linuxProfile",
    "windowsProfile",
    "oidcIssuerProfile",
    "securityProfile",
    "storageProfile",
    "httpProxyConfig",
    "workloadAutoScalerProfile",
    "disableLocalAccounts",
    "publicNetworkAccess",
    "supportPlan",
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
          message: "Location is required for AKS clusters",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for AKS clusters",
        },
      ],
    },
    {
      property: "dnsPrefix",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "DNS prefix is required for AKS clusters",
        },
      ],
    },
    {
      property: "agentPoolProfiles",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "At least one agent pool profile is required",
        },
      ],
    },
  ],
};

/**
 * API Schema for AKS Cluster version 2025-07-01
 */
export const AKS_CLUSTER_SCHEMA_2025_07_01: ApiSchema = {
  resourceType: "Microsoft.ContainerService/managedClusters",
  version: "2025-07-01",
  properties: {
    ...COMMON_PROPERTIES,
  },
  required: ["location", "name", "dnsPrefix", "agentPoolProfiles"],
  optional: [
    "tags",
    "sku",
    "identity",
    "kubernetesVersion",
    "fqdn",
    "privateFQDN",
    "servicePrincipalProfile",
    "networkProfile",
    "aadProfile",
    "autoScalerProfile",
    "apiServerAccessProfile",
    "diskEncryptionSetID",
    "enableRBAC",
    "nodeResourceGroup",
    "addonProfiles",
    "linuxProfile",
    "windowsProfile",
    "oidcIssuerProfile",
    "securityProfile",
    "storageProfile",
    "httpProxyConfig",
    "workloadAutoScalerProfile",
    "disableLocalAccounts",
    "publicNetworkAccess",
    "supportPlan",
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
          message: "Location is required for AKS clusters",
        },
      ],
    },
    {
      property: "name",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "Name is required for AKS clusters",
        },
      ],
    },
    {
      property: "dnsPrefix",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "DNS prefix is required for AKS clusters",
        },
      ],
    },
    {
      property: "agentPoolProfiles",
      rules: [
        {
          ruleType: ValidationRuleType.REQUIRED,
          message: "At least one agent pool profile is required",
        },
      ],
    },
  ],
};

// =============================================================================
// VERSION CONFIGURATIONS
// =============================================================================

/**
 * Version configuration for AKS Cluster 2024-10-01
 */
export const AKS_CLUSTER_VERSION_2024_10_01: VersionConfig = {
  version: "2024-10-01",
  schema: AKS_CLUSTER_SCHEMA_2024_10_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2024-10-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/aks-cluster/migration-2024-10-01",
  changeLog: [
    {
      changeType: "added",
      description:
        "Stable release with comprehensive AKS features including workload auto-scaler and support plans",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for AKS Cluster 2025-01-01
 */
export const AKS_CLUSTER_VERSION_2025_01_01: VersionConfig = {
  version: "2025-01-01",
  schema: AKS_CLUSTER_SCHEMA_2025_01_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-01-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/aks-cluster/migration-2025-01-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Enhanced security and performance features",
      breaking: false,
    },
    {
      changeType: "updated",
      description:
        "Improved workload identity and security profile configurations",
      breaking: false,
    },
  ],
};

/**
 * Version configuration for AKS Cluster 2025-07-01
 */
export const AKS_CLUSTER_VERSION_2025_07_01: VersionConfig = {
  version: "2025-07-01",
  schema: AKS_CLUSTER_SCHEMA_2025_07_01,
  supportLevel: VersionSupportLevel.ACTIVE,
  releaseDate: "2025-07-01",
  deprecationDate: undefined,
  sunsetDate: undefined,
  breakingChanges: [],
  migrationGuide: "/docs/aks-cluster/migration-2025-07-01",
  changeLog: [
    {
      changeType: "updated",
      description: "Latest API version with newest features and improvements",
      breaking: false,
    },
  ],
};

/**
 * All supported AKS Cluster versions for registration
 */
export const ALL_AKS_CLUSTER_VERSIONS: VersionConfig[] = [
  AKS_CLUSTER_VERSION_2024_10_01,
  AKS_CLUSTER_VERSION_2025_01_01,
  AKS_CLUSTER_VERSION_2025_07_01,
];

/**
 * Resource type constant
 */
export const AKS_CLUSTER_TYPE = "Microsoft.ContainerService/managedClusters";
