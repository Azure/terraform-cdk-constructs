import { MetricAlertCriteriaBaseProps } from './criteria-base-props';

/**
 * @description The criteria properties for a Metric Alert.
 * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#criteria}
 */
export interface MetricAlertCriteriaProp extends MetricAlertCriteriaBaseProps {
  /**
   * The threshold value for the metric that triggers the alert.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#threshold}
   */
  readonly threshold: number;
}
