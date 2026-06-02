/**
 * Unit tests for Azure Container Registry using VersionedAzapiResource framework
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ResourceGroup } from "../../azure-resourcegroup";
import {
  ContainerRegistry,
  ContainerRegistryProps,
} from "../lib/container-registry";

describe("ContainerRegistry", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  describe("constructor", () => {
    it("should create a container registry with required properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistry01",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard" },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry).toBeInstanceOf(ContainerRegistry);
      expect(registry.props).toBe(props);
    });

    it("should create a container registry with all properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistry02",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Premium" },
        adminUserEnabled: false,
        publicNetworkAccess: "Disabled",
        zoneRedundancy: "Enabled",
        dataEndpointEnabled: true,
        anonymousPullEnabled: false,
        networkRuleBypassOptions: "AzureServices",
        tags: {
          environment: "test",
          project: "cdktf-constructs",
        },
        networkRuleSet: {
          defaultAction: "Deny",
          ipRules: [{ value: "1.2.3.4", action: "Allow" }],
        },
        policies: {
          retentionPolicy: { days: 30, status: "enabled" },
          softDeletePolicy: { retentionDays: 14, status: "enabled" },
        },
        identity: {
          type: "SystemAssigned",
        },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.props).toBe(props);
      expect(registry.tags).toEqual(props.tags);
    });

    it("should use default values for optional properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistry03",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Basic" },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry).toBeInstanceOf(ContainerRegistry);
    });

    it("should create terraform outputs", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistry04",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard" },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(registry.locationOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(registry.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(registry.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(registry.loginServerOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });
  });

  describe("SKU configuration", () => {
    it("should accept Basic SKU", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistrybasic",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Basic" },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.props.sku.name).toBe("Basic");
    });

    it("should accept Standard SKU", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistrystd",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard" },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.props.sku.name).toBe("Standard");
    });

    it("should accept Premium SKU with advanced features", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistryprem",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Premium" },
        zoneRedundancy: "Enabled",
        dataEndpointEnabled: true,
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.props.sku.name).toBe("Premium");
      expect(registry.props.zoneRedundancy).toBe("Enabled");
      expect(registry.props.dataEndpointEnabled).toBe(true);
    });
  });

  describe("security settings", () => {
    it("should configure admin user disabled by default", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistrysec",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard" },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.props.adminUserEnabled).toBeUndefined();
    });

    it("should configure public network access", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistrynet",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Premium" },
        publicNetworkAccess: "Disabled",
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.props.publicNetworkAccess).toBe("Disabled");
    });

    it("should configure network rule set", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistryrules",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Premium" },
        networkRuleSet: {
          defaultAction: "Deny",
          ipRules: [{ value: "10.0.0.0/24", action: "Allow" }],
        },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.props.networkRuleSet).toBeDefined();
      expect(registry.props.networkRuleSet!.defaultAction).toBe("Deny");
    });

    it("should configure encryption with customer-managed key", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistryenc",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Premium" },
        encryption: {
          status: "enabled",
          keyVaultProperties: {
            keyIdentifier: "https://myvault.vault.azure.net/keys/mykey/version",
          },
        },
        identity: {
          type: "UserAssigned",
          userAssignedIdentities: {
            "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity":
              {},
          },
        },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.props.encryption).toBeDefined();
      expect(registry.props.encryption!.status).toBe("enabled");
    });
  });

  describe("policy configuration", () => {
    it("should configure retention policy", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistrypol",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Premium" },
        policies: {
          retentionPolicy: {
            days: 30,
            status: "enabled",
          },
        },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.props.policies).toBeDefined();
      expect(registry.props.policies!.retentionPolicy!.days).toBe(30);
      expect(registry.props.policies!.retentionPolicy!.status).toBe("enabled");
    });

    it("should configure soft delete policy", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistrysd",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Premium" },
        policies: {
          softDeletePolicy: {
            retentionDays: 14,
            status: "enabled",
          },
        },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.props.policies!.softDeletePolicy!.retentionDays).toBe(14);
    });

    it("should configure multiple policies", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistrymulti",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Premium" },
        policies: {
          retentionPolicy: { days: 7, status: "enabled" },
          trustPolicy: { type: "Notary", status: "enabled" },
          exportPolicy: { status: "enabled" },
          softDeletePolicy: { retentionDays: 7, status: "enabled" },
        },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.props.policies!.retentionPolicy).toBeDefined();
      expect(registry.props.policies!.trustPolicy).toBeDefined();
      expect(registry.props.policies!.exportPolicy).toBeDefined();
      expect(registry.props.policies!.softDeletePolicy).toBeDefined();
    });
  });

  describe("tag management", () => {
    let registry: ContainerRegistry;

    beforeEach(() => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistrytags",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard" },
        tags: {
          environment: "test",
        },
      };

      registry = new ContainerRegistry(stack, "TestRegistry", props);
    });

    it("should add a tag", () => {
      registry.addTag("newTag", "newValue");

      expect(registry.props.tags!.newTag).toBe("newValue");
      expect(registry.props.tags!.environment).toBe("test");
    });

    it("should remove an existing tag", () => {
      registry.removeTag("environment");

      expect(registry.props.tags!.environment).toBeUndefined();
    });

    it("should add a tag when no tags exist", () => {
      const rg = new ResourceGroup(stack, "TestRG2", {
        name: "test-rg2",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistrynt",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard" },
      };

      const reg = new ContainerRegistry(stack, "TestRegistryNoTags", props);
      reg.addTag("firstTag", "firstValue");

      expect(reg.props.tags!.firstTag).toBe("firstValue");
    });
  });

  describe("API versioning", () => {
    it("should use default version when not specified", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistrydef",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard" },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry).toBeInstanceOf(ContainerRegistry);
    });

    it("should accept specific API version", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistryver",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard" },
        apiVersion: "2023-07-01",
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.props.apiVersion).toBe("2023-07-01");
    });
  });

  describe("CDK Terraform integration", () => {
    it("should synthesize to valid Terraform", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistrysynth",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard" },
        tags: {
          environment: "test",
        },
      };

      new ContainerRegistry(stack, "TestRegistry", props);

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistrylog",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard" },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.idOutput).toBeDefined();
      expect(registry.locationOutput).toBeDefined();
      expect(registry.nameOutput).toBeDefined();
      expect(registry.tagsOutput).toBeDefined();
      expect(registry.loginServerOutput).toBeDefined();
    });
  });

  describe("login server property", () => {
    it("should provide login server URL", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: ContainerRegistryProps = {
        name: "testregistrylogin",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard" },
      };

      const registry = new ContainerRegistry(stack, "TestRegistry", props);

      expect(registry.loginServer).toBeDefined();
    });
  });
});
