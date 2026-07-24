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
import * as fs from "fs";
import * as path from "path";
import { Construct } from "constructs";
import {
  ALL_FUNCTION_APP_VERSIONS,
  FUNCTION_APP_TYPE,
} from "./function-app-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
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
 * Asset bundling options for function code
 *
 * Supports Docker-based bundling for dependency installation,
 * transpilation, and other build steps.
 */
export interface FunctionAssetBundlingOptions {
  /**
   * Docker image to use for bundling (e.g., "node:20", "python:3.11")
   */
  readonly dockerImage: string;

  /**
   * Command to run in the Docker container for bundling
   * @example ["npm", "install", "--production"]
   */
  readonly command?: string[];

  /**
   * Environment variables to pass to the bundling container
   */
  readonly environment?: { [key: string]: string };

  /**
   * Working directory inside the bundling container
   * @default /asset-input
   */
  readonly workingDirectory?: string;

  /**
   * User to run the bundling command as
   */
  readonly user?: string;

  /**
   * Whether to use bind mount for file access (faster) or volume copy (more compatible)
   * @default true (use bind mount)
   */
  readonly useBindMount?: boolean;
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
   * Process and stage the code asset using the asset pipeline
   *
   * @param assetOptions - The asset configuration
   */
  private _processCodeAsset(assetOptions: FunctionAssetOptions): void {
    const sourcePath = path.resolve(assetOptions.sourcePath);

    // Validate source path exists
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Code asset source path does not exist: ${sourcePath}`);
    }

    const sourceStats = fs.statSync(sourcePath);
    if (!sourceStats.isDirectory() && !sourceStats.isFile()) {
      throw new Error(
        `Code asset source must be a directory or file: ${sourcePath}`,
      );
    }

    // TODO: Integrate with AssetStaging when available from CDKTN library
    // For now, calculate a simple hash for cache busting
    this._assetHash = this._calculateSimpleHash(sourcePath, assetOptions);
    this._assetPath = sourcePath;

    // If bundling is configured, the asset hash should reflect bundling config
    if (assetOptions.bundling) {
      const bundlingHash = this._hashBundlingConfig(assetOptions.bundling);
      this._assetHash = `${this._assetHash}-${bundlingHash}`;
    }
  }

  /**
   * Calculate a simple content hash for the source path
   */
  private _calculateSimpleHash(
    sourcePath: string,
    options: FunctionAssetOptions,
  ): string {
    const crypto = require("crypto");
    const hash = crypto.createHash("sha256");

    // Include the source path
    hash.update(sourcePath);

    // Include exclude patterns
    if (options.exclude) {
      hash.update(JSON.stringify(options.exclude.sort()));
    }

    // Include custom hash if provided
    if (options.assetHash) {
      hash.update(options.assetHash);
    }

    return hash.digest("hex").substring(0, 12);
  }

  /**
   * Hash the bundling configuration for cache busting
   */
  private _hashBundlingConfig(bundling: FunctionAssetBundlingOptions): string {
    const crypto = require("crypto");
    const hash = crypto.createHash("sha256");

    hash.update(bundling.dockerImage);
    if (bundling.command) {
      hash.update(JSON.stringify(bundling.command));
    }
    if (bundling.environment) {
      hash.update(JSON.stringify(Object.entries(bundling.environment).sort()));
    }

    return hash.digest("hex").substring(0, 12);
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
