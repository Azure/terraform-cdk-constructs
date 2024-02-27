import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { App } from "cdktf";
import { Construct } from "constructs";
import * as rg from "..";
import { BaseTestStack } from "../../testing";

const app = new App();

export class exampleAzureResourceGroup extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azure", {
      features: {},
    });

    new rg.Group(this, "testRG", {
      name: `rg-${this.name}`,
      location: "eastus",
      tags: {
        name: "test",
        Env: "NonProd",
      },
      ignoreChanges: ['tags["Environment"]', 'tags["SkipSecurity"]'],
    });
  }
}

new exampleAzureResourceGroup(app, "testAzureResourceGroup");
app.synth();
