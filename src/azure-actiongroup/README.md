# Azure Action Group Construct

This construct provides a type-safe, version-aware implementation of Azure Action Groups using the AZAPI provider framework.

## Overview

Action Groups serve as the central notification hub for Azure Monitor alerts. They support multiple receiver types including email, SMS, webhook, Azure Functions, Logic Apps, and voice calls.

## Features

- **Version Management**: Automatic resolution to the latest stable API version (2021-09-01)
- **Type Safety**: Full TypeScript type definitions with JSII compliance
- **Multiple Receivers**: Support for email, SMS, webhook, Azure Function, Logic App, and voice receivers
- **Validation**: Schema-driven property validation
- **Multi-language**: Generated bindings for TypeScript, Python, Java, and C#

## Installation

This construct is part of the `@microsoft/terraform-cdk-constructs` package.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Usage

### Basic Action Group with Email

```typescript
import { ActionGroup } from "@microsoft/terraform-cdk-constructs/azure-actiongroup";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";

const resourceGroup = new ResourceGroup(this, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

const actionGroup = new ActionGroup(this, "ops-team", {
  name: "ops-action-group",
  groupShortName: "OpsTeam",
  resourceGroupId: resourceGroup.id,
  emailReceivers: [{
    name: "ops-email",
    emailAddress: "ops@company.com",
    useCommonAlertSchema: true
  }],
});
```

### Action Group with Multiple Receiver Types

```typescript
const actionGroup = new ActionGroup(this, "critical-alerts", {
  name: "critical-action-group",
  groupShortName: "Critical",
  resourceGroupId: resourceGroup.id,
  emailReceivers: [{
    name: "oncall-email",
    emailAddress: "oncall@company.com",
    useCommonAlertSchema: true
  }],
  smsReceivers: [{
    name: "oncall-sms",
    countryCode: "1",
    phoneNumber: "5551234567"
  }],
  webhookReceivers: [{
    name: "pagerduty-webhook",
    serviceUri: "https://events.pagerduty.com/integration/...",
    useCommonAlertSchema: true
  }],
  tags: {
    Environment: "Production",
    Team: "Operations"
  }
});
```

### Action Group with Azure Function Receiver

```typescript
const actionGroup = new ActionGroup(this, "automation-alerts", {
  name: "automation-action-group",
  groupShortName: "Automation",
  resourceGroupId: resourceGroup.id,
  azureFunctionReceivers: [{
    name: "alert-processor",
    functionAppResourceId: "/subscriptions/.../resourceGroups/.../providers/Microsoft.Web/sites/my-function-app",
    functionName: "ProcessAlert",
    httpTriggerUrl: "https://my-function-app.azurewebsites.net/api/ProcessAlert",
    useCommonAlertSchema: true
  }],
});
```

### Action Group with Logic App Receiver

```typescript
const actionGroup = new ActionGroup(this, "workflow-alerts", {
  name: "workflow-action-group",
  groupShortName: "Workflow",
  resourceGroupId: resourceGroup.id,
  logicAppReceivers: [{
    name: "ticket-creation",
    resourceId: "/subscriptions/.../resourceGroups/.../providers/Microsoft.Logic/workflows/create-ticket",
    callbackUrl: "https://prod-00.eastus.logic.azure.com:443/workflows/.../triggers/manual/paths/invoke",
    useCommonAlertSchema: true
  }],
});
```

## Properties

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | The name of the action group |
| `groupShortName` | `string` | Short name for SMS notifications (1-12 alphanumeric characters) |

### Optional Properties

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `location` | `string` | Azure region | `"global"` |
| `enabled` | `boolean` | Whether the action group is enabled | `true` |
| `emailReceivers` | `EmailReceiver[]` | Email notification receivers | `[]` |
| `smsReceivers` | `SmsReceiver[]` | SMS notification receivers | `[]` |
| `webhookReceivers` | `WebhookReceiver[]` | Webhook notification receivers | `[]` |
| `azureFunctionReceivers` | `AzureFunctionReceiver[]` | Azure Function receivers | `[]` |
| `logicAppReceivers` | `LogicAppReceiver[]` | Logic App receivers | `[]` |
| `voiceReceivers` | `VoiceReceiver[]` | Voice call receivers | `[]` |
| `tags` | `Record<string, string>` | Resource tags | `{}` |
| `resourceGroupId` | `string` | Resource group ID | Required for resource creation |
| `apiVersion` | `string` | Explicit API version | Latest version |

## Receiver Types

### EmailReceiver

```typescript
interface EmailReceiver {
  name: string;                    // Receiver name
  emailAddress: string;            // Email address
  useCommonAlertSchema?: boolean;  // Use common alert schema (default: false)
}
```

### SmsReceiver

```typescript
interface SmsReceiver {
  name: string;         // Receiver name
  countryCode: string;  // Country code (e.g., "1" for US)
  phoneNumber: string;  // Phone number
}
```

### WebhookReceiver

```typescript
interface WebhookReceiver {
  name: string;                    // Receiver name
  serviceUri: string;              // Webhook URL
  useCommonAlertSchema?: boolean;  // Use common alert schema (default: false)
}
```

### AzureFunctionReceiver

```typescript
interface AzureFunctionReceiver {
  name: string;                    // Receiver name
  functionAppResourceId: string;   // Function app resource ID
  functionName: string;            // Function name
  httpTriggerUrl: string;          // HTTP trigger URL
  useCommonAlertSchema?: boolean;  // Use common alert schema (default: false)
}
```

### LogicAppReceiver

```typescript
interface LogicAppReceiver {
  name: string;                    // Receiver name
  resourceId: string;              // Logic App resource ID
  callbackUrl: string;             // Callback URL
  useCommonAlertSchema?: boolean;  // Use common alert schema (default: false)
}
```

### VoiceReceiver

```typescript
interface VoiceReceiver {
  name: string;         // Receiver name
  countryCode: string;  // Country code (e.g., "1" for US)
  phoneNumber: string;  // Phone number
}
```

## Outputs

The Action Group construct provides the following outputs:

- `id`: The resource ID of the action group
- `name`: The name of the action group

You can reference these in other constructs:

```typescript
const alert = new MetricAlert(this, "cpu-alert", {
  // ... other properties
  actions: [{
    actionGroupId: actionGroup.id
  }]
});
```

## API Versions

### Supported Versions

- **2021-09-01** (Active, Latest) - Stable API version with full feature support

The construct automatically uses the latest stable version unless explicitly pinned:

```typescript
const actionGroup = new ActionGroup(this, "my-group", {
  name: "my-action-group",
  groupShortName: "MyGroup",
  apiVersion: "2021-09-01",  // Optional: pin to specific version
  // ... other properties
});
```

## Common Alert Schema

Microsoft recommends using the Common Alert Schema for better integration and consistency. Enable it per receiver:

```typescript
emailReceivers: [{
  name: "ops-email",
  emailAddress: "ops@company.com",
  useCommonAlertSchema: true  // Enable common alert schema
}]
```

Benefits of Common Alert Schema:
- Unified payload format across all alert types
- Easier to build integrations
- Better parsing and processing
- Consistent field names and structure

## Best Practices

1. **Use Short Names Wisely**: The `groupShortName` appears in SMS messages (max 12 characters)
2. **Enable Common Alert Schema**: Set `useCommonAlertSchema: true` for better integration
3. **Tag Your Resources**: Add meaningful tags for organization and cost tracking
4. **Multiple Receivers**: Configure multiple receiver types for redundancy
5. **Test Receivers**: Use the Azure Portal's "Test action group" feature after deployment

## Examples

See the [examples directory](../../examples/) for complete working examples:

- Basic action group setup
- Multi-receiver configurations
- Integration with metric alerts
- Integration with activity log alerts

## Related Constructs

- [`MetricAlert`](../azure-metricalert/) - Metric-based alerting
- [`ActivityLogAlert`](../azure-activitylogalert/) - Activity log alerting

## Resources

- [Azure Action Groups Documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/action-groups)
- [Common Alert Schema](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-common-schema)
- [REST API Reference](https://learn.microsoft.com/en-us/rest/api/monitor/action-groups)