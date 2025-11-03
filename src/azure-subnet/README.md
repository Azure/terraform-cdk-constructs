# Azure Subnet Construct

This construct provides a type-safe, version-aware interface for managing Azure Subnets using the Azure API (azapi) provider in Terraform CDK.

## Features

- **Multi-Version Support**: Supports the three most recent stable API versions (2025-01-01, 2024-10-01, 2024-07-01)
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Parent-Child Relationship**: Properly models the relationship between Virtual Networks and Subnets
- **Flexible Configuration**: Support for advanced networking features including NSGs, route tables, service endpoints, and delegations
- **Property Validation**: Schema-based validation for all subnet properties
- **Version Auto-Resolution**: Automatically resolves to the latest stable API version unless explicitly specified

## Supported API Versions

- `2025-01-01` (default)
- `2024-10-01`
- `2024-07-01`

All versions are sourced from the [Azure REST API specifications](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable).

## Installation

This construct is part of the `@cdktf/terraform-cdk-constructs` package.

```bash
npm install @cdktf/terraform-cdk-constructs
```

## Usage

### Basic Subnet

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@cdktf/terraform-cdk-constructs/core-azure";
import { ResourceGroup } from "@cdktf/terraform-cdk-constructs/azure-resourcegroup";
import { VirtualNetwork } from "@cdktf/terraform-cdk-constructs/azure-virtualnetwork";
import { Subnet } from "@cdktf/terraform-cdk-constructs/azure-subnet";

const app = new App();
const stack = new TerraformStack(app, "subnet-stack");

// Configure the Azure provider
new AzapiProvider(stack, "azapi", {});

// Create a resource group
const resourceGroup = new ResourceGroup(stack, "rg", {
  name: "rg-network",
  location: "eastus",
});

// Create a virtual network
const vnet = new VirtualNetwork(stack, "vnet", {
  name: "vnet-main",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ["10.0.0.0/16"],
  },
});

// Create a subnet within the virtual network
const subnet = new Subnet(stack, "subnet", {
  name: "subnet-app",
  virtualNetworkName: "vnet-main",
  resourceGroupId: resourceGroup.id,
  addressPrefix: "10.0.1.0/24",
});

app.synth();
```

### Subnet with Service Endpoints

```typescript
const subnet = new Subnet(stack, "subnet-storage", {
  name: "subnet-storage",
  virtualNetworkName: "vnet-main",
  resourceGroupId: resourceGroup.id,
  addressPrefix: "10.0.2.0/24",
  serviceEndpoints: [
    {
      service: "Microsoft.Storage",
      locations: ["eastus"],
    },
    {
      service: "Microsoft.Sql",
      locations: ["eastus"],
    },
  ],
});
```

### Subnet with Network Security Group

```typescript
const subnet = new Subnet(stack, "subnet-secure", {
  name: "subnet-secure",
  virtualNetworkName: "vnet-main",
  resourceGroupId: resourceGroup.id,
  addressPrefix: "10.0.3.0/24",
  networkSecurityGroup: {
    id: "/subscriptions/{subscription-id}/resourceGroups/rg-network/providers/Microsoft.Network/networkSecurityGroups/nsg-app",
  },
});
```

### Subnet with Delegation

```typescript
const subnet = new Subnet(stack, "subnet-sql", {
  name: "subnet-sql",
  virtualNetworkName: "vnet-main",
  resourceGroupId: resourceGroup.id,
  addressPrefix: "10.0.4.0/24",
  delegations: [
    {
      name: "sql-delegation",
      serviceName: "Microsoft.Sql/managedInstances",
    },
  ],
});
```

### Multiple Subnets in the Same VNet

```typescript
// Frontend subnet
const frontendSubnet = new Subnet(stack, "subnet-frontend", {
  name: "subnet-frontend",
  virtualNetworkName: "vnet-main",
  resourceGroupId: resourceGroup.id,
  addressPrefix: "10.0.10.0/24",
});

// Backend subnet with service endpoints
const backendSubnet = new Subnet(stack, "subnet-backend", {
  name: "subnet-backend",
  virtualNetworkName: "vnet-main",
  resourceGroupId: resourceGroup.id,
  addressPrefix: "10.0.20.0/24",
  serviceEndpoints: [
    {
      service: "Microsoft.Storage",
      locations: ["eastus"],
    },
  ],
});

// Database subnet with delegation
const dbSubnet = new Subnet(stack, "subnet-database", {
  name: "subnet-database",
  virtualNetworkName: "vnet-main",
  resourceGroupId: resourceGroup.id,
  addressPrefix: "10.0.30.0/24",
  delegations: [
    {
      name: "db-delegation",
      serviceName: "Microsoft.DBforPostgreSQL/flexibleServers",
    },
  ],
});
```

### Subnet with Private Endpoint Policies

```typescript
const subnet = new Subnet(stack, "subnet-private", {
  name: "subnet-private",
  virtualNetworkName: "vnet-main",
  resourceGroupId: resourceGroup.id,
  addressPrefix: "10.0.5.0/24",
  privateEndpointNetworkPolicies: "Disabled",
  privateLinkServiceNetworkPolicies: "Enabled",
});
```

### Using a Specific API Version

```typescript
const subnet = new Subnet(stack, "subnet-versioned", {
  name: "subnet-versioned",
  virtualNetworkName: "vnet-main",
  resourceGroupId: resourceGroup.id,
  apiVersion: "2024-10-01",
  addressPrefix: "10.0.6.0/24",
});
```

## Properties

### Required Properties

- **name** (string): The name of the subnet
- **virtualNetworkName** (string): The name of the parent virtual network
- **resourceGroupId** (string): The resource ID of the resource group containing the virtual network
- **addressPrefix** (string): The address prefix for the subnet in CIDR notation (e.g., "10.0.1.0/24")

### Optional Properties

- **apiVersion** (string): The Azure API version to use (defaults to 2025-01-01)
- **location** (string): The Azure region (inherited from parent VNet if not specified)
- **networkSecurityGroup** (object): Reference to a Network Security Group
  - **id** (string): The resource ID of the NSG
- **routeTable** (object): Reference to a Route Table
  - **id** (string): The resource ID of the route table
- **natGateway** (object): Reference to a NAT Gateway
  - **id** (string): The resource ID of the NAT gateway
- **serviceEndpoints** (array): List of service endpoints to enable
  - **service** (string): The service type (e.g., "Microsoft.Storage", "Microsoft.Sql")
  - **locations** (array): List of locations where the service endpoint is available
- **serviceEndpointPolicies** (array): List of service endpoint policies
  - **id** (string): The resource ID of the service endpoint policy
- **delegations** (array): List of subnet delegations
  - **name** (string): Name of the delegation
  - **serviceName** (string): The service to delegate to (e.g., "Microsoft.Sql/managedInstances")
  - **actions** (array, optional): List of actions allowed by the delegation
- **privateEndpointNetworkPolicies** (string): Enable or disable network policies for private endpoints ("Enabled" or "Disabled")
- **privateLinkServiceNetworkPolicies** (string): Enable or disable network policies for private link services ("Enabled" or "Disabled")
- **applicationGatewayIPConfigurations** (array): IP configurations for application gateway
- **ipAllocations** (array): IP allocation references
- **defaultOutboundAccess** (boolean): Enable or disable default outbound access
- **tags** (object): Resource tags as key-value pairs

## Parent-Child Relationship

Subnets are child resources of Virtual Networks. This relationship is implemented through:

1. **virtualNetworkName**: The name of the parent VNet must be provided
2. **resourceGroupId**: The resource group ID is used to construct the parent VNet's full resource ID
3. **Parent ID Construction**: The construct automatically builds the correct parent resource ID in the format:
   ```
   ${resourceGroupId}/providers/Microsoft.Network/virtualNetworks/${virtualNetworkName}
   ```

This ensures that the subnet is properly created as a child of the specified virtual network.

## Outputs

The construct provides the following outputs:

- **id**: The fully qualified resource ID of the subnet
- **name**: The name of the subnet
- **virtualNetworkId**: The resource ID of the parent virtual network
- **addressPrefix**: The address prefix of the subnet
- **resolvedApiVersion**: The API version being used for this resource

## Best Practices

1. **Address Planning**: Carefully plan your subnet address spaces to avoid overlapping ranges
2. **Service Endpoints**: Enable service endpoints only for the services you need to reduce complexity
3. **Delegations**: Use delegations when hosting specific Azure services that require dedicated subnets
4. **NSG Association**: Consider associating NSGs at the subnet level for centralized security management
5. **Multiple Subnets**: Create separate subnets for different tiers (frontend, backend, database) for better network isolation
6. **Private Endpoints**: Disable network policies when using private endpoints in a subnet
7. **API Version**: Use the latest stable API version unless you have specific compatibility requirements

## Common Delegation Services

- `Microsoft.Sql/managedInstances` - SQL Managed Instances
- `Microsoft.DBforPostgreSQL/flexibleServers` - PostgreSQL Flexible Servers
- `Microsoft.DBforMySQL/flexibleServers` - MySQL Flexible Servers
- `Microsoft.Web/serverFarms` - App Service Plans
- `Microsoft.ContainerInstance/containerGroups` - Container Instances
- `Microsoft.Netapp/volumes` - NetApp Volumes
- `Microsoft.Logic/integrationServiceEnvironments` - Logic Apps ISE

## Resource Type

This construct manages resources of type:
```
Microsoft.Network/virtualNetworks/subnets@{apiVersion}
```

## Related Constructs

- **VirtualNetwork**: Parent resource for subnets
- **NetworkSecurityGroup**: Can be associated with subnets for security rules
- **RouteTable**: Can be associated with subnets for custom routing

## License

This construct is part of the Terraform CDK Constructs project and is licensed under the Mozilla Public License 2.0.

## Contributing

Contributions are welcome! Please see the main project repository for contribution guidelines.