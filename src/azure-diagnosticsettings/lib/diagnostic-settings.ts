/**
 * Unified Azure Diagnostic Settings implementation using AzapiResource framework
 *
 * This class provides a version-aware implementation for Azure Diagnostic Settings
 * that automatically handles version management, schema validation, and property
 * transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2021-05-01-preview (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full JSII compliance for multi-language support
 * - Support for multiple destinations (Log Analytics, Storage, Event Hub)
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_DIAGNOSTIC_SETTINGS_VERSIONS,
  DIAGNOSTIC_SETTINGS_TYPE,
} from "./diagnostic-settings-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
  DiagnosticLogConfig,
  DiagnosticMetricConfig,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the unified Azure Diagnostic Settings
 *
 * Extends AzapiResourceProps with Diagnostic Settings specific properties
 */
export interface DiagnosticSettingsProps extends AzapiResourceProps {
  /**
   * Target resource ID to attach diagnostic settings to
   * This is the resource being monitored
   */
  readonly targetResourceId: string;

  /**
   * Log Analytics workspace ID for log/metric destination
   * At least one destination (workspace, storage, or event hub) must be specified
   */
  readonly workspaceId?: string;

  /**
   * Storage account ID for log/metric destination
   * At least one destination (workspace, storage, or event hub) must be specified
   */
  readonly storageAccountId?: string;

  /**
   * Event Hub authorization rule ID for streaming
   * Requires eventHubName to be specified as well
   */
  readonly eventHubAuthorizationRuleId?: string;

  /**
   * Event Hub name for streaming
   * Required when eventHubAuthorizationRuleId is specified
   */
  readonly eventHubName?: string;

  /**
   * Log categories to enable
   * Defines which log categories should be exported
   */
  readonly logs?: DiagnosticLogConfig[];

  /**
   * Metric categories to enable
   * Defines which metric categories should be exported
   */
  readonly metrics?: DiagnosticMetricConfig[];

  /**
   * Log Analytics destination type
   * Determines the table structure in Log Analytics
   * @defaultValue undefined (uses default behavior)
   */
  readonly logAnalyticsDestinationType?: string;
}

/**
 * Diagnostic Settings properties for the request body
 */
export interface DiagnosticSettingsBodyProperties {
  readonly workspaceId?: string;
  readonly storageAccountId?: string;
  readonly eventHubAuthorizationRuleId?: string;
  readonly eventHubName?: string;
  readonly logs?: DiagnosticLogConfig[];
  readonly metrics?: DiagnosticMetricConfig[];
  readonly logAnalyticsDestinationType?: string;
}

/**
 * The resource body interface for Azure Diagnostic Settings API calls
 */
export interface DiagnosticSettingsBody {
  readonly properties: DiagnosticSettingsBodyProperties;
}

/**
 * Unified Azure Diagnostic Settings implementation
 *
 * This class provides a single, version-aware implementation that automatically handles version
 * resolution, schema validation, and property transformation while maintaining full JSII compliance.
 *
 * Diagnostic Settings enable monitoring and observability by exporting platform logs and metrics
 * to one or more destinations including Log Analytics workspaces, Storage accounts, and Event Hubs.
 *
 * @example
 * // Basic diagnostic settings with Log Analytics:
 * const diagnostics = new DiagnosticSettings(this, "vm-diagnostics", {
 *   name: "vm-diagnostics",
 *   targetResourceId: virtualMachine.id,
 *   workspaceId: logAnalyticsWorkspace.id,
 *   logs: [{
 *     categoryGroup: "allLogs",
 *     enabled: true
 *   }],
 *   metrics: [{
 *     category: "AllMetrics",
 *     enabled: true
 *   }]
 * });
 *
 * @example
 * // Diagnostic settings with multiple destinations:
 * const diagnostics = new DiagnosticSettings(this, "storage-diagnostics", {
 *   name: "storage-diagnostics",
 *   targetResourceId: storageAccount.id,
 *   workspaceId: logAnalyticsWorkspace.id,
 *   storageAccountId: archiveStorageAccount.id,
 *   eventHubAuthorizationRuleId: eventHub.authRuleId,
 *   eventHubName: "monitoring-hub",
 *   logs: [{
 *     category: "StorageRead",
 *     enabled: true,
 *     retentionPolicy: {
 *       enabled: true,
 *       days: 90
 *     }
 *   }],
 *   metrics: [{
 *     category: "Transaction",
 *     enabled: true
 *   }]
 * });
 *
 * @stability stable
 */
export class DiagnosticSettings extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      DIAGNOSTIC_SETTINGS_TYPE,
      ALL_DIAGNOSTIC_SETTINGS_VERSIONS,
    );
  }

  /**
   * The input properties for this Diagnostic Settings instance
   */
  public readonly props: DiagnosticSettingsProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure Diagnostic Settings using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Diagnostic Settings
   */
  constructor(scope: Construct, id: string, props: DiagnosticSettingsProps) {
    // Validate that at least one destination is specified
    if (
      !props.workspaceId &&
      !props.storageAccountId &&
      !props.eventHubAuthorizationRuleId
    ) {
      throw new Error(
        "At least one destination (workspaceId, storageAccountId, or eventHubAuthorizationRuleId) must be specified for Diagnostic Settings",
      );
    }

    // Validate eventHubName is provided when eventHubAuthorizationRuleId is set
    if (props.eventHubAuthorizationRuleId && !props.eventHubName) {
      throw new Error(
        "eventHubName is required when eventHubAuthorizationRuleId is specified",
      );
    }

    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Diagnostic Settings",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Diagnostic Settings",
    });

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   * Returns the latest stable (non-preview) version as the default
   */
  protected defaultVersion(): string {
    return "2016-09-01";
  }

  /**
   * Gets the Azure resource type for Diagnostic Settings
   */
  protected resourceType(): string {
    return DIAGNOSTIC_SETTINGS_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   * Uses the framework's schema resolution to get the appropriate schema
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Creates the resource body for the Azure API call
   * Transforms the input properties into the JSON format expected by Azure REST API
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as DiagnosticSettingsProps;

    // Diagnostic settings don't have location or tags at the top level
    return {
      properties: {
        workspaceId: typedProps.workspaceId,
        storageAccountId: typedProps.storageAccountId,
        eventHubAuthorizationRuleId: typedProps.eventHubAuthorizationRuleId,
        eventHubName: typedProps.eventHubName,
        logs: typedProps.logs || [],
        metrics: typedProps.metrics || [],
        logAnalyticsDestinationType: typedProps.logAnalyticsDestinationType,
      },
    };
  }

  /**
   * Resolves the parent resource ID for Diagnostic Settings
   * Diagnostic Settings are child resources attached to the monitored resource
   *
   * @param props - The resource properties
   * @returns The parent resource ID (the target resource being monitored)
   */
  protected resolveParentId(props: any): string {
    return (props as DiagnosticSettingsProps).targetResourceId;
  }
}
