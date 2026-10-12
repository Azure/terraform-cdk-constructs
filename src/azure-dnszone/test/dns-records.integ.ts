/**
 * Integration test for Azure Public DNS Zone Records
 *
 * This test demonstrates usage of all Public DNS record types
 * and validates deployment, idempotency, and cleanup for child resources.
 *
 * Supported Record Types:
 * - A record (IPv4 addresses, including alias records)
 * - AAAA record (IPv6 addresses, including alias records)
 * - CAA record (Certificate Authority Authorization - PUBLIC ONLY)
 * - CNAME record (including alias records)
 * - MX record
 * - NS record (Name Server - PUBLIC ONLY)
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
import { DnsZone } from "../lib/dns-zone";
import {
  DnsARecord,
  DnsAaaaRecord,
  DnsCaaRecord,
  DnsCnameRecord,
  DnsMxRecord,
  DnsNsRecord,
  DnsPtrRecord,
  DnsSrvRecord,
  DnsTxtRecord,
} from "../lib/records";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("dnsrec-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Public DNS Records usage
 *
 * Creates a Public DNS Zone and various record types within it.
 */
class DnsRecordsExampleStack extends BaseTestStack {
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
      "dnsrec",
    );

    // Create resource group for the DNS zone and records
    const resourceGroup = new ResourceGroup(this, "test-rg", {
      name: resourceGroupName,
      location: "eastus2",
      tags: {
        ...this.systemTags(),
        purpose: "public-dns-records-testing",
      },
    });

    // Create Public DNS Zone - using a unique zone name
    // Note: Public DNS zones require globally unique names
    const zoneName = this.generateResourceName(
      "Microsoft.Network/dnsZones",
      "rec",
    );
    const zone = new DnsZone(this, "public-dns-zone", {
      name: `${zoneName}.com`,
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
    new DnsARecord(this, "a-record-single", {
      name: "web",
      dnsZoneId: zone.id,
      ttl: 300,
      records: [{ ipv4Address: "20.30.40.50" }],
      metadata: {
        purpose: "web-server",
      },
    });

    // =========================================================================
    // A Record - Multiple IPs (load balancing)
    // =========================================================================
    new DnsARecord(this, "a-record-multi", {
      name: "api",
      dnsZoneId: zone.id,
      ttl: 300,
      records: [
        { ipv4Address: "20.30.40.51" },
        { ipv4Address: "20.30.40.52" },
        { ipv4Address: "20.30.40.53" },
      ],
      metadata: {
        purpose: "api-servers-loadbalanced",
      },
    });

    // =========================================================================
    // AAAA Record - IPv6 addresses
    // =========================================================================
    new DnsAaaaRecord(this, "aaaa-record", {
      name: "ipv6host",
      dnsZoneId: zone.id,
      ttl: 300,
      records: [
        { ipv6Address: "2001:db8:85a3::8a2e:370:7334" },
        { ipv6Address: "2001:db8:85a3::8a2e:370:7335" },
      ],
      metadata: {
        purpose: "ipv6-servers",
      },
    });

    // =========================================================================
    // CAA Record - Certificate Authority Authorization (PUBLIC DNS ONLY)
    // Specifies which CAs are allowed to issue certificates for this domain
    // =========================================================================
    new DnsCaaRecord(this, "caa-record", {
      name: "@",
      dnsZoneId: zone.id,
      ttl: 3600,
      records: [
        { flags: 0, tag: "issue", value: "letsencrypt.org" },
        { flags: 0, tag: "issue", value: "digicert.com" },
        { flags: 0, tag: "issuewild", value: "letsencrypt.org" },
        { flags: 0, tag: "iodef", value: "mailto:security@example.com" },
      ],
      metadata: {
        purpose: "certificate-authority-authorization",
      },
    });

    // =========================================================================
    // CNAME Record - Alias
    // =========================================================================
    new DnsCnameRecord(this, "cname-record", {
      name: "www",
      dnsZoneId: zone.id,
      ttl: 3600,
      cname: `web.${zoneName}.com`,
      metadata: {
        purpose: "alias-to-web",
      },
    });

    // =========================================================================
    // MX Record - Mail exchange servers
    // =========================================================================
    new DnsMxRecord(this, "mx-record", {
      name: "@",
      dnsZoneId: zone.id,
      ttl: 3600,
      records: [
        { preference: 10, exchange: `mail1.${zoneName}.com` },
        { preference: 20, exchange: `mail2.${zoneName}.com` },
        { preference: 30, exchange: "mail.backup-provider.com" },
      ],
      metadata: {
        purpose: "mail-servers",
      },
    });

    // =========================================================================
    // NS Record - Name server delegation (PUBLIC DNS ONLY)
    // Used for delegating a subdomain to different name servers
    // =========================================================================
    new DnsNsRecord(this, "ns-record", {
      name: "subdomain",
      dnsZoneId: zone.id,
      ttl: 3600,
      records: [
        { nsdname: "ns1.subdomain-provider.com" },
        { nsdname: "ns2.subdomain-provider.com" },
      ],
      metadata: {
        purpose: "subdomain-delegation",
      },
    });

    // =========================================================================
    // PTR Record - Reverse DNS
    // Note: In practice, PTR records are created in reverse DNS zones
    // managed by IP address providers. This demonstrates the record structure.
    // =========================================================================
    new DnsPtrRecord(this, "ptr-record", {
      name: "ptr",
      dnsZoneId: zone.id,
      ttl: 3600,
      records: [{ ptrdname: `server1.${zoneName}.com` }],
      metadata: {
        purpose: "reverse-dns-example",
      },
    });

    // =========================================================================
    // SRV Record - Service location
    // Format: _service._protocol (e.g., _sip._tcp)
    // =========================================================================
    new DnsSrvRecord(this, "srv-record-sip", {
      name: "_sip._tcp",
      dnsZoneId: zone.id,
      ttl: 3600,
      records: [
        {
          priority: 10,
          weight: 60,
          port: 5060,
          target: `sipserver1.${zoneName}.com`,
        },
        {
          priority: 10,
          weight: 40,
          port: 5060,
          target: `sipserver2.${zoneName}.com`,
        },
      ],
      metadata: {
        purpose: "sip-service-discovery",
      },
    });

    // =========================================================================
    // SRV Record - Microsoft 365 Autodiscover
    // =========================================================================
    new DnsSrvRecord(this, "srv-record-autodiscover", {
      name: "_autodiscover._tcp",
      dnsZoneId: zone.id,
      ttl: 3600,
      records: [
        {
          priority: 0,
          weight: 1,
          port: 443,
          target: "autodiscover.outlook.com",
        },
      ],
      metadata: {
        purpose: "outlook-autodiscover",
      },
    });

    // =========================================================================
    // TXT Record - Root domain TXT records (SPF + Domain Verification)
    // Note: In Azure DNS, all TXT records for the same name must be in a single record set.
    // Each TXT record in the set can have multiple string values.
    // =========================================================================
    new DnsTxtRecord(this, "txt-record-root", {
      name: "@",
      dnsZoneId: zone.id,
      ttl: 3600,
      records: [
        {
          value: [
            "v=spf1 include:spf.protection.outlook.com include:_spf.google.com ~all",
          ],
        },
        { value: ["MS=ms12345678"] },
      ],
      metadata: {
        purpose: "root-txt-records",
      },
    });

    // =========================================================================
    // TXT Record - DKIM record
    // =========================================================================
    new DnsTxtRecord(this, "txt-record-dkim", {
      name: "selector1._domainkey",
      dnsZoneId: zone.id,
      ttl: 3600,
      records: [
        {
          value: [
            "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...",
          ],
        },
      ],
      metadata: {
        purpose: "dkim-record",
      },
    });

    // =========================================================================
    // TXT Record - DMARC record
    // =========================================================================
    new DnsTxtRecord(this, "txt-record-dmarc", {
      name: "_dmarc",
      dnsZoneId: zone.id,
      ttl: 3600,
      records: [
        {
          value: [
            "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@example.com; pct=100",
          ],
        },
      ],
      metadata: {
        purpose: "dmarc-policy",
      },
    });

    // =========================================================================
    // Additional A Record - subdomain
    // =========================================================================
    new DnsARecord(this, "a-record-subdomain", {
      name: "blog",
      dnsZoneId: zone.id,
      ttl: 300,
      records: [{ ipv4Address: "20.30.40.100" }],
      metadata: {
        purpose: "blog-server",
      },
    });
  }
}

describe("DnsRecords Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup resources", () => {
    const app = Testing.app();
    const stack = new DnsRecordsExampleStack(app, "test-dnsrecords");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources (including parent-child relationships)
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources (child resources cleanup before parent)
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
