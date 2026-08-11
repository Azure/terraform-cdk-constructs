# Azure Bastion Host Construct

This module provides a high-level TypeScript construct for managing Azure Bastion Hosts using the Terraform CDK and Azure AZAPI provider.

Azure Bastion provides secure and seamless RDP/SSH connectivity to virtual machines directly over TLS from the Azure portal or a native client, without exposing the VMs to the public internet.

## Features

- **Multiple API Version Support**: Supports the most recent stable API versions (2024-10-01, 2024-07-01)
- **Automatic Version Resolution**: Uses the latest API version by default
- **Version Pinning**: Lock to a specific API version for stability
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **JSII Compatible**: Can be used from TypeScript, Python, Java, and C#
- **Terraform Outputs**: Automatic creation of outputs for easy reference
- **Tag Management**: Built-in methods for managing resource tags
- **SKU Support**: Developer, Basic, Standard, and Premium SKU options
- **Feature Flags**: Native client tunneling, IP connect, shareable links, Kerberos, session recording, and copy/paste control
- **Zone Support**: Availability zone configuration for high availability

## Supported API Versions

| Version | Status | Release Date | Notes |
|---------|--------|--------------|-------|
| 2024-10-01 | Active (Latest) | 2024-10-01 | Recommended for new deployments |
| 2024-07-01 | Active | 2024-07-01 | Stable release with native client and IP connect support |

## Installation

This module is part of the `@microsoft/terraform-cdk-constructs` package.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Basic Usage

### Standard Bastion Host

A Basic/Standard/Premium Bastion host requires a dedicated subnet named **`AzureBastionSubnet`** (minimum `/26`) and a **Standard** SKU **Static** public IP.

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { VirtualNetwork } from "@microsoft/terraform-cdk-constructs/azure-virtualnetwork";
import { Subnet } from "@microsoft/terraform-cdk-constructs/azure-subnet";
import { PublicIPAddress } from "@microsoft/terraform-cdk-constructs/azure-publicipaddress";
import { BastionHost } from "@microsoft/terraform-cdk-constructs/azure-bastionhost";

const app = new App();
const stack = new TerraformStack(app, "bastion-stack");

new AzapiProvider(stack, "azapi", {});

const resourceGroup = new ResourceGroup(stack, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

const vnet = new VirtualNetwork(stack, "vnet", {
  name: "my-vnet",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
});

// The subnet MUST be named exactly "AzureBastionSubnet"
const bastionSubnet = new Subnet(stack, "bastion-subnet", {
  name: "AzureBastionSubnet",
  virtualNetworkName: vnet.name,
  resourceGroupId: resourceGroup.id,
  addressPrefix: "10.0.1.0/26",
});

// Bastion requires a Standard SKU, Static public IP
const bastionPip = new PublicIPAddress(stack, "bastion-pip", {
  name: "bastion-pip",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  publicIPAllocationMethod: "Static",
});

const bastion = new BastionHost(stack, "bastion", {
  name: "my-bastion",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  ipConfiguration: {
    subnetId: bastionSubnet.id,
    publicIpAddressId: bastionPip.id,
  },
  enableTunneling: true,
  scaleUnits: 2,
});

app.synth();
```

## Advanced Usage

### Developer SKU (subnet-less)

The Developer SKU is a lightweight, free option that attaches directly to a virtual network and does **not** require an `AzureBastionSubnet` or a public IP.

```typescript
const bastion = new BastionHost(stack, "bastion", {
  name: "dev-bastion",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Developer" },
  virtualNetworkId: vnet.id,
});
```

### Premium SKU with Session Recording

```typescript
const bastion = new BastionHost(stack, "bastion", {
  name: "premium-bastion",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Premium" },
  ipConfiguration: {
    subnetId: bastionSubnet.id,
    publicIpAddressId: bastionPip.id,
  },
  enableSessionRecording: true,
  disableCopyPaste: true,
});
```

### Standard SKU with all feature flags

```typescript
const bastion = new BastionHost(stack, "bastion", {
  name: "full-bastion",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  ipConfiguration: {
    subnetId: bastionSubnet.id,
    publicIpAddressId: bastionPip.id,
  },
  scaleUnits: 10,
  enableTunneling: true,
  enableIpConnect: true,
  enableShareableLink: true,
  enableKerberos: true,
  disableCopyPaste: false,
});
```

### Pinning to a Specific API Version

```typescript
const bastion = new BastionHost(stack, "bastion", {
  name: "pinned-bastion",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  apiVersion: "2024-07-01",
  sku: { name: "Standard" },
  ipConfiguration: {
    subnetId: bastionSubnet.id,
    publicIpAddressId: bastionPip.id,
  },
});
```

### Using Outputs

```typescript
const bastion = new BastionHost(stack, "bastion", {
  name: "my-bastion",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  ipConfiguration: {
    subnetId: bastionSubnet.id,
    publicIpAddressId: bastionPip.id,
  },
});

// Reference the resource ID and DNS name from other resources
const bastionId = bastion.id;
const bastionDnsName = bastion.dnsName;
```

### Tag Management

```typescript
const bastion = new BastionHost(stack, "bastion", {
  name: "my-bastion",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  ipConfiguration: {
    subnetId: bastionSubnet.id,
    publicIpAddressId: bastionPip.id,
  },
  tags: { environment: "production" },
});

bastion.addTag("cost-center", "engineering");
bastion.removeTag("environment");
```

## API Reference

### BastionHostProps

Configuration properties for the Bastion Host construct.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | No* | Name of the Bastion host. If not provided, uses the construct ID. |
| `location` | `string` | Yes | Azure region where the Bastion host will be created. |
| `resourceGroupId` | `string` | No | Resource group ID. If not provided, uses subscription scope. |
| `sku` | `BastionHostSku` | No | SKU configuration (default: Standard). |
| `ipConfiguration` | `BastionHostIpConfiguration` | No** | IP configuration referencing the `AzureBastionSubnet` and a Standard public IP. Required for Basic/Standard/Premium. |
| `virtualNetworkId` | `string` | No** | Virtual network resource ID. Required for the Developer SKU; mutually exclusive with `ipConfiguration`. |
| `scaleUnits` | `number` | No | Number of scale units (range: 2-50, Standard/Premium only). |
| `dnsName` | `string` | No | FQDN for the Bastion host. |
| `enableTunneling` | `boolean` | No | Enable native client support / tunneling (Standard/Premium). |
| `enableIpConnect` | `boolean` | No | Enable IP-based connection (Standard/Premium). |
| `enableShareableLink` | `boolean` | No | Enable shareable link (Standard/Premium). |
| `enableKerberos` | `boolean` | No | Enable Kerberos authentication. |
| `enableSessionRecording` | `boolean` | No | Enable session recording (Premium). |
| `disableCopyPaste` | `boolean` | No | Disable copy/paste in the web-based session (Standard/Premium). |
| `zones` | `string[]` | No | Availability zones (e.g., ["1", "2", "3"]). |
| `tags` | `{ [key: string]: string }` | No | Resource tags. |
| `apiVersion` | `string` | No | Pin to a specific API version. |
| `ignoreChanges` | `string[]` | No | Properties to ignore during updates. |

\* If `name` is omitted the construct ID is used.
\** Provide `ipConfiguration` for Basic/Standard/Premium SKUs, or `virtualNetworkId` for the Developer SKU.

### BastionHostSku

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | SKU name: "Developer", "Basic", "Standard", or "Premium". |

### BastionHostIpConfiguration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `subnetId` | `string` | Yes | Resource ID of the `AzureBastionSubnet`. |
| `publicIpAddressId` | `string` | Yes | Resource ID of the Standard, Static public IP. |
| `name` | `string` | No | Name of the IP configuration (default: "IpConf"). |
| `privateIpAllocationMethod` | `string` | No | Private IP allocation method (default: "Dynamic"). |

### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The Azure resource ID of the Bastion host. |
| `resourceId` | `string` | Alias for `id`. |
| `dnsName` | `string` | The Bastion host FQDN (Terraform interpolation). |
| `subscriptionId` | `string` | The subscription ID extracted from the Bastion host ID. |

### Outputs

The construct automatically creates Terraform outputs:

- `id`: The Bastion host resource ID
- `name`: The Bastion host name
- `location`: The Bastion host location
- `tags`: The Bastion host tags

### Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `addTag` | `key: string, value: string` | Add a tag to the Bastion host (requires redeployment). |
| `removeTag` | `key: string` | Remove a tag from the Bastion host (requires redeployment). |

## SKU Comparison

### Developer SKU
- **Subnet**: No `AzureBastionSubnet` required; attaches to the VNet directly
- **Public IP**: Not required
- **Features**: Basic portal-based connectivity only; no scaling, native client, or shareable links
- **Pricing**: Free
- **Use Cases**: Dev/test access to a small number of VMs

### Basic SKU
- **Subnet**: Requires `AzureBastionSubnet` (`/26` or larger)
- **Public IP**: Standard, Static
- **Features**: Portal-based RDP/SSH
- **Use Cases**: Simple production connectivity

### Standard SKU
- **Subnet**: Requires `AzureBastionSubnet` (`/26` or larger)
- **Public IP**: Standard, Static
- **Features**: Native client tunneling, IP connect, shareable links, Kerberos, scaling (2-50 units), copy/paste control
- **Use Cases**: Production at scale, native client workflows

### Premium SKU
- **Subnet**: Requires `AzureBastionSubnet` (`/26` or larger)
- **Public IP**: Standard, Static
- **Features**: All Standard features plus **session recording**
- **Use Cases**: Regulated environments needing audit trails

## Best Practices

### 1. Use a dedicated, correctly named subnet

```typescript
// ✅ Required - the subnet name must be exactly "AzureBastionSubnet" and at least /26
const bastionSubnet = new Subnet(stack, "bastion-subnet", {
  name: "AzureBastionSubnet",
  virtualNetworkName: vnet.name,
  resourceGroupId: resourceGroup.id,
  addressPrefix: "10.0.1.0/26",
});
```

### 2. Use a Standard, Static public IP

```typescript
// ✅ Required for Basic/Standard/Premium SKUs
const bastionPip = new PublicIPAddress(stack, "bastion-pip", {
  name: "bastion-pip",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  publicIPAllocationMethod: "Static",
});
```

### 3. Scale out for high concurrency

```typescript
// ✅ Increase scale units to support more concurrent sessions (Standard/Premium)
const bastion = new BastionHost(stack, "bastion", {
  name: "ha-bastion",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  ipConfiguration: {
    subnetId: bastionSubnet.id,
    publicIpAddressId: bastionPip.id,
  },
  scaleUnits: 20,
});
```

### 4. Apply consistent tags

```typescript
const bastion = new BastionHost(stack, "bastion", {
  name: "my-bastion",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  ipConfiguration: {
    subnetId: bastionSubnet.id,
    publicIpAddressId: bastionPip.id,
  },
  tags: {
    environment: "production",
    "cost-center": "engineering",
    "managed-by": "terraform",
  },
});
```

## Troubleshooting

### Common Issues

1. **Subnet name**: The subnet must be named exactly `AzureBastionSubnet` and be at least `/26`. Any other name or a smaller prefix will fail deployment.

2. **Public IP SKU**: Bastion requires a **Standard** SKU public IP with **Static** allocation. Basic/Dynamic public IPs are rejected.

3. **SKU feature mismatch**: `scaleUnits`, `enableTunneling`, `enableIpConnect`, and `enableShareableLink` require the Standard or Premium SKU. `enableSessionRecording` requires Premium. The Developer SKU supports none of these.

4. **Developer SKU configuration**: Use `virtualNetworkId` (not `ipConfiguration`) for the Developer SKU. The two are mutually exclusive.

5. **API Version Errors**: If you encounter API version errors, verify the version is supported (2024-10-01 or 2024-07-01).

6. **Permission Issues**: Ensure your Azure service principal has `Network Contributor` role or equivalent permissions.

## Related Constructs

- [`ResourceGroup`](../azure-resourcegroup/README.md) - Azure Resource Groups
- [`VirtualNetwork`](../azure-virtualnetwork/README.md) - Virtual Networks
- [`Subnet`](../azure-subnet/README.md) - Virtual Network Subnets
- [`PublicIPAddress`](../azure-publicipaddress/README.md) - Public IP Addresses
- [`NetworkSecurityGroup`](../azure-networksecuritygroup/README.md) - Network Security Groups

## Additional Resources

- [Azure Bastion Documentation](https://learn.microsoft.com/en-us/azure/bastion/bastion-overview)
- [Azure REST API Reference](https://learn.microsoft.com/en-us/rest/api/virtualnetwork/bastion-hosts)
- [Terraform CDK Documentation](https://developer.hashicorp.com/terraform/cdktf)

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
