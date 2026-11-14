/**
 * Azure Blob Storage Asset
 *
 * Tthis provides automatic upload of local files or directories to
 * Azure Blob Storage for use in Function Apps and other Azure services.
 */

import * as fs from "fs";
import * as path from "path";
import { AssetPackaging } from "cdktn";
import { Construct } from "constructs";
import { AssetHashType, AssetStaging } from "./assets";
import { Resource } from "./azapi/providers-azapi/resource";
import { IAssetBundler } from "./bundling";
import { prepareScratchDir, scratchAssetPath } from "./scratch-staging";
import {
  uploadBlobWithCli,
  BlobUploadResult,
} from "../../util/azure-blob-upload";

/**
 * Options for Azure Blob Storage assets
 */
export interface BlobAssetOptions {
  /**
   * The name of the storage account container to upload the asset to.
   * If not specified, the stack's asset container will be used.
   *
   * @default - Use stack's default asset container
   */
  readonly containerName?: string;

  /**
   * The prefix to use for the blob name in storage.
   *
   * @default - No prefix, blob name will be based on asset hash
   */
  readonly blobPrefix?: string;

  /**
   * Whether or not the asset needs to exist beyond deployment time.
   * Setting this to true indicates the asset is copied elsewhere and
   * can be deleted after deployment succeeds (e.g., Function App packages).
   *
   * @default false
   */
  readonly deployTime?: boolean;

  /**
   * File paths matching these patterns will be excluded.
   *
   * @default - nothing is excluded
   */
  readonly exclude?: string[];

  /**
   * Extra information to encode into the fingerprint.
   *
   * @default - no extra data
   */
  readonly extraHash?: string;

  /**
   * A bundler that builds the source into an artifact before staging, e.g. a
   * `DockerBundler` from `@cdktn/bundler-docker` or a `LocalBundler` from
   * `@cdktn/bundler-local`.
   *
   * @default - uploaded as-is
   */
  readonly bundler?: IAssetBundler;

  /**
   * Specify a custom hash for this asset.
   *
   * @default - based on asset content
   */
  readonly assetHash?: string;

  /**
   * Specifies the type of hash to calculate for this asset.
   *
   * @default - AssetHashType.SOURCE
   */
  readonly assetHashType?: AssetHashType;
}

/**
 * Properties for Azure Blob Storage assets
 */
export interface BlobAssetProps extends BlobAssetOptions {
  /**
   * The disk location of the asset.
   *
   * The path should refer to one of the following:
   * - A regular file or a .zip file, which will be uploaded as-is to Blob Storage
   * - A directory, which will be archived into a .zip file and uploaded to Blob Storage
   */
  readonly path: string;

  /**
   * The storage account to upload the asset to.
   * This should be a reference to an Azure Storage Account construct or ID.
   */
  readonly storageAccountId: string;

  /**
   * The storage account name for blob URL generation.
   */
  readonly storageAccountName: string;

  /**
   * Whether to automatically create the storage container if it doesn't exist.
   *
   * @default true
   */
  readonly createContainer?: boolean;

  /**
   * Whether to automatically upload the asset to blob storage using Azure CLI.
   * When true, attempts to upload the file during synthesis using Azure CLI.
   *
   * Requirements:
   * - Azure CLI must be installed
   * - Must be logged in (az login)
   *
   * If Azure CLI is not available, the upload is skipped with a warning.
   * The blob URL is still generated and can be used with manual upload.
   *
   * @default false
   */
  readonly autoUpload?: boolean;

  /**
   * Whether to suppress output during upload
   * @default false
   */
  readonly silent?: boolean;
}

/**
 * An asset that represents a local file or directory that is automatically
 * uploaded to Azure Blob Storage and can be referenced within constructs.
 *
 * This is similar to AWS S3 Assets and follows the same pattern:
 * 1. Local files/directories are staged using AssetStaging
 * 2. They are uploaded to Azure Blob Storage during deployment
 * 3. The blob URL can be used to reference the asset (e.g., WEBSITE_RUN_FROM_PACKAGE)
 *
 * @example
 * const asset = new BlobAsset(this, 'FunctionCode', {
 *   path: './function-code',
 *   storageAccountId: storageAccount.id,
 *   storageAccountName: 'mystorageaccount',
 *   containerName: 'function-packages',
 * });
 *
 * // Use in Function App
 * const functionApp = new FunctionApp(this, 'Function', {
 *   // ... other props
 *   siteConfig: {
 *     appSettings: [
 *       {
 *         name: 'WEBSITE_RUN_FROM_PACKAGE',
 *         value: asset.blobUrl,
 *       },
 *     ],
 *   },
 * });
 */
export class BlobAsset extends Construct {
  /**
   * The name of the container this asset will be uploaded to
   */
  public readonly containerName: string;

  /**
   * The blob name (object key) of this asset in Blob Storage
   */
  public readonly blobName: string;

  /**
   * The full HTTPS URL to the blob.
   * Format: https://{storage-account}.blob.core.windows.net/{container}/{blob}
   */
  public readonly blobUrl: string;

  /**
   * The absolute path to the staged asset file
   */
  public readonly assetPath: string;

  /**
   * A cryptographic hash of the asset
   */
  public readonly assetHash: string;

  /**
   * The storage account ID
   */
  public readonly storageAccountId: string;

  /**
   * The storage account name
   */
  public readonly storageAccountName: string;

  /**
   * Indicates if this asset is a single file
   */
  public readonly isFile: boolean;

  /**
   * Indicates if this asset is a zip archive
   */
  public readonly isZipArchive: boolean;

  /**
   * The storage container resource (if automatically created)
   */
  public readonly container?: Resource;

  /**
   * The blob resource (if automatically uploaded)
   */
  private _blob?: Resource;
  public get blob(): Resource | undefined {
    return this._blob;
  }

  /**
   * The AssetStaging construct that hashes the source and, once staged,
   * builds (via `bundler`) and packages its content.
   */
  private readonly staging: AssetStaging;

  /**
   * The result of the upload operation (if autoUpload was enabled)
   */
  private _uploadResult?: BlobUploadResult;

  constructor(scope: Construct, id: string, props: BlobAssetProps) {
    super(scope, id);

    if (!props.path) {
      throw new Error("Asset path cannot be empty");
    }

    if (!props.storageAccountId) {
      throw new Error("Storage account ID is required");
    }

    if (!props.storageAccountName) {
      throw new Error("Storage account name is required");
    }

    this.storageAccountId = props.storageAccountId;
    this.storageAccountName = props.storageAccountName;

    const resolvedPath = path.resolve(props.path);

    // A bundler that declares a file output stages as a file. Otherwise,
    // this zips a directory source into one blob, and uploads a file
    // source as-is.
    const producesFile =
      !!props.bundler?.outputFileName || fs.statSync(resolvedPath).isFile();
    this.isFile = producesFile;
    this.isZipArchive = !producesFile;

    // This hashes the source. Under OUTPUT hashing, it also builds the
    // artifact eagerly here. The actual package only happens once
    // `stage()` runs below.
    this.staging = new AssetStaging(this, "Stage", {
      sourcePath: resolvedPath,
      packaging: producesFile ? AssetPackaging.FILE : AssetPackaging.ZIP,
      exclude: props.exclude,
      bundler: props.bundler,
      assetHash: props.assetHash,
      assetHashType: props.assetHashType,
      extraHash: props.extraHash,
      displayName: id,
    });
    this.assetHash = this.staging.assetHash;
    // This is the path the asset would be staged to, namespaced by its
    // hash. No file exists here yet; `uploadStagedAsset` defers that step.
    // Unless the caller uploads the asset, a `BlobAsset` with a
    // `SOURCE`-hashed bundler creates no scratch directory and runs no
    // bundler.
    this.assetPath = scratchAssetPath(
      "cdktn-blob-asset",
      this.assetHash,
      producesFile ? path.basename(resolvedPath) : "archive.zip",
    );

    this.containerName = props.containerName ?? "function-packages";

    const prefix = props.blobPrefix ? `${props.blobPrefix}/` : "";
    const extension = this.isZipArchive ? ".zip" : "";
    this.blobName = `${prefix}asset.${this.assetHash}${extension}`;

    // Format: https://{storage-account}.blob.core.windows.net/{container}/{blob}
    this.blobUrl = `https://${this.storageAccountName}.blob.core.windows.net/${this.containerName}/${this.blobName}`;

    const shouldCreateContainer = props.createContainer !== false;
    if (shouldCreateContainer) {
      this.container = this.createContainer(props);
    }

    if (props.autoUpload) {
      this.uploadStagedAsset(props.silent ?? false);
    }
  }

  /**
   * Creates the storage container for the blob
   */
  private createContainer(props: BlobAssetProps): Resource {
    // Format: {storageAccountId}/blobServices/default/containers/{containerName}
    return new Resource(this, "Container", {
      type: "Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01",
      name: this.containerName,
      parentId: `${props.storageAccountId}/blobServices/default`,
      body: {
        properties: {
          publicAccess: "None",
          metadata: {
            "managed-by": "cdktn-blob-asset",
            "asset-hash": this.assetHash,
          },
        },
      },
      // Ignore missing property to avoid errors if container exists
      ignoreMissingProperty: true,
    });
  }

  /**
   * Builds the asset, if a bundler is configured, packages it, then
   * uploads it to blob storage using Azure CLI.
   *
   * Staging happens here, not unconditionally at construction time. A
   * `BlobAsset` with a `SOURCE`-hashed bundler never triggers a build (e.g.
   * a Docker run) unless the asset is actually uploaded. This does not
   * apply to `AssetHashType.OUTPUT`: cdktn's `AssetStaging` always builds
   * eagerly, in its own constructor, regardless of `autoUpload`.
   *
   * A build/staging failure degrades the same way an upload failure does:
   * it logs (unless `silent`) and records the result on `uploadResult`,
   * without throwing. This keeps a transient Docker/CLI/network issue from
   * aborting the rest of synthesis.
   */
  private uploadStagedAsset(silent: boolean): void {
    try {
      prepareScratchDir(this.assetPath);
      this.staging.stage(this.assetPath);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this._uploadResult = { success: false, error: errorMessage };
      if (!silent) {
        console.error(
          `[BlobAsset] Failed to build/stage asset for upload: ${errorMessage}`,
        );
      }
      return;
    }

    if (!silent) {
      console.log(
        `[BlobAsset] Attempting to upload ${this.blobName} to Azure Blob Storage...`,
      );
    }

    this._uploadResult = uploadBlobWithCli({
      storageAccountName: this.storageAccountName,
      containerName: this.containerName,
      blobName: this.blobName,
      filePath: this.assetPath,
      overwrite: true,
      authMode: "login",
      silent,
    });

    if (this._uploadResult.success) {
      if (!silent) {
        console.log(
          `[BlobAsset] Successfully uploaded to: ${this._uploadResult.blobUrl}`,
        );
      }
    } else if (this._uploadResult.skipped) {
      if (!silent) {
        console.warn(`[BlobAsset] Upload skipped: ${this._uploadResult.error}`);
        console.warn(
          `[BlobAsset] You can upload manually using: az storage blob upload --account-name ${this.storageAccountName} --container-name ${this.containerName} --name ${this.blobName} --file ${this.assetPath} --auth-mode login --overwrite`,
        );
      }
    } else {
      if (!silent) {
        console.error(`[BlobAsset] Upload failed: ${this._uploadResult.error}`);
        console.error(
          `[BlobAsset] You can upload manually using: az storage blob upload --account-name ${this.storageAccountName} --container-name ${this.containerName} --name ${this.blobName} --file ${this.assetPath} --auth-mode login --overwrite`,
        );
      }
    }
  }

  /**
   * Returns a blob URL with a SAS token appended.
   * The SAS token must be provided externally (e.g., from a data source or output).
   *
   * @param sasToken The SAS token (should start with '?')
   * @returns The blob URL with SAS token
   */
  public getBlobUrlWithSas(sasToken: string): string {
    const separator = sasToken.startsWith("?") ? "" : "?";
    return `${this.blobUrl}${separator}${sasToken}`;
  }

  /**
   * Gets the blob URL for use with managed identity authentication.
   * This is the same as blobUrl but makes the intent clear.
   *
   * When using this with WEBSITE_RUN_FROM_PACKAGE, ensure you also configure:
   * - The Function App's managed identity
   * - RBAC role assignment (Storage Blob Data Reader)
   * - Optional: WEBSITE_RUN_FROM_PACKAGE_BLOB_MI_RESOURCE_ID for user-assigned identity
   */
  public get blobUrlForManagedIdentity(): string {
    return this.blobUrl;
  }
}
