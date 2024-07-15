import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Testing, TerraformStack } from "cdktf";
import * as metricalert from "../../azure-metricalert";

import {
  TerraformApplyAndCheckIdempotency,
  TerraformDestroy,
} from "../../testing";
import { generateRandomName } from "../../util/randomName";
import "cdktf/lib/testing/adapters/jest";

describe("Example of deploying a Metric Alert", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;
  const streamOutput = process.env.STREAM_OUTPUT !== "false";

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");
    const randomName = generateRandomName(12);

    new AzurermProvider(stack, "azureFeature", { features: {} });

    // Create a resource group
    const resourceGroup = new ResourceGroup(stack, "rg", {
      name: `rg-${randomName}`,
      location: "eastus",
    });

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(stack, "la", {
      location: "eastus",
      name: `la-${randomName}`,
      resourceGroupName: resourceGroup.name,
    });

    // Create Metric Alert
    new metricalert.MetricAlert(stack, "metricAlert1", {
      name: `metricalert1-${randomName}`,
      resourceGroup: resourceGroup,
      scopes: [logAnalyticsWorkspace.id],
      criteria: [
        {
          metricName: "Heartbeat",
          metricNamespace: "Microsoft.operationalinsights/workspaces",
          aggregation: "Average",
          operator: "LessThan",
          threshold: 0,
          dimension: [
            {
              name: "OSType",
              operator: "Include",
              values: ["*"],
            },
            {
              name: "Version",
              operator: "Include",
              values: ["*"],
            },
          ],
        },
      ],
    });

    new metricalert.MetricAlert(stack, "metricAlert2", {
      name: `metricalert2-${randomName}`,
      resourceGroup: resourceGroup,
      scopes: [logAnalyticsWorkspace.id],
      criteria: [
        {
          metricName: "Heartbeat",
          metricNamespace: "Microsoft.operationalinsights/workspaces",
          aggregation: "Average",
          operator: "LessThan",
          threshold: 0,
        },
      ],
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  afterEach(() => {
    try {
      TerraformDestroy(fullSynthResult, streamOutput);
    } catch (error) {
      console.error("Error during Terraform destroy:", error);
    }
  });

  it("check if stack can be deployed", () => {
    TerraformApplyAndCheckIdempotency(fullSynthResult, streamOutput); // Set to true to stream output
  });
});
