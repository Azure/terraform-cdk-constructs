import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Testing, TerraformStack } from "cdktf";
import "cdktf/lib/testing/adapters/jest";
import { exampleAzureKusto } from "./ExampleAzureKusto";
import * as kusto from "..";

describe("Kusto With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    jest.mock("../../azure-resourcegroup", () => ({
      Group: {
        Location: "eastus",
        Name: "testrgname",
      },
    }));
    const rgMock = jest.requireMock("../../azure-resourcegroup");

    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", { features: {} });
    new kusto.Cluster(stack, "testAzureKustoDefaults", {
      rg: rgMock.Group,
      name: "kustotest",
      sku: kusto.ComputeSpecification.devtestExtraSmallEav4,
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Kusto with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    expect(fullSynthResult).toPlanSuccessfully(); // Use the saved result
  });
});

describe("Kusto Example", () => {
  it("renders the Azure Kusto Example and checks snapshot", () => {
    expect(
      Testing.synth(new exampleAzureKusto(Testing.app(), "testAzureKusto")),
    ).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(new exampleAzureKusto(Testing.app(), "testAzureKusto")),
    ).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(new exampleAzureKusto(Testing.app(), "testAzureKusto")),
    ).toPlanSuccessfully();
  });
});
