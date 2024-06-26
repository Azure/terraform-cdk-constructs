import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { App } from "cdktf";
import { Construct } from "constructs";
import * as kusto from "..";
import { BaseTestStack } from "../../testing";
import { ComputeSpecification } from "../lib/compute-specification";

const app = new App();

export class exampleAzureKusto extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const clientConfig = new DataAzurermClientConfig(
      this,
      "CurrentClientConfig",
      {},
    );

    new AzurermProvider(this, "azureFeature", {
      features: {
        resourceGroup: {
          preventDeletionIfContainsResources: false,
        },
      },
    });

    const resourceGroup = new ResourceGroup(this, "rg", {
      name: `rg-${this.name}`,
      location: "eastus",
    });

    // Create Kusto Cluster
    const kustoCluster = new kusto.Cluster(this, "kusto", {
      resourceGroup: resourceGroup,
      name: `kusto${this.name}`, // Only lowercase Alphanumeric characters allowed.
      sku: ComputeSpecification.devtestExtraSmallEav4,
    });

    // Add RBAC to Kusto Cluster
    kustoCluster.addAccess(clientConfig.objectId, "Contributor");

    // Create Database
    const testDB1 = kustoCluster.addDatabase({
      kusto: kustoCluster,
      name: "testDB1",
      hotCachePeriod: "P7D",
      softDeletePeriod: "P31D",
    });

    // Add Permision to Kusto Database
    testDB1.addPermission({
      name: "User1Admin",
      tenantId: clientConfig.tenantId,
      principalId: clientConfig.clientId,
      principalType: "User",
      role: "Admin",
    });

    // Create Table in Kusto Database
    testDB1.addTable("MyTestTable", [
      {
        columnName: "Timestamp",
        columnType: "datetime",
      },
      {
        columnName: "User",
        columnType: "string",
      },
      {
        columnName: "Value",
        columnType: "int32",
      },
    ]);

    testDB1.addScript(
      "MyTestScript",
      ".create table MyTestTable2 ( Timestamp:datetime, User:string, Value:int32 )",
    );
  }
}

new exampleAzureKusto(app, "testAzureKusto");

app.synth();
