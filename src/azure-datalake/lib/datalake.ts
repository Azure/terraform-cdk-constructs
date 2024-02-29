import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { StorageDataLakeGen2FilesystemConfig } from "@cdktf/provider-azurerm/lib/storage-data-lake-gen2-filesystem";
import { Construct } from "constructs";
import { DataLakeFilesystem, DataLakeFilesystemConfig } from "./filesystem";
import * as sa from "../../azure-storageaccount";
import { AzureResource } from "../../core-azure";

export class DataLake extends AzureResource {
  readonly props: any;
  public resourceGroupName: string;
  public resourceGroup: ResourceGroup;
  public readonly filesystems: Map<string, DataLakeFilesystem>;

  public readonly storageAccount: sa.Account;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);
    this.filesystems = new Map<string, DataLakeFilesystem>();
    // Default values
    this.props = {
      name: "test42348808",
      location: "eastus",
      ...props,
    };

    this.resourceGroup = this.setupResourceGroup(props);
    this.resourceGroupName = this.resourceGroup.name;

    this.storageAccount = new sa.Account(scope, id + "storageAccount", {
      ...this.props,
      accountTier: "Standard",
      accountKind: "StorageV2",
      isHnsEnabled: true,
      resourceGroup: this.resourceGroup,
    });
  }

  public addDataLakeFilesystem(
    name: string,
    props: DataLakeFilesystemConfig,
  ): DataLakeFilesystem {
    if (this.filesystems.has(name)) {
      throw new Error(`Filesystem '${name}' already exists.`);
    }

    var config: StorageDataLakeGen2FilesystemConfig = {
      name: name,
      storageAccountId: this.storageAccount.id,
      ...props,
    };

    const newFilesystem = new DataLakeFilesystem(this, name, config);

    this.filesystems.set(name, newFilesystem);
    return newFilesystem;
  }
}
