import { MetricAlertCriteriaDimensionProp } from "./criteria-dimension-props";

/**
 * @description The base criteria properties for a Metric Alert.
 * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#criteria}
 */
export interface MetricAlertCriteriaBaseProps {
  /**
   * The name of the metric to monitor.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_name}
   */
  readonly metricName: string;

  /**
   * The namespace of the metric.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_namespace}
   */
  readonly metricNamespace: string;

  /**
   * The aggregation type to apply to the metric. Possible values are Average, Count, Minimum, Maximum and Total.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#aggregation}
   */
  readonly aggregation: string;

  /**
   * The operator to apply to the metric. Possible values are Equals, NotEquals, GreaterThan, GreaterThanOrEqual, LessThan and LessThanOrEqual.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#operator}
   */
  readonly operator: string;

  /**
   * One or more dimensions.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension}
   */
  dimension?: MetricAlertCriteriaDimensionProp[];

  /**
   * Skip the metric validation to allow creating an alert rule on a custom metric that isn't yet emitted?
   * @default false.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#skip_metric_validation}
   */
  skipMetricValidation?: boolean;
}
