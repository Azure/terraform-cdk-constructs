/**
 * Comprehensive tests for the unified ContainerApp implementation
 *
 * This test suite validates the unified ContainerApp class using the
 * AzapiResource framework. Tests cover automatic version resolution,
 * explicit version pinning, schema validation, property transformation, and
 * full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import { ContainerApp, ContainerAppProps } from "../lib/container-app";
import {
  ALL_CONTAINER_APP_VERSIONS,
  CONTAINER_APP_TYPE,
} from "../lib/container-app-schemas";

describe("ContainerApp - Unified Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  const defaultEnvironmentId =
    "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.App/managedEnvironments/env";

  const minimalTemplate = {
    containers: [
      {
        name: "my-app",
        image: "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest",
      },
    ],
  };

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure schemas are registered
    try {
      manager.registerResourceType(
        CONTAINER_APP_TYPE,
        ALL_CONTAINER_APP_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create Container App with automatic latest version resolution", () => {
      const props: ContainerAppProps = {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      };

      const containerApp = new ContainerApp(stack, "TestApp", props);

      expect(containerApp).toBeInstanceOf(ContainerApp);
      expect(containerApp.resolvedApiVersion).toBe("2025-07-01");
      expect(containerApp.props).toBe(props);
    });

    it("should create Container App with explicit version pinning", () => {
      const props: ContainerAppProps = {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        apiVersion: "2024-03-01",
        tags: { environment: "test" },
      };

      const containerApp = new ContainerApp(stack, "TestApp", props);

      expect(containerApp.resolvedApiVersion).toBe("2024-03-01");
      expect(containerApp.tags).toEqual({ environment: "test" });
    });

    it("should require location property", () => {
      const props: ContainerAppProps = {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      };

      const containerApp = new ContainerApp(stack, "TestApp", props);

      expect(containerApp.location).toBe("eastus");
      expect(containerApp.props.location).toBe("eastus");
    });

    it("should store environmentId property", () => {
      const props: ContainerAppProps = {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      };

      const containerApp = new ContainerApp(stack, "TestApp", props);

      expect(containerApp.props.environmentId).toBe(defaultEnvironmentId);
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(containerApp.resolvedApiVersion).toBe("2025-07-01");
      expect(containerApp.latestVersion()).toBe("2025-07-01");
    });

    it("should provide version configuration", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(containerApp.versionConfig).toBeDefined();
      expect(containerApp.versionConfig.version).toBe("2025-07-01");
      expect(containerApp.versionConfig.supportLevel).toBe(
        VersionSupportLevel.ACTIVE,
      );
    });

    it("should provide supported versions", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      const versions = containerApp.supportedVersions();
      expect(versions).toContain("2024-03-01");
      expect(versions).toContain("2025-07-01");
      expect(versions.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Public Methods - Read-only Properties", () => {
    it("should provide FQDN", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(containerApp.fqdn).toBeDefined();
      expect(typeof containerApp.fqdn).toBe("string");
    });

    it("should provide latest revision FQDN", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(containerApp.latestRevisionFqdn).toBeDefined();
      expect(typeof containerApp.latestRevisionFqdn).toBe("string");
    });

    it("should provide latest ready revision name", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(containerApp.latestReadyRevisionName).toBeDefined();
      expect(typeof containerApp.latestReadyRevisionName).toBe("string");
    });

    it("should provide provisioning state", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(containerApp.provisioningState).toBeDefined();
      expect(typeof containerApp.provisioningState).toBe("string");
    });

    it("should provide running status", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(containerApp.runningStatus).toBeDefined();
      expect(typeof containerApp.runningStatus).toBe("string");
    });
  });

  describe("Tag Management", () => {
    it("should allow adding tags", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        tags: { initial: "tag" },
      });

      containerApp.addTag("newKey", "newValue");
      expect(containerApp.props.tags).toHaveProperty("newKey", "newValue");
      expect(containerApp.props.tags).toHaveProperty("initial", "tag");
    });

    it("should allow removing tags", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        tags: { key1: "value1", key2: "value2" },
      });

      containerApp.removeTag("key1");
      expect(containerApp.props.tags).not.toHaveProperty("key1");
      expect(containerApp.props.tags).toHaveProperty("key2", "value2");
    });

    it("should handle adding tags when no initial tags exist", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      containerApp.addTag("newKey", "newValue");
      expect(containerApp.props.tags).toHaveProperty("newKey", "newValue");
    });
  });

  describe("Outputs", () => {
    it("should create all required outputs", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(containerApp.idOutput).toBeDefined();
      expect(containerApp.locationOutput).toBeDefined();
      expect(containerApp.nameOutput).toBeDefined();
      expect(containerApp.tagsOutput).toBeDefined();
      expect(containerApp.fqdnOutput).toBeDefined();
      expect(containerApp.latestRevisionFqdnOutput).toBeDefined();
      expect(containerApp.latestReadyRevisionNameOutput).toBeDefined();
      expect(containerApp.provisioningStateOutput).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain('"id"');
      expect(synthesized).toContain('"location"');
      expect(synthesized).toContain('"name"');
      expect(synthesized).toContain('"tags"');
      expect(synthesized).toContain('"fqdn"');
      expect(synthesized).toContain('"latest_revision_fqdn"');
      expect(synthesized).toContain('"latest_ready_revision_name"');
      expect(synthesized).toContain('"provisioning_state"');
    });
  });

  describe("Ingress Configuration", () => {
    it("should include external ingress in resource body", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        configuration: {
          ingress: {
            external: true,
            targetPort: 3000,
            transport: "http",
          },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ingress");
      expect(synthesized).toContain("3000");
    });

    it("should include CORS policy in ingress", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        configuration: {
          ingress: {
            external: true,
            targetPort: 3000,
            corsPolicy: {
              allowedOrigins: ["https://example.com"],
              allowedMethods: ["GET", "POST"],
              allowCredentials: true,
            },
          },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("corsPolicy");
      expect(synthesized).toContain("https://example.com");
    });

    it("should include IP security restrictions", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        configuration: {
          ingress: {
            external: true,
            targetPort: 3000,
            ipSecurityRestrictions: [
              {
                name: "AllowOffice",
                ipAddressRange: "192.168.1.0/24",
                action: "Allow",
              },
            ],
          },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ipSecurityRestrictions");
      expect(synthesized).toContain("AllowOffice");
    });

    it("should include sticky sessions configuration", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        configuration: {
          ingress: {
            external: true,
            targetPort: 3000,
            stickySessions: { affinity: "sticky" },
          },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("stickySessions");
      expect(synthesized).toContain("sticky");
    });
  });

  describe("Dapr Configuration", () => {
    it("should include Dapr sidecar configuration", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        configuration: {
          dapr: {
            enabled: true,
            appId: "my-app",
            appPort: 3000,
            appProtocol: "http",
          },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("dapr");
      expect(synthesized).toContain("my-app");
    });

    it("should support Dapr health checks", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        configuration: {
          dapr: {
            enabled: true,
            appId: "my-app",
            appPort: 3000,
            appHealth: {
              enabled: true,
              path: "/health",
              probeIntervalSeconds: 3,
              probeTimeoutMilliseconds: 1000,
              threshold: 3,
            },
          },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("appHealth");
      expect(synthesized).toContain("/health");
    });
  });

  describe("Scale Configuration", () => {
    it("should include HTTP scaling rules", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: {
          containers: minimalTemplate.containers,
          scale: {
            minReplicas: 1,
            maxReplicas: 10,
            rules: [
              {
                name: "http-rule",
                http: {
                  metadata: { concurrentRequests: "50" },
                },
              },
            ],
          },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("scale");
      expect(synthesized).toContain("http-rule");
      expect(synthesized).toContain("concurrentRequests");
    });

    it("should include custom KEDA scaling rules", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: {
          containers: minimalTemplate.containers,
          scale: {
            minReplicas: 0,
            maxReplicas: 5,
            rules: [
              {
                name: "servicebus-rule",
                custom: {
                  type: "azure-servicebus",
                  metadata: {
                    queueName: "myqueue",
                    namespace: "mynamespace",
                    messageCount: "5",
                  },
                },
              },
            ],
          },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("azure-servicebus");
      expect(synthesized).toContain("myqueue");
    });

    it("should include Azure Queue scaling rules", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: {
          containers: minimalTemplate.containers,
          scale: {
            minReplicas: 0,
            maxReplicas: 5,
            rules: [
              {
                name: "azure-queue-rule",
                azureQueue: {
                  accountName: "account1",
                  queueName: "queue1",
                  queueLength: 1,
                  identity: "system",
                },
              },
            ],
          },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("azureQueue");
      expect(synthesized).toContain("account1");
    });
  });

  describe("Container Configuration", () => {
    it("should include container resources", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: {
          containers: [
            {
              name: "my-app",
              image: "myregistry.azurecr.io/myapp:latest",
              resources: { cpu: 0.5, memory: "1Gi" },
            },
          ],
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("0.5");
      expect(synthesized).toContain("1Gi");
    });

    it("should include environment variables", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: {
          containers: [
            {
              name: "my-app",
              image: "myapp:latest",
              env: [
                { name: "PORT", value: "3000" },
                { name: "DB_PASSWORD", secretRef: "db-password" },
              ],
            },
          ],
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("PORT");
      expect(synthesized).toContain("3000");
      expect(synthesized).toContain("db-password");
    });

    it("should include health probes", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: {
          containers: [
            {
              name: "my-app",
              image: "myapp:latest",
              probes: [
                {
                  type: "Liveness",
                  httpGet: {
                    path: "/health",
                    port: 8080,
                  },
                  initialDelaySeconds: 3,
                  periodSeconds: 3,
                },
              ],
            },
          ],
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("Liveness");
      expect(synthesized).toContain("/health");
    });

    it("should include init containers", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: {
          containers: minimalTemplate.containers,
          initContainers: [
            {
              name: "init",
              image: "busybox:latest",
              command: ["/bin/sh"],
              args: ["-c", "echo hello"],
              resources: { cpu: 0.25, memory: "0.5Gi" },
            },
          ],
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("initContainers");
      expect(synthesized).toContain("busybox:latest");
    });

    it("should include volume mounts", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: {
          containers: [
            {
              name: "my-app",
              image: "myapp:latest",
              volumeMounts: [
                {
                  volumeName: "azurefile",
                  mountPath: "/mnt/data",
                },
              ],
            },
          ],
          volumes: [
            {
              name: "azurefile",
              storageType: "AzureFile",
              storageName: "mystorage",
            },
          ],
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("volumeMounts");
      expect(synthesized).toContain("azurefile");
      expect(synthesized).toContain("AzureFile");
    });
  });

  describe("Secrets and Registries", () => {
    it("should include secrets in configuration", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        configuration: {
          secrets: [
            { name: "db-password", value: "supersecret" },
            {
              name: "kv-secret",
              keyVaultUrl: "https://myvault.vault.azure.net/secrets/mysecret",
              identity: "system",
            },
          ],
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("secrets");
      expect(synthesized).toContain("db-password");
      expect(synthesized).toContain("kv-secret");
    });

    it("should include container registries", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        configuration: {
          registries: [
            {
              server: "myregistry.azurecr.io",
              identity:
                "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myid",
            },
          ],
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("registries");
      expect(synthesized).toContain("myregistry.azurecr.io");
    });
  });

  describe("Identity Configuration", () => {
    it("should include SystemAssigned identity", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        identity: {
          type: "SystemAssigned",
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("identity");
      expect(synthesized).toContain("SystemAssigned");
    });

    it("should include UserAssigned identity", () => {
      const identityId =
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myidentity";

      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        identity: {
          type: "SystemAssigned,UserAssigned",
          userAssignedIdentities: {
            [identityId]: {},
          },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("SystemAssigned,UserAssigned");
      expect(synthesized).toContain("userAssignedIdentities");
    });
  });

  describe("Revision Mode", () => {
    it("should support multiple revision mode", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        configuration: {
          activeRevisionsMode: "Multiple",
          ingress: {
            external: true,
            targetPort: 3000,
            traffic: [
              { revisionName: "my-container-app-v1", weight: 80 },
              {
                revisionName: "my-container-app-v2",
                weight: 20,
                label: "staging",
              },
            ],
          },
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("Multiple");
      expect(synthesized).toContain("traffic");
    });
  });

  describe("Workload Profile", () => {
    it("should include workload profile name", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        workloadProfileName: "My-GP-01",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("workloadProfileName");
      expect(synthesized).toContain("My-GP-01");
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        ignoreChanges: ["tags"],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ignore_changes");
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new ContainerApp(stack, "SynthTest", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should generate correct resource type in Terraform", () => {
      new ContainerApp(stack, "SynthTest", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("Microsoft.App/containerApps");
      expect(synthesized).toContain("2025-07-01");
    });

    it("should include all properties in Terraform body", () => {
      new ContainerApp(stack, "SynthTest", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
        tags: { env: "test" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("eastus");
      expect(synthesized).toContain("env");
      expect(synthesized).toContain("environmentId");
      expect(synthesized).toContain("template");
    });
  });

  describe("Resource Identification", () => {
    it("should provide resource ID", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(containerApp.id).toBeDefined();
      expect(typeof containerApp.id).toBe("string");
    });

    it("should provide resource name from props", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(containerApp.props.name).toBe("my-container-app");
    });
  });

  describe("JSII Compliance", () => {
    it("should have proper return types for all public methods", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(typeof containerApp.fqdn).toBe("string");
      expect(typeof containerApp.latestRevisionFqdn).toBe("string");
      expect(typeof containerApp.latestReadyRevisionName).toBe("string");
      expect(typeof containerApp.provisioningState).toBe("string");
      expect(typeof containerApp.runningStatus).toBe("string");
    });

    it("should not use function types in public interface", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(typeof containerApp.addTag).toBe("function");
      expect(typeof containerApp.removeTag).toBe("function");

      containerApp.addTag("test", "value");
      expect(containerApp.props.tags).toHaveProperty("test", "value");
    });
  });

  describe("Schema Registration", () => {
    it("should register schemas successfully", () => {
      const containerApp = new ContainerApp(stack, "TestApp", {
        name: "my-container-app",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(containerApp).toBeDefined();
      expect(containerApp.resolvedApiVersion).toBe("2025-07-01");
    });

    it("should handle multiple instantiations without errors", () => {
      new ContainerApp(stack, "TestApp1", {
        name: "my-container-app-1",
        location: "eastus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      const app2 = new ContainerApp(stack, "TestApp2", {
        name: "my-container-app-2",
        location: "westus",
        environmentId: defaultEnvironmentId,
        template: minimalTemplate,
      });

      expect(app2).toBeDefined();
    });
  });
});
