# Azure Policy Set Definition (Initiative) Construct

This module provides a high-level TypeScript construct for managing Azure Policy Set Definitions (also known as Initiatives) using the Terraform CDK and Azure AZAPI provider.

## Features

- **Multiple API Version Support**: Supports 2023-04-01 (latest) and 2021-06-01 (for backward compatibility)
- **Automatic Version Resolution**: Uses the latest API version by default
- **Version Pinning**: Lock to a specific API version for stability
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **JSII Compatible**: Can be used from TypeScript, Python, Java, and C#
- **Terraform Outputs**: Automatic creation of outputs for id, name, and policySetDefinitionId
- **Policy Definition References**: Support for including multiple policy definitions
- **Policy Definition Groups**: Organize policies within initiatives
- **Initiative Parameters**: Define parameters that can be used across policies in the set
- **Metadata Support**: Categorization with category, version, preview, and deprecated flags

## What is a Policy Set Definition (Initiative)?

A Policy Set Definition, also known as an "Initiative" in the Azure Portal, is a collection of policy definitions that are grouped together toward a specific goal. Initiatives simplify managing and assigning policies by grouping a set of policies as one single item.

**Key Benefits:**
- **Simplified Assignment**: Assign multiple policies at once
- **Compliance Grouping**: Group related compliance controls together
- **Parameter Inheritance**: Pass parameters to multiple policies from a single assignment
- **Organized Management**: Use groups to categorize policies within an initiative

## Supported API Versions

| Version | Status | Release Date | Notes |
|---------|--------|--------------|-------|
| 2023-04-01 | Active (Latest) | 2023-04-01 | Recommended for new deployments |
| 2021-06-01 | Active | 2021-06-01 | Stable release for backward compatibility |

## Installation

This module is part of the `@microsoft/terraform-cdk-constructs` package.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Basic Usage

### Simple Initiative with Built-in Policies

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { PolicySetDefinition } from "@microsoft/terraform-cdk-constructs/azure-policysetdefinition";

const app = new App();
const stack = new TerraformStack(app, "policy-stack");

// Configure the Azure provider
new AzapiProvider(stack, "azapi", {});

// Create a Policy Set Definition (Initiative)
const initiative = new PolicySetDefinition(stack, "security-initiative", {
  displayName: "Security Baseline Initiative",
  description: "Applies security baseline policies to ensure compliance",
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  policyDefinitions: [
    {
      // Audit VMs that do not use managed disks
      policyDefinitionId: "/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d",
      policyDefinitionReferenceId: "auditManagedDisks",
    },
    {
      // Audit location of resources
      policyDefinitionId: "/providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c",
      policyDefinitionReferenceId: "allowedLocations",
    },
  ],
  tags: {
    environment: "production",
    compliance: "required",
  },
});

app.synth();
```

## Advanced Usage

### Initiative with Parameters

```typescript
const initiative = new PolicySetDefinition(stack, "parameterized-initiative", {
  displayName: "Tagging Governance Initiative",
  description: "Ensures all resources have required tags",
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  parameters: {
    requiredTagName: {
      type: "String",
      displayName: "Required Tag Name",
      description: "Name of the tag that must be present on resources",
      defaultValue: "costCenter",
    },
    requiredTagValue: {
      type: "String",
      displayName: "Required Tag Value",
      description: "Expected value for the required tag",
    },
  },
  policyDefinitions: [
    {
      policyDefinitionId: "/providers/Microsoft.Authorization/policyDefinitions/1e30110a-5ceb-460c-a204-c1c3969c6d62",
      policyDefinitionReferenceId: "requireTagOnResourceGroup",
      parameters: {
        tagName: { value: "[parameters('requiredTagName')]" },
      },
    },
    {
      policyDefinitionId: "/providers/Microsoft.Authorization/policyDefinitions/726aca4c-86e9-4b04-b0c5-073027359532",
      policyDefinitionReferenceId: "inheritTagFromResourceGroup",
      parameters: {
        tagName: { value: "[parameters('requiredTagName')]" },
      },
    },
  ],
});
```

### Initiative with Policy Groups

```typescript
const initiative = new PolicySetDefinition(stack, "grouped-initiative", {
  displayName: "Comprehensive Compliance Initiative",
  description: "Security and compliance policies organized by category",
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  metadata: {
    category: "Regulatory Compliance",
    version: "2.0.0",
  },
  policyDefinitionGroups: [
    {
      name: "NetworkSecurity",
      displayName: "Network Security Policies",
      category: "Network",
      description: "Policies for network security controls",
    },
    {
      name: "DataProtection",
      displayName: "Data Protection Policies",
      category: "Data",
      description: "Policies for data protection and encryption",
    },
    {
      name: "IdentityAndAccess",
      displayName: "Identity & Access Policies",
      category: "IAM",
      description: "Policies for identity and access management",
    },
  ],
  policyDefinitions: [
    {
      policyDefinitionId: "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
      policyDefinitionReferenceId: "networkSecurityPolicy1",
      groupNames: ["NetworkSecurity"],
    },
    {
      policyDefinitionId: "/providers/Microsoft.Authorization/policyDefinitions/policy-2",
      policyDefinitionReferenceId: "dataProtectionPolicy1",
      groupNames: ["DataProtection"],
    },
    {
      policyDefinitionId: "/providers/Microsoft.Authorization/policyDefinitions/policy-3",
      policyDefinitionReferenceId: "crossCuttingPolicy",
      groupNames: ["NetworkSecurity", "DataProtection"],
    },
  ],
});
```

### Combining Custom and Built-in Policies

```typescript
import { PolicyDefinition } from "@microsoft/terraform-cdk-constructs/azure-policydefinition";

// Create a custom policy definition first
const customPolicy = new PolicyDefinition(stack, "custom-audit-policy", {
  displayName: "Audit Custom Tag",
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  policyRule: {
    if: {
      field: "tags['department']",
      exists: "false",
    },
    then: {
      effect: "audit",
    },
  },
});

// Create an initiative that combines the custom policy with built-in policies
const initiative = new PolicySetDefinition(stack, "combined-initiative", {
  displayName: "Combined Policies Initiative",
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  policyDefinitions: [
    {
      // Reference the custom policy
      policyDefinitionId: customPolicy.id,
      policyDefinitionReferenceId: "customAuditTag",
    },
    {
      // Built-in policy
      policyDefinitionId: "/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d",
      policyDefinitionReferenceId: "builtInAuditVMs",
    },
  ],
});
```

### Management Group Scope

```typescript
const mgInitiative = new PolicySetDefinition(stack, "mg-initiative", {
  displayName: "Organization-wide Initiative",
  description: "Applies to all subscriptions in the management group",
  scope: "/providers/Microsoft.Management/managementGroups/my-management-group",
  policyDefinitions: [
    {
      policyDefinitionId: "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
      policyDefinitionReferenceId: "orgPolicy1",
    },
  ],
});
```

### Pinning to a Specific API Version

```typescript
const initiative = new PolicySetDefinition(stack, "pinned-initiative", {
  displayName: "Stable Initiative",
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  apiVersion: "2021-06-01", // Pin to specific version
  policyDefinitions: [
    {
      policyDefinitionId: "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
    },
  ],
});
```

### Using Outputs for Policy Assignment

```typescript
import { TerraformOutput } from "cdktf";

const initiative = new PolicySetDefinition(stack, "initiative", {
  displayName: "My Initiative",
  scope: subscriptionId,
  policyDefinitions: [
    {
      policyDefinitionId: "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
    },
  ],
});

// Use the initiative ID in a policy assignment
// The policySetDefinitionId property can be referenced from other resources
console.log(initiative.policySetDefinitionId); // Terraform interpolation string

// Create outputs for cross-stack references
new TerraformOutput(stack, "initiative-id", {
  value: initiative.idOutput,
});
```

## API Reference

### PolicySetDefinitionProps

Configuration properties for the Policy Set Definition construct.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | No | Resource name. Auto-generated as UUID if not provided. |
| `displayName` | `string` | Yes | Display name shown in Azure Portal. |
| `description` | `string` | No | Description of the initiative. |
| `scope` | `string` | Yes | Subscription or management group scope for the definition. |
| `policyType` | `"BuiltIn" \| "Custom" \| "Static"` | No | Type of policy set. Default: "Custom". |
| `metadata` | `PolicySetMetadata` | No | Metadata for categorization. |
| `parameters` | `{ [key: string]: PolicySetParameterDefinition }` | No | Initiative parameter definitions. |
| `policyDefinitions` | `PolicyDefinitionReference[]` | Yes | Array of policy definition references. |
| `policyDefinitionGroups` | `PolicyDefinitionGroup[]` | No | Groups for organizing policies. |
| `tags` | `{ [key: string]: string }` | No | Resource tags. |
| `apiVersion` | `string` | No | Pin to a specific API version. |

### PolicyDefinitionReference

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `policyDefinitionId` | `string` | Yes | ID of the policy definition to include. |
| `policyDefinitionReferenceId` | `string` | No | Unique ID within the set. |
| `parameters` | `{ [key: string]: PolicyParameterValue }` | No | Parameter values for this policy. |
| `groupNames` | `string[]` | No | Groups this policy belongs to. |

### PolicyDefinitionGroup

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Unique group name within the set. |
| `displayName` | `string` | No | Display name in Azure Portal. |
| `category` | `string` | No | Category for organization. |
| `description` | `string` | No | Description of the group. |

### PolicySetMetadata

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `category` | `string` | No | Category for Azure Portal organization. |
| `version` | `string` | No | Version of the initiative. |
| `preview` | `boolean` | No | Whether this is a preview initiative. |
| `deprecated` | `boolean` | No | Whether this initiative is deprecated. |

### PolicySetParameterDefinition

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Data type: String, Array, Object, Boolean, Integer, Float, DateTime. |
| `displayName` | `string` | No | Display name in Azure Portal. |
| `description` | `string` | No | Parameter description. |
| `defaultValue` | `any` | No | Default value for the parameter. |
| `allowedValues` | `any[]` | No | Allowed values for the parameter. |
| `metadata` | `object` | No | Additional metadata (e.g., strongType). |

### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The Azure resource ID of the policy set definition. |
| `policySetDefinitionId` | `string` | Alias for id, for use in policy assignments. |
| `displayName` | `string` | The display name of the initiative. |
| `policyType` | `string` | The policy type (Custom, BuiltIn, Static). |
| `policyDefinitionCount` | `number` | Number of policy definitions in this set. |
| `props` | `PolicySetDefinitionProps` | The original input properties. |
| `resolvedApiVersion` | `string` | The API version being used. |

### Outputs

The construct automatically creates Terraform outputs:

- `id`: The policy set definition resource ID
- `name`: The policy set definition resource name
- `policy_set_definition_id`: The ID for use in policy assignments

## Best Practices

### 1. Use Descriptive Reference IDs

```typescript
policyDefinitions: [
  {
    policyDefinitionId: "...",
    policyDefinitionReferenceId: "auditStorageAccountEncryption", // Descriptive name
  },
]
```

### 2. Organize with Groups

Use policy definition groups to categorize policies for better management and compliance reporting:

```typescript
policyDefinitionGroups: [
  { name: "Security", category: "Security Center" },
  { name: "Compliance", category: "Regulatory" },
  { name: "CostManagement", category: "Cost" },
],
```

### 3. Use Initiative Parameters

Define parameters at the initiative level to allow flexibility during assignment:

```typescript
parameters: {
  effect: {
    type: "String",
    defaultValue: "Audit",
    allowedValues: ["Audit", "Deny", "Disabled"],
  },
},
```

### 4. Version Your Initiatives

Use metadata to track initiative versions:

```typescript
metadata: {
  category: "Security",
  version: "1.0.0",
},
```

### 5. Use Management Group Scope for Enterprise

For organization-wide initiatives, create them at management group level:

```typescript
scope: "/providers/Microsoft.Management/managementGroups/root-mg",
```

## Troubleshooting

### Common Issues

1. **Empty policyDefinitions**: At least one policy definition reference is required.

2. **Invalid Group Reference**: Ensure all groupNames in policy definitions exist in policyDefinitionGroups.

3. **Duplicate Group Names**: Each group name must be unique within the policy set.

4. **Missing policyDefinitionId**: Every policy definition reference requires a policyDefinitionId.

5. **API Version Errors**: Ensure the version is 2023-04-01 or 2021-06-01.

## Related Constructs

- [`PolicyDefinition`](../azure-policydefinition/README.md) - Create custom policy definitions
- [`PolicyAssignment`](../azure-policyassignment/README.md) - Assign policies and initiatives
- [`ResourceGroup`](../azure-resourcegroup/README.md) - Azure Resource Groups

## Additional Resources

- [Azure Policy Documentation](https://learn.microsoft.com/en-us/azure/governance/policy/overview)
- [Azure Policy Initiative Definition](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/initiative-definition-structure)
- [Azure REST API Reference](https://learn.microsoft.com/en-us/rest/api/policy/policy-set-definitions)
- [Terraform CDK Documentation](https://developer.hashicorp.com/terraform/cdktf)

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
