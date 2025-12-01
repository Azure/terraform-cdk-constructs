/**
 * Comprehensive tests for the unified PrivateDnsZone implementation
 *
 * This test suite validates the unified PrivateDnsZone class using the
 * VersionedAzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation, and
 * full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import { PrivateDnsZone, PrivateDnsZoneProps } from "../lib/private-dns-zone";
import {
  ALL_PRIVATE_DNS_ZONE_VERSIONS,
  PRIVATE_DNS_ZONE_TYPE,
} from "../lib/private-dns-zone-schemas";

describe("PrivateDnsZone - Unified Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure schemas are registered
    try {
      manager.registerResourceType(
        PRIVATE_DNS_ZONE_TYPE,
        ALL_PRIVATE_DNS_ZONE_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create Private DNS zone with automatic latest version resolution", () => {
      const props: PrivateDnsZoneProps = {
        name: "internal.contoso.com",
        location: "global",
      };

      const privateDnsZone = new PrivateDnsZone(
        stack,
        "TestPrivateDnsZone",
        props,
      );

      expect(privateDnsZone).toBeInstanceOf(PrivateDnsZone);
      expect(privateDnsZone.resolvedApiVersion).toBe("2024-06-01");
      expect(privateDnsZone.props).toBe(props);
    });

    it("should create Private DNS zone with explicit version pinning", () => {
      const props: PrivateDnsZoneProps = {
        name: "internal.contoso.com",
        location: "global",
        apiVersion: "2024-06-01",
        tags: { environment: "test" },
      };

      const privateDnsZone = new PrivateDnsZone(
        stack,
        "TestPrivateDnsZone",
        props,
      );

      expect(privateDnsZone.resolvedApiVersion).toBe("2024-06-01");
      expect(privateDnsZone.tags).toEqual({ environment: "test" });
    });

    it("should use global location in body when not specified", () => {
      const props: PrivateDnsZoneProps = {
        name: "internal.contoso.com",
      };

      const privateDnsZone = new PrivateDnsZone(
        stack,
        "TestPrivateDnsZone",
        props,
      );

      // Location is now resolved by the template method pattern to "global"
      expect(privateDnsZone.location).toBe("global");

      // The synthesized Terraform should contain "global" in the body
      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("global");
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      expect(privateDnsZone.resolvedApiVersion).toBe("2024-06-01");
      expect(privateDnsZone.latestVersion()).toBe("2024-06-01");
    });

    it("should provide version configuration", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      expect(privateDnsZone.versionConfig).toBeDefined();
      expect(privateDnsZone.versionConfig.version).toBe("2024-06-01");
      expect(privateDnsZone.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });

    it("should provide supported versions", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      const versions = privateDnsZone.supportedVersions();
      expect(versions).toContain("2024-06-01");
      expect(versions.length).toBeGreaterThan(0);
    });
  });

  describe("Public Methods - Read-only Properties", () => {
    it("should provide max number of record sets", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      expect(privateDnsZone.maxNumberOfRecordSets).toBeDefined();
      expect(typeof privateDnsZone.maxNumberOfRecordSets).toBe("string");
    });

    it("should provide current number of record sets", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      expect(privateDnsZone.numberOfRecordSets).toBeDefined();
      expect(typeof privateDnsZone.numberOfRecordSets).toBe("string");
    });

    it("should provide max number of virtual network links", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      expect(privateDnsZone.maxNumberOfVirtualNetworkLinks).toBeDefined();
      expect(typeof privateDnsZone.maxNumberOfVirtualNetworkLinks).toBe(
        "string",
      );
    });

    it("should provide max number of virtual network links with registration", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      expect(
        privateDnsZone.maxNumberOfVirtualNetworkLinksWithRegistration,
      ).toBeDefined();
      expect(
        typeof privateDnsZone.maxNumberOfVirtualNetworkLinksWithRegistration,
      ).toBe("string");
    });

    it("should provide current number of virtual network links with registration", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      expect(
        privateDnsZone.numberOfVirtualNetworkLinksWithRegistration,
      ).toBeDefined();
      expect(
        typeof privateDnsZone.numberOfVirtualNetworkLinksWithRegistration,
      ).toBe("string");
    });

    it("should provide provisioning state", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      expect(privateDnsZone.provisioningState).toBeDefined();
      expect(typeof privateDnsZone.provisioningState).toBe("string");
    });

    it("should provide internal ID", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      expect(privateDnsZone.internalId).toBeDefined();
      expect(typeof privateDnsZone.internalId).toBe("string");
    });
  });

  describe("Tag Management", () => {
    it("should allow adding tags", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
        tags: { initial: "tag" },
      });

      privateDnsZone.addTag("newKey", "newValue");
      expect(privateDnsZone.props.tags).toHaveProperty("newKey", "newValue");
      expect(privateDnsZone.props.tags).toHaveProperty("initial", "tag");
    });

    it("should allow removing tags", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
        tags: { key1: "value1", key2: "value2" },
      });

      privateDnsZone.removeTag("key1");
      expect(privateDnsZone.props.tags).not.toHaveProperty("key1");
      expect(privateDnsZone.props.tags).toHaveProperty("key2", "value2");
    });

    it("should handle adding tags when no initial tags exist", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      privateDnsZone.addTag("newKey", "newValue");
      expect(privateDnsZone.props.tags).toHaveProperty("newKey", "newValue");
    });
  });

  describe("Outputs", () => {
    it("should create all required outputs", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      expect(privateDnsZone.idOutput).toBeDefined();
      expect(privateDnsZone.locationOutput).toBeDefined();
      expect(privateDnsZone.nameOutput).toBeDefined();
      expect(privateDnsZone.tagsOutput).toBeDefined();
      expect(privateDnsZone.maxNumberOfRecordSetsOutput).toBeDefined();
      expect(privateDnsZone.numberOfRecordSetsOutput).toBeDefined();
      expect(privateDnsZone.maxNumberOfVirtualNetworkLinksOutput).toBeDefined();
      expect(
        privateDnsZone.maxNumberOfVirtualNetworkLinksWithRegistrationOutput,
      ).toBeDefined();
      expect(
        privateDnsZone.numberOfVirtualNetworkLinksWithRegistrationOutput,
      ).toBeDefined();
      expect(privateDnsZone.provisioningStateOutput).toBeDefined();
      expect(privateDnsZone.internalIdOutput).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain('"id"');
      expect(synthesized).toContain('"location"');
      expect(synthesized).toContain('"name"');
      expect(synthesized).toContain('"tags"');
      expect(synthesized).toContain('"max_number_of_record_sets"');
      expect(synthesized).toContain('"number_of_record_sets"');
      expect(synthesized).toContain('"max_number_of_virtual_network_links"');
      expect(synthesized).toContain(
        '"max_number_of_virtual_network_links_with_registration"',
      );
      expect(synthesized).toContain(
        '"number_of_virtual_network_links_with_registration"',
      );
      expect(synthesized).toContain('"provisioning_state"');
      expect(synthesized).toContain('"internal_id"');
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
        ignoreChanges: ["tags"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ignore_changes");
    });

    it("should handle multiple ignore changes properties", () => {
      new PrivateDnsZone(stack, "TestPrivateDnsZone2", {
        name: "internal2.contoso.com",
        location: "global",
        ignoreChanges: ["tags", "location"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new PrivateDnsZone(stack, "SynthTest", {
        name: "internal.contoso.com",
        location: "global",
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should generate correct resource type in Terraform", () => {
      new PrivateDnsZone(stack, "SynthTest", {
        name: "internal.contoso.com",
        location: "global",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("Microsoft.Network/privateDnsZones");
      expect(synthesized).toContain("2024-06-01");
    });

    it("should include all properties in Terraform body", () => {
      new PrivateDnsZone(stack, "SynthTest", {
        name: "internal.contoso.com",
        location: "global",
        tags: { env: "test" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("global");
      expect(synthesized).toContain("env");
    });
  });

  describe("Resource Identification", () => {
    it("should provide resource ID", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      expect(privateDnsZone.id).toBeDefined();
      expect(typeof privateDnsZone.id).toBe("string");
    });

    it("should provide resource name from props", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      expect(privateDnsZone.name).toBe("internal.contoso.com");
    });
  });

  describe("JSII Compliance", () => {
    it("should have proper return types for all public methods", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      // All getter methods should return strings for Terraform interpolations
      expect(typeof privateDnsZone.maxNumberOfRecordSets).toBe("string");
      expect(typeof privateDnsZone.numberOfRecordSets).toBe("string");
      expect(typeof privateDnsZone.maxNumberOfVirtualNetworkLinks).toBe(
        "string",
      );
      expect(
        typeof privateDnsZone.maxNumberOfVirtualNetworkLinksWithRegistration,
      ).toBe("string");
      expect(
        typeof privateDnsZone.numberOfVirtualNetworkLinksWithRegistration,
      ).toBe("string");
      expect(typeof privateDnsZone.provisioningState).toBe("string");
      expect(typeof privateDnsZone.internalId).toBe("string");
    });

    it("should not use function types in public interface", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      // Verify methods exist and are callable
      expect(typeof privateDnsZone.addTag).toBe("function");
      expect(typeof privateDnsZone.removeTag).toBe("function");

      // Test that they work correctly
      privateDnsZone.addTag("test", "value");
      expect(privateDnsZone.props.tags).toHaveProperty("test", "value");
    });
  });

  describe("Schema Registration", () => {
    it("should register schemas successfully", () => {
      const privateDnsZone = new PrivateDnsZone(stack, "TestPrivateDnsZone", {
        name: "internal.contoso.com",
        location: "global",
      });

      // If the zone was created successfully, schemas were registered
      expect(privateDnsZone).toBeDefined();
      expect(privateDnsZone.resolvedApiVersion).toBe("2024-06-01");
    });

    it("should handle multiple instantiations without errors", () => {
      new PrivateDnsZone(stack, "TestPrivateDnsZone1", {
        name: "internal1.contoso.com",
        location: "global",
      });

      // Second instantiation should not throw an error even if schemas are already registered
      const privateDnsZone2 = new PrivateDnsZone(stack, "TestPrivateDnsZone2", {
        name: "internal2.contoso.com",
        location: "global",
      });

      expect(privateDnsZone2).toBeDefined();
    });
  });
});
