import * as cdktf from "cdktf";
import { AzureVirtualMachine } from '..';
import {VirtualNetwork} from "@cdktf/provider-azurerm/lib/virtual-network";
import {Subnet} from "@cdktf/provider-azurerm/lib/subnet";
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';


const app = new App();

export class exampleAzureVirtualMachine extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-test`,

    });

    const vnet = new VirtualNetwork(this, "vnet", {
      name: "vnet-test",
      location: resourceGroup.location,
      resourceGroupName: resourceGroup.name,
      addressSpace: ["10.0.0.0/16"],

    });

    const subnet = new Subnet(this, "subnet1", {
      name: "subnet1",
      resourceGroupName: resourceGroup.name,
      virtualNetworkName: vnet.name,
      addressPrefixes: ["10.0.1.0/24"],
    });

    

    const vm = new AzureVirtualMachine(this, 'vm', {
      name: 'my-vm',
      location: "eastus",
      resource_group_name: resourceGroup.name,
      size: "Standard_B1s",
      admin_username: "testadmin",
      admin_password: "Password1234!",
      os_disk: {
        caching: "ReadWrite",
        storageAccountType: "Standard_LRS",
      },
      source_image_reference: {
        publisher: "MicrosoftWindowsServer",
        offer: "WindowsServer",
        sku: "2019-Datacenter",
        version: "latest"
      },
      subnet: subnet,
    });



    // Outputs to use for End to End Test
    const cdktfTerraformOutputRGName = new cdktf.TerraformOutput(this, "resource_group_name", {
      value: resourceGroup.name,
    });

    const cdktfTerraformOutputNsgName = new cdktf.TerraformOutput(this, "vm_name", {
      value: vm.name,
    });

    const cdktfTerraformOutputVmsize = new cdktf.TerraformOutput(this, "vm_size", {
      value: "Standard_B1s",
    });
   

    cdktfTerraformOutputRGName.overrideLogicalId("resource_group_name");
    cdktfTerraformOutputNsgName.overrideLogicalId("vm_name");
    cdktfTerraformOutputVmsize.overrideLogicalId("vm_size");

  }
}


new exampleAzureVirtualMachine(app, "testAzureVirtualMachineExample");

app.synth();