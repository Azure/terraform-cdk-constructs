/**
 * Unit tests for Azure Key Vault using AzapiResource framework
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ResourceGroup } from "../../azure-resourcegroup";
import { KeyVault, KeyVaultProps } from "../lib/key-vault";

describe("KeyVault", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  describe("constructor", () => {
    it("should create a key vault with required properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: KeyVaultProps = {
        name: "test-keyvault-001",
        location: "eastus",
        resourceGroupId: rg.id,
        tenantId: "00000000-0000-0000-0000-000000000000",
      };

      const keyVault = new KeyVault(stack, "TestKv", props);

      expect(keyVault).toBeInstanceOf(KeyVault);
      expect(keyVault.props).toBe(props);
    });

    it("should create a key vault with all properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: KeyVaultProps = {
        name: "test-keyvault-002",
        location: "eastus",
        resourceGroupId: rg.id,
        tenantId: "00000000-0000-0000-0000-000000000000",
        sku: { name: "premium", family: "A" },
        enabledForDeployment: true,
        enabledForDiskEncryption: true,
        enabledForTemplateDeployment: true,
        enableRbacAuthorization: false,
        enableSoftDelete: true,
        softDeleteRetentionInDays: 30,
        enablePurgeProtection: true,
        publicNetworkAccess: "Disabled",
        tags: {
          environment: "test",
          project: "cdktf-constructs",
        },
        networkAcls: {
          defaultAction: "Deny",
          bypass: "AzureServices",
          ipRules: [{ value: "1.2.3.4" }],
        },
        accessPolicies: [
          {
            tenantId: "00000000-0000-0000-0000-000000000000",
            objectId: "11111111-1111-1111-1111-111111111111",
            permissions: {
              secrets: ["get", "list"],
            },
          },
        ],
      };

      const keyVault = new KeyVault(stack, "TestKv", props);

      expect(keyVault.props).toBe(props);
      expect(keyVault.tags).toEqual(props.tags);
    });

    it("should resolve tenantId from AZAPI client config when not specified", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: KeyVaultProps = {
        name: "test-keyvault-003",
        location: "eastus",
        resourceGroupId: rg.id,
      };

      const keyVault = new KeyVault(stack, "TestKv", props);

      expect(keyVault).toBeInstanceOf(KeyVault);
    });

    it("should create terraform outputs", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: KeyVaultProps = {
        name: "test-keyvault-004",
        location: "eastus",
        resourceGroupId: rg.id,
        tenantId: "00000000-0000-0000-0000-000000000000",
      };

      const keyVault = new KeyVault(stack, "TestKv", props);

      expect(keyVault.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(keyVault.locationOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(keyVault.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(keyVault.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(keyVault.vaultUriOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });

    it("should expose vaultUri property", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: KeyVaultProps = {
        name: "test-keyvault-005",
        location: "eastus",
        resourceGroupId: rg.id,
        tenantId: "00000000-0000-0000-0000-000000000000",
      };

      const keyVault = new KeyVault(stack, "TestKv", props);

      expect(keyVault.vaultUri).toContain("vault.azure.net");
    });
  });

  describe("validation", () => {
    it("should reject softDeleteRetentionInDays below 7", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: KeyVaultProps = {
        name: "test-keyvault-006",
        location: "eastus",
        resourceGroupId: rg.id,
        tenantId: "00000000-0000-0000-0000-000000000000",
        softDeleteRetentionInDays: 3,
      };

      expect(() => new KeyVault(stack, "TestKv", props)).toThrow(
        /softDeleteRetentionInDays/,
      );
    });

    it("should reject softDeleteRetentionInDays above 90", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: KeyVaultProps = {
        name: "test-keyvault-007",
        location: "eastus",
        resourceGroupId: rg.id,
        tenantId: "00000000-0000-0000-0000-000000000000",
        softDeleteRetentionInDays: 365,
      };

      expect(() => new KeyVault(stack, "TestKv", props)).toThrow(
        /softDeleteRetentionInDays/,
      );
    });
  });

  describe("SKU configuration", () => {
    it("should accept standard SKU by default", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: KeyVaultProps = {
        name: "test-keyvault-008",
        location: "eastus",
        resourceGroupId: rg.id,
        tenantId: "00000000-0000-0000-0000-000000000000",
      };

      const keyVault = new KeyVault(stack, "TestKv", props);

      expect(keyVault).toBeInstanceOf(KeyVault);
    });

    it("should accept premium SKU", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: KeyVaultProps = {
        name: "test-keyvault-009",
        location: "eastus",
        resourceGroupId: rg.id,
        tenantId: "00000000-0000-0000-0000-000000000000",
        sku: { name: "premium" },
      };

      const keyVault = new KeyVault(stack, "TestKv", props);

      expect(keyVault.props.sku?.name).toBe("premium");
    });
  });

  describe("tag management", () => {
    let keyVault: KeyVault;

    beforeEach(() => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: KeyVaultProps = {
        name: "test-keyvault-010",
        location: "eastus",
        resourceGroupId: rg.id,
        tenantId: "00000000-0000-0000-0000-000000000000",
        tags: {
          environment: "test",
        },
      };

      keyVault = new KeyVault(stack, "TestKv", props);
    });

    it("should add a tag", () => {
      keyVault.addTag("newTag", "newValue");

      expect(keyVault.props.tags!.newTag).toBe("newValue");
      expect(keyVault.props.tags!.environment).toBe("test");
    });

    it("should remove an existing tag", () => {
      keyVault.removeTag("environment");

      expect(keyVault.props.tags!.environment).toBeUndefined();
    });
  });

  describe("API versioning", () => {
    it("should use default version when not specified", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: KeyVaultProps = {
        name: "test-keyvault-011",
        location: "eastus",
        resourceGroupId: rg.id,
        tenantId: "00000000-0000-0000-0000-000000000000",
      };

      const keyVault = new KeyVault(stack, "TestKv", props);

      expect(keyVault.resolvedApiVersion).toBe("2024-11-01");
    });

    it("should accept specific API version", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: KeyVaultProps = {
        name: "test-keyvault-012",
        location: "eastus",
        resourceGroupId: rg.id,
        tenantId: "00000000-0000-0000-0000-000000000000",
        apiVersion: "2023-07-01",
      };

      const keyVault = new KeyVault(stack, "TestKv", props);

      expect(keyVault.resolvedApiVersion).toBe("2023-07-01");
    });
  });

  describe("CDK Terraform integration", () => {
    it("should synthesize to valid Terraform", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: KeyVaultProps = {
        name: "test-keyvault-013",
        location: "eastus",
        resourceGroupId: rg.id,
        tenantId: "00000000-0000-0000-0000-000000000000",
        tags: {
          environment: "test",
        },
      };

      new KeyVault(stack, "TestKv", props);

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });
  });
});
