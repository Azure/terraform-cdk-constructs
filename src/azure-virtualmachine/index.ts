//import {readFileSync } from 'fs';
import { Construct } from 'constructs';
import { WindowsVirtualMachine, WindowsVirtualMachineOsDisk, WindowsVirtualMachineSourceImageReference } from "@cdktf/provider-azurerm/lib/windows-virtual-machine";
import { NetworkInterface } from "@cdktf/provider-azurerm/lib/network-interface";
import { Subnet } from "@cdktf/provider-azurerm/lib/subnet";
import {WindowsImageReferences} from './image-references';
import { AzureVirtualNetwork } from "../azure-virtualnetwork";
import {VirtualMachineExtension} from '@cdktf/provider-azurerm/lib/virtual-machine-extension';
import { PublicIp } from "@cdktf/provider-azurerm/lib/public-ip";

export interface WindowsVirtualMachineProps {
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
  readonly resource_group_name: string;

  /**
   * The size of the virtual machine.
   * @default "Standard_B2s"
   */
  readonly size?: string;

  /**
   * The admin username for the virtual machine.
   */
  readonly admin_username: string;

  /**
   * The admin password for the virtual machine.
   */
  readonly admin_password: string;

  /**
   * The source image reference for the virtual machine.
   * @default - Uses WindowsServer2022DatacenterCore.
   */
  readonly source_image_reference?: WindowsVirtualMachineSourceImageReference;

  /**
   * The ID of the source image for the virtual machine.
   */
  readonly source_image_id?: string;

  /**
   * Tags to apply to the virtual machine.
   */
  readonly tags?: { [key: string]: string; };

  /**
   * The OS disk configuration for the virtual machine.
   * @default - Uses a disk with caching set to "ReadWrite" and storage account type "Standard_LRS".
   */
  readonly os_disk?: WindowsVirtualMachineOsDisk;

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
}

export class AzureWindowsVirtualMachine extends Construct {
  readonly props: WindowsVirtualMachineProps;
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
  constructor(scope: Construct, id: string, props: WindowsVirtualMachineProps) {
    super(scope, id);

    this.props = props;

    // Default configurations for the virtual machine.
    const defaults = {
      name: props.name || this.node.path.split("/")[0],
      location: props.location || "eastus",
      size: props.size || "Standard_B2s",
      osDisk: props.os_disk || {
        caching: "ReadWrite",
        storageAccountType: "Standard_LRS",
      },
      sourceImageReference: props.source_image_reference || WindowsImageReferences.WindowsServer2022DatacenterCore,
      subnet: props.subnet || (new AzureVirtualNetwork(this, 'vnet', { resourceGroupName: props.resource_group_name, })).subnets["default"],
    };

    // Create Public IP if specified.
    let publicIpId: string | undefined;
    if (props.publicIPAllocationMethod) {
      const azurermPublicIp = new PublicIp(this, "public-ip", {
        name: `pip-${defaults.name}`,
        resourceGroupName: props.resource_group_name,
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
      resourceGroupName: props.resource_group_name,
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
      resourceGroupName: props.resource_group_name,
      adminUsername: props.admin_username,
      adminPassword: props.admin_password,
      tags: props.tags,
      networkInterfaceIds: [azurermNetworkInterface.id],
      sourceImageId: props.source_image_id,
      customData: base64CustomData,
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
