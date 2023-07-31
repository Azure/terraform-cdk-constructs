import * as cdktf from "cdktf";
import { Construct } from 'constructs';
import {LogAnalyticsWorkspace} from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import {LogAnalyticsDataExportRule} from "@cdktf/provider-azurerm/lib/log-analytics-data-export-rule";
import {LogAnalyticsSavedSearch} from "@cdktf/provider-azurerm/lib/log-analytics-saved-search";
// Construct
/**
 * Properties for the resource group
 */
 type DataExport = { name: string, export_destination_id: string, table_names : string[], enabled: boolean };
 type LAFunctions = { name: string, display_name: string, query: string, function_alias: string, function_parameters: string[] }
 type Queries = { name: string, category: string, display_name: string, query: string }

 export interface LogAnalyticsProps {
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
  readonly sku: string;
  /**
  * The number of days of retention.
  */
  readonly retention: number;
  /**
   * The tags to assign to the Resource Group.
   */
   readonly tags?: { [key: string]: string; };   
  /**
  * The RBAC groups to assign to the Resource Group.
  */
  readonly rbac?: Map<string, string>;
  /**
  * Create a DataExport for the Log Analytics Workspace.
  */
  readonly data_export?: DataExport[];
  /**
   * A collection of Log Analytic functions.
   */
  readonly functions?: LAFunctions[]
  /**
   * A collection of log saved log analytics queries.
   */
  readonly queries?: Queries[];
}

export class AzureLogAnalytics extends Construct {
  readonly props: LogAnalyticsProps;
  

  constructor(scope: Construct, id: string, props: LogAnalyticsProps) {
    super(scope, id);

    this.props = props;;

    const azurermLogAnalyticsWorkspaceLogAnalytics =
      new LogAnalyticsWorkspace(this, "log_analytics", {
        location: props.location,
        name: props.name,
        resourceGroupName: props.resource_group_name,
        retentionInDays: props.retention,
        sku: props.sku,
        tags: props.tags,
    });
    
    

    props.data_export?.forEach((v, k) => {
      new LogAnalyticsDataExportRule(this, `export-${k}`, {
        destinationResourceId: v.export_destination_id,
        enabled: v.enabled,
        name: v.name,
        resourceGroupName: props.resource_group_name,
        tableNames: v.table_names,
        workspaceResourceId: azurermLogAnalyticsWorkspaceLogAnalytics.id,
      });
    })

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
    })


    props.queries?.forEach((v, k) => {
      new LogAnalyticsSavedSearch(this, `function-${k}`, {
        category: v.category,
        displayName: v.display_name,
        functionParameters: [],
        logAnalyticsWorkspaceId: azurermLogAnalyticsWorkspaceLogAnalytics.id,
        name: v.name,
        query: v.query,
      });
    })


    // Terraform Outputs
    const cdktfTerraformOutputLaRg = new cdktf.TerraformOutput(this, "log_analytics_resource_group", {
      value: props.resource_group_name,
    });
    const cdktfTerraformOutputLaID = new cdktf.TerraformOutput(this, "log_analytics_id", {
      value: azurermLogAnalyticsWorkspaceLogAnalytics.id,
    });
    const cdktfTerraformOutputLaSharedKey = new cdktf.TerraformOutput(this, "log_analytics_primary_shared_key", {
      value: azurermLogAnalyticsWorkspaceLogAnalytics.primarySharedKey,
      sensitive: true,
    });
    const cdktfTerraformOutputLaWorkspaceID = new cdktf.TerraformOutput(this, "log_analytics_workspace_id", {
      value: azurermLogAnalyticsWorkspaceLogAnalytics.workspaceId,
    });

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    cdktfTerraformOutputLaRg.overrideLogicalId("log_analytics_resource_group");
    cdktfTerraformOutputLaID.overrideLogicalId("log_analytics_id");
    cdktfTerraformOutputLaSharedKey.overrideLogicalId("log_analytics_primary_shared_key")
    cdktfTerraformOutputLaWorkspaceID.overrideLogicalId("log_analytics_workspace_id")


  }
}
