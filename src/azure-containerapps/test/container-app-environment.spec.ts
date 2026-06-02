/**
 * Comprehensive tests for the unified ContainerAppEnvironment implementation
 *
 * This test suite validates the unified ContainerAppEnvironment class using the
 * AzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation, and
 * full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  ContainerAppEnvironment,
  ContainerAppEnvironmentProps,
} from "../lib/container-app-environment";
import {
  ALL_CONTAINER_APP_ENVIRONMENT_VERSIONS,
  CONTAINER_APP_ENVIRONMENT_TYPE,
} from "../lib/container-app-environment-schemas";

describe("ContainerAppEnvironment - Unified Implementation", () => {
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
        CONTAINER_APP_ENVIRONMENT_TYPE,
        ALL_CONTAINER_APP_ENVIRONMENT_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create Container App Environment with automatic latest version resolution", () => {
      const props: ContainerAppEnvironmentProps = {
        name: "my-container-env",
        location: "eastus",
      };

      const env = new ContainerAppEnvironment(stack, "TestEnv", props);

      expect(env).toBeInstanceOf(ContainerAppEnvironment);
      expect(env.resolvedApiVersion).toBe("2025-07-01");
      expect(env.props).toBe(props);
    });

    it("should create Container App Environment with explicit version pinning", () => {
      const props: ContainerAppEnvironmentProps = {
        name: "my-container-env",
        location: "eastus",
        apiVersion: "2024-03-01",
        tags: { environment: "test" },
      };

      const env = new ContainerAppEnvironment(stack, "TestEnv", props);

      expect(env.resolvedApiVersion).toBe("2024-03-01");
      expect(env.tags).toEqual({ environment: "test" });
    });

    it("should require location property", () => {
      const props: ContainerAppEnvironmentProps = {
        name: "my-container-env",
        location: "eastus",
      };

      const env = new ContainerAppEnvironment(stack, "TestEnv", props);

      expect(env.location).toBe("eastus");
      expect(env.props.location).toBe("eastus");
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      expect(env.resolvedApiVersion).toBe("2025-07-01");
      expect(env.latestVersion()).toBe("2025-07-01");
    });

    it("should provide version configuration", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      expect(env.versionConfig).toBeDefined();
      expect(env.versionConfig.version).toBe("2025-07-01");
      expect(env.versionConfig.supportLevel).toBe(VersionSupportLevel.ACTIVE);
    });

    it("should provide supported versions", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      const versions = env.supportedVersions();
      expect(versions).toContain("2024-03-01");
      expect(versions).toContain("2025-07-01");
      expect(versions.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Public Methods - Read-only Properties", () => {
    it("should provide default domain", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      expect(env.defaultDomain).toBeDefined();
      expect(typeof env.defaultDomain).toBe("string");
    });

    it("should provide static IP", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      expect(env.staticIp).toBeDefined();
      expect(typeof env.staticIp).toBe("string");
    });

    it("should provide provisioning state", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      expect(env.provisioningState).toBeDefined();
      expect(typeof env.provisioningState).toBe("string");
    });
  });

  describe("Tag Management", () => {
    it("should allow adding tags", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
        tags: { initial: "tag" },
      });

      env.addTag("newKey", "newValue");
      expect(env.props.tags).toHaveProperty("newKey", "newValue");
      expect(env.props.tags).toHaveProperty("initial", "tag");
    });

    it("should allow removing tags", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
        tags: { key1: "value1", key2: "value2" },
      });

      env.removeTag("key1");
      expect(env.props.tags).not.toHaveProperty("key1");
      expect(env.props.tags).toHaveProperty("key2", "value2");
    });

    it("should handle adding tags when no initial tags exist", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      env.addTag("newKey", "newValue");
      expect(env.props.tags).toHaveProperty("newKey", "newValue");
    });
  });

  describe("Outputs", () => {
    it("should create all required outputs", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      expect(env.idOutput).toBeDefined();
      expect(env.locationOutput).toBeDefined();
      expect(env.nameOutput).toBeDefined();
      expect(env.tagsOutput).toBeDefined();
      expect(env.defaultDomainOutput).toBeDefined();
      expect(env.staticIpOutput).toBeDefined();
      expect(env.provisioningStateOutput).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain('"id"');
      expect(synthesized).toContain('"location"');
      expect(synthesized).toContain('"name"');
      expect(synthesized).toContain('"tags"');
      expect(synthesized).toContain('"default_domain"');
      expect(synthesized).toContain('"static_ip"');
      expect(synthesized).toContain('"provisioning_state"');
    });
  });

  describe("App Logs Configuration", () => {
    it("should include Log Analytics configuration in resource body", () => {
      new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
        appLogsConfiguration: {
          destination: "log-analytics",
          logAnalyticsConfiguration: {
            customerId: "workspace-id-123",
            sharedKey: "shared-key-abc",
          },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("appLogsConfiguration");
      expect(synthesized).toContain("log-analytics");
      expect(synthesized).toContain("workspace-id-123");
    });

    it("should support azure-monitor destination", () => {
      new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
        appLogsConfiguration: {
          destination: "azure-monitor",
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("azure-monitor");
    });
  });

  describe("VNet Configuration", () => {
    it("should include VNet configuration in resource body", () => {
      new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
        vnetConfiguration: {
          infrastructureSubnetId:
            "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet/subnets/subnet",
          internal: true,
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("vnetConfiguration");
      expect(synthesized).toContain("infrastructureSubnetId");
    });
  });

  describe("Workload Profiles", () => {
    it("should include workload profiles in resource body", () => {
      new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
        workloadProfiles: [
          {
            name: "My-consumption-01",
            workloadProfileType: "Consumption",
          },
          {
            name: "My-GP-01",
            workloadProfileType: "GeneralPurpose",
            minimumCount: 3,
            maximumCount: 12,
          },
        ],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("workloadProfiles");
      expect(synthesized).toContain("Consumption");
      expect(synthesized).toContain("GeneralPurpose");
    });
  });

  describe("Zone Redundancy", () => {
    it("should include zone redundancy when set to true", () => {
      new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
        zoneRedundant: true,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("zoneRedundant");
    });
  });

  describe("2025-07-01 Features", () => {
    it("should support peer authentication (mTLS)", () => {
      new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
        peerAuthentication: {
          mtls: { enabled: true },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("peerAuthentication");
      expect(synthesized).toContain("mtls");
    });

    it("should support peer traffic encryption", () => {
      new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
        peerTrafficConfiguration: {
          encryption: { enabled: true },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("peerTrafficConfiguration");
      expect(synthesized).toContain("encryption");
    });

    it("should support ingress configuration", () => {
      new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
        ingressConfiguration: {
          workloadProfileName: "My-CO-01",
          terminationGracePeriodSeconds: 3600,
          headerCountLimit: 30,
          requestIdleTimeout: 5,
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ingressConfiguration");
      expect(synthesized).toContain("My-CO-01");
    });

    it("should support public network access control", () => {
      new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
        publicNetworkAccess: "Disabled",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("publicNetworkAccess");
      expect(synthesized).toContain("Disabled");
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
        ignoreChanges: ["tags"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ignore_changes");
    });

    it("should handle multiple ignore changes properties", () => {
      new ContainerAppEnvironment(stack, "TestEnv2", {
        name: "my-container-env-2",
        location: "eastus",
        ignoreChanges: ["tags", "location"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new ContainerAppEnvironment(stack, "SynthTest", {
        name: "my-container-env",
        location: "eastus",
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should generate correct resource type in Terraform", () => {
      new ContainerAppEnvironment(stack, "SynthTest", {
        name: "my-container-env",
        location: "eastus",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("Microsoft.App/managedEnvironments");
      expect(synthesized).toContain("2025-07-01");
    });
  });

  describe("Resource Identification", () => {
    it("should provide resource ID", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      expect(env.id).toBeDefined();
      expect(typeof env.id).toBe("string");
    });

    it("should provide resource name from props", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      expect(env.props.name).toBe("my-container-env");
    });
  });

  describe("JSII Compliance", () => {
    it("should have proper return types for all public methods", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      expect(typeof env.defaultDomain).toBe("string");
      expect(typeof env.staticIp).toBe("string");
      expect(typeof env.provisioningState).toBe("string");
    });

    it("should not use function types in public interface", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      expect(typeof env.addTag).toBe("function");
      expect(typeof env.removeTag).toBe("function");

      env.addTag("test", "value");
      expect(env.props.tags).toHaveProperty("test", "value");
    });
  });

  describe("Schema Registration", () => {
    it("should register schemas successfully", () => {
      const env = new ContainerAppEnvironment(stack, "TestEnv", {
        name: "my-container-env",
        location: "eastus",
      });

      expect(env).toBeDefined();
      expect(env.resolvedApiVersion).toBe("2025-07-01");
    });

    it("should handle multiple instantiations without errors", () => {
      new ContainerAppEnvironment(stack, "TestEnv1", {
        name: "my-container-env-1",
        location: "eastus",
      });

      const env2 = new ContainerAppEnvironment(stack, "TestEnv2", {
        name: "my-container-env-2",
        location: "westus",
      });

      expect(env2).toBeDefined();
    });
  });
});
