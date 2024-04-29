import {
  StorageDataLakeGen2Filesystem,
  StorageDataLakeGen2FilesystemConfig,
  StorageDataLakeGen2FilesystemAce,
} from "@cdktf/provider-azurerm/lib/storage-data-lake-gen2-filesystem";
import { StorageDataLakeGen2PathConfig } from "@cdktf/provider-azurerm/lib/storage-data-lake-gen2-path";
import { Construct } from "constructs";
import { DataLakePath, DataLakePathConfig } from "./path";

export interface DataLakeFilesystemConfig {
  readonly group?: string;
  readonly owner?: string;
  readonly properties?: { [key: string]: string };
  readonly ace?: StorageDataLakeGen2FilesystemAce[];
}

export class DataLakeFilesystem extends Construct {
  public readonly name: string;
  public readonly filesystem: StorageDataLakeGen2Filesystem;
  public readonly paths: Map<string, DataLakePath>;

  private storageAccountId: string;

  /**
   * Represents a filesystem within Azure Data Lake Storage Gen2.
   *
   * This class manages the lifecycle and configuration of a filesystem in Azure Data Lake Gen2, which is used to store directories and files
   * in a hierarchical structure. This class allows for the creation, configuration, and management of access controls and properties associated with a filesystem.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the filesystem.
   * @param props - Configuration properties for the Data Lake Gen2 filesystem. These properties may include:
   *                - `name`: The name of the filesystem.
   *                - `storageAccountId`: The ID of the Azure Storage account that hosts the filesystem.
   *                - `defaultEncryptionScope`: Specifies the default encryption scope for the filesystem.
   *                - `properties`: A dictionary of strings representing properties to associate with the filesystem.
   *                - `ace`: An array of access control expressions to define permissions within the filesystem.
   *
   * Example usage:
   * ```typescript
   * const dataLakeFilesystem = new StorageDataLakeGen2Filesystem(this, 'myFilesystem', {
   *   name: 'mydatafilesystem',
   *   storageAccountId: 'storage_account_id',
   *   defaultEncryptionScope: 'my-encryption-scope',
   *   properties: {
   *     property1: 'value1',
   *     property2: 'value2'
   *   }
   * });
   * ```
   * This class initializes a filesystem with specified configurations such as name, storage account ID, and optional properties like encryption scope and custom properties.
   */
  constructor(
    scope: Construct,
    id: string,
    props: StorageDataLakeGen2FilesystemConfig,
  ) {
    super(scope, id);
    this.name = id;
    this.paths = new Map<string, DataLakePath>();
    this.storageAccountId = props.storageAccountId;
    this.filesystem = new StorageDataLakeGen2Filesystem(this, id, props);
  }

  /**
   * Adds a new directory or file path to the existing Data Lake Gen2 filesystem.
   *
   * This method allows for the creation of a new path, which can be either a directory or a file, within the defined filesystem in Azure Data Lake Gen2.
   * Each path is configured with optional properties and access controls, making it possible to finely tune the permissions and settings for data stored at this path.
   *
   * @param name - The name of the new path to create within the filesystem. This name must be unique within the filesystem.
   * @param props - Configuration properties for the new path, including access controls, ownership details, and other relevant settings.
   * @returns The newly created DataLakePath instance representing the path within the filesystem.
   * @throws Error if a path with the same name already exists in the filesystem.
   *
   * Example usage:
   * ```typescript
   * const pathConfig = {
   *   group: 'dataGroup',
   *   owner: 'dataOwner',
   *   ace: [{ id: 'ace1', type: 'user', permissions: 'rwx' }]
   * };
   * const newPath = dataLakeFilesystem.addDataLakePath('newDataPath', pathConfig);
   * ```
   * This example demonstrates adding a new path 'newDataPath' to the filesystem with specified group, owner, and access control entries.
   */
  public addDataLakePath(
    name: string,
    props: DataLakePathConfig,
  ): DataLakePath {
    if (this.paths.has(name)) {
      throw new Error(`Filesystem '${name}' already exists.`);
    }

    var config: StorageDataLakeGen2PathConfig = {
      filesystemName: this.filesystem.name,
      storageAccountId: this.storageAccountId,
      path: name,
      resource: "directory",
      ...props,
    };

    const newPath = new DataLakePath(this, name, config);

    this.paths.set(name, newPath);
    return newPath;
  }
}
