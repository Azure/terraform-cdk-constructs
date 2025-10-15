/**
 * Azure ResourceGroup Constructs using AZAPI Provider
 *
 * This module provides AZAPI-based ResourceGroup constructs with version-specific implementations:
 *
 * - Direct Azure REST API access with version management
 * - No dependency on AzureRM provider
 * - Type-safe version selection
 * - Clean versioned imports
 */

// Export version management
export * from "./versions";

// Export latest version as default (recommended for most users)
export * from "./latest";

// Note: Version-specific implementations are available as separate imports
// to avoid JSII symbol conflicts. Use:
// import { Group } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup/v2024_11_01";

// Convenience exports
export { ResourceGroupVersion } from "./versions";

// Default export alias for backward compatibility
export { Group as ResourceGroup } from "./latest";
