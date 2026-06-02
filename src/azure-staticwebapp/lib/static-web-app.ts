/**
 * Azure Static Web App implementation using AzapiResource framework
 *
 * This class provides a unified implementation for Azure Static Web Apps that
 * automatically handles version management, schema validation, and property
 * transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2022-03-01 (Active)
 * - 2023-12-01 (Active)
 * - 2024-04-01 (Active, Latest)
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
  ALL_STATIC_WEB_APP_VERSIONS,
  STATIC_WEB_APP_TYPE,
} from "./static-web-app-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * SKU configuration for Static Web App
 */
export interface StaticWebAppSku {
  /**
   * Name of the SKU
   * @example "Free", "Standard"
   */
  readonly name: string;

  /**
   * Tier of the SKU
   * @example "Free", "Standard"
   */
  readonly tier?: string;
}

/**
 * Build configuration for the Static Web App
 *
 * These properties drive the build pipeline that the Static Web App
 * uses when integrated with a source control repository.
 */
export interface StaticWebAppBuildProperties {
  /**
   * The path to the app code within the repository
   * @example "/", "src"
   */
  readonly appLocation?: string;

  /**
   * The path to the Azure Functions API code within the repository
   * @example "api"
   */
  readonly apiLocation?: string;

  /**
   * The path of the build output relative to the app location
   * @example "build", "dist"
   */
  readonly outputLocation?: string;

  /**
   * A custom command to run during deployment of the static content application
   */
  readonly appBuildCommand?: string;

  /**
   * A custom command to run during deployment of the Azure Functions API application
   */
  readonly apiBuildCommand?: string;

  /**
   * Skip Github Action workflow generation
   */
  readonly skipGithubActionWorkflowGeneration?: boolean;

  /**
   * GitHub Action secret name override
   */
  readonly githubActionSecretNameOverride?: string;
}

/**
 * Properties for the Azure Static Web App
 *
 * Extends AzapiResourceProps with Static Web App specific properties
 */
export interface StaticWebAppProps extends AzapiResourceProps {
  /**
   * SKU of the static web app
   * @defaultValue { name: "Free", tier: "Free" }
   */
  readonly sku?: StaticWebAppSku;

  /**
   * URL of the source code repository
   * Optional - if not provided, the Static Web App is created without source control integration
   * @example "https://github.com/my-org/my-repo"
   */
  readonly repositoryUrl?: string;

  /**
   * Source code branch in the repository
   * @example "main"
   */
  readonly branch?: string;

  /**
   * Token used to authenticate against the repository
   * For GitHub, this is a personal access token with `repo` scope
   *
   * @remarks
   * Treat this value as a secret. Prefer passing it via Terraform variables
   * or environment variables rather than hard-coding it.
   */
  readonly repositoryToken?: string;

  /**
   * Build configuration for the static web app
   */
  readonly buildProperties?: StaticWebAppBuildProperties;

  /**
   * Whether staging environments are allowed
   * @example "Enabled", "Disabled"
   * @defaultValue "Enabled"
   */
  readonly stagingEnvironmentPolicy?: string;

  /**
   * Whether configuration file updates are allowed
   * @defaultValue true
   */
  readonly allowConfigFileUpdates?: boolean;

  /**
   * Resource group ID where the Static Web App will be created
   * Optional - will use the subscription scope if not provided
   */
  readonly resourceGroupId?: string;

  /**
   * The lifecycle rules to ignore changes
   * Useful for properties that are externally managed
   *
   * @example ["tags", "body.properties.repositoryToken"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Azure Static Web App
 *
 * This class provides a single, version-aware implementation for the
 * `Microsoft.Web/staticSites` Azure resource type. It automatically handles
 * version resolution, schema validation, and property transformation while
 * exposing the most commonly used Static Web App configuration options.
 *
 * @example
 * // Basic Free-tier Static Web App without source control integration:
 * const swa = new StaticWebApp(this, "swa", {
 *   name: "my-static-web-app",
 *   location: "eastus2",
 *   resourceGroupId: resourceGroup.id,
 * });
 *
 * @example
 * // Standard Static Web App with GitHub integration:
 * const swa = new StaticWebApp(this, "swa", {
 *   name: "my-static-web-app",
 *   location: "eastus2",
 *   resourceGroupId: resourceGroup.id,
 *   sku: {
 *     name: "Standard",
 *     tier: "Standard",
 *   },
 *   repositoryUrl: "https://github.com/my-org/my-repo",
 *   branch: "main",
 *   buildProperties: {
 *     appLocation: "/",
 *     apiLocation: "api",
 *     outputLocation: "dist",
 *   },
 * });
 *
 * @stability stable
 */
export class StaticWebApp extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      STATIC_WEB_APP_TYPE,
      ALL_STATIC_WEB_APP_VERSIONS,
    );
  }

  /**
   * The input properties for this Static Web App instance
   */
  public readonly props: StaticWebAppProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly defaultHostnameOutput: cdktf.TerraformOutput;

  /**
   * Creates a new Azure Static Web App using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Static Web App
   */
  constructor(scope: Construct, id: string, props: StaticWebAppProps) {
    super(scope, id, props);

    this.props = props;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Static Web App",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Static Web App",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Static Web App",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Static Web App",
    });

    this.defaultHostnameOutput = new cdktf.TerraformOutput(
      this,
      "default_hostname",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.defaultHostname}`,
        description: "The default hostname of the Static Web App",
      },
    );

    // Override logical IDs to match consistent naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.locationOutput.overrideLogicalId("location");
    this.tagsOutput.overrideLogicalId("tags");
    this.defaultHostnameOutput.overrideLogicalId("default_hostname");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2024-04-01";
  }

  /**
   * Gets the Azure resource type for Static Web Apps
   */
  protected resourceType(): string {
    return STATIC_WEB_APP_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Static Web Apps
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   * Transforms the input properties into the JSON format expected by the
   * `Microsoft.Web/staticSites` Azure REST API.
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as StaticWebAppProps;

    const properties: { [key: string]: any } = {};

    if (typedProps.repositoryUrl !== undefined) {
      properties.repositoryUrl = typedProps.repositoryUrl;
    }
    if (typedProps.branch !== undefined) {
      properties.branch = typedProps.branch;
    }
    if (typedProps.repositoryToken !== undefined) {
      properties.repositoryToken = typedProps.repositoryToken;
    }
    if (typedProps.buildProperties !== undefined) {
      properties.buildProperties = typedProps.buildProperties;
    }
    if (typedProps.stagingEnvironmentPolicy !== undefined) {
      properties.stagingEnvironmentPolicy = typedProps.stagingEnvironmentPolicy;
    }
    if (typedProps.allowConfigFileUpdates !== undefined) {
      properties.allowConfigFileUpdates = typedProps.allowConfigFileUpdates;
    }

    return {
      tags: this.allTags(),
      sku: typedProps.sku || { name: "Free", tier: "Free" },
      properties: properties,
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR STATIC WEB APP OPERATIONS
  // =============================================================================

  /**
   * Get the subscription ID from the Static Web App ID
   * Extracts the subscription ID from the Azure resource ID format
   */
  public get subscriptionId(): string {
    const idParts = this.id.split("/");
    const subscriptionIndex = idParts.indexOf("subscriptions");
    if (subscriptionIndex !== -1 && subscriptionIndex + 1 < idParts.length) {
      return idParts[subscriptionIndex + 1];
    }
    throw new Error("Unable to extract subscription ID from Static Web App ID");
  }

  /**
   * Get the full resource identifier for use in other Azure resources
   * Alias for the id property
   */
  public get resourceId(): string {
    return this.id;
  }

  /**
   * Get the default hostname of the Static Web App
   * Returns the Terraform interpolation string for the default hostname
   */
  public get defaultHostname(): string {
    return `\${${this.terraformResource.fqn}.output.properties.defaultHostname}`;
  }

  /**
   * Add a tag to the Static Web App
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Static Web App
   * Note: This modifies the construct props but requires a new deployment to take effect
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
      this.terraformResource.addOverride("lifecycle", {
        ignore_changes: this.props.ignoreChanges,
      });
    }
  }
}
