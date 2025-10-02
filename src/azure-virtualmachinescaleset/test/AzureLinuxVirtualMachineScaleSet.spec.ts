import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Testing, TerraformStack } from "cdktf";
import * as vmss from "..";
import { TerraformPlan } from "../../testing";
import "cdktf/lib/testing/adapters/jest";

describe("Azure Linux Virtual Machine Scale Set With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "testAzureVMSSWithDefaults");

    new AzurermProvider(stack, "azureFeature", {
      features: {},
      skipProviderRegistration: true,
    });

    new vmss.LinuxCluster(stack, "testVirtualMachineScaleSet", {});

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Linux Virtual Machine  Scale Set with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    TerraformPlan(fullSynthResult); // Use the saved result
  });
});
