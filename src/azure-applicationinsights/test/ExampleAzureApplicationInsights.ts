import * as cdktf from "cdktf";
import {BaseTestStack} from "../../testing";
import { AzureApplicationInsights } from '../';
import { App} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {LogAnalyticsWorkspace} from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { KeyVault } from "@cdktf/provider-azurerm/lib/key-vault";
import * as util from "../../util/azureTenantIdHelpers";

const app = new App();
    
export class exampleAzureApplicationInsights extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const clientConfig = new DataAzurermClientConfig(this, 'CurrentClientConfig', {});


    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-${this.name}`,

    });

    const keyvault = new KeyVault(this, 'key_vault', {
      name: `kv-${this.name}`,
      location: resourceGroup.location,
      resourceGroupName: resourceGroup.name,
      skuName: "standard",
      tenantId: util.getAzureTenantId(),
      purgeProtectionEnabled: true,
      softDeleteRetentionDays: 7,
      accessPolicy: [
        {
          tenantId: util.getAzureTenantId(),
          objectId: clientConfig.objectId,
          secretPermissions: [
            "Get",
            "List",
            "Set",
            "Delete",
            "Backup",
            "Restore",
            "Recover",
            "Purge",
          ],
        }
      ],
    });

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(this, "log_analytics", {
        location: 'eastus',
        name: `la-${this.name}`,
        resourceGroupName: resourceGroup.name,
    });

    const applicationInsights = new AzureApplicationInsights(this, 'testappi', {
      name: `appi-${this.name}`,
      location: 'eastus',
      resource_group_name: resourceGroup.name ,
      application_type: "web",
      workspace_id: logAnalyticsWorkspace.id,
    });

    // Save Ikey to Key Vault as secret
    applicationInsights.saveIKeyToKeyVault(keyvault.id);
    applicationInsights.saveIKeyToKeyVault(keyvault.id, "customSecretName");
    
    // Outputs to use for End to End Test
    const cdktfTerraformOutputKVName = new cdktf.TerraformOutput(this, "key_vault_name", {
      value: keyvault.name,
    });

    cdktfTerraformOutputKVName.overrideLogicalId("key_vault_name");
  
  }
}

new exampleAzureApplicationInsights(app, "testAzureApplicationInsights");

app.synth();