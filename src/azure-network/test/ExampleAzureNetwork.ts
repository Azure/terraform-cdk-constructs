import * as cdktf from "cdktf";
import { Network } from '..';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';


const app = new App();

export class exampleAzureNetwork extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-test`,

    });

    const network = new Network(this, 'testAzureNetworkDefaults', {
      name: "vnet-test",
      location: 'eastus',
      resourceGroupName: resourceGroup.name,
      addressSpace: ["10.0.0.0/16"],
      subnets: [
        {
          name: "subnet1",
          addressPrefixes: ["10.0.1.0/24"],
        },
        {
          name: "subnet2",
          addressPrefixes: ["10.0.2.0/24"],
        },
      ],
    });




    // Outputs to use for End to End Test
    const cdktfTerraformOutputRGName = new cdktf.TerraformOutput(this, "resource_group_name", {
      value: resourceGroup.name,
    });

    const cdktfTerraformOutputVnetName = new cdktf.TerraformOutput(this, "virtual_network_name", {
      value: network.name,
    });
   
    const cdktfTerraformOutputSnetName = new cdktf.TerraformOutput(this, "subnet_name", {
      value: network.subnetNames[0],
    });

    cdktfTerraformOutputVnetName.overrideLogicalId("virtual_network_name");
    cdktfTerraformOutputSnetName.overrideLogicalId("subnet_name");
    cdktfTerraformOutputRGName.overrideLogicalId("resource_group_name");
  }
}


new exampleAzureNetwork(app, "testAzureNetwork");

app.synth();