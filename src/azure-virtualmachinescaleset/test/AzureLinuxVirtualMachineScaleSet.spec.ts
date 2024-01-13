import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Testing, TerraformStack } from "cdktf";
import "cdktf/lib/testing/adapters/jest";
import * as vmss from "..";
import { exampleAzureLinuxVirtualMachineScaleSet } from "../test/ExampleAzureLinuxVirtualMachineScaleSet";

describe("Azure Linux Virtual Machine Scale Set With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "testAzureVMSSWithDefaults");

    new AzurermProvider(stack, "azureFeature", { features: {} });

    const rg = new ResourceGroup(stack, "MyResourceGroup", {
      name: "rg-test",
      location: "eastus",
    });

    new vmss.LinuxCluster(stack, "testVirtualMachineScaleSet", {
      resourceGroup: rg,
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Linux Virtual Machine  Scale Set with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    expect(fullSynthResult).toPlanSuccessfully(); // Use the saved result
  });
});

describe("Azure Linux Virtual Machine  Scale Set Example", () => {
  it("renders the Azure Linux Virtual Machine Scale Set and checks snapshot", () => {
    expect(
      Testing.synth(
        new exampleAzureLinuxVirtualMachineScaleSet(
          Testing.app(),
          "testAzureLinuxVirtualMachineScaleSetExample",
        ),
      ),
    ).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureLinuxVirtualMachineScaleSet(
          Testing.app(),
          "testAzureLinuxVirtualMachineScaleSetExample",
        ),
      ),
    ).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureLinuxVirtualMachineScaleSet(
          Testing.app(),
          "testAzureLinuxVirtualMachineScaleSetExample",
        ),
      ),
    ).toPlanSuccessfully();
  });
});
