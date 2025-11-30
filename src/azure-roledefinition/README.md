# Azure Role Definition Construct

This module provides a CDK for Terraform (CDKTF) construct for managing Azure RBAC Role Definitions using the AZAPI provider. Role definitions define custom roles with specific permissions that can be assigned to users, groups, or service principals through role assignments.

## Features

- **Version-Aware Schema Management**: Automatic handling of API version resolution and schema validation
- **Custom RBAC Roles**: Define custom roles with granular permissions
- **Control Plane Actions**: Specify allowed and denied management operations
- **Data Plane Actions**: Define permissions for data operations within resources
- **Flexible Scoping**: Assign roles at subscription, resource group, or management group level
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **JSII Compliance**: Multi-language support (TypeScript, Python, Java, C#, Go)

## AZAPI Provider Benefits

This construct uses the AZAPI provider, which offers several advantages:

- **Day-0 Support**: Access to new Azure features immediately upon release
- **Consistent API**: Direct mapping to Azure REST API structure
- **Reduced Complexity**: No need to wait for provider updates
- **Better Compatibility**: Works seamlessly with the latest Azure features

## Installation

```bash
npm install @cdktf/terraform-cdk-constructs
```

## Supported API Versions

| API Version | Support Level | Release Date | Status |
|-------------|---------------|--------------|--------|
| 2022-04-01  | Active        | 2022-04-01   | Latest |

## Basic Usage

### Create a Simple Read-Only Role

```typescript
import { RoleDefinition } from "@cdktf/terraform-cdk-constructs/azure-roledefinition";

const vmReaderRole = new RoleDefinition(this, "vm-reader", {
  name: "vm-reader-role",
  roleName: "Virtual Machine Reader",
  description: "Can view virtual machines and their properties",
  permissions: [
    {
      actions: [
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Compute/virtualMachines/instanceView/read",
        "Microsoft.Network/networkInterfaces/read"
      ]
    }
  ],
  assignableScopes: [
    "/subscriptions/00000000-0000-0000-0000-000000000000"
  ]
});
```

## Advanced Features

### Role with Data Plane Permissions

Create a role with both control plane and data plane permissions for comprehensive access management:

```typescript
const storageOperator = new RoleDefinition(this, "storage-operator", {
  name: "storage-operator-role",
  roleName: "Storage Operator",
  description: "Can manage storage accounts and read/write blob data",
  permissions: [
    {
      // Control plane actions - manage storage accounts
      actions: [
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Storage/storageAccounts/write",
        "Microsoft.Storage/storageAccounts/listkeys/action"
      ],
      // Explicitly deny delete operations
      notActions: [
        "Microsoft.Storage/storageAccounts/delete"
      ],
      // Data plane actions - read and write blobs
      dataActions: [
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write"
      ],
      // Explicitly deny delete operations on data plane
      notDataActions: [
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete"
      ]
    }
  ],
  assignableScopes: [
    "/subscriptions/00000000-0000-0000-0000-000000000000"
  ]
});
```

### Multiple Assignable Scopes

Define a role that can be assigned at multiple levels:

```typescript
const multiScopeRole = new RoleDefinition(this, "multi-scope", {
  name: "multi-scope-role",
  roleName: "Multi-Scope Operator",
  description: "Can be assigned at subscription, resource group, or management group level",
  permissions: [
    {
      actions: [
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ]
    }
  ],
  assignableScopes: [
    "/subscriptions/00000000-0000-0000-0000-000000000000",
    "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg1",
    "/providers/Microsoft.Management/managementGroups/mg1"
  ]
});
```

### Complex Permission Combinations

Create sophisticated roles with multiple permission objects:

```typescript
const complexRole = new RoleDefinition(this, "complex-role", {
  name: "complex-role",
  roleName: "Complex Operator Role",
  description: "Role with multiple permission sets",
  permissions: [
    {
      // Compute permissions
      actions: ["Microsoft.Compute/virtualMachines/read"],
      notActions: []
    },
    {
      // Storage permissions
      actions: ["Microsoft.Storage/storageAccounts/read"],
      dataActions: [
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read"
      ]
    },
    {
      // Network permissions
      actions: [
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/networkInterfaces/read"
      ]
    }
  ],
  assignableScopes: [
    "/subscriptions/00000000-0000-0000-0000-000000000000"
  ]
});
```

## Properties

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `roleName` | string | Display name of the role (1-128 characters) |
| `permissions` | RoleDefinitionPermission[] | Array of permission objects defining role capabilities |
| `assignableScopes` | string[] | Scopes where the role can be assigned |

### Optional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | string | Auto-generated | Resource name for the role definition |
| `description` | string | - | Detailed description of the role (max 1024 characters) |
| `type` | string | "CustomRole" | Role type (CustomRole or BuiltInRole) |
| `apiVersion` | string | "2022-04-01" | Azure API version to use |
| `ignoreChanges` | string[] | - | Properties to ignore during updates |

### Permission Object Structure

```typescript
interface RoleDefinitionPermission {
  actions?: string[];        // Control plane allowed actions
  notActions?: string[];     // Control plane denied actions
  dataActions?: string[];    // Data plane allowed actions
  notDataActions?: string[]; // Data plane denied actions
}
```

## Available Outputs

The RoleDefinition construct exposes these outputs:

- `id`: Full resource ID of the role definition
- `name`: Name of the role definition
- `resourceId`: Alias for id (for use in other resources)
- `roleName`: Display name of the role
- `roleType`: Type of role (CustomRole or BuiltInRole)

## Common Permission Patterns

### Reader Pattern
```typescript
permissions: [{
  actions: ["Microsoft.Resources/subscriptions/read"]
}]
```

### Contributor Pattern
```typescript
permissions: [{
  actions: ["*"],
  notActions: [
    "Microsoft.Authorization/roleAssignments/write",
    "Microsoft.Authorization/roleAssignments/delete"
  ]
}]
```

### Service-Specific Reader
```typescript
permissions: [{
  actions: [
    "Microsoft.Compute/virtualMachines/read",
    "Microsoft.Compute/disks/read",
    "Microsoft.Compute/snapshots/read"
  ]
}]
```

### Data Plane Access
```typescript
permissions: [{
  dataActions: [
    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write"
  ]
}]
```

## Relationship with Role Assignment

After creating a Role Definition, use the RoleAssignment service to assign the role to principals:

```typescript
import { RoleDefinition } from "@cdktf/terraform-cdk-constructs/azure-roledefinition";
import { RoleAssignment } from "@cdktf/terraform-cdk-constructs/azure-roleassignment";

// Create custom role
const customRole = new RoleDefinition(this, "custom-role", {
  roleName: "Custom Operator",
  permissions: [
    {
      actions: ["Microsoft.Compute/virtualMachines/read"]
    }
  ],
  assignableScopes: [
    "/subscriptions/00000000-0000-0000-0000-000000000000"
  ]
});

// Assign the role to a principal (user, group, or service principal)
const assignment = new RoleAssignment(this, "role-assignment", {
  name: "custom-role-assignment",
  roleDefinitionId: customRole.id,
  principalId: "00000000-0000-0000-0000-000000000000", // User/Group/SP Object ID
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000"
});
```

## Best Practices

### 1. Principle of Least Privilege
Grant only the minimum permissions required for the role's purpose:

```typescript
// Good: Specific permissions
permissions: [{
  actions: [
    "Microsoft.Compute/virtualMachines/read",
    "Microsoft.Compute/virtualMachines/start/action"
  ]
}]

// Avoid: Overly broad permissions
permissions: [{
  actions: ["*"]
}]
```

### 2. Use NotActions Carefully
NotActions exclude permissions from a broader grant. Use them to create exceptions:

```typescript
permissions: [{
  actions: ["Microsoft.Compute/virtualMachines/*"],
  notActions: [
    "Microsoft.Compute/virtualMachines/delete",
    "Microsoft.Compute/virtualMachines/write"
  ]
}]
```

### 3. Document Role Purpose
Provide clear descriptions:

```typescript
const role = new RoleDefinition(this, "role", {
  roleName: "VM Operator",
  description: "Can start, stop, and restart VMs. Cannot create, modify, or delete VMs. Intended for operations team.",
  // ...
});
```

### 4. Scope Appropriately
Limit assignable scopes to only where needed:

```typescript
// Good: Limited to specific resource group
assignableScopes: [
  "/subscriptions/sub-id/resourceGroups/production-vms"
]

// Avoid: Too broad if not necessary
assignableScopes: [
  "/subscriptions/sub-id"
]
```

### 5. Separate Control and Data Plane
Understand the difference between actions and dataActions:

```typescript
permissions: [{
  // Control plane: Manage the resource itself
  actions: ["Microsoft.Storage/storageAccounts/read"],
  
  // Data plane: Access data within the resource
  dataActions: [
    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read"
  ]
}]
```

### 6. Test Permissions
Always test that the role grants the intended access and nothing more:

1. Assign the role to a test principal
2. Verify the principal can perform allowed actions
3. Verify the principal cannot perform denied actions
4. Check at all intended assignable scopes

## Understanding Actions

### Wildcard Usage
- `*`: All actions
- `Microsoft.Compute/*`: All actions in Compute resource provider
- `Microsoft.Compute/virtualMachines/*`: All actions on VMs

### Action Format
Actions follow the pattern: `{Provider}/{ResourceType}/{Operation}`

Examples:
- `Microsoft.Compute/virtualMachines/read`
- `Microsoft.Network/virtualNetworks/write`
- `Microsoft.Storage/storageAccounts/listkeys/action`

### Control Plane vs Data Plane
- **Control Plane (actions)**: Manage Azure resources
  - Example: Create VM, delete storage account
- **Data Plane (dataActions)**: Access data in resources
  - Example: Read blob, write to queue

## Migration Notes

This implementation uses the AZAPI provider with version-aware schema management. When migrating from other implementations:

1. Role definitions are subscription or management group scoped (no location property)
2. Use the `permissions` array to define role capabilities
3. Specify `assignableScopes` to control where the role can be assigned
4. The construct automatically resolves to the latest API version unless pinned

## Troubleshooting

### Role Not Appearing in Portal
- Wait a few minutes for replication
- Check that you're viewing the correct subscription/scope
- Verify the role was created successfully via API

### Permission Denied When Using Role
- Check that the role includes the required actions
- Verify the assignable scopes include the target scope
- Ensure the role has been assigned to the principal

### Role Cannot Be Deleted
- Check if any role assignments reference this role definition
- Remove all assignments before deleting the definition

## Additional Resources

- [Azure RBAC Documentation](https://docs.microsoft.com/azure/role-based-access-control/)
- [Azure Resource Provider Operations](https://docs.microsoft.com/azure/role-based-access-control/resource-provider-operations)
- [AZAPI Provider Documentation](https://registry.terraform.io/providers/Azure/azapi/latest/docs)
- [Custom Roles in Azure](https://docs.microsoft.com/azure/role-based-access-control/custom-roles)
