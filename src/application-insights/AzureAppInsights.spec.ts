import { Testing, TerraformStack} from 'cdktf';
import { exampleAzureApplicationInsights} from './ExampleAzureApplicationInsights'
import 'cdktf/lib/testing/adapters/jest';


describe('AzureApplicationInsights-Snapshot', () => {
  it('renders a AzureApplicationInsights and check snapshot', () => {

    const synthed = Testing.synthScope((stack) => {
      new exampleAzureApplicationInsights(stack, "testAzureApplicationInsights");
    });
  
    expect(synthed).toMatchSnapshot();
  });
});


describe("AzureApplicationInsights-Terraform", () => {
  it("check if the produced terraform configuration is valid", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    
    Testing.synthScope((stack) => {
      new exampleAzureApplicationInsights(stack, "testAzureApplicationInsights");
    });

    // We need to do a full synth to validate the terraform configuration
    expect(Testing.fullSynth(stack)).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");

    Testing.synthScope((stack) => {
      new exampleAzureApplicationInsights(stack, "testAzureApplicationInsights");
    });

    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });
});
