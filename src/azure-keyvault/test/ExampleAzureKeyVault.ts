import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import * as cdktf from "cdktf";
import { App } from "cdktf";
import { Construct } from "constructs";
import * as kv from "..";
import { BaseTestStack } from "../../testing";

import * as util from "../../util/azureTenantIdHelpers";

const app = new App();

export class exampleAzureKeyVault extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const clientConfig = new DataAzurermClientConfig(
      this,
      "CurrentClientConfig",
      {},
    );

    new AzurermProvider(this, "azureFeature", {
      features: {},
    });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: "eastus",
      name: `rg-${this.name}`,
    });

    const azureKeyVault = new kv.Vault(this, "kv", {
      name: `kv-${this.name}`,
      location: "eastus",
      sku: "standard",
      resourceGroup: resourceGroup,
      tenantId: util.getAzureTenantId(),
      networkAcls: {
        bypass: "AzureServices",
        defaultAction: "Allow",
      },
      softDeleteRetentionDays: 7,
    });

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(
      this,
      "log_analytics",
      {
        location: "eastus",
        name: `la-${this.name}`,
        resourceGroupName: resourceGroup.name,
      },
    );

    //Diag Settings
    azureKeyVault.addDiagSettings({
      name: "diagsettings",
      logAnalyticsWorkspaceId: logAnalyticsWorkspace.id,
    });

    //RBAC
    azureKeyVault.addAccess(clientConfig.objectId, "Contributor");

    // Access Policy
    azureKeyVault.grantSecretAdminAccess(
      "bc26a701-6acb-4117-93e0-e44054e22d60",
    );
    azureKeyVault.grantCustomAccess(clientConfig.objectId, {
      storagePermissions: ["Get", "List", "Set", "Delete"],
      secretPermissions: ["Get", "List", "Set", "Delete"],
      keyPermissions: [
        "Backup",
        "Create",
        "Decrypt",
        "Delete",
        "Encrypt",
        "Get",
        "Import",
        "List",
        "Purge",
        "Recover",
        "Restore",
        "Sign",
        "UnwrapKey",
        "Update",
        "Verify",
        "WrapKey",
        "Release",
        "Rotate",
        "GetRotationPolicy",
        "SetRotationPolicy",
      ],
      certificatePermissions: [
        "Get",
        "List",
        "Create",
        "Delete",
        "GetIssuers",
        "ManageIssuers",
      ],
    });

    // Create Secret
    azureKeyVault.addSecret(
      "secret1",
      "password",
      "2033-08-23T15:23:17Z",
      "application/x-pkcs12",
    );
    azureKeyVault.addSecret(
      "customSecretName",
      "password",
      "2033-08-23T15:23:17Z",
      "application/x-pkcs12",
    );

    // Create Key
    azureKeyVault.addRSAKey("key1", "2033-08-23T15:23:17Z");
    azureKeyVault.addKey(
      "key2",
      "RSA",
      2048,
      ["encrypt", "decrypt", "sign", "verify", "wrapKey", "unwrapKey"],
      "2033-08-23T15:23:17Z",
    );

    // Create Certificate
    azureKeyVault.addSelfSignedCert("cert1", "CN=contoso.com", [
      "internal.contoso.com",
      "domain.hello.world",
    ]);
    azureKeyVault.addCertIssuer("issuer1", "SslAdminV2");

    // Outputs to use for End to End Test
    const cdktfTerraformOutputRG = new cdktf.TerraformOutput(
      this,
      "resource_group_name",
      {
        value: resourceGroup.name,
      },
    );

    cdktfTerraformOutputRG.overrideLogicalId("resource_group_name");
  }
}

new exampleAzureKeyVault(app, "testAzureKeyVault");

app.synth();
