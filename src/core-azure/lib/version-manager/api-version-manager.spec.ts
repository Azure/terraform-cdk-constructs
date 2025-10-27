/**
 * Comprehensive tests for ApiVersionManager - Version management framework
 *
 * This test suite validates all functionality of the ApiVersionManager singleton,
 * including version registration, resolution, migration analysis, and lifecycle management.
 */

import { ApiVersionManager } from "./api-version-manager";
import {
  ApiSchema,
  VersionConfig,
  PropertyDefinition,
  PropertyType,
  ValidationRuleType,
  VersionSupportLevel,
  MigrationEffort,
  BreakingChangeType,
  VersionConstraints,
} from "./interfaces/version-interfaces";

describe("ApiVersionManager", () => {
  let manager: ApiVersionManager;

  // Test data setup
  const TEST_RESOURCE_TYPE = "Microsoft.Test/resources";
  const TEST_RESOURCE_TYPE_2 = "Microsoft.Test/resources2";

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
    // Get a fresh instance for each test
    manager = ApiVersionManager.instance();

    // Clear any existing registrations by creating a new instance
    // Note: In a real scenario, we'd want a way to reset the singleton for testing
    // For now, we'll work with the singleton nature
  });

  describe("Singleton Pattern", () => {
    it("should return the same instance on multiple calls", () => {
      const instance1 = ApiVersionManager.instance();
      const instance2 = ApiVersionManager.instance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(ApiVersionManager);
    });

    it("should be JSII compliant", () => {
      // Test that the singleton pattern works as expected for JSII
      expect(typeof ApiVersionManager.instance).toBe("function");
      expect(manager).toBeInstanceOf(ApiVersionManager);
    });
  });

  describe("Resource Type Registration", () => {
    it("should register a resource type with versions successfully", () => {
      const versions = [
        createTestVersionConfig("2024-01-01"),
        createTestVersionConfig("2024-06-01"),
      ];

      expect(() => {
        manager.registerResourceType(TEST_RESOURCE_TYPE, versions);
      }).not.toThrow();

      expect(manager.registeredResourceTypes()).toContain(TEST_RESOURCE_TYPE);
    });

    it("should validate resource type input", () => {
      expect(() => {
        manager.registerResourceType("", []);
      }).toThrow("Resource type cannot be empty");

      expect(() => {
        manager.registerResourceType("   ", []);
      }).toThrow("Resource type cannot be empty");

      expect(() => {
        manager.registerResourceType("valid-type", []);
      }).toThrow("Versions array cannot be empty");
    });

    it("should validate version configurations", () => {
      const invalidVersionConfig = {
        version: "",
        schema: createTestSchema("2024-01-01"),
        supportLevel: VersionSupportLevel.ACTIVE,
        releaseDate: "2024-01-01",
      } as VersionConfig;

      expect(() => {
        manager.registerResourceType(TEST_RESOURCE_TYPE, [
          invalidVersionConfig,
        ]);
      }).toThrow("Version string cannot be empty");
    });

    it("should detect duplicate versions", () => {
      const versions = [
        createTestVersionConfig("2024-01-01"),
        createTestVersionConfig("2024-01-01"), // Duplicate
      ];

      expect(() => {
        manager.registerResourceType(TEST_RESOURCE_TYPE, versions);
      }).toThrow("Duplicate version '2024-01-01' found");
    });

    it("should validate schema consistency", () => {
      const invalidSchema = {
        ...createTestSchema("2024-01-01"),
        resourceType: "Different.Type/resource", // Wrong resource type
      };

      const versionConfig = {
        ...createTestVersionConfig("2024-01-01"),
        schema: invalidSchema,
      };

      expect(() => {
        manager.registerResourceType(TEST_RESOURCE_TYPE, [versionConfig]);
      }).toThrow(
        "Schema resource type 'Different.Type/resource' does not match registered resource type",
      );
    });

    it("should validate schema version consistency", () => {
      const invalidSchema = createTestSchema("2024-06-01"); // Different version
      const versionConfig = {
        ...createTestVersionConfig("2024-01-01"),
        schema: invalidSchema,
      };

      expect(() => {
        manager.registerResourceType(TEST_RESOURCE_TYPE, [versionConfig]);
      }).toThrow(
        "Schema version '2024-06-01' does not match config version '2024-01-01'",
      );
    });

    it("should validate release date format", () => {
      const versionConfig = {
        ...createTestVersionConfig("2024-01-01"),
        releaseDate: "invalid-date",
      };

      expect(() => {
        manager.registerResourceType(TEST_RESOURCE_TYPE, [versionConfig]);
      }).toThrow("Invalid release date format 'invalid-date'");
    });
  });

  describe("Version Resolution", () => {
    beforeEach(() => {
      const versions = [
        createTestVersionConfig("2024-01-01", VersionSupportLevel.DEPRECATED),
        createTestVersionConfig("2024-06-01", VersionSupportLevel.ACTIVE),
        createTestVersionConfig("2024-12-01", VersionSupportLevel.ACTIVE),
      ];
      manager.registerResourceType(TEST_RESOURCE_TYPE, versions);
    });

    it("should return the latest active version", () => {
      const latest = manager.latestVersion(TEST_RESOURCE_TYPE);
      expect(latest).toBe("2024-12-01");
    });

    it("should return undefined for unregistered resource type", () => {
      const latest = manager.latestVersion("Unregistered.Type/resource");
      expect(latest).toBeUndefined();
    });

    it("should return all supported versions sorted by date", () => {
      const versions = manager.supportedVersions(TEST_RESOURCE_TYPE);
      expect(versions).toEqual(["2024-12-01", "2024-06-01", "2024-01-01"]);
    });

    it("should return empty array for unregistered resource type", () => {
      const versions = manager.supportedVersions("Unregistered.Type/resource");
      expect(versions).toEqual([]);
    });

    it("should validate version support correctly", () => {
      expect(
        manager.validateVersionSupport(TEST_RESOURCE_TYPE, "2024-06-01"),
      ).toBe(true);
      expect(
        manager.validateVersionSupport(TEST_RESOURCE_TYPE, "2024-01-01"),
      ).toBe(true);
      expect(
        manager.validateVersionSupport(TEST_RESOURCE_TYPE, "2025-01-01"),
      ).toBe(false);
      expect(
        manager.validateVersionSupport(
          "Unregistered.Type/resource",
          "2024-01-01",
        ),
      ).toBe(false);
    });
  });

  describe("Version Configuration Retrieval", () => {
    beforeEach(() => {
      const versions = [
        createTestVersionConfig("2024-01-01"),
        createTestVersionConfig("2024-06-01"),
      ];
      manager.registerResourceType(TEST_RESOURCE_TYPE, versions);
    });

    it("should return version configuration for existing version", () => {
      const config = manager.versionConfig(TEST_RESOURCE_TYPE, "2024-01-01");

      expect(config).toBeDefined();
      expect(config!.version).toBe("2024-01-01");
      expect(config!.supportLevel).toBe(VersionSupportLevel.ACTIVE);
      expect(config!.schema.resourceType).toBe(TEST_RESOURCE_TYPE);
    });

    it("should return undefined for non-existent version", () => {
      const config = manager.versionConfig(TEST_RESOURCE_TYPE, "2025-01-01");
      expect(config).toBeUndefined();
    });

    it("should return undefined for unregistered resource type", () => {
      const config = manager.versionConfig(
        "Unregistered.Type/resource",
        "2024-01-01",
      );
      expect(config).toBeUndefined();
    });
  });

  describe("Migration Analysis", () => {
    beforeEach(() => {
      // Create versions with breaking changes
      const version1 = createTestVersionConfig("2024-01-01");
      const version2 = {
        ...createTestVersionConfig("2024-06-01"),
        breakingChanges: [
          {
            changeType: BreakingChangeType.PROPERTY_REMOVED,
            property: "oldProperty",
            description: "Property oldProperty was removed",
            migrationPath: "Use newProperty instead",
          },
        ],
      };
      const version3 = {
        ...createTestVersionConfig("2024-12-01"),
        breakingChanges: [
          {
            changeType: BreakingChangeType.PROPERTY_TYPE_CHANGED,
            property: "name",
            oldValue: "string",
            newValue: "object",
            description: "Property name type changed from string to object",
            migrationPath: "Update name property to use object format",
          },
          {
            changeType: BreakingChangeType.SCHEMA_RESTRUCTURED,
            description: "Schema was completely restructured",
            migrationPath: "Follow migration guide for complete schema changes",
          },
        ],
      };

      manager.registerResourceType(TEST_RESOURCE_TYPE, [
        version1,
        version2,
        version3,
      ]);
    });

    it("should analyze migration between compatible versions", () => {
      const analysis = manager.analyzeMigration(
        TEST_RESOURCE_TYPE,
        "2024-01-01",
        "2024-01-01",
      );

      expect(analysis.fromVersion).toBe("2024-01-01");
      expect(analysis.toVersion).toBe("2024-01-01");
      expect(analysis.compatible).toBe(true);
      expect(analysis.breakingChanges).toHaveLength(0);
      expect(analysis.estimatedEffort).toBe(MigrationEffort.LOW);
      expect(analysis.automaticUpgradePossible).toBe(true);
    });

    it("should analyze migration with breaking changes", () => {
      const analysis = manager.analyzeMigration(
        TEST_RESOURCE_TYPE,
        "2024-01-01",
        "2024-06-01",
      );

      expect(analysis.fromVersion).toBe("2024-01-01");
      expect(analysis.toVersion).toBe("2024-06-01");
      expect(analysis.compatible).toBe(false);
      expect(analysis.breakingChanges).toHaveLength(1);
      expect(analysis.breakingChanges[0].changeType).toBe(
        BreakingChangeType.PROPERTY_REMOVED,
      );
      expect(analysis.estimatedEffort).toBe(MigrationEffort.LOW);
      expect(analysis.automaticUpgradePossible).toBe(false);
    });

    it("should analyze migration with multiple breaking changes", () => {
      const analysis = manager.analyzeMigration(
        TEST_RESOURCE_TYPE,
        "2024-01-01",
        "2024-12-01",
      );

      expect(analysis.fromVersion).toBe("2024-01-01");
      expect(analysis.toVersion).toBe("2024-12-01");
      expect(analysis.compatible).toBe(false);
      expect(analysis.breakingChanges).toHaveLength(3); // All breaking changes from versions 2 and 3
      expect(analysis.estimatedEffort).toBe(MigrationEffort.BREAKING);
      expect(analysis.automaticUpgradePossible).toBe(false);
    });

    it("should throw error for invalid version migration analysis", () => {
      expect(() => {
        manager.analyzeMigration(
          TEST_RESOURCE_TYPE,
          "invalid-version",
          "2024-01-01",
        );
      }).toThrow("Source version 'invalid-version' not found");

      expect(() => {
        manager.analyzeMigration(
          TEST_RESOURCE_TYPE,
          "2024-01-01",
          "invalid-version",
        );
      }).toThrow("Target version 'invalid-version' not found");

      expect(() => {
        manager.analyzeMigration(
          "Unregistered.Type/resource",
          "2024-01-01",
          "2024-06-01",
        );
      }).toThrow(
        "Source version '2024-01-01' not found for resource type 'Unregistered.Type/resource'",
      );
    });
  });

  describe("Version Lifecycle Management", () => {
    beforeEach(() => {
      const deprecatedVersion = {
        ...createTestVersionConfig(
          "2024-01-01",
          VersionSupportLevel.DEPRECATED,
        ),
        sunsetDate: "2025-01-01",
      };

      const activeVersion = createTestVersionConfig(
        "2024-06-01",
        VersionSupportLevel.ACTIVE,
      );

      manager.registerResourceType(TEST_RESOURCE_TYPE, [
        deprecatedVersion,
        activeVersion,
      ]);
    });

    it("should return version lifecycle information", () => {
      const lifecycle = manager.versionLifecycle(
        TEST_RESOURCE_TYPE,
        "2024-01-01",
      );

      expect(lifecycle).toBeDefined();
      expect(lifecycle!.version).toBe("2024-01-01");
      expect(lifecycle!.phase).toBe(VersionSupportLevel.DEPRECATED);
      expect(lifecycle!.transitionDate).toBe("2024-01-01");
      expect(lifecycle!.nextPhase).toBe(VersionSupportLevel.SUNSET);
      expect(lifecycle!.estimatedSunsetDate).toBe("2025-01-01");
    });

    it("should return undefined for non-existent version lifecycle", () => {
      const lifecycle = manager.versionLifecycle(
        TEST_RESOURCE_TYPE,
        "invalid-version",
      );
      expect(lifecycle).toBeUndefined();
    });

    it("should generate migration warnings for deprecated versions", () => {
      const analysis = manager.analyzeMigration(
        TEST_RESOURCE_TYPE,
        "2024-01-01",
        "2024-06-01",
      );

      expect(analysis.warnings).toContain(
        "Source version '2024-01-01' is deprecated. Consider migrating to avoid future compatibility issues.",
      );
    });
  });

  describe("Version Constraints and Selection", () => {
    beforeEach(() => {
      const versions = [
        createTestVersionConfig("2023-01-01", VersionSupportLevel.DEPRECATED),
        createTestVersionConfig("2024-01-01", VersionSupportLevel.MAINTENANCE),
        createTestVersionConfig("2024-06-01", VersionSupportLevel.ACTIVE),
        createTestVersionConfig("2024-12-01", VersionSupportLevel.ACTIVE),
      ];
      manager.registerResourceType(TEST_RESOURCE_TYPE, versions);
    });

    it("should find version by support level constraint", () => {
      const constraints: VersionConstraints = {
        supportLevel: VersionSupportLevel.ACTIVE,
      };

      const version = manager._findVersionByConstraints(
        TEST_RESOURCE_TYPE,
        constraints,
      );
      expect(version).toBe("2024-12-01"); // Latest active version
    });

    it("should find version excluding deprecated", () => {
      const constraints: VersionConstraints = {
        excludeDeprecated: true,
      };

      const version = manager._findVersionByConstraints(
        TEST_RESOURCE_TYPE,
        constraints,
      );
      expect(version).toBe("2024-12-01"); // Latest non-deprecated version
    });

    it("should find version with date constraint", () => {
      const constraints: VersionConstraints = {
        notOlderThan: new Date("2024-06-01"),
      };

      const version = manager._findVersionByConstraints(
        TEST_RESOURCE_TYPE,
        constraints,
      );
      expect(version).toBe("2024-12-01"); // Latest version after date
    });

    it("should return undefined when no version matches constraints", () => {
      const constraints: VersionConstraints = {
        supportLevel: "non-existent-level",
      };

      const version = manager._findVersionByConstraints(
        TEST_RESOURCE_TYPE,
        constraints,
      );
      expect(version).toBeUndefined();
    });

    it("should return undefined for unregistered resource type", () => {
      const constraints: VersionConstraints = {
        supportLevel: VersionSupportLevel.ACTIVE,
      };

      const version = manager._findVersionByConstraints(
        "Unregistered.Type/resource",
        constraints,
      );
      expect(version).toBeUndefined();
    });
  });

  describe("Migration Effort Calculation", () => {
    it("should calculate low effort for no breaking changes", () => {
      const versions = [
        createTestVersionConfig("2024-01-01"),
        createTestVersionConfig("2024-06-01"),
      ];
      manager.registerResourceType(TEST_RESOURCE_TYPE, versions);

      const analysis = manager.analyzeMigration(
        TEST_RESOURCE_TYPE,
        "2024-01-01",
        "2024-06-01",
      );
      expect(analysis.estimatedEffort).toBe(MigrationEffort.LOW);
    });

    it("should calculate medium effort for few breaking changes", () => {
      const version1 = createTestVersionConfig("2024-01-01");
      const version2 = {
        ...createTestVersionConfig("2024-06-01"),
        breakingChanges: [
          {
            changeType: BreakingChangeType.PROPERTY_RENAMED,
            property: "oldName",
            newValue: "newName",
            description: "Property renamed",
          },
          {
            changeType: BreakingChangeType.PROPERTY_RENAMED,
            property: "oldName2",
            newValue: "newName2",
            description: "Another property renamed",
          },
          {
            changeType: BreakingChangeType.PROPERTY_RENAMED,
            property: "oldName3",
            newValue: "newName3",
            description: "Third property renamed",
          },
        ],
      };

      manager.registerResourceType(TEST_RESOURCE_TYPE, [version1, version2]);

      const analysis = manager.analyzeMigration(
        TEST_RESOURCE_TYPE,
        "2024-01-01",
        "2024-06-01",
      );
      expect(analysis.estimatedEffort).toBe(MigrationEffort.MEDIUM);
    });

    it("should calculate breaking effort for schema restructure", () => {
      const version1 = createTestVersionConfig("2024-01-01");
      const version2 = {
        ...createTestVersionConfig("2024-06-01"),
        breakingChanges: [
          {
            changeType: BreakingChangeType.SCHEMA_RESTRUCTURED,
            description: "Complete schema restructure",
          },
        ],
      };

      manager.registerResourceType(TEST_RESOURCE_TYPE, [version1, version2]);

      const analysis = manager.analyzeMigration(
        TEST_RESOURCE_TYPE,
        "2024-01-01",
        "2024-06-01",
      );
      expect(analysis.estimatedEffort).toBe(MigrationEffort.BREAKING);
    });
  });

  describe("Multiple Resource Types", () => {
    it("should handle multiple resource types independently", () => {
      const versions1 = [createTestVersionConfig("2024-01-01")];
      const versions2 = [
        {
          ...createTestVersionConfig("2024-06-01"),
          schema: {
            ...createTestSchema("2024-06-01"),
            resourceType: TEST_RESOURCE_TYPE_2,
          },
        },
      ];

      manager.registerResourceType(TEST_RESOURCE_TYPE, versions1);
      manager.registerResourceType(TEST_RESOURCE_TYPE_2, versions2);

      expect(manager.registeredResourceTypes()).toContain(TEST_RESOURCE_TYPE);
      expect(manager.registeredResourceTypes()).toContain(TEST_RESOURCE_TYPE_2);

      expect(manager.latestVersion(TEST_RESOURCE_TYPE)).toBe("2024-01-01");
      expect(manager.latestVersion(TEST_RESOURCE_TYPE_2)).toBe("2024-06-01");
    });

    it("should return all registered resource types", () => {
      const versions = [createTestVersionConfig("2024-01-01")];
      manager.registerResourceType(TEST_RESOURCE_TYPE, versions);

      const resourceTypes = manager.registeredResourceTypes();
      expect(Array.isArray(resourceTypes)).toBe(true);
      expect(resourceTypes.length).toBeGreaterThan(0);
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle empty version arrays gracefully", () => {
      expect(() => {
        manager.registerResourceType(TEST_RESOURCE_TYPE, []);
      }).toThrow("Versions array cannot be empty");
    });

    it("should handle null/undefined version configurations", () => {
      expect(() => {
        manager.registerResourceType(TEST_RESOURCE_TYPE, [null as any]);
      }).toThrow();
    });

    it("should handle invalid schema objects", () => {
      const invalidVersionConfig = {
        version: "2024-01-01",
        schema: null as any,
        supportLevel: VersionSupportLevel.ACTIVE,
        releaseDate: "2024-01-01",
      };

      expect(() => {
        manager.registerResourceType(TEST_RESOURCE_TYPE, [
          invalidVersionConfig,
        ]);
      }).toThrow("Schema is required");
    });

    it("should handle migration analysis with same from/to versions", () => {
      const versions = [createTestVersionConfig("2024-01-01")];
      manager.registerResourceType(TEST_RESOURCE_TYPE, versions);

      const analysis = manager.analyzeMigration(
        TEST_RESOURCE_TYPE,
        "2024-01-01",
        "2024-01-01",
      );
      expect(analysis.compatible).toBe(true);
      expect(analysis.breakingChanges).toHaveLength(0);
    });
  });

  describe("JSII Compliance", () => {
    it("should have JSII-compliant method signatures", () => {
      // Test that all public methods are accessible and have expected signatures
      expect(typeof manager.registerResourceType).toBe("function");
      expect(typeof manager.latestVersion).toBe("function");
      expect(typeof manager.versionConfig).toBe("function");
      expect(typeof manager.supportedVersions).toBe("function");
      expect(typeof manager.analyzeMigration).toBe("function");
      expect(typeof manager.validateVersionSupport).toBe("function");
      expect(typeof manager.registeredResourceTypes).toBe("function");
      expect(typeof manager.versionLifecycle).toBe("function");
    });

    it("should return JSII-compliant types", () => {
      const versions = [createTestVersionConfig("2024-01-01")];
      manager.registerResourceType(TEST_RESOURCE_TYPE, versions);

      // Test return types
      const latest = manager.latestVersion(TEST_RESOURCE_TYPE);
      expect(typeof latest === "string" || latest === undefined).toBe(true);

      const supportedVersions = manager.supportedVersions(TEST_RESOURCE_TYPE);
      expect(Array.isArray(supportedVersions)).toBe(true);

      const isSupported = manager.validateVersionSupport(
        TEST_RESOURCE_TYPE,
        "2024-01-01",
      );
      expect(typeof isSupported).toBe("boolean");

      const resourceTypes = manager.registeredResourceTypes();
      expect(Array.isArray(resourceTypes)).toBe(true);
    });
  });
});
