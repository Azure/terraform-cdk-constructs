import { Testing, TerraformStack} from 'cdktf';
import { exampleAzureContainerRegistry} from './ExampleAzureContainerRegistry'
import 'cdktf/lib/testing/adapters/jest';


describe('AzureContainerRegistry-Snapshot', () => {
  it('renders a AzureContainerRegistry and check snapshot', () => {

    const synthed = Testing.synthScope((stack) => {
      new exampleAzureContainerRegistry(stack, "testAzureContainerRegistry");
    });
  
    expect(synthed).toMatchSnapshot();
  });
});


describe("AzureContainerRegistry-Terraform", () => {
  it("check if the produced terraform configuration is valid", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    
    Testing.synthScope((stack) => {
      new exampleAzureContainerRegistry(stack, "testAzureContainerRegistry");
    });

    // We need to do a full synth to validate the terraform configuration
    expect(Testing.fullSynth(stack)).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");

    Testing.synthScope((stack) => {
      new exampleAzureContainerRegistry(stack, "testAzureContainerRegistry");
    });

    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });
});
