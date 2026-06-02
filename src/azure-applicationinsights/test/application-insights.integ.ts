/**
 * Integration test for Azure Application Insights
 *
 * This test demonstrates basic usage of the ApplicationInsights construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { LogAnalyticsWorkspace } from "../../azure-loganalyticsworkspace";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { TerraformApplyCheckAndDestroy } from "../../testing";
import { ApplicationInsights } from "../lib/application-insights";

/**
 * Example stack demonstrating Application Insights usage
 */
class ApplicationInsightsExampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: "ai-example-rg",
      location: "eastus",
      tags: {
        environment: "example",
        purpose: "integration-test",
      },
    });

    // Create a Log Analytics Workspace (required for workspace-based App Insights)
    const workspace = new LogAnalyticsWorkspace(this, "example-workspace", {
      name: "ai-example-law",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      retentionInDays: 30,
      tags: {
        purpose: "integration-test",
      },
    });

    // Example 1: Basic Application Insights component
    new ApplicationInsights(this, "basic-appinsights", {
      name: "ai-basic-example",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      workspaceResourceId: workspace.id,
      tags: {
        example: "basic",
      },
    });

    // Example 2: Application Insights with custom configuration
    new ApplicationInsights(this, "configured-appinsights", {
      name: "ai-configured-example",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      workspaceResourceId: workspace.id,
      applicationType: "web",
      retentionInDays: 60,
      samplingPercentage: 75,
      disableIpMasking: false,
      apiVersion: "2020-02-02",
      tags: {
        example: "configured",
      },
    });
  }
}

describe("Application Insights Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup Application Insights resources", () => {
    const app = Testing.app();
    const stack = new ApplicationInsightsExampleStack(
      app,
      "test-application-insights",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 1200000); // 20 minute timeout for deployment and cleanup
});
