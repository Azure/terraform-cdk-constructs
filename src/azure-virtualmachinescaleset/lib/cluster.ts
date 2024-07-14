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
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
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
   * An optional reference to the resource group in which to deploy the Virtual Machine.
   * If not provided, the Virtual Machine will be deployed in the default resource group.
   */
  readonly resourceGroup?: ResourceGroup;

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

  /**
   * Lifecycle settings for the Terraform resource.
   *
   * @remarks
   * This property specifies the lifecycle customizations for the Terraform resource,
   * allowing you to define specific actions to be taken during the lifecycle of the
   * resource. It can include settings such as create before destroy, prevent destroy,
   * ignore changes, etc.
   */
  readonly lifecycle?: cdktf.TerraformMetaArguments["lifecycle"];
}

export class LinuxCluster extends AzureResource {
  public readonly props: LinuxClusterProps;
  public resourceGroup: ResourceGroup;
  public id: string;
  public readonly name: string;
  public readonly fqn: string;

  /**
   * Represents a Linux Virtual Machine Scale Set (VMSS) within Microsoft Azure.
   *
   * This class is designed to provision and manage a scale set of Linux virtual machines, providing capabilities such as
   * auto-scaling, high availability, and simplified management. It supports detailed configurations like VM size, operating
   * system image, network settings, and administrative credentials. Additional functionalities include custom data scripts,
   * SSH configurations, and optional features like managed identity and boot diagnostics.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) application.
   * @param id - The unique identifier for this instance of the Linux cluster, used within the scope for reference.
   * @param props - Configuration properties for the Linux VM Scale Set, derived from the LinuxClusterProps interface. These include:
   *                - `location`: The geographic location where the scale set will be hosted (e.g., "eastus").
   *                - `name`: The name of the scale set, which must be unique within the resource group.
   *                - `resourceGroup`: Optional. Reference to the resource group for deployment.
   *                - `sku`: The size specification of the VMs (e.g., "Standard_B2s").
   *                - `adminUsername`: The administrator username for the VMs.
   *                - `adminPassword`: The administrator password for the VMs.
   *                - `adminSshKey`: SSH keys for secure access to the VMs.
   *                - `zones`: The availability zones for deploying the VMs.
   *                - `identity`: Managed identity settings for accessing other Azure services.
   *                - `sourceImageReference`: A reference to the specific Linux image to be used for the VMs.
   *                - `sourceImageId`: The identifier for a custom image to use for the VMs.
   *                - `tags`: Key-value pairs for resource tagging.
   *                - `osDisk`: Configuration for the VMs' operating system disks.
   *                - `subnet`: Specifies the subnet within which the VMs will be placed.
   *                - `publicIPAddress`: Method used to allocate public IP addresses to the VMs.
   *                - `customData`: Scripts or commands passed to the VMs at startup.
   *                - `instances`: The number of VM instances in the scale set.
   *                - `upgradePolicyMode`: The upgrade policy mode for the VMSS.
   *                - `overprovision`: Specifies if the VMSS should be overprovisioned to maintain capacity during updates.
   *                - `scaleInPolicy`: The scale-in policy for the VMSS.
   *                - `bootDiagnosticsStorageURI`: URI for storage where VMSS boot diagnostics are collected.
   *                - `enableSshAzureADLogin`: Option to enable Azure AD login for SSH on the VMs.
   *
   * Example usage:
   * ```typescript
   * const linuxCluster = new LinuxCluster(this, 'MyLinuxCluster', {
   *   resourceGroup: myResourceGroup,
   *   name: 'myCluster',
   *   sku: 'Standard_DS1_v2',
   *   adminUsername: 'adminuser',
   *   adminSshKey: [{ publicKey: 'ssh-rsa AAAAB...' }],
   *   sourceImageReference: { publisher: 'Canonical', offer: 'UbuntuServer', sku: '18.04-LTS', version: 'latest' },
   *   osDisk: { caching: 'ReadWrite', storageAccountType: 'Standard_LRS' },
   *   subnet: mySubnet,
   *   instances: 3,
   *   tags: { environment: 'production' }
   * });
   * ```
   * This class initializes a Linux VM Scale Set with the specified configurations, handling details like VM creation,
   * scaling policies, network setup, OS installation, and security settings, providing a robust and scalable infrastructure
   * for hosting cloud-based Linux applications.
   */
  constructor(scope: Construct, id: string, props: LinuxClusterProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroup = this.setupResourceGroup(props);

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
        props.sourceImageReference || LinuxImageReferences.ubuntuServer2204LTS,
      subnet:
        props.subnet ||
        new Network(this, "vnet", {
          resourceGroup: this.resourceGroup,
        }).subnets.default,
    };

    const azurermLinuxVirtualMachineScaleSet = new LinuxVirtualMachineScaleSet(
      this,
      "vmss",
      {
        ...defaults,
        resourceGroupName: this.resourceGroup.name,
        adminPassword: props.adminPassword,
        disablePasswordAuthentication: props.adminPassword ? false : true,
        tags: props.tags,
        lifecycle: props.lifecycle,
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
   * An optional reference to the resource group in which to deploy the Virtual Machine.
   * If not provided, the Virtual Machine will be deployed in the default resource group.
   */
  readonly resourceGroup?: ResourceGroup;

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

  /**
   * Lifecycle settings for the Terraform resource.
   *
   * @remarks
   * This property specifies the lifecycle customizations for the Terraform resource,
   * allowing you to define specific actions to be taken during the lifecycle of the
   * resource. It can include settings such as create before destroy, prevent destroy,
   * ignore changes, etc.
   */
  readonly lifecycle?: cdktf.TerraformMetaArguments["lifecycle"];
}

export class WindowsCluster extends AzureResource {
  readonly props: WindowsClusterProps;
  public resourceGroup: ResourceGroup;
  public id: string;
  public readonly name: string;

  /**
   * Represents a Windows Virtual Machine Scale Set (VMSS) within Microsoft Azure.
   *
   * This class provides a way to deploy and manage a scale set of Windows virtual machines, allowing for configurations such as
   * auto-scaling, high availability, and simplified patch management. It supports detailed specifications including
   * VM size, the operating system image, network settings, and administrative credentials. Additional capabilities include
   * custom data scripts, automatic OS updates, and optional features like managed identity and boot diagnostics.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) application.
   * @param id - The unique identifier for this instance of the Windows cluster, used within the scope for reference.
   * @param props - Configuration properties for the Windows VM Scale Set, derived from the WindowsClusterProps interface. These include:
   *                - `location`: The geographic location where the scale set will be hosted (e.g., "eastus").
   *                - `name`: The name of the scale set, which must be unique within the resource group.
   *                - `resourceGroup`: Optional. Reference to the resource group for deployment.
   *                - `sku`: The size specification of the VMs (e.g., "Standard_B2s").
   *                - `adminUsername`: The administrator username for the VMs.
   *                - `adminPassword`: The administrator password for the VMs.
   *                - `zones`: The availability zones for deploying the VMs.
   *                - `instances`: The number of VM instances in the scale set.
   *                - `sourceImageReference`: A reference to the specific Windows image to be used for the VMs.
   *                - `sourceImageId`: The identifier for a custom image to use for the VMs.
   *                - `tags`: Key-value pairs for resource tagging.
   *                - `osDisk`: Configuration for the VMs' operating system disks.
   *                - `subnet`: Specifies the subnet within which the VMs will be placed.
   *                - `publicIPAddress`: Method used to allocate public IP addresses to the VMs.
   *                - `customData`: Scripts or commands passed to the VMs at startup.
   *                - `upgradePolicyMode`: The upgrade policy mode for the VMSS.
   *                - `overprovision`: Specifies if the VMSS should be overprovisioned to maintain capacity during updates.
   *                - `scaleInPolicy`: The scale-in policy for the VMSS.
   *                - `bootDiagnosticsStorageURI`: URI for storage where VMSS boot diagnostics are collected.
   *                - `enableSshAzureADLogin`: Option to enable Azure AD login for SSH on the VMs.
   *
   * Example usage:
   * ```typescript
   * const windowsCluster = new WindowsCluster(this, 'MyWindowsCluster', {
   *   resourceGroup: myResourceGroup,
   *   name: 'myCluster',
   *   sku: 'Standard_DS1_v2',
   *   adminUsername: 'adminuser',
   *   adminPassword: 'securepassword123',
   *   sourceImageReference: { publisher: 'MicrosoftWindowsServer', offer: 'WindowsServer', sku: '2019-Datacenter', version: 'latest' },
   *   osDisk: { caching: 'ReadWrite', storageAccountType: 'Standard_LRS' },
   *   subnet: mySubnet,
   *   instances: 3,
   *   tags: { environment: 'production' }
   * });
   * ```
   * This class initializes a Windows VM Scale Set with the specified configurations, handling details like VM creation,
   * scaling policies, network setup, OS installation, and security settings, providing a robust and scalable infrastructure
   * for hosting cloud-based Windows applications.
   */
  constructor(scope: Construct, id: string, props: WindowsClusterProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroup = this.setupResourceGroup(props);

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
        WindowsImageReferences.windowsServer2022DatacenterCore,
      subnet:
        props.subnet ||
        new Network(this, "vnet", {
          resourceGroup: this.resourceGroup,
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
        resourceGroupName: this.resourceGroup.name,
        adminUsername: props.adminUsername,
        adminPassword: props.adminPassword,
        tags: props.tags,
        lifecycle: props.lifecycle,
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
