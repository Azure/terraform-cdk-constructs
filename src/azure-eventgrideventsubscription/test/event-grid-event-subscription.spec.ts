import { Testing } from "cdktn";
import * as cdktn from "cdktn";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  EventGridEventSubscription,
  EventGridEventSubscriptionProps,
} from "../lib/event-grid-event-subscription";
import {
  ALL_EVENT_SUBSCRIPTION_VERSIONS,
  EVENT_SUBSCRIPTION_TYPE,
} from "../lib/event-grid-event-subscription-schemas";

describe("EventGridEventSubscription - Implementation", () => {
  let app: cdktn.App;
  let stack: cdktn.TerraformStack;
  let manager: ApiVersionManager;

  const scope =
    "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.EventGrid/systemTopics/test-topic";
  const destination = {
    endpointType: "WebHook",
    properties: {
      endpointUrl: "https://example.com/webhook",
    },
  };

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktn.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    try {
      manager.registerResourceType(
        EVENT_SUBSCRIPTION_TYPE,
        ALL_EVENT_SUBSCRIPTION_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create event subscription with automatic latest version resolution", () => {
      const props: EventGridEventSubscriptionProps = {
        name: "test-event-subscription",
        scope,
        destination,
      };

      const eventSubscription = new EventGridEventSubscription(
        stack,
        "TestEventSubscription",
        props,
      );

      expect(eventSubscription).toBeInstanceOf(EventGridEventSubscription);
      expect(eventSubscription.resolvedApiVersion).toBe("2025-02-15");
      expect(eventSubscription.props).toBe(props);
      expect(eventSubscription.name).toBe("test-event-subscription");
    });

    it("should create event subscription with explicit version pinning", () => {
      const props: EventGridEventSubscriptionProps = {
        name: "test-event-subscription-pinned",
        scope,
        destination,
        apiVersion: "2025-02-15",
      };

      const eventSubscription = new EventGridEventSubscription(
        stack,
        "PinnedEventSubscription",
        props,
      );

      expect(eventSubscription.resolvedApiVersion).toBe("2025-02-15");
    });

    it("should create event subscription with optional filter and delivery properties", () => {
      const props: EventGridEventSubscriptionProps = {
        name: "test-event-subscription-full",
        scope,
        destination,
        filter: {
          subjectBeginsWith: "/blobServices/default/containers/images/",
          subjectEndsWith: ".jpg",
          includedEventTypes: ["Microsoft.Storage.BlobCreated"],
          isSubjectCaseSensitive: false,
          advancedFilters: [
            {
              operatorType: "NumberGreaterThan",
              key: "data.contentLength",
              value: 0,
            },
          ],
        },
        retryPolicy: {
          maxDeliveryAttempts: 10,
          eventTimeToLiveInMinutes: 1440,
        },
        deadLetterDestination: {
          endpointType: "StorageBlob",
          properties: {
            resourceId:
              "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/testdeadletter",
            blobContainerName: "deadletters",
          },
        },
        labels: ["production", "images"],
        expirationTimeUtc: "2026-01-01T00:00:00Z",
      };

      const eventSubscription = new EventGridEventSubscription(
        stack,
        "FullEventSubscription",
        props,
      );

      expect(eventSubscription.props.filter).toEqual(props.filter);
      expect(eventSubscription.props.retryPolicy).toEqual(props.retryPolicy);
      expect(eventSubscription.props.deadLetterDestination).toEqual(
        props.deadLetterDestination,
      );
      expect(eventSubscription.props.labels).toEqual(props.labels);
      expect(eventSubscription.props.expirationTimeUtc).toBe(
        props.expirationTimeUtc,
      );
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const eventSubscription = new EventGridEventSubscription(
        stack,
        "TestEventSubscription",
        {
          name: "test-event-subscription",
          scope,
          destination,
        },
      );

      expect(eventSubscription.resolvedApiVersion).toBe("2025-02-15");
      expect(eventSubscription.latestVersion()).toBe("2025-02-15");
    });

    it("should provide supported versions", () => {
      const eventSubscription = new EventGridEventSubscription(
        stack,
        "TestEventSubscription",
        {
          name: "test-event-subscription",
          scope,
          destination,
        },
      );

      expect(eventSubscription.supportedVersions()).toEqual(["2025-02-15"]);
    });

    it("should validate version support", () => {
      expect(() => {
        new EventGridEventSubscription(stack, "ValidVersion", {
          name: "test-event-subscription",
          scope,
          destination,
          apiVersion: "2025-02-15",
        });
      }).not.toThrow();

      expect(() => {
        new EventGridEventSubscription(stack, "InvalidVersion", {
          name: "test-event-subscription",
          scope,
          destination,
          apiVersion: "2026-01-01",
        });
      }).toThrow("Unsupported API version '2026-01-01'");
    });

    it("should load correct schema for resolved version", () => {
      const eventSubscription = new EventGridEventSubscription(
        stack,
        "TestEventSubscription",
        {
          name: "test-event-subscription",
          scope,
          destination,
        },
      );

      expect(eventSubscription.schema).toBeDefined();
      expect(eventSubscription.schema.resourceType).toBe(
        EVENT_SUBSCRIPTION_TYPE,
      );
      expect(eventSubscription.schema.version).toBe("2025-02-15");
      expect(eventSubscription.schema.properties).toBeDefined();
    });

    it("should load version configuration correctly", () => {
      const eventSubscription = new EventGridEventSubscription(
        stack,
        "TestEventSubscription",
        {
          name: "test-event-subscription",
          scope,
          destination,
        },
      );

      expect(eventSubscription.versionConfig).toBeDefined();
      expect(eventSubscription.versionConfig.version).toBe("2025-02-15");
      expect(eventSubscription.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });
  });

  describe("Property Validation", () => {
    it("should validate properties when validation is enabled", () => {
      expect(() => {
        new EventGridEventSubscription(stack, "ValidatedEventSubscription", {
          name: "validated-event-subscription",
          scope,
          destination,
          enableValidation: true,
        });
      }).not.toThrow();
    });

    it("should have validation results for valid properties", () => {
      const eventSubscription = new EventGridEventSubscription(
        stack,
        "ValidatedEventSubscription",
        {
          name: "validated-event-subscription",
          scope,
          destination,
          enableValidation: true,
        },
      );

      expect(eventSubscription.validationResult).toBeDefined();
      expect(eventSubscription.validationResult!.valid).toBe(true);
      expect(eventSubscription.validationResult!.errors).toHaveLength(0);
    });

    it("should create Terraform outputs", () => {
      const eventSubscription = new EventGridEventSubscription(
        stack,
        "OutputsEventSubscription",
        {
          name: "outputs-event-subscription",
          scope,
          destination,
        },
      );

      expect(eventSubscription.idOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(eventSubscription.nameOutput).toBeInstanceOf(
        cdktn.TerraformOutput,
      );
    });
  });

  describe("Parent-Child Resource Relationship", () => {
    it("should use scope as parent ID", () => {
      const eventSubscription = new EventGridEventSubscription(
        stack,
        "ParentEventSubscription",
        {
          name: "parent-event-subscription",
          scope,
          destination,
        },
      );

      expect(eventSubscription.props.scope).toBe(scope);
    });

    it("should synthesize as a child resource without location", () => {
      new EventGridEventSubscription(stack, "SynthEventSubscription", {
        name: "synth-event-subscription",
        scope,
        destination,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("eventSubscriptions");
      expect(synthesized).toContain(scope);
    });
  });

  describe("Version Compatibility", () => {
    it("should work with all supported API versions", () => {
      const versions = ["2025-02-15"];

      versions.forEach((version) => {
        const eventSubscription = new EventGridEventSubscription(
          stack,
          `EventSubscription-${version.replace(/-/g, "")}`,
          {
            name: `test-event-subscription-${version}`,
            scope,
            destination,
            apiVersion: version,
          },
        );

        expect(eventSubscription.resolvedApiVersion).toBe(version);
        expect(eventSubscription.schema.version).toBe(version);
      });
    });

    it("should expose expected schema properties", () => {
      const eventSubscription = new EventGridEventSubscription(
        stack,
        "SchemaEventSubscription",
        {
          name: "schema-event-subscription",
          scope,
          destination,
        },
      );

      expect(eventSubscription.schema.properties.name).toBeDefined();
      expect(eventSubscription.schema.properties.destination).toBeDefined();
      expect(eventSubscription.schema.properties.filter).toBeDefined();
      expect(eventSubscription.schema.properties.retryPolicy).toBeDefined();
      expect(eventSubscription.schema.properties.labels).toBeDefined();
    });
  });

  describe("Public Methods and Properties", () => {
    it("should have resourceId property matching id", () => {
      const eventSubscription = new EventGridEventSubscription(
        stack,
        "ResourceIdEventSubscription",
        {
          name: "resource-id-event-subscription",
          scope,
          destination,
        },
      );

      expect(eventSubscription.resourceId).toBe(eventSubscription.id);
    });
  });
});
