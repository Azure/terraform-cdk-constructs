import { AzureKeyVault } from '.';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';

const app = new App();
export class exampleAzureKeyVault extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const rg = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: 'rg-latest',

    });

    new AzureKeyVault(this, 'testLA', {
      name: 'kv-test',
      location: 'eastus',
      sku: "standard",
      resource_group_name: rg.name ,
      tenant_id: "00000000-0000-0000-0000-000000000000",
    });
  }
}

new exampleAzureKeyVault(app, "testAzureKeyVault");

app.synth();