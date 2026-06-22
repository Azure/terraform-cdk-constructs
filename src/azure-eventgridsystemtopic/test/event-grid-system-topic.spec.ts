import { Testing } from "cdktn";
import * as cdktn from "cdktn";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  EventGridSystemTopic,
  EventGridSystemTopicProps,
} from "../lib/event-grid-system-topic";
import {
  ALL_SYSTEM_TOPIC_VERSIONS,
  SYSTEM_TOPIC_TYPE,
} from "../lib/event-grid-system-topic-schemas";

describe("EventGridSystemTopic - Unified Implementation", () => {
  let app: cdktn.App;
  let stack: cdktn.TerraformStack;
  let manager: ApiVersionManager;

  const source =
    "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/teststorage";
  const topicType = "Microsoft.Storage.StorageAccounts";
  const resourceGroupId = "/subscriptions/test-sub/resourceGroups/test-rg";

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktn.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    try {
      manager.registerResourceType(
        SYSTEM_TOPIC_TYPE,
        ALL_SYSTEM_TOPIC_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create system topic with automatic latest version resolution", () => {
      const props: EventGridSystemTopicProps = {
        name: "test-system-topic",
        location: "eastus",
        source,
        topicType,
        resourceGroupId,
      };

      const systemTopic = new EventGridSystemTopic(
        stack,
        "TestSystemTopic",
        props,
      );

      expect(systemTopic).toBeInstanceOf(EventGridSystemTopic);
      expect(systemTopic.resolvedApiVersion).toBe("2025-02-15");
      expect(systemTopic.props).toBe(props);
      expect(systemTopic.name).toBe("test-system-topic");
      expect(systemTopic.location).toBe("eastus");
    });

    it("should create system topic with explicit version pinning", () => {
      const props: EventGridSystemTopicProps = {
        name: "test-system-topic-pinned",
        location: "westus",
        source,
        topicType,
        resourceGroupId,
        apiVersion: "2025-02-15",
      };

      const systemTopic = new EventGridSystemTopic(
        stack,
        "PinnedSystemTopic",
        props,
      );

      expect(systemTopic.resolvedApiVersion).toBe("2025-02-15");
    });

    it("should create system topic with all optional properties", () => {
      const props: EventGridSystemTopicProps = {
        name: "test-system-topic-full",
        location: "centralus",
        source,
        topicType,
        resourceGroupId,
        identity: {
          type: "SystemAssigned",
        },
        tags: {
          environment: "production",
          project: "terraform-cdk-constructs",
        },
      };

      const systemTopic = new EventGridSystemTopic(
        stack,
        "FullSystemTopic",
        props,
      );

      expect(systemTopic.props.identity).toEqual(props.identity);
      expect(systemTopic.props.tags).toEqual(props.tags);
    });

    it("should require location to be provided", () => {
      const props: EventGridSystemTopicProps = {
        name: "test-system-topic",
        source,
        topicType,
        resourceGroupId,
      };

      expect(() => {
        new EventGridSystemTopic(stack, "MissingLocation", props);
      }).toThrow("Location is required for Microsoft.EventGrid/systemTopics");
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const systemTopic = new EventGridSystemTopic(stack, "TestSystemTopic", {
        name: "test-system-topic",
        location: "eastus",
        source,
        topicType,
        resourceGroupId,
      });

      expect(systemTopic.resolvedApiVersion).toBe("2025-02-15");
      expect(systemTopic.latestVersion()).toBe("2025-02-15");
    });

    it("should support all registered API versions", () => {
      const systemTopic = new EventGridSystemTopic(stack, "TestSystemTopic", {
        name: "test-system-topic",
        location: "eastus",
        source,
        topicType,
        resourceGroupId,
      });

      expect(systemTopic.supportedVersions()).toEqual(["2025-02-15"]);
    });

    it("should validate version support", () => {
      expect(() => {
        new EventGridSystemTopic(stack, "ValidVersion", {
          name: "test-system-topic",
          location: "eastus",
          source,
          topicType,
          resourceGroupId,
          apiVersion: "2025-02-15",
        });
      }).not.toThrow();

      expect(() => {
        new EventGridSystemTopic(stack, "InvalidVersion", {
          name: "test-system-topic",
          location: "eastus",
          source,
          topicType,
          resourceGroupId,
          apiVersion: "2026-01-01",
        });
      }).toThrow("Unsupported API version '2026-01-01'");
    });

    it("should load correct schema for resolved version", () => {
      const systemTopic = new EventGridSystemTopic(stack, "TestSystemTopic", {
        name: "test-system-topic",
        location: "eastus",
        source,
        topicType,
        resourceGroupId,
      });

      expect(systemTopic.schema).toBeDefined();
      expect(systemTopic.schema.resourceType).toBe(SYSTEM_TOPIC_TYPE);
      expect(systemTopic.schema.version).toBe("2025-02-15");
      expect(systemTopic.schema.properties).toBeDefined();
    });

    it("should load version configuration correctly", () => {
      const systemTopic = new EventGridSystemTopic(stack, "TestSystemTopic", {
        name: "test-system-topic",
        location: "eastus",
        source,
        topicType,
        resourceGroupId,
      });

      expect(systemTopic.versionConfig).toBeDefined();
      expect(systemTopic.versionConfig.version).toBe("2025-02-15");
      expect(systemTopic.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });
  });

  describe("Property Validation", () => {
    it("should validate properties when validation is enabled", () => {
      const props: EventGridSystemTopicProps = {
        name: "test-system-topic",
        location: "eastus",
        source,
        topicType,
        resourceGroupId,
        enableValidation: true,
      };

      expect(() => {
        new EventGridSystemTopic(stack, "ValidatedSystemTopic", props);
      }).not.toThrow();
    });

    it("should have validation results for valid properties", () => {
      const systemTopic = new EventGridSystemTopic(
        stack,
        "ValidatedSystemTopic",
        {
          name: "valid-system-topic",
          location: "eastus",
          source,
          topicType,
          resourceGroupId,
          enableValidation: true,
        },
      );

      expect(systemTopic.validationResult).toBeDefined();
      expect(systemTopic.validationResult!.valid).toBe(true);
      expect(systemTopic.validationResult!.errors).toHaveLength(0);
    });

    it("should create Terraform outputs", () => {
      const systemTopic = new EventGridSystemTopic(
        stack,
        "OutputsSystemTopic",
        {
          name: "outputs-system-topic",
          location: "eastus",
          source,
          topicType,
          resourceGroupId,
        },
      );

      expect(systemTopic.idOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(systemTopic.locationOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(systemTopic.nameOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(systemTopic.tagsOutput).toBeInstanceOf(cdktn.TerraformOutput);
    });
  });

  describe("Version Compatibility", () => {
    it("should work with all supported API versions", () => {
      const versions = ["2025-02-15"];

      versions.forEach((version) => {
        const systemTopic = new EventGridSystemTopic(
          stack,
          `SystemTopic-${version.replace(/-/g, "")}`,
          {
            name: `test-system-topic-${version}`,
            location: "eastus",
            source,
            topicType,
            resourceGroupId,
            apiVersion: version,
          },
        );

        expect(systemTopic.resolvedApiVersion).toBe(version);
        expect(systemTopic.schema.version).toBe(version);
      });
    });

    it("should expose required schema properties", () => {
      const systemTopic = new EventGridSystemTopic(stack, "SchemaSystemTopic", {
        name: "schema-system-topic",
        location: "eastus",
        source,
        topicType,
        resourceGroupId,
      });

      expect(systemTopic.schema.properties.location).toBeDefined();
      expect(systemTopic.schema.properties.name).toBeDefined();
      expect(systemTopic.schema.properties.source).toBeDefined();
      expect(systemTopic.schema.properties.topicType).toBeDefined();
      expect(systemTopic.schema.properties.identity).toBeDefined();
    });
  });

  describe("Public Methods and Properties", () => {
    it("should have resourceId property matching id", () => {
      const systemTopic = new EventGridSystemTopic(
        stack,
        "ResourceIdSystemTopic",
        {
          name: "resource-id-system-topic",
          location: "eastus",
          source,
          topicType,
          resourceGroupId,
        },
      );

      expect(systemTopic.resourceId).toBe(systemTopic.id);
    });
  });
});
