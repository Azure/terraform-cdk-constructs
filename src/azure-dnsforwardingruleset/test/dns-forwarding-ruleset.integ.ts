/**
 * Integration test for Azure DNS Forwarding Ruleset with child resources
 *
 * This test demonstrates basic usage of the DNS Forwarding Ruleset constructs
 * including one ForwardingRule and one VirtualNetworkLink.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { DnsResolver } from "../../azure-dnsresolver/lib/dns-resolver";
import { DnsResolverOutboundEndpoint } from "../../azure-dnsresolver/lib/outbound-endpoint";
import { ResourceGroup } from "../../azure-resourcegroup/lib/resource-group";
import { Subnet } from "../../azure-subnet/lib/subnet";
import { VirtualNetwork } from "../../azure-virtualnetwork/lib/virtual-network";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { DnsForwardingRuleset } from "../lib/dns-forwarding-ruleset";
import { ForwardingRule } from "../lib/forwarding-rule";
import { DnsForwardingRulesetVirtualNetworkLink } from "../lib/virtual-network-link";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("dnsforwardingruleset-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating DNS Forwarding Ruleset with child resources
 */
class DnsForwardingRulesetExampleStack extends BaseTestStack {
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
      "dnsfwd",
    );
    const vnetName = this.generateResourceName(
      "Microsoft.Network/virtualNetworks",
      "resolver",
    );
    const resolverName = this.generateResourceName(
      "Microsoft.Network/dnsResolvers",
      "resolver",
    );
    const rulesetName = this.generateResourceName(
      "Microsoft.Network/dnsForwardingRulesets",
      "ruleset",
    );

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "test-rg", {
      name: resourceGroupName,
      location: "eastus",
      tags: this.systemTags(),
    });

    // Create Virtual Network
    const vnet = new VirtualNetwork(this, "test-vnet", {
      name: vnetName,
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
      tags: this.systemTags(),
    });

    // Create subnet for Outbound Endpoint
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
    });

    // Create DNS Resolver
    const resolver = new DnsResolver(this, "dns-resolver", {
      name: resolverName,
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      virtualNetworkId: vnet.id,
      tags: this.systemTags(),
    });

    // Create Outbound Endpoint
    const outboundEndpoint = new DnsResolverOutboundEndpoint(
      this,
      "outbound-endpoint",
      {
        name: "outbound-ep",
        location: "eastus",
        dnsResolverId: resolver.id,
        subnetId: outboundSubnet.id,
        tags: this.systemTags(),
      },
    );

    // Create DNS Forwarding Ruleset
    const ruleset = new DnsForwardingRuleset(this, "ruleset", {
      name: rulesetName,
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      dnsResolverOutboundEndpointIds: [outboundEndpoint.id],
      tags: this.systemTags(),
    });

    // Create Forwarding Rule
    new ForwardingRule(this, "rule", {
      name: "contoso-rule",
      dnsForwardingRulesetId: ruleset.id,
      domainName: "contoso.com.",
      targetDnsServers: [
        { ipAddress: "10.0.10.4", port: 53 },
        { ipAddress: "10.0.10.5" },
      ],
      metadata: this.systemTags(),
    });

    // Create Virtual Network Link
    new DnsForwardingRulesetVirtualNetworkLink(this, "vnet-link", {
      name: "vnet-link",
      dnsForwardingRulesetId: ruleset.id,
      virtualNetworkId: vnet.id,
      metadata: this.systemTags(),
    });
  }
}

describe("DnsForwardingRuleset Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup resources", () => {
    const app = Testing.app();
    const stack = new DnsForwardingRulesetExampleStack(
      app,
      "test-dnsforwardingruleset",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy all resources
    // 2. Run terraform plan to check idempotency
    // 3. Run terraform destroy to cleanup all resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 900000); // 15 minute timeout
});
