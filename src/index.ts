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
 * - azure_loganalyticsworkspace: Log Analytics Workspace constructs for log data collection
 * - azure_diagnosticsettings: Azure Diagnostic Settings constructs for monitoring and observability
 * - azure_dnsforwardingruleset: DNS Forwarding Ruleset constructs for private DNS resolution
 * - azure_dnsresolver: DNS Resolver constructs for private DNS resolution
 * - azure_dnszone: Public DNS Zone constructs with DNS record management
 * - azure_metricalert: Azure Metric Alert constructs for metric-based alerting
 * - azure_networkinterface: Network Interface constructs with version-aware AZAPI implementation
 * - azure_networksecuritygroup: Network Security Group constructs with version-aware AZAPI implementation
 * - azure_networkwatcher: Network Watcher constructs for network monitoring and diagnostics
 * - azure_policyassignment: Policy Assignment constructs for Azure Policy
 * - azure_policydefinition: Policy Definition constructs for custom Azure policies
 * - azure_policysetdefinition: Policy Set Definition (Initiative) constructs for grouping policies
 * - azure_privatednszone: Private DNS Zone constructs with DNS record management
 * - azure_privatednszonelink: Private DNS Zone Link constructs for VNet linking
 * - azure_publicipaddress: Public IP Address constructs with version-aware AZAPI implementation
 * - azure_resourcegroup: Resource Group constructs with version-aware AZAPI implementation
 * - azure_roleassignment: Role Assignment constructs for Azure RBAC
 * - azure_roledefinition: Role Definition constructs for custom RBAC roles
 * - azure_storageaccount: Storage Account constructs with version-aware AZAPI implementation
 * - azure_subnet: Subnet constructs with version-aware AZAPI implementation
 * - azure_virtualmachine: Virtual Machine constructs with version-aware AZAPI implementation
 * - azure_virtualnetwork: Virtual Network constructs with version-aware AZAPI implementation
 * - azure_virtualnetworkgateway: Virtual Network Gateway constructs for VPN/ExpressRoute
 * - azure_virtualnetworkgatewayconnection: VNet Gateway Connection constructs
 * - azure_virtualnetworkmanager: Virtual Network Manager constructs for network governance
 * - azure_vmss: Virtual Machine Scale Sets constructs with version-aware AZAPI implementation
 * - core_azure: Core AZAPI functionality and base classes
 * - testing: Test utilities and helpers
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
export * as azure_loganalyticsworkspace from "./azure-loganalyticsworkspace";
export * as azure_dnsresolver from "./azure-dnsresolver";
export * as azure_dnszone from "./azure-dnszone";
export * as azure_metricalert from "./azure-metricalert";
export * as azure_networkinterface from "./azure-networkinterface";
export * as azure_networksecuritygroup from "./azure-networksecuritygroup";
export * as azure_networkwatcher from "./azure-networkwatcher";
export * as azure_policyassignment from "./azure-policyassignment";
export * as azure_policydefinition from "./azure-policydefinition";
export * as azure_policysetdefinition from "./azure-policysetdefinition";
export * as azure_privatednszone from "./azure-privatednszone";
export * as azure_privatednszonelink from "./azure-privatednszonelink";
export * as azure_publicipaddress from "./azure-publicipaddress";
export * as azure_resourcegroup from "./azure-resourcegroup";
export * as azure_roleassignment from "./azure-roleassignment";
export * as azure_roledefinition from "./azure-roledefinition";
export * as azure_storageaccount from "./azure-storageaccount";
export * as azure_subnet from "./azure-subnet";
export * as azure_virtualmachine from "./azure-virtualmachine";
export * as azure_virtualnetwork from "./azure-virtualnetwork";
export * as azure_virtualnetworkgateway from "./azure-virtualnetworkgateway";
export * as azure_virtualnetworkgatewayconnection from "./azure-virtualnetworkgatewayconnection";
export * as azure_virtualnetworkmanager from "./azure-virtualnetworkmanager";
export * as azure_vmss from "./azure-vmss";

// Export types at top level for JSII compatibility
export * from "./azure-actiongroup";
export * from "./azure-activitylogalert";
export * from "./azure-aks";
export * from "./azure-diagnosticsettings";
export * from "./azure-dnsforwardingruleset";
export * from "./azure-dnsresolver";
export * from "./azure-loganalyticsworkspace";
export * from "./azure-dnszone";
export * from "./azure-metricalert";
export * from "./azure-networkinterface";
export * from "./azure-networksecuritygroup";
export * from "./azure-networkwatcher";
export * from "./azure-policyassignment";
export * from "./azure-policydefinition";
export * from "./azure-policysetdefinition";
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
export * from "./azure-virtualnetworkgateway";
export * from "./azure-virtualnetworkgatewayconnection";
export * from "./azure-virtualnetworkmanager";
export * from "./azure-vmss";

// Utility modules
export * as testing from "./testing";

// Export testing types at top level for JSII compatibility
export * from "./testing";
