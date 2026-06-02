/**
 * Integration test for Azure Function App
 *
 * This test demonstrates usage of the FunctionApp construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Uses Flex Consumption (FC1) plan which does not require
 * traditional App Service VM quota.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { StorageAccount } from "../../azure-storageaccount";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { Resource } from "../../core-azure/lib/azapi/providers-azapi/resource";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { FunctionApp } from "../lib/function-app";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("function-app-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Function App usage with Flex Consumption plan
 */
class FunctionAppExampleStack extends BaseTestStack {
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
      "func",
    );

    // Create a resource group (eastus2 supports Flex Consumption)
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: rgName,
      location: "eastus2",
      tags: {
        ...this.systemTags(),
      },
    });

    // Create a storage account for Function App deployment artifacts
    const storageAccountName = this.generateResourceName(
      "Microsoft.Storage/storageAccounts",
      "func",
    );

    const storageAccount = new StorageAccount(this, "func-storage", {
      name: storageAccountName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      kind: "StorageV2",
      sku: { name: "Standard_LRS" },
      tags: {
        ...this.systemTags(),
      },
    });

    // Create an App Service Plan using Flex Consumption (FC1)
    // FC1/FlexConsumption does not require traditional App Service VM quota
    const planName = this.generateResourceName(
      "Microsoft.Web/serverfarms",
      "func",
    );

    const appServicePlan = new Resource(this, "app-service-plan", {
      type: "Microsoft.Web/serverfarms@2024-04-01",
      parentId: resourceGroup.id,
      name: planName,
      location: "eastus2",
      body: {
        kind: "functionapp",
        sku: {
          name: "FC1",
          tier: "FlexConsumption",
        },
        properties: {
          reserved: true,
        },
      },
    });

    // Generate unique function app name
    const funcAppName = this.generateResourceName(
      "Microsoft.Web/sites",
      "basic",
    );

    // Linux Function App (Node.js 20) on Flex Consumption plan
    new FunctionApp(this, "basic-func", {
      name: funcAppName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      serverFarmId: appServicePlan.id,
      kind: "functionapp,linux",
      httpsOnly: true,
      siteConfig: {},
      functionAppConfig: {
        deployment: {
          storage: {
            type: "blobContainer",
            value: `${storageAccount.primaryBlobEndpoint}deployments`,
            authentication: {
              type: "SystemAssignedIdentity",
            },
          },
        },
        runtime: {
          name: "node",
          version: "20",
        },
        scaleAndConcurrency: {
          maximumInstanceCount: 40,
          instanceMemoryMB: 2048,
        },
      },
      identity: {
        type: "SystemAssigned",
      },
      tags: {
        ...this.systemTags(),
        example: "flex-consumption-function-app",
      },
    });
  }
}

describe("Function App Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup function app resources", () => {
    const app = Testing.app();
    const stack = new FunctionAppExampleStack(app, "test-function-app");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
