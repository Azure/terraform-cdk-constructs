# Azure Virtual Machine Construct

This construct provides a simplified way to deploy and manage an Azure Virtual Machine (VM), suitable for both Windows and Linux configurations.

## Overview

Azure Virtual Machines give you the flexibility of virtualization without buying and maintaining the physical hardware. They are ideal for a variety of computing solutions like development and testing, running applications, and extending your datacenter.

For detailed information on Azure VMs, visit the [Azure Virtual Machines documentation](https://docs.microsoft.com/en-us/azure/virtual-machines/).

## Best Practices for Virtual Machines

- **Size Appropriately**: Choose a VM size that fits your workload requirements.
- **Keep Updated**: Regularly apply updates and patches to your VMs.
- **Network Security**: Secure your VMs with network security groups and firewall rules.
- **Use Managed Disks**: Leverage managed disks for better management and security of your VM storage.
- **Backup and Recovery**: Implement a backup strategy and disaster recovery plan.

## Construct Properties

Configure your VM with the following properties:

- `location`: The deployment region for the VM.
- `resourceGroupName`: The name of the resource group.
- `name`: The name of the VM.
- `size`: The VM size (e.g., `Standard_B2s`).
- `adminUsername`: Administrator username for the VM.
- `adminPassword`: Administrator password for the VM.
- `sourceImageReference`: Reference to the source image for the VM's operating system.
- `osDisk`: Configuration for the operating system disk.
- `networkInterface`: Network interface details for the VM.
- `publicIPAllocationMethod`: Allocation method for the VM's public IP address.
- `tags`: A dictionary of tags to apply to the VM.
- `customData`: Custom data for bootstrapping the VM.

## Deployment Example

### Windows Virtual Machine

```typescript
const azureWindowsVM = new AzureWindowsVirtualMachine(this, 'myWindowsVM', {
  resourceGroupName: 'myResourceGroup',
  location: 'West US',
  name: 'myWindowsVM',
  adminUsername: 'adminuser',
  adminPassword: 'SecurePassword123',
  size: 'Standard_B2s',
  tags: {
    'env': 'production',
  },
  // Additional configurations...
});
```


### Linux Virtual Machine

```typescript
const azureLinuxVM = new AzureLinuxVirtualMachine(this, 'myLinuxVM', {
  resourceGroupName: 'myResourceGroup',
  location: 'West US',
  name: 'myLinuxVM',
  adminUsername: 'adminuser',
  size: 'Standard_B2s',
  tags: {
    'env': 'development',
  },
  // Additional configurations...
});
```
