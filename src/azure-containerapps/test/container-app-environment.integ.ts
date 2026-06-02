/**
 * Integration test for Azure Container App Environment
 *
 * This test demonstrates usage of the ContainerAppEnvironment construct
 * with Log Analytics integration and validates deployment, idempotency,
 * and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup/lib/resource-group";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { ContainerAppEnvironment } from "../lib/container-app-environment";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("containerenv-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Container App Environment usage
 */
class ContainerAppEnvironmentExampleStack extends BaseTestStack {
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
      "containerenv",
    );
    const envName = this.generateResourceName(
      "Microsoft.App/managedEnvironments",
      "containerenv",
    );

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "test-rg", {
      name: resourceGroupName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
        purpose: "container-app-env-testing",
      },
    });

    // Create Container App Environment with basic configuration
    new ContainerAppEnvironment(this, "container-env", {
      name: envName,
      location: resourceGroup.location,
      resourceGroupId: resourceGroup.id,
      apiVersion: "2025-02-02-preview",
      workloadProfiles: [
        {
          name: "Consumption",
          workloadProfileType: "Consumption",
        },
      ],
      tags: {
        ...this.systemTags(),
        example: "complete",
        environment: "test",
        purpose: "container-app-hosting",
      },
    });
  }
}

describe("ContainerAppEnvironment Integration Test", () => {
  it("should deploy Container App Environment, validate idempotency, and cleanup", () => {
    const app = Testing.app();
    const stack = new ContainerAppEnvironmentExampleStack(
      app,
      "test-containerenv",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
