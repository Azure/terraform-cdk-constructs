/**
 * Integration test for Azure Storage Account
 *
 * This test demonstrates basic usage of the StorageAccount construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import {
  TerraformApplyCheckAndDestroy,
  cleanupCdkTfOutDirs,
} from "../../testing";
import { StorageAccount } from "../lib/storage-account";

/**
 * Example stack demonstrating Storage Account usage
 */
class StorageAccountExampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: "storage-example-rg",
      location: "eastus",
      tags: {
        environment: "example",
        purpose: "integration-test",
      },
    });

    // Example 1: Basic storage account
    new StorageAccount(this, "basic-storage", {
      name: "basicstorageexample",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Standard_LRS" },
      tags: {
        example: "basic",
      },
    });

    // Example 2: Storage account with specific version
    new StorageAccount(this, "versioned-storage", {
      name: "versionedstorageex",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Standard_GRS" },
      apiVersion: "2023-05-01",
      tags: {
        example: "versioned",
      },
    });
  }
}

describe("Storage Account Integration Test", () => {
  afterAll(() => {
    cleanupCdkTfOutDirs();
  });

  it("should deploy, validate idempotency, and cleanup storage account resources", () => {
    const app = Testing.app();
    const stack = new StorageAccountExampleStack(app, "test-storage-account");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 600000); // 10 minute timeout for deployment and cleanup
});
