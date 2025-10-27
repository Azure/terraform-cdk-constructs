/**
 * Azure ResourceGroup Constructs using VersionedAzapiResource Framework
 *
 * This module provides a unified AZAPI-based ResourceGroup implementation that replaces
 * all version-specific implementations with a single, version-aware class:
 *
 * - Unified implementation using VersionedAzapiResource framework
 * - Automatic latest version resolution (2025-03-01)
 * - Support for explicit version pinning for stability
 * - Schema-driven validation and transformation
 * - Full backward compatibility with existing interfaces
 * - Replaces 504 lines of duplicated code with a single implementation
 * - JSII-compliant design for multi-language support
 *
 * Usage Examples:
 * ```typescript
 * // Automatic latest version (recommended)
 * import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
 * const rg = new ResourceGroup(this, "rg", {
 *   name: "my-resource-group",
 *   location: "eastus",
 *   tags: { environment: "production" }
 * });
 *
 * // Explicit version pinning
 * const rg = new ResourceGroup(this, "rg", {
 *   name: "my-resource-group",
 *   location: "eastus",
 *   apiVersion: "2024-11-01", // Pin to specific version
 *   tags: { environment: "production" }
 * });
 * ```
 *
 * Migration Note: This unified implementation automatically handles version management
 * and provides the same interface as the previous version-specific implementations.
 * Existing code will continue to work without changes.
 */

// Export unified implementation from lib
export * from "./lib";
