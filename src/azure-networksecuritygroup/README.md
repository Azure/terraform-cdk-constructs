# Azure Network Security Group Construct

This module provides a high-level TypeScript construct for managing Azure Network Security Groups (NSGs) using the Terraform CDK and Azure AZAPI provider.

## Features

- **Multiple API Version Support**: Automatically supports the 3 most recent stable API versions (2025-01-01, 2024-10-01, 2024-07-01)
- **Automatic Version Resolution**: Uses the latest API version by default
- **Version Pinning**: Lock to a specific API version for stability
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **JSII Compatible**: Can be used from TypeScript, Python, Java, and C#
- **Security Rule Management**: Comprehensive support for inbound and outbound rules
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

### Simple Network Security Group

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { NetworkSecurityGroup } from "@microsoft/terraform-cdk-constructs/azure-networksecuritygroup";

const app = new App();
const stack = new TerraformStack(app, "nsg-stack");

// Configure the Azure provider
new AzapiProvider(stack, "azapi", {});

// Create a resource group
const resourceGroup = new ResourceGroup(stack, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

// Create a network security group with basic rules
const nsg = new NetworkSecurityGroup(stack, "nsg", {
  name: "my-nsg",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [
    {
      name: "AllowSSH",
      properties: {
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "22",
        sourceAddressPrefix: "10.0.0.0/24",
        destinationAddressPrefix: "*",
        access: "Allow",
        priority: 100,
        direction: "Inbound",
      },
    },
  ],
  tags: {
    environment: "production",
    project: "networking",
  },
});

app.synth();
```

## Security Rule Examples

### Allow SSH from Specific IP Range

```typescript
const nsg = new NetworkSecurityGroup(stack, "nsg-ssh", {
  name: "nsg-ssh-access",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [
    {
      name: "AllowSSHFromOffice",
      properties: {
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "22",
        sourceAddressPrefix: "203.0.113.0/24", // Office IP range
        destinationAddressPrefix: "*",
        access: "Allow",
        priority: 100,
        direction: "Inbound",
      },
    },
  ],
});
```

### Allow HTTP/HTTPS from Internet

```typescript
const nsg = new NetworkSecurityGroup(stack, "nsg-web", {
  name: "nsg-web-access",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [
    {
      name: "AllowHTTP",
      properties: {
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "80",
        sourceAddressPrefix: "Internet",
        destinationAddressPrefix: "*",
        access: "Allow",
        priority: 100,
        direction: "Inbound",
      },
    },
    {
      name: "AllowHTTPS",
      properties: {
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "443",
        sourceAddressPrefix: "Internet",
        destinationAddressPrefix: "*",
        access: "Allow",
        priority: 110,
        direction: "Inbound",
      },
    },
  ],
});
```

### Allow RDP from Management Subnet

```typescript
const nsg = new NetworkSecurityGroup(stack, "nsg-rdp", {
  name: "nsg-rdp-access",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [
    {
      name: "AllowRDPFromManagement",
      properties: {
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "3389",
        sourceAddressPrefix: "10.0.1.0/24", // Management subnet
        destinationAddressPrefix: "*",
        access: "Allow",
        priority: 100,
        direction: "Inbound",
      },
    },
  ],
});
```

### Deny All Inbound Traffic (Default Deny)

```typescript
const nsg = new NetworkSecurityGroup(stack, "nsg-deny", {
  name: "nsg-deny-all",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [
    {
      name: "DenyAllInbound",
      properties: {
        protocol: "*",
        sourcePortRange: "*",
        destinationPortRange: "*",
        sourceAddressPrefix: "*",
        destinationAddressPrefix: "*",
        access: "Deny",
        priority: 4096, // Lowest priority (evaluated last)
        direction: "Inbound",
      },
    },
  ],
});
```

### Allow Specific Outbound Traffic

```typescript
const nsg = new NetworkSecurityGroup(stack, "nsg-outbound", {
  name: "nsg-outbound-restricted",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [
    {
      name: "AllowHTTPSOutbound",
      properties: {
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "443",
        sourceAddressPrefix: "*",
        destinationAddressPrefix: "Internet",
        access: "Allow",
        priority: 100,
        direction: "Outbound",
      },
    },
    {
      name: "AllowDNSOutbound",
      properties: {
        protocol: "Udp",
        sourcePortRange: "*",
        destinationPortRange: "53",
        sourceAddressPrefix: "*",
        destinationAddressPrefix: "*",
        access: "Allow",
        priority: 110,
        direction: "Outbound",
      },
    },
  ],
});
```

## Advanced Usage

### Multiple Rules with Different Protocols

```typescript
const nsg = new NetworkSecurityGroup(stack, "nsg-multi-protocol", {
  name: "nsg-complex",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [
    {
      name: "AllowSQL",
      properties: {
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "1433",
        sourceAddressPrefix: "10.0.2.0/24",
        destinationAddressPrefix: "*",
        access: "Allow",
        priority: 100,
        direction: "Inbound",
      },
    },
    {
      name: "AllowICMPPing",
      properties: {
        protocol: "Icmp",
        sourcePortRange: "*",
        destinationPortRange: "*",
        sourceAddressPrefix: "VirtualNetwork",
        destinationAddressPrefix: "*",
        access: "Allow",
        priority: 200,
        direction: "Inbound",
      },
    },
  ],
});
```

### Using Port Ranges

```typescript
const nsg = new NetworkSecurityGroup(stack, "nsg-port-range", {
  name: "nsg-port-range",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [
    {
      name: "AllowWebPorts",
      properties: {
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "8080-8090", // Port range
        sourceAddressPrefix: "Internet",
        destinationAddressPrefix: "*",
        access: "Allow",
        priority: 100,
        direction: "Inbound",
      },
    },
  ],
});
```

### Pinning to a Specific API Version

```typescript
const nsg = new NetworkSecurityGroup(stack, "nsg-pinned", {
  name: "nsg-stable",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  apiVersion: "2024-07-01", // Pin to specific version
  securityRules: [
    {
      name: "AllowSSH",
      properties: {
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "22",
        sourceAddressPrefix: "10.0.0.0/16",
        destinationAddressPrefix: "*",
        access: "Allow",
        priority: 100,
        direction: "Inbound",
      },
    },
  ],
});
```

### Using Outputs

```typescript
const nsg = new NetworkSecurityGroup(stack, "nsg", {
  name: "my-nsg",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [],
});

// Access NSG ID for use in other resources (e.g., subnet association)
console.log(nsg.id); // Terraform interpolation string
console.log(nsg.resourceId); // Alias for id

// Use outputs for cross-stack references
new TerraformOutput(stack, "nsg-id", {
  value: nsg.idOutput,
});
```

### Tag Management

```typescript
const nsg = new NetworkSecurityGroup(stack, "nsg-tags", {
  name: "nsg-tags",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [],
  tags: {
    environment: "production",
  },
});

// Add a tag
nsg.addTag("cost-center", "engineering");

// Remove a tag
nsg.removeTag("environment");
```

## Understanding Security Rules

### Priority System

- Priority range: **100-4096** (lower number = higher priority)
- Rules are evaluated in priority order (100 is evaluated first)
- Once a matching rule is found, evaluation stops
- Azure has default rules with priority 65000+ that allow VNet traffic and deny all other inbound traffic

### Rule Evaluation Order

1. Rules are processed by priority (ascending order)
2. First matching rule is applied
3. No further rules are evaluated after a match

Example:
```typescript
securityRules: [
  {
    name: "AllowHTTP",
    properties: {
      priority: 100, // Evaluated first
      access: "Allow",
      // ...
    },
  },
  {
    name: "DenyAll",
    properties: {
      priority: 200, // Evaluated second (if no match above)
      access: "Deny",
      // ...
    },
  },
]
```

### Protocol Types

- `Tcp` - TCP protocol
- `Udp` - UDP protocol
- `Icmp` - ICMP protocol (for ping)
- `Esp` - Encapsulating Security Payload
- `Ah` - Authentication Header
- `*` - Any protocol

### Service Tags

Instead of IP addresses, you can use Azure service tags:

- `Internet` - All Internet addresses
- `VirtualNetwork` - All addresses in the VNet and connected VNets
- `AzureLoadBalancer` - Azure Load Balancer
- `AzureCloud` - All Azure datacenter IP addresses
- And many more...

```typescript
{
  name: "AllowAzureServices",
  properties: {
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "443",
    sourceAddressPrefix: "AzureCloud",
    destinationAddressPrefix: "*",
    access: "Allow",
    priority: 100,
    direction: "Inbound",
  },
}
```

## API Reference

### NetworkSecurityGroupProps

Configuration properties for the Network Security Group construct.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | No* | Name of the NSG. If not provided, uses the construct ID. |
| `location` | `string` | Yes | Azure region where the NSG will be created. |
| `resourceGroupId` | `string` | No | Resource group ID. If not provided, uses subscription scope. |
| `securityRules` | `SecurityRule[]` | No | Array of security rule configurations. |
| `flushConnection` | `boolean` | No | When enabled, flows created from NSG will be re-evaluated when rules are updated. |
| `tags` | `{ [key: string]: string }` | No | Resource tags. |
| `apiVersion` | `string` | No | Pin to a specific API version. |
| `ignoreChanges` | `string[]` | No | Properties to ignore during updates. |

### SecurityRule

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Name of the security rule. |
| `properties` | `SecurityRuleProperties` | Yes | Security rule properties. |

### SecurityRuleProperties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `protocol` | `string` | Yes | Protocol: `Tcp`, `Udp`, `Icmp`, `Esp`, `Ah`, or `*` |
| `sourcePortRange` | `string` | No | Source port or range (e.g., `80` or `80-90` or `*`) |
| `destinationPortRange` | `string` | No | Destination port or range |
| `sourceAddressPrefix` | `string` | No | Source address prefix (CIDR or service tag) |
| `destinationAddressPrefix` | `string` | No | Destination address prefix |
| `access` | `string` | Yes | `Allow` or `Deny` |
| `priority` | `number` | Yes | Priority (100-4096, lower = higher priority) |
| `direction` | `string` | Yes | `Inbound` or `Outbound` |
| `description` | `string` | No | Description of the rule |

### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The Azure resource ID of the NSG. |
| `resourceId` | `string` | Alias for `id`. |
| `tags` | `{ [key: string]: string }` | The tags assigned to the NSG. |
| `subscriptionId` | `string` | The subscription ID extracted from the NSG ID. |
| `securityRules` | `string` | Terraform interpolation string for the security rules. |

### Outputs

The construct automatically creates Terraform outputs:

- `id`: The NSG resource ID
- `name`: The NSG name
- `location`: The NSG location
- `securityRules`: The NSG security rules
- `tags`: The NSG tags

### Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `addTag` | `key: string, value: string` | Add a tag to the NSG (requires redeployment). |
| `removeTag` | `key: string` | Remove a tag from the NSG (requires redeployment). |

## Best Practices

### 1. Use Latest API Version for New Deployments

Unless you have specific requirements, use the default (latest) API version:

```typescript
// ✅ Recommended - Uses latest version automatically
const nsg = new NetworkSecurityGroup(stack, "nsg", {
  name: "my-nsg",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [],
});
```

### 2. Pin API Versions for Production Stability

For production workloads, consider pinning to a specific API version:

```typescript
// ✅ Production-ready - Pinned version
const nsg = new NetworkSecurityGroup(stack, "nsg", {
  name: "prod-nsg",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  apiVersion: "2024-10-01",
  securityRules: [],
});
```

### 3. Follow Principle of Least Privilege

Only allow necessary traffic and deny everything else:

```typescript
// ✅ Good - Specific allow rules with default deny
const nsg = new NetworkSecurityGroup(stack, "nsg", {
  name: "secure-nsg",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [
    {
      name: "AllowHTTPSOnly",
      properties: {
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "443",
        sourceAddressPrefix: "Internet",
        destinationAddressPrefix: "*",
        access: "Allow",
        priority: 100,
        direction: "Inbound",
      },
    },
    {
      name: "DenyAllElse",
      properties: {
        protocol: "*",
        sourcePortRange: "*",
        destinationPortRange: "*",
        sourceAddressPrefix: "*",
        destinationAddressPrefix: "*",
        access: "Deny",
        priority: 4096,
        direction: "Inbound",
      },
    },
  ],
});
```

### 4. Use Service Tags Instead of IP Ranges When Possible

Service tags are maintained by Microsoft and automatically updated:

```typescript
// ✅ Recommended - Using service tags
const nsg = new NetworkSecurityGroup(stack, "nsg", {
  name: "my-nsg",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [
    {
      name: "AllowFromVNet",
      properties: {
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "443",
        sourceAddressPrefix: "VirtualNetwork", // Service tag
        destinationAddressPrefix: "*",
        access: "Allow",
        priority: 100,
        direction: "Inbound",
      },
    },
  ],
});
```

### 5. Document Your Security Rules

Add descriptions to security rules for maintainability:

```typescript
// ✅ Good - Well documented rules
const nsg = new NetworkSecurityGroup(stack, "nsg", {
  name: "documented-nsg",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [
    {
      name: "AllowWebTraffic",
      properties: {
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "443",
        sourceAddressPrefix: "Internet",
        destinationAddressPrefix: "*",
        access: "Allow",
        priority: 100,
        direction: "Inbound",
        description: "Allow HTTPS from Internet for public web application",
      },
    },
  ],
});
```

### 6. Use Appropriate Priority Spacing

Leave gaps between priorities for future rule insertion:

```typescript
// ✅ Good - Priority spacing allows for future rules
const nsg = new NetworkSecurityGroup(stack, "nsg", {
  name: "my-nsg",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [
    { name: "Rule1", properties: { priority: 100, /* ... */ } },
    { name: "Rule2", properties: { priority: 200, /* ... */ } }, // Gap of 100
    { name: "Rule3", properties: { priority: 300, /* ... */ } },
  ],
});
```

### 7. Tag Resources Consistently

Apply consistent tags for better organization and cost tracking:

```typescript
// ✅ Recommended - Comprehensive tagging
const nsg = new NetworkSecurityGroup(stack, "nsg", {
  name: "my-nsg",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  securityRules: [],
  tags: {
    environment: "production",
    "cost-center": "engineering",
    "managed-by": "terraform",
    purpose: "web-tier-security",
  },
});
```

## Troubleshooting

### Common Issues

1. **Priority Conflicts**: Ensure each rule has a unique priority between 100-4096.

2. **Port Range Errors**: Verify port ranges are valid (e.g., `80`, `80-90`, `*`).

3. **Protocol Errors**: Use valid protocol values: `Tcp`, `Udp`, `Icmp`, `Esp`, `Ah`, or `*`.

4. **API Version Errors**: If you encounter API version errors, verify the version is supported (2025-01-01, 2024-10-01, or 2024-07-01).

5. **Permission Issues**: Ensure your Azure service principal has `Network Contributor` role or equivalent permissions.

## Related Constructs

- [`ResourceGroup`](../azure-resourcegroup/README.md) - Azure Resource Groups
- [`VirtualNetwork`](../azure-virtualnetwork/README.md) - Virtual Networks
- [`Subnet`](../azure-subnet/README.md) - Virtual Network Subnets
- [`NetworkInterface`](../azure-networkinterface/README.md) - Network Interfaces (coming soon)

## Additional Resources

- [Azure Network Security Groups Documentation](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview)
- [Azure Security Best Practices](https://learn.microsoft.com/en-us/azure/security/fundamentals/network-best-practices)
- [Azure Service Tags](https://learn.microsoft.com/en-us/azure/virtual-network/service-tags-overview)
- [Azure REST API Reference](https://learn.microsoft.com/en-us/rest/api/azure/)
- [Terraform CDK Documentation](https://developer.hashicorp.com/terraform/cdktf)

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.