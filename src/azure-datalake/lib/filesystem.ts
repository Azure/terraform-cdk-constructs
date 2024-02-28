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
