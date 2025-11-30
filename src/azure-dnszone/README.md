# Azure DNS Zone Construct (AZAPI)

This Construct represents a DNS Zone in Azure using the AZAPI provider for direct Azure REST API access.

## What is Azure DNS Zone?

Azure DNS is a hosting service for DNS domains that provides name resolution using Microsoft Azure infrastructure. DNS zones are containers for DNS records for a particular domain. Azure DNS supports both public DNS zones (accessible from the Internet) and private DNS zones (accessible only from specified virtual networks).

**Key Features:**
- Host your DNS domain on Azure's global anycast network
- Manage DNS records using Azure tools and APIs
- Support for both public and private DNS zones
- Integration with Azure virtual networks for private DNS
- High availability and fast DNS responses
- Support for DNSSEC (coming soon)
- Built-in DDoS protection

You can learn more about Azure DNS in the [official Azure documentation](https://docs.microsoft.com/azure/dns/dns-overview).

## AZAPI Provider Benefits

This DNS Zone construct uses the AZAPI provider, which provides:

- **Direct Azure REST API Access**: No dependency on AzureRM provider limitations
- **Immediate Feature Access**: Get new Azure features as soon as they're available
- **Version-Specific Implementations**: Support for multiple API versions
- **Enhanced Type Safety**: Better IDE support and compile-time validation

## Best Practices

### Public DNS Zones
- **Use descriptive names**: DNS zone names should match your domain (e.g., `contoso.com`)
- **Configure at registrar**: Update your domain registrar with Azure DNS name servers
- **Monitor DNS queries**: Use diagnostic settings to track DNS usage and issues
- **Implement tags**: Tag DNS zones for cost management and organization
- **Plan for TTL**: Consider Time To Live (TTL) values for your DNS records

### Private DNS Zones
- **Link to virtual networks**: Associate private DNS zones with your Azure virtual networks
- **Use for internal services**: Ideal for internal application communication
- **Consider auto-registration**: Enable VM hostname auto-registration when appropriate
- **Plan network topology**: Design DNS resolution strategy for hub-spoke or complex networks

## Properties

This Construct supports the following properties:

### Required Properties
- **`name`**: (Required) The name of the DNS Zone (without a terminating dot). Must be a valid domain name.
- **`location`**: (Required) The Azure region (typically "global" for DNS zones as they are global resources)

### Optional Properties
- **`resourceGroupId`**: (Optional) The resource ID of the resource group where the DNS zone will be created
- **`zoneType`**: (Optional) The type of DNS zone: "Public" (default) or "Private"
- **`registrationVirtualNetworks`**: (Optional) Array of virtual network references that register hostnames (Private zones only)
- **`resolutionVirtualNetworks`**: (Optional) Array of virtual network references that resolve DNS records (Private zones only)
- **`tags`**: (Optional) Key-value pairs for resource tagging and organization
- **`ignoreChanges`**: (Optional) Lifecycle rules to ignore changes for specific properties
- **`apiVersion`**: (Optional) Explicit API version to use (defaults to latest: "2018-05-01")

## Supported API Versions

| API Version | Status  | Features                                          |
|-------------|---------|---------------------------------------------------|
| 2018-05-01  | ✅ Latest | Full support for public and private DNS zones    |

## Basic Usage

### Public DNS Zone

```typescript
import { DnsZone } from "@microsoft/terraform-cdk-constructs/azure-dnszone";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";

// Create a resource group
const resourceGroup = new ResourceGroup(this, 'rg', {
  name: 'dns-rg',
  location: 'eastus',
});

// Create a public DNS zone
const dnsZone = new DnsZone(this, 'publicDns', {
  name: 'contoso.com',
  location: 'global',
  resourceGroupId: resourceGroup.id,
  tags: {
    environment: 'production',
    service: 'dns',
  },
});

// Access name servers for domain registrar configuration
console.log('Configure these name servers at your domain registrar:');
console.log(dnsZone.nameServers);
```

### Private DNS Zone

```typescript
import { DnsZone } from "@microsoft/terraform-cdk-constructs/azure-dnszone";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { VirtualNetwork } from "@microsoft/terraform-cdk-constructs/azure-virtualnetwork";

const resourceGroup = new ResourceGroup(this, 'rg', {
  name: 'dns-rg',
  location: 'eastus',
});

const vnet = new VirtualNetwork(this, 'vnet', {
  name: 'my-vnet',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  addressSpace: ['10.0.0.0/16'],
});

// Create a private DNS zone linked to virtual network
const privateDnsZone = new DnsZone(this, 'privateDns', {
  name: 'internal.contoso.com',
  location: 'global',
  resourceGroupId: resourceGroup.id,
  zoneType: 'Private',
  registrationVirtualNetworks: [
    { id: vnet.id }
  ],
  tags: {
    environment: 'production',
    type: 'private',
  },
});
```

## Advanced Features

### Version Pinning

Pin to a specific API version for stability:

```typescript
const dnsZone = new DnsZone(this, 'dns', {
  name: 'contoso.com',
  location: 'global',
  resourceGroupId: resourceGroup.id,
  apiVersion: '2018-05-01', // Pin to specific version
});
```

### Ignore Changes

Prevent Terraform from detecting changes to specific properties:

```typescript
const dnsZone = new DnsZone(this, 'dns', {
  name: 'contoso.com',
  location: 'global',
  resourceGroupId: resourceGroup.id,
  ignoreChanges: ['tags'], // Ignore tag changes
});
```

### Multiple Virtual Network Links (Private DNS)

Link a private DNS zone to multiple virtual networks:

```typescript
const privateDnsZone = new DnsZone(this, 'privateDns', {
  name: 'internal.contoso.com',
  location: 'global',
  resourceGroupId: resourceGroup.id,
  zoneType: 'Private',
  registrationVirtualNetworks: [
    { id: hubVnet.id },
  ],
  resolutionVirtualNetworks: [
    { id: spoke1Vnet.id },
    { id: spoke2Vnet.id },
  ],
});
```

### Tag Management

Add and remove tags programmatically:

```typescript
const dnsZone = new DnsZone(this, 'dns', {
  name: 'contoso.com',
  location: 'global',
  resourceGroupId: resourceGroup.id,
  tags: {
    environment: 'production',
  },
});

// Add a tag
dnsZone.addTag('owner', 'platform-team');

// Remove a tag
dnsZone.removeTag('environment');
```

## Outputs

The DNS Zone construct provides several outputs for use in other resources:

```typescript
// Resource ID
console.log(dnsZone.id);

// DNS Zone name
console.log(dnsZone.name);

// Location
console.log(dnsZone.location);

// Name servers (for domain registrar configuration)
console.log(dnsZone.nameServers);

// Maximum number of record sets
console.log(dnsZone.maxNumberOfRecordSets);

// Current number of record sets
console.log(dnsZone.numberOfRecordSets);

// Zone type
console.log(dnsZone.zoneType); // "Public" or "Private"

// Terraform outputs
dnsZone.idOutput;           // Terraform output for ID
dnsZone.nameOutput;         // Terraform output for name
dnsZone.nameServersOutput;  // Terraform output for name servers
```

## Configuring Your Domain

After creating a public DNS zone, you need to configure your domain registrar to use Azure DNS name servers:

1. Get the name servers from your DNS zone:
   ```typescript
   console.log(dnsZone.nameServers);
   ```

2. Update your domain's name server records at your registrar with the Azure DNS name servers (typically 4 name servers like `ns1-01.azure-dns.com`)

3. Wait for DNS propagation (can take up to 48 hours, but usually much faster)

4. Verify the delegation using DNS tools:
   ```bash
   nslookup -type=NS contoso.com
   ```

## Common Patterns

### Hub-Spoke Topology with Private DNS

```typescript
// Create hub virtual network and private DNS zone
const hubVnet = new VirtualNetwork(this, 'hub', {
  name: 'hub-vnet',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  addressSpace: ['10.0.0.0/16'],
});

const privateDnsZone = new DnsZone(this, 'privateDns', {
  name: 'internal.contoso.com',
  location: 'global',
  resourceGroupId: resourceGroup.id,
  zoneType: 'Private',
  registrationVirtualNetworks: [
    { id: hubVnet.id }
  ],
});

// Spoke networks can resolve DNS through peering
const spoke1Vnet = new VirtualNetwork(this, 'spoke1', {
  name: 'spoke1-vnet',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  addressSpace: ['10.1.0.0/16'],
});
```

### Multi-Environment DNS Strategy

```typescript
// Production
const prodDnsZone = new DnsZone(this, 'prodDns', {
  name: 'contoso.com',
  location: 'global',
  resourceGroupId: prodResourceGroup.id,
  tags: { environment: 'production' },
});

// Staging
const stagingDnsZone = new DnsZone(this, 'stagingDns', {
  name: 'staging.contoso.com',
  location: 'global',
  resourceGroupId: stagingResourceGroup.id,
  tags: { environment: 'staging' },
});

// Development
const devDnsZone = new DnsZone(this, 'devDns', {
  name: 'dev.contoso.com',
  location: 'global',
  resourceGroupId: devResourceGroup.id,
  tags: { environment: 'development' },
});
```

## Error Handling

The construct includes built-in validation:

```typescript
// Invalid domain name (will fail validation)
const dnsZone = new DnsZone(this, 'dns', {
  name: 'contoso.com.', // ❌ No terminating dot allowed
  location: 'global',
  resourceGroupId: resourceGroup.id,
});

// Valid domain name
const dnsZone = new DnsZone(this, 'dns', {
  name: 'contoso.com', // ✅ Correct format
  location: 'global',
  resourceGroupId: resourceGroup.id,
});
```

## Troubleshooting

### Name Server Propagation
If DNS queries aren't working:
1. Verify name servers are correctly configured at your registrar
2. Check DNS propagation: `dig NS contoso.com` or use online tools
3. Ensure sufficient time has passed for propagation (up to 48 hours)

### Private DNS Resolution
If private DNS isn't resolving:
1. Verify virtual network links are correctly configured
2. Check that VMs are using Azure DNS (168.63.129.16)
3. Ensure virtual network peering is properly set up
4. Verify NSG rules aren't blocking DNS traffic

### API Version Issues
If you encounter version-related errors:
1. Check supported API versions in this README
2. Consider pinning to a specific version
3. Review Azure DNS API documentation for breaking changes

## Related Constructs

- **DNS Record Sets**: Use separate constructs for A, AAAA, CNAME, MX, TXT, and other DNS records
- **Virtual Network**: Required for private DNS zones
- **Resource Group**: Container for DNS zone resources

## References

- [Azure DNS Documentation](https://docs.microsoft.com/azure/dns/)
- [Azure DNS REST API Reference](https://docs.microsoft.com/rest/api/dns/)
- [DNS Zone Best Practices](https://docs.microsoft.com/azure/dns/dns-best-practices)
- [Private DNS Documentation](https://docs.microsoft.com/azure/dns/private-dns-overview)