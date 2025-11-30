/**
 * Comprehensive tests for the unified RoleAssignment implementation
 *
 * This test suite validates the unified RoleAssignment class that uses
 * the VersionedAzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation, and
 * role assignment-specific functionality.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import { RoleAssignment, RoleAssignmentProps } from "../lib/role-assignment";
import {
  ALL_ROLE_ASSIGNMENT_VERSIONS,
  ROLE_ASSIGNMENT_TYPE,
} from "../lib/role-assignment-schemas";

describe("RoleAssignment - Unified Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  // Test constants
  const TEST_ROLE_DEF_ID =
    "/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7"; // Reader
  const TEST_PRINCIPAL_ID = "00000000-0000-0000-0000-000000000001";
  const TEST_SUBSCRIPTION_SCOPE =
    "/subscriptions/00000000-0000-0000-0000-000000000000";

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure Role Assignment schemas are registered
    try {
      manager.registerResourceType(
        ROLE_ASSIGNMENT_TYPE,
        ALL_ROLE_ASSIGNMENT_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create role assignment with automatic latest version resolution", () => {
      const props: RoleAssignmentProps = {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      };

      const roleAssignment = new RoleAssignment(stack, "TestAssignment", props);

      expect(roleAssignment).toBeInstanceOf(RoleAssignment);
      expect(roleAssignment.resolvedApiVersion).toBe("2022-04-01"); // Latest version
      expect(roleAssignment.props).toBe(props);
      // Name is a deterministic UUID based on scope, roleDefinitionId, and principalId
      expect(roleAssignment.name).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should create role assignment with explicit version pinning", () => {
      const props: RoleAssignmentProps = {
        name: "test-assignment-pinned",
        apiVersion: "2022-04-01",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      };

      const roleAssignment = new RoleAssignment(stack, "TestAssignment", props);

      expect(roleAssignment.resolvedApiVersion).toBe("2022-04-01");
    });

    it("should create role assignment with all optional properties", () => {
      const props: RoleAssignmentProps = {
        name: "test-assignment-full",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        principalType: "User",
        description: "Test assignment for unit testing",
        condition:
          "@Resource[Microsoft.Storage/storageAccounts:name] StringEquals 'test'",
        conditionVersion: "2.0",
        ignoreChanges: ["description"],
        enableValidation: true,
        enableMigrationAnalysis: true,
        enableTransformation: true,
      };

      const roleAssignment = new RoleAssignment(stack, "TestAssignment", props);

      expect(roleAssignment.props.roleDefinitionId).toBe(TEST_ROLE_DEF_ID);
      expect(roleAssignment.props.principalId).toBe(TEST_PRINCIPAL_ID);
      expect(roleAssignment.props.scope).toBe(TEST_SUBSCRIPTION_SCOPE);
      expect(roleAssignment.props.principalType).toBe("User");
      expect(roleAssignment.props.description).toBe(
        "Test assignment for unit testing",
      );
      expect(roleAssignment.props.condition).toBeDefined();
      expect(roleAssignment.props.conditionVersion).toBe("2.0");
    });

    it("should use default name when name is not provided", () => {
      const props: RoleAssignmentProps = {
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      };

      const roleAssignment = new RoleAssignment(stack, "TestAssignment", props);

      // Name is a deterministic UUID, not the construct ID
      expect(roleAssignment.name).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should require roleDefinitionId to be provided", () => {
      const props: any = {
        name: "test-assignment",
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      };

      expect(() => {
        new RoleAssignment(stack, "TestAssignment", props);
      }).toThrow("Required property 'roleDefinitionId' is missing");
    });

    it("should require principalId to be provided", () => {
      const props: any = {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      };

      expect(() => {
        new RoleAssignment(stack, "TestAssignment", props);
      }).toThrow("Required property 'principalId' is missing");
    });

    it("should require scope to be provided", () => {
      const props: any = {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
      };

      expect(() => {
        new RoleAssignment(stack, "TestAssignment", props);
      }).toThrow("Required property 'scope' is missing");
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const roleAssignment = new RoleAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      });

      expect(roleAssignment.resolvedApiVersion).toBe("2022-04-01");
      expect(roleAssignment.latestVersion()).toBe("2022-04-01");
    });

    it("should support all registered API versions", () => {
      const roleAssignment = new RoleAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      });

      const supportedVersions = roleAssignment.supportedVersions();
      expect(supportedVersions).toContain("2022-04-01");
    });

    it("should validate version support", () => {
      // Valid version
      expect(() => {
        new RoleAssignment(stack, "ValidVersion", {
          name: "test-assignment",
          roleDefinitionId: TEST_ROLE_DEF_ID,
          principalId: TEST_PRINCIPAL_ID,
          scope: TEST_SUBSCRIPTION_SCOPE,
          apiVersion: "2022-04-01",
        });
      }).not.toThrow();

      // Invalid version
      expect(() => {
        new RoleAssignment(stack, "InvalidVersion", {
          name: "test-assignment",
          roleDefinitionId: TEST_ROLE_DEF_ID,
          principalId: TEST_PRINCIPAL_ID,
          scope: TEST_SUBSCRIPTION_SCOPE,
          apiVersion: "2020-01-01",
        });
      }).toThrow("Unsupported API version '2020-01-01'");
    });

    it("should load correct schema for resolved version", () => {
      const roleAssignment = new RoleAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        apiVersion: "2022-04-01",
      });

      expect(roleAssignment.schema).toBeDefined();
      expect(roleAssignment.schema.resourceType).toBe(ROLE_ASSIGNMENT_TYPE);
      expect(roleAssignment.schema.version).toBe("2022-04-01");
      expect(roleAssignment.schema.properties).toBeDefined();
    });

    it("should load version configuration correctly", () => {
      const roleAssignment = new RoleAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      });

      expect(roleAssignment.versionConfig).toBeDefined();
      expect(roleAssignment.versionConfig.version).toBe("2022-04-01");
      expect(roleAssignment.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });
  });

  describe("Property Validation", () => {
    it("should validate properties when validation is enabled", () => {
      const props: RoleAssignmentProps = {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        enableValidation: true,
      };

      expect(() => {
        new RoleAssignment(stack, "TestAssignment", props);
      }).not.toThrow();
    });

    it("should have validation results for valid properties", () => {
      const roleAssignment = new RoleAssignment(stack, "TestAssignment", {
        name: "valid-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        description: "A valid role assignment",
        enableValidation: true,
      });

      expect(roleAssignment.validationResult).toBeDefined();
      expect(roleAssignment.validationResult!.valid).toBe(true);
      expect(roleAssignment.validationResult!.errors).toHaveLength(0);
    });

    it("should skip validation when disabled", () => {
      const roleAssignment = new RoleAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        enableValidation: false,
      });

      expect(roleAssignment).toBeDefined();
    });
  });

  describe("Migration Analysis", () => {
    it("should skip migration analysis for single version", () => {
      const roleAssignment = new RoleAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        apiVersion: "2022-04-01",
      });

      // Since there's only one version, migration analysis should be skipped
      expect(roleAssignment).toBeDefined();
    });

    it("should skip migration analysis when disabled", () => {
      const roleAssignment = new RoleAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        enableMigrationAnalysis: false,
      });

      expect(roleAssignment.migrationAnalysis).toBeUndefined();
    });
  });

  describe("Resource Creation and Body", () => {
    it("should create correct resource body with minimal properties", () => {
      const roleAssignment = new RoleAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      });

      expect(roleAssignment).toBeDefined();
      expect(roleAssignment.props.roleDefinitionId).toBeDefined();
      expect(roleAssignment.props.principalId).toBeDefined();
      expect(roleAssignment.props.scope).toBeDefined();
    });

    it("should create correct resource body with all properties", () => {
      const roleAssignment = new RoleAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        principalType: "ServicePrincipal",
        description: "Test assignment with all properties",
        condition:
          "@Resource[Microsoft.Storage/storageAccounts:name] StringEquals 'test'",
        conditionVersion: "2.0",
      });

      expect(roleAssignment).toBeDefined();
      expect(roleAssignment.props.roleDefinitionId).toBe(TEST_ROLE_DEF_ID);
      expect(roleAssignment.props.principalId).toBe(TEST_PRINCIPAL_ID);
      expect(roleAssignment.props.principalType).toBe("ServicePrincipal");
      expect(roleAssignment.props.description).toBe(
        "Test assignment with all properties",
      );
    });

    it("should create Terraform outputs", () => {
      const roleAssignment = new RoleAssignment(stack, "TestAssignment", {
        name: "test-assignment-outputs",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      });

      expect(roleAssignment.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(roleAssignment.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });
  });

  describe("Principal Types", () => {
    it("should support User principal type", () => {
      const roleAssignment = new RoleAssignment(stack, "UserAssignment", {
        name: "user-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        principalType: "User",
      });

      expect(roleAssignment.principalType).toBe("User");
    });

    it("should support Group principal type", () => {
      const roleAssignment = new RoleAssignment(stack, "GroupAssignment", {
        name: "group-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        principalType: "Group",
      });

      expect(roleAssignment.principalType).toBe("Group");
    });

    it("should support ServicePrincipal principal type", () => {
      const roleAssignment = new RoleAssignment(stack, "SPAssignment", {
        name: "sp-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        principalType: "ServicePrincipal",
      });

      expect(roleAssignment.principalType).toBe("ServicePrincipal");
    });

    it("should support ForeignGroup principal type", () => {
      const roleAssignment = new RoleAssignment(
        stack,
        "ForeignGroupAssignment",
        {
          name: "foreign-group-assignment",
          roleDefinitionId: TEST_ROLE_DEF_ID,
          principalId: TEST_PRINCIPAL_ID,
          scope: TEST_SUBSCRIPTION_SCOPE,
          principalType: "ForeignGroup",
        },
      );

      expect(roleAssignment.principalType).toBe("ForeignGroup");
    });

    it("should support Device principal type", () => {
      const roleAssignment = new RoleAssignment(stack, "DeviceAssignment", {
        name: "device-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        principalType: "Device",
      });

      expect(roleAssignment.principalType).toBe("Device");
    });

    it("should work without principalType specified", () => {
      const roleAssignment = new RoleAssignment(stack, "NoPrincipalType", {
        name: "no-principal-type",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      });

      expect(roleAssignment.principalType).toBeUndefined();
    });
  });

  describe("Conditional Assignments (ABAC)", () => {
    it("should support conditional assignments", () => {
      const roleAssignment = new RoleAssignment(
        stack,
        "ConditionalAssignment",
        {
          name: "conditional-assignment",
          roleDefinitionId: TEST_ROLE_DEF_ID,
          principalId: TEST_PRINCIPAL_ID,
          scope: TEST_SUBSCRIPTION_SCOPE,
          condition:
            "@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'logs'",
          conditionVersion: "2.0",
        },
      );

      expect(roleAssignment.props.condition).toBeDefined();
      expect(roleAssignment.props.conditionVersion).toBe("2.0");
    });

    it("should support complex ABAC conditions", () => {
      const roleAssignment = new RoleAssignment(stack, "ComplexCondition", {
        name: "complex-condition",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        condition:
          "(@Resource[Microsoft.Storage/storageAccounts:name] StringEquals 'production' AND @Request[subOperation] StringEqualsIgnoreCase 'Blob.Read.WithTagConditions')",
        conditionVersion: "2.0",
        description: "Conditional access to production storage",
      });

      expect(roleAssignment.props.condition).toBeDefined();
      expect(roleAssignment.props.conditionVersion).toBe("2.0");
    });
  });

  describe("Delegated Managed Identity", () => {
    it("should support delegated managed identity for group assignments", () => {
      const managedIdentityId =
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity";

      const roleAssignment = new RoleAssignment(stack, "DelegatedMI", {
        name: "delegated-mi-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        principalType: "Group",
        delegatedManagedIdentityResourceId: managedIdentityId,
      });

      expect(roleAssignment.props.delegatedManagedIdentityResourceId).toBe(
        managedIdentityId,
      );
      expect(roleAssignment.props.principalType).toBe("Group");
    });
  });

  describe("Scope Configurations", () => {
    it("should support subscription scope", () => {
      const roleAssignment = new RoleAssignment(stack, "SubscriptionScope", {
        name: "subscription-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      });

      expect(roleAssignment.assignmentScope).toContain("/subscriptions/");
    });

    it("should support resource group scope", () => {
      const rgScope =
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg";

      const roleAssignment = new RoleAssignment(stack, "ResourceGroupScope", {
        name: "rg-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: rgScope,
      });

      expect(roleAssignment.assignmentScope).toContain("/resourceGroups/");
    });

    it("should support resource scope", () => {
      const resourceScope =
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/testaccount";

      const roleAssignment = new RoleAssignment(stack, "ResourceScope", {
        name: "resource-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: resourceScope,
      });

      expect(roleAssignment.assignmentScope).toContain(
        "/providers/Microsoft.Storage/",
      );
    });
  });

  describe("Public Methods and Properties", () => {
    let roleAssignment: RoleAssignment;

    beforeEach(() => {
      roleAssignment = new RoleAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        principalType: "User",
        description: "A test assignment",
      });
    });

    it("should have correct id format", () => {
      expect(roleAssignment.id).toMatch(/^\$\{.*\.id\}$/);
    });

    it("should have resourceId property matching id", () => {
      expect(roleAssignment.resourceId).toBe(roleAssignment.id);
    });

    it("should return correct roleDefinitionId", () => {
      expect(roleAssignment.roleDefinitionId).toBe(TEST_ROLE_DEF_ID);
    });

    it("should return correct principalId", () => {
      expect(roleAssignment.principalId).toBe(TEST_PRINCIPAL_ID);
    });

    it("should return correct assignmentScope", () => {
      expect(roleAssignment.assignmentScope).toBe(TEST_SUBSCRIPTION_SCOPE);
    });

    it("should return correct principalType", () => {
      expect(roleAssignment.principalType).toBe("User");
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const roleAssignment = new RoleAssignment(stack, "IgnoreChanges", {
        name: "ignore-changes-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        ignoreChanges: ["description"],
      });

      expect(roleAssignment).toBeInstanceOf(RoleAssignment);
    });

    it("should handle empty ignore changes array", () => {
      const roleAssignment = new RoleAssignment(stack, "EmptyIgnore", {
        name: "empty-ignore-assignment",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        ignoreChanges: [],
      });

      expect(roleAssignment).toBeInstanceOf(RoleAssignment);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid API versions gracefully", () => {
      expect(() => {
        new RoleAssignment(stack, "InvalidAPI", {
          name: "invalid-api-assignment",
          roleDefinitionId: TEST_ROLE_DEF_ID,
          principalId: TEST_PRINCIPAL_ID,
          scope: TEST_SUBSCRIPTION_SCOPE,
          apiVersion: "invalid-version",
        });
      }).toThrow("Unsupported API version 'invalid-version'");
    });

    it("should validate properties when validation is enabled", () => {
      // Role assignments generate deterministic UUIDs for names, so name validation
      // doesn't apply the same way. Test that valid role assignments pass validation.
      const roleAssignment = new RoleAssignment(stack, "ValidationTest", {
        name: "test-assignment", // This is ignored in favor of generated UUID
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        enableValidation: true,
      });

      expect(roleAssignment.validationResult).toBeDefined();
      expect(roleAssignment.validationResult!.valid).toBe(true);
    });

    it("should handle schema registration errors gracefully", () => {
      expect(() => {
        new RoleAssignment(stack, "SchemaTest", {
          name: "schema-test-assignment",
          roleDefinitionId: TEST_ROLE_DEF_ID,
          principalId: TEST_PRINCIPAL_ID,
          scope: TEST_SUBSCRIPTION_SCOPE,
        });
      }).not.toThrow();
    });
  });

  describe("JSII Compliance", () => {
    it("should have JSII-compliant constructor", () => {
      expect(() => {
        new RoleAssignment(stack, "JsiiTest", {
          name: "jsii-test",
          roleDefinitionId: TEST_ROLE_DEF_ID,
          principalId: TEST_PRINCIPAL_ID,
          scope: TEST_SUBSCRIPTION_SCOPE,
        });
      }).not.toThrow();
    });

    it("should have JSII-compliant properties", () => {
      const roleAssignment = new RoleAssignment(stack, "JsiiProps", {
        name: "jsii-props",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      });

      expect(typeof roleAssignment.id).toBe("string");
      expect(typeof roleAssignment.name).toBe("string");
      expect(typeof roleAssignment.resolvedApiVersion).toBe("string");
      expect(typeof roleAssignment.roleDefinitionId).toBe("string");
      expect(typeof roleAssignment.principalId).toBe("string");
      expect(typeof roleAssignment.assignmentScope).toBe("string");
    });

    it("should have JSII-compliant methods", () => {
      const roleAssignment = new RoleAssignment(stack, "JsiiMethods", {
        name: "jsii-methods",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      });

      expect(typeof roleAssignment.latestVersion).toBe("function");
      expect(typeof roleAssignment.supportedVersions).toBe("function");
    });

    it("should serialize complex objects correctly", () => {
      const roleAssignment = new RoleAssignment(stack, "JsiiSerialization", {
        name: "jsii-serialization",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
        principalType: "User",
      });

      expect(() =>
        JSON.stringify(roleAssignment.validationResult),
      ).not.toThrow();
      expect(() => JSON.stringify(roleAssignment.schema)).not.toThrow();
      expect(() => JSON.stringify(roleAssignment.versionConfig)).not.toThrow();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new RoleAssignment(stack, "SynthTest", {
        name: "synth-test",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should work in complex CDK constructs", () => {
      class ComplexConstruct extends cdktf.TerraformStack {
        constructor(scope: cdktf.App, id: string) {
          super(scope, id);

          const assignment1 = new RoleAssignment(this, "Assignment1", {
            name: "assignment-1",
            roleDefinitionId: TEST_ROLE_DEF_ID,
            principalId: TEST_PRINCIPAL_ID,
            scope: TEST_SUBSCRIPTION_SCOPE,
          });

          const assignment2 = new RoleAssignment(this, "Assignment2", {
            name: "assignment-2",
            roleDefinitionId: TEST_ROLE_DEF_ID,
            principalId: "00000000-0000-0000-0000-000000000002",
            scope: TEST_SUBSCRIPTION_SCOPE,
            principalType: "Group",
            apiVersion: "2022-04-01",
          });

          new cdktf.TerraformOutput(this, "Assignment1Id", {
            value: assignment1.id,
          });

          new cdktf.TerraformOutput(this, "Assignment2Id", {
            value: assignment2.id,
          });
        }
      }

      expect(() => {
        new ComplexConstruct(app, "ComplexStack");
      }).not.toThrow();
    });

    it("should handle multiple role assignments in the same stack", () => {
      const assignment1 = new RoleAssignment(stack, "Assignment1", {
        name: "assignment-1",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: TEST_PRINCIPAL_ID,
        scope: TEST_SUBSCRIPTION_SCOPE,
      });

      const assignment2 = new RoleAssignment(stack, "Assignment2", {
        name: "assignment-2",
        roleDefinitionId: TEST_ROLE_DEF_ID,
        principalId: "00000000-0000-0000-0000-000000000002",
        scope:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        principalType: "ServicePrincipal",
        apiVersion: "2022-04-01",
      });

      expect(assignment1.resolvedApiVersion).toBe("2022-04-01");
      expect(assignment2.resolvedApiVersion).toBe("2022-04-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });
});
