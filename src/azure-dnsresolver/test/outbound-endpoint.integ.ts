/**
 * Integration test for Azure DNS Resolver Outbound Endpoint
 *
 * This test demonstrates basic usage of the DnsResolverOutboundEndpoint construct
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
import { DnsResolverOutboundEndpoint } from "../lib/outbound-endpoint";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("dnsresolveroutbound-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating DNS Resolver Outbound Endpoint usage
 */
class DnsResolverOutboundEndpointExampleStack extends BaseTestStack {
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
      "dnsresout",
    );
    const vnetName = this.generateResourceName(
      "Microsoft.Network/virtualNetworks",
      "dnsresout",
    );
    const dnsResolverName = this.generateResourceName(
      "Microsoft.Network/dnsResolvers",
      "resout",
    );

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "test-rg", {
      name: resourceGroupName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
        purpose: "dns-resolver-outbound-endpoint-testing",
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
    const outboundSubnet = new Subnet(this, "outbound-subnet", {
      name: "outbound-subnet",
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
        purpose: "dns-resolver-outbound",
      },
    });

    // Create another subnet for second endpoint
    const outbound2Subnet = new Subnet(this, "outbound2-subnet", {
      name: "outbound2-subnet",
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
        purpose: "dns-resolver-outbound-2",
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
        purpose: "outbound-endpoint-testing",
      },
    });

    // Example 1: Basic outbound endpoint
    new DnsResolverOutboundEndpoint(this, "basic-outbound", {
      name: "basic-outbound-endpoint",
      location: "eastus",
      dnsResolverId: dnsResolver.id,
      subnetId: outboundSubnet.id,
      tags: {
        ...this.systemTags(),
        example: "basic-outbound",
      },
    });

    // Example 2: Outbound endpoint with tags
    new DnsResolverOutboundEndpoint(this, "tagged-outbound", {
      name: "tagged-outbound-endpoint",
      location: "eastus",
      dnsResolverId: dnsResolver.id,
      subnetId: outbound2Subnet.id,
      tags: {
        ...this.systemTags(),
        example: "tagged-outbound",
        purpose: "conditional-forwarding",
      },
    });
  }
}

describe("DnsResolverOutboundEndpoint Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup resources", () => {
    const app = Testing.app();
    const stack = new DnsResolverOutboundEndpointExampleStack(
      app,
      "test-dnsresolveroutbound",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources (including parent-child relationships)
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources (child resources cleanup before parent)
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
