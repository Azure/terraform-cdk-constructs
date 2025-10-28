/**
 * Integration test for Azure Kubernetes Service (AKS) Cluster
 *
 * This test demonstrates comprehensive usage of the AksCluster construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { TerraformApplyCheckAndDestroy } from "../../testing";
import { AksCluster } from "../lib/aks-cluster";

/**
 * Example stack demonstrating comprehensive AKS Cluster usage
 */
class AksClusterExampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: "aks-example-rg",
      location: "westus2",
      tags: {
        environment: "example",
        purpose: "integration-test",
      },
    });

    // Comprehensive AKS cluster with multiple features
    new AksCluster(this, "comprehensive-aks", {
      name: "comprehensiveaks",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      dnsPrefix: "compaks",
      kubernetesVersion: "1.31.1",
      agentPoolProfiles: [
        {
          name: "system",
          count: 1,
          vmSize: "Standard_D2s_v3",
          mode: "System",
          osType: "Linux",
          osDiskSizeGB: 30,
          maxPods: 30,
        },
        {
          name: "user",
          count: 1,
          vmSize: "Standard_D2s_v3",
          mode: "User",
          osType: "Linux",
          osDiskSizeGB: 30,
          maxPods: 30,
        },
      ],
      identity: {
        type: "SystemAssigned",
      },
      networkProfile: {
        networkPlugin: "kubenet",
        loadBalancerSku: "standard",
        serviceCidr: "10.0.0.0/16",
        dnsServiceIP: "10.0.0.10",
        podCidr: "10.244.0.0/16",
      },
      autoScalerProfile: {
        balanceSimilarNodeGroups: "false",
        expander: "random",
        maxEmptyBulkDelete: "10",
        maxGracefulTerminationSec: "600",
        maxNodeProvisionTime: "15m",
        maxTotalUnreadyPercentage: "45",
        newPodScaleUpDelay: "0s",
        okTotalUnreadyCount: "3",
        scaleDownDelayAfterAdd: "10m",
        scaleDownDelayAfterDelete: "10s",
        scaleDownDelayAfterFailure: "3m",
        scaleDownUnneededTime: "10m",
        scaleDownUnreadyTime: "20m",
        scaleDownUtilizationThreshold: "0.5",
        scanInterval: "10s",
        skipNodesWithLocalStorage: "false",
        skipNodesWithSystemPods: "true",
      },
      oidcIssuerProfile: {
        enabled: true,
      },
      enableRBAC: true,
      disableLocalAccounts: false,
      tags: {
        example: "comprehensive",
        features: "multi-pool-networking-autoscaling",
      },
    });
  }
}

describe("AKS Cluster Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup AKS cluster resources", () => {
    const app = Testing.app();
    const stack = new AksClusterExampleStack(app, "test-aks-cluster");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 900000); // 15 minute timeout for AKS deployment and cleanup
});
