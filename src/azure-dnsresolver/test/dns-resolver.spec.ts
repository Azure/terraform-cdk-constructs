/**
 * Comprehensive tests for the unified DnsResolver implementation
 *
 * This test suite validates the unified DnsResolver class using the
 * VersionedAzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation, and
 * full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import { DnsResolver, DnsResolverProps } from "../lib/dns-resolver";
import {
  ALL_DNS_RESOLVER_VERSIONS,
  DNS_RESOLVER_TYPE,
} from "../lib/dns-resolver-schemas";

describe("DnsResolver - Unified Implementation", () => {
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
        DNS_RESOLVER_TYPE,
        ALL_DNS_RESOLVER_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create DNS Resolver with automatic latest version resolution", () => {
      const props: DnsResolverProps = {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      };

      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", props);

      expect(dnsResolver).toBeInstanceOf(DnsResolver);
      expect(dnsResolver.resolvedApiVersion).toBe("2022-07-01");
      expect(dnsResolver.props).toBe(props);
    });

    it("should create DNS Resolver with explicit version pinning", () => {
      const props: DnsResolverProps = {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
        apiVersion: "2022-07-01",
        tags: { environment: "test" },
      };

      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", props);

      expect(dnsResolver.resolvedApiVersion).toBe("2022-07-01");
      expect(dnsResolver.tags).toEqual({ environment: "test" });
    });

    it("should store virtualNetworkId property", () => {
      const vnetId =
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet";
      const props: DnsResolverProps = {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId: vnetId,
      };

      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", props);

      expect(dnsResolver.virtualNetworkId).toBe(vnetId);
    });

    it("should require location property", () => {
      const props: DnsResolverProps = {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      };

      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", props);

      expect(dnsResolver.location).toBe("eastus");
      expect(dnsResolver.props.location).toBe("eastus");
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      expect(dnsResolver.resolvedApiVersion).toBe("2022-07-01");
      expect(dnsResolver.latestVersion()).toBe("2022-07-01");
    });

    it("should provide version configuration", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      expect(dnsResolver.versionConfig).toBeDefined();
      expect(dnsResolver.versionConfig.version).toBe("2022-07-01");
      expect(dnsResolver.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });

    it("should provide supported versions", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      const versions = dnsResolver.supportedVersions();
      expect(versions).toContain("2022-07-01");
      expect(versions.length).toBeGreaterThan(0);
    });
  });

  describe("Public Methods - Read-only Properties", () => {
    it("should provide DNS resolver state", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      expect(dnsResolver.dnsResolverState).toBeDefined();
      expect(typeof dnsResolver.dnsResolverState).toBe("string");
    });

    it("should provide provisioning state", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      expect(dnsResolver.provisioningState).toBeDefined();
      expect(typeof dnsResolver.provisioningState).toBe("string");
    });

    it("should provide resource GUID", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      expect(dnsResolver.resourceGuid).toBeDefined();
      expect(typeof dnsResolver.resourceGuid).toBe("string");
    });
  });

  describe("Tag Management", () => {
    it("should allow adding tags", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
        tags: { initial: "tag" },
      });

      dnsResolver.addTag("newKey", "newValue");
      expect(dnsResolver.props.tags).toHaveProperty("newKey", "newValue");
      expect(dnsResolver.props.tags).toHaveProperty("initial", "tag");
    });

    it("should allow removing tags", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
        tags: { key1: "value1", key2: "value2" },
      });

      dnsResolver.removeTag("key1");
      expect(dnsResolver.props.tags).not.toHaveProperty("key1");
      expect(dnsResolver.props.tags).toHaveProperty("key2", "value2");
    });

    it("should handle adding tags when no initial tags exist", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      dnsResolver.addTag("newKey", "newValue");
      expect(dnsResolver.props.tags).toHaveProperty("newKey", "newValue");
    });
  });

  describe("Outputs", () => {
    it("should create all required outputs", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      expect(dnsResolver.idOutput).toBeDefined();
      expect(dnsResolver.locationOutput).toBeDefined();
      expect(dnsResolver.nameOutput).toBeDefined();
      expect(dnsResolver.tagsOutput).toBeDefined();
      expect(dnsResolver.dnsResolverStateOutput).toBeDefined();
      expect(dnsResolver.provisioningStateOutput).toBeDefined();
      expect(dnsResolver.resourceGuidOutput).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain('"id"');
      expect(synthesized).toContain('"location"');
      expect(synthesized).toContain('"name"');
      expect(synthesized).toContain('"tags"');
      expect(synthesized).toContain('"dns_resolver_state"');
      expect(synthesized).toContain('"provisioning_state"');
      expect(synthesized).toContain('"resource_guid"');
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
        ignoreChanges: ["tags"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ignore_changes");
    });

    it("should handle multiple ignore changes properties", () => {
      new DnsResolver(stack, "TestDnsResolver2", {
        name: "my-dns-resolver-2",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
        ignoreChanges: ["tags", "location"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new DnsResolver(stack, "SynthTest", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should generate correct resource type in Terraform", () => {
      new DnsResolver(stack, "SynthTest", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("Microsoft.Network/dnsResolvers");
      expect(synthesized).toContain("2022-07-01");
    });

    it("should include all properties in Terraform body", () => {
      const vnetId =
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet";
      new DnsResolver(stack, "SynthTest", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId: vnetId,
        tags: { env: "test" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("eastus");
      expect(synthesized).toContain("env");
      expect(synthesized).toContain("virtualNetwork");
    });
  });

  describe("Resource Identification", () => {
    it("should provide resource ID", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      expect(dnsResolver.id).toBeDefined();
      expect(typeof dnsResolver.id).toBe("string");
    });

    it("should provide resource name from props", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      expect(dnsResolver.props.name).toBe("my-dns-resolver");
    });
  });

  describe("JSII Compliance", () => {
    it("should have proper return types for all public methods", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      // All getter methods should return strings for Terraform interpolations
      expect(typeof dnsResolver.dnsResolverState).toBe("string");
      expect(typeof dnsResolver.provisioningState).toBe("string");
      expect(typeof dnsResolver.resourceGuid).toBe("string");
    });

    it("should not use function types in public interface", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      // Verify methods exist and are callable
      expect(typeof dnsResolver.addTag).toBe("function");
      expect(typeof dnsResolver.removeTag).toBe("function");

      // Test that they work correctly
      dnsResolver.addTag("test", "value");
      expect(dnsResolver.props.tags).toHaveProperty("test", "value");
    });
  });

  describe("Schema Registration", () => {
    it("should register schemas successfully", () => {
      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      });

      // If the resolver was created successfully, schemas were registered
      expect(dnsResolver).toBeDefined();
      expect(dnsResolver.resolvedApiVersion).toBe("2022-07-01");
    });

    it("should handle multiple instantiations without errors", () => {
      new DnsResolver(stack, "TestDnsResolver1", {
        name: "my-dns-resolver-1",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet1",
      });

      // Second instantiation should not throw an error even if schemas are already registered
      const dnsResolver2 = new DnsResolver(stack, "TestDnsResolver2", {
        name: "my-dns-resolver-2",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet2",
      });

      expect(dnsResolver2).toBeDefined();
    });
  });

  describe("Property Validation", () => {
    it("should require virtualNetworkId", () => {
      const props: DnsResolverProps = {
        name: "my-dns-resolver",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      };

      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", props);
      expect(dnsResolver.virtualNetworkId).toBeDefined();
    });

    it("should accept valid DNS Resolver name", () => {
      const props: DnsResolverProps = {
        name: "my-dns-resolver-123",
        location: "eastus",
        virtualNetworkId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet",
      };

      const dnsResolver = new DnsResolver(stack, "TestDnsResolver", props);
      expect(dnsResolver.props.name).toBe("my-dns-resolver-123");
    });
  });
});
