import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Testing, TerraformStack } from "cdktf";
import * as kv from "..";
import { TerraformPlan } from "../../testing";
import "cdktf/lib/testing/adapters/jest";

describe("Azure Key Vault With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {
      features: {},
      skipProviderRegistration: true,
    });

    new kv.Vault(stack, "testAzureKeyVaultDefaults", {
      name: "kv-test",
      location: "eastus",
      tenantId: "123e4567-e89b-12d3-a456-426614174000",
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Key Vault with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    TerraformPlan(fullSynthResult); // Use the saved result
  });
});
