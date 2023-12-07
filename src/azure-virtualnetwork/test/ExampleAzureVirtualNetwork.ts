import * as cdktf from "cdktf";
import { AzureVirtualNetwork } from '..';
import {BaseTestStack} from "../../testing";
import { App} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import {LogAnalyticsWorkspace} from "@cdktf/provider-azurerm/lib/log-analytics-workspace";


const app = new App();

export class exampleAzureVirtualNetwork extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const clientConfig = new DataAzurermClientConfig(this, 'CurrentClientConfig', {});


    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-${this.name}`,

    });

    const network = new AzureVirtualNetwork(this, 'testAzureVirtualNetworkDefaults', {
      name: `vnet-${this.name}`,
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

    const remotenetwork = new AzureVirtualNetwork(this, 'testAzureRemoteVirtualNetworkDefaults', {
      name: `vnet-${this.name}2`,
      location: 'westus',
      resourceGroupName: resourceGroup.name,
      addressSpace: ["10.1.0.0/16"],
      subnets: [
        {
          name: "subnet1",
          addressPrefixes: ["10.1.1.0/24"],
        },
        {
          name: "subnet2",
          addressPrefixes: ["10.1.2.0/24"],
        },
      ],
    });

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(this, "log_analytics", {
      location: 'eastus',
      name: `la-${this.name}`,
      resourceGroupName: resourceGroup.name,
    });

     // Diag Settings
     network.addDiagSettings({name: "diagsettings", logAnalyticsWorkspaceId: logAnalyticsWorkspace.id})

     // RBAC
     network.addAccess(clientConfig.objectId, "Contributor")


    // Peer the networks
    network.addVnetPeering(remotenetwork)



    // Outputs to use for End to End Test
    const cdktfTerraformOutputRGName = new cdktf.TerraformOutput(this, "resource_group_name", {
      value: resourceGroup.name,
    });

    const cdktfTerraformOutputVnetName = new cdktf.TerraformOutput(this, "virtual_network_name", {
      value: network.name,
    });
   
    const cdktfTerraformOutputSnetName = new cdktf.TerraformOutput(this, "subnet_name", {
      value: network.subnets["subnet1"].name,
    });

    cdktfTerraformOutputVnetName.overrideLogicalId("virtual_network_name");
    cdktfTerraformOutputSnetName.overrideLogicalId("subnet_name");
    cdktfTerraformOutputRGName.overrideLogicalId("resource_group_name");
  }
}


new exampleAzureVirtualNetwork(app, "testAzureVirtualNetwork");

app.synth();