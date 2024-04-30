import {
  StorageBlob,
  StorageBlobConfig,
} from "@cdktf/provider-azurerm/lib/storage-blob";
import {
  StorageContainer,
  StorageContainerConfig,
} from "@cdktf/provider-azurerm/lib/storage-container";
import { Construct } from "constructs";

export class Container extends Construct {
  public readonly name: string;
  private readonly blobs: Map<string, Blob>;
  private readonly storageAccountName: string;
  private readonly storageContainerName: string;

  /**
   * Represents an Azure Storage Container within a specific Azure Storage Account.
   *
   * This class is designed for the creation and management of an Azure Storage Container, which serves as a unit of storage
   * that houses data objects, known as blobs. Containers are analogous to directories in a file system, and are used to organize
   * sets of blobs within a storage account. This class allows for granular control over blob storage, providing functionalities
   * such as setting access levels, managing metadata, and implementing security measures like encryption scopes.
   *
   * @param scope - The scope in which to define this construct, typically a reference to the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the container.
   * @param props - Configuration properties for the Azure Storage Container, based on the StorageContainerConfig interface. These include:
   *                - `name`: The name of the storage container, which must be unique within the associated storage account.
   *                - `storageAccountName`: The name of the storage account where this container is located.
   *                - `containerAccessType`: Defines the level of public access to the container. Options include 'container',
   *                  'blob', or 'none', controlling how the blobs within the container can be accessed.
   *                - `defaultEncryptionScope`: Specifies the default encryption scope for the container, enhancing data security.
   *                - `encryptionScopeOverrideEnabled`: Allows or prevents overriding the encryption scope on a per-blob basis.
   *                - `metadata`: Key-value pairs that provide additional information about the container, which can be used for
   *                  organizational, search, or billing purposes.
   *                - `timeouts`: Specifies custom timeout settings for CRUD operations on the container, providing control over
   *                  operation durations and retries.
   *
   * Example usage:
   * ```typescript
   * const storageContainer = new Container(this, 'MyContainer', {
   *   name: 'mycontainer',
   *   storageAccountName: 'mystorageaccount',
   *   containerAccessType: 'blob',
   *   defaultEncryptionScope: 'myEncryptionScope',
   *   encryptionScopeOverrideEnabled: true,
   *   metadata: {
   *     department: 'Finance'
   *   }
   * });
   * ```
   * This instantiation sets up a storage container with specified properties including access types and metadata. It is ready
   * to house blobs and provides methods to manage these blobs effectively.
   */
  constructor(scope: Construct, id: string, props: StorageContainerConfig) {
    super(scope, id);

    this.blobs = new Map<string, Blob>();

    // Create a storage container
    const container = new StorageContainer(this, "container", {
      name: props.name,
      storageAccountName: props.storageAccountName,
      containerAccessType: props.containerAccessType,
      metadata: props.metadata,
    });

    this.name = props.name;
    this.storageAccountName = props.storageAccountName;
    this.storageContainerName = container.name;
  }

  /**
   * Adds a blob to this Azure Storage Container.
   *
   * This method facilitates the addition of a blob to an Azure Storage Container managed by this class. It handles the creation and
   * configuration of the blob, including setting its type, source content, and metadata. This is useful for uploading various types
   * of unstructured data, such as images, videos, documents, or other binary files, into a cloud-based storage solution.
   *
   * @param blobName - The name of the blob to be added, which will be used as the blob's unique identifier within the container.
   * @param filePath - The file path or URL for the source of the blob's content. This specifies the location of the file to be uploaded.
   * @param props - Optional configuration properties for the blob, which include:
   *                - `type`: The type of the blob (e.g., 'Block', 'Append', 'Page'). Default is 'Block'.
   *                - `contentType`: The MIME type of the blob's content, such as 'application/octet-stream' for binary data. This helps browsers
   *                  and other clients handle the file correctly when it's downloaded or accessed.
   *                - `metadata`: A dictionary of key-value pairs to store as metadata with the blob. Metadata is typically used to store additional
   *                  details about the blob, such as tags, descriptions, or other attributes.
   *
   * @returns The newly created Blob object, which represents the blob added to the storage container.
   *
   * Example usage:
   * ```typescript
   * const storageBlob = storageContainer.addBlob('exampleBlob', './path/to/local/file.txt', {
   *   type: 'Block',
   *   contentType: 'text/plain',
   *   metadata: { customKey: 'customValue' }
   * });
   * ```
   * In this example, a new blob named 'exampleBlob' is added to the storage container. The content of the blob is sourced
   * from a local file specified by `filePath`. The blob is configured as a 'Block' type with 'text/plain' content type and
   * custom metadata. The method returns the blob instance for further use or reference.
   */
  addBlob(blobName: string, filePath: string, props?: StorageBlobConfig): Blob {
    const newStorageBlob = new Blob(this, blobName, {
      name: blobName,
      storageAccountName: this.storageAccountName,
      storageContainerName: this.storageContainerName,
      type: props?.type || "Block",
      source: filePath,
      contentType: props?.contentType || "application/octet-stream",
      metadata: props?.metadata || {},
    });
    this.blobs.set(blobName, newStorageBlob);
    return newStorageBlob;
  }
}

export class Blob extends Construct {
  readonly name: string;

  /**
   * Represents a blob within an Azure Storage Container.
   *
   * This class is responsible for the creation and management of a blob in an Azure Storage Container. Blobs are unstructured
   * data objects, which can include files like images, documents, videos, or any other file type. The Blob class provides a way
   * to manage these files in the cloud, allowing for scalable, durable, and accessible data storage. This class supports various
   * blob types such as block blobs for text and binary data, append blobs for log files, and page blobs for large volumes of
   * random access data.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the blob.
   * @param props - Configuration properties for the Azure Storage Blob. These properties may include:
   *                - `name`: The name of the blob, which must be unique within the container.
   *                - `storageAccountName`: The name of the storage account in which the blob is stored.
   *                - `storageContainerName`: The name of the storage container in which the blob resides.
   *                - `type`: The type of the blob (e.g., 'Block', 'Append', 'Page').
   *                - `source`: The source of the blob's content, which could be a path to a file or a URL.
   *                - `contentType`: The MIME type of the blob's content, such as 'application/octet-stream' for binary data.
   *                - `metadata`: A dictionary of strings that represents metadata to associate with the blob.
   *                - `accessTier`: The data access tier, affecting storage costs and data retrieval speeds.
   *                - `cacheControl`, `contentEncoding`, `contentDisposition`, `contentMd5`: Optional parameters for controlling the caching behavior,
   *                  encoding, content disposition, and integrity check of the blob.
   *
   * Example usage:
   * ```typescript
   * const myBlob = new Blob(this, 'MyBlob', {
   *   name: 'exampleblob',
   *   storageAccountName: 'mystorageaccount',
   *   storageContainerName: 'mycontainer',
   *   type: 'Block',
   *   source: './path/to/file.jpg',
   *   contentType: 'image/jpeg',
   *   metadata: {
   *     author: 'John Doe'
   *   }
   * });
   * ```
   * This class initializes a blob with the specified configurations and handles the uploading of content from the specified source.
   */
  constructor(scope: Construct, id: string, props: StorageBlobConfig) {
    super(scope, id);

    // Create a storage container
    new StorageBlob(this, "blob", {
      name: props.name,
      storageAccountName: props.storageAccountName,
      storageContainerName: props.storageContainerName,
      type: props.type,
      source: props.source,
      contentType: props.contentType,
      metadata: props.metadata,
    });

    this.name = props.name;
  }
}
