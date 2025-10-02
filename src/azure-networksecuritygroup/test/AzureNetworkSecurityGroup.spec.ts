import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Testing, TerraformStack } from "cdktf";
import * as network from "..";
import { TerraformPlan } from "../../testing";
import "cdktf/lib/testing/adapters/jest";

describe("Azure Network Security Group With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {
      features: {},
      skipProviderRegistration: true,
    });

    // Create a network security group with the defined rules
    new network.SecurityGroup(stack, "testAzureNetworkSecurityGroupDefaults", {
      name: "my-nsg",
      location: "eastus",
      rules: [
        network.PreconfiguredRules.addSourceAddress(
          network.PreconfiguredRules.ssh,
          "10.0.0.0/24",
        ),
      ],
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Network Security Group with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    TerraformPlan(fullSynthResult); // Use the saved result
  });
});
