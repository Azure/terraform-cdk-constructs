# Migration Guide: AzureRM to AZAPI Provider

This guide helps you migrate from version 0.x (AzureRM provider) to version 1.0.0 (AZAPI provider) of the `@microsoft/terraform-cdk-constructs` package.

## Overview

Version 1.0.0 represents a major breaking change migration from the AzureRM provider to the AZAPI provider. This change provides:

- **Direct Azure REST API Access**: No dependency on AzureRM provider limitations
- **Immediate Feature Access**: Get new Azure features as soon as they're available in Azure REST APIs
- **Version-Specific Implementations**: Support for multiple Azure API versions
- **Enhanced Type Safety**: Better IDE support and compile-time validation
- **Reduced Package Size**: Eliminated dependency on large AzureRM provider packages

## Breaking Changes

### 1. Services Removed

The following services have been **completely removed** in v1.0.0 as they were AzureRM-dependent:

- `azure-actiongroup`
- `azure-functionapp`
- `azure-keyvault`
- `azure-kubernetes`
- `azure-kusto`
- `azure-loganalytics`
- `azure-metricalert`
- `azure-networksecuritygroup`
- `azure-queryrulealert`
- `azure-storageaccount`
- `azure-virtualmachine`
- `azure-virtualmachinescaleset`
- `azure-virtualnetwork`

### 2. Resource Groups Migration

**Before (v0.x - AzureRM):**
```typescript
import { AzureResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";

const resourceGroup = new AzureResourceGroup(this, 'myResourceGroup', {
  location: 'West US', // Was optional
  name: 'myResourceGroup',
  tags: {
    env: 'production',
  },
});
```

**After (v1.0.0 - AZAPI):**
```typescript
import { Group } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";

const resourceGroup = new Group(this, 'myResourceGroup', {
  location: 'eastus', // Now required
  name: 'rg-myapp-prod',
  tags: {
    environment: 'production',
    project: 'myapp'
  },
});
```

### 3. Import Changes

**Before:**
```typescript
import { AzureResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { AzureKeyVault } from "@microsoft/terraform-cdk-constructs/azure-keyvault";
import { AzureStorageAccount } from "@microsoft/terraform-cdk-constructs/azure-storageaccount";
```

**After:**
```typescript
// Only Resource Groups are available in v1.0.0
import { Group } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";

// Or use version-specific imports
import { Group } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup/v2024_11_01";
```

### 4. Dependencies Update

**Before (package.json):**
```json
{
  "dependencies": {
    "@microsoft/terraform-cdk-constructs": "^0.x.x",
    "@cdktf/provider-azurerm": "9.0.8"
  }
}
```

**After (package.json):**
```json
{
  "dependencies": {
    "@microsoft/terraform-cdk-constructs": "^1.0.0"
  }
}
```

Note: The AzureRM provider dependency is no longer required as AZAPI provider classes are built into the package.

## Migration Steps

### Step 1: Audit Current Usage

1. **Identify used services**: List all services from this package you're currently using
2. **Resource Group migration**: Identify Resource Group usages that can be migrated
3. **Alternative planning**: Plan alternatives for removed services

### Step 2: Plan Service Replacements

For removed services, consider these alternatives:

#### Option A: Direct AZAPI Usage
Use the built-in AZAPI provider classes for any Azure resource:

```typescript
import { AzapiResource } from "@microsoft/terraform-cdk-constructs/core-azure";

const storageAccount = new AzapiResource(this, 'storageAccount', {
  type: 'Microsoft.Storage/storageAccounts@2023-01-01',
  name: 'mystorageaccount',
  location: resourceGroup.location,
  parentId: resourceGroup.id,
  body: {
    sku: { name: 'Standard_LRS' },
    kind: 'StorageV2',
  },
});
```

#### Option B: Stay on v0.x
If you need the removed services, you can continue using v0.x until you implement alternatives.

#### Option C: Custom Constructs
Build your own AZAPI-based constructs for the services you need:

```typescript
import { AzapiResource } from "@microsoft/terraform-cdk-constructs/core-azure";
import { Construct } from "constructs";

export class MyStorageAccount extends AzapiResource {
  constructor(scope: Construct, id: string, props: MyStorageAccountProps) {
    super(scope, id, {
      type: 'Microsoft.Storage/storageAccounts@2023-01-01',
      name: props.name,
      location: props.location,
      parentId: props.resourceGroupId,
      body: {
        sku: { name: props.sku },
        kind: 'StorageV2',
      },
    });
  }
}
```

### Step 3: Update Resource Groups

1. **Update imports**: Change from `AzureResourceGroup` to `Group`
2. **Make location required**: Ensure all Resource Group definitions include `location`
3. **Update constructor calls**: Use new property names and structure
4. **Test builds**: Verify TypeScript compilation

### Step 4: Update Dependencies

1. **Update package.json**: Bump to v1.0.0
2. **Remove AzureRM**: Remove `@cdktf/provider-azurerm` dependency if only used for this package
3. **Install**: Run `npm install` or `yarn install`

### Step 5: Testing

1. **Compilation**: Ensure TypeScript compiles without errors
2. **Plan/Apply**: Test Terraform plan and apply in a development environment
3. **Functionality**: Verify Resource Groups work as expected

## Version-Specific API Usage

v1.0.0 supports version-specific Azure API implementations:

```typescript
// Use latest version (recommended)
import { Group } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";

// Use specific API version for fine control
import { Group } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup/v2024_11_01";
```

## Language Support

JSII automatically provides support for multiple languages:

- **TypeScript/JavaScript** ✅ Native support
- **Python** ✅ Available as `microsoft-cdktfconstructs`
- **Java** ✅ Available as `com.microsoft.terraformcdkconstructs:cdktf-azure-constructs`
- **C#/.NET** ✅ Available as `Microsoft.Cdktf.Azure.TFConstructs`

## Troubleshooting

### Common Issues

1. **Missing Services**: Use alternatives mentioned above
2. **Import Errors**: Update import statements to use new syntax
3. **Type Errors**: Ensure `location` is provided for Resource Groups
4. **Build Failures**: Check that AzureRM dependencies are properly removed

### Getting Help

- Review the [AZAPI Provider Implementation Guide](./azapi-provider-implementation.md)
- Check the [API Documentation](../API.md)
- Open an issue on [GitHub](https://github.com/azure/terraform-cdk-constructs)

## Example: Complete Migration

**Before (v0.x):**
```typescript
import { App, TerraformStack } from "cdktf";
import { AzureResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { AzureStorageAccount } from "@microsoft/terraform-cdk-constructs/azure-storageaccount";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const rg = new AzureResourceGroup(this, 'rg', {
      name: 'my-rg',
      // location was optional
    });

    const storage = new AzureStorageAccount(this, 'storage', {
      name: 'mystorage',
      resourceGroupName: rg.name,
      location: rg.location,
    });
  }
}
```

**After (v1.0.0):**
```typescript
import { App, TerraformStack } from "cdktf";
import { Group } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { AzapiResource } from "@microsoft/terraform-cdk-constructs/core-azure";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const rg = new Group(this, 'rg', {
      name: 'rg-myapp-prod',
      location: 'eastus', // Now required
      tags: {
        environment: 'production'
      }
    });

    // Custom storage account using AZAPI
    const storage = new AzapiResource(this, 'storage', {
      type: 'Microsoft.Storage/storageAccounts@2023-01-01',
      name: 'mystorageaccount',
      location: rg.location,
      parentId: rg.id,
      body: {
        sku: { name: 'Standard_LRS' },
        kind: 'StorageV2',
        properties: {
          allowBlobPublicAccess: false,
          supportsHttpsTrafficOnly: true,
        }
      },
    });
  }
}
```

This migration enables you to leverage the full power of Azure's REST APIs while maintaining type safety and CDK convenience.