# Monitoring & Alerting Guide

Azure L2 Constructs include comprehensive monitoring capabilities that can be enabled with a single method call. The monitoring framework automatically creates metric alerts, diagnostic settings, and activity log alerts for supported resources.

## Overview

Monitoring is built directly into the constructs, allowing you to enable production-ready observability with minimal configuration. Each supported resource type includes sensible defaults for critical metrics while remaining fully customizable.

## Supported Resources

| Resource | Metric Alerts | Diagnostic Settings | Activity Log Alerts | Documentation |
|----------|--------------|---------------------|-------------------|---------------|
| Virtual Machines | CPU, Memory, Disk Queue | ✅ Yes | VM Deletion | [VM Monitoring](../src/azure-virtualmachine/README.md#monitoring) |
| AKS Clusters | Node CPU/Memory, Failed Pods | ✅ Yes | Cluster Deletion | [AKS Monitoring](../src/azure-aks/README.md#monitoring) |
| Virtual Machine Scale Sets | CPU, Memory, Disk Queue | ✅ Yes | VMSS Deletion | [VMSS Monitoring](../src/azure-vmss/README.md#monitoring) |
| Storage Accounts | Availability, Egress, Transactions | ✅ Yes | Account Deletion | [Storage Monitoring](../src/azure-storageaccount/README.md#monitoring) |

## Quick Start

All monitoring-enabled resources follow the same pattern using the `defaultMonitoring()` static method:

```typescript
import { VirtualMachine } from "@microsoft/terraform-cdk-constructs/azure-virtualmachine";
import { ActionGroup } from "@microsoft/terraform-cdk-constructs/azure-actiongroup";

// Create action group for alert notifications
const actionGroup = new ActionGroup(this, "alerts", {
  name: "ops-alerts",
  groupShortName: "OpsTeam",
  resourceGroupId: resourceGroup.id,
  emailReceivers: [{
    name: "ops-email",
    emailAddress: "ops@company.com",
    useCommonAlertSchema: true,
  }],
});

// Create resource with built-in monitoring
const vm = new VirtualMachine(this, "vm", {
  name: "my-vm",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  // ... other VM configuration ...
  
  // Enable monitoring with one line
  monitoring: VirtualMachine.defaultMonitoring(
    actionGroup.id,
    workspaceId  // Log Analytics workspace ID
  ),
});
```

## What Gets Created

When you enable default monitoring, the following resources are automatically created:

### 1. Metric Alerts

Resource-specific metric alerts with sensible thresholds (e.g., CPU > 80%, Memory < 1GB). Each alert is configured with:
- Appropriate severity levels
- Evaluation frequency and window size
- Aggregation methods
- Actions linked to your action group

### 2. Diagnostic Settings

Sends all logs and metrics to Log Analytics workspace for:
- Centralized monitoring and analysis
- Long-term retention
- Query and visualization capabilities
- Integration with Azure Monitor

### 3. Activity Log Alerts

Tracks critical administrative operations such as:
- Resource deletion events
- Configuration changes
- Security-related operations

## Customization

All monitoring configurations support customization through options:

```typescript
monitoring: VirtualMachine.defaultMonitoring(
  actionGroup.id,
  workspaceId,
  {
    // Customize thresholds
    cpuThreshold: 90,              // Raise CPU alert threshold to 90%
    memoryThreshold: 524288000,    // Lower memory threshold to 500MB
    
    // Adjust severities (0=Critical, 1=Error, 2=Warning, 3=Info, 4=Verbose)
    cpuAlertSeverity: 1,           // Make CPU alerts critical
    
    // Enable/disable specific alerts
    enableDiskQueueAlert: false,   // Disable disk queue monitoring
    enableDeletionAlert: true,     // Keep deletion tracking
  }
)
```

## Service-Specific Documentation

For detailed monitoring configuration options, examples, and available metrics, see the service-specific documentation:

- **[Virtual Machine Monitoring](../src/azure-virtualmachine/README.md#monitoring)** - CPU, memory, disk, and network monitoring
- **[AKS Cluster Monitoring](../src/azure-aks/README.md#monitoring)** - Node health, pod failures, and cluster metrics
- **[VM Scale Set Monitoring](../src/azure-vmss/README.md#monitoring)** - Instance-level and aggregate monitoring
- **[Storage Account Monitoring](../src/azure-storageaccount/README.md#monitoring)** - Availability, performance, and transaction tracking

## Advanced Usage

### Combining Default Monitoring with Custom Alerts

You can extend the default monitoring configuration with additional custom alerts:

```typescript
const monitoring = VirtualMachine.defaultMonitoring(
  actionGroup.id,
  workspaceId
);

// Add a custom network traffic alert
monitoring.metricAlerts?.push({
  name: 'high-network-traffic',
  description: 'Alert when network egress exceeds 10GB',
  severity: 2,
  frequency: 'PT5M',
  windowSize: 'PT15M',
  criteria: {
    singleResourceMultipleMetricCriteria: [{
      metricNamespace: 'Microsoft.Compute/virtualMachines',
      metricName: 'Network Out Total',
      aggregation: 'Total',
      operator: 'GreaterThan',
      threshold: 10737418240, // 10GB
    }]
  },
  actionGroupIds: [actionGroup.id]
});
```

### Fully Custom Monitoring

For complete control, provide a custom monitoring configuration object. See individual service documentation for the complete monitoring configuration schema.

## Best Practices

1. **Always enable monitoring for production resources** - Use `defaultMonitoring()` as a baseline
2. **Use Log Analytics workspaces** - Enable centralized logging and analysis
3. **Configure action groups appropriately** - Ensure alerts reach the right teams
4. **Customize thresholds for your workload** - Default values may not fit all scenarios
5. **Test alerting** - Verify alerts trigger correctly before production deployment
6. **Review metrics regularly** - Adjust thresholds based on actual usage patterns
7. **Use multiple action groups** - Route different severity alerts to different teams
8. **Enable diagnostic settings** - Essential for troubleshooting and compliance

## Common Patterns

### Development Environment

```typescript
// Relaxed thresholds for dev
monitoring: VirtualMachine.defaultMonitoring(
  devActionGroup.id,
  devWorkspace.id,
  {
    cpuThreshold: 95,
    enableDeletionAlert: false,
  }
)
```

### Production Environment

```typescript
// Stricter thresholds with critical severity
monitoring: VirtualMachine.defaultMonitoring(
  prodActionGroup.id,
  prodWorkspace.id,
  {
    cpuThreshold: 80,
    memoryThreshold: 1073741824,
    cpuAlertSeverity: 0,  // Critical
    memoryAlertSeverity: 0,  // Critical
  }
)
```

### Monitoring Disabled

```typescript
// Explicitly disable monitoring
monitoring: {
  enabled: false
}
```

## Related Documentation

- [Azure Monitor Documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/)
- [Metric Alerts](../src/azure-metricalert/README.md)
- [Action Groups](../src/azure-actiongroup/README.md)
- [Diagnostic Settings](../src/azure-diagnosticsettings/README.md)
- [Activity Log Alerts](../src/azure-activitylogalert/README.md)