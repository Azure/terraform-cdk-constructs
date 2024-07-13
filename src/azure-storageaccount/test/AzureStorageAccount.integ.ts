import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Testing, TerraformStack } from "cdktf";
import * as storage from "..";
import {
  TerraformApplyAndCheckIdempotency,
  TerraformDestroy,
} from "../../testing";
import { generateRandomName } from "../../util/randomName";
import "cdktf/lib/testing/adapters/jest";

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
      features: {},
      storageUseAzuread: true,
    });

    // Create a resource group
    const resourceGroup = new ResourceGroup(stack, "rg", {
      name: `rg-${randomName}`,
      location: "eastus",
    });

    const storageAccount = new storage.Account(stack, "storageaccount", {
      name: `sta${randomName}8898`,
      resourceGroup: resourceGroup,
      location: "eastus",
      accountReplicationType: "LRS",
      accountTier: "Standard",
      enableHttpsTrafficOnly: true,
      accessTier: "Hot",
      isHnsEnabled: true,
      minTlsVersion: "TLS1_2",
      publicNetworkAccessEnabled: true,
    });

    //RBAC
    storageAccount.addAccess(
      clientConfig.objectId,
      "Storage Blob Data Contributor",
    );
    storageAccount.addAccess(
      clientConfig.objectId,
      "Storage Queue Data Contributor",
    );
    storageAccount.addAccess(
      clientConfig.objectId,
      "Storage Table Data Contributor",
    );
    storageAccount.addAccess(
      clientConfig.objectId,
      "Storage File Data SMB Share Contributor",
    );

    // Metric Alert
    storageAccount.addMetricAlert({
      name: "testalert",
      criteria: [
        {
          metricName: "Availability",
          metricNamespace: "Microsoft.Storage/storageAccounts",
          aggregation: "Average",
          operator: "LessThan",
          threshold: 0,
        },
      ],
    });

    storageAccount.addNetworkRules({
      bypass: ["AzureServices"],
      defaultAction: "Deny",
      ipRules: ["0.0.0.0/0"],
    });

    // Storage Methods
    storageAccount.addContainer("testcontainer");

    storageAccount.addContainer("testcontainer2");

    storageAccount.addFileShare("testshare");

    storageAccount.addTable("testtable");

    storageAccount.addQueue("testqueue");
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
    TerraformApplyAndCheckIdempotency(fullSynthResult, streamOutput);
  });
});
