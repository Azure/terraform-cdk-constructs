/**
 * Unified Azure Key Vault implementation using AzapiResource framework
 *
 * This class provides a version-aware implementation for Azure Key Vault
 * (Microsoft.KeyVault/vaults) that automatically handles version management,
 * schema validation, and property transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2023-02-01 (Active)
 * - 2023-07-01 (Active)
 * - 2024-11-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full JSII compliance for multi-language support
 * - Configurable SKU, tenant, RBAC and access policies
 * - Network ACLs and public network access control
 * - Soft-delete and purge protection support
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { ALL_KEY_VAULT_VERSIONS, KEY_VAULT_TYPE } from "./key-vault-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { DataAzapiClientConfig } from "../../core-azure/lib/azapi/providers-azapi/data-azapi-client-config";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * SKU configuration for Key Vault
 */
export interface KeyVaultSku {
  /**
   * The SKU name (standard or premium)
   *
   * @default "standard"
   */
  readonly name: "standard" | "premium";

  /**
   * The SKU family. Always "A" for Key Vault.
   *
   * @default "A"
   */
  readonly family?: string;
}

/**
 * Permissions configuration for an access policy
 */
export interface KeyVaultAccessPolicyPermissions {
  /**
   * Permissions for keys (e.g. "get", "list", "create", "delete")
   */
  readonly keys?: string[];

  /**
   * Permissions for secrets (e.g. "get", "list", "set", "delete")
   */
  readonly secrets?: string[];

  /**
   * Permissions for certificates (e.g. "get", "list", "create", "delete")
   */
  readonly certificates?: string[];

  /**
   * Permissions for storage (e.g. "get", "list", "set", "delete")
   */
  readonly storage?: string[];
}

/**
 * Access policy configuration for the Key Vault
 */
export interface KeyVaultAccessPolicy {
  /**
   * The Azure Active Directory tenant ID
   */
  readonly tenantId: string;

  /**
   * The object ID of a user, service principal, or security group in AAD
   */
  readonly objectId: string;

  /**
   * The application ID of the client making the request on behalf of the user
   */
  readonly applicationId?: string;

  /**
   * The permissions granted to the identity
   */
  readonly permissions: KeyVaultAccessPolicyPermissions;
}

/**
 * IP rule for Key Vault network ACLs
 */
export interface KeyVaultIpRule {
  /**
   * IP address or CIDR range
   */
  readonly value: string;
}

/**
 * Virtual network rule for Key Vault network ACLs
 */
export interface KeyVaultVirtualNetworkRule {
  /**
   * Virtual network subnet resource ID
   */
  readonly id: string;

  /**
   * Whether to ignore missing VNET service endpoint
   */
  readonly ignoreMissingVnetServiceEndpoint?: boolean;
}

/**
 * Network ACL configuration for the Key Vault
 */
export interface KeyVaultNetworkAcls {
  /**
   * Default action when no rule matches (Allow or Deny)
   *
   * @default "Allow"
   */
  readonly defaultAction?: "Allow" | "Deny";

  /**
   * Tells what traffic can bypass network rules. Can be 'AzureServices' or 'None'.
   *
   * @default "AzureServices"
   */
  readonly bypass?: "AzureServices" | "None";

  /**
   * IP rules for the Key Vault
   */
  readonly ipRules?: KeyVaultIpRule[];

  /**
   * Virtual network subnet rules for the Key Vault
   */
  readonly virtualNetworkRules?: KeyVaultVirtualNetworkRule[];
}

/**
 * Properties for the unified Azure Key Vault
 *
 * Extends AzapiResourceProps with Key Vault specific properties.
 */
export interface KeyVaultProps extends AzapiResourceProps {
  /**
   * Resource group ID where the Key Vault will be created
   */
  readonly resourceGroupId?: string;

  /**
   * The SKU (pricing tier) for the Key Vault
   *
   * @default { name: "standard", family: "A" }
   */
  readonly sku?: KeyVaultSku;

  /**
   * The Azure Active Directory tenant ID that should be used for authenticating
   * requests to the Key Vault. If not provided, the current tenant ID from the
   * AZAPI client configuration is used.
   */
  readonly tenantId?: string;

  /**
   * Access policies for the Key Vault.
   *
   * Only applicable when `enableRbacAuthorization` is false.
   */
  readonly accessPolicies?: KeyVaultAccessPolicy[];

  /**
   * Network ACL configuration for the Key Vault
   */
  readonly networkAcls?: KeyVaultNetworkAcls;

  /**
   * Whether Azure Virtual Machines are permitted to retrieve certificates
   * stored as secrets from the Key Vault.
   *
   * @default false
   */
  readonly enabledForDeployment?: boolean;

  /**
   * Whether Azure Disk Encryption is permitted to retrieve secrets from the
   * Key Vault and unwrap keys.
   *
   * @default false
   */
  readonly enabledForDiskEncryption?: boolean;

  /**
   * Whether Azure Resource Manager is permitted to retrieve secrets from the
   * Key Vault.
   *
   * @default false
   */
  readonly enabledForTemplateDeployment?: boolean;

  /**
   * Whether Azure RBAC is used to authorize data actions instead of access
   * policies.
   *
   * @default true
   */
  readonly enableRbacAuthorization?: boolean;

  /**
   * Whether soft-delete is enabled on the Key Vault.
   *
   * @default true
   */
  readonly enableSoftDelete?: boolean;

  /**
   * Number of days that items should be retained after soft-delete (7-90).
   *
   * @default 90
   */
  readonly softDeleteRetentionInDays?: number;

  /**
   * Whether purge protection is enabled. Once enabled, this property cannot
   * be disabled.
   */
  readonly enablePurgeProtection?: boolean;

  /**
   * Whether the Key Vault accepts traffic from public networks.
   *
   * @default "Enabled"
   */
  readonly publicNetworkAccess?: "Enabled" | "Disabled";

  /**
   * Properties to ignore during updates
   *
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Key Vault properties for the request body
 */
export interface KeyVaultBodyProperties {
  readonly tenantId: string;
  readonly sku: KeyVaultSku;
  readonly accessPolicies?: KeyVaultAccessPolicy[];
  readonly networkAcls?: KeyVaultNetworkAcls;
  readonly enabledForDeployment?: boolean;
  readonly enabledForDiskEncryption?: boolean;
  readonly enabledForTemplateDeployment?: boolean;
  readonly enableRbacAuthorization?: boolean;
  readonly enableSoftDelete?: boolean;
  readonly softDeleteRetentionInDays?: number;
  readonly enablePurgeProtection?: boolean;
  readonly publicNetworkAccess?: string;
}

/**
 * The resource body interface for Azure Key Vault API calls
 */
export interface KeyVaultBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties: KeyVaultBodyProperties;
}

/**
 * Unified Azure Key Vault implementation
 *
 * This class provides a single, version-aware implementation that automatically
 * handles version resolution, schema validation, and property transformation
 * while maintaining full JSII compliance.
 *
 * Azure Key Vault is a cloud service for securely storing and accessing secrets,
 * keys, and certificates with centralized management and access control.
 *
 * @example
 * // Basic usage with automatic version resolution and current tenant:
 * const keyVault = new KeyVault(this, "kv", {
 *   name: "my-keyvault-1234",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 * });
 *
 * @example
 * // Usage with explicit version pinning and configuration:
 * const keyVault = new KeyVault(this, "kv", {
 *   name: "my-keyvault-1234",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   sku: { name: "premium" },
 *   apiVersion: "2023-07-01",
 *   enablePurgeProtection: true,
 *   publicNetworkAccess: "Disabled",
 *   networkAcls: {
 *     defaultAction: "Deny",
 *     bypass: "AzureServices",
 *   },
 * });
 *
 * @stability stable
 */
export class KeyVault extends AzapiResource {
  // Static initializer runs once when the class is first loaded
  static {
    AzapiResource.registerSchemas(KEY_VAULT_TYPE, ALL_KEY_VAULT_VERSIONS);
  }

  /**
   * The input properties for this Key Vault instance
   */
  public readonly props: KeyVaultProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly vaultUriOutput: cdktf.TerraformOutput;

  /**
   * Creates a new Azure Key Vault using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Key Vault
   */
  constructor(scope: Construct, id: string, props: KeyVaultProps) {
    // Validate softDeleteRetentionInDays bounds before delegating to base class
    if (props.softDeleteRetentionInDays !== undefined) {
      if (
        props.softDeleteRetentionInDays < 7 ||
        props.softDeleteRetentionInDays > 90
      ) {
        throw new Error(
          "softDeleteRetentionInDays must be between 7 and 90 days",
        );
      }
    }

    // If tenantId is not provided, fall back to the current AZAPI client tenant.
    // The DataAzapiClientConfig data source must be created on the parent scope
    // so it is available before super() is called.
    const resolvedTenantId =
      props.tenantId ??
      (() => {
        const clientConfig = new DataAzapiClientConfig(
          scope,
          `${id}_client_config`,
          {},
        );
        return `\${${clientConfig.fqn}.tenant_id}`;
      })();

    super(scope, id, { ...props, tenantId: resolvedTenantId } as KeyVaultProps);

    this.props = props;

    // Create Terraform outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Key Vault",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Key Vault",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Key Vault",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Key Vault",
    });

    this.vaultUriOutput = new cdktf.TerraformOutput(this, "vault_uri", {
      value: this.vaultUri,
      description:
        "The URI of the Key Vault for performing data plane operations",
    });

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.vaultUriOutput.overrideLogicalId("vault_uri");

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
    return "2024-11-01";
  }

  /**
   * Gets the Azure resource type for Key Vault
   */
  protected resourceType(): string {
    return KEY_VAULT_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Key Vaults
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as KeyVaultProps;

    const properties: any = {
      tenantId: typedProps.tenantId,
      sku: {
        name: typedProps.sku?.name ?? "standard",
        family: typedProps.sku?.family ?? "A",
      },
      enabledForDeployment: typedProps.enabledForDeployment ?? false,
      enabledForDiskEncryption: typedProps.enabledForDiskEncryption ?? false,
      enabledForTemplateDeployment:
        typedProps.enabledForTemplateDeployment ?? false,
      enableRbacAuthorization: typedProps.enableRbacAuthorization ?? true,
      enableSoftDelete: typedProps.enableSoftDelete ?? true,
      softDeleteRetentionInDays: typedProps.softDeleteRetentionInDays ?? 90,
      publicNetworkAccess: typedProps.publicNetworkAccess ?? "Enabled",
    };

    if (typedProps.enablePurgeProtection !== undefined) {
      properties.enablePurgeProtection = typedProps.enablePurgeProtection;
    }

    // accessPolicies is only meaningful when RBAC authorization is disabled.
    // Always include the array (Azure requires it) - default to empty.
    properties.accessPolicies = typedProps.accessPolicies ?? [];

    if (typedProps.networkAcls) {
      properties.networkAcls = {
        defaultAction: typedProps.networkAcls.defaultAction ?? "Allow",
        bypass: typedProps.networkAcls.bypass ?? "AzureServices",
        ipRules: typedProps.networkAcls.ipRules ?? [],
        virtualNetworkRules: typedProps.networkAcls.virtualNetworkRules ?? [],
      };
    }

    return {
      location: this.location,
      tags: this.allTags(),
      properties,
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR KEY VAULT OPERATIONS
  // =============================================================================

  /**
   * Get the data plane URI of the Key Vault
   *
   * Returns the deterministic Azure public cloud Key Vault URI in the form
   * `https://{name}.vault.azure.net/`. This avoids depending on the AZAPI
   * resource `output` attribute which is only populated for properties listed
   * in `response_export_values`.
   */
  public get vaultUri(): string {
    return `https://\${${this.terraformResource.fqn}.name}.vault.azure.net/`;
  }

  /**
   * Add a tag to the Key Vault
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Key Vault
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
