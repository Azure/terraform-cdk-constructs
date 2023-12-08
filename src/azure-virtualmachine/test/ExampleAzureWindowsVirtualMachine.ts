import * as cdktf from "cdktf";
import { AzureWindowsVirtualMachine } from '..';
import {VirtualNetwork} from "@cdktf/provider-azurerm/lib/virtual-network";
import {Subnet} from "@cdktf/provider-azurerm/lib/subnet";
import {BaseTestStack} from "../../testing";
import { App} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";
import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";


const app = new App();

export class exampleAzureWindowsVirtualMachine extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const clientConfig = new DataAzurermClientConfig(this, 'CurrentClientConfig', {});

    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-${this.name}`,

    });

    const vnet = new VirtualNetwork(this, "vnet", {
      name: `vnet-${this.name}`,
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

    const storage = new StorageAccount(this, "storage", {
      name: `sta${this.name}87u98`,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      accountReplicationType: "LRS",
      accountTier: "Standard",
      minTlsVersion: "TLS1_2",
      publicNetworkAccessEnabled: false,
      networkRules: {
        bypass: ['AzureServices'],
        defaultAction: 'Deny',
      },
    });


    

    const vm = new AzureWindowsVirtualMachine(this, 'vm', {
      name: this.name,
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
        publisher: "MicrosoftWindowsServer",
        offer: "WindowsServer",
        sku: "2019-Datacenter",
        version: "latest"
      },
      subnet: subnet,
      publicIPAllocationMethod: "Static",
      boostrapCustomData: "Install-WindowsFeature -Name Web-Server; $website = '<h1>Hello World!</h1>'; Set-Content \"C:\\inetpub\\wwwroot\\iisstart.htm\" $website",
      bootDiagnosticsStorageURI: storage.primaryBlobEndpoint,
    });

    // Diag Settings
    vm.addDiagSettings({name: "diagsettings", storageAccountId: storage.id})

    // RBAC
    vm.addAccess(clientConfig.objectId, "Contributor")

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


new exampleAzureWindowsVirtualMachine(app, "testAzureWindowsVirtualMachineExample");

app.synth();