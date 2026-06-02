# Azure Function App Module

This module provides a unified, version-aware Azure Function App construct using the AZAPI provider for direct Azure REST API access.

## Features

- **Automatic Version Management** - Uses latest API version by default
- **Version Pinning** - Pin to a specific API version for stability
- **Schema Validation** - Properties validated against API schemas
- **Flex Consumption Support** - First-class support for Flex Consumption (FC1) plans with `functionAppConfig`
- **Runtime Support** - Node.js, Python, .NET, Java, and PowerShell runtimes
- **Linux & Windows** - Support for both Linux and Windows Function Apps
- **Site Configuration** - Full control over app settings, runtime stack, and CORS
- **Managed Identity** - SystemAssigned, UserAssigned, or both
- **Network Security** - Public network access control and VNet integration
- **HTTPS Only** - Enforce HTTPS-only traffic by default
- **Multi-Language Support** - Full JSII compliance for TypeScript, Python, Java, and .NET

## Supported API Versions

| API Version | Status | Description |
|-------------|--------|-------------|
| 2024-11-01 | ✅ Active, Latest | Latest version with improved features |
| 2024-04-01 | Maintenance | Stable release with Function App support |

## Basic Usage

```typescript
import { FunctionApp } from "@microsoft/terraform-cdk-constructs";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";

// Create a resource group first
const resourceGroup = new ResourceGroup(this, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

// Create a Function App with automatic version resolution
const functionApp = new FunctionApp(this, "func", {
  name: "my-function-app",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  serverFarmId: appServicePlan.id,
  kind: "functionapp,linux",
  siteConfig: {
    appSettings: [
      { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
      { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
      { name: "AzureWebJobsStorage", value: storageConnectionString },
    ],
    linuxFxVersion: "NODE|20",
  },
  tags: {
    environment: "production",
    project: "myapp",
  },
});
```

## Advanced Usage

### Version Pinning

```typescript
const functionApp = new FunctionApp(this, "func", {
  name: "my-function-app",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  serverFarmId: appServicePlan.id,
  apiVersion: "2024-04-01", // Pin to specific version
});
```

### Function App with Managed Identity

```typescript
const functionApp = new FunctionApp(this, "func", {
  name: "my-function-app",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  serverFarmId: appServicePlan.id,
  kind: "functionapp,linux",
  identity: {
    type: "SystemAssigned",
  },
  httpsOnly: true,
  siteConfig: {
    alwaysOn: true,
    minTlsVersion: "1.2",
    http20Enabled: true,
  },
  tags: {
    environment: "production",
  },
});
```

### Python Function App

```typescript
const functionApp = new FunctionApp(this, "func", {
  name: "my-python-function",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  serverFarmId: appServicePlan.id,
  kind: "functionapp,linux",
  siteConfig: {
    appSettings: [
      { name: "FUNCTIONS_WORKER_RUNTIME", value: "python" },
      { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
      { name: "AzureWebJobsStorage", value: storageConnectionString },
    ],
    linuxFxVersion: "PYTHON|3.11",
    alwaysOn: true,
  },
});
```

### Function App with CORS Configuration

```typescript
const functionApp = new FunctionApp(this, "func", {
  name: "my-function-app",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  serverFarmId: appServicePlan.id,
  kind: "functionapp,linux",
  siteConfig: {
    cors: {
      allowedOrigins: ["https://example.com", "https://app.example.com"],
      supportCredentials: true,
    },
    appSettings: [
      { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
      { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
    ],
  },
});
```

### Function App with VNet Integration

```typescript
const functionApp = new FunctionApp(this, "func", {
  name: "my-function-app",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  serverFarmId: appServicePlan.id,
  kind: "functionapp,linux",
  publicNetworkAccess: "Disabled",
  virtualNetworkSubnetId: subnet.id,
  siteConfig: {
    appSettings: [
      { name: "FUNCTIONS_WORKER_RUNTIME", value: "dotnet-isolated" },
      { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
    ],
  },
});
```

### With Client Certificate Authentication

```typescript
const functionApp = new FunctionApp(this, "func", {
  name: "my-function-app",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  serverFarmId: appServicePlan.id,
  clientCertEnabled: true,
  clientCertMode: "Required",
  httpsOnly: true,
});
```

### Flex Consumption Plan (No VM Quota Required)

```typescript
// Flex Consumption plans use FC1 SKU and don't require traditional VM quota
const functionApp = new FunctionApp(this, "func", {
  name: "my-flex-function",
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
  serverFarmId: flexConsumptionPlan.id,
  kind: "functionapp,linux",
  httpsOnly: true,
  siteConfig: {},
  functionAppConfig: {
    deployment: {
      storage: {
        type: "blobContainer",
        value: "https://mystorage.blob.core.windows.net/deployments",
        authentication: {
          type: "SystemAssignedIdentity",
        },
      },
    },
    runtime: {
      name: "node",
      version: "20",
    },
    scaleAndConcurrency: {
      maximumInstanceCount: 100,
      instanceMemoryMB: 2048,
    },
  },
  identity: {
    type: "SystemAssigned",
  },
});
```

## Properties

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Function App name (globally unique) |
| `location` | string | Azure region |
| `serverFarmId` | string | Resource ID of the App Service Plan |

### Optional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `resourceGroupId` | string | - | Parent resource group ID |
| `apiVersion` | string | Latest | API version to use |
| `kind` | string | "functionapp" | Function App kind (functionapp, functionapp,linux) |
| `httpsOnly` | boolean | true | Enforce HTTPS-only traffic |
| `clientAffinityEnabled` | boolean | false | Enable client session affinity |
| `enabled` | boolean | true | Whether the Function App is enabled |
| `siteConfig` | object | - | Site configuration (app settings, runtime, CORS) |
| `identity` | object | - | Managed identity configuration |
| `publicNetworkAccess` | string | "Enabled" | Public network access (Enabled/Disabled) |
| `virtualNetworkSubnetId` | string | - | Subnet resource ID for VNet integration |
| `clientCertEnabled` | boolean | false | Enable client certificate authentication |
| `clientCertMode` | string | - | Client certificate mode (Required, Optional) |
| `functionAppConfig` | object | - | Flex Consumption config (deployment, runtime, scaling) |
| `tags` | object | {} | Resource tags |
| `ignoreChanges` | string[] | - | Properties to ignore during updates |

## Outputs

The FunctionApp construct provides the following outputs:

- `idOutput` - The resource ID
- `nameOutput` - The Function App name
- `locationOutput` - The Azure region
- `tagsOutput` - The resource tags
- `defaultHostNameOutput` - The default hostname (e.g., myfunction.azurewebsites.net)

## Methods

- `defaultHostName` - Get the default hostname URL
- `addTag(key, value)` - Add a tag to the Function App
- `removeTag(key)` - Remove a tag from the Function App
