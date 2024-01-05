import { LogAnalyticsDataExportRule } from "@cdktf/provider-azurerm/lib/log-analytics-data-export-rule";
import { LogAnalyticsSavedSearch } from "@cdktf/provider-azurerm/lib/log-analytics-saved-search";
import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
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
  readonly export_destination_id: string;

  /**
   * An array of table names to be included in the data export.
   */
  readonly table_names: string[];

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
  readonly display_name: string;

  /**
   * The query that the function will execute.
   */
  readonly query: string;

  /**
   * The alias to be used for the function.
   */
  readonly function_alias: string;

  /**
   * A list of parameters for the function.
   */
  readonly function_parameters: string[];
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
  readonly display_name: string;

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
   * The name of the Azure Resource Group.
   */
  readonly resource_group_name: string;
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
  readonly data_export?: DataExport[];
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
  readonly resourceGroupName: string;
  public readonly id: string;

  constructor(scope: Construct, id: string, props: WorkspaceProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroupName = props.resource_group_name;

    // Provide default values
    const sku = props.sku ?? "PerGB2018";
    const retention = props.retention ?? 30;

    const azurermLogAnalyticsWorkspaceLogAnalytics = new LogAnalyticsWorkspace(
      this,
      "log_analytics",
      {
        location: props.location,
        name: props.name,
        resourceGroupName: props.resource_group_name,
        retentionInDays: retention,
        sku: sku,
        tags: props.tags,
      },
    );

    this.id = azurermLogAnalyticsWorkspaceLogAnalytics.id;

    props.data_export?.forEach((v, k) => {
      new LogAnalyticsDataExportRule(this, `export-${k}`, {
        destinationResourceId: v.export_destination_id,
        enabled: v.enabled,
        name: v.name,
        resourceGroupName: props.resource_group_name,
        tableNames: v.table_names,
        workspaceResourceId: azurermLogAnalyticsWorkspaceLogAnalytics.id,
      });
    });

    props.functions?.forEach((v, k) => {
      new LogAnalyticsSavedSearch(this, `function-${k}`, {
        category: "Function",
        displayName: v.display_name,
        functionAlias: v.function_alias,
        functionParameters: v.function_parameters,
        logAnalyticsWorkspaceId: azurermLogAnalyticsWorkspaceLogAnalytics.id,
        name: v.name,
        query: v.query,
      });
    });

    props.queries?.forEach((v, k) => {
      new LogAnalyticsSavedSearch(this, `function-${k}`, {
        category: v.category,
        displayName: v.display_name,
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
