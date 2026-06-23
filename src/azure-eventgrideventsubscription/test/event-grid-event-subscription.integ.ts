import { Testing } from "cdktn";
import { Construct } from "constructs";
import "cdktn/lib/testing/adapters/jest";
import { EventGridSystemTopic } from "../../azure-eventgridsystemtopic";
import { ResourceGroup } from "../../azure-resourcegroup";
import { StorageAccount } from "../../azure-storageaccount";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { Resource } from "../../core-azure/lib/azapi/providers-azapi/resource";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { EventGridEventSubscription } from "../lib/event-grid-event-subscription";

const testMetadata = new TestRunMetadata(
  "event-grid-event-subscription-integration",
  {
    maxAgeHours: 4,
  },
);

class EventGridEventSubscriptionExampleStack extends BaseTestStack {
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
      "egeventsub",
    );
    const sourceStorageName = this.generateResourceName(
      "Microsoft.Storage/storageAccounts",
      "egsource",
    );
    const destinationStorageName = this.generateResourceName(
      "Microsoft.Storage/storageAccounts",
      "egdest",
    );
    const systemTopicName = this.generateResourceName(
      "Microsoft.EventGrid/systemTopics",
      "topic",
    );

    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
      },
    });

    const sourceStorage = new StorageAccount(this, "source-storage", {
      name: sourceStorageName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Standard_LRS" },
      tags: {
        ...this.systemTags(),
        role: "source",
      },
    });

    const destinationStorage = new StorageAccount(this, "destination-storage", {
      name: destinationStorageName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Standard_LRS" },
      tags: {
        ...this.systemTags(),
        role: "destination",
      },
    });

    new Resource(this, "destination-queue", {
      type: "Microsoft.Storage/storageAccounts/queueServices/queues@2024-01-01",
      parentId: `${destinationStorage.id}/queueServices/default`,
      name: "events",
      body: {
        properties: {},
      },
    });

    const systemTopic = new EventGridSystemTopic(this, "example-system-topic", {
      name: systemTopicName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      source: sourceStorage.id,
      topicType: "Microsoft.Storage.StorageAccounts",
      tags: {
        ...this.systemTags(),
      },
    });

    new EventGridEventSubscription(this, "example-event-subscription", {
      name: "storage-events",
      scope: systemTopic.id,
      destination: {
        endpointType: "StorageQueue",
        properties: {
          resourceId: destinationStorage.id,
          queueName: "events",
        },
      },
      filter: {
        includedEventTypes: ["Microsoft.Storage.BlobCreated"],
      },
      labels: ["integration"],
    });
  }
}

describe("Event Grid Event Subscription Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup event grid event subscription resources", () => {
    const app = Testing.app();
    const stack = new EventGridEventSubscriptionExampleStack(
      app,
      "test-event-grid-event-subscription",
    );
    const synthesized = Testing.fullSynth(stack);

    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000);
});
