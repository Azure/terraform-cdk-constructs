# Azure Policy Definition Construct

This module provides a unified, version-aware implementation for managing Azure Policy Definitions using the AZAPI provider and CDK for Terraform.

## Overview

Azure Policy Definitions are rules that enforce specific conditions and effects on Azure resources. They are deployed at subscription or management group scope and can be used to ensure compliance with organizational standards.

## Key Features

- **AZAPI Provider Integration**: Direct ARM API access for reliable deployments
- **Version-Aware**: Automatically uses the latest stable API version (2021-06-01)
- **Schema-Driven Validation**: Built-in validation based on Azure API schemas
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **JSII Compatible**: Can be used from multiple programming languages
- **Flexible Policy Rules**: Support for simple and complex policy logic
- **Parameterized Policies**: Create reusable policies with parameters

## AZAPI Provider Benefits

This construct uses the AZAPI provider, which offers several advantages:

1. **Direct ARM API Access**: Communicates directly with Azure Resource Manager APIs
2. **Faster Updates**: New Azure features are available immediately without provider updates
3. **Consistent Behavior**: Matches Azure's native behavior exactly
4. **Better Error Messages**: Detailed error messages directly from Azure
5. **Version Flexibility**: Easily pin to specific API versions for stability

## Installation

This package is part of the `@microsoft/terraform-cdk-constructs` library.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Basic Usage

### Simple Policy Definition

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { PolicyDefinition } from "@microsoft/terraform-cdk-constructs/azure-policydefinition";

class MyStack extends TerraformStack {
  constructor(scope: App, name: string) {
    super(scope, name);

    // Configure the AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Create a simple policy definition
    const policyDefinition = new PolicyDefinition(this, "require-tags", {
      name: "require-environment-tag",
      displayName: "Require Environment Tag",
      description: "Ensures all resources have an Environment tag",
      policyType: "Custom",
      mode: "Indexed",
      policyRule: {
        if: {
          field: "tags['Environment']",
          exists: "false",
        },
        then: {
          effect: "deny",
        },
      },
      metadata: {
        category: "Tags",
        version: "1.0.0",
      },
    });

    console.log("Policy ID:", policyDefinition.id);
  }
}

const app = new App();
new MyStack(app, "my-stack");
app.synth();
```

### Policy Definition with Parameters

```typescript
const policyDefinition = new PolicyDefinition(this, "tag-policy", {
  name: "require-tag-with-values",
  displayName: "Require Tag with Specific Values",
  description: "Ensures resources have a tag with an allowed value",
  policyRule: {
    if: {
      allOf: [
        {
          field: "[concat('tags[', parameters('tagName'), ']')]",
          exists: "true",
        },
        {
          field: "[concat('tags[', parameters('tagName'), ']')]",
          notIn: "[parameters('allowedValues')]",
        },
      ],
    },
    then: {
      effect: "[parameters('effect')]",
    },
  },
  parameters: {
    tagName: {
      type: "String",
      metadata: {
        displayName: "Tag Name",
        description: "Name of the tag to check",
      },
      defaultValue: "CostCenter",
    },
    allowedValues: {
      type: "Array",
      metadata: {
        displayName: "Allowed Values",
        description: "List of allowed tag values",
      },
      defaultValue: ["Engineering", "Marketing", "Operations"],
    },
    effect: {
      type: "String",
      metadata: {
        displayName: "Effect",
        description: "The effect of the policy (audit or deny)",
      },
      allowedValues: ["audit", "deny"],
      defaultValue: "audit",
    },
  },
  metadata: {
    category: "Tags",
    version: "1.0.0",
  },
});
```

## Advanced Features

### Complex Policy Rules

```typescript
const policyDefinition = new PolicyDefinition(this, "storage-policy", {
  name: "require-https-storage",
  displayName: "Require HTTPS for Storage Accounts",
  description: "Denies storage accounts that don't enforce HTTPS",
  mode: "Indexed",
  policyRule: {
    if: {
      allOf: [
        {
          field: "type",
          equals: "Microsoft.Storage/storageAccounts",
        },
        {
          field: "Microsoft.Storage/storageAccounts/enableHttpsTrafficOnly",
          notEquals: "true",
        },
      ],
    },
    then: {
      effect: "deny",
    },
  },
  metadata: {
    category: "Storage",
    version: "1.0.0",
  },
});
```

### Explicit API Version

```typescript
const policyDefinition = new PolicyDefinition(this, "policy", {
  name: "my-policy",
  apiVersion: "2021-06-01", // Pin to specific version for stability
  policyRule: {
    if: {
      field: "location",
      notIn: ["eastus", "westus"],
    },
    then: {
      effect: "deny",
    },
  },
});
```

### Using Outputs

```typescript
const policyDefinition = new PolicyDefinition(this, "policy", {
  name: "my-policy",
  policyRule: {
    /* ... */
  },
});

// Use the policy definition ID in other resources
new TerraformOutput(this, "policy-id", {
  value: policyDefinition.id,
});

// Access policy properties
console.log("Policy Type:", policyDefinition.policyType);
console.log("Policy Mode:", policyDefinition.policyMode);
```

## Complete Properties Documentation

### PolicyDefinitionProps

| Property | Type | Required | Default | Description |
| -------- | ---- | -------- | ------- | ----------- |
| `name` | string | No* | Construct ID | Name of the policy definition |
| `policyRule` | object | **Yes** | - | The policy rule JSON object defining if/then logic |
| `displayName` | string | No | - | Display name for the policy in Azure Portal |
| `description` | string | No | - | Description of what the policy enforces |
| `policyType` | string | No | "Custom" | Type of policy: Custom, BuiltIn, Static, NotSpecified |
| `mode` | string | No | "All" | Policy mode: All, Indexed, or resource provider modes |
| `parameters` | object | No | - | Parameters that can be passed to policy assignments |
| `metadata` | object | No | - | Additional metadata (category, version, etc.) |
| `apiVersion` | string | No | "2021-06-01" | Specific API version to use |
| `ignoreChanges` | string[] | No | - | Properties to ignore during Terraform updates |
| `enableValidation` | boolean | No | true | Enable schema validation |
| `enableMigrationAnalysis` | boolean | No | false | Enable migration analysis between versions |
| `enableTransformation` | boolean | No | true | Enable property transformation |

*If `name` is not provided, the construct ID will be used as the policy definition name.

## Supported API Versions

| Version    | Support Level | Release Date | Notes                                   |
| ---------- | ------------- | ------------ | --------------------------------------- |
| 2021-06-01 | Active        | 2021-06-01   | Latest stable version (recommended)     |

## Policy Definition Concepts

### Policy Types

- **Custom**: User-defined policies (default) - Used for organization-specific requirements
- **BuiltIn**: Azure-provided policies - Pre-defined policies from Microsoft
- **Static**: Static policy definitions - Policies that don't change
- **NotSpecified**: Type not specified

### Policy Modes

- **All**: Evaluates all resource types (default) - Most common mode
- **Indexed**: Only evaluates resource types that support tags and location
- **Resource Provider Modes**: Specific modes like `Microsoft.KeyVault.Data` for data plane operations

### Policy Effects

Common effects used in the `then` clause of policy rules:

- **deny**: Blocks the resource request
- **audit**: Logs a warning but allows the request (useful for testing)
- **append**: Adds additional properties to the resource
- **modify**: Modifies the resource properties
- **deployIfNotExists**: Deploys resources if they don't exist
- **auditIfNotExists**: Audits if resources don't exist
- **disabled**: Disables the policy

### Policy Rule Structure

A policy rule consists of two main parts:

```typescript
{
  if: {
    // Condition(s) to evaluate
    field: "type",
    equals: "Microsoft.Storage/storageAccounts"
  },
  then: {
    // Action to take if condition is true
    effect: "deny"
  }
}
```

Conditions can use:
- `field`: Resource property to evaluate
- `equals`, `notEquals`: Exact matching
- `in`, `notIn`: Array matching
- `contains`, `notContains`: Substring matching
- `exists`: Check if property exists
- `allOf`, `anyOf`: Logical operators for multiple conditions

## Available Outputs

Policy Definition constructs expose the following outputs:

- `id`: The Azure resource ID of the policy definition
- `name`: The name of the policy definition
- `resourceId`: Alias for the ID (for consistency with other constructs)
- `policyType`: The type of policy definition (Custom, BuiltIn, etc.)
- `policyMode`: The mode of the policy definition (All, Indexed, etc.)

## Best Practices

1. **Use Descriptive Names and Display Names**
   - Make policy purpose clear from the name
   - Include version information in metadata

2. **Start with Audit Effect**
   - Test new policies with `audit` effect first
   - Monitor audit logs before switching to `deny`

3. **Add Comprehensive Metadata**
   - Include category for organization
   - Add version for tracking changes
   - Document purpose and scope

4. **Make Policies Reusable**
   - Use parameters for flexibility
   - Provide sensible default values
   - Document parameter usage

5. **Test Thoroughly**
   - Use integration tests before production
   - Test with various resource types
   - Verify parameter combinations

6. **Document Policy Logic**
   - Provide clear descriptions
   - Document any exceptions or special cases
   - Include examples in metadata

7. **Use Appropriate Policy Modes**
   - Use `Indexed` for resource-level policies
   - Use `All` when location/tags don't apply
   - Use resource provider modes for data plane policies

8. **Version Control**
   - Store policy definitions in source control
   - Use semantic versioning in metadata
   - Document breaking changes

## Examples

### Require Specific Resource Locations

```typescript
new PolicyDefinition(this, "allowed-locations", {
  name: "allowed-resource-locations",
  displayName: "Allowed Resource Locations",
  description: "Restricts resources to approved Azure regions",
  policyRule: {
    if: {
      field: "location",
      notIn: ["eastus", "westus", "centralus"],
    },
    then: {
      effect: "deny",
    },
  },
});
```

### Enforce Naming Conventions

```typescript
new PolicyDefinition(this, "naming-convention", {
  name: "enforce-naming-convention",
  displayName: "Enforce Resource Naming Convention",
  policyRule: {
    if: {
      field: "name",
      notMatch: "^[a-z0-9-]+$",
    },
    then: {
      effect: "deny",
    },
  },
});
```

### Audit Missing Tags

```typescript
new PolicyDefinition(this, "audit-tags", {
  name: "audit-required-tags",
  displayName: "Audit Resources Missing Required Tags",
  policyRule: {
    if: {
      anyOf: [
        {
          field: "tags['CostCenter']",
          exists: "false",
        },
        {
          field: "tags['Environment']",
          exists: "false",
        },
      ],
    },
    then: {
      effect: "audit",
    },
  },
});
```

## Related Constructs

- **Policy Assignments**: Use policy definitions by assigning them to scopes (subscriptions, resource groups)
- **Role Definitions**: Define custom RBAC roles for Azure resources
- **Role Assignments**: Assign roles to identities for access control

## Troubleshooting

### Common Issues

1. **Policy Not Taking Effect**
   - Check policy assignment scope
   - Verify policy mode matches resource type
   - Allow time for policy evaluation (can take 15-30 minutes)

2. **Validation Errors**
   - Ensure policyRule is valid JSON
   - Check parameter types and values
   - Verify field names match Azure resource properties

3. **Scope Issues**
   - Policy definitions are subscription-scoped
   - Ensure proper RBAC permissions
   - Check management group hierarchy if applicable

## Contributing

Contributions are welcome! Please refer to the main project's contributing guidelines.

## License

This project is licensed under the MIT License - see the LICENSE file for details.