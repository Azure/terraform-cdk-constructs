/**
 * Comprehensive tests for the NetworkWatcher implementation
 *
 * This test suite validates the NetworkWatcher class using the AzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * property configurations, and resource creation.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { NetworkWatcher, NetworkWatcherProps } from "../lib/network-watcher";

describe("NetworkWatcher - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  // =============================================================================
  // Constructor and Basic Properties
  // =============================================================================

  describe("Constructor and Basic Properties", () => {
    it("should create a Network Watcher with minimal configuration", () => {
      const props: NetworkWatcherProps = {
        name: "test-network-watcher",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      const networkWatcher = new NetworkWatcher(
        stack,
        "TestNetworkWatcher",
        props,
      );

      expect(networkWatcher).toBeInstanceOf(NetworkWatcher);
      expect(networkWatcher.props).toBe(props);
      expect(networkWatcher.props.name).toBe("test-network-watcher");
      expect(networkWatcher.props.location).toBe("eastus");
    });

    it("should create a Network Watcher with tags", () => {
      const props: NetworkWatcherProps = {
        name: "tagged-network-watcher",
        location: "westus2",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        tags: {
          environment: "production",
          team: "networking",
        },
      };

      const networkWatcher = new NetworkWatcher(
        stack,
        "TaggedNetworkWatcher",
        props,
      );

      expect(networkWatcher.props.tags).toEqual({
        environment: "production",
        team: "networking",
      });
    });

    it("should create a Network Watcher with conventional naming", () => {
      const props: NetworkWatcherProps = {
        name: "NetworkWatcher_eastus",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/test-sub/resourceGroups/NetworkWatcherRG",
      };

      const networkWatcher = new NetworkWatcher(
        stack,
        "ConventionalNetworkWatcher",
        props,
      );

      expect(networkWatcher.props.name).toBe("NetworkWatcher_eastus");
    });
  });

  // =============================================================================
  // Version Resolution
  // =============================================================================

  describe("Version Resolution", () => {
    it("should use latest version 2024-01-01 when no version specified", () => {
      const networkWatcher = new NetworkWatcher(stack, "DefaultVersion", {
        name: "default-version-nw",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      expect(networkWatcher.resolvedApiVersion).toBe("2024-01-01");
    });

    it("should use explicit version when specified", () => {
      const networkWatcher = new NetworkWatcher(stack, "PinnedVersion", {
        name: "pinned-version-nw",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2023-11-01",
      });

      expect(networkWatcher.resolvedApiVersion).toBe("2023-11-01");
    });

    it("should use latest version 2024-01-01 when explicitly specified", () => {
      const networkWatcher = new NetworkWatcher(stack, "LatestVersion", {
        name: "latest-version-nw",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2024-01-01",
      });

      expect(networkWatcher.resolvedApiVersion).toBe("2024-01-01");
    });
  });

  // =============================================================================
  // Property Transformation
  // =============================================================================

  describe("Property Transformation", () => {
    it("should generate correct Azure API format via createResourceBody", () => {
      const props: NetworkWatcherProps = {
        name: "transform-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      const networkWatcher = new NetworkWatcher(stack, "TransformTest", props);

      // Access the protected createResourceBody method
      const resourceBody = (networkWatcher as any).createResourceBody(props);

      expect(resourceBody).toHaveProperty("properties");
      expect(resourceBody.properties).toEqual({});
    });

    it("should have empty properties block for Network Watcher", () => {
      const props: NetworkWatcherProps = {
        name: "empty-props-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        tags: {
          test: "value",
        },
      };

      const networkWatcher = new NetworkWatcher(stack, "EmptyPropsTest", props);
      const resourceBody = (networkWatcher as any).createResourceBody(props);

      // Network Watcher properties should be empty - tags are handled at resource level
      expect(Object.keys(resourceBody.properties).length).toBe(0);
    });
  });

  // =============================================================================
  // Integration with Base Class
  // =============================================================================

  describe("Integration with Base Class", () => {
    it("should inherit from AzapiResource", () => {
      const networkWatcher = new NetworkWatcher(stack, "InheritanceTest", {
        name: "inheritance-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      // Verify it has AzapiResource properties
      expect(networkWatcher).toHaveProperty("terraformResource");
      expect(networkWatcher).toHaveProperty("resolvedApiVersion");
    });

    it("should have correct resourceType", () => {
      const networkWatcher = new NetworkWatcher(stack, "ResourceTypeTest", {
        name: "resource-type-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      // Access the protected resourceType method
      const resourceType = (networkWatcher as any).resourceType();
      expect(resourceType).toBe("Microsoft.Network/networkWatchers");
    });

    it("should resolve parent ID correctly", () => {
      const resourceGroupId = "/subscriptions/test-sub/resourceGroups/test-rg";

      const props: NetworkWatcherProps = {
        name: "parent-id-test",
        location: "eastus",
        resourceGroupId,
      };

      const networkWatcher = new NetworkWatcher(stack, "ParentIdTest", props);

      // Access the protected resolveParentId method
      const parentId = (networkWatcher as any).resolveParentId(props);
      expect(parentId).toBe(resourceGroupId);
    });

    it("should generate resource outputs", () => {
      const networkWatcher = new NetworkWatcher(stack, "OutputsTest", {
        name: "outputs-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      expect(networkWatcher.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(networkWatcher.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(networkWatcher.locationOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
      expect(networkWatcher.provisioningStateOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
      expect(networkWatcher.id).toMatch(/^\$\{.*\.id\}$/);
    });
  });

  // =============================================================================
  // CDK Terraform Integration
  // =============================================================================

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new NetworkWatcher(stack, "SynthTest", {
        name: "synth-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple Network Watchers in the same stack (different regions)", () => {
      // Note: In practice, Azure only allows one Network Watcher per region per subscription
      // but CDK can synthesize multiple in the same stack for different regions
      const nw1 = new NetworkWatcher(stack, "NetworkWatcher1", {
        name: "nw-eastus",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      const nw2 = new NetworkWatcher(stack, "NetworkWatcher2", {
        name: "nw-westus2",
        location: "westus2",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2023-11-01",
      });

      expect(nw1.resolvedApiVersion).toBe("2024-01-01");
      expect(nw2.resolvedApiVersion).toBe("2023-11-01");
      expect(nw1.props.location).toBe("eastus");
      expect(nw2.props.location).toBe("westus2");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  // =============================================================================
  // Location Requirement
  // =============================================================================

  describe("Location Requirement", () => {
    it("should require location for Network Watcher", () => {
      const networkWatcher = new NetworkWatcher(stack, "LocationTest", {
        name: "location-test",
        location: "centralus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      // Access the protected requiresLocation method
      const requiresLocation = (networkWatcher as any).requiresLocation();
      expect(requiresLocation).toBe(true);
    });

    it("should accept various Azure regions", () => {
      const regions = [
        "eastus",
        "westus2",
        "northeurope",
        "southeastasia",
        "brazilsouth",
      ];

      regions.forEach((region, index) => {
        const props: NetworkWatcherProps = {
          name: `nw-${region}`,
          location: region,
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        };

        expect(() => {
          new NetworkWatcher(stack, `RegionTest${index}`, props);
        }).not.toThrow();
      });
    });
  });

  // =============================================================================
  // Naming Conventions
  // =============================================================================

  describe("Naming Conventions", () => {
    it("should accept Azure default Network Watcher naming convention", () => {
      // Azure typically creates Network Watchers with names like "NetworkWatcher_<region>"
      const props: NetworkWatcherProps = {
        name: "NetworkWatcher_eastus",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/test-sub/resourceGroups/NetworkWatcherRG",
      };

      expect(() => {
        new NetworkWatcher(stack, "AzureDefaultNaming", props);
      }).not.toThrow();
    });

    it("should accept custom naming with hyphens", () => {
      const props: NetworkWatcherProps = {
        name: "my-custom-network-watcher",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      expect(() => {
        new NetworkWatcher(stack, "CustomNaming", props);
      }).not.toThrow();
    });

    it("should accept naming with periods", () => {
      const props: NetworkWatcherProps = {
        name: "nw.prod.eastus",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      expect(() => {
        new NetworkWatcher(stack, "PeriodNaming", props);
      }).not.toThrow();
    });
  });

  // =============================================================================
  // Complete Example Configuration
  // =============================================================================

  describe("Complete Example Configuration", () => {
    it("should handle comprehensive Network Watcher configuration", () => {
      const props: NetworkWatcherProps = {
        name: "comprehensive-network-watcher",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2024-01-01",
        tags: {
          environment: "production",
          team: "platform",
          "cost-center": "networking",
          "managed-by": "terraform-cdk",
        },
      };

      const networkWatcher = new NetworkWatcher(
        stack,
        "ComprehensiveConfig",
        props,
      );

      expect(networkWatcher.props.name).toBe("comprehensive-network-watcher");
      expect(networkWatcher.props.location).toBe("eastus");
      expect(networkWatcher.resolvedApiVersion).toBe("2024-01-01");
      expect(networkWatcher.props.tags).toEqual({
        environment: "production",
        team: "platform",
        "cost-center": "networking",
        "managed-by": "terraform-cdk",
      });

      const resourceBody = (networkWatcher as any).createResourceBody(props);
      expect(resourceBody.properties).toEqual({});
    });
  });
});
