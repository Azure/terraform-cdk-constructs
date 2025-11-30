/**
 * Comprehensive tests for the unified DnsZone implementation
 *
 * This test suite validates the unified DnsZone class using the
 * VersionedAzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation, and
 * full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import { DnsZone, DnsZoneProps } from "../lib/dns-zone";
import { ALL_DNS_ZONE_VERSIONS, DNS_ZONE_TYPE } from "../lib/dns-zone-schemas";

describe("DnsZone - Unified Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure schemas are registered
    try {
      manager.registerResourceType(DNS_ZONE_TYPE, ALL_DNS_ZONE_VERSIONS);
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create DNS zone with automatic latest version resolution", () => {
      const props: DnsZoneProps = {
        name: "contoso.com",
        location: "global",
      };

      const dnsZone = new DnsZone(stack, "TestDnsZone", props);

      expect(dnsZone).toBeInstanceOf(DnsZone);
      expect(dnsZone.resolvedApiVersion).toBe("2018-05-01");
      expect(dnsZone.props).toBe(props);
    });

    it("should create DNS zone with explicit version pinning", () => {
      const props: DnsZoneProps = {
        name: "contoso.com",
        location: "global",
        apiVersion: "2018-05-01",
        tags: { environment: "test" },
      };

      const dnsZone = new DnsZone(stack, "TestDnsZone", props);

      expect(dnsZone.resolvedApiVersion).toBe("2018-05-01");
      expect(dnsZone.tags).toEqual({ environment: "test" });
    });

    it("should create public DNS zone by default", () => {
      const props: DnsZoneProps = {
        name: "contoso.com",
        location: "global",
      };

      const dnsZone = new DnsZone(stack, "TestDnsZone", props);

      expect(dnsZone.zoneType).toBe("Public");
    });

    it("should create private DNS zone when specified", () => {
      const props: DnsZoneProps = {
        name: "internal.contoso.com",
        location: "global",
        zoneType: "Private",
        registrationVirtualNetworks: [
          {
            id: "/subscriptions/sub1/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1",
          },
        ],
      };

      const dnsZone = new DnsZone(stack, "TestDnsZone", props);

      expect(dnsZone.zoneType).toBe("Private");
    });

    it("should use global location by default", () => {
      const props: DnsZoneProps = {
        name: "contoso.com",
      };

      const dnsZone = new DnsZone(stack, "TestDnsZone", props);

      expect(dnsZone.location).toBe("global");
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const dnsZone = new DnsZone(stack, "TestDnsZone", {
        name: "contoso.com",
        location: "global",
      });

      expect(dnsZone.resolvedApiVersion).toBe("2018-05-01");
      expect(dnsZone.latestVersion()).toBe("2018-05-01");
    });

    it("should provide version configuration", () => {
      const dnsZone = new DnsZone(stack, "TestDnsZone", {
        name: "contoso.com",
        location: "global",
      });

      expect(dnsZone.versionConfig).toBeDefined();
      expect(dnsZone.versionConfig.version).toBe("2018-05-01");
      expect(dnsZone.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });

    it("should provide supported versions", () => {
      const dnsZone = new DnsZone(stack, "TestDnsZone", {
        name: "contoso.com",
        location: "global",
      });

      const versions = dnsZone.supportedVersions();
      expect(versions).toContain("2018-05-01");
      expect(versions.length).toBeGreaterThan(0);
    });
  });

  describe("Public Methods", () => {
    it("should provide name servers output", () => {
      const dnsZone = new DnsZone(stack, "TestDnsZone", {
        name: "contoso.com",
        location: "global",
      });

      expect(dnsZone.nameServers).toBeDefined();
      expect(typeof dnsZone.nameServers).toBe("string");
    });

    it("should provide max number of record sets", () => {
      const dnsZone = new DnsZone(stack, "TestDnsZone", {
        name: "contoso.com",
        location: "global",
      });

      expect(dnsZone.maxNumberOfRecordSets).toBeDefined();
    });

    it("should provide current number of record sets", () => {
      const dnsZone = new DnsZone(stack, "TestDnsZone", {
        name: "contoso.com",
        location: "global",
      });

      expect(dnsZone.numberOfRecordSets).toBeDefined();
    });

    it("should allow adding tags", () => {
      const dnsZone = new DnsZone(stack, "TestDnsZone", {
        name: "contoso.com",
        location: "global",
        tags: { initial: "tag" },
      });

      dnsZone.addTag("newKey", "newValue");
      expect(dnsZone.props.tags).toHaveProperty("newKey", "newValue");
      expect(dnsZone.props.tags).toHaveProperty("initial", "tag");
    });

    it("should allow removing tags", () => {
      const dnsZone = new DnsZone(stack, "TestDnsZone", {
        name: "contoso.com",
        location: "global",
        tags: { key1: "value1", key2: "value2" },
      });

      dnsZone.removeTag("key1");
      expect(dnsZone.props.tags).not.toHaveProperty("key1");
      expect(dnsZone.props.tags).toHaveProperty("key2", "value2");
    });
  });

  describe("Outputs", () => {
    it("should create all required outputs", () => {
      const dnsZone = new DnsZone(stack, "TestDnsZone", {
        name: "contoso.com",
        location: "global",
      });

      expect(dnsZone.idOutput).toBeDefined();
      expect(dnsZone.locationOutput).toBeDefined();
      expect(dnsZone.nameOutput).toBeDefined();
      expect(dnsZone.tagsOutput).toBeDefined();
      expect(dnsZone.nameServersOutput).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      new DnsZone(stack, "TestDnsZone", {
        name: "contoso.com",
        location: "global",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain('"id"');
      expect(synthesized).toContain('"location"');
      expect(synthesized).toContain('"name"');
      expect(synthesized).toContain('"tags"');
      expect(synthesized).toContain('"name_servers"');
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      new DnsZone(stack, "TestDnsZone", {
        name: "contoso.com",
        location: "global",
        ignoreChanges: ["tags"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ignore_changes");
    });

    it("should handle multiple ignore changes properties", () => {
      new DnsZone(stack, "TestDnsZone2", {
        name: "contoso2.com",
        location: "global",
        ignoreChanges: ["tags", "location"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new DnsZone(stack, "SynthTest", {
        name: "contoso.com",
        location: "global",
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should generate correct resource type in Terraform", () => {
      new DnsZone(stack, "SynthTest", {
        name: "contoso.com",
        location: "global",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("Microsoft.Network/dnsZones");
      expect(synthesized).toContain("2018-05-01");
    });

    it("should include all properties in Terraform body", () => {
      new DnsZone(stack, "SynthTest", {
        name: "contoso.com",
        location: "global",
        tags: { env: "test" },
        zoneType: "Public",
      });

      const synthesized = Testing.synth(stack);
      const stackConfig = JSON.parse(synthesized);

      // Verify the resource exists
      expect(stackConfig.resource).toBeDefined();
      expect(stackConfig.resource.azapi_resource).toBeDefined();

      // Get the resource
      const resources = Object.values(stackConfig.resource.azapi_resource);
      expect(resources.length).toBeGreaterThan(0);
      const resource: any = resources[0];

      // Verify tags are at the resource level (not in body)
      expect(resource.tags).toEqual({ env: "test" });

      // Verify body contains location
      expect(resource.body.location).toBe("global");
    });
  });

  describe("Private DNS Zone Features", () => {
    it("should create private DNS zone with virtual network references", () => {
      const dnsZone = new DnsZone(stack, "PrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
        zoneType: "Private",
        registrationVirtualNetworks: [
          {
            id: "/subscriptions/sub1/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1",
          },
        ],
        resolutionVirtualNetworks: [
          {
            id: "/subscriptions/sub1/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet2",
          },
        ],
      });

      expect(dnsZone.zoneType).toBe("Private");
      expect(dnsZone.props.registrationVirtualNetworks).toHaveLength(1);
      expect(dnsZone.props.resolutionVirtualNetworks).toHaveLength(1);
    });
  });

  describe("Resource Identification", () => {
    it("should provide resource ID", () => {
      const dnsZone = new DnsZone(stack, "TestDnsZone", {
        name: "contoso.com",
        location: "global",
      });

      expect(dnsZone.id).toBeDefined();
      expect(typeof dnsZone.id).toBe("string");
    });

    it("should provide resource name from props", () => {
      const dnsZone = new DnsZone(stack, "TestDnsZone", {
        name: "contoso.com",
        location: "global",
      });

      expect(dnsZone.name).toBe("contoso.com");
    });
  });
});
