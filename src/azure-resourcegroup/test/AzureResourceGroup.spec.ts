import { Testing, TerraformStack} from 'cdktf';
import { exampleAzureResourceGroup} from './ExampleAzureResourceGroup'
import 'cdktf/lib/testing/adapters/jest';


describe('AzureResourceGroup-Snapshot', () => {
  it('renders a AzureResourceGroup and checks snapshot', () => {

    const synthed = Testing.synthScope((stack) => {
      new exampleAzureResourceGroup(stack, "testAzureResourceGroup");
    });
    expect(synthed).toMatchSnapshot();
  });
});


describe("AzureResourceGroup-Terraform", () => {
  it("check if the produced terraform configuration is valid", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    
    Testing.synthScope((stack) => {
      new exampleAzureResourceGroup(stack, "testAzureResourceGroup");
    });

    // We need to do a full synth to validate the terraform configuration
    expect(Testing.fullSynth(stack)).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");

    Testing.synthScope((stack) => {
      new exampleAzureResourceGroup(stack, "testAzureResourceGroup");
    });


    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });
});
