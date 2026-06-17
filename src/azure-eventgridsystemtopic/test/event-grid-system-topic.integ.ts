import { Testing } from "cdktn";
import { Construct } from "constructs";
import "cdktn/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { StorageAccount } from "../../azure-storageaccount";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { EventGridSystemTopic } from "../lib/event-grid-system-topic";

const testMetadata = new TestRunMetadata("event-grid-system-topic-integration", {
  maxAgeHours: 4,
});

class EventGridSystemTopicExampleStack extends BaseTestStack {
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
      "egsystopic",
    );
    const storageName = this.generateResourceName(
      "Microsoft.Storage/storageAccounts",
      "egsource",
    );
    const systemTopicName = this.generateResourceName(
      "Microsoft.EventGrid/systemTopics",
      "systopic",
    );

    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
      },
    });

    const storageAccount = new StorageAccount(this, "example-storage", {
      name: storageName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Standard_LRS" },
      tags: {
        ...this.systemTags(),
      },
    });

    new EventGridSystemTopic(this, "example-system-topic", {
      name: systemTopicName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      source: storageAccount.id,
      topicType: "Microsoft.Storage.StorageAccounts",
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });
  }
}

describe("Event Grid System Topic Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup event grid system topic resources", () => {
    const app = Testing.app();
    const stack = new EventGridSystemTopicExampleStack(
      app,
      "test-event-grid-system-topic",
    );
    const synthesized = Testing.fullSynth(stack);

    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000);
});
