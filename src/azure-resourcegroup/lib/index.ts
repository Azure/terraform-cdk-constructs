/**
 * Azure ResourceGroup Constructs using VersionedAzapiResource Framework
 *
 * This module provides a unified AZAPI-based ResourceGroup implementation:
 *
 * - Unified implementation using VersionedAzapiResource framework
 * - Automatic latest version resolution (2025-03-01)
 * - Support for explicit version pinning
 * - Schema-driven validation and transformation
 * - Full backward compatibility with existing interfaces
 *
 * The unified approach replaces all version-specific implementations with a single,
 * version-aware class that automatically handles version management.
 */

// Export the unified ResourceGroup implementation
export * from "./resource-group";

// Export schemas for advanced usage
export * from "./resource-group-schemas";

// Backward compatibility exports - these maintain the same interface as before
// but now use the unified implementation under the hood

/**
 * Unified Azure Resource Group implementation
 * Automatically uses the latest API version (2025-03-01) unless explicitly specified
 */
export { ResourceGroup } from "./resource-group";

/**
 * Alias for ResourceGroup to maintain backward compatibility
 * @deprecated Use ResourceGroup instead
 */
export { Group } from "./resource-group";

/**
 * Properties interface for the unified Resource Group
 */
export { ResourceGroupProps } from "./resource-group";

/**
 * Alias for ResourceGroupProps to maintain backward compatibility
 * @deprecated Use ResourceGroupProps instead
 */
export { GroupProps } from "./resource-group";

/**
 * Resource body interface for Azure API calls
 */
export { ResourceGroupBody } from "./resource-group";

/**
 * Alias for ResourceGroupBody to maintain backward compatibility
 * @deprecated Use ResourceGroupBody instead
 */
export { GroupBody } from "./resource-group";

// Schema exports for advanced usage
export {
  RESOURCE_GROUP_TYPE,
  ALL_RESOURCE_GROUP_VERSIONS,
  RESOURCE_GROUP_SCHEMA_2024_11_01,
  RESOURCE_GROUP_SCHEMA_2025_01_01,
  RESOURCE_GROUP_SCHEMA_2025_03_01,
  RESOURCE_GROUP_VERSION_2024_11_01,
  RESOURCE_GROUP_VERSION_2025_01_01,
  RESOURCE_GROUP_VERSION_2025_03_01,
} from "./resource-group-schemas";
