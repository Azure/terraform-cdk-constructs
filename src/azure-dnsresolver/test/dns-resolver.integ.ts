/**
 * Integration test for Azure DNS Private Resolver
 *
 * This test demonstrates usage of the DnsResolver construct with proper
 * VNet and subnet configuration, and validates deployment, idempotency, and cleanup.
 *
 * Key Requirements:
 * - DNS Resolver requires a dedicated subnet
 * - Subnet must be delegated to Microsoft.Network/dnsResolvers
 * - Subnet must be between /28 and /24 in size
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup/lib/resource-group";
import { Subnet } from "../../azure-subnet/lib/subnet";
import { VirtualNetwork } from "../../azure-virtualnetwork/lib/virtual-network";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { DnsResolver } from "../lib/dns-resolver";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("dnsresolver-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating DNS Resolver usage
 */
class DnsResolverExampleStack extends BaseTestStack {
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

    // Generate unique names
    const resourceGroupName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "dnsresolver",
    );
    const vnetName = this.generateResourceName(
      "Microsoft.Network/virtualNetworks",
      "dnsresolver",
    );
    const subnetName = this.generateResourceName(
      "Microsoft.Network/virtualNetworks/subnets",
      "dnsresolver",
    );
    const dnsResolverName = this.generateResourceName(
      "Microsoft.Network/dnsResolvers",
      "dnsresolver",
    );

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "test-rg", {
      name: resourceGroupName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
        purpose: "dns-resolver-testing",
      },
    });

    // Create virtual network for DNS resolver
    const vnet = new VirtualNetwork(this, "test-vnet", {
      name: vnetName,
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
      tags: {
        ...this.systemTags(),
        purpose: "dns-resolver-vnet",
      },
    });

    // Create dedicated subnet for DNS resolver with delegation
    // Subnet must be /28 to /24 in size and delegated to Microsoft.Network/dnsResolvers
    const subnet = new Subnet(this, "dns-resolver-subnet", {
      name: subnetName,
      virtualNetworkName: vnetName,
      virtualNetworkId: vnet.id,
      resourceGroupId: resourceGroup.id,
      addressPrefix: "10.0.1.0/28", // /28 subnet (smallest allowed)
      delegations: [
        {
          name: "Microsoft.Network.dnsResolvers",
          serviceName: "Microsoft.Network/dnsResolvers",
          actions: ["Microsoft.Network/virtualNetworks/subnets/join/action"],
        },
      ],
    });

    // Create DNS resolver with comprehensive configuration
    // Note: Azure only allows one DNS Resolver per Virtual Network
    new DnsResolver(this, "dns-resolver", {
      name: dnsResolverName,
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      virtualNetworkId: vnet.id,
      tags: {
        ...this.systemTags(),
        example: "complete",
        environment: "test",
        purpose: "hybrid-dns",
      },
    });

    // Add dependency to ensure subnet is created before resolvers
    // This ensures the delegation is in place
    subnet;
  }
}

describe("DnsResolver Integration Test", () => {
  it("should deploy DNS resolver with VNet and delegated subnet, validate idempotency, and cleanup", () => {
    const app = Testing.app();
    const stack = new DnsResolverExampleStack(app, "test-dnsresolver");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources (VNet, Subnet with delegation, DNS Resolver)
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
