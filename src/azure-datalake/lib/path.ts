import {
  StorageDataLakeGen2Path,
  StorageDataLakeGen2PathConfig,
} from "@cdktf/provider-azurerm/lib/storage-data-lake-gen2-path";
import { Construct } from "constructs";

export class DataLakePath extends Construct {
  public readonly name: string;
  public readonly filesystem: StorageDataLakeGen2Path;

  constructor(
    scope: Construct,
    id: string,
    props: StorageDataLakeGen2PathConfig,
  ) {
    super(scope, id);
    this.filesystem = new StorageDataLakeGen2Path(this, "path", props);
  }
}
