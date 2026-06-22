# Azure Event Hubs Construct

This module provides high-level TypeScript constructs for managing Azure Event Hubs using the Terraform CDK and Azure AZAPI provider. It includes constructs for Event Hubs **Namespaces** (`Microsoft.EventHub/namespaces`) and **Event Hubs** (`Microsoft.EventHub/namespaces/eventhubs`).

## Features

- **Multiple API Version Support**: Supports 2024-01-01 (latest) and 2021-11-01 (for backward compatibility)
- **Automatic Version Resolution**: Uses the latest API version by default
- **Version Pinning**: Lock to a specific API version for stability
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **JSII Compatible**: Can be used from TypeScript, Python, Java, and C#
- **Terraform Outputs**: Automatic creation of outputs for id and name
- **SKU Management**: Basic, Standard, and Premium tiers with auto-inflate support

## Supported API Versions

| Version | Status | Release Date | Notes |
|---------|--------|--------------|-------|
| 2024-01-01 | Active (Latest) | 2024-01-01 | Recommended for new deployments |
| 2021-11-01 | Active | 2021-11-01 | Stable release for backward compatibility |

## Installation

This module is part of the `@microsoft/terraform-cdk-constructs` package.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Basic Usage

### Simple Event Hubs Namespace and Event Hub

```typescript
import { App, TerraformStack } from "cdktn";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import {
  EventhubNamespace,
  Eventhub,
} from "@microsoft/terraform-cdk-constructs/azure-eventhub";

const app = new App();
const stack = new TerraformStack(app, "event-hub-stack");

// Configure the Azure provider
new AzapiProvider(stack, "azapi", {});

// Create a resource group
const resourceGroup = new ResourceGroup(stack, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

// Create an Event Hubs Namespace
const namespace = new EventhubNamespace(stack, "namespace", {
  name: "my-eventhub-ns",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  tags: {
    environment: "production",
  },
});

// Create an Event Hub within the namespace
new Eventhub(stack, "hub", {
  name: "my-event-hub",
  namespaceName: namespace.props.name!,
  namespaceId: namespace.id,
  resourceGroupId: resourceGroup.id,
  partitionCount: 4,
  messageRetentionInDays: 3,
});

app.synth();
```

## Advanced Usage

### Standard Namespace with Auto-Inflate

```typescript
const namespace = new EventhubNamespace(stack, "namespace-autoinflate", {
  name: "autoinflate-ns",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard", capacity: 2 },
  isAutoInflateEnabled: true,
  maximumThroughputUnits: 10, // Scale up to 10 TUs automatically
});
```

### Premium Namespace with Zone Redundancy

```typescript
const namespace = new EventhubNamespace(stack, "namespace-premium", {
  name: "premium-ns",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Premium", capacity: 1 },
  zoneRedundant: true,
});
```

### Restricting Network Access and Authentication

```typescript
const namespace = new EventhubNamespace(stack, "namespace-secure", {
  name: "secure-ns",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  publicNetworkAccess: "Disabled",
  disableLocalAuth: true, // Azure AD authentication only
  minimumTlsVersion: "1.2",
});
```

### Managed Identity

```typescript
const namespace = new EventhubNamespace(stack, "namespace-identity", {
  name: "identity-ns",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  identity: {
    type: "SystemAssigned",
  },
});
```

### Event Hub with Custom Partitions and Retention

```typescript
new Eventhub(stack, "high-throughput-hub", {
  name: "high-throughput",
  namespaceName: namespace.props.name!,
  namespaceId: namespace.id,
  resourceGroupId: resourceGroup.id,
  partitionCount: 16,
  messageRetentionInDays: 7,
  status: "Active",
});
```

### Pinning to a Specific API Version

```typescript
const namespace = new EventhubNamespace(stack, "namespace-pinned", {
  name: "pinned-ns",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  apiVersion: "2021-11-01", // Pin to specific version
});
```

## API Reference

### EventhubNamespaceProps

Configuration properties for the Event Hubs Namespace construct.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | No* | Name of the namespace. If not provided, uses the construct ID. Must be 6-50 characters, globally unique. |
| `location` | `string` | Yes | Azure region where the namespace will be created. |
| `resourceGroupId` | `string` | Yes | Resource group ID where the namespace will be created. |
| `sku` | `EventhubNamespaceSku` | No | SKU configuration. Default: `{ name: "Standard" }`. |
| `zoneRedundant` | `boolean` | No | Enable zone redundancy. |
| `isAutoInflateEnabled` | `boolean` | No | Enable auto-inflate of throughput units (Standard tier). |
| `maximumThroughputUnits` | `number` | No | Upper throughput-unit limit for auto-inflate (0-40). |
| `minimumTlsVersion` | `"1.0" \| "1.1" \| "1.2"` | No | Minimum TLS version. Default: "1.2". |
| `publicNetworkAccess` | `"Enabled" \| "Disabled"` | No | Public network access. Default: "Enabled". |
| `disableLocalAuth` | `boolean` | No | Disable SAS authentication (Azure AD only). |
| `identity` | `EventhubNamespaceIdentity` | No | Managed identity configuration. |
| `tags` | `{ [key: string]: string }` | No | Resource tags. |
| `apiVersion` | `string` | No | Pin to a specific API version. |

### EventhubNamespaceSku

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `"Basic" \| "Standard" \| "Premium"` | Yes | SKU name. |
| `tier` | `"Basic" \| "Standard" \| "Premium"` | No | Billing tier. Defaults to the value of `name`. |
| `capacity` | `number` | No | Throughput units (Standard) or capacity units (Premium). |

### EventhubProps

Configuration properties for the Event Hub construct.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | No* | Name of the event hub. If not provided, uses the construct ID. |
| `namespaceName` | `string` | Yes | Name of the parent namespace (used to construct the parent ID). |
| `namespaceId` | `string` | No | Full resource ID of the parent namespace. Creates a Terraform dependency when provided. |
| `resourceGroupId` | `string` | Yes | Resource group ID where the parent namespace exists. |
| `partitionCount` | `number` | No | Number of partitions (immutable after creation). Default: 2. |
| `messageRetentionInDays` | `number` | No | Days to retain events (1-7 Standard, up to 90 Premium). Default: 1. |
| `status` | `"Active" \| "Disabled" \| "SendDisabled" \| "ReceiveDisabled"` | No | Status of the event hub. Default: "Active". |
| `apiVersion` | `string` | No | Pin to a specific API version. |

### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The Azure resource ID. |
| `props` | `EventhubNamespaceProps` / `EventhubProps` | The original input properties. |
| `resolvedApiVersion` | `string` | The API version being used. |

### Outputs

Both constructs automatically create Terraform outputs:

- `id`: The resource ID
- `name`: The resource name

## Best Practices

### 1. Use Standard for Most Workloads

The Standard tier supports auto-inflate, multiple consumer groups, and longer retention, making it suitable for most production scenarios.

```typescript
const namespace = new EventhubNamespace(stack, "namespace", {
  name: "my-ns",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
});
```

### 2. Plan Partitions Up Front

Partition count is immutable after creation. Choose a value that accommodates your expected peak throughput and parallelism.

### 3. Reference the Namespace by ID

Pass `namespaceId` to Event Hubs so Terraform creates a proper dependency and orders create/destroy operations correctly.

## Troubleshooting

### Common Issues

1. **Namespace Name Not Available**: Namespace names must be globally unique across Azure.

2. **Invalid Throughput Units**: `maximumThroughputUnits` must be between 0 and 40 and requires `isAutoInflateEnabled` on a Standard namespace.

3. **Immutable Partitions**: `partitionCount` cannot be changed after the event hub is created.

4. **Retention Out of Range**: `messageRetentionInDays` must be 1-7 for Standard, up to 90 for Premium/Dedicated.

## Related Constructs

- [`ResourceGroup`](../azure-resourcegroup/README.md) - Azure Resource Groups
- [`StorageAccount`](../azure-storageaccount/README.md) - Storage Account for Event Hubs Capture

## Additional Resources

- [Azure Event Hubs Documentation](https://learn.microsoft.com/en-us/azure/event-hubs/)
- [Event Hubs Pricing](https://azure.microsoft.com/en-us/pricing/details/event-hubs/)
- [Azure REST API Reference](https://learn.microsoft.com/en-us/rest/api/eventhub/)
- [Terraform CDK Documentation](https://developer.hashicorp.com/terraform/cdktf)

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
