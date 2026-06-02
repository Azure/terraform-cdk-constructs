/**
 * Unit tests for Azure Function App using VersionedAzapiResource framework
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ResourceGroup } from "../../azure-resourcegroup";
import { FunctionApp, FunctionAppProps } from "../lib/function-app";

describe("FunctionApp", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  describe("constructor", () => {
    it("should create a function app with required properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-app",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp).toBeInstanceOf(FunctionApp);
      expect(functionApp.props).toBe(props);
    });

    it("should create a function app with all properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-app-full",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        httpsOnly: true,
        clientAffinityEnabled: false,
        enabled: true,
        publicNetworkAccess: "Enabled",
        clientCertEnabled: false,
        siteConfig: {
          appSettings: [
            { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
            { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
          ],
          linuxFxVersion: "NODE|20",
          alwaysOn: true,
          minTlsVersion: "1.2",
          http20Enabled: true,
        },
        identity: {
          type: "SystemAssigned",
        },
        tags: {
          environment: "test",
          project: "cdktf-constructs",
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props).toBe(props);
      expect(functionApp.tags).toEqual(props.tags);
    });

    it("should use default values for optional properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-app-defaults",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp).toBeInstanceOf(FunctionApp);
    });

    it("should create terraform outputs", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-app-outputs",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp",
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(functionApp.locationOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(functionApp.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(functionApp.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(functionApp.defaultHostNameOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
    });
  });

  describe("kind configuration", () => {
    it("should accept Windows function app kind", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-win",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp",
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.kind).toBe("functionapp");
    });

    it("should accept Linux function app kind", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-linux",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.kind).toBe("functionapp,linux");
    });

    it("should default to functionapp kind when not specified", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-default-kind",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.kind).toBeUndefined();
    });
  });

  describe("security settings", () => {
    it("should configure HTTPS only", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-https",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        httpsOnly: true,
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.httpsOnly).toBe(true);
    });

    it("should configure public network access", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-network",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        publicNetworkAccess: "Disabled",
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.publicNetworkAccess).toBe("Disabled");
    });

    it("should configure client certificate authentication", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-cert",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        clientCertEnabled: true,
        clientCertMode: "Required",
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.clientCertEnabled).toBe(true);
      expect(functionApp.props.clientCertMode).toBe("Required");
    });
  });

  describe("site configuration", () => {
    it("should configure app settings", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-settings",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        siteConfig: {
          appSettings: [
            { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
            { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
            {
              name: "AzureWebJobsStorage",
              value: "DefaultEndpointsProtocol=https;...",
            },
          ],
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.siteConfig).toBeDefined();
      expect(functionApp.props.siteConfig!.appSettings).toHaveLength(3);
    });

    it("should configure runtime stack", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-runtime",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        siteConfig: {
          linuxFxVersion: "PYTHON|3.11",
          alwaysOn: true,
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.siteConfig!.linuxFxVersion).toBe("PYTHON|3.11");
      expect(functionApp.props.siteConfig!.alwaysOn).toBe(true);
    });

    it("should configure CORS", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-cors",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        siteConfig: {
          cors: {
            allowedOrigins: ["https://example.com", "https://app.example.com"],
            supportCredentials: true,
          },
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.siteConfig!.cors).toBeDefined();
      expect(functionApp.props.siteConfig!.cors!.allowedOrigins).toHaveLength(
        2,
      );
      expect(functionApp.props.siteConfig!.cors!.supportCredentials).toBe(true);
    });
  });

  describe("identity configuration", () => {
    it("should configure system assigned identity", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-identity",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        identity: {
          type: "SystemAssigned",
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.identity).toBeDefined();
      expect(functionApp.props.identity!.type).toBe("SystemAssigned");
    });

    it("should configure user assigned identity", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-uai",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        identity: {
          type: "UserAssigned",
          userAssignedIdentities: {
            "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity":
              {},
          },
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.identity!.type).toBe("UserAssigned");
      expect(functionApp.props.identity!.userAssignedIdentities).toBeDefined();
    });
  });

  describe("tag management", () => {
    let functionApp: FunctionApp;

    beforeEach(() => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-tags",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        tags: {
          environment: "test",
        },
      };

      functionApp = new FunctionApp(stack, "TestFuncApp", props);
    });

    it("should add a tag", () => {
      functionApp.addTag("newTag", "newValue");

      expect(functionApp.props.tags!.newTag).toBe("newValue");
      expect(functionApp.props.tags!.environment).toBe("test");
    });

    it("should remove an existing tag", () => {
      functionApp.removeTag("environment");

      expect(functionApp.props.tags!.environment).toBeUndefined();
    });

    it("should add a tag when no tags exist", () => {
      const rg = new ResourceGroup(stack, "TestRG2", {
        name: "test-rg2",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-no-tags",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
      };

      const fa = new FunctionApp(stack, "TestFuncAppNoTags", props);
      fa.addTag("firstTag", "firstValue");

      expect(fa.props.tags!.firstTag).toBe("firstValue");
    });
  });

  describe("API versioning", () => {
    it("should use default version when not specified", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-defver",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp).toBeInstanceOf(FunctionApp);
    });

    it("should accept specific API version", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-ver",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        apiVersion: "2024-04-01",
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.apiVersion).toBe("2024-04-01");
    });
  });

  describe("CDK Terraform integration", () => {
    it("should synthesize to valid Terraform", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-synth",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        tags: {
          environment: "test",
        },
      };

      new FunctionApp(stack, "TestFuncApp", props);

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-logical",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.idOutput).toBeDefined();
      expect(functionApp.locationOutput).toBeDefined();
      expect(functionApp.nameOutput).toBeDefined();
      expect(functionApp.tagsOutput).toBeDefined();
      expect(functionApp.defaultHostNameOutput).toBeDefined();
    });
  });

  describe("default hostname property", () => {
    it("should provide default hostname", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-hostname",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.defaultHostName).toBeDefined();
    });
  });

  describe("Flex Consumption configuration", () => {
    it("should configure functionAppConfig for Flex Consumption plan", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus2",
      });

      const props: FunctionAppProps = {
        name: "test-func-flex",
        location: "eastus2",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        siteConfig: {},
        functionAppConfig: {
          deployment: {
            storage: {
              type: "blobContainer",
              value: "https://mystorage.blob.core.windows.net/deployments",
              authentication: {
                type: "SystemAssignedIdentity",
              },
            },
          },
          runtime: {
            name: "node",
            version: "20",
          },
          scaleAndConcurrency: {
            maximumInstanceCount: 40,
            instanceMemoryMB: 2048,
          },
        },
        identity: {
          type: "SystemAssigned",
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.functionAppConfig).toBeDefined();
      expect(functionApp.props.functionAppConfig!.runtime.name).toBe("node");
      expect(functionApp.props.functionAppConfig!.runtime.version).toBe("20");
      expect(
        functionApp.props.functionAppConfig!.scaleAndConcurrency
          ?.maximumInstanceCount,
      ).toBe(40);
      expect(
        functionApp.props.functionAppConfig!.deployment.storage.authentication
          .type,
      ).toBe("SystemAssignedIdentity");
    });

    it("should configure functionAppConfig with Python runtime", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus2",
      });

      const props: FunctionAppProps = {
        name: "test-func-flex-python",
        location: "eastus2",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        siteConfig: {},
        functionAppConfig: {
          deployment: {
            storage: {
              type: "blobContainer",
              value: "https://mystorage.blob.core.windows.net/deployments",
              authentication: {
                type: "SystemAssignedIdentity",
              },
            },
          },
          runtime: {
            name: "python",
            version: "3.11",
          },
        },
        identity: {
          type: "SystemAssigned",
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp.props.functionAppConfig!.runtime.name).toBe("python");
      expect(functionApp.props.functionAppConfig!.runtime.version).toBe("3.11");
    });

    it("should synthesize Flex Consumption config to valid Terraform", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus2",
      });

      const props: FunctionAppProps = {
        name: "test-func-flex-synth",
        location: "eastus2",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        siteConfig: {},
        functionAppConfig: {
          deployment: {
            storage: {
              type: "blobContainer",
              value: "https://mystorage.blob.core.windows.net/deployments",
              authentication: {
                type: "SystemAssignedIdentity",
              },
            },
          },
          runtime: {
            name: "node",
            version: "20",
          },
          scaleAndConcurrency: {
            maximumInstanceCount: 100,
            instanceMemoryMB: 4096,
          },
        },
        identity: {
          type: "SystemAssigned",
        },
      };

      new FunctionApp(stack, "TestFuncApp", props);

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });
  });
});
