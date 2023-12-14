import { Construct } from 'constructs';
import * as cdktf from 'cdktf';
import { WindowsVirtualMachine, WindowsVirtualMachineOsDisk, WindowsVirtualMachineSourceImageReference } from "@cdktf/provider-azurerm/lib/windows-virtual-machine";
import {  LinuxVirtualMachine,
          LinuxVirtualMachineSourceImageReference, 
          LinuxVirtualMachineOsDisk, 
          LinuxVirtualMachineAdminSshKey, 
          LinuxVirtualMachineIdentity, 
          LinuxVirtualMachineSecret,
          LinuxVirtualMachineAdditionalCapabilities } from "@cdktf/provider-azurerm/lib/linux-virtual-machine"; 

import { NetworkInterface } from "@cdktf/provider-azurerm/lib/network-interface";
import { Subnet } from "@cdktf/provider-azurerm/lib/subnet";
import {WindowsImageReferences} from './image-references';
import { Network } from "../../azure-virtualnetwork/lib/network";
import {VirtualMachineExtension} from '@cdktf/provider-azurerm/lib/virtual-machine-extension';
import { PublicIp } from "@cdktf/provider-azurerm/lib/public-ip";
import {AzureResource} from "../../core-azure/lib";



export interface WindowsVMProps {
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
  readonly size?: string;

  /**
   * The admin username for the virtual machine.
   */
  readonly adminUsername: string;

  /**
   * The admin password for the virtual machine.
   */
  readonly adminPassword: string;

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
  readonly tags?: { [key: string]: string; };

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
  readonly publicIPAllocationMethod?: string;

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
}

export class WindowsVM extends AzureResource {
  readonly props: WindowsVMProps;
  public readonly id: string;
  public readonly name: string;
  public readonly publicIp?: string;

  /**
   * Constructs a new instance of the AzureWindowsVirtualMachine class.
   * 
   * @param scope - The scope in which this construct is defined.
   * @param id - The ID of this construct.
   * @param props - The properties for defining a Windows Virtual Machine.
   */
  constructor(scope: Construct, id: string, props: WindowsVMProps) {
    super(scope, id);

    this.props = props;

    // Default configurations for the virtual machine.
    const defaults = {
      name: props.name || this.node.path.split("/")[0],
      location: props.location || "eastus",
      size: props.size || "Standard_B2s",
      osDisk: props.osDisk || {
        caching: "ReadWrite",
        storageAccountType: "Standard_LRS",
      },
      sourceImageReference: props.sourceImageReference || WindowsImageReferences.WindowsServer2022DatacenterCore,
      subnet: props.subnet || (new Network(this, 'vnet', { resourceGroupName: props.resourceGroupName, })).subnets["default"],
    };

    // Create Public IP if specified.
    let publicIpId: string | undefined;
    if (props.publicIPAllocationMethod) {
      const azurermPublicIp = new PublicIp(this, "public-ip", {
        name: `pip-${defaults.name}`,
        resourceGroupName: props.resourceGroupName,
        location: defaults.location,
        allocationMethod: props.publicIPAllocationMethod,
        tags: props.tags,
      });

      publicIpId = azurermPublicIp.id;
      this.publicIp = azurermPublicIp.ipAddress;
    }

    // Create the Network Interface.
    const azurermNetworkInterface = new NetworkInterface(this, "nic", {
      ...defaults,
      name: `nic-${defaults.name}`,
      resourceGroupName: props.resourceGroupName,
      ipConfiguration: [{
        name: "internal",
        subnetId: defaults.subnet.id,
        privateIpAddressAllocation: "Dynamic",
        publicIpAddressId: publicIpId,
      }],
      tags: props.tags,
    });


    // Base64 encode custom data if provided.
    const customData = props.customData || props.boostrapCustomData;
    const base64CustomData = customData ? Buffer.from(customData).toString('base64') : undefined;

    // Create the Windows Virtual Machine.
    const azurermWindowsVirtualMachine = new WindowsVirtualMachine(this, "vm", {
      ...defaults,
      resourceGroupName: props.resourceGroupName,
      adminUsername: props.adminUsername,
      adminPassword: props.adminPassword,
      tags: props.tags,
      networkInterfaceIds: [azurermNetworkInterface.id],
      sourceImageId: props.sourceImageId,
      customData: base64CustomData,
      bootDiagnostics: { storageAccountUri: props.bootDiagnosticsStorageURI},
    });

    this.id = azurermWindowsVirtualMachine.id;
    this.name = azurermWindowsVirtualMachine.name;

    // Bootstrap VM with custom script extension if bootstrap custom data is provided.
    if (props.boostrapCustomData) {
      new VirtualMachineExtension(this, "script-ext", {
        name: `${this.name}-script-ext`,
        virtualMachineId: this.id,
        publisher: "Microsoft.Compute",
        type: "CustomScriptExtension",
        typeHandlerVersion: "1.10",
        protectedSettings: "{\"commandToExecute\": \"rename  C:\\\\AzureData\\\\CustomData.bin  postdeploy.ps1 & powershell -ExecutionPolicy Unrestricted -File C:\\\\AzureData\\\\postdeploy.ps1\"}"
      });
    }
  }
}

export interface LinuxVMProps {
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
  readonly size?: string;

  /**
   * The ID of the availability set in which the VM should be placed.
   */
  readonly availabilitySetId?: string;

  /**
   * Custom data to pass to the virtual machine upon creation.
   */
  readonly userData?: string;

  /**
   * An array of SSH keys for the admin user.
   */
  readonly adminSshKey?: LinuxVirtualMachineAdminSshKey[] | cdktf.IResolvable;

  /**
   * The availability zone in which the VM should be placed.
   */
  readonly zone?: string;

  /**
   * Managed identity settings for the VM.
   */
  readonly identity?: LinuxVirtualMachineIdentity;

  /**
   * Additional capabilities like Ultra Disk compatibility.
   */
  readonly additionalCapabilities?: LinuxVirtualMachineAdditionalCapabilities;

  /**
   * An array of secrets to be passed to the VM.
   */
  readonly secret?: LinuxVirtualMachineSecret[];

  /**
   * The admin username for the virtual machine.
   */
  readonly adminUsername?: string;

  /**
   * The admin password for the virtual machine.
   */
  readonly adminPassword?: string;

  /**
   * The source image reference for the virtual machine.
   * @default - Uses WindowsServer2022DatacenterCore.
   */
  readonly sourceImageReference?: LinuxVirtualMachineSourceImageReference;

  /**
   * The ID of the source image for the virtual machine.
   */
  readonly sourceImageId?: string;

  /**
   * Tags to apply to the virtual machine.
   */
  readonly tags?: { [key: string]: string; };

  /**
   * The OS disk configuration for the virtual machine.
   * @default - Uses a disk with caching set to "ReadWrite" and storage account type "Standard_LRS".
   */
  readonly osDisk?: LinuxVirtualMachineOsDisk;

  /**
   * The subnet in which the virtual machine will be placed.
   * @default - Uses the default subnet from a new virtual network.
   */
  readonly subnet?: Subnet;

  /**
   * The allocation method for the public IP.
   */
  readonly publicIPAllocationMethod?: string;

  /**
   * Custom data to pass to the virtual machine upon creation.
   */
  readonly customData?: string;

  /**
   * Enable SSH Azure AD Login, required managed identity to be set.
   */
  readonly enableSshAzureADLogin?: boolean;

  /**
   * Bootdiagnostics settings for the VM. 
   */
  readonly bootDiagnosticsStorageURI?: string;
}

export class LinuxVM extends AzureResource {
  // Properties of the AzureLinuxVirtualMachine class
  readonly props: LinuxVMProps;
  public readonly id: string;
  public readonly name: string;
  public readonly publicIp?: string;

  /**
   * Constructs a new instance of the AzureLinuxVirtualMachine class.
   * 
   * @param scope - The scope in which this construct is defined.
   * @param id - The ID of this construct.
   * @param props - The properties for defining a Linux Virtual Machine.
   */
  constructor(scope: Construct, id: string, props: LinuxVMProps) {
    super(scope, id);

    // Assigning the properties
    this.props = props;

    // Extracting the name from the node path
    const pathName = this.node.path.split("/")[0];

    // Setting default configurations for the virtual machine
    const defaults = {
      name: props.name || pathName,
      adminUsername: props.adminUsername || `admin${pathName}`,
      location: props.location || "eastus",
      size: props.size || "Standard_B2s",
      osDisk: props.osDisk || {
        caching: "ReadWrite",
        storageAccountType: "Standard_LRS",
      },
      sourceImageReference: props.sourceImageReference || WindowsImageReferences.WindowsServer2022DatacenterCore,
      subnet: props.subnet || (new Network(this, 'vnet', { resourceGroupName: props.resourceGroupName, })).subnets["default"],
    };

    // Create Public IP if specified
    let publicIpId: string | undefined;
    if (props.publicIPAllocationMethod) {
      const azurermPublicIp = new PublicIp(this, "public-ip", {
        name: `pip-${defaults.name}`,
        resourceGroupName: props.resourceGroupName,
        location: defaults.location,
        allocationMethod: props.publicIPAllocationMethod,
        tags: props.tags,
      });

      publicIpId = azurermPublicIp.id;
      this.publicIp = azurermPublicIp.ipAddress;
    }

    // Create the Network Interface
    const azurermNetworkInterface = new NetworkInterface(this, "nic", {
      ...defaults,
      name: `nic-${defaults.name}`,
      resourceGroupName: props.resourceGroupName,
      ipConfiguration: [{
        name: "internal",
        subnetId: defaults.subnet.id,
        privateIpAddressAllocation: "Dynamic",
        publicIpAddressId: publicIpId,
      }],
      tags: props.tags,
    });

    // Create the Linux Virtual Machine
    const azurermLinuxVirtualMachine = new LinuxVirtualMachine(this, "vm", {
      ...defaults,
      resourceGroupName: props.resourceGroupName,
      adminPassword: props.adminPassword,
      tags: props.tags,
      networkInterfaceIds: [azurermNetworkInterface.id],
      sourceImageId: props.sourceImageId,
      customData: props.customData ? Buffer.from(props.customData).toString('base64') : undefined,
      userData: props.userData ? Buffer.from(props.userData).toString('base64') : undefined,
      availabilitySetId: props.availabilitySetId,
      adminSshKey: props.adminSshKey,
      bootDiagnostics: { storageAccountUri: props.bootDiagnosticsStorageURI},
      zone: props.zone,
      identity: props.identity,
      additionalCapabilities: props.additionalCapabilities,
      secret: props.secret,
      disablePasswordAuthentication: props.adminPassword ? false : true,
    });

    // Assigning the VM's ID and name to the class properties
    this.id = azurermLinuxVirtualMachine.id;
    this.name = azurermLinuxVirtualMachine.name;

    // Enable SSH Azure AD Login if specified
    if (props.enableSshAzureADLogin) {
      new VirtualMachineExtension(this, "AADSSHlogin", {
        name: "AADSSHLoginForLinux",
        virtualMachineId: this.id,
        publisher: "Microsoft.Azure.ActiveDirectory",
        type: "AADSSHLoginForLinux",
        typeHandlerVersion: "1.0",
        tags: props.tags,
      });
    }

  }

}




