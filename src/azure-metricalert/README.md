# Azure Metric Alert Construct

This class represents a Metric Alert resource in Azure.

## What is Azure Metric Alert?

An Azure Metric Alert monitors a pre-computed and pre-aggregated metric over a period of time. We can use Azure provided metrics (see official doc for [dimensions supported](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-metric-near-real-time#metrics-and-dimensions-supported) ) or custom metrics. There are two types of Metric Alerts: `Static alert` and `Dynamic alert`. `Static Metric Alert` is given a static threshold to monitor, whereas `Dynamic Metric Alert` is leverage Azure Machine Learning to learn the normal pattern of metric and alert when the metric is outside of the normal pattern. The alert can also be configured to auto-mitigate when the metric returns to a healthy state.

## Azure Metric Alert Class Properties

This class has several properties that control the Alert Rules:

- `name` - The name of the Metric Alert.
- `resourceGroupName` - The name of the resource group in which the Metric Alert is created.
- `scopes` - A set of strings of resource IDs at which the metric criteria should be applied.
- `criteria` - (Optional) One ore more criteria. Either Criteria or dynamicCriteria is required.
- `dynamicCriteria` - (Optional) One ore more dynamic criteria. Either Criteria or dynamicCriteria is required.
- `enabled` - (Optional) Should this Metric Alert be enabled? Defaults to `true`.
- `automitigate` - (Optional) Should the alerts in this Metric Alert be auto resolved? Defaults to `true`.
- `frequency` - (Optional) The evaluation frequency of this Metric Alert, represented in ISO 8601 duration format. Possible values are PT1M, PT5M, PT15M, PT30M and PT1H. Defaults to `PT5M`.
- `windowSize` - (Optional) The period of time that is used to monitor alert activity, represented in ISO 8601 duration format. This value must be greater than frequency. Possible values are PT1M, PT5M, PT15M, PT30M, PT1H, PT6H, PT12H and P1D. Defaults to `PT5M`.
- `severity` - (Optional) The severity of this Metric Alert. Possible values are 0, 1, 2, 3 and 4. Defaults to `3`.
- `description` - (Optional) The description of this Metric Alert.
- `action` - (Optional) The action block of this Metric Alert.
- `targetResourceType` - (Optional) The resource type (e.g. Microsoft.Compute/virtualMachines) of the target resource. This is Required when using a Subscription as scope, a Resource Group as scope or Multiple Scopes.
- `targetResourceLocation` - (Optional) The location of the target resource. This is Required when using a Subscription as scope, a Resource Group as scope or Multiple Scopes.
- `tags` - (Optional) A mapping of tags to assign to the resource.

## Deploying a Metric Alert

You can deploy a Metric Alert using this class like so:

```typescript
  // Create a Resource Group first
  import * as rg from "../azure-resourcegroup";
  const resourceGroup = new rg.Group(this, "myResourceGroup", {
    name: 'myResourceGroup',
    location: 'eastus',
  });

  // Create a Log Analytics Workspace
  import * as law from "../azure-loganalytics";
  const logAnalyticsWorkspace = new la.Workspace(this, 'myLogAnalytics', {
      name: 'myLogAnalytics',
      location: 'eastus',
      resource_group_name: resourceGroup.name,
    });

  // Create a Metric Alert with defult settings in Log Analytics Workspace
  import * as ma from "./lib/azure-metricalert";
  new ma.MetricAlert(this, 'metricAlert', {
    name: `myMetricalert`,
    resourceGroupName: resourceGroup.name,
    scopes: [logAnalyticsWorkspace.id],
    criteria: [
      {
        metricName: "Heartbeat",
        metricNamespace: "Microsoft.operationalinsights/workspaces",
        aggregation: "Average",
        operator: "LessThan",
        threshold: 100,
      },
    ],
  });

```

Full example can be found [here](test/ExampleMetricAlert.ts).
