/**
 * Integration test for Azure Bastion Host
 *
 * This test demonstrates basic usage of the BastionHost construct and
 * validates deployment, idempotency, and cleanup. It builds the full
 * dependency chain required by a Standard Bastion host: resource group,
 * virtual network, the dedicated AzureBastionSubnet, and a Standard
 * Static public IP.
 *
 * Run with: npm run integration:nostream
 */

import { Testing, TerraformStack } from "cdktn";
import { Construct } from "constructs";
import "cdktn/lib/testing/adapters/jest";
import { PublicIPAddress } from "../../azure-publicipaddress";
import { ResourceGroup } from "../../azure-resourcegroup";
import { Subnet } from "../../azure-subnet";
import { VirtualNetwork } from "../../azure-virtualnetwork";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { TerraformApplyCheckAndDestroy } from "../../testing";
import { BastionHost } from "../lib/bastion-host";

/**
 * Example stack demonstrating Bastion Host usage with its dependencies
 */
class BastionHostExampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: "bastion-example-rg",
      location: "eastus",
      tags: {
        environment: "example",
        purpose: "integration-test",
      },
    });

    // Create a virtual network
    const vnet = new VirtualNetwork(this, "vnet", {
      name: "vnet-bastion-example",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
    });

    // The Bastion subnet MUST be named exactly "AzureBastionSubnet" (>= /26)
    const bastionSubnet = new Subnet(this, "bastion-subnet", {
      name: "AzureBastionSubnet",
      virtualNetworkName: vnet.name,
      resourceGroupId: resourceGroup.id,
      addressPrefix: "10.0.1.0/26",
    });

    // Bastion requires a Standard SKU, Static public IP
    const bastionPip = new PublicIPAddress(this, "bastion-pip", {
      name: "pip-bastion-example",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: {
        name: "Standard",
      },
      publicIPAllocationMethod: "Static",
    });

    // Standard Bastion host
    new BastionHost(this, "bastion", {
      name: "bastion-example",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: {
        name: "Standard",
      },
      ipConfiguration: {
        subnetId: bastionSubnet.id,
        publicIpAddressId: bastionPip.id,
      },
      enableTunneling: true,
      scaleUnits: 2,
      tags: {
        example: "standard",
      },
    });
  }
}

describe("Bastion Host Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup Bastion host resources", () => {
    const app = Testing.app();
    const stack = new BastionHostExampleStack(app, "test-bastion-host");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 1800000); // 30 minute timeout (Bastion provisioning is slow)
});
