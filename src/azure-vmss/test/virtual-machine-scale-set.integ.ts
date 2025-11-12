/**
 * Integration test for Azure Virtual Machine Scale Set
 *
 * This test demonstrates key usage patterns of the VirtualMachineScaleSet construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Test Coverage:
 * - Uniform orchestration mode with monitoring and SSH authentication
 * - Flexible orchestration mode with password authentication
 * - Monitoring integration with custom thresholds
 * - Automatic network API version resolution
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ActionGroup } from "../../azure-actiongroup";
import { ResourceGroup } from "../../azure-resourcegroup";
import { Subnet } from "../../azure-subnet";
import { VirtualNetwork } from "../../azure-virtualnetwork";
import { DataAzapiClientConfig } from "../../core-azure/lib/azapi/providers-azapi/data-azapi-client-config";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { VirtualMachineScaleSet } from "../lib/virtual-machine-scale-set";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("vmss-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating comprehensive Virtual Machine Scale Set usage
 */
class VirtualMachineScaleSetExampleStack extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      testRunOptions: {
        maxAgeHours: testMetadata.maxAgeHours,
        autoCleanup: testMetadata.autoCleanup,
        cleanupPolicy: testMetadata.cleanupPolicy,
      },
    });

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Generate unique names
    const rgName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "vmss",
    );

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: rgName,
      location: "eastus2",
      tags: {
        ...this.systemTags(),
      },
    });

    // Create virtual network
    const vnet = new VirtualNetwork(this, "example-vnet", {
      name: "vmss-vnet",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
    });

    // Create subnet with explicit VNet dependency
    const subnet = new Subnet(this, "example-subnet", {
      name: "vmss-subnet",
      resourceGroupId: resourceGroup.id,
      virtualNetworkName: vnet.props.name!,
      virtualNetworkId: vnet.id, // Creates explicit Terraform dependency
      addressPrefix: "10.0.1.0/24",
    });

    // Get current Azure client configuration for subscription ID
    const clientConfig = new DataAzapiClientConfig(
      this,
      "current-client-config",
      {},
    );

    // Create Action Group for monitoring alerts
    const actionGroup = new ActionGroup(this, "vmss-action-group", {
      name: "vmss-alerts",
      location: "global",
      resourceGroupId: resourceGroup.id,
      groupShortName: "vmssalert",
      emailReceivers: [
        {
          name: "admin-email",
          emailAddress: "admin@example.com",
        },
      ],
    });

    // Create Log Analytics Workspace for diagnostics (simple inline resource)
    // Note: Using a simplified workspace creation for testing purposes
    const workspaceId = `\${${clientConfig.fqn}.subscription_id}/resourceGroups/${resourceGroup.props.name}/providers/Microsoft.OperationalInsights/workspaces/vmss-workspace`;

    // Uniform VMSS with monitoring and SSH authentication
    // Combines: basic uniform orchestration + monitoring + security features
    new VirtualMachineScaleSet(this, "uniform-vmss", {
      name: "uniformvmss",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: {
        name: "Standard_B1s", // Smallest size for cost efficiency
        capacity: 2,
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
              storageAccountType: "Standard_LRS",
            },
            diskSizeGB: 30,
          },
        },
        osProfile: {
          computerNamePrefix: "vmss-vm",
          adminUsername: "azureuser",
          linuxConfiguration: {
            disablePasswordAuthentication: true,
            ssh: {
              publicKeys: [
                {
                  path: "/home/azureuser/.ssh/authorized_keys",
                  // This is a dummy SSH public key for testing purposes only
                  // Generated with: ssh-keygen -t rsa -b 2048 -f /tmp/test_key (public key only)
                  keyData:
                    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC3gkXHiCN4VNdmDlMrFK6Io5sDMV9e7S4xxqy9FoASXfLPe1BxIsqVRxfPhHRXmwgZReCZHl2/qFBUrWpRMSCG8MXx7bvqJDYlCZ9yvFLx0wZnFuQVvLLCMfJ1l4gRXXFmRVUFtWLzGlNQVKqGqKqJ1l6fPMM7O+VtxqZlhLRg3Qz0kD4xlZdHxqYxr/AHmBkQQ3vTx5dNh5qbX9kFRlRJFqhvDkqLh4L8jIgQfzJwpZwqzZ0Hj3rYvH2nHa2sJMbY8nBxJKlDdvQwCLh7CqB7x3Hv3k2K3TjvXBF9xMZvx8HwCvKlVZqPQ3VpGhHv3CvMkBvC2L3vKvMxB3vLxHK9 test-key-for-integration-tests",
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
      identity: {
        type: "SystemAssigned",
      },
      overprovision: true,
      // Add monitoring with custom thresholds to test monitoring integration
      monitoring: VirtualMachineScaleSet.defaultMonitoring(
        actionGroup.id,
        workspaceId,
        {
          cpuThreshold: 85,
          memoryThreshold: 536870912, // 512MB
          enableDiskQueueAlert: false,
          cpuAlertSeverity: 1, // Error level
        },
      ),
      tags: {
        ...this.systemTags(),
        orchestration: "uniform",
        example: "monitoring",
      },
      ignoreChanges: ["tags"], // Azure adds azsecpack tag automatically
    });

    // Flexible VMSS with password authentication
    // Tests: flexible orchestration mode + automatic network API version resolution
    new VirtualMachineScaleSet(this, "flexible-vmss", {
      name: "flexiblevmss",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: {
        name: "Standard_B1s",
        capacity: 2, // Reduced from 3 to 2 for cost efficiency
      },
      orchestrationMode: "Flexible",
      platformFaultDomainCount: 1,
      singlePlacementGroup: false,
      upgradePolicy: {
        mode: "Manual",
      },
      // Note: Rolling upgrade mode and automaticRepairsPolicy require a health extension
      // Using Manual mode for simplicity in this integration test
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
              storageAccountType: "Standard_LRS",
            },
          },
        },
        osProfile: {
          computerNamePrefix: "flexvm",
          adminUsername: "azureuser",
          // Test password only - resources are ephemeral and destroyed after test
          adminPassword: "P@ssw0rd1234!SecurePassword",
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
          // networkApiVersion is automatically resolved to the latest version
          // Uncomment to pin to a specific version:
          // networkApiVersion: "2024-10-01"
        },
      },
      tags: {
        ...this.systemTags(),
        orchestration: "flexible",
        example: "flexible-mode",
      },
      ignoreChanges: ["tags"], // Azure adds azsecpack tag automatically
    });
  }
}

describe("Virtual Machine Scale Set Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup VMSS resources", () => {
    const app = Testing.app();
    const stack = new VirtualMachineScaleSetExampleStack(
      app,
      "test-virtual-machine-scale-set",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 900000); // 15 minute timeout for VMSS deployment and cleanup
});
