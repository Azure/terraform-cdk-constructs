import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { EventhubNamespace } from "@cdktf/provider-azurerm/lib/eventhub-namespace";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";
import { Testing, TerraformStack } from "cdktf";

import * as la from "..";

import {
  TerraformApplyAndCheckIdempotency,
  TerraformDestroy,
} from "../../testing";
import { generateRandomName } from "../../util/randomName";
import "cdktf/lib/testing/adapters/jest";

describe("Example of deploying Log Analytics", () => {
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
      skipProviderRegistration: true,
    });

    // Create a resource group
    const resourceGroup = new ResourceGroup(stack, "rg", {
      name: `rg-${randomName}`,
      location: "eastus",
    });

    const namespace = new EventhubNamespace(stack, "ehns", {
      name: `ehns-${randomName}`,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      sku: "Standard",
    });

    const storage = new StorageAccount(stack, "storage", {
      name: `sta${randomName}88t97`,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      accountReplicationType: "LRS",
      accountTier: "Standard",
      minTlsVersion: "TLS1_2",
      publicNetworkAccessEnabled: false,
      networkRules: {
        bypass: ["AzureServices"],
        defaultAction: "Deny",
      },
    });

    const logAnalyticsWorkspace = new la.Workspace(stack, "la", {
      name: `la-${randomName}`,
      location: "eastus",
      retention: 90,
      sku: "PerGB2018",
      resourceGroup: resourceGroup,
      functions: [
        {
          name: "function_name_1",
          displayName: "Example function 1",
          query:
            "Event | where EventLevelName != 'Informational' | where TimeGenerated > ago(24h)",
          functionAlias: "function_name_1",
          functionParameters: [],
        },
        {
          name: "function_name_2",
          displayName: "Example function 2",
          query:
            "Event | where EventLevelName != 'Informational' | where TimeGenerated > ago(24h)",
          functionAlias: "function_name_2",
          functionParameters: ["typeArg:string=mail", "tagsArg:string=dc"],
        },
      ],
      dataExport: [
        {
          name: "export-test",
          exportDestinationId: namespace.id,
          tableNames: ["Heartbeat"],
          enabled: true,
        },
      ],
    });

    // Test RBAC
    logAnalyticsWorkspace.addAccess(clientConfig.objectId, "Contributor");
    logAnalyticsWorkspace.addAccess(clientConfig.objectId, "Monitoring Reader");

    // Test Diag Settings
    logAnalyticsWorkspace.addDiagSettings({
      storageAccountId: storage.id,
      metric: [
        {
          category: "AllMetrics",
        },
      ],
    });

    // Test Metric Alert
    logAnalyticsWorkspace.addMetricAlert({
      name: "metricAlert-test",
      criteria: [
        {
          metricName: "Heartbeat",
          metricNamespace: "Microsoft.operationalinsights/workspaces",
          aggregation: "Average",
          operator: "LessThan",
          threshold: 0,
        },
      ],
    });

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
