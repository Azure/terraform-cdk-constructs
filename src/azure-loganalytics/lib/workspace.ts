import { LogAnalyticsDataExportRule } from "@cdktf/provider-azurerm/lib/log-analytics-data-export-rule";
import { LogAnalyticsSavedSearch } from "@cdktf/provider-azurerm/lib/log-analytics-saved-search";
import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { AzureResourceWithAlert } from "../../core-azure/lib";

/**
 * Properties for defining a data export in a Log Analytics Workspace.
 */
export interface DataExport {
  /**
   * The name of the data export.
   */
  readonly name: string;

  /**
   * The ID of the destination resource for the export.
   */
  readonly exportDestinationId: string;

  /**
   * An array of table names to be included in the data export.
   */
  readonly tableNames: string[];

  /**
   * Indicates whether the data export is enabled.
   */
  readonly enabled: boolean;
}

/**
 * Properties for defining a Log Analytics function.
 */
export interface LAFunctions {
  /**
   * The name of the function.
   */
  readonly name: string;

  /**
   * The display name for the function.
   */
  readonly displayName: string;

  /**
   * The query that the function will execute.
   */
  readonly query: string;

  /**
   * The alias to be used for the function.
   */
  readonly functionAlias: string;

  /**
   * A list of parameters for the function.
   */
  readonly functionParameters: string[];
}

/**
 * Properties for defining a saved query in a Log Analytics Workspace.
 */
export interface Queries {
  /**
   * The name of the saved query.
   */
  readonly name: string;

  /**
   * The category of the saved query.
   */
  readonly category: string;

  /**
   * The display name for the saved query.
   */
  readonly displayName: string;

  /**
   * The query string.
   */
  readonly query: string;
}

export interface WorkspaceProps {
  /**
   * The Azure Region to deploy.
   */
  readonly location: string;
  /**
   * The name of the Log Analytics Workspace.
   */
  readonly name: string;
  /**
   * An optional reference to the resource group in which to deploy the Workspace.
   * If not provided, the Workspace will be deployed in the default resource group.
   */
  readonly resourceGroup?: ResourceGroup;
  /**
   * The SKU of the Log Analytics Workspace.
   */
  readonly sku?: string;
  /**
   * The number of days of retention. Default is 30.
   */
  readonly retention?: number;
  /**
   * The tags to assign to the Resource Group.
   */
  readonly tags?: { [key: string]: string };
  /**
   * Create a DataExport for the Log Analytics Workspace.
   */
  readonly dataExport?: DataExport[];
  /**
   * A collection of Log Analytic functions.
   */
  readonly functions?: LAFunctions[];
  /**
   * A collection of log saved log analytics queries.
   */
  readonly queries?: Queries[];
}

export class Workspace extends AzureResourceWithAlert {
  readonly props: WorkspaceProps;
  public resourceGroup: ResourceGroup;
  public logAnalyticsWorkspace: LogAnalyticsWorkspace;
  public id: string;

  /**
   * Represents an Azure Log Analytics Workspace.
   *
   * This class is responsible for the creation and configuration of a Log Analytics Workspace in Azure. A Log Analytics Workspace
   * is a unique environment for Azure Monitor data, where data is collected, aggregated, and serves as the administrative boundary.
   * Within a workspace, data is collected from various sources and is used for analysis, visualization, and alerting. Configurations
   * can include data export rules, saved queries, and custom functions to enhance data analytics capabilities.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the Log Analytics workspace.
   * @param props - The properties required to configure the Log Analytics workspace, as defined in the WorkspaceProps interface. These include:
   *                - `location`: The Azure region where the workspace will be deployed.
   *                - `name`: The name of the workspace, which must be globally unique.
   *                - `resourceGroup`: Optional. Reference to the resource group for deployment.
   *                - `sku`: Optional. The SKU of the workspace, affecting pricing and features.
   *                - `retention`: Optional. The number of days data will be retained in the workspace.
   *                - `tags`: Optional. Tags to assign to the workspace for organizational purposes.
   *                - `dataExport`: Optional. Configurations for exporting data to other Azure resources.
   *                - `functions`: Optional. Custom functions defined within the workspace for query operations.
   *                - `queries`: Optional. Saved queries that can be used for data analysis or visualizations.
   *
   * Example usage:
   * ```typescript
   * new Workspace(this, 'MyLogAnalyticsWorkspace', {
   *   location: 'East US',
   *   name: 'myWorkspace',
   *   resourceGroup: myResourceGroup,
   *   sku: 'PerGB2018',
   *   retention: 60,
   *   tags: { department: 'IT' },
   *   functions: [{
   *     name: 'ErrorCount',
   *     displayName: 'Error Count',
   *     query: 'AzureActivity | summarize count() by bin(timestamp, 1h), type',
   *     functionAlias: 'error_count',
   *     functionParameters: 'timestamp, type'
   *   }],
   *   queries: [{
   *     name: 'HighCPUUsage',
   *     category: 'Performance',
   *     displayName: 'High CPU Usage',
   *     query: 'Perf | where CounterName == "% Processor Time" and CounterValue > 80'
   *   }]
   * });
   * ```
   * This class sets up the workspace and applies configurations, providing a centralized environment for monitoring and analytics.
   */
  constructor(scope: Construct, id: string, props: WorkspaceProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroup = this.setupResourceGroup(props);

    // Provide default values
    const sku = props.sku ?? "PerGB2018";
    const retention = props.retention ?? 30;

    const azurermLogAnalyticsWorkspaceLogAnalytics = new LogAnalyticsWorkspace(
      this,
      "log_analytics",
      {
        location: props.location,
        name: props.name,
        resourceGroupName: this.resourceGroup.name,
        retentionInDays: retention,
        sku: sku,
        tags: props.tags,
      },
    );

    this.id = azurermLogAnalyticsWorkspaceLogAnalytics.id;
    this.logAnalyticsWorkspace = azurermLogAnalyticsWorkspaceLogAnalytics;

    props.dataExport?.forEach((v, k) => {
      new LogAnalyticsDataExportRule(this, `export-${k}`, {
        destinationResourceId: v.exportDestinationId,
        enabled: v.enabled,
        name: v.name,
        resourceGroupName: this.resourceGroup.name,
        tableNames: v.tableNames,
        workspaceResourceId: azurermLogAnalyticsWorkspaceLogAnalytics.id,
      });
    });

    props.functions?.forEach((v, k) => {
      new LogAnalyticsSavedSearch(this, `function-${k}`, {
        category: "Function",
        displayName: v.displayName,
        functionAlias: v.functionAlias,
        functionParameters: v.functionParameters,
        logAnalyticsWorkspaceId: azurermLogAnalyticsWorkspaceLogAnalytics.id,
        name: v.name,
        query: v.query,
      });
    });

    props.queries?.forEach((v, k) => {
      new LogAnalyticsSavedSearch(this, `function-${k}`, {
        category: v.category,
        displayName: v.displayName,
        functionParameters: [],
        logAnalyticsWorkspaceId: azurermLogAnalyticsWorkspaceLogAnalytics.id,
        name: v.name,
        query: v.query,
      });
    });

    // Terraform Outputs
    const cdktfTerraformOutputLaID = new cdktf.TerraformOutput(
      this,
      "log_analytics_id",
      {
        value: azurermLogAnalyticsWorkspaceLogAnalytics.id,
      },
    );
    const cdktfTerraformOutputLaSharedKey = new cdktf.TerraformOutput(
      this,
      "log_analytics_primary_shared_key",
      {
        value: azurermLogAnalyticsWorkspaceLogAnalytics.primarySharedKey,
        sensitive: true,
      },
    );
    const cdktfTerraformOutputLaWorkspaceID = new cdktf.TerraformOutput(
      this,
      "log_analytics_workspace_id",
      {
        value: azurermLogAnalyticsWorkspaceLogAnalytics.workspaceId,
      },
    );

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    cdktfTerraformOutputLaID.overrideLogicalId("log_analytics_id");
    cdktfTerraformOutputLaSharedKey.overrideLogicalId(
      "log_analytics_primary_shared_key",
    );
    cdktfTerraformOutputLaWorkspaceID.overrideLogicalId(
      "log_analytics_workspace_id",
    );
  }
}
