import { Testing, TerraformStack} from 'cdktf';
import 'cdktf/lib/testing/adapters/jest';
import * as storage from "..";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { exampleAzureStorageAccount } from '../test/ExampleAzureStorageAccount';

describe('Azure Storage Account With Defaults', () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {features: {}});

    // Create a Storage Account with the defined rules
    new storage.Account(stack, "storageaccount", {
      name: "test42348808",
      location: "eastus",
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Storage Account with defaults and checks snapshot", () => {
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


describe('Azure Storage Account Example', () => {
  
  it("renders the Example Storage Account and checks snapshot", () => {
  
    expect(
      Testing.synth(new exampleAzureStorageAccount(Testing.app(), "testNetworkSecurityGroupExample"))
      
    ).toMatchSnapshot();
});

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureStorageAccount(Testing.app(), "testNetworkSecurityGroupExample"))).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
  
    
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureStorageAccount(Testing.app(), "testNetworkSecurityGroupExample"))).toPlanSuccessfully();
  });
});