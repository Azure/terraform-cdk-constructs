import { Testing, TerraformStack} from 'cdktf';
import 'cdktf/lib/testing/adapters/jest';
import { AzureNetworkSecurityGroup } from '..';
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { exampleAzureNetworkSecurityGroup } from './ExampleAzureNetworkSecurityGroup';
import {PreconfiguredRules} from "../preconfiguredRules";

describe('Azure Network Security Group With Defaults', () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {features: {}});

    // Create a network security group with the defined rules
    new AzureNetworkSecurityGroup(stack, 'testAzureNetworkSecurityGroupDefaults', {
      name: 'my-nsg',
      location: "eastus",
      resourceGroupName: "rgtest",
      rules: [PreconfiguredRules.SSH],
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Network Security Group with defaults and checks snapshot", () => {
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


describe('Azure Network Security Group Example', () => {
  
  it("renders the Example Network Security Group and checks snapshot", () => {
  
    expect(
      Testing.synth(new exampleAzureNetworkSecurityGroup(Testing.app(), "testNetworkSecurityGroupExample"))
      
    ).toMatchSnapshot();
});

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureNetworkSecurityGroup(Testing.app(), "testNetworkSecurityGroupExample"))).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
  
    
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureNetworkSecurityGroup(Testing.app(), "testNetworkSecurityGroupExample"))).toPlanSuccessfully();
  });
});