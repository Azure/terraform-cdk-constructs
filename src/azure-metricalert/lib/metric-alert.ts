import { MonitorMetricAlert } from "@cdktf/provider-azurerm/lib/monitor-metric-alert";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import * as moment from "moment";
import * as model from "../model";

export class MetricAlert extends Construct {
  readonly props: model.MetricAlertProps;
  public readonly id: string;

  /**
   * Constructs a new instance of the MetricAlert class.
   *
   * @param scope - The scope in which this construct is defined.
   * @param id - The ID of this construct.
   * @param props - The properties required for Metric Alert.
   */
  constructor(scope: Construct, id: string, props: model.MetricAlertProps) {
    super(scope, id);

    this.props = props;

    // Setup default values
    this.props.enabled = props.enabled ?? true;
    this.props.automitigate = props.automitigate ?? true;
    this.props.frequency = props.frequency ?? "PT5M";
    this.props.severity = props.severity ?? 3;
    this.props.windowSize = props.windowSize ?? props.frequency ?? "PT5M";

    // Properties validation
    this.ValidatePropsFrequency();
    this.ValidatePropsWindowSize();
    this.ValidatePropsWindowSizeGreaterThanFrequency();

    // Create Metric Alert
    const metricAlert = new MonitorMetricAlert(this, "metricAlert", {
      name: props.name,
      resourceGroupName: props.resourceGroupName,
      scopes: props.scopes,
      description: props.description,
      targetResourceType: props.targetResourceType,
      targetResourceLocation: props.targetResourceLocation,
      action: cdktf.listMapper(
        model.monitorMetricAlertActionToTerraform,
        true,
      )(this.props.action),
      tags: props.tags,
      enabled: this.props.enabled,
      autoMitigate: this.props.automitigate,
      frequency: this.props.frequency,
      severity: this.props.severity,
      windowSize: this.props.windowSize,
      criteria: cdktf.listMapper(
        model.monitorMetricAlertCriteriaToTerraform,
        true,
      )(this.props.criteria),
      dynamicCriteria: cdktf.listMapper(
        model.monitorMetricAlertDynamicCriteriaToTerraform,
        true,
      )(this.props.dynamicCriteria),
    });

    // Output properties
    this.id = metricAlert.id;
    const cdktfTerraformOutputMetricAlertId = new cdktf.TerraformOutput(
      this,
      "id",
      {
        value: metricAlert.id,
      },
    );
    cdktfTerraformOutputMetricAlertId.overrideLogicalId("id");
  }

  private ValidatePropsFrequency() {
    const frequencyOptions = ["PT1M", "PT5M", "PT15M", "PT30M", "PT1H"];
    if (!frequencyOptions.includes(this.props.frequency ?? "NotSet")) {
      throw new Error(`frequency must be one of ${frequencyOptions}`);
    }
  }

  private ValidatePropsWindowSize() {
    const windowSizeOptions = [
      "PT1M",
      "PT5M",
      "PT15M",
      "PT30M",
      "PT1H",
      "PT6H",
      "PT12H",
      "P1D",
    ];
    if (!windowSizeOptions.includes(this.props.windowSize ?? "NotSet")) {
      throw new Error(`windowSize must be one of ${windowSizeOptions}`);
    }
  }

  private ValidatePropsWindowSizeGreaterThanFrequency() {
    const f = moment.duration(this.props.frequency);
    const w = moment.duration(this.props.windowSize);
    if (w < f) {
      throw new Error("windowSize must be greater than frequency");
    }
  }
}
