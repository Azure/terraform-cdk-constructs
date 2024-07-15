import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Subnet } from "@cdktf/provider-azurerm/lib/subnet";
import { VirtualNetwork } from "@cdktf/provider-azurerm/lib/virtual-network";
import { Testing, TerraformStack } from "cdktf";
import * as network from "..";

import {
  TerraformApplyAndCheckIdempotency,
  TerraformDestroy,
} from "../../testing";
import { generateRandomName } from "../../util/randomName";
import { PreconfiguredRules } from "../lib/preconfigured-rules";
import "cdktf/lib/testing/adapters/jest";

describe("Example of deploying a Network Security Group", () => {
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

    const vnet = new VirtualNetwork(stack, "vnet", {
      name: `vnet-${randomName}`,
      location: resourceGroup.location,
      resourceGroupName: resourceGroup.name,
      addressSpace: ["10.0.0.0/16"],
    });

    const subnet = new Subnet(stack, "subnet1", {
      name: "subnet1",
      resourceGroupName: resourceGroup.name,
      virtualNetworkName: vnet.name,
      addressPrefixes: ["10.0.1.0/24"],
    });

    const subnet2 = new Subnet(stack, "subnet2", {
      name: "subnet2",
      resourceGroupName: resourceGroup.name,
      virtualNetworkName: vnet.name,
      addressPrefixes: ["10.0.2.0/24"],
    });

    const nsg = new network.SecurityGroup(stack, "nsg", {
      name: `nsg-${randomName}`,
      location: "eastus",
      resourceGroup: resourceGroup,
      rules: [
        {
          name: "SSH",
          priority: 1001,
          direction: "Inbound",
          access: "Allow",
          protocol: "Tcp",
          sourcePortRange: "*",
          destinationPortRange: "22",
          sourceAddressPrefix: "10.23.15.38",
          destinationAddressPrefix: "VirtualNetwork",
        },
        PreconfiguredRules.addSourceAddress(
          PreconfiguredRules.rdp,
          "10.0.0.0/24",
        ),
      ],
    });

    //RBAC
    nsg.addAccess(clientConfig.objectId, "Contributor");

    // associate the nsg to the subnet
    nsg.associateToSubnet(subnet);
    nsg.associateToSubnet(subnet2);

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
