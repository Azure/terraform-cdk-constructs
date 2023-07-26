import { AzureContainerRegistry } from '.';
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

    const rg = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: 'rg-latest',

    });

    new AzureContainerRegistry(this, 'testACR', {
      name: 'acrtest888',
      location: rg.location,
      resource_group_name: rg.name,
      sku: "Premium",
      admin_enabled: false,
      georeplication_locations: [{location: "westus"}],
      tags: {
        environment: "test",
      },
    });
  }
}

new exampleAzureContainerRegistry(app, "testAzureContainerRegistry");

app.synth();