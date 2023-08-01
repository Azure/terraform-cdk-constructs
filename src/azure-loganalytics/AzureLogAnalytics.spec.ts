import { Testing, TerraformStack} from 'cdktf';
import { exampleAzureLogAnalytics} from './ExampleAzureLogAnalytics'
import 'cdktf/lib/testing/adapters/jest';


describe('AzureLogAnalytics-Snapshot', () => {
  it('renders a AzureLogAnalytics', () => {
    const synthed = Testing.synthScope((stack) => {
      new exampleAzureLogAnalytics(stack, "testAzureLogAnalytics");
    });
    expect(synthed).toMatchSnapshot();
  });
});


describe("AzureLogAnalytics-Terraform", () => {
  it("check if the produced terraform configuration is valid", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    
    Testing.synthScope((stack) => {
      new exampleAzureLogAnalytics(stack, "testAzureLogAnalytics");
    });

    // We need to do a full synth to validate the terraform configuration
    expect(Testing.fullSynth(stack)).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");

    Testing.synthScope((stack) => {
      new exampleAzureLogAnalytics(stack, "testAzureLogAnalytics");
    });

    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });
});
