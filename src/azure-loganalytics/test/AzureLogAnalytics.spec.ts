import { Testing, TerraformStack} from 'cdktf';
import { exampleAzureLogAnalytics} from './ExampleAzureLogAnalytics'
import 'cdktf/lib/testing/adapters/jest';
import { AzureLogAnalytics } from '../';
import { RoleAssignment } from "@cdktf/provider-azurerm/lib/role-assignment";
//import { log } from 'console';



describe('Log Analytics Workspace Only Defaults', () => {
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
    expect(stack).toMatchSnapshot();
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
    expect(stack).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to validate the terraform configuration
    expect(Testing.fullSynth(stack)).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });

  it("check for Log Analytics Contributor Role Assignment", () => {
    const app = Testing.app();
    const stack = new exampleAzureLogAnalytics(app, "testAzureLogAnalytics");
    const synthesized = Testing.synth(stack);

    expect(synthesized).toHaveResourceWithProperties(RoleAssignment, {
      role_definition_name: "Log Analytics Contributor",
    });
  });

  it("check for Log Analytics Reader Role Assignment", () => {
    const app = Testing.app();
    const stack = new exampleAzureLogAnalytics(app, "testAzureLogAnalytics");
    const synthesized = Testing.synth(stack);

    expect(synthesized).toHaveResourceWithProperties(RoleAssignment, {
      role_definition_name: "Log Analytics Reader",
    });
  });

  it("check for Custom Role Assignment", () => {
    const app = Testing.app();
    const stack = new exampleAzureLogAnalytics(app, "testAzureLogAnalytics");
    const synthesized = Testing.synth(stack);

    expect(synthesized).toHaveResourceWithProperties(RoleAssignment, {
      role_definition_name: "Monitoring Reader",
    });
  });
});




