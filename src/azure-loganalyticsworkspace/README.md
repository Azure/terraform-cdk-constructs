# Azure Log Analytics Workspace Construct

This module provides a high-level TypeScript construct for managing Azure Log Analytics Workspaces using the Terraform CDK and Azure AZAPI provider.

## Features

- **Multiple API Version Support**: Supports 2023-09-01 (latest) and 2022-10-01 (for backward compatibility)
- **Automatic Version Resolution**: Uses the latest API version by default
- **Version Pinning**: Lock to a specific API version for stability
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **JSII Compatible**: Can be used from TypeScript, Python, Java, and C#
- **Terraform Outputs**: Automatic creation of outputs for id, name, workspaceId, and customerId
- **Tag Management**: Built-in methods for managing resource tags

## Supported API Versions

| Version | Status | Release Date | Notes |
|---------|--------|--------------|-------|
| 2023-09-01 | Active (Latest) | 2023-09-01 | Recommended for new deployments, includes Data Collection Rule support |
| 2022-10-01 | Active | 2022-10-01 | Stable release for backward compatibility |

## Installation

This module is part of the `@microsoft/terraform-cdk-constructs` package.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Basic Usage

### Simple Log Analytics Workspace

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { LogAnalyticsWorkspace } from "@microsoft/terraform-cdk-constructs/azure-loganalyticsworkspace";

const app = new App();
const stack = new TerraformStack(app, "log-analytics-stack");

// Configure the Azure provider
new AzapiProvider(stack, "azapi", {});

// Create a resource group
const resourceGroup = new ResourceGroup(stack, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

// Create a Log Analytics Workspace
const workspace = new LogAnalyticsWorkspace(stack, "workspace", {
  name: "my-log-analytics",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  tags: {
    environment: "production",
    project: "monitoring",
  },
});

app.synth();
```

## Advanced Usage

### Custom Retention Period

```typescript
const workspace = new LogAnalyticsWorkspace(stack, "workspace-retention", {
  name: "workspace-with-retention",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  retentionInDays: 90, // Keep data for 90 days (range: 30-730)
});
```

### PerGB2018 Pricing (Pay-as-you-go)

```typescript
const workspace = new LogAnalyticsWorkspace(stack, "workspace-pergb", {
  name: "workspace-pergb",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "PerGB2018",
  },
  retentionInDays: 60,
});
```

### Capacity Reservation Pricing

```typescript
const workspace = new LogAnalyticsWorkspace(stack, "workspace-capacity", {
  name: "workspace-capacity-reservation",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "CapacityReservation",
    capacityReservationLevel: 500, // Valid values: 100, 200, 300, 400, 500, 1000, 2000, 5000
  },
  retentionInDays: 365,
});
```

### Daily Volume Cap (Workspace Capping)

```typescript
const workspace = new LogAnalyticsWorkspace(stack, "workspace-capped", {
  name: "workspace-with-cap",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceCapping: {
    dailyQuotaGb: 100, // Stop ingestion after 100GB per day
  },
});
```

### Private Network Access

```typescript
const workspace = new LogAnalyticsWorkspace(stack, "workspace-private", {
  name: "workspace-private",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  publicNetworkAccessForIngestion: "Disabled",
  publicNetworkAccessForQuery: "Disabled",
});
```

### Workspace Features

```typescript
const workspace = new LogAnalyticsWorkspace(stack, "workspace-features", {
  name: "workspace-with-features",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  features: {
    enableDataExport: true,
    immediatePurgeDataOn30Days: false,
    disableLocalAuth: true,
    enableLogAccessUsingOnlyResourcePermissions: true,
  },
});
```

### Managed Identity

```typescript
const workspace = new LogAnalyticsWorkspace(stack, "workspace-identity", {
  name: "workspace-with-identity",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  identity: {
    type: "SystemAssigned",
  },
});
```

### Pinning to a Specific API Version

```typescript
const workspace = new LogAnalyticsWorkspace(stack, "workspace-pinned", {
  name: "workspace-stable",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  apiVersion: "2022-10-01", // Pin to specific version
});
```

### Using Outputs

```typescript
const workspace = new LogAnalyticsWorkspace(stack, "workspace", {
  name: "my-workspace",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
});

// Access workspace ID for use in other resources (e.g., Diagnostic Settings)
console.log(workspace.id); // Terraform interpolation string

// Use outputs for cross-stack references
new TerraformOutput(stack, "workspace-id", {
  value: workspace.idOutput,
});

new TerraformOutput(stack, "workspace-customer-id", {
  value: workspace.customerIdOutput,
});
```

## API Reference

### LogAnalyticsWorkspaceProps

Configuration properties for the Log Analytics Workspace construct.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | No* | Name of the workspace. If not provided, uses the construct ID. Must be 4-63 characters, alphanumeric and hyphens. |
| `location` | `string` | Yes | Azure region where the workspace will be created. |
| `resourceGroupId` | `string` | Yes | Resource group ID where the workspace will be created. |
| `retentionInDays` | `number` | No | Data retention in days (30-730). Default: 30. |
| `sku` | `LogAnalyticsWorkspaceSku` | No | SKU configuration. Default: { name: "PerGB2018" }. |
| `workspaceCapping` | `LogAnalyticsWorkspaceCapping` | No | Daily volume cap configuration. |
| `publicNetworkAccessForIngestion` | `"Enabled" \| "Disabled"` | No | Network access for data ingestion. Default: "Enabled". |
| `publicNetworkAccessForQuery` | `"Enabled" \| "Disabled"` | No | Network access for queries. Default: "Enabled". |
| `features` | `LogAnalyticsWorkspaceFeatures` | No | Workspace feature flags. |
| `forceCmkForQuery` | `boolean` | No | Require customer-managed keys for saved searches/alerts. |
| `defaultDataCollectionRuleResourceId` | `string` | No | Default DCR resource ID (API 2023-09-01+). |
| `identity` | `LogAnalyticsWorkspaceIdentity` | No | Managed identity configuration. |
| `tags` | `{ [key: string]: string }` | No | Resource tags. |
| `apiVersion` | `string` | No | Pin to a specific API version. |

### LogAnalyticsWorkspaceSku

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | SKU name: "Free", "Standard", "Premium", "PerNode", "PerGB2018", "Standalone", "CapacityReservation" |
| `capacityReservationLevel` | `number` | No | Capacity in GB/day for CapacityReservation SKU. Valid: 100, 200, 300, 400, 500, 1000, 2000, 5000. |

### LogAnalyticsWorkspaceCapping

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `dailyQuotaGb` | `number` | Yes | Daily volume cap in GB. Use -1 for no cap. |

### LogAnalyticsWorkspaceFeatures

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `enableDataExport` | `boolean` | No | Enable data export capability. |
| `immediatePurgeDataOn30Days` | `boolean` | No | Purge data immediately after 30 days. |
| `disableLocalAuth` | `boolean` | No | Disable local authentication. |
| `enableLogAccessUsingOnlyResourcePermissions` | `boolean` | No | Enable resource-based access only. |

### LogAnalyticsWorkspaceIdentity

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Identity type: "SystemAssigned", "UserAssigned", "SystemAssigned,UserAssigned", "None" |
| `userAssignedIdentities` | `object` | No | User-assigned identity resource IDs. |

### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The Azure resource ID of the workspace. |
| `props` | `LogAnalyticsWorkspaceProps` | The original input properties. |
| `resolvedApiVersion` | `string` | The API version being used. |

### Outputs

The construct automatically creates Terraform outputs:

- `id`: The workspace resource ID
- `name`: The workspace name
- `workspace_id`: The workspace unique identifier (GUID)
- `customer_id`: The workspace customer ID (same as workspace_id)

### Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `addTag` | `key: string, value: string` | Add a tag to the workspace. |
| `addAccess` | `objectId: string, roleDefinitionName: string` | Add RBAC role assignment. |

## Best Practices

### 1. Use PerGB2018 for Most Workloads

Unless you have specific requirements, the pay-as-you-go model is most cost-effective:

```typescript
const workspace = new LogAnalyticsWorkspace(stack, "workspace", {
  name: "my-workspace",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "PerGB2018" },
});
```

### 2. Set Appropriate Retention

Balance between compliance requirements and cost:

```typescript
// Production: longer retention for compliance
const prodWorkspace = new LogAnalyticsWorkspace(stack, "prod-workspace", {
  name: "prod-logs",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  retentionInDays: 365,
});

// Development: shorter retention to save costs
const devWorkspace = new LogAnalyticsWorkspace(stack, "dev-workspace", {
  name: "dev-logs", 
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  retentionInDays: 30,
});
```

### 3. Use Daily Cap for Cost Control

Prevent unexpected charges from log spikes:

```typescript
const workspace = new LogAnalyticsWorkspace(stack, "workspace", {
  name: "cost-controlled",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  workspaceCapping: {
    dailyQuotaGb: 50, // Stop at 50GB/day
  },
});
```

### 4. Apply Consistent Tags

```typescript
const workspace = new LogAnalyticsWorkspace(stack, "workspace", {
  name: "my-workspace",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  tags: {
    environment: "production",
    "cost-center": "platform-team",
    "managed-by": "terraform",
  },
});
```

## Troubleshooting

### Common Issues

1. **Retention Out of Range**: Ensure `retentionInDays` is between 30 and 730.

2. **Invalid Capacity Reservation Level**: Valid values are 100, 200, 300, 400, 500, 1000, 2000, 5000.

3. **Name Validation**: Workspace names must be 4-63 characters, start and end with alphanumeric, and contain only letters, numbers, and hyphens.

4. **API Version Errors**: Ensure the version is 2023-09-01 or 2022-10-01.

## Related Constructs

- [`ResourceGroup`](../azure-resourcegroup/README.md) - Azure Resource Groups
- [`DiagnosticSettings`](../azure-diagnosticsettings/README.md) - Send logs to this workspace
- [`MetricAlert`](../azure-metricalert/README.md) - Create alerts based on workspace metrics

## Additional Resources

- [Azure Log Analytics Documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview)
- [Log Analytics Pricing](https://azure.microsoft.com/en-us/pricing/details/monitor/)
- [Azure REST API Reference](https://learn.microsoft.com/en-us/rest/api/loganalytics/)
- [Terraform CDK Documentation](https://developer.hashicorp.com/terraform/cdktf)

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
