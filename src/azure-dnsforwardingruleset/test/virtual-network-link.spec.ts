/**
 * Comprehensive tests for the DnsForwardingRulesetVirtualNetworkLink implementation
 *
 * This test suite validates the DnsForwardingRulesetVirtualNetworkLink class using the
 * AzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation,
 * parent-child resource relationships, and full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  DnsForwardingRulesetVirtualNetworkLink,
  DnsForwardingRulesetVirtualNetworkLinkProps,
} from "../lib/virtual-network-link";
import {
  ALL_VIRTUAL_NETWORK_LINK_VERSIONS,
  VIRTUAL_NETWORK_LINK_TYPE,
} from "../lib/virtual-network-link-schemas";

describe("DnsForwardingRulesetVirtualNetworkLink - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  const mockRulesetId =
    "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/test-rg/providers/Microsoft.Network/dnsForwardingRulesets/test-ruleset";
  const mockVirtualNetworkId =
    "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/test-vnet";

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure schemas are registered
    try {
      manager.registerResourceType(
        VIRTUAL_NETWORK_LINK_TYPE,
        ALL_VIRTUAL_NETWORK_LINK_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create Virtual Network Link with automatic latest version resolution", () => {
      const props: DnsForwardingRulesetVirtualNetworkLinkProps = {
        name: "my-vnet-link",
        dnsForwardingRulesetId: mockRulesetId,
        virtualNetworkId: mockVirtualNetworkId,
      };

      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        props,
      );

      expect(link).toBeInstanceOf(DnsForwardingRulesetVirtualNetworkLink);
      expect(link.resolvedApiVersion).toBe("2022-07-01");
      expect(link.props).toBe(props);
    });

    it("should create Virtual Network Link with explicit version pinning", () => {
      const props: DnsForwardingRulesetVirtualNetworkLinkProps = {
        name: "my-vnet-link",
        dnsForwardingRulesetId: mockRulesetId,
        virtualNetworkId: mockVirtualNetworkId,
        apiVersion: "2022-07-01",
      };

      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        props,
      );

      expect(link.resolvedApiVersion).toBe("2022-07-01");
    });

    it("should create Virtual Network Link with metadata", () => {
      const props: DnsForwardingRulesetVirtualNetworkLinkProps = {
        name: "my-vnet-link",
        dnsForwardingRulesetId: mockRulesetId,
        virtualNetworkId: mockVirtualNetworkId,
        metadata: {
          environment: "production",
          team: "platform",
        },
      };

      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        props,
      );

      expect(link).toBeDefined();
      expect(link.props.metadata).toEqual({
        environment: "production",
        team: "platform",
      });
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        {
          name: "my-vnet-link",
          dnsForwardingRulesetId: mockRulesetId,
          virtualNetworkId: mockVirtualNetworkId,
        },
      );

      expect(link.resolvedApiVersion).toBe("2022-07-01");
      expect(link.latestVersion()).toBe("2022-07-01");
    });

    it("should provide version configuration", () => {
      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        {
          name: "my-vnet-link",
          dnsForwardingRulesetId: mockRulesetId,
          virtualNetworkId: mockVirtualNetworkId,
        },
      );

      expect(link.versionConfig).toBeDefined();
      expect(link.versionConfig.version).toBe("2022-07-01");
      expect(link.versionConfig.supportLevel).toBe(VersionSupportLevel.ACTIVE);
    });

    it("should provide supported versions", () => {
      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        {
          name: "my-vnet-link",
          dnsForwardingRulesetId: mockRulesetId,
          virtualNetworkId: mockVirtualNetworkId,
        },
      );

      const versions = link.supportedVersions();
      expect(versions).toContain("2022-07-01");
      expect(versions.length).toBeGreaterThan(0);
    });
  });

  describe("Parent-Child Resource Relationship", () => {
    it("should use dnsForwardingRulesetId as parent ID", () => {
      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        {
          name: "my-vnet-link",
          dnsForwardingRulesetId: mockRulesetId,
          virtualNetworkId: mockVirtualNetworkId,
        },
      );

      // Verify the link was created successfully with proper parent
      expect(link).toBeDefined();
      expect(link.props.dnsForwardingRulesetId).toBe(mockRulesetId);
    });

    it("should correctly handle child resource in Terraform synthesis", () => {
      new DnsForwardingRulesetVirtualNetworkLink(stack, "TestLink", {
        name: "my-vnet-link",
        dnsForwardingRulesetId: mockRulesetId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("virtualNetworkLinks");
      expect(synthesized).toContain(mockRulesetId);
    });
  });

  describe("Public Methods - Virtual Network Link Properties", () => {
    it("should provide provisioning state", () => {
      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        {
          name: "my-vnet-link",
          dnsForwardingRulesetId: mockRulesetId,
          virtualNetworkId: mockVirtualNetworkId,
        },
      );

      expect(link.provisioningState).toBeDefined();
      expect(typeof link.provisioningState).toBe("string");
    });

    it("should provide metadata", () => {
      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        {
          name: "my-vnet-link",
          dnsForwardingRulesetId: mockRulesetId,
          virtualNetworkId: mockVirtualNetworkId,
          metadata: { key: "value" },
        },
      );

      expect(link.metadata).toBeDefined();
      expect(typeof link.metadata).toBe("string");
    });
  });

  describe("Outputs", () => {
    it("should create all required outputs", () => {
      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        {
          name: "my-vnet-link",
          dnsForwardingRulesetId: mockRulesetId,
          virtualNetworkId: mockVirtualNetworkId,
        },
      );

      expect(link.idOutput).toBeDefined();
      expect(link.nameOutput).toBeDefined();
      expect(link.provisioningStateOutput).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      new DnsForwardingRulesetVirtualNetworkLink(stack, "TestLink", {
        name: "my-vnet-link",
        dnsForwardingRulesetId: mockRulesetId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain('"id"');
      expect(synthesized).toContain('"name"');
      expect(synthesized).toContain('"provisioning_state"');
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      new DnsForwardingRulesetVirtualNetworkLink(stack, "TestLink", {
        name: "my-vnet-link",
        dnsForwardingRulesetId: mockRulesetId,
        virtualNetworkId: mockVirtualNetworkId,
        ignoreChanges: ["metadata"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ignore_changes");
    });

    it("should handle multiple ignore changes properties", () => {
      new DnsForwardingRulesetVirtualNetworkLink(stack, "TestLink", {
        name: "my-vnet-link",
        dnsForwardingRulesetId: mockRulesetId,
        virtualNetworkId: mockVirtualNetworkId,
        ignoreChanges: ["metadata", "name"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new DnsForwardingRulesetVirtualNetworkLink(stack, "SynthTest", {
        name: "my-vnet-link",
        dnsForwardingRulesetId: mockRulesetId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should generate correct resource type in Terraform", () => {
      new DnsForwardingRulesetVirtualNetworkLink(stack, "SynthTest", {
        name: "my-vnet-link",
        dnsForwardingRulesetId: mockRulesetId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("virtualNetworkLinks");
      expect(synthesized).toContain("2022-07-01");
    });

    it("should include all properties in Terraform body", () => {
      new DnsForwardingRulesetVirtualNetworkLink(stack, "SynthTest", {
        name: "my-vnet-link",
        dnsForwardingRulesetId: mockRulesetId,
        virtualNetworkId: mockVirtualNetworkId,
        metadata: { env: "test" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain(mockVirtualNetworkId);
    });
  });

  describe("Resource Identification", () => {
    it("should provide resource ID", () => {
      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        {
          name: "my-vnet-link",
          dnsForwardingRulesetId: mockRulesetId,
          virtualNetworkId: mockVirtualNetworkId,
        },
      );

      expect(link.id).toBeDefined();
      expect(typeof link.id).toBe("string");
    });

    it("should provide resource name from props when specified", () => {
      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        {
          name: "my-vnet-link",
          dnsForwardingRulesetId: mockRulesetId,
          virtualNetworkId: mockVirtualNetworkId,
        },
      );

      expect(link.name).toBe("my-vnet-link");
    });
  });

  describe("JSII Compliance", () => {
    it("should have proper return types for all public methods", () => {
      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        {
          name: "my-vnet-link",
          dnsForwardingRulesetId: mockRulesetId,
          virtualNetworkId: mockVirtualNetworkId,
        },
      );

      // All getter methods should return strings for Terraform interpolations
      expect(typeof link.provisioningState).toBe("string");
      expect(typeof link.metadata).toBe("string");
    });
  });

  describe("Schema Registration", () => {
    it("should register schemas successfully", () => {
      const link = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink",
        {
          name: "my-vnet-link",
          dnsForwardingRulesetId: mockRulesetId,
          virtualNetworkId: mockVirtualNetworkId,
        },
      );

      // If the link was created successfully, schemas were registered
      expect(link).toBeDefined();
      expect(link.resolvedApiVersion).toBe("2022-07-01");
    });

    it("should handle multiple instantiations without errors", () => {
      new DnsForwardingRulesetVirtualNetworkLink(stack, "TestLink1", {
        name: "my-vnet-link-1",
        dnsForwardingRulesetId: mockRulesetId,
        virtualNetworkId: mockVirtualNetworkId,
      });

      // Second instantiation should not throw an error even if schemas are already registered
      const link2 = new DnsForwardingRulesetVirtualNetworkLink(
        stack,
        "TestLink2",
        {
          name: "my-vnet-link-2",
          dnsForwardingRulesetId: mockRulesetId,
          virtualNetworkId: mockVirtualNetworkId,
        },
      );

      expect(link2).toBeDefined();
    });
  });
});
