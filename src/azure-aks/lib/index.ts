/**
 * Azure Kubernetes Service (AKS) Constructs using VersionedAzapiResource Framework
 */

// Export the unified implementation
export * from "./aks-cluster";

// Export schemas for advanced usage
export * from "./aks-cluster-schemas";

// Explicit exports for main class and interfaces
export { AksCluster } from "./aks-cluster";
export type { AksClusterProps } from "./aks-cluster";
export type { AksClusterBody } from "./aks-cluster";
export type { AksClusterBodyProperties } from "./aks-cluster";

// Schema exports
export {
  AKS_CLUSTER_TYPE,
  ALL_AKS_CLUSTER_VERSIONS,
  AKS_CLUSTER_SCHEMA_2024_10_01,
  AKS_CLUSTER_SCHEMA_2025_01_01,
  AKS_CLUSTER_SCHEMA_2025_07_01,
  AKS_CLUSTER_VERSION_2024_10_01,
  AKS_CLUSTER_VERSION_2025_01_01,
  AKS_CLUSTER_VERSION_2025_07_01,
} from "./aks-cluster-schemas";

// Export all TypeScript interfaces for nested objects
export type {
  AksClusterSku,
  AksClusterIdentity,
  AksClusterAgentPoolProfile,
  AksClusterKubeletConfig,
  AksClusterLinuxOSConfig,
  AksClusterSysctlConfig,
  AksClusterNetworkProfile,
  AksClusterLoadBalancerProfile,
  AksClusterManagedOutboundIPs,
  AksClusterOutboundIPPrefixes,
  AksClusterOutboundIPs,
  AksClusterEffectiveOutboundIP,
  AksClusterNatGatewayProfile,
  AksClusterManagedOutboundIPProfile,
  AksClusterResourceReference,
  AksClusterServicePrincipalProfile,
  AksClusterApiServerAccessProfile,
  AksClusterAutoScalerProfile,
  AksClusterWindowsProfile,
  AksClusterGmsaProfile,
  AksClusterLinuxProfile,
  AksClusterSshConfiguration,
  AksClusterSshPublicKey,
  AksClusterAadProfile,
  AksClusterAddonProfiles,
  AksClusterAddonProfile,
  AksClusterOidcIssuerProfile,
  AksClusterSecurityProfile,
  AksClusterDefenderSecurityMonitoring,
  AksClusterImageCleaner,
  AksClusterWorkloadIdentity,
  AksClusterAzureKeyVaultKms,
  AksClusterStorageProfile,
  AksClusterDiskCSIDriver,
  AksClusterFileCSIDriver,
  AksClusterSnapshotController,
  AksClusterBlobCSIDriver,
  AksClusterHttpProxyConfig,
  AksClusterWorkloadAutoScalerProfile,
  AksClusterKeda,
  AksClusterVerticalPodAutoscaler,
} from "./aks-cluster-schemas";
