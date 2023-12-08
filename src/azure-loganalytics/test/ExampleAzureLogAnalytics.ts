import * as cdktf from "cdktf";
import { AzureLogAnalytics } from '../';
import { App} from "cdktf";
import {BaseTestStack} from "../../testing";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {EventhubNamespace} from "@cdktf/provider-azurerm/lib/eventhub-namespace";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";


const app = new App();

export class exampleAzureLogAnalytics extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const clientConfig = new DataAzurermClientConfig(this, 'CurrentClientConfig', {});

    
    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-${this.name}`,

    });

    const namespace = new EventhubNamespace(this, 'ehns', {
      name: `ehns-${this.name}`,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      sku: 'Standard'
    });

    const storage = new StorageAccount(this, "storage", {
      name: `sta${this.name}88t97`,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      accountReplicationType: "LRS",
      accountTier: "Standard",
      minTlsVersion: "TLS1_2",
      publicNetworkAccessEnabled: false,
      networkRules: {
        bypass: ['AzureServices'],
        defaultAction: 'Deny',
      },
    });


    const logAnalyticsWorkspace = new AzureLogAnalytics(this, 'la', {
      name: `la-${this.name}`,
      location: 'eastus',
      retention: 90,
      sku: "PerGB2018",
      resource_group_name: resourceGroup.name,
      functions: [
        {
          name: "function_name_1",
          display_name:  "Example function 1",
          query:  "Event | where EventLevelName != 'Informational' | where TimeGenerated > ago(24h)",
          function_alias: "function_name_1",
          function_parameters: [],
        },
        {
        name: "function_name_2",
        display_name: "Example function 2",
        query:  "Event | where EventLevelName != 'Informational' | where TimeGenerated > ago(24h)",
        function_alias:  "function_name_2",
        function_parameters: ["typeArg:string=mail", "tagsArg:string=dc"],
        }      
      ],
      data_export: [
        {
          name: `export-test`,
          export_destination_id: namespace.id,
          table_names: ["Heartbeat"],
          enabled: true
        }
      ]
    });

    // Test RBAC
    logAnalyticsWorkspace.addAccess(clientConfig.objectId, "Contributor")
    logAnalyticsWorkspace.addAccess(clientConfig.objectId, "Monitoring Reader")

    // Test Diag Settings
    logAnalyticsWorkspace.addDiagSettings({storageAccountId: storage.id})
    
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