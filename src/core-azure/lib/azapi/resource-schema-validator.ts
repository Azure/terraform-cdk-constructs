/**
 * ResourceSchemaValidator - Helper class for schema validation
 *
 * This helper class extracts validation logic from AzapiResource to follow
 * the Single Responsibility Principle. It handles property validation against
 * API schemas and provides detailed error reporting.
 *
 * @internal
 * @packageDocumentation
 */

import { SchemaMapper } from "./schema-mapper/schema-mapper";
import {
  ApiSchema,
  ValidationResult,
} from "../version-manager/interfaces/version-interfaces";

/**
 * Helper class for validating resource properties against API schemas
 *
 * This class encapsulates all validation-related operations including:
 * - Schema-based property validation
 * - Default value application
 * - Validation error formatting
 * - Integration with SchemaMapper
 *
 * @internal
 */
export class ResourceSchemaValidator {
  private readonly _schema: ApiSchema;
  private readonly _schemaMapper: SchemaMapper;

  /**
   * Creates a new ResourceSchemaValidator instance
   *
   * @param schema - The API schema to validate against
   */
  constructor(schema: ApiSchema) {
    if (!schema) {
      throw new Error("Schema cannot be undefined or null");
    }

    if (!schema.resourceType || schema.resourceType.trim().length === 0) {
      throw new Error("Schema must have a valid resourceType");
    }

    if (!schema.version || schema.version.trim().length === 0) {
      throw new Error("Schema must have a valid version");
    }

    this._schema = schema;
    this._schemaMapper = SchemaMapper.create(schema);
  }

  /**
   * Validates properties against the configured schema
   *
   * This method performs comprehensive validation including:
   * - Required property checks
   * - Type validation
   * - Custom validation rules
   * - Deprecation warnings
   *
   * @param properties - The properties to validate
   * @returns Detailed validation results with errors and warnings
   */
  public validateProps(properties: any): ValidationResult {
    if (!properties) {
      return {
        valid: false,
        errors: ["Properties cannot be undefined or null"],
        warnings: [],
      };
    }

    try {
      return this._schemaMapper.validateProperties(properties);
    } catch (error) {
      return {
        valid: false,
        errors: [
          `Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        ],
        warnings: [],
      };
    }
  }

  /**
   * Validates the schema structure itself
   *
   * This method checks if the schema is properly configured and has all
   * required fields for validation to work correctly.
   *
   * @returns Validation result indicating if schema is valid
   */
  public validateSchema(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for required schema fields
    if (!this._schema.resourceType) {
      errors.push("Schema is missing resourceType");
    }

    if (!this._schema.version) {
      errors.push("Schema is missing version");
    }

    if (!this._schema.properties) {
      errors.push("Schema is missing properties definition");
    }

    if (!this._schema.required) {
      errors.push("Schema is missing required properties array");
    }

    // Check for potential issues
    if (
      this._schema.required &&
      Array.isArray(this._schema.required) &&
      this._schema.required.length === 0
    ) {
      warnings.push("Schema has no required properties defined");
    }

    if (
      this._schema.properties &&
      Object.keys(this._schema.properties).length === 0
    ) {
      warnings.push("Schema has no properties defined");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Applies default values to properties based on schema definitions
   *
   * This method injects default values for properties that are not provided
   * but have defaults defined in the schema.
   *
   * @param properties - The properties to apply defaults to
   * @returns New properties object with default values applied
   */
  public applyDefaults(properties: any): any {
    if (!properties) {
      properties = {};
    }

    try {
      return this._schemaMapper.applyDefaults(properties);
    } catch (error) {
      throw new Error(
        `Failed to apply defaults: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Formats validation errors into user-friendly messages
   *
   * This method takes a validation result and formats the errors
   * into clear, actionable error messages.
   *
   * @param validationResult - The validation result to format
   * @returns Array of formatted error messages
   */
  public formatValidationErrors(validationResult: ValidationResult): string[] {
    const formattedErrors: string[] = [];

    // Add general errors
    formattedErrors.push(...validationResult.errors);

    // Add property-specific errors with context
    if (validationResult.propertyErrors) {
      for (const [property, errors] of Object.entries(
        validationResult.propertyErrors,
      )) {
        for (const error of errors) {
          formattedErrors.push(`[${property}] ${error}`);
        }
      }
    }

    return formattedErrors;
  }

  /**
   * Gets the schema this validator is configured for
   *
   * @returns The API schema being used for validation
   */
  public get schema(): ApiSchema {
    return this._schema;
  }

  /**
   * Gets the resource type from the schema
   *
   * @returns The Azure resource type string
   */
  public get resourceType(): string {
    return this._schema.resourceType;
  }

  /**
   * Gets the API version from the schema
   *
   * @returns The API version string
   */
  public get version(): string {
    return this._schema.version;
  }

  /**
   * Checks if a specific property is required
   *
   * @param propertyName - The name of the property to check
   * @returns True if the property is required, false otherwise
   */
  public isPropertyRequired(propertyName: string): boolean {
    if (!this._schema.required || !Array.isArray(this._schema.required)) {
      return false;
    }

    return this._schema.required.includes(propertyName);
  }

  /**
   * Checks if a specific property is deprecated
   *
   * @param propertyName - The name of the property to check
   * @returns True if the property is deprecated, false otherwise
   */
  public isPropertyDeprecated(propertyName: string): boolean {
    if (!this._schema.properties) {
      return false;
    }

    const propDef = this._schema.properties[propertyName];
    return propDef ? propDef.deprecated === true : false;
  }

  /**
   * Gets the list of all required properties
   *
   * @returns Array of required property names
   */
  public getRequiredProperties(): string[] {
    if (!this._schema.required || !Array.isArray(this._schema.required)) {
      return [];
    }

    return [...this._schema.required];
  }

  /**
   * Gets the list of all deprecated properties
   *
   * @returns Array of deprecated property names
   */
  public getDeprecatedProperties(): string[] {
    if (!this._schema.properties) {
      return [];
    }

    return Object.entries(this._schema.properties)
      .filter(([_, propDef]) => propDef.deprecated === true)
      .map(([propName]) => propName);
  }
}
