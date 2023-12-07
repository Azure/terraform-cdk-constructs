import * as cdktf from "cdktf";
import { AzureContainerRegistry } from '..';
import { App} from "cdktf";
import {BaseTestStack} from "../../testing";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import {LogAnalyticsWorkspace} from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { Construct } from 'constructs';

const app = new App();
    
export class exampleAzureContainerRegistry extends BaseTestStack {
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

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(this, "log_analytics", {
      location: 'eastus',
      name: `la-${this.name}`,
      resourceGroupName: resourceGroup.name,
  });

    const azureContainerRegistry = new AzureContainerRegistry(this, 'testACR', {
      name: `acr${this.name}`,
      location: resourceGroup.location,
      resource_group_name: resourceGroup.name,
      sku: "Premium",
      admin_enabled: false,
      georeplication_locations: [{location: "westus"}],
      tags: {
        environment: "test",
      },
    });

     //Diag Settings
     azureContainerRegistry.addDiagSettings({name: "diagsettings", logAnalyticsWorkspaceId: logAnalyticsWorkspace.id})

     //RBAC
     azureContainerRegistry.addAccess(clientConfig.objectId, "Contributor")
 

    // Outputs to use for End to End Test
    const cdktfTerraformOutputRG = new cdktf.TerraformOutput(this, "resource_group_name", {
      value: resourceGroup.name,
    });
    cdktfTerraformOutputRG.overrideLogicalId("resource_group_name");


  }
}

new exampleAzureContainerRegistry(app, "testAzureContainerRegistry");

app.synth();