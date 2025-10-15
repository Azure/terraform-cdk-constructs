/**
 * Azure ResourceGroup Constructs using AZAPI Provider
 *
 * This module provides AZAPI-based ResourceGroup constructs with direct Azure REST API access:
 *
 * - Version-specific API implementations
 * - JSII-compatible standalone classes
 * - Type-safe version selection
 * - Clean versioned imports
 * - No dependency on AzureRM provider
 *
 * Usage:
 * ```typescript
 * import { Group } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
 * import { Group as GroupV2024 } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup/v2024_11_01";
 * ```
 */

// Export AZAPI-based implementation (now the only implementation)
export * from "./lib";

// Convenience exports for version management
export { ResourceGroupVersion } from "./lib";

// Main ResourceGroup export (AZAPI-based)
export { Group as ResourceGroup } from "./lib";
