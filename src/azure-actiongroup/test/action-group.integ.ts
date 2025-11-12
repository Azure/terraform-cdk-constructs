/**
 * Integration test for Azure Action Group construct
 *
 * This test demonstrates basic usage of the ActionGroup construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { ActionGroup } from "../lib/action-group";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("action-group-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating ActionGroup usage
 */
class ActionGroupExampleStack extends BaseTestStack {
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
      "actiongroup",
    );

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
      },
    });

    // Create action group with email receiver
    new ActionGroup(this, "actiongroup", {
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
  }
}

describe("ActionGroup Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup action group resources", () => {
    const app = Testing.app();
    const stack = new ActionGroupExampleStack(app, "test-actiongroup");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
