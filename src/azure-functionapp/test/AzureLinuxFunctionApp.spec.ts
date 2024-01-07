import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Testing, TerraformStack } from "cdktf";
import "cdktf/lib/testing/adapters/jest";
import { exampleAzureLinuxFunctionApp } from "./ExampleAzureLinuxFunctionApp";
import * as func from "..";
import * as util from "../../util/azureTenantIdHelpers";

describe("Azure Linux Function App With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", { features: {} });

    new func.FunctionAppLinux(stack, "testAzureLinuxFunctionApp", {
      name: "fatest",
      location: "eastus",
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Linux Function App with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    expect(fullSynthResult).toPlanSuccessfully(); // Use the saved result
  });
});

describe("Linux Function App Example", () => {
  it("renders the Linux Function App and checks snapshot", () => {
    // Need to remove the tenant_id from the snapshot as it will change wherever the test is run
    const output = Testing.synth(
      new exampleAzureLinuxFunctionApp(
        Testing.app(),
        "testAzureLinuxFunctionApp",
      ),
    );
    const myObject: Record<string, any> = JSON.parse(output);

    expect(util.removeTenantIdFromSnapshot(myObject)).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureLinuxFunctionApp(
          Testing.app(),
          "testAzureLinuxFunctionApp",
        ),
      ),
    ).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureLinuxFunctionApp(
          Testing.app(),
          "testAzureLinuxFunctionApp",
        ),
      ),
    ).toPlanSuccessfully();
  });
});
