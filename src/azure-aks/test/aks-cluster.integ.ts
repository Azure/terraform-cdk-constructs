/**
 * Integration test for Azure Kubernetes Service (AKS) Cluster
 *
 * This test demonstrates comprehensive usage of the AksCluster construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ActionGroup } from "../../azure-actiongroup";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { AksCluster } from "../lib/aks-cluster";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("aks-cluster-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating comprehensive AKS Cluster usage
 */
class AksClusterExampleStack extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      testRunOptions: {
        maxAgeHours: testMetadata.maxAgeHours,
        autoCleanup: testMetadata.autoCleanup,
        cleanupPolicy: testMetadata.cleanupPolicy,
      },
    });

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Generate unique names
    const rgName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "aks",
    );

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: rgName,
      location: "westus2",
      tags: {
        ...this.systemTags(),
      },
    });

    // Create an action group for monitoring alerts
    const actionGroup = new ActionGroup(this, "monitoring-ag", {
      name: "aks-monitoring-ag",
      location: "global",
      resourceGroupId: resourceGroup.id,
      groupShortName: "aksmon",
      emailReceivers: [
        {
          name: "admin",
          emailAddress: "admin@example.com",
          useCommonAlertSchema: true,
        },
      ],
    });

    // Example 1: Basic AKS cluster with default monitoring
    new AksCluster(this, "monitored-aks", {
      name: "monitoredaks",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      dnsPrefix: "monaks",
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
      enableRBAC: true,
      tags: {
        ...this.systemTags(),
        example: "monitored",
        features: "default-monitoring",
      },
      monitoring: AksCluster.defaultMonitoring(actionGroup.id),
    });

    // Example 2: AKS cluster with custom monitoring thresholds
    new AksCluster(this, "custom-monitored-aks", {
      name: "custmonaks",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      dnsPrefix: "custmonaks",
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
      ],
      identity: {
        type: "SystemAssigned",
      },
      networkProfile: {
        networkPlugin: "kubenet",
        loadBalancerSku: "standard",
        serviceCidr: "10.1.0.0/16",
        dnsServiceIP: "10.1.0.10",
        podCidr: "10.245.0.0/16",
      },
      enableRBAC: true,
      tags: {
        ...this.systemTags(),
        example: "custom-monitored",
        features: "custom-thresholds",
      },
      monitoring: AksCluster.defaultMonitoring(actionGroup.id, undefined, {
        nodeCpuThreshold: 90,
        nodeMemoryThreshold: 85,
        failedPodThreshold: 5,
        nodeCpuAlertSeverity: 1,
        nodeMemoryAlertSeverity: 1,
        failedPodAlertSeverity: 0,
      }),
    });

    // Example 3: AKS cluster with selective monitoring (some alerts disabled)
    new AksCluster(this, "selective-monitored-aks", {
      name: "selmonaks",
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      dnsPrefix: "selmonaks",
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
      ],
      identity: {
        type: "SystemAssigned",
      },
      networkProfile: {
        networkPlugin: "kubenet",
        loadBalancerSku: "standard",
        serviceCidr: "10.2.0.0/16",
        dnsServiceIP: "10.2.0.10",
        podCidr: "10.246.0.0/16",
      },
      enableRBAC: true,
      tags: {
        ...this.systemTags(),
        example: "selective-monitored",
        features: "disabled-alerts",
      },
      monitoring: AksCluster.defaultMonitoring(actionGroup.id, undefined, {
        enableNodeMemoryAlert: false,
        enableDeletionAlert: false,
      }),
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
        ...this.systemTags(),
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
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 900000); // 15 minute timeout for AKS deployment and cleanup
});
