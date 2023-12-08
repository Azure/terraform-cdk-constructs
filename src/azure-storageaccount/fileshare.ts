import { StorageShare, StorageShareConfig } from "@cdktf/provider-azurerm/lib/storage-share";
import { Construct } from 'constructs';
import { StorageShareFile, StorageShareFileConfig } from "@cdktf/provider-azurerm/lib/storage-share-file";

export interface AzureStorageShareProps {
    /**
     * The maximum size of the storage share, in gigabytes.
     */
    readonly quota?: number;

    /**
     * The access tier of the storage share. This property is only applicable to storage shares with a premium account type.
     * Example values: Hot, Cool.
     */
    readonly accessTier?: string;

    /**
     * The protocol to use when accessing the storage share.
     * Example values: SMB, NFS.
     */
    readonly enabledProtocol?: string;

    /**
     * A list of access control rules for the storage share.
     */
    readonly acl?: any; // Replace 'any' with a more specific type if available.

    /**
     * A mapping of tags to assign to the storage share.
     * Format: { [key: string]: string }
     */
    readonly metadata?: { readonly [key: string]: string };
}

export class AzureStorageShare extends Construct {
    public readonly name: string;
    public readonly id: string;
    private readonly files: Map<string, AzureStorageShareFile>;
    public readonly storageAccountName: string;
    public readonly storageShareName: string;

    constructor(scope: Construct, id: string, props: StorageShareConfig) {
        super(scope, id);

        this.files = new Map<string, AzureStorageShareFile>();
    
        const share = new StorageShare(this, "share", { 
            name: props.name,
            storageAccountName: props.storageAccountName,
            quota: props.quota,
            accessTier: props.accessTier,
            enabledProtocol: props.enabledProtocol,
            acl: props.acl,
            metadata: props.metadata,
        });

        this.name = share.name;
        this.storageAccountName = share.storageAccountName;
        this.storageShareName = share.name
        this.id = share.id;
    
    }

    /**
     * Adds a file to the Azure Storage File Share.
     * 
     * @param fileName The name of the file to be added.
     * @param fileSource Optional path or URL to the source of the file's content.
     * @param props Optional configuration properties for the file, such as content type, encoding, and metadata.
     * @returns The created AzureStorageShareFile instance.
     *
     * This method allows you to add a file to your Azure Storage File Share, optionally specifying
     * the file's content source and other properties like content type, encoding, and metadata.
     * If `fileSource` is provided, the content of the file is sourced from this location.
     * The `props` parameter allows for further customization of the file, such as setting the content type
     * (default is 'application/octet-stream') and adding metadata.
     *
     * Example usage:
     * ```typescript
     * const storageShareFile = storageShare.addFile('example.txt', './path/to/local/file.txt', {
     *   contentType: 'text/plain',
     *   metadata: { customKey: 'customValue' }
     * });
     * ```
     * 
     * In this example, a text file named 'example.txt' is added to the storage share. The content of the file
     * is sourced from a local file, and the content type is specified as 'text/plain' with custom metadata.
     */
    addFile(fileName: string, fileSource?: string, props?: StorageShareFileConfig): AzureStorageShareFile {
        const newStorageFile = new AzureStorageShareFile(this, "file", {
            name: fileName,
            storageShareId: this.id,
            contentDisposition: props?.contentDisposition,
            contentEncoding: props?.contentEncoding,
            contentMd5: props?.contentMd5,
            source: fileSource,
            contentType: props?.contentType || 'application/octet-stream',
            metadata: props?.metadata || {},
        });
        this.files.set(fileName, newStorageFile);
        return newStorageFile;
    }
}

export class AzureStorageShareFile extends Construct {
    public readonly name: string;
    public readonly id: string;

    constructor(scope: Construct, id: string, props: StorageShareFileConfig) {
        super(scope, id);

        const file = new StorageShareFile(this, 'file', {
            name: props.name,
            storageShareId: props.storageShareId,
            source: props.source,
            contentType: props.contentType,
            contentEncoding: props.contentEncoding,
            contentDisposition: props.contentDisposition,
            contentMd5: props.contentMd5,
            metadata: props.metadata,
        });

        this.name = props.name;
        this.id = file.id
    }

}
