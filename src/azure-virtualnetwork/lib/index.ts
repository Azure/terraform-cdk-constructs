/**
 * Internal exports for Azure Virtual Network module
 *
 * This file exports all the components of the Virtual Network module for
 * internal use within the library. External consumers should import from
 * the parent index.ts file.
 */

// Export the main Virtual Network class and its interfaces
export {
  VirtualNetwork,
  VirtualNetworkProps,
  VirtualNetworkAddressSpace,
  VirtualNetworkDhcpOptions,
} from "./virtual-network";

// Export schema definitions and version configurations
export {
  VIRTUAL_NETWORK_TYPE,
  VIRTUAL_NETWORK_SCHEMA_2024_07_01,
  VIRTUAL_NETWORK_SCHEMA_2024_10_01,
  VIRTUAL_NETWORK_VERSION_2024_07_01,
  VIRTUAL_NETWORK_VERSION_2024_10_01,
  ALL_VIRTUAL_NETWORK_VERSIONS,
} from "./virtual-network-schemas";
