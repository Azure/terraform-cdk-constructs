import * as cdktf from "cdktf";
import { BaseTestStack } from "../../testing";
import { App } from "cdktf";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import * as ag from '..';


const app = new App();

export class exampleAzureActionGroup extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
      features: {
        resourceGroup: {
          preventDeletionIfContainsResources: false,
        },
      },
    });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-${this.name}`,
      tags: {
        "test": "test",
      }
    });

    const actiongroup = new ag.ActionGroup(this, 'testAzureActionGroup', {
      name: "testactiongroup",
      location: 'global',
      resourceGroupName: resourceGroup.name,
      shortName: "testshortn",
      emailReceivers: [
        {
          name: "testemail1",
          emailAddress: "test1@email.com",
          useCommonAlertSchema: true,
        },
        {
          name: "testemail2",
          emailAddress: "test2@email.com",
        },
      ],
      webhookReceivers: [
        {
          name: "testwebhook1",
          serviceUri: "https://www.example1.com",
          useCommonAlertSchema: true,
        },
        {
          name: "testwebhook2",
          serviceUri: "https://www.example2.com",
        },
      ],
    });

    // Outputs to use for End to End Test
    const cdktfTerraformOutputActionGroupId = new cdktf.TerraformOutput(this, "id", {
      value: actiongroup.id,
    });

    cdktfTerraformOutputActionGroupId.overrideLogicalId("id");
  }
}

new exampleAzureActionGroup(app, "testAzureActionGroup");

app.synth();