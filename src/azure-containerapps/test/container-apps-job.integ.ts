/**
 * Integration test for Azure Container Apps Job
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktn";
import { Construct } from "constructs";
import "cdktn/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup/lib/resource-group";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { ContainerAppEnvironment } from "../lib/container-app-environment";
import { ContainerAppsJob } from "../lib/container-apps-job";

const testMetadata = new TestRunMetadata("containerappsjob-integration", {
  maxAgeHours: 4,
});

class ContainerAppsJobExampleStack extends BaseTestStack {
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
      "containerjob",
    );
    const envName = this.generateResourceName(
      "Microsoft.App/managedEnvironments",
      "containerjob",
    );
    const jobName = this.generateResourceName(
      "Microsoft.App/jobs",
      "containerjob",
    );

    const resourceGroup = new ResourceGroup(this, "test-rg", {
      name: resourceGroupName,
      location: "westus2",
      tags: {
        ...this.systemTags(),
        purpose: "container-apps-job-testing",
      },
    });

    const environment = new ContainerAppEnvironment(this, "container-env", {
      name: envName,
      location: resourceGroup.location,
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
        purpose: "container-apps-job-hosting",
      },
    });

    new ContainerAppsJob(this, "container-job", {
      name: jobName,
      location: resourceGroup.location,
      apiVersion: "2024-03-01",
      resourceGroupId: resourceGroup.id,
      environmentId: environment.id,
      configuration: {
        triggerType: "Manual",
        replicaTimeout: 300,
      },
      template: {
        containers: [
          {
            name: "test-container",
            image:
              "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest",
            resources: {
              cpu: 0.25,
              memory: "0.5Gi",
            },
          },
        ],
      },
      tags: {
        ...this.systemTags(),
        example: "complete",
        environment: "test",
        purpose: "container-apps-job-demo",
      },
    });
  }
}

describe("ContainerAppsJob Integration Test", () => {
  it("should deploy Container Apps Job, validate idempotency, and cleanup", () => {
    const app = Testing.app();
    const stack = new ContainerAppsJobExampleStack(app, "test-containerjob");
    const synthesized = Testing.fullSynth(stack);

    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 900000);
});
