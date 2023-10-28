import * as cdktf from "cdktf";
import { AzureDiagnosticSettings } from '..';
import { App} from "cdktf";
import {BaseTestStack} from "../../testing";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import { Eventhub } from "@cdktf/provider-azurerm/lib/eventhub";
import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { EventhubNamespaceAuthorizationRule } from "@cdktf/provider-azurerm/lib/eventhub-namespace-authorization-rule";
import { EventhubNamespace } from "@cdktf/provider-azurerm/lib/eventhub-namespace";

const app = new App();
    
export class exampleAzureDiagnosticSettings extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-${this.name}`,

    });

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(this, "log_analytics", {
      location: 'eastus',
      name: `la-${this.name}`,
      resourceGroupName: resourceGroup.name,
    });
    

    const eventhubNamespace = new EventhubNamespace(this, 'testEventHubNamespace', {
      name: `ehns-${this.name}`,
      resourceGroupName: resourceGroup.name,
      location: 'eastus',
      sku: 'Basic',
      capacity: 1,
    });

    const eventhub = new Eventhub(this, 'testEventHub', {
      name: `eh-${this.name}`,
      resourceGroupName: resourceGroup.name,
      namespaceName: eventhubNamespace.name,
      partitionCount: 2,
      messageRetention: 1,
    });

    const ehauthid = new EventhubNamespaceAuthorizationRule(this, 'testEventHubAuth', {
      name: `ehauth-${this.name}`,
      resourceGroupName: resourceGroup.name,
      namespaceName: eventhub.namespaceName,
      listen: true,
      send: true,
      manage: true,
    });

    new AzureDiagnosticSettings(this, 'testdiagsettings', {
      name: "diag-settings-test",
      logAnalyticsWorkspaceId: logAnalyticsWorkspace.id, 
      eventhubAuthorizationRuleId: ehauthid.id,
      eventhubName: eventhub.name,
      targetResourceId: eventhubNamespace.id
    });

    // Outputs to use for End to End Test
    const cdktfTerraformOutputDiagSettings = new cdktf.TerraformOutput(this, "diag_settings_name", {
      value: "diag-settings-test",
    });
    cdktfTerraformOutputDiagSettings.overrideLogicalId("diag_settings_name");

    // Outputs to use for End to End Test
    const cdktfTerraformOutputEH = new cdktf.TerraformOutput(this, "event_hub_namespace_id", {
      value: eventhubNamespace.id,
    });
    cdktfTerraformOutputEH.overrideLogicalId("event_hub_namespace_id");


  }
}

new exampleAzureDiagnosticSettings(app, "testExampleAzureDiagnosticSettings");

app.synth();