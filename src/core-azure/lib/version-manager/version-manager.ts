/**
 * Version Manager exports
 *
 * Re-exports the ApiVersionManager and related version management utilities
 * for convenient access throughout the core-azure module.
 */

export { ApiVersionManager } from "./api-version-manager";
export { SchemaMapper } from "../azapi/schema-mapper/schema-mapper";

// Re-export interfaces for convenience
export {
  VersionConfig,
  MigrationAnalysis,
  BreakingChange,
  VersionSupportLevel,
  MigrationEffort,
  VersionLifecycle,
  VersionConstraints,
  ValidationResult,
  ApiSchema,
  PropertyDefinition,
  ValidationRule,
  VersionChangeLog,
  PropertyMapping,
  PropertyTransformer,
  PropertyValidation,
  BreakingChangeType,
  PropertyType,
  ValidationRuleType,
  PropertyTransformationType,
  VersionPhase,
} from "./interfaces/version-interfaces";
