import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Testing, TerraformStack } from "cdktf";
import "cdktf/lib/testing/adapters/jest";
import { exampleAzureQueryRuleAlert } from "./ExampleAzureQueryRuleAlert";
import * as queryalert from "../../azure-queryrulealert";
import * as util from "../../util/azureTenantIdHelpers";

describe("Azure Query Rule Alert With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureQueryRuleAlert", { features: {} });

    const rg = new ResourceGroup(stack, "MyResourceGroup", {
      name: "rg-test",
      location: "eastus",
    });

    new queryalert.QueryRuleAlert(stack, "testAzureQueryRuleAlert", {
      name: "alert test",
      resourceGroup: rg,
      location: "eastus",
      criteriaOperator: "GreaterThan",
      criteriaQuery: `
AppExceptions 
| where Message has "file can not be reloaded"
`,
      criteriaThreshold: 100,
      criteriatimeAggregationMethod: "Count",
      evaluationFrequency: "PT5M",
      windowDuration: "PT30M",
      scopes: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
      severity: 3,
      criteriaFailMinimumFailingPeriodsToTriggerAlert: 1,
      criteriaFailNumberOfEvaluationPeriods: 1,
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Query Rule Alert with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    expect(fullSynthResult).toPlanSuccessfully(); // Use the saved result
  });
});

describe("Linux Query Rule Alert Example", () => {
  it("renders the Query Rule Alert and checks snapshot", () => {
    // Need to remove the tenant_id from the snapshot as it will change wherever the test is run
    const output = Testing.synth(
      new exampleAzureQueryRuleAlert(Testing.app(), "testAzureQueryRuleAlert"),
    );
    const myObject: Record<string, any> = JSON.parse(output);

    expect(util.removeTenantIdFromSnapshot(myObject)).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureQueryRuleAlert(
          Testing.app(),
          "testAzureQueryRuleAlert",
        ),
      ),
    ).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureQueryRuleAlert(
          Testing.app(),
          "testAzureQueryRuleAlert",
        ),
      ),
    ).toPlanSuccessfully();
  });
});
