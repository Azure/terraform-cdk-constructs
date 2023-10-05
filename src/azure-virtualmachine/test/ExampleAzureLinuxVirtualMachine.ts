import * as cdktf from "cdktf";
import { AzureLinuxVirtualMachine } from '..';
import {VirtualNetwork} from "@cdktf/provider-azurerm/lib/virtual-network";
import {Subnet} from "@cdktf/provider-azurerm/lib/subnet";
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";


const app = new App();

export class exampleAzureLinuxVirtualMachine extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const clientConfig = new DataAzurermClientConfig(this, 'CurrentClientConfig', {});

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

    

    const vm = new AzureLinuxVirtualMachine(this, 'vm', {
      name: 'my-vm',
      location: "eastus",
      resourceGroupName: resourceGroup.name,
      size: "Standard_B1s",
      adminUsername: "testadmin",
      adminPassword: "Password1234!",
      osDisk: {
        caching: "ReadWrite",
        storageAccountType: "Standard_LRS",
      },
      sourceImageReference: {
        publisher: "Canonical",
        offer: "0001-com-ubuntu-server-jammy",
        sku: "22_04-lts-gen2",
        version: "latest",
      },
      subnet: subnet,
      publicIPAllocationMethod: "Static",
      userData: "#!/bin/bash\nsudo apt-get install -y apache2",
    });

    vm.addVMAdminLoginAccess(clientConfig.objectId)
    vm.addVMAdminLoginAccess("bc26a701-6acb-4117-93e0-e44054e22d60")


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

    const cdktfTerraformOutputVmEndpoint = new cdktf.TerraformOutput(this, "vm_endpoint", {
      value:vm.publicIp,
    });
   

    cdktfTerraformOutputRGName.overrideLogicalId("resource_group_name");
    cdktfTerraformOutputNsgName.overrideLogicalId("vm_name");
    cdktfTerraformOutputVmsize.overrideLogicalId("vm_size");
    cdktfTerraformOutputVmEndpoint.overrideLogicalId("vm_endpoint");

  }
}


new exampleAzureLinuxVirtualMachine(app, "testAzureLinuxVirtualMachineExample");

app.synth();