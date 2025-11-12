# Azure Diagnostic Settings Construct

This module provides a version-aware implementation of Azure Diagnostic Settings using the AzapiResource framework.

## Overview

Azure Diagnostic Settings enable monitoring and observability by exporting platform logs and metrics to one or more destinations:
- **Log Analytics workspaces** - For querying and analysis
- **Storage accounts** - For long-term archival
- **Event Hubs** - For streaming to external systems

## Features

- ✅ **Version-aware** - Automatic API version management
- ✅ **Schema validation** - Input validation against Azure API schemas
- ✅ **Type-safe** - Full TypeScript type definitions
- ✅ **JSII-compliant** - Multi-language support (TypeScript, Python, Java, .NET)
- ✅ **Multiple destinations** - Support for workspace, storage, and event hub
- ✅ **Flexible configuration** - Category-based log and metric filtering

## Supported API Versions

- **2016-09-01** (Stable, Default) - Latest stable non-preview version
- **2021-05-01-preview** (Preview) - Latest preview version with additional features

## Installation

This module is part of the `@microsoft/terraform-cdk-constructs` package.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Usage

### Basic Example with Log Analytics

```typescript
import { DiagnosticSettings } from "@microsoft/terraform-cdk-constructs/azure-diagnosticsettings";
import { VirtualMachine } from "@microsoft/terraform-cdk-constructs/azure-virtualmachine";

// Create a virtual machine
const vm = new VirtualMachine(this, "my-vm", {
  name: "my-vm",
  resourceGroupId: resourceGroup.id,
  location: "eastus",
  // ... other VM configuration
});

// Add diagnostic settings
const diagnostics = new DiagnosticSettings(this, "vm-diagnostics", {
  name: "vm-diagnostics",
  targetResourceId: vm.id,
  workspaceId: logAnalyticsWorkspace.id,
  logs: [{
    categoryGroup: "allLogs",
    enabled: true
  }],
  metrics: [{
    category: "AllMetrics",
    enabled: true
  }]
});
```

### Multiple Destinations

```typescript
const diagnostics = new DiagnosticSettings(this, "storage-diagnostics", {
  name: "storage-diagnostics",
  targetResourceId: storageAccount.id,
  
  // Log Analytics for querying
  workspaceId: logAnalyticsWorkspace.id,
  
  // Storage for archival
  storageAccountId: archiveStorageAccount.id,
  
  // Event Hub for streaming
  eventHubAuthorizationRuleId: eventHub.authRuleId,
  eventHubName: "monitoring-hub",
  
  logs: [{
    category: "StorageRead",
    enabled: true,
    retentionPolicy: {
      enabled: true,
      days: 90
    }
  }, {
    category: "StorageWrite",
    enabled: true,
    retentionPolicy: {
      enabled: true,
      days: 90
    }
  }],
  
  metrics: [{
    category: "Transaction",
    enabled: true,
    retentionPolicy: {
      enabled: true,
      days: 30
    }
  }]
});
```

### Integrated Monitoring (via AzapiResource)

Resources extending `AzapiResource` can use the integrated monitoring configuration:

```typescript
const vm = new VirtualMachine(this, "my-vm", {
  name: "my-vm",
  resourceGroupId: resourceGroup.id,
  location: "eastus",
  
  monitoring: {
    enabled: true,
    diagnosticSettings: {
      workspaceId: logAnalyticsWorkspace.id,
      logs: [{
        categoryGroup: "allLogs",
        enabled: true
      }],
      metrics: [{
        category: "AllMetrics",
        enabled: true
      }]
    },
    metricAlerts: [{
      name: "high-cpu-alert",
      severity: 2,
      criteria: {
        // metric alert criteria
      }
    }]
  }
});
```

## Configuration

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Name of the diagnostic setting |
| `targetResourceId` | `string` | Resource ID to attach diagnostic settings to |

**Note**: At least one destination (`workspaceId`, `storageAccountId`, or `eventHubAuthorizationRuleId`) must be specified.

### Destination Properties

| Property | Type | Description |
|----------|------|-------------|
| `workspaceId` | `string` | Log Analytics workspace resource ID |
| `storageAccountId` | `string` | Storage account resource ID for archival |
| `eventHubAuthorizationRuleId` | `string` | Event Hub authorization rule ID |
| `eventHubName` | `string` | Event Hub name (required if `eventHubAuthorizationRuleId` is set) |
| `logAnalyticsDestinationType` | `string` | Destination type: `Dedicated` or `AzureDiagnostics` |

### Log Configuration

```typescript
interface DiagnosticLogConfig {
  category?: string;           // Specific log category
  categoryGroup?: string;      // Log category group (e.g., "allLogs")
  enabled: boolean;           // Enable this log category
  retentionPolicy?: {
    enabled: boolean;
    days: number;             // Retention period in days
  };
}
```

### Metric Configuration

```typescript
interface DiagnosticMetricConfig {
  category: string;           // Metric category (e.g., "AllMetrics")
  enabled: boolean;           // Enable this metric category
  retentionPolicy?: {
    enabled: boolean;
    days: number;             // Retention period in days
  };
}
```

## Common Patterns

### All Logs and Metrics

```typescript
const diagnostics = new DiagnosticSettings(this, "complete-monitoring", {
  name: "complete-diagnostics",
  targetResourceId: resource.id,
  workspaceId: workspace.id,
  logs: [{
    categoryGroup: "allLogs",
    enabled: true
  }],
  metrics: [{
    category: "AllMetrics",
    enabled: true
  }]
});
```

### Selective Logging with Retention

```typescript
const diagnostics = new DiagnosticSettings(this, "selective-logging", {
  name: "audit-only",
  targetResourceId: resource.id,
  storageAccountId: archiveStorage.id,
  logs: [{
    category: "AuditEvent",
    enabled: true,
    retentionPolicy: {
      enabled: true,
      days: 365
    }
  }, {
    category: "SecurityEvent",
    enabled: true,
    retentionPolicy: {
      enabled: true,
      days: 365
    }
  }],
  metrics: [{
    category: "AllMetrics",
    enabled: false
  }]
});
```

### Streaming to Event Hub

```typescript
const diagnostics = new DiagnosticSettings(this, "stream-to-siem", {
  name: "siem-streaming",
  targetResourceId: resource.id,
  eventHubAuthorizationRuleId: eventHub.authRuleId,
  eventHubName: "security-events",
  logs: [{
    category: "SecurityEvent",
    enabled: true
  }]
});
```

## API Version Management

### Using Default Stable Version (Recommended)

```typescript
// Automatically uses the stable version (2016-09-01)
const diagnostics = new DiagnosticSettings(this, "diagnostics", {
  name: "my-diagnostics",
  targetResourceId: resource.id,
  workspaceId: workspace.id
});
```

### Using Preview Version for Latest Features

```typescript
// Use preview version for category groups and other new features
const diagnostics = new DiagnosticSettings(this, "diagnostics", {
  name: "my-diagnostics",
  targetResourceId: resource.id,
  workspaceId: workspace.id,
  apiVersion: "2021-05-01-preview"  // Preview version
});
```

### Explicit Version Pinning

```typescript
// Explicitly specify version for full control
const diagnostics = new DiagnosticSettings(this, "diagnostics", {
  name: "my-diagnostics",
  targetResourceId: resource.id,
  workspaceId: workspace.id,
  apiVersion: "2016-09-01"  // Stable version
});
```

## Validation

The construct automatically validates:
- ✅ At least one destination is specified
- ✅ `eventHubName` is provided when `eventHubAuthorizationRuleId` is set
- ✅ Required properties are present
- ✅ Property types match schema definitions

## Best Practices

1. **Use Log Analytics for Querying**: Send logs to Log Analytics for powerful query capabilities
2. **Use Storage for Archival**: Configure long-term retention in storage accounts
3. **Use Event Hub for Integration**: Stream to external SIEM or monitoring systems
4. **Enable All Logs Initially**: Start with `categoryGroup: "allLogs"` and refine based on needs
5. **Set Appropriate Retention**: Balance between compliance requirements and storage costs
6. **Monitor Ingestion Costs**: Track Log Analytics ingestion and storage costs

## Troubleshooting

### Error: "At least one destination must be specified"

**Cause**: No destination (workspace, storage, or event hub) was provided.

**Solution**: Specify at least one of:
- `workspaceId`
- `storageAccountId`
- `eventHubAuthorizationRuleId`

### Error: "eventHubName is required when eventHubAuthorizationRuleId is specified"

**Cause**: `eventHubAuthorizationRuleId` was provided without `eventHubName`.

**Solution**: Add the `eventHubName` property:

```typescript
{
  eventHubAuthorizationRuleId: eventHub.authRuleId,
  eventHubName: "my-event-hub"  // Add this
}
```

## Related Constructs

- [`ActionGroup`](../azure-actiongroup/README.md) - Alert notification groups
- [`MetricAlert`](../azure-metricalert/README.md) - Metric-based alerting
- [`ActivityLogAlert`](../azure-activitylogalert/README.md) - Activity log alerting

## Migration from Old Pattern

If you were using the old `AzapiDiagnosticSettings` helper class, migrate to the new construct:

### Before (Old Pattern)

```typescript
// This pattern is no longer supported
resource.addDiagnosticSettings({
  workspaceId: workspace.id,
  metrics: ["AllMetrics"]
});
```

### After (New Pattern)

```typescript
// Use the full construct
import { DiagnosticSettings } from "@microsoft/terraform-cdk-constructs/azure-diagnosticsettings";

new DiagnosticSettings(this, "diagnostics", {
  name: "diagnostics",
  targetResourceId: resource.id,
  workspaceId: workspace.id,
  metrics: [{
    category: "AllMetrics",
    enabled: true
  }]
});
```

Or use integrated monitoring:

```typescript
// Via monitoring configuration
const resource = new SomeResource(this, "resource", {
  // ... resource props
  monitoring: {
    diagnosticSettings: {
      workspaceId: workspace.id,
      metrics: [{
        category: "AllMetrics",
        enabled: true
      }]
    }
  }
});
```

## References

- [Azure Diagnostic Settings Documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/diagnostic-settings)
- [Azure Monitor Documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/)
- [Log Analytics Documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview)