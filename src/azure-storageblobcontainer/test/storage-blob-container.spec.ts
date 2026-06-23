import { Testing } from "cdktn";
import * as cdktn from "cdktn";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  StorageBlobContainer,
  StorageBlobContainerProps,
} from "../lib/storage-blob-container";
import {
  ALL_STORAGE_BLOB_CONTAINER_VERSIONS,
  STORAGE_BLOB_CONTAINER_TYPE,
} from "../lib/storage-blob-container-schemas";

describe("StorageBlobContainer", () => {
  let app: cdktn.App;
  let stack: cdktn.TerraformStack;
  let manager: ApiVersionManager;

  const storageAccountId =
    "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/teststorage";

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktn.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    try {
      manager.registerResourceType(
        STORAGE_BLOB_CONTAINER_TYPE,
        ALL_STORAGE_BLOB_CONTAINER_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create storage blob container with required properties", () => {
      const props: StorageBlobContainerProps = {
        name: "test-container",
        storageAccountId,
      };

      const container = new StorageBlobContainer(
        stack,
        "TestStorageBlobContainer",
        props,
      );

      expect(container).toBeInstanceOf(StorageBlobContainer);
      expect(container.resolvedApiVersion).toBe("2024-01-01");
      expect(container.props).toBe(props);
      expect(container.name).toBe("test-container");
      expect(container.props.storageAccountId).toBe(storageAccountId);
    });

    it("should resolve latest version automatically", () => {
      const container = new StorageBlobContainer(stack, "LatestVersion", {
        name: "latest-container",
        storageAccountId,
      });

      expect(container.resolvedApiVersion).toBe("2024-01-01");
      expect(container.latestVersion()).toBe("2024-01-01");
    });

    it("should create storage blob container with explicit version pinning", () => {
      const props: StorageBlobContainerProps = {
        name: "pinned-container",
        storageAccountId,
        apiVersion: "2024-01-01",
      };

      const container = new StorageBlobContainer(
        stack,
        "PinnedStorageBlobContainer",
        props,
      );

      expect(container.resolvedApiVersion).toBe("2024-01-01");
    });

    it("should create storage blob container with all optional properties", () => {
      const props: StorageBlobContainerProps = {
        name: "full-container",
        storageAccountId,
        publicAccess: "Blob",
        metadata: {
          environment: "test",
          team: "platform",
        },
        defaultEncryptionScope: "$account-encryption-key",
        denyEncryptionScopeOverride: true,
        immutableStorageWithVersioning: {
          enabled: true,
        },
      };

      const container = new StorageBlobContainer(
        stack,
        "FullStorageBlobContainer",
        props,
      );

      expect(container.props.publicAccess).toBe("Blob");
      expect(container.props.metadata).toEqual(props.metadata);
      expect(container.props.defaultEncryptionScope).toBe(
        "$account-encryption-key",
      );
      expect(container.props.denyEncryptionScopeOverride).toBe(true);
      expect(container.props.immutableStorageWithVersioning).toEqual({
        enabled: true,
      });
    });
  });

  describe("Framework Integration", () => {
    it("should support the registered API version", () => {
      const container = new StorageBlobContainer(stack, "SupportedVersions", {
        name: "supported-container",
        storageAccountId,
      });

      expect(container.supportedVersions()).toEqual(["2024-01-01"]);
    });

    it("should validate version support", () => {
      expect(() => {
        new StorageBlobContainer(stack, "ValidVersion", {
          name: "valid-container",
          storageAccountId,
          apiVersion: "2024-01-01",
        });
      }).not.toThrow();

      expect(() => {
        new StorageBlobContainer(stack, "InvalidVersion", {
          name: "invalid-container",
          storageAccountId,
          apiVersion: "2025-01-01",
        });
      }).toThrow("Unsupported API version '2025-01-01'");
    });

    it("should load the correct schema", () => {
      const container = new StorageBlobContainer(stack, "SchemaTest", {
        name: "schema-container",
        storageAccountId,
      });

      expect(container.schema).toBeDefined();
      expect(container.schema.resourceType).toBe(STORAGE_BLOB_CONTAINER_TYPE);
      expect(container.schema.version).toBe("2024-01-01");
      expect(container.schema.properties.name).toBeDefined();
      expect(container.schema.properties.storageAccountId).toBeDefined();
    });

    it("should load version configuration correctly", () => {
      const container = new StorageBlobContainer(stack, "VersionConfigTest", {
        name: "config-container",
        storageAccountId,
      });

      expect(container.versionConfig).toBeDefined();
      expect(container.versionConfig.version).toBe("2024-01-01");
      expect(container.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });
  });

  describe("Terraform Outputs", () => {
    it("should create Terraform outputs", () => {
      const container = new StorageBlobContainer(stack, "OutputTest", {
        name: "output-container",
        storageAccountId,
      });

      expect(container.idOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(container.nameOutput).toBeInstanceOf(cdktn.TerraformOutput);
    });

    it("should have correct id format", () => {
      const container = new StorageBlobContainer(stack, "IdFormat", {
        name: "id-container",
        storageAccountId,
      });

      expect(container.id).toMatch(/^\$\{.*\.id\}$/);
      expect(container.resourceId).toBe(container.id);
    });
  });

  describe("Child Resource Behavior", () => {
    it("should append /blobServices/default to the parent ID", () => {
      new StorageBlobContainer(stack, "ParentIdTest", {
        name: "parent-id-container",
        storageAccountId,
      });

      const synthesized = Testing.synth(stack);
      const stackConfig = JSON.parse(synthesized);
      const resourceEntries = Object.values(
        stackConfig.resource.azapi_resource,
      ) as Array<{ parent_id: string }>;

      expect(resourceEntries[0].parent_id).toBe(
        `${storageAccountId}/blobServices/default`,
      );
    });

    it("should handle multiple containers in the same stack", () => {
      const container1 = new StorageBlobContainer(stack, "ContainerOne", {
        name: "container-one",
        storageAccountId,
      });

      const container2 = new StorageBlobContainer(stack, "ContainerTwo", {
        name: "container-two",
        storageAccountId,
        apiVersion: "2024-01-01",
      });

      expect(container1.resolvedApiVersion).toBe("2024-01-01");
      expect(container2.resolvedApiVersion).toBe("2024-01-01");

      const synthesized = Testing.synth(stack);
      const stackConfig = JSON.parse(synthesized);
      expect(Object.keys(stackConfig.resource.azapi_resource)).toHaveLength(2);
    });
  });
});
