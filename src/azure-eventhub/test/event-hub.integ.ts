/**
 * Integration test for Azure Event Hubs
 *
 * This test demonstrates basic usage of the EventhubNamespace and Eventhub
 * constructs and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktn";
import { Construct } from "constructs";
import "cdktn/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { Eventhub } from "../lib/event-hub";
import { EventhubNamespace } from "../lib/event-hub-namespace";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("event-hub-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Event Hubs usage
 */
class EventhubExampleStack extends BaseTestStack {
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
      "eventhub",
    );

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
      },
    });

    // Generate unique namespace names (must be globally unique)
    const basicNamespaceName = this.generateResourceName(
      "Microsoft.EventHub/namespaces",
      "basic",
    );
    const standardNamespaceName = this.generateResourceName(
      "Microsoft.EventHub/namespaces",
      "standard",
    );

    // Example 1: Basic namespace with a single event hub
    const basicNamespace = new EventhubNamespace(this, "basic-namespace", {
      name: basicNamespaceName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Basic" },
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });

    new Eventhub(this, "basic-hub", {
      name: "basic-events",
      namespaceName: basicNamespace.props.name!,
      namespaceId: basicNamespace.id,
      resourceGroupId: resourceGroup.id,
      partitionCount: 2,
      messageRetentionInDays: 1,
    });

    // Example 2: Standard namespace with auto-inflate and multiple event hubs
    const standardNamespace = new EventhubNamespace(
      this,
      "standard-namespace",
      {
        name: standardNamespaceName,
        location: resourceGroup.props.location!,
        resourceGroupId: resourceGroup.id,
        sku: { name: "Standard", capacity: 1 },
        isAutoInflateEnabled: true,
        maximumThroughputUnits: 4,
        minimumTlsVersion: "1.2",
        tags: {
          ...this.systemTags(),
          example: "standard",
        },
      },
    );

    new Eventhub(this, "telemetry-hub", {
      name: "telemetry",
      namespaceName: standardNamespace.props.name!,
      namespaceId: standardNamespace.id,
      resourceGroupId: resourceGroup.id,
      partitionCount: 4,
      messageRetentionInDays: 7,
    });

    new Eventhub(this, "audit-hub", {
      name: "audit",
      namespaceName: standardNamespace.props.name!,
      namespaceId: standardNamespace.id,
      resourceGroupId: resourceGroup.id,
      partitionCount: 2,
      messageRetentionInDays: 3,
    });
  }
}

describe("Event Hub Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup event hub resources", () => {
    const app = Testing.app();
    const stack = new EventhubExampleStack(app, "test-event-hub");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
