/**
 * Integration test for Azure Public IP Address
 *
 * This test demonstrates basic usage of the PublicIPAddress construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { TerraformApplyCheckAndDestroy } from "../../testing";
import { PublicIPAddress } from "../lib/public-ip-address";

/**
 * Example stack demonstrating Public IP Address usage
 */
class PublicIPAddressExampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: "publicip-example-rg",
      location: "eastus",
      tags: {
        environment: "example",
        purpose: "integration-test",
      },
    });

    // Example 1: Basic Standard Static Public IP
    new PublicIPAddress(this, "basic-public-ip", {
      name: "pip-basic-example",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: {
        name: "Standard",
      },
      publicIPAllocationMethod: "Static",
      tags: {
        example: "basic",
      },
    });

    // Example 2: Public IP with specific version
    new PublicIPAddress(this, "versioned-public-ip", {
      name: "pip-versioned-example",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: {
        name: "Standard",
      },
      publicIPAllocationMethod: "Static",
      apiVersion: "2024-07-01",
      tags: {
        example: "versioned",
      },
    });
  }
}

describe("Public IP Address Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup public IP address resources", () => {
    const app = Testing.app();
    const stack = new PublicIPAddressExampleStack(
      app,
      "test-public-ip-address",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 600000); // 10 minute timeout for deployment and cleanup
});
