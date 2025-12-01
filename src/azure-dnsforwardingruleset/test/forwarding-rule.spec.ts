/**
 * Comprehensive tests for the ForwardingRule implementation
 *
 * This test suite validates the ForwardingRule class using the
 * AzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation,
 * parent-child resource relationships, and full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import { ForwardingRule, ForwardingRuleProps } from "../lib/forwarding-rule";
import {
  ALL_FORWARDING_RULE_VERSIONS,
  FORWARDING_RULE_TYPE,
} from "../lib/forwarding-rule-schemas";

describe("ForwardingRule - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  const mockRulesetId =
    "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/test-rg/providers/Microsoft.Network/dnsForwardingRulesets/test-ruleset";

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure schemas are registered
    try {
      manager.registerResourceType(
        FORWARDING_RULE_TYPE,
        ALL_FORWARDING_RULE_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create Forwarding Rule with automatic latest version resolution", () => {
      const props: ForwardingRuleProps = {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4", port: 53 }],
      };

      const rule = new ForwardingRule(stack, "TestRule", props);

      expect(rule).toBeInstanceOf(ForwardingRule);
      expect(rule.resolvedApiVersion).toBe("2022-07-01");
      expect(rule.props).toBe(props);
    });

    it("should create Forwarding Rule with explicit version pinning", () => {
      const props: ForwardingRuleProps = {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
        apiVersion: "2022-07-01",
      };

      const rule = new ForwardingRule(stack, "TestRule", props);

      expect(rule.resolvedApiVersion).toBe("2022-07-01");
    });

    it("should create Forwarding Rule with multiple target DNS servers", () => {
      const props: ForwardingRuleProps = {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [
          { ipAddress: "10.0.0.4", port: 53 },
          { ipAddress: "10.0.0.5", port: 53 },
          { ipAddress: "10.0.0.6" },
        ],
      };

      const rule = new ForwardingRule(stack, "TestRule", props);

      expect(rule).toBeDefined();
      expect(rule.props.targetDnsServers).toHaveLength(3);
    });

    it("should create Forwarding Rule with forwarding rule state", () => {
      const props: ForwardingRuleProps = {
        name: "disabled-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "test.local.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
        forwardingRuleState: "Disabled",
      };

      const rule = new ForwardingRule(stack, "TestRule", props);

      expect(rule).toBeDefined();
      expect(rule.props.forwardingRuleState).toBe("Disabled");
    });

    it("should create Forwarding Rule with metadata", () => {
      const props: ForwardingRuleProps = {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
        metadata: {
          environment: "production",
          owner: "platform-team",
        },
      };

      const rule = new ForwardingRule(stack, "TestRule", props);

      expect(rule).toBeDefined();
      expect(rule.props.metadata).toEqual({
        environment: "production",
        owner: "platform-team",
      });
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      expect(rule.resolvedApiVersion).toBe("2022-07-01");
      expect(rule.latestVersion()).toBe("2022-07-01");
    });

    it("should provide version configuration", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      expect(rule.versionConfig).toBeDefined();
      expect(rule.versionConfig.version).toBe("2022-07-01");
      expect(rule.versionConfig.supportLevel).toBe(VersionSupportLevel.ACTIVE);
    });

    it("should provide supported versions", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      const versions = rule.supportedVersions();
      expect(versions).toContain("2022-07-01");
      expect(versions.length).toBeGreaterThan(0);
    });
  });

  describe("Parent-Child Resource Relationship", () => {
    it("should use dnsForwardingRulesetId as parent ID", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      // Verify the rule was created successfully with proper parent
      expect(rule).toBeDefined();
      expect(rule.props.dnsForwardingRulesetId).toBe(mockRulesetId);
    });

    it("should correctly handle child resource in Terraform synthesis", () => {
      new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("forwardingRules");
      expect(synthesized).toContain(mockRulesetId);
    });
  });

  describe("Public Methods - Forwarding Rule Properties", () => {
    it("should provide provisioning state", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      expect(rule.provisioningState).toBeDefined();
      expect(typeof rule.provisioningState).toBe("string");
    });

    it("should provide target DNS servers", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      expect(rule.targetDnsServers).toBeDefined();
      expect(typeof rule.targetDnsServers).toBe("string");
    });

    it("should provide metadata", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
        metadata: { key: "value" },
      });

      expect(rule.metadata).toBeDefined();
      expect(typeof rule.metadata).toBe("string");
    });
  });

  describe("Outputs", () => {
    it("should create all required outputs", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      expect(rule.idOutput).toBeDefined();
      expect(rule.nameOutput).toBeDefined();
      expect(rule.provisioningStateOutput).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain('"id"');
      expect(synthesized).toContain('"name"');
      expect(synthesized).toContain('"provisioning_state"');
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
        ignoreChanges: ["metadata"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ignore_changes");
    });

    it("should handle multiple ignore changes properties", () => {
      new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
        ignoreChanges: ["metadata", "forwardingRuleState"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new ForwardingRule(stack, "SynthTest", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4", port: 53 }],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should generate correct resource type in Terraform", () => {
      new ForwardingRule(stack, "SynthTest", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("forwardingRules");
      expect(synthesized).toContain("2022-07-01");
    });

    it("should include all properties in Terraform body", () => {
      new ForwardingRule(stack, "SynthTest", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [
          { ipAddress: "10.0.0.4", port: 53 },
          { ipAddress: "10.0.0.5" },
        ],
        forwardingRuleState: "Enabled",
        metadata: { env: "test" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("contoso.com.");
      expect(synthesized).toContain("10.0.0.4");
      expect(synthesized).toContain("10.0.0.5");
    });
  });

  describe("Resource Identification", () => {
    it("should provide resource ID", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      expect(rule.id).toBeDefined();
      expect(typeof rule.id).toBe("string");
    });

    it("should provide resource name from props when specified", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      expect(rule.name).toBe("contoso-rule");
    });
  });

  describe("JSII Compliance", () => {
    it("should have proper return types for all public methods", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      // All getter methods should return strings for Terraform interpolations
      expect(typeof rule.provisioningState).toBe("string");
      expect(typeof rule.targetDnsServers).toBe("string");
      expect(typeof rule.metadata).toBe("string");
    });
  });

  describe("Schema Registration", () => {
    it("should register schemas successfully", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      // If the rule was created successfully, schemas were registered
      expect(rule).toBeDefined();
      expect(rule.resolvedApiVersion).toBe("2022-07-01");
    });

    it("should handle multiple instantiations without errors", () => {
      new ForwardingRule(stack, "TestRule1", {
        name: "contoso-rule-1",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      // Second instantiation should not throw an error even if schemas are already registered
      const rule2 = new ForwardingRule(stack, "TestRule2", {
        name: "contoso-rule-2",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "internal.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.5" }],
      });

      expect(rule2).toBeDefined();
    });
  });

  describe("Target DNS Server Configuration", () => {
    it("should handle default port when not specified", () => {
      new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("10.0.0.4");
      expect(synthesized).toContain("53"); // Default port
    });

    it("should handle custom port when specified", () => {
      new ForwardingRule(stack, "TestRule", {
        name: "contoso-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4", port: 5353 }],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("10.0.0.4");
      expect(synthesized).toContain("5353");
    });
  });

  describe("Forwarding Rule State", () => {
    it("should handle enabled state", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "enabled-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
        forwardingRuleState: "Enabled",
      });

      expect(rule.props.forwardingRuleState).toBe("Enabled");
    });

    it("should handle disabled state", () => {
      const rule = new ForwardingRule(stack, "TestRule", {
        name: "disabled-rule",
        dnsForwardingRulesetId: mockRulesetId,
        domainName: "contoso.com.",
        targetDnsServers: [{ ipAddress: "10.0.0.4" }],
        forwardingRuleState: "Disabled",
      });

      expect(rule.props.forwardingRuleState).toBe("Disabled");
    });
  });
});
