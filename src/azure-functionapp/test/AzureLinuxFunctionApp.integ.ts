import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Testing, TerraformStack } from "cdktf";
import * as func from "..";
import {
  TerraformApplyAndCheckIdempotency,
  TerraformDestroy,
} from "../../testing";
import { generateRandomName } from "../../util/randomName";
import "cdktf/lib/testing/adapters/jest";
import { ServicePlanSkus } from "../serviceplanskus";

describe("Example of deploying a Linux Function App", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;
  const streamOutput = process.env.STREAM_OUTPUT !== "false";

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");
    const randomName = generateRandomName(12);

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

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(
      stack,
      "log_analytics",
      {
        location: "eastus",
        name: `la-${randomName}`,
        resourceGroupName: resourceGroup.name,
      },
    );

    // Consumption Function
    const consumptionFunctionApp = new func.FunctionAppLinux(
      stack,
      "consumptionFA",
      {
        name: `fa${randomName}`,
        location: "eastus",
        resourceGroup: resourceGroup,
        tags: {
          test: "test",
        },
      },
    );

    new func.FunctionAppLinux(stack, "consumptionFA2", {
      name: `fa${randomName}2`,
      location: "eastus",
      storageAccount: consumptionFunctionApp.storageAccount,
      servicePlan: consumptionFunctionApp.servicePlan,
      resourceGroup: resourceGroup,
      runtimeVersion: {
        pythonVersion: "3.8",
      },
      siteConfig: {
        cors: {
          allowedOrigins: ["*"],
        },
      },
      tags: {
        test: "test",
      },
    });

    // Premium Function
    new func.FunctionAppLinux(stack, "premiumFA", {
      name: `faprem${randomName}`,
      location: "eastus",
      servicePlanSku: ServicePlanSkus.PremiumEP1,
      runtimeVersion: {
        dotnetVersion: "5.0",
      },
      tags: {
        test: "test",
      },
    });

    // Service Plan Function
    new func.FunctionAppLinux(stack, "servicePlanFA", {
      name: `fasp${randomName}`,
      location: "eastus",
      servicePlanSku: ServicePlanSkus.ASPBasicB1,
      runtimeVersion: {
        pythonVersion: "3.8",
      },
      siteConfig: {
        cors: {
          allowedOrigins: ["*"],
        },
      },
      tags: {
        test: "test",
      },
    });

    //Diag Settings
    consumptionFunctionApp.addDiagSettings({
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

  it("check if stack can be deployed", () => {
    TerraformApplyAndCheckIdempotency(fullSynthResult, streamOutput); // Set to true to stream output
  });
});
