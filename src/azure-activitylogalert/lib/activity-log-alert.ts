/**
 * Unified Azure Activity Log Alert implementation using AzapiResource framework
 *
 * This class provides a version-aware implementation for Azure Activity Log Alerts
 * that automatically handles version management, schema validation, and property
 * transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2020-10-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full JSII compliance for multi-language support
 * - Support for filtering by category, operation, and resource type
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_ACTIVITY_LOG_ALERT_VERSIONS,
  ACTIVITY_LOG_ALERT_TYPE,
} from "./activity-log-alert-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Activity log alert leaf condition
 */
export interface ActivityLogAlertLeafCondition {
  /**
   * The field name to filter on
   * Common values: category, operationName, resourceType, status, subStatus, resourceGroup
   */
  readonly field: string;

  /**
   * The value to match
   */
  readonly equalsValue: string;
}

/**
 * Activity log alert condition
 */
export interface ActivityLogAlertCondition {
  /**
   * All conditions that must be met (AND logic)
   */
  readonly allOf: ActivityLogAlertLeafCondition[];
}

/**
 * Activity log alert action group reference
 */
export interface ActivityLogAlertActionGroup {
  /**
   * The action group resource ID
   */
  readonly actionGroupId: string;

  /**
   * Webhook properties (optional)
   */
  readonly webhookProperties?: { [key: string]: string };
}

/**
 * Activity log alert actions configuration
 */
export interface ActivityLogAlertActions {
  /**
   * Action groups to trigger
   */
  readonly actionGroups?: ActivityLogAlertActionGroup[];
}

/**
 * Properties for the unified Azure Activity Log Alert
 *
 * Extends AzapiResourceProps with Activity Log Alert specific properties
 */
export interface ActivityLogAlertProps extends AzapiResourceProps {
  /**
   * Description of the alert rule
   */
  readonly description?: string;

  /**
   * Whether the alert rule is enabled
   * @defaultValue true
   */
  readonly enabled?: boolean;

  /**
   * Resource IDs that this alert is scoped to
   * Can be subscription, resource group, or specific resource IDs
   * @example ["/subscriptions/00000000-0000-0000-0000-000000000000"]
   * @example ["/subscriptions/.../resourceGroups/my-rg"]
   */
  readonly scopes: string[];

  /**
   * Alert condition with field-value pairs
   * All conditions are combined with AND logic
   */
  readonly condition: ActivityLogAlertCondition;

  /**
   * Action groups to notify
   */
  readonly actions?: ActivityLogAlertActions;

  /**
   * Resource group ID where the activity log alert will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * Activity Log Alert properties for the request body
 */
export interface ActivityLogAlertBodyProperties {
  readonly description?: string;
  readonly enabled: boolean;
  readonly scopes: string[];
  readonly condition: ActivityLogAlertCondition;
  readonly actions?: ActivityLogAlertActions;
}

/**
 * The resource body interface for Azure Activity Log Alert API calls
 */
export interface ActivityLogAlertBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties: ActivityLogAlertBodyProperties;
}

/**
 * Unified Azure Activity Log Alert implementation
 *
 * This class provides a single, version-aware implementation that automatically handles version
 * resolution, schema validation, and property transformation while maintaining full JSII compliance.
 *
 * Activity Log Alerts monitor Azure Activity Log events and trigger notifications when specific
 * operations occur, such as resource deletions, configuration changes, or service health events.
 *
 * @example
 * // Alert on VM deletion:
 * const vmDeletionAlert = new ActivityLogAlert(this, "vm-deletion", {
 *   name: "vm-deletion-alert",
 *   resourceGroupId: resourceGroup.id,
 *   scopes: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
 *   condition: {
 *     allOf: [
 *       { field: "category", equalsValue: "Administrative" },
 *       { field: "operationName", equalsValue: "Microsoft.Compute/virtualMachines/delete" },
 *       { field: "status", equalsValue: "Succeeded" }
 *     ]
 *   },
 *   actions: {
 *     actionGroups: [{
 *       actionGroupId: actionGroup.id
 *     }]
 *   }
 * });
 *
 * @example
 * // Alert on service health events:
 * const serviceHealthAlert = new ActivityLogAlert(this, "service-health", {
 *   name: "service-health-alert",
 *   description: "Alert on Azure service health events",
 *   resourceGroupId: resourceGroup.id,
 *   scopes: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
 *   condition: {
 *     allOf: [
 *       { field: "category", equalsValue: "ServiceHealth" },
 *       { field: "properties.incidentType", equalsValue: "Incident" }
 *     ]
 *   },
 *   actions: {
 *     actionGroups: [{
 *       actionGroupId: actionGroup.id,
 *       webhookProperties: {
 *         severity: "critical"
 *       }
 *     }]
 *   }
 * });
 *
 * @stability stable
 */
export class ActivityLogAlert extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      ACTIVITY_LOG_ALERT_TYPE,
      ALL_ACTIVITY_LOG_ALERT_VERSIONS,
    );
  }

  /**
   * The input properties for this Activity Log Alert instance
   */
  public readonly props: ActivityLogAlertProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure Activity Log Alert using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Activity Log Alert
   */
  constructor(scope: Construct, id: string, props: ActivityLogAlertProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Activity Log Alert",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Activity Log Alert",
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
   * Returns the most recent stable version as the default
   */
  protected defaultVersion(): string {
    return "2020-10-01";
  }

  /**
   * Gets the Azure resource type for Activity Log Alerts
   */
  protected resourceType(): string {
    return ACTIVITY_LOG_ALERT_TYPE;
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
    const typedProps = props as ActivityLogAlertProps;

    // Transform condition to map equalsValue back to equals for Azure API
    const transformedCondition = {
      allOf: typedProps.condition.allOf.map((leafCondition) => ({
        field: leafCondition.field,
        equals: leafCondition.equalsValue,
      })),
    };

    return {
      location: "global",
      tags: typedProps.tags || {},
      properties: {
        description: typedProps.description,
        enabled: typedProps.enabled !== undefined ? typedProps.enabled : true,
        scopes: typedProps.scopes,
        condition: transformedCondition,
        actions: typedProps.actions,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR ACTIVITY LOG ALERT OPERATIONS
  // =============================================================================

  /**
   * Add a tag to the Activity Log Alert
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Activity Log Alert
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public removeTag(key: string): void {
    if (this.props.tags && this.props.tags[key]) {
      delete this.props.tags[key];
    }
  }
}
