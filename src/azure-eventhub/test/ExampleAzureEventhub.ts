import { App } from "cdktf";
import { Construct } from "constructs";
import { BaseTestStack } from "../../testing";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { AzureResourceGroup } from "../../azure-resourcegroup";
import { AzureEventhubNamespace } from "../namespace";


const app = new App();

export class exampleAzureEventhub extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const clientConfig = new DataAzurermClientConfig(this, 'CurrentClientConfig', {});
    new AzurermProvider(this, "azureFeature", {
      features: {},
    });

    const resourceGroup = new AzureResourceGroup(this, "rg", {
      name: `rg-${this.name}`,
      location: 'eastus',
    });

    // Create Eventhub Namespace
    const eventhubNamespace = new AzureEventhubNamespace(this, "eventhub", {
      rg: resourceGroup,
      name: `ehns-${this.name}`,
      sku: "Basic",
    });

    // Create Eventhub Instance
    const eventhubInstance = eventhubNamespace.addEventhubInstance({
      name: `test-eventhub-instance`,
      partitionCount: 2,
      messageRetention: 1,
      status: "Active",
    });

    // Create Eventhub Instance Authorization Rule
    eventhubInstance.addAuthorizationRule({
      name: `test-rule`,
      listen: true,
      send: true,
      manage: false,
    });

    // Add Consumer Group to Eventhub Instance
    eventhubInstance.addConsumerGroup({
      name: `test-consumer-group`,
    });

    // Add IAM role to Eventhub Namespace
    eventhubNamespace.addAccess(clientConfig.objectId, "Contributor");

    // Add Kusto data connection
    eventhubInstance.addKustoDataConnection({
      name: `test-kusto-data-connection`,
      location: 'eastus',
      resourceGroupName: 'test-rg',         // Kusto resource group
      clusterName: 'testkustocluster',      // Kusto cluster name
      databaseName: "test-kusto-database",  // Kusto database name
    });
  }
}


new exampleAzureEventhub(app, "testAzureEventhub");
app.synth();