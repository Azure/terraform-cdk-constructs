/**
 * Core Azure AZAPI functionality
 *
 * This module provides the foundational classes and utilities for AZAPI-based Azure constructs:
 *
 * - VersionedAzapiResource: Unified framework base class with automatic version management
 * - ApiVersionManager: Singleton for centralized version management
 * - SchemaMapper: Property transformation and validation engine
 * - Version management utilities and interfaces
 * - AZAPI provider integrations
 */

// Export unified AZAPI resource class
export * from "./azapi/azapi-resource";
export * from "./version-manager/api-version-manager";
export * from "./azapi/schema-mapper/schema-mapper";

// Export version management interfaces
export * from "./version-manager/interfaces/version-interfaces";

// Export AZAPI provider components with namespace prefix to avoid conflicts
import * as azapiProviders from "./azapi/providers-azapi";
export { azapiProviders };

// Export convenience imports for commonly used classes
export * from "./azapi/azapi-exports";
