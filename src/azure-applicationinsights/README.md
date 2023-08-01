# Azure Application Insights Construct

This class represents an Application Insights resource in Azure. It provides a convenient way to manage Azure Application Insights resources.

## What is Azure Application Insights?

Azure Application Insights is an extensible Application Performance Management (APM) service for developers and DevOps professionals. Use it to monitor your live applications. It automatically detects performance anomalies, and includes powerful analytics tools to help you diagnose issues and to understand what users actually do with your app.

You can learn more about Azure Application Insights in the [official Azure documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview).

## Application Insights Best Practices

- Enable Application Insights during development and use it for all environments, including production.
- Use multiple Application Insights resources for different environments and use Azure resource tags to filter and identify them.
- Leverage the data retention policy to retain data according to your requirements.

## Application Insights Class Properties

This class has several properties that control the Application Insights resource's behaviour:

- `name`: The name of the Application Insights resource.
- `location`: The Azure Region where the Application Insights resource will be deployed.
- `resource_group_name`: The name of the Azure Resource Group.
- `retention_in_days`: The number of days of retention.
- `tags`: The tags to assign to the Application Insights resource.
- `application_type`: The Application type.
- `daily_data_cap_in_gb`: The Application Insights daily data cap in GB.
- `daily_data_cap_notification_disabled`: The Application Insights daily data cap notifications disabled.
- `workspace_id`: The id of the Log Analytics Workspace.

## Deploying the Application Insights

You can deploy an Application Insights resource using this class like so:

```typescript
const azureAppInsights = new AzureApplicationInsights(this, 'myAppInsights', {
  name: 'myAppInsights',
  location: 'West US',
  resource_group_name: 'myResourceGroup',
  application_type: 'web',
  daily_data_cap_in_gb: 10,
  daily_data_cap_notification_disabled: false,
  retention_in_days: 90,
  workspace_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  tags: {
    'env': 'production',
  },
});
```

This code will create a new Application Insights resource named myAppInsights in the West US Azure region with a production environment tag. The resource belongs to the resource group myResourceGroup, it has a daily data cap of 10 GB, sends notifications when the daily data cap is reached, retains data for 90 days, and uses the provided workspace ID.