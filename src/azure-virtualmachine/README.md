# Azure Virtual Machine Construct

A unified, version-aware implementation for Azure Virtual Machines using the VersionedAzapiResource framework. This construct provides automatic version management, schema validation, and property transformation across all supported API versions.

## Features

- **Automatic Version Resolution**: Uses the latest stable API version by default
- **Explicit Version Pinning**: Pin to specific API versions when stability is required
- **Schema-Driven Validation**: Validates all properties against Azure API schemas
- **Multi-Language Support**: Full JSII compliance for TypeScript, Python, Java, C#, and Go
- **Comprehensive VM Support**: Linux, Windows, Spot VMs, managed identities, and more

## Supported API Versions

- `2024-07-01` (Active)
- `2024-11-01` (Active)
- `2025-04-01` (Active, Latest - Default)

## Installation

```bash
npm install @cdktf/provider-azurerm
```

## Basic Usage

### Creating Network Interface First

Virtual Machines require a network interface. Create the NIC separately using the [`NetworkInterface`](../azure-networkinterface/README.md) construct:

```typescript
import { VirtualMachine } from "./azure-virtualmachine";
import { NetworkInterface } from "./azure-networkinterface";
import { ResourceGroup } from "./azure-resourcegroup";

// Create a resource group
const resourceGroup = new ResourceGroup(this, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

// Create a network interface (required for VM)
const networkInterface = new NetworkInterface(this, "nic", {
  name: "my-vm-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  ipConfigurations: [{
    name: "ipconfig1",
    subnet: { id: subnet.id }, // Reference to existing subnet
    privateIPAllocationMethod: "Dynamic",
    primary: true,
  }],
});

// Create a Linux VM referencing the NIC by ID
const linuxVm = new VirtualMachine(this, "linux-vm", {
  name: "my-linux-vm",
  location: resourceGroup.location,
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
    computerName: "mylinuxvm",
    adminUsername: "azureuser",
    linuxConfiguration: {
      disablePasswordAuthentication: true,
      ssh: {
        publicKeys: [
          {
            path: "/home/azureuser/.ssh/authorized_keys",
            keyData: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...",
          },
        ],
      },
    },
  },
  networkProfile: {
    networkInterfaces: [
      {
        id: networkInterface.id,
      },
    ],
  },
  identity: {
    type: "SystemAssigned",
  },
  tags: {
    environment: "production",
  },
});

// Access VM outputs
console.log(linuxVm.id);
console.log(linuxVm.vmId);
```

### Windows VM with Password Authentication

```typescript
const windowsVm = new VirtualMachine(this, "windows-vm", {
  name: "my-windows-vm",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  hardwareProfile: {
    vmSize: "Standard_D2s_v3",
  },
  storageProfile: {
    imageReference: {
      publisher: "MicrosoftWindowsServer",
      offer: "WindowsServer",
      sku: "2022-datacenter-azure-edition",
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
    computerName: "mywinvm",
    adminUsername: "azureuser",
    adminPassword: "P@ssw0rd1234!",
    windowsConfiguration: {
      provisionVMAgent: true,
      enableAutomaticUpdates: true,
    },
  },
  networkProfile: {
    networkInterfaces: [
      {
        id: networkInterface.id,
      },
    ],
  },
  licenseType: "Windows_Server",
  tags: {
    os: "windows",
    environment: "production",
  },
});
```

### VM with Managed Identity and Data Disks

```typescript
const vmWithIdentity = new VirtualMachine(this, "vm-identity", {
  name: "my-identity-vm",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  hardwareProfile: {
    vmSize: "Standard_D4s_v3",
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
      diskSizeGB: 128,
    },
    dataDisks: [
      {
        lun: 0,
        createOption: "Empty",
        diskSizeGB: 512,
        managedDisk: {
          storageAccountType: "Premium_LRS",
        },
      },
      {
        lun: 1,
        createOption: "Empty",
        diskSizeGB: 1024,
        managedDisk: {
          storageAccountType: "Premium_LRS",
        },
      },
    ],
  },
  osProfile: {
    computerName: "myidentityvm",
    adminUsername: "azureuser",
    linuxConfiguration: {
      disablePasswordAuthentication: true,
      ssh: {
        publicKeys: [
          {
            path: "/home/azureuser/.ssh/authorized_keys",
            keyData: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...",
          },
        ],
      },
    },
  },
  networkProfile: {
    networkInterfaces: [
      {
        id: networkInterface.id,
      },
    ],
  },
  identity: {
    type: "UserAssigned",
    userAssignedIdentities: {
      [managedIdentity.id]: {},
    },
  },
});
```

### Spot VM with Eviction Policy

```typescript
const spotVm = new VirtualMachine(this, "spot-vm", {
  name: "my-spot-vm",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  priority: "Spot",
  evictionPolicy: "Deallocate",
  billingProfile: {
    maxPrice: -1, // Pay up to on-demand price
  },
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
        storageAccountType: "Standard_LRS",
      },
    },
  },
  osProfile: {
    computerName: "myspotvm",
    adminUsername: "azureuser",
    linuxConfiguration: {
      disablePasswordAuthentication: true,
      ssh: {
        publicKeys: [
          {
            path: "/home/azureuser/.ssh/authorized_keys",
            keyData: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...",
          },
        ],
      },
    },
  },
  networkProfile: {
    networkInterfaces: [
      {
        id: networkInterface.id,
      },
    ],
  },
  tags: {
    priority: "spot",
  },
});
```

### VM with Boot Diagnostics and Security Features

```typescript
const secureVm = new VirtualMachine(this, "secure-vm", {
  name: "my-secure-vm",
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
    computerName: "mysecurevm",
    adminUsername: "azureuser",
    linuxConfiguration: {
      disablePasswordAuthentication: true,
      ssh: {
        publicKeys: [
          {
            path: "/home/azureuser/.ssh/authorized_keys",
            keyData: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...",
          },
        ],
      },
    },
  },
  networkProfile: {
    networkInterfaces: [
      {
        id: networkInterface.id,
      },
    ],
  },
  diagnosticsProfile: {
    bootDiagnostics: {
      enabled: true,
      storageUri: storageAccount.primaryBlobEndpoint,
    },
  },
  securityProfile: {
    uefiSettings: {
      secureBootEnabled: true,
      vTpmEnabled: true,
    },
    securityType: "TrustedLaunch",
  },
  identity: {
    type: "SystemAssigned",
  },
});
```

## API Version Management

### Using Default (Latest) Version

By default, the construct uses the latest stable API version:

```typescript
const vm = new VirtualMachine(this, "vm", {
  // ... properties
});
// Uses 2024-07-01 automatically
```

### Pinning to Specific Version

Pin to a specific API version for stability:

```typescript
const vm = new VirtualMachine(this, "vm", {
  apiVersion: "2024-07-01", // Pin to specific version
  // ... other properties
});
```

### Migration Analysis

Analyze migration requirements between versions:

```typescript
const analysis = vm.analyzeMigrationTo("2024-07-01");
console.log(`Breaking changes: ${analysis.breakingChanges.length}`);
console.log(`Estimated effort: ${analysis.estimatedEffort}`);
```

## Properties Reference

### Required Properties

- **`hardwareProfile`**: VM size configuration
  - `vmSize`: VM size (e.g., "Standard_D2s_v3")

- **`storageProfile`**: Storage configuration
  - `imageReference`: OS image reference
  - `osDisk`: OS disk configuration
  - `dataDisks`: Optional data disks array

- **`networkProfile`**: Network configuration
  - `networkInterfaces`: Array of network interface references

### Optional Properties

- **`osProfile`**: OS configuration
  - `computerName`: Computer name
  - `adminUsername`: Admin username
  - `adminPassword`: Admin password (Windows or Linux with password auth)
  - `linuxConfiguration`: Linux-specific settings
  - `windowsConfiguration`: Windows-specific settings

- **`identity`**: Managed identity configuration
- **`zones`**: Availability zones
- **`priority`**: VM priority (Regular, Low, Spot)
- **`licenseType`**: License type for Windows VMs
- **`diagnosticsProfile`**: Boot diagnostics configuration
- **`securityProfile`**: Security settings
- **`tags`**: Resource tags

## Public Methods

### Tag Management

```typescript
// Add a tag
vm.addTag("environment", "production");

// Remove a tag
vm.removeTag("temporary");
```

### VM Properties

```typescript
// Get VM ID
const vmId = vm.vmId;

// Get provisioning state
const state = vm.provisioningState;

// Get VM size
const size = vm.vmSize;

// Get computer name
const name = vm.computerName;
```

## Migration Guide

### From Version-Specific Implementations

If migrating from version-specific VM implementations:

```typescript
// Old approach (version-specific class)
import { VirtualMachine_2023_07_01 } from "./old-implementation";

// New unified approach
import { VirtualMachine } from "./azure-virtualmachine";

const vm = new VirtualMachine(this, "vm", {
  apiVersion: "2024-07-01", // Explicitly pin if needed
  // ... same properties
});
```

### Upgrading API Versions

1. Test with the new version in a development environment
2. Review migration analysis for breaking changes
3. Update your code to handle any breaking changes
4. Deploy to production

```typescript
// Analyze migration before upgrading
const currentVm = new VirtualMachine(this, "vm", {
  apiVersion: "2024-07-01",
  // ... properties
});

const analysis = currentVm.analyzeMigrationTo("2024-07-01");
if (analysis.compatible) {
  // Safe to upgrade
  const upgradedVm = new VirtualMachine(this, "vm-upgraded", {
    apiVersion: "2024-07-01",
    // ... same properties
  });
}
```

## Common VM Sizes

### General Purpose
- **B-series**: Burstable (B1s, B2s, B2ms, B4ms)
- **D-series**: General purpose (Standard_D2s_v3, Standard_D4s_v3)

### Compute Optimized
- **F-series**: Compute optimized (Standard_F2s_v2, Standard_F4s_v2)

### Memory Optimized
- **E-series**: Memory optimized (Standard_E2s_v3, Standard_E4s_v3)

### Storage Optimized
- **L-series**: Storage optimized (Standard_L8s_v2, Standard_L16s_v2)

### GPU
- **N-series**: GPU (Standard_NC6, Standard_NV6)

## Best Practices

1. **Use Managed Identities**: Prefer managed identities over service principals
2. **Enable Boot Diagnostics**: Always enable for troubleshooting
3. **Use Premium Storage**: For production workloads
4. **Enable Encryption**: Use encryption at host when possible
5. **Tag Resources**: Use consistent tagging strategy
6. **Lifecycle Management**: Use `ignoreChanges` for properties managed externally
7. **Security**: Enable secure boot and vTPM for supported images
8. **Networking**: Use network security groups and limit public access

## Troubleshooting

### Common Issues

**Issue**: VM provisioning fails
- Check VM size availability in the region
- Verify image reference is valid
- Ensure network interface exists
- Check quota limits

**Issue**: Cannot connect to VM
- Verify network security group rules
- Check boot diagnostics output
- Verify SSH key or password configuration

**Issue**: Disk attachment fails
- Verify LUN numbers are unique
- Check storage account type compatibility
- Ensure disk doesn't already exist

## Networking Architecture

### Network Interface Reference Pattern

Virtual Machines **reference** existing network interfaces by ID rather than creating them inline. This separation provides several benefits:

1. **Reusability**: NICs can be detached and reattached to different VMs
2. **Independent Management**: NICs have their own lifecycle separate from VMs
3. **Type Safety**: Using the dedicated [`NetworkInterface`](../azure-networkinterface/README.md) construct provides proper validation

```typescript
// ✅ CORRECT: Create NIC separately, reference by ID
const nic = new NetworkInterface(this, "nic", {
  name: "my-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  ipConfigurations: [{ /* ... */ }],
});

const vm = new VirtualMachine(this, "vm", {
  // ... other properties
  networkProfile: {
    networkInterfaces: [{
      id: nic.id, // Reference by ID
    }],
  },
});

// ❌ INCORRECT: VMs don't create NICs inline
// Network interfaces must be created separately
```

### Multiple Network Interfaces

VMs can have multiple NICs for different network segments:

```typescript
const managementNic = new NetworkInterface(this, "mgmt-nic", {
  name: "vm-mgmt-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  ipConfigurations: [{
    name: "mgmt-ip",
    subnet: { id: managementSubnet.id },
    primary: true,
  }],
});

const dataPlaneNic = new NetworkInterface(this, "data-nic", {
  name: "vm-data-nic",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  ipConfigurations: [{
    name: "data-ip",
    subnet: { id: dataSubnet.id },
    primary: false, // Not primary
  }],
});

const vm = new VirtualMachine(this, "vm", {
  // ... other properties
  networkProfile: {
    networkInterfaces: [
      { id: managementNic.id, properties: { primary: true } },
      { id: dataPlaneNic.id, properties: { primary: false } },
    ],
  },
});
```

## Links

- [Azure Virtual Machines Documentation](https://docs.microsoft.com/azure/virtual-machines/)
- [VM Sizes](https://docs.microsoft.com/azure/virtual-machines/sizes)
- [Azure REST API Reference](https://docs.microsoft.com/rest/api/compute/virtual-machines)
- [Network Interface Construct](../azure-networkinterface/README.md)

## License

This construct is part of the terraform-cdk-constructs project.