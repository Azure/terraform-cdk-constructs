/**
 * Integration test for Azure DNS Zone
 *
 * This test demonstrates basic usage of the DnsZone construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup/lib/resource-group";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { DnsZone } from "../lib/dns-zone";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("dnszone-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating DNS Zone usage
 */
class DnsZoneExampleStack extends BaseTestStack {
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
      "dnszone",
    );
    const dnsZoneName = this.generateResourceName(
      "Microsoft.Network/dnsZones",
      "basic",
    );

    // Create resource group for the DNS zone
    const resourceGroup = new ResourceGroup(this, "test-rg", {
      name: resourceGroupName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
        purpose: "dns-zone-testing",
      },
    });

    // Example 1: Basic public DNS zone
    new DnsZone(this, "basic-dns-zone", {
      name: `${dnsZoneName}.com`,
      location: "global",
      resourceGroupId: resourceGroup.id,
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });

    // Example 2: Public DNS zone with explicit tags
    new DnsZone(this, "tagged-dns-zone", {
      name: `${dnsZoneName}-tagged.com`,
      location: "global",
      resourceGroupId: resourceGroup.id,
      zoneType: "Public",
      tags: {
        ...this.systemTags(),
        example: "tagged",
        environment: "test",
        owner: "integration-test",
      },
    });
  }
}

describe("DnsZone Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup resources", () => {
    const app = Testing.app();
    const stack = new DnsZoneExampleStack(app, "test-dnszone");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
