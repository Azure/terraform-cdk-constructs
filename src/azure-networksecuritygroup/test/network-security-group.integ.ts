/**
 * Integration test for Azure Network Security Group
 *
 * This test demonstrates basic usage of the NetworkSecurityGroup construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { NetworkSecurityGroup } from "../lib/network-security-group";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("nsg-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Network Security Group usage
 */
class NetworkSecurityGroupExampleStack extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      testRunOptions: {
        maxAgeHours: testMetadata.maxAgeHours,
        autoCleanup: testMetadata.autoCleanup,
        cleanupPolicy: testMetadata.cleanupPolicy,
      },
    });

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Generate unique names
    const rgName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "nsg",
    );

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
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
        ...this.systemTags(),
        example: "basic",
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
        ...this.systemTags(),
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
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
