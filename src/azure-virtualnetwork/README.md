# Azure Virtual Network Construct

This module provides a high-level TypeScript construct for managing Azure Virtual Networks using the Terraform CDK and Azure AZAPI provider.

## Features

- **Multiple API Version Support**: Automatically supports the 3 most recent stable API versions (2025-01-01, 2024-10-01, 2024-07-01)
- **Automatic Version Resolution**: Uses the latest API version by default
- **Version Pinning**: Lock to a specific API version for stability
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **JSII Compatible**: Can be used from TypeScript, Python, Java, and C#
- **Terraform Outputs**: Automatic creation of outputs for easy reference
- **Tag Management**: Built-in methods for managing resource tags

## Supported API Versions

| Version | Status | Release Date | Notes |
|---------|--------|--------------|-------|
| 2025-01-01 | Active (Latest) | 2025-01-01 | Recommended for new deployments |
| 2024-10-01 | Active | 2024-10-01 | Enhanced performance and reliability |
| 2024-07-01 | Active | 2024-07-01 | Stable release with core features |

## Installation

This module is part of the `@microsoft/terraform-cdk-constructs` package.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Basic Usage

### Simple Virtual Network

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { VirtualNetwork } from "@microsoft/terraform-cdk-constructs/azure-virtualnetwork";

const app = new App();
const stack = new TerraformStack(app, "virtual-network-stack");

// Configure the Azure provider
new AzapiProvider(stack, "azapi", {});

// Create a resource group
const resourceGroup = new ResourceGroup(stack, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

// Create a virtual network
const vnet = new VirtualNetwork(stack, "vnet", {
  name: "my-vnet",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ["10.0.0.0/16"],
  },
  tags: {
    environment: "production",
    project: "networking",
  },
});

app.synth();
```

## Advanced Usage

### Virtual Network with Custom DNS Servers

```typescript
const vnet = new VirtualNetwork(stack, "vnet-custom-dns", {
  name: "vnet-with-dns",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ["10.0.0.0/16"],
  },
  dhcpOptions: {
    dnsServers: ["10.0.0.4", "10.0.0.5"],
  },
  tags: {
    environment: "production",
  },
});
```

### Multiple Address Spaces

```typescript
const vnet = new VirtualNetwork(stack, "vnet-multi-address", {
  name: "vnet-multi",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ["10.0.0.0/16", "10.1.0.0/16"],
  },
});
```

### DDoS Protection and VM Protection

```typescript
const vnet = new VirtualNetwork(stack, "vnet-protected", {
  name: "vnet-protected",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ["10.0.0.0/16"],
  },
  enableDdosProtection: true,
  enableVmProtection: true,
});
```

### Flow Timeout Configuration

```typescript
const vnet = new VirtualNetwork(stack, "vnet-flow-timeout", {
  name: "vnet-flow",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ["10.0.0.0/16"],
  },
  flowTimeoutInMinutes: 20, // Valid range: 4-30 minutes
});
```

### Pinning to a Specific API Version

```typescript
const vnet = new VirtualNetwork(stack, "vnet-pinned", {
  name: "vnet-stable",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  apiVersion: "2024-07-01", // Pin to specific version
  addressSpace: {
    addressPrefixes: ["10.0.0.0/16"],
  },
});
```

### Using Outputs

```typescript
const vnet = new VirtualNetwork(stack, "vnet", {
  name: "my-vnet",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ["10.0.0.0/16"],
  },
});

// Access VNet ID for use in other resources
console.log(vnet.id); // Terraform interpolation string
console.log(vnet.resourceId); // Alias for id

// Use outputs for cross-stack references
new TerraformOutput(stack, "vnet-id", {
  value: vnet.idOutput,
});
```

### Ignore Changes Lifecycle

```typescript
const vnet = new VirtualNetwork(stack, "vnet-ignore-changes", {
  name: "vnet-lifecycle",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ["10.0.0.0/16"],
  },
  tags: {
    managed: "terraform",
  },
  ignoreChanges: ["tags"], // Ignore changes to tags
});
```

### Tag Management

```typescript
const vnet = new VirtualNetwork(stack, "vnet-tags", {
  name: "vnet-tags",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ["10.0.0.0/16"],
  },
  tags: {
    environment: "production",
  },
});

// Add a tag
vnet.addTag("cost-center", "engineering");

// Remove a tag
vnet.removeTag("environment");
```

## API Reference

### VirtualNetworkProps

Configuration properties for the Virtual Network construct.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | No* | Name of the virtual network. If not provided, uses the construct ID. |
| `location` | `string` | Yes | Azure region where the VNet will be created. |
| `resourceGroupId` | `string` | No | Resource group ID. If not provided, uses subscription scope. |
| `addressSpace` | `VirtualNetworkAddressSpace` | Yes | Address space configuration with address prefixes. |
| `dhcpOptions` | `VirtualNetworkDhcpOptions` | No | DHCP options including DNS servers. |
| `subnets` | `any[]` | No | Inline subnet configurations. |
| `enableDdosProtection` | `boolean` | No | Enable DDoS protection (default: false). |
| `enableVmProtection` | `boolean` | No | Enable VM protection (default: false). |
| `encryption` | `any` | No | Encryption settings for the VNet. |
| `flowTimeoutInMinutes` | `number` | No | Flow timeout in minutes (range: 4-30). |
| `tags` | `{ [key: string]: string }` | No | Resource tags. |
| `apiVersion` | `string` | No | Pin to a specific API version. |
| `ignoreChanges` | `string[]` | No | Properties to ignore during updates. |

### VirtualNetworkAddressSpace

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `addressPrefixes` | `string[]` | Yes | Array of address prefixes in CIDR notation (e.g., ["10.0.0.0/16"]). |

### VirtualNetworkDhcpOptions

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `dnsServers` | `string[]` | No | Array of DNS server IP addresses. |

### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The Azure resource ID of the VNet. |
| `resourceId` | `string` | Alias for `id`. |
| `tags` | `{ [key: string]: string }` | The tags assigned to the VNet. |
| `subscriptionId` | `string` | The subscription ID extracted from the VNet ID. |
| `addressSpace` | `string` | Terraform interpolation string for the address space. |

### Outputs

The construct automatically creates Terraform outputs:

- `id`: The VNet resource ID
- `name`: The VNet name
- `location`: The VNet location
- `addressSpace`: The VNet address space
- `tags`: The VNet tags

### Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `addTag` | `key: string, value: string` | Add a tag to the VNet (requires redeployment). |
| `removeTag` | `key: string` | Remove a tag from the VNet (requires redeployment). |

## Best Practices

### 1. Use Latest API Version for New Deployments

Unless you have specific requirements, use the default (latest) API version:

```typescript
// ✅ Recommended - Uses latest version automatically
const vnet = new VirtualNetwork(stack, "vnet", {
  name: "my-vnet",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
});
```

### 2. Pin API Versions for Production Stability

For production workloads, consider pinning to a specific API version:

```typescript
// ✅ Production-ready - Pinned version
const vnet = new VirtualNetwork(stack, "vnet", {
  name: "prod-vnet",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  apiVersion: "2024-10-01",
  addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
});
```

### 3. Use Proper Address Space Planning

Plan your address spaces carefully to avoid conflicts:

```typescript
// ✅ Good - Non-overlapping address spaces
const hubVnet = new VirtualNetwork(stack, "hub", {
  name: "hub-vnet",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
});

const spokeVnet = new VirtualNetwork(stack, "spoke", {
  name: "spoke-vnet",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: { addressPrefixes: ["10.1.0.0/16"] },
});
```

### 4. Use Tags for Resource Management

Apply consistent tags for better organization:

```typescript
// ✅ Recommended - Comprehensive tagging
const vnet = new VirtualNetwork(stack, "vnet", {
  name: "my-vnet",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
  tags: {
    environment: "production",
    cost-center: "engineering",
    managed-by: "terraform",
    project: "network-infrastructure",
  },
});
```

### 5. Configure Custom DNS When Needed

Use custom DNS servers for hybrid scenarios:

```typescript
// ✅ Hybrid networking setup
const vnet = new VirtualNetwork(stack, "vnet", {
  name: "hybrid-vnet",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
  dhcpOptions: {
    dnsServers: ["10.0.0.4", "10.0.0.5"], // Custom DNS servers
  },
});
```

## Troubleshooting

### Common Issues

1. **Address Space Conflicts**: Ensure address spaces don't overlap with existing VNets or on-premises networks.

2. **API Version Errors**: If you encounter API version errors, verify the version is supported (2025-01-01, 2024-10-01, or 2024-07-01).

3. **Permission Issues**: Ensure your Azure service principal has `Network Contributor` role or equivalent permissions.

## Related Constructs

- [`ResourceGroup`](../azure-resourcegroup/README.md) - Azure Resource Groups
- [`Subnet`](../azure-subnet/README.md) - Virtual Network Subnets (coming soon)
- [`NetworkSecurityGroup`](../azure-networksecuritygroup/README.md) - Network Security Groups (coming soon)
- [`NetworkInterface`](../azure-networkinterface/README.md) - Network Interfaces (coming soon)

## Additional Resources

- [Azure Virtual Network Documentation](https://learn.microsoft.com/en-us/azure/virtual-network/)
- [Azure REST API Reference](https://learn.microsoft.com/en-us/rest/api/azure/)
- [Terraform CDK Documentation](https://developer.hashicorp.com/terraform/cdktf)

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.