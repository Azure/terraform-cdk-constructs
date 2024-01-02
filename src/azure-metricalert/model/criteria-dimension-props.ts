/**
 * @description The dimension properties for a Metric Alert Criteria.
 * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension}
 */
export interface MetricAlertCriteriaDimensionProp {
  /**
   * The dimension name.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension_name}
   */
  readonly name: string;

  /**
   * The dimension operator. Possible values are Include, Exclude and StartsWith.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension_operator}
   */
  readonly operator: string;

  /**
   * The dimension values. Use a wildcard * to collect all.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension_values}
   */
  readonly values: string[];
}
