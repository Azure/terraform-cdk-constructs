/**
 * Azure Blob Storage Upload Utilities
 *
 * Provides helper functions for uploading files to Azure Blob Storage
 * using the Azure CLI, following the pattern from azureTenantIdHelpers.ts
 */

import { execSync } from "child_process";
import * as fs from "fs";

/**
 * Options for blob upload
 */
export interface BlobUploadOptions {
  /**
   * Storage account name
   */
  readonly storageAccountName: string;

  /**
   * Container name
   */
  readonly containerName: string;

  /**
   * Blob name (path within container)
   */
  readonly blobName: string;

  /**
   * Local file path to upload
   */
  readonly filePath: string;

  /**
   * Whether to overwrite existing blob
   * @default true
   */
  readonly overwrite?: boolean;

  /**
   * Authentication mode (login, key)
   * @default 'login'
   */
  readonly authMode?: "login" | "key";

  /**
   * Whether to suppress output
   * @default true
   */
  readonly silent?: boolean;
}

/**
 * Result of blob upload operation
 */
export interface BlobUploadResult {
  /**
   * Whether the upload was successful
   */
  readonly success: boolean;

  /**
   * The blob URL if successful
   */
  readonly blobUrl?: string;

  /**
   * Error message if failed
   */
  readonly error?: string;

  /**
   * Whether upload was skipped (e.g., Azure CLI not available)
   */
  readonly skipped?: boolean;
}

/**
 * Check if Azure CLI is installed and available
 *
 * @returns true if Azure CLI is available
 */
export function isAzureCliAvailable(): boolean {
  try {
    execSync("az --version", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if logged into Azure CLI
 *
 * @returns true if logged in
 */
export function isAzureCliLoggedIn(): boolean {
  try {
    execSync("az account show", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Create a storage container if it doesn't exist
 *
 * @param storageAccountName Storage account name
 * @param containerName Container name
 * @param authMode Authentication mode
 * @returns true if container exists or was created
 */
export function ensureContainerExists(
  storageAccountName: string,
  containerName: string,
  authMode: "login" | "key" = "login",
): boolean {
  try {
    const cmd = `az storage container create --name ${containerName} --account-name ${storageAccountName} --auth-mode ${authMode} --only-show-errors`;
    execSync(cmd, { stdio: "pipe" });
    return true;
  } catch (error) {
    // Container might already exist, which is fine
    // Azure CLI returns non-zero exit code if container exists
    return true;
  }
}

/**
 * Upload a file to Azure Blob Storage using Azure CLI
 *
 * This function uses the Azure CLI to upload a file to blob storage.
 * If Azure CLI is not installed or not logged in, the upload is skipped
 * with a warning message.
 *
 * @param options Upload options
 * @returns Upload result
 *
 * @example
 * const result = uploadBlobWithCli({
 *   storageAccountName: 'mystorageaccount',
 *   containerName: 'function-packages',
 *   blobName: 'asset.abc123.zip',
 *   filePath: '/path/to/local/file.zip',
 * });
 *
 * if (result.success) {
 *   console.log(`Uploaded to: ${result.blobUrl}`);
 * } else if (result.skipped) {
 *   console.log('Upload skipped: Azure CLI not available');
 * } else {
 *   console.error(`Upload failed: ${result.error}`);
 * }
 */
export function uploadBlobWithCli(
  options: BlobUploadOptions,
): BlobUploadResult {
  const {
    storageAccountName,
    containerName,
    blobName,
    filePath,
    overwrite = true,
    authMode = "login",
    silent = true,
  } = options;

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      error: `File not found: ${filePath}`,
    };
  }

  // Check if Azure CLI is available
  if (!isAzureCliAvailable()) {
    if (!silent) {
      console.warn(
        "Azure CLI is not installed. Skipping blob upload. " +
          "Please install Azure CLI to enable automatic uploads: " +
          "https://docs.microsoft.com/en-us/cli/azure/install-azure-cli",
      );
    }
    return {
      success: false,
      skipped: true,
      error: "Azure CLI not installed",
    };
  }

  // Check if logged in
  if (authMode === "login" && !isAzureCliLoggedIn()) {
    if (!silent) {
      console.warn(
        "Not logged in to Azure CLI. Skipping blob upload. " +
          "Please run 'az login' to enable automatic uploads.",
      );
    }
    return {
      success: false,
      skipped: true,
      error: "Not logged in to Azure CLI",
    };
  }

  try {
    // Ensure container exists
    ensureContainerExists(storageAccountName, containerName, authMode);

    // Build upload command
    const overwriteFlag = overwrite ? "--overwrite" : "";
    const silentFlag = silent ? "--only-show-errors" : "";
    const cmd = `az storage blob upload --account-name ${storageAccountName} --container-name ${containerName} --name ${blobName} --file "${filePath}" --auth-mode ${authMode} ${overwriteFlag} ${silentFlag}`;

    // Execute upload
    execSync(cmd, {
      stdio: silent ? "pipe" : "inherit",
      encoding: "utf-8",
    });

    // Generate blob URL
    const blobUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}`;

    if (!silent) {
      console.log(`Successfully uploaded blob to: ${blobUrl}`);
    }

    return {
      success: true,
      blobUrl,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!silent) {
      console.error(`Failed to upload blob: ${errorMessage}`);
    }
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Delete a blob from Azure Blob Storage using Azure CLI
 *
 * @param storageAccountName Storage account name
 * @param containerName Container name
 * @param blobName Blob name
 * @param authMode Authentication mode
 * @returns true if deleted or didn't exist
 */
export function deleteBlobWithCli(
  storageAccountName: string,
  containerName: string,
  blobName: string,
  authMode: "login" | "key" = "login",
): boolean {
  try {
    const cmd = `az storage blob delete --account-name ${storageAccountName} --container-name ${containerName} --name ${blobName} --auth-mode ${authMode} --only-show-errors`;
    execSync(cmd, { stdio: "pipe" });
    return true;
  } catch (error) {
    // Blob might not exist, which is fine
    return true;
  }
}

/**
 * Check if a blob exists in Azure Blob Storage
 *
 * @param storageAccountName Storage account name
 * @param containerName Container name
 * @param blobName Blob name
 * @param authMode Authentication mode
 * @returns true if blob exists
 */
export function blobExists(
  storageAccountName: string,
  containerName: string,
  blobName: string,
  authMode: "login" | "key" = "login",
): boolean {
  try {
    const cmd = `az storage blob exists --account-name ${storageAccountName} --container-name ${containerName} --name ${blobName} --auth-mode ${authMode} -o tsv --query exists`;
    const result = execSync(cmd, { encoding: "utf-8", stdio: "pipe" })
      .toString()
      .trim();
    return result === "True" || result === "true";
  } catch (error) {
    return false;
  }
}
