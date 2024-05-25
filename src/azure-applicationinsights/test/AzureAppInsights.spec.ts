import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Testing, TerraformStack } from "cdktf";
import { exampleAzureApplicationInsights } from "./ExampleAzureApplicationInsights";
import "cdktf/lib/testing/adapters/jest";
import * as appi from "..";
import * as util from "../../util/azureTenantIdHelpers";

describe("Application Insights With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", { features: {} });

    new appi.AppInsights(stack, "testAzureApplicationInsightsDefaults", {
      name: "appi-test",
      location: "eastus",
      applicationType: "web",
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Application Insights with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    expect(fullSynthResult).toPlanSuccessfully(); // Use the saved result
  });
});

describe("Application Insights Example", () => {
  it("renders the Application Insights and checks snapshot", () => {
    // Need to remove the tenant_id from the snapshot as it will change wherever the test is run
    const output = Testing.synth(
      new exampleAzureApplicationInsights(Testing.app(), "testAzureKeyVault"),
    );
    const myObject: Record<string, any> = JSON.parse(output);

    expect(util.removeTenantIdFromSnapshot(myObject)).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureApplicationInsights(
          Testing.app(),
          "testAzureApplicationInsights",
        ),
      ),
    ).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureApplicationInsights(
          Testing.app(),
          "testAzureApplicationInsights",
        ),
      ),
    ).toPlanSuccessfully();
  });
});
