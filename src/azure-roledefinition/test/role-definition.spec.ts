/**
 * Comprehensive tests for the unified RoleDefinition implementation
 *
 * This test suite validates the unified RoleDefinition class that uses
 * the VersionedAzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation, and
 * role definition-specific functionality.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import { RoleDefinition, RoleDefinitionProps } from "../lib/role-definition";
import {
  ALL_ROLE_DEFINITION_VERSIONS,
  ROLE_DEFINITION_TYPE,
} from "../lib/role-definition-schemas";

describe("RoleDefinition - Unified Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure Role Definition schemas are registered
    try {
      manager.registerResourceType(
        ROLE_DEFINITION_TYPE,
        ALL_ROLE_DEFINITION_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create role definition with automatic latest version resolution", () => {
      const props: RoleDefinitionProps = {
        name: "test-role",
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Compute/virtualMachines/read"],
            notActions: [],
            dataActions: [],
            notDataActions: [],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      };

      const roleDefinition = new RoleDefinition(stack, "TestRole", props);

      expect(roleDefinition).toBeInstanceOf(RoleDefinition);
      expect(roleDefinition.resolvedApiVersion).toBe("2022-04-01"); // Latest version
      expect(roleDefinition.props).toBe(props);
      // Name is a deterministic UUID based on roleName and assignableScopes
      expect(roleDefinition.name).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should create role definition with explicit version pinning", () => {
      const props: RoleDefinitionProps = {
        name: "test-role-pinned",
        apiVersion: "2022-04-01",
        roleName: "Test Role Pinned",
        permissions: [
          {
            actions: ["Microsoft.Storage/storageAccounts/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      };

      const roleDefinition = new RoleDefinition(stack, "TestRole", props);

      expect(roleDefinition.resolvedApiVersion).toBe("2022-04-01");
    });

    it("should create role definition with all optional properties", () => {
      const props: RoleDefinitionProps = {
        name: "test-role-full",
        roleName: "Test Role Full",
        description: "A comprehensive test role for unit testing",
        type: "CustomRole",
        permissions: [
          {
            actions: [
              "Microsoft.Compute/virtualMachines/read",
              "Microsoft.Compute/virtualMachines/start/action",
            ],
            notActions: ["Microsoft.Compute/virtualMachines/delete"],
            dataActions: [
              "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
            ],
            notDataActions: [],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        ],
        ignoreChanges: ["description"],
        enableValidation: true,
        enableMigrationAnalysis: true,
        enableTransformation: true,
      };

      const roleDefinition = new RoleDefinition(stack, "TestRole", props);

      expect(roleDefinition.props.roleName).toBe("Test Role Full");
      expect(roleDefinition.props.description).toBe(
        "A comprehensive test role for unit testing",
      );
      expect(roleDefinition.props.type).toBe("CustomRole");
      expect(roleDefinition.props.permissions).toBeDefined();
      expect(roleDefinition.props.assignableScopes).toHaveLength(2);
    });

    it("should generate deterministic UUID name when name is not provided", () => {
      const props: RoleDefinitionProps = {
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      };

      const roleDefinition = new RoleDefinition(stack, "TestRole", props);

      // Name is a deterministic UUID, not the construct ID
      expect(roleDefinition.name).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should require roleName to be provided", () => {
      const props: any = {
        name: "test-role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      };

      expect(() => {
        new RoleDefinition(stack, "TestRole", props);
      }).toThrow("Required property 'roleName' is missing");
    });

    it("should require permissions to be provided", () => {
      const props: any = {
        name: "test-role",
        roleName: "Test Role",
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      };

      expect(() => {
        new RoleDefinition(stack, "TestRole", props);
      }).toThrow("Required property 'permissions' is missing");
    });

    it("should require assignableScopes to be provided", () => {
      const props: any = {
        name: "test-role",
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
      };

      expect(() => {
        new RoleDefinition(stack, "TestRole", props);
      }).toThrow("Required property 'assignableScopes' is missing");
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const roleDefinition = new RoleDefinition(stack, "TestRole", {
        name: "test-role",
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition.resolvedApiVersion).toBe("2022-04-01");
      expect(roleDefinition.latestVersion()).toBe("2022-04-01");
    });

    it("should support all registered API versions", () => {
      const roleDefinition = new RoleDefinition(stack, "TestRole", {
        name: "test-role",
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      const supportedVersions = roleDefinition.supportedVersions();
      expect(supportedVersions).toContain("2022-04-01");
    });

    it("should validate version support", () => {
      // Valid version
      expect(() => {
        new RoleDefinition(stack, "ValidVersion", {
          name: "test-role",
          roleName: "Test Role",
          permissions: [
            {
              actions: ["Microsoft.Resources/subscriptions/read"],
            },
          ],
          assignableScopes: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
          apiVersion: "2022-04-01",
        });
      }).not.toThrow();

      // Invalid version
      expect(() => {
        new RoleDefinition(stack, "InvalidVersion", {
          name: "test-role",
          roleName: "Test Role",
          permissions: [
            {
              actions: ["Microsoft.Resources/subscriptions/read"],
            },
          ],
          assignableScopes: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
          apiVersion: "2020-01-01",
        });
      }).toThrow("Unsupported API version '2020-01-01'");
    });

    it("should load correct schema for resolved version", () => {
      const roleDefinition = new RoleDefinition(stack, "TestRole", {
        name: "test-role",
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
        apiVersion: "2022-04-01",
      });

      expect(roleDefinition.schema).toBeDefined();
      expect(roleDefinition.schema.resourceType).toBe(ROLE_DEFINITION_TYPE);
      expect(roleDefinition.schema.version).toBe("2022-04-01");
      expect(roleDefinition.schema.properties).toBeDefined();
    });

    it("should load version configuration correctly", () => {
      const roleDefinition = new RoleDefinition(stack, "TestRole", {
        name: "test-role",
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition.versionConfig).toBeDefined();
      expect(roleDefinition.versionConfig.version).toBe("2022-04-01");
      expect(roleDefinition.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });
  });

  describe("Property Validation", () => {
    it("should validate properties when validation is enabled", () => {
      const props: RoleDefinitionProps = {
        name: "test-role",
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
        enableValidation: true,
      };

      expect(() => {
        new RoleDefinition(stack, "TestRole", props);
      }).not.toThrow();
    });

    it("should have validation results for valid properties", () => {
      const roleDefinition = new RoleDefinition(stack, "TestRole", {
        name: "valid-role",
        roleName: "Valid Role",
        description: "A valid role definition",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
        enableValidation: true,
      });

      expect(roleDefinition.validationResult).toBeDefined();
      expect(roleDefinition.validationResult!.valid).toBe(true);
      expect(roleDefinition.validationResult!.errors).toHaveLength(0);
    });

    it("should skip validation when disabled", () => {
      const roleDefinition = new RoleDefinition(stack, "TestRole", {
        name: "test-role",
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
        enableValidation: false,
      });

      expect(roleDefinition).toBeDefined();
    });
  });

  describe("Migration Analysis", () => {
    it("should skip migration analysis for single version", () => {
      const roleDefinition = new RoleDefinition(stack, "TestRole", {
        name: "test-role",
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
        apiVersion: "2022-04-01",
      });

      // Since there's only one version, migration analysis should be skipped
      expect(roleDefinition).toBeDefined();
    });

    it("should skip migration analysis when disabled", () => {
      const roleDefinition = new RoleDefinition(stack, "TestRole", {
        name: "test-role",
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
        enableMigrationAnalysis: false,
      });

      expect(roleDefinition.migrationAnalysis).toBeUndefined();
    });
  });

  describe("Resource Creation and Body", () => {
    it("should create correct resource body with minimal properties", () => {
      const roleDefinition = new RoleDefinition(stack, "TestRole", {
        name: "test-role",
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition).toBeDefined();
      expect(roleDefinition.props.roleName).toBeDefined();
      expect(roleDefinition.props.permissions).toBeDefined();
      expect(roleDefinition.props.assignableScopes).toBeDefined();
    });

    it("should create correct resource body with all properties", () => {
      const roleDefinition = new RoleDefinition(stack, "TestRole", {
        name: "test-role",
        roleName: "Test Role",
        description: "A test role definition",
        type: "CustomRole",
        permissions: [
          {
            actions: ["Microsoft.Compute/virtualMachines/read"],
            notActions: ["Microsoft.Compute/virtualMachines/delete"],
            dataActions: [
              "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
            ],
            notDataActions: [],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        ],
      });

      expect(roleDefinition).toBeDefined();
      expect(roleDefinition.props.roleName).toBe("Test Role");
      expect(roleDefinition.props.description).toBe("A test role definition");
      expect(roleDefinition.props.type).toBe("CustomRole");
    });

    it("should create Terraform outputs", () => {
      const roleDefinition = new RoleDefinition(stack, "TestRole", {
        name: "test-role-outputs",
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(roleDefinition.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });
  });

  describe("Permissions Configuration", () => {
    it("should support control plane actions", () => {
      const roleDefinition = new RoleDefinition(stack, "ControlPlaneRole", {
        name: "control-plane-role",
        roleName: "Control Plane Role",
        permissions: [
          {
            actions: [
              "Microsoft.Compute/virtualMachines/read",
              "Microsoft.Compute/virtualMachines/start/action",
              "Microsoft.Compute/virtualMachines/restart/action",
            ],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition.props.permissions[0].actions).toHaveLength(3);
    });

    it("should support control plane notActions", () => {
      const roleDefinition = new RoleDefinition(stack, "NotActionsRole", {
        name: "not-actions-role",
        roleName: "Not Actions Role",
        permissions: [
          {
            actions: ["Microsoft.Compute/virtualMachines/*"],
            notActions: [
              "Microsoft.Compute/virtualMachines/delete",
              "Microsoft.Compute/virtualMachines/write",
            ],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition.props.permissions[0].notActions).toHaveLength(2);
    });

    it("should support data plane actions", () => {
      const roleDefinition = new RoleDefinition(stack, "DataPlaneRole", {
        name: "data-plane-role",
        roleName: "Data Plane Role",
        permissions: [
          {
            actions: ["Microsoft.Storage/storageAccounts/read"],
            dataActions: [
              "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
              "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write",
            ],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition.props.permissions[0].dataActions).toHaveLength(2);
    });

    it("should support data plane notDataActions", () => {
      const roleDefinition = new RoleDefinition(stack, "NotDataActionsRole", {
        name: "not-data-actions-role",
        roleName: "Not Data Actions Role",
        permissions: [
          {
            dataActions: [
              "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/*",
            ],
            notDataActions: [
              "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete",
            ],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition.props.permissions[0].notDataActions).toHaveLength(
        1,
      );
    });

    it("should support complex permission combinations", () => {
      const roleDefinition = new RoleDefinition(stack, "ComplexPermissions", {
        name: "complex-permissions",
        roleName: "Complex Permissions Role",
        permissions: [
          {
            actions: ["Microsoft.Compute/virtualMachines/*"],
            notActions: ["Microsoft.Compute/virtualMachines/delete"],
            dataActions: [
              "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/*",
            ],
            notDataActions: [
              "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete",
            ],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition.props.permissions[0].actions).toBeDefined();
      expect(roleDefinition.props.permissions[0].notActions).toBeDefined();
      expect(roleDefinition.props.permissions[0].dataActions).toBeDefined();
      expect(roleDefinition.props.permissions[0].notDataActions).toBeDefined();
    });

    it("should support multiple permission objects", () => {
      const roleDefinition = new RoleDefinition(stack, "MultiplePermissions", {
        name: "multiple-permissions",
        roleName: "Multiple Permissions Role",
        permissions: [
          {
            actions: ["Microsoft.Compute/virtualMachines/read"],
          },
          {
            actions: ["Microsoft.Storage/storageAccounts/read"],
          },
          {
            dataActions: [
              "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
            ],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition.props.permissions).toHaveLength(3);
    });
  });

  describe("Assignable Scopes Configuration", () => {
    it("should support subscription scope", () => {
      const roleDefinition = new RoleDefinition(stack, "SubscriptionScope", {
        name: "subscription-role",
        roleName: "Subscription Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition.props.assignableScopes[0]).toContain(
        "/subscriptions/",
      );
    });

    it("should support resource group scope", () => {
      const roleDefinition = new RoleDefinition(stack, "ResourceGroupScope", {
        name: "rg-role",
        roleName: "Resource Group Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/resourceGroups/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        ],
      });

      expect(roleDefinition.props.assignableScopes[0]).toContain(
        "/resourceGroups/",
      );
    });

    it("should support management group scope", () => {
      const roleDefinition = new RoleDefinition(stack, "ManagementGroupScope", {
        name: "mg-role",
        roleName: "Management Group Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/providers/Microsoft.Management/managementGroups/test-mg",
        ],
      });

      expect(roleDefinition.props.assignableScopes[0]).toContain(
        "/managementGroups/",
      );
    });

    it("should support multiple assignable scopes", () => {
      const roleDefinition = new RoleDefinition(stack, "MultipleScopes", {
        name: "multiple-scopes-role",
        roleName: "Multiple Scopes Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg1",
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg2",
        ],
      });

      expect(roleDefinition.props.assignableScopes).toHaveLength(3);
    });
  });

  describe("Role Types", () => {
    it("should default to CustomRole type", () => {
      const roleDefinition = new RoleDefinition(stack, "DefaultType", {
        name: "default-type-role",
        roleName: "Default Type Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition.roleType).toBe("CustomRole");
    });

    it("should support explicit CustomRole type", () => {
      const roleDefinition = new RoleDefinition(stack, "CustomType", {
        name: "custom-type-role",
        roleName: "Custom Type Role",
        type: "CustomRole",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition.roleType).toBe("CustomRole");
    });

    it("should support BuiltInRole type", () => {
      const roleDefinition = new RoleDefinition(stack, "BuiltInType", {
        name: "builtin-type-role",
        roleName: "Built-In Type Role",
        type: "BuiltInRole",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(roleDefinition.roleType).toBe("BuiltInRole");
    });
  });

  describe("Public Methods and Properties", () => {
    let roleDefinition: RoleDefinition;

    beforeEach(() => {
      roleDefinition = new RoleDefinition(stack, "TestRole", {
        name: "test-role",
        roleName: "Test Role",
        description: "A test role",
        permissions: [
          {
            actions: ["Microsoft.Compute/virtualMachines/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });
    });

    it("should have correct id format", () => {
      expect(roleDefinition.id).toMatch(/^\$\{.*\.id\}$/);
    });

    it("should have resourceId property matching id", () => {
      expect(roleDefinition.resourceId).toBe(roleDefinition.id);
    });

    it("should return correct roleName", () => {
      expect(roleDefinition.roleName).toBe("Test Role");
    });

    it("should return correct roleType", () => {
      expect(roleDefinition.roleType).toBe("CustomRole");
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const roleDefinition = new RoleDefinition(stack, "IgnoreChanges", {
        name: "ignore-changes-role",
        roleName: "Ignore Changes Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
        ignoreChanges: ["description"],
      });

      expect(roleDefinition).toBeInstanceOf(RoleDefinition);
    });

    it("should handle empty ignore changes array", () => {
      const roleDefinition = new RoleDefinition(stack, "EmptyIgnore", {
        name: "empty-ignore-role",
        roleName: "Empty Ignore Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
        ignoreChanges: [],
      });

      expect(roleDefinition).toBeInstanceOf(RoleDefinition);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid API versions gracefully", () => {
      expect(() => {
        new RoleDefinition(stack, "InvalidAPI", {
          name: "invalid-api-role",
          roleName: "Invalid API Role",
          permissions: [
            {
              actions: ["Microsoft.Resources/subscriptions/read"],
            },
          ],
          assignableScopes: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
          apiVersion: "invalid-version",
        });
      }).toThrow("Unsupported API version 'invalid-version'");
    });

    it("should validate properties when validation is enabled", () => {
      // Role definitions generate deterministic UUIDs for names, so name validation
      // doesn't apply the same way. Test that valid role definitions pass validation.
      const roleDefinition = new RoleDefinition(stack, "ValidationTest", {
        name: "test-role", // This is ignored in favor of generated UUID
        roleName: "Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
        enableValidation: true,
      });

      expect(roleDefinition.validationResult).toBeDefined();
      expect(roleDefinition.validationResult!.valid).toBe(true);
    });

    it("should handle schema registration errors gracefully", () => {
      expect(() => {
        new RoleDefinition(stack, "SchemaTest", {
          name: "schema-test-role",
          roleName: "Schema Test Role",
          permissions: [
            {
              actions: ["Microsoft.Resources/subscriptions/read"],
            },
          ],
          assignableScopes: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        });
      }).not.toThrow();
    });
  });

  describe("JSII Compliance", () => {
    it("should have JSII-compliant constructor", () => {
      expect(() => {
        new RoleDefinition(stack, "JsiiTest", {
          name: "jsii-test",
          roleName: "JSII Test Role",
          permissions: [
            {
              actions: ["Microsoft.Resources/subscriptions/read"],
            },
          ],
          assignableScopes: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        });
      }).not.toThrow();
    });

    it("should have JSII-compliant properties", () => {
      const roleDefinition = new RoleDefinition(stack, "JsiiProps", {
        name: "jsii-props",
        roleName: "JSII Props Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(typeof roleDefinition.id).toBe("string");
      expect(typeof roleDefinition.name).toBe("string");
      expect(typeof roleDefinition.resolvedApiVersion).toBe("string");
      expect(typeof roleDefinition.roleName).toBe("string");
      expect(typeof roleDefinition.roleType).toBe("string");
    });

    it("should have JSII-compliant methods", () => {
      const roleDefinition = new RoleDefinition(stack, "JsiiMethods", {
        name: "jsii-methods",
        roleName: "JSII Methods Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(typeof roleDefinition.latestVersion).toBe("function");
      expect(typeof roleDefinition.supportedVersions).toBe("function");
    });

    it("should serialize complex objects correctly", () => {
      const roleDefinition = new RoleDefinition(stack, "JsiiSerialization", {
        name: "jsii-serialization",
        roleName: "JSII Serialization Role",
        permissions: [
          {
            actions: ["Microsoft.Compute/virtualMachines/read"],
            notActions: ["Microsoft.Compute/virtualMachines/delete"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      expect(() =>
        JSON.stringify(roleDefinition.validationResult),
      ).not.toThrow();
      expect(() => JSON.stringify(roleDefinition.schema)).not.toThrow();
      expect(() => JSON.stringify(roleDefinition.versionConfig)).not.toThrow();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new RoleDefinition(stack, "SynthTest", {
        name: "synth-test",
        roleName: "Synth Test Role",
        permissions: [
          {
            actions: ["Microsoft.Resources/subscriptions/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
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

          const role1 = new RoleDefinition(this, "Role1", {
            name: "role-1",
            roleName: "First Role",
            permissions: [
              {
                actions: ["Microsoft.Compute/virtualMachines/read"],
              },
            ],
            assignableScopes: [
              "/subscriptions/00000000-0000-0000-0000-000000000000",
            ],
          });

          const role2 = new RoleDefinition(this, "Role2", {
            name: "role-2",
            roleName: "Second Role",
            permissions: [
              {
                actions: ["Microsoft.Storage/storageAccounts/read"],
              },
            ],
            assignableScopes: [
              "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
            ],
            apiVersion: "2022-04-01",
          });

          new cdktf.TerraformOutput(this, "Role1Id", {
            value: role1.id,
          });

          new cdktf.TerraformOutput(this, "Role2Id", {
            value: role2.id,
          });
        }
      }

      expect(() => {
        new ComplexConstruct(app, "ComplexStack");
      }).not.toThrow();
    });

    it("should handle multiple role definitions in the same stack", () => {
      const role1 = new RoleDefinition(stack, "Role1", {
        name: "role-1",
        roleName: "First Role",
        permissions: [
          {
            actions: ["Microsoft.Compute/virtualMachines/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
        ],
      });

      const role2 = new RoleDefinition(stack, "Role2", {
        name: "role-2",
        roleName: "Second Role",
        permissions: [
          {
            actions: ["Microsoft.Storage/storageAccounts/read"],
          },
        ],
        assignableScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        ],
        apiVersion: "2022-04-01",
      });

      expect(role1.resolvedApiVersion).toBe("2022-04-01");
      expect(role2.resolvedApiVersion).toBe("2022-04-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });
});
