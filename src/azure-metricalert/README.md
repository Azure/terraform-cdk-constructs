# Azure Metric Alert Construct

This construct provides a type-safe, version-aware implementation of Azure Metric Alerts using the AZAPI provider framework.

## Overview

Metric Alerts monitor Azure resource metrics and trigger notifications when thresholds are breached. They support both static thresholds and dynamic thresholds based on machine learning.

## Features

- **Version Management**: Automatic resolution to the latest stable API version (2018-03-01)
- **Type Safety**: Full TypeScript type definitions with JSII compliance
- **Static & Dynamic Thresholds**: Support for both threshold types
- **Multi-Resource Alerts**: Monitor metrics across multiple resources
- **Dimension Filtering**: Filter metrics by dimensions
- **Validation**: Schema-driven property validation
- **Multi-language**: Generated bindings for TypeScript, Python, Java, and C#

## Installation

This construct is part of the `@microsoft/terraform-cdk-constructs` package.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Usage

### Basic Static Threshold Alert

```typescript
import { MetricAlert } from "@microsoft/terraform-cdk-constructs/azure-metricalert";
import { ActionGroup } from "@microsoft/terraform-cdk-constructs/azure-actiongroup";
import { VirtualMachine } from "@microsoft/terraform-cdk-constructs/azure-virtualmachine";

const cpuAlert = new MetricAlert(this, "high-cpu", {
  name: "vm-high-cpu-alert",
  resourceGroupId: resourceGroup.id,
  severity: 2,
  scopes: [virtualMachine.id],
  criteria: {
    type: "StaticThreshold",
    metricName: "Percentage CPU",
    operator: "GreaterThan",
    threshold: 80,
    timeAggregation: "Average"
  },
  actions: [{
    actionGroupId: actionGroup.id
  }],
  tags: {
    Environment: "Production",
    AlertType: "Performance"
  }
});
```

### Dynamic Threshold Alert

```typescript
const dynamicAlert = new MetricAlert(this, "dynamic-cpu", {
  name: "vm-dynamic-cpu-alert",
  description: "Dynamic CPU threshold based on historical patterns",
  resourceGroupId: resourceGroup.id,
  severity: 2,
  scopes: [resourceGroup.id],
  targetResourceType: "Microsoft.Compute/virtualMachines",
  targetResourceRegion: "eastus",
  evaluationFrequency: "PT1M",
  windowSize: "PT5M",
  criteria: {
    type: "DynamicThreshold",
    metricName: "Percentage CPU",
    operator: "GreaterThan",
    alertSensitivity: "Medium",
    failingPeriods: {
      numberOfEvaluationPeriods: 4,
      minFailingPeriodsToAlert: 3
    },
    timeAggregation: "Average"
  },
  actions: [{
    actionGroupId: actionGroup.id
  }]
});
```

### Alert with Dimensions

```typescript
const dimensionAlert = new MetricAlert(this, "app-errors", {
  name: "app-service-errors",
  resourceGroupId: resourceGroup.id,
  severity: 1,
  scopes: [appService.id],
  criteria: {
    type: "StaticThreshold",
    metricName: "Http5xx",
    operator: "GreaterThan",
    threshold: 10,
    timeAggregation: "Total",
    dimensions: [{
      name: "Instance",
      operator: "Include",
      values: ["*"]
    }]
  },
  actions: [{
    actionGroupId: actionGroup.id,
    webHookProperties: {
      severity: "high",
      environment: "production"
    }
  }]
});
```

### Multi-Resource Alert

```typescript
const multiResourceAlert = new MetricAlert(this, "all-vms-cpu", {
  name: "all-vms-high-cpu",
  description: "Monitor CPU across all VMs in resource group",
  resourceGroupId: resourceGroup.id,
  severity: 3,
  scopes: [resourceGroup.id],
  targetResourceType: "Microsoft.Compute/virtualMachines",
  targetResourceRegion: "eastus",
  criteria: {
    type: "StaticThreshold",
    metricName: "Percentage CPU",
    operator: "GreaterThan",
    threshold: 90,
    timeAggregation: "Average"
  },
  actions: [{
    actionGroupId: actionGroup.id
  }]
});
```

## Properties

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | The name of the metric alert |
| `severity` | `0 \| 1 \| 2 \| 3 \| 4` | Alert severity (0=Critical, 4=Verbose) |
| `scopes` | `string[]` | Resource IDs that this alert is scoped to |
| `criteria` | `StaticThresholdCriteria \| DynamicThresholdCriteria` | Alert criteria |

### Optional Properties

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `location` | `string` | Azure region | `"global"` |
| `description` | `string` | Description of the alert rule | - |
| `enabled` | `boolean` | Whether the alert rule is enabled | `true` |
| `evaluationFrequency` | `string` | Evaluation frequency (ISO 8601) | `"PT5M"` |
| `windowSize` | `string` | Aggregation window (ISO 8601) | `"PT15M"` |
| `targetResourceType` | `string` | Resource type for multi-resource alerts | - |
| `targetResourceRegion` | `string` | Region for multi-resource alerts | - |
| `actions` | `MetricAlertAction[]` | Action groups to notify | `[]` |
| `autoMitigate` | `boolean` | Auto-resolve when condition clears | `true` |
| `tags` | `Record<string, string>` | Resource tags | `{}` |
| `resourceGroupId` | `string` | Resource group ID | Required |
| `apiVersion` | `string` | Explicit API version | Latest |

## Criteria Types

### StaticThresholdCriteria

```typescript
interface StaticThresholdCriteria {
  type: "StaticThreshold";
  metricName: string;
  metricNamespace?: string;
  operator: "GreaterThan" | "LessThan" | "GreaterOrEqual" | "LessOrEqual" | "Equals";
  threshold: number;
  timeAggregation: "Average" | "Count" | "Minimum" | "Maximum" | "Total";
  dimensions?: MetricDimension[];
}
```

### DynamicThresholdCriteria

```typescript
interface DynamicThresholdCriteria {
  type: "DynamicThreshold";
  metricName: string;
  metricNamespace?: string;
  operator: "GreaterThan" | "LessThan" | "GreaterOrLessThan";
  alertSensitivity: "Low" | "Medium" | "High";
  failingPeriods: {
    numberOfEvaluationPeriods: number;
    minFailingPeriodsToAlert: number;
  };
  timeAggregation: "Average" | "Count" | "Minimum" | "Maximum" | "Total";
  dimensions?: MetricDimension[];
  ignoreDataBefore?: string;  // ISO 8601 date
}
```

## Severity Levels

| Level | Name | Use Case |
|-------|------|----------|
| 0 | Critical | System down, immediate action required |
| 1 | Error | Major functionality impaired |
| 2 | Warning | Potential issue, monitoring required |
| 3 | Informational | FYI, no action needed |
| 4 | Verbose | Detailed information for debugging |

## Time Windows

Common ISO 8601 duration values:

- `PT1M` - 1 minute
- `PT5M` - 5 minutes (default evaluation frequency)
- `PT15M` - 15 minutes (default window size)
- `PT30M` - 30 minutes
- `PT1H` - 1 hour
- `PT6H` - 6 hours
- `PT12H` - 12 hours
- `PT24H` - 24 hours

## Dynamic Threshold Sensitivity

| Sensitivity | Description |
|-------------|-------------|
| Low | Loose bounds, fewer alerts |
| Medium | Balanced sensitivity (recommended) |
| High | Tight bounds, more alerts |

## Metric Dimensions

Filter metrics by specific dimension values:

```typescript
dimensions: [{
  name: "Instance",
  operator: "Include",
  values: ["instance1", "instance2"]
}, {
  name: "StatusCode",
  operator: "Exclude",
  values: ["404", "401"]
}]
```

## Common Metrics by Resource Type

### Virtual Machines
- `Percentage CPU`
- `Available Memory Bytes`
- `Disk Read Bytes`
- `Disk Write Bytes`
- `Network In Total`
- `Network Out Total`

### App Service
- `Http5xx`
- `Http4xx`
- `ResponseTime`
- `Requests`
- `CpuPercentage`
- `MemoryPercentage`

### Storage Account
- `UsedCapacity`
- `Transactions`
- `Availability`
- `SuccessE2ELatency`

### SQL Database
- `cpu_percent`
- `dtu_consumption_percent`
- `storage_percent`
- `connection_successful`
- `connection_failed`

## Best Practices

1. **Use Appropriate Severity**: Match severity to business impact
2. **Set Realistic Thresholds**: Base on historical data and capacity planning
3. **Enable Auto-Mitigation**: Set `autoMitigate: true` to reduce noise
4. **Use Dynamic Thresholds**: For metrics with varying patterns
5. **Add Descriptions**: Document the alert purpose and response procedures
6. **Tag Alerts**: Use tags for organization and filtering
7. **Test Actions**: Verify action groups receive notifications
8. **Review Regularly**: Adjust thresholds based on false positive rates

## Outputs

The Metric Alert construct provides the following outputs:

- `id`: The resource ID of the metric alert
- `name`: The name of the metric alert

## API Versions

### Supported Versions

- **2018-03-01** (Active, Latest) - Stable API version with dynamic threshold support

## Examples

See the [examples directory](../../examples/) for complete working examples:

- Static threshold alerts
- Dynamic threshold alerts
- Multi-resource monitoring
- Dimension filtering
- Integration with action groups

## Related Constructs

- [`ActionGroup`](../azure-actiongroup/) - Notification hub
- [`ActivityLogAlert`](../azure-activitylogalert/) - Activity log alerting

## Resources

- [Azure Metric Alerts Documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-metric-overview)
- [Dynamic Thresholds](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-dynamic-thresholds)
- [Supported Metrics](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/metrics-supported)
- [REST API Reference](https://learn.microsoft.com/en-us/rest/api/monitor/metricalerts)