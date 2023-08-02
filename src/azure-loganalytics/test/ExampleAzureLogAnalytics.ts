import * as cdktf from "cdktf";
import { AzureLogAnalytics } from '../';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {StorageAccount} from "@cdktf/provider-azurerm/lib/storage-account";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import { generateRandomString } from '../../util/randomString';
import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";


const rndName = generateRandomString(10);


const app = new App();

export class exampleAzureLogAnalytics extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-${rndName}`,

    });

    const storageAccount = new StorageAccount(this, 'adls', {
      name: `adls${rndName}`,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      accountTier: 'Standard',
      accountReplicationType: 'ZRS',
      accountKind: 'StorageV2',
      isHnsEnabled: true,
    });


    const logAnalyticsWorkspace = new AzureLogAnalytics(this, 'testLA', {
      name: `la-${rndName}`,
      location: 'eastus',
      retention: 90,
      sku: "PerGB2018",
      resource_group_name: resourceGroup.name,
      functions: [
        {
          name: "function_name_1",
          display_name:  "Get spark event listener events",
          query:  "let results=SparkListenerEvent_CL\n|  where  Event_s  contains \"SparkListenerStageSubmitted\"\n| extend metricsns=columnifexists(\"Properties_spark_metrics_namespace_s\",Properties_spark_app_id_s)\r\n| extend apptag=iif(isnotempty(metricsns),metricsns,Properties_spark_app_id_s)\r\n| project Stage_Info_Stage_ID_d,apptag,TimeGenerated,Properties_spark_databricks_clusterUsageTags_clusterName_s\n| order by TimeGenerated asc  nulls last \n| join kind= inner (\n    SparkListenerEvent_CL\n    |  where Event_s contains \"SparkListenerStageCompleted\"  \n    | extend stageDuration=Stage_Info_Completion_Time_d - Stage_Info_Submission_Time_d\n) on Stage_Info_Stage_ID_d;\nresults\n | extend slice = strcat(Properties_spark_databricks_clusterUsageTags_clusterName_s,\"-\",apptag,\" \",Stage_Info_Stage_Name_s) \n| extend stageDuration=Stage_Info_Completion_Time_d - Stage_Info_Submission_Time_d \n| summarize percentiles(stageDuration,10,30,50,90)  by bin(TimeGenerated,  1m), slice\n| order by TimeGenerated asc nulls last\n\n",
          function_alias: "function_name_1",
          function_parameters: [],
        },
        {
        name: "function_name_2",
        display_name: "Get spark event listener latency",
        query:  "let results=SparkListenerEvent_CL\n|  where  Event_s  contains \"SparkListenerStageSubmitted\"\n| extend metricsns=columnifexists(\"Properties_spark_metrics_namespace_s\",Properties_spark_app_id_s)\r\n| extend apptag=iif(isnotempty(metricsns),metricsns,Properties_spark_app_id_s)\r\n| project Stage_Info_Stage_ID_d,apptag,TimeGenerated,Properties_spark_databricks_clusterUsageTags_clusterName_s\n| order by TimeGenerated asc  nulls last \n| join kind= inner (\n    SparkListenerEvent_CL\n    |  where Event_s contains \"SparkListenerStageCompleted\"  \n    | extend stageDuration=Stage_Info_Completion_Time_d - Stage_Info_Submission_Time_d\n) on Stage_Info_Stage_ID_d;\nresults\n | extend slice = strcat(Properties_spark_databricks_clusterUsageTags_clusterName_s,\"-\",apptag,\" \",Stage_Info_Stage_Name_s) \n| extend stageDuration=Stage_Info_Completion_Time_d - Stage_Info_Submission_Time_d \n| summarize percentiles(stageDuration,10,30,50,90)  by bin(TimeGenerated,  1m), slice\n| order by TimeGenerated asc nulls last\n\n",
        function_alias:  "function_name_2",
        function_parameters: ["typeArg:string=mail", "tagsArg:string=dc"],
        }     
      ],
      data_export: [
        {
          name: `export-${rndName}`,
          export_destination_id: storageAccount.id,
          table_names: ["Heartbeat"],
          enabled: true
        }
      ]
    });

    // Add RBAC access
    const clientConfig = new DataAzurermClientConfig(this, 'CurrentClientConfig', {});


    logAnalyticsWorkspace.addContributorAccess(clientConfig.id)
    logAnalyticsWorkspace.addReaderAccess(clientConfig.id)
    logAnalyticsWorkspace.addAccess(clientConfig.id, "Monitoring Reader ")

    
    // Outputs to use for End to End Test
    const cdktfTerraformOutputRG = new cdktf.TerraformOutput(this, "resource_group_name", {
      value: resourceGroup.name,
    });
    const cdktfTerraformOutputLAName = new cdktf.TerraformOutput(this, "loganalytics_workspace_name", {
      value: logAnalyticsWorkspace.props.name,
    });
    const cdktfTerraformOutputLASku = new cdktf.TerraformOutput(this, "loganalytics_workspace_sku", {
      value: logAnalyticsWorkspace.props.sku,
    });
    const cdktfTerraformOutputLARetention = new cdktf.TerraformOutput(this, "loganalytics_workspace_retention", {
      value: logAnalyticsWorkspace.props.retention,
    });

    cdktfTerraformOutputRG.overrideLogicalId("resource_group_name");
    cdktfTerraformOutputLAName.overrideLogicalId("loganalytics_workspace_name");
    cdktfTerraformOutputLASku.overrideLogicalId("loganalytics_workspace_sku");
    cdktfTerraformOutputLARetention.overrideLogicalId("loganalytics_workspace_retention");

  }
}


new exampleAzureLogAnalytics(app, "testAzureLogAnalytics");

app.synth();