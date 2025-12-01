# Azure Policy Assignment Construct

This module provides a unified, version-aware implementation for managing Azure Policy Assignments using the AZAPI provider and CDK for Terraform.

## Overview

Azure Policy Assignments apply policy definitions to specific scopes (subscription, resource group, or resource) and provide parameter values for policy enforcement. Policy assignments can configure enforcement modes, managed identities for remediation, and custom non-compliance messages.

## Key Features

- **AZAPI Provider Integration**: Direct ARM API access for reliable deployments
- **Version-Aware**: Automatically uses the latest stable API version (2022-06-01)
- **Schema-Driven Validation**: Built-in validation based on Azure API schemas
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **JSII Compatible**: Can be used from multiple programming languages
- **Flexible Scoping**: Support for subscription, resource group, and resource-level assignments
- **Enforcement Modes**: Control whether policies are enforced or audited
- **Managed Identity Support**: Enable remediation for deployIfNotExists and modify policies
- **Scope Exclusions**: Exclude specific scopes from policy evaluation

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

### Simple Policy Assignment

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { PolicyDefinition } from "@microsoft/terraform-cdk-constructs/azure-policydefinition";
import { PolicyAssignment } from "@microsoft/terraform-cdk-constructs/azure-policyassignment";

class MyStack extends TerraformStack {
  constructor(scope: App, name: string) {
    super(scope, name);

    // Configure the AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // First create or reference a policy definition
    const policyDef = new PolicyDefinition(this, "require-tags", {
      name: "require-environment-tag",
      policyRule: {
        if: {
          field: "tags['Environment']",
          exists: "false",
        },
        then: {
          effect: "deny",
        },
      },
    });

    // Then assign the policy to a scope
    const assignment = new PolicyAssignment(this, "tag-assignment", {
      name: "require-tags-on-rg",
      displayName: "Require Environment Tag on Resources",
      description: "Ensures all resources in this resource group have an Environment tag",
      policyDefinitionId: policyDef.id,
      scope: "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg",
    });

    console.log("Assignment ID:", assignment.id);
  }
}

const app = new App();
new MyStack(app, "my-stack");
app.synth();
```

### Assignment with Parameters

```typescript
const assignment = new PolicyAssignment(this, "tag-assignment", {
  name: "require-environment-tag",
  displayName: "Require Environment Tag",
  policyDefinitionId: parameterizedPolicyDef.id,
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  parameters: {
    tagName: {
      value: "Environment",
    },
    allowedValues: {
      value: ["Development", "Staging", "Production"],
    },
    effect: {
      value: "deny",
    },
  },
});
```

### Assignment with Built-in Policy

```typescript
// Reference a built-in Azure policy
const assignment = new PolicyAssignment(this, "builtin-assignment", {
  name: "audit-vm-managed-disks",
  displayName: "Audit VMs without Managed Disks",
  policyDefinitionId:
    "/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d",
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  enforcementMode: "Default",
});
```

## Advanced Features

### Enforcement Modes

Control whether the policy is enforced or only audited:

```typescript
// Audit mode - policy is evaluated but not enforced
const auditAssignment = new PolicyAssignment(this, "audit-assignment", {
  name: "audit-policy",
  displayName: "Audit Policy (DoNotEnforce)",
  policyDefinitionId: policyDef.id,
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  enforcementMode: "DoNotEnforce", // Audit only
});

// Enforcement mode - policy is actively enforced (default)
const enforceAssignment = new PolicyAssignment(this, "enforce-assignment", {
  name: "enforce-policy",
  displayName: "Enforce Policy (Default)",
  policyDefinitionId: policyDef.id,
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  enforcementMode: "Default", // Actively enforced
});
```

### Managed Identity for Remediation

For policies with deployIfNotExists or modify effects, add a managed identity:

```typescript
const assignment = new PolicyAssignment(this, "remediation-assignment", {
  name: "deploy-vm-monitoring",
  displayName: "Deploy VM Monitoring Extension",
  policyDefinitionId: deployPolicyId,
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  identity: {
    type: "SystemAssigned",
  },
});

// Or use a user-assigned identity
const userIdentityAssignment = new PolicyAssignment(
  this,
  "user-identity-assignment",
  {
    name: "deploy-with-user-identity",
    policyDefinitionId: deployPolicyId,
    scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
    identity: {
      type: "UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-identity":
          {},
      },
    },
  },
);
```

### Scope Exclusions

Exclude specific scopes from policy evaluation:

```typescript
const assignment = new PolicyAssignment(this, "with-exclusions", {
  name: "subscription-policy-with-exclusions",
  displayName: "Subscription Policy with Exclusions",
  policyDefinitionId: policyDef.id,
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  notScopes: [
    "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/excluded-rg",
    "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
  ],
});
```

### Custom Non-Compliance Messages

Provide helpful messages when resources are non-compliant:

```typescript
const assignment = new PolicyAssignment(this, "with-messages", {
  name: "tag-policy",
  displayName: "Require Resource Tags",
  policyDefinitionId: policyDef.id,
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  nonComplianceMessages: [
    {
      message:
        "All resources must have the required tags. Please add the Environment tag with an appropriate value.",
    },
  ],
});
```

### Explicit API Version

```typescript
const assignment = new PolicyAssignment(this, "pinned-version", {
  name: "my-assignment",
  apiVersion: "2022-06-01", // Pin to specific version for stability
  policyDefinitionId: policyDef.id,
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
});
```

### Using Outputs

```typescript
const assignment = new PolicyAssignment(this, "assignment", {
  name: "my-assignment",
  policyDefinitionId: policyDef.id,
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
});

// Use the assignment ID in other resources
new TerraformOutput(this, "assignment-id", {
  value: assignment.id,
});

// Access assignment properties
console.log("Policy Definition ID:", assignment.policyDefinitionId);
console.log("Assignment Scope:", assignment.assignmentScope);
console.log("Enforcement Mode:", assignment.enforcementMode);
```

## Complete Properties Documentation

### PolicyAssignmentProps

| Property                 | Type     | Required | Default   | Description                                           |
| ------------------------ | -------- | -------- | --------- | ----------------------------------------------------- |
| `name`                   | string   | No\*     | Construct | Name of the policy assignment                         |
| `policyDefinitionId`     | string   | **Yes**  | -         | ID of the policy definition to assign                 |
| `scope`                  | string   | **Yes**  | -         | Scope where the policy is assigned                    |
| `displayName`            | string   | No       | -         | Display name for the assignment                       |
| `description`            | string   | No       | -         | Description of the assignment                         |
| `enforcementMode`        | string   | No       | "Default" | Default or DoNotEnforce                               |
| `parameters`             | object   | No       | -         | Parameter values for the policy                       |
| `metadata`               | object   | No       | -         | Additional metadata                                   |
| `identity`               | object   | No       | -         | Managed identity configuration                        |
| `notScopes`              | string[] | No       | -         | Scopes to exclude from policy evaluation              |
| `nonComplianceMessages`  | array    | No       | -         | Custom non-compliance messages                        |
| `apiVersion`             | string   | No       | latest    | Specific API version to use                           |
| `ignoreChanges`          | string[] | No       | -         | Properties to ignore during Terraform updates         |
| `enableValidation`       | boolean  | No       | true      | Enable schema validation                              |
| `enableMigrationAnalysis`| boolean  | No       | false     | Enable migration analysis between versions            |
| `enableTransformation`   | boolean  | No       | true      | Enable property transformation                        |

\*If `name` is not provided, the construct ID will be used as the assignment name.

## Supported API Versions

| Version    | Support Level | Release Date | Notes                               |
| ---------- | ------------- | ------------ | ----------------------------------- |
| 2022-06-01 | Active        | 2022-06-01   | Latest stable version (recommended) |

## Policy Assignment Concepts

### Scoping Levels

Policy assignments can be applied at different organizational levels:

#### Subscription Scope

```typescript
scope: "/subscriptions/00000000-0000-0000-0000-000000000000";
```

Applies to all resources in the subscription (unless excluded via notScopes)

#### Resource Group Scope

```typescript
scope:
  "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg";
```

Applies to all resources in the resource group

#### Resource Scope

```typescript
scope:
  "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg/providers/Microsoft.Storage/storageAccounts/mystorage";
```

Applies to a specific resource

### Enforcement Modes

- **Default**: Policy effect is enforced during resource creation/update (deny, modify, deployIfNotExists)
- **DoNotEnforce**: Policy is evaluated but the effect is not enforced (audit only mode)

Use DoNotEnforce to test policies without impacting resources, then switch to Default when ready.

### Identity Types

Managed identities are required for policy assignments that use deployIfNotExists or modify effects:

- **SystemAssigned**: Azure automatically creates and manages an identity for the assignment
- **UserAssigned**: You provide an existing managed identity
- **None**: No identity (use for audit and deny policies)

The identity needs appropriate RBAC permissions (typically Contributor or specific resource permissions) to perform remediation actions.

## Available Outputs

Policy Assignment constructs expose the following outputs:

- `id`: The Azure resource ID of the policy assignment
- `name`: The name of the policy assignment
- `resourceId`: Alias for the ID (for consistency with other constructs)
- `policyDefinitionId`: The ID of the assigned policy definition
- `assignmentScope`: The scope where the policy is assigned
- `enforcementMode`: The enforcement mode of the assignment

## Best Practices

1. **Start with DoNotEnforce Mode**

   - Test new assignments in audit mode first
   - Monitor compliance reports before enforcing
   - Gradually roll out enforcement after validation

2. **Use Descriptive Names**

   - Make assignment purpose clear from the name
   - Include scope information in display name
   - Document the assignment's intent

3. **Provide Non-Compliance Messages**

   - Help users understand why resources are non-compliant
   - Include remediation steps in messages
   - Be specific and actionable

4. **Scope Appropriately**

   - Apply policies at the right organizational level
   - Use subscription scope for organization-wide policies
   - Use resource group scope for environment-specific policies

5. **Use Parameters Effectively**

   - Reuse policy definitions with different parameter values
   - Provide appropriate defaults in policy definitions
   - Document parameter requirements

6. **Configure Identity Correctly**

   - Add managed identity for deployIfNotExists and modify policies
   - Grant minimum required permissions (least privilege)
   - Use user-assigned identities for shared remediation scenarios

7. **Monitor and Review**

   - Regularly review compliance reports
   - Address non-compliant resources
   - Update policies and assignments as requirements change

8. **Document Exclusions**
   - Clearly document why scopes are excluded
   - Regularly review exclusions for continued validity
   - Minimize the use of exclusions

## Examples

### Assign Tag Policy at Subscription Level

```typescript
const tagPolicy = new PolicyDefinition(this, "tag-policy", {
  name: "require-cost-center",
  policyRule: {
    if: {
      field: "tags['CostCenter']",
      exists: "false",
    },
    then: {
      effect: "deny",
    },
  },
});

const tagAssignment = new PolicyAssignment(this, "sub-tag-assignment", {
  name: "require-cost-center-sub",
  displayName: "Require CostCenter Tag on All Resources",
  description: "Denies resource creation without CostCenter tag",
  policyDefinitionId: tagPolicy.id,
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
  nonComplianceMessages: [
    {
      message:
        "Resources must have a CostCenter tag for billing purposes. Contact your team lead for the appropriate cost center code.",
    },
  ],
});
```

### Audit Mode Testing

```typescript
// Test a policy in audit mode before enforcing
const testAssignment = new PolicyAssignment(this, "test-assignment", {
  name: "test-location-policy",
  displayName: "Test Location Restriction (Audit Only)",
  description: "Testing location policy in audit mode",
  policyDefinitionId: locationPolicyId,
  scope: "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
  enforcementMode: "DoNotEnforce", // Audit only
  metadata: {
    testPhase: "audit",
    plannedEnforcement: "2024-02-01",
  },
});
```

### Remediation with Managed Identity

```typescript
const remediationPolicy = new PolicyDefinition(this, "deploy-backup", {
  name: "deploy-vm-backup",
  policyRule: {
    if: {
      field: "type",
      equals: "Microsoft.Compute/virtualMachines",
    },
    then: {
      effect: "deployIfNotExists",
      details: {
        type: "Microsoft.RecoveryServices/backupprotecteditems",
        deploymentScope: "subscription",
        // ... deployment template
      },
    },
  },
});

const remediationAssignment = new PolicyAssignment(
  this,
  "backup-assignment",
  {
    name: "deploy-vm-backup-assignment",
    displayName: "Deploy VM Backup Configuration",
    description:
      "Automatically deploys backup configuration for virtual machines",
    policyDefinitionId: remediationPolicy.id,
    scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
    identity: {
      type: "SystemAssigned",
    },
  },
);

// Note: You would also need to create a role assignment to grant
// the managed identity permissions to deploy backup configurations
```

### Multiple Assignments for Different Environments

```typescript
const environments = ["dev", "staging", "prod"];

environments.forEach((env) => {
  const rgScope = `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/${env}-rg`;

  new PolicyAssignment(this, `${env}-assignment`, {
    name: `require-tags-${env}`,
    displayName: `Require Tags in ${env.toUpperCase()} Environment`,
    policyDefinitionId: tagPolicyId,
    scope: rgScope,
    parameters: {
      environmentTag: {
        value: env,
      },
    },
    metadata: {
      environment: env,
      assignedBy: "terraform-cdk",
    },
  });
});
```

## Relationship with Policy Definitions

Policy Assignments apply Policy Definitions to specific scopes. The typical workflow is:

1. **Create or Reference a Policy Definition**: Define the rules and conditions
2. **Create a Policy Assignment**: Apply the definition to a scope with specific parameters
3. **Monitor Compliance**: Review compliance reports and take remediation actions

```typescript
// Step 1: Create a policy definition
const policyDef = new PolicyDefinition(this, "policy", {
  name: "my-policy",
  policyRule: {
    /* ... */
  },
});

// Step 2: Assign the policy to a scope
const assignment = new PolicyAssignment(this, "assignment", {
  name: "my-assignment",
  policyDefinitionId: policyDef.id,
  scope: "/subscriptions/...",
});

// Step 3: Monitor compliance via Azure Portal or API
```

## Related Constructs

- **Policy Definitions**: Define the rules and effects to enforce
- **Role Assignments**: Grant permissions for managed identities to perform remediation
- **Resource Groups**: Common scope for policy assignments
- **Management Groups**: Higher-level scope for organization-wide policies

## Troubleshooting

### Common Issues

1. **Policy Not Taking Effect**

   - Allow time for policy evaluation (15-30 minutes)
   - Check enforcement mode (DoNotEnforce vs Default)
   - Verify scope is correct
   - Check for exclusions in notScopes

2. **Remediation Failures**

   - Verify managed identity is configured
   - Check RBAC permissions for the identity
   - Review deployment template in policy definition
   - Check Azure Activity Log for detailed errors

3. **Compliance Not Showing**

   - Wait for compliance evaluation cycle
   - Trigger manual compliance scan
   - Verify assignment is deployed successfully
   - Check assignment scope matches resources

4. **Parameter Errors**
   - Ensure parameter types match policy definition
   - Check parameter names are correct
   - Verify values are in allowed ranges
   - Review parameter schema in policy definition

## Contributing

Contributions are welcome! Please refer to the main project's contributing guidelines.

## License

This project is licensed under the MIT License - see the LICENSE file for details.