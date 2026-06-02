/**
 * Integration test for Azure Container Registry
 *
 * This test demonstrates usage of the ContainerRegistry construct
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
import { ContainerRegistry } from "../lib/container-registry";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("container-registry-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Container Registry usage
 */
class ContainerRegistryExampleStack extends BaseTestStack {
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
      "acr",
    );

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
      },
    });

    // Generate unique registry names (must be globally unique, alphanumeric only)
    const basicAcrName = this.generateResourceName(
      "Microsoft.ContainerRegistry/registries",
      "basic",
    );
    const standardAcrName = this.generateResourceName(
      "Microsoft.ContainerRegistry/registries",
      "std",
    );
    const premiumAcrName = this.generateResourceName(
      "Microsoft.ContainerRegistry/registries",
      "prem",
    );

    // Example 1: Basic Container Registry
    new ContainerRegistry(this, "basic-acr", {
      name: basicAcrName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Basic" },
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });

    // Example 2: Standard Container Registry with tags
    new ContainerRegistry(this, "standard-acr", {
      name: standardAcrName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Standard" },
      tags: {
        ...this.systemTags(),
        example: "standard",
      },
    });

    // Example 3: Premium Container Registry with retention policy
    new ContainerRegistry(this, "premium-acr", {
      name: premiumAcrName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Premium" },
      publicNetworkAccess: "Enabled",
      policies: {
        retentionPolicy: { days: 30, status: "enabled" },
      },
      tags: {
        ...this.systemTags(),
        example: "premium",
      },
    });
  }
}

describe("Container Registry Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup container registry resources", () => {
    const app = Testing.app();
    const stack = new ContainerRegistryExampleStack(
      app,
      "test-container-registry",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
