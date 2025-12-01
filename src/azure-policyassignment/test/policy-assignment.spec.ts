/**
 * Comprehensive tests for the unified PolicyAssignment implementation
 *
 * This test suite validates the unified PolicyAssignment class that uses
 * the VersionedAzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation, and
 * policy assignment-specific functionality.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  PolicyAssignment,
  PolicyAssignmentProps,
} from "../lib/policy-assignment";
import {
  ALL_POLICY_ASSIGNMENT_VERSIONS,
  POLICY_ASSIGNMENT_TYPE,
} from "../lib/policy-assignment-schemas";

describe("PolicyAssignment - Unified Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure Policy Assignment schemas are registered
    try {
      manager.registerResourceType(
        POLICY_ASSIGNMENT_TYPE,
        ALL_POLICY_ASSIGNMENT_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create policy assignment with automatic latest version resolution", () => {
      const props: PolicyAssignmentProps = {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
      };

      const assignment = new PolicyAssignment(stack, "TestAssignment", props);

      expect(assignment).toBeInstanceOf(PolicyAssignment);
      expect(assignment.resolvedApiVersion).toBe("2022-06-01"); // Latest version
      expect(assignment.props).toBe(props);
      expect(assignment.name).toBe("test-assignment");
    });

    it("should create policy assignment with explicit version pinning", () => {
      const props: PolicyAssignmentProps = {
        name: "test-assignment-pinned",
        apiVersion: "2022-06-01",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
      };

      const assignment = new PolicyAssignment(stack, "TestAssignment", props);

      expect(assignment.resolvedApiVersion).toBe("2022-06-01");
    });

    it("should create policy assignment with all optional properties", () => {
      const props: PolicyAssignmentProps = {
        name: "test-assignment-full",
        displayName: "Test Policy Assignment",
        description: "A test policy assignment for unit testing",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        enforcementMode: "Default",
        parameters: {
          tagName: {
            value: "Environment",
          },
        },
        metadata: {
          assignedBy: "admin@example.com",
        },
        location: "eastus",
        identity: {
          type: "SystemAssigned",
        },
        notScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/excluded-rg",
        ],
        nonComplianceMessages: [
          {
            message: "Resource must comply with policy",
          },
        ],
        ignoreChanges: ["metadata"],
        enableValidation: true,
        enableMigrationAnalysis: true,
        enableTransformation: true,
      };

      const assignment = new PolicyAssignment(stack, "TestAssignment", props);

      expect(assignment.props.displayName).toBe("Test Policy Assignment");
      expect(assignment.props.description).toBe(
        "A test policy assignment for unit testing",
      );
      expect(assignment.props.enforcementMode).toBe("Default");
      expect(assignment.props.parameters).toBeDefined();
      expect(assignment.props.metadata).toBeDefined();
      expect(assignment.props.identity).toBeDefined();
      expect(assignment.props.notScopes).toBeDefined();
      expect(assignment.props.nonComplianceMessages).toBeDefined();
    });

    it("should use default name when name is not provided", () => {
      const props: PolicyAssignmentProps = {
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
      };

      const assignment = new PolicyAssignment(stack, "TestAssignment", props);

      expect(assignment.name).toBe("TestAssignment");
    });

    it("should require policyDefinitionId to be provided", () => {
      const props: any = {
        name: "test-assignment",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
      };

      expect(() => {
        new PolicyAssignment(stack, "TestAssignment", props);
      }).toThrow("Required property 'policyDefinitionId' is missing");
    });

    it("should require scope to be provided", () => {
      const props: any = {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
      };

      expect(() => {
        new PolicyAssignment(stack, "TestAssignment", props);
      }).toThrow("Required property 'scope' is missing");
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const assignment = new PolicyAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
      });

      expect(assignment.resolvedApiVersion).toBe("2022-06-01");
      expect(assignment.latestVersion()).toBe("2022-06-01");
    });

    it("should support all registered API versions", () => {
      const assignment = new PolicyAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
      });

      const supportedVersions = assignment.supportedVersions();
      expect(supportedVersions).toContain("2022-06-01");
    });

    it("should validate version support", () => {
      // Valid version
      expect(() => {
        new PolicyAssignment(stack, "ValidVersion", {
          name: "test-assignment",
          policyDefinitionId:
            "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
          scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
          apiVersion: "2022-06-01",
        });
      }).not.toThrow();

      // Invalid version
      expect(() => {
        new PolicyAssignment(stack, "InvalidVersion", {
          name: "test-assignment",
          policyDefinitionId:
            "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
          scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
          apiVersion: "2020-01-01",
        });
      }).toThrow("Unsupported API version '2020-01-01'");
    });

    it("should load correct schema for resolved version", () => {
      const assignment = new PolicyAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        apiVersion: "2022-06-01",
      });

      expect(assignment.schema).toBeDefined();
      expect(assignment.schema.resourceType).toBe(POLICY_ASSIGNMENT_TYPE);
      expect(assignment.schema.version).toBe("2022-06-01");
      expect(assignment.schema.properties).toBeDefined();
    });

    it("should load version configuration correctly", () => {
      const assignment = new PolicyAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
      });

      expect(assignment.versionConfig).toBeDefined();
      expect(assignment.versionConfig.version).toBe("2022-06-01");
      expect(assignment.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });
  });

  describe("Property Validation", () => {
    it("should validate properties when validation is enabled", () => {
      const props: PolicyAssignmentProps = {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        enableValidation: true,
      };

      expect(() => {
        new PolicyAssignment(stack, "TestAssignment", props);
      }).not.toThrow();
    });

    it("should have validation results for valid properties", () => {
      const assignment = new PolicyAssignment(stack, "TestAssignment", {
        name: "valid-assignment",
        displayName: "Valid Assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        enableValidation: true,
      });

      expect(assignment.validationResult).toBeDefined();
      expect(assignment.validationResult!.valid).toBe(true);
      expect(assignment.validationResult!.errors).toHaveLength(0);
    });

    it("should skip validation when disabled", () => {
      const assignment = new PolicyAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        enableValidation: false,
      });

      expect(assignment).toBeDefined();
    });
  });

  describe("Migration Analysis", () => {
    it("should skip migration analysis for single version", () => {
      const assignment = new PolicyAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        apiVersion: "2022-06-01",
      });

      // Since there's only one version, migration analysis should be skipped
      expect(assignment).toBeDefined();
    });

    it("should skip migration analysis when disabled", () => {
      const assignment = new PolicyAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        enableMigrationAnalysis: false,
      });

      expect(assignment.migrationAnalysis).toBeUndefined();
    });
  });

  describe("Resource Creation and Body", () => {
    it("should create correct resource body with minimal properties", () => {
      const assignment = new PolicyAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
      });

      expect(assignment).toBeDefined();
      expect(assignment.props.policyDefinitionId).toBeDefined();
      expect(assignment.props.scope).toBeDefined();
    });

    it("should create correct resource body with all properties", () => {
      const assignment = new PolicyAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        displayName: "Test Assignment",
        description: "A test assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        enforcementMode: "DoNotEnforce",
        parameters: {
          tagName: {
            value: "Environment",
          },
        },
        metadata: {
          assignedBy: "admin@example.com",
        },
        location: "eastus",
        identity: {
          type: "SystemAssigned",
        },
        notScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/excluded-rg",
        ],
        nonComplianceMessages: [
          {
            message: "Resource must comply",
          },
        ],
      });

      expect(assignment).toBeDefined();
      expect(assignment.props.displayName).toBe("Test Assignment");
      expect(assignment.props.enforcementMode).toBe("DoNotEnforce");
      expect(assignment.props.identity).toBeDefined();
    });

    it("should create Terraform outputs", () => {
      const assignment = new PolicyAssignment(stack, "TestAssignment", {
        name: "test-assignment-outputs",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
      });

      expect(assignment.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(assignment.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });
  });

  describe("Enforcement Mode Configuration", () => {
    it("should use Default enforcement mode by default", () => {
      const assignment = new PolicyAssignment(stack, "DefaultEnforcement", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
      });

      expect(assignment.enforcementMode).toBe("Default");
    });

    it("should support DoNotEnforce enforcement mode", () => {
      const assignment = new PolicyAssignment(stack, "DoNotEnforceMode", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        enforcementMode: "DoNotEnforce",
      });

      expect(assignment.enforcementMode).toBe("DoNotEnforce");
    });

    it("should support explicit Default enforcement mode", () => {
      const assignment = new PolicyAssignment(stack, "ExplicitDefault", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        enforcementMode: "Default",
      });

      expect(assignment.enforcementMode).toBe("Default");
    });
  });

  describe("Identity Configuration", () => {
    it("should support SystemAssigned identity", () => {
      const assignment = new PolicyAssignment(stack, "SystemIdentity", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        location: "eastus",
        identity: {
          type: "SystemAssigned",
        },
      });

      expect(assignment.props.identity).toBeDefined();
      expect(assignment.props.identity!.type).toBe("SystemAssigned");
    });

    it("should support UserAssigned identity", () => {
      const assignment = new PolicyAssignment(stack, "UserIdentity", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        location: "eastus",
        identity: {
          type: "UserAssigned",
          userAssignedIdentities: {
            "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity":
              {},
          },
        },
      });

      expect(assignment.props.identity).toBeDefined();
      expect(assignment.props.identity!.type).toBe("UserAssigned");
      expect(assignment.props.identity!.userAssignedIdentities).toBeDefined();
    });

    it("should support None identity", () => {
      const assignment = new PolicyAssignment(stack, "NoIdentity", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        location: "eastus",
        identity: {
          type: "None",
        },
      });

      expect(assignment.props.identity).toBeDefined();
      expect(assignment.props.identity!.type).toBe("None");
    });
  });

  describe("Parameters and Metadata", () => {
    it("should support policy parameters", () => {
      const assignment = new PolicyAssignment(stack, "WithParameters", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        parameters: {
          tagName: {
            value: "Environment",
          },
          tagValue: {
            value: "Production",
          },
        },
      });

      expect(assignment.props.parameters).toBeDefined();
      expect(assignment.props.parameters.tagName.value).toBe("Environment");
      expect(assignment.props.parameters.tagValue.value).toBe("Production");
    });

    it("should support metadata", () => {
      const assignment = new PolicyAssignment(stack, "WithMetadata", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        metadata: {
          assignedBy: "admin@example.com",
          assignedDate: "2024-01-01",
          parameterScopes: {},
        },
      });

      expect(assignment.props.metadata).toBeDefined();
      expect(assignment.props.metadata.assignedBy).toBe("admin@example.com");
    });
  });

  describe("NotScopes and NonComplianceMessages", () => {
    it("should support notScopes", () => {
      const assignment = new PolicyAssignment(stack, "WithNotScopes", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        notScopes: [
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/excluded-rg-1",
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/excluded-rg-2",
        ],
      });

      expect(assignment.props.notScopes).toBeDefined();
      expect(assignment.props.notScopes).toHaveLength(2);
    });

    it("should support nonComplianceMessages", () => {
      const assignment = new PolicyAssignment(
        stack,
        "WithNonComplianceMessages",
        {
          name: "test-assignment",
          policyDefinitionId:
            "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
          scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
          nonComplianceMessages: [
            {
              message: "Resource must have required tags",
            },
            {
              message: "Resource location is not compliant",
              policyDefinitionReferenceId: "locationPolicy",
            },
          ],
        },
      );

      expect(assignment.props.nonComplianceMessages).toBeDefined();
      expect(assignment.props.nonComplianceMessages).toHaveLength(2);
      expect(assignment.props.nonComplianceMessages![0].message).toBe(
        "Resource must have required tags",
      );
    });
  });

  describe("Public Methods and Properties", () => {
    let assignment: PolicyAssignment;

    beforeEach(() => {
      assignment = new PolicyAssignment(stack, "TestAssignment", {
        name: "test-assignment",
        displayName: "Test Assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        enforcementMode: "Default",
      });
    });

    it("should have correct id format", () => {
      expect(assignment.id).toMatch(/^\$\{.*\.id\}$/);
    });

    it("should have resourceId property matching id", () => {
      expect(assignment.resourceId).toBe(assignment.id);
    });

    it("should return correct policyDefinitionId", () => {
      expect(assignment.policyDefinitionId).toBe(
        "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
      );
    });

    it("should return correct scope", () => {
      expect(assignment.assignmentScope).toBe(
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
      );
    });

    it("should return correct enforcementMode", () => {
      expect(assignment.enforcementMode).toBe("Default");
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const assignment = new PolicyAssignment(stack, "IgnoreChanges", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        ignoreChanges: ["metadata", "description"],
      });

      expect(assignment).toBeInstanceOf(PolicyAssignment);
    });

    it("should handle empty ignore changes array", () => {
      const assignment = new PolicyAssignment(stack, "EmptyIgnore", {
        name: "test-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        ignoreChanges: [],
      });

      expect(assignment).toBeInstanceOf(PolicyAssignment);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid API versions gracefully", () => {
      expect(() => {
        new PolicyAssignment(stack, "InvalidAPI", {
          name: "test-assignment",
          policyDefinitionId:
            "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
          scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
          apiVersion: "invalid-version",
        });
      }).toThrow("Unsupported API version 'invalid-version'");
    });

    it("should handle validation errors when validation is enabled", () => {
      expect(() => {
        new PolicyAssignment(stack, "ValidationError", {
          name: "test-assignment",
          policyDefinitionId: undefined as any, // Missing required policyDefinitionId
          scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
          enableValidation: true,
        });
      }).toThrow("Required property 'policyDefinitionId' is missing");
    });

    it("should handle schema registration errors gracefully", () => {
      expect(() => {
        new PolicyAssignment(stack, "SchemaTest", {
          name: "test-assignment",
          policyDefinitionId:
            "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
          scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        });
      }).not.toThrow();
    });
  });

  describe("JSII Compliance", () => {
    it("should have JSII-compliant constructor", () => {
      expect(() => {
        new PolicyAssignment(stack, "JsiiTest", {
          name: "jsii-test",
          policyDefinitionId:
            "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
          scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        });
      }).not.toThrow();
    });

    it("should have JSII-compliant properties", () => {
      const assignment = new PolicyAssignment(stack, "JsiiProps", {
        name: "jsii-props",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
      });

      expect(typeof assignment.id).toBe("string");
      expect(typeof assignment.name).toBe("string");
      expect(typeof assignment.resolvedApiVersion).toBe("string");
      expect(typeof assignment.policyDefinitionId).toBe("string");
      expect(typeof assignment.assignmentScope).toBe("string");
      expect(typeof assignment.enforcementMode).toBe("string");
    });

    it("should have JSII-compliant methods", () => {
      const assignment = new PolicyAssignment(stack, "JsiiMethods", {
        name: "jsii-methods",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
      });

      expect(typeof assignment.latestVersion).toBe("function");
      expect(typeof assignment.supportedVersions).toBe("function");
    });

    it("should serialize complex objects correctly", () => {
      const assignment = new PolicyAssignment(stack, "JsiiSerialization", {
        name: "jsii-serialization",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
        parameters: {
          testParam: {
            value: "test",
          },
        },
      });

      expect(() => JSON.stringify(assignment.validationResult)).not.toThrow();
      expect(() => JSON.stringify(assignment.schema)).not.toThrow();
      expect(() => JSON.stringify(assignment.versionConfig)).not.toThrow();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new PolicyAssignment(stack, "SynthTest", {
        name: "synth-test",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
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

          const assignment1 = new PolicyAssignment(this, "Assignment1", {
            name: "assignment-1",
            displayName: "First Assignment",
            policyDefinitionId:
              "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/policy-1",
            scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
          });

          const assignment2 = new PolicyAssignment(this, "Assignment2", {
            name: "assignment-2",
            displayName: "Second Assignment",
            policyDefinitionId:
              "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/policy-2",
            scope:
              "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
            apiVersion: "2022-06-01",
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

    it("should handle multiple policy assignments in the same stack", () => {
      const assignment1 = new PolicyAssignment(stack, "Assignment1", {
        name: "assignment-1",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/policy-1",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
      });

      const assignment2 = new PolicyAssignment(stack, "Assignment2", {
        name: "assignment-2",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/policy-2",
        scope:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        apiVersion: "2022-06-01",
      });

      expect(assignment1.resolvedApiVersion).toBe("2022-06-01");
      expect(assignment2.resolvedApiVersion).toBe("2022-06-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("Scope Configurations", () => {
    it("should support subscription scope", () => {
      const assignment = new PolicyAssignment(stack, "SubscriptionScope", {
        name: "subscription-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope: "/subscriptions/00000000-0000-0000-0000-000000000000",
      });

      expect(assignment.assignmentScope).toContain("/subscriptions/");
    });

    it("should support resource group scope", () => {
      const assignment = new PolicyAssignment(stack, "ResourceGroupScope", {
        name: "rg-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
      });

      expect(assignment.assignmentScope).toContain("/resourceGroups/");
    });

    it("should support resource scope", () => {
      const assignment = new PolicyAssignment(stack, "ResourceScope", {
        name: "resource-assignment",
        policyDefinitionId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/policyDefinitions/test-policy",
        scope:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/teststorage",
      });

      expect(assignment.assignmentScope).toContain("/providers/");
    });
  });
});
