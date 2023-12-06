import { Construct } from 'constructs';
import { StorageContainer, StorageContainerConfig } from '@cdktf/provider-azurerm/lib/storage-container';
import { StorageBlob, StorageBlobConfig } from '@cdktf/provider-azurerm/lib/storage-blob';

export class AzureStorageContainer extends Construct {
    public readonly name: string;
    private readonly blobs: Map<string, AzureStorageBlob>;
    private readonly storageAccountName: string;
    private readonly storageContainerName: string;


    constructor(scope: Construct, id: string, props: StorageContainerConfig) {
        super(scope, id);

        this.blobs = new Map<string, AzureStorageBlob>();
        
        // Create a storage container
        const container = new StorageContainer(this, 'container', {
            name: props.name,
            storageAccountName: props.storageAccountName,
            containerAccessType: props.containerAccessType,
            metadata: props.metadata,
        });

        this.name = props.name;
        this.storageAccountName = props.storageAccountName;
        this.storageContainerName = container.name;
    }

    addBlob(blobName: string, filePath: string, props?: StorageBlobConfig): AzureStorageBlob {
        const newStorageBlob = new AzureStorageBlob(this, blobName, {
            name: blobName,
            storageAccountName: this.storageAccountName,
            storageContainerName: this.storageContainerName,
            type: props?.type || 'Block',
            source: filePath,
            contentType: props?.contentType || 'application/octet-stream',
            metadata: props?.metadata || {},
        });
        this.blobs.set(blobName, newStorageBlob);
        return newStorageBlob;
    }
}

export class AzureStorageBlob extends Construct {
    readonly name: string;

    constructor(scope: Construct, id: string, props: StorageBlobConfig) {
        super(scope, id);
        
        // Create a storage container
        new StorageBlob(this, 'blob', {
            name: props.name,
            storageAccountName: props.storageAccountName,
            storageContainerName: props.storageContainerName,
            type: props.type,
            source: props.source,
            contentType: props.contentType,
            metadata: props.metadata,
        });

        this.name = props.name;
    }
}