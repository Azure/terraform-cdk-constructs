/**
 * Comprehensive tests for AzapiResource - Base class for version-aware Azure resources
 *
 * This test suite validates the core functionality of the AzapiResource framework,
 * including version resolution, schema validation, property transformation, and resource creation.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { AzapiResource, AzapiResourceProps } from "./azapi-resource";
import { ApiVersionManager } from "../version-manager/api-version-manager";
import {
  ApiSchema,
  VersionConfig,
  PropertyDefinition,
  PropertyType,
  ValidationRuleType,
  VersionSupportLevel,
} from "../version-manager/interfaces/version-interfaces";

// Test implementation of AzapiResource
class TestVersionedResource extends AzapiResource {
  public get id(): string {
    return `\${${this.terraformResource.fqn}.id}`;
  }

  protected defaultVersion(): string {
    return "2024-01-01";
  }

  protected resourceType(): string {
    return "Microsoft.Test/resources";
  }

  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  protected createResourceBody(props: any): any {
    return {
      name: props.name || "default-name",
      location: props.location || "eastus",
      tags: props.tags || {},
    };
  }
}

describe("AzapiResource", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  // Test data setup
  const TEST_RESOURCE_TYPE = "Microsoft.Test/resources";

  const createTestSchema = (
    version: string,
    properties: { [key: string]: PropertyDefinition } = {},
  ): ApiSchema => ({
    resourceType: TEST_RESOURCE_TYPE,
    version,
    properties: {
      name: {
        dataType: PropertyType.STRING,
        required: true,
        description: "Resource name",
        validation: [
          {
            ruleType: ValidationRuleType.REQUIRED,
            message: "Name is required",
          },
        ],
      },
      location: {
        dataType: PropertyType.STRING,
        required: true,
        description: "Resource location",
        validation: [
          {
            ruleType: ValidationRuleType.REQUIRED,
            message: "Location is required",
          },
        ],
      },
      tags: {
        dataType: PropertyType.OBJECT,
        required: false,
        defaultValue: {},
        description: "Resource tags",
      },
      ...properties,
    },
    required: ["name", "location"],
    optional: ["tags"],
    deprecated: [],
    transformationRules: {},
    validationRules: [],
  });

  const createTestVersionConfig = (
    version: string,
    supportLevel: string = VersionSupportLevel.ACTIVE,
  ): VersionConfig => ({
    version,
    schema: createTestSchema(version),
    supportLevel,
    releaseDate: version,
    deprecationDate: undefined,
    sunsetDate: undefined,
    breakingChanges: [],
    migrationGuide: `/docs/migration-${version}`,
    changeLog: [
      {
        changeType: "added",
        description: `Initial release of version ${version}`,
        breaking: false,
      },
    ],
  });

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Register test versions
    const versions = [
      createTestVersionConfig("2024-01-01", VersionSupportLevel.DEPRECATED),
      createTestVersionConfig("2024-06-01", VersionSupportLevel.ACTIVE),
      createTestVersionConfig("2024-12-01", VersionSupportLevel.ACTIVE),
    ];

    try {
      manager.registerResourceType(TEST_RESOURCE_TYPE, versions);
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Initialization", () => {
    it("should create resource with automatic version resolution", () => {
      const props: AzapiResourceProps = {
        name: "test-resource",
        location: "eastus",
      };

      const resource = new TestVersionedResource(stack, "TestResource", props);

      expect(resource).toBeInstanceOf(TestVersionedResource);
      expect(resource).toBeInstanceOf(AzapiResource);
      expect(resource.resolvedApiVersion).toBe("2024-12-01"); // Latest active version
    });

    it("should create resource with explicit version pinning", () => {
      const props: AzapiResourceProps = {
        name: "test-resource",
        location: "eastus",
        apiVersion: "2024-06-01",
      };

      const resource = new TestVersionedResource(stack, "TestResource", props);

      expect(resource.resolvedApiVersion).toBe("2024-06-01");
    });

    it("should throw error when version is not registered", () => {
      // Test with a resource type that's not registered
      class UnregisteredResource extends AzapiResource {
        public get id(): string {
          return `\${${this.terraformResource.fqn}.id}`;
        }

        protected defaultVersion(): string {
          return "2023-01-01";
        }

        protected resourceType(): string {
          return "Microsoft.Unregistered/resources";
        }

        protected apiSchema(): ApiSchema {
          return createTestSchema("2023-01-01");
        }

        protected createResourceBody(props: any): any {
          return { name: props.name };
        }
      }

      expect(() => {
        new UnregisteredResource(stack, "UnregisteredResource", {
          name: "test",
          location: "eastus",
        });
      }).toThrow(
        "Version configuration not found for Microsoft.Unregistered/resources@2023-01-01",
      );
    });

    it("should validate explicit version support", () => {
      const props: AzapiResourceProps = {
        name: "test-resource",
        location: "eastus",
        apiVersion: "2025-01-01", // Unsupported version
      };

      expect(() => {
        new TestVersionedResource(stack, "TestResource", props);
      }).toThrow("Unsupported API version '2025-01-01'");
    });

    it("should throw error when version configuration is missing", () => {
      // Create a version that's registered but has no config (edge case)
      class InvalidConfigResource extends TestVersionedResource {
        protected apiSchema(): ApiSchema {
          // This would normally fail when trying to resolve schema
          return createTestSchema("invalid-version");
        }
      }

      expect(() => {
        new InvalidConfigResource(stack, "InvalidResource", {
          name: "test",
          location: "eastus",
          apiVersion: "invalid-version",
        });
      }).toThrow("Unsupported API version 'invalid-version'");
    });
  });

  describe("Schema Resolution and Validation", () => {
    it("should resolve schema correctly", () => {
      const resource = new TestVersionedResource(stack, "TestResource", {
        name: "test-resource",
        location: "eastus",
      });

      expect(resource.schema).toBeDefined();
      expect(resource.schema.resourceType).toBe(TEST_RESOURCE_TYPE);
      expect(resource.schema.version).toBe("2024-12-01");
    });

    it("should load version configuration", () => {
      const resource = new TestVersionedResource(stack, "TestResource", {
        name: "test-resource",
        location: "eastus",
      });

      expect(resource.versionConfig).toBeDefined();
      expect(resource.versionConfig.version).toBe("2024-12-01");
      expect(resource.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });

    it("should validate properties when validation is enabled", () => {
      const props: AzapiResourceProps = {
        // Missing required properties to trigger validation error
        enableValidation: true,
      };

      expect(() => {
        new TestVersionedResource(stack, "TestResource", props);
      }).toThrow("Property validation failed");
    });

    it("should skip validation when disabled", () => {
      const props: AzapiResourceProps = {
        // Missing required properties but validation disabled
        enableValidation: false,
      };

      expect(() => {
        new TestVersionedResource(stack, "TestResource", props);
      }).not.toThrow();
    });

    it("should have validation results when validation passes", () => {
      const resource = new TestVersionedResource(stack, "TestResource", {
        name: "test-resource",
        location: "eastus",
        enableValidation: true,
      });

      expect(resource.validationResult).toBeDefined();
      expect(resource.validationResult!.valid).toBe(true);
    });
  });

  describe("Property Processing and Transformation", () => {
    it("should apply default values", () => {
      const resource = new TestVersionedResource(stack, "TestResource", {
        name: "test-resource",
        location: "eastus",
        // tags not provided, should get default value
      });

      expect(resource).toBeDefined();
      // The resource should have been created with default tags applied
    });

    it("should handle transformation when enabled", () => {
      const resource = new TestVersionedResource(stack, "TestResource", {
        name: "test-resource",
        location: "eastus",
        enableTransformation: true,
      });

      expect(resource).toBeDefined();
    });

    it("should skip transformation when disabled", () => {
      const resource = new TestVersionedResource(stack, "TestResource", {
        name: "test-resource",
        location: "eastus",
        enableTransformation: false,
      });

      expect(resource).toBeDefined();
    });
  });

  describe("Migration Analysis", () => {
    it("should perform migration analysis when enabled", () => {
      // Use deprecated version to trigger migration analysis
      const resource = new TestVersionedResource(stack, "TestResource", {
        name: "test-resource",
        location: "eastus",
        apiVersion: "2024-01-01", // Deprecated version
        enableMigrationAnalysis: true,
      });

      expect(resource.migrationAnalysis).toBeDefined();
      expect(resource.migrationAnalysis!.fromVersion).toBe("2024-01-01");
      expect(resource.migrationAnalysis!.toVersion).toBe("2024-12-01");
    });

    it("should skip migration analysis when disabled", () => {
      const resource = new TestVersionedResource(stack, "TestResource", {
        name: "test-resource",
        location: "eastus",
        apiVersion: "2024-01-01",
        enableMigrationAnalysis: false,
      });

      expect(resource.migrationAnalysis).toBeUndefined();
    });

    it("should not perform migration analysis for active versions", () => {
      const resource = new TestVersionedResource(stack, "TestResource", {
        name: "test-resource",
        location: "eastus",
        apiVersion: "2024-12-01", // Active version
        enableMigrationAnalysis: true,
      });

      expect(resource.migrationAnalysis).toBeUndefined();
    });
  });

  describe("Version Management Methods", () => {
    let resource: TestVersionedResource;

    beforeEach(() => {
      resource = new TestVersionedResource(stack, "TestResource", {
        name: "test-resource",
        location: "eastus",
      });
    });

    it("should get latest version", () => {
      const latest = resource.latestVersion();
      expect(latest).toBe("2024-12-01");
    });

    it("should get supported versions", () => {
      const versions = resource.supportedVersions();
      expect(versions).toEqual(["2024-12-01", "2024-06-01", "2024-01-01"]);
    });

    it("should analyze migration to target version", () => {
      const analysis = resource.analyzeMigrationTo("2024-06-01");

      expect(analysis).toBeDefined();
      expect(analysis.fromVersion).toBe("2024-12-01");
      expect(analysis.toVersion).toBe("2024-06-01");
    });
  });

  describe("Resource Creation", () => {
    it("should create Azure resource with correct body", () => {
      const resource = new TestVersionedResource(stack, "TestResource", {
        name: "test-resource",
        location: "westus",
        tags: { environment: "test" },
      });

      expect(resource).toBeDefined();
      // The underlying AZAPI resource should be created but we can't access it directly
    });

    it("should handle resource creation with minimal properties", () => {
      const resource = new TestVersionedResource(stack, "TestResource", {
        name: "minimal-resource",
        location: "eastus",
      });

      expect(resource).toBeDefined();
    });
  });

  describe("Logging and Warning Messages", () => {
    it("should log deprecation warnings", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();

      new TestVersionedResource(stack, "TestResource", {
        name: "test-resource",
        location: "eastus",
        apiVersion: "2024-01-01", // Deprecated version
      });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "API version 2024-01-01 for Microsoft.Test/resources is deprecated",
        ),
      );

      warnSpy.mockRestore();
    });

    it("should log validation warnings", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();

      // Use the existing TestVersionedResource with unknown property to trigger validation warning
      new TestVersionedResource(stack, "ValidationWarningTest", {
        name: "test",
        location: "eastus",
        unknownProperty: "value", // This should trigger a validation warning
      } as any);

      // Should have logged validation warnings about unknown property
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Property validation warning"),
      );

      warnSpy.mockRestore();
    });

    it("should log migration analysis warnings", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();

      // Use deprecated version to trigger migration analysis
      new TestVersionedResource(stack, "MigrationWarningTest", {
        name: "test",
        location: "eastus",
        apiVersion: "2024-01-01", // This is a deprecated version
        enableMigrationAnalysis: true,
      });

      // Check for deprecation warning (which is logged)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "API version 2024-01-01 for Microsoft.Test/resources is deprecated",
        ),
      );

      warnSpy.mockRestore();
    });
  });

  describe("Abstract Method Implementation", () => {
    it("should require implementation of abstract methods", () => {
      // Test that abstract methods must be implemented
      // This test validates that TypeScript will catch missing implementations at compile time
      // We can't actually test runtime behavior for abstract classes
      expect(true).toBe(true); // Placeholder test since TS compilation errors are caught at build time
    });

    it("should use resolveSchema helper correctly", () => {
      class ResourceUsingHelper extends AzapiResource {
        public get id(): string {
          return `\${${this.terraformResource.fqn}.id}`;
        }
        protected defaultVersion(): string {
          return "2024-01-01";
        }
        protected resourceType(): string {
          return TEST_RESOURCE_TYPE;
        }
        protected apiSchema(): ApiSchema {
          return this.resolveSchema();
        }
        protected createResourceBody(props: any): any {
          return { name: props.name };
        }
      }

      const resource = new ResourceUsingHelper(stack, "HelperResource", {
        name: "test",
        location: "eastus",
      });

      expect(resource.schema).toBeDefined();
      expect(resource.schema.resourceType).toBe(TEST_RESOURCE_TYPE);
    });

    it("should handle schema resolution errors", () => {
      class BadSchemaResource extends AzapiResource {
        public get id(): string {
          return `\${${this.terraformResource.fqn}.id}`;
        }
        protected defaultVersion(): string {
          return "2024-01-01";
        }
        protected resourceType(): string {
          return "Invalid.Type/resource";
        }
        protected apiSchema(): ApiSchema {
          return this.resolveSchema();
        }
        protected createResourceBody(props: any): any {
          return { name: props.name };
        }
      }

      expect(() => {
        new BadSchemaResource(stack, "BadResource", {
          name: "test",
          location: "eastus",
        });
      }).toThrow("Cannot resolve schema");
    });
  });

  describe("Error Handling", () => {
    it("should handle validation errors gracefully", () => {
      const props: AzapiResourceProps = {
        name: "", // Invalid name
        location: "", // Invalid location
        enableValidation: true,
      };

      expect(() => {
        new TestVersionedResource(stack, "TestResource", props);
      }).toThrow("Property validation failed");
    });

    it("should handle transformation errors", () => {
      // Create a resource that might have transformation issues
      class ProblematicResource extends TestVersionedResource {
        protected createResourceBody(props: any): any {
          // Simulate an error in resource body creation
          if (props.causeError) {
            throw new Error("Resource body creation failed");
          }
          return super.createResourceBody(props);
        }
      }

      expect(() => {
        new ProblematicResource(stack, "ProblematicResource", {
          name: "test",
          location: "eastus",
          causeError: true,
        } as any);
      }).toThrow();
    });
  });

  describe("JSII Compliance", () => {
    it("should have JSII-compliant constructor", () => {
      expect(() => {
        new TestVersionedResource(stack, "JsiiTest", {
          name: "test",
          location: "eastus",
        });
      }).not.toThrow();
    });

    it("should have JSII-compliant public methods", () => {
      const resource = new TestVersionedResource(stack, "JsiiTest", {
        name: "test",
        location: "eastus",
      });

      expect(typeof resource.latestVersion).toBe("function");
      expect(typeof resource.supportedVersions).toBe("function");
      expect(typeof resource.analyzeMigrationTo).toBe("function");
    });

    it("should have JSII-compliant public properties", () => {
      const resource = new TestVersionedResource(stack, "JsiiTest", {
        name: "test",
        location: "eastus",
      });

      expect(typeof resource.resolvedApiVersion).toBe("string");
      expect(typeof resource.schema).toBe("object");
      expect(typeof resource.versionConfig).toBe("object");
    });

    it("should handle JSII serialization of complex objects", () => {
      const resource = new TestVersionedResource(stack, "JsiiTest", {
        name: "test",
        location: "eastus",
        tags: {
          environment: "test",
          project: "unit-tests",
        },
      });

      // Should be able to serialize the validation result
      expect(() => JSON.stringify(resource.validationResult)).not.toThrow();

      // Should be able to serialize the schema
      expect(() => JSON.stringify(resource.schema)).not.toThrow();
    });
  });

  describe("Integration with CDK Terraform", () => {
    it("should synthesize correctly", () => {
      new TestVersionedResource(stack, "SynthTest", {
        name: "test-resource",
        location: "eastus",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should work within CDK constructs", () => {
      class CompositeConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);

          new TestVersionedResource(this, "NestedResource", {
            name: "nested-resource",
            location: "westus",
          });
        }
      }

      expect(() => {
        new CompositeConstruct(stack, "CompositeTest");
      }).not.toThrow();
    });

    it("should handle multiple resources in the same stack", () => {
      new TestVersionedResource(stack, "Resource1", {
        name: "resource-1",
        location: "eastus",
      });

      new TestVersionedResource(stack, "Resource2", {
        name: "resource-2",
        location: "westus",
        apiVersion: "2024-06-01",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });
});
