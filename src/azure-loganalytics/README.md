# Azure Log Analytics Workspace Construct

This class represents a Log Analytics Workspace in Azure. It provides a convenient way to manage Azure Log Analytics Workspaces.

## What is a Log Analytics Workspace?

Azure Log Analytics Workspace is a unique environment for Azure Monitor log data. Each workspace has its own data repository and configuration, and data sources and solutions are configured to store their data in that workspace.

You can learn more about Log Analytics Workspace in the [official Azure documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/data-platform-logs).

## Log Analytics Workspace Best Practices

- Consolidate your data in a limited number of workspaces.
- Assign a workspace at the management group level.
- Log minimal data initially, and then increase as necessary.
- Create a data export rule for long-term retention and cold data.
- Assign Azure RBAC roles for Azure Monitor Logs.

## Log Analytics Workspace Class Properties

This class has several properties that control the Log Analytics Workspace's behaviour:

- `location`: The Azure Region where the Log Analytics Workspace will be deployed.
- `name`: The name of the Log Analytics Workspace.
- `resource_group_name`: The name of the Azure Resource Group.
- `sku`: The SKU of the Log Analytics Workspace.
- `retention`: The number of days of retention.
- `tags`: The tags to assign to the Resource Group.
- `rbac`: The RBAC groups to assign to the Resource Group.
- `data_export`: Creates a DataExport for the Log Analytics Workspace.
- `functions`: A collection of Log Analytic functions.
- `queries`: A collection of saved log analytics queries.

## Deploying the Log Analytics Workspace

You can deploy a Log Analytics Workspace using this class like so:

```typescript
const azureLogAnalytics = new AzureLogAnalytics(this, 'myLogAnalytics', {
  location: 'West US',
  name: 'myLogAnalytics',
  resource_group_name: 'myResourceGroup',
  sku: 'PerGB2018',
  retention: 30,
  tags: {
    'env': 'production',
  },
});
```
This code will create a new Log Analytics Workspace named myLogAnalytics in the West US Azure region with a production environment tag. The workspace belongs to the resource group myResourceGroup and uses the PerGB2018 pricing model. It retains data for 30 days.


## Cost Optimization
In Azure Log Analytics, you are charged for data ingestion and data retention. You pay almost 9x more for data ingested than for data stored. The first 30 days of storage retention are free.

To optimize your costs, consider filtering out what is being ingested. Only log data that will be used. To further reduce costs, consider using a data export rule for long-term retention and cold data.