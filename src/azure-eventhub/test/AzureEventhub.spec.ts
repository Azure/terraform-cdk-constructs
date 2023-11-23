import { Testing, TerraformStack} from 'cdktf';
import 'cdktf/lib/testing/adapters/jest';
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import * as util from "../../util/azureTenantIdHelpers";
import { exampleAzureEventhub } from './ExampleAzureEventhub';
import { AzureEventhubNamespace } from '../namespace';

describe('Azure Eventhub With Defaults', () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    jest.mock('../../azure-resourcegroup', () => ({
      AzureResourceGroup: {
        Location: 'eastus',
        Name: `test-rg`,
      }
    }));
    const rgMock = jest.requireMock('../../azure-resourcegroup');

    const app = Testing.app();
    stack = new TerraformStack(app, 'test');

    new AzurermProvider(stack, "azureFeature", {features: {}});
    new AzureEventhubNamespace(stack, 'testAzureEventhubDefaults', rgMock.AzureResourceGroup, {
      name: `eh-test`,
      tags: {
        'test': 'test'
      }
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Eventhub with defaults and checks snapshot", () => {
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


describe('Azure Eventhub Example', () => {

  it("renders the Example Azure Eventhub and checks snapshot", () => {
    // Need to remove the tenant_id from the snapshot as it will change wherever the test is run
    const output = Testing.synth(new exampleAzureEventhub(Testing.app(), "testAzureEventhub"));
    const myObject: Record<string, any> = JSON.parse(output);

    expect(util.removeTenantIdFromSnapshot(myObject)).toMatchSnapshot();
});

it("check if the produced terraform configuration is valid", () => {
  // We need to do a full synth to plan the terraform configuration
  expect(Testing.fullSynth(new exampleAzureEventhub(Testing.app(), "testAzureEventhub"))).toBeValidTerraform();
});

it("check if this can be planned", () => {

  
  // We need to do a full synth to plan the terraform configuration
  expect(Testing.fullSynth(new exampleAzureEventhub(Testing.app(), "testAzureEventhub"))).toPlanSuccessfully();
});
});
