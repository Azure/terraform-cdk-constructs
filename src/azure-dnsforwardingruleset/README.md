# Azure DNS Forwarding Ruleset

This package provides constructs for managing Azure DNS Forwarding Rulesets and their child resources, enabling conditional DNS forwarding for hybrid and multi-cloud scenarios.

## Overview

Azure DNS Forwarding Rulesets work with DNS Resolver Outbound Endpoints to enable conditional forwarding of DNS queries based on domain names. This is essential for hybrid DNS scenarios where Azure resources need to resolve names from on-premises or other external DNS servers.

### Key Components

1. **DNS Forwarding Ruleset** - The parent resource that contains forwarding rules and links to virtual networks
2. **Forwarding Rules** - Define which domains to forward and where to forward them
3. **Virtual Network Links** - Connect virtual networks to the ruleset so they can use the forwarding rules

## Architecture

```
DNS Resolver (Parent)
    └── Outbound Endpoint (Child)
            └── DNS Forwarding Ruleset (uses)
                    ├── Forwarding Rules (Child)
                    └── Virtual Network Links (Child)
```

## Installation

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Usage

### Basic Example

```typescript
import { DnsForwardingRuleset, ForwardingRule, DnsForwardingRulesetVirtualNetworkLink } from '@microsoft/terraform-cdk-constructs/azure-dnsforwardingruleset';
import { DnsResolver } from '@microsoft/terraform-cdk-constructs/azure-dnsresolver';
import { DnsResolverOutboundEndpoint } from '@microsoft/terraform-cdk-constructs/azure-dnsresolver';

// Create DNS Resolver and Outbound Endpoint first
const resolver = new DnsResolver(stack, 'resolver', {
  name: 'my-resolver',
  location: 'eastus',
  resourceGroupId: rg.id,
  virtualNetworkId: vnet.id,
});

const outboundEndpoint = new DnsResolverOutboundEndpoint(stack, 'outbound', {
  name: 'outbound-ep',
  location: 'eastus',
  dnsResolverId: resolver.id,
  subnetId: subnet.id,
});

// Create DNS Forwarding Ruleset
const ruleset = new DnsForwardingRuleset(stack, 'ruleset', {
  name: 'my-ruleset',
  location: 'eastus',
  resourceGroupId: rg.id,
  dnsResolverOutboundEndpointIds: [outboundEndpoint.id],
  tags: {
    environment: 'production',
  },
});

// Add Forwarding Rule
const rule = new ForwardingRule(stack, 'rule', {
  name: 'contoso-rule',
  dnsForwardingRulesetId: ruleset.id,
  domainName: 'contoso.com.',
  targetDnsServers: [
    { ipAddress: '10.0.0.4', port: 53 },
    { ipAddress: '10.0.0.5' },  // Port defaults to 53
  ],
  forwardingRuleState: 'Enabled',
});

// Link VNet to Ruleset
const link = new DnsForwardingRulesetVirtualNetworkLink(stack, 'link', {
  name: 'vnet-link',
  dnsForwardingRulesetId: ruleset.id,
  virtualNetworkId: vnet.id,
});
```

### Multiple Forwarding Rules

```typescript
// Forward corporate domain
new ForwardingRule(stack, 'corp-rule', {
  name: 'corp-rule',
  dnsForwardingRulesetId: ruleset.id,
  domainName: 'corp.contoso.com.',
  targetDnsServers: [
    { ipAddress: '10.1.0.4' },
    { ipAddress: '10.1.0.5' },
  ],
  metadata: {
    owner: 'it-team',
    purpose: 'corporate-dns',
  },
});

// Forward partner domain
new ForwardingRule(stack, 'partner-rule', {
  name: 'partner-rule',
  dnsForwardingRulesetId: ruleset.id,
  domainName: 'partner.external.com.',
  targetDnsServers: [
    { ipAddress: '192.168.1.10', port: 5353 },
  ],
  forwardingRuleState: 'Enabled',
});
```

### Disabled Rule (for testing)

```typescript
new ForwardingRule(stack, 'test-rule', {
  name: 'test-rule',
  dnsForwardingRulesetId: ruleset.id,
  domainName: 'test.local.',
  targetDnsServers: [{ ipAddress: '10.0.0.100' }],
  forwardingRuleState: 'Disabled',  // Rule exists but won't be used
});
```

### Multiple VNet Links

```typescript
// Link production VNet
new DnsForwardingRulesetVirtualNetworkLink(stack, 'prod-link', {
  name: 'prod-vnet-link',
  dnsForwardingRulesetId: ruleset.id,
  virtualNetworkId: prodVnet.id,
  metadata: {
    environment: 'production',
  },
});

// Link development VNet
new DnsForwardingRulesetVirtualNetworkLink(stack, 'dev-link', {
  name: 'dev-vnet-link',
  dnsForwardingRulesetId: ruleset.id,
  virtualNetworkId: devVnet.id,
  metadata: {
    environment: 'development',
  },
});
```

## How It Works

1. **DNS Query Flow**:
   - VM in linked VNet makes DNS query for `app.contoso.com`
   - Query goes to Azure DNS
   - Azure DNS checks if domain matches any forwarding rule
   - If match found, query is forwarded via Outbound Endpoint to target DNS servers
   - Response is returned to the VM

2. **Rule Matching**:
   - Rules are matched based on domain name suffix
   - Most specific match wins (e.g., `app.contoso.com.` matches `app.contoso.com.` before `contoso.com.`)
   - Domain names must end with a dot for FQDN

3. **VNet Linking**:
   - Only VMs in linked VNets can use the forwarding rules
   - Multiple VNets can be linked to the same ruleset
   - Each VNet can only be linked to one ruleset per DNS resolver

## Use Cases

### Hybrid DNS Resolution

Forward on-premises domain queries to on-premises DNS servers:

```typescript
new ForwardingRule(stack, 'onprem-rule', {
  name: 'onprem-rule',
  dnsForwardingRulesetId: ruleset.id,
  domainName: 'onprem.corp.',
  targetDnsServers: [
    { ipAddress: '10.10.0.10' },  // On-premises DNS
    { ipAddress: '10.10.0.11' },  // Secondary on-premises DNS
  ],
});
```

### Split-Horizon DNS

Different resolution for internal vs. external:

```typescript
// Internal resolution for app.contoso.com
new ForwardingRule(stack, 'internal-rule', {
  name: 'internal-app-rule',
  dnsForwardingRulesetId: ruleset.id,
  domainName: 'app.contoso.com.',
  targetDnsServers: [
    { ipAddress: '10.0.1.10' },  // Internal app DNS
  ],
});
```

### Multi-Cloud DNS

Forward queries to another cloud provider:

```typescript
new ForwardingRule(stack, 'aws-rule', {
  name: 'aws-rule',
  dnsForwardingRulesetId: ruleset.id,
  domainName: 'aws.mycompany.com.',
  targetDnsServers: [
    { ipAddress: '172.16.0.10' },  // AWS DNS endpoint via VPN
  ],
});
```

## Limits and Quotas

- **Rules per Ruleset**: Maximum 1,000
- **Target DNS Servers per Rule**: Maximum 6
- **VNet Links per Ruleset**: Maximum 500
- **Rulesets per Subscription**: Maximum 15
- **Domain Name**: Maximum 255 characters, must end with dot

## Best Practices

1. **Use Specific Domain Names**: Create specific rules for subdomains rather than broad wildcards
2. **Multiple Target Servers**: Always configure at least 2 target DNS servers for high availability
3. **Monitor Rules**: Regularly review and remove unused rules
4. **Metadata Tags**: Use metadata/tags for organization and cost tracking
5. **Testing**: Use disabled rules to test configurations before enabling
6. **Naming Convention**: Use clear, descriptive names for rules and links

## Troubleshooting

### DNS Queries Not Being Forwarded

**Check**:
1. VNet is linked to the ruleset
2. Forwarding rule state is "Enabled"
3. Domain name ends with a dot (.)
4. Outbound endpoint is in "Succeeded" state

### Timeouts or Failed Queries

**Check**:
1. Target DNS servers are reachable from the outbound endpoint subnet
2. Network security groups allow outbound UDP/53 traffic
3. Target DNS servers are responding correctly
4. Firewall rules allow traffic from Azure IP ranges

### Rule Not Matching

**Check**:
1. Domain name in rule matches exactly (including trailing dot)
2. Most specific rule takes precedence
3. Check for typos in domain names

## Properties Reference

### DnsForwardingRuleset

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Name of the ruleset |
| `location` | string | Yes | Azure region |
| `resourceGroupId` | string | Yes | Resource group ID |
| `dnsResolverOutboundEndpointIds` | string[] | Yes | Array of outbound endpoint IDs |
| `tags` | object | No | Resource tags |
| `apiVersion` | string | No | API version (default: 2022-07-01) |

### ForwardingRule

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Name of the rule |
| `dnsForwardingRulesetId` | string | Yes | Parent ruleset ID |
| `domainName` | string | Yes | Domain to forward (must end with .) |
| `targetDnsServers` | TargetDnsServer[] | Yes | Target DNS servers (max 6) |
| `forwardingRuleState` | string | No | "Enabled" or "Disabled" (default: "Enabled") |
| `metadata` | object | No | Key-value metadata |
| `apiVersion` | string | No | API version (default: 2022-07-01) |

#### TargetDnsServer

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `ipAddress` | string | Yes | IP address of DNS server |
| `port` | number | No | Port number (default: 53) |

### DnsForwardingRulesetVirtualNetworkLink

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Name of the link |
| `dnsForwardingRulesetId` | string | Yes | Parent ruleset ID |
| `virtualNetworkId` | string | Yes | VNet ID to link |
| `metadata` | object | No | Key-value metadata |
| `apiVersion` | string | No | API version (default: 2022-07-01) |

## Examples

See the [integration test](./test/dns-forwarding-ruleset.integ.ts) for a complete working example.

## Related Resources

- [Azure DNS Resolver](../azure-dnsresolver/README.md)
- [Azure Private DNS Zones](../azure-privatednszone/README.md)
- [Azure Virtual Networks](../azure-virtualnetwork/README.md)

## API Documentation

- [DNS Forwarding Rulesets REST API](https://learn.microsoft.com/rest/api/dns/dnsforwardingrulesets)
- [Forwarding Rules REST API](https://learn.microsoft.com/rest/api/dns/dnsforwardingrulesets/forwardingrules)
- [Virtual Network Links REST API](https://learn.microsoft.com/rest/api/dns/dnsforwardingrulesets/virtualnetworklinks)