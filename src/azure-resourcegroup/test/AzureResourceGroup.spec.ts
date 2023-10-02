import { Testing, TerraformStack} from 'cdktf';
import { exampleAzureResourceGroup} from './ExampleAzureResourceGroup'
import 'cdktf/lib/testing/adapters/jest';
import { AzureResourceGroup } from '../';
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";

describe('Resource Group With Defaults', () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {features: {}});
    new AzureResourceGroup(stack, 'testRG');

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders a Resource Group with defaults and checks snapshot", () => {
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


describe('Resource Group Example', () => {
  
  it("renders the Example Resource Group and checks snapshot", () => {
    expect(
      Testing.synth(new exampleAzureResourceGroup(Testing.app(), "testAzexampleAzureResourceGroup"))
      
    ).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureResourceGroup(Testing.app(), "testAzexampleAzureResourceGroup"))).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
  
    
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureResourceGroup(Testing.app(), "testAzexampleAzureResourceGroup"))).toPlanSuccessfully();
  });
});
