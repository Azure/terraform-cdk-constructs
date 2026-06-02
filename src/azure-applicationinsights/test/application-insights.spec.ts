/**
 * Comprehensive tests for the ApplicationInsights implementation
 *
 * This test suite validates the ApplicationInsights class using the AzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * property configurations, and resource creation.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import {
  ApplicationInsights,
  ApplicationInsightsProps,
} from "../lib/application-insights";

const TEST_RESOURCE_GROUP_ID = "/subscriptions/test-sub/resourceGroups/test-rg";
const TEST_WORKSPACE_ID =
  "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-law";

describe("ApplicationInsights - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  // =============================================================================
  // Constructor and Basic Properties
  // =============================================================================

  describe("Constructor and Basic Properties", () => {
    it("should create an Application Insights component with minimal configuration", () => {
      const props: ApplicationInsightsProps = {
        name: "test-appinsights",
        location: "eastus",
        resourceGroupId: TEST_RESOURCE_GROUP_ID,
        workspaceResourceId: TEST_WORKSPACE_ID,
      };

      const ai = new ApplicationInsights(stack, "TestAI", props);

      expect(ai).toBeInstanceOf(ApplicationInsights);
      expect(ai.props).toBe(props);
      expect(ai.props.name).toBe("test-appinsights");
      expect(ai.props.location).toBe("eastus");
      expect(ai.props.workspaceResourceId).toBe(TEST_WORKSPACE_ID);
    });

    it("should create an Application Insights component with custom retention", () => {
      const props: ApplicationInsightsProps = {
        name: "retention-ai",
        location: "westus2",
        resourceGroupId: TEST_RESOURCE_GROUP_ID,
        workspaceResourceId: TEST_WORKSPACE_ID,
        retentionInDays: 365,
      };

      const ai = new ApplicationInsights(stack, "RetentionAI", props);

      expect(ai.props.retentionInDays).toBe(365);
    });

    it("should create an Application Insights component with sampling", () => {
      const props: ApplicationInsightsProps = {
        name: "sampling-ai",
        location: "eastus",
        resourceGroupId: TEST_RESOURCE_GROUP_ID,
        workspaceResourceId: TEST_WORKSPACE_ID,
        samplingPercentage: 50,
      };

      const ai = new ApplicationInsights(stack, "SamplingAI", props);

      expect(ai.props.samplingPercentage).toBe(50);
    });

    it("should create an Application Insights component with java application type", () => {
      const props: ApplicationInsightsProps = {
        name: "java-ai",
        location: "eastus",
        resourceGroupId: TEST_RESOURCE_GROUP_ID,
        workspaceResourceId: TEST_WORKSPACE_ID,
        applicationType: "java",
      };

      const ai = new ApplicationInsights(stack, "JavaAI", props);

      expect(ai.props.applicationType).toBe("java");
    });

    it("should create an Application Insights component with private network access", () => {
      const props: ApplicationInsightsProps = {
        name: "private-ai",
        location: "eastus",
        resourceGroupId: TEST_RESOURCE_GROUP_ID,
        workspaceResourceId: TEST_WORKSPACE_ID,
        publicNetworkAccessForIngestion: "Disabled",
        publicNetworkAccessForQuery: "Disabled",
      };

      const ai = new ApplicationInsights(stack, "PrivateAI", props);

      expect(ai.props.publicNetworkAccessForIngestion).toBe("Disabled");
      expect(ai.props.publicNetworkAccessForQuery).toBe("Disabled");
    });
  });

  // =============================================================================
  // Version Resolution
  // =============================================================================

  describe("Version Resolution", () => {
    it("should use latest version 2020-02-02 when no version specified", () => {
      const ai = new ApplicationInsights(stack, "DefaultVersion", {
        name: "default-version-ai",
        location: "eastus",
        resourceGroupId: TEST_RESOURCE_GROUP_ID,
        workspaceResourceId: TEST_WORKSPACE_ID,
      });

      expect(ai.resolvedApiVersion).toBe("2020-02-02");
    });

    it("should use explicit version when specified", () => {
      const ai = new ApplicationInsights(stack, "PinnedVersion", {
        name: "pinned-version-ai",
        location: "eastus",
        resourceGroupId: TEST_RESOURCE_GROUP_ID,
        workspaceResourceId: TEST_WORKSPACE_ID,
        apiVersion: "2020-02-02",
      });

      expect(ai.resolvedApiVersion).toBe("2020-02-02");
    });
  });

  // =============================================================================
  // Validation Tests
  // =============================================================================

  describe("Validation", () => {
    it("should throw error when retention is not an allowed value", () => {
      const props: ApplicationInsightsProps = {
        name: "invalid-retention",
        location: "eastus",
        resourceGroupId: TEST_RESOURCE_GROUP_ID,
        workspaceResourceId: TEST_WORKSPACE_ID,
        retentionInDays: 45,
      };

      expect(() => {
        new ApplicationInsights(stack, "InvalidRetention", props);
      }).toThrow(/retentionInDays must be one of/);
    });

    it("should throw error when sampling percentage is below 0", () => {
      const props: ApplicationInsightsProps = {
        name: "invalid-sampling-low",
        location: "eastus",
        resourceGroupId: TEST_RESOURCE_GROUP_ID,
        workspaceResourceId: TEST_WORKSPACE_ID,
        samplingPercentage: -1,
      };

      expect(() => {
        new ApplicationInsights(stack, "InvalidSamplingLow", props);
      }).toThrow(/samplingPercentage must be between 0 and 100/);
    });

    it("should throw error when sampling percentage is above 100", () => {
      const props: ApplicationInsightsProps = {
        name: "invalid-sampling-high",
        location: "eastus",
        resourceGroupId: TEST_RESOURCE_GROUP_ID,
        workspaceResourceId: TEST_WORKSPACE_ID,
        samplingPercentage: 150,
      };

      expect(() => {
        new ApplicationInsights(stack, "InvalidSamplingHigh", props);
      }).toThrow(/samplingPercentage must be between 0 and 100/);
    });

    it("should accept valid retention values", () => {
      const validValues = [30, 60, 90, 120, 180, 270, 365, 550, 730];
      validValues.forEach((days, index) => {
        const props: ApplicationInsightsProps = {
          name: `valid-retention-${days}`,
          location: "eastus",
          resourceGroupId: TEST_RESOURCE_GROUP_ID,
          workspaceResourceId: TEST_WORKSPACE_ID,
          retentionInDays: days,
        };

        expect(() => {
          new ApplicationInsights(stack, `ValidRetention${index}`, props);
        }).not.toThrow();
      });
    });

    it("should accept boundary sampling percentage values", () => {
      [0, 100].forEach((value, index) => {
        const props: ApplicationInsightsProps = {
          name: `boundary-sampling-${value}`,
          location: "eastus",
          resourceGroupId: TEST_RESOURCE_GROUP_ID,
          workspaceResourceId: TEST_WORKSPACE_ID,
          samplingPercentage: value,
        };

        expect(() => {
          new ApplicationInsights(stack, `BoundarySampling${index}`, props);
        }).not.toThrow();
      });
    });
  });

  // =============================================================================
  // Synthesis
  // =============================================================================

  describe("Synthesis", () => {
    it("should synthesize Terraform configuration with workspace and properties", () => {
      new ApplicationInsights(stack, "SynthAI", {
        name: "synth-ai",
        location: "eastus",
        resourceGroupId: TEST_RESOURCE_GROUP_ID,
        workspaceResourceId: TEST_WORKSPACE_ID,
        retentionInDays: 120,
        samplingPercentage: 75,
        disableIpMasking: true,
        applicationType: "web",
        tags: { env: "test" },
      });

      const synthesized = Testing.synth(stack);
      const config = JSON.parse(synthesized);

      // Verify the resource was created
      expect(synthesized).toContain("Microsoft.Insights/components");
      expect(synthesized).toContain("synth-ai");
      expect(synthesized).toContain("WorkspaceResourceId");
      expect(synthesized).toContain("Application_Type");

      // Validate it's a valid Terraform JSON structure
      expect(config).toBeDefined();
    });
  });
});
