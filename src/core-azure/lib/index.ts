/**
 * Core Azure AZAPI functionality
 *
 * This module provides the foundational classes and utilities for AZAPI-based Azure constructs:
 *
 * - AzapiResource: Base class for all AZAPI resources
 * - Version management utilities
 * - AZAPI provider integrations
 */

// Export AZAPI-based classes only
export * from "./azapi-resource";
export * from "./version-manager";

// Export AZAPI provider components
export * from "./providers-azapi";

// Export convenience imports for commonly used classes
export * from "./azapi-exports";
