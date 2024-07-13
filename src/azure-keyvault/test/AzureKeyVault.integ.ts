import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Testing, TerraformStack } from "cdktf";
import {
  TerraformApplyAndCheckIdempotency,
  TerraformDestroy,
} from "../../testing";
import { generateRandomName } from "../../util/randomName";
import "cdktf/lib/testing/adapters/jest";
import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import * as kv from "..";
import * as util from "../../util/azureTenantIdHelpers";

describe("Resource Group With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;
  const streamOutput = process.env.STREAM_OUTPUT !== "false";

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");
    const randomName = generateRandomName(12);

    const clientConfig = new DataAzurermClientConfig(
      stack,
      "CurrentClientConfig",
      {},
    );

    new AzurermProvider(stack, "azureFeature", { features: {} });

    const resourceGroup = new ResourceGroup(stack, "rg", {
      name: `rg-${randomName}`,
      location: "eastus",
    });

    const azureKeyVault = new kv.Vault(stack, "kv", {
      name: `kv-${randomName}`,
      location: "eastus",
      sku: "standard",
      resourceGroup: resourceGroup,
      tenantId: util.getAzureTenantId(),
      networkAcls: {
        bypass: "AzureServices",
        defaultAction: "Allow",
        ipRules: ["0.0.0.0/0"],
      },
      softDeleteRetentionDays: 7,
    });

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(
      stack,
      "log_analytics",
      {
        location: "eastus",
        name: `la-${randomName}`,
        resourceGroupName: resourceGroup.name,
      },
    );

    //Diag Settings
    azureKeyVault.addDiagSettings({
      name: "diagsettings",
      logAnalyticsWorkspaceId: logAnalyticsWorkspace.id,
      metric: [
        {
          category: "AllMetrics",
        },
      ],
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

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  afterEach(() => {
    try {
      TerraformDestroy(fullSynthResult, streamOutput);
    } catch (error) {
      console.error("Error during Terraform destroy:", error);
    }
  });

  it("check if stack can be deployed", () => {
    TerraformApplyAndCheckIdempotency(fullSynthResult, streamOutput); // Set to true to stream output
  });
});
