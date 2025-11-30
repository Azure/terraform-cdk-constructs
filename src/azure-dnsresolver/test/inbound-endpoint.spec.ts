/**
 * Comprehensive tests for the DnsResolverInboundEndpoint implementation
 *
 * This test suite validates the DnsResolverInboundEndpoint class using the
 * AzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation,
 * parent-child resource relationships, and full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  DnsResolverInboundEndpoint,
  DnsResolverInboundEndpointProps,
} from "../lib/inbound-endpoint";
import {
  ALL_DNS_RESOLVER_INBOUND_ENDPOINT_VERSIONS,
  DNS_RESOLVER_INBOUND_ENDPOINT_TYPE,
} from "../lib/inbound-endpoint-schemas";

describe("DnsResolverInboundEndpoint - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  const mockDnsResolverId =
    "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/test-rg/providers/Microsoft.Network/dnsResolvers/test-resolver";
  const mockSubnetId =
    "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/inbound-subnet";

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure schemas are registered
    try {
      manager.registerResourceType(
        DNS_RESOLVER_INBOUND_ENDPOINT_TYPE,
        ALL_DNS_RESOLVER_INBOUND_ENDPOINT_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create Inbound Endpoint with automatic latest version resolution", () => {
      const props: DnsResolverInboundEndpointProps = {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      };

      const endpoint = new DnsResolverInboundEndpoint(
        stack,
        "TestEndpoint",
        props,
      );

      expect(endpoint).toBeInstanceOf(DnsResolverInboundEndpoint);
      expect(endpoint.resolvedApiVersion).toBe("2022-07-01");
      expect(endpoint.props).toBe(props);
    });

    it("should create Inbound Endpoint with explicit version pinning", () => {
      const props: DnsResolverInboundEndpointProps = {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
        apiVersion: "2022-07-01",
        tags: { environment: "test" },
      };

      const endpoint = new DnsResolverInboundEndpoint(
        stack,
        "TestEndpoint",
        props,
      );

      expect(endpoint.resolvedApiVersion).toBe("2022-07-01");
      expect(endpoint.tags).toEqual({ environment: "test" });
    });

    it("should use location from props", () => {
      const props: DnsResolverInboundEndpointProps = {
        name: "my-inbound-endpoint",
        location: "westus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      };

      const endpoint = new DnsResolverInboundEndpoint(
        stack,
        "TestEndpoint",
        props,
      );

      expect(endpoint.location).toBe("westus");
    });

    it("should create Inbound Endpoint with static IP address", () => {
      const props: DnsResolverInboundEndpointProps = {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
        privateIpAddress: "10.0.1.4",
        privateIpAllocationMethod: "Static",
      };

      const endpoint = new DnsResolverInboundEndpoint(
        stack,
        "TestEndpoint",
        props,
      );

      expect(endpoint).toBeDefined();
      expect(endpoint.props.privateIpAddress).toBe("10.0.1.4");
      expect(endpoint.props.privateIpAllocationMethod).toBe("Static");
    });

    it("should create Inbound Endpoint with dynamic IP allocation", () => {
      const props: DnsResolverInboundEndpointProps = {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
        privateIpAllocationMethod: "Dynamic",
      };

      const endpoint = new DnsResolverInboundEndpoint(
        stack,
        "TestEndpoint",
        props,
      );

      expect(endpoint).toBeDefined();
      expect(endpoint.props.privateIpAllocationMethod).toBe("Dynamic");
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.resolvedApiVersion).toBe("2022-07-01");
      expect(endpoint.latestVersion()).toBe("2022-07-01");
    });

    it("should provide version configuration", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.versionConfig).toBeDefined();
      expect(endpoint.versionConfig.version).toBe("2022-07-01");
      expect(endpoint.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });

    it("should provide supported versions", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      const versions = endpoint.supportedVersions();
      expect(versions).toContain("2022-07-01");
      expect(versions.length).toBeGreaterThan(0);
    });
  });

  describe("Parent-Child Resource Relationship", () => {
    it("should use dnsResolverId as parent ID", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      // Verify the endpoint was created successfully with proper parent
      expect(endpoint).toBeDefined();
      expect(endpoint.props.dnsResolverId).toBe(mockDnsResolverId);
    });

    it("should correctly handle child resource in Terraform synthesis", () => {
      new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("inboundEndpoints");
      expect(synthesized).toContain(mockDnsResolverId);
    });
  });

  describe("Public Methods - Inbound Endpoint Properties", () => {
    it("should provide subnet ID", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.subnetId).toBeDefined();
      expect(typeof endpoint.subnetId).toBe("string");
    });

    it("should provide private IP address", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
        privateIpAddress: "10.0.1.4",
      });

      expect(endpoint.privateIpAddress).toBeDefined();
      expect(typeof endpoint.privateIpAddress).toBe("string");
    });

    it("should provide provisioning state", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.provisioningState).toBeDefined();
      expect(typeof endpoint.provisioningState).toBe("string");
    });
  });

  describe("Tag Management", () => {
    it("should allow adding tags", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
        tags: { initial: "tag" },
      });

      endpoint.addTag("newKey", "newValue");
      expect(endpoint.props.tags).toHaveProperty("newKey", "newValue");
      expect(endpoint.props.tags).toHaveProperty("initial", "tag");
    });

    it("should allow removing tags", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
        tags: { key1: "value1", key2: "value2" },
      });

      endpoint.removeTag("key1");
      expect(endpoint.props.tags).not.toHaveProperty("key1");
      expect(endpoint.props.tags).toHaveProperty("key2", "value2");
    });

    it("should handle adding tags when no initial tags exist", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      endpoint.addTag("newKey", "newValue");
      expect(endpoint.props.tags).toHaveProperty("newKey", "newValue");
    });
  });

  describe("Outputs", () => {
    it("should create all required outputs", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.idOutput).toBeDefined();
      expect(endpoint.nameOutput).toBeDefined();
      expect(endpoint.locationOutput).toBeDefined();
      expect(endpoint.tagsOutput).toBeDefined();
      expect(endpoint.provisioningStateOutput).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain('"id"');
      expect(synthesized).toContain('"name"');
      expect(synthesized).toContain('"location"');
      expect(synthesized).toContain('"tags"');
      expect(synthesized).toContain('"provisioning_state"');
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
        ignoreChanges: ["tags"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ignore_changes");
    });

    it("should handle multiple ignore changes properties", () => {
      new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
        ignoreChanges: ["tags", "location"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new DnsResolverInboundEndpoint(stack, "SynthTest", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should generate correct resource type in Terraform", () => {
      new DnsResolverInboundEndpoint(stack, "SynthTest", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("inboundEndpoints");
      expect(synthesized).toContain("2022-07-01");
    });

    it("should include all properties in Terraform body", () => {
      new DnsResolverInboundEndpoint(stack, "SynthTest", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
        privateIpAddress: "10.0.1.4",
        privateIpAllocationMethod: "Static",
        tags: { env: "test" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("eastus");
      expect(synthesized).toContain("env");
      expect(synthesized).toContain(mockSubnetId);
    });
  });

  describe("Resource Identification", () => {
    it("should provide resource ID", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.id).toBeDefined();
      expect(typeof endpoint.id).toBe("string");
    });

    it("should provide resource name from construct id when name not in props", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.name).toBe("TestEndpoint");
    });

    it("should provide resource name from props when specified", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.name).toBe("my-inbound-endpoint");
    });
  });

  describe("JSII Compliance", () => {
    it("should have proper return types for all public methods", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      // All getter methods should return strings for Terraform interpolations
      expect(typeof endpoint.subnetId).toBe("string");
      expect(typeof endpoint.privateIpAddress).toBe("string");
      expect(typeof endpoint.provisioningState).toBe("string");
    });

    it("should not use function types in public interface", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      // Verify methods exist and are callable
      expect(typeof endpoint.addTag).toBe("function");
      expect(typeof endpoint.removeTag).toBe("function");

      // Test that they work correctly
      endpoint.addTag("test", "value");
      expect(endpoint.props.tags).toHaveProperty("test", "value");
    });
  });

  describe("Schema Registration", () => {
    it("should register schemas successfully", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      // If the endpoint was created successfully, schemas were registered
      expect(endpoint).toBeDefined();
      expect(endpoint.resolvedApiVersion).toBe("2022-07-01");
    });

    it("should handle multiple instantiations without errors", () => {
      new DnsResolverInboundEndpoint(stack, "TestEndpoint1", {
        name: "my-inbound-endpoint-1",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      // Second instantiation should not throw an error even if schemas are already registered
      const endpoint2 = new DnsResolverInboundEndpoint(stack, "TestEndpoint2", {
        name: "my-inbound-endpoint-2",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint2).toBeDefined();
    });
  });

  describe("Property Validation", () => {
    it("should handle static IP allocation correctly", () => {
      const endpointStatic = new DnsResolverInboundEndpoint(
        stack,
        "TestEndpointStatic",
        {
          name: "my-inbound-endpoint-static",
          location: "eastus",
          dnsResolverId: mockDnsResolverId,
          subnetId: mockSubnetId,
          privateIpAddress: "10.0.1.4",
          privateIpAllocationMethod: "Static",
        },
      );

      expect(endpointStatic.props.privateIpAddress).toBe("10.0.1.4");
      expect(endpointStatic.props.privateIpAllocationMethod).toBe("Static");
    });

    it("should handle dynamic IP allocation correctly", () => {
      const endpointDynamic = new DnsResolverInboundEndpoint(
        stack,
        "TestEndpointDynamic",
        {
          name: "my-inbound-endpoint-dynamic",
          location: "eastus",
          dnsResolverId: mockDnsResolverId,
          subnetId: mockSubnetId,
          privateIpAllocationMethod: "Dynamic",
        },
      );

      expect(endpointDynamic.props.privateIpAllocationMethod).toBe("Dynamic");
      expect(endpointDynamic.props.privateIpAddress).toBeUndefined();
    });

    it("should handle IP allocation without explicit method", () => {
      const endpoint = new DnsResolverInboundEndpoint(stack, "TestEndpoint", {
        name: "my-inbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      // Should default to dynamic when not specified
      expect(endpoint.props.privateIpAllocationMethod).toBeUndefined();
    });
  });
});
