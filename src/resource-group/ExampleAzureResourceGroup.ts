import { AzureResourceGroup } from '.';
import { App, TerraformStack} from "cdktf";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';


const app = new App();

export class exampleAzureResourceGroup extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
      features: {},
    });
  
    new AzureResourceGroup(this, 'testRG', {
      name: 'rg-test',
      location: 'eastus',
      tags: {
          name: 'test',
          Env: "NonProd",
      },
      
    });

  }
}


new exampleAzureResourceGroup(app, "testAzureResourceGroup");
app.synth();