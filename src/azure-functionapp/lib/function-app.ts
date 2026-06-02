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
 */

import * as cdktf from "cdktf";
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
 * @stability stable
 */
export class FunctionApp extends AzapiResource {
  // Static initializer runs once when the class is first loaded
  static {
    AzapiResource.registerSchemas(FUNCTION_APP_TYPE, ALL_FUNCTION_APP_VERSIONS);
  }

  public readonly props: FunctionAppProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly defaultHostNameOutput: cdktf.TerraformOutput;

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

    // Create Terraform outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Function App",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Function App",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Function App",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Function App",
    });

    this.defaultHostNameOutput = new cdktf.TerraformOutput(
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
