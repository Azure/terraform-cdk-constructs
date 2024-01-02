import * as cdktf from 'cdktf';
import { MetricAlertActionProp } from './action-props';
import { MetricAlertCriteriaProp } from './criteria-props';
import { MetricAlertCriteriaDimensionProp } from './criteria-dimension-props';
import { MetricAlertDynamicCritiriaProps } from './dynamic-criteria-props';


/**
 * Generate a dynamic block of action properties for a Metric Alert.
 * @param props The action properties.
 * @returns The dynamic criteria properties for a Metric Alert.
 */
export function monitorMetricAlertActionToTerraform(props?: MetricAlertActionProp): any {
  if (!cdktf.canInspect(props)) { return props; }
  return {
    actionGroupId: props!.actionGroupId,
  }
}

/**
 * Generate a dynamic block of dimension properties for a Metric Alert.
 * @param props The dimension properties.
 * @returns The dynamic dimension properties for a Metric Alert.
 */
export function monitorMetricAlertCriteriaDimensionToTerraform(props?: MetricAlertCriteriaDimensionProp): any {
  if (!cdktf.canInspect(props)) { return props; }
  return {
    name: props!.name,
    operator: props!.operator,
    values: props!.values,
  }
}

/**
 * Generate a dynamic block of criteria properties for a Metric Alert.
 * @param props The criteria properties.
 * @returns The dynamic criteria properties for a Metric Alert.
 */
export function monitorMetricAlertCriteriaToTerraform(props?: MetricAlertCriteriaProp): any {
  if (!cdktf.canInspect(props)) { return props; }
  return {
    metricName: props!.metricName,
    metricNamespace: props!.metricNamespace,
    aggregation: props!.aggregation,
    operator: props!.operator,
    skipMetricValidation: props!.skipMetricValidation || false,
    threshold: props!.threshold,
    dimension: cdktf.listMapper(monitorMetricAlertCriteriaDimensionToTerraform, true)(props!.dimension),
  }
}

/**
 * Generate a dynamic block of dynamic criteria properties for a Metric Alert.
 * @param props The dynamic criteria properties.
 * @returns The dynamic criteria properties for a Metric Alert.
 */
export function monitorMetricAlertDynamicCriteriaToTerraform(props?: MetricAlertDynamicCritiriaProps): any {
  if (!cdktf.canInspect(props)) { return props; }
  return {
    metricName: props!.metricName,
    metricNamespace: props!.metricNamespace,
    aggregation: props!.aggregation,
    operator: props!.operator,
    skipMetricValidation: props!.skipMetricValidation || false,
    alertSensitivity: props!.alertSensitivity,
    evaluationTotalCount: props!.evaluationTotalCount || 4,
    evaluationFailureCount: props!.evaluationFailureCount || 4,
    ignoreDataBefore: props!.ignoreDataBefore,
    dimension: cdktf.listMapper(monitorMetricAlertCriteriaDimensionToTerraform, true)(props!.dimension),
  }
}
