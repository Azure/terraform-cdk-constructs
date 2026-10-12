/**
 * Integration test for Azure Private DNS Zone Records
 *
 * This test demonstrates usage of all Private DNS record types
 * and validates deployment, idempotency, and cleanup for child resources.
 *
 * Supported Record Types:
 * - A record (IPv4 addresses)
 * - AAAA record (IPv6 addresses)
 * - CNAME record
 * - MX record
 * - PTR record
 * - SRV record
 * - TXT record
 * - (SOA is managed by Azure automatically)
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktn";
import { Construct } from "constructs";
import "cdktn/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup/lib/resource-group";
import { AzapiProvider } from "@cdktn/provider-azapi/lib/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { PrivateDnsZone } from "../lib/private-dns-zone";
import {
  PrivateDnsARecord,
  PrivateDnsAaaaRecord,
  PrivateDnsCnameRecord,
  PrivateDnsMxRecord,
  PrivateDnsPtrRecord,
  PrivateDnsSrvRecord,
  PrivateDnsTxtRecord,
} from "../lib/records";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("privatednsrec-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Private DNS Records usage
 *
 * Creates a Private DNS Zone and various record types within it.
 */
class PrivateDnsRecordsExampleStack extends BaseTestStack {
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
      "privatednsrec",
    );

    // Create resource group for the Private DNS zone and records
    const resourceGroup = new ResourceGroup(this, "test-rg", {
      name: resourceGroupName,
      location: "eastus2",
      tags: {
        ...this.systemTags(),
        purpose: "private-dns-records-testing",
      },
    });

    // Create Private DNS Zone - using a unique zone name
    const zoneName = this.generateResourceName(
      "Microsoft.Network/privateDnsZones",
      "rec",
    );
    const zone = new PrivateDnsZone(this, "private-dns-zone", {
      name: `${zoneName}.internal`,
      location: "global",
      resourceGroupId: resourceGroup.id,
      tags: {
        ...this.systemTags(),
        purpose: "dns-records-testing",
      },
    });

    // =========================================================================
    // A Record - Single IP
    // =========================================================================
    new PrivateDnsARecord(this, "a-record-single", {
      name: "web",
      privateDnsZoneId: zone.id,
      ttl: 300,
      records: [{ ipv4Address: "10.0.1.4" }],
      metadata: {
        purpose: "web-server",
      },
    });

    // =========================================================================
    // A Record - Multiple IPs (load balancing)
    // =========================================================================
    new PrivateDnsARecord(this, "a-record-multi", {
      name: "api",
      privateDnsZoneId: zone.id,
      ttl: 300,
      records: [
        { ipv4Address: "10.0.1.10" },
        { ipv4Address: "10.0.1.11" },
        { ipv4Address: "10.0.1.12" },
      ],
      metadata: {
        purpose: "api-servers-loadbalanced",
      },
    });

    // =========================================================================
    // AAAA Record - IPv6 addresses
    // =========================================================================
    new PrivateDnsAaaaRecord(this, "aaaa-record", {
      name: "ipv6host",
      privateDnsZoneId: zone.id,
      ttl: 300,
      records: [{ ipv6Address: "2001:db8::1" }, { ipv6Address: "2001:db8::2" }],
      metadata: {
        purpose: "ipv6-servers",
      },
    });

    // =========================================================================
    // CNAME Record - Alias
    // =========================================================================
    new PrivateDnsCnameRecord(this, "cname-record", {
      name: "www",
      privateDnsZoneId: zone.id,
      ttl: 3600,
      cname: `web.${zoneName}.internal`,
      metadata: {
        purpose: "alias-to-web",
      },
    });

    // =========================================================================
    // MX Record - Mail exchange servers
    // =========================================================================
    new PrivateDnsMxRecord(this, "mx-record", {
      name: "@",
      privateDnsZoneId: zone.id,
      ttl: 3600,
      records: [
        { preference: 10, exchange: `mail1.${zoneName}.internal` },
        { preference: 20, exchange: `mail2.${zoneName}.internal` },
      ],
      metadata: {
        purpose: "mail-servers",
      },
    });

    // =========================================================================
    // PTR Record - Reverse DNS
    // Note: In practice, PTR records are created in reverse DNS zones
    // (e.g., 1.0.10.in-addr.arpa), but for this test we demonstrate
    // the record creation in a forward zone
    // =========================================================================
    new PrivateDnsPtrRecord(this, "ptr-record", {
      name: "ptr",
      privateDnsZoneId: zone.id,
      ttl: 3600,
      records: [{ ptrdname: `server1.${zoneName}.internal` }],
      metadata: {
        purpose: "reverse-dns-lookup",
      },
    });

    // =========================================================================
    // SRV Record - Service location
    // Format: _service._protocol (e.g., _sip._tcp)
    // =========================================================================
    new PrivateDnsSrvRecord(this, "srv-record", {
      name: "_sip._tcp",
      privateDnsZoneId: zone.id,
      ttl: 3600,
      records: [
        {
          priority: 10,
          weight: 60,
          port: 5060,
          target: `sipserver1.${zoneName}.internal`,
        },
        {
          priority: 10,
          weight: 40,
          port: 5060,
          target: `sipserver2.${zoneName}.internal`,
        },
        {
          priority: 20,
          weight: 100,
          port: 5060,
          target: `sipserver-backup.${zoneName}.internal`,
        },
      ],
      metadata: {
        purpose: "sip-service-discovery",
      },
    });

    // =========================================================================
    // TXT Record - SPF record
    // =========================================================================
    new PrivateDnsTxtRecord(this, "txt-record-spf", {
      name: "@",
      privateDnsZoneId: zone.id,
      ttl: 3600,
      records: [{ value: ["v=spf1 include:_spf.internal.example.com ~all"] }],
      metadata: {
        purpose: "spf-record",
      },
    });

    // =========================================================================
    // TXT Record - Domain verification
    // =========================================================================
    new PrivateDnsTxtRecord(this, "txt-record-verification", {
      name: "_verify",
      privateDnsZoneId: zone.id,
      ttl: 3600,
      records: [
        { value: ["verification-token=abc123def456"] },
        { value: ["another-verification=xyz789"] },
      ],
      metadata: {
        purpose: "domain-verification",
      },
    });

    // =========================================================================
    // Additional SRV Record - LDAP service
    // =========================================================================
    new PrivateDnsSrvRecord(this, "srv-record-ldap", {
      name: "_ldap._tcp",
      privateDnsZoneId: zone.id,
      ttl: 3600,
      records: [
        {
          priority: 0,
          weight: 100,
          port: 389,
          target: `ldap.${zoneName}.internal`,
        },
      ],
      metadata: {
        purpose: "ldap-service-discovery",
      },
    });
  }
}

describe("PrivateDnsRecords Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup resources", () => {
    const app = Testing.app();
    const stack = new PrivateDnsRecordsExampleStack(
      app,
      "test-privatednsrecords",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources (including parent-child relationships)
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources (child resources cleanup before parent)
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
