/**
 * @microsoft/terraform-cdk-constructs
 *
 * Azure CDK constructs using AZAPI provider for direct Azure REST API access.
 *
 * Version 1.0.0 - Major breaking change migration from AzureRM to AZAPI
 *
 * Available modules:
 * - azure_actiongroup: Azure Action Group constructs for Azure Monitor alerts
 * - azure_activitylogalert: Azure Activity Log Alert constructs for operation monitoring
 * - azure_aks: Azure Kubernetes Service constructs with version-aware AZAPI implementation
 * - azure_diagnosticsettings: Azure Diagnostic Settings constructs for monitoring and observability
 * - azure_metricalert: Azure Metric Alert constructs for metric-based alerting
 * - azure_networkinterface: Network Interface constructs with version-aware AZAPI implementation
 * - azure_networksecuritygroup: Network Security Group constructs with version-aware AZAPI implementation
 * - azure_publicipaddress: Public IP Address constructs with version-aware AZAPI implementation
 * - azure_resourcegroup: Resource Group constructs with version-aware AZAPI implementation
 * - azure_storageaccount: Storage Account constructs with version-aware AZAPI implementation
 * - azure_subnet: Subnet constructs with version-aware AZAPI implementation
 * - azure_virtualmachine: Virtual Machine constructs with version-aware AZAPI implementation
 * - azure_virtualnetwork: Virtual Network constructs with version-aware AZAPI implementation
 * - azure_vmss: Virtual Machine Scale Sets constructs with version-aware AZAPI implementation
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
export * as azure_actiongroup from "./azure-actiongroup";
export * as azure_activitylogalert from "./azure-activitylogalert";
export * as azure_aks from "./azure-aks";
export * as azure_diagnosticsettings from "./azure-diagnosticsettings";
export * as azure_dnsforwardingruleset from "./azure-dnsforwardingruleset";
export * as azure_dnsresolver from "./azure-dnsresolver";
export * as azure_dnszone from "./azure-dnszone";
export * as azure_metricalert from "./azure-metricalert";
export * as azure_networkinterface from "./azure-networkinterface";
export * as azure_networksecuritygroup from "./azure-networksecuritygroup";
export * as azure_policyassignment from "./azure-policyassignment";
export * as azure_policydefinition from "./azure-policydefinition";
export * as azure_privatednszone from "./azure-privatednszone";
export * as azure_publicipaddress from "./azure-publicipaddress";
export * as azure_resourcegroup from "./azure-resourcegroup";
export * as azure_roleassignment from "./azure-roleassignment";
export * as azure_roledefinition from "./azure-roledefinition";
export * as azure_storageaccount from "./azure-storageaccount";
export * as azure_subnet from "./azure-subnet";
export * as azure_virtualmachine from "./azure-virtualmachine";
export * as azure_virtualnetwork from "./azure-virtualnetwork";
export * as azure_virtualnetworkmanager from "./azure-virtualnetworkmanager";
export * as azure_vmss from "./azure-vmss";

// Export types at top level for JSII compatibility
export * from "./azure-actiongroup";
export * from "./azure-activitylogalert";
export * from "./azure-aks";
export * from "./azure-diagnosticsettings";
export * from "./azure-dnsforwardingruleset";
export * from "./azure-dnsresolver";
export * from "./azure-dnszone";
export * from "./azure-metricalert";
export * from "./azure-networkinterface";
export * from "./azure-networksecuritygroup";
export * from "./azure-policyassignment";
export * from "./azure-policydefinition";
export * from "./azure-privatednszone";
export * from "./azure-privatednszonelink";
export * from "./azure-publicipaddress";
export * from "./azure-resourcegroup";
export * from "./azure-roleassignment";
export * from "./azure-roledefinition";
export * from "./azure-storageaccount";
export * from "./azure-subnet";
export * from "./azure-virtualmachine";
export * from "./azure-virtualnetwork";
export * from "./azure-virtualnetworkmanager";
export * from "./azure-vmss";

// Utility modules
export * as testing from "./testing";

// Export testing types at top level for JSII compatibility
export * from "./testing";
