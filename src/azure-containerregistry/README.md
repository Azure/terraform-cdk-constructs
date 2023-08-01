# Azure Container Registry Construct

This class represents an Azure Container Registry resource. It provides a way to manage Azure Container Registry resources conveniently.

## What is Azure Container Registry?

Azure Container Registry is a managed Docker registry service for building, storing, and managing container images and artifacts in a secure, scalable way. Azure Container Registry integrates well with orchestrators hosted in Azure Container Service, including Docker Swarm, Kubernetes, and DC/OS, as well as other Azure Services such as Service Fabric and Batch.

You can learn more about Azure Container Registry in the [official Azure documentation](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-intro).

## Container Registry Best Practices

- Enable the admin account only when necessary and disable it when not in use.
- Use role-based access control (RBAC) to manage access to your Azure Container Registry.
- Regularly remove untagged and unused images to manage costs.

## Container Registry Class Properties

This class has several properties that control the Azure Container Registry resource's behaviour:

- `name`: The name of the Azure Container Registry.
- `location`: The Azure Region where the Azure Container Registry will be deployed.
- `resource_group_name`: The name of the Azure Resource Group.
- `sku`: The SKU of the Azure Container Registry.
- `tags`: The tags to assign to the Azure Container Registry.
- `admin_enabled`: A flag to specify whether the admin account is enabled.
- `georeplication_locations`: The locations to configure replication.

## Deploying the Azure Container Registry

You can deploy an Azure Container Registry resource using this class like so:

```typescript
const azureContainerRegistry = new AzureContainerRegistry(this, 'myContainerRegistry', {
  name: 'myContainerRegistry',
  location: 'West US',
  resource_group_name: 'myResourceGroup',
  sku: 'Premium',
  admin_enabled: true,
  georeplication_locations: ['East US', 'West Europe'],
  tags: {
    'env': 'production',
  },
});
```

This code will create a new Azure Container Registry named myContainerRegistry in the West US Azure region with a production environment tag. The resource belongs to the resource group myResourceGroup, has a Premium SKU, has the admin account enabled, and has geo-replication configured for East US and West Europe.