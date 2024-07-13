import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { StorageDataLakeGen2FilesystemConfig } from "@cdktf/provider-azurerm/lib/storage-data-lake-gen2-filesystem";
import { Construct } from "constructs";
import { DataLakeFilesystem, DataLakeFilesystemConfig } from "./filesystem";
import * as sa from "../../azure-storageaccount";
import { AzureResource } from "../../core-azure";

export class DataLake extends AzureResource {
  readonly props: any;
  public resourceGroupName: string;
  public id: string;
  public resourceGroup: ResourceGroup;
  public readonly filesystems: Map<string, DataLakeFilesystem>;

  public readonly storageAccount: sa.Account;
  /**
   * Represents an Azure Data Lake storage account, managing the storage and retrieval of data in a scalable, secure manner.
   *
   * This class encapsulates the properties and functionality of an Azure Data Lake, which is built on top of Azure Blob storage
   * with enhanced capabilities to handle big data analytics efficiently. The Data Lake enables batch and real-time data processing
   * and collaboration for analytics purposes. It provides a centralized place to store structured or unstructured data from multiple
   * sources so that it can be processed and analyzed.
   *
   * Properties:
   * - `accountReplicationType`: Specifies the type of data replication for durability and availability. Options include locally redundant storage (LRS),
   *   geo-redundant storage (GRS), and read-access geo-redundant storage (RAGRS).
   * - `accountTier`: Defines the performance tier (e.g., Standard, Premium) that affects the type of hardware used for the storage account.
   * - `location`: The Azure region where the storage account is located, influencing where data is stored geographically.
   * - `name`: A unique name for the storage account within Azure.
   * - `resourceGroup`: The resource group under which the storage account is categorized and billed.
   * - `tags`: Key-value pairs for resource categorization and operational management.
   * - `enableHttpsTrafficOnly`: Enforces HTTPS for data transfer, enhancing security by encrypting data in transit.
   * - `identity`: Managed Service Identity configuration for Azure Active Directory authentication management.
   * - `accessTier`: Specifies the data access tier (Hot, Cool) affecting cost and retrieval speeds.
   * - `isHnsEnabled`: Indicates if the Hierarchical Namespace is enabled, required for Azure Data Lake Storage Gen2.
   * - `minTlsVersion`: The minimum version of TLS required for securing connections, enhancing data security.
   * - `publicNetworkAccessEnabled`: Controls whether the storage account is accessible from the public internet.
   * - `accountKind`: Specifies the kind of storage account, which can influence supported features and pricing.
   *
   * @param scope - The scope in which this construct is defined, typically representing the cloud development kit (CDK) stack.
   * @param id - The unique identifier for this construct.
   * @param props - Properties for configuring the Data Lake, including location, name, security settings, etc.
   */
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

    this.id = this.storageAccount.id;
  }
  /**
   * Creates a new Data Lake Gen2 filesystem within the specified storage account.
   *
   * This method initializes a new filesystem in Azure Data Lake Storage Gen2, allowing for the storage of hierarchical data structures.
   * Each filesystem can contain multiple directories and files, organized in a hierarchical manner. This method ensures that the filesystem
   * name is unique within the storage account to prevent naming conflicts.
   *
   * @param name - The name of the new filesystem to create. This name must be unique within the storage account.
   * @param props - Configuration properties for the new filesystem, including metadata, encryption settings, and more.
   * @returns The newly created DataLakeFilesystem instance.
   * @throws Error if a filesystem with the same name already exists in the storage account.
   *
   * Example usage:
   * ```typescript
   * const filesystemConfig = {
   *   properties: { property1: 'value1' },  // Example properties
   *   defaultEncryptionScope: 'myEncryptionScope'
   * };
   * const newFilesystem = storageAccount.addDataLakeFilesystem('myNewFilesystem', filesystemConfig);
   * ```
   * This example creates a new filesystem named 'myNewFilesystem' with specified properties and encryption scope.
   */
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
