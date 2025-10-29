/**
 * Integration test for Azure Resource Group
 *
 * This test demonstrates basic usage of the ResourceGroup construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { TerraformApplyCheckAndDestroy } from "../../testing";
import { ResourceGroup } from "../lib/resource-group";

/**
 * Example stack demonstrating Resource Group usage
 */
class ResourceGroupExampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Example 1: Basic resource group
    new ResourceGroup(this, "basic-rg", {
      name: "basic-rg-example",
      location: "eastus",
      tags: {
        environment: "example",
        purpose: "integration-test",
      },
    });

    // Example 2: Resource group with specific version
    new ResourceGroup(this, "versioned-rg", {
      name: "versioned-rg-example",
      location: "westus",
      apiVersion: "2024-11-01",
      tags: {
        example: "versioned",
        tier: "production",
      },
    });
  }
}

describe("Resource Group Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup resource group resources", () => {
    const app = Testing.app();
    const stack = new ResourceGroupExampleStack(app, "test-resource-group");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 600000); // 10 minute timeout for deployment and cleanup
});
