/**
 * Integration test for Azure Network Security Group
 *
 * This test demonstrates basic usage of the NetworkSecurityGroup construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { TerraformApplyCheckAndDestroy } from "../../testing";
import { NetworkSecurityGroup } from "../lib/network-security-group";

/**
 * Example stack demonstrating Network Security Group usage
 */
class NetworkSecurityGroupExampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "rg", {
      name: "rg-nsg-example",
      location: "eastus",
      tags: {
        environment: "example",
        purpose: "integration-test",
      },
    });

    // Example 1: Basic NSG with common security rules
    new NetworkSecurityGroup(this, "basic-nsg", {
      name: "nsg-basic-example",
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      securityRules: [
        {
          name: "AllowSSH",
          properties: {
            protocol: "Tcp",
            sourcePortRange: "*",
            destinationPortRange: "22",
            sourceAddressPrefix: "10.0.0.0/24",
            destinationAddressPrefix: "*",
            access: "Allow",
            priority: 100,
            direction: "Inbound",
          },
        },
        {
          name: "AllowHTTPS",
          properties: {
            protocol: "Tcp",
            sourcePortRange: "*",
            destinationPortRange: "443",
            sourceAddressPrefix: "Internet",
            destinationAddressPrefix: "*",
            access: "Allow",
            priority: 110,
            direction: "Inbound",
          },
        },
      ],
      tags: {
        environment: "example",
        purpose: "integration-test",
      },
    });

    // Example 2: Advanced NSG with multiple rules and specific version
    new NetworkSecurityGroup(this, "advanced-nsg", {
      name: "nsg-advanced-example",
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      apiVersion: "2024-07-01",
      securityRules: [
        {
          name: "AllowHTTP",
          properties: {
            protocol: "Tcp",
            sourcePortRange: "*",
            destinationPortRange: "80",
            sourceAddressPrefix: "Internet",
            destinationAddressPrefix: "*",
            access: "Allow",
            priority: 100,
            direction: "Inbound",
          },
        },
        {
          name: "AllowRDP",
          properties: {
            protocol: "Tcp",
            sourcePortRange: "*",
            destinationPortRange: "3389",
            sourceAddressPrefix: "10.1.0.0/16",
            destinationAddressPrefix: "*",
            access: "Allow",
            priority: 110,
            direction: "Inbound",
          },
        },
        {
          name: "DenyAllInbound",
          properties: {
            protocol: "*",
            sourcePortRange: "*",
            destinationPortRange: "*",
            sourceAddressPrefix: "*",
            destinationAddressPrefix: "*",
            access: "Deny",
            priority: 4096,
            direction: "Inbound",
          },
        },
      ],
      tags: {
        example: "advanced",
        tier: "production",
      },
    });
  }
}

describe("Network Security Group Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup NSG resources", () => {
    const app = Testing.app();
    const stack = new NetworkSecurityGroupExampleStack(
      app,
      "test-network-security-group",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 600000); // 10 minute timeout for deployment and cleanup
});
