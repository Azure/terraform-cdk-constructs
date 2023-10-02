import * as cdktf from "cdktf";
import { Construct } from 'constructs';
import { WindowsVirtualMachine, WindowsVirtualMachineOsDisk, WindowsVirtualMachineSourceImageReference } from "@cdktf/provider-azurerm/lib/windows-virtual-machine";
import { NetworkInterface } from "@cdktf/provider-azurerm/lib/network-interface";
import { Subnet } from "@cdktf/provider-azurerm/lib/subnet";
import {ImageReferences} from './image-references';
import { AzureVirtualNetwork } from "../azure-virtualnetwork";


export interface VirtualMachineProps {
  readonly location?: string;
  readonly name?: string;
  readonly resource_group_name: string;
  readonly size?: string;
  readonly admin_username: string;
  readonly admin_password: string;
  readonly source_image_reference?: WindowsVirtualMachineSourceImageReference;
  readonly source_image_id?: string;
  readonly tags?: { [key: string]: string; };
  readonly os_disk?: WindowsVirtualMachineOsDisk;
  readonly subnet?: Subnet;
  readonly custom_data?: string;
}

export class AzureVirtualMachine extends Construct {
  readonly props: VirtualMachineProps;
  public readonly id: string;
  public readonly name: string;

  constructor(scope: Construct, id: string, props: VirtualMachineProps) {
    super(scope, id);

    this.props = props;



    const defaults = {
      name: props.name || this.node.path.split("/")[0],
      location: props.location || "eastus",
      size: props.size || "Standard_B2s",
      osDisk: props.os_disk || {
        caching: "ReadWrite",
        storageAccountType: "Standard_LRS",
      },
      sourceImageReference: props.source_image_reference || ImageReferences.WindowsServer2022DatacenterCore,
      subnet: props.subnet || (new AzureVirtualNetwork(this, 'vnet', {resourceGroupName: props.resource_group_name,})).subnets["default"],
    }

    // Create the Network Interface
    const azurermNetworkInterface = new NetworkInterface(this, "nic", {
      ...defaults,
      name: `nic-${defaults.name}`,
      resourceGroupName: props.resource_group_name,
      ipConfiguration: [{
        name: "internal",
        subnetId: defaults.subnet.id,
        privateIpAddressAllocation: "Dynamic",
      }],
      tags: props.tags,
    });

    // Create the Windows Virtual Machine
    const azurermWindowsVirtualMachine = new WindowsVirtualMachine(this, "vm", {
      ...defaults,
      resourceGroupName: props.resource_group_name,
      adminUsername: props.admin_username,
      adminPassword: props.admin_password,
      tags: props.tags,
      networkInterfaceIds: [azurermNetworkInterface.id],
      sourceImageId: props.source_image_id,
      customData: props.custom_data,
    });

    this.id = azurermWindowsVirtualMachine.id;
    this.name = azurermWindowsVirtualMachine.name;

    // Terraform Outputs
    const cdktfTerraformOutputVmID = new cdktf.TerraformOutput(this, "vm_id", {
      value: azurermWindowsVirtualMachine.id,
    });
    cdktfTerraformOutputVmID.overrideLogicalId("vm_id");
  }
}
