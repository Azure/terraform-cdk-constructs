/**
 * Generic version manager for Azure API versions
 */
export class VersionManager {
  /**
   * Resolves the "latest" version to the actual latest version string
   *
   * @param requestedVersion - The requested version (could be "latest" or specific version)
   * @param latestVersion - The actual latest version string
   * @returns The resolved version string
   */
  static resolveVersion(
    requestedVersion: string,
    latestVersion: string,
  ): string {
    if (requestedVersion === "latest") {
      return latestVersion;
    }
    return requestedVersion;
  }

  /**
   * Validates that a version is supported
   *
   * @param version - The version to validate
   * @param supportedVersions - Array of supported version strings
   * @returns True if version is supported
   */
  static isVersionSupported(
    version: string,
    supportedVersions: string[],
  ): boolean {
    if (version === "latest") {
      return true;
    }
    return supportedVersions.includes(version);
  }

  /**
   * Gets the latest version from an array of versions
   *
   * @param versions - Array of version strings
   * @returns The latest version (highest semantically)
   */
  static getLatestVersion(versions: string[]): string {
    // Simple date-based sorting for Azure API versions (YYYY-MM-DD format)
    return versions
      .filter((v) => v !== "latest")
      .sort((a, b) => b.localeCompare(a))[0];
  }

  /**
   * Validates Azure API version format (YYYY-MM-DD)
   *
   * @param version - The version string to validate
   * @returns True if version has correct format
   */
  static isValidAzureApiVersion(version: string): boolean {
    if (version === "latest") {
      return true;
    }

    // Azure API versions are in YYYY-MM-DD format
    const azureVersionRegex = /^\d{4}-\d{2}-\d{2}$/;
    return azureVersionRegex.test(version);
  }
}
