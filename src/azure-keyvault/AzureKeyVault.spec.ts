import { Testing, TerraformStack} from 'cdktf';
import { exampleAzureKeyVault} from './ExampleAzureKeyVault'
import 'cdktf/lib/testing/adapters/jest';


describe('AzureKeyVault-Snapshot', () => {
  it('renders a AzureKeyVault', () => {
    const synthed = Testing.synthScope((stack) => {
      new exampleAzureKeyVault(stack, "testAzureKeyVault");
    });
    expect(synthed).toMatchSnapshot();
  });
});


describe("AzureKeyVault-Terraform", () => {
  it("check if the produced terraform configuration is valid", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    
    Testing.synthScope((stack) => {
      new exampleAzureKeyVault(stack, "testAzureKeyVault");
    });

    // We need to do a full synth to validate the terraform configuration
    expect(Testing.fullSynth(stack)).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");

    Testing.synthScope((stack) => {
      new exampleAzureKeyVault(stack, "testAzureKeyVault");
    });

    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });
});
