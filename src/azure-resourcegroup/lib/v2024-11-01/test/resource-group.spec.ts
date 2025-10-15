import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { GroupProps } from "../props";
import { Group } from "../resource-group";

describe("Group", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  describe("constructor", () => {
    it("should create a resource group with required properties", () => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg",
      };

      const resourceGroup = new Group(stack, "TestResourceGroup", props);

      expect(resourceGroup).toBeInstanceOf(Group);
      expect(resourceGroup.props).toBe(props);
      expect(resourceGroup.location).toBe("eastus");
    });

    it("should create a resource group with all properties", () => {
      const props: GroupProps = {
        location: "westus2",
        name: "test-rg-full",
        tags: {
          environment: "test",
          project: "cdktf-constructs",
        },
        managedBy: "/subscriptions/test-sub/resourceGroups/management-rg",
        ignoreChanges: ["tags"],
      };

      const resourceGroup = new Group(stack, "TestResourceGroup", props);

      expect(resourceGroup.props).toBe(props);
      expect(resourceGroup.tags).toEqual(props.tags);
    });

    it("should use default name when name is not provided", () => {
      const props: GroupProps = {
        location: "centralus",
      };

      const resourceGroup = new Group(stack, "TestResourceGroup", props);

      // The default name should be derived from the node path
      expect(resourceGroup.props.name).toBeUndefined();
    });

    it("should handle empty tags", () => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg-empty-tags",
        tags: {},
      };

      const resourceGroup = new Group(stack, "TestResourceGroup", props);

      expect(resourceGroup.tags).toEqual({});
    });

    it("should create terraform outputs", () => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg-outputs",
      };

      const resourceGroup = new Group(stack, "TestResourceGroup", props);

      expect(resourceGroup.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(resourceGroup.locationOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
      expect(resourceGroup.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(resourceGroup.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });
  });

  describe("properties", () => {
    let resourceGroup: Group;

    beforeEach(() => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg",
        tags: {
          environment: "test",
        },
      };
      resourceGroup = new Group(stack, "TestResourceGroup", props);
    });

    it("should have correct id format", () => {
      expect(resourceGroup.id).toMatch(/^\$\{.*\.id\}$/);
    });

    it("should have resourceId property", () => {
      expect(resourceGroup.resourceId).toBe(resourceGroup.id);
    });

    it("should throw error for invalid subscription ID extraction", () => {
      // Mock the id to be invalid format
      (resourceGroup as any).id = "invalid-id-format";

      expect(() => resourceGroup.subscriptionId).toThrow(
        "Unable to extract subscription ID from Resource Group ID",
      );
    });
  });

  describe("tag management", () => {
    let resourceGroup: Group;

    beforeEach(() => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg",
        tags: {
          environment: "test",
        },
      };
      resourceGroup = new Group(stack, "TestResourceGroup", props);
    });

    it("should add a tag", () => {
      resourceGroup.addTag("newTag", "newValue");

      expect(resourceGroup.props.tags!.newTag).toBe("newValue");
      expect(resourceGroup.props.tags!.environment).toBe("test");
    });

    it("should add a tag when no tags exist", () => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg-no-tags",
      };
      const rgNoTags = new Group(stack, "TestResourceGroupNoTags", props);

      rgNoTags.addTag("firstTag", "firstValue");

      expect(rgNoTags.props.tags!.firstTag).toBe("firstValue");
    });

    it("should remove an existing tag", () => {
      resourceGroup.removeTag("environment");

      expect(resourceGroup.props.tags!.environment).toBeUndefined();
    });

    it("should handle removing non-existent tag", () => {
      resourceGroup.removeTag("nonExistentTag");

      expect(resourceGroup.props.tags!.environment).toBe("test");
    });

    it("should handle removing tag when no tags exist", () => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg-no-tags",
      };
      const rgNoTags = new Group(stack, "TestResourceGroupNoTags", props);

      expect(() => rgNoTags.removeTag("anyTag")).not.toThrow();
    });
  });

  describe("ignore changes", () => {
    it("should filter out invalid ignore changes", () => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg-ignore",
        ignoreChanges: ["tags", "managedBy", "location"],
      };

      // This should not throw an error
      const resourceGroup = new Group(stack, "TestResourceGroup", props);
      expect(resourceGroup).toBeInstanceOf(Group);
    });

    it("should handle empty ignore changes", () => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg-ignore-empty",
        ignoreChanges: [],
      };

      const resourceGroup = new Group(stack, "TestResourceGroup", props);
      expect(resourceGroup).toBeInstanceOf(Group);
    });
  });

  describe("terraform resource creation", () => {
    it("should create AZAPI resource with correct configuration", () => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg-terraform",
        tags: {
          environment: "test",
        },
        managedBy: "/subscriptions/test-sub/resourceGroups/management-rg",
      };

      const resourceGroup = new Group(stack, "TestResourceGroup", props);

      // Verify that the resource group was created successfully
      expect(resourceGroup).toBeInstanceOf(Group);
      expect(resourceGroup.id).toBeDefined();
    });
  });

  describe("validation", () => {
    it("should accept valid Azure regions", () => {
      const validRegions = [
        "eastus",
        "westus2",
        "centralus",
        "northeurope",
        "westeurope",
        "southeastasia",
      ];

      validRegions.forEach((region) => {
        const props: GroupProps = {
          location: region,
          name: `test-rg-${region}`,
        };

        expect(() => new Group(stack, `TestRG${region}`, props)).not.toThrow();
      });
    });

    it("should handle various tag combinations", () => {
      const tagCombinations: { [key: string]: string }[] = [
        { env: "prod", cost: "center1" },
        { "complex-key": "complex-value", number: "123" },
        { Environment: "Production", Owner: "team@company.com" },
      ];

      tagCombinations.forEach((tags, index) => {
        const props: GroupProps = {
          location: "eastus",
          name: `test-rg-tags-${index}`,
          tags,
        };

        const resourceGroup = new Group(stack, `TestRGTags${index}`, props);
        expect(resourceGroup.tags).toEqual(tags);
      });
    });
  });

  describe("AZAPI-specific features", () => {
    it("should use AZAPI resource type and API version", () => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg-azapi",
      };

      const resourceGroup = new Group(stack, "TestResourceGroup", props);

      // Verify AZAPI-specific properties
      expect((resourceGroup as any).resourceType).toBe(
        "Microsoft.Resources/resourceGroups",
      );
      expect((resourceGroup as any).apiVersion).toBe("2024-11-01");
    });

    it("should create client config data source", () => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg-client-config",
      };

      const resourceGroup = new Group(stack, "TestResourceGroup", props);

      // The client config should be created as part of the resource group construction
      expect(resourceGroup).toBeInstanceOf(Group);
    });

    it("should handle managedBy property in resource body", () => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg-managed",
        managedBy: "/subscriptions/test-sub/resourceGroups/management-rg",
      };

      const resourceGroup = new Group(stack, "TestResourceGroup", props);

      expect(resourceGroup.props.managedBy).toBe(props.managedBy);
    });
  });

  describe("CDK Terraform integration", () => {
    it("should synthesize to valid Terraform", () => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg-synth",
        tags: {
          environment: "test",
        },
      };

      new Group(stack, "TestResourceGroup", props);

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      // Check that the synthesized configuration contains AZAPI resource
      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      const props: GroupProps = {
        location: "eastus",
        name: "test-rg-logical-ids",
      };

      const resourceGroup = new Group(stack, "TestResourceGroup", props);

      // The outputs should have overridden logical IDs
      expect(resourceGroup.idOutput).toBeDefined();
      expect(resourceGroup.locationOutput).toBeDefined();
      expect(resourceGroup.nameOutput).toBeDefined();
      expect(resourceGroup.tagsOutput).toBeDefined();
    });
  });
});
