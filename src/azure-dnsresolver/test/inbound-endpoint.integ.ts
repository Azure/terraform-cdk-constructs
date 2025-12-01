/**
 * Integration test for Azure DNS Resolver Inbound Endpoint
 *
 * This test demonstrates basic usage of the DnsResolverInboundEndpoint construct
 * and validates deployment, idempotency, and cleanup for child resources.
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
import { DnsResolverInboundEndpoint } from "../lib/inbound-endpoint";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("dnsresolverinbound-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating DNS Resolver Inbound Endpoint usage
 */
class DnsResolverInboundEndpointExampleStack extends BaseTestStack {
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
      "dnsresin",
    );
    const vnetName = this.generateResourceName(
      "Microsoft.Network/virtualNetworks",
      "dnsresin",
    );
    const dnsResolverName = this.generateResourceName(
      "Microsoft.Network/dnsResolvers",
      "resin",
    );

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "test-rg", {
      name: resourceGroupName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
        purpose: "dns-resolver-inbound-endpoint-testing",
      },
    });

    // Create Virtual Network
    const vnet = new VirtualNetwork(this, "test-vnet", {
      name: vnetName,
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
      tags: {
        ...this.systemTags(),
        purpose: "dns-resolver-testing",
      },
    });

    // Create subnet for DNS Resolver with delegation
    const inboundSubnet = new Subnet(this, "inbound-subnet", {
      name: "inbound-subnet",
      resourceGroupId: resourceGroup.id,
      virtualNetworkName: vnetName,
      virtualNetworkId: vnet.id,
      addressPrefix: "10.0.1.0/28",
      delegations: [
        {
          name: "Microsoft.Network.dnsResolvers",
          serviceName: "Microsoft.Network/dnsResolvers",
        },
      ],
      tags: {
        ...this.systemTags(),
        purpose: "dns-resolver-inbound",
      },
    });

    // Create another subnet for static IP example
    const staticSubnet = new Subnet(this, "static-subnet", {
      name: "static-subnet",
      resourceGroupId: resourceGroup.id,
      virtualNetworkName: vnetName,
      virtualNetworkId: vnet.id,
      addressPrefix: "10.0.2.0/28",
      delegations: [
        {
          name: "Microsoft.Network.dnsResolvers",
          serviceName: "Microsoft.Network/dnsResolvers",
        },
      ],
      tags: {
        ...this.systemTags(),
        purpose: "dns-resolver-inbound-static",
      },
    });

    // Create DNS Resolver (parent resource)
    const dnsResolver = new DnsResolver(this, "dns-resolver", {
      name: dnsResolverName,
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      virtualNetworkId: vnet.id,
      tags: {
        ...this.systemTags(),
        purpose: "inbound-endpoint-testing",
      },
    });

    // Example 1: Basic inbound endpoint with dynamic IP
    new DnsResolverInboundEndpoint(this, "basic-inbound", {
      name: "basic-inbound-endpoint",
      location: "eastus",
      dnsResolverId: dnsResolver.id,
      subnetId: inboundSubnet.id,
      tags: {
        ...this.systemTags(),
        example: "basic-dynamic-ip",
      },
    });

    // Example 2: Inbound endpoint with static IP address
    new DnsResolverInboundEndpoint(this, "static-inbound", {
      name: "static-inbound-endpoint",
      location: "eastus",
      dnsResolverId: dnsResolver.id,
      subnetId: staticSubnet.id,
      privateIpAddress: "10.0.2.4",
      privateIpAllocationMethod: "Static",
      tags: {
        ...this.systemTags(),
        example: "static-ip",
        ipAddress: "10.0.2.4",
      },
    });
  }
}

describe("DnsResolverInboundEndpoint Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup resources", () => {
    const app = Testing.app();
    const stack = new DnsResolverInboundEndpointExampleStack(
      app,
      "test-dnsresolverinbound",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources (including parent-child relationships)
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources (child resources cleanup before parent)
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
