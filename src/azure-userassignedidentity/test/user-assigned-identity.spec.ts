import { Testing } from "cdktn";
import * as cdktn from "cdktn";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  UserAssignedIdentity,
  UserAssignedIdentityProps,
} from "../lib/user-assigned-identity";
import {
  ALL_USER_ASSIGNED_IDENTITY_VERSIONS,
  USER_ASSIGNED_IDENTITY_TYPE,
} from "../lib/user-assigned-identity-schemas";

describe("UserAssignedIdentity", () => {
  let app: cdktn.App;
  let stack: cdktn.TerraformStack;
  let manager: ApiVersionManager;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktn.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    try {
      manager.registerResourceType(
        USER_ASSIGNED_IDENTITY_TYPE,
        ALL_USER_ASSIGNED_IDENTITY_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create identity with automatic latest version resolution", () => {
      const props: UserAssignedIdentityProps = {
        name: "test-identity",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      const identity = new UserAssignedIdentity(stack, "TestIdentity", props);

      expect(identity).toBeInstanceOf(UserAssignedIdentity);
      expect(identity.resolvedApiVersion).toBe("2023-01-31");
      expect(identity.props).toBe(props);
      expect(identity.name).toBe("test-identity");
      expect(identity.location).toBe("eastus");
    });

    it("should create identity with explicit version pinning", () => {
      const props: UserAssignedIdentityProps = {
        name: "test-identity-pinned",
        location: "westus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2023-01-31",
        tags: { environment: "test" },
      };

      const identity = new UserAssignedIdentity(stack, "TestIdentity", props);

      expect(identity.resolvedApiVersion).toBe("2023-01-31");
      expect(identity.tags).toEqual({ environment: "test" });
    });

    it("should create identity with all optional properties", () => {
      const props: UserAssignedIdentityProps = {
        name: "test-identity-full",
        location: "centralus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        tags: {
          environment: "production",
          project: "cdktf-constructs",
          owner: "team@company.com",
        },
        enableValidation: true,
        enableMigrationAnalysis: true,
        enableTransformation: true,
      };

      const identity = new UserAssignedIdentity(stack, "TestIdentity", props);

      expect(identity.props.tags).toEqual(props.tags);
      expect(identity.props.resourceGroupId).toBe(props.resourceGroupId);
    });

    it("should use default name when name is not provided", () => {
      const props: UserAssignedIdentityProps = {
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      const identity = new UserAssignedIdentity(stack, "TestIdentity", props);

      expect(identity.name).toBe("TestIdentity");
    });

    it("should require location to be provided", () => {
      const props: UserAssignedIdentityProps = {
        name: "test-identity",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      expect(() => {
        new UserAssignedIdentity(stack, "TestIdentity", props);
      }).toThrow(
        "Location is required for Microsoft.ManagedIdentity/userAssignedIdentities",
      );
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const identity = new UserAssignedIdentity(stack, "TestIdentity", {
        name: "test-identity",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      expect(identity.resolvedApiVersion).toBe("2023-01-31");
      expect(identity.latestVersion()).toBe("2023-01-31");
    });

    it("should support all registered API versions", () => {
      const identity = new UserAssignedIdentity(stack, "TestIdentity", {
        name: "test-identity",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      const supportedVersions = identity.supportedVersions();
      expect(supportedVersions).toContain("2023-01-31");
    });

    it("should validate version support", () => {
      expect(() => {
        new UserAssignedIdentity(stack, "ValidVersion", {
          name: "test-identity",
          location: "eastus",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          apiVersion: "2023-01-31",
        });
      }).not.toThrow();

      expect(() => {
        new UserAssignedIdentity(stack, "InvalidVersion", {
          name: "test-identity",
          location: "eastus",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          apiVersion: "2024-01-01",
        });
      }).toThrow("Unsupported API version '2024-01-01'");
    });

    it("should load correct schema for resolved version", () => {
      const identity = new UserAssignedIdentity(stack, "TestIdentity", {
        name: "test-identity",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2023-01-31",
      });

      expect(identity.schema).toBeDefined();
      expect(identity.schema.resourceType).toBe(USER_ASSIGNED_IDENTITY_TYPE);
      expect(identity.schema.version).toBe("2023-01-31");
      expect(identity.schema.properties).toBeDefined();
    });

    it("should load version configuration correctly", () => {
      const identity = new UserAssignedIdentity(stack, "TestIdentity", {
        name: "test-identity",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      expect(identity.versionConfig).toBeDefined();
      expect(identity.versionConfig.version).toBe("2023-01-31");
      expect(identity.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });
  });

  describe("Property Validation", () => {
    it("should validate properties when validation is enabled", () => {
      const props: UserAssignedIdentityProps = {
        name: "test-identity",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        enableValidation: true,
      };

      expect(() => {
        new UserAssignedIdentity(stack, "TestIdentity", props);
      }).not.toThrow();
    });

    it("should skip validation when disabled", () => {
      const identity = new UserAssignedIdentity(stack, "TestIdentity", {
        name: "test-identity",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        enableValidation: false,
      });

      expect(identity).toBeDefined();
    });
  });

  describe("Migration Analysis", () => {
    it("should perform migration analysis", () => {
      const identity = new UserAssignedIdentity(stack, "TestIdentity", {
        name: "test-identity",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2023-01-31",
      });

      const analysis = identity.analyzeMigrationTo("2023-01-31");

      expect(analysis).toBeDefined();
      expect(analysis.fromVersion).toBe("2023-01-31");
      expect(analysis.toVersion).toBe("2023-01-31");
      expect(analysis.compatible).toBe(true);
    });
  });

  describe("Resource Creation and Outputs", () => {
    it("should create correct resource body", () => {
      const identity = new UserAssignedIdentity(stack, "TestIdentity", {
        name: "test-identity",
        location: "westus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        tags: { environment: "test" },
      });

      expect(identity).toBeDefined();
      expect(identity.props.tags).toEqual({ environment: "test" });
      expect(identity.props.resourceGroupId).toBe(
        "/subscriptions/test-sub/resourceGroups/test-rg",
      );
    });

    it("should create Terraform outputs", () => {
      const identity = new UserAssignedIdentity(stack, "TestIdentity", {
        name: "test-identity-outputs",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      expect(identity.idOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(identity.locationOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(identity.nameOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(identity.tagsOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(identity.clientIdOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(identity.principalIdOutput).toBeInstanceOf(cdktn.TerraformOutput);
    });

    it("should synthesize to valid Terraform configuration", () => {
      new UserAssignedIdentity(stack, "SynthTest", {
        name: "synth-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });
  });

  describe("Multiple Resources", () => {
    it("should handle multiple identities in the same stack", () => {
      const identity1 = new UserAssignedIdentity(stack, "Identity1", {
        name: "identity-1",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      const identity2 = new UserAssignedIdentity(stack, "Identity2", {
        name: "identity-2",
        location: "westus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2023-01-31",
      });

      expect(identity1.resolvedApiVersion).toBe("2023-01-31");
      expect(identity2.resolvedApiVersion).toBe("2023-01-31");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });
});
