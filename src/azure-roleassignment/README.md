# Azure Role Assignment Construct

This module provides a CDK construct for managing Azure Role Assignments using the AZAPI provider. Role assignments grant specific permissions (roles) to security principals (users, groups, service principals, managed identities) at a particular scope (subscription, resource group, or resource).

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [Properties](#properties)
- [Outputs](#outputs)
- [API Versions](#api-versions)
- [Principal Types](#principal-types)
- [Built-in Roles](#built-in-roles)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Features

- **Version-Aware Resource Management**: Automatic API version resolution with support for explicit version pinning
- **Schema-Driven Validation**: Built-in property validation with comprehensive error messages
- **Principal Types**: Support for User, Group, ServicePrincipal, ForeignGroup, and Device principals
- **Conditional Access (ABAC)**: Attribute-Based Access Control with condition expressions
- **Flexible Scoping**: Assign roles at subscription, resource group, or individual resource scope
- **Delegated Managed Identity**: Support for delegated identity scenarios with group assignments
- **Built-in and Custom Roles**: Works with both Azure built-in roles and custom role definitions
- **JSII Compliance**: Full support for multi-language bindings

## Why Use AZAPI Provider?

The AZAPI provider offers several advantages for managing role assignments:

1. **Latest API Support**: Access to the newest Azure features without waiting for provider updates
2. **Consistent Interface**: Unified approach across all Azure resources
3. **Version Flexibility**: Pin to specific API versions or use latest automatically
4. **Full Feature Coverage**: Support for all Azure properties including preview features
5. **Type Safety**: Strong typing and validation for all resource properties

## Installation

This construct is part of the terraform-cdk-constructs library:

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Basic Usage

### Assign Built-in Reader Role

```typescript
import { RoleAssignment } from '@microsoft/terraform-cdk-constructs/azure-roleassignment';
import { AzapiProvider } from '@microsoft/terraform-cdk-constructs/core-azure';

// Configure the AZAPI provider
new AzapiProvider(this, 'azapi', {});

// Assign Reader role to a user at subscription scope
const readerAssignment = new RoleAssignment(this, 'reader-assignment', {
  name: 'reader-assignment',
  roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7', // Reader
  principalId: '00000000-0000-0000-0000-000000000000', // User Object ID from Azure AD
  scope: '/subscriptions/00000000-0000-0000-0000-000000000000',
  principalType: 'User',
  description: 'Grants read access to all resources in the subscription',
});
```

### Assign Role to Service Principal

```typescript
const contributorAssignment = new RoleAssignment(this, 'sp-contributor', {
  name: 'sp-contributor-assignment',
  roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c', // Contributor
  principalId: servicePrincipal.objectId,
  scope: resourceGroup.id,
  principalType: 'ServicePrincipal',
  description: 'Grants contributor access to the application service principal',
});
```

## Advanced Usage

### Conditional Assignment with ABAC

Attribute-Based Access Control (ABAC) allows you to add conditions to role assignments:

```typescript
// Limit access to specific storage containers
const conditionalAssignment = new RoleAssignment(this, 'conditional-access', {
  name: 'conditional-storage-access',
  roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/ba92f5b4-2d11-453d-a403-e96b0029c9fe', // Storage Blob Data Contributor
  principalId: user.objectId,
  scope: storageAccount.id,
  principalType: 'User',
  condition: "@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'logs'",
  conditionVersion: '2.0',
  description: 'Grants blob data contributor access only to the logs container',
});
```

### Assign Custom Role Definition

```typescript
import { RoleDefinition } from '@microsoft/terraform-cdk-constructs/azure-roledefinition';

// Create a custom role definition
const customRole = new RoleDefinition(this, 'custom-role', {
  name: 'vm-operator',
  roleName: 'Virtual Machine Operator',
  description: 'Can start, stop, and restart virtual machines',
  permissions: [{
    actions: [
      'Microsoft.Compute/virtualMachines/start/action',
      'Microsoft.Compute/virtualMachines/restart/action',
      'Microsoft.Compute/virtualMachines/powerOff/action',
      'Microsoft.Compute/virtualMachines/read',
    ],
    notActions: [],
    dataActions: [],
    notDataActions: [],
  }],
  assignableScopes: ['/subscriptions/00000000-0000-0000-0000-000000000000'],
});

// Assign the custom role
new RoleAssignment(this, 'custom-role-assignment', {
  name: 'vm-operator-assignment',
  roleDefinitionId: customRole.id,
  principalId: '00000000-0000-0000-0000-000000000000',
  scope: '/subscriptions/00000000-0000-0000-0000-000000000000',
  principalType: 'User',
  description: 'Assigns custom VM Operator role to user',
});
```

### Group Assignment with Delegated Managed Identity

```typescript
// Assign role to a group using a delegated managed identity
const groupAssignment = new RoleAssignment(this, 'group-assignment', {
  name: 'group-with-delegated-identity',
  roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7', // Reader
  principalId: group.objectId,
  scope: '/subscriptions/00000000-0000-0000-0000-000000000000',
  principalType: 'Group',
  delegatedManagedIdentityResourceId: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity',
  description: 'Group assignment using delegated managed identity',
});
```

### Resource Group Scoped Assignment

```typescript
const rgAssignment = new RoleAssignment(this, 'rg-contributor', {
  name: 'rg-contributor-assignment',
  roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c', // Contributor
  principalId: '00000000-0000-0000-0000-000000000000',
  scope: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group',
  principalType: 'User',
  description: 'Grants contributor access only to this resource group',
});
```

### Individual Resource Scoped Assignment

```typescript
const resourceAssignment = new RoleAssignment(this, 'storage-contributor', {
  name: 'storage-contributor-assignment',
  roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/ba92f5b4-2d11-453d-a403-e96b0029c9fe', // Storage Blob Data Contributor
  principalId: managedIdentity.principalId,
  scope: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/mystorageaccount',
  principalType: 'ServicePrincipal',
  description: 'Grants blob data contributor access to this specific storage account',
});
```

## Properties

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `roleDefinitionId` | string | The role definition ID to assign (built-in or custom role) |
| `principalId` | string | The Object ID of the principal (user, group, service principal, managed identity) |
| `scope` | string | The scope at which the role is assigned (subscription, resource group, or resource) |

### Optional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | string | Auto-generated | The name of the role assignment resource |
| `principalType` | string | undefined | Type of principal: User, Group, ServicePrincipal, ForeignGroup, Device |
| `description` | string | undefined | Description of why the assignment was made |
| `condition` | string | undefined | ABAC condition expression to limit access |
| `conditionVersion` | string | undefined | Version of condition syntax (e.g., "2.0") |
| `delegatedManagedIdentityResourceId` | string | undefined | Resource ID of delegated managed identity (for group assignments) |
| `apiVersion` | string | "2022-04-01" | Explicit API version to use |
| `tags` | object | {} | Tags to apply to the role assignment |
| `ignoreChanges` | string[] | [] | Properties to ignore during updates |

## Outputs

The [`RoleAssignment`](lib/role-assignment.ts:188) construct provides the following outputs:

| Output | Type | Description |
|--------|------|-------------|
| `id` | string | The resource ID of the role assignment |
| `name` | string | The name of the role assignment |
| `resourceId` | string | Alias for the id property |
| `roleDefinitionId` | string | The role definition ID that was assigned |
| `principalId` | string | The principal ID that was granted the role |
| `assignmentScope` | string | The scope at which the role was assigned |
| `principalType` | string \| undefined | The type of principal (if specified) |

## API Versions

### Supported Versions

| Version | Support Level | Release Date | Notes |
|---------|---------------|--------------|-------|
| [2022-04-01](lib/role-assignment-schemas.ts:145) | Active (Latest) | 2022-04-01 | Full support for ABAC conditional assignments and delegated managed identities |

### Version Selection

```typescript
// Use latest version (default)
new RoleAssignment(this, 'assignment', {
  roleDefinitionId: '...',
  principalId: '...',
  scope: '...',
});

// Pin to specific version
new RoleAssignment(this, 'assignment', {
  roleDefinitionId: '...',
  principalId: '...',
  scope: '...',
  apiVersion: '2022-04-01',
});
```

## Principal Types

### User
An Azure AD user account.

```typescript
principalType: 'User'
```

### Group
An Azure AD group. Can be used with delegated managed identity.

```typescript
principalType: 'Group'
```

### ServicePrincipal
An application or service principal (including managed identities).

```typescript
principalType: 'ServicePrincipal'
```

### ForeignGroup
A group from an external directory (B2B collaboration).

```typescript
principalType: 'ForeignGroup'
```

### Device
A device identity from Azure AD.

```typescript
principalType: 'Device'
```

## Built-in Roles

### Common Built-in Role Definition IDs

| Role Name | Role ID | Description |
|-----------|---------|-------------|
| Owner | `8e3af657-a8ff-443c-a75c-2fe8c4bcb635` | Full access to all resources including the ability to assign roles |
| Contributor | `b24988ac-6180-42a0-ab88-20f7382dd24c` | Full access to all resources but cannot assign roles |
| Reader | `acdd72a7-3385-48ef-bd42-f606fba81ae7` | View all resources but cannot make changes |
| User Access Administrator | `18d7d88d-d35e-4fb5-a5c3-7773c20a72d9` | Manage user access to Azure resources |
| Storage Blob Data Contributor | `ba92f5b4-2d11-453d-a403-e96b0029c9fe` | Read, write, and delete Azure Storage containers and blobs |
| Storage Blob Data Reader | `2a2b9908-6ea1-4ae2-8e65-a410df84e7d1` | Read Azure Storage containers and blobs |
| Key Vault Secrets User | `4633458b-17de-408a-b874-0445c86b69e6` | Read secret contents from Key Vault |
| Virtual Machine Contributor | `9980e02c-c2be-4d73-94e8-173b1dc7cf3c` | Manage virtual machines but not the virtual network or storage account they're connected to |

For a complete list, see [Azure Built-in Roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).

## Best Practices

### 1. Principle of Least Privilege

Always assign the minimum permissions required:

```typescript
// ❌ Bad: Overly permissive
roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635' // Owner

// ✅ Good: Specific permissions
roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7' // Reader
```

### 2. Specific Scopes

Assign roles at the narrowest scope possible:

```typescript
// ❌ Bad: Subscription-wide access when not needed
scope: '/subscriptions/00000000-0000-0000-0000-000000000000'

// ✅ Good: Resource group or resource-specific
scope: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg'
```

### 3. Always Specify Principal Type

Improves performance and clarity:

```typescript
// ✅ Good
new RoleAssignment(this, 'assignment', {
  // ...
  principalType: 'ServicePrincipal',  // Explicit type
});
```

### 4. Use Conditional Access When Appropriate

Limit access further with ABAC conditions:

```typescript
new RoleAssignment(this, 'conditional', {
  // ...
  condition: "@Resource[Microsoft.Storage/storageAccounts:name] StringStartsWith 'prod'",
  conditionVersion: '2.0',
});
```

### 5. Document Assignments

Use descriptions to explain why assignments exist:

```typescript
new RoleAssignment(this, 'assignment', {
  // ...
  description: 'Grants read access to monitoring team for incident response. Approved by Security-12345.',
});
```

### 6. Prefer Custom Roles

Create custom roles for specific needs instead of using broad built-in roles:

```typescript
// Create custom role with exact permissions needed
const customRole = new RoleDefinition(this, 'custom', {
  roleName: 'Specific Task Operator',
  permissions: [/* only required actions */],
  assignableScopes: [/* specific scopes */],
});
```

### 7. Use Managed Identities

Prefer managed identities over service principals:

```typescript
// ✅ Good: System-assigned managed identity
principalId: virtualMachine.identity.principalId,
principalType: 'ServicePrincipal',
```

### 8. Regular Audits

Periodically review and remove unnecessary role assignments. Use tags to track:

```typescript
new RoleAssignment(this, 'assignment', {
  // ...
  tags: {
    owner: 'team-name',
    purpose: 'data-processing',
    reviewDate: '2024-12-31',
  },
});
```

## Examples

### Example 1: Multi-Region Monitoring Setup

```typescript
const regions = ['eastus', 'westus', 'northeurope'];

regions.forEach(region => {
  new RoleAssignment(this, `monitoring-${region}`, {
    name: `monitoring-reader-${region}`,
    roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/43d0d8ad-25c7-4714-9337-8ba259a9fe05', // Monitoring Reader
    principalId: monitoringServicePrincipal.objectId,
    scope: `/subscriptions/${subscriptionId}/resourceGroups/rg-${region}`,
    principalType: 'ServicePrincipal',
    description: `Monitoring access for ${region} resources`,
    tags: {
      region,
      purpose: 'monitoring',
    },
  });
});
```

### Example 2: Separation of Duties

```typescript
// Development team: Contributor at resource group level
new RoleAssignment(this, 'dev-team-contributor', {
  name: 'dev-team-rg-contributor',
  roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c',
  principalId: devTeamGroup.objectId,
  scope: devResourceGroup.id,
  principalType: 'Group',
  description: 'Development team can manage resources in dev environment',
});

// Operations team: Reader at subscription, Contributor at production RG
new RoleAssignment(this, 'ops-team-reader', {
  name: 'ops-team-subscription-reader',
  roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7',
  principalId: opsTeamGroup.objectId,
  scope: `/subscriptions/${subscriptionId}`,
  principalType: 'Group',
  description: 'Operations team can view all resources',
});

new RoleAssignment(this, 'ops-team-contributor', {
  name: 'ops-team-prod-contributor',
  roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c',
  principalId: opsTeamGroup.objectId,
  scope: prodResourceGroup.id,
  principalType: 'Group',
  description: 'Operations team can manage production resources',
});
```

### Example 3: Temporary Access

```typescript
// Grant temporary elevated access (remember to remove after use)
new RoleAssignment(this, 'temp-access', {
  name: 'temp-contributor-access',
  roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c',
  principalId: contractor.objectId,
  scope: temporaryResourceGroup.id,
  principalType: 'User',
  description: 'Temporary access for migration project. Remove after 2024-06-30.',
  tags: {
    temporary: 'true',
    expiryDate: '2024-06-30',
    ticketNumber: 'PROJ-12345',
  },
});
```

## Relationship with Role Definition

Role assignments and role definitions work together to implement Azure RBAC:

- **Role Definition**: Defines WHAT permissions are granted (actions, dataActions, etc.)
- **Role Assignment**: Defines WHO gets those permissions and WHERE (scope)

```typescript
import { RoleDefinition } from '@microsoft/terraform-cdk-constructs/azure-roledefinition';
import { RoleAssignment } from '@microsoft/terraform-cdk-constructs/azure-roleassignment';

// Step 1: Define what permissions are needed
const customRole = new RoleDefinition(this, 'data-processor-role', {
  name: 'data-processor',
  roleName: 'Data Processor',
  permissions: [{
    actions: ['Microsoft.Storage/storageAccounts/blobServices/containers/read'],
    dataActions: [
      'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read',
      'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write',
    ],
  }],
  assignableScopes: ['/subscriptions/00000000-0000-0000-0000-000000000000'],
});

// Step 2: Assign those permissions to a principal
new RoleAssignment(this, 'processor-assignment', {
  name: 'data-processor-assignment',
  roleDefinitionId: customRole.id,
  principalId: dataProcessorApp.principalId,
  scope: storageAccount.id,
  principalType: 'ServicePrincipal',
  description: 'Grants data processing application access to storage',
});
```

## Additional Resources

- [Azure RBAC Documentation](https://docs.microsoft.com/azure/role-based-access-control/)
- [Azure Built-in Roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles)
- [Azure ABAC Conditions](https://docs.microsoft.com/azure/role-based-access-control/conditions-overview)
- [Best Practices for Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/best-practices)
- [Azure Role Assignments REST API](https://docs.microsoft.com/rest/api/authorization/role-assignments)
- [Managed Identities for Azure Resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/)

## License

This module is part of the terraform-cdk-constructs project and is licensed under the MIT License.