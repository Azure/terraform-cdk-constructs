# Azure Application Insights Construct

This module provides a high-level TypeScript construct for managing Azure Application Insights components using the Terraform CDK and Azure AZAPI provider.

Application Insights is an extensible Application Performance Management (APM) service for live web applications. It automatically detects performance anomalies and includes powerful analytics tools to help you diagnose issues and understand application usage.

> **Note**: This construct creates **workspace-based** Application Insights components. The classic (standalone) Application Insights resource was retired on February 29, 2024 and is no longer supported. A Log Analytics Workspace is required.

## Features

- **Workspace-based Application Insights**: Modern, supported deployment model that integrates with Log Analytics
- **Automatic Version Resolution**: Uses the latest API version by default
- **Version Pinning**: Lock to a specific API version for stability
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **JSII Compatible**: Can be used from TypeScript, Python, Java, and C#
- **Terraform Outputs**: Automatic creation of outputs for id, name, instrumentation key, connection string, and app id
- **Tag Management**: Built-in support for resource tags

## Supported API Versions

| Version | Status | Release Date | Notes |
|---------|--------|--------------|-------|
| 2020-02-02 | Active (Latest) | 2020-02-02 | Workspace-based Application Insights (recommended) |

## Installation

This module is part of the `@microsoft/terraform-cdk-constructs` package.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Basic Usage

### Simple Application Insights Component

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { LogAnalyticsWorkspace } from "@microsoft/terraform-cdk-constructs/azure-loganalyticsworkspace";
import { ApplicationInsights } from "@microsoft/terraform-cdk-constructs/azure-applicationinsights";

const app = new App();
const stack = new TerraformStack(app, "application-insights-stack");

// Configure the Azure provider
new AzapiProvider(stack, "azapi", {});

// Create a resource group
const resourceGroup = new ResourceGroup(stack, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

// Create a Log Analytics Workspace (required)
const workspace = new LogAnalyticsWorkspace(stack, "workspace", {
  name: "my-log-analytics",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
});

// Create an Application Insights component
const appInsights = new ApplicationInsights(stack, "appinsights", {
  name: "my-application-insights",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceResourceId: workspace.id,
  tags: {
    environment: "production",
    project: "monitoring",
  },
});

app.synth();
```

## Advanced Usage

### Custom Application Type

```typescript
const javaAppInsights = new ApplicationInsights(stack, "java-ai", {
  name: "my-java-app",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceResourceId: workspace.id,
  applicationType: "java",
});
```

### Custom Retention Period

```typescript
const appInsights = new ApplicationInsights(stack, "ai-retention", {
  name: "ai-with-retention",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceResourceId: workspace.id,
  retentionInDays: 365, // Allowed: 30, 60, 90, 120, 180, 270, 365, 550, 730
});
```

### Sampling Configuration

```typescript
const appInsights = new ApplicationInsights(stack, "ai-sampling", {
  name: "ai-with-sampling",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceResourceId: workspace.id,
  samplingPercentage: 50, // Capture 50% of telemetry to reduce ingestion volume
});
```

### Private Network Access

```typescript
const appInsights = new ApplicationInsights(stack, "ai-private", {
  name: "ai-private",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceResourceId: workspace.id,
  publicNetworkAccessForIngestion: "Disabled",
  publicNetworkAccessForQuery: "Disabled",
});
```

### Disable Local Authentication

Force the use of Microsoft Entra ID (Azure AD) authentication:

```typescript
const appInsights = new ApplicationInsights(stack, "ai-aad", {
  name: "ai-aad-only",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceResourceId: workspace.id,
  disableLocalAuth: true,
});
```

### Disable IP Masking

```typescript
const appInsights = new ApplicationInsights(stack, "ai-no-mask", {
  name: "ai-no-mask",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceResourceId: workspace.id,
  disableIpMasking: true,
});
```

### Pinning to a Specific API Version

```typescript
const appInsights = new ApplicationInsights(stack, "ai-pinned", {
  name: "ai-stable",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceResourceId: workspace.id,
  apiVersion: "2020-02-02", // Pin to specific version
});
```

### Using Outputs

```typescript
const appInsights = new ApplicationInsights(stack, "appinsights", {
  name: "my-ai",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceResourceId: workspace.id,
});

// Reference the connection string from your application configuration
new TerraformOutput(stack, "ai-connection-string", {
  value: appInsights.connectionStringOutput,
  sensitive: true,
});

new TerraformOutput(stack, "ai-instrumentation-key", {
  value: appInsights.instrumentationKeyOutput,
  sensitive: true,
});
```

## API Reference

### ApplicationInsightsProps

Configuration properties for the Application Insights construct.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | No* | Name of the component. If not provided, uses the construct ID. |
| `location` | `string` | Yes | Azure region where the component will be created. |
| `resourceGroupId` | `string` | Yes | Resource group ID where the component will be created. |
| `workspaceResourceId` | `string` | Yes | Resource ID of the associated Log Analytics workspace. |
| `applicationType` | `string` | No | Application type: `"web"`, `"other"`, `"java"`, `"MobileCenter"`, `"Node.JS"`, `"ios"`, `"store"`. Default: `"web"`. |
| `retentionInDays` | `number` | No | Retention in days. Allowed: 30, 60, 90, 120, 180, 270, 365, 550, 730. Default: 90. |
| `samplingPercentage` | `number` | No | Telemetry sampling percentage (0-100). |
| `disableIpMasking` | `boolean` | No | Disable IP masking. Default: `false`. |
| `publicNetworkAccessForIngestion` | `"Enabled" \| "Disabled"` | No | Network access for ingestion. Default: `"Enabled"`. |
| `publicNetworkAccessForQuery` | `"Enabled" \| "Disabled"` | No | Network access for querying. Default: `"Enabled"`. |
| `disableLocalAuth` | `boolean` | No | Disable local (key-based) authentication. Default: `false`. |
| `forceCustomerStorageForProfiler` | `boolean` | No | Force customer-provided storage for profiler/snapshot debugger. Default: `false`. |
| `tags` | `{ [key: string]: string }` | No | Resource tags. |
| `apiVersion` | `string` | No | Pin to a specific API version. |

### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The Azure resource ID of the Application Insights component. |
| `props` | `ApplicationInsightsProps` | The original input properties. |
| `resolvedApiVersion` | `string` | The API version being used. |

### Outputs

The construct automatically creates Terraform outputs:

- `id`: The component resource ID
- `name`: The component name
- `instrumentation_key`: The instrumentation key (sensitive)
- `connection_string`: The connection string (sensitive)
- `app_id`: The App ID used by the Application Insights REST API

## Best Practices

### 1. Use Workspace-Based Components

Always associate Application Insights with a Log Analytics workspace for unified analytics and the latest features:

```typescript
const appInsights = new ApplicationInsights(stack, "ai", {
  name: "my-ai",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceResourceId: workspace.id,
});
```

### 2. Use Sampling for High-Volume Applications

Reduce ingestion costs by sampling telemetry from busy applications:

```typescript
const appInsights = new ApplicationInsights(stack, "ai", {
  name: "high-volume-ai",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceResourceId: workspace.id,
  samplingPercentage: 25, // Sample 25% of telemetry
});
```

### 3. Disable Local Auth for Security-Sensitive Workloads

```typescript
const appInsights = new ApplicationInsights(stack, "ai", {
  name: "secure-ai",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceResourceId: workspace.id,
  disableLocalAuth: true,
});
```

### 4. Apply Consistent Tags

```typescript
const appInsights = new ApplicationInsights(stack, "ai", {
  name: "my-ai",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceResourceId: workspace.id,
  tags: {
    environment: "production",
    "cost-center": "platform-team",
    "managed-by": "terraform",
  },
});
```

## Troubleshooting

### Common Issues

1. **Invalid Retention Value**: `retentionInDays` must be one of 30, 60, 90, 120, 180, 270, 365, 550, 730.

2. **Invalid Sampling Percentage**: `samplingPercentage` must be between 0 and 100.

3. **Missing Workspace**: A `workspaceResourceId` is required because workspace-based Application Insights is the only supported deployment model.

4. **Name Validation**: Application Insights component names must be 1-260 characters.

## Related Constructs

- [`ResourceGroup`](../azure-resourcegroup/README.md) - Azure Resource Groups
- [`LogAnalyticsWorkspace`](../azure-loganalyticsworkspace/README.md) - Backing workspace for Application Insights
- [`DiagnosticSettings`](../azure-diagnosticsettings/README.md) - Send diagnostic logs to a workspace
- [`MetricAlert`](../azure-metricalert/README.md) - Create metric-based alerts

## Additional Resources

- [Azure Application Insights Documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [Workspace-based Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/create-workspace-resource)
- [Azure REST API Reference](https://learn.microsoft.com/en-us/rest/api/application-insights/components)
- [Terraform CDK Documentation](https://developer.hashicorp.com/terraform/cdktf)

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
