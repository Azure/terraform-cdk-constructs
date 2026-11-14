/**
 * Unified Azure Function App implementation using VersionedAzapiResource framework
 *
 * This class provides a single, version-aware implementation for Azure Function App
 * that automatically handles version management, schema validation, and property transformation
 * across all supported API versions.
 *
 * Supported API Versions:
 * - 2024-04-01 (Maintenance)
 * - 2024-11-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - JSII compliance for multi-language support
 * - Asset pipeline support for function code deployment with Docker bundling
 */

import * as fs from "fs";
import * as path from "path";
import * as cdktn from "cdktn";
import { AssetPackaging } from "cdktn";
import { Construct } from "constructs";
import {
  ALL_FUNCTION_APP_VERSIONS,
  FUNCTION_APP_TYPE,
} from "./function-app-schemas";
import { AssetStaging } from "../../core-azure/lib/assets";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { BlobAsset, BlobAssetOptions } from "../../core-azure/lib/blob-asset";
import {
  BundlingFileAccess,
  DockerBundler,
  IAssetBundler,
} from "../../core-azure/lib/bundling";
import {
  prepareScratchDir,
  scratchAssetPath,
} from "../../core-azure/lib/scratch-staging";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Resolves the two (mutually exclusive) ways of configuring a build step
 * into the `IAssetBundler` the asset pipeline actually uses.
 */
function resolveBundler(
  bundling: FunctionAssetBundlingOptions | undefined,
  bundler: IAssetBundler | undefined,
): IAssetBundler | undefined {
  if (bundling && bundler) {
    throw new Error(
      "Specify either 'bundling' or 'bundler', not both; 'bundling' builds a DockerBundler for you.",
    );
  }
  if (!bundling) {
    return bundler;
  }
  return new DockerBundler({
    image: bundling.image,
    command: bundling.command,
    environment: bundling.environment,
    workingDirectory: bundling.workingDirectory,
    user: bundling.user,
    entrypoint: bundling.entrypoint,
    network: bundling.network,
    securityOpt: bundling.securityOpt,
    platform: bundling.platform,
    bundlingFileAccess: bundling.bundlingFileAccess,
    outputFileName: bundling.outputFileName,
  });
}

/**
 * App setting for Function App configuration
 */
export interface FunctionAppSetting {
  /**
   * The name of the application setting
   */
  readonly name: string;

  /**
   * The value of the application setting
   */
  readonly value: string;
}

/**
 * Site configuration for Function App
 */
export interface FunctionAppSiteConfig {
  /**
   * Application settings for the Function App
   */
  readonly appSettings?: FunctionAppSetting[];

  /**
   * The runtime stack (e.g., "node", "dotnet", "python", "java")
   */
  readonly linuxFxVersion?: string;

  /**
   * Whether Always On is enabled
   * @default false
   */
  readonly alwaysOn?: boolean;

  /**
   * The minimum TLS version
   * @default "1.2"
   */
  readonly minTlsVersion?: string;

  /**
   * Whether HTTP 2.0 is enabled
   * @default false
   */
  readonly http20Enabled?: boolean;

  /**
   * The .NET Framework version
   */
  readonly netFrameworkVersion?: string;

  /**
   * CORS configuration
   */
  readonly cors?: FunctionAppCorsSettings;

  /**
   * Whether FTP state is allowed
   * @default "Disabled"
   */
  readonly ftpsState?: string;

  /**
   * Whether use 32-bit worker process
   * @default false
   */
  readonly use32BitWorkerProcess?: boolean;
}

/**
 * CORS settings for Function App
 */
export interface FunctionAppCorsSettings {
  /**
   * Allowed origins
   */
  readonly allowedOrigins?: string[];

  /**
   * Whether credentials are supported
   * @default false
   */
  readonly supportCredentials?: boolean;
}

/**
 * Identity configuration for Function App
 */
export interface FunctionAppIdentity {
  /**
   * The type of identity (SystemAssigned, UserAssigned, SystemAssigned,UserAssigned)
   */
  readonly type: string;

  /**
   * User assigned identity IDs
   */
  readonly userAssignedIdentities?: { [key: string]: any };
}

/**
 * Storage authentication configuration for Flex Consumption deployment
 */
export interface FunctionAppStorageAuthentication {
  /**
   * The authentication type (SystemAssignedIdentity, UserAssignedIdentity, StorageAccountConnectionString)
   */
  readonly type: string;

  /**
   * User assigned identity resource ID (when type is UserAssignedIdentity)
   */
  readonly userAssignedIdentityResourceId?: string;

  /**
   * Storage account connection string setting name (when type is StorageAccountConnectionString)
   */
  readonly storageAccountConnectionStringName?: string;
}

/**
 * Deployment storage configuration for Flex Consumption plans
 */
export interface FunctionAppDeploymentStorage {
  /**
   * The storage type (blobContainer)
   */
  readonly type: string;

  /**
   * The blob container URL for deployment artifacts
   */
  readonly value: string;

  /**
   * Authentication configuration for the storage
   */
  readonly authentication: FunctionAppStorageAuthentication;
}

/**
 * Deployment configuration for Flex Consumption Function Apps
 */
export interface FunctionAppDeployment {
  /**
   * Storage configuration for deployment artifacts
   */
  readonly storage: FunctionAppDeploymentStorage;
}

/**
 * Runtime configuration for Flex Consumption Function Apps
 */
export interface FunctionAppRuntime {
  /**
   * The runtime name (node, python, dotnet-isolated, java, powershell)
   */
  readonly name: string;

  /**
   * The runtime version
   */
  readonly version: string;
}

/**
 * Scale and concurrency configuration for Flex Consumption Function Apps
 */
export interface FunctionAppScaleAndConcurrency {
  /**
   * Maximum number of instances
   * @default 100
   */
  readonly maximumInstanceCount?: number;

  /**
   * Instance memory in MB (512, 1024, 2048, 4096)
   * @default 2048
   */
  readonly instanceMemoryMB?: number;
}

/**
 * Function App configuration for Flex Consumption plans
 *
 * Required when using FlexConsumption SKU (FC1) App Service Plans.
 * Configures deployment storage, runtime, and scaling.
 */
export interface FunctionAppConfig {
  /**
   * Deployment configuration with storage for artifacts
   */
  readonly deployment: FunctionAppDeployment;

  /**
   * Runtime configuration (name and version)
   */
  readonly runtime: FunctionAppRuntime;

  /**
   * Scale and concurrency settings
   */
  readonly scaleAndConcurrency?: FunctionAppScaleAndConcurrency;
}

/**
 * Asset bundling options for function code.
 *
 * A convenience wrapper that builds a `DockerBundler` from
 * `@cdktn/bundler-docker`. For anything this does not cover (local
 * bundling, chaining bundlers, a custom `IAssetBundler`), pass a `bundler`
 * directly to `FunctionAssetOptions`/`FunctionBlobDeploymentOptions`
 * instead of `bundling`.
 */
export interface FunctionAssetBundlingOptions {
  /**
   * Docker image to use for bundling (e.g., "node:20", "python:3.11").
   *
   * Must be a registry reference; locally built images are not supported.
   */
  readonly image: string;

  /**
   * The command to run in the Docker container.
   *
   * @example ['sh', '-c', 'npm ci && cp -r . /asset-output/']
   */
  readonly command: string[];

  /**
   * Environment variables to pass to the Docker container.
   *
   * @default - no environment variables
   */
  readonly environment?: { [key: string]: string };

  /**
   * Working directory inside the Docker container.
   *
   * @default /asset-input
   */
  readonly workingDirectory?: string;

  /**
   * The user to use when running the Docker container.
   *
   * @example '1000:1000'
   * @default - the current host uid:gid
   */
  readonly user?: string;

  /**
   * The entrypoint to run in the Docker container.
   *
   * @default - run the entrypoint defined in the image
   */
  readonly entrypoint?: string[];

  /**
   * Networking mode for the Docker container.
   *
   * @default - the default docker network
   */
  readonly network?: string;

  /**
   * Security options for the container.
   *
   * @example 'no-new-privileges'
   * @default - none
   */
  readonly securityOpt?: string;

  /**
   * The platform to run the container as.
   *
   * @default - the host platform
   */
  readonly platform?: string;

  /**
   * How the source and output cross the host/container boundary.
   *
   * @default BundlingFileAccess.BIND_MOUNT
   */
  readonly bundlingFileAccess?: BundlingFileAccess;

  /**
   * The file name to stage a single-file artifact under.
   *
   * Set this only when `command` produces exactly one file (e.g. an
   * already-zipped package) rather than a directory tree.
   *
   * @default - the command's output is treated as a directory
   */
  readonly outputFileName?: string;
}

/**
 * Asset options for Function App code deployment
 */
export interface FunctionAssetOptions {
  /**
   * Path to the source code directory or file
   */
  readonly sourcePath: string;

  /**
   * Optional Docker bundling configuration for preparing the code
   * (e.g., installing dependencies, transpiling). A convenience alternative
   * to `bundler`; the two cannot be combined.
   */
  readonly bundling?: FunctionAssetBundlingOptions;

  /**
   * A bundler that builds the source into an artifact before staging, e.g. a
   * `DockerBundler` from `@cdktn/bundler-docker` or a `LocalBundler` from
   * `@cdktn/bundler-local`. A lower-level alternative to `bundling`; the two
   * cannot be combined.
   */
  readonly bundler?: IAssetBundler;

  /**
   * Files to exclude from the asset
   * @default []
   */
  readonly exclude?: string[];

  /**
   * Custom hash for cache busting
   */
  readonly assetHash?: string;
}

/**
 * Options for deploying function code via Azure Blob Storage
 */
export interface FunctionBlobDeploymentOptions extends BlobAssetOptions {
  /**
   * Optional Docker bundling configuration for preparing the code
   * (e.g., installing dependencies, transpiling). A convenience alternative
   * to `bundler`; the two cannot be combined.
   */
  readonly bundling?: FunctionAssetBundlingOptions;

  /**
   * Use managed identity for authentication instead of SAS token.
   * When true, the Function App's managed identity will be used to access the blob.
   *
   * Requires:
   * - Function App has a managed identity configured (system-assigned or user-assigned)
   * - The identity has "Storage Blob Data Reader" role on the storage account/container
   *
   * @default false
   */
  readonly useManagedIdentity?: boolean;

  /**
   * SAS token for blob access (alternative to managed identity).
   * Should start with '?' or will be prepended automatically.
   *
   * Note: When using SAS tokens, you must manage token renewal before expiration.
   *
   * @default - Required if useManagedIdentity is false
   */
  readonly sasToken?: string;

  /**
   * Resource ID of the user-assigned managed identity to use for blob access.
   * Only applicable when useManagedIdentity is true.
   *
   * Format: /subscriptions/{sub}/resourcegroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{name}
   *
   * @default - Use system-assigned identity
   */
  readonly managedIdentityResourceId?: string;

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
 * Properties for the unified Azure Function App
 *
 * Extends AzapiResourceProps with Function App specific properties
 */
export interface FunctionAppProps extends AzapiResourceProps {
  /**
   * The kind of Function App
   * @default "functionapp"
   * @example "functionapp" for Windows, "functionapp,linux" for Linux
   */
  readonly kind?: string;

  /**
   * The resource ID of the App Service Plan hosting this Function App
   */
  readonly serverFarmId: string;

  /**
   * Whether the Function App only accepts HTTPS traffic
   * @default true
   */
  readonly httpsOnly?: boolean;

  /**
   * Whether client affinity (session affinity) is enabled
   * @default false
   */
  readonly clientAffinityEnabled?: boolean;

  /**
   * Whether the Function App is enabled
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * Site configuration including app settings and runtime
   */
  readonly siteConfig?: FunctionAppSiteConfig;

  /**
   * Managed identity configuration
   */
  readonly identity?: FunctionAppIdentity;

  /**
   * Whether public network access is enabled
   * @default "Enabled"
   */
  readonly publicNetworkAccess?: string;

  /**
   * Subnet resource ID for VNet integration
   */
  readonly virtualNetworkSubnetId?: string;

  /**
   * Whether client certificate authentication is enabled
   * @default false
   */
  readonly clientCertEnabled?: boolean;

  /**
   * Client certificate mode (Required, Optional, OptionalInteractiveUser)
   */
  readonly clientCertMode?: string;

  /**
   * Function App configuration for Flex Consumption plans
   *
   * Required when using FlexConsumption SKU (FC1) App Service Plans.
   * Configures deployment storage, runtime, and scaling.
   */
  readonly functionAppConfig?: FunctionAppConfig;

  /**
   * Asset configuration for function code deployment using asset pipeline
   *
   * When specified, the function code will be staged and optionally bundled
   * using Docker. The staged asset path will be available via the assetPath property.
   */
  readonly codeAsset?: FunctionAssetOptions;

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];

  /**
   * Resource group ID where the Function App will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * Unified Azure Function App implementation
 *
 * This class provides a single, version-aware implementation that replaces all
 * version-specific Function App classes. It automatically handles version
 * resolution, schema validation, and property transformation while maintaining
 * full backward compatibility.
 *
 * @example
 * // Basic usage with automatic version resolution:
 * const functionApp = new FunctionApp(this, "func", {
 *   name: "my-function-app",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   serverFarmId: appServicePlan.id,
 *   kind: "functionapp,linux",
 *   siteConfig: {
 *     appSettings: [
 *       { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
 *       { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
 *     ],
 *     linuxFxVersion: "NODE|20",
 *   },
 * });
 *
 * @example
 * // Function App with managed identity:
 * const functionApp = new FunctionApp(this, "func", {
 *   name: "my-function-app",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   serverFarmId: appServicePlan.id,
 *   kind: "functionapp,linux",
 *   identity: {
 *     type: "SystemAssigned",
 *   },
 *   httpsOnly: true,
 * });
 *
 * @example
 * // Function App with code asset pipeline (Node.js with bundling):
 * const functionApp = new FunctionApp(this, "func", {
 *   name: "my-function-app",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   serverFarmId: appServicePlan.id,
 *   kind: "functionapp,linux",
 *   codeAsset: {
 *     sourcePath: "./src/functions",
 *     bundling: {
 *       image: "node:20",
 *       command: ["sh", "-c", "cp -r . /asset-output/ && cd /asset-output && npm install --production"],
 *       environment: {
 *         NPM_CONFIG_LOGLEVEL: "error",
 *       },
 *     },
 *   },
 *   siteConfig: {
 *     appSettings: [
 *       { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
 *     ],
 *     linuxFxVersion: "NODE|20",
 *   },
 * });
 *
 * @stability stable
 */
export class FunctionApp extends AzapiResource {
  // Static initializer runs once when the class is first loaded
  static {
    AzapiResource.registerSchemas(FUNCTION_APP_TYPE, ALL_FUNCTION_APP_VERSIONS);
  }

  public readonly props: FunctionAppProps;

  private _assetHash?: string;
  private _assetStaging?: AssetStaging;
  private _codeAssetSourcePath?: string;
  private _codeAssetProducesFile?: boolean;
  private _stagedAssetPath?: string;
  private _blobAsset?: BlobAsset;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktn.TerraformOutput;
  public readonly locationOutput: cdktn.TerraformOutput;
  public readonly nameOutput: cdktn.TerraformOutput;
  public readonly tagsOutput: cdktn.TerraformOutput;
  public readonly defaultHostNameOutput: cdktn.TerraformOutput;

  /**
   * Creates a new Azure Function App using the VersionedAzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param options - Configuration properties for the Function App
   */
  constructor(scope: Construct, id: string, options: FunctionAppProps) {
    const { codeAsset, ...props } = options;
    super(scope, id, props);

    this.props = props;

    if (codeAsset) {
      this._processCodeAsset(codeAsset);
    }

    // Create Terraform outputs
    this.idOutput = new cdktn.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Function App",
    });

    this.locationOutput = new cdktn.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Function App",
    });

    this.nameOutput = new cdktn.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Function App",
    });

    this.tagsOutput = new cdktn.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Function App",
    });

    this.defaultHostNameOutput = new cdktn.TerraformOutput(
      this,
      "default_host_name",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.defaultHostName}`,
        description: "The default hostname of the Function App",
      },
    );

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.defaultHostNameOutput.overrideLogicalId("default_host_name");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM VersionedAzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2024-04-01";
  }

  /**
   * Gets the Azure resource type for Function Apps
   */
  protected resourceType(): string {
    return FUNCTION_APP_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Function Apps
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as FunctionAppProps;

    const properties: { [key: string]: any } = {
      serverFarmId: typedProps.serverFarmId,
      httpsOnly:
        typedProps.httpsOnly !== undefined ? typedProps.httpsOnly : true,
      clientAffinityEnabled: typedProps.clientAffinityEnabled || false,
    };

    // Add optional properties if specified
    if (typedProps.enabled !== undefined) {
      properties.enabled = typedProps.enabled;
    }

    if (typedProps.siteConfig) {
      properties.siteConfig = typedProps.siteConfig;
    }

    if (typedProps.publicNetworkAccess) {
      properties.publicNetworkAccess = typedProps.publicNetworkAccess;
    }

    if (typedProps.virtualNetworkSubnetId) {
      properties.virtualNetworkSubnetId = typedProps.virtualNetworkSubnetId;
    }

    if (typedProps.clientCertEnabled !== undefined) {
      properties.clientCertEnabled = typedProps.clientCertEnabled;
    }

    if (typedProps.clientCertMode) {
      properties.clientCertMode = typedProps.clientCertMode;
    }

    if (typedProps.functionAppConfig) {
      properties.functionAppConfig = typedProps.functionAppConfig;
    }

    return {
      kind: typedProps.kind || "functionapp",
      tags: this.allTags(),
      properties: properties,
      identity: typedProps.identity,
    };
  }

  // =============================================================================
  // ASSET PIPELINE METHODS
  // =============================================================================

  /**
   * Get the staged asset path for the function code.
   *
   * Building (running `bundling`/`bundler`, if any) and staging wait until
   * the first read of this property. Construction alone never triggers a
   * build. This holds only for `SOURCE` hashing: cdktn's `AssetStaging`
   * always builds eagerly, in its own constructor, under
   * `AssetHashType.OUTPUT`, to hash the built artifact.
   *
   * @returns The path to the staged function code, or undefined if no asset was configured
   */
  public get assetPath(): string | undefined {
    if (!this._assetStaging) {
      return undefined;
    }
    if (!this._stagedAssetPath) {
      this._stagedAssetPath = scratchAssetPath(
        "cdktn-function-code-asset",
        this._assetHash!,
        this._codeAssetProducesFile
          ? path.basename(this._codeAssetSourcePath!)
          : "archive.zip",
      );
      prepareScratchDir(this._stagedAssetPath);
      this._assetStaging.stage(this._stagedAssetPath);
    }
    return this._stagedAssetPath;
  }

  /**
   * Get the asset hash for the function code
   *
   * @returns The hash of the function code asset, or undefined if no asset was configured
   */
  public get assetHash(): string | undefined {
    return this._assetHash;
  }

  /**
   * Get the Blob Asset for the function code (if deployed via Blob Storage)
   *
   * @returns The BlobAsset instance, or undefined if not deployed via blob storage
   */
  public get blobAsset(): BlobAsset | undefined {
    return this._blobAsset;
  }

  /**
   * Deploy function code from a local path to Azure Blob Storage and configure
   * the Function App to run from the deployment package.
   *
   * This method:
   * 1. Creates a BlobAsset to stage and upload the code to Azure Blob Storage
   * 2. Configures the Function App with WEBSITE_RUN_FROM_PACKAGE pointing to the blob
   *
   * @param assetPath - Path to the function code (directory or .zip file)
   * @param storageAccountId - The Azure Storage Account resource ID
   * @param storageAccountName - The storage account name for URL generation
   * @param options - Optional configuration for the asset and blob storage
   * @returns The BlobAsset instance
   *
   * @example
   * // Deploy with managed identity (recommended)
   * functionApp.deployCodeFromBlob(
   *   './function-code',
   *   storageAccount.id,
   *   'mystorageaccount',
   *   {
   *     containerName: 'function-packages',
   *     useManagedIdentity: true,
   *   }
   * );
   *
   * @example
   * // Deploy with SAS token
   * functionApp.deployCodeFromBlob(
   *   './function-code',
   *   storageAccount.id,
   *   'mystorageaccount',
   *   {
   *     containerName: 'function-packages',
   *     sasToken: containerSasToken.sas,
   *   }
   * );
   */
  public deployCodeFromBlob(
    assetPath: string,
    storageAccountId: string,
    storageAccountName: string,
    options?: FunctionBlobDeploymentOptions,
  ): BlobAsset {
    this._blobAsset = new BlobAsset(this, "CodeBlob", {
      path: assetPath,
      storageAccountId,
      storageAccountName,
      containerName: options?.containerName,
      blobPrefix: options?.blobPrefix,
      bundler: resolveBundler(options?.bundling, options?.bundler),
      exclude: options?.exclude,
      assetHash: options?.assetHash,
      assetHashType: options?.assetHashType,
      extraHash: options?.extraHash,
      deployTime: true,
      autoUpload: options?.autoUpload,
      silent: options?.silent,
    });

    let blobUrl: string;
    if (options?.useManagedIdentity) {
      // Use managed identity - no SAS token needed
      blobUrl = this._blobAsset.blobUrlForManagedIdentity;
    } else if (options?.sasToken) {
      blobUrl = this._blobAsset.getBlobUrlWithSas(options.sasToken);
    } else {
      throw new Error(
        "Either useManagedIdentity must be true or sasToken must be provided",
      );
    }

    const appSettings = this.props.siteConfig?.appSettings || [];
    const hasRunFromPackage = appSettings.some(
      (s) => s.name === "WEBSITE_RUN_FROM_PACKAGE",
    );

    if (!hasRunFromPackage) {
      appSettings.push({
        name: "WEBSITE_RUN_FROM_PACKAGE",
        value: blobUrl,
      });

      if (options?.useManagedIdentity && options?.managedIdentityResourceId) {
        appSettings.push({
          name: "WEBSITE_RUN_FROM_PACKAGE_BLOB_MI_RESOURCE_ID",
          value: options.managedIdentityResourceId,
        });
      }

      if (!this.props.siteConfig) {
        (this.props as any).siteConfig = {};
      }
      (this.props.siteConfig as any).appSettings = appSettings;
    }

    return this._blobAsset;
  }

  /**
   * Deploy function code to a Flex Consumption plan using functionAppConfig.
   *
   * This method is specifically for Flex Consumption (FC1) plans and:
   * 1. Creates a BlobAsset to stage and optionally bundle the function code
   * 2. Populates the functionAppConfig.deployment.storage property with the blob URL
   *
   * Use this method when your Function App is on a Flex Consumption plan and you
   * want to use the asset pipeline for code deployment.
   *
   * @param assetPath - Path to the function code (directory or .zip file)
   * @param storageAccountId - The Azure Storage Account resource ID
   * @param storageAccountName - The storage account name for URL generation
   * @param options - Optional configuration for the asset and blob storage
   * @returns The BlobAsset instance
   *
   * @example
   * const functionApp = new FunctionApp(this, 'FlexFunc', {
   *   name: 'my-flex-func',
   *   location: 'eastus2',
   *   resourceGroupId: rg.id,
   *   serverFarmId: flexPlan.id,
   *   kind: 'functionapp,linux',
   *   identity: { type: 'SystemAssigned' },
   *   functionAppConfig: {
   *     runtime: { name: 'node', version: '20' },
   *     // deployment will be populated by deployCodeToFlexConsumption
   *     deployment: {
   *       storage: {
   *         type: 'blobContainer',
   *         value: '', // will be set
   *         authentication: { type: 'SystemAssignedIdentity' }
   *       }
   *     }
   *   }
   * });
   *
   * // Deploy the code
   * functionApp.deployCodeToFlexConsumption(
   *   './function-code',
   *   storageAccount.id,
   *   'mystorageaccount',
   *   {
   *     containerName: 'deployments',
   *     useManagedIdentity: true,
   *   }
   * );
   */
  public deployCodeToFlexConsumption(
    assetPath: string,
    storageAccountId: string,
    storageAccountName: string,
    options?: FunctionBlobDeploymentOptions,
  ): BlobAsset {
    if (!this.props.functionAppConfig) {
      throw new Error(
        "functionAppConfig must be defined to use deployCodeToFlexConsumption. " +
          "This method is for Flex Consumption plans only. " +
          "For traditional plans, use deployCodeFromBlob() instead.",
      );
    }

    this._blobAsset = new BlobAsset(this, "CodeBlob", {
      path: assetPath,
      storageAccountId,
      storageAccountName,
      containerName: options?.containerName ?? "deployments",
      blobPrefix: options?.blobPrefix,
      bundler: resolveBundler(options?.bundling, options?.bundler),
      exclude: options?.exclude,
      assetHash: options?.assetHash,
      assetHashType: options?.assetHashType,
      extraHash: options?.extraHash,
      deployTime: true,
      autoUpload: options?.autoUpload,
      silent: options?.silent,
    });

    let blobUrl: string;
    if (options?.useManagedIdentity) {
      blobUrl = this._blobAsset.blobUrlForManagedIdentity;
    } else if (options?.sasToken) {
      blobUrl = this._blobAsset.getBlobUrlWithSas(options.sasToken);
    } else {
      throw new Error(
        "Either useManagedIdentity must be true or sasToken must be provided",
      );
    }

    (this.props.functionAppConfig.deployment.storage as any).value = blobUrl;

    if (options?.useManagedIdentity && options?.managedIdentityResourceId) {
      (
        this.props.functionAppConfig.deployment.storage.authentication as any
      ).userAssignedIdentityResourceId = options.managedIdentityResourceId;
    }

    return this._blobAsset;
  }

  /**
   * Hash the code asset using the asset pipeline.
   *
   * This method deliberately skips building or staging. That happens only
   * once a caller reads `assetPath` (see its getter). Constructing a
   * `FunctionApp` with a bundled `codeAsset` -- e.g. while listing or
   * diffing an unrelated stack -- never runs the bundler.
   *
   * @param assetOptions - The asset configuration
   */
  private _processCodeAsset(assetOptions: FunctionAssetOptions): void {
    const resolvedPath = path.resolve(assetOptions.sourcePath);
    const bundler = resolveBundler(assetOptions.bundling, assetOptions.bundler);
    const producesFile =
      !!bundler?.outputFileName || fs.statSync(resolvedPath).isFile();

    this._assetStaging = new AssetStaging(this, "CodeAsset", {
      sourcePath: resolvedPath,
      packaging: producesFile ? AssetPackaging.FILE : AssetPackaging.ZIP,
      exclude: assetOptions.exclude,
      bundler,
      assetHash: assetOptions.assetHash,
    });
    this._assetHash = this._assetStaging.assetHash;
    this._codeAssetSourcePath = resolvedPath;
    this._codeAssetProducesFile = producesFile;
  }

  // =============================================================================
  // PUBLIC METHODS FOR FUNCTION APP OPERATIONS
  // =============================================================================

  /**
   * Get the default hostname of the Function App
   */
  public get defaultHostName(): string {
    return `\${${this.terraformResource.fqn}.output.properties.defaultHostName}`;
  }

  /**
   * Add a tag to the Function App
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Function App
   */
  public removeTag(key: string): void {
    if (this.props.tags && this.props.tags[key]) {
      delete this.props.tags[key];
    }
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Applies ignore changes lifecycle rules if specified in props
   */
  private _applyIgnoreChanges(): void {
    if (this.props.ignoreChanges && this.props.ignoreChanges.length > 0) {
      this.terraformResource.addOverride("lifecycle", [
        {
          ignore_changes: this.props.ignoreChanges,
        },
      ]);
    }
  }
}
