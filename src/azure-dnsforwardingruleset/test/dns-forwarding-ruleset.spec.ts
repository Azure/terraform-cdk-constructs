/**
 * Comprehensive tests for the DnsForwardingRuleset implementation
 *
 * This test suite validates the DnsForwardingRuleset class using the
 * AzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation,
 * and full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  DnsForwardingRuleset,
  DnsForwardingRulesetProps,
} from "../lib/dns-forwarding-ruleset";
import {
  ALL_DNS_FORWARDING_RULESET_VERSIONS,
  DNS_FORWARDING_RULESET_TYPE,
} from "../lib/dns-forwarding-ruleset-schemas";

describe("DnsForwardingRuleset - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  const mockOutboundEndpointId =
    "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/test-rg/providers/Microsoft.Network/dnsResolvers/test-resolver/outboundEndpoints/test-endpoint";
  const mockResourceGroupId =
    "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/test-rg";

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure schemas are registered
    try {
      manager.registerResourceType(
        DNS_FORWARDING_RULESET_TYPE,
        ALL_DNS_FORWARDING_RULESET_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create DNS Forwarding Ruleset with automatic latest version resolution", () => {
      const props: DnsForwardingRulesetProps = {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      };

      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", props);

      expect(ruleset).toBeInstanceOf(DnsForwardingRuleset);
      expect(ruleset.resolvedApiVersion).toBe("2022-07-01");
      expect(ruleset.props).toBe(props);
    });

    it("should create DNS Forwarding Ruleset with explicit version pinning", () => {
      const props: DnsForwardingRulesetProps = {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
        apiVersion: "2022-07-01",
        tags: { environment: "test" },
      };

      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", props);

      expect(ruleset.resolvedApiVersion).toBe("2022-07-01");
      expect(ruleset.tags).toEqual({ environment: "test" });
    });

    it("should use location from props", () => {
      const props: DnsForwardingRulesetProps = {
        name: "my-ruleset",
        location: "westus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      };

      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", props);

      expect(ruleset.location).toBe("westus");
    });

    it("should create DNS Forwarding Ruleset with multiple outbound endpoints", () => {
      const props: DnsForwardingRulesetProps = {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [
          mockOutboundEndpointId,
          `${mockOutboundEndpointId}-2`,
        ],
      };

      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", props);

      expect(ruleset).toBeDefined();
      expect(ruleset.props.dnsResolverOutboundEndpointIds).toHaveLength(2);
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      expect(ruleset.resolvedApiVersion).toBe("2022-07-01");
      expect(ruleset.latestVersion()).toBe("2022-07-01");
    });

    it("should provide version configuration", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      expect(ruleset.versionConfig).toBeDefined();
      expect(ruleset.versionConfig.version).toBe("2022-07-01");
      expect(ruleset.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });

    it("should provide supported versions", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      const versions = ruleset.supportedVersions();
      expect(versions).toContain("2022-07-01");
      expect(versions.length).toBeGreaterThan(0);
    });
  });

  describe("Public Methods - DNS Forwarding Ruleset Properties", () => {
    it("should provide provisioning state", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      expect(ruleset.provisioningState).toBeDefined();
      expect(typeof ruleset.provisioningState).toBe("string");
    });

    it("should provide resource GUID", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      expect(ruleset.resourceGuid).toBeDefined();
      expect(typeof ruleset.resourceGuid).toBe("string");
    });
  });

  describe("Tag Management", () => {
    it("should allow adding tags", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
        tags: { initial: "tag" },
      });

      ruleset.addTag("newKey", "newValue");
      expect(ruleset.props.tags).toHaveProperty("newKey", "newValue");
      expect(ruleset.props.tags).toHaveProperty("initial", "tag");
    });

    it("should allow removing tags", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
        tags: { key1: "value1", key2: "value2" },
      });

      ruleset.removeTag("key1");
      expect(ruleset.props.tags).not.toHaveProperty("key1");
      expect(ruleset.props.tags).toHaveProperty("key2", "value2");
    });

    it("should handle adding tags when no initial tags exist", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      ruleset.addTag("newKey", "newValue");
      expect(ruleset.props.tags).toHaveProperty("newKey", "newValue");
    });
  });

  describe("Outputs", () => {
    it("should create all required outputs", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      expect(ruleset.idOutput).toBeDefined();
      expect(ruleset.nameOutput).toBeDefined();
      expect(ruleset.locationOutput).toBeDefined();
      expect(ruleset.tagsOutput).toBeDefined();
      expect(ruleset.provisioningStateOutput).toBeDefined();
      expect(ruleset.resourceGuidOutput).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain('"id"');
      expect(synthesized).toContain('"name"');
      expect(synthesized).toContain('"location"');
      expect(synthesized).toContain('"tags"');
      expect(synthesized).toContain('"provisioning_state"');
      expect(synthesized).toContain('"resource_guid"');
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
        ignoreChanges: ["tags"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ignore_changes");
    });

    it("should handle multiple ignore changes properties", () => {
      new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
        ignoreChanges: ["tags", "location"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new DnsForwardingRuleset(stack, "SynthTest", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should generate correct resource type in Terraform", () => {
      new DnsForwardingRuleset(stack, "SynthTest", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("dnsForwardingRulesets");
      expect(synthesized).toContain("2022-07-01");
    });

    it("should include all properties in Terraform body", () => {
      new DnsForwardingRuleset(stack, "SynthTest", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
        tags: { env: "test" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("eastus");
      expect(synthesized).toContain("env");
      expect(synthesized).toContain(mockOutboundEndpointId);
    });
  });

  describe("Resource Identification", () => {
    it("should provide resource ID", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      expect(ruleset.id).toBeDefined();
      expect(typeof ruleset.id).toBe("string");
    });

    it("should provide resource name from props when specified", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      expect(ruleset.name).toBe("my-ruleset");
    });
  });

  describe("JSII Compliance", () => {
    it("should have proper return types for all public methods", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      // All getter methods should return strings for Terraform interpolations
      expect(typeof ruleset.provisioningState).toBe("string");
      expect(typeof ruleset.resourceGuid).toBe("string");
    });

    it("should not use function types in public interface", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      // Verify methods exist and are callable
      expect(typeof ruleset.addTag).toBe("function");
      expect(typeof ruleset.removeTag).toBe("function");

      // Test that they work correctly
      ruleset.addTag("test", "value");
      expect(ruleset.props.tags).toHaveProperty("test", "value");
    });
  });

  describe("Schema Registration", () => {
    it("should register schemas successfully", () => {
      const ruleset = new DnsForwardingRuleset(stack, "TestRuleset", {
        name: "my-ruleset",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      // If the ruleset was created successfully, schemas were registered
      expect(ruleset).toBeDefined();
      expect(ruleset.resolvedApiVersion).toBe("2022-07-01");
    });

    it("should handle multiple instantiations without errors", () => {
      new DnsForwardingRuleset(stack, "TestRuleset1", {
        name: "my-ruleset-1",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      // Second instantiation should not throw an error even if schemas are already registered
      const ruleset2 = new DnsForwardingRuleset(stack, "TestRuleset2", {
        name: "my-ruleset-2",
        location: "eastus",
        resourceGroupId: mockResourceGroupId,
        dnsResolverOutboundEndpointIds: [mockOutboundEndpointId],
      });

      expect(ruleset2).toBeDefined();
    });
  });
});
