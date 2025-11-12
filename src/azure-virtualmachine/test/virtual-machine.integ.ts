/**
 * Integration test for Azure Virtual Machine
 *
 * This test demonstrates comprehensive usage of the VirtualMachine construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ActionGroup } from "../../azure-actiongroup";
import { NetworkInterface } from "../../azure-networkinterface";
import { ResourceGroup } from "../../azure-resourcegroup";
import { Subnet } from "../../azure-subnet";
import { VirtualNetwork } from "../../azure-virtualnetwork";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { VirtualMachine } from "../lib/virtual-machine";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("virtual-machine-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating comprehensive Virtual Machine usage
 */
class VirtualMachineExampleStack extends BaseTestStack {
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
      "vm",
    );

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: rgName,
      location: "eastus2",
      tags: {
        ...this.systemTags(),
      },
    });

    // Create Action Group for monitoring
    const actionGroup = new ActionGroup(this, "example-action-group", {
      name: "vm-monitoring-action-group",
      resourceGroupId: resourceGroup.id,
      location: "global",
      groupShortName: "vmmon",
      emailReceivers: [
        {
          name: "admin-email",
          emailAddress: "admin@example.com",
          useCommonAlertSchema: true,
        },
      ],
    });

    // Create virtual network
    const vnet = new VirtualNetwork(this, "example-vnet", {
      name: "vm-vnet",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
    });

    // Create subnet with explicit VNet dependency
    const subnet = new Subnet(this, "example-subnet", {
      name: "vm-subnet",
      resourceGroupId: resourceGroup.id,
      virtualNetworkName: vnet.props.name!,
      virtualNetworkId: vnet.id, // Creates explicit Terraform dependency
      addressPrefix: "10.0.1.0/24",
    });

    // Create network interface for Linux VM
    const linuxNic = new NetworkInterface(this, "linux-nic", {
      name: "linux-nic",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      ipConfigurations: [
        {
          name: "ipconfig1",
          subnet: { id: subnet.id },
          privateIPAllocationMethod: "Dynamic",
          primary: true,
        },
      ],
    });

    // Create network interface for Windows VM
    const windowsNic = new NetworkInterface(this, "windows-nic", {
      name: "windows-nic",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      ipConfigurations: [
        {
          name: "ipconfig1",
          subnet: { id: subnet.id },
          privateIPAllocationMethod: "Dynamic",
          primary: true,
        },
      ],
    });

    // Linux VM with SSH authentication and integrated monitoring
    new VirtualMachine(this, "linux-vm", {
      name: "linuxvm",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      hardwareProfile: {
        vmSize: "Standard_B1s", // Smallest size for cost efficiency
      },
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
        computerName: "linuxvm",
        adminUsername: "azureuser",
        adminPassword: "P@ssw0rd1234!SecurePassword",
        linuxConfiguration: {
          disablePasswordAuthentication: false,
        },
      },
      networkProfile: {
        networkInterfaces: [
          {
            id: linuxNic.id,
          },
        ],
      },
      identity: {
        type: "SystemAssigned",
      },
      tags: {
        ...this.systemTags(),
        os: "linux",
        example: "basic",
        monitoring: "enabled",
        azsecpack: "nonprod", // Required by Azure Policy
      },
      monitoring: VirtualMachine.defaultMonitoring(actionGroup.id),
    });

    // Windows VM with password authentication
    new VirtualMachine(this, "windows-vm", {
      name: "windowsvm",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      hardwareProfile: {
        vmSize: "Standard_B2s", // Slightly larger for Windows
      },
      storageProfile: {
        imageReference: {
          publisher: "MicrosoftWindowsServer",
          offer: "WindowsServer",
          sku: "2022-datacenter-azure-edition-core-smalldisk",
          version: "latest",
        },
        osDisk: {
          createOption: "FromImage",
          managedDisk: {
            storageAccountType: "Standard_LRS",
          },
          diskSizeGB: 64,
        },
      },
      osProfile: {
        computerName: "windowsvm",
        adminUsername: "azureuser",
        adminPassword: "P@ssw0rd1234!SecurePassword",
        windowsConfiguration: {
          provisionVMAgent: true,
          enableAutomaticUpdates: true,
        },
      },
      networkProfile: {
        networkInterfaces: [
          {
            id: windowsNic.id,
          },
        ],
      },
      licenseType: "Windows_Server",
      tags: {
        ...this.systemTags(),
        os: "windows",
        example: "basic",
        azsecpack: "nonprod", // Required by Azure Policy
      },
    });
  }
}

describe("Virtual Machine Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup Virtual Machine resources", () => {
    const app = Testing.app();
    const stack = new VirtualMachineExampleStack(app, "test-virtual-machine");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 900000); // 15 minute timeout for VM deployment and cleanup
});
