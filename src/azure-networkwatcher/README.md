# Azure Network Watcher Construct

This module provides a high-level TypeScript construct for managing Azure Network Watchers using the Terraform CDK and Azure AZAPI provider.

## Features

- **Multiple API Version Support**: Supports 2024-01-01 (latest) and 2023-11-01 (for backward compatibility)
- **Automatic Version Resolution**: Uses the latest API version by default
- **Version Pinning**: Lock to a specific API version for stability
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **JSII Compatible**: Can be used from TypeScript, Python, Java, and C#
- **Terraform Outputs**: Automatic creation of outputs for id, name, location, and provisioningState
- **Tag Management**: Built-in methods for managing resource tags

## Important Note: One Per Region Limitation

⚠️ **Azure only allows one Network Watcher per subscription per region.** 

If you attempt to create a Network Watcher in a region where one already exists, the deployment will fail. This is an Azure platform limitation, not a construct limitation.

Azure automatically creates Network Watchers in a resource group named `NetworkWatcherRG` when certain network features are used. Before creating a Network Watcher, check if one already exists in your target region.

## Supported API Versions

| Version | Status | Release Date | Notes |
|---------|--------|--------------|-------|
| 2024-01-01 | Active (Latest) | 2024-01-01 | Recommended for new deployments |
| 2023-11-01 | Active | 2023-11-01 | Stable release for backward compatibility |

## Installation

This module is part of the `@microsoft/terraform-cdk-constructs` package.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Basic Usage

### Simple Network Watcher

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { NetworkWatcher } from "@microsoft/terraform-cdk-constructs/azure-networkwatcher";

const app = new App();
const stack = new TerraformStack(app, "network-watcher-stack");

// Configure the Azure provider
new AzapiProvider(stack, "azapi", {});

// Create a resource group
const resourceGroup = new ResourceGroup(stack, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

// Create a Network Watcher
const networkWatcher = new NetworkWatcher(stack, "network-watcher", {
  name: "my-network-watcher",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  tags: {
    environment: "production",
  },
});

app.synth();
```

### Using Azure's Default Naming Convention

Azure typically uses a naming convention of `NetworkWatcher_<region>` for auto-provisioned Network Watchers:

```typescript
const networkWatcher = new NetworkWatcher(stack, "network-watcher", {
  name: "NetworkWatcher_eastus",
  location: "eastus",
  resourceGroupId: networkWatcherRg.id,
});
```

### Pinning to a Specific API Version

```typescript
const networkWatcher = new NetworkWatcher(stack, "network-watcher", {
  name: "my-network-watcher",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  apiVersion: "2023-11-01", // Pin to specific version
});
```

## Using Network Watcher with Flow Logs

Network Watcher is primarily used as a dependency for other Network Watcher features. Here's an example of how you might use it with NSG Flow Logs (once the Flow Log construct is available):

```typescript
// Create the Network Watcher
const networkWatcher = new NetworkWatcher(stack, "network-watcher", {
  name: "NetworkWatcher_eastus",
  location: "eastus",
  resourceGroupId: networkWatcherRg.id,
});

// Use the Network Watcher ID with Flow Logs or other features
// (Flow Log construct example - coming soon)
// const flowLog = new NsgFlowLog(stack, "flow-log", {
//   networkWatcherId: networkWatcher.id,
//   networkSecurityGroupId: nsg.id,
//   storageAccountId: storageAccount.id,
// });
```

## Network Watcher Features

Network Watcher serves as the anchor for various network monitoring and diagnostic features:

| Feature | Description |
|---------|-------------|
| **NSG Flow Logs** | Capture information about IP traffic flowing through NSGs |
| **Connection Monitor** | Monitor reachability, latency, and network topology changes |
| **Packet Capture** | Capture packets to/from virtual machines |
| **IP Flow Verify** | Check if a packet is allowed or denied to/from a VM |
| **Next Hop** | Get the next hop from a VM |
| **VPN Troubleshoot** | Diagnose Azure VPN Gateway and connections |
| **Network Topology** | View network resources and their relationships |
| **Security Group View** | View NSGs and rules applied to a VM |

## API Reference

### NetworkWatcherProps

Configuration properties for the Network Watcher construct.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | No* | Name of the Network Watcher. If not provided, uses the construct ID. |
| `location` | `string` | Yes | Azure region where the Network Watcher will be created. Only one per region per subscription. |
| `resourceGroupId` | `string` | Yes | Resource group ID where the Network Watcher will be created. |
| `tags` | `{ [key: string]: string }` | No | Resource tags. |
| `apiVersion` | `string` | No | Pin to a specific API version. |

### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The Azure resource ID of the Network Watcher. |
| `props` | `NetworkWatcherProps` | The original input properties. |
| `resolvedApiVersion` | `string` | The API version being used. |

### Outputs

The construct automatically creates Terraform outputs:

- `id`: The Network Watcher resource ID
- `name`: The Network Watcher name
- `location`: The Network Watcher location (region)
- `provisioning_state`: The provisioning state of the Network Watcher

### Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `addTag` | `key: string, value: string` | Add a tag to the Network Watcher. |
| `addAccess` | `objectId: string, roleDefinitionName: string` | Add RBAC role assignment. |

## Best Practices

### 1. Use a Dedicated Resource Group

Consider using a dedicated resource group for Network Watchers, similar to Azure's convention:

```typescript
const networkWatcherRg = new ResourceGroup(stack, "network-watcher-rg", {
  name: "NetworkWatcherRG",
  location: "eastus",
});

const networkWatcher = new NetworkWatcher(stack, "network-watcher", {
  name: "NetworkWatcher_eastus",
  location: "eastus",
  resourceGroupId: networkWatcherRg.id,
});
```

### 2. Check for Existing Network Watchers

Before creating a Network Watcher, verify that one doesn't already exist in the target region:

```bash
az network watcher list --query "[?location=='eastus']"
```

### 3. Create Network Watchers for Each Required Region

If you need Network Watcher features in multiple regions, create a Network Watcher for each:

```typescript
const regions = ["eastus", "westus2", "northeurope"];

regions.forEach(region => {
  new NetworkWatcher(stack, `network-watcher-${region}`, {
    name: `NetworkWatcher_${region}`,
    location: region,
    resourceGroupId: networkWatcherRg.id,
  });
});
```

### 4. Use Consistent Naming and Tagging

```typescript
const networkWatcher = new NetworkWatcher(stack, "network-watcher", {
  name: "NetworkWatcher_eastus",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  tags: {
    environment: "production",
    "managed-by": "terraform-cdk",
    "created-by": "platform-team",
  },
});
```

## Troubleshooting

### Common Issues

1. **"A network watcher already exists in the subscription for region"**
   
   A Network Watcher already exists in that region. Azure allows only one per region per subscription.
   
   Solution: Import the existing Network Watcher or use a different region.

2. **"Resource group not found"**
   
   The specified resource group doesn't exist.
   
   Solution: Ensure the resource group is created before the Network Watcher, either using a `ResourceGroup` construct or by referencing an existing resource group.

3. **"Location is required"**
   
   Network Watcher requires a location to be specified.
   
   Solution: Always provide the `location` property.

## Related Constructs

- [`ResourceGroup`](../azure-resourcegroup/README.md) - Azure Resource Groups
- [`VirtualNetwork`](../azure-virtualnetwork/README.md) - Azure Virtual Networks
- [`NetworkSecurityGroup`](../azure-networksecuritygroup/README.md) - Network Security Groups

## Additional Resources

- [Azure Network Watcher Documentation](https://learn.microsoft.com/en-us/azure/network-watcher/network-watcher-overview)
- [Network Watcher REST API Reference](https://learn.microsoft.com/en-us/rest/api/network-watcher/)
- [NSG Flow Logs Documentation](https://learn.microsoft.com/en-us/azure/network-watcher/nsg-flow-logs-overview)
- [Connection Monitor Documentation](https://learn.microsoft.com/en-us/azure/network-watcher/connection-monitor-overview)
- [Terraform CDK Documentation](https://developer.hashicorp.com/terraform/cdktf)

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
