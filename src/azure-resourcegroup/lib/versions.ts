/**
 * Supported API versions for Azure Resource Groups
 */
export enum ResourceGroupVersion {
  V2024_11_01 = "2024-11-01",
  LATEST = "latest",
}

/**
 * Get the latest supported API version for Azure Resource Groups
 */
export function getLatestResourceGroupVersion(): string {
  return ResourceGroupVersion.V2024_11_01;
}

/**
 * Get all supported API versions for Azure Resource Groups
 */
export function getSupportedResourceGroupVersions(): string[] {
  return [ResourceGroupVersion.V2024_11_01];
}

/**
 * Resolve a version string to the actual API version
 * @param version - The version to resolve (can be "latest" or specific version)
 * @returns The resolved version string
 */
export function resolveResourceGroupVersion(version: string): string {
  if (version === ResourceGroupVersion.LATEST) {
    return getLatestResourceGroupVersion();
  }
  return version;
}

/**
 * Check if a version is supported
 * @param version - The version to check
 * @returns True if the version is supported
 */
export function isResourceGroupVersionSupported(version: string): boolean {
  if (version === ResourceGroupVersion.LATEST) {
    return true;
  }
  return getSupportedResourceGroupVersions().includes(version);
}
