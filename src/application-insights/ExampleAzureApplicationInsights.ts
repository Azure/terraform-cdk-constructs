import { AzureApplicationInsights } from '.';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {LogAnalyticsWorkspace} from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";

import { Construct } from 'constructs';


const app = new App();
    
export class exampleAzureApplicationInsights extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const rg = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: 'rg-latest',

    });

    const la = new LogAnalyticsWorkspace(this, "log_analytics", {
        location: 'eastus',
        name: 'appinsight-test',
        resourceGroupName: rg.name,
    });

    new AzureApplicationInsights(this, 'testappi', {
      name: 'la-test',
      location: 'eastus',
      resource_group_name: rg.name ,
      application_type: "web",
      workspace_id: la.id,
    });
  }
}

new exampleAzureApplicationInsights(app, "testAzureApplicationInsights");

app.synth();