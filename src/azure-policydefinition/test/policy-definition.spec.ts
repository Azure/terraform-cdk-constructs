/**
 * Comprehensive tests for the unified PolicyDefinition implementation
 *
 * This test suite validates the unified PolicyDefinition class that uses
 * the VersionedAzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation, and
 * policy-specific functionality.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  PolicyDefinition,
  PolicyDefinitionProps,
} from "../lib/policy-definition";
import {
  ALL_POLICY_DEFINITION_VERSIONS,
  POLICY_DEFINITION_TYPE,
} from "../lib/policy-definition-schemas";

describe("PolicyDefinition - Unified Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure Policy Definition schemas are registered
    try {
      manager.registerResourceType(
        POLICY_DEFINITION_TYPE,
        ALL_POLICY_DEFINITION_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create policy definition with automatic latest version resolution", () => {
      const props: PolicyDefinitionProps = {
        name: "test-policy",
        policyRule: {
          if: {
            field: "tags['Environment']",
            exists: "false",
          },
          then: {
            effect: "deny",
          },
        },
      };

      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        props,
      );

      expect(policyDefinition).toBeInstanceOf(PolicyDefinition);
      expect(policyDefinition.resolvedApiVersion).toBe("2021-06-01"); // Latest version
      expect(policyDefinition.props).toBe(props);
      expect(policyDefinition.name).toBe("test-policy");
    });

    it("should create policy definition with explicit version pinning", () => {
      const props: PolicyDefinitionProps = {
        name: "test-policy-pinned",
        apiVersion: "2021-06-01",
        policyRule: {
          if: {
            field: "type",
            equals: "Microsoft.Compute/virtualMachines",
          },
          then: {
            effect: "audit",
          },
        },
      };

      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        props,
      );

      expect(policyDefinition.resolvedApiVersion).toBe("2021-06-01");
    });

    it("should create policy definition with all optional properties", () => {
      const props: PolicyDefinitionProps = {
        name: "test-policy-full",
        displayName: "Test Policy Definition",
        description: "A test policy definition for unit testing",
        policyType: "Custom",
        mode: "All",
        policyRule: {
          if: {
            field: "location",
            notIn: ["eastus", "westus"],
          },
          then: {
            effect: "deny",
          },
        },
        parameters: {
          allowedLocations: {
            type: "Array",
            metadata: {
              displayName: "Allowed locations",
              description: "The list of allowed locations for resources",
            },
          },
        },
        metadata: {
          category: "General",
          version: "1.0.0",
        },
        ignoreChanges: ["metadata"],
        enableValidation: true,
        enableMigrationAnalysis: true,
        enableTransformation: true,
      };

      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        props,
      );

      expect(policyDefinition.props.displayName).toBe("Test Policy Definition");
      expect(policyDefinition.props.description).toBe(
        "A test policy definition for unit testing",
      );
      expect(policyDefinition.props.policyType).toBe("Custom");
      expect(policyDefinition.props.mode).toBe("All");
      expect(policyDefinition.props.parameters).toBeDefined();
      expect(policyDefinition.props.metadata).toBeDefined();
    });

    it("should use default name when name is not provided", () => {
      const props: PolicyDefinitionProps = {
        policyRule: {
          if: {
            field: "type",
            equals: "Microsoft.Storage/storageAccounts",
          },
          then: {
            effect: "audit",
          },
        },
      };

      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        props,
      );

      expect(policyDefinition.name).toBe("TestPolicyDefinition");
    });

    it("should require policyRule to be provided", () => {
      const props: any = {
        name: "test-policy",
      };

      expect(() => {
        new PolicyDefinition(stack, "TestPolicyDefinition", props);
      }).toThrow("Required property 'policyRule' is missing");
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        {
          name: "test-policy",
          policyRule: { if: {}, then: { effect: "deny" } },
        },
      );

      expect(policyDefinition.resolvedApiVersion).toBe("2021-06-01");
      expect(policyDefinition.latestVersion()).toBe("2021-06-01");
    });

    it("should support all registered API versions", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        {
          name: "test-policy",
          policyRule: { if: {}, then: { effect: "deny" } },
        },
      );

      const supportedVersions = policyDefinition.supportedVersions();
      expect(supportedVersions).toContain("2021-06-01");
    });

    it("should validate version support", () => {
      // Valid version
      expect(() => {
        new PolicyDefinition(stack, "ValidVersion", {
          name: "test-policy",
          policyRule: { if: {}, then: { effect: "deny" } },
          apiVersion: "2021-06-01",
        });
      }).not.toThrow();

      // Invalid version
      expect(() => {
        new PolicyDefinition(stack, "InvalidVersion", {
          name: "test-policy",
          policyRule: { if: {}, then: { effect: "deny" } },
          apiVersion: "2022-01-01",
        });
      }).toThrow("Unsupported API version '2022-01-01'");
    });

    it("should load correct schema for resolved version", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        {
          name: "test-policy",
          policyRule: { if: {}, then: { effect: "deny" } },
          apiVersion: "2021-06-01",
        },
      );

      expect(policyDefinition.schema).toBeDefined();
      expect(policyDefinition.schema.resourceType).toBe(POLICY_DEFINITION_TYPE);
      expect(policyDefinition.schema.version).toBe("2021-06-01");
      expect(policyDefinition.schema.properties).toBeDefined();
    });

    it("should load version configuration correctly", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        {
          name: "test-policy",
          policyRule: { if: {}, then: { effect: "deny" } },
        },
      );

      expect(policyDefinition.versionConfig).toBeDefined();
      expect(policyDefinition.versionConfig.version).toBe("2021-06-01");
      expect(policyDefinition.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });
  });

  describe("Property Validation", () => {
    it("should validate properties when validation is enabled", () => {
      const props: PolicyDefinitionProps = {
        name: "test-policy",
        policyRule: {
          if: {
            field: "type",
            equals: "Microsoft.Compute/virtualMachines",
          },
          then: {
            effect: "audit",
          },
        },
        enableValidation: true,
      };

      expect(() => {
        new PolicyDefinition(stack, "TestPolicyDefinition", props);
      }).not.toThrow();
    });

    it("should have validation results for valid properties", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        {
          name: "valid-policy",
          displayName: "Valid Policy",
          policyRule: { if: {}, then: { effect: "deny" } },
          enableValidation: true,
        },
      );

      expect(policyDefinition.validationResult).toBeDefined();
      expect(policyDefinition.validationResult!.valid).toBe(true);
      expect(policyDefinition.validationResult!.errors).toHaveLength(0);
    });

    it("should skip validation when disabled", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        {
          name: "test-policy",
          policyRule: { if: {}, then: { effect: "deny" } },
          enableValidation: false,
        },
      );

      expect(policyDefinition).toBeDefined();
    });
  });

  describe("Migration Analysis", () => {
    it("should skip migration analysis for single version", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        {
          name: "test-policy",
          policyRule: { if: {}, then: { effect: "deny" } },
          apiVersion: "2021-06-01",
        },
      );

      // Since there's only one version, migration analysis should be skipped
      expect(policyDefinition).toBeDefined();
    });

    it("should skip migration analysis when disabled", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        {
          name: "test-policy",
          policyRule: { if: {}, then: { effect: "deny" } },
          enableMigrationAnalysis: false,
        },
      );

      expect(policyDefinition.migrationAnalysis).toBeUndefined();
    });
  });

  describe("Resource Creation and Body", () => {
    it("should create correct resource body with minimal properties", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        {
          name: "test-policy",
          policyRule: {
            if: {
              field: "tags['Environment']",
              exists: "false",
            },
            then: {
              effect: "deny",
            },
          },
        },
      );

      expect(policyDefinition).toBeDefined();
      expect(policyDefinition.props.policyRule).toBeDefined();
    });

    it("should create correct resource body with all properties", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        {
          name: "test-policy",
          displayName: "Test Policy",
          description: "A test policy",
          policyType: "Custom",
          mode: "Indexed",
          policyRule: {
            if: {
              field: "location",
              notIn: ["eastus", "westus"],
            },
            then: {
              effect: "deny",
            },
          },
          parameters: {
            allowedLocations: {
              type: "Array",
            },
          },
          metadata: {
            category: "Compliance",
          },
        },
      );

      expect(policyDefinition).toBeDefined();
      expect(policyDefinition.props.displayName).toBe("Test Policy");
      expect(policyDefinition.props.policyType).toBe("Custom");
      expect(policyDefinition.props.mode).toBe("Indexed");
    });

    it("should create Terraform outputs", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "TestPolicyDefinition",
        {
          name: "test-policy-outputs",
          policyRule: { if: {}, then: { effect: "deny" } },
        },
      );

      expect(policyDefinition.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(policyDefinition.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });
  });

  describe("Public Methods and Properties", () => {
    let policyDefinition: PolicyDefinition;

    beforeEach(() => {
      policyDefinition = new PolicyDefinition(stack, "TestPolicyDefinition", {
        name: "test-policy",
        displayName: "Test Policy",
        policyType: "Custom",
        mode: "All",
        policyRule: {
          if: {
            field: "type",
            equals: "Microsoft.Compute/virtualMachines",
          },
          then: {
            effect: "audit",
          },
        },
      });
    });

    it("should have correct id format", () => {
      expect(policyDefinition.id).toMatch(/^\$\{.*\.id\}$/);
    });

    it("should have resourceId property matching id", () => {
      expect(policyDefinition.resourceId).toBe(policyDefinition.id);
    });

    it("should return correct policyType", () => {
      expect(policyDefinition.policyType).toBe("Custom");
    });

    it("should return correct policyMode", () => {
      expect(policyDefinition.policyMode).toBe("All");
    });

    it("should use default policyType when not provided", () => {
      const defaultPolicy = new PolicyDefinition(stack, "DefaultTypePolicy", {
        name: "default-policy",
        policyRule: { if: {}, then: { effect: "deny" } },
      });

      expect(defaultPolicy.policyType).toBe("Custom");
    });

    it("should use default mode when not provided", () => {
      const defaultPolicy = new PolicyDefinition(stack, "DefaultModePolicy", {
        name: "default-policy",
        policyRule: { if: {}, then: { effect: "deny" } },
      });

      expect(defaultPolicy.policyMode).toBe("All");
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "IgnoreChangesPolicy",
        {
          name: "test-policy",
          policyRule: { if: {}, then: { effect: "deny" } },
          ignoreChanges: ["metadata", "description"],
        },
      );

      expect(policyDefinition).toBeInstanceOf(PolicyDefinition);
    });

    it("should handle empty ignore changes array", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "EmptyIgnorePolicy",
        {
          name: "test-policy",
          policyRule: { if: {}, then: { effect: "deny" } },
          ignoreChanges: [],
        },
      );

      expect(policyDefinition).toBeInstanceOf(PolicyDefinition);
    });
  });

  describe("Policy Rule Validation", () => {
    it("should accept complex policy rules", () => {
      const complexRule = {
        if: {
          allOf: [
            {
              field: "type",
              equals: "Microsoft.Storage/storageAccounts",
            },
            {
              field: "Microsoft.Storage/storageAccounts/enableHttpsTrafficOnly",
              notEquals: "true",
            },
          ],
        },
        then: {
          effect: "deny",
        },
      };

      const policyDefinition = new PolicyDefinition(
        stack,
        "ComplexRulePolicy",
        {
          name: "complex-policy",
          policyRule: complexRule,
        },
      );

      expect(policyDefinition).toBeDefined();
      expect(policyDefinition.props.policyRule).toEqual(complexRule);
    });

    it("should accept policy rules with parameters", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "ParameterizedPolicy",
        {
          name: "parameterized-policy",
          policyRule: {
            if: {
              field: "[concat('tags[', parameters('tagName'), ']')]",
              exists: "false",
            },
            then: {
              effect: "[parameters('effect')]",
            },
          },
          parameters: {
            tagName: {
              type: "String",
              metadata: {
                displayName: "Tag Name",
                description: "Name of the tag to check",
              },
            },
            effect: {
              type: "String",
              allowedValues: ["audit", "deny"],
              defaultValue: "audit",
            },
          },
        },
      );

      expect(policyDefinition).toBeDefined();
      expect(policyDefinition.props.parameters).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid API versions gracefully", () => {
      expect(() => {
        new PolicyDefinition(stack, "InvalidAPI", {
          name: "test-policy",
          policyRule: { if: {}, then: { effect: "deny" } },
          apiVersion: "invalid-version",
        });
      }).toThrow("Unsupported API version 'invalid-version'");
    });

    it("should handle validation errors when validation is enabled", () => {
      expect(() => {
        new PolicyDefinition(stack, "ValidationError", {
          name: "test-policy",
          policyRule: undefined as any, // Missing required policyRule
          enableValidation: true,
        });
      }).toThrow("Required property 'policyRule' is missing");
    });

    it("should handle schema registration errors gracefully", () => {
      expect(() => {
        new PolicyDefinition(stack, "SchemaTest", {
          name: "test-policy",
          policyRule: { if: {}, then: { effect: "deny" } },
        });
      }).not.toThrow();
    });
  });

  describe("JSII Compliance", () => {
    it("should have JSII-compliant constructor", () => {
      expect(() => {
        new PolicyDefinition(stack, "JsiiTest", {
          name: "jsii-test",
          policyRule: { if: {}, then: { effect: "deny" } },
        });
      }).not.toThrow();
    });

    it("should have JSII-compliant properties", () => {
      const policyDefinition = new PolicyDefinition(stack, "JsiiProps", {
        name: "jsii-props",
        policyRule: { if: {}, then: { effect: "deny" } },
      });

      expect(typeof policyDefinition.id).toBe("string");
      expect(typeof policyDefinition.name).toBe("string");
      expect(typeof policyDefinition.resolvedApiVersion).toBe("string");
      expect(typeof policyDefinition.policyType).toBe("string");
      expect(typeof policyDefinition.policyMode).toBe("string");
    });

    it("should have JSII-compliant methods", () => {
      const policyDefinition = new PolicyDefinition(stack, "JsiiMethods", {
        name: "jsii-methods",
        policyRule: { if: {}, then: { effect: "deny" } },
      });

      expect(typeof policyDefinition.latestVersion).toBe("function");
      expect(typeof policyDefinition.supportedVersions).toBe("function");
    });

    it("should serialize complex objects correctly", () => {
      const policyDefinition = new PolicyDefinition(
        stack,
        "JsiiSerialization",
        {
          name: "jsii-serialization",
          policyRule: {
            if: { field: "location", equals: "eastus" },
            then: { effect: "deny" },
          },
          parameters: {
            testParam: {
              type: "String",
            },
          },
        },
      );

      expect(() =>
        JSON.stringify(policyDefinition.validationResult),
      ).not.toThrow();
      expect(() => JSON.stringify(policyDefinition.schema)).not.toThrow();
      expect(() =>
        JSON.stringify(policyDefinition.versionConfig),
      ).not.toThrow();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new PolicyDefinition(stack, "SynthTest", {
        name: "synth-test",
        policyRule: {
          if: {
            field: "type",
            equals: "Microsoft.Compute/virtualMachines",
          },
          then: {
            effect: "audit",
          },
        },
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

          const policy1 = new PolicyDefinition(this, "Policy1", {
            name: "policy-1",
            displayName: "First Policy",
            policyRule: { if: {}, then: { effect: "audit" } },
          });

          const policy2 = new PolicyDefinition(this, "Policy2", {
            name: "policy-2",
            displayName: "Second Policy",
            policyRule: { if: {}, then: { effect: "deny" } },
            apiVersion: "2021-06-01",
          });

          new cdktf.TerraformOutput(this, "Policy1Id", {
            value: policy1.id,
          });

          new cdktf.TerraformOutput(this, "Policy2Id", {
            value: policy2.id,
          });
        }
      }

      expect(() => {
        new ComplexConstruct(app, "ComplexStack");
      }).not.toThrow();
    });

    it("should handle multiple policy definitions in the same stack", () => {
      const policy1 = new PolicyDefinition(stack, "PolicyDefinition1", {
        name: "policy-1",
        policyRule: { if: {}, then: { effect: "audit" } },
      });

      const policy2 = new PolicyDefinition(stack, "PolicyDefinition2", {
        name: "policy-2",
        policyRule: { if: {}, then: { effect: "deny" } },
        apiVersion: "2021-06-01",
      });

      expect(policy1.resolvedApiVersion).toBe("2021-06-01");
      expect(policy2.resolvedApiVersion).toBe("2021-06-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("Policy Definition Types", () => {
    it("should support BuiltIn policy type", () => {
      const policyDefinition = new PolicyDefinition(stack, "BuiltInPolicy", {
        name: "builtin-policy",
        policyType: "BuiltIn",
        policyRule: { if: {}, then: { effect: "audit" } },
      });

      expect(policyDefinition.policyType).toBe("BuiltIn");
    });

    it("should support Static policy type", () => {
      const policyDefinition = new PolicyDefinition(stack, "StaticPolicy", {
        name: "static-policy",
        policyType: "Static",
        policyRule: { if: {}, then: { effect: "audit" } },
      });

      expect(policyDefinition.policyType).toBe("Static");
    });

    it("should support different policy modes", () => {
      const indexedPolicy = new PolicyDefinition(stack, "IndexedPolicy", {
        name: "indexed-policy",
        mode: "Indexed",
        policyRule: { if: {}, then: { effect: "audit" } },
      });

      expect(indexedPolicy.policyMode).toBe("Indexed");

      const resourceProviderPolicy = new PolicyDefinition(
        stack,
        "ResourceProviderPolicy",
        {
          name: "resource-provider-policy",
          mode: "Microsoft.KeyVault.Data",
          policyRule: { if: {}, then: { effect: "audit" } },
        },
      );

      expect(resourceProviderPolicy.policyMode).toBe("Microsoft.KeyVault.Data");
    });
  });
});
