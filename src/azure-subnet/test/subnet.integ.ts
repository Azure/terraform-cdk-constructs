/**
 * Integration test for Azure Subnet construct
 *
 * This test demonstrates basic usage of the Subnet construct
 * and validates deployment, idempotency, and cleanup.
 * It also demonstrates the parent-child relationship between
 * Virtual Network and Subnet.
 *
 * Run with: npm run integration:nostream
 */

import { Testing, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { VirtualNetwork } from "../../azure-virtualnetwork";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { TerraformApplyCheckAndDestroy } from "../../testing";
import { Subnet } from "../lib/subnet";

/**
 * Example stack demonstrating Subnet usage with parent Virtual Network
 */
class SubnetExampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "rg", {
      name: "rg-subnet-example",
      location: "eastus",
      tags: {
        environment: "example",
        purpose: "integration-test",
      },
    });

    // Create virtual network (parent resource)
    const vnet = new VirtualNetwork(this, "vnet", {
      name: "vnet-subnet-example",
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
      tags: {
        environment: "example",
      },
    });

    // Subnet with service endpoints and specific API version
    new Subnet(this, "subnet", {
      name: "subnet-example",
      virtualNetworkName: vnet.name,
      resourceGroupId: resourceGroup.id,
      apiVersion: "2024-07-01",
      addressPrefix: "10.0.1.0/24",
      serviceEndpoints: [
        {
          service: "Microsoft.Storage",
          locations: ["eastus"],
        },
      ],
      privateEndpointNetworkPolicies: "Disabled",
      // Pass vnet.id to create proper Terraform dependency
      virtualNetworkId: vnet.id,
    });
  }
}

describe("Subnet Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup subnet resources", () => {
    const app = Testing.app();
    const stack = new SubnetExampleStack(app, "test-subnet");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 600000); // 10 minute timeout for deployment and cleanup
});
