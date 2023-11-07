# Azure Virtual Machine Scale Set Construct

This construct defines a scalable and managed Virtual Machine Scale Set (VMSS) in Azure, simplifying the deployment and management of multiple VMs that automatically scale in response to demand.

## What is a Virtual Machine Scale Set (VMSS)?

Azure VMSS allows you to deploy and manage a set of autoscaling virtual machines. You can scale the number of VMs in the scale set manually, or automatically based on predefined rules.

Detailed information on Azure VMSS can be found in the [official Azure documentation](https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview).

## Best Practices

- **Auto-Scaling**: Define rules for automatically scaling the number of VM instances.
- **Updating**: Utilize rolling upgrades for applying patches with minimal downtime.
- **Availability**: Distribute instances across fault domains and update domains.
- **Extensions**: Use VMSS extensions for automatic post-deployment configuration.
- **Load Balancing**: Configure load balancing to distribute traffic among instances.

## Construct Properties

The VMSS construct includes properties for configuration:

- `location`: Region for deployment.
- `resourceGroupName`: Resource group for VMSS.
- `name`: Name of the VMSS.
- `sku`: SKU for VM instances, like `Standard_B2s`.
- `instances`: Number of VM instances.
- `adminUsername`: Admin username.
- `adminPassword`: Admin password.
- `sourceImageReference`: Reference to the OS image.
- `osDisk`: Configuration for OS disk.
- `networkInterface`: Network interface details.
- `publicIPAddress`: Public IP configuration.
- `tags`: Key-value pairs for resource tagging.
- `customData`: Bootstrap script or data.
- `upgradePolicyMode`: Upgrade policy mode setting.
- `overprovision`: Overprovisioning toggle.
- `scaleInPolicy`: Scale-in policy.
- `bootDiagnosticsStorageURI`: URI for boot diagnostics.

## Usage Example

### Linux VMSS

```typescript
const azureLinuxVMSS = new AzureLinuxVirtualMachineScaleSet(this, 'myLinuxVMSS', {
  resourceGroupName: 'myResourceGroup',
  location: 'West US',
  name: 'myLinuxVMSS',
  adminUsername: 'adminuser',
  sku: 'Standard_B2s',
  instances: 2,
  // ...other configurations
});
```

### Windows VMSS
```typescript
const azureWindowsVMSS = new AzureWindowsVirtualMachineScaleSet(this, 'myWindowsVMSS', {
  resourceGroupName: 'myResourceGroup',
  location: 'West US',
  name: 'myWindowsVMSS',
  adminUsername: 'adminuser',
  sku: 'Standard_B2s',
  instances: 2,
  // ...other configurations
});
```
