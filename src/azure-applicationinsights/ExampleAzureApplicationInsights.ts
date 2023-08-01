import { AzureApplicationInsights } from '.';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {LogAnalyticsWorkspace} from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import { generateRandomString } from '../util/randomString';

const rndName = generateRandomString(10);

const app = new App();
    
export class exampleAzureApplicationInsights extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-${rndName}`,

    });

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(this, "log_analytics", {
        location: 'eastus',
        name: `la-${rndName}`,
        resourceGroupName: resourceGroup.name,
    });

    new AzureApplicationInsights(this, 'testappi', {
      name: `appinsight-${rndName}`,
      location: 'eastus',
      resource_group_name: resourceGroup.name ,
      application_type: "web",
      workspace_id: logAnalyticsWorkspace.id,
    });
  }
}

new exampleAzureApplicationInsights(app, "testAzureApplicationInsights");

app.synth();