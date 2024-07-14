import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Testing, TerraformStack } from "cdktf";
import * as kusto from "..";
import {
  TerraformApplyAndCheckIdempotency,
  TerraformDestroy,
} from "../../testing";
import { generateRandomName } from "../../util/randomName";
import "cdktf/lib/testing/adapters/jest";

import { ComputeSpecification } from "../lib/compute-specification";

describe("Example of deploying a Kusto Cluster", () => {
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

    // Create Kusto Cluster
    const kustoCluster = new kusto.Cluster(stack, "kusto", {
      resourceGroup: resourceGroup,
      name: `kusto${randomName}`, // Only lowercase Alphanumeric characters allowed.
      sku: ComputeSpecification.devtestExtraSmallEav4,
      identityIds: [],
      capacity: 1,
    });

    // Add RBAC to Kusto Cluster
    kustoCluster.addAccess(clientConfig.objectId, "Contributor");

    // Create Database
    const testDB1 = kustoCluster.addDatabase({
      kustoCluster: kustoCluster.kustoCluster,
      name: "testDB1",
      hotCachePeriod: "P7D",
      softDeletePeriod: "P31D",
    });

    // Create Table in Kusto Database
    testDB1.addTable("MyTestTable", [
      {
        columnName: "Timestamp",
        columnType: "datetime",
      },
      {
        columnName: "User",
        columnType: "string",
      },
      {
        columnName: "Value",
        columnType: "int32",
      },
    ]);

    testDB1.addScript(
      "MyTestScript",
      ".create table MyTestTable2 ( Timestamp:datetime, User:string, Value:int32 )",
    );

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
