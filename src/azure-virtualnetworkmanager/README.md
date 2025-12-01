# Azure Virtual Network Manager

This module provides a high-level TypeScript construct for managing Azure Virtual Network Managers using the Terraform CDK and Azure AZAPI provider.

Azure Virtual Network Manager (AVNM) is a centralized network management service that enables you to manage connectivity and security policies for your virtual networks at scale across subscriptions and management groups.

## Table of Contents

- [Why Use Azure Virtual Network Manager?](#why-use-azure-virtual-network-manager)
- [Why Use AZAPI Provider?](#why-use-azapi-provider)
- [Features](#features)
- [Supported API Versions](#supported-api-versions)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [API Reference](#api-reference)
  - [VirtualNetworkManager](#virtualnetworkmanager)
  - [NetworkGroup](#networkgroup)
  - [NetworkGroupStaticMember](#networkgroupstaticmember)
  - [ConnectivityConfiguration](#connectivityconfiguration)
  - [SecurityAdminConfiguration](#securityadminconfiguration)
  - [SecurityAdminRuleCollection](#securityadminrulecollection)
  - [SecurityAdminRule](#securityadminrule)
- [Child Resources](#child-resources)
- [Complete End-to-End Example](#complete-end-to-end-example)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Related Constructs](#related-constructs)
- [Additional Resources](#additional-resources)

## Why Use Azure Virtual Network Manager?

- **Centralized Management**: Manage connectivity and security across multiple virtual networks from a single location
- **Policy-Based Configuration**: Apply consistent network policies across your organization
- **Scalability**: Manage thousands of virtual networks efficiently
- **Flexibility**: Support for both subscription and management group scopes
- **Advanced Features**: Connectivity configurations, security admin rules, and routing configurations

## Why Use AZAPI Provider?

- **Latest Azure Features**: Access new Azure Virtual Network Manager features immediately upon release without waiting for Terraform provider updates
- **Automatic API Version Management**: Seamlessly switch between API versions or use the latest by default
- **Type-Safe Properties**: Full TypeScript type definitions with comprehensive validation
- **No Provider Lag**: Direct access to Azure Resource Manager APIs means zero delay for new features

## Features

- **Multiple API Version Support**: Automatically supports the 2 most recent stable API versions (2024-05-01, 2023-11-01)
- **Automatic Version Resolution**: Uses the latest API version by default
- **Version Pinning**: Lock to a specific API version for stability
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **JSII Compatible**: Can be used from TypeScript, Python, Java, and C#
- **Terraform Outputs**: Automatic creation of outputs for easy reference
- **Tag Management**: Built-in methods for managing resource tags
- **Complete Child Resource Support**: All 6 child resource types fully implemented
  - Network Groups - Logical containers for VNets/subnets
  - Network Group Static Members - Add specific resources to groups
  - Connectivity Configurations - Mesh and hub-spoke topologies
  - Security Admin Configurations - High-priority security policies
  - Security Admin Rule Collections - Group related security rules
  - Security Admin Rules - Individual Allow/Deny/AlwaysAllow rules
- **Flexible Usage Patterns**: Choose between convenience methods or direct instantiation

## Supported API Versions

| Version | Support Level | Release Date | Notes |
|---------|--------------|--------------|-------|
| 2024-05-01 | Active (Latest) | 2024-05-01 | Recommended for new deployments with full routing, security, and connectivity features |
| 2023-11-01 | Maintenance | 2023-11-01 | Stable release with core Network Manager features |

## Installation

This module is part of the `@microsoft/terraform-cdk-constructs` package.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Basic Usage

### Simple Virtual Network Manager with Subscription Scope

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { VirtualNetworkManager } from "@microsoft/terraform-cdk-constructs/azure-virtualnetworkmanager";

const app = new App();
const stack = new TerraformStack(app, "network-manager-stack");

// Configure the Azure provider
new AzapiProvider(stack, "azapi", {});

// Create a resource group
const resourceGroup = new ResourceGroup(stack, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

// Create a Virtual Network Manager
const vnm = new VirtualNetworkManager(stack, "vnm", {
  name: "my-network-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  networkManagerScopes: {
    subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  },
  networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
  description: "Network manager for production environment",
  tags: {
    Environment: "Production",
    ManagedBy: "Terraform",
  },
});

app.synth();
```

## Advanced Usage

### Network Manager with Management Group Scope

```typescript
const vnm = new VirtualNetworkManager(stack, "vnm-mg", {
  name: "enterprise-network-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  networkManagerScopes: {
    managementGroups: [
      "/providers/Microsoft.Management/managementGroups/my-mg-id",
    ],
  },
  networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin", "Routing"],
  description: "Enterprise-wide network management",
  tags: {
    Environment: "Production",
    Scope: "Enterprise",
  },
});
```

### Network Manager with Multiple Scopes

```typescript
const vnm = new VirtualNetworkManager(stack, "vnm-multi-scope", {
  name: "multi-scope-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  networkManagerScopes: {
    subscriptions: [
      "/subscriptions/00000000-0000-0000-0000-000000000000",
      "/subscriptions/11111111-1111-1111-1111-111111111111",
    ],
    managementGroups: [
      "/providers/Microsoft.Management/managementGroups/my-mg-id",
    ],
  },
  networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
  description: "Network manager spanning multiple subscriptions and management groups",
});
```

### All Scope Access Types

```typescript
const vnm = new VirtualNetworkManager(stack, "vnm-full-access", {
  name: "full-feature-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  networkManagerScopes: {
    subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  },
  networkManagerScopeAccesses: [
    "Connectivity",   // Manage virtual network connectivity
    "SecurityAdmin",  // Manage security admin rules
    "Routing",        // Manage routing configurations
  ],
  description: "Network manager with all features enabled",
});
```

### Pinning to a Specific API Version

```typescript
const vnm = new VirtualNetworkManager(stack, "vnm-pinned", {
  name: "stable-network-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  apiVersion: "2023-11-01", // Pin to specific version
  networkManagerScopes: {
    subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  },
  networkManagerScopeAccesses: ["Connectivity"],
  description: "Network manager with pinned API version",
});
```

### Using Outputs

```typescript
const vnm = new VirtualNetworkManager(stack, "vnm", {
  name: "my-network-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  networkManagerScopes: {
    subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  },
  networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
});

// Access Network Manager ID for use in other resources
console.log(vnm.id); // Terraform interpolation string
console.log(vnm.resourceName); // Network manager name

// Use outputs for cross-stack references
new TerraformOutput(stack, "vnm-id", {
  value: vnm.idOutput,
});

new TerraformOutput(stack, "vnm-scope", {
  value: vnm.scopeOutput,
});
```

### Tag Management

```typescript
const vnm = new VirtualNetworkManager(stack, "vnm-tags", {
  name: "tagged-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  networkManagerScopes: {
    subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  },
  networkManagerScopeAccesses: ["Connectivity"],
  tags: {
    Environment: "Production",
  },
});

// Add a tag
vnm.addTag("CostCenter", "Engineering");

// Remove a tag
vnm.removeTag("Environment");
```

### Ignore Changes Lifecycle

```typescript
const vnm = new VirtualNetworkManager(stack, "vnm-ignore-changes", {
  name: "lifecycle-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  networkManagerScopes: {
    subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  },
  networkManagerScopeAccesses: ["Connectivity"],
  tags: {
    ManagedBy: "Terraform",
  },
  ignoreChanges: ["tags"], // Ignore changes to tags
});
```

## API Reference

### VirtualNetworkManager

The main construct for creating and managing Azure Virtual Network Managers.

#### VirtualNetworkManagerProps

Configuration properties for the Virtual Network Manager construct.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Name of the Virtual Network Manager (2-64 characters, alphanumeric, underscores, hyphens, periods) |
| `location` | `string` | Yes | Azure region where the network manager will be deployed |
| `resourceGroupName` | `string` | Yes | Name of the resource group where the network manager will be created |
| `networkManagerScopes` | [`NetworkManagerScopes`](#networkmanagerscopes) | Yes | Defines the scope of management (management groups and/or subscriptions) |
| `networkManagerScopeAccesses` | `("Connectivity" \| "SecurityAdmin" \| "Routing")[]` | Yes | Array of features enabled for the network manager |
| `description` | `string` | No | Optional description of the network manager |
| `tags` | `{ [key: string]: string }` | No | Resource tags for organization and cost tracking |
| `apiVersion` | `string` | No | Pin to a specific API version (e.g., "2024-05-01") |
| `ignoreChanges` | `string[]` | No | Properties to ignore during updates (e.g., ["tags"]) |

### NetworkManagerScopes

Defines the management scope for the Virtual Network Manager. At least one of `managementGroups` or `subscriptions` must be specified.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `managementGroups` | `string[]` | No* | Array of management group IDs (e.g., ["/providers/Microsoft.Management/managementGroups/mg1"]) |
| `subscriptions` | `string[]` | No* | Array of subscription IDs (e.g., ["/subscriptions/00000000-0000-0000-0000-000000000000"]) |

*At least one of `managementGroups` or `subscriptions` is required.

### Network Manager Scope Accesses

The `networkManagerScopeAccesses` property defines which features are enabled for the Network Manager:

- **`Connectivity`**: Enables management of connectivity configurations (hub-and-spoke, mesh topologies)
- **`SecurityAdmin`**: Enables management of security admin rules across virtual networks
- **`Routing`**: Enables management of routing configurations (requires 2024-05-01 or later)

### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The Azure resource ID of the Virtual Network Manager |
| `resourceName` | `string` | The name of the Virtual Network Manager |
| `tags` | `{ [key: string]: string }` | The tags assigned to the Virtual Network Manager |

### Outputs

The construct automatically creates Terraform outputs:

- **`id`**: The Virtual Network Manager resource ID
- **`name`**: The Virtual Network Manager name
- **`location`**: The Virtual Network Manager location
- **`tags`**: The Virtual Network Manager tags
- **`scope`**: The management scope (subscriptions and/or management groups)
- **`scopeAccesses`**: The enabled features (Connectivity, SecurityAdmin, Routing)

### VirtualNetworkManager Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| [`addTag()`](#addtag) | `key: string, value: string` | `void` | Add a tag to the Virtual Network Manager |
| [`removeTag()`](#removetag) | `key: string` | `void` | Remove a tag from the Virtual Network Manager |
| [`addNetworkGroup()`](#addnetworkgroup) | `id: string, props: Omit<NetworkGroupProps, 'networkManagerId'>` | `NetworkGroup` | Convenience method to create a NetworkGroup |
| [`addConnectivityConfiguration()`](#addconnectivityconfiguration) | `id: string, props: Omit<ConnectivityConfigurationProps, 'networkManagerId'>` | `ConnectivityConfiguration` | Convenience method to create a ConnectivityConfiguration |
| [`addSecurityAdminConfiguration()`](#addsecurityadminconfiguration) | `id: string, props: Omit<SecurityAdminConfigurationProps, 'networkManagerId'>` | `SecurityAdminConfiguration` | Convenience method to create a SecurityAdminConfiguration |

#### addTag()

```typescript
public addTag(key: string, value: string): void
```

Add a tag to the Virtual Network Manager. Note: This modifies the construct props but requires a new deployment to take effect.

#### removeTag()

```typescript
public removeTag(key: string): void
```

Remove a tag from the Virtual Network Manager. Note: This modifies the construct props but requires a new deployment to take effect.

#### addNetworkGroup()

```typescript
public addNetworkGroup(
  id: string,
  props: Omit<NetworkGroupProps, "networkManagerId">
): NetworkGroup
```

Convenience method to create a NetworkGroup with the networkManagerId automatically set.

**Example:**
```typescript
const prodGroup = networkManager.addNetworkGroup("prod-group", {
  name: "production-vnets",
  description: "Production virtual networks",
  memberType: "VirtualNetwork"
});
```

#### addConnectivityConfiguration()

```typescript
public addConnectivityConfiguration(
  id: string,
  props: Omit<ConnectivityConfigurationProps, "networkManagerId">
): ConnectivityConfiguration
```

Convenience method to create a ConnectivityConfiguration with the networkManagerId automatically set.

**Example:**
```typescript
const hubSpoke = networkManager.addConnectivityConfiguration("hub-spoke", {
  name: "production-hub-spoke",
  connectivityTopology: "HubAndSpoke",
  appliesToGroups: [{ networkGroupId: prodGroup.id }],
  hubs: [{ resourceId: hubVnet.id, resourceType: "Microsoft.Network/virtualNetworks" }]
});
```

#### addSecurityAdminConfiguration()

```typescript
public addSecurityAdminConfiguration(
  id: string,
  props: Omit<SecurityAdminConfigurationProps, "networkManagerId">
): SecurityAdminConfiguration
```

Convenience method to create a SecurityAdminConfiguration with the networkManagerId automatically set.

**Example:**
```typescript
const securityConfig = networkManager.addSecurityAdminConfiguration("security", {
  name: "production-security",
  description: "High-priority security rules for production"
});
```

### NetworkGroup

See the [Network Groups](#network-groups) section for detailed documentation.

### NetworkGroupStaticMember

See the [Network Group Static Members](#network-group-static-members) section for detailed documentation.

### ConnectivityConfiguration

See the [Connectivity Configurations](#connectivity-configurations) section for detailed documentation.

### SecurityAdminConfiguration

See the [Security Admin Configurations](#security-admin-configurations) section for detailed documentation.

### SecurityAdminRuleCollection

See the [Security Admin Rule Collections](#security-admin-rule-collections) section for detailed documentation.

### SecurityAdminRule

See the [Security Admin Rules](#security-admin-rules) section for detailed documentation.

## Best Practices

### 1. Scope Configuration

**Use Subscription Scope for Isolated Environments:**
```typescript
// ✅ Recommended for isolated environments
const vnm = new VirtualNetworkManager(stack, "vnm", {
  name: "dev-network-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  networkManagerScopes: {
    subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  },
  networkManagerScopeAccesses: ["Connectivity"],
});
```

**Use Management Group Scope for Enterprise-Wide Management:**
```typescript
// ✅ Recommended for enterprise scenarios
const vnm = new VirtualNetworkManager(stack, "vnm-enterprise", {
  name: "enterprise-network-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  networkManagerScopes: {
    managementGroups: [
      "/providers/Microsoft.Management/managementGroups/root-mg",
    ],
  },
  networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
});
```

### 2. Network Manager Scope Access

Only enable the features you need:

```typescript
// ✅ Good - Enable only required features
const vnm = new VirtualNetworkManager(stack, "vnm", {
  name: "connectivity-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  networkManagerScopes: {
    subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  },
  networkManagerScopeAccesses: ["Connectivity"], // Only connectivity
});
```

### 3. Naming Conventions

Follow Azure naming conventions:

```typescript
// ✅ Good - Descriptive, follows conventions
const vnm = new VirtualNetworkManager(stack, "vnm", {
  name: "prod-eastus-network-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  networkManagerScopes: {
    subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  },
  networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
});
```

### 4. Tag Management

Apply consistent tags for better organization:

```typescript
// ✅ Recommended - Comprehensive tagging
const vnm = new VirtualNetworkManager(stack, "vnm", {
  name: "my-network-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  networkManagerScopes: {
    subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  },
  networkManagerScopeAccesses: ["Connectivity"],
  tags: {
    Environment: "Production",
    CostCenter: "Engineering",
    ManagedBy: "Terraform",
    Project: "Network-Infrastructure",
  },
});
```

### 5. Use Latest API Version for New Deployments

Unless you have specific requirements, use the default (latest) API version:

```typescript
// ✅ Recommended - Uses latest version automatically
const vnm = new VirtualNetworkManager(stack, "vnm", {
  name: "my-network-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  networkManagerScopes: {
    subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  },
  networkManagerScopeAccesses: ["Connectivity"],
});
```

### 6. Pin API Versions for Production Stability

For production workloads, consider pinning to a specific API version:

```typescript
// ✅ Production-ready - Pinned version
const vnm = new VirtualNetworkManager(stack, "vnm", {
  name: "prod-network-manager",
  location: "eastus",
  resourceGroupName: resourceGroup.props.name,
  apiVersion: "2024-05-01",
  networkManagerScopes: {
    subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
  },
  networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
});
```

## Child Resources

Azure Virtual Network Manager supports several child resources that enable powerful network management capabilities. This module implements all essential child resources with full TypeScript support.

### Available Child Resources

- **[Network Groups](#network-groups)**: Logical containers for virtual networks or subnets
- **[Network Group Static Members](#network-group-static-members)**: Add specific VNets/subnets to groups
- **[Connectivity Configurations](#connectivity-configurations)**: Define mesh or hub-and-spoke topologies
- **[Security Admin Configurations](#security-admin-configurations)**: High-priority security policies
- **[Security Admin Rule Collections](#security-admin-rule-collections)**: Group related security rules
- **[Security Admin Rules](#security-admin-rules)**: Individual security rules (Allow, Deny, AlwaysAllow)

### Usage Patterns

This module supports two usage patterns (Option A - Hybrid Approach):

#### 1. Convenience Methods (Recommended for Simple Cases)

Use the convenience methods on the [`VirtualNetworkManager`](#virtualnetworkmanager) instance:

```typescript
// Create network group using convenience method
const prodGroup = networkManager.addNetworkGroup("prod-group", {
  name: "production-vnets",
  description: "Production virtual networks",
  memberType: "VirtualNetwork"
});

// Create connectivity configuration using convenience method
networkManager.addConnectivityConfiguration("mesh-config", {
  name: "mesh-topology",
  connectivityTopology: "Mesh",
  appliesToGroups: [{ networkGroupId: prodGroup.id }]
});
```

**Benefits:**
- Less verbose (networkManagerId is set automatically)
- Natural parent-child relationship
- Cleaner code for simple scenarios

#### 2. Direct Instantiation (For Complex Scenarios)

Create child resources directly with full control:

```typescript
// Create network group with direct instantiation
const hubGroup = new NetworkGroup(this, "hub-group", {
  name: "hub-vnets",
  networkManagerId: networkManager.id,
  description: "Hub virtual networks",
  memberType: "VirtualNetwork"
});

// Create connectivity configuration with direct instantiation
const hubSpoke = new ConnectivityConfiguration(this, "hub-spoke", {
  name: "hub-spoke-topology",
  networkManagerId: networkManager.id,
  connectivityTopology: "HubAndSpoke",
  appliesToGroups: [{ networkGroupId: hubGroup.id }],
  hubs: [{ resourceId: hubVnet.id, resourceType: "Microsoft.Network/virtualNetworks" }]
});
```

**Benefits:**
- Full flexibility
- Better for complex cross-stack scenarios
- Explicit parent references

**When to Use Each:**
- Use convenience methods for simple, single-stack deployments
- Use direct instantiation when you need more control or cross-stack references

## Network Groups

Network Groups are logical containers for virtual networks or subnets. They're the foundation for applying connectivity, security, or routing configurations at scale.

### NetworkGroupProps

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Name of the network group |
| `networkManagerId` | `string` | Yes | Resource ID of the parent Network Manager |
| `description` | `string` | No | Optional description |
| `memberType` | `"VirtualNetwork" \| "Subnet"` | No | Type of members (defaults to mixed if not specified) |
| `apiVersion` | `string` | No | Pin to specific API version |
| `ignoreChanges` | `string[]` | No | Lifecycle ignore changes |

### Network Group Examples

#### Basic Network Group

```typescript
// Using convenience method
const prodGroup = networkManager.addNetworkGroup("prod-group", {
  name: "production-vnets",
  description: "Production virtual networks",
  memberType: "VirtualNetwork"
});

// Using direct instantiation
const devGroup = new NetworkGroup(this, "dev-group", {
  name: "development-vnets",
  networkManagerId: networkManager.id,
  description: "Development virtual networks",
  memberType: "VirtualNetwork"
});
```

#### Network Group for Subnets

```typescript
const subnetGroup = new NetworkGroup(this, "subnet-group", {
  name: "dmz-subnets",
  networkManagerId: networkManager.id,
  description: "DMZ subnets across multiple VNets",
  memberType: "Subnet"
});
```

## Network Group Static Members

Static Members explicitly add virtual networks or subnets to a network group. This provides precise control over group membership (as opposed to dynamic membership via Azure Policy).

### NetworkGroupStaticMemberProps

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Name of the static member |
| `networkGroupId` | `string` | Yes | Resource ID of the parent Network Group |
| `resourceId` | `string` | Yes | Full resource ID of the VNet or Subnet to add |
| `apiVersion` | `string` | No | Pin to specific API version |
| `ignoreChanges` | `string[]` | No | Lifecycle ignore changes |

### Static Member Examples

#### Adding VNets to a Network Group

```typescript
// Add production VNet to production group
new NetworkGroupStaticMember(this, "prod-vnet1-member", {
  name: "prod-vnet1",
  networkGroupId: productionGroup.id,
  resourceId: prodVnet1.id
});

// Add another VNet to the same group
new NetworkGroupStaticMember(this, "prod-vnet2-member", {
  name: "prod-vnet2",
  networkGroupId: productionGroup.id,
  resourceId: prodVnet2.id
});
```

#### Adding Subnets to a Network Group

```typescript
// Add specific subnet to DMZ group
new NetworkGroupStaticMember(this, "dmz-subnet-member", {
  name: "dmz-subnet1",
  networkGroupId: dmzSubnetGroup.id,
  resourceId: subnet.id  // Subnet resource ID
});
```

## Connectivity Configurations

Connectivity Configurations define network topology (mesh or hub-and-spoke) for virtual networks. They enable automated peering management at scale.

### ConnectivityConfigurationProps

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Name of the connectivity configuration |
| `networkManagerId` | `string` | Yes | Resource ID of the parent Network Manager |
| `connectivityTopology` | `"Mesh" \| "HubAndSpoke"` | Yes | Topology type |
| `appliesToGroups` | [`ConnectivityGroupItem[]`](#connectivitygroupitem) | Yes | Network groups to apply configuration to |
| `hubs` | [`Hub[]`](#hub) | No* | Hub VNets (required for HubAndSpoke) |
| `description` | `string` | No | Optional description |
| `isGlobal` | `boolean` | No | Enable global mesh (default: false) |
| `deleteExistingPeering` | `boolean` | No | Delete existing peerings (default: false) |
| `apiVersion` | `string` | No | Pin to specific API version |
| `ignoreChanges` | `string[]` | No | Lifecycle ignore changes |

*Required when `connectivityTopology` is "HubAndSpoke"

#### ConnectivityGroupItem

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `networkGroupId` | `string` | Yes | Network Group resource ID |
| `useHubGateway` | `boolean` | No | Use hub gateway for spoke-to-spoke traffic |
| `isGlobal` | `boolean` | No | Enable global connectivity |
| `groupConnectivity` | `"None" \| "DirectlyConnected"` | No | Group connectivity mode |

#### Hub

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `resourceId` | `string` | Yes | Hub VNet resource ID |
| `resourceType` | `string` | Yes | Resource type (typically "Microsoft.Network/virtualNetworks") |

### Connectivity Configuration Examples

#### Mesh Topology

```typescript
// Using convenience method
const meshConfig = networkManager.addConnectivityConfiguration("mesh", {
  name: "dev-mesh-topology",
  connectivityTopology: "Mesh",
  description: "Full mesh for development VNets",
  appliesToGroups: [
    {
      networkGroupId: devGroup.id,
      groupConnectivity: "DirectlyConnected",
      isGlobal: false
    }
  ],
  deleteExistingPeering: true,
  isGlobal: false
});

// Using direct instantiation
const regionalMesh = new ConnectivityConfiguration(this, "regional-mesh", {
  name: "regional-mesh",
  networkManagerId: networkManager.id,
  connectivityTopology: "Mesh",
  description: "Regional mesh for test environments",
  appliesToGroups: [
    {
      networkGroupId: testGroup.id,
      groupConnectivity: "DirectlyConnected"
    }
  ]
});
```

#### Hub-and-Spoke Topology

```typescript
// Using convenience method
const hubSpoke = networkManager.addConnectivityConfiguration("hub-spoke", {
  name: "production-hub-spoke",
  connectivityTopology: "HubAndSpoke",
  description: "Hub-spoke for production with gateway transit",
  appliesToGroups: [
    {
      networkGroupId: productionGroup.id,
      useHubGateway: true,  // Enable gateway transit
      isGlobal: false
    }
  ],
  hubs: [
    {
      resourceId: hubVnet.id,
      resourceType: "Microsoft.Network/virtualNetworks"
    }
  ],
  deleteExistingPeering: true
});

// Using direct instantiation with multiple hubs
const multiRegionHubSpoke = new ConnectivityConfiguration(this, "multi-hub", {
  name: "multi-region-hub-spoke",
  networkManagerId: networkManager.id,
  connectivityTopology: "HubAndSpoke",
  description: "Multi-region hub-spoke topology",
  appliesToGroups: [
    {
      networkGroupId: globalGroup.id,
      useHubGateway: true,
      isGlobal: true  // Enable global mesh between regions
    }
  ],
  hubs: [
    {
      resourceId: eastUsHub.id,
      resourceType: "Microsoft.Network/virtualNetworks"
    },
    {
      resourceId: westUsHub.id,
      resourceType: "Microsoft.Network/virtualNetworks"
    }
  ],
  isGlobal: true
});
```

## Security Admin Configurations

Security Admin Configurations define high-priority security rules that are evaluated **BEFORE** traditional Network Security Groups (NSGs). This enables centralized security policy enforcement that cannot be overridden by individual teams.

### SecurityAdminConfigurationProps

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Name of the security admin configuration |
| `networkManagerId` | `string` | Yes | Resource ID of the parent Network Manager |
| `description` | `string` | No | Optional description |
| `applyOnNetworkIntentPolicyBasedServices` | `string[]` | No | Services to apply config on |
| `apiVersion` | `string` | No | Pin to specific API version |
| `ignoreChanges` | `string[]` | No | Lifecycle ignore changes |

### Security Admin Configuration Examples

```typescript
// Using convenience method
const securityConfig = networkManager.addSecurityAdminConfiguration("security", {
  name: "org-security-policies",
  description: "Organization-wide security enforcement"
});

// Using direct instantiation with service configuration
const securityConfig = new SecurityAdminConfiguration(this, "security-config", {
  name: "production-security",
  networkManagerId: networkManager.id,
  description: "High-priority security rules for production",
  applyOnNetworkIntentPolicyBasedServices: ["None"]
});
```

## Security Admin Rule Collections

Rule Collections group related security admin rules together and define which network groups receive those rules.

### SecurityAdminRuleCollectionProps

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Name of the rule collection |
| `securityAdminConfigurationId` | `string` | Yes | Resource ID of the parent Security Admin Configuration |
| `description` | `string` | No | Optional description |
| `appliesToGroups` | [`SecurityAdminConfigurationRuleGroupItem[]`](#securityadminconfigurationrulegroupitem) | Yes | Network groups to apply rules to |
| `apiVersion` | `string` | No | Pin to specific API version |
| `ignoreChanges` | `string[]` | No | Lifecycle ignore changes |

#### SecurityAdminConfigurationRuleGroupItem

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `networkGroupId` | `string` | Yes | Network Group resource ID |

### Rule Collection Examples

```typescript
// Rule collection for blocking high-risk ports
const blockHighRiskPorts = new SecurityAdminRuleCollection(this, "block-ports", {
  name: "block-high-risk-ports",
  securityAdminConfigurationId: securityConfig.id,
  description: "Block SSH, RDP, and other high-risk ports from internet",
  appliesToGroups: [
    { networkGroupId: productionGroup.id },
    { networkGroupId: stagingGroup.id }
  ]
});

// Rule collection for allowing monitoring traffic
const allowMonitoring = new SecurityAdminRuleCollection(this, "allow-monitoring", {
  name: "allow-monitoring-traffic",
  securityAdminConfigurationId: securityConfig.id,
  description: "Always allow monitoring and security scanner traffic",
  appliesToGroups: [
    { networkGroupId: productionGroup.id },
    { networkGroupId: stagingGroup.id },
    { networkGroupId: devGroup.id }
  ]
});
```

## Security Admin Rules

Security Admin Rules define individual security policies with three action types:
- **Allow**: Permits traffic, but NSG can still deny it
- **Deny**: Blocks traffic immediately, no further evaluation
- **AlwaysAllow**: Forces traffic to be allowed, overriding NSG denies

### SecurityAdminRuleProps

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Name of the rule |
| `ruleCollectionId` | `string` | Yes | Resource ID of the parent Rule Collection |
| `priority` | `number` | Yes | Priority (1-4096, lower = higher priority) |
| `action` | `"Allow" \| "Deny" \| "AlwaysAllow"` | Yes | Action to take when rule matches |
| `direction` | `"Inbound" \| "Outbound"` | Yes | Traffic direction |
| `protocol` | `"Tcp" \| "Udp" \| "Icmp" \| "Esp" \| "Ah" \| "Any"` | Yes | Protocol |
| `description` | `string` | No | Optional description |
| `sourcePortRanges` | `string[]` | No | Source port ranges (default: ["*"]) |
| `destinationPortRanges` | `string[]` | No | Destination port ranges (default: ["*"]) |
| `sources` | [`AddressPrefixItem[]`](#addressprefixitem) | No | Source addresses (default: all) |
| `destinations` | [`AddressPrefixItem[]`](#addressprefixitem) | No | Destination addresses (default: all) |
| `apiVersion` | `string` | No | Pin to specific API version |
| `ignoreChanges` | `string[]` | No | Lifecycle ignore changes |

#### AddressPrefixItem

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `addressPrefix` | `string` | Yes | IP address, CIDR, service tag, or "*" |
| `addressPrefixType` | `"IPPrefix" \| "ServiceTag"` | Yes | Type of address prefix |

### Security Admin Rule Examples

#### Deny Rules - Block High-Risk Ports

```typescript
// Block SSH from internet
new SecurityAdminRule(this, "block-ssh", {
  name: "block-ssh-from-internet",
  ruleCollectionId: blockHighRiskPorts.id,
  description: "Block SSH access from internet",
  priority: 100,
  action: "Deny",
  direction: "Inbound",
  protocol: "Tcp",
  destinationPortRanges: ["22"],
  sources: [
    {
      addressPrefix: "Internet",
      addressPrefixType: "ServiceTag"
    }
  ],
  destinations: [
    {
      addressPrefix: "*",
      addressPrefixType: "IPPrefix"
    }
  ]
});

// Block RDP from internet
new SecurityAdminRule(this, "block-rdp", {
  name: "block-rdp-from-internet",
  ruleCollectionId: blockHighRiskPorts.id,
  description: "Block RDP access from internet",
  priority: 110,
  action: "Deny",
  direction: "Inbound",
  protocol: "Tcp",
  destinationPortRanges: ["3389"],
  sources: [
    {
      addressPrefix: "Internet",
      addressPrefixType: "ServiceTag"
    }
  ],
  destinations: [
    {
      addressPrefix: "*",
      addressPrefixType: "IPPrefix"
    }
  ]
});

// Block multiple database ports
new SecurityAdminRule(this, "block-databases", {
  name: "block-database-ports",
  ruleCollectionId: blockHighRiskPorts.id,
  description: "Block direct database access from internet",
  priority: 120,
  action: "Deny",
  direction: "Inbound",
  protocol: "Tcp",
  destinationPortRanges: ["1433", "3306", "5432", "27017"],  // SQL, MySQL, PostgreSQL, MongoDB
  sources: [
    {
      addressPrefix: "Internet",
      addressPrefixType: "ServiceTag"
    }
  ],
  destinations: [
    {
      addressPrefix: "*",
      addressPrefixType: "IPPrefix"
    }
  ]
});
```

#### AlwaysAllow Rules - Mandatory Allow

```typescript
// Always allow monitoring traffic
new SecurityAdminRule(this, "always-allow-monitoring", {
  name: "always-allow-monitoring",
  ruleCollectionId: allowMonitoring.id,
  description: "Always allow traffic from monitoring systems - cannot be blocked by NSG",
  priority: 50,
  action: "AlwaysAllow",
  direction: "Inbound",
  protocol: "Any",
  sourcePortRanges: ["*"],
  destinationPortRanges: ["*"],
  sources: [
    {
      addressPrefix: "10.255.0.0/24",  // Monitoring network
      addressPrefixType: "IPPrefix"
    }
  ],
  destinations: [
    {
      addressPrefix: "*",
      addressPrefixType: "IPPrefix"
    }
  ]
});

// Always allow Azure security scanners
new SecurityAdminRule(this, "always-allow-security-scanners", {
  name: "always-allow-security-scanners",
  ruleCollectionId: allowMonitoring.id,
  description: "Always allow traffic from security scanners",
  priority: 60,
  action: "AlwaysAllow",
  direction: "Inbound",
  protocol: "Any",
  sources: [
    {
      addressPrefix: "AzureSecurityCenter",
      addressPrefixType: "ServiceTag"
    }
  ],
  destinations: [
    {
      addressPrefix: "*",
      addressPrefixType: "IPPrefix"
    }
  ]
});
```

#### Allow Rules - Permissive (NSG Can Override)

```typescript
// Allow HTTPS - NSG can still deny if needed
new SecurityAdminRule(this, "allow-https", {
  name: "allow-https",
  ruleCollectionId: allowMonitoring.id,
  description: "Allow HTTPS traffic - NSG can still override",
  priority: 200,
  action: "Allow",
  direction: "Inbound",
  protocol: "Tcp",
  destinationPortRanges: ["443"],
  sources: [
    {
      addressPrefix: "*",
      addressPrefixType: "IPPrefix"
    }
  ],
  destinations: [
    {
      addressPrefix: "*",
      addressPrefixType: "IPPrefix"
    }
  ]
});

// Allow HTTP only from specific networks
new SecurityAdminRule(this, "allow-http-internal", {
  name: "allow-http-internal",
  ruleCollectionId: allowMonitoring.id,
  description: "Allow HTTP from internal networks only",
  priority: 210,
  action: "Allow",
  direction: "Inbound",
  protocol: "Tcp",
  destinationPortRanges: ["80"],
  sources: [
    {
      addressPrefix: "10.0.0.0/8",
      addressPrefixType: "IPPrefix"
    },
    {
      addressPrefix: "172.16.0.0/12",
      addressPrefixType: "IPPrefix"
    }
  ],
  destinations: [
    {
      addressPrefix: "*",
      addressPrefixType: "IPPrefix"
    }
  ]
});
```

## Complete End-to-End Example

Here's a comprehensive example showing a realistic AVNM setup with all child resources:

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { VirtualNetwork } from "@microsoft/terraform-cdk-constructs/azure-virtualnetwork";
import { Subnet } from "@microsoft/terraform-cdk-constructs/azure-subnet";
import {
  VirtualNetworkManager,
  NetworkGroup,
  NetworkGroupStaticMember,
  ConnectivityConfiguration,
  SecurityAdminConfiguration,
  SecurityAdminRuleCollection,
  SecurityAdminRule
} from "@microsoft/terraform-cdk-constructs/azure-virtualnetworkmanager";

const app = new App();
const stack = new TerraformStack(app, "avnm-complete-example");

// Configure provider
new AzapiProvider(stack, "azapi", {});

// Create resource group
const resourceGroup = new ResourceGroup(stack, "rg", {
  name: "rg-network-management",
  location: "eastus",
  tags: {
    Environment: "Production",
    ManagedBy: "Terraform"
  }
});

// =============================================================================
// CREATE VIRTUAL NETWORKS
// =============================================================================

// Hub VNet
const hubVnet = new VirtualNetwork(stack, "hub-vnet", {
  name: "vnet-hub-eastus",
  location: resourceGroup.props.location!,
  resourceGroupId: resourceGroup.id,
  addressSpace: { addressPrefixes: ["10.0.0.0/16"] }
});

new Subnet(stack, "hub-subnet", {
  name: "subnet-gateway",
  resourceGroupId: resourceGroup.id,
  virtualNetworkName: hubVnet.props.name!,
  virtualNetworkId: hubVnet.id,
  addressPrefix: "10.0.1.0/24"
});

// Production Spoke VNet
const prodVnet = new VirtualNetwork(stack, "prod-vnet", {
  name: "vnet-prod-eastus",
  location: resourceGroup.props.location!,
  resourceGroupId: resourceGroup.id,
  addressSpace: { addressPrefixes: ["10.1.0.0/16"] },
  tags: { Environment: "Production" }
});

new Subnet(stack, "prod-subnet", {
  name: "subnet-app",
  resourceGroupId: resourceGroup.id,
  virtualNetworkName: prodVnet.props.name!,
  virtualNetworkId: prodVnet.id,
  addressPrefix: "10.1.1.0/24"
});

// Staging VNet
const stagingVnet = new VirtualNetwork(stack, "staging-vnet", {
  name: "vnet-staging-eastus",
  location: resourceGroup.props.location!,
  resourceGroupId: resourceGroup.id,
  addressSpace: { addressPrefixes: ["10.2.0.0/16"] },
  tags: { Environment: "Staging" }
});

new Subnet(stack, "staging-subnet", {
  name: "subnet-app",
  resourceGroupId: resourceGroup.id,
  virtualNetworkName: stagingVnet.props.name!,
  virtualNetworkId: stagingVnet.id,
  addressPrefix: "10.2.1.0/24"
});

// =============================================================================
// CREATE VIRTUAL NETWORK MANAGER
// =============================================================================

const networkManager = new VirtualNetworkManager(stack, "vnm", {
  name: "vnm-enterprise",
  location: resourceGroup.props.location!,
  resourceGroupName: resourceGroup.props.name!,
  networkManagerScopes: {
    subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"]
  },
  networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
  description: "Enterprise network management for production workloads",
  tags: {
    Environment: "Production",
    Purpose: "Network-Management"
  }
});

// =============================================================================
// CREATE NETWORK GROUPS (Using both patterns)
// =============================================================================

// Production group using convenience method
const productionGroup = networkManager.addNetworkGroup("prod-group", {
  name: "ng-production",
  description: "Production virtual networks",
  memberType: "VirtualNetwork"
});

// Staging group using convenience method
const stagingGroup = networkManager.addNetworkGroup("staging-group", {
  name: "ng-staging",
  description: "Staging virtual networks",
  memberType: "VirtualNetwork"
});

// Hub group using direct instantiation
const hubGroup = new NetworkGroup(stack, "hub-group", {
  name: "ng-hub",
  networkManagerId: networkManager.id,
  description: "Hub virtual network",
  memberType: "VirtualNetwork"
});

// =============================================================================
// ADD VNETS TO GROUPS
// =============================================================================

new NetworkGroupStaticMember(stack, "prod-vnet-member", {
  name: "member-prod-vnet",
  networkGroupId: productionGroup.id,
  resourceId: prodVnet.id
});

new NetworkGroupStaticMember(stack, "staging-vnet-member", {
  name: "member-staging-vnet",
  networkGroupId: stagingGroup.id,
  resourceId: stagingVnet.id
});

new NetworkGroupStaticMember(stack, "hub-vnet-member", {
  name: "member-hub-vnet",
  networkGroupId: hubGroup.id,
  resourceId: hubVnet.id
});

// =============================================================================
// CREATE CONNECTIVITY CONFIGURATIONS
// =============================================================================

// Hub-spoke for production
networkManager.addConnectivityConfiguration("hub-spoke-prod", {
  name: "conn-hub-spoke-production",
  connectivityTopology: "HubAndSpoke",
  description: "Hub-spoke topology for production with gateway transit",
  appliesToGroups: [
    {
      networkGroupId: productionGroup.id,
      useHubGateway: true,
      isGlobal: false
    }
  ],
  hubs: [
    {
      resourceId: hubVnet.id,
      resourceType: "Microsoft.Network/virtualNetworks"
    }
  ],
  deleteExistingPeering: true
});

// Mesh for non-production
new ConnectivityConfiguration(stack, "mesh-nonprod", {
  name: "conn-mesh-nonprod",
  networkManagerId: networkManager.id,
  connectivityTopology: "Mesh",
  description: "Mesh connectivity for staging environments",
  appliesToGroups: [
    {
      networkGroupId: stagingGroup.id,
      groupConnectivity: "DirectlyConnected",
      isGlobal: false
    }
  ],
  deleteExistingPeering: true,
  isGlobal: false
});

// =============================================================================
// CREATE SECURITY ADMIN CONFIGURATION
// =============================================================================

const securityConfig = networkManager.addSecurityAdminConfiguration("security", {
  name: "sec-org-policies",
  description: "Organization-wide security policies and controls"
});

// =============================================================================
// CREATE RULE COLLECTIONS
// =============================================================================

// Collection for blocking high-risk ports
const blockHighRiskPorts = new SecurityAdminRuleCollection(stack, "block-ports", {
  name: "rc-block-high-risk-ports",
  securityAdminConfigurationId: securityConfig.id,
  description: "Block SSH, RDP, and database ports from internet",
  appliesToGroups: [
    { networkGroupId: productionGroup.id },
    { networkGroupId: stagingGroup.id }
  ]
});

// Collection for mandatory allows
const mandatoryAllows = new SecurityAdminRuleCollection(stack, "mandatory-allows", {
  name: "rc-mandatory-allows",
  securityAdminConfigurationId: securityConfig.id,
  description: "Always allow monitoring and security scanner traffic",
  appliesToGroups: [
    { networkGroupId: productionGroup.id },
    { networkGroupId: stagingGroup.id },
    { networkGroupId: hubGroup.id }
  ]
});

// =============================================================================
// CREATE SECURITY ADMIN RULES
// =============================================================================

// Block SSH from internet (Deny action)
new SecurityAdminRule(stack, "block-ssh", {
  name: "rule-block-ssh",
  ruleCollectionId: blockHighRiskPorts.id,
  description: "Block SSH access from internet",
  priority: 100,
  action: "Deny",
  direction: "Inbound",
  protocol: "Tcp",
  destinationPortRanges: ["22"],
  sources: [
    { addressPrefix: "Internet", addressPrefixType: "ServiceTag" }
  ],
  destinations: [
    { addressPrefix: "*", addressPrefixType: "IPPrefix" }
  ]
});

// Block RDP from internet (Deny action)
new SecurityAdminRule(stack, "block-rdp", {
  name: "rule-block-rdp",
  ruleCollectionId: blockHighRiskPorts.id,
  description: "Block RDP access from internet",
  priority: 110,
  action: "Deny",
  direction: "Inbound",
  protocol: "Tcp",
  destinationPortRanges: ["3389"],
  sources: [
    { addressPrefix: "Internet", addressPrefixType: "ServiceTag" }
  ],
  destinations: [
    { addressPrefix: "*", addressPrefixType: "IPPrefix" }
  ]
});

// Block database ports from internet (Deny action)
new SecurityAdminRule(stack, "block-databases", {
  name: "rule-block-databases",
  ruleCollectionId: blockHighRiskPorts.id,
  description: "Block direct database access from internet",
  priority: 120,
  action: "Deny",
  direction: "Inbound",
  protocol: "Tcp",
  destinationPortRanges: ["1433", "3306", "5432"],
  sources: [
    { addressPrefix: "Internet", addressPrefixType: "ServiceTag" }
  ],
  destinations: [
    { addressPrefix: "*", addressPrefixType: "IPPrefix" }
  ]
});

// Always allow monitoring traffic (AlwaysAllow action)
new SecurityAdminRule(stack, "always-allow-monitoring", {
  name: "rule-always-allow-monitoring",
  ruleCollectionId: mandatoryAllows.id,
  description: "Always allow monitoring traffic - cannot be blocked by NSG",
  priority: 50,
  action: "AlwaysAllow",
  direction: "Inbound",
  protocol: "Any",
  sourcePortRanges: ["*"],
  destinationPortRanges: ["*"],
  sources: [
    { addressPrefix: "10.255.0.0/24", addressPrefixType: "IPPrefix" }
  ],
  destinations: [
    { addressPrefix: "*", addressPrefixType: "IPPrefix" }
  ]
});

// Allow HTTPS traffic (Allow action - NSG can override)
new SecurityAdminRule(stack, "allow-https", {
  name: "rule-allow-https",
  ruleCollectionId: mandatoryAllows.id,
  description: "Allow HTTPS traffic - NSG can still deny if needed",
  priority: 200,
  action: "Allow",
  direction: "Inbound",
  protocol: "Tcp",
  destinationPortRanges: ["443"],
  sources: [
    { addressPrefix: "*", addressPrefixType: "IPPrefix" }
  ],
  destinations: [
    { addressPrefix: "*", addressPrefixType: "IPPrefix" }
  ]
});

app.synth();
```

This example demonstrates:
1. **Network Manager Setup**: Creating a manager with subscription scope
2. **Network Groups**: Using both convenience methods and direct instantiation
3. **Static Members**: Adding specific VNets to groups
4. **Connectivity**: Both hub-spoke and mesh topologies
5. **Security**: Complete security admin configuration with multiple rule types
6. **Best Practices**: Organized structure with clear separation of concerns

## Troubleshooting

### Common Issues

1. **Scope Configuration Errors**: Ensure at least one of `managementGroups` or `subscriptions` is specified in `networkManagerScopes`.

2. **Permission Issues**: Ensure your Azure service principal has the appropriate permissions:
   - `Network Contributor` role on the resource group
   - Appropriate permissions on target subscriptions or management groups

3. **API Version Errors**: If you encounter API version errors, verify the version is supported (2024-05-01 or 2023-11-01).

4. **Naming Conflicts**: Virtual Network Manager names must be unique within a resource group. Use descriptive, unique names.

5. **Feature Availability**: Some features like Routing configurations require API version 2024-05-01 or later.

## Related Constructs

- [`ResourceGroup`](../azure-resourcegroup/README.md) - Azure Resource Groups
- [`VirtualNetwork`](../azure-virtualnetwork/README.md) - Azure Virtual Networks
- [`NetworkSecurityGroup`](../azure-networksecuritygroup/README.md) - Network Security Groups

## Additional Resources

### Azure Documentation

- [Azure Virtual Network Manager Overview](https://learn.microsoft.com/en-us/azure/virtual-network-manager/)
- [Network Groups](https://learn.microsoft.com/en-us/azure/virtual-network-manager/concept-network-groups)
- [Connectivity Configurations](https://learn.microsoft.com/en-us/azure/virtual-network-manager/concept-connectivity-configuration)
- [Security Admin Rules](https://learn.microsoft.com/en-us/azure/virtual-network-manager/concept-security-admins)
- [Hub-and-Spoke Topology](https://learn.microsoft.com/en-us/azure/virtual-network-manager/concept-connectivity-configuration#hub-and-spoke-topology)
- [Mesh Topology](https://learn.microsoft.com/en-us/azure/virtual-network-manager/concept-connectivity-configuration#mesh-topology)

### API References

- [Azure Virtual Network Manager REST API](https://learn.microsoft.com/en-us/rest/api/networkmanager/)
- [Network Groups API](https://learn.microsoft.com/en-us/rest/api/networkmanager/network-groups)
- [Connectivity Configurations API](https://learn.microsoft.com/en-us/rest/api/networkmanager/connectivity-configurations)
- [Security Admin Configurations API](https://learn.microsoft.com/en-us/rest/api/networkmanager/security-admin-configurations)

### Terraform & CDK

- [Terraform CDK Documentation](https://developer.hashicorp.com/terraform/cdktf)
- [Azure AZAPI Provider Documentation](https://registry.terraform.io/providers/Azure/azapi/latest/docs)

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.