import {
  StorageTable,
  StorageTableConfig,
} from "@cdktf/provider-azurerm/lib/storage-table";
import { Construct } from "constructs";

export class Table extends Construct {
  public readonly name: string;
  /**
   * Represents an Azure Storage Table within a specific Azure Storage Account.
   *
   * This class is responsible for the creation and management of an Azure Storage Table, which provides a NoSQL key-attribute data store
   * that can massively scale. It is suitable for storing structured, non-relational data, allowing rapid development and fast access to large
   * quantities of data. The class facilitates creating and configuring storage tables including setting up access control lists (ACLs).
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the table.
   * @param props - Configuration properties for the Azure Storage Table. These properties include:
   *                - `name`: The name of the table, which must be unique within the storage account.
   *                - `storageAccountName`: The name of the storage account in which this table is being created.
   *                - `acl`: An optional list of access control entries that define permissions for accessing the table.
   *                - `timeouts`: Optional timeout settings for create/read/update/delete operations on the table.
   *
   * Example usage:
   * ```typescript
   * const storageTable = new Table(this, 'MyTable', {
   *   name: 'tasktable',
   *   storageAccountName: 'mystorageaccount',
   *   acl: [{
   *     id: 'myacl',
   *     permissions: 'rwdl',
   *     start: '2020-01-01T01:00:00Z',
   *     expiry: '2030-01-01T01:00:00Z',
   *     policy: 'mypolicy'
   *   }]
   * });
   * ```
   * This class initializes a storage table with the specified configurations and provides an interface to manage access controls and
   * other properties. It is ideal for applications that require structured, scalable, and fast access to data.
   */
  constructor(scope: Construct, id: string, props: StorageTableConfig) {
    super(scope, id);

    // Create a storage container
    const table = new StorageTable(this, "table", {
      name: props.name,
      storageAccountName: props.storageAccountName,
      acl: props.acl,
    });

    this.name = table.name;
  }
}
