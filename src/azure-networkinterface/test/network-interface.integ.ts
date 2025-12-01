/**
 * Integration test for Azure Network Interface
 *
 * This test demonstrates basic usage of the NetworkInterface construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { Subnet } from "../../azure-subnet";
import { VirtualNetwork } from "../../azure-virtualnetwork";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { NetworkInterface } from "../lib/network-interface";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("network-interface-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Network Interface usage
 */
class NetworkInterfaceExampleStack extends BaseTestStack {
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
      "nic",
    );

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
      },
    });

    // Create a virtual network
    const vnet = new VirtualNetwork(this, "example-vnet", {
      name: "vnet-example",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
    });

    // Create a subnet - use virtualNetworkId to create explicit Terraform dependency
    const subnet = new Subnet(this, "example-subnet", {
      name: "subnet-example",
      resourceGroupId: resourceGroup.id,
      virtualNetworkName: "vnet-example",
      virtualNetworkId: vnet.id,
      addressPrefix: "10.0.1.0/24",
    });

    // Example 1: Basic network interface
    new NetworkInterface(this, "basic-nic", {
      name: "nic-basic-example",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      ipConfigurations: [
        {
          name: "ipconfig1",
          subnet: { id: subnet.id },
          privateIPAllocationMethod: "Dynamic",
          primary: true,
        },
      ],
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });

    // Example 2: Network interface with specific version
    new NetworkInterface(this, "versioned-nic", {
      name: "nic-versioned-example",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      ipConfigurations: [
        {
          name: "ipconfig1",
          subnet: { id: subnet.id },
          privateIPAllocationMethod: "Dynamic",
          primary: true,
        },
      ],
      apiVersion: "2024-07-01",
      tags: {
        ...this.systemTags(),
        example: "versioned",
      },
    });
  }
}

describe("Network Interface Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup network interface resources", () => {
    const app = Testing.app();
    const stack = new NetworkInterfaceExampleStack(
      app,
      "test-network-interface",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 600000); // 10 minute timeout for deployment and cleanup
});
