import {
  StorageDataLakeGen2Filesystem,
  StorageDataLakeGen2FilesystemConfig,
} from "@cdktf/provider-azurerm/lib/storage-data-lake-gen2-filesystem";
import { Construct } from "constructs";

export class DataLakeFilesystem extends Construct {
  public readonly name: string;
  public readonly filesystem: StorageDataLakeGen2Filesystem;

  constructor(
    scope: Construct,
    id: string,
    props: StorageDataLakeGen2FilesystemConfig,
  ) {
    super(scope, id);
    this.filesystem = new StorageDataLakeGen2Filesystem(
      this,
      "filesystem",
      props,
    );
  }
}
