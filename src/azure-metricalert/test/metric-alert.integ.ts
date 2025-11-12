/**
 * Integration test for Azure Metric Alert construct
 *
 * This test demonstrates basic usage of the MetricAlert construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ActionGroup } from "../../azure-actiongroup";
import { ResourceGroup } from "../../azure-resourcegroup";
import { StorageAccount } from "../../azure-storageaccount";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { MetricAlert } from "../lib/metric-alert";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("metric-alert-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating MetricAlert usage
 */
class MetricAlertExampleStack extends BaseTestStack {
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
      "metricalert",
    );
    const storageName = this.generateResourceName(
      "Microsoft.Storage/storageAccounts",
      "alert",
    );

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
      },
    });

    // Create action group for alert notifications
    const actionGroup = new ActionGroup(this, "actiongroup", {
      name: "actiongroup-example",
      resourceGroupId: resourceGroup.id,
      apiVersion: "2021-09-01",
      groupShortName: "Example",
      enabled: true,
      emailReceivers: [
        {
          name: "email-example",
          emailAddress: "test@example.com",
          useCommonAlertSchema: true,
        },
      ],
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });

    // Create storage account to monitor
    const storageAccount = new StorageAccount(this, "storage", {
      name: storageName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Standard_LRS" },
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });

    // Create metric alert with static threshold monitoring storage account
    new MetricAlert(this, "metricalert", {
      name: "metricalert-example",
      resourceGroupId: resourceGroup.id,
      apiVersion: "2018-03-01",
      description: "Alert when storage account availability is low",
      severity: 2,
      enabled: true,
      scopes: [storageAccount.id],
      evaluationFrequency: "PT5M",
      windowSize: "PT15M",
      criteria: {
        type: "StaticThreshold",
        metricName: "Availability",
        metricNamespace: "Microsoft.Storage/storageAccounts",
        operator: "LessThan",
        threshold: 99,
        timeAggregation: "Average",
      },
      actions: [
        {
          actionGroupId: actionGroup.id,
        },
      ],
      autoMitigate: true,
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });
  }
}

describe("MetricAlert Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup metric alert resources", () => {
    const app = Testing.app();
    const stack = new MetricAlertExampleStack(app, "test-metricalert");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
