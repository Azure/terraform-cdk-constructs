import { Testing, TerraformStack} from 'cdktf';
import { exampleAzureContainerRegistry} from './ExampleAzureContainerRegistry'
import 'cdktf/lib/testing/adapters/jest';
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { AzureContainerRegistry } from '../';

describe('Azure Container Registry With Defaults', () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {features: {}});
    new AzureContainerRegistry(stack, 'testAzureContainerRegistryDefaults', {
      name: "latest",
      location: 'eastus',
      resource_group_name: "rg-test",
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Container Registry with defaults and checks snapshot", () => {
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


describe('Azure Container Registry Example', () => {
  
  it("renders the Azure Container Registry and checks snapshot", () => {
    expect(
      Testing.synth(new exampleAzureContainerRegistry(Testing.app(), "testAzureContainerRegistry"))
      
    ).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureContainerRegistry(Testing.app(), "testAzureContainerRegistry"))).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
  
    
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureContainerRegistry(Testing.app(), "testAzureContainerRegistry"))).toPlanSuccessfully();
  });
});
