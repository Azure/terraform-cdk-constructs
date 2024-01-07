import { MonitorScheduledQueryRulesAlertV2 } from "@cdktf/provider-azurerm/lib/monitor-scheduled-query-rules-alert-v2";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import * as moment from "moment";

export interface BaseAzureQueryRuleAlertProps {
  /**
   * The name of the Monitor Scheduled Query Rule.
   */
  readonly name: string;
  /**
   * The name of the resource group in which the Monitor Scheduled Query Rule is created.
   */
  readonly resourceGroupName: string;
  /**
   * The location of the Monitor Scheduled Query Rule.
   */
  readonly location: string;
  /**
   * Specifies the criteria operator.
   * Possible values are Equal, GreaterThan, GreaterThanOrEqual, LessThan,and LessThanOrEqual.
   */
  readonly criteriaOperator: string;
  /**
   * The query to run on logs. The results returned by this query are used to populate the alert.
   */
  readonly criteriaQuery: string;
  /**
   * Specifies the criteria threshold value that activates the alert.
   */
  readonly criteriaThreshold: number;
  /**
   * The type of aggregation to apply to the data points in aggregation granularity.
   * Possible values are Average, Count, Maximum, Minimum,and Total.
   */
  readonly criteriatimeAggregationMethod: string;
  /**
   * Name of the dimension for criteria.
   */
  readonly criteriaDimensionName?: string;

  /**
   * Operator for dimension values. Possible values are Exclude, and Include.
   */
  readonly criteriaDimensionOperator?: string;

  /**
   * List of dimension values. Use a wildcard * to collect all.
   */
  readonly criteriaDimensionValues?: string[];

  /**
   * Specifies the number of violations to trigger an alert.
   * Should be smaller or equal to number_of_evaluation_periods.
   * Possible value is integer between 1 and 6.
   */
  readonly criteriaFailMinimumFailingPeriodsToTriggerAlert?: number;

  /**
   * Specifies the number of evaluation periods.
   * Possible value is integer between 1 and 6.
   */
  readonly criteriaFailNumberOfEvaluationPeriods?: number;
  /**
   * Specifies the column containing the metric measure number.
   * criteriaMetricMeasureColumn is required if criteriatimeAggregationMethod is Average, Maximum, Minimum, or Total.
   * And criteriaMetricMeasureColumn cannot be specified if criteriatimeAggregationMethod is Count.
   */
  readonly criteriaMetricMeasureColumn?: string;
  /**
   * How often the scheduled query rule is evaluated, represented in ISO 8601 duration format.
   * Possible values are PT1M, PT5M, PT10M, PT15M, PT30M, PT45M, PT1H, PT2H, PT3H, PT4H, PT5H, PT6H, P1D.
   */
  readonly evaluationFrequency: string;
  /**
   * Severity of the alert. Should be an integer between 0 and 4. Value of 0 is severest.
   */
  readonly severity: number;
  /**
   * Specifies the period of time in ISO 8601 duration format on which the Scheduled Query Rule will be executed (bin size).
   */
  readonly windowDuration: string;
  /**
   * Specifies the action group IDs to trigger when the alert fires.
   */
  readonly actionActionGroupId?: string[];
  /**
   * Specifies the flag that indicates whether the alert should be automatically resolved or not.
   * @default false
   */
  readonly autoMitigationEnabled?: boolean;
  /**
   * Specifies the flag which indicates whether this scheduled query rule check if storage is configured.
   * @default false
   */
  readonly workspaceAlertsStorageEnabled?: boolean;
  /**
   * Specifies the description of the scheduled query rule.
   */
  readonly description?: string;
  /**
   * Specifies the display name of the alert rule.
   */
  readonly displayName?: string;
  /**
   * Specifies the flag which indicates whether this scheduled query rule is enabled.
   * @default true
   */
  readonly enabled?: boolean;
  /**
   * Mute actions for the chosen period of time in ISO 8601 duration format after the alert is fired.
   * Possible values are PT5M, PT10M, PT15M, PT30M, PT45M, PT1H, PT2H, PT3H, PT4H, PT5H, PT6H, P1D and P2D.
   */
  readonly muteActionsAfterAlertDuration?: string;
  /**
   * Set this if the alert evaluation period is different from the query time range.
   * If not specified, the value is window_duration*number_of_evaluation_periods.
   * Possible values are PT5M, PT10M, PT15M, PT20M, PT30M, PT45M, PT1H, PT2H, PT3H, PT4H, PT5H, PT6H, P1D and P2D.
   */
  readonly queryTimeRangeOverride?: string;
  /**
   * Specifies the flag which indicates whether the provided query should be validated or not.
   * @default true
   */
  readonly skipQueryValidation?: boolean;
  /**
   * A mapping of tags which should be assigned to the Monitor Scheduled Query Rule.
   */
  readonly tags?: { [key: string]: string };
}

export interface AzureQueryRuleAlertProps extends BaseAzureQueryRuleAlertProps {
  /**
   * Specifies the list of resource IDs that this scheduled query rule is scoped to.
   */
  readonly scopes: string[];
}

export class QueryRuleAlert extends Construct {
  readonly queryRuleAlertProps: AzureQueryRuleAlertProps;
  public id: string;
  public resourceGroupName: string;

  /**
   * Constructs a new instance of the AzureQueryRuleAlert class.
   *
   * @param scope - The scope in which this construct is defined.
   * @param id - The ID of this construct.
   * @param props - The properties required for Azure Query Rule Alert.
   */
  constructor(scope: Construct, id: string, props: AzureQueryRuleAlertProps) {
    super(scope, id);

    // Properties validation
    const evaluationFrequencyOption = [
      "PT1M",
      "PT5M",
      "PT10M",
      "PT15M",
      "PT30M",
      "PT45M",
      "PT1H",
      "PT2H",
      "PT3H",
      "PT4H",
      "PT5H",
      "PT6H",
      "P1D",
    ];
    const windowDurationOption = [
      "PT1M",
      "PT5M",
      "PT10M",
      "PT15M",
      "PT30M",
      "PT45M",
      "PT1H",
      "PT2H",
      "PT3H",
      "PT4H",
      "PT5H",
      "PT6H",
      "P1D",
      "P2D",
    ];
    const muteActionsAfterAlertDurationOption = [
      "PT5M",
      "PT10M",
      "PT15M",
      "PT30M",
      "PT45M",
      "PT1H",
      "PT2H",
      "PT3H",
      "PT4H",
      "PT5H",
      "PT6H",
      "P1D",
      "P2D",
    ];
    const queryTimeRangeOverrideOption = [
      "PT5M",
      "PT10M",
      "PT15M",
      "PT20M",
      "PT30M",
      "PT45M",
      "PT1H",
      "PT2H",
      "PT3H",
      "PT4H",
      "PT5H",
      "PT6H",
      "P1D",
      "P2D",
    ];

    // Validate evaluationFrequency
    if (!evaluationFrequencyOption.includes(props.evaluationFrequency)) {
      throw new Error("invalid evaluationFrequency");
    }
    // Validate windowDuration
    if (!windowDurationOption.includes(props.windowDuration)) {
      throw new Error("invalid windowDuration");
    }
    // Validate muteActionsAfterAlertDuration
    if (
      props.muteActionsAfterAlertDuration &&
      !muteActionsAfterAlertDurationOption.includes(
        props.muteActionsAfterAlertDuration,
      )
    ) {
      throw new Error("invalid muteActionsAfterAlertDuration");
    }
    // Validate queryTimeRangeOverride
    if (
      props.queryTimeRangeOverride &&
      !queryTimeRangeOverrideOption.includes(props.queryTimeRangeOverride)
    ) {
      throw new Error("invalid queryTimeRangeOverride");
    }
    // The query look back which is windowDuration * numberOfEvaluationPeriods cannot exceed 48 hours.
    if (props.criteriaFailNumberOfEvaluationPeriods) {
      const windowDurationHours = moment
        .duration(props.windowDuration)
        .asHours();
      const numberOfEvaluationPeriods =
        props.criteriaFailNumberOfEvaluationPeriods;
      if (windowDurationHours * numberOfEvaluationPeriods > 48) {
        throw new Error("queryTimeRangeOverride cannot exceed 48 hours");
      }
    }

    this.queryRuleAlertProps = props;
    this.resourceGroupName = props.resourceGroupName;

    // Properties with default values
    const defaults = {
      autoMitigationEnabled: props.autoMitigationEnabled || false,
      workspaceAlertsStorageEnabled:
        props.workspaceAlertsStorageEnabled || false,
      enabled: props.enabled || true,
      skipQueryValidation: props.skipQueryValidation || true,
      metricMeasureColumn: props.criteriaMetricMeasureColumn || undefined,
    };

    const criteriaFailingPeriods =
      props.criteriaFailMinimumFailingPeriodsToTriggerAlert !== undefined &&
      props.criteriaFailNumberOfEvaluationPeriods !== undefined
        ? {
            minimumFailingPeriodsToTriggerAlert:
              props.criteriaFailMinimumFailingPeriodsToTriggerAlert,
            numberOfEvaluationPeriods:
              props.criteriaFailNumberOfEvaluationPeriods,
          }
        : undefined;

    const dimension =
      props.criteriaDimensionName &&
      props.criteriaDimensionOperator &&
      props.criteriaDimensionValues
        ? [
            {
              name: props.criteriaDimensionName,
              operator: props.criteriaDimensionOperator,
              values: props.criteriaDimensionValues,
            },
          ]
        : undefined;

    const azurermMonitorQueryRuleAlert = new MonitorScheduledQueryRulesAlertV2(
      this,
      "queryrulealert",
      {
        ...defaults,
        name: props.name,
        resourceGroupName: props.resourceGroupName,
        location: props.location,
        scopes: props.scopes,
        windowDuration: props.windowDuration,
        evaluationFrequency: props.evaluationFrequency,
        severity: props.severity,
        criteria: [
          {
            operator: props.criteriaOperator,
            query: props.criteriaQuery,
            threshold: props.criteriaThreshold,
            timeAggregationMethod: props.criteriatimeAggregationMethod,
            dimension: dimension,
            failingPeriods: criteriaFailingPeriods,
          },
        ],
        action: props.actionActionGroupId
          ? { actionGroups: props.actionActionGroupId }
          : undefined,
        tags: props.tags,
      },
    );

    // Output
    this.id = azurermMonitorQueryRuleAlert.id;
    const cdktfTerraformOutputQueryRuleAlertId = new cdktf.TerraformOutput(
      this,
      "id",
      {
        value: azurermMonitorQueryRuleAlert.id,
      },
    );
    cdktfTerraformOutputQueryRuleAlertId.overrideLogicalId(
      "query_rule_alert_id",
    );
  }
}
