import { AzureLogAnalytics } from '.';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {StorageAccount} from "@cdktf/provider-azurerm/lib/storage-account";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';

function generateRandomString(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const rndName = generateRandomString(10);

// ...



const app = new App();
export class exampleAzureLogAnalytics extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const rg = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-${rndName}`,

    });

    const storageAccount = new StorageAccount(this, 'adls', {
      name: `adls-${rndName}`,
      resourceGroupName: rg.name,
      location: rg.location,
      accountTier: 'Standard',
      accountReplicationType: 'ZRS',
      accountKind: 'StorageV2',
      isHnsEnabled: true,
    });


    new AzureLogAnalytics(this, 'testLA', {
      name: `la-${rndName}`,
      location: 'eastus',
      retention: 90,
      sku: "PerGB2018",
      resource_group_name: rg.name,
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
  }
}

new exampleAzureLogAnalytics(app, "testAzureLogAnalytics");

app.synth();