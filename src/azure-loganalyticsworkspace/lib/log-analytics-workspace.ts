/**
 * Unified Azure Log Analytics Workspace implementation using AzapiResource framework
 *
 * This class provides a version-aware implementation for Azure Log Analytics Workspace
 * that automatically handles version management, schema validation, and property
 * transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2023-09-01 (Active, Latest)
 * - 2022-10-01 (Active, Backward Compatibility)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full JSII compliance for multi-language support
 * - Configurable data retention, SKU, and workspace capping
 * - Public network access controls
 * - Workspace features configuration
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_LOG_ANALYTICS_WORKSPACE_VERSIONS,
  LOG_ANALYTICS_WORKSPACE_TYPE,
} from "./log-analytics-workspace-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * SKU configuration for Log Analytics Workspace
 */
export interface LogAnalyticsWorkspaceSku {
  /**
   * SKU name for the Log Analytics Workspace
   *
   * Available options:
   * - "Free" - Free tier (limited to 500MB/day, 7 day retention)
   * - "Standard" - Standard tier (legacy)
   * - "Premium" - Premium tier (legacy)
   * - "PerNode" - Per node pricing (legacy, for OMS customers)
   * - "PerGB2018" - Pay-as-you-go pricing based on data ingestion
   * - "Standalone" - Standalone tier (legacy)
   * - "CapacityReservation" - Commitment tier with reserved capacity
   *
   * @defaultValue "PerGB2018"
   */
  readonly name:
    | "Free"
    | "Standard"
    | "Premium"
    | "PerNode"
    | "PerGB2018"
    | "Standalone"
    | "CapacityReservation";

  /**
   * Capacity reservation level in GB per day
   * Only applicable when SKU name is "CapacityReservation"
   * Valid values: 100, 200, 300, 400, 500, 1000, 2000, 5000
   */
  readonly capacityReservationLevel?: number;
}

/**
 * Workspace capping configuration for daily data ingestion limits
 */
export interface LogAnalyticsWorkspaceCapping {
  /**
   * Daily volume cap in GB
   * A value of -1 means no cap
   */
  readonly dailyQuotaGb: number;
}

/**
 * Workspace features configuration
 */
export interface LogAnalyticsWorkspaceFeatures {
  /**
   * Flag indicating whether data export is enabled
   */
  readonly enableDataExport?: boolean;

  /**
   * Flag indicating whether data should be immediately purged after 30 days
   * instead of the configured retention period
   */
  readonly immediatePurgeDataOn30Days?: boolean;

  /**
   * Flag indicating whether log access using AADIAM is disabled
   */
  readonly disableLocalAuth?: boolean;

  /**
   * Flag indicating whether cluster resource permissions are enabled
   */
  readonly enableLogAccessUsingOnlyResourcePermissions?: boolean;
}

/**
 * Managed identity configuration for the workspace
 */
export interface LogAnalyticsWorkspaceIdentity {
  /**
   * Type of managed identity
   */
  readonly type:
    | "SystemAssigned"
    | "UserAssigned"
    | "SystemAssigned,UserAssigned"
    | "None";

  /**
   * User-assigned identity resource IDs
   * Required when type includes UserAssigned
   */
  readonly userAssignedIdentities?: { [key: string]: any };
}

/**
 * Properties for the unified Azure Log Analytics Workspace
 *
 * Extends AzapiResourceProps with Log Analytics Workspace specific properties
 */
export interface LogAnalyticsWorkspaceProps extends AzapiResourceProps {
  /**
   * Resource Group ID where the workspace will be created
   * The workspace will be created as a child of this resource group
   */
  readonly resourceGroupId: string;

  /**
   * Data retention period in days
   *
   * Values between 30 and 730 are supported for pay-as-you-go pricing.
   * Free tier is limited to 7 days.
   *
   * @defaultValue 30
   */
  readonly retentionInDays?: number;

  /**
   * SKU configuration for the workspace
   *
   * Determines pricing tier and capabilities of the workspace.
   *
   * @defaultValue { name: "PerGB2018" }
   */
  readonly sku?: LogAnalyticsWorkspaceSku;

  /**
   * Daily volume cap for data ingestion
   *
   * When the daily cap is reached, data ingestion stops until the next day.
   * A value of dailyQuotaGb: -1 means no cap.
   */
  readonly workspaceCapping?: LogAnalyticsWorkspaceCapping;

  /**
   * Public network access for data ingestion
   *
   * Controls whether data can be ingested over the public internet.
   *
   * @defaultValue "Enabled"
   */
  readonly publicNetworkAccessForIngestion?: "Enabled" | "Disabled";

  /**
   * Public network access for querying data
   *
   * Controls whether queries can be executed over the public internet.
   *
   * @defaultValue "Enabled"
   */
  readonly publicNetworkAccessForQuery?: "Enabled" | "Disabled";

  /**
   * Workspace features configuration
   *
   * Enables or disables specific workspace features like data export,
   * immediate purge, and local authentication.
   */
  readonly features?: LogAnalyticsWorkspaceFeatures;

  /**
   * Whether customer-managed keys are required for saved searches and alerts
   *
   * When enabled, all saved searches and alerts must use customer-managed keys.
   */
  readonly forceCmkForQuery?: boolean;

  /**
   * Resource ID of the default Data Collection Rule
   *
   * Associates a default DCR with the workspace for data collection.
   * Only available in API version 2023-09-01 and later.
   */
  readonly defaultDataCollectionRuleResourceId?: string;

  /**
   * Managed identity configuration for the workspace
   *
   * Enables managed identity authentication for the workspace.
   */
  readonly identity?: LogAnalyticsWorkspaceIdentity;
}

/**
 * Properties for the Log Analytics Workspace request body
 */
export interface LogAnalyticsWorkspaceBodyProperties {
  readonly retentionInDays?: number;
  readonly sku?: LogAnalyticsWorkspaceSku;
  readonly workspaceCapping?: LogAnalyticsWorkspaceCapping;
  readonly publicNetworkAccessForIngestion?: string;
  readonly publicNetworkAccessForQuery?: string;
  readonly features?: LogAnalyticsWorkspaceFeatures;
  readonly forceCmkForQuery?: boolean;
  readonly defaultDataCollectionRuleResourceId?: string;
}

/**
 * The resource body interface for Azure Log Analytics Workspace API calls
 */
export interface LogAnalyticsWorkspaceBody {
  readonly properties: LogAnalyticsWorkspaceBodyProperties;
  readonly identity?: LogAnalyticsWorkspaceIdentity;
}

/**
 * Unified Azure Log Analytics Workspace implementation
 *
 * This class provides a single, version-aware implementation that automatically handles version
 * resolution, schema validation, and property transformation while maintaining full JSII compliance.
 *
 * Log Analytics Workspace is the central destination for log data from Azure resources,
 * applications, and on-premises infrastructure. It enables querying, analysis, and
 * visualization of log data using Kusto Query Language (KQL).
 *
 * @example
 * // Basic Log Analytics Workspace with default settings:
 * const workspace = new LogAnalyticsWorkspace(this, "my-workspace", {
 *   name: "my-log-analytics",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 * });
 *
 * @example
 * // Log Analytics Workspace with custom retention and SKU:
 * const workspace = new LogAnalyticsWorkspace(this, "production-workspace", {
 *   name: "production-logs",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   retentionInDays: 90,
 *   sku: {
 *     name: "PerGB2018"
 *   },
 *   publicNetworkAccessForIngestion: "Enabled",
 *   publicNetworkAccessForQuery: "Enabled",
 *   tags: {
 *     environment: "production"
 *   }
 * });
 *
 * @example
 * // Log Analytics Workspace with capacity reservation:
 * const workspace = new LogAnalyticsWorkspace(this, "high-volume-workspace", {
 *   name: "high-volume-logs",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   retentionInDays: 365,
 *   sku: {
 *     name: "CapacityReservation",
 *     capacityReservationLevel: 500
 *   },
 *   workspaceCapping: {
 *     dailyQuotaGb: 100
 *   }
 * });
 *
 * @stability stable
 */
export class LogAnalyticsWorkspace extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      LOG_ANALYTICS_WORKSPACE_TYPE,
      ALL_LOG_ANALYTICS_WORKSPACE_VERSIONS,
    );
  }

  /**
   * The input properties for this Log Analytics Workspace instance
   */
  public readonly props: LogAnalyticsWorkspaceProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly workspaceIdOutput: cdktf.TerraformOutput;
  public readonly customerIdOutput: cdktf.TerraformOutput;

  /**
   * Creates a new Azure Log Analytics Workspace using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Log Analytics Workspace
   */
  constructor(scope: Construct, id: string, props: LogAnalyticsWorkspaceProps) {
    // Validate retention days if provided
    if (props.retentionInDays !== undefined) {
      if (props.retentionInDays < 30 || props.retentionInDays > 730) {
        throw new Error("retentionInDays must be between 30 and 730 days");
      }
    }

    // Validate capacity reservation level if CapacityReservation SKU is used
    if (props.sku?.name === "CapacityReservation") {
      const validLevels = [100, 200, 300, 400, 500, 1000, 2000, 5000];
      if (
        props.sku.capacityReservationLevel === undefined ||
        !validLevels.includes(props.sku.capacityReservationLevel)
      ) {
        throw new Error(
          `capacityReservationLevel must be one of ${validLevels.join(", ")} when using CapacityReservation SKU`,
        );
      }
    }

    super(scope, id, props);

    this.props = props;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Log Analytics Workspace",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Log Analytics Workspace",
    });

    this.workspaceIdOutput = new cdktf.TerraformOutput(this, "workspace_id", {
      value: `\${${this.terraformResource.fqn}.output.properties.customerId}`,
      description:
        "The unique identifier (workspace ID) of the Log Analytics Workspace",
    });

    this.customerIdOutput = new cdktf.TerraformOutput(this, "customer_id", {
      value: `\${${this.terraformResource.fqn}.output.properties.customerId}`,
      description:
        "The customer ID (same as workspace ID) of the Log Analytics Workspace",
    });

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.workspaceIdOutput.overrideLogicalId("workspace_id");
    this.customerIdOutput.overrideLogicalId("customer_id");
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   * Returns the latest stable version as the default
   */
  protected defaultVersion(): string {
    return "2023-09-01";
  }

  /**
   * Gets the Azure resource type for Log Analytics Workspace
   */
  protected resourceType(): string {
    return LOG_ANALYTICS_WORKSPACE_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   * Uses the framework's schema resolution to get the appropriate schema
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that this resource type requires a location
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   * Transforms the input properties into the JSON format expected by Azure REST API
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as LogAnalyticsWorkspaceProps;

    const body: any = {
      properties: {
        retentionInDays: typedProps.retentionInDays ?? 30,
        sku: typedProps.sku ?? { name: "PerGB2018" },
        publicNetworkAccessForIngestion:
          typedProps.publicNetworkAccessForIngestion ?? "Enabled",
        publicNetworkAccessForQuery:
          typedProps.publicNetworkAccessForQuery ?? "Enabled",
      },
    };

    // Add optional properties only if specified
    if (typedProps.workspaceCapping) {
      body.properties.workspaceCapping = typedProps.workspaceCapping;
    }

    if (typedProps.features) {
      body.properties.features = typedProps.features;
    }

    if (typedProps.forceCmkForQuery !== undefined) {
      body.properties.forceCmkForQuery = typedProps.forceCmkForQuery;
    }

    if (typedProps.defaultDataCollectionRuleResourceId) {
      body.properties.defaultDataCollectionRuleResourceId =
        typedProps.defaultDataCollectionRuleResourceId;
    }

    // Add identity at the top level if specified
    if (typedProps.identity) {
      body.identity = typedProps.identity;
    }

    return body;
  }

  /**
   * Resolves the parent resource ID for Log Analytics Workspace
   * Log Analytics Workspace is a top-level resource within a resource group
   *
   * @param props - The resource properties
   * @returns The parent resource ID (the resource group)
   */
  protected resolveParentId(props: any): string {
    return (props as LogAnalyticsWorkspaceProps).resourceGroupId;
  }
}
