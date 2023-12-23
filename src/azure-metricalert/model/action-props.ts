/**
 * @description The Action to trigger when the Metric Alert fires.
 * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#action}
 */
export interface MetricAlertActionProp {
  /**
   * The ID of the Action Group.
   * @see {@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#action_group_id}
   */
  readonly actionGroupId: string[];
}
