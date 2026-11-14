/**
 * Integration tests for Azure Function App
 *
 * Demonstrates two deployment patterns:
 * 1. Flex Consumption (FC1) plan with deployCodeToFlexConsumption
 * 2. Traditional Consumption plan with deployCodeFromBlob
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktn";
import { Construct } from "constructs";
import "cdktn/lib/testing/adapters/jest";
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
 * Scenario 1: Flex Consumption Plan with Blob Storage Deployment
 *
 * This stack demonstrates deploying a Function App to a Flex Consumption (FC1) plan
 * using the deployCodeToFlexConsumption() method, which properly populates
 * functionAppConfig.deployment.storage as per Azure documentation.
 *
 * Key Features:
 * - Uses Flex Consumption (FC1) plan - no VM quota required
 * - Deploys code via deployCodeToFlexConsumption()
 * - Populates functionAppConfig.deployment.storage.value
 * - Uses system-assigned managed identity for storage access
 * - Demonstrates proper Flex Consumption deployment pattern
 */
class FlexConsumptionFunctionAppStack extends BaseTestStack {
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
      "flex",
    );

    // Create a resource group (eastus2 supports Flex Consumption)
    const resourceGroup = new ResourceGroup(this, "rg", {
      name: rgName,
      location: "eastus2",
      tags: {
        ...this.systemTags(),
      },
    });

    // Create a storage account for Function App deployment artifacts
    const storageAccountName = this.generateResourceName(
      "Microsoft.Storage/storageAccounts",
      "flex",
    );

    const storageAccount = new StorageAccount(this, "storage", {
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
    const planName = this.generateResourceName(
      "Microsoft.Web/serverfarms",
      "flex",
    );

    const flexPlan = new Resource(this, "flex-plan", {
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
          reserved: true, // Linux
        },
      },
    });

    // Generate unique function app name
    const funcAppName = this.generateResourceName(
      "Microsoft.Web/sites",
      "flex",
    );

    // Create Flex Consumption Function App (Node.js 20)
    const functionApp = new FunctionApp(this, "flex-func", {
      name: funcAppName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      serverFarmId: flexPlan.id,
      kind: "functionapp,linux",
      httpsOnly: true,
      siteConfig: {
        appSettings: [
          {
            name: "FUNCTIONS_WORKER_RUNTIME",
            value: "node",
          },
          {
            name: "FUNCTIONS_EXTENSION_VERSION",
            value: "~4",
          },
        ],
        linuxFxVersion: "NODE|20",
      },
      // Flex Consumption requires functionAppConfig
      functionAppConfig: {
        deployment: {
          storage: {
            type: "blobContainer",
            value: "", // Populated by deployCodeToFlexConsumption
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
        pattern: "flex-consumption-blob-deployment",
      },
    });

    // Deploy function code using deployCodeToFlexConsumption
    // This populates functionAppConfig.deployment.storage.value
    functionApp.deployCodeToFlexConsumption(
      "./src/azure-functionapp/test/fixtures/sample-function",
      storageAccount.id,
      storageAccountName,
      {
        containerName: "deployments",
        useManagedIdentity: true,
        exclude: ["node_modules", "*.test.ts", "*.spec.ts"],
      },
    );

    // Note: In production, also create RBAC role assignment:
    // Grant "Storage Blob Data Reader" to Function App's system-assigned identity
  }
}

/**
 * Scenario 2: Traditional Consumption Plan with Zip Deployment via Blob
 *
 * This stack demonstrates deploying a Function App to a traditional Consumption plan
 * using the deployCodeFromBlob() method, which uses WEBSITE_RUN_FROM_PACKAGE.
 *
 * Key Features:
 * - Uses traditional Consumption (Y1) plan
 * - Deploys code via deployCodeFromBlob()
 * - Sets WEBSITE_RUN_FROM_PACKAGE app setting
 * - Uses system-assigned managed identity for storage access
 * - Demonstrates traditional deployment pattern
 */
class TraditionalConsumptionFunctionAppStack extends BaseTestStack {
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
      "trad",
    );

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
      },
    });

    // Create a storage account for Function App
    const storageAccountName = this.generateResourceName(
      "Microsoft.Storage/storageAccounts",
      "trad",
    );

    const storageAccount = new StorageAccount(this, "storage", {
      name: storageAccountName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      kind: "StorageV2",
      sku: { name: "Standard_LRS" },
      tags: {
        ...this.systemTags(),
      },
    });

    // Create a traditional Consumption (Y1) App Service Plan
    const planName = this.generateResourceName(
      "Microsoft.Web/serverfarms",
      "trad",
    );

    const consumptionPlan = new Resource(this, "consumption-plan", {
      type: "Microsoft.Web/serverfarms@2024-04-01",
      parentId: resourceGroup.id,
      name: planName,
      location: "eastus",
      body: {
        kind: "functionapp",
        sku: {
          name: "Y1",
          tier: "Dynamic",
        },
        properties: {
          reserved: true, // Linux
        },
      },
    });

    // Generate unique function app name
    const funcAppName = this.generateResourceName(
      "Microsoft.Web/sites",
      "trad",
    );

    // Create traditional Consumption Function App (Python 3.11)
    const functionApp = new FunctionApp(this, "consumption-func", {
      name: funcAppName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      serverFarmId: consumptionPlan.id,
      kind: "functionapp,linux",
      httpsOnly: true,
      identity: {
        type: "SystemAssigned",
      },
      siteConfig: {
        appSettings: [
          {
            name: "FUNCTIONS_WORKER_RUNTIME",
            value: "python",
          },
          {
            name: "FUNCTIONS_EXTENSION_VERSION",
            value: "~4",
          },
          {
            name: "AzureWebJobsStorage",
            value: `DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccount.primaryBlobEndpoint};EndpointSuffix=core.windows.net`,
          },
        ],
        linuxFxVersion: "PYTHON|3.11",
      },
      tags: {
        ...this.systemTags(),
        pattern: "traditional-consumption-zip-deployment",
      },
    });

    // Deploy function code using deployCodeFromBlob
    // This sets WEBSITE_RUN_FROM_PACKAGE app setting
    functionApp.deployCodeFromBlob(
      "./src/azure-functionapp/test/fixtures/sample-function",
      storageAccount.id,
      storageAccountName,
      {
        containerName: "function-packages",
        useManagedIdentity: true,
        exclude: ["__pycache__", "*.pyc", "tests"],
      },
    );

    // Note: In production, also create RBAC role assignment:
    // Grant "Storage Blob Data Reader" to Function App's system-assigned identity
  }
}

describe("Function App Integration Tests", () => {
  describe("Scenario 1: Flex Consumption with Blob Storage Deployment", () => {
    it("should deploy Flex Consumption Function App with deployCodeToFlexConsumption", () => {
      const app = Testing.app();
      const stack = new FlexConsumptionFunctionAppStack(
        app,
        "test-flex-consumption",
      );
      const synthesized = Testing.fullSynth(stack);

      // This will:
      // 1. Run terraform apply to deploy resources
      // 2. Run terraform plan to check idempotency (no changes expected)
      // 3. Run terraform destroy to cleanup resources
      TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
    }, 600000); // 10 minute timeout
  });

  describe("Scenario 2: Traditional Consumption with Zip Deployment", () => {
    it.skip("should deploy traditional Consumption Function App with deployCodeFromBlob", () => {
      const app = Testing.app();
      const stack = new TraditionalConsumptionFunctionAppStack(
        app,
        "test-traditional-consumption",
      );
      const synthesized = Testing.fullSynth(stack);

      // This will:
      // 1. Run terraform apply to deploy resources
      // 2. Run terraform plan to check idempotency (no changes expected)
      // 3. Run terraform destroy to cleanup resources
      TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
    }, 600000); // 10 minute timeout
  });
});
