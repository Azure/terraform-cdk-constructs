import { Testing, TerraformStack } from 'cdktf';
import { exampleAzureActionGroup } from './ExampleAzureActionGroup'
import 'cdktf/lib/testing/adapters/jest';
import { ActionGroup } from "..";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import * as util from "../../util/azureTenantIdHelpers";


describe('Action Group With Defaults', () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", { features: {} });
    new ActionGroup(stack, 'testAzureActionGroupDefaults', {
      name: "testactiongroup",
      location: 'eastus',
      resourceGroupName: "rg-test",
      shortName: "testshortn",
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Action Group with defaults and checks snapshot", () => {
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


describe('Action Group Example', () => {

  it("renders and checks snapshot", () => {
    // Need to remove the tenant_id from the snapshot as it will change wherever the test is run
    const output = Testing.synth(new exampleAzureActionGroup(Testing.app(), "testAzureActionGroup"));
    const myObject: Record<string, any> = JSON.parse(output);

    expect(util.removeTenantIdFromSnapshot(myObject)).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureActionGroup(Testing.app(), "testAzureActionGroup"))).toBeValidTerraform();
  });

  it("check if this can be planned", () => {

    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureActionGroup(Testing.app(), "testAzureActionGroup"))).toPlanSuccessfully();
  });
});