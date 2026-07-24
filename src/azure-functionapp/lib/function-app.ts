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

import * as cdktn from "cdktn";
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
  BundlingOptions,
  BundlingOutput,
  DockerImage,
} from "../../core-azure/lib/bundling";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

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
 * Docker volume configuration for bundling
 */
export interface FunctionBundlingVolume {
  /**
   * The path on the host machine
   */
  readonly hostPath: string;

  /**
   * The path in the container
   */
  readonly containerPath: string;
}

/**
 * Asset bundling options for function code
 *
 * Supports Docker-based bundling for dependency installation,
 * transpilation, and other build steps. Simplified from cdktn BundlingOptions
 * to support both string and DockerImage for the image field.
 */
export interface FunctionAssetBundlingOptions {
  /**
   * Docker image to use for bundling (e.g., "node:20", "python:3.11")
   * Can be a string (will be resolved via DockerImage.fromRegistry) or a DockerImage instance
   */
  readonly image: string | DockerImage;

  /**
   * The command to run in the Docker container.
   *
   * @example ['npm', 'run', 'build']
   * @default - run the command defined in the image
   */
  readonly command?: string[];

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
   * @default - root
   */
  readonly user?: string;

  /**
   * The entrypoint to run in the Docker container.
   *
   * @example ['/bin/sh', '-c']
   * @default - run the entrypoint defined in the image
   */
  readonly entrypoint?: string[];

  /**
   * Additional Docker volumes to mount.
   *
   * @default - no additional volumes
   */
  readonly volumes?: FunctionBundlingVolume[];

  /**
   * Mount volumes from other containers.
   *
   * @default - no volumes from other containers
   */
  readonly volumesFrom?: string[];

  /**
   * Networking mode for the Docker container.
   *
   * @default - bridge
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
   * The type of output that this bundling operation is producing.
   *
   * @default BundlingOutput.AUTO_DISCOVER
   */
  readonly outputType?: BundlingOutput;

  /**
   * The access mechanism used to make source files available to the bundling container.
   *
   * @default - BIND_MOUNT
   */
  readonly bundlingFileAccess?: any;

  /**
   * Local bundling provider.
   *
   * @default - no local bundling
   */
  readonly local?: any;
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
   * Optional bundling configuration for preparing the code
   * (e.g., installing dependencies, transpiling)
   */
  readonly bundling?: FunctionAssetBundlingOptions;

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
 *       dockerImage: "node:20",
 *       command: ["npm", "install", "--production"],
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

  // Asset management properties
  private _assetPath?: string;
  private _assetHash?: string;
  private _assetStaging?: AssetStaging;
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
   * @param props - Configuration properties for the Function App
   */
  constructor(scope: Construct, id: string, props: FunctionAppProps) {
    super(scope, id, props);

    this.props = props;

    // Process code asset if provided
    if (props.codeAsset) {
      this._processCodeAsset(props.codeAsset);
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
   * Get the staged asset path for the function code
   *
   * @returns The path to the staged function code, or undefined if no asset was configured
   */
  public get assetPath(): string | undefined {
    return this._assetPath;
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
    // Convert bundling image from string to DockerImage if needed
    let bundlingOptions: any = options?.bundling;
    if (bundlingOptions && typeof bundlingOptions.image === "string") {
      bundlingOptions = {
        ...bundlingOptions,
        image: DockerImage.fromRegistry(bundlingOptions.image),
      };
    }

    // Create the blob asset
    this._blobAsset = new BlobAsset(this, "CodeBlob", {
      path: assetPath,
      storageAccountId,
      storageAccountName,
      containerName: options?.containerName,
      blobPrefix: options?.blobPrefix,
      bundling: bundlingOptions,
      exclude: options?.exclude,
      assetHash: options?.assetHash,
      assetHashType: options?.assetHashType,
      extraHash: options?.extraHash,
      deployTime: true,
      autoUpload: options?.autoUpload,
      silent: options?.silent,
    });

    // Determine the blob URL to use
    let blobUrl: string;
    if (options?.useManagedIdentity) {
      // Use managed identity - no SAS token needed
      blobUrl = this._blobAsset.blobUrlForManagedIdentity;
    } else if (options?.sasToken) {
      // Use SAS token
      blobUrl = this._blobAsset.getBlobUrlWithSas(options.sasToken);
    } else {
      throw new Error(
        "Either useManagedIdentity must be true or sasToken must be provided",
      );
    }

    // Add WEBSITE_RUN_FROM_PACKAGE to app settings
    const appSettings = this.props.siteConfig?.appSettings || [];
    const hasRunFromPackage = appSettings.some(
      (s) => s.name === "WEBSITE_RUN_FROM_PACKAGE",
    );

    if (!hasRunFromPackage) {
      appSettings.push({
        name: "WEBSITE_RUN_FROM_PACKAGE",
        value: blobUrl,
      });

      // If using managed identity with user-assigned identity, add the resource ID setting
      if (options?.useManagedIdentity && options?.managedIdentityResourceId) {
        appSettings.push({
          name: "WEBSITE_RUN_FROM_PACKAGE_BLOB_MI_RESOURCE_ID",
          value: options.managedIdentityResourceId,
        });
      }

      // Update the site config
      if (!this.props.siteConfig) {
        (this.props as any).siteConfig = {};
      }
      (this.props.siteConfig as any).appSettings = appSettings;
    }

    return this._blobAsset;
  }

  /**
   * Process and stage the code asset using the asset pipeline
   *
   * @param assetOptions - The asset configuration
   */
  private _processCodeAsset(assetOptions: FunctionAssetOptions): void {
    // Convert FunctionAssetBundlingOptions to BundlingOptions if bundling is specified
    let bundlingOptions: BundlingOptions | undefined;
    if (assetOptions.bundling) {
      const funcBundling = assetOptions.bundling;

      // Resolve image - support both string and DockerImage
      const dockerImage =
        typeof funcBundling.image === "string"
          ? DockerImage.fromRegistry(funcBundling.image)
          : funcBundling.image;

      bundlingOptions = {
        image: dockerImage,
        command: funcBundling.command,
        environment: funcBundling.environment,
        workingDirectory: funcBundling.workingDirectory,
        user: funcBundling.user,
        bundlingFileAccess: funcBundling.bundlingFileAccess,
        outputType: funcBundling.outputType ?? BundlingOutput.AUTO_DISCOVER,
        entrypoint: funcBundling.entrypoint,
        volumes: funcBundling.volumes,
        volumesFrom: funcBundling.volumesFrom,
        network: funcBundling.network,
        securityOpt: funcBundling.securityOpt,
        local: funcBundling.local,
      };
    }

    // Create AssetStaging to handle bundling and staging
    this._assetStaging = new AssetStaging(this, "CodeAsset", {
      sourcePath: assetOptions.sourcePath,
      exclude: assetOptions.exclude,
      bundling: bundlingOptions,
      assetHash: assetOptions.assetHash,
    });

    // Store the staged path and hash for reference
    this._assetPath = this._assetStaging.absoluteStagedPath;
    this._assetHash = this._assetStaging.assetHash;
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
