/**
 * Comprehensive tests for the EventhubNamespace and Eventhub implementations
 *
 * This test suite validates the Event Hubs constructs using the AzapiResource
 * framework. Tests cover automatic version resolution, explicit version pinning,
 * schema validation, property configurations, and resource creation.
 */

import { Testing } from "cdktn";
import * as cdktf from "cdktn";
import { Eventhub, EventhubProps } from "../lib/event-hub";
import {
  EventhubNamespace,
  EventhubNamespaceProps,
} from "../lib/event-hub-namespace";

const RG_ID = "/subscriptions/test-sub/resourceGroups/test-rg";

describe("EventhubNamespace - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  // ===========================================================================
  // Constructor and Basic Properties
  // ===========================================================================

  describe("Constructor and Basic Properties", () => {
    it("should create a namespace with minimal configuration", () => {
      const props: EventhubNamespaceProps = {
        name: "test-namespace",
        location: "eastus",
        resourceGroupId: RG_ID,
      };

      const ns = new EventhubNamespace(stack, "TestNamespace", props);

      expect(ns).toBeInstanceOf(EventhubNamespace);
      expect(ns.props).toBe(props);
      expect(ns.props.name).toBe("test-namespace");
      expect(ns.props.location).toBe("eastus");
    });

    it("should create a namespace with a custom SKU", () => {
      const props: EventhubNamespaceProps = {
        name: "sku-namespace",
        location: "eastus",
        resourceGroupId: RG_ID,
        sku: { name: "Premium", capacity: 1 },
      };

      const ns = new EventhubNamespace(stack, "SkuNamespace", props);

      expect(ns.props.sku?.name).toBe("Premium");
      expect(ns.props.sku?.capacity).toBe(1);
    });

    it("should create a namespace with auto-inflate enabled", () => {
      const props: EventhubNamespaceProps = {
        name: "inflate-namespace",
        location: "eastus",
        resourceGroupId: RG_ID,
        isAutoInflateEnabled: true,
        maximumThroughputUnits: 10,
      };

      const ns = new EventhubNamespace(stack, "InflateNamespace", props);

      expect(ns.props.isAutoInflateEnabled).toBe(true);
      expect(ns.props.maximumThroughputUnits).toBe(10);
    });
  });

  // ===========================================================================
  // Version Resolution
  // ===========================================================================

  describe("Version Resolution", () => {
    it("should use latest version 2024-01-01 when no version specified", () => {
      const ns = new EventhubNamespace(stack, "DefaultVersion", {
        name: "default-version-ns",
        location: "eastus",
        resourceGroupId: RG_ID,
      });

      expect(ns.resolvedApiVersion).toBe("2024-01-01");
    });

    it("should use explicit version when specified", () => {
      const ns = new EventhubNamespace(stack, "PinnedVersion", {
        name: "pinned-version-ns",
        location: "eastus",
        resourceGroupId: RG_ID,
        apiVersion: "2021-11-01",
      });

      expect(ns.resolvedApiVersion).toBe("2021-11-01");
    });

    it("should report the latest version", () => {
      const ns = new EventhubNamespace(stack, "LatestVersion", {
        name: "latest-version-ns",
        location: "eastus",
        resourceGroupId: RG_ID,
      });

      expect(ns.latestVersion()).toBe("2024-01-01");
    });

    it("should support all registered versions", () => {
      const versions = ["2024-01-01", "2021-11-01"];

      versions.forEach((version, index) => {
        const ns = new EventhubNamespace(stack, `Version${index}`, {
          name: `version-ns-${index}`,
          location: "eastus",
          resourceGroupId: RG_ID,
          apiVersion: version,
        });

        expect(ns.resolvedApiVersion).toBe(version);
      });
    });
  });

  // ===========================================================================
  // Validation
  // ===========================================================================

  describe("Validation", () => {
    it("should throw error when maximumThroughputUnits is above maximum", () => {
      expect(() => {
        new EventhubNamespace(stack, "InvalidThroughput", {
          name: "invalid-throughput",
          location: "eastus",
          resourceGroupId: RG_ID,
          maximumThroughputUnits: 41,
        });
      }).toThrow(/maximumThroughputUnits must be between 0 and 40/);
    });

    it("should accept valid maximumThroughputUnits", () => {
      expect(() => {
        new EventhubNamespace(stack, "ValidThroughput", {
          name: "valid-throughput",
          location: "eastus",
          resourceGroupId: RG_ID,
          maximumThroughputUnits: 20,
        });
      }).not.toThrow();
    });
  });

  // ===========================================================================
  // Property Transformation
  // ===========================================================================

  describe("Property Transformation", () => {
    it("should generate correct Azure API body via createResourceBody", () => {
      const props: EventhubNamespaceProps = {
        name: "transform-test",
        location: "eastus",
        resourceGroupId: RG_ID,
        sku: { name: "Standard" },
      };

      const ns = new EventhubNamespace(stack, "TransformTest", props);
      const body = (ns as any).createResourceBody(props);

      expect(body).toHaveProperty("sku");
      expect(body.sku.name).toBe("Standard");
      expect(body.sku.tier).toBe("Standard");
      expect(body.properties.minimumTlsVersion).toBe("1.2");
      expect(body.properties.publicNetworkAccess).toBe("Enabled");
    });

    it("should default the SKU to Standard", () => {
      const props: EventhubNamespaceProps = {
        name: "default-sku",
        location: "eastus",
        resourceGroupId: RG_ID,
      };

      const ns = new EventhubNamespace(stack, "DefaultSku", props);
      const body = (ns as any).createResourceBody(props);

      expect(body.sku.name).toBe("Standard");
      expect(body.sku.tier).toBe("Standard");
    });

    it("should include identity when specified", () => {
      const props: EventhubNamespaceProps = {
        name: "identity-test",
        location: "eastus",
        resourceGroupId: RG_ID,
        identity: { type: "SystemAssigned" },
      };

      const ns = new EventhubNamespace(stack, "IdentityTest", props);
      const body = (ns as any).createResourceBody(props);

      expect(body.identity).toBeDefined();
      expect(body.identity.type).toBe("SystemAssigned");
    });

    it("should include optional properties when specified", () => {
      const props: EventhubNamespaceProps = {
        name: "optional-test",
        location: "eastus",
        resourceGroupId: RG_ID,
        zoneRedundant: true,
        isAutoInflateEnabled: true,
        maximumThroughputUnits: 8,
        disableLocalAuth: true,
      };

      const ns = new EventhubNamespace(stack, "OptionalTest", props);
      const body = (ns as any).createResourceBody(props);

      expect(body.properties.zoneRedundant).toBe(true);
      expect(body.properties.isAutoInflateEnabled).toBe(true);
      expect(body.properties.maximumThroughputUnits).toBe(8);
      expect(body.properties.disableLocalAuth).toBe(true);
    });
  });

  // ===========================================================================
  // Integration with Base Class
  // ===========================================================================

  describe("Integration with Base Class", () => {
    it("should inherit from AzapiResource", () => {
      const ns = new EventhubNamespace(stack, "InheritanceTest", {
        name: "inheritance-test",
        location: "eastus",
        resourceGroupId: RG_ID,
      });

      expect(ns).toHaveProperty("terraformResource");
      expect(ns).toHaveProperty("resolvedApiVersion");
    });

    it("should have correct resourceType", () => {
      const ns = new EventhubNamespace(stack, "ResourceTypeTest", {
        name: "resource-type-test",
        location: "eastus",
        resourceGroupId: RG_ID,
      });

      expect((ns as any).resourceType()).toBe("Microsoft.EventHub/namespaces");
    });

    it("should resolve parent ID to the resource group", () => {
      const props: EventhubNamespaceProps = {
        name: "parent-id-test",
        location: "eastus",
        resourceGroupId: RG_ID,
      };

      const ns = new EventhubNamespace(stack, "ParentIdTest", props);
      expect((ns as any).resolveParentId(props)).toBe(RG_ID);
    });

    it("should generate resource outputs", () => {
      const ns = new EventhubNamespace(stack, "OutputsTest", {
        name: "outputs-test",
        location: "eastus",
        resourceGroupId: RG_ID,
      });

      expect(ns.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(ns.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(ns.id).toMatch(/^\$\{.*\.id\}$/);
    });
  });

  // ===========================================================================
  // CDK Terraform Integration
  // ===========================================================================

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new EventhubNamespace(stack, "SynthTest", {
        name: "synth-test",
        location: "eastus",
        resourceGroupId: RG_ID,
        sku: { name: "Standard" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });
  });
});

describe("Eventhub - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  // ===========================================================================
  // Constructor and Basic Properties
  // ===========================================================================

  describe("Constructor and Basic Properties", () => {
    it("should create an event hub with minimal configuration", () => {
      const props: EventhubProps = {
        name: "test-hub",
        namespaceName: "test-namespace",
        resourceGroupId: RG_ID,
      };

      const hub = new Eventhub(stack, "TestHub", props);

      expect(hub).toBeInstanceOf(Eventhub);
      expect(hub.props.name).toBe("test-hub");
      expect(hub.props.namespaceName).toBe("test-namespace");
    });

    it("should create an event hub with partitions and retention", () => {
      const props: EventhubProps = {
        name: "partitioned-hub",
        namespaceName: "test-namespace",
        resourceGroupId: RG_ID,
        partitionCount: 8,
        messageRetentionInDays: 7,
      };

      const hub = new Eventhub(stack, "PartitionedHub", props);

      expect(hub.props.partitionCount).toBe(8);
      expect(hub.props.messageRetentionInDays).toBe(7);
    });
  });

  // ===========================================================================
  // Version Resolution
  // ===========================================================================

  describe("Version Resolution", () => {
    it("should use latest version 2024-01-01 when no version specified", () => {
      const hub = new Eventhub(stack, "DefaultVersion", {
        name: "default-version-hub",
        namespaceName: "test-namespace",
        resourceGroupId: RG_ID,
      });

      expect(hub.resolvedApiVersion).toBe("2024-01-01");
    });

    it("should use explicit version when specified", () => {
      const hub = new Eventhub(stack, "PinnedVersion", {
        name: "pinned-version-hub",
        namespaceName: "test-namespace",
        resourceGroupId: RG_ID,
        apiVersion: "2021-11-01",
      });

      expect(hub.resolvedApiVersion).toBe("2021-11-01");
    });
  });

  // ===========================================================================
  // Validation
  // ===========================================================================

  describe("Validation", () => {
    it("should throw error when partitionCount is below minimum", () => {
      expect(() => {
        new Eventhub(stack, "InvalidPartition", {
          name: "invalid-partition",
          namespaceName: "test-namespace",
          resourceGroupId: RG_ID,
          partitionCount: 0,
        });
      }).toThrow(/partitionCount must be between 1 and 1024/);
    });

    it("should throw error when messageRetentionInDays is above maximum", () => {
      expect(() => {
        new Eventhub(stack, "InvalidRetention", {
          name: "invalid-retention",
          namespaceName: "test-namespace",
          resourceGroupId: RG_ID,
          messageRetentionInDays: 91,
        });
      }).toThrow(/messageRetentionInDays must be between 1 and 90/);
    });

    it("should accept valid partition count and retention", () => {
      expect(() => {
        new Eventhub(stack, "ValidHub", {
          name: "valid-hub",
          namespaceName: "test-namespace",
          resourceGroupId: RG_ID,
          partitionCount: 4,
          messageRetentionInDays: 3,
        });
      }).not.toThrow();
    });
  });

  // ===========================================================================
  // Property Transformation
  // ===========================================================================

  describe("Property Transformation", () => {
    it("should generate correct Azure API body via createResourceBody", () => {
      const props: EventhubProps = {
        name: "transform-hub",
        namespaceName: "test-namespace",
        resourceGroupId: RG_ID,
        partitionCount: 4,
        messageRetentionInDays: 2,
      };

      const hub = new Eventhub(stack, "TransformHub", props);
      const body = (hub as any).createResourceBody(props);

      expect(body.properties.partitionCount).toBe(4);
      expect(body.properties.messageRetentionInDays).toBe(2);
    });

    it("should apply default partition count and retention", () => {
      const props: EventhubProps = {
        name: "defaults-hub",
        namespaceName: "test-namespace",
        resourceGroupId: RG_ID,
      };

      const hub = new Eventhub(stack, "DefaultsHub", props);
      const body = (hub as any).createResourceBody(props);

      expect(body.properties.partitionCount).toBe(2);
      expect(body.properties.messageRetentionInDays).toBe(1);
    });

    it("should include status when specified", () => {
      const props: EventhubProps = {
        name: "status-hub",
        namespaceName: "test-namespace",
        resourceGroupId: RG_ID,
        status: "Disabled",
      };

      const hub = new Eventhub(stack, "StatusHub", props);
      const body = (hub as any).createResourceBody(props);

      expect(body.properties.status).toBe("Disabled");
    });
  });

  // ===========================================================================
  // Parent ID Resolution
  // ===========================================================================

  describe("Parent ID Resolution", () => {
    it("should construct namespace ID from resourceGroupId and namespaceName", () => {
      const props: EventhubProps = {
        name: "parent-hub",
        namespaceName: "my-namespace",
        resourceGroupId: RG_ID,
      };

      const hub = new Eventhub(stack, "ParentHub", props);
      expect((hub as any).resolveParentId(props)).toBe(
        `${RG_ID}/providers/Microsoft.EventHub/namespaces/my-namespace`,
      );
    });

    it("should prefer an explicit namespaceId when provided", () => {
      const namespaceId = `${RG_ID}/providers/Microsoft.EventHub/namespaces/explicit-ns`;
      const props: EventhubProps = {
        name: "explicit-hub",
        namespaceName: "explicit-ns",
        namespaceId,
        resourceGroupId: RG_ID,
      };

      const hub = new Eventhub(stack, "ExplicitHub", props);
      expect((hub as any).resolveParentId(props)).toBe(namespaceId);
    });

    it("should have correct resourceType", () => {
      const hub = new Eventhub(stack, "ResourceTypeHub", {
        name: "resource-type-hub",
        namespaceName: "test-namespace",
        resourceGroupId: RG_ID,
      });

      expect((hub as any).resourceType()).toBe(
        "Microsoft.EventHub/namespaces/eventhubs",
      );
    });
  });

  // ===========================================================================
  // CDK Terraform Integration
  // ===========================================================================

  describe("CDK Terraform Integration", () => {
    it("should synthesize a namespace and event hub together", () => {
      const ns = new EventhubNamespace(stack, "Namespace", {
        name: "combined-namespace",
        location: "eastus",
        resourceGroupId: RG_ID,
      });

      new Eventhub(stack, "Hub", {
        name: "combined-hub",
        namespaceName: ns.props.name!,
        namespaceId: ns.id,
        resourceGroupId: RG_ID,
        partitionCount: 4,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });
  });
});
