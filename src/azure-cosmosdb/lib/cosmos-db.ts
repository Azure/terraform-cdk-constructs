/**
 * Unified Azure Cosmos DB Account implementation using VersionedAzapiResource framework
 *
 * Supported API Versions:
 * - 2023-11-15 (Deprecated)
 * - 2024-05-15 (Active)
 * - 2024-08-15 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - JSII compliance for multi-language support
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { ALL_COSMOS_DB_VERSIONS, COSMOS_DB_TYPE } from "./cosmos-db-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Consistency policy configuration for Cosmos DB Account
 */
export interface CosmosDbConsistencyPolicy {
  /**
   * The default consistency level
   * (Eventual, Session, BoundedStaleness, Strong, ConsistentPrefix)
   * @default "Session"
   */
  readonly defaultConsistencyLevel: string;

  /**
   * The maximum staleness prefix (only valid for BoundedStaleness)
   */
  readonly maxStalenessPrefix?: number;

  /**
   * The maximum interval in seconds (only valid for BoundedStaleness)
   */
  readonly maxIntervalInSeconds?: number;
}

/**
 * Geo-replication location configuration for Cosmos DB Account
 */
export interface CosmosDbGeoLocation {
  /**
   * The Azure region name (e.g. "eastus")
   */
  readonly locationName: string;

  /**
   * The failover priority of the region (0 = write region)
   */
  readonly failoverPriority: number;

  /**
   * Whether this region is zone-redundant
   * @default false
   */
  readonly isZoneRedundant?: boolean;
}

/**
 * Capability configuration for Cosmos DB Account
 */
export interface CosmosDbCapability {
  /**
   * The capability name (e.g. "EnableServerless", "EnableCassandra",
   * "EnableTable", "EnableGremlin", "EnableMongo", "EnableAggregationPipeline")
   */
  readonly name: string;
}

/**
 * Backup policy configuration for Cosmos DB Account
 */
export interface CosmosDbBackupPolicy {
  /**
   * The backup type ("Periodic" or "Continuous")
   */
  readonly type: string;

  /**
   * Periodic mode properties (only valid when type is "Periodic")
   */
  readonly periodicModeProperties?: CosmosDbPeriodicModeProperties;

  /**
   * Continuous mode properties (only valid when type is "Continuous")
   */
  readonly continuousModeProperties?: CosmosDbContinuousModeProperties;
}

/**
 * Periodic backup mode properties
 */
export interface CosmosDbPeriodicModeProperties {
  /**
   * Backup interval in minutes
   */
  readonly backupIntervalInMinutes?: number;

  /**
   * Backup retention interval in hours
   */
  readonly backupRetentionIntervalInHours?: number;

  /**
   * Storage redundancy for backups (Geo, Local, Zone)
   */
  readonly backupStorageRedundancy?: string;
}

/**
 * Continuous backup mode properties
 */
export interface CosmosDbContinuousModeProperties {
  /**
   * Continuous backup tier ("Continuous7Days" or "Continuous30Days")
   */
  readonly tier?: string;
}

/**
 * Identity configuration for Cosmos DB Account
 */
export interface CosmosDbIdentity {
  /**
   * The type of identity (None, SystemAssigned, UserAssigned, "SystemAssigned,UserAssigned")
   */
  readonly type: string;

  /**
   * User assigned identity IDs
   */
  readonly userAssignedIdentities?: { [key: string]: any };
}

/**
 * Properties for the unified Azure Cosmos DB Account
 *
 * Extends AzapiResourceProps with Cosmos DB Account specific properties
 */
export interface CosmosDbAccountProps extends AzapiResourceProps {
  /**
   * The kind of Cosmos DB Account
   * @default "GlobalDocumentDB"
   * @example "GlobalDocumentDB", "MongoDB", "Parse"
   */
  readonly kind?: string;

  /**
   * The database account offer type
   * @default "Standard"
   */
  readonly databaseAccountOfferType?: string;

  /**
   * The consistency policy for the Cosmos DB Account
   * @default { defaultConsistencyLevel: "Session" }
   */
  readonly consistencyPolicy?: CosmosDbConsistencyPolicy;

  /**
   * Geo-replication locations for the Cosmos DB Account.
   *
   * If not provided, a single location matching the account location will be
   * configured automatically with failover priority 0.
   */
  readonly geoLocations?: CosmosDbGeoLocation[];

  /**
   * Capabilities to enable on the Cosmos DB Account
   * @example [{ name: "EnableServerless" }]
   */
  readonly capabilities?: CosmosDbCapability[];

  /**
   * Whether public network access is enabled
   * @default "Enabled"
   */
  readonly publicNetworkAccess?: string;

  /**
   * Whether automatic failover is enabled
   * @default false
   */
  readonly enableAutomaticFailover?: boolean;

  /**
   * Whether multi-region writes are enabled
   * @default false
   */
  readonly enableMultipleWriteLocations?: boolean;

  /**
   * Whether the free tier is enabled (only one free-tier account is allowed per subscription)
   * @default false
   */
  readonly enableFreeTier?: boolean;

  /**
   * Whether virtual network filtering is enabled
   * @default false
   */
  readonly isVirtualNetworkFilterEnabled?: boolean;

  /**
   * The minimum TLS version (Tls, Tls11, Tls12)
   * @default "Tls12"
   */
  readonly minimalTlsVersion?: string;

  /**
   * Backup policy configuration
   */
  readonly backupPolicy?: CosmosDbBackupPolicy;

  /**
   * Managed identity configuration
   */
  readonly identity?: CosmosDbIdentity;

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];

  /**
   * Resource group ID where the Cosmos DB Account will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * Unified Azure Cosmos DB Account implementation
 *
 * Provides a single, version-aware implementation that automatically handles
 * version resolution, schema validation, and property transformation while
 * maintaining full backward compatibility.
 *
 * @example
 * // Basic usage with automatic version resolution:
 * const cosmosDb = new CosmosDbAccount(this, "cosmos", {
 *   name: "mycosmosaccount",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 * });
 *
 * @example
 * // Usage with explicit version pinning and serverless capability:
 * const cosmosDb = new CosmosDbAccount(this, "cosmos", {
 *   name: "mycosmosaccount",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   apiVersion: "2024-05-15",
 *   capabilities: [{ name: "EnableServerless" }],
 * });
 *
 * @stability stable
 */
export class CosmosDbAccount extends AzapiResource {
  // Static initializer runs once when the class is first loaded
  static {
    AzapiResource.registerSchemas(COSMOS_DB_TYPE, ALL_COSMOS_DB_VERSIONS);
  }

  public readonly props: CosmosDbAccountProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly documentEndpointOutput: cdktf.TerraformOutput;

  /**
   * Creates a new Azure Cosmos DB Account using the VersionedAzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Cosmos DB Account
   */
  constructor(scope: Construct, id: string, props: CosmosDbAccountProps) {
    super(scope, id, props);

    this.props = props;

    // Create Terraform outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Cosmos DB Account",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Cosmos DB Account",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Cosmos DB Account",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Cosmos DB Account",
    });

    this.documentEndpointOutput = new cdktf.TerraformOutput(
      this,
      "document_endpoint",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.documentEndpoint}`,
        description: "The document endpoint URL of the Cosmos DB Account",
      },
    );

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.documentEndpointOutput.overrideLogicalId("document_endpoint");

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
    return "2024-08-15";
  }

  /**
   * Gets the Azure resource type for Cosmos DB Accounts
   */
  protected resourceType(): string {
    return COSMOS_DB_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Cosmos DB Accounts
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as CosmosDbAccountProps;

    const consistencyPolicy: CosmosDbConsistencyPolicy =
      typedProps.consistencyPolicy ?? {
        defaultConsistencyLevel: "Session",
        maxIntervalInSeconds: 5,
        maxStalenessPrefix: 100,
      };

    const geoLocations: CosmosDbGeoLocation[] =
      typedProps.geoLocations && typedProps.geoLocations.length > 0
        ? typedProps.geoLocations
        : [
            {
              locationName: this.location as string,
              failoverPriority: 0,
              isZoneRedundant: false,
            },
          ];

    const properties: { [key: string]: any } = {
      databaseAccountOfferType:
        typedProps.databaseAccountOfferType ?? "Standard",
      consistencyPolicy: consistencyPolicy,
      locations: geoLocations,
      publicNetworkAccess: typedProps.publicNetworkAccess ?? "Enabled",
      enableAutomaticFailover: typedProps.enableAutomaticFailover ?? false,
      enableMultipleWriteLocations:
        typedProps.enableMultipleWriteLocations ?? false,
      enableFreeTier: typedProps.enableFreeTier ?? false,
      isVirtualNetworkFilterEnabled:
        typedProps.isVirtualNetworkFilterEnabled ?? false,
      minimalTlsVersion: typedProps.minimalTlsVersion ?? "Tls12",
    };

    if (typedProps.capabilities && typedProps.capabilities.length > 0) {
      properties.capabilities = typedProps.capabilities;
    }

    if (typedProps.backupPolicy) {
      properties.backupPolicy = typedProps.backupPolicy;
    }

    return {
      location: this.location,
      tags: this.allTags(),
      kind: typedProps.kind ?? "GlobalDocumentDB",
      identity: typedProps.identity,
      properties: properties,
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR COSMOS DB ACCOUNT OPERATIONS
  // =============================================================================

  /**
   * Get the document endpoint URL for the Cosmos DB Account
   */
  public get documentEndpoint(): string {
    return `\${${this.terraformResource.fqn}.output.properties.documentEndpoint}`;
  }

  /**
   * Add a tag to the Cosmos DB Account
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Cosmos DB Account
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
   * Applies ignore changes lifecycle rules
   *
   * Cosmos DB's REST API normalizes location values (e.g. "centralus" -> "Central US")
   * after the resource is created, which causes Terraform to detect drift on every
   * plan. To make the resource idempotent, the construct automatically adds the
   * normalized location fields to `ignore_changes`. Any user-specified
   * `ignoreChanges` are merged in.
   */
  private _applyIgnoreChanges(): void {
    const defaultIgnore = [
      "location",
      "body.location",
      "body.properties.locations",
    ];
    const userIgnore = this.props.ignoreChanges ?? [];
    const ignoreChanges = Array.from(
      new Set([...defaultIgnore, ...userIgnore]),
    );

    this.terraformResource.addOverride("lifecycle", [
      {
        ignore_changes: ignoreChanges,
      },
    ]);
  }
}
