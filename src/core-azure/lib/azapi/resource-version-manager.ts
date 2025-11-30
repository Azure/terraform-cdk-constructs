/**
 * ResourceVersionManager - Helper class for managing API version resolution
 *
 * This helper class extracts version management logic from AzapiResource to follow
 * the Single Responsibility Principle. It handles version resolution, validation,
 * and configuration retrieval.
 *
 * @internal
 * @packageDocumentation
 */

import { ApiVersionManager } from "../version-manager/api-version-manager";
import {
  ApiSchema,
  VersionConfig,
  VersionSupportLevel,
} from "../version-manager/interfaces/version-interfaces";

/**
 * Helper class for managing API version resolution and configuration
 *
 * This class encapsulates all version-related operations including:
 * - API version resolution (explicit or automatic)
 * - Version validation against registered versions
 * - Schema and configuration retrieval
 * - Latest version resolution
 *
 * @internal
 */
export class ResourceVersionManager {
  private readonly _apiVersionManager: ApiVersionManager;
  private readonly _resourceType: string;
  private readonly _defaultVersion: string;

  /**
   * Creates a new ResourceVersionManager instance
   *
   * @param resourceType - The Azure resource type (e.g., "Microsoft.Resources/resourceGroups")
   * @param defaultVersion - The default version to use as fallback
   */
  constructor(resourceType: string, defaultVersion: string) {
    if (!resourceType || resourceType.trim().length === 0) {
      throw new Error("Resource type cannot be empty");
    }

    if (!defaultVersion || defaultVersion.trim().length === 0) {
      throw new Error("Default version cannot be empty");
    }

    this._resourceType = resourceType;
    this._defaultVersion = defaultVersion;
    this._apiVersionManager = ApiVersionManager.instance();
  }

  /**
   * Resolves the API version to use for a resource instance
   *
   * This method implements the version resolution logic:
   * 1. If explicitVersion is provided, validate and use it
   * 2. Otherwise, try to get the latest version from ApiVersionManager
   * 3. If no versions registered, fall back to defaultVersion
   *
   * @param explicitVersion - Optional explicit version specified by user
   * @returns The resolved API version string
   * @throws Error if explicit version is provided but not supported
   */
  public resolveApiVersion(explicitVersion?: string): string {
    if (explicitVersion) {
      // Validate that the explicit version is supported
      if (!this.validateVersion(explicitVersion)) {
        const supportedVersions = this.supportedVersions();
        throw new Error(
          `Unsupported API version '${explicitVersion}' for resource type '${this._resourceType}'. ` +
            `Supported versions: ${supportedVersions.join(", ")}`,
        );
      }
      return explicitVersion;
    }

    // Try to get the latest version from the manager
    const latestVersion = this.latestVersion();
    if (latestVersion) {
      return latestVersion;
    }

    // Fall back to the default version
    console.warn(
      `No versions registered for ${this._resourceType}. ` +
        `Using default version: ${this._defaultVersion}. ` +
        `Consider registering versions with ApiVersionManager for better version management.`,
    );

    return this._defaultVersion;
  }

  /**
   * Retrieves the version configuration for a specific version
   *
   * @param version - The version to retrieve configuration for
   * @returns The version configuration, or undefined if not found
   */
  public versionConfig(version: string): VersionConfig | undefined {
    return this._apiVersionManager.versionConfig(this._resourceType, version);
  }

  /**
   * Retrieves the API schema for a specific version
   *
   * @param version - The version to retrieve schema for
   * @returns The API schema for the version
   * @throws Error if version configuration or schema cannot be found
   */
  public schemaForVersion(version: string): ApiSchema {
    const versionConfig = this.versionConfig(version);

    if (!versionConfig) {
      throw new Error(
        `Cannot resolve schema: version configuration not found for ` +
          `${this._resourceType}@${version}`,
      );
    }

    return versionConfig.schema;
  }

  /**
   * Validates whether a version is supported for the resource type
   *
   * @param version - The version to validate
   * @returns True if the version is supported, false otherwise
   */
  public validateVersion(version: string): boolean {
    return this._apiVersionManager.validateVersionSupport(
      this._resourceType,
      version,
    );
  }

  /**
   * Retrieves the latest available version for the resource type
   *
   * @returns The latest version string, or undefined if none found
   */
  public latestVersion(): string | undefined {
    return this._apiVersionManager.latestVersion(this._resourceType);
  }

  /**
   * Retrieves all supported versions for the resource type
   *
   * @returns Array of supported version strings, sorted by release date (newest first)
   */
  public supportedVersions(): string[] {
    return this._apiVersionManager.supportedVersions(this._resourceType);
  }

  /**
   * Checks if the version is deprecated
   *
   * @param version - The version to check
   * @returns True if the version is deprecated or sunset, false otherwise
   */
  public isDeprecated(version: string): boolean {
    const config = this.versionConfig(version);
    if (!config) {
      return false;
    }

    return (
      config.supportLevel === VersionSupportLevel.DEPRECATED ||
      config.supportLevel === VersionSupportLevel.SUNSET
    );
  }

  /**
   * Checks if the version has reached sunset
   *
   * @param version - The version to check
   * @returns True if the version has reached sunset, false otherwise
   */
  public isSunset(version: string): boolean {
    const config = this.versionConfig(version);
    if (!config) {
      return false;
    }

    return config.supportLevel === VersionSupportLevel.SUNSET;
  }

  /**
   * The resource type this manager is configured for
   */
  public get resourceType(): string {
    return this._resourceType;
  }

  /**
   * The default version configured for this manager
   */
  public get defaultVersion(): string {
    return this._defaultVersion;
  }
}
