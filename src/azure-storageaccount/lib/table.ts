import { Construct } from 'constructs';
import { StorageTable, StorageTableConfig } from '@cdktf/provider-azurerm/lib/storage-table';

export class Table extends Construct {
    public readonly name: string;


    constructor(scope: Construct, id: string, props: StorageTableConfig) {
        super(scope, id);

        // Create a storage container
        const table = new StorageTable(this, 'table', {
            name: props.name,
            storageAccountName: props.storageAccountName,
            acl: props.acl,
        });

        this.name = table.name;
    }

}
