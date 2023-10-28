import { AzureResourceGroup } from '..';
import { App} from "cdktf";
import {BaseTestStack} from "../../testing";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';

const app = new App();

export class exampleAzureResourceGroup extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azure", {
      features: {},
    });
  
    new AzureResourceGroup(this, 'testRG', {
      name: `rg-${this.name}`,
      location: 'eastus',
      tags: {
          name: 'test',
          Env: "NonProd",
      },
      ignoreChanges: ['tags["Environment"]'],
      
    });

  }
}

new exampleAzureResourceGroup(app, "testAzureResourceGroup");
app.synth();