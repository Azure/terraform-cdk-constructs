import { Testing } from "cdktn";
import { Construct } from "constructs";
import "cdktn/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { StorageAccount } from "../../azure-storageaccount";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { StorageBlobContainer } from "../lib/storage-blob-container";

const testMetadata = new TestRunMetadata("storage-blob-container-integration", {
  maxAgeHours: 4,
});

class StorageBlobContainerExampleStack extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      testRunOptions: {
        maxAgeHours: testMetadata.maxAgeHours,
        autoCleanup: testMetadata.autoCleanup,
        cleanupPolicy: testMetadata.cleanupPolicy,
      },
    });

    new AzapiProvider(this, "azapi", {});

    const rgName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "blobcontainer",
    );
    const storageAccountName = this.generateResourceName(
      "Microsoft.Storage/storageAccounts",
      "blobcontainer",
    );

    const resourceGroup = new ResourceGroup(this, "rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
      },
    });

    const storageAccount = new StorageAccount(this, "storage-account", {
      name: storageAccountName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Standard_LRS" },
      allowBlobPublicAccess: false,
      tags: {
        ...this.systemTags(),
      },
    });

    new StorageBlobContainer(this, "container", {
      name: "containerexample",
      storageAccountId: storageAccount.id,
      metadata: {
        example: "integration",
      },
    });
  }
}

describe("Storage Blob Container Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup storage blob container resources", () => {
    const app = Testing.app();
    const stack = new StorageBlobContainerExampleStack(
      app,
      "test-storage-blob-container",
    );
    const synthesized = Testing.fullSynth(stack);

    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000);
});
