/**
 * @microsoft/terraform-cdk-constructs
 *
 * Azure CDK constructs using AZAPI provider for direct Azure REST API access.
 *
 * Version 1.0.0 - Major breaking change migration from AzureRM to AZAPI
 *
 * Available modules:
 * - azure_resourcegroup: Resource Group constructs with version-aware AZAPI implementation
 * - azure_storageaccount: Storage Account constructs with version-aware AZAPI implementation
 * - core_azure: Core AZAPI functionality and base classes
 *
 * For migration guide and documentation, see:
 * https://github.com/azure/terraform-cdk-constructs
 */

// Core AZAPI functionality
export * as core_azure from "./core-azure";

// Export core types at top level for JSII compatibility
export * from "./core-azure";

// AZAPI-based Azure services
export * as azure_resourcegroup from "./azure-resourcegroup";
export * as azure_storageaccount from "./azure-storageaccount";

// Export types at top level for JSII compatibility
export * from "./azure-resourcegroup";
export * from "./azure-storageaccount";

// Utility modules
export * as testing from "./testing";
