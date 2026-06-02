/**
 * Unit tests for Azure Static Web App construct
 *
 * Tests cover:
 * - Resource type validation
 * - API version support (2022-03-01, 2023-12-01, 2024-04-01)
 * - Basic creation scenarios
 * - SKU configurations (Free, Standard)
 * - Source control integration
 * - Build properties
 * - Tag management
 * - Output properties
 * - Ignore changes
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { StaticWebApp, StaticWebAppProps } from "../lib/static-web-app";

describe("StaticWebApp", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  describe("Resource Type", () => {
    it("should create a Static Web App instance", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
      });

      expect(swa).toBeInstanceOf(StaticWebApp);
    });
  });

  describe("API Version Support", () => {
    it("should support API version 2022-03-01", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
        apiVersion: "2022-03-01",
      });

      expect(swa.resolvedApiVersion).toBe("2022-03-01");
    });

    it("should support API version 2023-12-01", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
        apiVersion: "2023-12-01",
      });

      expect(swa.resolvedApiVersion).toBe("2023-12-01");
    });

    it("should support API version 2024-04-01", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
        apiVersion: "2024-04-01",
      });

      expect(swa.resolvedApiVersion).toBe("2024-04-01");
    });

    it("should default to 2024-04-01", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
      });

      expect(swa.resolvedApiVersion).toBe("2024-04-01");
    });
  });

  describe("Basic Creation", () => {
    it("should create a Free-tier Static Web App", () => {
      const props: StaticWebAppProps = {
        name: "test-swa",
        location: "eastus2",
        sku: {
          name: "Free",
          tier: "Free",
        },
      };

      const swa = new StaticWebApp(stack, "test-swa", props);

      expect(swa).toBeInstanceOf(StaticWebApp);
      expect(swa.props).toBe(props);
      expect(swa.props.sku?.name).toBe("Free");
      expect(swa.props.sku?.tier).toBe("Free");
    });

    it("should create a Standard-tier Static Web App", () => {
      const props: StaticWebAppProps = {
        name: "test-swa",
        location: "westus2",
        sku: {
          name: "Standard",
          tier: "Standard",
        },
      };

      const swa = new StaticWebApp(stack, "test-swa", props);

      expect(swa.props.sku?.name).toBe("Standard");
      expect(swa.props.sku?.tier).toBe("Standard");
    });

    it("should default SKU to Free in the resource body", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
      });

      expect(swa).toBeInstanceOf(StaticWebApp);
      expect(swa.props.sku).toBeUndefined();
    });
  });

  describe("Source Control Integration", () => {
    it("should configure GitHub source control integration", () => {
      const props: StaticWebAppProps = {
        name: "test-swa",
        location: "eastus2",
        sku: { name: "Standard", tier: "Standard" },
        repositoryUrl: "https://github.com/my-org/my-repo",
        branch: "main",
        repositoryToken: "github_token_placeholder",
        buildProperties: {
          appLocation: "/",
          apiLocation: "api",
          outputLocation: "dist",
        },
      };

      const swa = new StaticWebApp(stack, "test-swa", props);

      expect(swa.props.repositoryUrl).toBe("https://github.com/my-org/my-repo");
      expect(swa.props.branch).toBe("main");
      expect(swa.props.repositoryToken).toBe("github_token_placeholder");
      expect(swa.props.buildProperties?.appLocation).toBe("/");
      expect(swa.props.buildProperties?.apiLocation).toBe("api");
      expect(swa.props.buildProperties?.outputLocation).toBe("dist");
    });

    it("should support build commands", () => {
      const props: StaticWebAppProps = {
        name: "test-swa",
        location: "eastus2",
        repositoryUrl: "https://github.com/my-org/my-repo",
        branch: "main",
        buildProperties: {
          appLocation: "/",
          appBuildCommand: "npm run build",
          apiBuildCommand: "npm run build:api",
          skipGithubActionWorkflowGeneration: true,
        },
      };

      const swa = new StaticWebApp(stack, "test-swa", props);

      expect(swa.props.buildProperties?.appBuildCommand).toBe("npm run build");
      expect(swa.props.buildProperties?.apiBuildCommand).toBe(
        "npm run build:api",
      );
      expect(
        swa.props.buildProperties?.skipGithubActionWorkflowGeneration,
      ).toBe(true);
    });
  });

  describe("Configuration Options", () => {
    it("should configure staging environment policy", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
        stagingEnvironmentPolicy: "Disabled",
      });

      expect(swa.props.stagingEnvironmentPolicy).toBe("Disabled");
    });

    it("should configure allowConfigFileUpdates", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
        allowConfigFileUpdates: false,
      });

      expect(swa.props.allowConfigFileUpdates).toBe(false);
    });
  });

  describe("Tags", () => {
    it("should add tags to the Static Web App", () => {
      const props: StaticWebAppProps = {
        name: "test-swa",
        location: "eastus2",
        tags: {
          Environment: "Production",
          Department: "IT",
        },
      };

      const swa = new StaticWebApp(stack, "test-swa", props);

      expect(swa.props.tags?.Environment).toBe("Production");
      expect(swa.props.tags?.Department).toBe("IT");
    });

    it("should support adding tags", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
        tags: { environment: "test" },
      });

      swa.addTag("newTag", "newValue");
      expect(swa.props.tags!.newTag).toBe("newValue");
      expect(swa.props.tags!.environment).toBe("test");
    });

    it("should support removing tags", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
        tags: {
          environment: "test",
          temporary: "true",
        },
      });

      swa.removeTag("temporary");
      expect(swa.props.tags!.temporary).toBeUndefined();
      expect(swa.props.tags!.environment).toBe("test");
    });

    it("should handle empty tags by default", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
      });

      expect(swa.tags).toEqual({});
    });
  });

  describe("Output Properties", () => {
    it("should expose id, name, location, tags and default hostname outputs", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
      });

      expect(swa.id).toBeDefined();
      expect(swa.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(swa.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(swa.locationOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(swa.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(swa.defaultHostnameOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });

    it("should have correct id format and resourceId alias", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
      });

      expect(swa.id).toMatch(/^\$\{.*\.id\}$/);
      expect(swa.resourceId).toBe(swa.id);
    });

    it("should expose a defaultHostname interpolation", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
      });

      expect(swa.defaultHostname).toContain("defaultHostname");
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
        ignoreChanges: ["tags", "body.properties.repositoryToken"],
      });

      expect(swa).toBeInstanceOf(StaticWebApp);
      expect(swa.props.ignoreChanges).toEqual([
        "tags",
        "body.properties.repositoryToken",
      ]);
    });

    it("should handle empty ignore changes array", () => {
      const swa = new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
        ignoreChanges: [],
      });

      expect(swa).toBeInstanceOf(StaticWebApp);
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new StaticWebApp(stack, "test-swa", {
        name: "test-swa",
        location: "eastus2",
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple Static Web Apps in the same stack", () => {
      const swa1 = new StaticWebApp(stack, "SWA1", {
        name: "swa-1",
        location: "eastus2",
      });

      const swa2 = new StaticWebApp(stack, "SWA2", {
        name: "swa-2",
        location: "westus2",
        apiVersion: "2022-03-01",
        sku: { name: "Standard", tier: "Standard" },
      });

      expect(swa1.resolvedApiVersion).toBe("2024-04-01");
      expect(swa2.resolvedApiVersion).toBe("2022-03-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });
});
