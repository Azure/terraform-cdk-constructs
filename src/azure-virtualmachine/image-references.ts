import { WindowsVirtualMachineSourceImageReference } from "@cdktf/provider-azurerm/lib/windows-virtual-machine";

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
