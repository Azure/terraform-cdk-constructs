# Azure Kubernetes Service (AKS) Module

This module provides a unified, version-aware Azure Kubernetes Service (AKS) cluster construct using the VersionedAzapiResource framework.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Supported API Versions](#supported-api-versions)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
  - [Version Pinning](#version-pinning)
  - [Multiple Node Pools](#multiple-node-pools)
  - [Advanced Networking](#advanced-networking)
  - [Security Configuration](#security-configuration)
  - [Auto-Scaling](#auto-scaling)
  - [Add-ons Configuration](#add-ons-configuration)
  - [Private Cluster](#private-cluster)
  - [Windows Node Pools](#windows-node-pools)
- [Configuration Reference](#configuration-reference)
  - [Required Properties](#required-properties)
  - [Optional Properties](#optional-properties)
  - [Node Pool Configuration](#node-pool-configuration)
  - [Network Profile](#network-profile)
  - [Security Features](#security-features)
  - [Add-ons](#add-ons)
- [Outputs](#outputs)
- [API Version Management](#api-version-management)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Automatic Version Management**: Defaults to the latest stable API version (2025-08-01)
- **Version Pinning**: Explicitly specify API versions for stability
- **Multiple Node Pools**: Support for system and user node pools with different configurations
- **Advanced Networking**: Azure CNI, Kubenet, custom VNET integration
- **Identity Management**: SystemAssigned and UserAssigned managed identities
- **Security**: Azure Active Directory integration, RBAC, private clusters, workload identity
- **Auto-Scaling**: Cluster and pod auto-scaling capabilities
- **Add-ons**: Built-in support for monitoring, policy, and other Azure services
- **Windows Support**: Windows and Linux node pools in the same cluster
- **Schema Validation**: Automatic validation of properties against API schemas
- **Multi-Language Support**: Full JSII compliance for TypeScript, Python, Java, and .NET
- **Type Safety**: Complete TypeScript type definitions

## Installation

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Supported API Versions

| API Version | Status | Features |
|-------------|--------|----------|
| 2025-05-01  | ✅ Active | Stable release with comprehensive AKS features |
| 2025-07-01  | ✅ Active | Enhanced security and performance features |
| 2025-08-01  | ✅ Active, Latest | Latest API version with newest features and improvements |

## Basic Usage

Create a basic AKS cluster with a system node pool:

```typescript
import { AksCluster } from '@microsoft/terraform-cdk-constructs/azure-aks';
import { Group } from '@microsoft/terraform-cdk-constructs/azure-resourcegroup';

// Create a resource group
const resourceGroup = new Group(this, 'rg', {
  name: 'rg-aks-example',
  location: 'eastus',
});

// Create an AKS cluster
const aksCluster = new AksCluster(this, 'aks', {
  name: 'my-aks-cluster',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  dnsPrefix: 'myaks',
  agentPoolProfiles: [{
    name: 'default',
    count: 3,
    vmSize: 'Standard_D2s_v3',
    mode: 'System',
  }],
  identity: {
    type: 'SystemAssigned',
  },
  tags: {
    environment: 'production',
    project: 'myapp',
  },
});
```

## Advanced Usage

### Version Pinning

Pin to a specific API version for stability:

```typescript
const aksCluster = new AksCluster(this, 'aks', {
  name: 'my-aks-cluster',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  apiVersion: '2025-07-01', // Pin to specific version
  dnsPrefix: 'myaks',
  kubernetesVersion: '1.28.3',
  agentPoolProfiles: [{
    name: 'system',
    count: 3,
    vmSize: 'Standard_D2s_v3',
    mode: 'System',
  }],
  identity: {
    type: 'SystemAssigned',
  },
});
```

### Multiple Node Pools

Configure multiple node pools for different workload types:

```typescript
const aksCluster = new AksCluster(this, 'aks', {
  name: 'my-aks-cluster',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  dnsPrefix: 'myaks',
  agentPoolProfiles: [
    {
      name: 'system',
      count: 3,
      vmSize: 'Standard_D2s_v3',
      mode: 'System',
      osDiskSizeGB: 128,
      availabilityZones: ['1', '2', '3'],
    },
    {
      name: 'user',
      count: 5,
      vmSize: 'Standard_D4s_v3',
      mode: 'User',
      enableAutoScaling: true,
      minCount: 3,
      maxCount: 10,
      nodeLabels: {
        workload: 'compute-intensive',
      },
      nodeTaints: ['workload=compute:NoSchedule'],
    },
  ],
  identity: {
    type: 'SystemAssigned',
  },
});
```

### Advanced Networking

Configure Azure CNI with custom networking:

```typescript
const aksCluster = new AksCluster(this, 'aks', {
  name: 'my-aks-cluster',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  dnsPrefix: 'myaks',
  agentPoolProfiles: [{
    name: 'system',
    count: 3,
    vmSize: 'Standard_D2s_v3',
    mode: 'System',
    vnetSubnetID: '/subscriptions/.../subnets/aks-subnet',
  }],
  identity: {
    type: 'SystemAssigned',
  },
  networkProfile: {
    networkPlugin: 'azure',
    networkPolicy: 'azure',
    serviceCidr: '10.0.0.0/16',
    dnsServiceIP: '10.0.0.10',
    loadBalancerSku: 'standard',
    outboundType: 'loadBalancer',
  },
});
```

### Security Configuration

Enable Azure Active Directory integration and RBAC:

```typescript
const aksCluster = new AksCluster(this, 'aks', {
  name: 'my-aks-cluster',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  dnsPrefix: 'myaks',
  agentPoolProfiles: [{
    name: 'system',
    count: 3,
    vmSize: 'Standard_D2s_v3',
    mode: 'System',
  }],
  identity: {
    type: 'SystemAssigned',
  },
  enableRBAC: true,
  aadProfile: {
    managed: true,
    enableAzureRBAC: true,
    adminGroupObjectIDs: ['group-id-1', 'group-id-2'],
  },
  securityProfile: {
    workloadIdentity: {
      enabled: true,
    },
    defender: {
      enabled: true,
      logAnalyticsWorkspaceResourceId: '/subscriptions/.../workspaces/my-workspace',
    },
  },
  disableLocalAccounts: true,
});
```

### Auto-Scaling

Configure cluster auto-scaler with custom settings:

```typescript
const aksCluster = new AksCluster(this, 'aks', {
  name: 'my-aks-cluster',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  dnsPrefix: 'myaks',
  agentPoolProfiles: [{
    name: 'system',
    vmSize: 'Standard_D2s_v3',
    mode: 'System',
    enableAutoScaling: true,
    minCount: 3,
    maxCount: 10,
  }],
  identity: {
    type: 'SystemAssigned',
  },
  autoScalerProfile: {
    scaleDownDelayAfterAdd: '10m',
    scaleDownUnneededTime: '10m',
    scaleDownUtilizationThreshold: '0.5',
    maxGracefulTerminationSec: '600',
    scanInterval: '10s',
  },
  workloadAutoScalerProfile: {
    keda: {
      enabled: true,
    },
    verticalPodAutoscaler: {
      enabled: true,
    },
  },
});
```

### Add-ons Configuration

Enable monitoring and policy add-ons:

```typescript
const aksCluster = new AksCluster(this, 'aks', {
  name: 'my-aks-cluster',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  dnsPrefix: 'myaks',
  agentPoolProfiles: [{
    name: 'system',
    count: 3,
    vmSize: 'Standard_D2s_v3',
    mode: 'System',
  }],
  identity: {
    type: 'SystemAssigned',
  },
  addonProfiles: {
    omsagent: {
      enabled: true,
      config: {
        logAnalyticsWorkspaceResourceID: '/subscriptions/.../workspaces/my-workspace',
      },
    },
    azurepolicy: {
      enabled: true,
    },
    azureKeyvaultSecretsProvider: {
      enabled: true,
      config: {
        enableSecretRotation: 'true',
        rotationPollInterval: '2m',
      },
    },
  },
});
```

### Private Cluster

Create a private AKS cluster:

```typescript
const aksCluster = new AksCluster(this, 'aks', {
  name: 'my-aks-cluster',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  dnsPrefix: 'myaks',
  agentPoolProfiles: [{
    name: 'system',
    count: 3,
    vmSize: 'Standard_D2s_v3',
    mode: 'System',
    vnetSubnetID: '/subscriptions/.../subnets/aks-subnet',
  }],
  identity: {
    type: 'SystemAssigned',
  },
  apiServerAccessProfile: {
    enablePrivateCluster: true,
    privateDNSZone: 'system',
    enablePrivateClusterPublicFQDN: false,
  },
  publicNetworkAccess: 'Disabled',
  networkProfile: {
    networkPlugin: 'azure',
    serviceCidr: '10.0.0.0/16',
    dnsServiceIP: '10.0.0.10',
  },
});
```

### Windows Node Pools

Configure Windows and Linux node pools:

```typescript
const aksCluster = new AksCluster(this, 'aks', {
  name: 'my-aks-cluster',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  dnsPrefix: 'myaks',
  agentPoolProfiles: [
    {
      name: 'system',
      count: 3,
      vmSize: 'Standard_D2s_v3',
      mode: 'System',
      osType: 'Linux',
    },
    {
      name: 'winpool',
      count: 3,
      vmSize: 'Standard_D4s_v3',
      mode: 'User',
      osType: 'Windows',
    },
  ],
  identity: {
    type: 'SystemAssigned',
  },
  windowsProfile: {
    adminUsername: 'azureuser',
    adminPassword: 'P@ssw0rd1234!',
    licenseType: 'Windows_Server',
  },
  networkProfile: {
    networkPlugin: 'azure',
    serviceCidr: '10.0.0.0/16',
    dnsServiceIP: '10.0.0.10',
  },
});
```

## Configuration Reference

### Required Properties

- **`name`** (string): The name of the AKS cluster. Must be 1-63 characters, start and end with alphanumeric, and can contain hyphens.
- **`location`** (string): The Azure region where the cluster will be created (e.g., 'eastus', 'westus2').
- **`resourceGroupId`** (string): Resource group ID where the AKS cluster will be created.
- **`dnsPrefix`** (string): DNS prefix for the cluster. Must be 1-54 characters, start and end with alphanumeric, and can contain hyphens.
- **`agentPoolProfiles`** (array): Array of agent pool configurations. At least one agent pool is required.
- **`identity`** (object): The identity configuration for the AKS cluster (SystemAssigned or UserAssigned).

### Optional Properties

- **`apiVersion`** (string): API version to use. Defaults to latest (2025-08-01).
- **`sku`** (object): The SKU (pricing tier) for the cluster.
  - `name`: SKU name ('Base' or 'Standard')
  - `tier`: SKU tier ('Free', 'Standard', 'Premium')
- **`kubernetesVersion`** (string): Kubernetes version (e.g., '1.28.3', '1.29.0').
- **`enableRBAC`** (boolean): Enable Kubernetes Role-Based Access Control. Default: true.
- **`nodeResourceGroup`** (string): Name of the resource group for cluster nodes. Auto-generated if not specified.
- **`tags`** (object): Key-value pairs for resource tagging.
- **`ignoreChanges`** (array): Properties to ignore during updates (e.g., ['kubernetesVersion']).

### Node Pool Configuration

Each agent pool profile supports:

- **`name`** (string, required): Name of the node pool (12 characters max, lowercase alphanumeric).
- **`vmSize`** (string, required): VM size for nodes (e.g., 'Standard_D2s_v3').
- **`mode`** (string): Node pool mode ('System' or 'User'). Default: 'User'.
- **`count`** (number): Number of nodes. Required if not using auto-scaling.
- **`enableAutoScaling`** (boolean): Enable auto-scaling for the node pool.
- **`minCount`** (number): Minimum node count when auto-scaling is enabled.
- **`maxCount`** (number): Maximum node count when auto-scaling is enabled.
- **`osType`** (string): Operating system type ('Linux' or 'Windows'). Default: 'Linux'.
- **`osDiskSizeGB`** (number): OS disk size in GB.
- **`osDiskType`** (string): OS disk type ('Managed', 'Ephemeral').
- **`vnetSubnetID`** (string): Subnet ID for node pool networking.
- **`podSubnetID`** (string): Subnet ID for pod networking (Azure CNI overlay).
- **`availabilityZones`** (array): Availability zones for nodes (e.g., ['1', '2', '3']).
- **`maxPods`** (number): Maximum pods per node.
- **`nodeLabels`** (object): Kubernetes labels for nodes.
- **`nodeTaints`** (array): Kubernetes taints for nodes.
- **`enableEncryptionAtHost`** (boolean): Enable encryption at host.
- **`enableUltraSSD`** (boolean): Enable Ultra SSD support.
- **`enableFIPS`** (boolean): Enable FIPS 140-2 compliance.

### Network Profile

- **`networkPlugin`** (string): Network plugin ('azure', 'kubenet', 'none').
- **`networkPolicy`** (string): Network policy ('azure', 'calico', 'cilium').
- **`networkMode`** (string): Network mode ('transparent', 'bridge').
- **`podCidr`** (string): CIDR range for pods (Kubenet only).
- **`serviceCidr`** (string): CIDR range for services.
- **`dnsServiceIP`** (string): IP address for DNS service.
- **`dockerBridgeCidr`** (string): CIDR range for Docker bridge.
- **`outboundType`** (string): Outbound routing method ('loadBalancer', 'userDefinedRouting', 'managedNATGateway').
- **`loadBalancerSku`** (string): Load balancer SKU ('basic', 'standard').
- **`loadBalancerProfile`** (object): Load balancer configuration.

### Security Features

- **`aadProfile`** (object): Azure Active Directory integration.
  - `managed`: Enable managed AAD integration.
  - `enableAzureRBAC`: Enable Azure RBAC for Kubernetes authorization.
  - `adminGroupObjectIDs`: AAD group IDs with admin access.
  - `tenantID`: Azure AD tenant ID.
- **`apiServerAccessProfile`** (object): API server access configuration.
  - `authorizedIPRanges`: IP ranges allowed to access API server.
  - `enablePrivateCluster`: Enable private cluster.
  - `privateDNSZone`: Private DNS zone configuration.
  - `disableRunCommand`: Disable run command for security.
- **`securityProfile`** (object): Security settings.
  - `workloadIdentity`: Workload identity configuration.
  - `defender`: Microsoft Defender for Containers.
  - `imageCleaner`: Automated image cleanup.
  - `azureKeyVaultKms`: Azure Key Vault KMS integration.
- **`disableLocalAccounts`** (boolean): Disable local Kubernetes accounts.
- **`publicNetworkAccess`** (string): Public network access ('Enabled' or 'Disabled').

### Add-ons

Common add-ons (configured via `addonProfiles`):

- **`omsagent`**: Azure Monitor for containers
- **`azurepolicy`**: Azure Policy for Kubernetes
- **`azureKeyvaultSecretsProvider`**: Azure Key Vault secrets provider
- **`ingressApplicationGateway`**: Application Gateway Ingress Controller
- **`openServiceMesh`**: Open Service Mesh
- **`gitops`**: GitOps with Flux

Each addon has:
- `enabled` (boolean): Enable/disable the addon
- `config` (object): Addon-specific configuration

## Outputs

The AksCluster construct provides the following outputs:

```typescript
// Direct properties
aksCluster.id                    // The resource ID
aksCluster.fqdn                  // The FQDN of the cluster
aksCluster.privateFqdn           // The private FQDN (if private cluster)
aksCluster.kubeConfig            // Kubernetes configuration (sensitive)
aksCluster.currentKubernetesVersion  // Current Kubernetes version
aksCluster.nodeResourceGroupName // Node resource group name

// Terraform outputs
aksCluster.idOutput              // TerraformOutput for ID
aksCluster.nameOutput            // TerraformOutput for name
aksCluster.locationOutput        // TerraformOutput for location
aksCluster.tagsOutput            // TerraformOutput for tags
aksCluster.fqdnOutput            // TerraformOutput for FQDN
aksCluster.kubeConfigOutput      // TerraformOutput for kubeConfig (sensitive)
```

## API Version Management

### Automatic Latest Version

By default, the construct uses the latest stable API version:

```typescript
const aksCluster = new AksCluster(this, 'aks', {
  // No apiVersion specified - uses latest (2025-08-01)
  name: 'my-aks-cluster',
  // ... other properties
});
```

### Version Pinning

Pin to a specific version for stability:

```typescript
const aksCluster = new AksCluster(this, 'aks', {
  apiVersion: '2025-07-01', // Pin to specific version
  name: 'my-aks-cluster',
  // ... other properties
});
```

### Version Migration

When migrating between versions, the framework provides:
- Schema validation for the target version
- Migration warnings for deprecated properties
- Breaking change detection
- Automatic property transformation where possible

## Best Practices

### Production Deployments

1. **Use SystemAssigned Identity**: Prefer SystemAssigned managed identity over service principals for better security and easier management.

```typescript
identity: {
  type: 'SystemAssigned',
}
```

2. **Enable Auto-Scaling**: Configure auto-scaling for production workloads to handle varying loads.

```typescript
agentPoolProfiles: [{
  enableAutoScaling: true,
  minCount: 3,
  maxCount: 10,
}]
```

3. **Use Standard Tier SKU**: Use Standard tier for production clusters to get SLA guarantees.

```typescript
sku: {
  name: 'Standard',
  tier: 'Standard',
}
```

4. **Configure Network Policies**: Enable network policies for security.

```typescript
networkProfile: {
  networkPlugin: 'azure',
  networkPolicy: 'azure', // or 'calico'
}
```

5. **Enable Monitoring**: Always enable monitoring for production clusters.

```typescript
addonProfiles: {
  omsagent: {
    enabled: true,
    config: {
      logAnalyticsWorkspaceResourceID: workspaceId,
    },
  },
}
```

6. **Use Availability Zones**: Deploy nodes across availability zones for high availability.

```typescript
agentPoolProfiles: [{
  availabilityZones: ['1', '2', '3'],
}]
```

7. **Implement RBAC**: Enable RBAC and Azure AD integration.

```typescript
enableRBAC: true,
aadProfile: {
  managed: true,
  enableAzureRBAC: true,
}
```

8. **Private Clusters for Sensitive Workloads**: Use private clusters for enhanced security.

```typescript
apiServerAccessProfile: {
  enablePrivateCluster: true,
}
```

9. **Separate System and User Node Pools**: Use dedicated system node pools for critical workloads.

```typescript
agentPoolProfiles: [
  { name: 'system', mode: 'System' },
  { name: 'user', mode: 'User' },
]
```

10. **Version Pinning for Stability**: Pin API versions in production to avoid unexpected changes.

```typescript
apiVersion: '2025-07-01',
```

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.