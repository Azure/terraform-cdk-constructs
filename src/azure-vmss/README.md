# Azure Virtual Machine Scale Sets (VMSS) Construct

This module provides a CDK construct for creating and managing Azure Virtual Machine Scale Sets using the AzapiResource framework with automatic version management.

## Features

- **Automatic Version Management**: Uses the latest stable API version (2025-04-01) by default
- **Version Pinning**: Support for explicit API version specification
- **Code Reuse**: Leverages VM interfaces for storage, OS, and identity profiles
- **Orchestration Modes**: Support for both Uniform and Flexible orchestration
- **Scaling Features**: Overprovision, zone balance, and automatic repairs
- **Upgrade Policies**: Automatic, Manual, and Rolling upgrade modes
- **Full JSII Compliance**: Multi-language support (TypeScript, Python, Java, C#, Go)

## Installation

```bash
npm install @cdktf/provider-azapi
```

## API Versions

This construct supports the following Azure API versions:

- **2025-01-02**: Initial release with comprehensive VMSS features
- **2025-02-01**: Enhanced orchestration and scaling features
- **2025-04-01**: Latest version with newest features (default)

## Basic Usage

### Understanding VMSS Network Interface Templates

Unlike Virtual Machines that **reference** pre-existing NICs by ID, Virtual Machine Scale Sets use **NIC templates** that define how network interfaces should be created for each VM instance.

**Key Concept**: VMSS creates new NICs automatically for each VM instance based on the template you provide.

```typescript
import { VirtualMachineScaleSet } from "./azure-vmss";
import { ResourceGroup } from "./azure-resourcegroup";
import type { NetworkInterfaceDnsSettings } from "./azure-networkinterface";

const resourceGroup = new ResourceGroup(this, "rg", {
  name: "my-resource-group",
  location: "eastus",
});

const vmss = new VirtualMachineScaleSet(this, "vmss", {
  name: "my-vmss",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard_D2s_v3",
    capacity: 3,
  },
  orchestrationMode: "Uniform",
  upgradePolicy: {
    mode: "Automatic",
  },
  virtualMachineProfile: {
    storageProfile: {
      imageReference: {
        publisher: "Canonical",
        offer: "0001-com-ubuntu-server-jammy",
        sku: "22_04-lts-gen2",
        version: "latest",
      },
      osDisk: {
        createOption: "FromImage",
        managedDisk: {
          storageAccountType: "Premium_LRS",
        },
      },
    },
    osProfile: {
      computerName: "vmss-vm",
      adminUsername: "azureuser",
      linuxConfiguration: {
        disablePasswordAuthentication: true,
        ssh: {
          publicKeys: [
            {
              path: "/home/azureuser/.ssh/authorized_keys",
              keyData: "ssh-rsa AAAAB3NzaC1yc2E...",
            },
          ],
        },
      },
    },
    networkProfile: {
      networkInterfaceConfigurations: [
        {
          name: "nic-config",
          properties: {
            primary: true,
            ipConfigurations: [
              {
                name: "ip-config",
                properties: {
                  subnet: {
                    id: subnet.id,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
});
```

### VMSS with Load Balancer Integration

```typescript
const vmss = new VirtualMachineScaleSet(this, "vmss-lb", {
  name: "my-vmss-with-lb",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard_D2s_v3",
    capacity: 5,
  },
  orchestrationMode: "Uniform",
  upgradePolicy: {
    mode: "Automatic",
  },
  virtualMachineProfile: {
    storageProfile: {
      imageReference: {
        publisher: "Canonical",
        offer: "0001-com-ubuntu-server-jammy",
        sku: "22_04-lts-gen2",
        version: "latest",
      },
      osDisk: {
        createOption: "FromImage",
        managedDisk: {
          storageAccountType: "Premium_LRS",
        },
      },
    },
    osProfile: {
      computerName: "vmss-vm",
      adminUsername: "azureuser",
      linuxConfiguration: {
        disablePasswordAuthentication: true,
        ssh: {
          publicKeys: [
            {
              path: "/home/azureuser/.ssh/authorized_keys",
              keyData: "ssh-rsa AAAAB3NzaC1yc2E...",
            },
          ],
        },
      },
    },
    networkProfile: {
      networkInterfaceConfigurations: [
        {
          name: "nic-config",
          properties: {
            primary: true,
            ipConfigurations: [
              {
                name: "ip-config",
                properties: {
                  subnet: {
                    id: subnet.id,
                  },
                  loadBalancerBackendAddressPools: [
                    {
                      id: loadBalancer.backendPoolId,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
});
```

## Flexible Orchestration Mode

Flexible orchestration mode provides more control over VM placement and management:

```typescript
const flexibleVmss = new VirtualMachineScaleSet(this, "flexible-vmss", {
  name: "my-flexible-vmss",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard_D2s_v3",
    capacity: 5,
  },
  orchestrationMode: "Flexible",
  platformFaultDomainCount: 1,
  singlePlacementGroup: false,
  virtualMachineProfile: {
    storageProfile: {
      imageReference: {
        publisher: "Canonical",
        offer: "0001-com-ubuntu-server-jammy",
        sku: "22_04-lts-gen2",
        version: "latest",
      },
      osDisk: {
        createOption: "FromImage",
        managedDisk: {
          storageAccountType: "Premium_LRS",
        },
      },
    },
    osProfile: {
      computerName: "vmss-vm",
      adminUsername: "azureuser",
      adminPassword: "P@ssw0rd1234!",
    },
    networkProfile: {
      networkInterfaceConfigurations: [
        {
          name: "nic-config",
          properties: {
            primary: true,
            ipConfigurations: [
              {
                name: "ip-config",
                properties: {
                  subnet: {
                    id: subnet.id,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
});
```

## Rolling Upgrade Policy

Configure rolling upgrades for controlled deployment of updates:

```typescript
const vmss = new VirtualMachineScaleSet(this, "vmss-rolling", {
  name: "my-vmss-rolling",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard_D2s_v3",
    capacity: 10,
  },
  upgradePolicy: {
    mode: "Rolling",
    rollingUpgradePolicy: {
      maxBatchInstancePercent: 20,
      maxUnhealthyInstancePercent: 20,
      maxUnhealthyUpgradedInstancePercent: 20,
      pauseTimeBetweenBatches: "PT5S",
      enableCrossZoneUpgrade: true,
      prioritizeUnhealthyInstances: true,
    },
    automaticOSUpgradePolicy: {
      enableAutomaticOSUpgrade: true,
      disableAutomaticRollback: false,
      useRollingUpgradePolicy: true,
    },
  },
  virtualMachineProfile: {
    // ... VM profile configuration
  },
});
```

## Automatic Repairs

Enable automatic instance repairs for improved availability:

```typescript
const vmss = new VirtualMachineScaleSet(this, "vmss-repairs", {
  name: "my-vmss-repairs",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard_D2s_v3",
    capacity: 5,
  },
  automaticRepairsPolicy: {
    enabled: true,
    gracePeriod: "PT30M",
    repairAction: "Replace",
  },
  virtualMachineProfile: {
    // ... VM profile configuration
  },
});
```

## Zone-Balanced Deployment

Deploy VMs across availability zones for high availability:

```typescript
const vmss = new VirtualMachineScaleSet(this, "vmss-zones", {
  name: "my-vmss-zones",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  zones: ["1", "2", "3"],
  sku: {
    name: "Standard_D2s_v3",
    capacity: 9,
  },
  zoneBalance: true,
  singlePlacementGroup: false,
  virtualMachineProfile: {
    // ... VM profile configuration
  },
});
```

## Managed Identity

Enable system-assigned or user-assigned managed identity:

```typescript
const vmss = new VirtualMachineScaleSet(this, "vmss-identity", {
  name: "my-vmss-identity",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard_D2s_v3",
    capacity: 3,
  },
  identity: {
    type: "SystemAssigned",
  },
  virtualMachineProfile: {
    // ... VM profile configuration
  },
});
```

## API Version Pinning

Pin to a specific API version for stability:

```typescript
const vmss = new VirtualMachineScaleSet(this, "vmss-pinned", {
  name: "my-vmss-pinned",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  apiVersion: "2025-02-01", // Pin to specific version
  sku: {
    name: "Standard_D2s_v3",
    capacity: 3,
  },
  virtualMachineProfile: {
    // ... VM profile configuration
  },
});
```

## Properties

### Required Properties

- **name**: The name of the Virtual Machine Scale Set
- **location**: The Azure region where the VMSS will be created
- **sku**: SKU configuration including VM size and capacity

### Optional Properties

- **resourceGroupId**: Resource group ID (defaults to subscription scope)
- **tags**: Dictionary of tags to apply
- **apiVersion**: Explicit API version (defaults to latest)
- **identity**: Managed identity configuration
- **zones**: Availability zones for the VMSS
- **plan**: Plan information for marketplace images
- **orchestrationMode**: "Uniform" or "Flexible"
- **upgradePolicy**: Upgrade policy configuration
- **virtualMachineProfile**: VM configuration profile
- **overprovision**: Whether to overprovision VMs
- **doNotRunExtensionsOnOverprovisionedVMs**: Skip extensions on overprovisioned VMs
- **singlePlacementGroup**: Use single placement group
- **zoneBalance**: Balance VMs across zones
- **platformFaultDomainCount**: Number of fault domains
- **automaticRepairsPolicy**: Automatic repairs configuration
- **scaleInPolicy**: Scale-in policy configuration
- **proximityPlacementGroup**: Proximity placement group reference
- **hostGroup**: Dedicated host group reference
- **additionalCapabilities**: Additional capabilities like Ultra SSD
- **ignoreChanges**: Properties to ignore during updates

## Outputs

The construct provides the following outputs:

- **id**: The resource ID of the VMSS
- **location**: The location of the VMSS
- **name**: The name of the VMSS
- **tags**: The tags assigned to the VMSS
- **uniqueId**: The unique identifier assigned by Azure

## Methods

### addTag(key: string, value: string)

Add a tag to the VMSS (requires redeployment).

### removeTag(key: string)

Remove a tag from the VMSS (requires redeployment).

## Advanced Features

### Scale-In Policy

Control which VMs are removed during scale-in operations:

```typescript
const vmss = new VirtualMachineScaleSet(this, "vmss-scalein", {
  name: "my-vmss-scalein",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard_D2s_v3",
    capacity: 5,
  },
  scaleInPolicy: {
    rules: ["Default", "OldestVM"],
    forceDeletion: false,
  },
  virtualMachineProfile: {
    // ... VM profile configuration
  },
});
```

### Extensions

Add VM extensions to the scale set:

```typescript
const vmss = new VirtualMachineScaleSet(this, "vmss-ext", {
  name: "my-vmss-extensions",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard_D2s_v3",
    capacity: 3,
  },
  virtualMachineProfile: {
    storageProfile: {
      // ... storage configuration
    },
    osProfile: {
      // ... OS configuration
    },
    networkProfile: {
      // ... network configuration
    },
    extensionProfile: {
      extensions: [
        {
          name: "customScript",
          properties: {
            publisher: "Microsoft.Azure.Extensions",
            type: "CustomScript",
            typeHandlerVersion: "2.1",
            autoUpgradeMinorVersion: true,
            settings: {
              fileUris: ["https://example.com/script.sh"],
            },
            protectedSettings: {
              commandToExecute: "bash script.sh",
            },
          },
        },
      ],
    },
  },
});
```

## Best Practices

1. **Use Managed Identity**: Enable managed identity instead of storing credentials
2. **Zone Deployment**: Deploy across availability zones for high availability
3. **Automatic Repairs**: Enable automatic repairs for improved reliability
4. **Rolling Upgrades**: Use rolling upgrades for zero-downtime updates
5. **Load Balancer Integration**: Use load balancers for distributing traffic
6. **Monitoring**: Enable boot diagnostics and configure monitoring
7. **Version Pinning**: Pin API versions in production for stability

## Troubleshooting

### Schema Validation Errors

If you encounter schema validation errors, ensure all required properties are provided and match the expected types.

### Deployment Failures

Check the Azure portal for detailed error messages and ensure your subscription has sufficient quota.

### Version Compatibility

If using an older API version, some properties may not be available. Refer to the API version documentation.

## Networking Architecture

### NIC Template Pattern vs. NIC Reference Pattern

VMSS uses a fundamentally different networking approach compared to standalone VMs:

| Aspect | Virtual Machine | Virtual Machine Scale Set |
|--------|----------------|---------------------------|
| **NIC Creation** | Pre-created separately | Created from template per instance |
| **Pattern** | Reference by ID | Define template configuration |
| **Management** | Independent lifecycle | Managed with VM instance |
| **Use Case** | Single VM with persistent NIC | Multiple VMs with ephemeral NICs |

### VMSS Network Interface Template Example

```typescript
import type { NetworkInterfaceDnsSettings } from "./azure-networkinterface";

const vmss = new VirtualMachineScaleSet(this, "vmss", {
  name: "my-vmss",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard_D2s_v3",
    capacity: 3,
  },
  virtualMachineProfile: {
    // ... storage and OS configuration
    networkProfile: {
      // This is a TEMPLATE - Azure creates a NIC for each VM instance
      networkInterfaceConfigurations: [{
        name: "nic-config", // Template name (not the actual NIC name)
        properties: {
          primary: true,
          enableAcceleratedNetworking: true,
          enableIPForwarding: false,
          ipConfigurations: [{
            name: "ipconfig1",
            properties: {
              subnet: { id: subnet.id },
              // Optional: Public IP configuration template
              publicIPAddressConfiguration: {
                name: "public-ip-config",
                properties: {
                  idleTimeoutInMinutes: 15,
                },
              },
              // Optional: Load balancer integration
              loadBalancerBackendAddressPools: [{
                id: loadBalancer.backendPoolId,
              }],
            },
          }],
          // Shared type from NetworkInterface module
          dnsSettings: {
            dnsServers: ["10.0.0.4", "10.0.0.5"],
            internalDnsNameLabel: "vmss-vm",
          } as NetworkInterfaceDnsSettings,
        },
      }],
    },
  },
});
```

### Shared Types with NetworkInterface Module

VMSS imports shared types from the [`NetworkInterface`](../azure-networkinterface/README.md) module for consistency:

```typescript
import type { NetworkInterfaceDnsSettings } from "./azure-networkinterface";

// Use the shared DNS settings type
const dnsSettings: NetworkInterfaceDnsSettings = {
  dnsServers: ["10.0.0.4"],
  internalDnsNameLabel: "vmss",
};
```

This ensures type consistency across the codebase while maintaining the architectural difference between VM and VMSS networking patterns.

### Why Templates Instead of References?

1. **Scalability**: VMSS can create hundreds of VMs - pre-creating NICs would be impractical
2. **Dynamic Scaling**: Auto-scale operations need to create/delete NICs automatically
3. **Uniformity**: All instances get identical network configuration
4. **Lifecycle**: NICs are created and destroyed with VM instances

## Migration Guide

When upgrading between API versions, the construct will automatically analyze compatibility and provide warnings for breaking changes.

## Related Resources

- [Azure Virtual Machine](../azure-virtualmachine/README.md) - Uses NIC reference pattern
- [Azure Network Interface](../azure-networkinterface/README.md) - Centralized NIC construct
- [Azure Resource Group](../azure-resourcegroup/README.md)
- [Azure Virtual Network](../azure-virtualnetwork/README.md)

## License

This construct is part of the terraform-cdk-constructs library.

## Monitoring

The Virtual Machine Scale Set construct provides built-in monitoring capabilities through the `defaultMonitoring()` static method.

### Default Monitoring Configuration

```typescript
import { VirtualMachineScaleSet } from '@cdktf/azure-vmss';
import { ActionGroup } from '@cdktf/azure-actiongroup';
import { LogAnalyticsWorkspace } from '@cdktf/azure-loganalyticsworkspace';

const actionGroup = new ActionGroup(this, 'alerts', {
  // ... action group configuration
});

const workspace = new LogAnalyticsWorkspace(this, 'logs', {
  // ... workspace configuration
});

const vmss = new VirtualMachineScaleSet(this, 'vmss', {
  name: 'myvmss',
  location: 'eastus',
  resourceGroupName: resourceGroup.name,
  // ... other properties
  monitoring: VirtualMachineScaleSet.defaultMonitoring(
    actionGroup.id,
    workspace.id
  )
});
```

### Monitored Metrics

The default monitoring configuration includes:

1. **CPU Alert**
   - Metric: `Percentage CPU`
   - Threshold: 75% (default - lower than VM to allow scaling headroom)
   - Severity: Warning (2)
   - Triggers when aggregate CPU usage exceeds threshold

2. **Memory Alert**
   - Metric: `Available Memory Bytes`
   - Threshold: 1GB (default)
   - Severity: Warning (2)
   - Triggers when available memory drops below threshold

3. **Disk Queue Alert**
   - Metric: `OS Disk Queue Depth`
   - Threshold: 32 (default)
   - Severity: Warning (2)
   - Triggers when disk queue depth exceeds threshold

4. **Deletion Alert**
   - Tracks VMSS deletion via Activity Log
   - Severity: Informational

### Custom Monitoring Configuration

Customize thresholds and severities:

```typescript
const vmss = new VirtualMachineScaleSet(this, 'vmss', {
  name: 'myvmss',
  location: 'eastus',
  resourceGroupName: resourceGroup.name,
  monitoring: VirtualMachineScaleSet.defaultMonitoring(
    actionGroup.id,
    workspace.id,
    {
      cpuThreshold: 85,                  // Higher CPU threshold
      memoryThreshold: 536870912,        // 512MB in bytes
      diskQueueThreshold: 64,            // Higher queue depth
      cpuAlertSeverity: 1,              // Critical for CPU
      enableDiskQueueAlert: false,       // Disable disk monitoring
    }
  )
});
```

### Monitoring Options

All available options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cpuThreshold` | number | 75 | CPU usage percentage threshold |
| `memoryThreshold` | number | 1073741824 | Available memory bytes threshold (1GB) |
| `diskQueueThreshold` | number | 32 | Disk queue depth threshold |
| `enableCpuAlert` | boolean | true | Enable/disable CPU alert |
| `enableMemoryAlert` | boolean | true | Enable/disable memory alert |
| `enableDiskQueueAlert` | boolean | true | Enable/disable disk queue alert |
| `enableDeletionAlert` | boolean | true | Enable/disable deletion tracking |
| `cpuAlertSeverity` | 0\|1\|2\|3\|4 | 2 | CPU alert severity (0=Critical, 4=Verbose) |
| `memoryAlertSeverity` | 0\|1\|2\|3\|4 | 2 | Memory alert severity |
| `diskQueueAlertSeverity` | 0\|1\|2\|3\|4 | 2 | Disk queue alert severity |

### Note on CPU Threshold

The default CPU threshold for VMSS (75%) is lower than standalone VMs (80%) to provide headroom for auto-scaling. This allows the scale set to trigger scaling operations before reaching saturation.