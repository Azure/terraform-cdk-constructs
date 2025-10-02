import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Testing, TerraformStack } from "cdktf";
import * as queryalert from "../../azure-queryrulealert";
import { TerraformPlan } from "../../testing";
import "cdktf/lib/testing/adapters/jest";

describe("Azure Query Rule Alert With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureQueryRuleAlert", {
      features: {},
      skipProviderRegistration: true,
    });

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
    TerraformPlan(fullSynthResult); // Use the saved result
  });
});
