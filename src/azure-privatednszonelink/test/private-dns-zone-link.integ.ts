/**
 * Integration test for Azure Private DNS Zone Virtual Network Link
 *
 * This test demonstrates basic usage of the PrivateDnsZoneLink construct
 * and validates deployment, idempotency, and cleanup for child resources.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { PrivateDnsZone } from "../../azure-privatednszone/lib/private-dns-zone";
import { ResourceGroup } from "../../azure-resourcegroup/lib/resource-group";
import { VirtualNetwork } from "../../azure-virtualnetwork/lib/virtual-network";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { PrivateDnsZoneLink } from "../lib/private-dns-zone-link";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("privatednszonelink-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Private DNS Zone Virtual Network Link usage
 */
class PrivateDnsZoneLinkExampleStack extends BaseTestStack {
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
    const resourceGroupName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "pdnszlink",
    );
    const privateDnsZoneName = this.generateResourceName(
      "Microsoft.Network/privateDnsZones",
      "link",
    );
    const vnetName = this.generateResourceName(
      "Microsoft.Network/virtualNetworks",
      "link",
    );

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "test-rg", {
      name: resourceGroupName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
        purpose: "private-dns-zone-link-testing",
      },
    });

    // Create Private DNS Zone
    const privateDnsZone = new PrivateDnsZone(this, "private-dns-zone", {
      name: `${privateDnsZoneName}.internal`,
      location: "global",
      resourceGroupId: resourceGroup.id,
      tags: {
        ...this.systemTags(),
        purpose: "testing-vnet-links",
      },
    });

    // Create Virtual Network
    const vnet = new VirtualNetwork(this, "test-vnet", {
      name: vnetName,
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
      tags: {
        ...this.systemTags(),
        purpose: "private-dns-link-testing",
      },
    });

    // Create a single virtual network link with basic configuration
    // This minimal test validates the core functionality of linking a VNet to a Private DNS Zone
    new PrivateDnsZoneLink(this, "basic-link", {
      name: "basic-vnet-link",
      location: "global",
      privateDnsZoneId: privateDnsZone.id,
      virtualNetworkId: vnet.id,
      registrationEnabled: false,
      tags: {
        ...this.systemTags(),
        example: "basic-link",
      },
      // IMPORTANT: Add explicit dependency on VNet to ensure proper destroy ordering.
      // The AZAPI provider may not track references within the JSON body for dependency
      // ordering. This ensures the link is destroyed before the VNet during terraform destroy.
      dependsOn: [vnet.resource],
    });

    // Note: The PrivateDnsZoneLink automatically establishes proper dependency order
    // through the parentId (privateDnsZoneId) for parent-child relationships.
    // However, the virtualNetworkId reference requires explicit dependsOn to ensure
    // proper destroy ordering, as references within the AZAPI body may not be tracked
    // by Terraform for dependency graph construction.
  }
}

describe("PrivateDnsZoneLink Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup resources", () => {
    const app = Testing.app();
    const stack = new PrivateDnsZoneLinkExampleStack(
      app,
      "test-privatednszonelink",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources (including parent-child relationships)
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources (child resources cleanup before parent)
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
