import { Testing } from "cdktf";
import "cdktf/lib/testing/adapters/jest";
import { exampleAzureResource } from "./ExampleAzureResource";

describe("Azure Resource Example", () => {
  it("renders the Azure Resource example and checks snapshot", () => {
    expect(
      Testing.synth(
        new exampleAzureResource(Testing.app(), "testAzureResourceExample"),
      ),
    ).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureResource(Testing.app(), "testAzureResourceExample"),
      ),
    ).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureResource(Testing.app(), "testAzureResourceExample"),
      ),
    ).toPlanSuccessfully();
  });
});
