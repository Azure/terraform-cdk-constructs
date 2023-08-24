import * as cdktf from "cdktf";
import { AzureKeyVault } from '..';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import * as util from "../../util/azureTenantIdHelpers";

const app = new App();

export class exampleAzureKeyVault extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const clientConfig = new DataAzurermClientConfig(this, 'CurrentClientConfig', {});

    
    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-test`,

    });

    const azureKeyVault = new AzureKeyVault(this, 'kv', {
      name: `kv-test`,
      location: 'eastus',
      sku: "standard",
      resource_group_name: resourceGroup.name ,
      tenant_id: util.getAzureTenantId(),
      networkAcls: {
        bypass: 'AzureServices',
        defaultAction: 'Allow',
      },
      softDeleteRetentionDays: 7,
    });

    // Access Policy
    azureKeyVault.grantSecretAdminAccess("bc26a701-6acb-4117-93e0-e44054e22d60");
    azureKeyVault.grantCustomAccess(clientConfig.objectId, {
      storagePermissions: ["Get", "List", "Set", "Delete"], 
      secretPermissions: ["Get", "List", "Set", "Delete"], 
      keyPermissions: ["Backup", "Create", "Decrypt", "Delete", "Encrypt", "Get", "Import", "List", "Purge", "Recover", "Restore", "Sign", "UnwrapKey", "Update", "Verify", "WrapKey", "Release", "Rotate", "GetRotationPolicy", "SetRotationPolicy"],
      certificatePermissions: ["Get", "List", "Create", "Delete", "GetIssuers", "ManageIssuers"],
    });

    // Create Secret
    azureKeyVault.addSecret('secret1', "password", '2033-08-23T15:23:17Z', "application/x-pkcs12");
    azureKeyVault.addSecret('customSecretName', "password", '2033-08-23T15:23:17Z', "application/x-pkcs12");

    // Create Key
    azureKeyVault.addRSAKey('key1', '2033-08-23T15:23:17Z');
    azureKeyVault.addKey('key2', 'RSA', 2048,['encrypt', 'decrypt', 'sign', 'verify', 'wrapKey', 'unwrapKey'], '2033-08-23T15:23:17Z');

    // Create Certificate
    azureKeyVault.addSelfSignedCert('cert1', 'CN=contoso.com', ["internal.contoso.com", "domain.hello.world"]);
    azureKeyVault.addCertIssuer('issuer1', "SslAdminV2");


    // Outputs to use for End to End Test
    const cdktfTerraformOutputRG = new cdktf.TerraformOutput(this, "resource_group_name", {
      value: resourceGroup.name,
    });

    cdktfTerraformOutputRG.overrideLogicalId("resource_group_name");
    

  }
}

new exampleAzureKeyVault(app, "testAzureKeyVault");

app.synth();