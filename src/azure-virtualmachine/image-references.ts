import { WindowsVirtualMachineSourceImageReference } from "@cdktf/provider-azurerm/lib/windows-virtual-machine";
import { LinuxVirtualMachineSourceImageReference } from "@cdktf/provider-azurerm/lib/linux-virtual-machine";


export class WindowsImageReferences {

    // Windows Server 2022 Datacenter
    static WindowsServer2022Datacenter: WindowsVirtualMachineSourceImageReference = {
        publisher: "MicrosoftWindowsServer",
        offer: "WindowsServer",
        sku: "2022-Datacenter",
        version: "latest"   
    };

    // Windows Server 2019 Datacenter
    static WindowsServer2019Datacenter: WindowsVirtualMachineSourceImageReference = {
        publisher: "MicrosoftWindowsServer",
        offer: "WindowsServer",
        sku: "2019-Datacenter",
        version: "latest"   
    };

    // Windows Server 2016 Datacenter
    static WindowsServer2016Datacenter: WindowsVirtualMachineSourceImageReference = {
        publisher: "MicrosoftWindowsServer",
        offer: "WindowsServer",
        sku: "2016-Datacenter",
        version: "latest"   
    };

    // Windows Server 2012 R2 Datacenter
    static WindowsServer2012R2Datacenter: WindowsVirtualMachineSourceImageReference = {
        publisher: "MicrosoftWindowsServer",
        offer: "WindowsServer",
        sku: "2012-R2-Datacenter",
        version: "latest"   
    };

    // Windows 10 Pro
    static Windows10Pro: WindowsVirtualMachineSourceImageReference = {
        publisher: "MicrosoftWindowsDesktop",
        offer: "Windows-10",
        sku: "19h1-pro",
        version: "latest"   
    };

    // Windows 10 Enterprise
    static Windows10Enterprise: WindowsVirtualMachineSourceImageReference = {
        publisher: "MicrosoftWindowsDesktop",
        offer: "Windows-10",
        sku: "19h1-ent",
        version: "latest"   
    };

    // Windows Server 2022 Datacenter Core
    static WindowsServer2022DatacenterCore: WindowsVirtualMachineSourceImageReference = {
        publisher: "MicrosoftWindowsServer",
        offer: "WindowsServer",
        sku: "2022-Datacenter-Core",
        version: "latest"   
    };

    // Windows Server 2019 Datacenter Core
    static WindowsServer2019DatacenterCore: WindowsVirtualMachineSourceImageReference = {
        publisher: "MicrosoftWindowsServer",
        offer: "WindowsServer",
        sku: "2019-Datacenter-Core",
        version: "latest"   
    };

    // Windows Server 2016 Datacenter Core
    static WindowsServer2016DatacenterCore: WindowsVirtualMachineSourceImageReference = {
        publisher: "MicrosoftWindowsServer",
        offer: "WindowsServer",
        sku: "2016-Datacenter-Core",
        version: "latest"   
    };

    // Windows Server 2012 R2 Datacenter Core
    static WindowsServer2012R2DatacenterCore: WindowsVirtualMachineSourceImageReference = {
        publisher: "MicrosoftWindowsServer",
        offer: "WindowsServer",
        sku: "2012-R2-Datacenter-Core",
        version: "latest"   
    };

}

export class LinuxImageReferences {

    // Ubuntu Server 18.04 LTS
    static UbuntuServer1804LTS: LinuxVirtualMachineSourceImageReference = {
        publisher: "Canonical",
        offer: "UbuntuServer",
        sku: "18.04-LTS",
        version: "latest",
    };

    // Ubuntu Server Jammy 22.04 LTS Gen2
    static UbuntuServer2204LTS: LinuxVirtualMachineSourceImageReference = {
        publisher: "Canonical",
        offer: "0001-com-ubuntu-server-jammy",
        sku: "22_04-lts-gen2",
        version: "latest",
    };

    // Debian 10
    static Debian10: LinuxVirtualMachineSourceImageReference = {
        publisher: "Debian",
        offer: "debian-10",
        sku: "10",
        version: "latest",
    };

    // Debian 11 Backports Gen2
    static Debian11BackportsGen2: LinuxVirtualMachineSourceImageReference = {
        publisher: "Debian",
        offer: "debian-11",
        sku: "11-backports-gen2",
        version: "latest",
    };

    // CentOS 7.5
    static CentOS75: LinuxVirtualMachineSourceImageReference = {
        publisher: "OpenLogic",
        offer: "CentOS",
        sku: "7.5",
        version: "latest",
    };

    // CentOS 8.5 Gen2
    static CentOS85Gen2: LinuxVirtualMachineSourceImageReference = {
        publisher: "OpenLogic",
        offer: "CentOS",
        sku: "8_5-gen2",
        version: "latest",
    };
    
}