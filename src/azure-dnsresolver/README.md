# Azure DNS Private Resolver

This module provides CDK constructs for creating and managing Azure DNS Private Resolvers and their child resources (Inbound and Outbound Endpoints). DNS Private Resolvers enable hybrid DNS scenarios, allowing conditional forwarding between Azure, on-premises networks, and other cloud providers.

## Overview

Azure DNS Private Resolvers provide DNS resolution for resources in Azure virtual networks and enable hybrid DNS connectivity. They act as a bridge between Azure-hosted DNS zones and on-premises or external DNS servers.

### Key Components

1. **DNS Resolver** - The parent resource that manages DNS resolution
2. **Inbound Endpoints** - Allow external DNS servers to query Azure-hosted DNS zones
3. **Outbound Endpoints** - Allow Azure resources to forward DNS queries to external DNS servers

### Use Cases

- **Hybrid DNS Resolution**: Resolve DNS queries between Azure and on-premises networks
- **Conditional Forwarding**: Forward specific DNS queries to designated DNS servers
- **Multi-Cloud DNS**: Integrate DNS resolution across Azure and other cloud providers
- **Private DNS Zones**: Work seamlessly with Azure Private DNS zones for internal name resolution

## Installation

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Quick Start

### Complete Hybrid DNS Setup

```typescript
import {
  DnsResolver,
  DnsResolverInboundEndpoint,
  DnsResolverOutboundEndpoint,
} from "@microsoft/terraform-cdk-constructs/azure-dnsresolver";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { VirtualNetwork } from "@microsoft/terraform-cdk-constructs/azure-virtualnetwork";
import { Subnet } from "@microsoft/terraform-cdk-constructs/azure-subnet";

// Create resource group
const resourceGroup = new ResourceGroup(this, "rg", {
  name: "dns-resolver-rg",
  location: "eastus",
});

// Create virtual network
const vnet = new VirtualNetwork(this, "vnet", {
  name: "dns-resolver-vnet",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ["10.0.0.0/16"],
  },
});

// Create dedicated subnets with delegation
const inboundSubnet = new Subnet(this, "inbound-subnet", {
  name: "inbound-subnet",
  virtualNetworkName: vnet.name,
  virtualNetworkId: vnet.id,
  resourceGroupId: resourceGroup.id,
  addressPrefix: "10.0.1.0/28",
  delegations: [{
    name: "Microsoft.Network.dnsResolvers",
    serviceName: "Microsoft.Network/dnsResolvers",
  }],
});

const outboundSubnet = new Subnet(this, "outbound-subnet", {
  name: "outbound-subnet",
  virtualNetworkName: vnet.name,
  virtualNetworkId: vnet.id,
  resourceGroupId: resourceGroup.id,
  addressPrefix: "10.0.2.0/28",
  delegations: [{
    name: "Microsoft.Network.dnsResolvers",
    serviceName: "Microsoft.Network/dnsResolvers",
  }],
});

// Create DNS Resolver
const dnsResolver = new DnsResolver(this, "resolver", {
  name: "my-dns-resolver",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  virtualNetworkId: vnet.id,
});

// Create Inbound Endpoint (for on-premises to Azure queries)
const inboundEndpoint = new DnsResolverInboundEndpoint(this, "inbound", {
  name: "my-inbound-endpoint",
  location: "eastus",
  dnsResolverId: dnsResolver.id,
  subnetId: inboundSubnet.id,
  privateIpAddress: "10.0.1.4",
  privateIpAllocationMethod: "Static",
});

// Create Outbound Endpoint (for Azure to on-premises queries)
const outboundEndpoint = new DnsResolverOutboundEndpoint(this, "outbound", {
  name: "my-outbound-endpoint",
  location: "eastus",
  dnsResolverId: dnsResolver.id,
  subnetId: outboundSubnet.id,
});
```

## DNS Resolver

The DNS Resolver is the parent resource that manages DNS resolution for a virtual network.

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | DNS Resolver name (1-80 characters) |
| `location` | string | Yes | Azure region |
| `virtualNetworkId` | string | Yes | Resource ID of the virtual network |
| `resourceGroupId` | string | No | Resource group ID |
| `tags` | object | No | Resource tags |
| `apiVersion` | string | No | API version (default: 2022-07-01) |

### Example

```typescript
const dnsResolver = new DnsResolver(this, "resolver", {
  name: "my-dns-resolver",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  virtualNetworkId: vnet.id,
  tags: {
    environment: "production",
    purpose: "hybrid-dns",
  },
});

// Access resolver properties
console.log(`Resolver ID: ${dnsResolver.id}`);
console.log(`Resolver State: ${dnsResolver.dnsResolverState}`);
```

## Inbound Endpoints

Inbound Endpoints allow external DNS servers (such as on-premises DNS servers) to query Azure-hosted DNS zones through the DNS Resolver.

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Endpoint name (1-80 characters) |
| `location` | string | Yes | Azure region (must match resolver) |
| `dnsResolverId` | string | Yes | Parent DNS Resolver resource ID |
| `subnetId` | string | Yes | Dedicated subnet resource ID |
| `privateIpAddress` | string | No | Static IP address |
| `privateIpAllocationMethod` | string | No | "Static" or "Dynamic" (default: Dynamic) |
| `tags` | object | No | Resource tags |

### Examples

#### Dynamic IP Allocation

```typescript
const inboundEndpoint = new DnsResolverInboundEndpoint(this, "inbound", {
  name: "my-inbound-endpoint",
  location: "eastus",
  dnsResolverId: dnsResolver.id,
  subnetId: inboundSubnet.id,
});

// Access endpoint properties
console.log(`Inbound IP: ${inboundEndpoint.privateIpAddress}`);
```

#### Static IP Allocation

```typescript
const inboundEndpoint = new DnsResolverInboundEndpoint(this, "inbound", {
  name: "my-inbound-endpoint",
  location: "eastus",
  dnsResolverId: dnsResolver.id,
  subnetId: inboundSubnet.id,
  privateIpAddress: "10.0.1.4",
  privateIpAllocationMethod: "Static",
  tags: {
    environment: "production",
    ipAddress: "10.0.1.4",
  },
});
```

### Use Case: On-Premises to Azure DNS Resolution

1. Create an Inbound Endpoint with a static IP
2. Configure on-premises DNS servers to forward queries to the inbound endpoint IP
3. On-premises resources can now resolve Azure Private DNS zones

## Outbound Endpoints

Outbound Endpoints enable Azure resources to forward DNS queries to external DNS servers such as on-premises DNS servers.

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Endpoint name (1-80 characters) |
| `location` | string | Yes | Azure region (must match resolver) |
| `dnsResolverId` | string | Yes | Parent DNS Resolver resource ID |
| `subnetId` | string | Yes | Dedicated subnet resource ID |
| `tags` | object | No | Resource tags |

### Example

```typescript
const outboundEndpoint = new DnsResolverOutboundEndpoint(this, "outbound", {
  name: "my-outbound-endpoint",
  location: "eastus",
  dnsResolverId: dnsResolver.id,
  subnetId: outboundSubnet.id,
  tags: {
    environment: "production",
    purpose: "conditional-forwarding",
  },
});

// Access endpoint properties
console.log(`Outbound Endpoint ID: ${outboundEndpoint.id}`);
console.log(`Resource GUID: ${outboundEndpoint.resourceGuid}`);
```

### Use Case: Azure to On-Premises DNS Resolution

1. Create an Outbound Endpoint
2. Create forwarding rules to send specific DNS queries to on-premises DNS servers
3. Azure resources can now resolve on-premises hostnames

## Subnet Requirements

All DNS Resolver components require dedicated subnets with specific configuration:

### Requirements

- **Size**: Between /28 (16 addresses) and /24 (256 addresses)
- **Delegation**: Must be delegated to `Microsoft.Network/dnsResolvers`
- **Dedicated**: Cannot be shared with other resources
- **Location**: Must be in the same VNet as the DNS Resolver

### Subnet Configuration Example

```typescript
const subnet = new Subnet(this, "dns-resolver-subnet", {
  name: "dns-resolver-subnet",
  virtualNetworkName: vnet.name,
  virtualNetworkId: vnet.id,
  resourceGroupId: resourceGroup.id,
  addressPrefix: "10.0.1.0/28", // Minimum /28 subnet
  delegations: [
    {
      name: "Microsoft.Network.dnsResolvers",
      serviceName: "Microsoft.Network/dnsResolvers",
      actions: ["Microsoft.Network/virtualNetworks/subnets/join/action"],
    },
  ],
});
```

## Hybrid DNS Scenarios

### Scenario 1: Bidirectional DNS Resolution

Enable DNS resolution in both directions between Azure and on-premises:

```typescript
// Create inbound endpoint for on-prem → Azure queries
const inboundEndpoint = new DnsResolverInboundEndpoint(this, "inbound", {
  name: "bidirectional-inbound",
  location: "eastus",
  dnsResolverId: dnsResolver.id,
  subnetId: inboundSubnet.id,
  privateIpAddress: "10.0.1.4",
  privateIpAllocationMethod: "Static",
});

// Create outbound endpoint for Azure → on-prem queries
const outboundEndpoint = new DnsResolverOutboundEndpoint(this, "outbound", {
  name: "bidirectional-outbound",
  location: "eastus",
  dnsResolverId: dnsResolver.id,
  subnetId: outboundSubnet.id,
});

// Configure on-premises DNS to forward to 10.0.1.4
// Configure forwarding rules for outbound endpoint
```

### Scenario 2: Multi-Region DNS Resolution

Deploy DNS Resolvers in multiple regions for high availability:

```typescript
const regions = ["eastus", "westus"];

regions.forEach(region => {
  const regionalResolver = new DnsResolver(this, `resolver-${region}`, {
    name: `dns-resolver-${region}`,
    location: region,
    resourceGroupId: resourceGroup.id,
    virtualNetworkId: regionalVnets[region].id,
  });
  
  // Create endpoints for each region
  // ...
});
```

### Scenario 3: Conditional Forwarding

Route different DNS queries to different DNS servers using outbound endpoints and forwarding rules.

## Best Practices

### Network Design

1. **Dedicated Subnets**: Always use dedicated subnets for DNS Resolver components
2. **Subnet Sizing**: Use at least /28 for flexibility
3. **Network Security**: Apply NSG rules to allow DNS traffic (port 53 TCP/UDP)
4. **High Availability**: Deploy in regions with availability zones

### DNS Architecture

1. **Centralized Resolver**: Deploy one DNS Resolver per region for multiple VNets
2. **VNet Peering**: Use VNet peering to share resolvers across VNets
3. **Naming Convention**: Use descriptive names indicating purpose and region
4. **Monitoring**: Monitor resolver state and set up alerts

### Security

1. **Private Endpoints**: Keep traffic within Azure backbone
2. **Access Control**: Restrict subnet access using NSGs
3. **Logging**: Enable diagnostic settings for DNS query tracking

### Performance

1. **Regional Deployment**: Deploy resolvers close to workloads
2. **Static IPs**: Use static IPs for inbound endpoints for predictable addressing
3. **Multiple Endpoints**: Create multiple inbound endpoints for load distribution

## API Versions

| Version | Status | Release Date | Notes |
|---------|--------|--------------|-------|
| 2022-07-01 | Active (Latest) | July 2022 | Stable release with full feature support |

All constructs support automatic latest version resolution and explicit version pinning.

## Resource Limits

- **DNS Resolvers**: Up to 15 per subscription per region
- **Inbound Endpoints**: Multiple per DNS Resolver
- **Outbound Endpoints**: Multiple per DNS Resolver
- **Subnet Size**: /28 to /24

## Troubleshooting

### DNS Resolver State is "Disconnected"

**Cause**: Network connectivity issues or subnet misconfiguration

**Solution**:
- Verify subnet delegation is correctly configured
- Check NSG rules allow DNS traffic (port 53 TCP/UDP)
- Ensure VNet has proper connectivity
- Review subnet size meets minimum /28 requirement

### Cannot Create DNS Resolver

**Cause**: Subnet not properly delegated or already in use

**Solution**:
- Verify subnet has delegation to `Microsoft.Network/dnsResolvers`
- Ensure subnet is not used by other resources
- Check subnet size is between /28 and /24
- Verify you haven't reached the 15 resolvers per region limit

### DNS Queries Not Resolving

**Cause**: Missing endpoints or incorrect configuration

**Solution**:
- Verify appropriate endpoints are created (inbound for external queries, outbound for Azure queries)
- Check forwarding rules are configured for outbound endpoints
- Ensure on-premises DNS is forwarding to correct inbound endpoint IP
- Verify NSG rules allow DNS traffic

## Related Resources

- [Azure Private DNS Zones](../azure-privatednszone/README.md)
- [Private DNS Zone Links](../azure-privatednszonelink/README.md)
- [Virtual Networks](../azure-virtualnetwork/README.md)
- [Subnets](../azure-subnet/README.md)

## References

- [Azure DNS Private Resolver Documentation](https://docs.microsoft.com/azure/dns/dns-private-resolver-overview)
- [DNS Resolver Architecture](https://docs.microsoft.com/azure/dns/private-resolver-architecture)
- [Hybrid DNS Resolution](https://docs.microsoft.com/azure/dns/private-resolver-hybrid-dns)
- [DNS Resolver API Reference](https://docs.microsoft.com/rest/api/dns/dnsresolvers)