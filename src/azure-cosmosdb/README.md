# Azure Cosmos DB Module

This module provides unified, version-aware Azure Cosmos DB Account constructs using the VersionedAzapiResource framework.

## Features

- **Automatic Version Management**: Defaults to the latest stable API version (2024-08-15)
- **Version Pinning**: Explicitly specify API versions for stability
- **Schema Validation**: Automatic validation of properties against API schemas
- **Multi-Language Support**: Full JSII compliance for TypeScript, Python, Java, and .NET
- **Type Safety**: Complete TypeScript type definitions

## Supported API Versions

- `2023-11-15` - Stable release (deprecated)
- `2024-05-15` - Active
- `2024-08-15` - Latest (default)

## Basic Usage

```typescript
import { CosmosDbAccount } from '@cdktf/tf-constructs-azure/azure-cosmosdb';
import { ResourceGroup } from '@cdktf/tf-constructs-azure/azure-resourcegroup';

// Create a resource group first
const resourceGroup = new ResourceGroup(this, 'rg', {
  name: 'my-resource-group',
  location: 'eastus',
});

// Create a Cosmos DB account with automatic version resolution
const cosmos = new CosmosDbAccount(this, 'cosmos', {
  name: 'mycosmosaccount',
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
const cosmos = new CosmosDbAccount(this, 'cosmos', {
  name: 'mycosmosaccount',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  apiVersion: '2024-05-15', // Pin to specific version
});
```

### Serverless Cosmos DB

```typescript
const cosmos = new CosmosDbAccount(this, 'cosmos', {
  name: 'mycosmosaccount',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  capabilities: [{ name: 'EnableServerless' }],
});
```

### MongoDB API

```typescript
const cosmos = new CosmosDbAccount(this, 'cosmos', {
  name: 'mycosmosmongo',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  kind: 'MongoDB',
  capabilities: [{ name: 'EnableMongo' }],
});
```

### Multi-Region with Automatic Failover

```typescript
const cosmos = new CosmosDbAccount(this, 'cosmos', {
  name: 'mycosmosaccount',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  enableAutomaticFailover: true,
  geoLocations: [
    { locationName: 'eastus', failoverPriority: 0, isZoneRedundant: true },
    { locationName: 'westus', failoverPriority: 1, isZoneRedundant: false },
  ],
});
```

### Strong Consistency

```typescript
const cosmos = new CosmosDbAccount(this, 'cosmos', {
  name: 'mycosmosaccount',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  consistencyPolicy: {
    defaultConsistencyLevel: 'Strong',
  },
});
```

### Bounded Staleness Consistency

```typescript
const cosmos = new CosmosDbAccount(this, 'cosmos', {
  name: 'mycosmosaccount',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  consistencyPolicy: {
    defaultConsistencyLevel: 'BoundedStaleness',
    maxIntervalInSeconds: 86400,
    maxStalenessPrefix: 1000000,
  },
});
```

### With Managed Identity

```typescript
const cosmos = new CosmosDbAccount(this, 'cosmos', {
  name: 'mycosmosaccount',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  identity: {
    type: 'SystemAssigned',
  },
});
```

### Continuous Backup

```typescript
const cosmos = new CosmosDbAccount(this, 'cosmos', {
  name: 'mycosmosaccount',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  backupPolicy: {
    type: 'Continuous',
    continuousModeProperties: {
      tier: 'Continuous7Days',
    },
  },
});
```

### Network Restrictions

```typescript
const cosmos = new CosmosDbAccount(this, 'cosmos', {
  name: 'mycosmosaccount',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  publicNetworkAccess: 'Disabled',
  isVirtualNetworkFilterEnabled: true,
});
```

## Properties

### Required Properties

- `name` - Cosmos DB account name (3-44 lowercase alphanumeric/hyphen characters, globally unique)
- `location` - Azure region
- `resourceGroupId` - Resource group ID where the Cosmos DB account will be created

### Optional Properties

- `apiVersion` - API version to use (defaults to latest)
- `kind` - Account kind: `GlobalDocumentDB` (default), `MongoDB`, or `Parse`
- `databaseAccountOfferType` - Offer type (default: `Standard`)
- `consistencyPolicy` - Consistency policy (default: Session)
- `geoLocations` - Geo-replication locations (defaults to a single location matching `location`)
- `capabilities` - Capabilities such as `EnableServerless`, `EnableMongo`, `EnableCassandra`, `EnableTable`, `EnableGremlin`
- `publicNetworkAccess` - `Enabled` (default) or `Disabled`
- `enableAutomaticFailover` - Enable automatic failover (default: false)
- `enableMultipleWriteLocations` - Enable multi-region writes (default: false)
- `enableFreeTier` - Enable free tier (default: false; only one per subscription)
- `isVirtualNetworkFilterEnabled` - Enable VNet filtering (default: false)
- `minimalTlsVersion` - Minimum TLS version (default: `Tls12`)
- `backupPolicy` - Backup policy (`Periodic` or `Continuous`)
- `identity` - Managed identity configuration
- `tags` - Resource tags
- `ignoreChanges` - Properties to ignore during updates

## Account Kinds

- `GlobalDocumentDB` - SQL (Core) API account (default)
- `MongoDB` - MongoDB API account
- `Parse` - Parse API account

## Common Capabilities

- `EnableServerless` - Provision the account in serverless mode
- `EnableCassandra` - Cassandra API
- `EnableTable` - Table API
- `EnableGremlin` - Gremlin (Graph) API
- `EnableMongo` - MongoDB API
- `EnableAggregationPipeline` - Aggregation pipeline support

## Consistency Levels

- `Eventual`
- `ConsistentPrefix`
- `Session` (default)
- `BoundedStaleness`
- `Strong`

## Outputs

The CosmosDbAccount construct provides the following outputs:

- `id` - The resource ID
- `name` - The Cosmos DB account name
- `location` - The Cosmos DB account location
- `tags` - The Cosmos DB account tags
- `documentEndpoint` - The document endpoint URL of the Cosmos DB account

## Methods

- `addTag(key, value)` - Add a tag to the Cosmos DB account
- `removeTag(key)` - Remove a tag from the Cosmos DB account

## Architecture

This module uses the VersionedAzapiResource framework to provide:

1. **Single Implementation**: One class handles all API versions
2. **Schema-Driven**: TypeScript schemas define version-specific properties
3. **Automatic Validation**: Properties validated against API schemas
4. **Version Resolution**: Automatic latest version detection
5. **JSII Compliance**: Full multi-language support
