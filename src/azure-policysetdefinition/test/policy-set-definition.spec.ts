/**
 * Comprehensive tests for the PolicySetDefinition implementation
 *
 * This test suite validates the PolicySetDefinition class using the AzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * property configurations, and resource creation.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import {
  PolicySetDefinition,
  PolicySetDefinitionProps,
} from "../lib/policy-set-definition";

describe("PolicySetDefinition - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  // =============================================================================
  // Constructor and Basic Properties
  // =============================================================================

  describe("Constructor and Basic Properties", () => {
    it("should create a Policy Set Definition with minimal configuration", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Test Initiative",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/test-policy-id",
          },
        ],
      };

      const policySet = new PolicySetDefinition(stack, "TestPolicySet", props);

      expect(policySet).toBeInstanceOf(PolicySetDefinition);
      expect(policySet.props).toBe(props);
      expect(policySet.displayName).toBe("Test Initiative");
      expect(policySet.policyType).toBe("Custom");
      expect(policySet.policyDefinitionCount).toBe(1);
    });

    it("should create a Policy Set Definition with description", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Security Initiative",
        description: "Initiative for security compliance",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      };

      const policySet = new PolicySetDefinition(
        stack,
        "SecurityPolicySet",
        props,
      );

      expect(policySet.props.description).toBe(
        "Initiative for security compliance",
      );
    });

    it("should create a Policy Set Definition with custom name", () => {
      const props: PolicySetDefinitionProps = {
        name: "my-custom-initiative",
        displayName: "Custom Named Initiative",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      };

      const policySet = new PolicySetDefinition(
        stack,
        "CustomNamedPolicySet",
        props,
      );

      expect(policySet.props.name).toBe("my-custom-initiative");
    });

    it("should create a Policy Set Definition with metadata", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Metadata Initiative",
        scope: "/subscriptions/test-sub",
        metadata: {
          category: "Security Center",
          version: "1.0.0",
          preview: false,
          deprecated: false,
        },
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      };

      const policySet = new PolicySetDefinition(
        stack,
        "MetadataPolicySet",
        props,
      );

      expect(policySet.props.metadata?.category).toBe("Security Center");
      expect(policySet.props.metadata?.version).toBe("1.0.0");
      expect(policySet.props.metadata?.preview).toBe(false);
    });
  });

  // =============================================================================
  // Version Resolution
  // =============================================================================

  describe("Version Resolution", () => {
    it("should use latest version 2023-04-01 when no version specified", () => {
      const policySet = new PolicySetDefinition(stack, "DefaultVersion", {
        displayName: "Default Version Initiative",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      });

      expect(policySet.resolvedApiVersion).toBe("2023-04-01");
    });

    it("should use explicit version when specified", () => {
      const policySet = new PolicySetDefinition(stack, "PinnedVersion", {
        displayName: "Pinned Version Initiative",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
        apiVersion: "2021-06-01",
      });

      expect(policySet.resolvedApiVersion).toBe("2021-06-01");
    });

    it("should use latest version 2023-04-01 when explicitly specified", () => {
      const policySet = new PolicySetDefinition(stack, "LatestVersion", {
        displayName: "Latest Version Initiative",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
        apiVersion: "2023-04-01",
      });

      expect(policySet.resolvedApiVersion).toBe("2023-04-01");
    });
  });

  // =============================================================================
  // Validation Tests
  // =============================================================================

  describe("Validation", () => {
    it("should throw error when displayName is empty", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      };

      expect(() => {
        new PolicySetDefinition(stack, "EmptyDisplayName", props);
      }).toThrow(/displayName is required/);
    });

    it("should throw error when policyDefinitions is empty", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "No Policies Initiative",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [],
      };

      expect(() => {
        new PolicySetDefinition(stack, "NoPolicies", props);
      }).toThrow(/At least one policy definition reference is required/);
    });

    it("should throw error when policyDefinitionId is missing", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Invalid Policy Reference",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId: "",
          },
        ],
      };

      expect(() => {
        new PolicySetDefinition(stack, "InvalidPolicyRef", props);
      }).toThrow(/policyDefinitionId is required/);
    });

    it("should throw error for duplicate group names", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Duplicate Groups",
        scope: "/subscriptions/test-sub",
        policyDefinitionGroups: [
          { name: "Security", displayName: "Security Policies" },
          { name: "Security", displayName: "Duplicate Security" },
        ],
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      };

      expect(() => {
        new PolicySetDefinition(stack, "DuplicateGroups", props);
      }).toThrow(/Duplicate group name 'Security'/);
    });

    it("should throw error for invalid group reference in policy definition", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Invalid Group Reference",
        scope: "/subscriptions/test-sub",
        policyDefinitionGroups: [
          { name: "Security", displayName: "Security Policies" },
        ],
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
            groupNames: ["NonExistentGroup"],
          },
        ],
      };

      expect(() => {
        new PolicySetDefinition(stack, "InvalidGroupRef", props);
      }).toThrow(/references unknown group 'NonExistentGroup'/);
    });

    it("should accept valid policy set with groups", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Valid Groups Initiative",
        scope: "/subscriptions/test-sub",
        policyDefinitionGroups: [
          { name: "Security", displayName: "Security Policies" },
          { name: "Compliance", displayName: "Compliance Policies" },
        ],
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
            groupNames: ["Security"],
          },
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-2",
            groupNames: ["Security", "Compliance"],
          },
        ],
      };

      expect(() => {
        new PolicySetDefinition(stack, "ValidGroups", props);
      }).not.toThrow();
    });
  });

  // =============================================================================
  // Policy Definition References
  // =============================================================================

  describe("Policy Definition References", () => {
    it("should create initiative with single policy definition", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Single Policy Initiative",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
            policyDefinitionReferenceId: "allowedLocations",
          },
        ],
      };

      const policySet = new PolicySetDefinition(stack, "SinglePolicy", props);
      expect(policySet.policyDefinitionCount).toBe(1);
    });

    it("should create initiative with multiple policy definitions", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Multiple Policy Initiative",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
            policyDefinitionReferenceId: "policy1",
          },
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-2",
            policyDefinitionReferenceId: "policy2",
          },
          {
            policyDefinitionId:
              "/subscriptions/sub-id/providers/Microsoft.Authorization/policyDefinitions/custom-policy",
            policyDefinitionReferenceId: "customPolicy",
          },
        ],
      };

      const policySet = new PolicySetDefinition(
        stack,
        "MultiplePolicies",
        props,
      );
      expect(policySet.policyDefinitionCount).toBe(3);
    });

    it("should create initiative with policy parameters", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Parameterized Initiative",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
            policyDefinitionReferenceId: "tagPolicy",
            parameters: {
              tagName: { value: "environment" },
              tagValue: { value: "production" },
            },
          },
        ],
      };

      const policySet = new PolicySetDefinition(
        stack,
        "ParameterizedPolicy",
        props,
      );
      expect(
        policySet.props.policyDefinitions[0].parameters?.tagName.value,
      ).toBe("environment");
    });
  });

  // =============================================================================
  // Initiative Parameters
  // =============================================================================

  describe("Initiative Parameters", () => {
    it("should create initiative with parameter definitions", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Initiative With Parameters",
        scope: "/subscriptions/test-sub",
        parameters: {
          allowedLocations: {
            type: "Array",
            displayName: "Allowed Locations",
            description: "List of allowed Azure regions",
            defaultValue: ["eastus", "westus2"],
            allowedValues: [["eastus"], ["westus2"], ["eastus", "westus2"]],
          },
          requiredTag: {
            type: "String",
            displayName: "Required Tag",
            description: "Name of the required tag",
            defaultValue: "environment",
          },
        },
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
            parameters: {
              listOfAllowedLocations: {
                value: "[parameters('allowedLocations')]",
              },
            },
          },
        ],
      };

      const policySet = new PolicySetDefinition(stack, "WithParams", props);
      expect(policySet.props.parameters?.allowedLocations.type).toBe("Array");
      expect(policySet.props.parameters?.requiredTag.type).toBe("String");
    });

    it("should create initiative with strong typed parameter", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Strong Typed Parameters",
        scope: "/subscriptions/test-sub",
        parameters: {
          storageAccountSku: {
            type: "String",
            displayName: "Storage Account SKU",
            metadata: {
              strongType: "storageSkus",
              displayName: "Storage SKU",
            },
          },
        },
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      };

      const policySet = new PolicySetDefinition(
        stack,
        "StrongTypedParams",
        props,
      );
      expect(
        policySet.props.parameters?.storageAccountSku.metadata?.strongType,
      ).toBe("storageSkus");
    });
  });

  // =============================================================================
  // Policy Definition Groups
  // =============================================================================

  describe("Policy Definition Groups", () => {
    it("should create initiative with groups", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Grouped Policies Initiative",
        scope: "/subscriptions/test-sub",
        policyDefinitionGroups: [
          {
            name: "Security",
            displayName: "Security Policies",
            category: "Security Center",
            description: "Policies related to security",
          },
          {
            name: "Compliance",
            displayName: "Compliance Policies",
            category: "Regulatory Compliance",
          },
        ],
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
            groupNames: ["Security"],
          },
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-2",
            groupNames: ["Compliance"],
          },
        ],
      };

      const policySet = new PolicySetDefinition(
        stack,
        "GroupedPolicies",
        props,
      );
      expect(policySet.props.policyDefinitionGroups?.length).toBe(2);
      expect(policySet.props.policyDefinitionGroups?.[0].name).toBe("Security");
    });

    it("should allow policy definitions in multiple groups", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Multi-Group Policy Initiative",
        scope: "/subscriptions/test-sub",
        policyDefinitionGroups: [
          { name: "Security" },
          { name: "Compliance" },
          { name: "Operations" },
        ],
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
            groupNames: ["Security", "Compliance"],
          },
        ],
      };

      const policySet = new PolicySetDefinition(
        stack,
        "MultiGroupPolicy",
        props,
      );
      expect(policySet.props.policyDefinitions[0].groupNames?.length).toBe(2);
    });
  });

  // =============================================================================
  // Property Transformation
  // =============================================================================

  describe("Property Transformation", () => {
    it("should generate correct Azure API format via createResourceBody", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Transform Test Initiative",
        description: "Test transformation",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
            policyDefinitionReferenceId: "policy1",
          },
        ],
      };

      const policySet = new PolicySetDefinition(stack, "TransformTest", props);

      // Access the protected createResourceBody method
      const resourceBody = (policySet as any).createResourceBody(props);

      expect(resourceBody).toHaveProperty("properties");
      expect(resourceBody.properties).toHaveProperty(
        "displayName",
        "Transform Test Initiative",
      );
      expect(resourceBody.properties).toHaveProperty(
        "description",
        "Test transformation",
      );
      expect(resourceBody.properties).toHaveProperty("policyType", "Custom");
      expect(resourceBody.properties.policyDefinitions).toHaveLength(1);
    });

    it("should include metadata when specified", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Metadata Test",
        scope: "/subscriptions/test-sub",
        metadata: {
          category: "Testing",
          version: "2.0.0",
        },
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      };

      const policySet = new PolicySetDefinition(stack, "MetadataTest", props);
      const resourceBody = (policySet as any).createResourceBody(props);

      expect(resourceBody.properties.metadata).toBeDefined();
      expect(resourceBody.properties.metadata.category).toBe("Testing");
    });

    it("should include parameters when specified", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Parameters Test",
        scope: "/subscriptions/test-sub",
        parameters: {
          testParam: {
            type: "String",
            defaultValue: "test",
          },
        },
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      };

      const policySet = new PolicySetDefinition(stack, "ParametersTest", props);
      const resourceBody = (policySet as any).createResourceBody(props);

      expect(resourceBody.properties.parameters).toBeDefined();
      expect(resourceBody.properties.parameters.testParam.type).toBe("String");
    });

    it("should include policyDefinitionGroups when specified", () => {
      const props: PolicySetDefinitionProps = {
        displayName: "Groups Test",
        scope: "/subscriptions/test-sub",
        policyDefinitionGroups: [
          { name: "TestGroup", displayName: "Test Group" },
        ],
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
            groupNames: ["TestGroup"],
          },
        ],
      };

      const policySet = new PolicySetDefinition(stack, "GroupsTest", props);
      const resourceBody = (policySet as any).createResourceBody(props);

      expect(resourceBody.properties.policyDefinitionGroups).toBeDefined();
      expect(resourceBody.properties.policyDefinitionGroups).toHaveLength(1);
    });
  });

  // =============================================================================
  // Integration with Base Class
  // =============================================================================

  describe("Integration with Base Class", () => {
    it("should inherit from AzapiResource", () => {
      const policySet = new PolicySetDefinition(stack, "InheritanceTest", {
        displayName: "Inheritance Test",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      });

      // Verify it has AzapiResource properties
      expect(policySet).toHaveProperty("terraformResource");
      expect(policySet).toHaveProperty("resolvedApiVersion");
    });

    it("should have correct resourceType", () => {
      const policySet = new PolicySetDefinition(stack, "ResourceTypeTest", {
        displayName: "Resource Type Test",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      });

      // Access the protected resourceType method
      const resourceType = (policySet as any).resourceType();
      expect(resourceType).toBe("Microsoft.Authorization/policySetDefinitions");
    });

    it("should resolve parent ID correctly", () => {
      const scope = "/subscriptions/test-sub";

      const props: PolicySetDefinitionProps = {
        displayName: "Parent ID Test",
        scope,
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      };

      const policySet = new PolicySetDefinition(stack, "ParentIdTest", props);

      // Access the protected resolveParentId method
      const parentId = (policySet as any).resolveParentId(props);
      expect(parentId).toBe(scope);
    });

    it("should generate resource outputs", () => {
      const policySet = new PolicySetDefinition(stack, "OutputsTest", {
        displayName: "Outputs Test",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      });

      expect(policySet.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(policySet.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(policySet.policySetDefinitionIdOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
      expect(policySet.id).toMatch(/^\$\{.*\.id\}$/);
    });
  });

  // =============================================================================
  // CDK Terraform Integration
  // =============================================================================

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new PolicySetDefinition(stack, "SynthTest", {
        displayName: "Synth Test Initiative",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
            policyDefinitionReferenceId: "testPolicy",
          },
        ],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple policy sets in the same stack", () => {
      const policySet1 = new PolicySetDefinition(stack, "PolicySet1", {
        displayName: "Policy Set 1",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      });

      const policySet2 = new PolicySetDefinition(stack, "PolicySet2", {
        displayName: "Policy Set 2",
        scope: "/subscriptions/test-sub",
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-2",
          },
        ],
        apiVersion: "2021-06-01",
      });

      expect(policySet1.resolvedApiVersion).toBe("2023-04-01");
      expect(policySet2.resolvedApiVersion).toBe("2021-06-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  // =============================================================================
  // Complex Scenarios
  // =============================================================================

  describe("Complex Scenarios", () => {
    it("should handle comprehensive initiative configuration", () => {
      const props: PolicySetDefinitionProps = {
        name: "comprehensive-initiative",
        displayName: "Comprehensive Security & Compliance Initiative",
        description:
          "This initiative enforces security and compliance policies across the organization.",
        scope: "/providers/Microsoft.Management/managementGroups/my-mg",
        policyType: "Custom",
        metadata: {
          category: "Security Center",
          version: "3.0.0",
          preview: false,
          deprecated: false,
        },
        parameters: {
          allowedLocations: {
            type: "Array",
            displayName: "Allowed Locations",
            description: "The list of allowed Azure regions",
            defaultValue: ["eastus", "westus2", "centralus"],
            metadata: {
              strongType: "location",
              displayName: "Locations",
            },
          },
          requiredTagName: {
            type: "String",
            displayName: "Required Tag Name",
            defaultValue: "costCenter",
          },
          effect: {
            type: "String",
            displayName: "Effect",
            description: "The effect of the policy",
            defaultValue: "Audit",
            allowedValues: ["Audit", "Deny", "Disabled"],
          },
        },
        policyDefinitionGroups: [
          {
            name: "Security",
            displayName: "Security Policies",
            category: "Security Center",
            description: "Policies ensuring security best practices",
          },
          {
            name: "Compliance",
            displayName: "Compliance Policies",
            category: "Regulatory Compliance",
            description: "Policies for regulatory compliance",
          },
          {
            name: "Tagging",
            displayName: "Tagging Policies",
            category: "Tags",
            description: "Policies for consistent resource tagging",
          },
        ],
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c",
            policyDefinitionReferenceId: "allowedLocations",
            parameters: {
              listOfAllowedLocations: {
                value: "[parameters('allowedLocations')]",
              },
            },
            groupNames: ["Security", "Compliance"],
          },
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/96670d01-0a4d-4649-9c89-2d3abc0a5025",
            policyDefinitionReferenceId: "requireTag",
            parameters: {
              tagName: { value: "[parameters('requiredTagName')]" },
            },
            groupNames: ["Tagging"],
          },
          {
            policyDefinitionId:
              "/subscriptions/test-sub/providers/Microsoft.Authorization/policyDefinitions/custom-security-policy",
            policyDefinitionReferenceId: "customSecurityPolicy",
            parameters: {
              effect: { value: "[parameters('effect')]" },
            },
            groupNames: ["Security"],
          },
        ],
        tags: {
          environment: "production",
          team: "security",
          managedBy: "terraform-cdk",
        },
      };

      const policySet = new PolicySetDefinition(
        stack,
        "ComprehensiveConfig",
        props,
      );
      const resourceBody = (policySet as any).createResourceBody(props);

      expect(resourceBody.properties.displayName).toBe(
        "Comprehensive Security & Compliance Initiative",
      );
      expect(resourceBody.properties.policyType).toBe("Custom");
      expect(resourceBody.properties.metadata.category).toBe("Security Center");
      expect(resourceBody.properties.parameters.allowedLocations.type).toBe(
        "Array",
      );
      expect(resourceBody.properties.policyDefinitionGroups).toHaveLength(3);
      expect(resourceBody.properties.policyDefinitions).toHaveLength(3);
      expect(resourceBody.properties.policyDefinitions[0].groupNames).toContain(
        "Security",
      );
    });

    it("should handle management group scope", () => {
      const mgScope =
        "/providers/Microsoft.Management/managementGroups/my-management-group";

      const props: PolicySetDefinitionProps = {
        displayName: "Management Group Initiative",
        scope: mgScope,
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      };

      const policySet = new PolicySetDefinition(
        stack,
        "MgScopeInitiative",
        props,
      );
      const parentId = (policySet as any).resolveParentId(props);

      expect(parentId).toBe(mgScope);
    });

    it("should handle subscription scope", () => {
      const subScope = "/subscriptions/00000000-0000-0000-0000-000000000000";

      const props: PolicySetDefinitionProps = {
        displayName: "Subscription Initiative",
        scope: subScope,
        policyDefinitions: [
          {
            policyDefinitionId:
              "/providers/Microsoft.Authorization/policyDefinitions/policy-1",
          },
        ],
      };

      const policySet = new PolicySetDefinition(
        stack,
        "SubScopeInitiative",
        props,
      );
      const parentId = (policySet as any).resolveParentId(props);

      expect(parentId).toBe(subScope);
    });
  });
});
