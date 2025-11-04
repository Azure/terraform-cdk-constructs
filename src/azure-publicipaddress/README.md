# Azure Public IP Address Construct

This module provides a high-level TypeScript construct for managing Azure Public IP Addresses using the Terraform CDK and Azure AZAPI provider.

## Features

- **Multiple API Version Support**: Automatically supports the 3 most recent stable API versions (2025-01-01, 2024-10-01, 2024-07-01)
- **Automatic Version Resolution**: Uses the latest API version by default
- **Version Pinning**: Lock to a specific API version for stability
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **JSII Compatible**: Can be used from TypeScript, Python, Java, and C#
- **Terraform Outputs**: Automatic creation of outputs for easy reference
- **Tag Management**: Built-in methods for managing resource tags
- **SKU Support**: Standard and Basic SKU options
- **Zone Support**: Availability zone configuration for high availability

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

### Simple Standard Static Public IP

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { PublicIPAddress } from "@microsoft/terraform-cdk-constructs/azure-publicipaddress";

const app = new App();
const stack = new TerraformStack(app, "public-ip-stack");

// Configure the Azure provider
new AzapiProvider(stack, "azapi", {});

// Create a resource group
const resourceGroup = new ResourceGroup(stack, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

// Create a public IP address
const publicIp = new PublicIPAddress(stack, "public-ip", {
  name: "my-public-ip",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
  },
  publicIPAllocationMethod: "Static",
  tags: {
    environment: "production",
    purpose: "load-balancer",
  },
});

app.synth();
```

## Advanced Usage

### Standard Static Public IP for Load Balancer (Zone-Redundant)

```typescript
const lbPublicIp = new PublicIPAddress(stack, "lb-public-ip", {
  name: "pip-load-balancer",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
    tier: "Regional",
  },
  publicIPAllocationMethod: "Static",
  zones: ["1", "2", "3"], // Zone-redundant across all availability zones
  tags: {
    purpose: "load-balancer",
    tier: "production",
  },
});
```

### Basic Dynamic Public IP for Virtual Machine

```typescript
const vmPublicIp = new PublicIPAddress(stack, "vm-public-ip", {
  name: "pip-virtual-machine",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Basic",
  },
  publicIPAllocationMethod: "Dynamic",
  tags: {
    purpose: "virtual-machine",
    tier: "development",
  },
});
```

### Public IP with DNS Label

```typescript
const dnsPublicIp = new PublicIPAddress(stack, "dns-public-ip", {
  name: "pip-with-dns",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
  },
  publicIPAllocationMethod: "Static",
  dnsSettings: {
    domainNameLabel: "myapp", // Creates myapp.eastus.cloudapp.azure.com
  },
  tags: {
    purpose: "application-gateway",
  },
});
```

### Zonal Public IP for NAT Gateway

```typescript
const natPublicIp = new PublicIPAddress(stack, "nat-public-ip", {
  name: "pip-nat-gateway",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
  },
  publicIPAllocationMethod: "Static",
  zones: ["1"], // Pinned to a specific zone
  idleTimeoutInMinutes: 30, // Maximum timeout for long-lived connections
  tags: {
    purpose: "nat-gateway",
    zone: "1",
  },
});
```

### IPv6 Public IP Address

```typescript
const ipv6PublicIp = new PublicIPAddress(stack, "ipv6-public-ip", {
  name: "pip-ipv6",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
  },
  publicIPAllocationMethod: "Static",
  publicIPAddressVersion: "IPv6",
  zones: ["1", "2", "3"],
  tags: {
    purpose: "dual-stack-networking",
  },
});
```

### Global Tier Public IP for Cross-Region Load Balancer

```typescript
const globalPublicIp = new PublicIPAddress(stack, "global-public-ip", {
  name: "pip-global",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
    tier: "Global",
  },
  publicIPAllocationMethod: "Static",
  tags: {
    purpose: "cross-region-load-balancer",
  },
});
```

### Pinning to a Specific API Version

```typescript
const publicIp = new PublicIPAddress(stack, "versioned-public-ip", {
  name: "pip-stable",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  apiVersion: "2024-07-01", // Pin to specific version
  sku: {
    name: "Standard",
  },
  publicIPAllocationMethod: "Static",
});
```

### Using Outputs

```typescript
const publicIp = new PublicIPAddress(stack, "public-ip", {
  name: "my-public-ip",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
  },
  publicIPAllocationMethod: "Static",
});

// Access Public IP ID for use in other resources
console.log(publicIp.id); // Terraform interpolation string
console.log(publicIp.resourceId); // Alias for id

// Access the allocated IP address
console.log(publicIp.ipAddressOutput); // The actual IP address
console.log(publicIp.fqdnOutput); // FQDN if DNS label is configured

// Use outputs for cross-stack references
new TerraformOutput(stack, "public-ip-address", {
  value: publicIp.ipAddressOutput,
});
```

### Tag Management

```typescript
const publicIp = new PublicIPAddress(stack, "public-ip", {
  name: "my-public-ip",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
  },
  publicIPAllocationMethod: "Static",
  tags: {
    environment: "production",
  },
});

// Add a tag
publicIp.addTag("cost-center", "engineering");

// Remove a tag
publicIp.removeTag("environment");
```

## API Reference

### PublicIPAddressProps

Configuration properties for the Public IP Address construct.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | No* | Name of the public IP address. If not provided, uses the construct ID. |
| `location` | `string` | Yes | Azure region where the Public IP will be created. |
| `resourceGroupId` | `string` | No | Resource group ID. If not provided, uses subscription scope. |
| `sku` | `PublicIPAddressSku` | No | SKU configuration (default: Standard). |
| `publicIPAllocationMethod` | `string` | No | Allocation method: "Static" or "Dynamic" (default: Dynamic). |
| `publicIPAddressVersion` | `string` | No | IP version: "IPv4" or "IPv6" (default: IPv4). |
| `dnsSettings` | `PublicIPAddressDnsSettings` | No | DNS configuration including domain name label. |
| `idleTimeoutInMinutes` | `number` | No | Idle timeout in minutes (range: 4-30). |
| `zones` | `string[]` | No | Availability zones (e.g., ["1", "2", "3"]). |
| `tags` | `{ [key: string]: string }` | No | Resource tags. |
| `apiVersion` | `string` | No | Pin to a specific API version. |
| `ignoreChanges` | `string[]` | No | Properties to ignore during updates. |

### PublicIPAddressSku

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | SKU name: "Standard" or "Basic". |
| `tier` | `string` | No | SKU tier: "Regional" or "Global" (Standard SKU only). |

### PublicIPAddressDnsSettings

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `domainNameLabel` | `string` | No | Domain name label for DNS configuration. |
| `fqdn` | `string` | No | Fully qualified domain name (read-only). |
| `reverseFqdn` | `string` | No | Reverse FQDN for reverse DNS lookup. |

### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The Azure resource ID of the Public IP. |
| `resourceId` | `string` | Alias for `id`. |
| `tags` | `{ [key: string]: string }` | The tags assigned to the Public IP. |
| `subscriptionId` | `string` | The subscription ID extracted from the Public IP ID. |

### Outputs

The construct automatically creates Terraform outputs:

- `id`: The Public IP resource ID
- `name`: The Public IP name
- `location`: The Public IP location
- `ipAddress`: The allocated IP address
- `fqdn`: The fully qualified domain name (if DNS label is configured)
- `tags`: The Public IP tags

### Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `addTag` | `key: string, value: string` | Add a tag to the Public IP (requires redeployment). |
| `removeTag` | `key: string` | Remove a tag from the Public IP (requires redeployment). |

## SKU Comparison

### Standard SKU
- **Availability Zones**: Supported (zone-redundant or zonal)
- **Allocation Method**: Requires Static allocation
- **SLA**: 99.99% uptime SLA
- **Security**: Secure by default, NSG required for inbound traffic
- **Use Cases**: Production load balancers, NAT gateways, application gateways
- **Pricing**: Higher cost

### Basic SKU
- **Availability Zones**: Not supported
- **Allocation Method**: Supports Static or Dynamic
- **SLA**: No SLA
- **Security**: Open by default
- **Use Cases**: Development/test VMs, non-production workloads
- **Pricing**: Lower cost

## Allocation Methods

### Static Allocation
- IP address is allocated immediately when the resource is created
- IP address remains constant even when resource is stopped/deallocated
- **Required** for Standard SKU
- Recommended for production workloads

### Dynamic Allocation
- IP address is allocated only when associated with a resource
- IP address may change if resource is stopped/deallocated
- Only supported with Basic SKU
- Suitable for development/test environments

## Best Practices

### 1. Use Standard SKU for Production

```typescript
// ✅ Recommended - Standard SKU with zone redundancy
const publicIp = new PublicIPAddress(stack, "public-ip", {
  name: "prod-public-ip",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
    tier: "Regional",
  },
  publicIPAllocationMethod: "Static",
  zones: ["1", "2", "3"],
});
```

### 2. Configure DNS Labels for User-Friendly Access

```typescript
// ✅ Good - DNS label for easy access
const publicIp = new PublicIPAddress(stack, "public-ip", {
  name: "app-public-ip",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
  },
  publicIPAllocationMethod: "Static",
  dnsSettings: {
    domainNameLabel: "myapp", // Creates myapp.eastus.cloudapp.azure.com
  },
});
```

### 3. Use Zone Redundancy for High Availability

```typescript
// ✅ Recommended - Zone-redundant deployment
const publicIp = new PublicIPAddress(stack, "public-ip", {
  name: "ha-public-ip",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
  },
  publicIPAllocationMethod: "Static",
  zones: ["1", "2", "3"], // Spread across all zones
});
```

### 4. Apply Consistent Tags

```typescript
// ✅ Recommended - Comprehensive tagging
const publicIp = new PublicIPAddress(stack, "public-ip", {
  name: "my-public-ip",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
  },
  publicIPAllocationMethod: "Static",
  tags: {
    environment: "production",
    "cost-center": "engineering",
    "managed-by": "terraform",
    purpose: "load-balancer",
  },
});
```

### 5. Configure Appropriate Idle Timeout

```typescript
// ✅ Good - Longer timeout for persistent connections
const publicIp = new PublicIPAddress(stack, "public-ip", {
  name: "nat-public-ip",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
  },
  publicIPAllocationMethod: "Static",
  idleTimeoutInMinutes: 30, // Maximum for NAT Gateway scenarios
});
```

## Common Use Cases

### Load Balancer Public IP

```typescript
const lbPublicIp = new PublicIPAddress(stack, "lb-pip", {
  name: "pip-lb",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  publicIPAllocationMethod: "Static",
  zones: ["1", "2", "3"],
});
```

### Application Gateway Public IP

```typescript
const agwPublicIp = new PublicIPAddress(stack, "agw-pip", {
  name: "pip-agw",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  publicIPAllocationMethod: "Static",
  dnsSettings: { domainNameLabel: "myapp" },
  zones: ["1", "2", "3"],
});
```

### NAT Gateway Public IP

```typescript
const natPublicIp = new PublicIPAddress(stack, "nat-pip", {
  name: "pip-nat",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  publicIPAllocationMethod: "Static",
  zones: ["1"],
  idleTimeoutInMinutes: 30,
});
```

### Virtual Machine Public IP (Dev/Test)

```typescript
const vmPublicIp = new PublicIPAddress(stack, "vm-pip", {
  name: "pip-vm",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Basic" },
  publicIPAllocationMethod: "Dynamic",
});
```

## Troubleshooting

### Common Issues

1. **SKU Mismatch**: Standard SKU requires Static allocation. Use `publicIPAllocationMethod: "Static"` with Standard SKU.

2. **Zone Availability**: Not all regions support availability zones. Verify zone availability in your target region.

3. **DNS Label Conflicts**: DNS labels must be unique within a region. Choose unique labels or omit the DNS configuration.

4. **API Version Errors**: If you encounter API version errors, verify the version is supported (2025-01-01, 2024-10-01, or 2024-07-01).

5. **Permission Issues**: Ensure your Azure service principal has `Network Contributor` role or equivalent permissions.

## Related Constructs

- [`ResourceGroup`](../azure-resourcegroup/README.md) - Azure Resource Groups
- [`VirtualNetwork`](../azure-virtualnetwork/README.md) - Virtual Networks
- [`NetworkSecurityGroup`](../azure-networksecuritygroup/README.md) - Network Security Groups
- [`Subnet`](../azure-subnet/README.md) - Virtual Network Subnets

## Additional Resources

- [Azure Public IP Documentation](https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/public-ip-addresses)
- [Azure REST API Reference](https://learn.microsoft.com/en-us/rest/api/azure/)
- [Terraform CDK Documentation](https://developer.hashicorp.com/terraform/cdktf)

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.