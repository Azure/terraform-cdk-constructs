/**
 * Azure Virtual Machine Scale Set Constructs using AzapiResource Framework
 */

// Export the unified implementation
export * from "./virtual-machine-scale-set";

// Export schemas for advanced usage
export * from "./vmss-schemas";

// Explicit exports for main class and interfaces
export { VirtualMachineScaleSet } from "./virtual-machine-scale-set";

// Schema exports
export {
  VMSS_TYPE,
  ALL_VMSS_VERSIONS,
  VMSS_SCHEMA_2025_01_02,
  VMSS_SCHEMA_2025_02_01,
  VMSS_SCHEMA_2025_04_01,
  VMSS_VERSION_2025_01_02,
  VMSS_VERSION_2025_02_01,
  VMSS_VERSION_2025_04_01,
  COMMON_VMSS_PROPERTIES,
} from "./vmss-schemas";

// Export all TypeScript interfaces for nested objects
export type {
  VirtualMachineScaleSetSku,
  UpgradePolicyMode,
  RollingUpgradePolicy,
  AutomaticOSUpgradePolicy,
  VirtualMachineScaleSetUpgradePolicy,
  IPConfiguration,
  NetworkInterfaceConfiguration,
  VirtualMachineScaleSetNetworkProfile,
  VirtualMachineScaleSetVMProfile,
  AutomaticRepairsPolicy,
  VirtualMachineScaleSetScaleInPolicy,
  OrchestrationMode,
  VirtualMachineScaleSetScalingConfiguration,
  VirtualMachineScaleSetProps,
  VirtualMachineScaleSetBody,
  VirtualMachineScaleSetBodyProperties,
} from "./vmss-schemas";

// Re-export VM types that are reused in VMSS for convenience
export type {
  VirtualMachineHardwareProfile,
  VirtualMachineStorageProfile,
  VirtualMachineOSProfile,
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
