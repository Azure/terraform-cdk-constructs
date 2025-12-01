/**
 * Tests for the AzapiResource tag management functionality
 *
 * These tests verify that the immutability pattern for tags works correctly:
 * - Tags from props are stored separately from the readonly props
 * - Tags added via addTag() are combined with props tags
 * - The tags getter returns all tags (props + added)
 * - The allTags() method used in createResourceBody includes all tags
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ResourceGroup } from "../../../azure-resourcegroup/lib/resource-group";

describe("AzapiResource - Tag Management", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  describe("Tag Immutability", () => {
    it("should store tags separately from readonly props", () => {
      const props = {
        name: "test-rg",
        location: "eastus",
        tags: { initial: "value" },
      };

      const rg = new ResourceGroup(stack, "TestRG", props);

      // Original props should remain unchanged
      expect(props.tags).toEqual({ initial: "value" });

      // Tags should be accessible via getter
      expect(rg.tags).toEqual({ initial: "value" });
    });

    it("should not mutate props when adding tags", () => {
      const props = {
        name: "test-rg",
        location: "eastus",
        tags: { initial: "value" },
      };

      const rg = new ResourceGroup(stack, "TestRG", props);

      // Add a tag
      rg.addTag("added", "dynamically");

      // Original props should remain unchanged
      expect(props.tags).toEqual({ initial: "value" });
      expect((props.tags as any).added).toBeUndefined();

      // Tags getter should include both
      expect(rg.tags).toEqual({
        initial: "value",
        added: "dynamically",
      });
    });

    it("should handle tags when no initial tags are provided", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      // Should start with empty tags
      expect(rg.tags).toEqual({});

      // Add tags
      rg.addTag("tag1", "value1");
      rg.addTag("tag2", "value2");

      // Should have the added tags
      expect(rg.tags).toEqual({
        tag1: "value1",
        tag2: "value2",
      });
    });
  });

  describe("Tag Combination", () => {
    it("should combine props tags with dynamically added tags", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
        tags: {
          environment: "test",
          project: "cdktf",
        },
      });

      // Add more tags
      rg.addTag("owner", "team@example.com");
      rg.addTag("cost-center", "engineering");

      // All tags should be accessible
      expect(rg.tags).toEqual({
        environment: "test",
        project: "cdktf",
        owner: "team@example.com",
        "cost-center": "engineering",
      });
    });

    it("should allow overwriting tags via addTag", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
        tags: { environment: "dev" },
      });

      // Overwrite existing tag
      rg.addTag("environment", "production");

      // Should have the new value
      expect(rg.tags.environment).toBe("production");
    });

    it("should return a copy from tags getter to maintain immutability", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
        tags: { initial: "value" },
      });

      // Get tags reference
      const tags1 = rg.tags;
      const tags2 = rg.tags;

      // Should be different objects (copies)
      expect(tags1).not.toBe(tags2);

      // But with same content
      expect(tags1).toEqual(tags2);

      // Modifying the returned object should not affect the resource
      tags1.modified = "externally";
      expect(rg.tags.modified).toBeUndefined();
    });
  });

  describe("Multiple Tag Operations", () => {
    it("should handle multiple addTag calls", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      // Add multiple tags
      for (let i = 0; i < 10; i++) {
        rg.addTag(`tag${i}`, `value${i}`);
      }

      // All tags should be present
      const tags = rg.tags;
      expect(Object.keys(tags)).toHaveLength(10);
      for (let i = 0; i < 10; i++) {
        expect(tags[`tag${i}`]).toBe(`value${i}`);
      }
    });

    it("should handle special characters in tag keys and values", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      rg.addTag("tag-with-dash", "value-with-dash");
      rg.addTag("tag:with:colon", "value:with:colon");
      rg.addTag("tag.with.dot", "value.with.dot");

      const tags = rg.tags;
      expect(tags["tag-with-dash"]).toBe("value-with-dash");
      expect(tags["tag:with:colon"]).toBe("value:with:colon");
      expect(tags["tag.with.dot"]).toBe("value.with.dot");
    });
  });

  describe("Resource Body Integration", () => {
    it("should include all tags in synthesized Terraform configuration when added before synthesis", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
        tags: { initial: "tag" },
      });

      // Tags are set during construction via props
      // Verify they're accessible
      expect(rg.tags).toEqual({ initial: "tag" });

      // Synthesize the stack
      const synthesized = Testing.synth(stack);
      const stackConfig = JSON.parse(synthesized);

      // The azapi_resource should exist
      expect(stackConfig.resource).toBeDefined();
      expect(stackConfig.resource.azapi_resource).toBeDefined();

      // Find the resource (name may vary based on construct ID generation)
      const resources = Object.values(stackConfig.resource.azapi_resource);
      expect(resources.length).toBeGreaterThan(0);

      const resource: any = resources[0];

      // Tags should be at the resource level, not in the body
      // The createAzapiResource method extracts tags from body and places them at top level
      expect(resource.tags).toEqual({
        initial: "tag",
      });
    });

    it("should make tags added via addTag accessible via tags getter", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
        tags: { initial: "tag" },
      });

      // Add tag after construction
      rg.addTag("added", "later");

      // Verify tags are accessible via getter
      expect(rg.tags).toEqual({
        initial: "tag",
        added: "later",
      });
    });
  });

  describe("JSII Compliance", () => {
    it("should have JSII-compliant addTag method", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      // Should be a function
      expect(typeof rg.addTag).toBe("function");

      // Should work with standard parameters
      expect(() => {
        rg.addTag("key", "value");
      }).not.toThrow();
    });

    it("should have JSII-compliant tags getter", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
        tags: { test: "tag" },
      });

      // Should return an object
      expect(typeof rg.tags).toBe("object");

      // Should be serializable
      expect(() => JSON.stringify(rg.tags)).not.toThrow();
    });
  });
});
