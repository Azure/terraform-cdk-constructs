import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Testing, TerraformStack } from "cdktf";
import {
  TerraformApplyAndCheckIdempotency,
  TerraformDestroy,
} from "../../testing";
import { generateRandomName } from "../../util/randomName";
import "cdktf/lib/testing/adapters/jest";
import * as eh from "../lib";

describe("Example of deploying an Event Hub", () => {
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

    // Create a resource group
    const resourceGroup = new ResourceGroup(stack, "rg", {
      name: `rg-${randomName}`,
      location: "eastus",
    });

    // Create Eventhub Namespace
    const eventhubNamespace = new eh.Namespace(stack, "eventhub", {
      resourceGroup: resourceGroup,
      name: `ehns-${randomName}`,
      sku: "Standard",
      capacity: 3,
      autoInflateEnabled: true,
      maximumThroughputUnits: 5,
      zoneRedundant: false,
      minimumTlsVersion: "1.2",
      publicNetworkAccessEnabled: false,
      localAuthenticationEnabled: true,
      identityType: "SystemAssigned",
    });

    // Create Eventhub Instance
    const eventhubInstance = eventhubNamespace.addEventhubInstance({
      name: "test-eventhub-instance",
      partitionCount: 2,
      messageRetention: 1,
      status: "Active",
    });

    // Create Eventhub Instance Authorization Rule
    eventhubInstance.addAuthorizationRule({
      name: "test-rule",
      listen: true,
      send: true,
      manage: false,
    });

    // Add Consumer Group to Eventhub Instance
    eventhubInstance.addConsumerGroup("test-consumer-group");

    // Add IAM role to Eventhub Namespace
    eventhubNamespace.addAccess(clientConfig.objectId, "Contributor");

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
