/**
 * Azure Storage Account module
 *
 * Provides unified, version-aware Azure Storage Account constructs using
 * the VersionedAzapiResource framework. This module automatically handles
 * API version management, schema validation, and property transformation.
 *
 * @example
 * ```typescript
 * import { StorageAccount } from '@cdktf/tf-constructs-azure/azure-storageaccount';
 *
 * const storage = new StorageAccount(this, 'storage', {
 *   name: 'mystorageaccount',
 *   location: 'eastus',
 *   resourceGroupId: resourceGroup.id,
 *   sku: { name: 'Standard_LRS' },
 * });
 * ```
 */

export * from "./lib";
