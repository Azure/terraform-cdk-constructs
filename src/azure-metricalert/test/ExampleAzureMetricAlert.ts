import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { App } from "cdktf";
import { Construct } from "constructs";
import * as metricalert from "../../azure-metricalert";
import { BaseTestStack } from "../../testing";

const app = new App();

export class exampleAzureMetricAlert extends BaseTestStack {
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
        environment: "dev",
        service_owner: "dev",
        service_name: "tf-test",
      },
    });

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(this, "la", {
      location: "eastus",
      name: `la-${this.name}`,
      resourceGroupName: resourceGroup.name,
    });

    // Create Metric Alert
    new metricalert.MetricAlert(this, "metricAlert1", {
      name: `metricalert1-${this.name}`,
      resourceGroupName: resourceGroup.name,
      scopes: [logAnalyticsWorkspace.id],
      criteria: [
        {
          metricName: "Heartbeat",
          metricNamespace: "Microsoft.operationalinsights/workspaces",
          aggregation: "Average",
          operator: "LessThan",
          threshold: 0,
          dimension: [
            {
              name: "OSType",
              operator: "Include",
              values: ["*"],
            },
            {
              name: "Version",
              operator: "Include",
              values: ["*"],
            },
          ],
        },
      ],
    });

    new metricalert.MetricAlert(this, "metricAlert2", {
      name: `metricalert2-${this.name}`,
      resourceGroupName: resourceGroup.name,
      scopes: [logAnalyticsWorkspace.id],
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
  }
}

new exampleAzureMetricAlert(app, "testAzureMetricAlert");

app.synth();
