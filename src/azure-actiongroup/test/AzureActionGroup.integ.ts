import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Testing, TerraformStack } from "cdktf";
import * as ag from "..";

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

    new AzurermProvider(stack, "azureFeature", { features: {} });

    // Create a resource group
    const resourceGroup = new ResourceGroup(stack, "rg", {
      name: `rg-${randomName}`,
      location: "eastus",
    });

    new ag.ActionGroup(stack, "testAzureActionGroup", {
      name: "testactiongroup",
      location: "global",
      resourceGroup: resourceGroup,
      shortName: "testshortn",
      emailReceivers: [
        {
          name: "testemail1",
          emailAddress: "test1@email.com",
          useCommonAlertSchema: true,
        },
        {
          name: "testemail2",
          emailAddress: "test2@email.com",
        },
      ],
      webhookReceivers: [
        {
          name: "testwebhook1",
          serviceUri: "https://www.example1.com",
          useCommonAlertSchema: true,
        },
        {
          name: "testwebhook2",
          serviceUri: "https://www.example2.com",
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
