/**
 * Azure Virtual Machine Constructs using VersionedAzapiResource Framework
 */

// Export the unified implementation
export * from "./virtual-machine";

// Export schemas for advanced usage
export * from "./virtual-machine-schemas";

// Explicit exports for main class and interfaces
export { VirtualMachine } from "./virtual-machine";
export type { VirtualMachineProps } from "./virtual-machine";
export type { VirtualMachineBody } from "./virtual-machine";
export type { VirtualMachineBodyProperties } from "./virtual-machine";

// Schema exports
export {
  VIRTUAL_MACHINE_TYPE,
  ALL_VIRTUAL_MACHINE_VERSIONS,
  VIRTUAL_MACHINE_SCHEMA_2024_07_01,
  VIRTUAL_MACHINE_SCHEMA_2024_11_01,
  VIRTUAL_MACHINE_SCHEMA_2025_04_01,
  VIRTUAL_MACHINE_VERSION_2024_07_01,
  VIRTUAL_MACHINE_VERSION_2024_11_01,
  VIRTUAL_MACHINE_VERSION_2025_04_01,
} from "./virtual-machine-schemas";

// Export all TypeScript interfaces for nested objects
export type {
  VirtualMachineHardwareProfile,
  VirtualMachineImageReference,
  VirtualMachineOSDisk,
  VirtualMachineDataDisk,
  VirtualMachineManagedDiskParameters,
  VirtualMachineDiskEncryptionSetParameters,
  VirtualMachineStorageProfile,
  VirtualMachineNetworkInterfaceReference,
  VirtualMachineNetworkProfile,
  VirtualMachineSshPublicKey,
  VirtualMachineSshConfiguration,
  VirtualMachineLinuxConfiguration,
  VirtualMachineLinuxPatchSettings,
  VirtualMachineWindowsConfiguration,
  VirtualMachineWindowsPatchSettings,
  VirtualMachineWinRMConfiguration,
  VirtualMachineWinRMListener,
  VirtualMachineOSProfile,
  VirtualMachineSecret,
  VirtualMachineSubResource,
  VirtualMachineVaultCertificate,
  VirtualMachineIdentity,
  VirtualMachinePlan,
  VirtualMachineAdditionalCapabilities,
  VirtualMachineBootDiagnostics,
  VirtualMachineDiagnosticsProfile,
  VirtualMachinePriorityProfile,
  VirtualMachineBillingProfile,
  VirtualMachineSecurityProfile,
  VirtualMachineUefiSettings,
  VirtualMachineAvailabilitySetReference,
  VirtualMachineScaleSetReference,
  VirtualMachineProximityPlacementGroupReference,
  VirtualMachineHostReference,
  VirtualMachineLicenseType,
} from "./virtual-machine-schemas";
