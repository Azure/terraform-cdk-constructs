# Azure Virtual Network Construct

This class represents an Azure Virtual Network. It provides a convenient way to manage Azure Virtual Networks and their associated subnets.

## What is an Azure Virtual Network?

Azure Virtual Network (VNet) is the fundamental building block for your private network in Azure. VNet enables many types of Azure resources, such as Azure Virtual Machines (VM), to securely communicate with each other, the internet, and on-premises networks. VNet is similar to a traditional network that you'd operate in your own data center but brings with it additional benefits of Azure's infrastructure.

[Learn more about Azure Virtual Network](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview).

## Azure Virtual Network Best Practices

- Design your VNets with multiple subnets for better segmentation.
- Avoid overlapping IP address ranges with your on-premises network space.
- Use Network Security Groups (NSGs) to control inbound and outbound traffic to network interfaces (NIC), VMs, and subnets.
- Implement VNet peering for efficient and secure communication between VNets.
- Regularly audit and monitor network resources using Azure Monitor and Network Watcher.

## Azure Virtual Network Class Properties

This class has several properties that control the Azure Virtual Network's behavior:

- `resourceGroupName`: The name of the Azure Resource Group.
- `name`: The name of the Virtual Network.
- `location`: The Azure Region where the Virtual Network will be deployed.
- `addressSpace`: The IP address ranges for the VNet.
- `subnets`: An array of subnet configurations, each having a `name` and `addressPrefixes`.
- `id`: The unique identifier of the Virtual Network.
- `virtualNetwork`: The underlying Virtual Network resource.

## Deploying the Azure Virtual Network

You can deploy an Azure Virtual Network using this class like so:

```typescript
const azureVNet = new AzureVirtualNetwork(this, 'myVNet', {
  resourceGroupName: 'myResourceGroup',
  name: 'myVNet',
  location: 'East US',
  addressSpace: ['10.0.0.0/16'],
  subnets: [
    {
      name: 'default',
      addressPrefixes: ['10.0.1.0/24'],
    },
  ],
});
```

This code will create a new Azure Virtual Network named myVNet in the East US Azure region with a specified address space. The VNet belongs to the resource group myResourceGroup and contains a subnet named default.

## VNet Peering
VNet peering allows for a direct network connection between two VNets in the same region. This class provides a method addVnetPeering to establish a peering connection between two VNets.

Example:

```typescript
Copy code
const remoteVNet = new AzureVirtualNetwork(this, 'remoteVNet', { /* ... */ });
azureVNet.addVnetPeering(remoteVNet);
``````
This code establishes a peering connection between `myVNet` and `remoteVNet`.

## Cost Optimization

In Azure Virtual Network, you are primarily charged based on the amount of data transferred out of the VNet. Ensure that you're only allowing necessary traffic and consider using VNet peering instead of VPNs or ExpressRoute for communication between VNets in the same region to reduce costs. Regularly review and clean up unused or unnecessary resources.