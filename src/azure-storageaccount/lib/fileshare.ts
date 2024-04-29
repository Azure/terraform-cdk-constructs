import {
  StorageShare,
  StorageShareConfig,
} from "@cdktf/provider-azurerm/lib/storage-share";
import {
  StorageShareFile,
  StorageShareFileConfig,
} from "@cdktf/provider-azurerm/lib/storage-share-file";
import { Construct } from "constructs";

export interface FileShareProps {
  /**
   * The maximum size of the storage share, in gigabytes.
   */
  readonly quota?: number;

  /**
   * The access tier of the storage share. This property is only applicable to storage shares with a premium account type.
   * Example values: Hot, Cool.
   */
  readonly accessTier?: string;

  /**
   * The protocol to use when accessing the storage share.
   * Example values: SMB, NFS.
   */
  readonly enabledProtocol?: string;

  /**
   * A list of access control rules for the storage share.
   */
  readonly acl?: any; // Replace 'any' with a more specific type if available.

  /**
   * A mapping of tags to assign to the storage share.
   * Format: { [key: string]: string }
   */
  readonly metadata?: { readonly [key: string]: string };
}

export class FileShare extends Construct {
  public readonly name: string;
  public readonly id: string;
  private readonly files: Map<string, File>;
  public readonly storageAccountName: string;
  public readonly storageShareName: string;

  constructor(scope: Construct, id: string, props: StorageShareConfig) {
    super(scope, id);

    this.files = new Map<string, FileShare>();

    const share = new StorageShare(this, "share", {
      name: props.name,
      storageAccountName: props.storageAccountName,
      quota: props.quota,
      accessTier: props.accessTier,
      enabledProtocol: props.enabledProtocol,
      acl: props.acl,
      metadata: props.metadata,
    });

    this.name = share.name;
    this.storageAccountName = share.storageAccountName;
    this.storageShareName = share.name;
    this.id = share.id;
  }

  /**
   * Adds a file to the Azure Storage File Share.
   *
   * @param fileName The name of the file to be added.
   * @param fileSource Optional path or URL to the source of the file's content.
   * @param props Optional configuration properties for the file, such as content type, encoding, and metadata.
   * @returns The created AzureStorageShareFile instance.
   *
   * This method allows you to add a file to your Azure Storage File Share, optionally specifying
   * the file's content source and other properties like content type, encoding, and metadata.
   * If `fileSource` is provided, the content of the file is sourced from this location.
   * The `props` parameter allows for further customization of the file, such as setting the content type
   * (default is 'application/octet-stream') and adding metadata.
   *
   * Example usage:
   * ```typescript
   * const storageShareFile = storageShare.addFile('example.txt', './path/to/local/file.txt', {
   *   contentType: 'text/plain',
   *   metadata: { customKey: 'customValue' }
   * });
   * ```
   *
   * In this example, a text file named 'example.txt' is added to the storage share. The content of the file
   * is sourced from a local file, and the content type is specified as 'text/plain' with custom metadata.
   */
  addFile(
    fileName: string,
    fileSource?: string,
    props?: StorageShareFileConfig,
  ): File {
    const newStorageFile = new File(this, "file", {
      name: fileName,
      storageShareId: this.id,
      contentDisposition: props?.contentDisposition,
      contentEncoding: props?.contentEncoding,
      contentMd5: props?.contentMd5,
      source: fileSource,
      contentType: props?.contentType || "application/octet-stream",
      metadata: props?.metadata || {},
    });
    this.files.set(fileName, newStorageFile);
    return newStorageFile;
  }
}

export class File extends Construct {
  public readonly name: string;
  public readonly id: string;

  /**
   * Represents a file within an Azure Storage Share.
   *
   * This class is responsible for the creation and management of a file in an Azure Storage Share, which allows for cloud file storage
   * that can be accessed and managed like a file system. The File class enables detailed configuration of file properties including
   * content type, encoding, and metadata, making it suitable for storing and accessing various types of data.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the file.
   * @param props - Configuration properties for the Azure Storage Share File. These properties include:
   *                - `name`: The name of the file within the storage share.
   *                - `storageShareId`: The identifier for the storage share in which this file is located.
   *                - `source`: The source of the file's content, which can be a path to a local file or a URL.
   *                - `contentType`: The MIME type of the file's content, helping clients handle the file appropriately when downloaded.
   *                - `contentEncoding`: The encoding format of the file's content (e.g., 'gzip').
   *                - `contentDisposition`: Provides instructions on how the content should be displayed or handled.
   *                - `contentMd5`: An MD5 hash of the file content for verifying the integrity of the file upon transfer.
   *                - `metadata`: A dictionary of key-value pairs to store as metadata with the file. Metadata is typically used to store additional
   *                  details about the file such as tags, descriptions, or other attributes.
   *
   * Example usage:
   * ```typescript
   * const myFile = new File(this, 'MyFile', {
   *   name: 'examplefile.txt',
   *   storageShareId: 'share123',
   *   source: './path/to/local/file.txt',
   *   contentType: 'text/plain',
   *   contentEncoding: 'utf-8',
   *   metadata: {
   *     createdBy: 'John Doe'
   *   }
   * });
   * ```
   * This class initializes a file with the specified configurations and handles the uploading of content from the specified source, providing
   * a way to manage file storage in Azure efficiently.
   */
  constructor(scope: Construct, id: string, props: StorageShareFileConfig) {
    super(scope, id);

    const file = new StorageShareFile(this, "file", {
      name: props.name,
      storageShareId: props.storageShareId,
      source: props.source,
      contentType: props.contentType,
      contentEncoding: props.contentEncoding,
      contentDisposition: props.contentDisposition,
      contentMd5: props.contentMd5,
      metadata: props.metadata,
    });

    this.name = props.name;
    this.id = file.id;
  }
}
