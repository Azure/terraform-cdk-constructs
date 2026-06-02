/**
 * Unit tests for the Azure SRE Agent (Microsoft.App/agents) construct.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import { SreAgent, SreAgentProps } from "../lib/sre-agent";
import {
  ALL_SRE_AGENT_VERSIONS,
  SRE_AGENT_TYPE,
} from "../lib/sre-agent-schemas";

describe("SreAgent - Microsoft.App/agents", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  const baseProps = (
    overrides: Partial<SreAgentProps> = {},
  ): SreAgentProps => ({
    name: "my-sre-agent",
    location: "eastus",
    resourceGroupId:
      "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
    agentIdentity: {
      initialSponsorGroupId: "00000000-0000-0000-0000-000000000001",
    },
    ...overrides,
  });

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure schemas are registered (idempotent)
    try {
      manager.registerResourceType(SRE_AGENT_TYPE, ALL_SRE_AGENT_VERSIONS);
    } catch {
      // already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("creates with automatic latest version resolution", () => {
      const props = baseProps();
      const agent = new SreAgent(stack, "TestSreAgent", props);

      expect(agent).toBeInstanceOf(SreAgent);
      expect(agent.resolvedApiVersion).toBe("2026-01-01");
      expect(agent.props).toBe(props);
      expect(agent.name).toBe("my-sre-agent");
      expect(agent.location).toBe("eastus");
    });

    it("creates with explicit version pinning", () => {
      const props = baseProps({
        apiVersion: "2026-01-01",
        tags: { environment: "test" },
      });
      const agent = new SreAgent(stack, "TestSreAgent", props);

      expect(agent.resolvedApiVersion).toBe("2026-01-01");
      expect(agent.tags).toEqual({ environment: "test" });
    });

    it("requires location", () => {
      const props = {
        name: "my-sre-agent",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
      } as unknown as SreAgentProps;

      expect(() => new SreAgent(stack, "TestSreAgent", props)).toThrow(
        /Location is required/i,
      );
    });
  });

  describe("Framework Integration", () => {
    it("resolves latest API version automatically", () => {
      const agent = new SreAgent(stack, "TestSreAgent", baseProps());

      expect(agent.resolvedApiVersion).toBe("2026-01-01");
      expect(agent.latestVersion()).toBe("2026-01-01");
    });

    it("provides version configuration", () => {
      const agent = new SreAgent(stack, "TestSreAgent", baseProps());

      expect(agent.versionConfig).toBeDefined();
      expect(agent.versionConfig.version).toBe("2026-01-01");
      expect(agent.versionConfig.supportLevel).toBe(VersionSupportLevel.ACTIVE);
    });

    it("provides supported versions", () => {
      const agent = new SreAgent(stack, "TestSreAgent", baseProps());

      const versions = agent.supportedVersions();
      expect(versions).toContain("2026-01-01");
      expect(versions.length).toBeGreaterThan(0);
    });
  });

  describe("Read-only Outputs", () => {
    it("provides agentEndpoint, provisioningState and powerState", () => {
      const agent = new SreAgent(stack, "TestSreAgent", baseProps());

      expect(typeof agent.agentEndpoint).toBe("string");
      expect(typeof agent.provisioningState).toBe("string");
      expect(typeof agent.powerState).toBe("string");
      expect(agent.agentEndpoint).toContain("agentEndpoint");
      expect(agent.provisioningState).toContain("provisioningState");
      expect(agent.powerState).toContain("powerState");
    });
  });

  describe("Tag Management", () => {
    it("allows adding tags", () => {
      const agent = new SreAgent(
        stack,
        "TestSreAgent",
        baseProps({ tags: { initial: "tag" } }),
      );

      agent.addSreAgentTag("newKey", "newValue");
      expect(agent.props.tags).toHaveProperty("newKey", "newValue");
      expect(agent.props.tags).toHaveProperty("initial", "tag");
    });

    it("allows removing tags", () => {
      const agent = new SreAgent(
        stack,
        "TestSreAgent",
        baseProps({ tags: { a: "1", b: "2" } }),
      );

      agent.removeSreAgentTag("a");
      expect(agent.props.tags).not.toHaveProperty("a");
      expect(agent.props.tags).toHaveProperty("b", "2");
    });

    it("handles adding tags when no initial tags exist", () => {
      const agent = new SreAgent(stack, "TestSreAgent", baseProps());

      agent.addSreAgentTag("newKey", "newValue");
      expect(agent.props.tags).toHaveProperty("newKey", "newValue");
    });
  });

  describe("Outputs", () => {
    it("creates all required outputs", () => {
      const agent = new SreAgent(stack, "TestSreAgent", baseProps());

      expect(agent.idOutput).toBeDefined();
      expect(agent.locationOutput).toBeDefined();
      expect(agent.nameOutput).toBeDefined();
      expect(agent.tagsOutput).toBeDefined();
      expect(agent.agentEndpointOutput).toBeDefined();
      expect(agent.provisioningStateOutput).toBeDefined();
      expect(agent.powerStateOutput).toBeDefined();
    });

    it("uses expected logical IDs for outputs", () => {
      new SreAgent(stack, "TestSreAgent", baseProps());

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain('"id"');
      expect(synthesized).toContain('"location"');
      expect(synthesized).toContain('"name"');
      expect(synthesized).toContain('"tags"');
      expect(synthesized).toContain('"agent_endpoint"');
      expect(synthesized).toContain('"provisioning_state"');
      expect(synthesized).toContain('"power_state"');
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("applies ignore changes lifecycle rules", () => {
      new SreAgent(
        stack,
        "TestSreAgent",
        baseProps({ ignoreChanges: ["tags"] }),
      );

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ignore_changes");
    });
  });

  describe("CDK Terraform Integration", () => {
    it("synthesizes to valid Terraform configuration", () => {
      new SreAgent(
        stack,
        "SynthTest",
        baseProps({ tags: { test: "synthesis" } }),
      );

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
      const config = JSON.parse(synthesized);
      expect(config.resource).toBeDefined();
    });

    it("emits the correct resource type and api version", () => {
      new SreAgent(stack, "SynthTest", baseProps());

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("Microsoft.App/agents");
      expect(synthesized).toContain("2026-01-01");
    });

    it("includes provided agent configuration in the body", () => {
      new SreAgent(
        stack,
        "SynthTest",
        baseProps({
          agentSpaceId:
            "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg/providers/Microsoft.App/agentSpaces/my-space",
          identity: { type: "SystemAssigned" },
          upgradeChannel: "Stable",
          tags: { env: "test" },
        }),
      );

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("eastus");
      expect(synthesized).toContain("env");
      expect(synthesized).toContain("agentSpaceId");
      expect(synthesized).toContain("SystemAssigned");
      expect(synthesized).toContain("upgradeChannel");
      expect(synthesized).toContain("initialSponsorGroupId");
    });

    it("omits properties block when no agent properties are provided", () => {
      // baseProps includes agentIdentity, so omit it explicitly for this case
      new SreAgent(stack, "SynthTest", {
        name: "my-sre-agent",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
      });

      const synthesized = Testing.synth(stack);
      // Should still have the resource even with no body properties
      expect(synthesized).toContain("Microsoft.App/agents");
    });
  });

  describe("Resource Identification", () => {
    it("provides resource ID and name", () => {
      const agent = new SreAgent(stack, "TestSreAgent", baseProps());

      expect(agent.id).toBeDefined();
      expect(typeof agent.id).toBe("string");
      expect(agent.props.name).toBe("my-sre-agent");
    });
  });

  describe("JSII Compliance", () => {
    it("has proper return types for all public getters", () => {
      const agent = new SreAgent(stack, "TestSreAgent", baseProps());

      expect(typeof agent.agentEndpoint).toBe("string");
      expect(typeof agent.provisioningState).toBe("string");
      expect(typeof agent.powerState).toBe("string");
    });

    it("exposes tag helper methods as callable functions", () => {
      const agent = new SreAgent(stack, "TestSreAgent", baseProps());

      expect(typeof agent.addSreAgentTag).toBe("function");
      expect(typeof agent.removeSreAgentTag).toBe("function");

      agent.addSreAgentTag("test", "value");
      expect(agent.props.tags).toHaveProperty("test", "value");
    });
  });

  describe("Schema Registration", () => {
    it("handles multiple instantiations without errors", () => {
      new SreAgent(stack, "TestSreAgent1", baseProps({ name: "agent-1" }));
      const agent2 = new SreAgent(
        stack,
        "TestSreAgent2",
        baseProps({ name: "agent-2" }),
      );

      expect(agent2).toBeDefined();
      expect(agent2.resolvedApiVersion).toBe("2026-01-01");
    });
  });
});
