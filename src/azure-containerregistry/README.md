# Azure Container Registry Module

This module provides a unified, version-aware Azure Container Registry construct using the AZAPI provider for direct Azure REST API access.

## Features

- **Automatic Version Management** - Uses latest API version by default
- **Version Pinning** - Pin to a specific API version for stability
- **Schema Validation** - Properties validated against API schemas
- **SKU Tiers** - Basic, Standard, and Premium with tier-specific features
- **Network Security** - Network rule sets, public access control, trusted service bypass (Premium)
- **Encryption** - Customer-managed key (CMK) encryption support (Premium)
- **Zone Redundancy** - High availability across availability zones (Premium)
- **Policy Support** - Retention, trust, export, and soft delete policies
- **Managed Identity** - SystemAssigned, UserAssigned, or both
- **Multi-Language Support** - Full JSII compliance for TypeScript, Python, Java, and .NET

## Supported API Versions

| API Version | Status | Description |
|-------------|--------|-------------|
| 2025-04-01 | ✅ Active, Latest | Latest version with improved features |
| 2023-07-01 | Maintenance | Stable release with policy and encryption support |

## Basic Usage

```typescript
import { ContainerRegistry } from "@microsoft/terraform-cdk-constructs";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";

// Create a resource group first
const resourceGroup = new ResourceGroup(this, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

// Create a container registry with automatic version resolution
const registry = new ContainerRegistry(this, "acr", {
  name: "mycontainerregistry",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  tags: {
    environment: "production",
    project: "myapp",
  },
});
```

## Advanced Usage

### Version Pinning

```typescript
const registry = new ContainerRegistry(this, "acr", {
  name: "mycontainerregistry",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  apiVersion: "2023-07-01", // Pin to specific version
});
```

### Premium Registry with Security Features

```typescript
const registry = new ContainerRegistry(this, "acr", {
  name: "mycontainerregistry",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Premium" },
  publicNetworkAccess: "Disabled",
  zoneRedundancy: "Enabled",
  dataEndpointEnabled: true,
  networkRuleBypassOptions: "AzureServices",
  networkRuleSet: {
    defaultAction: "Deny",
    ipRules: [{ value: "10.0.0.0/24", action: "Allow" }],
  },
  identity: {
    type: "SystemAssigned",
  },
  tags: {
    environment: "production",
  },
});
```

### Registry with Policies

```typescript
const registry = new ContainerRegistry(this, "acr", {
  name: "mycontainerregistry",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Premium" },
  policies: {
    retentionPolicy: {
      days: 30,
      status: "enabled",
    },
    trustPolicy: {
      type: "Notary",
      status: "enabled",
    },
    exportPolicy: {
      status: "enabled",
    },
    softDeletePolicy: {
      retentionDays: 14,
      status: "enabled",
    },
  },
});
```

### Registry with Customer-Managed Key Encryption

```typescript
const registry = new ContainerRegistry(this, "acr", {
  name: "mycontainerregistry",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Premium" },
  encryption: {
    status: "enabled",
    keyVaultProperties: {
      identity: userAssignedIdentity.clientId,
      keyIdentifier: "https://myvault.vault.azure.net/keys/mykey/version",
    },
  },
  identity: {
    type: "UserAssigned",
    userAssignedIdentities: {
      [userAssignedIdentity.id]: {},
    },
  },
});
```

### With Managed Identity

```typescript
const registry = new ContainerRegistry(this, "acr", {
  name: "mycontainerregistry",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard" },
  identity: {
    type: "SystemAssigned",
  },
});
```

## Properties

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Registry name (5-50 alphanumeric characters, globally unique) |
| `location` | string | Azure region |
| `sku` | object | SKU configuration with `name` property (Basic, Standard, or Premium) |

### Optional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `resourceGroupId` | string | - | Parent resource group ID |
| `apiVersion` | string | Latest | API version to use |
| `adminUserEnabled` | boolean | false | Enable admin user authentication |
| `publicNetworkAccess` | string | "Enabled" | Public network access (Enabled/Disabled) |
| `networkRuleSet` | object | - | Network rule set configuration (Premium only) |
| `encryption` | object | - | Customer-managed key encryption (Premium only) |
| `policies` | object | - | Registry policies (retention, trust, export, soft delete) |
| `identity` | object | - | Managed identity configuration |
| `zoneRedundancy` | string | "Disabled" | Zone redundancy (Premium only) |
| `dataEndpointEnabled` | boolean | false | Dedicated data endpoint (Premium only) |
| `anonymousPullEnabled` | boolean | false | Anonymous pull access (Standard/Premium only) |
| `networkRuleBypassOptions` | string | "AzureServices" | Trusted service bypass |
| `tags` | object | {} | Resource tags |
| `ignoreChanges` | string[] | - | Properties to ignore during updates |

## SKU Tiers

| Feature | Basic | Standard | Premium |
|---------|-------|----------|---------|
| Storage | 10 GiB | 100 GiB | 500 GiB |
| Network Rules | ❌ | ❌ | ✅ |
| Zone Redundancy | ❌ | ❌ | ✅ |
| Encryption (CMK) | ❌ | ❌ | ✅ |
| Data Endpoint | ❌ | ❌ | ✅ |
| Content Trust | ❌ | ❌ | ✅ |
| Anonymous Pull | ❌ | ✅ | ✅ |
| Geo-Replication | ❌ | ❌ | ✅ |

## Outputs

The ContainerRegistry construct provides the following outputs:

- `idOutput` - The resource ID
- `nameOutput` - The container registry name
- `locationOutput` - The Azure region
- `tagsOutput` - The resource tags
- `loginServerOutput` - The login server URL (e.g., myregistry.azurecr.io)

## Methods

- `loginServer` - Get the login server URL
- `addTag(key, value)` - Add a tag to the container registry
- `removeTag(key)` - Remove a tag from the container registry
