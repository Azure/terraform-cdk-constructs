import * as cdktf from "cdktf";
import { AzureNetworkSecurityGroup } from '..';
import {VirtualNetwork} from "@cdktf/provider-azurerm/lib/virtual-network";
import {Subnet} from "@cdktf/provider-azurerm/lib/subnet";
import {PreconfiguredRules} from "../preconfiguredRules";
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';


const app = new App();

export class exampleAzureNetworkSecurityGroup extends TerraformStack {
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

    const subnet2 = new Subnet(this, "subnet2", {
      name: "subnet2",
      resourceGroupName: resourceGroup.name,
      virtualNetworkName: vnet.name,
      addressPrefixes: ["10.0.2.0/24"],
    });

    const nsg = new AzureNetworkSecurityGroup(this, 'nsg', {
      name: 'my-nsg',
      location: "eastus",
      resourceGroupName: resourceGroup.name,
      rules: [
            {
                name: 'SSH',
                priority: 1001,
                direction: 'Inbound',
                access: 'Allow',
                protocol: 'Tcp',
                sourcePortRange: '*',
                destinationPortRange: '22',
                sourceAddressPrefix: '*',
                destinationAddressPrefix: '*'
            },
            PreconfiguredRules.HTTPS,
            PreconfiguredRules.addPriority(PreconfiguredRules.Redis, 888),
            PreconfiguredRules.addDestinationAddress(PreconfiguredRules.RDP, "10.0.0.0/24"),
        ],
    });

    // associate the nsg to the subnet
    nsg.associateToSubnet(subnet)
    nsg.associateToSubnet(subnet2)





    // Outputs to use for End to End Test
    const cdktfTerraformOutputRGName = new cdktf.TerraformOutput(this, "resource_group_name", {
      value: resourceGroup.name,
    });

    const cdktfTerraformOutputNsgName = new cdktf.TerraformOutput(this, "nsg_name", {
      value: nsg.name,
    });
   
    const cdktfTerraformOutputSnetName = new cdktf.TerraformOutput(this, "ssh_rule_name", {
      value: 'SSH',
    });

    cdktfTerraformOutputRGName.overrideLogicalId("resource_group_name");
    cdktfTerraformOutputNsgName.overrideLogicalId("nsg_name");
    cdktfTerraformOutputSnetName.overrideLogicalId("ssh_rule_name");
  }
}


new exampleAzureNetworkSecurityGroup(app, "testAzureNetworkSecurityGroup");

app.synth();