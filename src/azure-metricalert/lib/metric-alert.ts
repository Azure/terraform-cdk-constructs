/**
 * Unified Azure Metric Alert implementation using AzapiResource framework
 *
 * This class provides a version-aware implementation for Azure Metric Alerts
 * that automatically handles version management, schema validation, and property
 * transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2018-03-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full JSII compliance for multi-language support
 * - Support for both static and dynamic threshold criteria
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_METRIC_ALERT_VERSIONS,
  METRIC_ALERT_TYPE,
} from "./metric-alert-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Metric dimension for filtering
 */
export interface MetricDimension {
  /**
   * The dimension name
   */
  readonly name: string;

  /**
   * The operator (Include or Exclude)
   */
  readonly operator: "Include" | "Exclude";

  /**
   * The dimension values
   */
  readonly values: string[];
}

/**
 * Static threshold criteria configuration
 */
export interface StaticThresholdCriteria {
  /**
   * The criteria type
   */
  readonly type: "StaticThreshold";

  /**
   * The metric name
   */
  readonly metricName: string;

  /**
   * The metric namespace (optional)
   */
  readonly metricNamespace?: string;

  /**
   * The comparison operator
   */
  readonly operator:
    | "GreaterThan"
    | "LessThan"
    | "GreaterOrEqual"
    | "LessOrEqual"
    | "Equals";

  /**
   * The threshold value
   */
  readonly threshold: number;

  /**
   * The time aggregation method
   */
  readonly timeAggregation:
    | "Average"
    | "Count"
    | "Minimum"
    | "Maximum"
    | "Total";

  /**
   * Metric dimensions for filtering (optional)
   */
  readonly dimensions?: MetricDimension[];
}

/**
 * Metric alert failing periods configuration
 */
export interface MetricAlertFailingPeriods {
  /**
   * Number of evaluation periods
   */
  readonly numberOfEvaluationPeriods: number;

  /**
   * Minimum failing periods to trigger alert
   */
  readonly minFailingPeriodsToAlert: number;
}

/**
 * Dynamic threshold criteria configuration
 */
export interface DynamicThresholdCriteria {
  /**
   * The criteria type
   */
  readonly type: "DynamicThreshold";

  /**
   * The metric name
   */
  readonly metricName: string;

  /**
   * The metric namespace (optional)
   */
  readonly metricNamespace?: string;

  /**
   * The comparison operator
   */
  readonly operator: "GreaterThan" | "LessThan" | "GreaterOrLessThan";

  /**
   * The alert sensitivity (Low, Medium, High)
   */
  readonly alertSensitivity: "Low" | "Medium" | "High";

  /**
   * Failing periods configuration
   */
  readonly failingPeriods: MetricAlertFailingPeriods;

  /**
   * The time aggregation method
   */
  readonly timeAggregation:
    | "Average"
    | "Count"
    | "Minimum"
    | "Maximum"
    | "Total";

  /**
   * Metric dimensions for filtering (optional)
   */
  readonly dimensions?: MetricDimension[];

  /**
   * Ignore data before this date (ISO 8601 format)
   */
  readonly ignoreDataBefore?: string;
}

/**
 * Metric alert action configuration
 */
export interface MetricAlertAction {
  /**
   * The action group resource ID
   */
  readonly actionGroupId: string;

  /**
   * Webhook properties (optional)
   */
  readonly webHookProperties?: { [key: string]: string };
}

/**
 * Properties for the unified Azure Metric Alert
 *
 * Extends AzapiResourceProps with Metric Alert specific properties
 */
export interface MetricAlertProps extends AzapiResourceProps {
  /**
   * Description of the alert rule
   */
  readonly description?: string;

  /**
   * Alert severity (0=Critical, 1=Error, 2=Warning, 3=Informational, 4=Verbose)
   * @example 2
   */
  readonly severity: 0 | 1 | 2 | 3 | 4;

  /**
   * Whether the alert rule is enabled
   * @defaultValue true
   */
  readonly enabled?: boolean;

  /**
   * Resource IDs that this alert is scoped to
   * @example ["/subscriptions/.../resourceGroups/.../providers/Microsoft.Compute/virtualMachines/myVM"]
   */
  readonly scopes: string[];

  /**
   * How often the alert is evaluated (ISO 8601 duration)
   * @defaultValue "PT5M"
   * @example "PT1M", "PT5M", "PT15M"
   */
  readonly evaluationFrequency?: string;

  /**
   * Time window for aggregation (ISO 8601 duration)
   * @defaultValue "PT15M"
   * @example "PT5M", "PT15M", "PT30M", "PT1H"
   */
  readonly windowSize?: string;

  /**
   * Resource type of the target (for multi-resource alerts)
   * @example "Microsoft.Compute/virtualMachines"
   */
  readonly targetResourceType?: string;

  /**
   * Region of the target resource (for multi-resource alerts)
   * @example "eastus"
   */
  readonly targetResourceRegion?: string;

  /**
   * Alert criteria (static or dynamic threshold)
   */
  readonly criteria: StaticThresholdCriteria | DynamicThresholdCriteria;

  /**
   * Action groups to notify
   */
  readonly actions?: MetricAlertAction[];

  /**
   * Auto-resolve alerts when condition is no longer met
   * @defaultValue true
   */
  readonly autoMitigate?: boolean;

  /**
   * Resource group ID where the metric alert will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * Metric Alert properties for the request body
 */
export interface MetricAlertBodyProperties {
  readonly description?: string;
  readonly severity: number;
  readonly enabled: boolean;
  readonly scopes: string[];
  readonly evaluationFrequency: string;
  readonly windowSize: string;
  readonly targetResourceType?: string;
  readonly targetResourceRegion?: string;
  readonly criteria: any;
  readonly actions?: MetricAlertAction[];
  readonly autoMitigate: boolean;
}

/**
 * The resource body interface for Azure Metric Alert API calls
 */
export interface MetricAlertBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties: MetricAlertBodyProperties;
}

/**
 * Unified Azure Metric Alert implementation
 *
 * This class provides a single, version-aware implementation that automatically handles version
 * resolution, schema validation, and property transformation while maintaining full JSII compliance.
 *
 * Metric Alerts monitor Azure resource metrics and trigger notifications when thresholds are breached.
 * They support both static thresholds and dynamic thresholds based on machine learning.
 *
 * @example
 * // Static threshold alert for VM CPU:
 * const cpuAlert = new MetricAlert(this, "high-cpu", {
 *   name: "vm-high-cpu-alert",
 *   resourceGroupId: resourceGroup.id,
 *   severity: 2,
 *   scopes: [virtualMachine.id],
 *   criteria: {
 *     type: "StaticThreshold",
 *     metricName: "Percentage CPU",
 *     operator: "GreaterThan",
 *     threshold: 80,
 *     timeAggregation: "Average"
 *   },
 *   actions: [{
 *     actionGroupId: actionGroup.id
 *   }]
 * });
 *
 * @example
 * // Dynamic threshold alert with machine learning:
 * const dynamicAlert = new MetricAlert(this, "dynamic-cpu", {
 *   name: "vm-dynamic-cpu-alert",
 *   resourceGroupId: resourceGroup.id,
 *   severity: 2,
 *   scopes: [resourceGroup.id],
 *   targetResourceType: "Microsoft.Compute/virtualMachines",
 *   targetResourceRegion: "eastus",
 *   criteria: {
 *     type: "DynamicThreshold",
 *     metricName: "Percentage CPU",
 *     operator: "GreaterThan",
 *     alertSensitivity: "Medium",
 *     failingPeriods: {
 *       numberOfEvaluationPeriods: 4,
 *       minFailingPeriodsToAlert: 3
 *     },
 *     timeAggregation: "Average"
 *   },
 *   actions: [{
 *     actionGroupId: actionGroup.id
 *   }]
 * });
 *
 * @stability stable
 */
export class MetricAlert extends AzapiResource {
  static {
    AzapiResource.registerSchemas(METRIC_ALERT_TYPE, ALL_METRIC_ALERT_VERSIONS);
  }

  /**
   * The input properties for this Metric Alert instance
   */
  public readonly props: MetricAlertProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure Metric Alert using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Metric Alert
   */
  constructor(scope: Construct, id: string, props: MetricAlertProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Metric Alert",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Metric Alert",
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
    return "2018-03-01";
  }

  /**
   * Gets the Azure resource type for Metric Alerts
   */
  protected resourceType(): string {
    return METRIC_ALERT_TYPE;
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
    const typedProps = props as MetricAlertProps;

    // Transform criteria based on type
    let transformedCriteria: any;
    if (typedProps.criteria.type === "StaticThreshold") {
      transformedCriteria = {
        "odata.type":
          "Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria",
        allOf: [
          {
            criterionType: "StaticThresholdCriterion",
            name: "metric1",
            metricName: typedProps.criteria.metricName,
            metricNamespace: typedProps.criteria.metricNamespace,
            operator: typedProps.criteria.operator,
            threshold: typedProps.criteria.threshold,
            timeAggregation: typedProps.criteria.timeAggregation,
            dimensions: typedProps.criteria.dimensions || [],
          },
        ],
      };
    } else {
      transformedCriteria = {
        "odata.type":
          "Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria",
        allOf: [
          {
            criterionType: "DynamicThresholdCriterion",
            name: "metric1",
            metricName: typedProps.criteria.metricName,
            metricNamespace: typedProps.criteria.metricNamespace,
            operator: typedProps.criteria.operator,
            alertSensitivity: typedProps.criteria.alertSensitivity,
            failingPeriods: typedProps.criteria.failingPeriods,
            timeAggregation: typedProps.criteria.timeAggregation,
            dimensions: typedProps.criteria.dimensions || [],
            ignoreDataBefore: typedProps.criteria.ignoreDataBefore,
          },
        ],
      };
    }

    return {
      location: "global",
      tags: typedProps.tags || {},
      properties: {
        description: typedProps.description,
        severity: typedProps.severity,
        enabled: typedProps.enabled !== undefined ? typedProps.enabled : true,
        scopes: typedProps.scopes,
        evaluationFrequency: typedProps.evaluationFrequency || "PT5M",
        windowSize: typedProps.windowSize || "PT15M",
        targetResourceType: typedProps.targetResourceType,
        targetResourceRegion: typedProps.targetResourceRegion,
        criteria: transformedCriteria,
        actions: typedProps.actions || [],
        autoMitigate:
          typedProps.autoMitigate !== undefined
            ? typedProps.autoMitigate
            : true,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR METRIC ALERT OPERATIONS
  // =============================================================================

  /**
   * Add a tag to the Metric Alert
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Metric Alert
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public removeTag(key: string): void {
    if (this.props.tags && this.props.tags[key]) {
      delete this.props.tags[key];
    }
  }
}
