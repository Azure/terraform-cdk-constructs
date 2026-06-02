# Azure Container Apps Module

This module provides unified, version-aware Azure Container App constructs using the AZAPI provider for direct Azure REST API access. Includes `ContainerAppEnvironment` (`Microsoft.App/managedEnvironments`) and `ContainerApp` (`Microsoft.App/containerApps`).

## Features

- **Automatic Version Management** - Uses latest API version by default
- **Version Pinning** - Pin to a specific API version for stability
- **Schema Validation** - Properties validated against API schemas
- **Ingress** - External/internal HTTP, HTTP/2, TCP with TLS, CORS, sticky sessions, IP restrictions
- **Dapr Integration** - Sidecar injection with health checks and observability
- **Auto-Scaling** - HTTP, TCP, custom KEDA, and Azure Queue scaling rules
- **Secrets Management** - Inline secrets and Azure Key Vault references
- **Managed Identity** - SystemAssigned, UserAssigned, or both
- **Workload Profiles** - Consumption, GeneralPurpose, MemoryOptimized, ComputeOptimized
- **VNet Injection** - Network isolation with internal-only load balancer option
- **Zone Redundancy** - High availability across availability zones
- **Peer Authentication** - Mutual TLS (mTLS) between apps (2025-07-01+)
- **Peer Traffic Encryption** - Encrypt traffic between apps (2025-07-01+)

## Supported API Versions

- `2024-03-01` - Stable release
- `2025-07-01` - Latest (default) — adds mTLS, peer traffic encryption, ingress configuration, public network access

## Basic Usage

### Container App Environment

```typescript
import { ContainerAppEnvironment } from "@microsoft/terraform-cdk-constructs";

const environment = new ContainerAppEnvironment(this, "env", {
  name: "my-container-env",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  appLogsConfiguration: {
    destination: "log-analytics",
    logAnalyticsConfiguration: {
      customerId: logAnalytics.workspaceId,
      sharedKey: logAnalytics.primarySharedKey,
    },
  },
});
```

### Container App

```typescript
import { ContainerApp } from "@microsoft/terraform-cdk-constructs";

const app = new ContainerApp(this, "app", {
  name: "my-web-app",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  environmentId: environment.id,
  template: {
    containers: [{
      name: "web",
      image: "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest",
      resources: { cpu: 0.25, memory: "0.5Gi" },
    }],
    scale: {
      minReplicas: 1,
      maxReplicas: 5,
    },
  },
  configuration: {
    ingress: {
      external: true,
      targetPort: 80,
    },
  },
});
```

## Advanced Usage

### VNet Injection with Zone Redundancy

```typescript
const environment = new ContainerAppEnvironment(this, "env", {
  name: "secure-env",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  vnetConfiguration: {
    infrastructureSubnetId: subnet.id,
    internal: true,
  },
  zoneRedundant: true,
  workloadProfiles: [
    { name: "Consumption", workloadProfileType: "Consumption" },
    {
      name: "My-GP-01",
      workloadProfileType: "GeneralPurpose",
      minimumCount: 3,
      maximumCount: 12,
    },
  ],
});
```

### Container App with Dapr

```typescript
const app = new ContainerApp(this, "app", {
  name: "my-dapr-app",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  environmentId: environment.id,
  template: {
    containers: [{
      name: "api",
      image: "myregistry.azurecr.io/myapi:latest",
      resources: { cpu: 0.5, memory: "1Gi" },
    }],
  },
  configuration: {
    ingress: { external: true, targetPort: 3000 },
    dapr: {
      enabled: true,
      appId: "my-api",
      appPort: 3000,
      appProtocol: "http",
    },
  },
});
```

### Container App with Managed Identity and Private Registry

```typescript
const app = new ContainerApp(this, "app", {
  name: "my-secure-app",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  environmentId: environment.id,
  identity: {
    type: "SystemAssigned,UserAssigned",
    userAssignedIdentities: {
      [myIdentity.id]: {},
    },
  },
  template: {
    containers: [{
      name: "web",
      image: "myregistry.azurecr.io/myapp:v2",
      resources: { cpu: 1.0, memory: "2Gi" },
      env: [
        { name: "DB_CONNECTION", secretRef: "db-conn" },
      ],
    }],
  },
  configuration: {
    ingress: { external: true, targetPort: 8080 },
    registries: [{
      server: "myregistry.azurecr.io",
      identity: myIdentity.id,
    }],
    secrets: [{
      name: "db-conn",
      keyVaultUrl: "https://myvault.vault.azure.net/secrets/db-connection",
      identity: "system",
    }],
  },
});
```

### Peer Authentication (mTLS) - API 2025-07-01

```typescript
const environment = new ContainerAppEnvironment(this, "env", {
  name: "mtls-env",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  peerAuthentication: {
    mtls: { enabled: true },
  },
  peerTrafficConfiguration: {
    encryption: { enabled: true },
  },
  publicNetworkAccess: "Disabled",
});
```

## Properties

### ContainerAppEnvironment

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes | Name of the environment |
| location | string | Yes | Azure region |
| resourceGroupId | string | No | Parent resource group |
| appLogsConfiguration | object | No | Log Analytics or Azure Monitor |
| vnetConfiguration | object | No | VNet injection settings |
| workloadProfiles | array | No | Compute profile configurations |
| zoneRedundant | boolean | No | Zone redundancy (default: false) |
| daprAIInstrumentationKey | string | No | App Insights key for Dapr |
| daprAIConnectionString | string | No | App Insights connection string |
| customDomainConfiguration | object | No | Custom DNS suffix and certificate |
| infrastructureResourceGroup | string | No | Platform-managed RG name |
| peerAuthentication | object | No | mTLS settings (2025-07-01+) |
| peerTrafficConfiguration | object | No | Traffic encryption (2025-07-01+) |
| ingressConfiguration | object | No | Environment ingress settings (2025-07-01+) |
| publicNetworkAccess | string | No | 'Enabled' or 'Disabled' (2025-07-01+) |

### ContainerApp

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes | Name of the container app |
| location | string | Yes | Azure region |
| environmentId | string | Yes | Environment resource ID |
| template | object | Yes | Container definitions, scale, volumes |
| resourceGroupId | string | No | Parent resource group |
| configuration | object | No | Ingress, Dapr, secrets, registries |
| identity | object | No | Managed identity configuration |
| workloadProfileName | string | No | Target workload profile |

## Outputs

### ContainerAppEnvironment

- `idOutput` - Resource ID
- `nameOutput` - Resource name
- `locationOutput` - Azure region
- `tagsOutput` - Resource tags
- `defaultDomainOutput` - Default domain name
- `staticIpOutput` - Static IP address
- `provisioningStateOutput` - Provisioning state

### ContainerApp

- `idOutput` - Resource ID
- `nameOutput` - Resource name
- `locationOutput` - Azure region
- `tagsOutput` - Resource tags
- `fqdnOutput` - Ingress FQDN
- `latestRevisionFqdnOutput` - Latest revision FQDN
- `latestReadyRevisionNameOutput` - Latest ready revision name
- `provisioningStateOutput` - Provisioning state

## Methods

Both constructs support:
- `addTag(key, value)` - Add a tag
- `removeTag(key)` - Remove a tag
