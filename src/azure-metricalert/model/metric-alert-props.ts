import * as actionProps from "./action-props";
import * as criteriaProps from "./criteria-props";
import * as dynamicCriteriaProps from "./dynamic-criteria-props";

export interface BaseMetricAlertProps {
  /**
   * The name of the Metric Alert.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#name}
   */
  readonly name: string;

  /**
   * The description of this Metric Alert.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#description}
   */
  readonly description?: string;

  readonly action?: actionProps.MetricAlertActionProp[];

  /**
   * Should this Metric Alert be enabled?
   * @default true
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#enabled}
   */
  enabled?: boolean;

  /**
   * Should the alerts in this Metric Alert be auto resolved?
   * @default true
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#auto_mitigate}
   */
  automitigate?: boolean;

  /**
   * The evaluation frequency of this Metric Alert, represented in ISO 8601 duration format. Possible values are PT1M, PT5M, PT15M, PT30M and PT1H.
   * @default PT5M
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#frequency}
   */
  frequency?: string;

  /**
   * The severity of this Metric Alert. Possible values are 0, 1, 2, 3 and 4.
   * @default 3
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#severity}
   */
  severity?: number;

  /**
   * The resource type (e.g. Microsoft.Compute/virtualMachines) of the target resource. This is Required when using a Subscription as scope, a Resource Group as scope or Multiple Scopes.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#target_resource_type}
   */
  readonly targetResourceType?: string;

  /**
   * The location of the target resource. This is Required when using a Subscription as scope, a Resource Group as scope or Multiple Scopes.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#target_resource_location}
   */
  readonly targetResourceLocation?: string;

  /**
   * The period of time that is used to monitor alert activity, represented in ISO 8601 duration format. This value must be greater than frequency. Possible values are PT1M, PT5M, PT15M, PT30M, PT1H, PT6H, PT12H and P1D.
   * @default PT5M
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#window_size}
   */
  windowSize?: string;

  /**
   * A mapping of tags to assign to the resource.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#tags}
   */
  readonly tags?: { [key: string]: string };

  /**
   * One ore more criteria.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#criteria}
   */
  readonly criteria?: criteriaProps.MetricAlertCriteriaProp[];

  /**
   * One ore more dynamic criteria.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dynamic_criteria}
   */
  readonly dynamicCriteria?: dynamicCriteriaProps.MetricAlertDynamicCritiriaProps[];
}

export interface MetricAlertProps extends BaseMetricAlertProps {
  /**
   * The name of the resource group in which the Metric Alert is created.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#resource_group_name}
   */
  readonly resourceGroupName: string;

  /**
   * A set of strings of resource IDs at which the metric criteria should be applied.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#scopes}
   */
  readonly scopes: string[];
}
