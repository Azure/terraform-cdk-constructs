import { Testing } from "cdktn";
import { Construct } from "constructs";
import "cdktn/lib/testing/adapters/jest";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { ResourceGroup } from "../../azure-resourcegroup";
import { UserAssignedIdentity } from "../lib/user-assigned-identity";

const testMetadata = new TestRunMetadata("user-assigned-identity-integration", {
  maxAgeHours: 4,
});

class UserAssignedIdentityExampleStack extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      testRunOptions: {
        maxAgeHours: testMetadata.maxAgeHours,
        autoCleanup: testMetadata.autoCleanup,
        cleanupPolicy: testMetadata.cleanupPolicy,
      },
    });

    new AzapiProvider(this, "azapi", {});

    const resourceGroupName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "identityrg",
    );
    const basicIdentityName = this.generateResourceName(
      "Microsoft.ManagedIdentity/userAssignedIdentities",
      "basic",
    );
    const versionedIdentityName = this.generateResourceName(
      "Microsoft.ManagedIdentity/userAssignedIdentities",
      "versioned",
    );

    const resourceGroup = new ResourceGroup(this, "identity-rg", {
      name: resourceGroupName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
        example: "identity-rg",
      },
    });

    new UserAssignedIdentity(this, "basic-identity", {
      name: basicIdentityName,
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });

    new UserAssignedIdentity(this, "versioned-identity", {
      name: versionedIdentityName,
      location: "eastus2",
      resourceGroupId: resourceGroup.id,
      apiVersion: "2023-01-31",
      tags: {
        ...this.systemTags(),
        example: "versioned",
        tier: "production",
      },
    });
  }
}

describe("User Assigned Identity Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup user assigned identity resources", () => {
    const app = Testing.app();
    const stack = new UserAssignedIdentityExampleStack(
      app,
      "test-user-assigned-identity",
    );
    const synthesized = Testing.fullSynth(stack);

    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000);
});
