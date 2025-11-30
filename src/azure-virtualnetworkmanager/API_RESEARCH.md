# Azure Virtual Network Manager API Research

## Overview
This document contains research findings for implementing Azure Virtual Network Manager support in the terraform-cdk-constructs project.

## Resource Information

### Resource Type
`Microsoft.Network/networkManagers`

### API Versions

Based on research from Microsoft Learn documentation and Azure Bicep Registry Modules, the following stable API versions are available:

1. **2024-05-01** (RECOMMENDED - Latest Stable)
   - Status: Active/Stable
   - Features: Full feature set including routing configurations, security admin configurations, and connectivity configurations
   - Template Reference: https://learn.microsoft.com/en-us/azure/templates/Microsoft.Network/2024-05-01/networkManagers
   - This is the version used in current Azure Bicep Registry Modules

2. **2023-11-01** (Stable)
   - Status: Active
   - Earlier stable version with core features

3. **2023-09-01** (Stable)
   - Status: Active
   - Earlier stable version

### Recommendation
Implement support for **2024-05-01** as the primary version, with potential support for 2023-11-01 as an alternative stable version.

## Core Properties

### Required Properties

1. **location** (string)
   - Azure region for the Network Manager
   - Validation: lowercase letters and numbers only
   - Example: `"eastus"`, `"westus2"`

2. **name** (string)
   - Name of the Network Manager
   - Validation: 2-64 characters, alphanumeric, periods, underscores, hyphens
   - Pattern: `^[a-zA-Z0-9][a-zA-Z0-9._-]{0,62}[a-zA-Z0-9_]$`

3. **networkManagerScopes** (object)
   - Defines the boundary of network resources this Network Manager can manage
   - Must contain at least one management group OR subscription
   - Properties:
     - `managementGroups` (array, optional): List of management group IDs
     - `subscriptions` (array, optional): List of subscription IDs
   - Format: Full resource IDs
     - Management Group: `/providers/Microsoft.Management/managementGroups/{id}`
     - Subscription: `/subscriptions/{subscriptionId}`

### Optional Properties

1. **tags** (object)
   - Resource tags as key-value pairs
   - Default: `{}`

2. **description** (string)
   - Description of the Network Manager

3. **networkManagerScopeAccesses** (array of strings)
   - Defines which features are enabled (scope access/features)
   - Allowed values:
     - `"Connectivity"` - Create network topologies at scale
     - `"SecurityAdmin"` - Create high-priority security rules
     - `"Routing"` - Orchestrate user-defined routes (UDRs)
   - If not specified, only enables IPAM and Virtual Network Verifier features

## Child Resources

Network Manager supports several child resource types:

### 1. Network Groups (`Microsoft.Network/networkManagers/networkGroups`)
- API Version: 2024-05-01
- Purpose: Container for virtual network resources
- Properties:
  - `name` (required): Name of the network group
  - `description` (optional): Description
  - `memberType` (conditional): `"VirtualNetwork"` or `"Subnet"`
  - Static members can be added as sub-resources

### 2. Static Members (`Microsoft.Network/networkManagers/networkGroups/staticMembers`)
- API Version: 2024-05-01
- Purpose: Explicitly add virtual networks/subnets to a network group
- Properties:
  - `name` (required): Member name
  - `resourceId` (required): Full resource ID of the VNet or Subnet

### 3. Connectivity Configurations (`Microsoft.Network/networkManagers/connectivityConfigurations`)
- API Version: 2024-05-01
- Purpose: Define network topology (Hub-and-Spoke or Mesh)
- Properties:
  - `name` (required)
  - `description` (optional)
  - `connectivityTopology` (required): `"HubAndSpoke"` or `"Mesh"`
  - `appliesToGroups` (required): Array of network group configurations
  - `hubs` (conditional): Required for Hub-and-Spoke topology
  - `isGlobal` (optional): Boolean for global connectivity
  - `deleteExistingPeering` (optional): Boolean

### 4. Security Admin Configurations (`Microsoft.Network/networkManagers/securityAdminConfigurations`)
- API Version: 2024-05-01
- Purpose: Define high-priority security rules
- Contains rule collections with security rules
- Properties:
  - `name` (required)
  - `description` (optional)
  - `applyOnNetworkIntentPolicyBasedServices` (optional): Array

### 5. Routing Configurations (`Microsoft.Network/networkManagers/routingConfigurations`)
- API Version: 2024-05-01
- Purpose: Manage routing rules and UDRs
- Contains rule collections with routing rules
- Properties:
  - `name` (required)
  - `description` (optional)

### 6. Scope Connections (`Microsoft.Network/networkManagers/scopeConnections`)
- API Version: 2024-05-01
- Purpose: Allow Network Manager to manage resources from another tenant
- Properties:
  - `name` (required)
  - `description` (optional)
  - `resourceId` (required): Target Network Manager resource ID
  - `tenantId` (required): Target tenant ID

## Complex Nested Objects

### NetworkManagerScopes Object
```typescript
{
  managementGroups?: string[];  // Array of management group IDs
  subscriptions?: string[];     // Array of subscription IDs
}
```

### ConnectivityConfiguration AppliesToGroups
```typescript
{
  networkGroupResourceId: string;  // Required
  groupConnectivity: "None" | "DirectlyConnected";  // Required
  isGlobal: boolean;  // Optional
  useHubGateway: boolean;  // Optional for Hub-and-Spoke
}
```

### Hub Configuration (for Hub-and-Spoke)
```typescript
{
  resourceId: string;  // Required - VNet resource ID
  resourceType: "Microsoft.Network/virtualNetworks";  // Required
}
```

## Special Considerations

### 1. Management Group Registration
- When using `networkManagerScopes` with management groups, the `Microsoft.Network` resource provider must be registered at the Management Group level first
- Documentation: https://learn.microsoft.com/en-us/rest/api/resources/providers/register-at-management-group-scope

### 2. Network Groups Requirement
- Network Groups are required if you want to use:
  - Connectivity Configurations
  - Security Admin Configurations
  - Routing Configurations
- At least one network group must exist before creating these configurations

### 3. Membership Types
- **Static Membership**: Manually add VNets/subnets using static members
- **Dynamic Membership**: Defined through Azure Policy (not covered by static member resources)
- Documentation: https://learn.microsoft.com/en-us/azure/virtual-network-manager/concept-azure-policy-integration

### 4. Resource Hierarchy
```
NetworkManager (parent)
├── NetworkGroups
│   └── StaticMembers
├── ConnectivityConfigurations
├── SecurityAdminConfigurations
│   └── RuleCollections
│       └── Rules
├── RoutingConfigurations
│   └── RuleCollections
│       └── Rules
└── ScopeConnections
```

## Implementation Pattern Analysis

Based on existing implementations in this project:

### 1. Schema Structure Pattern
- Create a `*-schemas.ts` file following the pattern seen in:
  - [`virtual-network-schemas.ts`](../azure-virtualnetwork/lib/virtual-network-schemas.ts)
  - [`storage-account-schemas.ts`](../azure-storageaccount/lib/storage-account-schemas.ts)
  - [`aks-cluster-schemas.ts`](../azure-aks/lib/aks-cluster-schemas.ts)

### 2. Common Elements
All schema files include:
- Import from `version-manager/interfaces/version-interfaces`
- `COMMON_PROPERTIES` object with shared property definitions
- Version-specific schema objects (e.g., `SCHEMA_2024_05_01`)
- Version configuration objects with support levels
- `ALL_*_VERSIONS` array for registration
- Resource type constant

### 3. Property Definition Pattern
```typescript
const COMMON_PROPERTIES: { [key: string]: PropertyDefinition } = {
  propertyName: {
    dataType: PropertyType.STRING | OBJECT | ARRAY | BOOLEAN | NUMBER,
    required: true | false,
    defaultValue?: any,
    description: "Description here",
    validation: [
      {
        ruleType: ValidationRuleType.REQUIRED | PATTERN_MATCH | TYPE_CHECK,
        message: "Error message",
        value?: "pattern or type"
      }
    ]
  }
}
```

### 4. Version Support Levels
- `VersionSupportLevel.ACTIVE` - Current production version
- `VersionSupportLevel.DEPRECATED` - Still supported but migration recommended
- `VersionSupportLevel.SUNSET` - No longer supported, immediate migration required

### 5. Nested Object Handling
For complex nested objects (like `networkManagerScopes`, `connectivityConfigurations`), the project uses:
- TypeScript interfaces for type safety (see AKS example)
- PropertyType.OBJECT for the schema definition
- Validation at the object level, not deep nested validation

## Recommended Implementation Steps

1. **Create Schema File** (`network-manager-schemas.ts`)
   - Define TypeScript interfaces for complex objects
   - Create `COMMON_PROPERTIES` with all Network Manager properties
   - Create schema for API version 2024-05-01
   - Optionally add schema for 2023-11-01
   - Create version configurations
   - Export all necessary constants and arrays

2. **Validation Rules to Implement**
   - Location: required, lowercase alphanumeric
   - Name: required, 2-64 chars pattern
   - NetworkManagerScopes: required, must have at least one subscription or management group
   - NetworkManagerScopeAccesses: validate against allowed values

3. **Properties to Track**
   - Core properties: location, name, networkManagerScopes
   - Optional: tags, description, networkManagerScopeAccesses
   - Child resources: These will likely be separate constructs or methods

4. **Documentation Requirements**
   - Include API version references
   - Document child resource relationships
   - Note management group registration requirement
   - Provide examples for common scenarios

## References

- [Azure Virtual Network Manager REST API](https://learn.microsoft.com/en-us/rest/api/networkmanager/)
- [ARM Template Reference - networkManagers](https://learn.microsoft.com/en-us/azure/templates/Microsoft.Network/2024-05-01/networkManagers)
- [Azure Bicep Registry - Network Manager Module](https://github.com/Azure/bicep-registry-modules/tree/main/avm/res/network/network-manager)
- [Network Manager Product Documentation](https://learn.microsoft.com/en-us/azure/virtual-network-manager/)
- [Azure Policy Integration with Network Groups](https://learn.microsoft.com/en-us/azure/virtual-network-manager/concept-azure-policy-integration)

## Questions for Clarification

1. **Child Resources**: Should Network Groups, Connectivity Configurations, etc., be:
   - Part of the main NetworkManager construct as optional properties?
   - Separate construct classes that reference the parent NetworkManager?
   - Both options supported?

2. **Scope**: Should the initial implementation include:
   - Just the base Network Manager resource?
   - Network Manager + Network Groups?
   - Full feature set including all configurations?

3. **API Version Strategy**: Should we:
   - Implement only 2024-05-01?
   - Include 2023-11-01 for broader compatibility?
   - Plan for future versions (2025-01-01 when available)?

## Next Steps

After review and approval of this research:
1. Create `network-manager-schemas.ts` with API schemas
2. Create main construct class `network-manager.ts`
3. Create unit tests
4. Create integration tests
5. Update documentation