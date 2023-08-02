import { Testing, TerraformStack} from 'cdktf';
import { exampleAzureLogAnalytics} from './ExampleAzureLogAnalytics'
import 'cdktf/lib/testing/adapters/jest';
import { AzureLogAnalytics } from '../';




describe('Log Analytics Workspace With Defaults', () => {
  let stack: TerraformStack;
  
  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");
  
    Testing.synthScope((stack) => {
      new AzureLogAnalytics(stack, 'testAzureLogAnalyticsDefaults', {
        name: "la-test",
        location: 'eastus',
        resource_group_name: "rg-test",
      });
    });
  });

  it('renders the Example Log Analytics Workspace and checks snapshot', () => {
    const synthed = Testing.synth(stack);
    expect(synthed).toMatchSnapshot();
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


describe('Log Analytics Workspace Example', () => {
  let stack: TerraformStack;
  
  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");
  
    Testing.synthScope(() => {
      new exampleAzureLogAnalytics(stack, "testAzureLogAnalytics");
    });
  });

  it('renders the Example Log Analytics Workspace and checks snapshot', () => {
    const synthed = Testing.synth(stack);
    expect(synthed).toMatchSnapshot();
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




