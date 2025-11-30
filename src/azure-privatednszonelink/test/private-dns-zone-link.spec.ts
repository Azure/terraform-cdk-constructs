/**
 * Comprehensive tests for the PrivateDnsZoneLink implementation
 *
 * This test suite validates the PrivateDnsZoneLink class using the
 * AzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation,
 * parent-child resource relationships, and full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  PrivateDnsZoneLink,
  PrivateDnsZoneLinkProps,
} from "../lib/private-dns-zone-link";
import {
  ALL_PRIVATE_DNS_ZONE_LINK_VERSIONS,
  PRIVATE_DNS_ZONE_LINK_TYPE,
} from "../lib/private-dns-zone-link-schemas";

describe("PrivateDnsZoneLink - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  const mockPrivateDnsZoneId =
    "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/test-rg/providers/Microsoft.Network/privateDnsZones/internal.contoso.com";
  const mockVirtualNetworkId =
    "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/test-vnet";

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure schemas are registered
    try {
      manager.registerResourceType(
        PRIVATE_DNS_ZONE_LINK_TYPE,
        ALL_PRIVATE_DNS_ZONE_LINK_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create Virtual Network Link with automatic latest version resolution", () => {
      const props: PrivateDnsZoneLinkProps = {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      };

      const link = new PrivateDnsZoneLink(stack, "TestLink", props);

      expect(link).toBeInstanceOf(PrivateDnsZoneLink);
      expect(link.resolvedApiVersion).toBe("2024-06-01");
      expect(link.props).toBe(props);
    });

    it("should create Virtual Network Link with explicit version pinning", () => {
      const props: PrivateDnsZoneLinkProps = {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        apiVersion: "2024-06-01",
        tags: { environment: "test" },
      };

      const link = new PrivateDnsZoneLink(stack, "TestLink", props);

      expect(link.resolvedApiVersion).toBe("2024-06-01");
      expect(link.tags).toEqual({ environment: "test" });
    });

    it("should use location from props or default from base class", () => {
      const props: PrivateDnsZoneLinkProps = {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      };

      const link = new PrivateDnsZoneLink(stack, "TestLink", props);

      expect(link.location).toBe("global");
    });

    it("should create Virtual Network Link with auto-registration enabled", () => {
      const props: PrivateDnsZoneLinkProps = {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        registrationEnabled: true,
      };

      const link = new PrivateDnsZoneLink(stack, "TestLink", props);

      expect(link).toBeDefined();
      expect(link.props.registrationEnabled).toBe(true);
    });

    it("should create Virtual Network Link with resolution policy", () => {
      const props: PrivateDnsZoneLinkProps = {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        resolutionPolicy: "NxDomainRedirect",
      };

      const link = new PrivateDnsZoneLink(stack, "TestLink", props);

      expect(link).toBeDefined();
      expect(link.props.resolutionPolicy).toBe("NxDomainRedirect");
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      expect(link.resolvedApiVersion).toBe("2024-06-01");
      expect(link.latestVersion()).toBe("2024-06-01");
    });

    it("should provide version configuration", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      expect(link.versionConfig).toBeDefined();
      expect(link.versionConfig.version).toBe("2024-06-01");
      expect(link.versionConfig.supportLevel).toBe(VersionSupportLevel.ACTIVE);
    });

    it("should provide supported versions", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      const versions = link.supportedVersions();
      expect(versions).toContain("2024-06-01");
      expect(versions.length).toBeGreaterThan(0);
    });
  });

  describe("Parent-Child Resource Relationship", () => {
    it("should use privateDnsZoneId as parent ID", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      // Verify the link was created successfully with proper parent
      expect(link).toBeDefined();
      expect(link.props.privateDnsZoneId).toBe(mockPrivateDnsZoneId);
    });

    it("should correctly handle child resource in Terraform synthesis", () => {
      new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("virtualNetworkLinks");
      expect(synthesized).toContain(mockPrivateDnsZoneId);
    });
  });

  describe("Public Methods - Virtual Network Link Properties", () => {
    it("should provide virtual network ID", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      expect(link.virtualNetworkId).toBeDefined();
      expect(typeof link.virtualNetworkId).toBe("string");
    });

    it("should provide registration enabled status", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        registrationEnabled: true,
      });

      expect(link.registrationEnabled).toBeDefined();
      expect(typeof link.registrationEnabled).toBe("string");
    });

    it("should provide resolution policy", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        resolutionPolicy: "Default",
      });

      expect(link.resolutionPolicy).toBeDefined();
      expect(typeof link.resolutionPolicy).toBe("string");
    });

    it("should provide provisioning state", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      expect(link.provisioningState).toBeDefined();
      expect(typeof link.provisioningState).toBe("string");
    });

    it("should provide virtual network link state", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      expect(link.virtualNetworkLinkState).toBeDefined();
      expect(typeof link.virtualNetworkLinkState).toBe("string");
    });
  });

  describe("Tag Management", () => {
    it("should allow adding tags", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        tags: { initial: "tag" },
      });

      link.addTag("newKey", "newValue");
      expect(link.props.tags).toHaveProperty("newKey", "newValue");
      expect(link.props.tags).toHaveProperty("initial", "tag");
    });

    it("should allow removing tags", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        tags: { key1: "value1", key2: "value2" },
      });

      link.removeTag("key1");
      expect(link.props.tags).not.toHaveProperty("key1");
      expect(link.props.tags).toHaveProperty("key2", "value2");
    });

    it("should handle adding tags when no initial tags exist", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      link.addTag("newKey", "newValue");
      expect(link.props.tags).toHaveProperty("newKey", "newValue");
    });
  });

  describe("Outputs", () => {
    it("should create all required outputs", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      expect(link.idOutput).toBeDefined();
      expect(link.nameOutput).toBeDefined();
      expect(link.locationOutput).toBeDefined();
      expect(link.provisioningStateOutput).toBeDefined();
      expect(link.virtualNetworkLinkStateOutput).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain('"id"');
      expect(synthesized).toContain('"name"');
      expect(synthesized).toContain('"location"');
      expect(synthesized).toContain('"provisioning_state"');
      expect(synthesized).toContain('"virtual_network_link_state"');
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        ignoreChanges: ["tags"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ignore_changes");
    });

    it("should handle multiple ignore changes properties", () => {
      new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        ignoreChanges: ["tags", "location"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new PrivateDnsZoneLink(stack, "SynthTest", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should generate correct resource type in Terraform", () => {
      new PrivateDnsZoneLink(stack, "SynthTest", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("virtualNetworkLinks");
      expect(synthesized).toContain("2024-06-01");
    });

    it("should include all properties in Terraform body", () => {
      new PrivateDnsZoneLink(stack, "SynthTest", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        registrationEnabled: true,
        resolutionPolicy: "NxDomainRedirect",
        tags: { env: "test" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("global");
      expect(synthesized).toContain("env");
      expect(synthesized).toContain(mockVirtualNetworkId);
    });
  });

  describe("Resource Identification", () => {
    it("should provide resource ID", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      expect(link.id).toBeDefined();
      expect(typeof link.id).toBe("string");
    });

    it("should provide resource name from construct id when name not in props", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      expect(link.name).toBe("TestLink");
    });

    it("should provide resource name from props when specified", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      expect(link.name).toBe("my-vnet-link");
    });
  });

  describe("JSII Compliance", () => {
    it("should have proper return types for all public methods", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      // All getter methods should return strings for Terraform interpolations
      expect(typeof link.virtualNetworkId).toBe("string");
      expect(typeof link.registrationEnabled).toBe("string");
      expect(typeof link.resolutionPolicy).toBe("string");
      expect(typeof link.provisioningState).toBe("string");
      expect(typeof link.virtualNetworkLinkState).toBe("string");
    });

    it("should not use function types in public interface", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      // Verify methods exist and are callable
      expect(typeof link.addTag).toBe("function");
      expect(typeof link.removeTag).toBe("function");

      // Test that they work correctly
      link.addTag("test", "value");
      expect(link.props.tags).toHaveProperty("test", "value");
    });
  });

  describe("Schema Registration", () => {
    it("should register schemas successfully", () => {
      const link = new PrivateDnsZoneLink(stack, "TestLink", {
        name: "my-vnet-link",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      // If the link was created successfully, schemas were registered
      expect(link).toBeDefined();
      expect(link.resolvedApiVersion).toBe("2024-06-01");
    });

    it("should handle multiple instantiations without errors", () => {
      new PrivateDnsZoneLink(stack, "TestLink1", {
        name: "my-vnet-link-1",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      // Second instantiation should not throw an error even if schemas are already registered
      const link2 = new PrivateDnsZoneLink(stack, "TestLink2", {
        name: "my-vnet-link-2",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      expect(link2).toBeDefined();
    });
  });

  describe("Property Validation", () => {
    it("should handle registration enabled property correctly", () => {
      const linkEnabled = new PrivateDnsZoneLink(stack, "TestLinkEnabled", {
        name: "my-vnet-link-enabled",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        registrationEnabled: true,
      });

      const linkDisabled = new PrivateDnsZoneLink(stack, "TestLinkDisabled", {
        name: "my-vnet-link-disabled",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        registrationEnabled: false,
      });

      expect(linkEnabled.props.registrationEnabled).toBe(true);
      expect(linkDisabled.props.registrationEnabled).toBe(false);
    });

    it("should handle different resolution policies", () => {
      const linkDefault = new PrivateDnsZoneLink(stack, "TestLinkDefault", {
        name: "my-vnet-link-default",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        resolutionPolicy: "Default",
      });

      const linkRedirect = new PrivateDnsZoneLink(stack, "TestLinkRedirect", {
        name: "my-vnet-link-redirect",
        location: "global",
        privateDnsZoneId: mockPrivateDnsZoneId,
        virtualNetworkId: mockVirtualNetworkId,
        resolutionPolicy: "NxDomainRedirect",
      });

      expect(linkDefault.props.resolutionPolicy).toBe("Default");
      expect(linkRedirect.props.resolutionPolicy).toBe("NxDomainRedirect");
    });
  });
});
