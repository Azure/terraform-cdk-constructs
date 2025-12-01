/**
 * Unified Azure Storage Account implementation using VersionedAzapiResource framework
 *
 * This class replaces all version-specific Storage Account implementations with a single
 * unified class that automatically handles version management, schema validation, and
 * property transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2023-01-01 (Active)
 * - 2023-05-01 (Active)
 * - 2024-01-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full backward compatibility with existing Storage Account interface
 * - JSII compliance for multi-language support
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_STORAGE_ACCOUNT_VERSIONS,
  STORAGE_ACCOUNT_TYPE,
  StorageAccountMonitoringOptions,
} from "./storage-account-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
  MonitoringConfig,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * SKU configuration for Storage Account
 */
export interface StorageAccountSku {
  /**
   * The SKU name (Standard_LRS, Standard_GRS, Standard_RAGRS, Standard_ZRS, Premium_LRS, Premium_ZRS)
   */
  readonly name: string;
}

/**
 * IP rule for network ACLs
 */
export interface StorageAccountIpRule {
  /**
   * IP address or CIDR range
   */
  readonly value: string;
}

/**
 * Virtual network rule for network ACLs
 */
export interface StorageAccountVirtualNetworkRule {
  /**
   * Virtual network resource ID
   */
  readonly id: string;
}

/**
 * Network ACL configuration for Storage Account
 */
export interface StorageAccountNetworkAcls {
  /**
   * Default action when no rule matches (Allow or Deny)
   */
  readonly defaultAction?: string;

  /**
   * IP rules for the storage account
   */
  readonly ipRules?: StorageAccountIpRule[];

  /**
   * Virtual network rules for the storage account
   */
  readonly virtualNetworkRules?: StorageAccountVirtualNetworkRule[];

  /**
   * Whether to bypass network rules for Azure services
   */
  readonly bypass?: string;
}

/**
 * Identity configuration for Storage Account
 */
export interface StorageAccountIdentity {
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
 * Encryption service configuration
 */
export interface StorageAccountEncryptionService {
  /**
   * Whether encryption is enabled
   */
  readonly enabled?: boolean;
}

/**
 * Encryption services configuration
 */
export interface StorageAccountEncryptionServices {
  /**
   * Blob service encryption
   */
  readonly blob?: StorageAccountEncryptionService;

  /**
   * File service encryption
   */
  readonly file?: StorageAccountEncryptionService;

  /**
   * Table service encryption
   */
  readonly table?: StorageAccountEncryptionService;

  /**
   * Queue service encryption
   */
  readonly queue?: StorageAccountEncryptionService;
}

/**
 * Encryption configuration for Storage Account
 */
export interface StorageAccountEncryption {
  /**
   * Encryption services (blob, file, table, queue)
   */
  readonly services?: StorageAccountEncryptionServices;

  /**
   * Key source (Microsoft.Storage or Microsoft.Keyvault)
   */
  readonly keySource?: string;
}

/**
 * Properties for the unified Azure Storage Account
 *
 * Extends VersionedAzapiResourceProps with Storage Account specific properties
 */
export interface StorageAccountProps extends AzapiResourceProps {
  /**
   * The SKU (pricing tier) for the Storage Account
   * @example { name: "Standard_LRS" }
   */
  readonly sku: StorageAccountSku;

  /**
   * The kind of Storage Account
   * @default "StorageV2"
   * @example "StorageV2", "BlobStorage", "BlockBlobStorage", "FileStorage"
   */
  readonly kind?: string;

  /**
   * The access tier for blob storage
   * @default "Hot"
   * @example "Hot", "Cool"
   */
  readonly accessTier?: string;

  /**
   * Whether to allow only HTTPS traffic
   * @default true
   */
  readonly enableHttpsTrafficOnly?: boolean;

  /**
   * The minimum TLS version required
   * @default "TLS1_2"
   */
  readonly minimumTlsVersion?: string;

  /**
   * Whether to allow public access to blobs
   * @default false
   */
  readonly allowBlobPublicAccess?: boolean;

  /**
   * Network ACL rules for the storage account
   */
  readonly networkAcls?: StorageAccountNetworkAcls;

  /**
   * Managed identity configuration
   */
  readonly identity?: StorageAccountIdentity;

  /**
   * Encryption settings
   */
  readonly encryption?: StorageAccountEncryption;

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];

  /**
   * Resource group ID where the storage account will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * Storage Account properties for the request body
 */
export interface StorageAccountBodyProperties {
  readonly accessTier?: string;
  readonly supportsHttpsTrafficOnly?: boolean;
  readonly minimumTlsVersion?: string;
  readonly allowBlobPublicAccess?: boolean;
  readonly networkAcls?: StorageAccountNetworkAcls;
  readonly encryption?: StorageAccountEncryption;
}

/**
 * The resource body interface for Azure Storage Account API calls
 */
export interface StorageAccountBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly sku: StorageAccountSku;
  readonly kind: string;
  readonly properties?: StorageAccountBodyProperties;
  readonly identity?: StorageAccountIdentity;
}

/**
 * Unified Azure Storage Account implementation
 *
 * This class provides a single, version-aware implementation that replaces all
 * version-specific Storage Account classes. It automatically handles version
 * resolution, schema validation, and property transformation while maintaining
 * full backward compatibility.
 *
 * @example
 * // Basic usage with automatic version resolution:
 * const storageAccount = new StorageAccount(this, "storage", {
 *   name: "mystorageaccount",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   sku: { name: "Standard_LRS" },
 * });
 *
 * @example
 * // Usage with explicit version pinning:
 * const storageAccount = new StorageAccount(this, "storage", {
 *   name: "mystorageaccount",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   sku: { name: "Standard_LRS" },
 *   apiVersion: "2023-05-01",
 * });
 *
 * @stability stable
 */
export class StorageAccount extends AzapiResource {
  // Static initializer runs once when the class is first loaded
  static {
    AzapiResource.registerSchemas(
      STORAGE_ACCOUNT_TYPE,
      ALL_STORAGE_ACCOUNT_VERSIONS,
    );
  }

  /**
   * Returns a production-ready monitoring configuration for Storage Accounts
   *
   * This static factory method provides a complete MonitoringConfig with sensible defaults
   * for storage account monitoring including availability, egress, transactions alerts, and deletion tracking.
   *
   * @param actionGroupId - The resource ID of the action group for alert notifications
   * @param workspaceId - Optional Log Analytics workspace ID for diagnostic settings
   * @param options - Optional configuration to customize thresholds and enable/disable specific alerts
   * @returns A complete MonitoringConfig object ready to use in StorageAccount props
   *
   * @example
   * // Basic usage with all defaults
   * const storageAccount = new StorageAccount(this, "storage", {
   *   // ... other properties ...
   *   monitoring: StorageAccount.defaultMonitoring(actionGroup.id, workspace.id)
   * });
   *
   * @example
   * // Custom thresholds
   * const storageAccount = new StorageAccount(this, "storage", {
   *   // ... other properties ...
   *   monitoring: StorageAccount.defaultMonitoring(
   *     actionGroup.id,
   *     workspace.id,
   *     {
   *       availabilityThreshold: 99.5,
   *       egressThreshold: 21474836480, // 20GB
   *       enableTransactionsAlert: false
   *     }
   *   )
   * });
   *
   * @stability stable
   */
  public static defaultMonitoring(
    actionGroupId: string,
    workspaceId?: string,
    options?: StorageAccountMonitoringOptions,
  ): MonitoringConfig {
    const metricAlerts: any[] = [];

    // Low Availability Alert
    if (options?.enableAvailabilityAlert !== false) {
      metricAlerts.push({
        name: "low-availability-alert",
        description:
          "Alert when storage account availability drops below threshold",
        severity: (options?.availabilityAlertSeverity ?? 1) as
          | 0
          | 1
          | 2
          | 3
          | 4,
        scopes: [], // Will be set automatically by base class
        evaluationFrequency: "PT5M",
        windowSize: "PT15M",
        criteria: {
          type: "StaticThreshold" as const,
          metricName: "Availability",
          metricNamespace: "Microsoft.Storage/storageAccounts",
          operator: "LessThan" as const,
          threshold: options?.availabilityThreshold ?? 99.9,
          timeAggregation: "Average" as const,
        },
        actions: [{ actionGroupId }],
      });
    }

    // High Egress Alert
    if (options?.enableEgressAlert !== false) {
      metricAlerts.push({
        name: "high-egress-alert",
        description: "Alert when storage account egress exceeds threshold",
        severity: (options?.egressAlertSeverity ?? 2) as 0 | 1 | 2 | 3 | 4,
        scopes: [], // Will be set automatically by base class
        evaluationFrequency: "PT5M",
        windowSize: "PT1H",
        criteria: {
          type: "StaticThreshold" as const,
          metricName: "Egress",
          metricNamespace: "Microsoft.Storage/storageAccounts",
          operator: "GreaterThan" as const,
          threshold: options?.egressThreshold ?? 10737418240,
          timeAggregation: "Total" as const,
        },
        actions: [{ actionGroupId }],
      });
    }

    // High Transactions Alert
    if (options?.enableTransactionsAlert !== false) {
      metricAlerts.push({
        name: "high-transactions-alert",
        description: "Alert when storage account transactions exceed threshold",
        severity: (options?.transactionsAlertSeverity ?? 2) as
          | 0
          | 1
          | 2
          | 3
          | 4,
        scopes: [], // Will be set automatically by base class
        evaluationFrequency: "PT5M",
        windowSize: "PT15M",
        criteria: {
          type: "StaticThreshold" as const,
          metricName: "Transactions",
          metricNamespace: "Microsoft.Storage/storageAccounts",
          operator: "GreaterThan" as const,
          threshold: options?.transactionsThreshold ?? 100000,
          timeAggregation: "Total" as const,
        },
        actions: [{ actionGroupId }],
      });
    }

    // Build diagnostic settings if workspace ID is provided
    const diagnosticSettings = workspaceId
      ? {
          name: "storage-account-diagnostics",
          targetResourceId: "", // Will be set automatically by base class
          workspaceId: workspaceId,
          logs: [{ categoryGroup: "allLogs", enabled: true }],
          metrics: [{ category: "AllMetrics", enabled: true }],
        }
      : undefined;

    // Build activity log alerts
    const activityLogAlerts =
      options?.enableDeletionAlert !== false
        ? [
            {
              name: "storage-account-deletion-alert",
              description: "Alert when storage account is deleted",
              scopes: [], // Will be set automatically by base class
              condition: {
                allOf: [
                  {
                    field: "operationName",
                    equalsValue: "Microsoft.Storage/storageAccounts/delete",
                  },
                ],
              },
              actions: {
                actionGroups: [{ actionGroupId }],
              },
            },
          ]
        : undefined;

    // Return complete config object
    return {
      enabled: true,
      diagnosticSettings: diagnosticSettings,
      metricAlerts: metricAlerts,
      activityLogAlerts: activityLogAlerts,
    };
  }

  public readonly props: StorageAccountProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly primaryEndpointsOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure Storage Account using the VersionedAzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Storage Account
   */
  constructor(scope: Construct, id: string, props: StorageAccountProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs

    // Create Terraform outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Storage Account",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Storage Account",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Storage Account",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Storage Account",
    });

    this.primaryEndpointsOutput = new cdktf.TerraformOutput(
      this,
      "primary_endpoints",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.primaryEndpoints}`,
        description: "The primary endpoints of the Storage Account",
      },
    );

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.primaryEndpointsOutput.overrideLogicalId("primary_endpoints");

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
    return "2024-01-01";
  }

  /**
   * Gets the Azure resource type for Storage Accounts
   */
  protected resourceType(): string {
    return STORAGE_ACCOUNT_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Storage Accounts
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as StorageAccountProps;
    return {
      location: this.location,
      tags: this.allTags(),
      sku: typedProps.sku,
      kind: typedProps.kind || "StorageV2",
      properties: {
        accessTier: typedProps.accessTier || "Hot",
        supportsHttpsTrafficOnly: typedProps.enableHttpsTrafficOnly !== false,
        minimumTlsVersion: typedProps.minimumTlsVersion || "TLS1_2",
        allowBlobPublicAccess: typedProps.allowBlobPublicAccess || false,
        networkAcls: typedProps.networkAcls,
        encryption: typedProps.encryption,
      },
      identity: typedProps.identity,
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR STORAGE ACCOUNT OPERATIONS
  // =============================================================================

  /**
   * Get the primary blob endpoint
   */
  public get primaryBlobEndpoint(): string {
    return `\${${this.terraformResource.fqn}.output.properties.primaryEndpoints.blob}`;
  }

  /**
   * Get the primary file endpoint
   */
  public get primaryFileEndpoint(): string {
    return `\${${this.terraformResource.fqn}.output.properties.primaryEndpoints.file}`;
  }

  /**
   * Get the primary queue endpoint
   */
  public get primaryQueueEndpoint(): string {
    return `\${${this.terraformResource.fqn}.output.properties.primaryEndpoints.queue}`;
  }

  /**
   * Get the primary table endpoint
   */
  public get primaryTableEndpoint(): string {
    return `\${${this.terraformResource.fqn}.output.properties.primaryEndpoints.table}`;
  }

  /**
   * Add a tag to the Storage Account
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Storage Account
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
