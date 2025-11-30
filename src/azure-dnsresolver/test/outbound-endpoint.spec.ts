/**
 * Comprehensive tests for the DnsResolverOutboundEndpoint implementation
 *
 * This test suite validates the DnsResolverOutboundEndpoint class using the
 * AzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation,
 * parent-child resource relationships, and full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  DnsResolverOutboundEndpoint,
  DnsResolverOutboundEndpointProps,
} from "../lib/outbound-endpoint";
import {
  ALL_DNS_RESOLVER_OUTBOUND_ENDPOINT_VERSIONS,
  DNS_RESOLVER_OUTBOUND_ENDPOINT_TYPE,
} from "../lib/outbound-endpoint-schemas";

describe("DnsResolverOutboundEndpoint - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  const mockDnsResolverId =
    "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/test-rg/providers/Microsoft.Network/dnsResolvers/test-resolver";
  const mockSubnetId =
    "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/outbound-subnet";

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure schemas are registered
    try {
      manager.registerResourceType(
        DNS_RESOLVER_OUTBOUND_ENDPOINT_TYPE,
        ALL_DNS_RESOLVER_OUTBOUND_ENDPOINT_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create Outbound Endpoint with automatic latest version resolution", () => {
      const props: DnsResolverOutboundEndpointProps = {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      };

      const endpoint = new DnsResolverOutboundEndpoint(
        stack,
        "TestEndpoint",
        props,
      );

      expect(endpoint).toBeInstanceOf(DnsResolverOutboundEndpoint);
      expect(endpoint.resolvedApiVersion).toBe("2022-07-01");
      expect(endpoint.props).toBe(props);
    });

    it("should create Outbound Endpoint with explicit version pinning", () => {
      const props: DnsResolverOutboundEndpointProps = {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
        apiVersion: "2022-07-01",
        tags: { environment: "test" },
      };

      const endpoint = new DnsResolverOutboundEndpoint(
        stack,
        "TestEndpoint",
        props,
      );

      expect(endpoint.resolvedApiVersion).toBe("2022-07-01");
      expect(endpoint.tags).toEqual({ environment: "test" });
    });

    it("should use location from props", () => {
      const props: DnsResolverOutboundEndpointProps = {
        name: "my-outbound-endpoint",
        location: "westus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      };

      const endpoint = new DnsResolverOutboundEndpoint(
        stack,
        "TestEndpoint",
        props,
      );

      expect(endpoint.location).toBe("westus");
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.resolvedApiVersion).toBe("2022-07-01");
      expect(endpoint.latestVersion()).toBe("2022-07-01");
    });

    it("should provide version configuration", () => {
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
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
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
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
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint).toBeDefined();
      expect(endpoint.props.dnsResolverId).toBe(mockDnsResolverId);
    });

    it("should correctly handle child resource in Terraform synthesis", () => {
      new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("outboundEndpoints");
      expect(synthesized).toContain(mockDnsResolverId);
    });
  });

  describe("Public Methods - Outbound Endpoint Properties", () => {
    it("should provide subnet ID", () => {
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.subnetId).toBeDefined();
      expect(typeof endpoint.subnetId).toBe("string");
    });

    it("should provide provisioning state", () => {
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.provisioningState).toBeDefined();
      expect(typeof endpoint.provisioningState).toBe("string");
    });

    it("should provide resource GUID", () => {
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.resourceGuid).toBeDefined();
      expect(typeof endpoint.resourceGuid).toBe("string");
    });
  });

  describe("Tag Management", () => {
    it("should allow adding tags", () => {
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
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
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
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
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
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
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.idOutput).toBeDefined();
      expect(endpoint.nameOutput).toBeDefined();
      expect(endpoint.locationOutput).toBeDefined();
      expect(endpoint.tagsOutput).toBeDefined();
      expect(endpoint.provisioningStateOutput).toBeDefined();
      expect(endpoint.resourceGuidOutput).toBeDefined();
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
        ignoreChanges: ["tags"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ignore_changes");
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new DnsResolverOutboundEndpoint(stack, "SynthTest", {
        name: "my-outbound-endpoint",
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
      new DnsResolverOutboundEndpoint(stack, "SynthTest", {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("outboundEndpoints");
      expect(synthesized).toContain("2022-07-01");
    });
  });

  describe("Resource Identification", () => {
    it("should provide resource ID", () => {
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.id).toBeDefined();
      expect(typeof endpoint.id).toBe("string");
    });

    it("should provide resource name from props when specified", () => {
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint.name).toBe("my-outbound-endpoint");
    });
  });

  describe("Schema Registration", () => {
    it("should register schemas successfully", () => {
      const endpoint = new DnsResolverOutboundEndpoint(stack, "TestEndpoint", {
        name: "my-outbound-endpoint",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      expect(endpoint).toBeDefined();
      expect(endpoint.resolvedApiVersion).toBe("2022-07-01");
    });

    it("should handle multiple instantiations without errors", () => {
      new DnsResolverOutboundEndpoint(stack, "TestEndpoint1", {
        name: "my-outbound-endpoint-1",
        location: "eastus",
        dnsResolverId: mockDnsResolverId,
        subnetId: mockSubnetId,
      });

      const endpoint2 = new DnsResolverOutboundEndpoint(
        stack,
        "TestEndpoint2",
        {
          name: "my-outbound-endpoint-2",
          location: "eastus",
          dnsResolverId: mockDnsResolverId,
          subnetId: mockSubnetId,
        },
      );

      expect(endpoint2).toBeDefined();
    });
  });
});
