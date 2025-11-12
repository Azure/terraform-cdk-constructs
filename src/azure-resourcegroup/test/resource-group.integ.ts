/**
 * Integration test for Azure Resource Group
 *
 * This test demonstrates basic usage of the ResourceGroup construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { ResourceGroup } from "../lib/resource-group";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("resource-group-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Resource Group usage
 */
class ResourceGroupExampleStack extends BaseTestStack {
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

    // Generate unique names for resource groups
    const basicRgName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "basic",
    );
    const versionedRgName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "versioned",
    );

    // Example 1: Basic resource group
    new ResourceGroup(this, "basic-rg", {
      name: basicRgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });

    // Example 2: Resource group with specific version
    new ResourceGroup(this, "versioned-rg", {
      name: versionedRgName,
      location: "westus",
      apiVersion: "2024-11-01",
      tags: {
        ...this.systemTags(),
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
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
