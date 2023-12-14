import { Construct } from 'constructs';
import { StorageContainer, StorageContainerConfig } from '@cdktf/provider-azurerm/lib/storage-container';
import { StorageBlob, StorageBlobConfig } from '@cdktf/provider-azurerm/lib/storage-blob';

export class Container extends Construct {
    public readonly name: string;
    private readonly blobs: Map<string, Blob>;
    private readonly storageAccountName: string;
    private readonly storageContainerName: string;


    constructor(scope: Construct, id: string, props: StorageContainerConfig) {
        super(scope, id);

        this.blobs = new Map<string, Blob>();
        
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

    /**
     * Adds a blob to an Azure Storage Container.
     * 
     * @param blobName The name of the blob to be added.
     * @param filePath The file path or URL for the source of the blob's content.
     * @param props Optional configuration properties for the blob, such as blob type, content type, and metadata.
     * @returns The created AzureStorageBlob instance.
     *
     * This method enables the addition of a blob to an Azure Storage Container. It allows specifying
     * the source of the blob's content, as well as other properties like the blob's type (default is 'Block'),
     * content type, and metadata. The `filePath` parameter should point to the location of the file to be
     * uploaded as a blob.
     *
     * Example usage:
     * ```typescript
     * const storageBlob = storageContainer.addBlob('exampleBlob', './path/to/local/file.txt', {
     *   type: 'Block',
     *   contentType: 'text/plain',
     *   metadata: { customKey: 'customValue' }
     * });
     * ```
     * 
     * In this example, a blob named 'exampleBlob' is added to the storage container. The content of the blob
     * is sourced from a local file. The blob is of type 'Block' with a content type of 'text/plain' and custom metadata.
     */
    addBlob(blobName: string, filePath: string, props?: StorageBlobConfig): Blob {
        const newStorageBlob = new Blob(this, blobName, {
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

export class Blob extends Construct {
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