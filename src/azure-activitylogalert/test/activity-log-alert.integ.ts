/**
 * Integration test for Azure Activity Log Alert construct
 *
 * This test demonstrates basic usage of the ActivityLogAlert construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ActionGroup } from "../../azure-actiongroup";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { TerraformApplyCheckAndDestroy } from "../../testing";
import { ActivityLogAlert } from "../lib/activity-log-alert";

/**
 * Example stack demonstrating ActivityLogAlert usage
 */
class ActivityLogAlertExampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "rg", {
      name: "rg-activitylogalert-example",
      location: "eastus",
      tags: {
        environment: "example",
        purpose: "integration-test",
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
        environment: "example",
      },
    });

    // Create activity log alert monitoring administrative operations
    new ActivityLogAlert(this, "activitylogalert", {
      name: "activitylogalert-example",
      resourceGroupId: resourceGroup.id,
      apiVersion: "2020-10-01",
      description: "Alert on administrative resource write operations",
      enabled: true,
      scopes: [resourceGroup.id],
      condition: {
        allOf: [
          {
            field: "category",
            equalsValue: "Administrative",
          },
          {
            field: "operationName",
            equalsValue:
              "Microsoft.Resources/subscriptions/resourceGroups/write",
          },
        ],
      },
      actions: {
        actionGroups: [
          {
            actionGroupId: actionGroup.id,
          },
        ],
      },
      tags: {
        environment: "example",
      },
    });
  }
}

describe("ActivityLogAlert Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup activity log alert resources", () => {
    const app = Testing.app();
    const stack = new ActivityLogAlertExampleStack(
      app,
      "test-activitylogalert",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 600000); // 10 minute timeout for deployment and cleanup
});
