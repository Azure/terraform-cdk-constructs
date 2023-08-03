import { Testing, TerraformStack} from 'cdktf';
import { exampleAzureLogAnalytics} from './ExampleAzureLogAnalytics'
import 'cdktf/lib/testing/adapters/jest';
import { AzureLogAnalytics } from '../';
//import { RoleAssignment } from "@cdktf/provider-azurerm/lib/role-assignment";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";

describe('Log Analytics Workspace With Defaults', () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {features: {}});
    new AzureLogAnalytics(stack, 'testAzureLogAnalyticsDefaults', {
      name: "la-test",
      location: 'eastus',
      resource_group_name: "rg-test",
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders a Log Analytics Workspace with Defaults and checks snapshot", () => {
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


describe('Log Analytics Workspace Example', () => {
  let stack: TerraformStack;
  
  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");
  
    Testing.synthScope((stack) => {
      new exampleAzureLogAnalytics(stack, "testAzureLogAnalytics");
    });
  });

  it("renders the Example Log Analytics Workspace and checks snapshot", () => {
    expect(
      Testing.synth(new exampleAzureLogAnalytics(Testing.app(), "testAzureLogAnalytics"))
      
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