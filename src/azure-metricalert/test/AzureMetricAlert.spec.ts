import { Testing, TerraformStack } from 'cdktf';
import 'cdktf/lib/testing/adapters/jest';
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import * as metricalert from "../../azure-metricalert";
import { exampleAzureMetricAlert } from './ExampleAzureMetricAlert';
import * as util from "../../util/azureTenantIdHelpers";


describe('Azure Metric Alert With Defaults', () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureQueryRuleAlert", { features: {} });

    new metricalert.MetricAlert(stack, 'testAzureQueryRuleAlert', {
      name: "metric alert test",
      resourceGroupName: "testResourceGroup",
      scopes: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
      criteria: [
        {
          metricName: "Heartbeat",
          metricNamespace: "Microsoft.operationalinsights/workspaces",
          aggregation: "Average",
          operator: "LessThan",
          threshold: 0,
        },
      ],
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Metric Alert with defaults and checks snapshot", () => {
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


describe('Linux Metric Alert Example', () => {

  it("renders the Metric Alert and checks snapshot", () => {
    // Need to remove the tenant_id from the snapshot as it will change wherever the test is run
    const output = Testing.synth(new exampleAzureMetricAlert(Testing.app(), "testAzureMetricAlert"));
    const myObject: Record<string, any> = JSON.parse(output);

    expect(util.removeTenantIdFromSnapshot(myObject)).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureMetricAlert(Testing.app(), "testAzureMetricAlert"))).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureMetricAlert(Testing.app(), "testAzureMetricAlert"))).toPlanSuccessfully();
  });
});