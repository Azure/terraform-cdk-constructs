/**
 * Integration test for Azure Virtual Network
 *
 * This test demonstrates basic usage of the VirtualNetwork construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { VirtualNetwork } from "../lib/virtual-network";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("virtual-network-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Virtual Network usage
 */
class VirtualNetworkExampleStack extends BaseTestStack {
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
    const rgName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "vnet",
    );

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
      },
    });

    // Example 1: Basic virtual network
    new VirtualNetwork(this, "basic-vnet", {
      name: "vnet-basic-example",
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });

    // Example 2: Virtual network with custom DNS and specific version
    new VirtualNetwork(this, "advanced-vnet", {
      name: "vnet-advanced-example",
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      apiVersion: "2024-07-01",
      addressSpace: {
        addressPrefixes: ["10.1.0.0/16"],
      },
      dhcpOptions: {
        dnsServers: ["10.1.0.4", "10.1.0.5"],
      },
      tags: {
        ...this.systemTags(),
        example: "advanced",
        tier: "production",
      },
    });
  }
}

describe("Virtual Network Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup virtual network resources", () => {
    const app = Testing.app();
    const stack = new VirtualNetworkExampleStack(app, "test-virtual-network");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
