/**
 * Integration test for Azure Virtual Network Manager and Child Resources
 *
 * This test demonstrates comprehensive usage of the VirtualNetworkManager construct
 * including all child resources (NetworkGroup, ConnectivityConfiguration, SecurityAdminConfiguration,
 * SecurityAdminRuleCollection, SecurityAdminRule, and NetworkGroupStaticMember).
 *
 * It validates:
 * - VirtualNetworkManager deployment
 * - NetworkGroup creation with both convenience methods and direct instantiation
 * - NetworkGroupStaticMember for adding VNets to groups
 * - ConnectivityConfiguration for both Mesh and Hub-Spoke topologies
 * - SecurityAdminConfiguration, RuleCollections, and Rules (Allow, Deny, AlwaysAllow)
 * - Parent-child relationships and proper deployment order
 * - Idempotency and cleanup
 *
 * Run with: npm run integration:nostream
 *
 * NOTE: This test requires actual Azure credentials and will deploy real resources.
 * Ensure you have:
 * - Azure CLI installed and authenticated (az login)
 * - Appropriate permissions to create Network Managers in your subscription
 * - The subscription ID set in environment or using az account set
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { Subnet } from "../../azure-subnet";
import { VirtualNetwork } from "../../azure-virtualnetwork";
import { DataAzapiClientConfig } from "../../core-azure/lib/azapi/providers-azapi/data-azapi-client-config";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { ConnectivityConfiguration } from "../lib/connectivity-configuration";
import { NetworkGroup } from "../lib/network-group";
import { NetworkGroupStaticMember } from "../lib/network-group-static-member";
import { SecurityAdminRule } from "../lib/security-admin-rule";
import { SecurityAdminRuleCollection } from "../lib/security-admin-rule-collection";
import { VirtualNetworkManager } from "../lib/virtual-network-manager";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata(
  "virtual-network-manager-comprehensive",
  {
    maxAgeHours: 4,
  },
);

/**
 * Comprehensive example stack demonstrating Virtual Network Manager with all child resources
 */
class VirtualNetworkManagerComprehensiveStack extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      testRunOptions: {
        maxAgeHours: testMetadata.maxAgeHours,
        autoCleanup: testMetadata.autoCleanup,
        cleanupPolicy: testMetadata.cleanupPolicy,
      },
    });

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Get current client configuration (for subscription ID)
    const clientConfig = new DataAzapiClientConfig(this, "current", {});

    // Generate unique names
    const rgName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "vnm-comprehensive",
    );

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
        testType: "comprehensive",
      },
    });

    // =============================================================================
    // CREATE TEST VIRTUAL NETWORKS FOR NETWORK GROUP MEMBERSHIP
    // =============================================================================

    // Create production VNet
    const prodVnet = new VirtualNetwork(this, "prod-vnet", {
      name: "vnet-prod",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.1.0.0/16"],
      },
      tags: {
        ...this.systemTags(),
        environment: "production",
      },
    });

    // Create production subnet
    new Subnet(this, "prod-subnet", {
      name: "subnet-prod",
      resourceGroupId: resourceGroup.id,
      virtualNetworkName: prodVnet.props.name!,
      virtualNetworkId: prodVnet.id,
      addressPrefix: "10.1.1.0/24",
    });

    // Create staging VNet
    const stagingVnet = new VirtualNetwork(this, "staging-vnet", {
      name: "vnet-staging",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.2.0.0/16"],
      },
      tags: {
        ...this.systemTags(),
        environment: "staging",
      },
    });

    // Create staging subnet
    new Subnet(this, "staging-subnet", {
      name: "subnet-staging",
      resourceGroupId: resourceGroup.id,
      virtualNetworkName: stagingVnet.props.name!,
      virtualNetworkId: stagingVnet.id,
      addressPrefix: "10.2.1.0/24",
    });

    // Create hub VNet for hub-spoke topology
    const hubVnet = new VirtualNetwork(this, "hub-vnet", {
      name: "vnet-hub",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
      tags: {
        ...this.systemTags(),
        role: "hub",
      },
    });

    // Create hub subnet
    new Subnet(this, "hub-subnet", {
      name: "subnet-hub",
      resourceGroupId: resourceGroup.id,
      virtualNetworkName: hubVnet.props.name!,
      virtualNetworkId: hubVnet.id,
      addressPrefix: "10.0.1.0/24",
    });

    // =============================================================================
    // CREATE VIRTUAL NETWORK MANAGER
    // =============================================================================

    const networkManager = new VirtualNetworkManager(this, "vnm", {
      name: "vnm-comprehensive-test",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      networkManagerScopes: {
        subscriptions: [
          `/subscriptions/\${${clientConfig.fqn}.subscription_id}`,
        ],
      },
      networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
      description:
        "Comprehensive test Network Manager with all child resources",
      tags: {
        ...this.systemTags(),
        testType: "comprehensive",
      },
    });

    // =============================================================================
    // TEST OPTION A: NETWORK GROUPS WITH CONVENIENCE METHODS
    // =============================================================================

    // Create production network group using convenience method
    const productionGroup = networkManager.addNetworkGroup("prod-group", {
      name: "ng-production",
      description: "Production virtual networks",
      memberType: "VirtualNetwork",
    });

    // Create staging network group using convenience method
    const stagingGroup = networkManager.addNetworkGroup("staging-group", {
      name: "ng-staging",
      description: "Staging virtual networks",
      memberType: "VirtualNetwork",
    });

    // =============================================================================
    // TEST: NETWORK GROUP WITH DIRECT INSTANTIATION
    // =============================================================================

    // Create hub network group using direct instantiation
    const hubGroup = new NetworkGroup(this, "hub-group", {
      name: "ng-hub",
      networkManagerId: networkManager.id,
      description: "Hub virtual network for spoke connectivity",
      memberType: "VirtualNetwork",
    });

    // =============================================================================
    // TEST NETWORK GROUP STATIC MEMBERS
    // =============================================================================

    // Add production VNet to production group
    new NetworkGroupStaticMember(this, "prod-member", {
      name: "member-prod-vnet",
      networkGroupId: productionGroup.id,
      resourceId: prodVnet.id,
    });

    // Add staging VNet to staging group
    new NetworkGroupStaticMember(this, "staging-member", {
      name: "member-staging-vnet",
      networkGroupId: stagingGroup.id,
      resourceId: stagingVnet.id,
    });

    // Add hub VNet to hub group
    new NetworkGroupStaticMember(this, "hub-member", {
      name: "member-hub-vnet",
      networkGroupId: hubGroup.id,
      resourceId: hubVnet.id,
    });

    // =============================================================================
    // TEST CONNECTIVITY CONFIGURATION: MESH TOPOLOGY
    // =============================================================================

    // Create mesh connectivity configuration using convenience method
    networkManager.addConnectivityConfiguration("mesh-config", {
      name: "conn-mesh-nonprod",
      connectivityTopology: "Mesh",
      description: "Mesh connectivity for non-production environments",
      appliesToGroups: [
        {
          networkGroupId: stagingGroup.id,
          useHubGateway: false,
          isGlobal: false,
        },
      ],
      deleteExistingPeering: true,
      isGlobal: false,
    });

    // =============================================================================
    // TEST CONNECTIVITY CONFIGURATION: HUB-SPOKE TOPOLOGY
    // =============================================================================

    // Create hub-spoke connectivity configuration using direct instantiation
    new ConnectivityConfiguration(this, "hub-spoke-config", {
      name: "conn-hub-spoke-prod",
      networkManagerId: networkManager.id,
      connectivityTopology: "HubAndSpoke",
      description: "Hub-spoke connectivity for production with gateway transit",
      appliesToGroups: [
        {
          networkGroupId: productionGroup.id,
          useHubGateway: true,
          isGlobal: false,
        },
      ],
      hubs: [
        {
          resourceId: hubVnet.id,
          resourceType: "Microsoft.Network/virtualNetworks",
        },
      ],
      deleteExistingPeering: true,
      isGlobal: false,
    });

    // =============================================================================
    // TEST SECURITY ADMIN CONFIGURATION
    // =============================================================================

    // Create security admin configuration using convenience method
    const securityConfig = networkManager.addSecurityAdminConfiguration(
      "security-config",
      {
        name: "sec-org-policies",
        description: "Organization-wide security policies",
        applyOnNetworkIntentPolicyBasedServices: ["None"],
      },
    );

    // =============================================================================
    // TEST SECURITY ADMIN RULE COLLECTIONS
    // =============================================================================

    // Create rule collection for blocking high-risk ports
    const blockHighRiskPorts = new SecurityAdminRuleCollection(
      this,
      "block-ports-collection",
      {
        name: "rc-block-high-risk-ports",
        securityAdminConfigurationId: securityConfig.id,
        description: "Block SSH, RDP, and other high-risk ports from internet",
        appliesToGroups: [
          { networkGroupId: productionGroup.id },
          { networkGroupId: stagingGroup.id },
        ],
      },
    );

    // Create rule collection for allowing monitoring traffic
    const allowMonitoring = new SecurityAdminRuleCollection(
      this,
      "allow-monitoring-collection",
      {
        name: "rc-allow-monitoring",
        securityAdminConfigurationId: securityConfig.id,
        description: "Always allow monitoring and security scanner traffic",
        appliesToGroups: [
          { networkGroupId: productionGroup.id },
          { networkGroupId: stagingGroup.id },
          { networkGroupId: hubGroup.id },
        ],
      },
    );

    // =============================================================================
    // TEST SECURITY ADMIN RULES: DENY ACTION
    // =============================================================================

    // Block SSH from internet
    new SecurityAdminRule(this, "block-ssh", {
      name: "rule-block-ssh",
      ruleCollectionId: blockHighRiskPorts.id,
      description: "Block SSH access from internet",
      priority: 100,
      action: "Deny",
      direction: "Inbound",
      protocol: "Tcp",
      destinationPortRanges: ["22"],
      sources: [
        {
          addressPrefix: "Internet",
          addressPrefixType: "ServiceTag",
        },
      ],
      destinations: [
        {
          addressPrefix: "*",
          addressPrefixType: "IPPrefix",
        },
      ],
    });

    // Block RDP from internet
    new SecurityAdminRule(this, "block-rdp", {
      name: "rule-block-rdp",
      ruleCollectionId: blockHighRiskPorts.id,
      description: "Block RDP access from internet",
      priority: 110,
      action: "Deny",
      direction: "Inbound",
      protocol: "Tcp",
      destinationPortRanges: ["3389"],
      sources: [
        {
          addressPrefix: "Internet",
          addressPrefixType: "ServiceTag",
        },
      ],
      destinations: [
        {
          addressPrefix: "*",
          addressPrefixType: "IPPrefix",
        },
      ],
    });

    // =============================================================================
    // TEST SECURITY ADMIN RULES: ALWAYSALLOW ACTION
    // =============================================================================

    // Always allow monitoring traffic from management subnet
    new SecurityAdminRule(this, "always-allow-monitoring", {
      name: "rule-always-allow-monitoring",
      ruleCollectionId: allowMonitoring.id,
      description: "Always allow monitoring traffic from management network",
      priority: 50,
      action: "AlwaysAllow",
      direction: "Inbound",
      protocol: "Any",
      sourcePortRanges: ["*"],
      destinationPortRanges: ["*"],
      sources: [
        {
          addressPrefix: "10.255.0.0/24",
          addressPrefixType: "IPPrefix",
        },
      ],
      destinations: [
        {
          addressPrefix: "*",
          addressPrefixType: "IPPrefix",
        },
      ],
    });

    // =============================================================================
    // TEST SECURITY ADMIN RULES: ALLOW ACTION
    // =============================================================================

    // Allow HTTPS from anywhere (NSG can still deny if needed)
    new SecurityAdminRule(this, "allow-https", {
      name: "rule-allow-https",
      ruleCollectionId: allowMonitoring.id,
      description: "Allow HTTPS traffic (NSG can still override)",
      priority: 200,
      action: "Allow",
      direction: "Inbound",
      protocol: "Tcp",
      destinationPortRanges: ["443"],
      sources: [
        {
          addressPrefix: "*",
          addressPrefixType: "IPPrefix",
        },
      ],
      destinations: [
        {
          addressPrefix: "*",
          addressPrefixType: "IPPrefix",
        },
      ],
    });
  }
}

describe("Virtual Network Manager Comprehensive Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup all AVNM resources including child constructs", () => {
    const app = Testing.app();
    const stack = new VirtualNetworkManagerComprehensiveStack(
      app,
      "test-vnm-comprehensive",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy all resources (VNM, VNets, NetworkGroups,
    //    StaticMembers, ConnectivityConfigs, SecurityAdminConfigs, RuleCollections, Rules)
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup all resources
    //
    // Note: AVNM resources can take longer to deploy than typical resources,
    // especially when creating connectivity configurations and security rules.
    // The 15-minute timeout should be sufficient, but may need adjustment for
    // slower Azure regions or during high-load periods.
    TerraformApplyCheckAndDestroy(synthesized);
  }, 900000); // 15 minute timeout for comprehensive AVNM deployment and cleanup
});
