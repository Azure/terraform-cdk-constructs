/**
 * Integration test for Azure Storage Account
 *
 * This test demonstrates basic usage of the StorageAccount construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ActionGroup } from "../../azure-actiongroup";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { StorageAccount } from "../lib/storage-account";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("storage-account-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Storage Account usage
 */
class StorageAccountExampleStack extends BaseTestStack {
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
      "storage",
    );

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
      },
    });

    // Create an action group for monitoring alerts
    const actionGroup = new ActionGroup(this, "example-action-group", {
      name: "storage-monitoring-ag",
      location: "global",
      resourceGroupId: resourceGroup.id,
      groupShortName: "stralert",
      emailReceivers: [
        {
          name: "admin-email",
          emailAddress: "admin@example.com",
        },
      ],
    });

    // Generate unique storage account names (must be globally unique, lowercase, no hyphens)
    const basicStorageName = this.generateResourceName(
      "Microsoft.Storage/storageAccounts",
      "basic",
    );
    const versionedStorageName = this.generateResourceName(
      "Microsoft.Storage/storageAccounts",
      "versioned",
    );
    const monitoredStorageName = this.generateResourceName(
      "Microsoft.Storage/storageAccounts",
      "monitored",
    );
    const customMonitoredStorageName = this.generateResourceName(
      "Microsoft.Storage/storageAccounts",
      "custmon",
    );
    const selectiveMonitoredStorageName = this.generateResourceName(
      "Microsoft.Storage/storageAccounts",
      "selmon",
    );

    // Example 1: Basic storage account
    new StorageAccount(this, "basic-storage", {
      name: basicStorageName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Standard_LRS" },
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });

    // Example 2: Storage account with specific version
    new StorageAccount(this, "versioned-storage", {
      name: versionedStorageName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Standard_GRS" },
      apiVersion: "2023-05-01",
      tags: {
        ...this.systemTags(),
        example: "versioned",
      },
    });

    // Example 3: Storage account with monitoring
    new StorageAccount(this, "monitored-storage", {
      name: monitoredStorageName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Standard_LRS" },
      monitoring: StorageAccount.defaultMonitoring(actionGroup.id),
      tags: {
        ...this.systemTags(),
        example: "monitored",
      },
    });

    // Example 4: Storage account with custom monitoring thresholds
    new StorageAccount(this, "custom-monitored-storage", {
      name: customMonitoredStorageName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Standard_GRS" },
      monitoring: StorageAccount.defaultMonitoring(actionGroup.id, undefined, {
        availabilityThreshold: 99.5,
        egressThreshold: 21474836480, // 20GB
        transactionsThreshold: 200000,
        availabilityAlertSeverity: 0, // Critical
        egressAlertSeverity: 1, // Error
        transactionsAlertSeverity: 2, // Warning
      }),
      tags: {
        ...this.systemTags(),
        example: "custom-monitored",
      },
    });

    // Example 5: Storage account with selective monitoring
    new StorageAccount(this, "selective-monitored-storage", {
      name: selectiveMonitoredStorageName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "Standard_RAGRS" },
      monitoring: StorageAccount.defaultMonitoring(actionGroup.id, undefined, {
        enableAvailabilityAlert: true,
        enableEgressAlert: false, // Disable egress alert
        enableTransactionsAlert: true,
        enableDeletionAlert: false, // Disable deletion alert
      }),
      tags: {
        ...this.systemTags(),
        example: "selective-monitored",
      },
    });
  }
}

describe("Storage Account Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup storage account resources", () => {
    const app = Testing.app();
    const stack = new StorageAccountExampleStack(app, "test-storage-account");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
