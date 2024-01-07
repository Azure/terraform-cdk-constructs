import { MetricAlertCriteriaBaseProps } from "./criteria-base-props";

/**
 * @description The dynamic criteria properties for a Metric Alert.
 * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dynamic_criteria}
 */
export interface MetricAlertDynamicCritiriaProps
  extends MetricAlertCriteriaBaseProps {
  /**
   * The extent of deviation required to trigger an alert. Possible values are Low, Medium and High.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#alert_sensitivity}
   */
  readonly alertSensitivity: string;

  /**
   * he number of aggregated lookback points. The lookback time window is calculated based on the aggregation granularity (window_size) and the selected number of aggregated points.
   * @default 4
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#evaluation_total_count}
   */
  readonly evaluationTotalCount?: number;

  /**
   * The number of violations to trigger an alert. Should be smaller or equal to evaluation_total_count.
   * @default 4
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#evaluation_failure_count}
   */
  readonly evaluationFailureCount?: number;

  /**
   * The ISO8601 date from which to start learning the metric historical data and calculate the dynamic thresholds.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#ignore_data_before}
   */
  readonly ignoreDataBefore?: string;
}
