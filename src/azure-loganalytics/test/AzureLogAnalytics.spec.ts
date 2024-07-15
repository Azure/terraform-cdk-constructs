import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Testing, TerraformStack } from "cdktf";
import * as la from "..";
import { TerraformPlan } from "../../testing";

import "cdktf/lib/testing/adapters/jest";

describe("Log Analytics Workspace With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", { features: {} });

    new la.Workspace(stack, "testAzureLogAnalyticsDefaults", {
      name: "la-test",
      location: "eastus",
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders a Log Analytics Workspace with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    TerraformPlan(fullSynthResult); // Use the saved result
  });
});
