import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { App } from "cdktf";
import { Construct } from "constructs";
import * as aks from "..";
import { BaseTestStack } from "../../testing";

const app = new App();

export class exampleAzureKubernetesCluster extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
      features: {
        resourceGroup: {
          preventDeletionIfContainsResources: false,
        },
      },
    });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: "eastus",
      name: `rg-${this.name}`,
      tags: {
        test: "test",
      },
      lifecycle: {
        ignoreChanges: ["tags"],
      },
    });

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(
      this,
      "log_analytics",
      {
        location: "eastus",
        name: `la-${this.name}`,
        resourceGroupName: resourceGroup.name,
      },
    );

    const aksCluster = new aks.Cluster(this, "testAksCluster", {
      name: "akstest",
      location: "eastus",
      resourceGroup: resourceGroup,
      apiServerAuthorizedIpRanges: ["0.0.0.0"],
      defaultNodePool: {
        name: "default",
        nodeCount: 1,
        vmSize: "Standard_B2s",
      },
      identity: {
        type: "SystemAssigned",
      },
    });

    //Diag Settings
    aksCluster.addDiagSettings({
      name: "diagsettings",
      logAnalyticsWorkspaceId: logAnalyticsWorkspace.id,
      metricCategories: ["AllMetrics"],
    });
  }
}

new exampleAzureKubernetesCluster(app, "testAzureKubernetesCluster");

app.synth();
