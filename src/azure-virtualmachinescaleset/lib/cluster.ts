import {
  LinuxVirtualMachineSourceImageReference,
  LinuxVirtualMachineOsDisk,
  LinuxVirtualMachineAdminSshKey,
  LinuxVirtualMachineIdentity,
} from "@cdktf/provider-azurerm/lib/linux-virtual-machine";
import {
  LinuxVirtualMachineScaleSet,
  LinuxVirtualMachineScaleSetNetworkInterfaceIpConfigurationPublicIpAddress,
} from "@cdktf/provider-azurerm/lib/linux-virtual-machine-scale-set";
import { Subnet } from "@cdktf/provider-azurerm/lib/subnet";
import { VirtualMachineScaleSetExtensionA } from "@cdktf/provider-azurerm/lib/virtual-machine-scale-set-extension";
import {
  WindowsVirtualMachineOsDisk,
  WindowsVirtualMachineSourceImageReference,
} from "@cdktf/provider-azurerm/lib/windows-virtual-machine";
import {
  WindowsVirtualMachineScaleSet,
  WindowsVirtualMachineScaleSetNetworkInterfaceIpConfigurationPublicIpAddress,
} from "@cdktf/provider-azurerm/lib/windows-virtual-machine-scale-set";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  WindowsImageReferences,
  LinuxImageReferences,
} from "../../azure-virtualmachine";
import { Network } from "../../azure-virtualnetwork/lib/network";
import { AzureResource } from "../../core-azure/lib";

export interface LinuxClusterProps {
  /**
   * The Azure location where the virtual machine scale set should be created.
   * @default "eastus"
   */
  readonly location?: string;

  /**
   * The name of the virtual machine scale set.
   * @default - Uses the name derived from the construct path.
   */
  readonly name?: string;

  /**
   * The admin username for the virtual machine.
   */
  readonly adminUsername?: string;

  /**
   * The admin password for the virtual machine.
   */
  readonly adminPassword?: string;

  /**
   * The name of the resource group in which the virtual machine scale set will be created.
   */
  readonly resourceGroupName: string;

  /**
   * The size of the virtual machines in the scale set.
   * @default "Standard_B2s"
   */
  readonly sku?: string;

  /**
   * Custom data to pass to the virtual machines upon creation.
   */
  readonly userData?: string;

  /**
   * An array of SSH keys for the admin user.
   */
  readonly adminSshKey?: LinuxVirtualMachineAdminSshKey[] | cdktf.IResolvable;

  /**
   * The availability zone(s) in which the VMs should be placed.
   */
  readonly zones?: string[];

  /**
   * Managed identity settings for the VMs.
   */
  readonly identity?: LinuxVirtualMachineIdentity;

  /**
   * The source image reference for the virtual machines.
   * @default - Uses a default Ubuntu image.
   */
  readonly sourceImageReference?: LinuxVirtualMachineSourceImageReference;

  /**
   * The ID of the source image for the virtual machines.
   */
  readonly sourceImageId?: string;

  /**
   * Tags to apply to the virtual machine scale set.
   */
  readonly tags?: { [key: string]: string };

  /**
   * The OS disk configuration for the virtual machines.
   * @default - Uses a disk with caching set to "ReadWrite" and storage account type "Standard_LRS".
   */
  readonly osDisk?: LinuxVirtualMachineOsDisk;

  /**
   * The subnet in which the virtual machines will be placed.
   */
  readonly subnet?: Subnet;

  /**
   * The allocation method for the public IP.
   */
  readonly publicIPAddress?: LinuxVirtualMachineScaleSetNetworkInterfaceIpConfigurationPublicIpAddress[];

  /**
   * Custom data to pass to the virtual machines upon creation.
   */
  readonly customData?: string;

  /**
   * The number of VM instances in the scale set.
   * @default 2
   */
  readonly instances?: number;

  /**
   * Specifies the scale set's upgrade policy settings.
   */
  readonly upgradePolicyMode?: string;

  /**
   * Specifies if the VMSS should be overprovisioned.
   * @default true
   */
  readonly overprovision?: boolean;

  /**
   * Specifies the scale-in policy for the VMSS.
   */
  readonly scaleInPolicy?: string;

  /**
   * Boot diagnostics settings for the VMSS.
   */
  readonly bootDiagnosticsStorageURI?: string;

  /**
   * Enable SSH Azure AD Login, required managed identity to be set.
   * @default false
   */
  readonly enableSshAzureADLogin?: boolean;
}

export class LinuxCluster extends AzureResource {
  public readonly props: LinuxClusterProps;
  public readonly resourceGroupName: string;
  public readonly id: string;
  public readonly name: string;
  public readonly fqn: string;

  /**
   * Constructs a new instance of the AzureLinuxVirtualMachine class.
   *
   * @param scope - The scope in which this construct is defined.
   * @param id - The ID of this construct.
   * @param props - The properties for defining a Linux Virtual Machine.
   */

  constructor(scope: Construct, id: string, props: LinuxClusterProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroupName = props.resourceGroupName;

    const pathName = this.node.path.split("/")[0];

    const defaults = {
      name: props.name || pathName,
      adminUsername: props.adminUsername || `admin${pathName}`,
      location: props.location || "eastus",
      sku: props.sku || "Standard_B2s",
      instances: props.instances || 1,
      osDisk: props.osDisk || {
        caching: "ReadWrite",
        storageAccountType: "Standard_LRS",
      },
      sourceImageReference:
        props.sourceImageReference || LinuxImageReferences.UbuntuServer2204LTS,
      subnet:
        props.subnet ||
        new Network(this, "vnet", {
          resourceGroupName: props.resourceGroupName,
        }).subnets.default,
    };

    const azurermLinuxVirtualMachineScaleSet = new LinuxVirtualMachineScaleSet(
      this,
      "vmss",
      {
        ...defaults,
        resourceGroupName: props.resourceGroupName,
        adminPassword: props.adminPassword,
        disablePasswordAuthentication: props.adminPassword ? false : true,
        tags: props.tags,
        networkInterface: [
          {
            name: `nic-${defaults.name}`,
            primary: true,
            ipConfiguration: [
              {
                name: "internal",
                subnetId: defaults.subnet.id,
                primary: true,
                publicIpAddress: props.publicIPAddress,
              },
            ],
          },
        ],
        osDisk: {
          ...defaults.osDisk,
        },
        sourceImageId: props.sourceImageId,
        customData: props.customData
          ? Buffer.from(props.customData).toString("base64")
          : undefined,
        userData: props.userData
          ? Buffer.from(props.userData).toString("base64")
          : undefined,
        adminSshKey: props.adminSshKey,
        identity: props.identity,
      },
    );

    this.id = azurermLinuxVirtualMachineScaleSet.id;
    this.name = azurermLinuxVirtualMachineScaleSet.name;
    this.fqn = azurermLinuxVirtualMachineScaleSet.fqn;

    // Enable SSH Azure AD Login if specified
    if (props.enableSshAzureADLogin) {
      new VirtualMachineScaleSetExtensionA(this, "AADSSHlogin", {
        name: "AADSSHLoginForLinux",
        virtualMachineScaleSetId: this.id,
        publisher: "Microsoft.Azure.ActiveDirectory",
        type: "AADSSHLoginForLinux",
        typeHandlerVersion: "1.0",
      });
    }
  }
}

export interface WindowsClusterProps {
  /**
   * The Azure location where the virtual machine should be created.
   * @default "eastus"
   */
  readonly location?: string;

  /**
   * The name of the virtual machine.
   * @default - Uses the name derived from the construct path.
   */
  readonly name?: string;

  /**
   * The name of the resource group in which the virtual machine will be created.
   */
  readonly resourceGroupName: string;

  /**
   * The size of the virtual machine.
   * @default "Standard_B2s"
   */
  readonly sku?: string;

  /**
   * The admin username for the virtual machine.
   */
  readonly adminUsername: string;

  /**
   * The admin password for the virtual machine.
   */
  readonly adminPassword: string;

  /**
   * The availability zone(s) in which the VMs should be placed.
   */
  readonly zones?: string[];

  /**
   * The number of VM instances in the scale set.
   * @default 2
   */
  readonly instances?: number;

  /**
   * The source image reference for the virtual machine.
   * @default - Uses WindowsServer2022DatacenterCore.
   */
  readonly sourceImageReference?: WindowsVirtualMachineSourceImageReference;

  /**
   * The ID of the source image for the virtual machine.
   */
  readonly sourceImageId?: string;

  /**
   * Tags to apply to the virtual machine.
   */
  readonly tags?: { [key: string]: string };

  /**
   * The OS disk configuration for the virtual machine.
   * @default - Uses a disk with caching set to "ReadWrite" and storage account type "Standard_LRS".
   */
  readonly osDisk?: WindowsVirtualMachineOsDisk;

  /**
   * The subnet in which the virtual machine will be placed.
   * @default - Uses the default subnet from a new virtual network.
   */
  readonly subnet?: Subnet;

  /**
   * The allocation method for the public IP.
   */
  readonly publicIPAddress?: WindowsVirtualMachineScaleSetNetworkInterfaceIpConfigurationPublicIpAddress[];

  /**
   * Specifies the scale set's upgrade policy settings.
   */
  readonly upgradePolicyMode?: string;

  /**
   * Custom data to pass to the virtual machine upon creation.
   */
  readonly customData?: string;

  /**
   * Custom data to bootstrap the virtual machine. Automatically triggers Azure Custom Script extension to deploy code in custom data.
   */
  readonly boostrapCustomData?: string;

  /**
   * Bootdiagnostics settings for the VM.
   */
  readonly bootDiagnosticsStorageURI?: string;

  /**
   * Specifies if the VMSS should be overprovisioned.
   * @default true
   */
  readonly overprovision?: boolean;

  /**
   * Specifies the scale-in policy for the VMSS.
   */
  readonly scaleInPolicy?: string;
}

export class WindowsCluster extends AzureResource {
  readonly props: WindowsClusterProps;
  public readonly resourceGroupName: string;
  public readonly id: string;
  public readonly name: string;

  /**
   * Constructs a new instance of the AzureWindowsVirtualMachine class.
   *
   * @param scope - The scope in which this construct is defined.
   * @param id - The ID of this construct.
   * @param props - The properties for defining a Windows Virtual Machine.
   */
  constructor(scope: Construct, id: string, props: WindowsClusterProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroupName = props.resourceGroupName;

    const pathName = this.node.path.split("/")[0];

    // Default configurations for the virtual machine.
    const defaults = {
      name: props.name || this.node.path.split("/")[0],
      adminUsername: props.adminUsername || `admin${pathName}`,
      location: props.location || "eastus",
      sku: props.sku || "Standard_B2s",
      instances: props.instances || 1,
      osDisk: props.osDisk || {
        caching: "ReadWrite",
        storageAccountType: "Standard_LRS",
      },
      sourceImageReference:
        props.sourceImageReference ||
        WindowsImageReferences.WindowsServer2022DatacenterCore,
      subnet:
        props.subnet ||
        new Network(this, "vnet", {
          resourceGroupName: props.resourceGroupName,
        }).subnets.default,
    };

    // Base64 encode custom data if provided.
    const customData = props.customData || props.boostrapCustomData;
    const base64CustomData = customData
      ? Buffer.from(customData).toString("base64")
      : undefined;

    // Create the Windows Virtual Machine.
    const azurermWindowsVirtualMachine = new WindowsVirtualMachineScaleSet(
      this,
      "vmss",
      {
        ...defaults,
        resourceGroupName: props.resourceGroupName,
        adminUsername: props.adminUsername,
        adminPassword: props.adminPassword,
        tags: props.tags,
        networkInterface: [
          {
            name: `nic-${defaults.name}`,
            primary: true,
            ipConfiguration: [
              {
                name: "internal",
                subnetId: defaults.subnet.id,
                primary: true,
                publicIpAddress: props.publicIPAddress,
              },
            ],
          },
        ],
        osDisk: {
          ...defaults.osDisk,
        },
        sourceImageId: props.sourceImageId,
        customData: base64CustomData,
        bootDiagnostics: { storageAccountUri: props.bootDiagnosticsStorageURI },
      },
    );

    this.id = azurermWindowsVirtualMachine.id;
    this.name = azurermWindowsVirtualMachine.name;

    // Bootstrap VM with custom script extension if bootstrap custom data is provided.
    if (props.boostrapCustomData) {
      new VirtualMachineScaleSetExtensionA(this, "script-ext", {
        name: `${this.name}-script-ext`,
        virtualMachineScaleSetId: this.id,
        publisher: "Microsoft.Compute",
        type: "CustomScriptExtension",
        typeHandlerVersion: "1.10",
        protectedSettings:
          '{"commandToExecute": "rename  C:\\\\AzureData\\\\CustomData.bin  postdeploy.ps1 & powershell -ExecutionPolicy Unrestricted -File C:\\\\AzureData\\\\postdeploy.ps1"}',
      });
    }
  }
}
