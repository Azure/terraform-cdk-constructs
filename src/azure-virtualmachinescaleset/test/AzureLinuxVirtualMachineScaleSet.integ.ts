import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";
import { Subnet } from "@cdktf/provider-azurerm/lib/subnet";
import { VirtualNetwork } from "@cdktf/provider-azurerm/lib/virtual-network";
import { Testing, TerraformStack } from "cdktf";
import * as vmss from "..";

import {
  TerraformApplyAndCheckIdempotency,
  TerraformDestroy,
} from "../../testing";
import { generateRandomName } from "../../util/randomName";
import "cdktf/lib/testing/adapters/jest";

describe("Example of deploying a Linux VMSS Cluster", () => {
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
      location: "southcentralus",
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

    const storage = new StorageAccount(stack, "storage", {
      name: `sta${randomName}88r93`,
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

    const vm = new vmss.LinuxCluster(stack, "vm", {
      name: randomName,
      location: "southcentralus",
      resourceGroup: resourceGroup,
      sku: "Standard_D2as_v4",
      adminUsername: "testadmin",
      adminPassword: "Password1234!",
      osDisk: {
        caching: "ReadWrite",
        storageAccountType: "Standard_LRS",
      },
      sourceImageReference: {
        publisher: "Canonical",
        offer: "0001-com-ubuntu-server-jammy",
        sku: "22_04-lts-gen2",
        version: "latest",
      },
      subnet: subnet,
      publicIPAddress: [
        {
          name: "testpublicip",
        },
      ],
      userData: "#!/bin/bash\nsudo apt-get install -y apache2",
      enableSshAzureADLogin: true,
      identity: {
        type: "SystemAssigned",
      },
      bootDiagnosticsStorageURI: storage.primaryBlobEndpoint,
      lifecycle: {
        ignoreChanges: ["tags", "identity"],
      },
    });

    // Diag Settings
    vm.addDiagSettings({
      name: "diagsettings",
      storageAccountId: storage.id,
      metric: [
        {
          category: "AllMetrics",
        },
      ],
    });

    // RBAC
    vm.addAccess(clientConfig.objectId, "Contributor");

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
