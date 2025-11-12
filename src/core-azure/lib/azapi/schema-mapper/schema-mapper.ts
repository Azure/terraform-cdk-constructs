/**
 * SchemaMapper - A JSII-compliant property transformation engine for Azure API schemas
 *
 * This class provides comprehensive property transformation and validation capabilities
 * for mapping between different API schema versions. It handles property renaming,
 * restructuring, type conversion, and validation with detailed error reporting.
 *
 * Key Features:
 * - JSII-compliant singleton implementation for multi-language support
 * - Property transformation with nested object and array support
 * - Comprehensive validation engine with detailed error reporting
 * - Default value injection for new properties
 * - Property path tracking for nested validation errors
 * - Graceful error handling with contextual information
 *
 * @packageDocumentation
 */

import {
  ApiSchema,
  PropertyDefinition,
  ValidationResult,
  ValidationRule,
  PropertyType,
  ValidationRuleType,
} from "../../version-manager/interfaces/version-interfaces";

/**
 * Error context for property transformation and validation
 */
interface ErrorContext {
  readonly propertyPath: string;
  readonly message: string;
  readonly sourceValue?: any;
  readonly expectedType?: string;
}

/**
 * Transformation context for tracking nested transformations
 */
interface TransformationContext {
  readonly sourcePath: string;
  readonly targetPath: string;
  readonly depth: number;
}

/**
 * SchemaMapper class for property transformation and validation
 *
 * This class provides a comprehensive property transformation engine that enables
 * mapping between different API schema versions with full validation support.
 * It implements JSII-compliant patterns for multi-language code generation.
 *
 * The SchemaMapper handles:
 * - Property transformation between schema versions
 * - Validation against API schema definitions
 * - Default value injection for new properties
 * - Nested object and array processing
 * - Detailed error reporting with property paths
 *
 * @example
 * const schema: ApiSchema = {
 *   resourceType: 'Microsoft.Resources/resourceGroups',
 *   version: '2024-11-01',
 *   properties: {
 *     name: { dataType: PropertyType.STRING, required: true },
 *     location: { dataType: PropertyType.STRING, required: true }
 *   },
 *   required: ['name', 'location']
 * };
 *
 * const mapper = SchemaMapper.create(schema);
 * const result = mapper.validateProperties({ name: 'myRG', location: 'eastus' });
 *
 * @stability stable
 */
export class SchemaMapper {
  /**
   * Creates a new SchemaMapper instance for the specified schema
   *
   * This factory method creates a SchemaMapper configured for a specific API schema.
   * The schema defines the structure, validation rules, and transformation mappings
   * that will be used for property operations.
   *
   * @param schema - The API schema to use for transformations and validation
   * @returns A new SchemaMapper instance configured with the provided schema
   *
   * @throws Error if the schema is invalid or missing required properties
   *
   * @example
   * const schema: ApiSchema = {
   *   resourceType: 'Microsoft.Resources/resourceGroups',
   *   version: '2024-11-01',
   *   properties: { name: { dataType: PropertyType.STRING, required: true } },
   *   required: ['name']
   * };
   * const mapper = SchemaMapper.create(schema);
   */
  public static create(schema: ApiSchema): SchemaMapper {
    if (!schema) {
      throw new Error("Schema cannot be undefined or null");
    }

    if (!schema.resourceType || schema.resourceType.trim().length === 0) {
      throw new Error("Schema must have a valid resourceType");
    }

    if (!schema.version || schema.version.trim().length === 0) {
      throw new Error("Schema must have a valid version");
    }

    if (!schema.properties) {
      throw new Error("Schema must have a properties definition");
    }

    if (!schema.required || !Array.isArray(schema.required)) {
      throw new Error("Schema must have a required properties array");
    }

    return new SchemaMapper(schema);
  }

  private readonly _schema: ApiSchema;
  private readonly _errorContexts: ErrorContext[];

  /**
   * Private constructor to enforce factory pattern
   *
   * @param schema - The API schema to use for this mapper instance
   */
  private constructor(schema: ApiSchema) {
    this._schema = schema;
    this._errorContexts = [];
  }

  /**
   * Transforms properties from source format to target schema format
   *
   * This method applies transformation rules to convert properties from one schema
   * format to another. It handles property renaming, restructuring, type conversion,
   * and nested object/array transformations based on the target schema definition.
   *
   * @param sourceProps - The source properties to transform
   * @param targetSchema - The target schema to transform properties to
   * @returns The transformed properties matching the target schema format
   *
   * @throws Error if transformation fails due to incompatible types or missing mappings
   *
   * @example
   * const sourceProps = { oldName: 'value', location: 'eastus' };
   * const targetSchema = {
   *   transformationRules: { oldName: 'newName' },
   *   properties: { newName: { dataType: PropertyType.STRING } }
   * };
   * const transformed = mapper.transformProperties(sourceProps, targetSchema);
   * // Result: { newName: 'value', location: 'eastus' }
   */
  public transformProperties(sourceProps: any, targetSchema: ApiSchema): any {
    if (!sourceProps) {
      return {};
    }

    if (!targetSchema) {
      throw new Error("Target schema cannot be undefined or null");
    }

    this._clearErrorContexts();
    const context: TransformationContext = {
      sourcePath: "",
      targetPath: "",
      depth: 0,
    };

    try {
      return this._transformObject(sourceProps, targetSchema, context);
    } catch (error) {
      throw new Error(
        `Property transformation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Validates properties against the schema definition
   *
   * This method performs comprehensive validation of properties against the
   * configured schema. It checks required properties, data types, validation rules,
   * and provides detailed error reporting with property path information.
   *
   * @param properties - The properties to validate
   * @returns Detailed validation results including errors and warnings
   *
   * @example
   * const properties = { name: 'myRG', location: 'eastus', tags: { env: 'dev' } };
   * const result = mapper.validateProperties(properties);
   *
   * if (!result.valid) {
   *   console.log('Validation errors:', result.errors);
   *   console.log('Property errors:', result.propertyErrors);
   * }
   */
  public validateProperties(properties: any): ValidationResult {
    this._clearErrorContexts();
    const errors: string[] = [];
    const warnings: string[] = [];
    const propertyErrors: { [key: string]: string[] } = {};

    if (!properties) {
      errors.push("Properties cannot be undefined or null");
      return { valid: false, errors, warnings, propertyErrors };
    }

    try {
      // Validate required properties
      this._validateRequiredProperties(properties, "", errors, propertyErrors);

      // Validate individual properties
      this._validateIndividualProperties(
        properties,
        "",
        errors,
        warnings,
        propertyErrors,
      );

      // Apply schema-level validation rules
      this._applySchemaValidationRules(
        properties,
        errors,
        warnings,
        propertyErrors,
      );
    } catch (error) {
      errors.push(
        `Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      propertyErrors:
        Object.keys(propertyErrors).length > 0 ? propertyErrors : undefined,
    };
  }

  /**
   * Applies default values to properties based on schema definitions
   *
   * This method injects default values for properties that are not provided
   * but have default values defined in the schema. It preserves existing
   * property values and only adds defaults for missing properties.
   *
   * @param properties - The properties to apply defaults to
   * @returns New properties object with default values applied
   *
   * @example
   * const props = { name: 'myRG' };
   * const withDefaults = mapper.applyDefaults(props);
   * // If schema defines location default as 'eastus':
   * // Result: { name: 'myRG', location: 'eastus' }
   */
  public applyDefaults(properties: any): any {
    if (!properties) {
      properties = {};
    }

    const result = { ...properties };

    try {
      this._applyDefaultsToObject(result, "");
    } catch (error) {
      throw new Error(
        `Default value application failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    return result;
  }

  /**
   * Maps a single property value using transformation rules
   *
   * This method applies transformation logic to a single property value based on
   * the target property definition. It handles type conversion, value mapping,
   * and custom transformations.
   *
   * @param propertyName - The name of the property being mapped
   * @param value - The source value to transform
   * @param targetProperty - The target property definition from the schema
   * @returns The transformed property value
   *
   * @throws Error if the transformation fails or types are incompatible
   *
   * @example
   * const targetProp = { dataType: PropertyType.STRING, required: true };
   * const mapped = mapper.mapProperty('name', 'myResourceGroup', targetProp);
   */
  public mapProperty(
    propertyName: string,
    value: any,
    targetProperty: PropertyDefinition,
  ): any {
    if (!propertyName || propertyName.trim().length === 0) {
      throw new Error("Property name cannot be empty");
    }

    if (!targetProperty) {
      throw new Error("Target property definition cannot be undefined");
    }

    try {
      return this._transformValue(value, targetProperty, propertyName);
    } catch (error) {
      throw new Error(
        `Property mapping failed for '${propertyName}': ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Clears the error context array for a new operation
   */
  private _clearErrorContexts(): void {
    this._errorContexts.length = 0;
  }

  /**
   * Transforms an object using the target schema
   */
  private _transformObject(
    sourceObj: any,
    targetSchema: ApiSchema,
    _context: TransformationContext,
  ): any {
    if (!sourceObj || typeof sourceObj !== "object") {
      return sourceObj;
    }

    const result: any = {};
    const transformationRules = targetSchema.transformationRules || {};

    // Apply transformation rules first
    for (const [sourceKey, value] of Object.entries(sourceObj)) {
      const targetKey = transformationRules[sourceKey] || sourceKey;
      const targetProperty = targetSchema.properties[targetKey];

      if (targetProperty) {
        const transformedValue = this._transformValue(
          value,
          targetProperty,
          targetKey,
        );
        result[targetKey] = transformedValue;
      } else {
        // Property not in target schema - copy as-is unless explicitly excluded
        result[targetKey] = value;
      }
    }

    return result;
  }

  /**
   * Transforms a single value based on target property definition
   */
  private _transformValue(
    value: any,
    targetProperty: PropertyDefinition,
    propertyPath: string,
  ): any {
    if (value === undefined || value === null) {
      if (targetProperty.defaultValue !== undefined) {
        return targetProperty.defaultValue;
      }
      return value;
    }

    switch (targetProperty.dataType) {
      case PropertyType.STRING:
        return this._transformToString(value, propertyPath);

      case PropertyType.NUMBER:
        return this._transformToNumber(value, propertyPath);

      case PropertyType.BOOLEAN:
        return this._transformToBoolean(value, propertyPath);

      case PropertyType.ARRAY:
        return this._transformToArray(value, targetProperty, propertyPath);

      case PropertyType.OBJECT:
        return this._transformToObject(value, targetProperty, propertyPath);

      case PropertyType.ANY:
      default:
        return value;
    }
  }

  /**
   * Transforms value to string type
   */
  private _transformToString(value: any, propertyPath: string): string {
    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }

    throw new Error(
      `Cannot convert value at '${propertyPath}' to string. Got: ${typeof value}`,
    );
  }

  /**
   * Transforms value to number type
   */
  private _transformToNumber(value: any, propertyPath: string): number {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }

    throw new Error(
      `Cannot convert value at '${propertyPath}' to number. Got: ${typeof value}`,
    );
  }

  /**
   * Transforms value to boolean type
   */
  private _transformToBoolean(value: any, propertyPath: string): boolean {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const lower = value.toLowerCase();
      if (lower === "true" || lower === "1") return true;
      if (lower === "false" || lower === "0") return false;
    }

    if (typeof value === "number") {
      return value !== 0;
    }

    throw new Error(
      `Cannot convert value at '${propertyPath}' to boolean. Got: ${typeof value}`,
    );
  }

  /**
   * Transforms value to array type
   */
  private _transformToArray(
    value: any,
    _targetProperty: PropertyDefinition,
    propertyPath: string,
  ): any[] {
    if (Array.isArray(value)) {
      return value; // TODO: Transform array elements if needed
    }

    throw new Error(
      `Expected array at '${propertyPath}', got: ${typeof value}`,
    );
  }

  /**
   * Transforms value to object type
   */
  private _transformToObject(
    value: any,
    _targetProperty: PropertyDefinition,
    propertyPath: string,
  ): any {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value; // TODO: Apply nested transformation rules if needed
    }

    throw new Error(
      `Expected object at '${propertyPath}', got: ${typeof value}`,
    );
  }

  /**
   * Validates required properties
   */
  private _validateRequiredProperties(
    properties: any,
    basePath: string,
    errors: string[],
    propertyErrors: { [key: string]: string[] },
  ): void {
    for (const requiredProp of this._schema.required) {
      const fullPath = basePath ? `${basePath}.${requiredProp}` : requiredProp;

      if (
        !(requiredProp in properties) ||
        properties[requiredProp] === undefined
      ) {
        const error = `Required property '${requiredProp}' is missing`;
        errors.push(error);

        if (!propertyErrors[fullPath]) {
          propertyErrors[fullPath] = [];
        }
        propertyErrors[fullPath].push(error);
      }
    }
  }

  /**
   * Validates individual properties against their definitions
   */
  private _validateIndividualProperties(
    properties: any,
    basePath: string,
    errors: string[],
    warnings: string[],
    propertyErrors: { [key: string]: string[] },
  ): void {
    // Framework properties that should not be validated against Azure API schema
    const frameworkProperties = new Set([
      "apiVersion",
      "enableMigrationAnalysis",
      "enableValidation",
      "enableTransformation",
      "ignoreChanges",
      "resourceGroupId",
      "monitoring", // Framework-level monitoring configuration
      "virtualNetworkId", // Framework-level dependency tracking for child resources
    ]);

    for (const [propName, propValue] of Object.entries(properties)) {
      const fullPath = basePath ? `${basePath}.${propName}` : propName;

      // Skip framework properties
      if (frameworkProperties.has(propName)) {
        continue;
      }

      const propDef = this._schema.properties[propName];

      if (!propDef) {
        warnings.push(`Unknown property '${propName}' not defined in schema`);
        continue;
      }

      // Check if property is deprecated
      if (propDef.deprecated) {
        warnings.push(`Property '${propName}' is deprecated`);
      }

      // Validate property type
      const typeErrors = this._validatePropertyType(
        propValue,
        propDef,
        fullPath,
      );
      if (typeErrors.length > 0) {
        errors.push(...typeErrors);

        if (!propertyErrors[fullPath]) {
          propertyErrors[fullPath] = [];
        }
        propertyErrors[fullPath].push(...typeErrors);
      }

      // Apply validation rules
      if (propDef.validation) {
        const ruleErrors = this._applyValidationRules(
          propValue,
          propDef.validation,
          fullPath,
        );
        if (ruleErrors.length > 0) {
          errors.push(...ruleErrors);

          if (!propertyErrors[fullPath]) {
            propertyErrors[fullPath] = [];
          }
          propertyErrors[fullPath].push(...ruleErrors);
        }
      }
    }
  }

  /**
   * Validates property type against definition
   */
  private _validatePropertyType(
    value: any,
    propDef: PropertyDefinition,
    propertyPath: string,
  ): string[] {
    const errors: string[] = [];

    if (value === undefined || value === null) {
      if (propDef.required) {
        errors.push(
          `Property '${propertyPath}' is required but is ${value === null ? "null" : "undefined"}`,
        );
      }
      return errors;
    }

    switch (propDef.dataType) {
      case PropertyType.STRING:
        if (typeof value !== "string") {
          errors.push(
            `Property '${propertyPath}' must be a string, got: ${typeof value}`,
          );
        }
        break;

      case PropertyType.NUMBER:
        if (typeof value !== "number") {
          errors.push(
            `Property '${propertyPath}' must be a number, got: ${typeof value}`,
          );
        }
        break;

      case PropertyType.BOOLEAN:
        if (typeof value !== "boolean") {
          errors.push(
            `Property '${propertyPath}' must be a boolean, got: ${typeof value}`,
          );
        }
        break;

      case PropertyType.ARRAY:
        if (!Array.isArray(value)) {
          errors.push(
            `Property '${propertyPath}' must be an array, got: ${typeof value}`,
          );
        }
        break;

      case PropertyType.OBJECT:
        if (typeof value !== "object" || Array.isArray(value)) {
          errors.push(
            `Property '${propertyPath}' must be an object, got: ${typeof value}`,
          );
        }
        break;

      case PropertyType.ANY:
        // Any type is always valid
        break;

      default:
        errors.push(
          `Unknown data type '${propDef.dataType}' for property '${propertyPath}'`,
        );
    }

    return errors;
  }

  /**
   * Applies validation rules to a property value
   */
  private _applyValidationRules(
    value: any,
    rules: ValidationRule[],
    propertyPath: string,
  ): string[] {
    const errors: string[] = [];

    for (const rule of rules) {
      switch (rule.ruleType) {
        case ValidationRuleType.REQUIRED:
          if (value === undefined || value === null || value === "") {
            errors.push(
              rule.message || `Property '${propertyPath}' is required`,
            );
          }
          break;

        case ValidationRuleType.PATTERN_MATCH:
          if (typeof value === "string" && rule.value) {
            const pattern = new RegExp(rule.value);
            if (!pattern.test(value)) {
              errors.push(
                rule.message ||
                  `Property '${propertyPath}' does not match required pattern`,
              );
            }
          }
          break;

        case ValidationRuleType.VALUE_RANGE:
          if (typeof value === "number" && rule.value) {
            const range = rule.value;
            if (range.min !== undefined && value < range.min) {
              errors.push(
                rule.message ||
                  `Property '${propertyPath}' must be at least ${range.min}`,
              );
            }
            if (range.max !== undefined && value > range.max) {
              errors.push(
                rule.message ||
                  `Property '${propertyPath}' must be at most ${range.max}`,
              );
            }
          }
          break;

        case ValidationRuleType.TYPE_CHECK:
          // Type checking is handled in _validatePropertyType
          break;

        case ValidationRuleType.CUSTOM_VALIDATION:
          // Custom validation would require function support, which is complex in JSII
          // For now, we'll just log a warning
          break;
      }
    }

    return errors;
  }

  /**
   * Applies schema-level validation rules
   */
  private _applySchemaValidationRules(
    properties: any,
    errors: string[],
    _warnings: string[],
    propertyErrors: { [key: string]: string[] },
  ): void {
    if (!this._schema.validationRules) {
      return;
    }

    for (const validation of this._schema.validationRules) {
      const propValue = properties[validation.property];
      const ruleErrors = this._applyValidationRules(
        propValue,
        validation.rules,
        validation.property,
      );
      if (ruleErrors.length > 0) {
        errors.push(...ruleErrors);

        if (!propertyErrors[validation.property]) {
          propertyErrors[validation.property] = [];
        }
        propertyErrors[validation.property].push(...ruleErrors);
      }
    }
  }

  /**
   * Applies default values to an object
   */
  private _applyDefaultsToObject(obj: any, _basePath: string): void {
    for (const [propName, propDef] of Object.entries(this._schema.properties)) {
      if (!(propName in obj) && propDef.defaultValue !== undefined) {
        obj[propName] = propDef.defaultValue;
      }
    }
  }
}
