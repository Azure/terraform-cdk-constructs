import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Testing, TerraformStack } from "cdktf";
import { TerraformPlan } from "../../testing";

import "cdktf/lib/testing/adapters/jest";
import * as metricalert from "../../azure-metricalert";
import * as util from "../../util/azureTenantIdHelpers";

describe("Azure Metric Alert With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureQueryRuleAlert", { features: {} });

    const rg = new ResourceGroup(stack, "MyResourceGroup", {
      name: "rg-test",
      location: "eastus",
    });

    new metricalert.MetricAlert(stack, "testAzureQueryRuleAlert", {
      name: "metric alert test",
      resourceGroup: rg,
      scopes: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
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

  it("renders an Azure Metric Alert with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    TerraformPlan(fullSynthResult); // Use the saved result
  });
});
