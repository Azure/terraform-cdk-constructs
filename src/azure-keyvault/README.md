# Azure Key Vault Module

This module provides unified, version-aware Azure Key Vault constructs using the AZAPI provider.

## Features

- **Automatic Version Management**: Defaults to the latest stable API version (2024-11-01)
- **Version Pinning**: Explicitly specify API versions for stability
- **Schema Validation**: Automatic validation of properties against API schemas
- **Multi-Language Support**: Full JSII compliance for TypeScript, Python, Java, and .NET
- **Type Safety**: Complete TypeScript type definitions

## Supported API Versions

- `2023-02-01` - Stable release
- `2023-07-01` - Enhanced security features
- `2024-11-01` - Latest (default)

## Basic Usage

```typescript
import { KeyVault } from '@microsoft/terraform-cdk-constructs/azure-keyvault';
import { ResourceGroup } from '@microsoft/terraform-cdk-constructs/azure-resourcegroup';

// Create a resource group first
const resourceGroup = new ResourceGroup(this, 'rg', {
  name: 'my-resource-group',
  location: 'eastus',
});

// Create a Key Vault. The current tenant is automatically resolved
// from the AZAPI client configuration when tenantId is not specified.
const keyVault = new KeyVault(this, 'kv', {
  name: 'my-keyvault-1234',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  tags: {
    environment: 'production',
    project: 'myapp',
  },
});
```

## Advanced Usage

### Version Pinning

```typescript
const keyVault = new KeyVault(this, 'kv', {
  name: 'my-keyvault-1234',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  apiVersion: '2023-07-01', // Pin to specific version
});
```

### Premium SKU with Purge Protection

```typescript
const keyVault = new KeyVault(this, 'kv', {
  name: 'my-keyvault-1234',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  sku: { name: 'premium' },
  enablePurgeProtection: true,
  softDeleteRetentionInDays: 90,
});
```

### Network Hardening

```typescript
const keyVault = new KeyVault(this, 'kv', {
  name: 'my-keyvault-1234',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  publicNetworkAccess: 'Disabled',
  networkAcls: {
    defaultAction: 'Deny',
    bypass: 'AzureServices',
    ipRules: [
      { value: '1.2.3.4' },
    ],
    virtualNetworkRules: [
      { id: subnet.id },
    ],
  },
});
```

### RBAC Authorization (default) vs Access Policies

By default `enableRbacAuthorization` is `true`. Grant data plane access via
role assignments. To use legacy access policies, disable RBAC authorization
and pass an `accessPolicies` array:

```typescript
const keyVault = new KeyVault(this, 'kv', {
  name: 'my-keyvault-1234',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  enableRbacAuthorization: false,
  accessPolicies: [
    {
      tenantId: '00000000-0000-0000-0000-000000000000',
      objectId: '11111111-1111-1111-1111-111111111111',
      permissions: {
        secrets: ['get', 'list'],
      },
    },
  ],
});
```

## Properties

### Required Properties

- `name` - Key Vault name (3-24 alphanumeric characters or hyphens, globally unique, must start with a letter and end with a letter or digit)
- `location` - Azure region

### Optional Properties

- `apiVersion` - API version to use (defaults to latest)
- `resourceGroupId` - Resource group ID where the Key Vault will be created
- `tenantId` - Azure AD tenant ID (defaults to current AZAPI client tenant)
- `sku` - SKU configuration (default: `{ name: 'standard', family: 'A' }`)
- `accessPolicies` - Array of access policies (only used when `enableRbacAuthorization` is false)
- `networkAcls` - Network ACL configuration
- `enabledForDeployment` - Allow VMs to retrieve certificates (default: false)
- `enabledForDiskEncryption` - Allow Azure Disk Encryption to retrieve secrets (default: false)
- `enabledForTemplateDeployment` - Allow Azure Resource Manager to retrieve secrets (default: false)
- `enableRbacAuthorization` - Use Azure RBAC instead of access policies (default: true)
- `enableSoftDelete` - Enable soft-delete (default: true)
- `softDeleteRetentionInDays` - Soft-delete retention in days, 7-90 (default: 90)
- `enablePurgeProtection` - Enable purge protection (cannot be disabled once enabled)
- `publicNetworkAccess` - `Enabled` or `Disabled` (default: `Enabled`)
- `tags` - Resource tags
- `ignoreChanges` - Properties to ignore during updates

## Outputs

The KeyVault construct provides the following outputs:

- `id` - The resource ID
- `name` - The Key Vault name
- `location` - The Key Vault location
- `tags` - The Key Vault tags
- `vaultUri` - The data plane URI of the Key Vault

## Methods

- `addTag(key, value)` - Add a tag to the Key Vault
- `removeTag(key)` - Remove a tag from the Key Vault

## Architecture

This module uses the AzapiResource framework to provide:

1. **Single Implementation**: One class handles all API versions
2. **Schema-Driven**: TypeScript schemas define version-specific properties
3. **Automatic Validation**: Properties validated against API schemas
4. **Version Resolution**: Automatic latest version detection
5. **JSII Compliance**: Full multi-language support
