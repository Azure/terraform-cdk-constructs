/**
 * Integration test for Azure Network Watcher
 *
 * This test demonstrates basic usage of the NetworkWatcher construct
 * and validates deployment, idempotency, and cleanup.
 *
 * IMPORTANT: Azure only allows one Network Watcher per subscription per region.
 * If a Network Watcher already exists in the test region, this test will fail.
 *
 * Run with: npm run integration:nostream
 */

import { Testing, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { TerraformApplyCheckAndDestroy } from "../../testing";
import { NetworkWatcher } from "../lib/network-watcher";

/**
 * Example stack demonstrating Network Watcher usage
 *
 * Note: This example creates a dedicated resource group for the Network Watcher.
 * In practice, Azure often uses a resource group named "NetworkWatcherRG" for
 * automatically provisioned Network Watchers.
 */
class NetworkWatcherExampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Create a resource group for Network Watcher
    // Note: Azure typically uses NetworkWatcherRG for auto-provisioned Network Watchers
    // Using northeurope to avoid conflict with existing Network Watchers
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: "nw-example-rg",
      location: "northeurope",
      tags: {
        environment: "example",
        purpose: "integration-test",
      },
    });

    // Example 1: Basic Network Watcher
    // Note: Only one Network Watcher per region per subscription is allowed
    new NetworkWatcher(this, "basic-network-watcher", {
      name: "nw-basic-example",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      tags: {
        example: "basic",
      },
    });

    // Example 2: Network Watcher with specific version
    // Using a different construct ID but same region (this is for demonstration only -
    // in practice, you should only have one Network Watcher per region)
    // This example shows version pinning but would fail if deployed alongside Example 1
    // since both use the same region.
    // Uncomment for testing version pinning in a different region:
    /*
    new NetworkWatcher(this, "versioned-network-watcher", {
      name: "nw-versioned-example",
      location: "westus2",  // Different region
      resourceGroupId: resourceGroup.id,
      apiVersion: "2024-01-01",
      tags: {
        example: "versioned",
      },
    });
    */
  }
}

describe("Network Watcher Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup Network Watcher resources", () => {
    const app = Testing.app();
    const stack = new NetworkWatcherExampleStack(app, "test-network-watcher");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 600000); // 10 minute timeout for deployment and cleanup
});
