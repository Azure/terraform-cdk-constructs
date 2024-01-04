import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { App } from "cdktf";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import * as queryalert from "../../azure-queryrulealert";
import { BaseTestStack } from "../../testing";

const app = new App();

export class exampleAzureQueryRuleAlert extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
      features: {
        resourceGroup: {
          preventDeletionIfContainsResources: true,
        },
      },
    });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: "eastus",
      name: `rg-${this.name}`,
      tags: {
        test: "test",
      },
    });

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(
      this,
      "log_analytics",
      {
        location: "eastus",
        name: `la-${this.name}`,
        resourceGroupName: resourceGroup.name,
      },
    );

    // Query Rule Alert
    const alert = new queryalert.QueryRuleAlert(this, "queryRuleAlert", {
      name: `qra-${this.name}`,
      resourceGroupName: resourceGroup.name,
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
      scopes: [logAnalyticsWorkspace.id],
      severity: 4,
      criteriaFailingPeriods: {
        minimumFailingPeriodsToTriggerAlert: 1,
        numberOfEvaluationPeriods: 1,
      },
    });

    // Create Terraform Outputs for Function Apps
    const cdktfTerraformOutputRG = new cdktf.TerraformOutput(
      this,
      "resource_group_name",
      {
        value: resourceGroup.name,
      },
    );

    const cdktfTerraformOutputAlertId = new cdktf.TerraformOutput(
      this,
      "query_rule_alert_id",
      {
        value: alert.id,
      },
    );

    cdktfTerraformOutputRG.overrideLogicalId("resource_group_name");
    cdktfTerraformOutputAlertId.overrideLogicalId("query_rule_alert_id");
  }
}

new exampleAzureQueryRuleAlert(app, "testAzureQueryRuleAlert");

app.synth();
