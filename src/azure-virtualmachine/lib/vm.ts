import {
  LinuxVirtualMachine,
  LinuxVirtualMachineSourceImageReference,
  LinuxVirtualMachineOsDisk,
  LinuxVirtualMachineAdminSshKey,
  LinuxVirtualMachineIdentity,
  LinuxVirtualMachineSecret,
  LinuxVirtualMachineAdditionalCapabilities,
} from "@cdktf/provider-azurerm/lib/linux-virtual-machine";
import { NetworkInterface } from "@cdktf/provider-azurerm/lib/network-interface";
import { PublicIp } from "@cdktf/provider-azurerm/lib/public-ip";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Subnet } from "@cdktf/provider-azurerm/lib/subnet";
import { VirtualMachineExtension } from "@cdktf/provider-azurerm/lib/virtual-machine-extension";
import {
  WindowsVirtualMachine,
  WindowsVirtualMachineOsDisk,
  WindowsVirtualMachineSourceImageReference,
} from "@cdktf/provider-azurerm/lib/windows-virtual-machine";
import * as cdktf from "cdktf";
import { Construct } from "constructs";

import { WindowsImageReferences } from "./image-references";
import { Network } from "../../azure-virtualnetwork/lib/network";
import { AzureResource } from "../../core-azure/lib";

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
  readonly resourceGroup: ResourceGroup;

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
  public readonly props: WindowsVMProps;
  public resourceGroup: ResourceGroup;
  public id: string;
  public readonly name: string;
  public readonly publicIp?: string;

  /**
   * Represents a Windows-based Virtual Machine (VM) within Microsoft Azure.
   *
   * This class is designed to provision and manage a Windows VM in Azure, allowing for detailed configuration including
   * the VM's size, the operating system image, network settings, and administrative credentials. It supports customization
   * of the OS disk, networking setup, and optional features like custom data scripts and boot diagnostics.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) application.
   * @param id - The unique identifier for this instance of the Windows VM, used within the scope for reference.
   * @param props - Configuration properties for the Windows Virtual Machine, derived from the WindowsVMProps interface. These include:
   *                - `location`: The geographic location where the VM will be hosted (e.g., "eastus").
   *                - `name`: The name of the VM, which must be unique within the resource group.
   *                - `resourceGroup`: The ResourceGroup within which the VM will be created.
   *                - `size`: The size specification of the VM (e.g., "Standard_B2s").
   *                - `adminUsername`: The administrator username for accessing the VM.
   *                - `adminPassword`: The administrator password for accessing the VM.
   *                - `sourceImageReference`: A reference to the specific Windows image to be used for the VM.
   *                - `sourceImageId`: The identifier for a custom image to use for the VM.
   *                - `tags`: Key-value pairs for resource tagging.
   *                - `osDisk`: Configuration for the VM's operating system disk.
   *                - `subnet`: Specifies the subnet within which the VM will be placed.
   *                - `publicIPAllocationMethod`: The method used to allocate a public IP address to the VM.
   *                - `customData`: Scripts or commands passed to the VM at startup.
   *                - `bootstrapCustomData`: Custom data used to trigger the Azure Custom Script Extension for VM setup tasks.
   *                - `bootDiagnosticsStorageURI`: URI for storage where VM boot diagnostics are collected.
   *
   * Example usage:
   * ```typescript
   * const vm = new WindowsVM(this, 'MyWindowsVM', {
   *   resourceGroup: myResourceGroup,
   *   name: 'myVM',
   *   size: 'Standard_DS1_v2',
   *   adminUsername: 'adminuser',
   *   adminPassword: 'securepassword123',
   *   sourceImageReference: { publisher: 'MicrosoftWindowsServer', offer: 'WindowsServer', sku: '2019-Datacenter', version: 'latest' },
   *   osDisk: { caching: 'ReadWrite', storageAccountType: 'Standard_LRS' },
   *   subnet: mySubnet,
   *   tags: { environment: 'production' }
   * });
   * ```
   * This class initializes a Windows VM with the specified configurations, handling details like network setup, OS installation,
   * and security settings, thus providing a robust infrastructure for hosting applications on Windows Server environments.
   */
  constructor(scope: Construct, id: string, props: WindowsVMProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroup = props.resourceGroup;

    // Default configurations for the virtual machine.
    const defaults = {
      name: props.name || this.node.path.split("/")[0],
      location: props.location || "eastus",
      size: props.size || "Standard_B2s",
      osDisk: props.osDisk || {
        caching: "ReadWrite",
        storageAccountType: "Standard_LRS",
      },
      sourceImageReference:
        props.sourceImageReference ||
        WindowsImageReferences.windowsServer2022DatacenterCore,
      subnet:
        props.subnet ||
        new Network(this, "vnet", {
          resourceGroup: props.resourceGroup,
        }).subnets.default,
    };

    // Create Public IP if specified.
    let publicIpId: string | undefined;
    if (props.publicIPAllocationMethod) {
      const azurermPublicIp = new PublicIp(this, "public-ip", {
        name: `pip-${defaults.name}`,
        resourceGroupName: props.resourceGroup.name,
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
      resourceGroupName: props.resourceGroup.name,
      ipConfiguration: [
        {
          name: "internal",
          subnetId: defaults.subnet.id,
          privateIpAddressAllocation: "Dynamic",
          publicIpAddressId: publicIpId,
        },
      ],
      tags: props.tags,
    });

    // Base64 encode custom data if provided.
    const customData = props.customData || props.boostrapCustomData;
    const base64CustomData = customData
      ? Buffer.from(customData).toString("base64")
      : undefined;

    // Create the Windows Virtual Machine.
    const azurermWindowsVirtualMachine = new WindowsVirtualMachine(this, "vm", {
      ...defaults,
      resourceGroupName: props.resourceGroup.name,
      adminUsername: props.adminUsername,
      adminPassword: props.adminPassword,
      tags: props.tags,
      networkInterfaceIds: [azurermNetworkInterface.id],
      sourceImageId: props.sourceImageId,
      customData: base64CustomData,
      bootDiagnostics: { storageAccountUri: props.bootDiagnosticsStorageURI },
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
        protectedSettings:
          '{"commandToExecute": "rename  C:\\\\AzureData\\\\CustomData.bin  postdeploy.ps1 & powershell -ExecutionPolicy Unrestricted -File C:\\\\AzureData\\\\postdeploy.ps1"}',
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
  readonly resourceGroup: ResourceGroup;

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
  readonly tags?: { [key: string]: string };

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
  public resourceGroup: ResourceGroup;
  public id: string;
  public readonly name: string;
  public readonly publicIp?: string;

  /**
   * Represents a Linux-based Virtual Machine (VM) within Microsoft Azure.
   *
   * This class is designed to provision and manage a Linux VM in Azure, facilitating detailed configuration including
   * VM size, the operating system image, network settings, and administrative credentials. It supports custom data scripts,
   * SSH configurations, and optional features like managed identity and boot diagnostics.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) application.
   * @param id - The unique identifier for this instance of the Linux VM, used within the scope for reference.
   * @param props - Configuration properties for the Linux Virtual Machine, derived from the LinuxVMProps interface. These include:
   *                - `location`: The geographic location where the VM will be hosted (e.g., "eastus").
   *                - `name`: The name of the VM, which must be unique within the resource group.
   *                - `resourceGroup`: The ResourceGroup within which the VM will be created.
   *                - `size`: The size specification of the VM (e.g., "Standard_B2s").
   *                - `availabilitySetId`: The ID of the availability set in which to include the VM.
   *                - `userData`: Custom data scripts to pass to the VM upon creation.
   *                - `adminSshKey`: SSH keys for secure access to the VM.
   *                - `zone`: The availability zone for deploying the VM.
   *                - `identity`: Managed identity settings for accessing other Azure services.
   *                - `additionalCapabilities`: Special capabilities like Ultra Disk support.
   *                - `sourceImageReference`: A reference to the specific Linux image to be used for the VM.
   *                - `sourceImageId`: The identifier for a custom image to use for the VM.
   *                - `tags`: Key-value pairs for resource tagging.
   *                - `osDisk`: Configuration for the VM's operating system disk.
   *                - `subnet`: Specifies the subnet within which the VM will be placed.
   *                - `publicIPAllocationMethod`: Method used to allocate a public IP address.
   *                - `customData`: Additional scripts or commands passed to the VM at startup.
   *                - `enableSshAzureADLogin`: Option to enable Azure AD login for SSH.
   *                - `bootDiagnosticsStorageURI`: URI for storage where VM boot diagnostics are collected.
   *
   * Example usage:
   * ```typescript
   * const linuxVM = new LinuxVM(this, 'MyLinuxVM', {
   *   resourceGroup: myResourceGroup,
   *   name: 'myVM',
   *   size: 'Standard_DS1_v2',
   *   adminUsername: 'adminuser',
   *   adminSshKey: [{ publicKey: 'ssh-rsa AAAAB...' }],
   *   sourceImageReference: { publisher: 'Canonical', offer: 'UbuntuServer', sku: '18.04-LTS', version: 'latest' },
   *   osDisk: { caching: 'ReadWrite', storageAccountType: 'Standard_LRS' },
   *   subnet: mySubnet,
   *   tags: { environment: 'production' }
   * });
   * ```
   * This class initializes a Linux VM with the specified configurations, handling details like network setup, OS installation,
   * and security settings, thus providing a robust infrastructure for hosting applications on Linux environments.
   */
  constructor(scope: Construct, id: string, props: LinuxVMProps) {
    super(scope, id);

    // Assigning the properties
    this.props = props;
    this.resourceGroup = props.resourceGroup;

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
      sourceImageReference:
        props.sourceImageReference ||
        WindowsImageReferences.windowsServer2022DatacenterCore,
      subnet:
        props.subnet ||
        new Network(this, "vnet", {
          resourceGroup: props.resourceGroup,
        }).subnets.default,
    };

    // Create Public IP if specified
    let publicIpId: string | undefined;
    if (props.publicIPAllocationMethod) {
      const azurermPublicIp = new PublicIp(this, "public-ip", {
        name: `pip-${defaults.name}`,
        resourceGroupName: props.resourceGroup.name,
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
      resourceGroupName: props.resourceGroup.name,
      ipConfiguration: [
        {
          name: "internal",
          subnetId: defaults.subnet.id,
          privateIpAddressAllocation: "Dynamic",
          publicIpAddressId: publicIpId,
        },
      ],
      tags: props.tags,
    });

    // Create the Linux Virtual Machine
    const azurermLinuxVirtualMachine = new LinuxVirtualMachine(this, "vm", {
      ...defaults,
      resourceGroupName: props.resourceGroup.name,
      adminPassword: props.adminPassword,
      tags: props.tags,
      networkInterfaceIds: [azurermNetworkInterface.id],
      sourceImageId: props.sourceImageId,
      customData: props.customData
        ? Buffer.from(props.customData).toString("base64")
        : undefined,
      userData: props.userData
        ? Buffer.from(props.userData).toString("base64")
        : undefined,
      availabilitySetId: props.availabilitySetId,
      adminSshKey: props.adminSshKey,
      bootDiagnostics: { storageAccountUri: props.bootDiagnosticsStorageURI },
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
