# Azure Network Interface Construct

This module provides a unified TypeScript implementation for Azure Network Interfaces using the AzapiResource framework. It automatically handles version management, schema validation, and property transformation across all supported API versions.

## Supported API Versions

- **2024-07-01** (Active)
- **2024-10-01** (Active)
- **2025-01-01** (Active, Latest - Default)

The construct automatically uses the latest version when no explicit version is specified, while maintaining full backward compatibility with all supported versions.

## Features

- ✅ **Automatic Version Resolution** - Uses the latest API version by default
- ✅ **Explicit Version Pinning** - Lock to specific API versions for stability
- ✅ **Schema-Driven Validation** - Validates properties against Azure REST API specifications
- ✅ **Type Safety** - Full TypeScript support with comprehensive type definitions
- ✅ **IP Configuration Management** - Support for single or multiple IP configurations
- ✅ **Network Security Group Integration** - Optional NSG association
- ✅ **Public IP Support** - Attach public IPs to NICs
- ✅ **Accelerated Networking** - Enable SR-IOV for high-performance scenarios
- ✅ **IP Forwarding** - Support for Network Virtual Appliances (NVAs)
- ✅ **Custom DNS Settings** - Configure DNS servers and internal DNS labels
- ✅ **JSII Compliance** - Multi-language support (TypeScript, Python, Java, .NET)

## Installation

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Basic Usage

### Simple Network Interface with Dynamic IP

```typescript
import { NetworkInterface } from "@microsoft/terraform-cdk-constructs";

const nic = new NetworkInterface(this, "basic-nic", {
  name: "my-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  ipConfigurations: [{
    name: "ipconfig1",
    subnet: { id: subnet.id },
    privateIPAllocationMethod: "Dynamic",
    primary: true,
  }],
});
```

### Network Interface with Static Private IP

```typescript
const nic = new NetworkInterface(this, "static-nic", {
  name: "my-static-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  ipConfigurations: [{
    name: "ipconfig1",
    subnet: { id: subnet.id },
    privateIPAllocationMethod: "Static",
    privateIPAddress: "10.0.1.4",
    primary: true,
  }],
});
```

### Network Interface with Public IP

```typescript
const nic = new NetworkInterface(this, "public-nic", {
  name: "my-public-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  ipConfigurations: [{
    name: "ipconfig1",
    subnet: { id: subnet.id },
    privateIPAllocationMethod: "Dynamic",
    publicIPAddress: { id: publicIp.id },
    primary: true,
  }],
});
```

### Network Interface with Network Security Group

```typescript
const nic = new NetworkInterface(this, "secured-nic", {
  name: "my-secured-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  ipConfigurations: [{
    name: "ipconfig1",
    subnet: { id: subnet.id },
    privateIPAllocationMethod: "Dynamic",
    primary: true,
  }],
  networkSecurityGroup: { id: nsg.id },
});
```

### Network Interface with Accelerated Networking

```typescript
const nic = new NetworkInterface(this, "accelerated-nic", {
  name: "my-accelerated-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  ipConfigurations: [{
    name: "ipconfig1",
    subnet: { id: subnet.id },
    privateIPAllocationMethod: "Dynamic",
    primary: true,
  }],
  enableAcceleratedNetworking: true, // Requires supported VM size
});
```

### Network Virtual Appliance NIC with IP Forwarding

```typescript
const nvaNic = new NetworkInterface(this, "nva-nic", {
  name: "my-nva-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  ipConfigurations: [{
    name: "ipconfig1",
    subnet: { id: subnet.id },
    privateIPAllocationMethod: "Static",
    privateIPAddress: "10.0.1.10",
    primary: true,
  }],
  enableIPForwarding: true, // Allow forwarding traffic
  enableAcceleratedNetworking: true,
  tags: {
    role: "network-virtual-appliance",
  },
});
```

### Network Interface with Multiple IP Configurations

```typescript
const multiIpNic = new NetworkInterface(this, "multi-ip-nic", {
  name: "my-multi-ip-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  ipConfigurations: [
    {
      name: "ipconfig1",
      subnet: { id: subnet.id },
      privateIPAllocationMethod: "Dynamic",
      primary: true, // Must have exactly one primary
    },
    {
      name: "ipconfig2",
      subnet: { id: subnet.id },
      privateIPAllocationMethod: "Static",
      privateIPAddress: "10.0.1.5",
      primary: false,
    },
    {
      name: "ipconfig3",
      subnet: { id: subnet.id },
      privateIPAllocationMethod: "Static",
      privateIPAddress: "10.0.1.6",
      primary: false,
    },
  ],
});
```

### Network Interface with Custom DNS Settings

```typescript
const dnsNic = new NetworkInterface(this, "dns-nic", {
  name: "my-dns-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  ipConfigurations: [{
    name: "ipconfig1",
    subnet: { id: subnet.id },
    privateIPAllocationMethod: "Dynamic",
    primary: true,
  }],
  dnsSettings: {
    dnsServers: ["10.0.0.4", "10.0.0.5"],
    internalDnsNameLabel: "myvm",
  },
});
```

## Version Pinning

### Explicit API Version

```typescript
const nic = new NetworkInterface(this, "versioned-nic", {
  name: "my-versioned-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  apiVersion: "2024-07-01", // Pin to specific version
  ipConfigurations: [{
    name: "ipconfig1",
    subnet: { id: subnet.id },
    privateIPAllocationMethod: "Dynamic",
    primary: true,
  }],
});
```

## Complete Networking Stack Example

```typescript
import { App, TerraformStack } from "cdktf";
import { 
  ResourceGroup,
  VirtualNetwork,
  Subnet,
  PublicIPAddress,
  NetworkSecurityGroup,
  NetworkInterface,
} from "@microsoft/terraform-cdk-constructs";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/lib/azapi";

class NetworkingStack extends TerraformStack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // Configure provider
    new AzapiProvider(this, "azapi", {});

    // Create resource group
    const rg = new ResourceGroup(this, "rg", {
      name: "my-networking-rg",
      location: "eastus",
    });

    // Create virtual network
    const vnet = new VirtualNetwork(this, "vnet", {
      name: "my-vnet",
      location: rg.props.location!,
      resourceGroupId: rg.id,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
    });

    // Create subnet
    const subnet = new Subnet(this, "subnet", {
      name: "my-subnet",
      resourceGroupName: rg.props.name!,
      virtualNetworkName: vnet.props.name!,
      addressPrefix: "10.0.1.0/24",
    });

    // Create public IP
    const publicIp = new PublicIPAddress(this, "pip", {
      name: "my-public-ip",
      location: rg.props.location!,
      resourceGroupId: rg.id,
      sku: { name: "Standard" },
      publicIPAllocationMethod: "Static",
    });

    // Create network security group
    const nsg = new NetworkSecurityGroup(this, "nsg", {
      name: "my-nsg",
      location: rg.props.location!,
      resourceGroupId: rg.id,
      securityRules: [
        {
          name: "allow-ssh",
          properties: {
            protocol: "Tcp",
            sourcePortRange: "*",
            destinationPortRange: "22",
            sourceAddressPrefix: "*",
            destinationAddressPrefix: "*",
            access: "Allow",
            priority: 100,
            direction: "Inbound",
          },
        },
      ],
    });

    // Create network interface tying everything together
    const nic = new NetworkInterface(this, "nic", {
      name: "my-vm-nic",
      location: rg.props.location!,
      resourceGroupId: rg.id,
      ipConfigurations: [{
        name: "ipconfig1",
        subnet: { id: subnet.id },
        privateIPAllocationMethod: "Static",
        privateIPAddress: "10.0.1.4",
        publicIPAddress: { id: publicIp.id },
        primary: true,
      }],
      networkSecurityGroup: { id: nsg.id },
      enableAcceleratedNetworking: true,
      tags: {
        environment: "production",
        role: "web-server",
      },
    });

    // Access NIC properties
    console.log(`NIC ID: ${nic.id}`);
    console.log(`Private IP: ${nic.privateIPAddress}`);
  }
}

const app = new App();
new NetworkingStack(app, "networking-stack");
app.synth();
```

## Properties

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `location` | `string` | Azure region where the NIC will be created |
| `ipConfigurations` | `NetworkInterfaceIPConfiguration[]` | IP configuration(s) for the NIC (at least one required) |

### Optional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | Construct ID | Name of the network interface |
| `apiVersion` | `string` | `"2025-01-01"` | Azure API version to use |
| `networkSecurityGroup` | `{ id: string }` | - | NSG to associate with the NIC |
| `enableAcceleratedNetworking` | `boolean` | `false` | Enable SR-IOV for high performance |
| `enableIPForwarding` | `boolean` | `false` | Enable IP forwarding (for NVAs) |
| `dnsSettings` | `NetworkInterfaceDnsSettings` | - | Custom DNS configuration |
| `tags` | `{ [key: string]: string }` | `{}` | Resource tags |
| `resourceGroupId` | `string` | - | Resource group ID |
| `ignoreChanges` | `string[]` | - | Properties to ignore during updates |

### IP Configuration Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | ✅ | Name of the IP configuration |
| `subnet` | `{ id: string }` | ✅ | Subnet reference |
| `privateIPAllocationMethod` | `"Dynamic" \| "Static"` | - | Private IP allocation method (default: Dynamic) |
| `privateIPAddress` | `string` | - | Static private IP address (required if method is Static) |
| `publicIPAddress` | `{ id: string }` | - | Public IP reference |
| `primary` | `boolean` | - | Whether this is the primary IP configuration |

### DNS Settings Properties

| Property | Type | Description |
|----------|------|-------------|
| `dnsServers` | `string[]` | Custom DNS server IP addresses |
| `internalDnsNameLabel` | `string` | Internal DNS name label |

## Output Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The resource ID of the network interface |
| `privateIPAddress` | `string` | The primary private IP address |
| `idOutput` | `TerraformOutput` | Terraform output for the NIC ID |
| `nameOutput` | `TerraformOutput` | Terraform output for the NIC name |
| `locationOutput` | `TerraformOutput` | Terraform output for the NIC location |
| `privateIPAddressOutput` | `TerraformOutput` | Terraform output for the private IP |
| `tagsOutput` | `TerraformOutput` | Terraform output for tags |

## Methods

### `addTag(key: string, value: string): void`

Add a tag to the network interface.

```typescript
nic.addTag("environment", "production");
```

### `removeTag(key: string): void`

Remove a tag from the network interface.

```typescript
nic.removeTag("temporary");
```

## Dependencies

Network Interfaces depend on:
- **Subnet** (required) - The subnet to attach the NIC to
- **Public IP Address** (optional) - For public connectivity
- **Network Security Group** (optional) - For traffic filtering

## Important Notes

1. **IP Configuration Requirements**:
   - At least one IP configuration is required
   - Exactly one IP configuration must be marked as `primary: true`

2. **Accelerated Networking**:
   - Requires a supported VM size
   - Cannot be enabled on all VM SKUs
   - Check Azure documentation for compatible VM sizes

3. **IP Forwarding**:
   - Required for Network Virtual Appliances (NVAs)
   - Allows the NIC to forward traffic not destined for its IP address

4. **Static IP Addresses**:
   - Must be within the subnet's address range
   - Should not conflict with other allocated IPs

5. **Public IP Association**:
   - Public IP must use Standard SKU if NIC uses accelerated networking
   - Public IP must be in the same location as the NIC

## Testing

### Unit Tests

```bash
npm test -- network-interface.spec.ts
```

### Integration Tests

```bash
npm run integration:nostream -- network-interface.integ.ts
```

## Migration from Version-Specific Classes

If you were using version-specific Network Interface classes, migration is straightforward:

```typescript
// Old approach (version-specific)
import { NetworkInterface20240701 } from "...";
const nic = new NetworkInterface20240701(this, "nic", { ... });

// New approach (unified)
import { NetworkInterface } from "...";
const nic = new NetworkInterface(this, "nic", {
  apiVersion: "2024-07-01", // Optional: pin to specific version
  ...
});
```

## Integration with Other Services

### Using with Virtual Machines

Network Interfaces created with this module can be referenced by Virtual Machines:

```typescript
import { NetworkInterface } from "@microsoft/terraform-cdk-constructs";
import { VirtualMachine } from "@microsoft/terraform-cdk-constructs";

// Create the network interface
const nic = new NetworkInterface(this, "vm-nic", {
  name: "my-vm-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  ipConfigurations: [{
    name: "ipconfig1",
    subnet: { id: subnet.id },
    privateIPAllocationMethod: "Dynamic",
    primary: true,
  }],
});

// Reference the NIC in the VM
const vm = new VirtualMachine(this, "vm", {
  name: "my-vm",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  hardwareProfile: {
    vmSize: "Standard_D2s_v3",
  },
  storageProfile: {
    imageReference: {
      publisher: "Canonical",
      offer: "0001-com-ubuntu-server-jammy",
      sku: "22_04-lts-gen2",
      version: "latest",
    },
    osDisk: {
      createOption: "FromImage",
      managedDisk: {
        storageAccountType: "Premium_LRS",
      },
    },
  },
  osProfile: {
    computerName: "myvm",
    adminUsername: "azureuser",
    linuxConfiguration: {
      disablePasswordAuthentication: true,
      ssh: {
        publicKeys: [{
          path: "/home/azureuser/.ssh/authorized_keys",
          keyData: "ssh-rsa AAAA...",
        }],
      },
    },
  },
  networkProfile: {
    networkInterfaces: [{
      id: nic.id, // Reference the NIC by ID
    }],
  },
});
```

### Using with Virtual Machine Scale Sets

For VMSS, network interfaces are defined as **templates** that are applied to each VM instance:

```typescript
import { VirtualMachineScaleSet } from "@microsoft/terraform-cdk-constructs";
import type { NetworkInterfaceDnsSettings } from "@microsoft/terraform-cdk-constructs";

const vmss = new VirtualMachineScaleSet(this, "vmss", {
  name: "my-vmss",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard_D2s_v3",
    capacity: 3,
  },
  orchestrationMode: "Uniform",
  virtualMachineProfile: {
    storageProfile: {
      // ... storage configuration
    },
    osProfile: {
      // ... OS configuration
    },
    networkProfile: {
      // Network interface configuration template
      networkInterfaceConfigurations: [{
        name: "nic-config",
        properties: {
          primary: true,
          enableAcceleratedNetworking: true,
          ipConfigurations: [{
            name: "ipconfig1",
            properties: {
              subnet: { id: subnet.id },
            },
          }],
          // Shared DNS settings type from NetworkInterface module
          dnsSettings: {
            dnsServers: ["10.0.0.4", "10.0.0.5"],
          } as NetworkInterfaceDnsSettings,
        },
      }],
    },
  },
});
```

**Key Differences**:
- **VMs**: Reference pre-created NICs by ID
- **VMSS**: Use NIC templates that create NICs for each VM instance
- **Shared Types**: VMSS imports `NetworkInterfaceDnsSettings` from this module for consistency

## Related Constructs

- [`VirtualNetwork`](../azure-virtualnetwork/README.md) - Azure Virtual Network
- [`Subnet`](../azure-subnet/README.md) - Virtual Network Subnet
- [`PublicIPAddress`](../azure-publicipaddress/README.md) - Public IP Address
- [`NetworkSecurityGroup`](../azure-networksecuritygroup/README.md) - Network Security Group
- [`ResourceGroup`](../azure-resourcegroup/README.md) - Azure Resource Group
- [`VirtualMachine`](../azure-virtualmachine/README.md) - Azure Virtual Machine (references NICs)
- [`VirtualMachineScaleSet`](../azure-vmss/README.md) - Azure VMSS (uses NIC templates)

## Additional Resources

- [Azure Network Interface Documentation](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface)
- [Azure REST API - Network Interfaces](https://learn.microsoft.com/en-us/rest/api/virtualnetwork/network-interfaces)
- [Accelerated Networking](https://learn.microsoft.com/en-us/azure/virtual-network/accelerated-networking-overview)
- [IP Forwarding](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview#ip-forwarding)

## License

This project is licensed under the MIT License.