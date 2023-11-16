import { BaseTestStack } from "../../testing";
import { AzureKusto } from '..';
import { App } from "cdktf";
import { AzureResourceGroup } from "../../azure-resourcegroup";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';

const app = new App();

export class exampleAzureKusto extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
      features: {
        resourceGroup: {
          preventDeletionIfContainsResources: false,
        },
      },
    });

    const resourceGroup = new AzureResourceGroup(this, "rg", {
      name: `rg-${this.name}`,
      location: 'eastus',
    });

    new AzureKusto(this, "kusto", resourceGroup, {
      name: `kusto${this.name}`,  // Only lowercase Alphanumeric characters allowed.
      skuName: `Dev(No SLA)_Standard_D11_v2`,
    });

  }
}

new exampleAzureKusto(app, "testAzureKusto");

app.synth();