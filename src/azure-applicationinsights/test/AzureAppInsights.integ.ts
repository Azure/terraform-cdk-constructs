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
import { KeyVault } from "@cdktf/provider-azurerm/lib/key-vault";
import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import * as util from "../../util/azureTenantIdHelpers";
import * as appi from "../lib";

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

    new AzurermProvider(stack, "azureFeature", {
      features: {
        resourceGroup: {
          preventDeletionIfContainsResources: false,
        },
      },
    });

    // Create a resource group
    const resourceGroup = new ResourceGroup(stack, "rg", {
      name: `rg-${randomName}`,
      location: "eastus",
    });

    const keyvault = new KeyVault(stack, "key_vault", {
      name: `kv-${randomName}`,
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
        },
      ],
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

    const applicationInsights = new appi.AppInsights(stack, "testappi", {
      name: `appi-${randomName}`,
      location: "eastus",
      resourceGroup: resourceGroup,
      applicationType: "web",
      workspaceId: logAnalyticsWorkspace.id,
    });

    // Save Ikey to Key Vault as secret
    applicationInsights.saveIKeyToKeyVault(keyvault.id);
    applicationInsights.saveIKeyToKeyVault(keyvault.id, "customSecretName");

    //Diag Settings
    applicationInsights.addDiagSettings({
      name: "diagsettings",
      logAnalyticsWorkspaceId: logAnalyticsWorkspace.id,
      metric: [
        {
          category: "AllMetrics",
        },
      ],
    });

    //RBAC
    applicationInsights.addAccess(clientConfig.objectId, "Contributor");

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
