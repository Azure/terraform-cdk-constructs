/**
 * Convenience exports for commonly used AZAPI provider classes
 *
 * This file provides direct imports for frequently used AZAPI classes
 * without needing to navigate the nested provider structure.
 */

// Re-export from data-azapi-client-config
export {
  DataAzapiClientConfig,
  DataAzapiClientConfigTimeoutsOutputReference,
} from "@cdktn/provider-azapi/lib/data-azapi-client-config";
export type {
  DataAzapiClientConfigConfig,
  DataAzapiClientConfigTimeouts,
} from "@cdktn/provider-azapi/lib/data-azapi-client-config";

// Re-export from data-azapi-resource
export {
  DataAzapiResource,
  DataAzapiResourceIdentityList,
  DataAzapiResourceIdentityOutputReference,
  DataAzapiResourceRetryOutputReference,
  DataAzapiResourceTimeoutsOutputReference,
} from "@cdktn/provider-azapi/lib/data-azapi-resource";
export type {
  DataAzapiResourceConfig,
  DataAzapiResourceIdentity,
  DataAzapiResourceRetry,
  DataAzapiResourceTimeouts,
} from "@cdktn/provider-azapi/lib/data-azapi-resource";

// Re-export from resource
export {
  Resource,
  ResourceIdentity,
  ResourceIdentityList,
  ResourceIdentityOutputReference,
  ResourceRetryOutputReference,
  ResourceTimeoutsOutputReference,
} from "@cdktn/provider-azapi/lib/resource";
export type {
  ResourceConfig,
  ResourceRetry,
  ResourceTimeouts,
} from "@cdktn/provider-azapi/lib/resource";

// Re-export from resource-action
export {
  ResourceAction,
  ResourceActionRetryOutputReference,
  ResourceActionTimeoutsOutputReference,
} from "@cdktn/provider-azapi/lib/resource-action";
export type {
  ResourceActionConfig,
  ResourceActionRetry,
  ResourceActionTimeouts,
} from "@cdktn/provider-azapi/lib/resource-action";

// Re-export from update-resource
export {
  UpdateResource,
  UpdateResourceRetryOutputReference,
  UpdateResourceTimeoutsOutputReference,
} from "@cdktn/provider-azapi/lib/update-resource";
export type {
  UpdateResourceConfig,
  UpdateResourceRetry,
  UpdateResourceTimeouts,
} from "@cdktn/provider-azapi/lib/update-resource";
