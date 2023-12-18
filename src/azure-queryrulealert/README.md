# Azure Scheduled Query Rule Alert Construct

This class represents a Scheduled Query Rule Alert resource (a.k.a. Log Query Alert) in Azure.

## What is Azure Scheduled Query Rule Alert?

An Azure Scheduled Query Rule Alert lets us monitor a specific condition in Azure resources using log data. We can use KQL language to analyze logs, set alert triggering conditions when query results meet defined conditions, and configure notifications to respond to potential problems timely. This helps maintain the health, performance, and security of our Azure environment.

You can learn more about Azure Query Rule Alert in the [official Azure documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/tutorial-log-alert).

## Azure Scheduled Query Rule Alert Class Properties

This class has several properties that control the Alert Rules:

- `name`: The name of the Monitor Scheduled Query Rule.
- `resourceGroupName`: The name of the resource group in which the Monitor Scheduled Query Rule is created.
- `location`: The location of the Monitor Scheduled Query Rule.
- `criteriaOperator`: Specifies the criteria operator. Possible values are Equal, GreaterThan, GreaterThanOrEqual, LessThan,and LessThanOrEqual.
- `criteriaQuery`: The query to run on logs. The results returned by this query are used to populate the alert.
- `criteriaThreshold`: Specifies the criteria threshold value that activates the alert.
- `criteriatimeAggregationMethod`: The type of aggregation to apply to the data points in aggregation granularity. Possible values are Average, Count, Maximum, Minimum,and Total.
- `criteriaMetricMeasureColumn`: Specifies the column containing the metric measure number.
- `evaluationFrequency`: How often the scheduled query rule is evaluated, represented in ISO 8601 duration format. Possible values are PT1M, PT5M, PT10M, PT15M, PT30M, PT45M, PT1H, PT2H, PT3H, PT4H, PT5H, PT6H, P1D.
- `scopes`: Specifies the list of resource IDs that this scheduled query rule is scoped to.
- `severity`: Severity of the alert. Should be an integer between 0 and 4. Value of 0 is severest.
- `windowDuration`: Specifies the period of time in ISO 8601 duration format on which the Scheduled Query Rule will be executed (bin size).
- `criteriaDimension`: (Optional) Specifies the dimension of the criteria.
  - `name`: Name of the dimension.
  - `operator`: Operator for dimension values. Possible values are Exclude,and Include.
  - `values`: List of dimension values. Use a wildcard * to collect all.
- `criteriaFailingPeriods`: (Optional) Specifies the number of evaluation periods.
  - `minimumFailingPeriodsToTriggerAlert`: Specifies the number of violations to trigger an alert. Should be smaller or equal to number_of_evaluation_periods. Possible value is integer between 1 and 6.
  - `numberOfEvaluationPeriods`: Specifies the number of evaluation periods. Possible value is integer between 1 and 6.
- `actionActionGroupId`: (Optional) Specifies the action group IDs to trigger when the alert fires.
- `autoMitigationEnabled`: (Optional) Specifies the flag that indicates whether the alert should be automatically resolved or not. Defaults to false.
- `workspaceAlertsStorageEnabled`: (Optional) Specifies the flag which indicates whether this scheduled query rule check if storage is configured. Defaults to false.
- `description`: (Optional) Specifies the description of the scheduled query rule.
- `displayName`: (Optional) Specifies the display name of the alert rule.
- `enabled`: (Optional) Specifies the flag which indicates whether this scheduled query rule is enabled. Defaults to true.
- `muteActionsAfterAlertDuration`: (Optional) Mute actions for the chosen period of time in ISO 8601 duration format after the alert is fired. Possible values are PT5M, PT10M, PT15M, PT30M, PT45M, PT1H, PT2H, PT3H, PT4H, PT5H, PT6H, P1D and P2D.
- `queryTimeRangeOverride`: (Optional) Set this if the alert evaluation period is different from the query time range. If not specified, the value is window_duration*number_of_evaluation_periods. Possible values are PT5M, PT10M, PT15M, PT20M, PT30M, PT45M, PT1H, PT2H, PT3H, PT4H, PT5H, PT6H, P1D and P2D.
- `skipQueryValidation`: (Optional) Specifies the flag which indicates whether the provided query should be validated or not. Defaults to true.
- `tags`: (Optional) A mapping of tags which should be assigned to the Monitor Scheduled Query Rule.

## Deploying a Scheduled Query Rule Alert

You can deploy a Scheduled Query Rule Alert using this class like so:

```typescript
  // Create a Resource Group first
  const resourceGroup = new AzureResourceGroup(this, "myResourceGroup", {
    name: 'myResourceGroup',
    location: 'eastus',
  });

  // Create a Scheduled Query Rule Alert with defult settings
  const queryRuleAlert = new AzureQueryRuleAlert(this, 'queryRuleAlert', {
      name: `qra-${this.name}`,
      resourceGroupName: resourceGroup.name,
      location: 'eastus',
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

```

Full example can be found [here](test/ExampleAzureQueryRuleAlert.ts).
