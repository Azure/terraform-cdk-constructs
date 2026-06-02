/**
 * Unified Azure Container Registry implementation using VersionedAzapiResource framework
 *
 * This class provides a single, version-aware implementation for Azure Container Registry
 * that automatically handles version management, schema validation, and property transformation
 * across all supported API versions.
 *
 * Supported API Versions:
 * - 2023-07-01 (Maintenance)
 * - 2025-04-01 (Active, Latest)
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
  ALL_CONTAINER_REGISTRY_VERSIONS,
  CONTAINER_REGISTRY_TYPE,
} from "./container-registry-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * SKU configuration for Container Registry
 */
export interface ContainerRegistrySku {
  /**
   * The SKU name (Basic, Standard, Premium)
   */
  readonly name: string;
}

/**
 * IP rule for network rule set
 */
export interface ContainerRegistryIpRule {
  /**
   * IP address or CIDR range
   */
  readonly value: string;

  /**
   * The action of IP ACL rule (Allow)
   * @default "Allow"
   */
  readonly action?: string;
}

/**
 * Network rule set configuration for Container Registry
 */
export interface ContainerRegistryNetworkRuleSet {
  /**
   * Default action when no rule matches (Allow or Deny)
   * @default "Allow"
   */
  readonly defaultAction?: string;

  /**
   * IP rules for the Container Registry
   */
  readonly ipRules?: ContainerRegistryIpRule[];
}

/**
 * Key vault properties for encryption
 */
export interface ContainerRegistryKeyVaultProperties {
  /**
   * The client ID of the identity used to access the key vault
   */
  readonly identity?: string;

  /**
   * The key identifier of the key vault key
   */
  readonly keyIdentifier?: string;
}

/**
 * Encryption configuration for Container Registry
 */
export interface ContainerRegistryEncryption {
  /**
   * Key vault properties for customer-managed key encryption
   */
  readonly keyVaultProperties?: ContainerRegistryKeyVaultProperties;

  /**
   * The encryption status (enabled or disabled)
   * @default "disabled"
   */
  readonly status?: string;
}

/**
 * Retention policy for Container Registry
 */
export interface ContainerRegistryRetentionPolicy {
  /**
   * Number of days to retain untagged manifests
   * @default 7
   */
  readonly days?: number;

  /**
   * The retention policy status (enabled or disabled)
   * @default "disabled"
   */
  readonly status?: string;
}

/**
 * Trust policy for Container Registry
 */
export interface ContainerRegistryTrustPolicy {
  /**
   * The trust policy type (Notary)
   * @default "Notary"
   */
  readonly type?: string;

  /**
   * The trust policy status (enabled or disabled)
   * @default "disabled"
   */
  readonly status?: string;
}

/**
 * Export policy for Container Registry
 */
export interface ContainerRegistryExportPolicy {
  /**
   * The export policy status (enabled or disabled)
   * @default "enabled"
   */
  readonly status?: string;
}

/**
 * Soft delete policy for Container Registry
 */
export interface ContainerRegistrySoftDeletePolicy {
  /**
   * Number of days after which a soft-deleted item is permanently deleted
   * @default 7
   */
  readonly retentionDays?: number;

  /**
   * The soft delete policy status (enabled or disabled)
   * @default "disabled"
   */
  readonly status?: string;
}

/**
 * Policy configuration for Container Registry
 */
export interface ContainerRegistryPolicies {
  /**
   * Retention policy for untagged manifests
   */
  readonly retentionPolicy?: ContainerRegistryRetentionPolicy;

  /**
   * Trust policy for content trust
   */
  readonly trustPolicy?: ContainerRegistryTrustPolicy;

  /**
   * Export policy for the registry
   */
  readonly exportPolicy?: ContainerRegistryExportPolicy;

  /**
   * Soft delete policy for the registry
   */
  readonly softDeletePolicy?: ContainerRegistrySoftDeletePolicy;
}

/**
 * Identity configuration for Container Registry
 */
export interface ContainerRegistryIdentity {
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
 * Properties for the unified Azure Container Registry
 *
 * Extends AzapiResourceProps with Container Registry specific properties
 */
export interface ContainerRegistryProps extends AzapiResourceProps {
  /**
   * The SKU (pricing tier) for the Container Registry
   * @example { name: "Standard" }
   */
  readonly sku: ContainerRegistrySku;

  /**
   * Whether the admin user is enabled
   * @default false
   */
  readonly adminUserEnabled?: boolean;

  /**
   * Whether public network access is enabled
   * @default "Enabled"
   */
  readonly publicNetworkAccess?: string;

  /**
   * Network rule set configuration (Premium SKU only)
   */
  readonly networkRuleSet?: ContainerRegistryNetworkRuleSet;

  /**
   * Encryption settings with customer-managed keys (Premium SKU only)
   */
  readonly encryption?: ContainerRegistryEncryption;

  /**
   * Policy configuration for the registry
   */
  readonly policies?: ContainerRegistryPolicies;

  /**
   * Managed identity configuration
   */
  readonly identity?: ContainerRegistryIdentity;

  /**
   * Whether zone redundancy is enabled (Premium SKU only)
   * @default "Disabled"
   */
  readonly zoneRedundancy?: string;

  /**
   * Whether to enable a dedicated data endpoint (Premium SKU only)
   * @default false
   */
  readonly dataEndpointEnabled?: boolean;

  /**
   * Whether anonymous pull is enabled (Standard or Premium SKU)
   * @default false
   */
  readonly anonymousPullEnabled?: boolean;

  /**
   * Whether to allow trusted Azure Services to bypass network rules
   * @default "AzureServices"
   */
  readonly networkRuleBypassOptions?: string;

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];

  /**
   * Resource group ID where the Container Registry will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * Unified Azure Container Registry implementation
 *
 * This class provides a single, version-aware implementation that replaces all
 * version-specific Container Registry classes. It automatically handles version
 * resolution, schema validation, and property transformation while maintaining
 * full backward compatibility.
 *
 * @example
 * // Basic usage with automatic version resolution:
 * const registry = new ContainerRegistry(this, "acr", {
 *   name: "mycontainerregistry",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   sku: { name: "Standard" },
 * });
 *
 * @example
 * // Premium registry with advanced features:
 * const registry = new ContainerRegistry(this, "acr", {
 *   name: "mycontainerregistry",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   sku: { name: "Premium" },
 *   publicNetworkAccess: "Disabled",
 *   zoneRedundancy: "Enabled",
 *   dataEndpointEnabled: true,
 *   policies: {
 *     retentionPolicy: { days: 30, status: "enabled" },
 *     softDeletePolicy: { retentionDays: 14, status: "enabled" },
 *   },
 * });
 *
 * @stability stable
 */
export class ContainerRegistry extends AzapiResource {
  // Static initializer runs once when the class is first loaded
  static {
    AzapiResource.registerSchemas(
      CONTAINER_REGISTRY_TYPE,
      ALL_CONTAINER_REGISTRY_VERSIONS,
    );
  }

  public readonly props: ContainerRegistryProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly loginServerOutput: cdktf.TerraformOutput;

  /**
   * Creates a new Azure Container Registry using the VersionedAzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Container Registry
   */
  constructor(scope: Construct, id: string, props: ContainerRegistryProps) {
    super(scope, id, props);

    this.props = props;

    // Create Terraform outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Container Registry",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Container Registry",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Container Registry",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Container Registry",
    });

    this.loginServerOutput = new cdktf.TerraformOutput(this, "login_server", {
      value: `\${${this.terraformResource.fqn}.output.properties.loginServer}`,
      description: "The login server URL of the Container Registry",
    });

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.loginServerOutput.overrideLogicalId("login_server");

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
    return "2025-04-01";
  }

  /**
   * Gets the Azure resource type for Container Registries
   */
  protected resourceType(): string {
    return CONTAINER_REGISTRY_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Container Registries
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as ContainerRegistryProps;

    const properties: { [key: string]: any } = {
      adminUserEnabled: typedProps.adminUserEnabled || false,
      publicNetworkAccess: typedProps.publicNetworkAccess || "Enabled",
    };

    // Add optional properties if specified
    if (typedProps.networkRuleSet) {
      properties.networkRuleSet = typedProps.networkRuleSet;
    }

    if (typedProps.encryption) {
      properties.encryption = typedProps.encryption;
    }

    if (typedProps.policies) {
      properties.policies = typedProps.policies;
    }

    if (typedProps.zoneRedundancy) {
      properties.zoneRedundancy = typedProps.zoneRedundancy;
    }

    if (typedProps.dataEndpointEnabled !== undefined) {
      properties.dataEndpointEnabled = typedProps.dataEndpointEnabled;
    }

    if (typedProps.anonymousPullEnabled !== undefined) {
      properties.anonymousPullEnabled = typedProps.anonymousPullEnabled;
    }

    if (typedProps.networkRuleBypassOptions) {
      properties.networkRuleBypassOptions = typedProps.networkRuleBypassOptions;
    }

    return {
      location: this.location,
      tags: this.allTags(),
      sku: typedProps.sku,
      properties: properties,
      identity: typedProps.identity,
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR CONTAINER REGISTRY OPERATIONS
  // =============================================================================

  /**
   * Get the login server URL for the Container Registry
   */
  public get loginServer(): string {
    return `\${${this.terraformResource.fqn}.output.properties.loginServer}`;
  }

  /**
   * Add a tag to the Container Registry
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Container Registry
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
