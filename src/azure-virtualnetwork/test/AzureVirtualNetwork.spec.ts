import { Testing, TerraformStack} from 'cdktf';
import 'cdktf/lib/testing/adapters/jest';
import { AzureVirtualNetwork } from '..';
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { exampleAzureVirtualNetwork } from './ExampleAzureVirtualNetwork';

describe('Azure Virtual Network With Defaults', () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {features: {}});
    new AzureVirtualNetwork(stack, 'testAzureVirtualNetworkDefaults', {
      name: "vnet-test",
      location: 'eastus',
      resourceGroupName: "rg-test",
      addressSpace: ["10.0.0.0/16"],
      subnets: [
        {
          name: "subnet1",
          addressPrefixes: ["10.0.1.0/24"],
        },
        {
          name: "subnet2",
          addressPrefixes: ["10.0.2.0/24"],
        },
      ],
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Virtual Network with defaults and checks snapshot", () => {
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


describe('Azure Virtual Network Example', () => {
  
  it("renders the Example Azure Virtual Network and checks snapshot", () => {
  
    expect(
      Testing.synth(new exampleAzureVirtualNetwork(Testing.app(), "testAzureVirtualNetwork"))
      
    ).toMatchSnapshot();
});

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureVirtualNetwork(Testing.app(), "testAzureVirtualNetwork"))).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
  
    
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureVirtualNetwork(Testing.app(), "testAzureVirtualNetwork"))).toPlanSuccessfully();
  });
});