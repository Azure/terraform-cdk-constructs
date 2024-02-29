import {
  StorageDataLakeGen2Path,
  StorageDataLakeGen2PathConfig,
  StorageDataLakeGen2PathAce,
} from "@cdktf/provider-azurerm/lib/storage-data-lake-gen2-path";
import { Construct } from "constructs";

export interface DataLakePathConfig {
  readonly group?: string;
  readonly owner?: string;
  readonly ace?: StorageDataLakeGen2PathAce[];
}

export class DataLakePath extends Construct {
  public readonly name: string;
  public readonly filesystem: StorageDataLakeGen2Path;

  constructor(
    scope: Construct,
    id: string,
    props: StorageDataLakeGen2PathConfig,
  ) {
    super(scope, id);
    this.name = id;
    this.filesystem = new StorageDataLakeGen2Path(this, "path", props);
  }
}
