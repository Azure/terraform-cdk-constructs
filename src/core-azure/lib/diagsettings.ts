import { DataAzurermMonitorDiagnosticCategories } from "@cdktf/provider-azurerm/lib/data-azurerm-monitor-diagnostic-categories";
import { MonitorDiagnosticSetting } from "@cdktf/provider-azurerm/lib/monitor-diagnostic-setting";
import { Construct } from "constructs";

export interface DiagnosticSettingsProps {
  /**
   * Name of the diagnostic settings resource
   */
  readonly name?: string;

  /**
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#eventhub_authorization_rule_id MonitorDiagnosticSetting#eventhub_authorization_rule_id}
   */
  readonly eventhubAuthorizationRuleId?: string;
  /**
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#eventhub_name MonitorDiagnosticSetting#eventhub_name}
   */
  readonly eventhubName?: string;
  /**
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#partner_solution_id MonitorDiagnosticSetting#partner_solution_id}
   */
  readonly partnerSolutionId?: string;
  /**
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#storage_account_id MonitorDiagnosticSetting#storage_account_id}
   */
  readonly storageAccountId?: string;
  /**
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#log_analytics_workspace_id MonitorDiagnosticSetting#log_analytics_workspace_id}
   */
  readonly logAnalyticsWorkspaceId?: string;
  /**
   * Target resource id to enable diagnostic settings on
   */
  readonly targetResourceId: string;

  /**
   * When set to 'Dedicated' logs sent to a Log Analytics workspace
   * will go into resource specific tables, instead of the legacy AzureDiagnostics table.
   */
  logAnalyticsDestinationType?: string | undefined;

  /**
   * Log Diagnostic categories
   * @default null
   */
  logCategories?: string[] | null;

  /**
   * Diagnostic Metrics
   * @default null
   */
  metricCategories?: string[] | null;
}

export class DiagnosticSettings extends Construct {
  readonly props: DiagnosticSettingsProps;

  constructor(scope: Construct, id: string, props: DiagnosticSettingsProps) {
    super(scope, id);

    this.props = props;

    // Get the list of available diagnostic categories
    const categories = new DataAzurermMonitorDiagnosticCategories(
      this,
      "diagcategories",
      {
        resourceId: props.targetResourceId,
      },
    );

    const logCategories = props.logCategories ?? categories.logCategoryTypes;
    const metricCategories = props.metricCategories ?? categories.metrics;

    const diagsettings = new MonitorDiagnosticSetting(this, "diagsettings", {
      name: props.name || "diagsettings",
      targetResourceId: props.targetResourceId,
      logAnalyticsDestinationType: props.logAnalyticsDestinationType,
      storageAccountId: props.storageAccountId,
      logAnalyticsWorkspaceId: props.logAnalyticsWorkspaceId,
      eventhubAuthorizationRuleId: props.eventhubAuthorizationRuleId,
      eventhubName: props.eventhubName,
      partnerSolutionId: props.partnerSolutionId,
    });

    diagsettings.addOverride("dynamic.enabled_log", {
      for_each: logCategories,
      content: {
        category: "${enabled_log.value}",
      },
    });

    diagsettings.addOverride("dynamic.metric", {
      for_each: metricCategories,
      content: {
        category: "${metric.value}",
      },
    });
  }
}
