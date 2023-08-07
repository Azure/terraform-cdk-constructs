import * as cdktf from "cdktf";
import { AzureContainerRegistry } from '..';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';

const app = new App();
    
export class exampleAzureContainerRegistry extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-test`,

    });

    new AzureContainerRegistry(this, 'testACR', {
      name: `acrtest`,
      location: resourceGroup.location,
      resource_group_name: resourceGroup.name,
      sku: "Premium",
      admin_enabled: false,
      georeplication_locations: [{location: "westus"}],
      tags: {
        environment: "test",
      },
    });

    // Outputs to use for End to End Test
    const cdktfTerraformOutputRG = new cdktf.TerraformOutput(this, "resource_group_name", {
      value: resourceGroup.name,
    });
    cdktfTerraformOutputRG.overrideLogicalId("resource_group_name");


  }
}

new exampleAzureContainerRegistry(app, "testAzureContainerRegistry");

app.synth();