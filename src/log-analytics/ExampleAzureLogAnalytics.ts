import { AzureLogAnalytics } from '.';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';



const app = new App();
export class exampleAzureLogAnalytics extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const rg = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: 'rg-latest',

    });

    new AzureLogAnalytics(this, 'testLA', {
      name: 'la-test',
      location: 'eastus',
      retention: 90,
      sku: "PerGB2018",
      resource_group_name: rg.name ,
    });
  }
}

new exampleAzureLogAnalytics(app, "testAzureLogAnalytics");

app.synth();