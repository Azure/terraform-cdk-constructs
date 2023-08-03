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
          display_name:  "Example function 1",
          query:  "exampleQuery",
          function_alias: "function_name_1",
          function_parameters: [],
        },
        {
        name: "function_name_2",
        display_name: "Example function 2",
        query:  "exampleQuery",
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

    logAnalyticsWorkspace.addContributorAccess(clientConfig.objectId)
    logAnalyticsWorkspace.addReaderAccess(clientConfig.objectId)
    logAnalyticsWorkspace.addAccess(clientConfig.objectId, "Monitoring Reader", "43d0d8ad-25c7-4714-9337-8ba259a9fe05")

    
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