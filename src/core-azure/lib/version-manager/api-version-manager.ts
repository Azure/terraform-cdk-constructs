/**
 * ApiVersionManager - A JSII-compliant singleton for managing Azure API versions
 *
 * This class provides centralized version management for Azure resources, including:
 * - Version registry and metadata storage
 * - Version resolution and compatibility analysis
 * - Migration analysis between versions
 * - Thread-safe singleton operations
 *
 * The singleton pattern is implemented in a JSII-compliant way using instance methods
 * rather than static classes to ensure multi-language compatibility.
 *
 * @packageDocumentation
 */

import {
  VersionConfig,
  MigrationAnalysis,
  BreakingChange,
  VersionSupportLevel,
  MigrationEffort,
  VersionLifecycle,
  VersionConstraints,
  BreakingChangeType,
} from "./interfaces/version-interfaces";

/**
 * Registry entry for a resource type containing all version configurations
 */
interface ResourceTypeRegistry {
  readonly resourceType: string;
  readonly versions: { [version: string]: VersionConfig };
  readonly latestVersion?: string;
}

/**
 * ApiVersionManager singleton class for centralized version management
 *
 * This class manages API versions for Azure resources, providing version resolution,
 * compatibility analysis, and migration guidance. It implements a JSII-compliant
 * singleton pattern for thread-safe operations across multiple language bindings.
 *
 * Key Features:
 * - Thread-safe singleton implementation
 * - Version registry management with full lifecycle support
 * - Advanced version resolution with constraint-based selection
 * - Comprehensive migration analysis with effort estimation
 * - Extensive validation and error handling
 *
 * @example
 * const manager = ApiVersionManager.getInstance();
 * manager.registerResourceType('Microsoft.Resources/resourceGroups', versions);
 * const latest = manager.getLatestVersion('Microsoft.Resources/resourceGroups');
 * const analysis = manager.analyzeMigration('Microsoft.Resources/resourceGroups', '2024-01-01', '2024-11-01');
 *
 * @stability stable
 */
export class ApiVersionManager {
  /**
   * Gets the singleton instance of ApiVersionManager
   *
   * This method implements a thread-safe singleton pattern that's compatible
   * with JSII multi-language bindings. The instance is lazily created on
   * first access and reused for all subsequent calls.
   *
   * @returns The singleton ApiVersionManager instance
   *
   * @example
   * const manager = ApiVersionManager.instance();
   */
  public static instance(): ApiVersionManager {
    if (!ApiVersionManager._instance) {
      ApiVersionManager._instance = new ApiVersionManager();
    }
    return ApiVersionManager._instance;
  }

  private static _instance: ApiVersionManager | undefined;
  private readonly _resourceRegistry: {
    [resourceType: string]: ResourceTypeRegistry;
  };

  /**
   * Private constructor to enforce singleton pattern
   * Initializes the internal registries and data structures
   */
  private constructor() {
    this._resourceRegistry = {};
  }

  /**
   * Registers a resource type with its version configurations
   *
   * This method stores version metadata for a specific Azure resource type,
   * including schemas, lifecycle information, and migration data. It validates
   * the input and maintains internal indexes for efficient lookups.
   *
   * @param resourceType - The Azure resource type (e.g., 'Microsoft.Resources/resourceGroups')
   * @param versions - Array of version configurations for the resource type
   *
   * @throws Error if resourceType is empty or versions array is empty
   * @throws Error if duplicate versions are found in the versions array
   * @throws Error if version configurations are invalid
   *
   * @example
   * manager.registerResourceType('Microsoft.Resources/resourceGroups', [
   *   {
   *     version: '2024-01-01',
   *     schema: { resourceType: 'Microsoft.Resources/resourceGroups', version: '2024-01-01', properties: {}, required: [] },
   *     supportLevel: VersionSupportLevel.ACTIVE,
   *     releaseDate: '2024-01-01'
   *   }
   * ]);
   */
  public registerResourceType(
    resourceType: string,
    versions: VersionConfig[],
  ): void {
    this._validateResourceTypeInput(resourceType, versions);

    const versionMap: { [version: string]: VersionConfig } = {};
    let latestVersion: string | undefined;
    let latestReleaseDate = new Date(0); // Start with epoch

    // Process and validate each version
    for (const versionConfig of versions) {
      this._validateVersionConfig(versionConfig, resourceType);

      // Check for duplicate versions
      if (versionConfig.version in versionMap) {
        throw new Error(
          `Duplicate version '${versionConfig.version}' found for resource type '${resourceType}'`,
        );
      }

      versionMap[versionConfig.version] = versionConfig;

      // Track the latest version based on release date and support level
      const releaseDate = new Date(versionConfig.releaseDate);
      if (
        releaseDate >= latestReleaseDate &&
        versionConfig.supportLevel === VersionSupportLevel.ACTIVE
      ) {
        latestVersion = versionConfig.version;
        latestReleaseDate = releaseDate;
      }
    }

    // Store the registry entry
    const registryEntry: ResourceTypeRegistry = {
      resourceType,
      versions: versionMap,
      latestVersion,
    };

    this._resourceRegistry[resourceType] = registryEntry;
  }

  /**
   * Gets the latest active version for a resource type
   *
   * Returns the most recent version with ACTIVE support level. If no active
   * versions are found, returns the most recent version regardless of support level.
   *
   * @param resourceType - The Azure resource type to get the latest version for
   * @returns The latest version string, or undefined if the resource type is not registered
   *
   * @example
   * const latest = manager.latestVersion('Microsoft.Resources/resourceGroups');
   * // Returns: "2024-11-01"
   */
  public latestVersion(resourceType: string): string | undefined {
    const registry = this._resourceRegistry[resourceType];
    if (!registry) {
      return undefined;
    }

    return registry.latestVersion;
  }

  /**
   * Gets the configuration for a specific version of a resource type
   *
   * Retrieves the complete version configuration including schema, lifecycle
   * information, breaking changes, and migration metadata.
   *
   * @param resourceType - The Azure resource type
   * @param version - The specific version to retrieve
   * @returns The version configuration, or undefined if not found
   *
   * @example
   * const config = manager.versionConfig('Microsoft.Resources/resourceGroups', '2024-01-01');
   * if (config) {
   *   console.log(`Support level: ${config.supportLevel}`);
   *   console.log(`Release date: ${config.releaseDate}`);
   * }
   */
  public versionConfig(
    resourceType: string,
    version: string,
  ): VersionConfig | undefined {
    const registry = this._resourceRegistry[resourceType];
    if (!registry) {
      return undefined;
    }

    return registry.versions[version];
  }

  /**
   * Gets all supported versions for a resource type
   *
   * Returns an array of all registered version strings for the specified
   * resource type, sorted by release date (newest first).
   *
   * @param resourceType - The Azure resource type
   * @returns Array of supported version strings, empty if resource type not registered
   *
   * @example
   * const versions = manager.supportedVersions('Microsoft.Resources/resourceGroups');
   * // Returns: ["2024-11-01", "2024-01-01", "2023-07-01"]
   */
  public supportedVersions(resourceType: string): string[] {
    const registry = this._resourceRegistry[resourceType];
    if (!registry) {
      return [];
    }

    // Sort versions by release date (newest first)
    return Object.values(registry.versions)
      .sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
      )
      .map((config) => config.version);
  }

  /**
   * Analyzes migration requirements between two versions
   *
   * Performs comprehensive analysis of the migration path between source and
   * target versions, including compatibility assessment, breaking changes
   * identification, effort estimation, and upgrade feasibility.
   *
   * @param resourceType - The Azure resource type
   * @param fromVersion - The source version to migrate from
   * @param toVersion - The target version to migrate to
   * @returns Detailed migration analysis results
   *
   * @throws Error if either version is not registered for the resource type
   * @throws Error if resourceType is not registered
   *
   * @example
   * const analysis = manager.analyzeMigration(
   *   'Microsoft.Resources/resourceGroups',
   *   '2024-01-01',
   *   '2024-11-01'
   * );
   *
   * console.log(`Compatible: ${analysis.compatible}`);
   * console.log(`Effort: ${analysis.estimatedEffort}`);
   * console.log(`Breaking changes: ${analysis.breakingChanges.length}`);
   */
  public analyzeMigration(
    resourceType: string,
    fromVersion: string,
    toVersion: string,
  ): MigrationAnalysis {
    // Validate inputs and get configurations
    const fromConfig = this.versionConfig(resourceType, fromVersion);
    const toConfig = this.versionConfig(resourceType, toVersion);

    if (!fromConfig) {
      throw new Error(
        `Source version '${fromVersion}' not found for resource type '${resourceType}'`,
      );
    }

    if (!toConfig) {
      throw new Error(
        `Target version '${toVersion}' not found for resource type '${resourceType}'`,
      );
    }

    // Analyze compatibility and changes
    const allBreakingChanges = this._collectBreakingChanges(
      resourceType,
      fromVersion,
      toVersion,
    );
    const compatible = allBreakingChanges.length === 0;
    const warnings = this._generateMigrationWarnings(fromConfig, toConfig);
    const estimatedEffort = this._calculateMigrationEffort(allBreakingChanges);
    const automaticUpgradePossible = this._canAutoUpgrade(allBreakingChanges);

    return {
      fromVersion,
      toVersion,
      compatible,
      breakingChanges: allBreakingChanges,
      warnings,
      estimatedEffort,
      automaticUpgradePossible,
    };
  }

  /**
   * Validates whether a version is supported for a resource type
   *
   * Checks if the specified version is registered and available for use
   * with the given resource type.
   *
   * @param resourceType - The Azure resource type
   * @param version - The version to validate
   * @returns True if the version is supported, false otherwise
   *
   * @example
   * if (manager.validateVersionSupport('Microsoft.Resources/resourceGroups', '2024-01-01')) {
   *   // Version is supported, proceed with resource creation
   * } else {
   *   // Handle unsupported version
   * }
   */
  public validateVersionSupport(
    resourceType: string,
    version: string,
  ): boolean {
    const registry = this._resourceRegistry[resourceType];
    if (!registry) {
      return false;
    }

    return version in registry.versions;
  }

  /**
   * Gets all registered resource types
   *
   * Returns an array of all Azure resource types that have been registered
   * with the version manager.
   *
   * @returns Array of registered resource type strings
   *
   * @example
   * const resourceTypes = manager.registeredResourceTypes();
   * // Returns: ["Microsoft.Resources/resourceGroups", "Microsoft.Storage/storageAccounts", ...]
   */
  public registeredResourceTypes(): string[] {
    return Object.keys(this._resourceRegistry);
  }

  /**
   * Gets version lifecycle information for a specific version
   *
   * Provides lifecycle metadata including current phase, transition dates,
   * and projected sunset timeline.
   *
   * @param resourceType - The Azure resource type
   * @param version - The version to get lifecycle information for
   * @returns Version lifecycle information, or undefined if not found
   *
   * @example
   * const lifecycle = manager.versionLifecycle('Microsoft.Resources/resourceGroups', '2024-01-01');
   * if (lifecycle) {
   *   console.log(`Current phase: ${lifecycle.phase}`);
   *   console.log(`Sunset date: ${lifecycle.estimatedSunsetDate}`);
   * }
   */
  public versionLifecycle(
    resourceType: string,
    version: string,
  ): VersionLifecycle | undefined {
    const config = this.versionConfig(resourceType, version);
    if (!config) {
      return undefined;
    }

    return {
      version: config.version,
      phase: config.supportLevel,
      transitionDate: config.releaseDate,
      nextPhase: this._determineNextPhase(config.supportLevel),
      estimatedSunsetDate: config.sunsetDate,
    };
  }

  /**
   * Finds the best version matching the given constraints
   *
   * Selects the optimal version for a resource type based on specified
   * constraints such as support level, feature requirements, and age limits.
   *
   * @param resourceType - The Azure resource type
   * @param constraints - Version selection constraints
   * @returns The best matching version, or undefined if no version matches
   * @internal
   *
   * @example
   * const version = manager._findVersionByConstraints('Microsoft.Resources/resourceGroups', {
   *   supportLevel: VersionSupportLevel.ACTIVE,
   *   excludeDeprecated: true,
   *   notOlderThan: new Date('2024-01-01')
   * });
   */
  public _findVersionByConstraints(
    resourceType: string,
    constraints: VersionConstraints,
  ): string | undefined {
    const registry = this._resourceRegistry[resourceType];
    if (!registry) {
      return undefined;
    }

    const candidates = Object.values(registry.versions).filter((config) => {
      // Check support level constraint
      if (
        constraints.supportLevel &&
        config.supportLevel !== constraints.supportLevel
      ) {
        return false;
      }

      // Check exclude deprecated constraint
      if (
        constraints.excludeDeprecated !== false &&
        config.supportLevel === VersionSupportLevel.DEPRECATED
      ) {
        return false;
      }

      // Check age constraint
      if (constraints.notOlderThan) {
        const releaseDate = new Date(config.releaseDate);
        if (releaseDate < constraints.notOlderThan) {
          return false;
        }
      }

      // Check required features (simplified check)
      if (
        constraints.requiredFeatures &&
        constraints.requiredFeatures.length > 0
      ) {
        // This would need to be implemented based on feature metadata
        // For now, we assume all versions support all features
      }

      return true;
    });

    if (candidates.length === 0) {
      return undefined;
    }

    // Sort by release date and return the newest
    candidates.sort(
      (a, b) =>
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
    );
    return candidates[0].version;
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Validates resource type and versions input
   */
  private _validateResourceTypeInput(
    resourceType: string,
    versions: VersionConfig[],
  ): void {
    if (!resourceType || resourceType.trim().length === 0) {
      throw new Error("Resource type cannot be empty");
    }

    if (!versions || versions.length === 0) {
      throw new Error("Versions array cannot be empty");
    }
  }

  /**
   * Validates a single version configuration
   */
  private _validateVersionConfig(
    config: VersionConfig,
    resourceType: string,
  ): void {
    if (!config.version || config.version.trim().length === 0) {
      throw new Error(
        `Version string cannot be empty for resource type '${resourceType}'`,
      );
    }

    if (!config.schema) {
      throw new Error(
        `Schema is required for version '${config.version}' of resource type '${resourceType}'`,
      );
    }

    if (config.schema.resourceType !== resourceType) {
      throw new Error(
        `Schema resource type '${config.schema.resourceType}' does not match registered resource type '${resourceType}'`,
      );
    }

    if (config.schema.version !== config.version) {
      throw new Error(
        `Schema version '${config.schema.version}' does not match config version '${config.version}'`,
      );
    }

    if (!config.supportLevel) {
      throw new Error(
        `Support level is required for version '${config.version}' of resource type '${resourceType}'`,
      );
    }

    if (!config.releaseDate || config.releaseDate.trim().length === 0) {
      throw new Error(
        `Release date is required for version '${config.version}' of resource type '${resourceType}'`,
      );
    }

    // Validate date format
    if (isNaN(new Date(config.releaseDate).getTime())) {
      throw new Error(
        `Invalid release date format '${config.releaseDate}' for version '${config.version}' of resource type '${resourceType}'`,
      );
    }
  }

  /**
   * Collects all breaking changes between two versions
   */
  private _collectBreakingChanges(
    resourceType: string,
    fromVersion: string,
    toVersion: string,
  ): BreakingChange[] {
    const registry = this._resourceRegistry[resourceType];
    if (!registry) {
      return [];
    }

    const allVersions = Object.values(registry.versions).sort(
      (a, b) =>
        new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
    );

    const fromIndex = allVersions.findIndex((v) => v.version === fromVersion);
    const toIndex = allVersions.findIndex((v) => v.version === toVersion);

    if (fromIndex === -1 || toIndex === -1) {
      return [];
    }

    const breakingChanges: BreakingChange[] = [];

    // Collect breaking changes from all versions between fromVersion and toVersion
    for (let i = fromIndex + 1; i <= toIndex; i++) {
      const versionConfig = allVersions[i];
      if (versionConfig.breakingChanges) {
        breakingChanges.push(...versionConfig.breakingChanges);
      }
    }

    return breakingChanges;
  }

  /**
   * Generates migration warnings
   */
  private _generateMigrationWarnings(
    fromConfig: VersionConfig,
    toConfig: VersionConfig,
  ): string[] {
    const warnings: string[] = [];

    if (fromConfig.supportLevel === VersionSupportLevel.DEPRECATED) {
      warnings.push(
        `Source version '${fromConfig.version}' is deprecated. Consider migrating to avoid future compatibility issues.`,
      );
    }

    if (toConfig.supportLevel === VersionSupportLevel.DEPRECATED) {
      warnings.push(
        `Target version '${toConfig.version}' is deprecated. Consider using a newer version.`,
      );
    }

    if (fromConfig.sunsetDate) {
      const sunsetDate = new Date(fromConfig.sunsetDate);
      const now = new Date();
      if (sunsetDate < now) {
        warnings.push(
          `Source version '${fromConfig.version}' has reached sunset date (${fromConfig.sunsetDate}). Immediate migration is required.`,
        );
      }
    }

    return warnings;
  }

  /**
   * Calculates migration effort based on breaking changes and version differences
   */
  private _calculateMigrationEffort(breakingChanges: BreakingChange[]): string {
    if (breakingChanges.length === 0) {
      return MigrationEffort.LOW;
    }

    // Count different types of breaking changes
    const propertyRemoved = breakingChanges.filter(
      (bc) => bc.changeType === BreakingChangeType.PROPERTY_REMOVED,
    ).length;
    const schemaRestructured = breakingChanges.filter(
      (bc) => bc.changeType === BreakingChangeType.SCHEMA_RESTRUCTURED,
    ).length;
    const propertyTypeChanged = breakingChanges.filter(
      (bc) => bc.changeType === BreakingChangeType.PROPERTY_TYPE_CHANGED,
    ).length;

    // Calculate effort based on breaking change severity
    if (
      schemaRestructured > 0 ||
      propertyRemoved > 3 ||
      propertyTypeChanged > 3
    ) {
      return MigrationEffort.BREAKING;
    }

    if (
      propertyRemoved > 1 ||
      propertyTypeChanged > 1 ||
      breakingChanges.length > 5
    ) {
      return MigrationEffort.HIGH;
    }

    if (breakingChanges.length > 2) {
      return MigrationEffort.MEDIUM;
    }

    return MigrationEffort.LOW;
  }

  /**
   * Determines if automatic upgrade is possible
   */
  private _canAutoUpgrade(breakingChanges: BreakingChange[]): boolean {
    // Automatic upgrade is not possible if there are certain types of breaking changes
    const blockingChangeTypes = [
      BreakingChangeType.PROPERTY_REMOVED,
      BreakingChangeType.SCHEMA_RESTRUCTURED,
      BreakingChangeType.PROPERTY_TYPE_CHANGED,
    ];

    return !breakingChanges.some((bc) =>
      blockingChangeTypes.includes(bc.changeType as any),
    );
  }

  /**
   * Determines the next phase in the version lifecycle
   */
  private _determineNextPhase(currentPhase: string): string | undefined {
    switch (currentPhase) {
      case VersionSupportLevel.ACTIVE:
        return VersionSupportLevel.MAINTENANCE;
      case VersionSupportLevel.MAINTENANCE:
        return VersionSupportLevel.DEPRECATED;
      case VersionSupportLevel.DEPRECATED:
        return VersionSupportLevel.SUNSET;
      default:
        return undefined;
    }
  }
}
