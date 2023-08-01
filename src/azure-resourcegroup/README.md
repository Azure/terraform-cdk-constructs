# Azure Resource Group Construct

This Construct represents a Resource Group in Azure. It provides a convenient way to manage Azure resources within a single group. 

## What is a Resource Group?

In Azure, a Resource Group is a container that holds related resources for an Azure solution. It's a logical group for resources deployed on Azure. All the resources in a group should have the same lifecycle and the same permissions, which makes it easier to manage, monitor, and analyze collectively.

You can learn more about Resource Groups in the [official Azure documentation](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal).

## Resource Group Best Practices

- Use a consistent naming convention for your resource groups and other Azure resources.
- Group resources that share the same lifecycle and permissions.
- Avoid putting too many resources in a single group. If one resource experiences an issue, it may be harder to diagnose the problem if it's in a group with many other resources.
- Use resource groups to separate resources that are managed by different teams.

## Azure Resource Group Construct Properties

This Construct has several properties that control the Resource Group's behaviour:

- `location`: The Azure Region where the Resource Group will be deployed.
- `name`: The name of the Azure Resource Group.
- `rbacGroups`: The RBAC groups to assign to the Resource Group.
- `tags`: The tags to assign to the Resource Group.
- `ignoreChanges`: The lifecycle rules to ignore changes.

## Deploying the Resource Group

You can deploy a Resource Group using this Construct like so:

```typescript
const azureResourceGroup = new AzureResourceGroup(this, 'myResourceGroup', {
  location: 'West US',
  name: 'myResourceGroup',
  tags: {
    'env': 'production',
  },
});
