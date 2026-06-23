import { Testing } from "cdktn";
import * as cdktn from "cdktn";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  ContainerAppsJob,
  ContainerAppsJobProps,
} from "../lib/container-apps-job";
import {
  ALL_CONTAINER_APPS_JOB_VERSIONS,
  CONTAINER_APPS_JOB_TYPE,
} from "../lib/container-apps-job-schemas";

describe("ContainerAppsJob - Unified Implementation", () => {
  let app: cdktn.App;
  let stack: cdktn.TerraformStack;
  let manager: ApiVersionManager;

  const environmentId =
    "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.App/managedEnvironments/test-env";
  const resourceGroupId = "/subscriptions/test-sub/resourceGroups/test-rg";
  const configuration = { triggerType: "Manual", replicaTimeout: 300 };
  const template = {
    containers: [
      {
        name: "test-container",
        image: "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest",
      },
    ],
  };

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktn.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    try {
      manager.registerResourceType(
        CONTAINER_APPS_JOB_TYPE,
        ALL_CONTAINER_APPS_JOB_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create job with required properties", () => {
      const props: ContainerAppsJobProps = {
        name: "test-job",
        location: "eastus",
        environmentId,
        configuration,
        template,
      };

      const job = new ContainerAppsJob(stack, "TestJob", props);

      expect(job).toBeInstanceOf(ContainerAppsJob);
      expect(job.props).toBe(props);
      expect(job.props.environmentId).toBe(environmentId);
      expect(job.props.configuration).toEqual(configuration);
      expect(job.props.template).toEqual(template);
    });

    it("should create job with automatic latest version resolution", () => {
      const job = new ContainerAppsJob(stack, "TestJob", {
        name: "test-job",
        location: "eastus",
        environmentId,
        configuration,
        template,
      });

      expect(job.resolvedApiVersion).toBe("2024-03-01");
      expect(job.latestVersion()).toBe("2024-03-01");
    });

    it("should create job with explicit version pinning", () => {
      const job = new ContainerAppsJob(stack, "TestJob", {
        name: "test-job",
        location: "eastus",
        apiVersion: "2024-03-01",
        environmentId,
        configuration,
        template,
      });

      expect(job.resolvedApiVersion).toBe("2024-03-01");
    });

    it("should create job with all optional properties", () => {
      const props: ContainerAppsJobProps = {
        name: "test-job-full",
        location: "eastus",
        apiVersion: "2024-03-01",
        environmentId,
        resourceGroupId,
        configuration: {
          triggerType: "Manual",
          replicaTimeout: 300,
          replicaRetryLimit: 2,
          manualTriggerConfig: {
            parallelism: 1,
            replicaCompletionCount: 1,
          },
          secrets: [{ name: "registry-password", value: "super-secret" }],
          registries: [
            {
              server: "example.azurecr.io",
              username: "test-user",
              passwordSecretRef: "registry-password",
            },
          ],
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
              command: ["/bin/sh"],
              args: ["-c", "echo hello"],
              env: [
                { name: "ENVIRONMENT", value: "test" },
                { name: "PASSWORD", secretRef: "registry-password" },
              ],
            },
          ],
          initContainers: [
            {
              name: "init-container",
              image: "busybox:latest",
              args: ["echo", "setup"],
            },
          ],
          volumes: [{ name: "work", storageType: "EmptyDir" }],
        },
        identity: {
          type: "SystemAssigned",
        },
        tags: {
          environment: "test",
          workload: "job",
        },
      };

      const job = new ContainerAppsJob(stack, "TestJob", props);

      expect(job.props.resourceGroupId).toBe(resourceGroupId);
      expect(job.props.identity).toEqual({ type: "SystemAssigned" });
      expect(job.props.tags).toEqual(props.tags);
    });

    it("should require location to be provided", () => {
      const props = {
        name: "test-job",
        environmentId,
        configuration,
        template,
      } as ContainerAppsJobProps;

      expect(() => {
        new ContainerAppsJob(stack, "TestJob", props);
      }).toThrow("Location is required for Microsoft.App/jobs");
    });
  });

  describe("Framework Integration", () => {
    it("should provide supported versions list", () => {
      const job = new ContainerAppsJob(stack, "TestJob", {
        name: "test-job",
        location: "eastus",
        environmentId,
        configuration,
        template,
      });

      expect(job.supportedVersions()).toEqual(["2024-03-01"]);
    });

    it("should validate version support", () => {
      expect(() => {
        new ContainerAppsJob(stack, "ValidVersion", {
          name: "test-job",
          location: "eastus",
          apiVersion: "2024-03-01",
          environmentId,
          configuration,
          template,
        });
      }).not.toThrow();

      expect(() => {
        new ContainerAppsJob(stack, "InvalidVersion", {
          name: "test-job",
          location: "eastus",
          apiVersion: "2025-01-01",
          environmentId,
          configuration,
          template,
        });
      }).toThrow("Unsupported API version '2025-01-01'");
    });

    it("should load correct schema for resolved version", () => {
      const job = new ContainerAppsJob(stack, "TestJob", {
        name: "test-job",
        location: "eastus",
        apiVersion: "2024-03-01",
        environmentId,
        configuration,
        template,
      });

      expect(job.schema).toBeDefined();
      expect(job.schema.resourceType).toBe(CONTAINER_APPS_JOB_TYPE);
      expect(job.schema.version).toBe("2024-03-01");
      expect(job.schema.properties).toBeDefined();
    });

    it("should load version configuration correctly", () => {
      const job = new ContainerAppsJob(stack, "TestJob", {
        name: "test-job",
        location: "eastus",
        environmentId,
        configuration,
        template,
      });

      expect(job.versionConfig).toBeDefined();
      expect(job.versionConfig.version).toBe("2024-03-01");
      expect(job.versionConfig.supportLevel).toBe(VersionSupportLevel.ACTIVE);
    });
  });

  describe("Outputs", () => {
    it("should create Terraform outputs", () => {
      const job = new ContainerAppsJob(stack, "TestJob", {
        name: "test-job",
        location: "eastus",
        environmentId,
        configuration,
        template,
      });

      expect(job.idOutput).toBeDefined();
      expect(job.locationOutput).toBeDefined();
      expect(job.nameOutput).toBeDefined();
      expect(job.tagsOutput).toBeDefined();
      expect(job.resourceId).toBe(job.id);
    });

    it("should synthesize output logical IDs", () => {
      new ContainerAppsJob(stack, "TestJob", {
        name: "test-job",
        location: "eastus",
        environmentId,
        configuration,
        template,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain('"id"');
      expect(synthesized).toContain('"location"');
      expect(synthesized).toContain('"name"');
      expect(synthesized).toContain('"tags"');
    });
  });

  describe("Multiple Resources", () => {
    it("should handle multiple jobs in the same stack", () => {
      const job1 = new ContainerAppsJob(stack, "TestJob1", {
        name: "test-job-1",
        location: "eastus",
        environmentId,
        configuration,
        template,
      });

      const job2 = new ContainerAppsJob(stack, "TestJob2", {
        name: "test-job-2",
        location: "westus",
        apiVersion: "2024-03-01",
        environmentId,
        configuration,
        template,
      });

      expect(job1.resolvedApiVersion).toBe("2024-03-01");
      expect(job2.resolvedApiVersion).toBe("2024-03-01");
      expect(Testing.synth(stack)).toBeDefined();
    });
  });
});
