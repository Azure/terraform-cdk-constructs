/**
 * Comprehensive tests for SchemaMapper - Property transformation and validation engine
 *
 * This test suite validates all functionality of the SchemaMapper class,
 * including property validation, transformation, default value application, and error handling.
 */

import { SchemaMapper } from "./schema-mapper";
import {
  ApiSchema,
  PropertyDefinition,
  PropertyType,
  ValidationRuleType,
  // ValidationResult,
} from "../../version-manager/interfaces/version-interfaces";

describe("SchemaMapper", () => {
  // Test data setup
  const createTestSchema = (
    properties: { [key: string]: PropertyDefinition } = {},
  ): ApiSchema => ({
    resourceType: "Microsoft.Test/resources",
    version: "2024-01-01",
    properties: {
      name: {
        dataType: PropertyType.STRING,
        required: true,
        description: "Resource name",
        validation: [
          {
            ruleType: ValidationRuleType.REQUIRED,
            message: "Name is required",
          },
          {
            ruleType: ValidationRuleType.PATTERN_MATCH,
            value: "^[a-zA-Z0-9-]+$",
            message:
              "Name must contain only alphanumeric characters and hyphens",
          },
        ],
      },
      location: {
        dataType: PropertyType.STRING,
        required: true,
        description: "Resource location",
        validation: [
          {
            ruleType: ValidationRuleType.REQUIRED,
            message: "Location is required",
          },
        ],
      },
      tags: {
        dataType: PropertyType.OBJECT,
        required: false,
        defaultValue: {},
        description: "Resource tags",
      },
      ...properties,
    },
    required: ["name", "location"],
    optional: ["tags"],
    deprecated: [],
    transformationRules: {},
    validationRules: [
      {
        property: "name",
        rules: [
          {
            ruleType: ValidationRuleType.REQUIRED,
            message: "Name is required",
          },
        ],
      },
    ],
  });

  describe("Factory Method", () => {
    it("should create SchemaMapper instance successfully", () => {
      const schema = createTestSchema();
      const mapper = SchemaMapper.create(schema);

      expect(mapper).toBeInstanceOf(SchemaMapper);
    });

    it("should validate schema input", () => {
      expect(() => {
        SchemaMapper.create(null as any);
      }).toThrow("Schema cannot be undefined or null");

      expect(() => {
        SchemaMapper.create(undefined as any);
      }).toThrow("Schema cannot be undefined or null");
    });

    it("should validate schema has valid resourceType", () => {
      const invalidSchema = createTestSchema();
      (invalidSchema as any).resourceType = "";

      expect(() => {
        SchemaMapper.create(invalidSchema);
      }).toThrow("Schema must have a valid resourceType");

      (invalidSchema as any).resourceType = "   ";
      expect(() => {
        SchemaMapper.create(invalidSchema);
      }).toThrow("Schema must have a valid resourceType");
    });

    it("should validate schema has valid version", () => {
      const invalidSchema = createTestSchema();
      (invalidSchema as any).version = "";

      expect(() => {
        SchemaMapper.create(invalidSchema);
      }).toThrow("Schema must have a valid version");
    });

    it("should validate schema has properties", () => {
      const invalidSchema = createTestSchema();
      (invalidSchema as any).properties = null;

      expect(() => {
        SchemaMapper.create(invalidSchema);
      }).toThrow("Schema must have a properties definition");
    });

    it("should validate schema has required array", () => {
      const invalidSchema = createTestSchema();
      (invalidSchema as any).required = null;

      expect(() => {
        SchemaMapper.create(invalidSchema);
      }).toThrow("Schema must have a required properties array");

      (invalidSchema as any).required = "not-an-array";
      expect(() => {
        SchemaMapper.create(invalidSchema);
      }).toThrow("Schema must have a required properties array");
    });
  });

  describe("Property Validation", () => {
    let mapper: SchemaMapper;

    beforeEach(() => {
      const schema = createTestSchema();
      mapper = SchemaMapper.create(schema);
    });

    it("should validate valid properties successfully", () => {
      const properties = {
        name: "test-resource",
        location: "eastus",
        tags: { environment: "test" },
      };

      const result = mapper.validateProperties(properties);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it("should validate null/undefined input", () => {
      const result = mapper.validateProperties(null);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Properties cannot be undefined or null");
    });

    it("should validate required properties", () => {
      const properties = {
        tags: { environment: "test" },
      };

      const result = mapper.validateProperties(properties);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Required property 'name' is missing");
      expect(result.errors).toContain(
        "Required property 'location' is missing",
      );
      expect(result.propertyErrors).toBeDefined();
      expect(result.propertyErrors!.name).toContain(
        "Required property 'name' is missing",
      );
    });

    it("should validate property types", () => {
      const properties = {
        name: 123, // Should be string
        location: "eastus",
        tags: "not-an-object", // Should be object
      };

      const result = mapper.validateProperties(properties);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Property 'name' must be a string, got: number",
      );
      expect(result.errors).toContain(
        "Property 'tags' must be an object, got: string",
      );
    });

    it("should validate pattern matching", () => {
      const properties = {
        name: "invalid name with spaces!", // Doesn't match pattern
        location: "eastus",
      };

      const result = mapper.validateProperties(properties);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((error) =>
          error.includes(
            "Name must contain only alphanumeric characters and hyphens",
          ),
        ),
      ).toBe(true);
    });

    it("should generate warnings for unknown properties", () => {
      const properties = {
        name: "test-resource",
        location: "eastus",
        unknownProperty: "value",
      };

      const result = mapper.validateProperties(properties);

      expect(result.valid).toBe(true);
      expect(result.warnings).toContain(
        "Unknown property 'unknownProperty' not defined in schema",
      );
    });

    it("should handle deprecated properties", () => {
      const schemaWithDeprecated = createTestSchema({
        deprecatedProp: {
          dataType: PropertyType.STRING,
          required: false,
          deprecated: true,
          description: "This property is deprecated",
        },
      });

      const mapperWithDeprecated = SchemaMapper.create(schemaWithDeprecated);
      const properties = {
        name: "test-resource",
        location: "eastus",
        deprecatedProp: "value",
      };

      const result = mapperWithDeprecated.validateProperties(properties);

      expect(result.valid).toBe(true);
      expect(result.warnings).toContain(
        "Property 'deprecatedProp' is deprecated",
      );
    });
  });

  describe("Property Type Validation", () => {
    let mapper: SchemaMapper;

    beforeEach(() => {
      const schema = createTestSchema({
        stringProp: { dataType: PropertyType.STRING, required: false },
        numberProp: { dataType: PropertyType.NUMBER, required: false },
        booleanProp: { dataType: PropertyType.BOOLEAN, required: false },
        arrayProp: { dataType: PropertyType.ARRAY, required: false },
        objectProp: { dataType: PropertyType.OBJECT, required: false },
        anyProp: { dataType: PropertyType.ANY, required: false },
      });
      mapper = SchemaMapper.create(schema);
    });

    it("should validate string properties", () => {
      const properties = {
        name: "test",
        location: "eastus",
        stringProp: "valid string",
      };

      const result = mapper.validateProperties(properties);
      expect(result.valid).toBe(true);
    });

    it("should validate number properties", () => {
      const properties = {
        name: "test",
        location: "eastus",
        numberProp: 42,
      };

      const result = mapper.validateProperties(properties);
      expect(result.valid).toBe(true);
    });

    it("should validate boolean properties", () => {
      const properties = {
        name: "test",
        location: "eastus",
        booleanProp: true,
      };

      const result = mapper.validateProperties(properties);
      expect(result.valid).toBe(true);
    });

    it("should validate array properties", () => {
      const properties = {
        name: "test",
        location: "eastus",
        arrayProp: ["item1", "item2"],
      };

      const result = mapper.validateProperties(properties);
      expect(result.valid).toBe(true);
    });

    it("should validate object properties", () => {
      const properties = {
        name: "test",
        location: "eastus",
        objectProp: { key: "value" },
      };

      const result = mapper.validateProperties(properties);
      expect(result.valid).toBe(true);
    });

    it("should accept any type for ANY properties", () => {
      const properties = {
        name: "test",
        location: "eastus",
        anyProp: "string",
      };

      let result = mapper.validateProperties(properties);
      expect(result.valid).toBe(true);

      properties.anyProp = 42 as any;
      result = mapper.validateProperties(properties);
      expect(result.valid).toBe(true);

      properties.anyProp = { complex: "object" } as any;
      result = mapper.validateProperties(properties);
      expect(result.valid).toBe(true);
    });
  });

  describe("Validation Rules", () => {
    it("should validate VALUE_RANGE rules", () => {
      const schema = createTestSchema({
        count: {
          dataType: PropertyType.NUMBER,
          required: false,
          validation: [
            {
              ruleType: ValidationRuleType.VALUE_RANGE,
              value: { min: 1, max: 10 },
              message: "Count must be between 1 and 10",
            },
          ],
        },
      });

      const mapper = SchemaMapper.create(schema);

      // Valid value
      let result = mapper.validateProperties({
        name: "test",
        location: "eastus",
        count: 5,
      });
      expect(result.valid).toBe(true);

      // Too low
      result = mapper.validateProperties({
        name: "test",
        location: "eastus",
        count: 0,
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Count must be between 1 and 10");

      // Too high
      result = mapper.validateProperties({
        name: "test",
        location: "eastus",
        count: 15,
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Count must be between 1 and 10");
    });

    it("should handle required validation with null/undefined values", () => {
      const properties = {
        name: null,
        location: undefined,
      };

      const mapper = SchemaMapper.create(createTestSchema());
      const result = mapper.validateProperties(properties);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((error) =>
          error.includes("Property 'name' is required but is null"),
        ),
      ).toBe(true);
      expect(
        result.errors.some((error) =>
          error.includes("Property 'location' is required but is undefined"),
        ),
      ).toBe(true);
    });
  });

  describe("Default Value Application", () => {
    let mapper: SchemaMapper;

    beforeEach(() => {
      const schema = createTestSchema({
        defaultString: {
          dataType: PropertyType.STRING,
          required: false,
          defaultValue: "default-value",
        },
        defaultNumber: {
          dataType: PropertyType.NUMBER,
          required: false,
          defaultValue: 42,
        },
        defaultObject: {
          dataType: PropertyType.OBJECT,
          required: false,
          defaultValue: { default: true },
        },
      });
      mapper = SchemaMapper.create(schema);
    });

    it("should apply default values for missing properties", () => {
      const properties = {
        name: "test",
        location: "eastus",
      };

      const result = mapper.applyDefaults(properties);

      expect(result.name).toBe("test");
      expect(result.location).toBe("eastus");
      expect(result.tags).toEqual({});
      expect(result.defaultString).toBe("default-value");
      expect(result.defaultNumber).toBe(42);
      expect(result.defaultObject).toEqual({ default: true });
    });

    it("should not override existing values", () => {
      const properties = {
        name: "test",
        location: "eastus",
        defaultString: "existing-value",
        defaultNumber: 100,
      };

      const result = mapper.applyDefaults(properties);

      expect(result.defaultString).toBe("existing-value");
      expect(result.defaultNumber).toBe(100);
    });

    it("should handle null/undefined input", () => {
      const result = mapper.applyDefaults(null);

      expect(result.tags).toEqual({});
      expect(result.defaultString).toBe("default-value");
      expect(result.defaultNumber).toBe(42);
    });

    it("should handle errors gracefully", () => {
      // Create a mapper that might cause errors during default application
      const invalidMapper = mapper as any;
      invalidMapper._schema.properties.invalidProp = {
        dataType: "invalid-type",
        defaultValue: "value",
      };

      expect(() => {
        mapper.applyDefaults({ name: "test", location: "eastus" });
      }).not.toThrow(); // Should handle errors gracefully
    });
  });

  describe("Property Transformation", () => {
    it("should transform properties between schemas", () => {
      const sourceSchema = createTestSchema();
      const targetSchema = {
        ...createTestSchema(),
        transformationRules: {
          oldName: "name",
          oldLocation: "location",
        },
      };

      const mapper = SchemaMapper.create(sourceSchema);
      const sourceProps = {
        oldName: "test-resource",
        oldLocation: "eastus",
        tags: { env: "test" },
      };

      const transformed = mapper.transformProperties(sourceProps, targetSchema);

      expect(transformed.name).toBe("test-resource");
      expect(transformed.location).toBe("eastus");
      expect(transformed.tags).toEqual({ env: "test" });
    });

    it("should handle null/undefined source properties", () => {
      const targetSchema = createTestSchema();
      const mapper = SchemaMapper.create(createTestSchema());

      const result = mapper.transformProperties(null, targetSchema);
      expect(result).toEqual({});

      const result2 = mapper.transformProperties(undefined, targetSchema);
      expect(result2).toEqual({});
    });

    it("should validate target schema", () => {
      const mapper = SchemaMapper.create(createTestSchema());

      expect(() => {
        mapper.transformProperties({ name: "test" }, null as any);
      }).toThrow("Target schema cannot be undefined or null");
    });

    it("should handle transformation errors", () => {
      const mapper = SchemaMapper.create(createTestSchema());
      const invalidTargetSchema = createTestSchema();
      (invalidTargetSchema as any).properties = null;

      expect(() => {
        mapper.transformProperties({ name: "test" }, invalidTargetSchema);
      }).toThrow("Property transformation failed");
    });
  });

  describe("Property Mapping", () => {
    let mapper: SchemaMapper;

    beforeEach(() => {
      mapper = SchemaMapper.create(createTestSchema());
    });

    it("should map individual properties", () => {
      const targetProperty: PropertyDefinition = {
        dataType: PropertyType.STRING,
        required: true,
      };

      const result = mapper.mapProperty("name", "test-value", targetProperty);
      expect(result).toBe("test-value");
    });

    it("should apply default values during mapping", () => {
      const targetProperty: PropertyDefinition = {
        dataType: PropertyType.STRING,
        required: false,
        defaultValue: "default-value",
      };

      const result = mapper.mapProperty("name", undefined, targetProperty);
      expect(result).toBe("default-value");
    });

    it("should validate property mapping input", () => {
      const targetProperty: PropertyDefinition = {
        dataType: PropertyType.STRING,
        required: true,
      };

      expect(() => {
        mapper.mapProperty("", "value", targetProperty);
      }).toThrow("Property name cannot be empty");

      expect(() => {
        mapper.mapProperty("name", "value", null as any);
      }).toThrow("Target property definition cannot be undefined");
    });

    it("should handle property mapping errors", () => {
      const targetProperty: PropertyDefinition = {
        dataType: PropertyType.NUMBER,
        required: true,
      };

      expect(() => {
        mapper.mapProperty("name", { complex: "object" }, targetProperty);
      }).toThrow("Property mapping failed for 'name'");
    });
  });

  describe("Type Transformation", () => {
    let mapper: SchemaMapper;

    beforeEach(() => {
      mapper = SchemaMapper.create(createTestSchema());
    });

    it("should transform values to string", () => {
      const targetProperty: PropertyDefinition = {
        dataType: PropertyType.STRING,
        required: false,
      };

      expect(mapper.mapProperty("prop", "string", targetProperty)).toBe(
        "string",
      );
      expect(mapper.mapProperty("prop", 42, targetProperty)).toBe("42");
      expect(mapper.mapProperty("prop", true, targetProperty)).toBe("true");
    });

    it("should transform values to number", () => {
      const targetProperty: PropertyDefinition = {
        dataType: PropertyType.NUMBER,
        required: false,
      };

      expect(mapper.mapProperty("prop", 42, targetProperty)).toBe(42);
      expect(mapper.mapProperty("prop", "42", targetProperty)).toBe(42);
      expect(mapper.mapProperty("prop", "42.5", targetProperty)).toBe(42.5);
    });

    it("should transform values to boolean", () => {
      const targetProperty: PropertyDefinition = {
        dataType: PropertyType.BOOLEAN,
        required: false,
      };

      expect(mapper.mapProperty("prop", true, targetProperty)).toBe(true);
      expect(mapper.mapProperty("prop", false, targetProperty)).toBe(false);
      expect(mapper.mapProperty("prop", "true", targetProperty)).toBe(true);
      expect(mapper.mapProperty("prop", "false", targetProperty)).toBe(false);
      expect(mapper.mapProperty("prop", "1", targetProperty)).toBe(true);
      expect(mapper.mapProperty("prop", "0", targetProperty)).toBe(false);
      expect(mapper.mapProperty("prop", 1, targetProperty)).toBe(true);
      expect(mapper.mapProperty("prop", 0, targetProperty)).toBe(false);
    });

    it("should handle array and object types", () => {
      const arrayProperty: PropertyDefinition = {
        dataType: PropertyType.ARRAY,
        required: false,
      };

      const objectProperty: PropertyDefinition = {
        dataType: PropertyType.OBJECT,
        required: false,
      };

      const array = ["item1", "item2"];
      const object = { key: "value" };

      expect(mapper.mapProperty("prop", array, arrayProperty)).toEqual(array);
      expect(mapper.mapProperty("prop", object, objectProperty)).toEqual(
        object,
      );
    });

    it("should handle transformation errors", () => {
      const stringProperty: PropertyDefinition = {
        dataType: PropertyType.STRING,
        required: false,
      };

      expect(() => {
        mapper.mapProperty("prop", { complex: "object" }, stringProperty);
      }).toThrow("Cannot convert value at 'prop' to string");
    });
  });

  describe("Error Handling and Edge Cases", () => {
    let mapper: SchemaMapper;

    beforeEach(() => {
      mapper = SchemaMapper.create(createTestSchema());
    });

    it("should handle validation with empty properties object", () => {
      const result = mapper.validateProperties({});

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Required property 'name' is missing");
      expect(result.errors).toContain(
        "Required property 'location' is missing",
      );
    });

    it("should handle complex nested validation errors", () => {
      const properties = {
        name: "",
        location: null,
        tags: "invalid",
      };

      const result = mapper.validateProperties(properties);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.propertyErrors).toBeDefined();
    });

    it("should handle circular references in objects", () => {
      const circularObj: any = { name: "test", location: "eastus" };
      circularObj.self = circularObj;

      const result = mapper.validateProperties(circularObj);
      // Should not crash, even with circular references
      expect(result).toBeDefined();
    });

    it("should handle very large objects", () => {
      const largeObject: any = { name: "test", location: "eastus" };
      for (let i = 0; i < 1000; i++) {
        largeObject[`prop${i}`] = `value${i}`;
      }

      const result = mapper.validateProperties(largeObject);
      expect(result).toBeDefined();
      expect(result.warnings.length).toBeGreaterThan(0); // Should warn about unknown properties
    });
  });

  describe("JSII Compliance", () => {
    it("should have JSII-compliant static factory method", () => {
      expect(typeof SchemaMapper.create).toBe("function");

      const schema = createTestSchema();
      const mapper = SchemaMapper.create(schema);
      expect(mapper).toBeInstanceOf(SchemaMapper);
    });

    it("should have JSII-compliant instance methods", () => {
      const mapper = SchemaMapper.create(createTestSchema());

      expect(typeof mapper.validateProperties).toBe("function");
      expect(typeof mapper.transformProperties).toBe("function");
      expect(typeof mapper.applyDefaults).toBe("function");
      expect(typeof mapper.mapProperty).toBe("function");
    });

    it("should return JSII-compliant types", () => {
      const mapper = SchemaMapper.create(createTestSchema());

      const validationResult = mapper.validateProperties({
        name: "test",
        location: "eastus",
      });
      expect(typeof validationResult.valid).toBe("boolean");
      expect(Array.isArray(validationResult.errors)).toBe(true);
      expect(Array.isArray(validationResult.warnings)).toBe(true);

      const defaults = mapper.applyDefaults({ name: "test" });
      expect(typeof defaults).toBe("object");

      const transformed = mapper.transformProperties(
        { name: "test" },
        createTestSchema(),
      );
      expect(typeof transformed).toBe("object");
    });

    it("should handle JSII type serialization", () => {
      const schema = createTestSchema();
      const mapper = SchemaMapper.create(schema);

      // Test that complex objects can be serialized/deserialized properly
      const complexProps = {
        name: "test",
        location: "eastus",
        tags: {
          nested: {
            deep: {
              value: "test",
            },
          },
        },
      };

      const result = mapper.validateProperties(complexProps);
      expect(result).toBeDefined();

      // Should be serializable to JSON (important for JSII)
      expect(() => JSON.stringify(result)).not.toThrow();
    });
  });
});
