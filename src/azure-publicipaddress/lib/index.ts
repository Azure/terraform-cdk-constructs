/**
 * Azure Public IP Address construct exports
 *
 * This module exports the Public IP Address construct and related interfaces
 * for use in Terraform CDK applications.
 */

export { PublicIPAddress } from "./public-ip-address";
export type {
  PublicIPAddressProps,
  PublicIPAddressSku,
  PublicIPAddressDnsSettings,
} from "./public-ip-address";

export {
  PUBLIC_IP_ADDRESS_TYPE,
  ALL_PUBLIC_IP_ADDRESS_VERSIONS,
  PUBLIC_IP_ADDRESS_SCHEMA_2024_07_01,
  PUBLIC_IP_ADDRESS_SCHEMA_2024_10_01,
  PUBLIC_IP_ADDRESS_VERSION_2024_07_01,
  PUBLIC_IP_ADDRESS_VERSION_2024_10_01,
} from "./public-ip-address-schemas";
