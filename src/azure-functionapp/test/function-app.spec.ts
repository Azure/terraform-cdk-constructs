/**
 * Unit tests for Azure Function App using VersionedAzapiResource framework
 */

import * as path from "path";
import { Testing } from "cdktn";
import * as cdktn from "cdktn";
import { ResourceGroup } from "../../azure-resourcegroup";
import { FunctionApp, FunctionAppProps } from "../lib/function-app";

describe("FunctionApp", () => {
  let app: cdktn.App;
  let stack: cdktn.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktn.TerraformStack(app, "TestStack");
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
      expect(functionApp.props).toEqual(props);
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

      expect(functionApp.props).toEqual(props);
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

      expect(functionApp.idOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(functionApp.locationOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(functionApp.nameOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(functionApp.tagsOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(functionApp.defaultHostNameOutput).toBeInstanceOf(
        cdktn.TerraformOutput,
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

  describe("asset pipeline", () => {
    it("should create function app with code asset", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-asset",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        codeAsset: {
          sourcePath: "./src/azure-functionapp/test/fixtures/sample-function",
          exclude: ["node_modules", "*.test.ts"],
        },
        siteConfig: {
          appSettings: [{ name: "FUNCTIONS_WORKER_RUNTIME", value: "node" }],
          linuxFxVersion: "NODE|20",
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp).toBeInstanceOf(FunctionApp);
      expect(functionApp.assetPath).toBeDefined();
      expect(functionApp.assetHash).toBeDefined();
    });

    it("should create function app with bundled code asset (requires Docker)", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-bundled",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        codeAsset: {
          sourcePath: "./src/azure-functionapp/test/fixtures/sample-function",
          bundling: {
            image: "node:20",
            command: ["sh", "-c", "npm ci && cp -r . /asset-output/"],
            environment: {
              NODE_ENV: "production",
            },
          },
          exclude: ["node_modules", "*.test.ts"],
        },
        siteConfig: {
          appSettings: [{ name: "FUNCTIONS_WORKER_RUNTIME", value: "node" }],
          linuxFxVersion: "NODE|20",
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(functionApp).toBeInstanceOf(FunctionApp);
      expect(functionApp.assetPath).toBeDefined();
      expect(functionApp.assetHash).toBeDefined();
    });
  });

  describe("blob storage deployment", () => {
    it("should deploy code to blob storage with managed identity", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-blob-mi",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        identity: {
          type: "SystemAssigned",
        },
        siteConfig: {
          appSettings: [
            { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
            { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
          ],
          linuxFxVersion: "NODE|20",
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      const blobAsset = functionApp.deployCodeFromBlob(
        "./src/azure-functionapp/test/fixtures/sample-function",
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storage",
        "teststorage",
        {
          containerName: "function-packages",
          useManagedIdentity: true,
        },
      );

      expect(blobAsset).toBeDefined();
      expect(blobAsset.blobUrl).toContain("teststorage.blob.core.windows.net");
      expect(blobAsset.blobUrl).toContain("function-packages");
      expect(functionApp.blobAsset).toBe(blobAsset);

      // Check that WEBSITE_RUN_FROM_PACKAGE was added
      const appSettings = functionApp.props.siteConfig?.appSettings || [];
      const runFromPackageSetting = appSettings.find(
        (s) => s.name === "WEBSITE_RUN_FROM_PACKAGE",
      );
      expect(runFromPackageSetting).toBeDefined();
      expect(runFromPackageSetting!.value).toBe(blobAsset.blobUrl);
    });

    it("should deploy code to blob storage with SAS token", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-blob-sas",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        siteConfig: {
          appSettings: [{ name: "FUNCTIONS_WORKER_RUNTIME", value: "python" }],
          linuxFxVersion: "PYTHON|3.11",
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      const sasToken =
        "?sv=2021-08-06&ss=b&srt=sco&sp=r&se=2024-12-31T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=test";

      const blobAsset = functionApp.deployCodeFromBlob(
        "./src/azure-functionapp/test/fixtures/sample-function",
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storage",
        "teststorage",
        {
          containerName: "function-packages",
          sasToken,
        },
      );

      expect(blobAsset).toBeDefined();

      // Check that WEBSITE_RUN_FROM_PACKAGE was added with SAS token
      const appSettings = functionApp.props.siteConfig?.appSettings || [];
      const runFromPackageSetting = appSettings.find(
        (s) => s.name === "WEBSITE_RUN_FROM_PACKAGE",
      );
      expect(runFromPackageSetting).toBeDefined();
      expect(runFromPackageSetting!.value).toContain(sasToken);
    });

    it("should deploy code with user-assigned managed identity", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const userAssignedIdentityId =
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-identity";

      const props: FunctionAppProps = {
        name: "test-func-blob-uai",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        identity: {
          type: "UserAssigned",
          userAssignedIdentities: {
            [userAssignedIdentityId]: {},
          },
        },
        siteConfig: {
          appSettings: [],
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      const blobAsset = functionApp.deployCodeFromBlob(
        "./src/azure-functionapp/test/fixtures/sample-function",
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storage",
        "teststorage",
        {
          containerName: "function-packages",
          useManagedIdentity: true,
          managedIdentityResourceId: userAssignedIdentityId,
        },
      );

      expect(blobAsset).toBeDefined();

      // Check that both settings were added
      const appSettings = functionApp.props.siteConfig?.appSettings || [];
      const runFromPackageSetting = appSettings.find(
        (s) => s.name === "WEBSITE_RUN_FROM_PACKAGE",
      );
      const identityResourceIdSetting = appSettings.find(
        (s) => s.name === "WEBSITE_RUN_FROM_PACKAGE_BLOB_MI_RESOURCE_ID",
      );

      expect(runFromPackageSetting).toBeDefined();
      expect(identityResourceIdSetting).toBeDefined();
      expect(identityResourceIdSetting!.value).toBe(userAssignedIdentityId);
    });

    it("should deploy code with bundling to blob storage (requires Docker)", () => {
      // Skipped: This test requires Docker to be available and running
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-blob-bundle",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        identity: {
          type: "SystemAssigned",
        },
        siteConfig: {
          appSettings: [],
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      const blobAsset = functionApp.deployCodeFromBlob(
        "./src/azure-functionapp/test/fixtures/sample-function",
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storage",
        "teststorage",
        {
          containerName: "function-packages",
          useManagedIdentity: true,
          bundling: {
            image: "node:20",
            command: [
              "sh",
              "-c",
              "npm ci --production && cp -r . /asset-output/",
            ],
          },
          exclude: ["node_modules", "*.test.ts"],
        },
      );

      expect(blobAsset).toBeDefined();
      expect(blobAsset.assetHash).toBeDefined();
      expect(blobAsset.assetPath).toBeDefined();
    });

    it("should throw error when neither managed identity nor SAS token is provided", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-blob-error",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      expect(() => {
        functionApp.deployCodeFromBlob(
          "./src/azure-functionapp/test/fixtures/sample-function",
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storage",
          "teststorage",
          {
            containerName: "function-packages",
            // Neither useManagedIdentity nor sasToken provided
          },
        );
      }).toThrow(
        "Either useManagedIdentity must be true or sasToken must be provided",
      );
    });

    it("should use blob prefix when specified", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: FunctionAppProps = {
        name: "test-func-blob-prefix",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        identity: {
          type: "SystemAssigned",
        },
      };

      const functionApp = new FunctionApp(stack, "TestFuncApp", props);

      const blobAsset = functionApp.deployCodeFromBlob(
        "./src/azure-functionapp/test/fixtures/sample-function",
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storage",
        "teststorage",
        {
          containerName: "function-packages",
          blobPrefix: "production/v1",
          useManagedIdentity: true,
        },
      );

      expect(blobAsset.blobName).toContain("production/v1/");
      expect(blobAsset.blobUrl).toContain("production/v1/");
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

    it("should deploy code to Flex Consumption using deployCodeToFlexConsumption", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus2",
      });

      const fixturePath = path.resolve(
        __dirname,
        "../test/fixtures/sample-function",
      );

      const functionApp = new FunctionApp(stack, "TestFuncApp", {
        name: "test-func-flex-deploy",
        location: "eastus2",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        identity: {
          type: "SystemAssigned",
        },
        functionAppConfig: {
          deployment: {
            storage: {
              type: "blobContainer",
              value: "", // Will be populated by deployCodeToFlexConsumption
              authentication: {
                type: "SystemAssignedIdentity",
              },
            },
          },
          runtime: {
            name: "node",
            version: "20",
          },
        },
      });

      const blobAsset = functionApp.deployCodeToFlexConsumption(
        fixturePath,
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storage",
        "teststorage",
        {
          containerName: "deployments",
          useManagedIdentity: true,
        },
      );

      expect(blobAsset).toBeDefined();
      expect(blobAsset.blobUrl).toContain("teststorage.blob.core.windows.net");
      expect(blobAsset.blobUrl).toContain("deployments");

      // Verify that functionAppConfig.deployment.storage.value was populated
      expect(
        functionApp.props.functionAppConfig?.deployment.storage.value,
      ).toBe(blobAsset.blobUrl);
    });

    it("should deploy code to Flex Consumption with user-assigned identity", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus2",
      });

      const fixturePath = path.resolve(
        __dirname,
        "../test/fixtures/sample-function",
      );

      const userAssignedIdentityId =
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-identity";

      const functionApp = new FunctionApp(stack, "TestFuncApp", {
        name: "test-func-flex-uai",
        location: "eastus2",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        identity: {
          type: "UserAssigned",
          userAssignedIdentities: {
            [userAssignedIdentityId]: {},
          },
        },
        functionAppConfig: {
          deployment: {
            storage: {
              type: "blobContainer",
              value: "",
              authentication: {
                type: "UserAssignedIdentity",
              },
            },
          },
          runtime: {
            name: "python",
            version: "3.11",
          },
        },
      });

      const blobAsset = functionApp.deployCodeToFlexConsumption(
        fixturePath,
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storage",
        "teststorage",
        {
          containerName: "deployments",
          useManagedIdentity: true,
          managedIdentityResourceId: userAssignedIdentityId,
        },
      );

      expect(blobAsset).toBeDefined();

      // Verify that functionAppConfig.deployment.storage was populated correctly
      const deploymentStorage =
        functionApp.props.functionAppConfig?.deployment.storage;
      expect(deploymentStorage?.value).toBe(blobAsset.blobUrl);
      expect(
        (deploymentStorage?.authentication as any)
          .userAssignedIdentityResourceId,
      ).toBe(userAssignedIdentityId);
    });

    it("should deploy code to Flex Consumption with bundling", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus2",
      });

      const fixturePath = path.resolve(
        __dirname,
        "../test/fixtures/sample-function",
      );

      const functionApp = new FunctionApp(stack, "TestFuncApp", {
        name: "test-func-flex-bundle",
        location: "eastus2",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        identity: {
          type: "SystemAssigned",
        },
        functionAppConfig: {
          deployment: {
            storage: {
              type: "blobContainer",
              value: "",
              authentication: {
                type: "SystemAssignedIdentity",
              },
            },
          },
          runtime: {
            name: "node",
            version: "20",
          },
        },
      });

      const blobAsset = functionApp.deployCodeToFlexConsumption(
        fixturePath,
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storage",
        "teststorage",
        {
          containerName: "deployments",
          useManagedIdentity: true,
          bundling: {
            image: "node:20",
            command: [
              "sh",
              "-c",
              "cp -r . /asset-output/ && cd /asset-output && npm install --production",
            ],
          },
          exclude: ["node_modules", "*.test.ts"],
        },
      );

      expect(blobAsset).toBeDefined();
      expect(blobAsset.assetHash).toBeDefined();
      expect(
        functionApp.props.functionAppConfig?.deployment.storage.value,
      ).toBe(blobAsset.blobUrl);
    });

    it("should throw error when deployCodeToFlexConsumption is called without functionAppConfig", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const fixturePath = path.resolve(
        __dirname,
        "../test/fixtures/sample-function",
      );

      const functionApp = new FunctionApp(stack, "TestFuncApp", {
        name: "test-func-no-config",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
      });

      expect(() => {
        functionApp.deployCodeToFlexConsumption(
          fixturePath,
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storage",
          "teststorage",
          {
            useManagedIdentity: true,
          },
        );
      }).toThrow("functionAppConfig must be defined");
    });

    it("should throw error when neither managed identity nor SAS token is provided for Flex", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus2",
      });

      const fixturePath = path.resolve(
        __dirname,
        "../test/fixtures/sample-function",
      );

      const functionApp = new FunctionApp(stack, "TestFuncApp", {
        name: "test-func-flex-error",
        location: "eastus2",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        functionAppConfig: {
          deployment: {
            storage: {
              type: "blobContainer",
              value: "",
              authentication: {
                type: "SystemAssignedIdentity",
              },
            },
          },
          runtime: {
            name: "node",
            version: "20",
          },
        },
      });

      expect(() => {
        functionApp.deployCodeToFlexConsumption(
          fixturePath,
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storage",
          "teststorage",
          {
            // Neither useManagedIdentity nor sasToken provided
          },
        );
      }).toThrow(
        "Either useManagedIdentity must be true or sasToken must be provided",
      );
    });
  });

  describe("Blob Asset Upload Tests", () => {
    const fixturePath = path.resolve(
      __dirname,
      "../test/fixtures/sample-function",
    );

    it("should configure autoUpload=false by default", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const functionApp = new FunctionApp(stack, "TestFuncApp", {
        name: "test-func",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
      });

      const blobAsset = functionApp.deployCodeFromBlob(
        fixturePath,
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/mystorage",
        "mystorageaccount",
        {
          useManagedIdentity: true,
          // autoUpload not specified, should default to false
        },
      );

      // Should not have upload result if autoUpload=false
      expect(blobAsset).toBeDefined();
      expect(blobAsset.blobUrl).toContain(
        "mystorageaccount.blob.core.windows.net",
      );
    });

    it("should configure blob URL correctly", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const functionApp = new FunctionApp(stack, "TestFuncApp", {
        name: "test-func",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
      });

      const blobAsset = functionApp.deployCodeFromBlob(
        fixturePath,
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/mystorage",
        "mystorageaccount",
        {
          useManagedIdentity: true,
        },
      );

      // Verify blob URL structure
      expect(blobAsset.blobUrl).toContain(
        "mystorageaccount.blob.core.windows.net",
      );
      expect(blobAsset.blobUrl).toContain("function-packages");
      expect(blobAsset.containerName).toBe("function-packages");
      expect(blobAsset.storageAccountName).toBe("mystorageaccount");
    });

    it("should support custom container names in blob configuration", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const functionApp = new FunctionApp(stack, "TestFuncApp", {
        name: "test-func",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
      });

      const blobAsset = functionApp.deployCodeFromBlob(
        fixturePath,
        "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/mystorage",
        "mystorageaccount",
        {
          containerName: "my-custom-container",
          useManagedIdentity: true,
        },
      );

      expect(blobAsset.containerName).toBe("my-custom-container");
      expect(blobAsset.blobUrl).toContain("my-custom-container");
    });
  });

  describe("usage patterns from examples", () => {
    it("should create Node.js function app with npm bundling (requires Docker)", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const functionApp = new FunctionApp(stack, "NodeJsFunc", {
        name: "nodejs-func",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        codeAsset: {
          sourcePath: "./src/azure-functionapp/test/fixtures/sample-function",
          bundling: {
            image: "node:20",
            command: [
              "sh",
              "-c",
              "cp -r . /asset-output/ && cd /asset-output && npm ci --production",
            ],
            environment: {
              NPM_CONFIG_LOGLEVEL: "error",
            },
          },
          exclude: ["node_modules", "*.test.ts", "*.spec.ts"],
        },
        siteConfig: {
          appSettings: [
            { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
            { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
            { name: "NODE_ENV", value: "production" },
          ],
          linuxFxVersion: "NODE|20",
          alwaysOn: true,
        },
        httpsOnly: true,
        identity: {
          type: "SystemAssigned",
        },
      });

      expect(functionApp.assetHash).toBeDefined();
      expect(functionApp.assetPath).toBeDefined();
      expect(functionApp.props.siteConfig?.appSettings).toHaveLength(3);
    });

    it("should create Python function app with pip requirements (requires Docker)", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const functionApp = new FunctionApp(stack, "PythonFunc", {
        name: "python-func",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        codeAsset: {
          sourcePath: "./src/azure-functionapp/test/fixtures/sample-function",
          bundling: {
            image: "python:3.11",
            command: [
              "sh",
              "-c",
              "cp -r . /asset-output/ && cd /asset-output && pip install -r requirements.txt -t . 2>/dev/null || true",
            ],
            environment: {
              PIP_NO_CACHE_DIR: "1",
            },
          },
          exclude: ["__pycache__", "*.pyc", ".pytest_cache", "venv"],
        },
        siteConfig: {
          appSettings: [
            { name: "FUNCTIONS_WORKER_RUNTIME", value: "python" },
            { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
          ],
          linuxFxVersion: "PYTHON|3.11",
        },
        httpsOnly: true,
      });

      expect(functionApp.props.siteConfig?.linuxFxVersion).toBe("PYTHON|3.11");
      expect(functionApp.props.kind).toBe("functionapp,linux");
    });

    it("should create function app with minimal asset configuration", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const functionApp = new FunctionApp(stack, "SimpleFunc", {
        name: "simple-func",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        codeAsset: {
          sourcePath: "./src/azure-functionapp/test/fixtures/sample-function",
          exclude: [".gitignore", "*.md", ".env"],
        },
        siteConfig: {
          appSettings: [{ name: "FUNCTIONS_WORKER_RUNTIME", value: "node" }],
          linuxFxVersion: "NODE|20",
        },
      });

      expect(functionApp).toBeInstanceOf(FunctionApp);
      expect(functionApp.assetPath).toBeDefined();
    });

    it("should create function app with environment-specific bundling (requires Docker)", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const environment = "prod";

      const functionApp = new FunctionApp(stack, "AdvancedFunc", {
        name: "advanced-func",
        location: "eastus",
        resourceGroupId: rg.id,
        serverFarmId:
          "/subscriptions/sub-id/resourceGroups/rg/providers/Microsoft.Web/serverfarms/plan",
        kind: "functionapp,linux",
        codeAsset: {
          sourcePath: "./src/azure-functionapp/test/fixtures/sample-function",
          bundling: {
            image: "node:20-alpine",
            command: [
              "sh",
              "-c",
              environment === "prod"
                ? "cp -r . /asset-output/ && cd /asset-output && npm ci --only=production"
                : "cp -r . /asset-output/ && cd /asset-output && npm ci",
            ],
            environment: {
              NODE_ENV: environment === "prod" ? "production" : "development",
              BUILD_ENV: environment,
              NPM_CONFIG_LOGLEVEL: "error",
            },
          },
          exclude: ["node_modules", ".env*", "*.test.ts", "coverage", ".git"],
          assetHash: `${environment}-build`,
        },
        siteConfig: {
          appSettings: [
            { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
            { name: "ENVIRONMENT", value: environment },
            { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
          ],
          linuxFxVersion: "NODE|20",
          alwaysOn: environment === "prod",
        },
        identity: {
          type: "SystemAssigned",
        },
        tags: {
          Environment: environment,
          AssetPipeline: "enabled",
        },
      });

      expect(functionApp.props.tags?.Environment).toBe("prod");
      expect(functionApp.props.siteConfig?.alwaysOn).toBe(true);
      expect(functionApp.props.siteConfig?.appSettings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "ENVIRONMENT", value: "prod" }),
        ]),
      );
    });
  });
});
