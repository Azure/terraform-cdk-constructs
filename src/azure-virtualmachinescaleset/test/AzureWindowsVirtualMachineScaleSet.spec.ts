import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Testing, TerraformStack } from "cdktf";
import "cdktf/lib/testing/adapters/jest";
import * as vmss from "..";
import { exampleAzureWindowsVirtualMachineScaleSet } from "../test/ExampleAzureWindowsVirtualMachineScaleSet";

describe("Azure Windows Virtual Machine Scale Set With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "testAzureVMSSWithDefaults");

    new AzurermProvider(stack, "azureFeature", { features: {} });

    new vmss.WindowsCluster(stack, "testVirtualMachineScaleSet", {
      resourceGroupName: "testResourceGroup",
      adminUsername: "testAdmin",
      adminPassword: "testPassword&@34$$123",
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Windows Virtual Machine  Scale Set with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    expect(fullSynthResult).toPlanSuccessfully(); // Use the saved result
  });
});

describe("Azure Windows Virtual Machine  Scale Set Example", () => {
  it("renders the Azure Windows Virtual Machine Scale Set and checks snapshot", () => {
    expect(
      Testing.synth(
        new exampleAzureWindowsVirtualMachineScaleSet(
          Testing.app(),
          "testAzureWindowsVirtualMachineScaleSetExample",
        ),
      ),
    ).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureWindowsVirtualMachineScaleSet(
          Testing.app(),
          "testAzureWindowsVirtualMachineScaleSetExample",
        ),
      ),
    ).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureWindowsVirtualMachineScaleSet(
          Testing.app(),
          "testAzureWindowsVirtualMachineScaleSetExample",
        ),
      ),
    ).toPlanSuccessfully();
  });
});
