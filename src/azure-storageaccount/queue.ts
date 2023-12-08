import { Construct } from 'constructs';
import { StorageQueue, StorageQueueConfig } from '@cdktf/provider-azurerm/lib/storage-queue';

export class AzureStorageQueue extends Construct {
    public readonly name: string;


    constructor(scope: Construct, id: string, props: StorageQueueConfig) {
        super(scope, id);

        // Create a storage container
        const Queue = new StorageQueue(this, 'Queue', {
            name: props.name,
            storageAccountName: props.storageAccountName,
            metadata: props.metadata,
        });

        this.name = Queue.name;
    }

}
