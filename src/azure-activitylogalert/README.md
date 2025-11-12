# Azure Activity Log Alert Construct

This construct provides a type-safe, version-aware implementation of Azure Activity Log Alerts using the AZAPI provider framework.

## Overview

Activity Log Alerts monitor Azure Activity Log events and trigger notifications when specific operations occur, such as resource deletions, configuration changes, or service health events.

## Features

- **Version Management**: Automatic resolution to the latest stable API version (2020-10-01)
- **Type Safety**: Full TypeScript type definitions with JSII compliance
- **Comprehensive Filtering**: Filter by category, operation, resource type, status, and more
- **Service Health Alerts**: Monitor Azure service health events
- **Resource Health Alerts**: Monitor resource-specific health events
- **Validation**: Schema-driven property validation
- **Multi-language**: Generated bindings for TypeScript, Python, Java, and C#

## Installation

This construct is part of the `@microsoft/terraform-cdk-constructs` package.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Usage

### Alert on VM Deletion

```typescript
import { ActivityLogAlert } from "@microsoft/terraform-cdk-constructs/azure-activitylogalert";
import { ActionGroup } from "@microsoft/terraform-cdk-constructs/azure-actiongroup";

const vmDeletionAlert = new ActivityLogAlert(this, "vm-deletion", {
  name: "vm-deletion-alert",
  description: "Alert when any VM is deleted",
  resourceGroupId: resourceGroup.id,
  scopes: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  condition: {
    allOf: [
      { field: "category", equals: "Administrative" },
      { field: "operationName", equals: "Microsoft.Compute/virtualMachines/delete" },
      { field: "status", equals: "Succeeded" }
    ]
  },
  actions: {
    actionGroups: [{
      actionGroupId: actionGroup.id
    }]
  },
  tags: {
    Environment: "Production",
    AlertType: "Security"
  }
});
```

### Service Health Alert

```typescript
const serviceHealthAlert = new ActivityLogAlert(this, "service-health", {
  name: "service-health-alert",
  description: "Alert on Azure service health incidents",
  resourceGroupId: resourceGroup.id,
  scopes: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  condition: {
    allOf: [
      { field: "category", equals: "ServiceHealth" },
      { field: "properties.incidentType", equals: "Incident" }
    ]
  },
  actions: {
    actionGroups: [{
      actionGroupId: actionGroup.id,
      webhookProperties: {
        severity: "critical",
        environment: "production"
      }
    }]
  }
});
```

### Resource Health Alert

```typescript
const resourceHealthAlert = new ActivityLogAlert(this, "resource-health", {
  name: "resource-health-alert",
  description: "Alert on resource health degradation",
  resourceGroupId: resourceGroup.id,
  scopes: [resourceGroup.id],
  condition: {
    allOf: [
      { field: "category", equals: "ResourceHealth" },
      { field: "properties.currentHealthStatus", equals: "Degraded" },
      { field: "resourceType", equals: "Microsoft.Compute/virtualMachines" }
    ]
  },
  actions: {
    actionGroups: [{
      actionGroupId: actionGroup.id
    }]
  }
});
```

### Alert on Security Center Recommendations

```typescript
const securityAlert = new ActivityLogAlert(this, "security-alert", {
  name: "security-center-alert",
  description: "Alert on new Security Center recommendations",
  resourceGroupId: resourceGroup.id,
  scopes: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  condition: {
    allOf: [
      { field: "category", equals: "Security" },
      { field: "operationName", equals: "Microsoft.Security/locations/alerts/activate/action" }
    ]
  },
  actions: {
    actionGroups: [{
      actionGroupId: securityActionGroup.id
    }]
  }
});
```

### Alert on Policy Violations

```typescript
const policyAlert = new ActivityLogAlert(this, "policy-violation", {
  name: "policy-violation-alert",
  description: "Alert on Azure Policy violations",
  resourceGroupId: resourceGroup.id,
  scopes: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  condition: {
    allOf: [
      { field: "category", equals: "Policy" },
      { field: "operationName", equals: "Microsoft.Authorization/policies/audit/action" }
    ]
  },
  actions: {
    actionGroups: [{
      actionGroupId: actionGroup.id
    }]
  }
});
```

## Properties

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | The name of the activity log alert |
| `scopes` | `string[]` | Resource IDs that this alert is scoped to |
| `condition` | `ActivityLogAlertCondition` | Alert condition with field-value pairs |

### Optional Properties

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `location` | `string` | Azure region | `"global"` |
| `description` | `string` | Description of the alert rule | - |
| `enabled` | `boolean` | Whether the alert rule is enabled | `true` |
| `actions` | `object` | Action groups to notify | - |
| `tags` | `Record<string, string>` | Resource tags | `{}` |
| `resourceGroupId` | `string` | Resource group ID | Required |
| `apiVersion` | `string` | Explicit API version | Latest |

## Condition Structure

### ActivityLogAlertCondition

```typescript
interface ActivityLogAlertCondition {
  allOf: ActivityLogAlertLeafCondition[];  // All conditions are ANDed
}

interface ActivityLogAlertLeafCondition {
  field: string;   // Field name to filter on
  equals: string;  // Value to match
}
```

## Common Fields

### Standard Fields

| Field | Description | Common Values |
|-------|-------------|---------------|
| `category` | Event category | Administrative, ServiceHealth, ResourceHealth, Alert, Policy, Security |
| `operationName` | Operation performed | Microsoft.Compute/virtualMachines/delete, etc. |
| `resourceType` | Type of resource | Microsoft.Compute/virtualMachines, etc. |
| `resourceGroup` | Resource group name | Name of the resource group |
| `status` | Operation status | Succeeded, Failed, Started |
| `subStatus` | Detailed status | Detailed status information |
| `resourceId` | Full resource ID | Complete Azure resource ID |

### ServiceHealth Fields

| Field | Description | Values |
|-------|-------------|--------|
| `properties.incidentType` | Type of incident | Incident, Maintenance, Information, ActionRequired |
| `properties.impactedServices[*].ServiceName` | Affected service | Virtual Machines, App Service, etc. |
| `properties.impactedServices[*].ImpactedRegions[*].RegionName` | Affected region | eastus, westus, etc. |

### ResourceHealth Fields

| Field | Description | Values |
|-------|-------------|--------|
| `properties.currentHealthStatus` | Current status | Available, Degraded, Unavailable |
| `properties.previousHealthStatus` | Previous status | Available, Degraded, Unavailable |
| `properties.cause` | Cause of change | PlatformInitiated, UserInitiated |

## Categories

### Administrative
Tracks create, update, delete, and action operations on resources.

```typescript
{ field: "category", equals: "Administrative" }
```

### ServiceHealth
Tracks Azure service health events including incidents and maintenance.

```typescript
{ field: "category", equals: "ServiceHealth" }
```

### ResourceHealth
Tracks health status changes of individual resources.

```typescript
{ field: "category", equals: "ResourceHealth" }
```

### Alert
Tracks firing of Azure Monitor alerts.

```typescript
{ field: "category", equals: "Alert" }
```

### Policy
Tracks Azure Policy evaluation results.

```typescript
{ field: "category", equals: "Policy" }
```

### Security
Tracks Azure Security Center alerts and recommendations.

```typescript
{ field: "category", equals: "Security" }
```

## Common Operation Names

### Virtual Machines
- `Microsoft.Compute/virtualMachines/write` - Create or update
- `Microsoft.Compute/virtualMachines/delete` - Delete
- `Microsoft.Compute/virtualMachines/start/action` - Start
- `Microsoft.Compute/virtualMachines/powerOff/action` - Power off
- `Microsoft.Compute/virtualMachines/restart/action` - Restart

### Storage Accounts
- `Microsoft.Storage/storageAccounts/write` - Create or update
- `Microsoft.Storage/storageAccounts/delete` - Delete
- `Microsoft.Storage/storageAccounts/regeneratekey/action` - Regenerate key

### Network Security Groups
- `Microsoft.Network/networkSecurityGroups/write` - Create or update
- `Microsoft.Network/networkSecurityGroups/delete` - Delete
- `Microsoft.Network/networkSecurityGroups/securityRules/write` - Update rules

## Scopes

Activity Log Alerts can be scoped to:

### Subscription Level
```typescript
scopes: ["/subscriptions/00000000-0000-0000-0000-000000000000"]
```

### Resource Group Level
```typescript
scopes: ["/subscriptions/.../resourceGroups/my-resource-group"]
```

### Specific Resource
```typescript
scopes: ["/subscriptions/.../resourceGroups/.../providers/Microsoft.Compute/virtualMachines/myVM"]
```

### Multiple Scopes
```typescript
scopes: [
  "/subscriptions/.../resourceGroups/rg1",
  "/subscriptions/.../resourceGroups/rg2"
]
```

## Best Practices

1. **Use Specific Scopes**: Limit alerts to relevant resources to reduce noise
2. **Add Descriptions**: Document what the alert monitors and expected actions
3. **Filter by Status**: Include `status` field to only alert on succeeded/failed operations
4. **Service Health**: Create dedicated alerts for service health events
5. **Security Monitoring**: Alert on critical security operations (deletions, key regeneration)
6. **Tag Alerts**: Use tags to organize and categorize alerts
7. **Test Actions**: Verify action groups receive notifications
8. **Review Regularly**: Analyze activity logs to identify new operations to monitor

## Outputs

The Activity Log Alert construct provides the following outputs:

- `id`: The resource ID of the activity log alert
- `name`: The name of the activity log alert

## API Versions

### Supported Versions

- **2020-10-01** (Active, Latest) - Stable API version with full feature support

## Examples

See the [examples directory](../../examples/) for complete working examples:

- Resource operation monitoring
- Service health alerting
- Resource health monitoring
- Security event alerting
- Policy compliance monitoring

## Related Constructs

- [`ActionGroup`](../azure-actiongroup/) - Notification hub
- [`MetricAlert`](../azure-metricalert/) - Metric-based alerting

## Resources

- [Activity Log Alerts Documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/activity-log-alerts)
- [Activity Log Schema](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/activity-log-schema)
- [Service Health Alerts](https://learn.microsoft.com/en-us/azure/service-health/alerts-activity-log-service-notifications-portal)
- [REST API Reference](https://learn.microsoft.com/en-us/rest/api/monitor/activitylogalerts)