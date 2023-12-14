import * as cdktf from "cdktf";
import { AzureResource } from '../lib';
import {BaseTestStack} from "../../testing";
import { App } from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";

const app = new App();
   
class TestStorageAccount extends AzureResource {
  public readonly id: string;

  constructor(scope: Construct, name: string, resourceGroup: string, location: string) {
    super(scope, name);

    const storage = new StorageAccount(this, "storage", {
      name: `sta${name}96m98`,
      resourceGroupName: resourceGroup,
      location: location,
      accountReplicationType: "LRS",
      accountTier: "Standard",
      minTlsVersion: "TLS1_2",
      publicNetworkAccessEnabled: false,
      networkRules: {
        bypass: ['AzureServices'],
        defaultAction: 'Deny',
      },
    });

    this.id = storage.id;
  }

}

export class exampleAzureResource extends BaseTestStack {
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

    const storageAccount = new TestStorageAccount(this, `${this.name}`, resourceGroup.name, resourceGroup.location);
    
    // Test RBAC Methods
    storageAccount.addAccess(clientConfig.objectId, "Contributor")
    storageAccount.addAccess(clientConfig.objectId, "Monitoring Reader")

    // Test Diag Settings
    storageAccount.addDiagSettings({name: "diagsettings", storageAccountId: storageAccount.id})


    // Outputs to use for End to End Test
    const cdktfTerraformOutputDiagSettings = new cdktf.TerraformOutput(this, "diag_settings_name", {
      value: "diagsettings",
    });
    cdktfTerraformOutputDiagSettings.overrideLogicalId("diag_settings_name");

    const cdktfTerraformOutputStorageID = new cdktf.TerraformOutput(this, "storage_account_id", {
      value: storageAccount.id,
    });
    cdktfTerraformOutputStorageID.overrideLogicalId("storage_account_id");

  }
}

new exampleAzureResource(app, "testExampleAzureResource");

app.synth();