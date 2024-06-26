import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { EventhubNamespace } from "@cdktf/provider-azurerm/lib/eventhub-namespace";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";
import * as cdktf from "cdktf";
import { App } from "cdktf";
import { Construct } from "constructs";
import * as la from "..";
import { BaseTestStack } from "../../testing";

const app = new App();

export class exampleAzureLogAnalytics extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const clientConfig = new DataAzurermClientConfig(
      this,
      "CurrentClientConfig",
      {},
    );

    new AzurermProvider(this, "azureFeature", {
      features: {},
    });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: "eastus",
      name: `rg-${this.name}`,
    });

    const namespace = new EventhubNamespace(this, "ehns", {
      name: `ehns-${this.name}`,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      sku: "Standard",
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
        bypass: ["AzureServices"],
        defaultAction: "Deny",
      },
    });

    const logAnalyticsWorkspace = new la.Workspace(this, "la", {
      name: `la-${this.name}`,
      location: "eastus",
      retention: 90,
      sku: "PerGB2018",
      resourceGroup: resourceGroup,
      functions: [
        {
          name: "function_name_1",
          displayName: "Example function 1",
          query:
            "Event | where EventLevelName != 'Informational' | where TimeGenerated > ago(24h)",
          functionAlias: "function_name_1",
          functionParameters: [],
        },
        {
          name: "function_name_2",
          displayName: "Example function 2",
          query:
            "Event | where EventLevelName != 'Informational' | where TimeGenerated > ago(24h)",
          functionAlias: "function_name_2",
          functionParameters: ["typeArg:string=mail", "tagsArg:string=dc"],
        },
      ],
      dataExport: [
        {
          name: "export-test",
          exportDestinationId: namespace.id,
          tableNames: ["Heartbeat"],
          enabled: true,
        },
      ],
    });

    // Test RBAC
    logAnalyticsWorkspace.addAccess(clientConfig.objectId, "Contributor");
    logAnalyticsWorkspace.addAccess(clientConfig.objectId, "Monitoring Reader");

    // Test Diag Settings
    logAnalyticsWorkspace.addDiagSettings({ storageAccountId: storage.id });

    // Test Metric Alert
    logAnalyticsWorkspace.addMetricAlert({
      name: "metricAlert-test",
      criteria: [
        {
          metricName: "Heartbeat",
          metricNamespace: "Microsoft.operationalinsights/workspaces",
          aggregation: "Average",
          operator: "LessThan",
          threshold: 0,
        },
      ],
    });

    // Outputs to use for End to End Test
    const cdktfTerraformOutputRG = new cdktf.TerraformOutput(
      this,
      "resource_group_name",
      {
        value: resourceGroup.name,
      },
    );
    const cdktfTerraformOutputLAName = new cdktf.TerraformOutput(
      this,
      "loganalytics_workspace_name",
      {
        value: logAnalyticsWorkspace.props.name,
      },
    );
    const cdktfTerraformOutputLASku = new cdktf.TerraformOutput(
      this,
      "loganalytics_workspace_sku",
      {
        value: logAnalyticsWorkspace.props.sku,
      },
    );
    const cdktfTerraformOutputLARetention = new cdktf.TerraformOutput(
      this,
      "loganalytics_workspace_retention",
      {
        value: logAnalyticsWorkspace.props.retention,
      },
    );

    cdktfTerraformOutputRG.overrideLogicalId("resource_group_name");
    cdktfTerraformOutputLAName.overrideLogicalId("loganalytics_workspace_name");
    cdktfTerraformOutputLASku.overrideLogicalId("loganalytics_workspace_sku");
    cdktfTerraformOutputLARetention.overrideLogicalId(
      "loganalytics_workspace_retention",
    );
  }
}

new exampleAzureLogAnalytics(app, "testAzureLogAnalytics");

app.synth();
