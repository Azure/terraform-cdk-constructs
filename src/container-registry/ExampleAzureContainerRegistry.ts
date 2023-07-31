import { AzureContainerRegistry } from '.';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import { generateRandomString } from '../util/randomString';

const rndName = generateRandomString(10);

const app = new App();
    
export class exampleAzureContainerRegistry extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-${rndName}`,

    });

    new AzureContainerRegistry(this, 'testACR', {
      name: `acr${rndName}`,
      location: resourceGroup.location,
      resource_group_name: resourceGroup.name,
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