import { Testing } from "cdktn";
import { Construct } from "constructs";
import "cdktn/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup/lib/resource-group";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { DataExplorerCluster } from "../lib/data-explorer-cluster";
import { DataExplorerDatabase } from "../lib/data-explorer-database";
import { DataExplorerScript } from "../lib/data-explorer-table";

const testMetadata = new TestRunMetadata("dataexplorer-integration", {
  maxAgeHours: 6,
});

class DataExplorerExampleStack extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      testRunOptions: {
        maxAgeHours: testMetadata.maxAgeHours,
        autoCleanup: testMetadata.autoCleanup,
        cleanupPolicy: testMetadata.cleanupPolicy,
      },
    });

    new AzapiProvider(this, "azapi", {});

    const resourceGroupName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "adx",
    );
    const clusterName = this.generateResourceName(
      "Microsoft.Kusto/clusters",
      "adxcluster",
    );
    const databaseName = this.generateResourceName(
      "Microsoft.Kusto/clusters/databases",
      "adxdb",
    );
    const scriptName = this.generateResourceName(
      "Microsoft.Kusto/clusters/databases/scripts",
      "adxtable",
    );

    const resourceGroup = new ResourceGroup(this, "test-rg", {
      name: resourceGroupName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
        purpose: "data-explorer-testing",
      },
    });

    const cluster = new DataExplorerCluster(this, "adx-cluster", {
      name: clusterName,
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      sku: {
        name: "Dev(No SLA)_Standard_E2a_v4",
        capacity: 1,
        tier: "Basic",
      },
      enableStreamingIngest: false,
      enablePurge: true,
      tags: {
        ...this.systemTags(),
        purpose: "data-explorer-cluster",
      },
    });

    const database = new DataExplorerDatabase(this, "adx-database", {
      name: databaseName,
      clusterId: cluster.id,
      kind: "ReadWrite",
      softDeletePeriod: "P365D",
      hotCachePeriod: "P31D",
    });

    new DataExplorerScript(this, "adx-script", {
      name: scriptName,
      databaseId: database.id,
      scriptContent:
        ".create table TestTable (Column1: string, Column2: int)",
      forceUpdateTag: testMetadata.runId,
      continueOnErrors: false,
    });
  }
}

describe("DataExplorer Integration Test", () => {
  it(
    "should deploy ADX cluster, database, and script, validate idempotency, and cleanup",
    () => {
      const app = Testing.app();
      const stack = new DataExplorerExampleStack(app, "test-dataexplorer");
      const synthesized = Testing.fullSynth(stack);

      TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
    },
    1800000,
  );
});
