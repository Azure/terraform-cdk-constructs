/**
 * Integration test for Azure Log Analytics Workspace
 *
 * This test demonstrates basic usage of the LogAnalyticsWorkspace construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { TerraformApplyCheckAndDestroy } from "../../testing";
import { LogAnalyticsWorkspace } from "../lib/log-analytics-workspace";

/**
 * Example stack demonstrating Log Analytics Workspace usage
 */
class LogAnalyticsWorkspaceExampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: "law-example-rg",
      location: "eastus",
      tags: {
        environment: "example",
        purpose: "integration-test",
      },
    });

    // Example 1: Basic Log Analytics Workspace
    new LogAnalyticsWorkspace(this, "basic-workspace", {
      name: "law-basic-example",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      tags: {
        example: "basic",
      },
    });

    // Example 2: Log Analytics Workspace with specific version
    new LogAnalyticsWorkspace(this, "versioned-workspace", {
      name: "law-versioned-example",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      retentionInDays: 60,
      sku: {
        name: "PerGB2018",
      },
      apiVersion: "2023-09-01",
      tags: {
        example: "versioned",
      },
    });
  }
}

describe("Log Analytics Workspace Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup Log Analytics Workspace resources", () => {
    const app = Testing.app();
    const stack = new LogAnalyticsWorkspaceExampleStack(
      app,
      "test-log-analytics-workspace",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 600000); // 10 minute timeout for deployment and cleanup
});
