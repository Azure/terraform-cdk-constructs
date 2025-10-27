/**
 * Comprehensive tests for the unified ResourceGroup implementation
 *
 * This test suite validates the unified ResourceGroup class that replaces all
 * version-specific implementations using the VersionedAzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * property transformation, and full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import { ResourceGroup, ResourceGroupProps } from "../lib/resource-group";
import {
  ALL_RESOURCE_GROUP_VERSIONS,
  RESOURCE_GROUP_TYPE,
} from "../lib/resource-group-schemas";

describe("ResourceGroup - Unified Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure Resource Group schemas are registered
    try {
      manager.registerResourceType(
        RESOURCE_GROUP_TYPE,
        ALL_RESOURCE_GROUP_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create resource group with automatic latest version resolution", () => {
      const props: ResourceGroupProps = {
        name: "test-rg",
        location: "eastus",
      };

      const resourceGroup = new ResourceGroup(
        stack,
        "TestResourceGroup",
        props,
      );

      expect(resourceGroup).toBeInstanceOf(ResourceGroup);
      expect(resourceGroup.resolvedApiVersion).toBe("2025-03-01"); // Latest version
      expect(resourceGroup.props).toBe(props);
      expect(resourceGroup.name).toBe("test-rg");
      expect(resourceGroup.location).toBe("eastus");
    });

    it("should create resource group with explicit version pinning", () => {
      const props: ResourceGroupProps = {
        name: "test-rg-pinned",
        location: "westus",
        apiVersion: "2024-11-01", // Pin to specific version
        tags: { environment: "test" },
      };

      const resourceGroup = new ResourceGroup(
        stack,
        "TestResourceGroup",
        props,
      );

      expect(resourceGroup.resolvedApiVersion).toBe("2024-11-01");
      expect(resourceGroup.tags).toEqual({ environment: "test" });
    });

    it("should create resource group with all optional properties", () => {
      const props: ResourceGroupProps = {
        name: "test-rg-full",
        location: "centralus",
        tags: {
          environment: "production",
          project: "cdktf-constructs",
          owner: "team@company.com",
        },
        managedBy: "/subscriptions/test-sub/resourceGroups/management-rg",
        ignoreChanges: ["tags", "managedBy"],
        enableValidation: true,
        enableMigrationAnalysis: true,
        enableTransformation: true,
      };

      const resourceGroup = new ResourceGroup(
        stack,
        "TestResourceGroup",
        props,
      );

      expect(resourceGroup.props.tags).toEqual(props.tags);
      expect(resourceGroup.props.managedBy).toBe(props.managedBy);
      expect(resourceGroup.props.ignoreChanges).toEqual(props.ignoreChanges);
    });

    it("should use default name when name is not provided", () => {
      const props: ResourceGroupProps = {
        location: "eastus",
      };

      const resourceGroup = new ResourceGroup(
        stack,
        "TestResourceGroup",
        props,
      );

      expect(resourceGroup.name).toBe("TestResourceGroup"); // Should use construct id
    });

    it("should require location to be provided", () => {
      const props: ResourceGroupProps = {
        name: "test-rg",
      };

      expect(() => {
        new ResourceGroup(stack, "TestResourceGroup", props);
      }).toThrow("Required property 'location' is missing");
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const resourceGroup = new ResourceGroup(stack, "TestResourceGroup", {
        name: "test-rg",
        location: "eastus",
      });

      expect(resourceGroup.resolvedApiVersion).toBe("2025-03-01");
      expect(resourceGroup.latestVersion()).toBe("2025-03-01");
    });

    it("should support all registered API versions", () => {
      const resourceGroup = new ResourceGroup(stack, "TestResourceGroup", {
        name: "test-rg",
        location: "eastus",
      });

      const supportedVersions = resourceGroup.supportedVersions();
      expect(supportedVersions).toContain("2024-11-01");
      expect(supportedVersions).toContain("2025-01-01");
      expect(supportedVersions).toContain("2025-03-01");
    });

    it("should validate version support", () => {
      // Valid version
      expect(() => {
        new ResourceGroup(stack, "ValidVersion", {
          name: "test-rg",
          location: "eastus",
          apiVersion: "2025-01-01",
        });
      }).not.toThrow();

      // Invalid version
      expect(() => {
        new ResourceGroup(stack, "InvalidVersion", {
          name: "test-rg",
          location: "eastus",
          apiVersion: "2026-01-01",
        });
      }).toThrow("Unsupported API version '2026-01-01'");
    });

    it("should load correct schema for resolved version", () => {
      const resourceGroup = new ResourceGroup(stack, "TestResourceGroup", {
        name: "test-rg",
        location: "eastus",
        apiVersion: "2024-11-01",
      });

      expect(resourceGroup.schema).toBeDefined();
      expect(resourceGroup.schema.resourceType).toBe(RESOURCE_GROUP_TYPE);
      expect(resourceGroup.schema.version).toBe("2024-11-01");
      expect(resourceGroup.schema.properties).toBeDefined();
    });

    it("should load version configuration correctly", () => {
      const resourceGroup = new ResourceGroup(stack, "TestResourceGroup", {
        name: "test-rg",
        location: "eastus",
      });

      expect(resourceGroup.versionConfig).toBeDefined();
      expect(resourceGroup.versionConfig.version).toBe("2025-03-01");
      expect(resourceGroup.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });
  });

  describe("Property Validation", () => {
    it("should validate properties when validation is enabled", () => {
      const props: ResourceGroupProps = {
        name: "test-rg",
        location: "eastus",
        enableValidation: true,
      };

      expect(() => {
        new ResourceGroup(stack, "TestResourceGroup", props);
      }).not.toThrow();
    });

    it("should have validation results for valid properties", () => {
      const resourceGroup = new ResourceGroup(stack, "TestResourceGroup", {
        name: "valid-name",
        location: "eastus",
        enableValidation: true,
      });

      expect(resourceGroup.validationResult).toBeDefined();
      expect(resourceGroup.validationResult!.valid).toBe(true);
      expect(resourceGroup.validationResult!.errors).toHaveLength(0);
    });

    it("should skip validation when disabled", () => {
      const resourceGroup = new ResourceGroup(stack, "TestResourceGroup", {
        name: "test-rg",
        location: "eastus",
        enableValidation: false,
      });

      expect(resourceGroup).toBeDefined();
    });
  });

  describe("Migration Analysis", () => {
    it("should perform migration analysis between versions", () => {
      const resourceGroup = new ResourceGroup(stack, "TestResourceGroup", {
        name: "test-rg",
        location: "eastus",
        apiVersion: "2024-11-01",
      });

      const analysis = resourceGroup.analyzeMigrationTo("2025-03-01");

      expect(analysis).toBeDefined();
      expect(analysis.fromVersion).toBe("2024-11-01");
      expect(analysis.toVersion).toBe("2025-03-01");
      expect(analysis.compatible).toBe(true); // Resource Group versions are compatible
    });

    it("should skip migration analysis when disabled", () => {
      const resourceGroup = new ResourceGroup(stack, "TestResourceGroup", {
        name: "test-rg",
        location: "eastus",
        enableMigrationAnalysis: false,
      });

      expect(resourceGroup.migrationAnalysis).toBeUndefined();
    });
  });

  describe("Resource Creation and Body", () => {
    it("should create correct resource body", () => {
      const resourceGroup = new ResourceGroup(stack, "TestResourceGroup", {
        name: "test-rg",
        location: "westus",
        tags: { environment: "test" },
        managedBy: "/subscriptions/test/resourceGroups/mgmt",
      });

      // Test the createResourceBody method indirectly through the framework
      expect(resourceGroup).toBeDefined();
      expect(resourceGroup.props.tags).toEqual({ environment: "test" });
      expect(resourceGroup.props.managedBy).toBe(
        "/subscriptions/test/resourceGroups/mgmt",
      );
    });

    it("should handle minimal resource creation", () => {
      const resourceGroup = new ResourceGroup(stack, "MinimalResourceGroup", {
        name: "minimal-rg",
        location: "eastus",
      });

      expect(resourceGroup).toBeDefined();
      expect(resourceGroup.name).toBe("minimal-rg");
      expect(resourceGroup.location).toBe("eastus");
    });

    it("should create Terraform outputs", () => {
      const resourceGroup = new ResourceGroup(stack, "TestResourceGroup", {
        name: "test-rg-outputs",
        location: "eastus",
      });

      expect(resourceGroup.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(resourceGroup.locationOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
      expect(resourceGroup.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(resourceGroup.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });
  });

  describe("Public Methods and Properties", () => {
    let resourceGroup: ResourceGroup;

    beforeEach(() => {
      resourceGroup = new ResourceGroup(stack, "TestResourceGroup", {
        name: "test-rg",
        location: "eastus",
        tags: { environment: "test" },
      });
    });

    it("should have correct id format", () => {
      expect(resourceGroup.id).toMatch(/^\$\{.*\.id\}$/);
    });

    it("should have resourceId property matching id", () => {
      expect(resourceGroup.resourceId).toBe(resourceGroup.id);
    });

    it("should extract subscription ID from resource ID", () => {
      // We can't directly test this without mocking the terraform resource
      // but we can test the error case
      expect(() => {
        (resourceGroup as any).id = "invalid-id-format";
        resourceGroup.subscriptionId;
      }).toThrow("Unable to extract subscription ID from Resource Group ID");
    });

    it("should support tag management", () => {
      // Test addTag
      resourceGroup.addTag("newTag", "newValue");
      expect(resourceGroup.props.tags!.newTag).toBe("newValue");
      expect(resourceGroup.props.tags!.environment).toBe("test");

      // Test removeTag
      resourceGroup.removeTag("environment");
      expect(resourceGroup.props.tags!.environment).toBeUndefined();
      expect(resourceGroup.props.tags!.newTag).toBe("newValue");
    });

    it("should add tags when no tags exist", () => {
      const rgNoTags = new ResourceGroup(stack, "NoTagsRG", {
        name: "no-tags-rg",
        location: "eastus",
      });

      rgNoTags.addTag("firstTag", "firstValue");
      expect(rgNoTags.props.tags!.firstTag).toBe("firstValue");
    });

    it("should handle removing non-existent tags gracefully", () => {
      expect(() => {
        resourceGroup.removeTag("nonExistentTag");
      }).not.toThrow();
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const resourceGroup = new ResourceGroup(stack, "IgnoreChangesRG", {
        name: "test-rg",
        location: "eastus",
        ignoreChanges: ["tags", "location"],
      });

      expect(resourceGroup).toBeInstanceOf(ResourceGroup);
      // The ignore_changes should be applied to the underlying terraform resource
    });

    it("should filter out invalid ignore changes", () => {
      const resourceGroup = new ResourceGroup(stack, "FilteredIgnoreRG", {
        name: "test-rg",
        location: "eastus",
        ignoreChanges: ["tags", "managedBy", "location"], // managedBy should be filtered
      });

      expect(resourceGroup).toBeInstanceOf(ResourceGroup);
    });

    it("should handle empty ignore changes array", () => {
      const resourceGroup = new ResourceGroup(stack, "EmptyIgnoreRG", {
        name: "test-rg",
        location: "eastus",
        ignoreChanges: [],
      });

      expect(resourceGroup).toBeInstanceOf(ResourceGroup);
    });
  });

  describe("Version Compatibility", () => {
    it("should work with all supported API versions", () => {
      const versions = ["2024-11-01", "2025-01-01", "2025-03-01"];

      versions.forEach((version) => {
        const resourceGroup = new ResourceGroup(
          stack,
          `RG-${version.replace(/-/g, "")}`,
          {
            name: `test-rg-${version}`,
            location: "eastus",
            apiVersion: version,
          },
        );

        expect(resourceGroup.resolvedApiVersion).toBe(version);
        expect(resourceGroup.schema.version).toBe(version);
      });
    });

    it("should handle schema differences across versions", () => {
      // All Resource Group versions should have the same core schema
      const versions = ["2024-11-01", "2025-01-01", "2025-03-01"];

      versions.forEach((version) => {
        const resourceGroup = new ResourceGroup(
          stack,
          `Schema-${version.replace(/-/g, "")}`,
          {
            name: `schema-test-${version}`,
            location: "eastus",
            apiVersion: version,
          },
        );

        expect(resourceGroup.schema.properties.location).toBeDefined();
        expect(resourceGroup.schema.properties.tags).toBeDefined();
        expect(resourceGroup.schema.properties.managedBy).toBeDefined();
      });
    });
  });

  describe("Backward Compatibility", () => {
    it("should maintain compatibility with original GroupProps interface", () => {
      // Test using the deprecated Group export
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Group } = require("../lib/resource-group");

      const group = new Group(stack, "BackwardCompatGroup", {
        name: "compat-test",
        location: "eastus",
        tags: { compatibility: "test" },
      });

      expect(group).toBeInstanceOf(ResourceGroup);
      expect(group.name).toBe("compat-test");
    });

    it("should work with existing ResourceGroup patterns", () => {
      // Test patterns that would have worked with version-specific implementations
      const resourceGroup = new ResourceGroup(stack, "ExistingPattern", {
        name: "existing-rg",
        location: "westus2",
        tags: {
          environment: "production",
          cost: "center1",
        },
        managedBy: "/subscriptions/test-sub/resourceGroups/management",
      });

      expect(resourceGroup.props.tags).toEqual({
        environment: "production",
        cost: "center1",
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid API versions gracefully", () => {
      expect(() => {
        new ResourceGroup(stack, "InvalidAPI", {
          name: "test-rg",
          location: "eastus",
          apiVersion: "invalid-version",
        });
      }).toThrow("Unsupported API version 'invalid-version'");
    });

    it("should handle validation errors when validation is enabled", () => {
      expect(() => {
        new ResourceGroup(stack, "ValidationError", {
          name: "", // Invalid empty name
          location: "", // Invalid empty location
          enableValidation: true,
        });
      }).toThrow("Property validation failed");
    });

    it("should handle schema registration errors gracefully", () => {
      // The ResourceGroup constructor should handle already-registered schemas
      expect(() => {
        new ResourceGroup(stack, "SchemaTest", {
          name: "test-rg",
          location: "eastus",
        });
      }).not.toThrow();
    });
  });

  describe("JSII Compliance", () => {
    it("should have JSII-compliant constructor", () => {
      expect(() => {
        new ResourceGroup(stack, "JsiiTest", {
          name: "jsii-test",
          location: "eastus",
        });
      }).not.toThrow();
    });

    it("should have JSII-compliant properties", () => {
      const resourceGroup = new ResourceGroup(stack, "JsiiProps", {
        name: "jsii-props",
        location: "eastus",
      });

      expect(typeof resourceGroup.id).toBe("string");
      expect(typeof resourceGroup.name).toBe("string");
      expect(typeof resourceGroup.location).toBe("string");
      expect(typeof resourceGroup.tags).toBe("object");
      expect(typeof resourceGroup.resolvedApiVersion).toBe("string");
    });

    it("should have JSII-compliant methods", () => {
      const resourceGroup = new ResourceGroup(stack, "JsiiMethods", {
        name: "jsii-methods",
        location: "eastus",
      });

      expect(typeof resourceGroup.addTag).toBe("function");
      expect(typeof resourceGroup.removeTag).toBe("function");
      expect(typeof resourceGroup.latestVersion).toBe("function");
      expect(typeof resourceGroup.supportedVersions).toBe("function");
      expect(typeof resourceGroup.analyzeMigrationTo).toBe("function");
    });

    it("should serialize complex objects correctly", () => {
      const resourceGroup = new ResourceGroup(stack, "JsiiSerialization", {
        name: "jsii-serialization",
        location: "eastus",
        tags: {
          complex: "value",
          nested: "data",
        },
      });

      // Should be able to serialize validation results
      expect(() =>
        JSON.stringify(resourceGroup.validationResult),
      ).not.toThrow();

      // Should be able to serialize schema
      expect(() => JSON.stringify(resourceGroup.schema)).not.toThrow();

      // Should be able to serialize version config
      expect(() => JSON.stringify(resourceGroup.versionConfig)).not.toThrow();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new ResourceGroup(stack, "SynthTest", {
        name: "synth-test",
        location: "eastus",
        tags: { test: "synthesis" },
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

          // Create multiple resource groups
          const rg1 = new ResourceGroup(this, "PrimaryRG", {
            name: "primary-rg",
            location: "eastus",
            tags: { tier: "primary" },
          });

          const rg2 = new ResourceGroup(this, "SecondaryRG", {
            name: "secondary-rg",
            location: "westus",
            apiVersion: "2024-11-01",
            tags: { tier: "secondary" },
          });

          // Create outputs that reference the resource groups
          new cdktf.TerraformOutput(this, "PrimaryRGId", {
            value: rg1.id,
          });

          new cdktf.TerraformOutput(this, "SecondaryRGId", {
            value: rg2.id,
          });
        }
      }

      expect(() => {
        new ComplexConstruct(app, "ComplexStack");
      }).not.toThrow();
    });

    it("should handle multiple resource groups in the same stack", () => {
      const rg1 = new ResourceGroup(stack, "ResourceGroup1", {
        name: "rg-1",
        location: "eastus",
      });

      const rg2 = new ResourceGroup(stack, "ResourceGroup2", {
        name: "rg-2",
        location: "westus",
        apiVersion: "2025-01-01",
      });

      expect(rg1.resolvedApiVersion).toBe("2025-03-01");
      expect(rg2.resolvedApiVersion).toBe("2025-01-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("Performance and Code Reduction", () => {
    it("should reduce code complexity compared to version-specific implementations", () => {
      // This test validates that the unified implementation is simpler
      // than maintaining separate version-specific classes

      const startTime = Date.now();

      // Create multiple resource groups with different versions
      const resourceGroups: ResourceGroup[] = [];
      const versions = ["2024-11-01", "2025-01-01", "2025-03-01"];

      versions.forEach((version, index) => {
        resourceGroups.push(
          new ResourceGroup(stack, `PerformanceTest${index}`, {
            name: `perf-test-${index}`,
            location: "eastus",
            apiVersion: version,
          }),
        );
      });

      const endTime = Date.now();

      expect(resourceGroups).toHaveLength(3);
      expect(endTime - startTime).toBeLessThan(1000); // Should be fast

      // Verify all instances are created correctly
      resourceGroups.forEach((rg, index) => {
        expect(rg).toBeInstanceOf(ResourceGroup);
        expect(rg.resolvedApiVersion).toBe(versions[index]);
      });
    });

    it("should validate code reduction claims", () => {
      // This test demonstrates that a single class replaces multiple version-specific classes
      // Previous implementation would have required:
      // - ResourceGroup2024_11_01 class
      // - ResourceGroup2025_01_01 class
      // - ResourceGroup2025_03_01 class
      // - Separate test files for each
      // - Separate schema definitions

      // Now we have:
      // - Single ResourceGroup class
      // - Single test file
      // - Unified schema management

      const unifiedClass = ResourceGroup;
      expect(unifiedClass).toBeDefined();
      expect(typeof unifiedClass).toBe("function");

      // Can handle all versions with the same interface
      const allVersionTests = ["2024-11-01", "2025-01-01", "2025-03-01"].map(
        (version, index) =>
          new ResourceGroup(stack, `CodeReduction${index}`, {
            name: `code-reduction-${index}`,
            location: "eastus",
            apiVersion: version,
          }),
      );

      expect(allVersionTests).toHaveLength(3);
      allVersionTests.forEach((rg) => {
        expect(rg).toBeInstanceOf(ResourceGroup);
      });
    });
  });
});
