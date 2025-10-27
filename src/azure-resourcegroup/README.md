# Azure Resource Group Construct (AZAPI)

This Construct represents a Resource Group in Azure using the AZAPI provider for direct Azure REST API access. It provides immediate access to new Azure features and version-specific implementations.

## What is a Resource Group?

In Azure, a Resource Group is a container that holds related resources for an Azure solution. It's a logical group for resources deployed on Azure. All the resources in a group should have the same lifecycle and the same permissions, which makes it easier to manage, monitor, and analyze collectively.

You can learn more about Resource Groups in the [official Azure documentation](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal).

## AZAPI Provider Benefits

This Resource Group construct uses the AZAPI provider, which provides:

- **Direct Azure REST API Access**: No dependency on AzureRM provider limitations
- **Immediate Feature Access**: Get new Azure features as soon as they're available
- **Version-Specific Implementations**: Support for multiple API versions
- **Enhanced Type Safety**: Better IDE support and compile-time validation

## Resource Group Best Practices

- Use a consistent naming convention for your resource groups and other Azure resources
- Group resources that share the same lifecycle and permissions
- Avoid putting too many resources in a single group for easier troubleshooting
- Use resource groups to separate resources managed by different teams
- Apply meaningful tags for organization and cost tracking

## Azure Resource Group Construct Properties

This Construct supports the following properties:

- `location`: (Required) The Azure Region where the Resource Group will be deployed
- `name`: (Optional) The name of the Azure Resource Group. Defaults to `rg-{stack-name}`
- `tags`: (Optional) Key-value pairs for resource tagging and organization
- `managedBy`: (Optional) ID of the resource that manages this resource group
- `ignoreChanges`: (Optional) Lifecycle rules to ignore changes for specific properties

## Supported API Versions

| API Version | Status | Features |
|-------------|--------|----------|
| 2024-11-01  | ✅ Latest | Full feature support with latest Azure capabilities |

## Basic Usage

Deploy a Resource Group using the latest API version:

```typescript
import { Group } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";

const resourceGroup = new Group(this, 'myResourceGroup', {
  name: 'rg-myapp-prod',
  location: 'eastus',
  tags: {
    environment: 'production',
    project: 'myapp',
    owner: 'platform-team'
  }
});
```

## Version-Specific Usage

Use a specific API version for fine-grained control:

```typescript
import { Group } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup/v2024_11_01";

const resourceGroup = new Group(this, 'myResourceGroup', {
  name: 'rg-myapp-prod',
  location: 'eastus',
  tags: {
    environment: 'production'
  },
  managedBy: '/subscriptions/xxx/resourceGroups/management-rg'
});
```

## Advanced Features

### Managed Resource Groups

Specify a management resource for resource groups managed by other services:

```typescript
const managedRG = new Group(this, 'managedRG', {
  name: 'rg-aks-managed',
  location: 'eastus',
  managedBy: '/subscriptions/xxx/resourceGroups/main-rg/providers/Microsoft.ContainerService/managedClusters/my-aks'
});
```

### Lifecycle Management

Ignore changes to specific properties:

```typescript
const resourceGroup = new Group(this, 'myResourceGroup', {
  name: 'rg-myapp-prod',
  location: 'eastus',
  ignoreChanges: ['tags', 'managedBy']
});
```

## Outputs

The Resource Group construct provides several outputs for use in other resources:

```typescript
// Access resource group properties
console.log(resourceGroup.id);           // Resource Group ID
console.log(resourceGroup.name);         // Resource Group name
console.log(resourceGroup.location);     // Resource Group location

// Access Terraform outputs
resourceGroup.idOutput;       // Terraform output for ID
resourceGroup.nameOutput;     // Terraform output for name
resourceGroup.locationOutput; // Terraform output for location
resourceGroup.tagsOutput;     // Terraform output for tags
```

## Migration from AzureRM

If you're migrating from the AzureRM-based version (v0.x), the main differences are:

1. **Direct API Access**: Uses Azure REST API directly instead of AzureRM provider
2. **Required Location**: The `location` property is now required
3. **Enhanced Features**: Access to latest Azure features and API versions
4. **Version Control**: Ability to specify exact API versions

See the [Migration Guide](../../docs/azapi-provider-migration.md) for detailed migration instructions.
