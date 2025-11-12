# Azure Storage Account Module

This module provides unified, version-aware Azure Storage Account constructs using the VersionedAzapiResource framework.

## Features

- **Automatic Version Management**: Defaults to the latest stable API version (2024-01-01)
- **Version Pinning**: Explicitly specify API versions for stability
- **Schema Validation**: Automatic validation of properties against API schemas
- **Multi-Language Support**: Full JSII compliance for TypeScript, Python, Java, and .NET
- **Type Safety**: Complete TypeScript type definitions

## Supported API Versions

- `2023-01-01` - Stable release
- `2023-05-01` - Enhanced security features
- `2024-01-01` - Latest (default)

## Basic Usage

```typescript
import { StorageAccount } from '@cdktf/tf-constructs-azure/azure-storageaccount';
import { ResourceGroup } from '@cdktf/tf-constructs-azure/azure-resourcegroup';

// Create a resource group first
const resourceGroup = new ResourceGroup(this, 'rg', {
  name: 'my-resource-group',
  location: 'eastus',
});

// Create a storage account with automatic version resolution
const storageAccount = new StorageAccount(this, 'storage', {
  name: 'mystorageaccount',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  sku: { name: 'Standard_LRS' },
  tags: {
    environment: 'production',
    project: 'myapp',
  },
});
```

## Advanced Usage

### Version Pinning

```typescript
const storageAccount = new StorageAccount(this, 'storage', {
  name: 'mystorageaccount',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  sku: { name: 'Standard_LRS' },
  apiVersion: '2023-05-01', // Pin to specific version
});
```

### Security Configuration

```typescript
const storageAccount = new StorageAccount(this, 'storage', {
  name: 'mystorageaccount',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  sku: { name: 'Standard_LRS' },
  enableHttpsTrafficOnly: true,
  minimumTlsVersion: 'TLS1_2',
  allowBlobPublicAccess: false,
  networkAcls: {
    defaultAction: 'Deny',
    bypass: 'AzureServices',
    ipRules: [
      { value: '1.2.3.4' },
    ],
  },
});
```

### With Managed Identity

```typescript
const storageAccount = new StorageAccount(this, 'storage', {
  name: 'mystorageaccount',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  sku: { name: 'Standard_LRS' },
  identity: {
    type: 'SystemAssigned',
  },
});
```

### Premium Storage

```typescript
const storageAccount = new StorageAccount(this, 'storage', {
  name: 'mystorageaccount',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  sku: { name: 'Premium_LRS' },
  kind: 'BlockBlobStorage',
});
```

## Properties

### Required Properties

- `name` - Storage account name (3-24 lowercase alphanumeric characters, globally unique)
- `location` - Azure region
- `resourceGroupId` - Resource group ID where the storage account will be created
- `sku` - SKU configuration with `name` property

### Optional Properties

- `apiVersion` - API version to use (defaults to latest)
- `kind` - Storage account kind (default: 'StorageV2')
- `accessTier` - Access tier for blob storage (default: 'Hot')
- `enableHttpsTrafficOnly` - Allow only HTTPS traffic (default: true)
- `minimumTlsVersion` - Minimum TLS version (default: 'TLS1_2')
- `allowBlobPublicAccess` - Allow public blob access (default: false)
- `networkAcls` - Network ACL configuration
- `identity` - Managed identity configuration
- `encryption` - Encryption settings
- `tags` - Resource tags
- `ignoreChanges` - Properties to ignore during updates

## SKU Names

- `Standard_LRS` - Locally redundant storage
- `Standard_GRS` - Geo-redundant storage
- `Standard_RAGRS` - Read-access geo-redundant storage
- `Standard_ZRS` - Zone-redundant storage
- `Premium_LRS` - Premium locally redundant storage
- `Premium_ZRS` - Premium zone-redundant storage

## Storage Account Kinds

- `StorageV2` - General-purpose v2 (recommended)
- `Storage` - General-purpose v1
- `BlobStorage` - Blob-only storage
- `BlockBlobStorage` - Premium block blob storage
- `FileStorage` - Premium file storage

## Outputs

The StorageAccount construct provides the following outputs:

- `id` - The resource ID
- `name` - The storage account name
- `location` - The storage account location
- `tags` - The storage account tags
- `primaryBlobEndpoint` - Primary blob endpoint URL
- `primaryFileEndpoint` - Primary file endpoint URL
- `primaryQueueEndpoint` - Primary queue endpoint URL
- `primaryTableEndpoint` - Primary table endpoint URL

## Methods

- `addTag(key, value)` - Add a tag to the storage account
- `removeTag(key)` - Remove a tag from the storage account

## Architecture

This module uses the VersionedAzapiResource framework to provide:

1. **Single Implementation**: One class handles all API versions
2. **Schema-Driven**: TypeScript schemas define version-specific properties
3. **Automatic Validation**: Properties validated against API schemas
4. **Version Resolution**: Automatic latest version detection
5. **JSII Compliance**: Full multi-language support

## Migration from Version-Specific Classes

If you're migrating from version-specific storage account classes, simply:

1. Import from the unified module
2. Optionally specify `apiVersion` if you need version pinning
3. All other properties remain the same

```typescript
// Old approach (version-specific)
import { Group as StorageAccount } from './v2023-01-01';

// New approach (unified)
import { StorageAccount } from '@cdktf/tf-constructs-azure/azure-storageaccount';

// Optionally pin version for compatibility
const storage = new StorageAccount(this, 'storage', {
  apiVersion: '2023-01-01',
  // ... rest of props
});

## Monitoring

The Storage Account construct provides built-in monitoring capabilities through the `defaultMonitoring()` static method.

### Default Monitoring Configuration

```typescript
import { StorageAccount } from '@cdktf/azure-storageaccount';
import { ActionGroup } from '@cdktf/azure-actiongroup';
import { LogAnalyticsWorkspace } from '@cdktf/azure-loganalyticsworkspace';

const actionGroup = new ActionGroup(this, 'alerts', {
  // ... action group configuration
});

const workspace = new LogAnalyticsWorkspace(this, 'logs', {
  // ... workspace configuration
});

const storageAccount = new StorageAccount(this, 'storage', {
  name: 'mystorageaccount',
  location: 'eastus',
  resourceGroupName: resourceGroup.name,
  // ... other properties
  monitoring: StorageAccount.defaultMonitoring(
    actionGroup.id,
    workspace.id
  )
});
```

### Monitored Metrics

The default monitoring configuration includes:

1. **Availability Alert**
   - Metric: `Availability`
   - Threshold: 99.9% (default)
   - Severity: Error (1)
   - Triggers when storage account availability drops below threshold

2. **Egress Alert**
   - Metric: `Egress`
   - Threshold: 10GB per hour (default)
   - Severity: Warning (2)
   - Triggers when outbound data transfer exceeds threshold

3. **Transactions Alert**
   - Metric: `Transactions`
   - Threshold: 100,000 per 15 minutes (default)
   - Severity: Warning (2)
   - Triggers when transaction count exceeds threshold

4. **Deletion Alert**
   - Tracks storage account deletion via Activity Log
   - Severity: Informational

### Custom Monitoring Configuration

Customize thresholds and severities:

```typescript
const storageAccount = new StorageAccount(this, 'storage', {
  name: 'mystorageaccount',
  location: 'eastus',
  resourceGroupName: resourceGroup.name,
  monitoring: StorageAccount.defaultMonitoring(
    actionGroup.id,
    workspace.id,
    {
      availabilityThreshold: 99.5,           // Custom availability threshold
      egressThreshold: 5368709120,            // 5GB in bytes
      transactionsThreshold: 50000,           // 50k transactions
      availabilityAlertSeverity: 0,           // Critical
      enableEgressAlert: false,               // Disable egress monitoring
    }
  )
});
```

### Monitoring Options

All available options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `availabilityThreshold` | number | 99.9 | Availability percentage threshold |
| `egressThreshold` | number | 10737418240 | Egress bytes threshold (10GB) |
| `transactionsThreshold` | number | 100000 | Transaction count threshold |
| `enableAvailabilityAlert` | boolean | true | Enable/disable availability alert |
| `enableEgressAlert` | boolean | true | Enable/disable egress alert |
| `enableTransactionsAlert` | boolean | true | Enable/disable transactions alert |
| `enableDeletionAlert` | boolean | true | Enable/disable deletion tracking |
| `availabilityAlertSeverity` | 0\|1\|2\|3\|4 | 1 | Availability alert severity (0=Critical, 4=Verbose) |
| `egressAlertSeverity` | 0\|1\|2\|3\|4 | 2 | Egress alert severity |
| `transactionsAlertSeverity` | 0\|1\|2\|3\|4 | 2 | Transactions alert severity |