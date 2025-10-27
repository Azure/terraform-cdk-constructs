/**
 * Core interfaces and type definitions for the AzAPI versioning framework
 *
 * These interfaces provide JSII-compliant definitions for version management,
 * schema transformation, and migration analysis. All interfaces are designed
 * for multi-language code generation supporting TypeScript, Java, Python, and .NET.
 *
 * @packageDocumentation
 */

// =============================================================================
// SUPPORTING ENUMS AND UTILITY TYPES
// =============================================================================

/**
 * Version support level enumeration for API lifecycle management
 *
 * Defines the current support status of an API version to help developers
 * understand maintenance commitments and migration planning.
 *
 * @stability stable
 */
export class VersionSupportLevel {
  /**
   * Active support - full feature development and bug fixes
   * Recommended for new development
   */
  public static readonly ACTIVE = "active";

  /**
   * Maintenance support - critical bug fixes only, no new features
   * Stable for production use but consider migration planning
   */
  public static readonly MAINTENANCE = "maintenance";

  /**
   * Deprecated - security fixes only, migration recommended
   * Should not be used for new development
   */
  public static readonly DEPRECATED = "deprecated";

  /**
   * Sunset - no longer supported, immediate migration required
   * May be removed in future releases
   */
  public static readonly SUNSET = "sunset";
}

/**
 * Migration effort estimation for version transitions
 *
 * Helps developers understand the complexity of migrating between versions
 * and plan development resources accordingly.
 *
 * @stability stable
 */
export class MigrationEffort {
  /**
   * Low effort - mostly automatic with minimal manual changes
   * Estimated time: < 1 hour
   */
  public static readonly LOW = "low";

  /**
   * Medium effort - some manual changes required
   * Estimated time: 1-8 hours
   */
  public static readonly MEDIUM = "medium";

  /**
   * High effort - significant manual changes required
   * Estimated time: 1-3 days
   */
  public static readonly HIGH = "high";

  /**
   * Breaking changes - major refactoring required
   * Estimated time: > 3 days
   */
  public static readonly BREAKING = "breaking";
}

/**
 * Property type enumeration for schema definitions
 *
 * Defines the basic data types supported in API schemas for validation
 * and transformation purposes.
 *
 * @stability stable
 */
export class PropertyType {
  /** String data type */
  public static readonly STRING = "string";

  /** Numeric data type (integer or float) */
  public static readonly NUMBER = "number";

  /** Boolean data type (true/false) */
  public static readonly BOOLEAN = "boolean";

  /** Object data type (key-value pairs) */
  public static readonly OBJECT = "object";

  /** Array data type (ordered collection) */
  public static readonly ARRAY = "array";

  /** Any data type (no validation) */
  public static readonly ANY = "any";
}

/**
 * Validation rule types for property validation
 *
 * Defines the types of validation rules that can be applied to properties
 * for input validation and data integrity.
 *
 * @stability stable
 */
export class ValidationRuleType {
  /** Property is required and cannot be undefined */
  public static readonly REQUIRED = "required";

  /** Validate property type matches expected type */
  public static readonly TYPE_CHECK = "type-check";

  /** Validate property value matches regex pattern */
  public static readonly PATTERN_MATCH = "pattern-match";

  /** Validate property value is within specified range */
  public static readonly VALUE_RANGE = "value-range";

  /** Custom validation function */
  public static readonly CUSTOM_VALIDATION = "custom-validation";
}

/**
 * Breaking change types for migration analysis
 *
 * Categorizes the types of breaking changes that can occur between API versions
 * to enable automated migration analysis and tooling.
 *
 * @stability stable
 */
export class BreakingChangeType {
  /** Property has been removed from the API */
  public static readonly PROPERTY_REMOVED = "property-removed";

  /** Property has been renamed */
  public static readonly PROPERTY_RENAMED = "property-renamed";

  /** Property data type has changed */
  public static readonly PROPERTY_TYPE_CHANGED = "property-type-changed";

  /** Previously optional property is now required */
  public static readonly PROPERTY_REQUIRED = "property-required";

  /** Overall schema structure has been reorganized */
  public static readonly SCHEMA_RESTRUCTURED = "schema-restructured";
}

/**
 * Property transformation types for schema mapping
 *
 * Defines the types of transformations that can be applied when mapping
 * properties between different schema versions.
 *
 * @stability stable
 */
export class PropertyTransformationType {
  /** Direct copy with no transformation */
  public static readonly DIRECT_COPY = "direct-copy";

  /** Map values using a lookup table */
  public static readonly VALUE_MAPPING = "value-mapping";

  /** Transform object structure */
  public static readonly STRUCTURE_TRANSFORMATION = "structure-transformation";

  /** Apply custom transformation function */
  public static readonly CUSTOM_FUNCTION = "custom-function";
}

// =============================================================================
// VALIDATION AND PROPERTY INTERFACES
// =============================================================================

/**
 * Validation rule definition for property validation
 *
 * Defines a single validation rule that can be applied to a property
 * to ensure data integrity and provide user feedback.
 *
 * @stability stable
 */
export interface ValidationRule {
  /**
   * The type of validation rule to apply
   * Must be one of the ValidationRuleType constants
   */
  readonly ruleType: string;

  /**
   * The value or parameter for the validation rule
   * Type depends on the validation rule type
   *
   * @example For PATTERN_MATCH: regex pattern string
   * @example For VALUE_RANGE: { min: 0, max: 100 }
   */
  readonly value?: any;

  /**
   * Custom error message to display when validation fails
   * If not provided, a default message will be generated
   */
  readonly message?: string;
}

/**
 * Property definition for API schema
 *
 * Defines the characteristics, validation rules, and metadata for a single
 * property in an API schema. This enables type validation, transformation,
 * and documentation generation.
 *
 * @stability stable
 */
export interface PropertyDefinition {
  /**
   * The data type of the property
   * Must be one of the PropertyType constants
   */
  readonly dataType: string;

  /**
   * Whether this property is required
   * If true, the property must be provided by the user
   *
   * @defaultValue false
   */
  readonly required?: boolean;

  /**
   * Default value to use if property is not provided
   * Type must match the property type
   */
  readonly defaultValue?: any;

  /**
   * Whether this property is deprecated
   * If true, usage warnings will be generated
   *
   * @defaultValue false
   */
  readonly deprecated?: boolean;

  /**
   * The API version in which this property was added
   * Used for compatibility analysis and migration planning
   *
   * @example "2024-01-01"
   */
  readonly addedInVersion?: string;

  /**
   * The API version in which this property was removed
   * Used for compatibility analysis and migration planning
   *
   * @example "2025-01-01"
   */
  readonly removedInVersion?: string;

  /**
   * Human-readable description of the property
   * Used for documentation generation and IDE support
   */
  readonly description?: string;

  /**
   * Array of validation rules to apply to this property
   * Rules are evaluated in order and all must pass
   */
  readonly validation?: ValidationRule[];
}

/**
 * Property validation configuration
 *
 * Defines validation rules that apply to specific properties,
 * enabling complex validation scenarios and cross-property validation.
 *
 * @stability stable
 */
export interface PropertyValidation {
  /**
   * The name of the property this validation applies to
   */
  readonly property: string;

  /**
   * Array of validation rules to apply to this property
   * Rules are evaluated in order and all must pass
   */
  readonly rules: ValidationRule[];
}

/**
 * Property transformation interface for schema mapping
 *
 * Defines how properties should be transformed when mapping between
 * different schema versions or formats.
 *
 * @stability stable
 */
export interface PropertyTransformer {
  /**
   * The type of transformation to apply
   * Must be one of the PropertyTransformationType constants
   */
  readonly transformationType: string;

  /**
   * Configuration object for the transformation
   * Structure depends on the transformation type
   */
  readonly config?: any;
}

/**
 * Property mapping definition
 *
 * Defines how a property should be mapped from source to target schema,
 * including any transformations or default values to apply.
 *
 * @stability stable
 */
export interface PropertyMapping {
  /**
   * The name of the source property
   */
  readonly sourceProperty: string;

  /**
   * The name of the target property
   */
  readonly targetProperty: string;

  /**
   * Optional transformer to apply during mapping
   */
  readonly transformer?: PropertyTransformer;

  /**
   * Default value to use if source property is not provided
   */
  readonly defaultValue?: any;

  /**
   * Whether this property is required in the target schema
   *
   * @defaultValue false
   */
  readonly required?: boolean;
}

// =============================================================================
// SCHEMA AND VERSION INTERFACES
// =============================================================================

/**
 * API Schema definition using TypeScript objects
 *
 * Defines the complete schema for an API version including all properties,
 * validation rules, and transformation mappings. This schema-driven approach
 * enables automatic validation, transformation, and multi-language support.
 *
 * @stability stable
 */
export interface ApiSchema {
  /**
   * The Azure resource type this schema applies to
   *
   * @example "Microsoft.Resources/resourceGroups"
   */
  readonly resourceType: string;

  /**
   * The API version this schema represents
   *
   * @example "2024-11-01"
   */
  readonly version: string;

  /**
   * Dictionary of property definitions keyed by property name
   * Each property defines its type, validation, and metadata
   *
   * @example { "location": { type: "string", required: true } }
   */
  readonly properties: { [key: string]: PropertyDefinition };

  /**
   * Array of property names that are required
   * Properties listed here must be provided by the user
   */
  readonly required: string[];

  /**
   * Array of property names that are optional
   * Used for documentation and validation optimization
   */
  readonly optional?: string[];

  /**
   * Array of property names that are deprecated
   * Usage of these properties will generate warnings
   */
  readonly deprecated?: string[];

  /**
   * Property transformation rules for schema mapping
   * Maps input property names to target property names
   *
   * @example { "oldName": "newName" }
   */
  readonly transformationRules?: { [key: string]: string };

  /**
   * Property-specific validation rules
   * Applied in addition to individual property validation
   */
  readonly validationRules?: PropertyValidation[];
}

// =============================================================================
// BREAKING CHANGES AND MIGRATION INTERFACES
// =============================================================================

/**
 * Breaking change documentation
 *
 * Documents a breaking change between API versions to enable automated
 * migration analysis and provide guidance to developers.
 *
 * @stability stable
 */
export interface BreakingChange {
  /**
   * The type of breaking change
   * Must be one of the BreakingChangeType constants
   */
  readonly changeType: string;

  /**
   * The property name affected by the breaking change
   * Omit for schema-level changes
   */
  readonly property?: string;

  /**
   * The old value or format (for reference)
   * Helps developers understand what changed
   */
  readonly oldValue?: string;

  /**
   * The new value or format
   * Shows developers what to change to
   */
  readonly newValue?: string;

  /**
   * Human-readable description of the breaking change
   * Explains the impact and reasoning behind the change
   */
  readonly description: string;

  /**
   * Guidance on how to migrate from old to new format
   * Should include code examples where applicable
   */
  readonly migrationPath?: string;
}

/**
 * Version changelog entry
 *
 * Documents changes made in a specific version for transparency
 * and to help developers understand version evolution.
 *
 * @stability stable
 */
export interface VersionChangeLog {
  /**
   * The type of change (added, changed, deprecated, removed, fixed)
   */
  readonly changeType: string;

  /**
   * Brief description of the change
   */
  readonly description: string;

  /**
   * Property or feature affected by the change
   */
  readonly affectedProperty?: string;

  /**
   * Whether this change is breaking
   *
   * @defaultValue false
   */
  readonly breaking?: boolean;
}

/**
 * Migration analysis result
 *
 * Results of analyzing the migration path between two API versions.
 * Provides compatibility assessment, effort estimation, and detailed
 * guidance for version transitions.
 *
 * @stability stable
 */
export interface MigrationAnalysis {
  /**
   * Source API version being migrated from
   *
   * @example "2024-01-01"
   */
  readonly fromVersion: string;

  /**
   * Target API version being migrated to
   *
   * @example "2024-11-01"
   */
  readonly toVersion: string;

  /**
   * Whether the migration is backward compatible
   * If true, migration should be straightforward
   */
  readonly compatible: boolean;

  /**
   * Array of breaking changes that affect the migration
   * Each change includes guidance on how to handle it
   */
  readonly breakingChanges: BreakingChange[];

  /**
   * Array of non-breaking warnings about the migration
   * May include deprecation notices or recommendations
   */
  readonly warnings: string[];

  /**
   * Estimated effort required for the migration
   * Must be one of the MigrationEffort constants
   */
  readonly estimatedEffort: string;

  /**
   * Whether automatic upgrade tooling can handle this migration
   * If true, migration can be largely automated
   */
  readonly automaticUpgradePossible: boolean;
}

// =============================================================================
// VERSION CONFIGURATION INTERFACE
// =============================================================================

/**
 * Version configuration interface
 *
 * Complete configuration for an API version including schema, lifecycle
 * information, and migration metadata. This is the primary interface
 * for version management and automated tooling.
 *
 * @stability stable
 */
export interface VersionConfig {
  /**
   * The API version string
   *
   * @example "2024-11-01"
   */
  readonly version: string;

  /**
   * The complete API schema for this version
   * Defines all properties, validation, and transformation rules
   */
  readonly schema: ApiSchema;

  /**
   * Current support level for this version
   * Must be one of the VersionSupportLevel constants
   */
  readonly supportLevel: string;

  /**
   * Date when this version was released
   * Used for lifecycle management and compatibility analysis
   *
   * @example "2024-11-01"
   */
  readonly releaseDate: string;

  /**
   * Date when this version was deprecated (if applicable)
   * Indicates when migration planning should begin
   *
   * @example "2025-11-01"
   */
  readonly deprecationDate?: string;

  /**
   * Date when this version will be sunset (if known)
   * Indicates deadline for migration completion
   *
   * @example "2026-11-01"
   */
  readonly sunsetDate?: string;

  /**
   * Array of breaking changes introduced in this version
   * Used for migration analysis and automated tooling
   */
  readonly breakingChanges?: BreakingChange[];

  /**
   * URL or path to detailed migration guide
   * Provides comprehensive migration instructions
   *
   * @example "/docs/migration-guides/v2024-11-01"
   */
  readonly migrationGuide?: string;

  /**
   * Array of changes made in this version
   * Provides transparency and helps with troubleshooting
   */
  readonly changeLog?: VersionChangeLog[];
}

// =============================================================================
// VALIDATION RESULT INTERFACE
// =============================================================================

/**
 * Validation result interface
 *
 * Results of validating properties against a schema.
 * Provides detailed error and warning information for debugging
 * and user feedback.
 *
 * @stability stable
 */
export interface ValidationResult {
  /**
   * Whether validation passed
   * If false, the errors array will contain details
   */
  readonly valid: boolean;

  /**
   * Array of validation error messages
   * Empty if validation passed
   */
  readonly errors: string[];

  /**
   * Array of validation warning messages
   * Non-blocking issues that should be addressed
   */
  readonly warnings: string[];

  /**
   * Property-specific error messages
   * Maps property names to arrays of error messages
   */
  readonly propertyErrors?: { [key: string]: string[] };
}

// =============================================================================
// LIFECYCLE AND CONSTRAINT INTERFACES
// =============================================================================

/**
 * Version lifecycle phases
 *
 * Defines the phases in an API version's lifecycle from initial
 * development through sunset.
 *
 * @stability stable
 */
export class VersionPhase {
  /** Preview/beta phase - not recommended for production */
  public static readonly PREVIEW = "preview";

  /** Active phase - fully supported and recommended */
  public static readonly ACTIVE = "active";

  /** Maintenance phase - bug fixes only */
  public static readonly MAINTENANCE = "maintenance";

  /** Deprecated phase - migration recommended */
  public static readonly DEPRECATED = "deprecated";

  /** Sunset phase - no longer supported */
  public static readonly SUNSET = "sunset";
}

/**
 * Version lifecycle management
 *
 * Tracks the current phase and transition timeline for an API version
 * to enable proactive lifecycle management.
 *
 * @stability stable
 */
export interface VersionLifecycle {
  /**
   * The API version string
   */
  readonly version: string;

  /**
   * Current lifecycle phase
   * Must be one of the VersionPhase constants
   */
  readonly phase: string;

  /**
   * Date when the current phase was entered
   *
   * @example "2024-11-01"
   */
  readonly transitionDate?: string;

  /**
   * Next planned phase in the lifecycle
   * Must be one of the VersionPhase constants
   */
  readonly nextPhase?: string;

  /**
   * Estimated date when version will be sunset
   * Used for long-term planning
   *
   * @example "2026-11-01"
   */
  readonly estimatedSunsetDate?: string;
}

/**
 * Version selection constraints
 *
 * Defines constraints for automatic version selection to help
 * choose the most appropriate version based on requirements.
 *
 * @stability stable
 */
export interface VersionConstraints {
  /**
   * Required support level
   * Must be one of the VersionSupportLevel constants
   */
  readonly supportLevel?: string;

  /**
   * Minimum release date for version selection
   * Versions older than this date will be excluded
   */
  readonly notOlderThan?: Date;

  /**
   * Array of required features that the version must support
   */
  readonly requiredFeatures?: string[];

  /**
   * Whether to exclude deprecated versions
   *
   * @defaultValue true
   */
  readonly excludeDeprecated?: boolean;
}
