import { DataAzurermMonitorDiagnosticCategories } from "@cdktf/provider-azurerm/lib/data-azurerm-monitor-diagnostic-categories";
import { MonitorDiagnosticSetting } from "@cdktf/provider-azurerm/lib/monitor-diagnostic-setting";
import { Construct } from "constructs";

export interface BaseDiagnosticSettingsProps {
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
   * When set to 'Dedicated' logs sent to a Log Analytics workspace
   * will go into resource specific tables, instead of the legacy AzureDiagnostics table.
   */
  readonly logAnalyticsDestinationType?: string | undefined;

  /**
   * Log Diagnostic categories
   * @default null
   */
  readonly logCategories?: string[];

  /**
   * Diagnostic Metrics
   * @default null
   */
  readonly metricCategories?: string[];
}

export interface DiagnosticSettingsProps extends BaseDiagnosticSettingsProps {
  /**
   * Target resource id to enable diagnostic settings on
   */
  readonly targetResourceId: string;
}

export class DiagnosticSettings extends Construct {
  readonly props: DiagnosticSettingsProps;
  /**
   * Manages the diagnostic settings for monitoring Azure resources.
   *
   * This class is responsible for configuring Azure Monitor Diagnostic Settings to collect and route metrics and logs from
   * Azure resources to monitoring and analytics services. Diagnostic settings can be applied to resources like VMs,
   * App Services, and more, allowing collected data to be sent to Event Hubs, Log Analytics workspaces, or Azure Storage.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the diagnostic settings.
   * @param props - Configuration properties for diagnostic settings. These properties include:
   *                - `name`: Optional. The name of the diagnostic settings. If not provided, a unique name will be generated.
   *                - `targetResourceId`: The ID of the Azure resource to which these diagnostic settings apply.
   *                - `storageAccountId`: Optional. The ID of the Azure Storage account to which logs and metrics are sent.
   *                - `eventhubAuthorizationRuleId`: Optional. The authorization rule ID for the Event Hub namespace.
   *                - `eventhubName`: Optional. The name of the Event Hub where metrics and logs will be sent.
   *                - `logAnalyticsWorkspaceId`: Optional. The ID of the Log Analytics workspace to which logs and metrics are sent.
   *                - `partnerSolutionId`: Optional. ID of a partner solution that configurations are fetched from.
   *                - `logCategories`: Optional. Categories of logs to collect.
   *                - `metricCategories`: Optional. Categories of metrics to collect.
   *                - `logAnalyticsDestinationType`: Optional. Specifies whether logs should be stored in a dedicated table or the
   *                  legacy AzureDiagnostics table in the Log Analytics workspace.
   *
   * Example usage:
   * ```typescript
   * const resourceGroup = new ResourceGroup(this, 'ResourceGroup', { ... });
   * const diagnostics = new DiagnosticSettings(this, 'MyDiagnostics', {
   *   name: 'example-diagnostics',
   *   targetResourceId: resourceGroup.id,
   *   logAnalyticsWorkspaceId: logAnalyticsWorkspace.id,
   *   storageAccountId: storageAccount.id,
   *   logCategories: ['Write', 'Delete'],
   *   metricCategories: ['AllMetrics']
   * });
   * ```
   * This class configures the diagnostic settings to collect specific logs and metrics from the target resource and routes them
   * to specified destinations such as Log Analytics, Storage Account, or Event Hubs.
   */
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
