/**
 * @microsoft/terraform-cdk-constructs
 *
 * Azure CDK constructs using AZAPI provider for direct Azure REST API access.
 *
 * Version 1.0.0 - Major breaking change migration from AzureRM to AZAPI
 *
 * Available modules:
 * - azure_resourcegroup: Resource Group constructs with version-specific AZAPI implementations
 * - core_azure: Core AZAPI functionality and base classes
 *
 * For migration guide and documentation, see:
 * https://github.com/azure/terraform-cdk-constructs
 */

// Core AZAPI functionality
export * as core_azure from "./core-azure";

// AZAPI-based Azure services
export * as azure_resourcegroup from "./azure-resourcegroup";

// Utility modules
export * as testing from "./testing";
