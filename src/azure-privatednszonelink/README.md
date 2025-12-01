# Azure Private DNS Zone Virtual Network Link Construct (AZAPI)

This Construct represents a Virtual Network Link for Azure Private DNS Zones using the AZAPI provider for direct Azure REST API access.

## What is Azure Private DNS Zone Virtual Network Link?

A Virtual Network Link connects a Private DNS Zone to an Azure Virtual Network, enabling DNS resolution from that VNet. Without a virtual network link, the private DNS zone exists but cannot be used by resources in any virtual network.

**Key Features:**
- **Enable DNS Resolution**: Allow VMs in a VNet to resolve private DNS zone records
- **Auto-Registration**: Optionally enable automatic hostname registration for VMs
- **Resolution Policies**: Configure how DNS queries are resolved
- **Cross-VNet Resolution**: Support DNS resolution across peered virtual networks
- **Multiple Links**: Link a single private DNS zone to multiple virtual networks
- **Bidirectional**: VMs can resolve names in the private DNS zone, and optionally register their names

**Use Cases:**
- Connect VNets to private DNS zones for internal name resolution
- Enable automatic VM hostname registration
- Set up hub-spoke DNS resolution topologies
- Configure split-brain DNS scenarios

You can learn more about Virtual Network Links in the [official Azure documentation](https://docs.microsoft.com/azure/dns/private-dns-virtual-network-links).

## AZAPI Provider Benefits

This Virtual Network Link construct uses the AZAPI provider, which provides:

- **Direct Azure REST API Access**: No dependency on AzureRM provider limitations
- **Immediate Feature Access**: Get new Azure features as soon as they're available
- **Child Resource Support**: Properly handles parent-child resource relationships
- **Enhanced Type Safety**: Better IDE support and compile-time validation

## Best Practices

### Virtual Network Linking Strategy
- **Link strategically**: Only link VNets that need DNS resolution from the private DNS zone
- **Minimize links**: Each private DNS zone has limits on the number of VNet links
- **Plan for scale**: Consider the maximum number of links when designing your architecture
- **Use hub-spoke**: In hub-spoke topologies, link to the hub and rely on peering for spoke resolution

### Auto-Registration
- **Enable selectively**: Only enable auto-registration on VNets where VMs should automatically register
- **One registration VNet**: Typically enable auto-registration on only one VNet per private DNS zone
- **DHCP required**: VMs must use DHCP for auto-registration to work
- **Monitor registrations**: Track auto-registered records to prevent conflicts

### Resolution Policies
- **Default policy**: Use "Default" for standard DNS resolution within Azure
- **NxDomainRedirect**: Use "NxDomainRedirect" to fallback to Azure DNS for unresolved queries
- **Consistency**: Use consistent policies across links for predictable behavior

### Security and Compliance
- **Implement RBAC**: Control who can create and manage virtual network links
- **Monitor changes**: Enable diagnostic logging to track link changes
- **Tag appropriately**: Use tags to identify link purpose and ownership

## Properties

This Construct supports the following properties:

### Required Properties
- **`name`**: (Required) The name of the Virtual Network Link. Must be unique within the Private DNS Zone
- **`privateDnsZoneId`**: (Required) The resource ID of the parent Private DNS Zone
- **`virtualNetworkId`**: (Required) The resource ID of the Virtual Network to link

### Optional Properties
- **`location`**: (Optional) The Azure region (typically "global" for VNet links as they are global resources). Default: "global"
- **`registrationEnabled`**: (Optional) Enable auto-registration of VM hostnames. Default: `false`
- **`resolutionPolicy`**: (Optional) Resolution policy for the link. Values: "Default" or "NxDomainRedirect". Default: "Default"
- **`tags`**: (Optional) Key-value pairs for resource tagging and organization
- **`ignoreChanges`**: (Optional) Lifecycle rules to ignore changes for specific properties
- **`apiVersion`**: (Optional) Explicit API version to use (defaults to latest: "2024-06-01")

### Read-Only Properties (Available as Outputs)
- **`provisioningState`**: Current provisioning state of the link
- **`virtualNetworkLinkState`**: State of the virtual network link ("InProgress" or "Completed")

## Supported API Versions

| API Version | Status  | Features                                                |
|-------------|---------|--------------------------------------------------------|
| 2024-06-01  | ✅ Latest | Full support for VNet links with auto-registration and resolution policies |

## Basic Usage

### Simple Virtual Network Link

```typescript
import { PrivateDnsZoneLink } from "@microsoft/terraform-cdk-constructs/azure-privatednszonelink";
import { PrivateDnsZone } from "@microsoft/terraform-cdk-constructs/azure-privatednszone";
import { VirtualNetwork } from "@microsoft/terraform-cdk-constructs/azure-virtualnetwork";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";

// Create a resource group
const resourceGroup = new ResourceGroup(this, 'rg', {
  name: 'dns-rg',
  location: 'eastus',
});

// Create a private DNS zone
const privateDnsZone = new PrivateDnsZone(this, 'privateDns', {
  name: 'internal.contoso.com',
  location: 'global',
  resourceGroupId: resourceGroup.id,
});

// Create a virtual network
const vnet = new VirtualNetwork(this, 'vnet', {
  name: 'my-vnet',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ['10.0.0.0/16'],
  },
});

// Create virtual network link
const link = new PrivateDnsZoneLink(this, 'link', {
  name: 'my-vnet-link',
  location: 'global',
  privateDnsZoneId: privateDnsZone.id,
  virtualNetworkId: vnet.id,
  tags: {
    environment: 'production',
    purpose: 'dns-resolution',
  },
});
```

### Virtual Network Link with Auto-Registration

```typescript
// Create link with auto-registration enabled
const linkWithReg = new PrivateDnsZoneLink(this, 'link-with-reg', {
  name: 'vnet-link-with-registration',
  location: 'global',
  privateDnsZoneId: privateDnsZone.id,
  virtualNetworkId: vnet.id,
  registrationEnabled: true, // Enable automatic VM hostname registration
  tags: {
    auto-registration: 'enabled',
  },
});
```

### Virtual Network Link with Resolution Policy

```typescript
// Create link with NxDomainRedirect resolution policy
const linkWithPolicy = new PrivateDnsZoneLink(this, 'link-with-policy', {
  name: 'vnet-link-with-policy',
  location: 'global',
  privateDnsZoneId: privateDnsZone.id,
  virtualNetworkId: vnet.id,
  resolutionPolicy: 'NxDomainRedirect', // Fallback to Azure DNS for unresolved queries
  tags: {
    policy: 'nxdomain-redirect',
  },
});
```

## Advanced Features

### Version Pinning

Pin to a specific API version for stability:

```typescript
const link = new PrivateDnsZoneLink(this, 'link', {
  name: 'my-vnet-link',
  location: 'global',
  privateDnsZoneId: privateDnsZone.id,
  virtualNetworkId: vnet.id,
  apiVersion: '2024-06-01', // Pin to specific version
});
```

### Ignore Changes

Prevent Terraform from detecting changes to specific properties:

```typescript
const link = new PrivateDnsZoneLink(this, 'link', {
  name: 'my-vnet-link',
  location: 'global',
  privateDnsZoneId: privateDnsZone.id,
  virtualNetworkId: vnet.id,
  ignoreChanges: ['tags'], // Ignore tag changes
});
```

### Tag Management

Add and remove tags programmatically:

```typescript
const link = new PrivateDnsZoneLink(this, 'link', {
  name: 'my-vnet-link',
  location: 'global',
  privateDnsZoneId: privateDnsZone.id,
  virtualNetworkId: vnet.id,
  tags: {
    environment: 'production',
  },
});

// Add a tag
link.addTag('owner', 'platform-team');

// Remove a tag
link.removeTag('environment');
```

## Outputs

The Virtual Network Link construct provides several outputs for use in other resources:

```typescript
// Resource ID
console.log(link.id);

// Virtual Network Link name
console.log(link.name);

// Location
console.log(link.location);

// Virtual Network ID
console.log(link.virtualNetworkId);

// Registration enabled status
console.log(link.registrationEnabled);

// Resolution policy
console.log(link.resolutionPolicy);

// Provisioning state
console.log(link.provisioningState);

// Link state
console.log(link.virtualNetworkLinkState);

// Terraform outputs
link.idOutput;
link.nameOutput;
link.virtualNetworkIdOutput;
link.registrationEnabledOutput;
link.resolutionPolicyOutput;
link.provisioningStateOutput;
link.virtualNetworkLinkStateOutput;
```

## Common Patterns

### Hub-Spoke Topology with Private DNS

```typescript
// Create hub virtual network
const hubVnet = new VirtualNetwork(this, 'hub', {
  name: 'hub-vnet',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ['10.0.0.0/16'],
  },
});

// Create spoke virtual networks
const spoke1Vnet = new VirtualNetwork(this, 'spoke1', {
  name: 'spoke1-vnet',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ['10.1.0.0/16'],
  },
});

const spoke2Vnet = new VirtualNetwork(this, 'spoke2', {
  name: 'spoke2-vnet',
  location: 'eastus',
  resourceGroupId: resourceGroup.id,
  addressSpace: {
    addressPrefixes: ['10.2.0.0/16'],
  },
});

// Create private DNS zone
const privateDnsZone = new PrivateDnsZone(this, 'privateDns', {
  name: 'internal.contoso.com',
  location: 'global',
  resourceGroupId: resourceGroup.id,
});

// Link hub with auto-registration
const hubLink = new PrivateDnsZoneLink(this, 'hub-link', {
  name: 'hub-vnet-link',
  location: 'global',
  privateDnsZoneId: privateDnsZone.id,
  virtualNetworkId: hubVnet.id,
  registrationEnabled: true, // Auto-register hub VMs
});

// Link spokes for resolution only
const spoke1Link = new PrivateDnsZoneLink(this, 'spoke1-link', {
  name: 'spoke1-vnet-link',
  location: 'global',
  privateDnsZoneId: privateDnsZone.id,
  virtualNetworkId: spoke1Vnet.id,
  registrationEnabled: false, // Resolution only
});

const spoke2Link = new PrivateDnsZoneLink(this, 'spoke2-link', {
  name: 'spoke2-vnet-link',
  location: 'global',
  privateDnsZoneId: privateDnsZone.id,
  virtualNetworkId: spoke2Vnet.id,
  registrationEnabled: false, // Resolution only
});
```

### Multi-Environment with Dedicated Links

```typescript
// Production environment
const prodVnet = new VirtualNetwork(this, 'prod-vnet', {
  name: 'prod-vnet',
  location: 'eastus',
  resourceGroupId: prodResourceGroup.id,
  addressSpace: {
    addressPrefixes: ['10.10.0.0/16'],
  },
});

const prodLink = new PrivateDnsZoneLink(this, 'prod-link', {
  name: 'prod-vnet-link',
  location: 'global',
  privateDnsZoneId: prodPrivateDnsZone.id,
  virtualNetworkId: prodVnet.id,
  registrationEnabled: true,
  tags: { environment: 'production' },
});

// Staging environment
const stagingVnet = new VirtualNetwork(this, 'staging-vnet', {
  name: 'staging-vnet',
  location: 'eastus',
  resourceGroupId: stagingResourceGroup.id,
  addressSpace: {
    addressPrefixes: ['10.20.0.0/16'],
  },
});

const stagingLink = new PrivateDnsZoneLink(this, 'staging-link', {
  name: 'staging-vnet-link',
  location: 'global',
  privateDnsZoneId: stagingPrivateDnsZone.id,
  virtualNetworkId: stagingVnet.id,
  registrationEnabled: true,
  tags: { environment: 'staging' },
});
```

### Shared Services DNS with Multiple Links

```typescript
// Create a shared private DNS zone
const sharedDns = new PrivateDnsZone(this, 'shared-dns', {
  name: 'services.internal.contoso.com',
  location: 'global',
  resourceGroupId: sharedResourceGroup.id,
});

// Link multiple VNets from different regions/subscriptions
const regions = ['eastus', 'westus', 'northeurope'];
const links = regions.map((region, index) => {
  const vnet = new VirtualNetwork(this, `vnet-${region}`, {
    name: `vnet-${region}`,
    location: region,
    resourceGroupId: resourceGroup.id,
    addressSpace: {
      addressPrefixes: [`10.${100 + index}.0.0/16`],
    },
  });

  return new PrivateDnsZoneLink(this, `link-${region}`, {
    name: `link-${region}`,
    location: 'global',
    privateDnsZoneId: sharedDns.id,
    virtualNetworkId: vnet.id,
    registrationEnabled: false, // Resolution only
    tags: {
      region: region,
      purpose: 'shared-services',
    },
  });
});
```

## Error Handling

The construct includes built-in validation:

```typescript
// Invalid - missing required properties
const link = new PrivateDnsZoneLink(this, 'link', {
  name: 'my-link',
  // ❌ Missing privateDnsZoneId and virtualNetworkId
});

// Invalid - incorrect resolution policy
const link = new PrivateDnsZoneLink(this, 'link', {
  name: 'my-link',
  privateDnsZoneId: privateDnsZone.id,
  virtualNetworkId: vnet.id,
  resolutionPolicy: 'InvalidPolicy', // ❌ Must be "Default" or "NxDomainRedirect"
});

// Valid
const link = new PrivateDnsZoneLink(this, 'link', {
  name: 'my-link',
  location: 'global',
  privateDnsZoneId: privateDnsZone.id,
  virtualNetworkId: vnet.id,
  registrationEnabled: true,
  resolutionPolicy: 'Default', // ✅ Correct
});
```

## Troubleshooting

### DNS Resolution Not Working
If DNS resolution isn't working after creating a link:
1. Verify the link provisioning state is "Succeeded"
2. Check that VMs are using Azure DNS (168.63.129.16) - this is the default
3. Ensure the VNet is properly peered if using hub-spoke topology
4. Verify NSG rules aren't blocking DNS traffic (UDP port 53)
5. Test DNS resolution using `nslookup` or `dig` from a VM in the linked VNet

### Auto-Registration Not Working
If VM hostnames aren't auto-registering:
1. Confirm `registrationEnabled` is set to `true` on the link
2. Ensure VMs are in a subnet of the linked virtual network
3. Check that VMs are using DHCP for their IP configuration (required for auto-registration)
4. Verify VMs have been started/restarted after the link was created
5. Look for any errors in the VM's network configuration

### Link Creation Failures
If link creation fails:
1. Verify the private DNS zone exists and the ID is correct
2. Check that the virtual network exists and the ID is correct
3. Ensure you have permissions to create links in both resources
4. Review Azure resource limits for your subscription
5. Check for any naming conflicts with existing links

### Resolution Policy Issues
If resolution policy isn't behaving as expected:
1. Verify the policy is set to the correct value ("Default" or "NxDomainRedirect")
2. Understand that "Default" only resolves names in the private DNS zone
3. Know that "NxDomainRedirect" falls back to Azure DNS for unresolved queries
4. Test DNS resolution to confirm the expected behavior

## Related Constructs

- **Private DNS Zone**: Parent resource that must exist before creating links
- **Virtual Network**: The VNet to be linked to the private DNS zone
- **Resource Group**: Container for private DNS zone resources
- **DNS Record Sets**: (To be implemented) Create DNS records in the private DNS zone

## Resolution Policy Comparison

| Policy | Behavior | Use Case |
|--------|----------|----------|
| **Default** | Only resolves names in the private DNS zone. Returns NXDOMAIN for unresolved queries. | Standard internal DNS resolution |
| **NxDomainRedirect** | Resolves private DNS zone names first, then falls back to Azure DNS for unresolved queries. | Mixed internal/external resolution |

## Limits and Quotas

| Resource | Default Limit | Notes |
|----------|---------------|-------|
| Virtual network links per private DNS zone | 1000 | Can be increased via support request |
| Virtual network links with auto-registration | 100 | Per private DNS zone |
| Private DNS zones linked to a virtual network | 1000 | Per virtual network |

## References

- [Azure Private DNS Virtual Network Links Documentation](https://docs.microsoft.com/azure/dns/private-dns-virtual-network-links)
- [Private DNS REST API Reference](https://docs.microsoft.com/rest/api/dns/privatedns/virtualnetworklinks)
- [Azure Private DNS Best Practices](https://docs.microsoft.com/azure/dns/private-dns-scenarios)
- [Hub-Spoke Network Topology](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke)
- [Azure DNS Private Resolver](https://docs.microsoft.com/azure/dns/dns-private-resolver-overview)