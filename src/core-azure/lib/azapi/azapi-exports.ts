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
} from "./providers-azapi/data-azapi-client-config";
export type {
  DataAzapiClientConfigConfig,
  DataAzapiClientConfigTimeouts,
} from "./providers-azapi/data-azapi-client-config";

// Re-export from data-azapi-resource
export {
  DataAzapiResource,
  DataAzapiResourceIdentityList,
  DataAzapiResourceIdentityOutputReference,
  DataAzapiResourceRetryOutputReference,
  DataAzapiResourceTimeoutsOutputReference,
} from "./providers-azapi/data-azapi-resource";
export type {
  DataAzapiResourceConfig,
  DataAzapiResourceIdentity,
  DataAzapiResourceRetry,
  DataAzapiResourceTimeouts,
} from "./providers-azapi/data-azapi-resource";

// Re-export from resource
export {
  Resource,
  ResourceIdentity,
  ResourceIdentityList,
  ResourceIdentityOutputReference,
  ResourceRetryOutputReference,
  ResourceTimeoutsOutputReference,
} from "./providers-azapi/resource";
export type {
  ResourceConfig,
  ResourceRetry,
  ResourceTimeouts,
} from "./providers-azapi/resource";

// Re-export from resource-action
export {
  ResourceAction,
  ResourceActionRetryOutputReference,
  ResourceActionTimeoutsOutputReference,
} from "./providers-azapi/resource-action";
export type {
  ResourceActionConfig,
  ResourceActionRetry,
  ResourceActionTimeouts,
} from "./providers-azapi/resource-action";

// Re-export from update-resource
export {
  UpdateResource,
  UpdateResourceRetryOutputReference,
  UpdateResourceTimeoutsOutputReference,
} from "./providers-azapi/update-resource";
export type {
  UpdateResourceConfig,
  UpdateResourceRetry,
  UpdateResourceTimeouts,
} from "./providers-azapi/update-resource";
