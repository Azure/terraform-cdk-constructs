import { Testing, TerraformStack} from 'cdktf';
import { exampleAzureKeyVault} from './ExampleAzureKeyVault'
import 'cdktf/lib/testing/adapters/jest';
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { AzureKeyVault } from '../';

describe('Azure Key Vault With Defaults', () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {features: {}});
    new AzureKeyVault(stack, 'testAzureKeyVaultDefaults', {
      name: `kv-test`,
      location: 'eastus',
      resource_group_name: "rg-test" ,
      tenant_id: '123e4567-e89b-12d3-a456-426614174000',
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Key Vault with defaults and checks snapshot", () => {
    expect(
      Testing.synth(stack)
    ).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    expect(fullSynthResult).toPlanSuccessfully(); // Use the saved result
  });
});


describe('Azure Key Vault Example', () => {
  let stack: TerraformStack;
  
  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");
  
    Testing.synthScope((stack) => {
      new exampleAzureKeyVault(stack, "testAzureKeyVault");
    });
  });

  it("renders the Example Azure Key Vault and checks snapshot", () => {
    expect(
      Testing.synth(new exampleAzureKeyVault(Testing.app(), "testAzureKeyVault"))
      
    ).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to validate the terraform configuration
    expect(Testing.fullSynth(stack)).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });
});
