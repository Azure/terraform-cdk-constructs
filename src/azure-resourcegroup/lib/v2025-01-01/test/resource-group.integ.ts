import { Testing, TerraformStack } from "cdktf";
import * as rg from "..";
import { AzapiProvider } from "../../../../core-azure/lib/providers-azapi/provider";
import {
  TerraformApplyAndCheckIdempotency,
  TerraformDestroy,
} from "../../../../testing";
import { generateRandomName } from "../../../../util/randomName";
import "cdktf/lib/testing/adapters/jest";

// Skip integration tests for v2025-01-01 - only run for latest version (2025-03-01)
describe.skip("Resource Group With Defaults - v2025-01-01", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;
  const streamOutput = process.env.STREAM_OUTPUT !== "false";

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");
    const randomName = generateRandomName(12);

    new AzapiProvider(stack, "azapi", {});
    new rg.Group(stack, "testRG", {
      name: `rg-${randomName}`,
      location: "eastus",
      tags: {
        name: "test",
        Env: "NonProd",
      },
      ignoreChanges: ['tags["Environment"]', 'tags["SkipSecurity"]'],
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
