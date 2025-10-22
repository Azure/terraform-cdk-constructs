/**
 * Unit tests for Azure Storage Account using VersionedAzapiResource framework
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ResourceGroup } from "../../azure-resourcegroup";
import { StorageAccount, StorageAccountProps } from "../lib/storage-account";

describe("StorageAccount", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  describe("constructor", () => {
    it("should create a storage account with required properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststorageaccount",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
      };

      const storageAccount = new StorageAccount(stack, "TestStorage", props);

      expect(storageAccount).toBeInstanceOf(StorageAccount);
      expect(storageAccount.props).toBe(props);
    });

    it("should create a storage account with all properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststorageaccount",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_GRS" },
        kind: "StorageV2",
        accessTier: "Hot",
        enableHttpsTrafficOnly: true,
        minimumTlsVersion: "TLS1_2",
        allowBlobPublicAccess: false,
        tags: {
          environment: "test",
          project: "cdktf-constructs",
        },
        networkAcls: {
          defaultAction: "Deny",
          bypass: "AzureServices",
        },
        identity: {
          type: "SystemAssigned",
        },
      };

      const storageAccount = new StorageAccount(stack, "TestStorage", props);

      expect(storageAccount.props).toBe(props);
      expect(storageAccount.tags).toEqual(props.tags);
    });

    it("should use default values for optional properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststorageaccount",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
      };

      const storageAccount = new StorageAccount(stack, "TestStorage", props);

      expect(storageAccount).toBeInstanceOf(StorageAccount);
    });

    it("should create terraform outputs", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststorageaccount",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
      };

      const storageAccount = new StorageAccount(stack, "TestStorage", props);

      expect(storageAccount.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(storageAccount.locationOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
      expect(storageAccount.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(storageAccount.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(storageAccount.primaryEndpointsOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
    });
  });

  describe("SKU configuration", () => {
    it("should accept Standard_LRS SKU", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststoragelrs",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
      };

      const storageAccount = new StorageAccount(stack, "TestStorage", props);

      expect(storageAccount.props.sku.name).toBe("Standard_LRS");
    });

    it("should accept Premium_LRS SKU with BlockBlobStorage kind", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststoragepremium",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Premium_LRS" },
        kind: "BlockBlobStorage",
      };

      const storageAccount = new StorageAccount(stack, "TestStorage", props);

      expect(storageAccount.props.sku.name).toBe("Premium_LRS");
      expect(storageAccount.props.kind).toBe("BlockBlobStorage");
    });
  });

  describe("security settings", () => {
    it("should configure HTTPS-only traffic", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststoragesecure",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
        enableHttpsTrafficOnly: true,
      };

      const storageAccount = new StorageAccount(stack, "TestStorage", props);

      expect(storageAccount.props.enableHttpsTrafficOnly).toBe(true);
    });

    it("should configure minimum TLS version", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststoragetls",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
        minimumTlsVersion: "TLS1_2",
      };

      const storageAccount = new StorageAccount(stack, "TestStorage", props);

      expect(storageAccount.props.minimumTlsVersion).toBe("TLS1_2");
    });

    it("should configure network ACLs", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststoragenetwork",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
        networkAcls: {
          defaultAction: "Deny",
          bypass: "AzureServices",
          ipRules: [{ value: "1.2.3.4" }],
        },
      };

      const storageAccount = new StorageAccount(stack, "TestStorage", props);

      expect(storageAccount.props.networkAcls).toBeDefined();
      expect(storageAccount.props.networkAcls!.defaultAction).toBe("Deny");
    });
  });

  describe("tag management", () => {
    let storageAccount: StorageAccount;

    beforeEach(() => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststoragetags",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
        tags: {
          environment: "test",
        },
      };

      storageAccount = new StorageAccount(stack, "TestStorage", props);
    });

    it("should add a tag", () => {
      storageAccount.addTag("newTag", "newValue");

      expect(storageAccount.props.tags!.newTag).toBe("newValue");
      expect(storageAccount.props.tags!.environment).toBe("test");
    });

    it("should remove an existing tag", () => {
      storageAccount.removeTag("environment");

      expect(storageAccount.props.tags!.environment).toBeUndefined();
    });

    it("should add a tag when no tags exist", () => {
      const rg = new ResourceGroup(stack, "TestRG2", {
        name: "test-rg2",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststoragenotags",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
      };

      const storage = new StorageAccount(stack, "TestStorageNoTags", props);
      storage.addTag("firstTag", "firstValue");

      expect(storage.props.tags!.firstTag).toBe("firstValue");
    });
  });

  describe("API versioning", () => {
    it("should use default version when not specified", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststoragedefault",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
      };

      const storageAccount = new StorageAccount(stack, "TestStorage", props);

      expect(storageAccount).toBeInstanceOf(StorageAccount);
    });

    it("should accept specific API version", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststorageversioned",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
        apiVersion: "2023-05-01",
      };

      const storageAccount = new StorageAccount(stack, "TestStorage", props);

      expect(storageAccount.props.apiVersion).toBe("2023-05-01");
    });
  });

  describe("CDK Terraform integration", () => {
    it("should synthesize to valid Terraform", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststoragesynth",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
        tags: {
          environment: "test",
        },
      };

      new StorageAccount(stack, "TestStorage", props);

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

      const props: StorageAccountProps = {
        name: "teststoragelogical",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
      };

      const storageAccount = new StorageAccount(stack, "TestStorage", props);

      expect(storageAccount.idOutput).toBeDefined();
      expect(storageAccount.locationOutput).toBeDefined();
      expect(storageAccount.nameOutput).toBeDefined();
      expect(storageAccount.tagsOutput).toBeDefined();
      expect(storageAccount.primaryEndpointsOutput).toBeDefined();
    });
  });

  describe("endpoint properties", () => {
    it("should provide blob endpoint", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: StorageAccountProps = {
        name: "teststorageendpoint",
        location: "eastus",
        resourceGroupId: rg.id,
        sku: { name: "Standard_LRS" },
      };

      const storageAccount = new StorageAccount(stack, "TestStorage", props);

      expect(storageAccount.primaryBlobEndpoint).toBeDefined();
      expect(storageAccount.primaryFileEndpoint).toBeDefined();
      expect(storageAccount.primaryQueueEndpoint).toBeDefined();
      expect(storageAccount.primaryTableEndpoint).toBeDefined();
    });
  });
});
