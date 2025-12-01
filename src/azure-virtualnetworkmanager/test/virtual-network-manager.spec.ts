/**
 * Comprehensive tests for the Virtual Network Manager implementation
 *
 * This test suite validates the VirtualNetworkManager class and all child resource
 * constructs using the AzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation, resource creation,
 * and parent-child relationships.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import {
  ConnectivityConfiguration,
  ConnectivityConfigurationProps,
} from "../lib/connectivity-configuration";
import { NetworkGroup, NetworkGroupProps } from "../lib/network-group";
import {
  NetworkGroupStaticMember,
  NetworkGroupStaticMemberProps,
} from "../lib/network-group-static-member";
import {
  SecurityAdminConfiguration,
  SecurityAdminConfigurationProps,
} from "../lib/security-admin-configuration";
import {
  SecurityAdminRule,
  SecurityAdminRuleProps,
} from "../lib/security-admin-rule";
import {
  SecurityAdminRuleCollection,
  SecurityAdminRuleCollectionProps,
} from "../lib/security-admin-rule-collection";
import {
  VirtualNetworkManager,
  VirtualNetworkManagerProps,
} from "../lib/virtual-network-manager";

describe("VirtualNetworkManager", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "test-stack");
  });

  describe("Basic Instantiation Tests", () => {
    it("should create a Virtual Network Manager with minimum required properties", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager).toBeInstanceOf(VirtualNetworkManager);
      expect(manager.props).toBe(props);
      expect(manager.resourceName).toBeDefined();

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("Microsoft.Network/networkManagers");
    });

    it("should create a Virtual Network Manager with all properties", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager-full",
        location: "westus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
          managementGroups: [
            "/providers/Microsoft.Management/managementGroups/mg1",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
        description: "Test network manager with all properties",
        tags: {
          environment: "test",
          project: "cdktf-constructs",
        },
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.props).toBe(props);
      expect(manager.props.description).toBe(
        "Test network manager with all properties",
      );
      expect(manager.props.tags).toEqual({
        environment: "test",
        project: "cdktf-constructs",
      });
      expect(manager.tags).toEqual(props.tags);
    });
  });

  describe("Framework Integration Tests", () => {
    it("should use default API version when none specified", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.resolvedApiVersion).toBe("2024-05-01");
    });

    it("should use specified API version when provided", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        apiVersion: "2023-11-01",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["SecurityAdmin"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.resolvedApiVersion).toBe("2023-11-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("@2023-11-01");
    });

    it("should register schemas on first instantiation", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
      };

      // First instantiation should register schemas
      const manager1 = new VirtualNetworkManager(stack, "TestManager1", props);
      expect(manager1).toBeInstanceOf(VirtualNetworkManager);

      // Second instantiation should not re-register
      const manager2 = new VirtualNetworkManager(stack, "TestManager2", {
        ...props,
        name: "test-network-manager-2",
      });
      expect(manager2).toBeInstanceOf(VirtualNetworkManager);
    });
  });

  describe("Property Validation Tests", () => {
    it("should properly format networkManagerScopes with subscriptions", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
            "/subscriptions/11111111-1111-1111-1111-111111111111",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.props.networkManagerScopes.subscriptions).toHaveLength(2);
      expect(manager.props.networkManagerScopes.subscriptions).toContain(
        "/subscriptions/00000000-0000-0000-0000-000000000000",
      );

      const synthesized = Testing.synth(stack);
      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should properly format networkManagerScopes with management groups", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          managementGroups: [
            "/providers/Microsoft.Management/managementGroups/mg1",
            "/providers/Microsoft.Management/managementGroups/mg2",
          ],
        },
        networkManagerScopeAccesses: ["SecurityAdmin"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.props.networkManagerScopes.managementGroups).toHaveLength(
        2,
      );
      expect(manager.props.networkManagerScopes.managementGroups).toContain(
        "/providers/Microsoft.Management/managementGroups/mg1",
      );

      const synthesized = Testing.synth(stack);
      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should properly format networkManagerScopeAccesses with Connectivity and SecurityAdmin", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.props.networkManagerScopeAccesses).toHaveLength(2);
      expect(manager.props.networkManagerScopeAccesses).toContain(
        "Connectivity",
      );
      expect(manager.props.networkManagerScopeAccesses).toContain(
        "SecurityAdmin",
      );
    });

    it("should properly format networkManagerScopeAccesses with Routing", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Routing"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.props.networkManagerScopeAccesses).toHaveLength(1);
      expect(manager.props.networkManagerScopeAccesses).toContain("Routing");
    });
  });

  describe("Tag Management Tests", () => {
    it("should add tags using addTag method", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
        tags: {
          environment: "test",
        },
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      manager.addTag("project", "network-infrastructure");

      expect(manager.props.tags!.project).toBe("network-infrastructure");
      expect(manager.props.tags!.environment).toBe("test");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("network-infrastructure");
    });

    it("should remove tags using removeTag method", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
        tags: {
          environment: "test",
          temporary: "true",
        },
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      manager.removeTag("temporary");

      expect(manager.props.tags!.temporary).toBeUndefined();
      expect(manager.props.tags!.environment).toBe("test");
    });

    it("should add tags when no initial tags exist", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      manager.addTag("firstTag", "firstValue");

      expect(manager.props.tags!.firstTag).toBe("firstValue");
    });
  });

  describe("Terraform Output Tests", () => {
    it("should create proper Terraform outputs", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(manager.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(manager.locationOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(manager.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(manager.scopeOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(manager.scopeAccessesOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });

    it("should have proper resource references in outputs", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.id).toMatch(/^\$\{.*\.id\}$/);
      expect(manager.resourceName).toMatch(/^\$\{.*\.name\}$/);
    });
  });

  describe("Lifecycle Management Tests", () => {
    it("should apply ignore_changes when specified", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
        ignoreChanges: ["tags"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.props.ignoreChanges).toEqual(["tags"]);

      const synthesized = Testing.synth(stack);
      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple ignore_changes properties", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
        ignoreChanges: ["tags", "description"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.props.ignoreChanges).toHaveLength(2);
      expect(manager.props.ignoreChanges).toContain("tags");
      expect(manager.props.ignoreChanges).toContain("description");
    });
  });

  describe("CDK Synthesis Tests", () => {
    it("should synthesize valid Terraform configuration", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
        description: "Test network manager",
        tags: {
          environment: "test",
        },
      };

      new VirtualNetworkManager(stack, "TestManager", props);

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple Virtual Network Managers in the same stack", () => {
      const props1: VirtualNetworkManagerProps = {
        name: "test-network-manager-1",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
      };

      const props2: VirtualNetworkManagerProps = {
        name: "test-network-manager-2",
        location: "westus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        apiVersion: "2023-11-01",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/11111111-1111-1111-1111-111111111111",
          ],
        },
        networkManagerScopeAccesses: ["SecurityAdmin"],
      };

      const manager1 = new VirtualNetworkManager(stack, "TestManager1", props1);
      const manager2 = new VirtualNetworkManager(stack, "TestManager2", props2);

      expect(manager1.resolvedApiVersion).toBe("2024-05-01");
      expect(manager2.resolvedApiVersion).toBe("2023-11-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });

    it("should verify Terraform output structure", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
      };

      new VirtualNetworkManager(stack, "TestManager", props);

      const synthesized = Testing.synth(stack);
      const stackConfig = JSON.parse(synthesized);

      expect(stackConfig.resource).toBeDefined();
      expect(stackConfig.output).toBeDefined();
      expect(stackConfig.output.id).toBeDefined();
      expect(stackConfig.output.name).toBeDefined();
      expect(stackConfig.output.location).toBeDefined();
      expect(stackConfig.output.tags).toBeDefined();
      expect(stackConfig.output.scope).toBeDefined();
      expect(stackConfig.output.scopeAccesses).toBeDefined();
    });
  });

  describe("Resource Type and Version Tests", () => {
    it("should have correct resource type", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager).toBeInstanceOf(VirtualNetworkManager);
    });

    it("should support all registered API versions", () => {
      const versions = ["2023-11-01", "2024-05-01"];

      versions.forEach((version) => {
        const testStack = new cdktf.TerraformStack(app, `Stack-${version}`);
        const manager = new VirtualNetworkManager(
          testStack,
          `Manager-${version}`,
          {
            name: `manager-${version}`,
            location: "eastus",
            resourceGroupId:
              "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
            apiVersion: version,
            networkManagerScopes: {
              subscriptions: [
                "/subscriptions/00000000-0000-0000-0000-000000000000",
              ],
            },
            networkManagerScopeAccesses: ["Connectivity"],
          },
        );

        expect(manager.resolvedApiVersion).toBe(version);
      });
    });

    it("should use latest version as default", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.resolvedApiVersion).toBe("2024-05-01");
    });
  });

  describe("Description Property Tests", () => {
    it("should create Virtual Network Manager with description", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
        description: "Central network management for production workloads",
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.props.description).toBe(
        "Central network management for production workloads",
      );
    });

    it("should create Virtual Network Manager without description", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.props.description).toBeUndefined();
    });
  });

  describe("Mixed Scope Configuration Tests", () => {
    it("should support both subscriptions and management groups in scope", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
          managementGroups: [
            "/providers/Microsoft.Management/managementGroups/mg1",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.props.networkManagerScopes.subscriptions).toHaveLength(1);
      expect(manager.props.networkManagerScopes.managementGroups).toHaveLength(
        1,
      );
    });

    it("should support all three scope access types", () => {
      const props: VirtualNetworkManagerProps = {
        name: "test-network-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: [
          "Connectivity",
          "SecurityAdmin",
          "Routing",
        ],
      };

      const manager = new VirtualNetworkManager(stack, "TestManager", props);

      expect(manager.props.networkManagerScopeAccesses).toHaveLength(3);
      expect(manager.props.networkManagerScopeAccesses).toContain(
        "Connectivity",
      );
      expect(manager.props.networkManagerScopeAccesses).toContain(
        "SecurityAdmin",
      );
      expect(manager.props.networkManagerScopeAccesses).toContain("Routing");
    });
  });

  describe("Convenience Methods for Child Resources", () => {
    let manager: VirtualNetworkManager;

    beforeEach(() => {
      manager = new VirtualNetworkManager(stack, "TestManager", {
        name: "test-manager",
        location: "eastus",
        resourceGroupId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
        networkManagerScopes: {
          subscriptions: [
            "/subscriptions/00000000-0000-0000-0000-000000000000",
          ],
        },
        networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"],
      });
    });

    it("should create NetworkGroup using convenience method", () => {
      const networkGroup = manager.addNetworkGroup("prod-group", {
        name: "production-vnets",
        description: "Production virtual networks",
        memberType: "VirtualNetwork",
      });

      expect(networkGroup).toBeInstanceOf(NetworkGroup);
      expect(networkGroup.props.networkManagerId).toBe(manager.id);
      expect(networkGroup.props.name).toBe("production-vnets");
      expect(networkGroup.props.description).toBe(
        "Production virtual networks",
      );
    });

    it("should create ConnectivityConfiguration using convenience method", () => {
      const networkGroup = manager.addNetworkGroup("prod-group", {
        name: "production-vnets",
      });

      const connectivityConfig = manager.addConnectivityConfiguration(
        "hub-spoke",
        {
          name: "production-hub-spoke",
          connectivityTopology: "HubAndSpoke",
          appliesToGroups: [
            {
              networkGroupId: networkGroup.id,
              groupConnectivity: "None",
              useHubGateway: true,
            },
          ],
          hubs: [
            {
              resourceId: "/subscriptions/test/virtualNetworks/hub",
              resourceType: "Microsoft.Network/virtualNetworks",
            },
          ],
        },
      );

      expect(connectivityConfig).toBeInstanceOf(ConnectivityConfiguration);
      expect(connectivityConfig.props.networkManagerId).toBe(manager.id);
      expect(connectivityConfig.props.connectivityTopology).toBe("HubAndSpoke");
    });

    it("should create SecurityAdminConfiguration using convenience method", () => {
      const securityConfig = manager.addSecurityAdminConfiguration("security", {
        name: "production-security",
        description: "High-priority security rules",
      });

      expect(securityConfig).toBeInstanceOf(SecurityAdminConfiguration);
      expect(securityConfig.props.networkManagerId).toBe(manager.id);
      expect(securityConfig.props.name).toBe("production-security");
    });
  });
});

describe("NetworkGroup", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: VirtualNetworkManager;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "test-stack");
    manager = new VirtualNetworkManager(stack, "TestManager", {
      name: "test-manager",
      location: "eastus",
      resourceGroupId:
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
      networkManagerScopes: {
        subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
      },
      networkManagerScopeAccesses: ["Connectivity"],
    });
  });

  describe("Basic Instantiation", () => {
    it("should create NetworkGroup with minimum required properties", () => {
      const props: NetworkGroupProps = {
        name: "test-group",
        networkManagerId: manager.id,
      };

      const networkGroup = new NetworkGroup(stack, "TestGroup", props);

      expect(networkGroup).toBeInstanceOf(NetworkGroup);
      expect(networkGroup.props).toBe(props);
      expect(networkGroup.resourceName).toBeDefined();
      expect(networkGroup.id).toBeDefined();
    });

    it("should create NetworkGroup with all properties", () => {
      const props: NetworkGroupProps = {
        name: "production-vnets",
        networkManagerId: manager.id,
        description: "Production virtual networks for East US",
        memberType: "VirtualNetwork",
      };

      const networkGroup = new NetworkGroup(stack, "TestGroup", props);

      expect(networkGroup.props.description).toBe(
        "Production virtual networks for East US",
      );
      expect(networkGroup.props.memberType).toBe("VirtualNetwork");
    });

    it("should create NetworkGroup with Subnet member type", () => {
      const props: NetworkGroupProps = {
        name: "subnet-group",
        networkManagerId: manager.id,
        memberType: "Subnet",
        description: "Subnet-level network group",
      };

      const networkGroup = new NetworkGroup(stack, "SubnetGroup", props);

      expect(networkGroup.props.memberType).toBe("Subnet");
    });
  });

  describe("API Version Handling", () => {
    it("should use default API version when none specified", () => {
      const networkGroup = new NetworkGroup(stack, "TestGroup", {
        name: "test-group",
        networkManagerId: manager.id,
      });

      expect(networkGroup.resolvedApiVersion).toBe("2024-05-01");
    });

    it("should use specified API version when provided", () => {
      const networkGroup = new NetworkGroup(stack, "TestGroup", {
        name: "test-group",
        networkManagerId: manager.id,
        apiVersion: "2023-11-01",
      });

      expect(networkGroup.resolvedApiVersion).toBe("2023-11-01");
    });
  });

  describe("Terraform Outputs", () => {
    it("should create proper Terraform outputs", () => {
      const networkGroup = new NetworkGroup(stack, "TestGroup", {
        name: "test-group",
        networkManagerId: manager.id,
      });

      expect(networkGroup.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(networkGroup.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(networkGroup.provisioningStateOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
    });

    it("should have proper resource references", () => {
      const networkGroup = new NetworkGroup(stack, "TestGroup", {
        name: "test-group",
        networkManagerId: manager.id,
      });

      expect(networkGroup.id).toMatch(/^\$\{.*\.id\}$/);
      expect(networkGroup.resourceName).toMatch(/^\$\{.*\.name\}$/);
      expect(networkGroup.provisioningState).toMatch(
        /^\$\{.*\.output\.properties\.provisioningState\}$/,
      );
    });
  });

  describe("Lifecycle Management", () => {
    it("should apply ignore_changes when specified", () => {
      const networkGroup = new NetworkGroup(stack, "TestGroup", {
        name: "test-group",
        networkManagerId: manager.id,
        ignoreChanges: ["description"],
      });

      expect(networkGroup.props.ignoreChanges).toEqual(["description"]);
    });
  });

  describe("CDK Synthesis", () => {
    it("should synthesize valid Terraform configuration", () => {
      new NetworkGroup(stack, "TestGroup", {
        name: "test-group",
        networkManagerId: manager.id,
        description: "Test network group",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });
  });
});

describe("NetworkGroupStaticMember", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: VirtualNetworkManager;
  let networkGroup: NetworkGroup;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "test-stack");
    manager = new VirtualNetworkManager(stack, "TestManager", {
      name: "test-manager",
      location: "eastus",
      resourceGroupId:
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
      networkManagerScopes: {
        subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
      },
      networkManagerScopeAccesses: ["Connectivity"],
    });
    networkGroup = new NetworkGroup(stack, "TestGroup", {
      name: "test-group",
      networkManagerId: manager.id,
    });
  });

  describe("Basic Instantiation", () => {
    it("should create StaticMember for VNet", () => {
      const props: NetworkGroupStaticMemberProps = {
        name: "vnet-member",
        networkGroupId: networkGroup.id,
        resourceId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/test-vnet",
      };

      const member = new NetworkGroupStaticMember(stack, "VnetMember", props);

      expect(member).toBeInstanceOf(NetworkGroupStaticMember);
      expect(member.props).toBe(props);
      expect(member.props.resourceId).toContain("virtualNetworks");
    });

    it("should create StaticMember for Subnet", () => {
      const props: NetworkGroupStaticMemberProps = {
        name: "subnet-member",
        networkGroupId: networkGroup.id,
        resourceId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/test-subnet",
      };

      const member = new NetworkGroupStaticMember(stack, "SubnetMember", props);

      expect(member).toBeInstanceOf(NetworkGroupStaticMember);
      expect(member.props.resourceId).toContain("subnets");
    });
  });

  describe("API Version Handling", () => {
    it("should use default API version when none specified", () => {
      const member = new NetworkGroupStaticMember(stack, "TestMember", {
        name: "test-member",
        networkGroupId: networkGroup.id,
        resourceId: "/subscriptions/test/virtualNetworks/vnet1",
      });

      expect(member.resolvedApiVersion).toBe("2024-05-01");
    });

    it("should use specified API version when provided", () => {
      const member = new NetworkGroupStaticMember(stack, "TestMember", {
        name: "test-member",
        networkGroupId: networkGroup.id,
        resourceId: "/subscriptions/test/virtualNetworks/vnet1",
        apiVersion: "2023-11-01",
      });

      expect(member.resolvedApiVersion).toBe("2023-11-01");
    });
  });

  describe("Terraform Outputs", () => {
    it("should create proper Terraform outputs", () => {
      const member = new NetworkGroupStaticMember(stack, "TestMember", {
        name: "test-member",
        networkGroupId: networkGroup.id,
        resourceId: "/subscriptions/test/virtualNetworks/vnet1",
      });

      expect(member.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(member.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(member.resourceIdOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });

    it("should have proper resource references", () => {
      const member = new NetworkGroupStaticMember(stack, "TestMember", {
        name: "test-member",
        networkGroupId: networkGroup.id,
        resourceId: "/subscriptions/test/virtualNetworks/vnet1",
      });

      expect(member.id).toMatch(/^\$\{.*\.id\}$/);
      expect(member.resourceName).toMatch(/^\$\{.*\.name\}$/);
      // memberResourceId returns the input resourceId since Azure API doesn't return it
      expect(member.memberResourceId).toBe(
        "/subscriptions/test/virtualNetworks/vnet1",
      );
      expect(member.region).toMatch(/^\$\{.*\.output\.properties\.region\}$/);
    });
  });

  describe("Parent-Child Relationship", () => {
    it("should correctly reference parent network group", () => {
      const member = new NetworkGroupStaticMember(stack, "TestMember", {
        name: "test-member",
        networkGroupId: networkGroup.id,
        resourceId: "/subscriptions/test/virtualNetworks/vnet1",
      });

      expect(member.props.networkGroupId).toBe(networkGroup.id);
    });
  });

  describe("CDK Synthesis", () => {
    it("should synthesize valid Terraform configuration", () => {
      new NetworkGroupStaticMember(stack, "TestMember", {
        name: "test-member",
        networkGroupId: networkGroup.id,
        resourceId: "/subscriptions/test/virtualNetworks/vnet1",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });
  });
});

describe("ConnectivityConfiguration", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: VirtualNetworkManager;
  let networkGroup: NetworkGroup;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "test-stack");
    manager = new VirtualNetworkManager(stack, "TestManager", {
      name: "test-manager",
      location: "eastus",
      resourceGroupId:
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
      networkManagerScopes: {
        subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
      },
      networkManagerScopeAccesses: ["Connectivity"],
    });
    networkGroup = new NetworkGroup(stack, "TestGroup", {
      name: "test-group",
      networkManagerId: manager.id,
    });
  });

  describe("Basic Instantiation - Mesh Topology", () => {
    it("should create Mesh connectivity configuration", () => {
      const props: ConnectivityConfigurationProps = {
        name: "mesh-config",
        networkManagerId: manager.id,
        connectivityTopology: "Mesh",
        appliesToGroups: [
          {
            networkGroupId: networkGroup.id,
            groupConnectivity: "DirectlyConnected",
            isGlobal: false,
          },
        ],
      };

      const config = new ConnectivityConfiguration(stack, "MeshConfig", props);

      expect(config).toBeInstanceOf(ConnectivityConfiguration);
      expect(config.topology).toBe("Mesh");
      expect(config.props.appliesToGroups).toHaveLength(1);
    });

    it("should create global Mesh connectivity configuration", () => {
      const props: ConnectivityConfigurationProps = {
        name: "global-mesh",
        networkManagerId: manager.id,
        connectivityTopology: "Mesh",
        appliesToGroups: [
          {
            networkGroupId: networkGroup.id,
            groupConnectivity: "DirectlyConnected",
            isGlobal: true,
          },
        ],
        isGlobal: true,
      };

      const config = new ConnectivityConfiguration(stack, "GlobalMesh", props);

      expect(config.props.isGlobal).toBe(true);
    });
  });

  describe("Basic Instantiation - Hub-and-Spoke Topology", () => {
    it("should create Hub-and-Spoke connectivity configuration", () => {
      const props: ConnectivityConfigurationProps = {
        name: "hub-spoke-config",
        networkManagerId: manager.id,
        connectivityTopology: "HubAndSpoke",
        appliesToGroups: [
          {
            networkGroupId: networkGroup.id,
            groupConnectivity: "None",
            useHubGateway: true,
          },
        ],
        hubs: [
          {
            resourceId: "/subscriptions/test/virtualNetworks/hub-vnet",
            resourceType: "Microsoft.Network/virtualNetworks",
          },
        ],
      };

      const config = new ConnectivityConfiguration(
        stack,
        "HubSpokeConfig",
        props,
      );

      expect(config.topology).toBe("HubAndSpoke");
      expect(config.props.hubs).toHaveLength(1);
      expect(config.props.appliesToGroups[0].useHubGateway).toBe(true);
    });

    it("should create Hub-and-Spoke with multiple hubs", () => {
      const props: ConnectivityConfigurationProps = {
        name: "multi-hub-config",
        networkManagerId: manager.id,
        connectivityTopology: "HubAndSpoke",
        appliesToGroups: [
          {
            networkGroupId: networkGroup.id,
            groupConnectivity: "None",
          },
        ],
        hubs: [
          {
            resourceId: "/subscriptions/test/virtualNetworks/hub-vnet-1",
            resourceType: "Microsoft.Network/virtualNetworks",
          },
          {
            resourceId: "/subscriptions/test/virtualNetworks/hub-vnet-2",
            resourceType: "Microsoft.Network/virtualNetworks",
          },
        ],
      };

      const config = new ConnectivityConfiguration(
        stack,
        "MultiHubConfig",
        props,
      );

      expect(config.props.hubs).toHaveLength(2);
    });
  });

  describe("Property Validation", () => {
    it("should handle description property", () => {
      const config = new ConnectivityConfiguration(stack, "TestConfig", {
        name: "test-config",
        networkManagerId: manager.id,
        description: "Hub-and-spoke topology for production workloads",
        connectivityTopology: "HubAndSpoke",
        appliesToGroups: [{ networkGroupId: networkGroup.id }],
        hubs: [
          {
            resourceId: "/subscriptions/test/virtualNetworks/hub",
            resourceType: "Microsoft.Network/virtualNetworks",
          },
        ],
      });

      expect(config.props.description).toBe(
        "Hub-and-spoke topology for production workloads",
      );
    });

    it("should handle deleteExistingPeering property", () => {
      const config = new ConnectivityConfiguration(stack, "TestConfig", {
        name: "test-config",
        networkManagerId: manager.id,
        connectivityTopology: "Mesh",
        appliesToGroups: [{ networkGroupId: networkGroup.id }],
        deleteExistingPeering: true,
      });

      expect(config.props.deleteExistingPeering).toBe(true);
    });
  });

  describe("API Version Handling", () => {
    it("should use default API version when none specified", () => {
      const config = new ConnectivityConfiguration(stack, "TestConfig", {
        name: "test-config",
        networkManagerId: manager.id,
        connectivityTopology: "Mesh",
        appliesToGroups: [{ networkGroupId: networkGroup.id }],
      });

      expect(config.resolvedApiVersion).toBe("2024-05-01");
    });

    it("should use specified API version when provided", () => {
      const config = new ConnectivityConfiguration(stack, "TestConfig", {
        name: "test-config",
        networkManagerId: manager.id,
        apiVersion: "2023-11-01",
        connectivityTopology: "Mesh",
        appliesToGroups: [{ networkGroupId: networkGroup.id }],
      });

      expect(config.resolvedApiVersion).toBe("2023-11-01");
    });
  });

  describe("Terraform Outputs", () => {
    it("should create proper Terraform outputs", () => {
      const config = new ConnectivityConfiguration(stack, "TestConfig", {
        name: "test-config",
        networkManagerId: manager.id,
        connectivityTopology: "Mesh",
        appliesToGroups: [{ networkGroupId: networkGroup.id }],
      });

      expect(config.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(config.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(config.provisioningStateOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
    });
  });

  describe("CDK Synthesis", () => {
    it("should synthesize valid Terraform configuration", () => {
      new ConnectivityConfiguration(stack, "TestConfig", {
        name: "test-config",
        networkManagerId: manager.id,
        connectivityTopology: "Mesh",
        appliesToGroups: [{ networkGroupId: networkGroup.id }],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });
  });
});

describe("SecurityAdminConfiguration", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: VirtualNetworkManager;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "test-stack");
    manager = new VirtualNetworkManager(stack, "TestManager", {
      name: "test-manager",
      location: "eastus",
      resourceGroupId:
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
      networkManagerScopes: {
        subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
      },
      networkManagerScopeAccesses: ["SecurityAdmin"],
    });
  });

  describe("Basic Instantiation", () => {
    it("should create SecurityAdminConfiguration with minimum properties", () => {
      const props: SecurityAdminConfigurationProps = {
        name: "security-config",
        networkManagerId: manager.id,
      };

      const config = new SecurityAdminConfiguration(
        stack,
        "SecurityConfig",
        props,
      );

      expect(config).toBeInstanceOf(SecurityAdminConfiguration);
      expect(config.props).toBe(props);
    });

    it("should create SecurityAdminConfiguration with all properties", () => {
      const props: SecurityAdminConfigurationProps = {
        name: "security-config",
        networkManagerId: manager.id,
        description: "Organization-wide security rules",
        applyOnNetworkIntentPolicyBasedServices: ["None"],
      };

      const config = new SecurityAdminConfiguration(
        stack,
        "SecurityConfig",
        props,
      );

      expect(config.props.description).toBe("Organization-wide security rules");
      expect(config.props.applyOnNetworkIntentPolicyBasedServices).toEqual([
        "None",
      ]);
    });
  });

  describe("API Version Handling", () => {
    it("should use default API version when none specified", () => {
      const config = new SecurityAdminConfiguration(stack, "SecurityConfig", {
        name: "security-config",
        networkManagerId: manager.id,
      });

      expect(config.resolvedApiVersion).toBe("2024-05-01");
    });

    it("should use specified API version when provided", () => {
      const config = new SecurityAdminConfiguration(stack, "SecurityConfig", {
        name: "security-config",
        networkManagerId: manager.id,
        apiVersion: "2023-11-01",
      });

      expect(config.resolvedApiVersion).toBe("2023-11-01");
    });
  });

  describe("Terraform Outputs", () => {
    it("should create proper Terraform outputs", () => {
      const config = new SecurityAdminConfiguration(stack, "SecurityConfig", {
        name: "security-config",
        networkManagerId: manager.id,
      });

      expect(config.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(config.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(config.provisioningStateOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
    });

    it("should have proper resource references", () => {
      const config = new SecurityAdminConfiguration(stack, "SecurityConfig", {
        name: "security-config",
        networkManagerId: manager.id,
      });

      expect(config.id).toMatch(/^\$\{.*\.id\}$/);
      expect(config.resourceName).toMatch(/^\$\{.*\.name\}$/);
      expect(config.provisioningState).toMatch(
        /^\$\{.*\.output\.properties\.provisioningState\}$/,
      );
    });
  });

  describe("CDK Synthesis", () => {
    it("should synthesize valid Terraform configuration", () => {
      new SecurityAdminConfiguration(stack, "SecurityConfig", {
        name: "security-config",
        networkManagerId: manager.id,
        description: "Test security configuration",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });
  });
});

describe("SecurityAdminRuleCollection", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: VirtualNetworkManager;
  let securityConfig: SecurityAdminConfiguration;
  let networkGroup: NetworkGroup;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "test-stack");
    manager = new VirtualNetworkManager(stack, "TestManager", {
      name: "test-manager",
      location: "eastus",
      resourceGroupId:
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
      networkManagerScopes: {
        subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
      },
      networkManagerScopeAccesses: ["SecurityAdmin"],
    });
    securityConfig = new SecurityAdminConfiguration(stack, "SecurityConfig", {
      name: "security-config",
      networkManagerId: manager.id,
    });
    networkGroup = new NetworkGroup(stack, "TestGroup", {
      name: "test-group",
      networkManagerId: manager.id,
    });
  });

  describe("Basic Instantiation", () => {
    it("should create RuleCollection with minimum properties", () => {
      const props: SecurityAdminRuleCollectionProps = {
        name: "rule-collection",
        securityAdminConfigurationId: securityConfig.id,
        appliesToGroups: [{ networkGroupId: networkGroup.id }],
      };

      const collection = new SecurityAdminRuleCollection(
        stack,
        "RuleCollection",
        props,
      );

      expect(collection).toBeInstanceOf(SecurityAdminRuleCollection);
      expect(collection.props.appliesToGroups).toHaveLength(1);
    });

    it("should create RuleCollection with description", () => {
      const props: SecurityAdminRuleCollectionProps = {
        name: "block-high-risk-ports",
        securityAdminConfigurationId: securityConfig.id,
        description: "Rules to block high-risk ports",
        appliesToGroups: [{ networkGroupId: networkGroup.id }],
      };

      const collection = new SecurityAdminRuleCollection(
        stack,
        "RuleCollection",
        props,
      );

      expect(collection.props.description).toBe(
        "Rules to block high-risk ports",
      );
    });

    it("should create RuleCollection applied to multiple groups", () => {
      const group2 = new NetworkGroup(stack, "TestGroup2", {
        name: "test-group-2",
        networkManagerId: manager.id,
      });

      const props: SecurityAdminRuleCollectionProps = {
        name: "multi-group-collection",
        securityAdminConfigurationId: securityConfig.id,
        appliesToGroups: [
          { networkGroupId: networkGroup.id },
          { networkGroupId: group2.id },
        ],
      };

      const collection = new SecurityAdminRuleCollection(
        stack,
        "RuleCollection",
        props,
      );

      expect(collection.props.appliesToGroups).toHaveLength(2);
    });
  });

  describe("API Version Handling", () => {
    it("should use default API version when none specified", () => {
      const collection = new SecurityAdminRuleCollection(
        stack,
        "RuleCollection",
        {
          name: "rule-collection",
          securityAdminConfigurationId: securityConfig.id,
          appliesToGroups: [{ networkGroupId: networkGroup.id }],
        },
      );

      expect(collection.resolvedApiVersion).toBe("2024-05-01");
    });

    it("should use specified API version when provided", () => {
      const collection = new SecurityAdminRuleCollection(
        stack,
        "RuleCollection",
        {
          name: "rule-collection",
          securityAdminConfigurationId: securityConfig.id,
          apiVersion: "2023-11-01",
          appliesToGroups: [{ networkGroupId: networkGroup.id }],
        },
      );

      expect(collection.resolvedApiVersion).toBe("2023-11-01");
    });
  });

  describe("Terraform Outputs", () => {
    it("should create proper Terraform outputs", () => {
      const collection = new SecurityAdminRuleCollection(
        stack,
        "RuleCollection",
        {
          name: "rule-collection",
          securityAdminConfigurationId: securityConfig.id,
          appliesToGroups: [{ networkGroupId: networkGroup.id }],
        },
      );

      expect(collection.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(collection.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(collection.provisioningStateOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
    });
  });

  describe("Parent-Child Relationship", () => {
    it("should correctly reference parent security admin configuration", () => {
      const collection = new SecurityAdminRuleCollection(
        stack,
        "RuleCollection",
        {
          name: "rule-collection",
          securityAdminConfigurationId: securityConfig.id,
          appliesToGroups: [{ networkGroupId: networkGroup.id }],
        },
      );

      expect(collection.props.securityAdminConfigurationId).toBe(
        securityConfig.id,
      );
    });
  });

  describe("CDK Synthesis", () => {
    it("should synthesize valid Terraform configuration", () => {
      new SecurityAdminRuleCollection(stack, "RuleCollection", {
        name: "rule-collection",
        securityAdminConfigurationId: securityConfig.id,
        appliesToGroups: [{ networkGroupId: networkGroup.id }],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });
  });
});

describe("SecurityAdminRule", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: VirtualNetworkManager;
  let securityConfig: SecurityAdminConfiguration;
  let networkGroup: NetworkGroup;
  let ruleCollection: SecurityAdminRuleCollection;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "test-stack");
    manager = new VirtualNetworkManager(stack, "TestManager", {
      name: "test-manager",
      location: "eastus",
      resourceGroupId:
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg",
      networkManagerScopes: {
        subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
      },
      networkManagerScopeAccesses: ["SecurityAdmin"],
    });
    securityConfig = new SecurityAdminConfiguration(stack, "SecurityConfig", {
      name: "security-config",
      networkManagerId: manager.id,
    });
    networkGroup = new NetworkGroup(stack, "TestGroup", {
      name: "test-group",
      networkManagerId: manager.id,
    });
    ruleCollection = new SecurityAdminRuleCollection(stack, "RuleCollection", {
      name: "rule-collection",
      securityAdminConfigurationId: securityConfig.id,
      appliesToGroups: [{ networkGroupId: networkGroup.id }],
    });
  });

  describe("Basic Instantiation - Deny Rules", () => {
    it("should create Deny rule blocking SSH", () => {
      const props: SecurityAdminRuleProps = {
        name: "block-ssh",
        ruleCollectionId: ruleCollection.id,
        description: "Block SSH access from internet",
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
        destinationPortRanges: ["22"],
        sources: [
          { addressPrefix: "Internet", addressPrefixType: "ServiceTag" },
        ],
        destinations: [{ addressPrefix: "*", addressPrefixType: "IPPrefix" }],
      };

      const rule = new SecurityAdminRule(stack, "BlockSSH", props);

      expect(rule).toBeInstanceOf(SecurityAdminRule);
      expect(rule.ruleAction).toBe("Deny");
      expect(rule.rulePriority).toBe(100);
      expect(rule.props.protocol).toBe("Tcp");
      expect(rule.props.destinationPortRanges).toEqual(["22"]);
    });

    it("should create Deny rule blocking RDP", () => {
      const props: SecurityAdminRuleProps = {
        name: "block-rdp",
        ruleCollectionId: ruleCollection.id,
        priority: 101,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
        destinationPortRanges: ["3389"],
        sources: [
          { addressPrefix: "Internet", addressPrefixType: "ServiceTag" },
        ],
        destinations: [{ addressPrefix: "*", addressPrefixType: "IPPrefix" }],
      };

      const rule = new SecurityAdminRule(stack, "BlockRDP", props);

      expect(rule.props.destinationPortRanges).toEqual(["3389"]);
    });
  });

  describe("Basic Instantiation - Allow Rules", () => {
    it("should create Allow rule", () => {
      const props: SecurityAdminRuleProps = {
        name: "allow-https",
        ruleCollectionId: ruleCollection.id,
        priority: 200,
        action: "Allow",
        direction: "Inbound",
        protocol: "Tcp",
        destinationPortRanges: ["443"],
      };

      const rule = new SecurityAdminRule(stack, "AllowHTTPS", props);

      expect(rule.ruleAction).toBe("Allow");
    });
  });

  describe("Basic Instantiation - AlwaysAllow Rules", () => {
    it("should create AlwaysAllow rule for monitoring", () => {
      const props: SecurityAdminRuleProps = {
        name: "always-allow-monitoring",
        ruleCollectionId: ruleCollection.id,
        description: "Always allow traffic from monitoring systems",
        priority: 50,
        action: "AlwaysAllow",
        direction: "Inbound",
        protocol: "Any",
        sources: [
          { addressPrefix: "10.0.0.0/24", addressPrefixType: "IPPrefix" },
        ],
        destinations: [{ addressPrefix: "*", addressPrefixType: "IPPrefix" }],
      };

      const rule = new SecurityAdminRule(stack, "AllowMonitoring", props);

      expect(rule.ruleAction).toBe("AlwaysAllow");
      expect(rule.rulePriority).toBe(50);
    });
  });

  describe("Protocol Handling", () => {
    it("should support Tcp protocol", () => {
      const rule = new SecurityAdminRule(stack, "TcpRule", {
        name: "tcp-rule",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
      });

      expect(rule.props.protocol).toBe("Tcp");
    });

    it("should support Udp protocol", () => {
      const rule = new SecurityAdminRule(stack, "UdpRule", {
        name: "udp-rule",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Udp",
      });

      expect(rule.props.protocol).toBe("Udp");
    });

    it("should support Icmp protocol", () => {
      const rule = new SecurityAdminRule(stack, "IcmpRule", {
        name: "icmp-rule",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Icmp",
      });

      expect(rule.props.protocol).toBe("Icmp");
    });

    it("should support Any protocol", () => {
      const rule = new SecurityAdminRule(stack, "AnyRule", {
        name: "any-rule",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Allow",
        direction: "Inbound",
        protocol: "Any",
      });

      expect(rule.props.protocol).toBe("Any");
    });
  });

  describe("Direction Handling", () => {
    it("should support Inbound direction", () => {
      const rule = new SecurityAdminRule(stack, "InboundRule", {
        name: "inbound-rule",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
      });

      expect(rule.props.direction).toBe("Inbound");
    });

    it("should support Outbound direction", () => {
      const rule = new SecurityAdminRule(stack, "OutboundRule", {
        name: "outbound-rule",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Outbound",
        protocol: "Tcp",
      });

      expect(rule.props.direction).toBe("Outbound");
    });
  });

  describe("Port Range Handling", () => {
    it("should handle single source port", () => {
      const rule = new SecurityAdminRule(stack, "SinglePort", {
        name: "single-port",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
        sourcePortRanges: ["80"],
      });

      expect(rule.props.sourcePortRanges).toEqual(["80"]);
    });

    it("should handle multiple destination ports", () => {
      const rule = new SecurityAdminRule(stack, "MultiplePorts", {
        name: "multiple-ports",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
        destinationPortRanges: ["80", "443", "8080"],
      });

      expect(rule.props.destinationPortRanges).toEqual(["80", "443", "8080"]);
    });

    it("should handle port ranges", () => {
      const rule = new SecurityAdminRule(stack, "PortRange", {
        name: "port-range",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
        destinationPortRanges: ["8000-8999"],
      });

      expect(rule.props.destinationPortRanges).toEqual(["8000-8999"]);
    });

    it("should default to wildcard when ports not specified", () => {
      const rule = new SecurityAdminRule(stack, "DefaultPorts", {
        name: "default-ports",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Any",
      });

      expect(rule.props.sourcePortRanges).toBeUndefined();
      expect(rule.props.destinationPortRanges).toBeUndefined();
    });
  });

  describe("Address Prefix Handling", () => {
    it("should handle IP prefix sources", () => {
      const rule = new SecurityAdminRule(stack, "IPPrefix", {
        name: "ip-prefix",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
        sources: [
          { addressPrefix: "10.0.0.0/8", addressPrefixType: "IPPrefix" },
        ],
      });

      expect(rule.props.sources).toEqual([
        { addressPrefix: "10.0.0.0/8", addressPrefixType: "IPPrefix" },
      ]);
    });

    it("should handle ServiceTag sources", () => {
      const rule = new SecurityAdminRule(stack, "ServiceTag", {
        name: "service-tag",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
        sources: [
          { addressPrefix: "Internet", addressPrefixType: "ServiceTag" },
        ],
      });

      expect(rule.props.sources).toEqual([
        { addressPrefix: "Internet", addressPrefixType: "ServiceTag" },
      ]);
    });

    it("should handle multiple source addresses", () => {
      const rule = new SecurityAdminRule(stack, "MultipleSources", {
        name: "multiple-sources",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
        sources: [
          { addressPrefix: "10.0.0.0/8", addressPrefixType: "IPPrefix" },
          { addressPrefix: "192.168.0.0/16", addressPrefixType: "IPPrefix" },
        ],
      });

      expect(rule.props.sources).toHaveLength(2);
    });
  });

  describe("Priority Handling", () => {
    it("should accept low priority number (high priority)", () => {
      const rule = new SecurityAdminRule(stack, "HighPriority", {
        name: "high-priority",
        ruleCollectionId: ruleCollection.id,
        priority: 1,
        action: "AlwaysAllow",
        direction: "Inbound",
        protocol: "Any",
      });

      expect(rule.rulePriority).toBe(1);
    });

    it("should accept high priority number (low priority)", () => {
      const rule = new SecurityAdminRule(stack, "LowPriority", {
        name: "low-priority",
        ruleCollectionId: ruleCollection.id,
        priority: 4096,
        action: "Allow",
        direction: "Inbound",
        protocol: "Any",
      });

      expect(rule.rulePriority).toBe(4096);
    });
  });

  describe("API Version Handling", () => {
    it("should use default API version when none specified", () => {
      const rule = new SecurityAdminRule(stack, "TestRule", {
        name: "test-rule",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
      });

      expect(rule.resolvedApiVersion).toBe("2024-05-01");
    });

    it("should use specified API version when provided", () => {
      const rule = new SecurityAdminRule(stack, "TestRule", {
        name: "test-rule",
        ruleCollectionId: ruleCollection.id,
        apiVersion: "2023-11-01",
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
      });

      expect(rule.resolvedApiVersion).toBe("2023-11-01");
    });
  });

  describe("Terraform Outputs", () => {
    it("should create proper Terraform outputs", () => {
      const rule = new SecurityAdminRule(stack, "TestRule", {
        name: "test-rule",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
      });

      expect(rule.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(rule.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(rule.provisioningStateOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
    });

    it("should have proper resource references", () => {
      const rule = new SecurityAdminRule(stack, "TestRule", {
        name: "test-rule",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
      });

      expect(rule.id).toMatch(/^\$\{.*\.id\}$/);
      expect(rule.resourceName).toMatch(/^\$\{.*\.name\}$/);
      expect(rule.provisioningState).toMatch(
        /^\$\{.*\.output\.properties\.provisioningState\}$/,
      );
    });
  });

  describe("Parent-Child Relationship", () => {
    it("should correctly reference parent rule collection", () => {
      const rule = new SecurityAdminRule(stack, "TestRule", {
        name: "test-rule",
        ruleCollectionId: ruleCollection.id,
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
      });

      expect(rule.props.ruleCollectionId).toBe(ruleCollection.id);
    });
  });

  describe("CDK Synthesis", () => {
    it("should synthesize valid Terraform configuration", () => {
      new SecurityAdminRule(stack, "TestRule", {
        name: "test-rule",
        ruleCollectionId: ruleCollection.id,
        description: "Test security rule",
        priority: 100,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
        destinationPortRanges: ["22"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });
  });

  describe("Complex Rule Scenarios", () => {
    it("should handle rule with all properties specified", () => {
      const rule = new SecurityAdminRule(stack, "ComplexRule", {
        name: "complex-rule",
        ruleCollectionId: ruleCollection.id,
        description: "Complex security rule with all properties",
        priority: 150,
        action: "Deny",
        direction: "Inbound",
        protocol: "Tcp",
        sourcePortRanges: ["1024-65535"],
        destinationPortRanges: ["22", "3389"],
        sources: [
          { addressPrefix: "Internet", addressPrefixType: "ServiceTag" },
          { addressPrefix: "192.168.0.0/16", addressPrefixType: "IPPrefix" },
        ],
        destinations: [
          { addressPrefix: "10.0.0.0/8", addressPrefixType: "IPPrefix" },
        ],
      });

      expect(rule.props.priority).toBe(150);
      expect(rule.props.sourcePortRanges).toEqual(["1024-65535"]);
      expect(rule.props.destinationPortRanges).toEqual(["22", "3389"]);
      expect(rule.props.sources).toHaveLength(2);
      expect(rule.props.destinations).toHaveLength(1);
    });
  });
});
