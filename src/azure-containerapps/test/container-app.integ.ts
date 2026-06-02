/**
 * Integration test for Azure Container App
 *
 * This test demonstrates usage of the ContainerApp construct with
 * a Container App Environment, and validates deployment, idempotency,
 * and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup/lib/resource-group";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { ContainerApp } from "../lib/container-app";
import { ContainerAppEnvironment } from "../lib/container-app-environment";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("containerapp-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Container App usage
 */
class ContainerAppExampleStack extends BaseTestStack {
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
    const resourceGroupName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "containerapp",
    );
    const envName = this.generateResourceName(
      "Microsoft.App/managedEnvironments",
      "containerapp",
    );
    const appName = this.generateResourceName(
      "Microsoft.App/containerApps",
      "containerapp",
    );

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "test-rg", {
      name: resourceGroupName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
        purpose: "container-app-testing",
      },
    });

    // Create Container App Environment
    const environment = new ContainerAppEnvironment(this, "container-env", {
      name: envName,
      location: "eastus",
      apiVersion: "2025-02-02-preview",
      resourceGroupId: resourceGroup.id,
      workloadProfiles: [
        {
          name: "Consumption",
          workloadProfileType: "Consumption",
        },
      ],
      tags: {
        ...this.systemTags(),
        purpose: "container-app-hosting",
      },
    });

    // Create Container App with external ingress
    new ContainerApp(this, "container-app", {
      name: appName,
      location: "eastus",
      apiVersion: "2025-02-02-preview",
      resourceGroupId: resourceGroup.id,
      environmentId: environment.id,
      template: {
        containers: [
          {
            name: "helloworld",
            image:
              "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest",
            resources: {
              cpu: 0.25,
              memory: "0.5Gi",
            },
          },
        ],
        scale: {
          minReplicas: 0,
          maxReplicas: 1,
        },
      },
      configuration: {
        ingress: {
          external: true,
          targetPort: 80,
          transport: "auto",
        },
      },
      tags: {
        ...this.systemTags(),
        example: "complete",
        environment: "test",
        purpose: "container-app-demo",
      },
    });
  }
}

describe("ContainerApp Integration Test", () => {
  it("should deploy Container App with environment, validate idempotency, and cleanup", () => {
    const app = Testing.app();
    const stack = new ContainerAppExampleStack(app, "test-containerapp");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources (RG, Environment, App)
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 900000); // 15 minute timeout for deployment and cleanup
});
