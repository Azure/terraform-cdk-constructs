/**
 * Azure Network Interface exports
 */

export * from "./network-interface";
export * from "./network-interface-schemas";

// Export key interfaces for use in other modules
export type {
  NetworkInterfaceIPConfiguration,
  NetworkInterfaceDnsSettings,
  NetworkInterfaceProps,
  NetworkInterfaceBodyProperties,
  NetworkInterfaceBody,
} from "./network-interface";
