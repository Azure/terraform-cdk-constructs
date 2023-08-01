import * as cdktf from "cdktf";
import { Construct } from 'constructs';
import {ApplicationInsights} from "@cdktf/provider-azurerm/lib/application-insights";

// Construct
/**
 * Properties for the resource group
 */

export interface ApplicationInsightsProps {
    /**
     * The Azure Region to deploy.
     */
    readonly location: string;
    /**
     * The name of the Application Insights resource.
     */
    readonly name: string;
    /**
     * The name of the Azure Resource Group to deploy to.
     */
    readonly resource_group_name: string;
    /**
     * The number of days of retention.
     */
    readonly retention_in_days?: number;
    /** 
     * The tags to assign to the Application Insights resource.
     */
    readonly tags?: { [key: string]: string; };   
    /**
     * The Application type.
     */
    readonly application_type: string;
    /**
     * The Application Insights daily data cap in GB.
     */
     readonly daily_data_cap_in_gb?: number;
    /**
     * The Application Insights daily data cap notifications disabled.
     */
     readonly daily_data_cap_notification_disabled?: boolean;
     /**
     * The id of the Log Analytics Workspace.
     */
    readonly workspace_id?: string;
}

export class AzureApplicationInsights extends Construct {
  readonly props: ApplicationInsightsProps;
  

  constructor(scope: Construct, id: string, props: ApplicationInsightsProps) {
    super(scope, id);

    this.props = props;;
    
    const azurermApplicationInsightsAppinsights = 
        new ApplicationInsights(this, "appinsights", {
            location: props.location,
            name: props.name,
            resourceGroupName: props.resource_group_name,
            tags: props.tags,
            applicationType: props.application_type,
            dailyDataCapInGb: props.daily_data_cap_in_gb,
            dailyDataCapNotificationsDisabled: props.daily_data_cap_notification_disabled,
            retentionInDays: props.retention_in_days,
            workspaceId: props.workspace_id
        }
      );
    

    // Terraform Outputs
    const cdktfTerraformOutputAppiID = new cdktf.TerraformOutput(this, "id", {
        value: azurermApplicationInsightsAppinsights.id
    });
    const cdktfTerraformOutputAppiName = new cdktf.TerraformOutput(this, "name", {
        value: azurermApplicationInsightsAppinsights.name
    });
    const cdktfTerraformOutputAppiAppId = new cdktf.TerraformOutput(this, "app_id", {
        value: azurermApplicationInsightsAppinsights.appId
    });
    const cdktfTerraformOutputAppiIKey = new cdktf.TerraformOutput(this, "instrumentation_key", {
        value: azurermApplicationInsightsAppinsights.instrumentationKey,
        sensitive: true,
    });
    const cdktfTerraformOutputAppiConnectStr = new cdktf.TerraformOutput(this, "connection_string", {
        value: azurermApplicationInsightsAppinsights.connectionString,
        sensitive: true,
    });

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    cdktfTerraformOutputAppiID.overrideLogicalId("id");
    cdktfTerraformOutputAppiName.overrideLogicalId("name");
    cdktfTerraformOutputAppiAppId.overrideLogicalId("app_id");
    cdktfTerraformOutputAppiIKey.overrideLogicalId("instrumentation_key");
    cdktfTerraformOutputAppiConnectStr.overrideLogicalId("connection_string");

  }
}
