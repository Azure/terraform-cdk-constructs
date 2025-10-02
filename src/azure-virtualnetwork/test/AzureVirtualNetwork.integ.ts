import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Testing, TerraformStack } from "cdktf";
import * as vnet from "..";

import {
  TerraformApplyAndCheckIdempotency,
  TerraformDestroy,
} from "../../testing";
import { generateRandomName } from "../../util/randomName";
import "cdktf/lib/testing/adapters/jest";

describe("Example of deploying a Virtual Network", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;
  const streamOutput = process.env.STREAM_OUTPUT !== "false";

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");
    const randomName = generateRandomName(12);

    new AzurermProvider(stack, "azureFeature", {
      features: {},
      skipProviderRegistration: true,
    });

    const clientConfig = new DataAzurermClientConfig(
      stack,
      "CurrentClientConfig",
      {},
    );

    // Create a resource group
    const resourceGroup = new ResourceGroup(stack, "rg", {
      name: `rg-${randomName}`,
      location: "eastus",
    });

    const network = new vnet.Network(stack, "testAzureVirtualNetworkDefaults", {
      name: `vnet-${randomName}`,
      location: "eastus",
      resourceGroup: resourceGroup,
      addressSpace: ["10.0.0.0/16"],
      subnets: [
        {
          name: "subnet1",
          addressPrefixes: ["10.0.1.0/24"],
        },
        {
          name: "subnet2",
          addressPrefixes: ["10.0.2.0/24"],
        },
      ],
    });

    const remotenetwork = new vnet.Network(
      stack,
      "testAzureRemoteVirtualNetworkDefaults",
      {
        name: `vnet-${randomName}2`,
        location: "westus",
        resourceGroup: resourceGroup,
        addressSpace: ["10.1.0.0/16"],
        subnets: [
          {
            name: "subnet1",
            addressPrefixes: ["10.1.1.0/24"],
          },
          {
            name: "subnet2",
            addressPrefixes: ["10.1.2.0/24"],
          },
        ],
      },
    );

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(
      stack,
      "log_analytics",
      {
        location: "eastus",
        name: `la-${randomName}`,
        resourceGroupName: resourceGroup.name,
      },
    );

    // Diag Settings
    network.addDiagSettings({
      name: "diagsettings",
      logAnalyticsWorkspaceId: logAnalyticsWorkspace.id,
      metric: [
        {
          category: "AllMetrics",
        },
      ],
    });

    // RBAC
    network.addAccess(clientConfig.objectId, "Contributor");

    // Peer the networks
    network.addVnetPeering(remotenetwork);

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  afterEach(() => {
    try {
      TerraformDestroy(fullSynthResult, streamOutput);
    } catch (error) {
      console.error("Error during Terraform destroy:", error);
    }
  });

  it("check if stac can be deployed", () => {
    TerraformApplyAndCheckIdempotency(fullSynthResult, streamOutput); // Set to true to stream output
  });
});
