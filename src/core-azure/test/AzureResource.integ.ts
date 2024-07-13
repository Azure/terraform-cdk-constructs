import { ContainerRegistry } from "@cdktf/provider-azurerm/lib/container-registry";
import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";

import { Testing, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import {
  TerraformApplyAndCheckIdempotency,
  TerraformDestroy,
} from "../../testing";
import { generateRandomName } from "../../util/randomName";
import { AzureResource } from "../lib";
import "cdktf/lib/testing/adapters/jest";

describe("Resource Group With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;
  const streamOutput = process.env.STREAM_OUTPUT !== "false";

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");
    const randomName = generateRandomName(12);

    class TestACR extends AzureResource {
      public readonly id: string;
      public readonly resourceGroup: ResourceGroup;

      constructor(
        scope: Construct,
        name: string,
        resourceGroup: ResourceGroup,
        location: string,
      ) {
        super(scope, name);

        const containerRegistry = new ContainerRegistry(
          this,
          "containerRegistry",
          {
            name: `acr${name}8898`,
            resourceGroupName: resourceGroup.name,
            location: location,
            sku: "Basic",
            adminEnabled: true,
          },
        );
        this.id = containerRegistry.id;
        this.resourceGroup = resourceGroup;
      }
    }

    const clientConfig = new DataAzurermClientConfig(
      stack,
      "CurrentClientConfig",
      {},
    );

    new AzurermProvider(stack, "azureFeature", { features: {} });

    // Create a resource group
    const resourceGroup = new ResourceGroup(stack, "rg", {
      name: `rg-${randomName}`,
      location: "eastus",
    });

    const acr = new TestACR(
      stack,
      `${randomName}`,
      resourceGroup,
      resourceGroup.location,
    );

    // Test RBAC Methods
    acr.addAccess(clientConfig.objectId, "Contributor");
    acr.addAccess(clientConfig.objectId, "Monitoring Reader");

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(
      stack,
      "log_analytics",
      {
        location: "eastus",
        name: `la-${randomName}`,
        resourceGroupName: resourceGroup.name,
      },
    );

    // Test Diag Settings
    acr.addDiagSettings({
      name: "diagsettings",
      logAnalyticsWorkspaceId: logAnalyticsWorkspace.id,
      metric: [
        {
          category: "AllMetrics",
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

  it("check if this can be deployed", () => {
    TerraformApplyAndCheckIdempotency(fullSynthResult, streamOutput); // Set to true to stream output
  });
});
