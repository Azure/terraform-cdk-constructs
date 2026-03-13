/**
 * Comprehensive tests for the LogAnalyticsWorkspace implementation
 *
 * This test suite validates the LogAnalyticsWorkspace class using the AzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * property configurations, and resource creation.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import {
  LogAnalyticsWorkspace,
  LogAnalyticsWorkspaceProps,
} from "../lib/log-analytics-workspace";

describe("LogAnalyticsWorkspace - Implementation", () => {
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
    it("should create a Log Analytics Workspace with minimal configuration", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "test-workspace",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      const workspace = new LogAnalyticsWorkspace(
        stack,
        "TestWorkspace",
        props,
      );

      expect(workspace).toBeInstanceOf(LogAnalyticsWorkspace);
      expect(workspace.props).toBe(props);
      expect(workspace.props.name).toBe("test-workspace");
      expect(workspace.props.location).toBe("eastus");
    });

    it("should create a Log Analytics Workspace with custom retention", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "retention-workspace",
        location: "westus2",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        retentionInDays: 90,
      };

      const workspace = new LogAnalyticsWorkspace(
        stack,
        "RetentionWorkspace",
        props,
      );

      expect(workspace.props.retentionInDays).toBe(90);
    });

    it("should create a Log Analytics Workspace with PerGB2018 SKU", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "sku-workspace",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        sku: {
          name: "PerGB2018",
        },
      };

      const workspace = new LogAnalyticsWorkspace(stack, "SkuWorkspace", props);

      expect(workspace.props.sku?.name).toBe("PerGB2018");
    });

    it("should create a Log Analytics Workspace with CapacityReservation SKU", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "capacity-workspace",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        sku: {
          name: "CapacityReservation",
          capacityReservationLevel: 500,
        },
      };

      const workspace = new LogAnalyticsWorkspace(
        stack,
        "CapacityWorkspace",
        props,
      );

      expect(workspace.props.sku?.name).toBe("CapacityReservation");
      expect(workspace.props.sku?.capacityReservationLevel).toBe(500);
    });

    it("should create a Log Analytics Workspace with workspace capping", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "capped-workspace",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        workspaceCapping: {
          dailyQuotaGb: 100,
        },
      };

      const workspace = new LogAnalyticsWorkspace(
        stack,
        "CappedWorkspace",
        props,
      );

      expect(workspace.props.workspaceCapping?.dailyQuotaGb).toBe(100);
    });
  });

  // =============================================================================
  // Version Resolution
  // =============================================================================

  describe("Version Resolution", () => {
    it("should use latest version 2023-09-01 when no version specified", () => {
      const workspace = new LogAnalyticsWorkspace(stack, "DefaultVersion", {
        name: "default-version-workspace",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      expect(workspace.resolvedApiVersion).toBe("2023-09-01");
    });

    it("should use explicit version when specified", () => {
      const workspace = new LogAnalyticsWorkspace(stack, "PinnedVersion", {
        name: "pinned-version-workspace",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2022-10-01",
      });

      expect(workspace.resolvedApiVersion).toBe("2022-10-01");
    });

    it("should use latest version 2023-09-01 when explicitly specified", () => {
      const workspace = new LogAnalyticsWorkspace(stack, "LatestVersion", {
        name: "latest-version-workspace",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2023-09-01",
      });

      expect(workspace.resolvedApiVersion).toBe("2023-09-01");
    });
  });

  // =============================================================================
  // Validation Tests
  // =============================================================================

  describe("Validation", () => {
    it("should throw error when retention is below minimum", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "invalid-retention",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        retentionInDays: 7,
      };

      expect(() => {
        new LogAnalyticsWorkspace(stack, "InvalidRetention", props);
      }).toThrow(/retentionInDays must be between 30 and 730/);
    });

    it("should throw error when retention is above maximum", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "invalid-retention",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        retentionInDays: 1000,
      };

      expect(() => {
        new LogAnalyticsWorkspace(stack, "InvalidRetentionMax", props);
      }).toThrow(/retentionInDays must be between 30 and 730/);
    });

    it("should throw error when CapacityReservation SKU has invalid level", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "invalid-capacity",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        sku: {
          name: "CapacityReservation",
          capacityReservationLevel: 50, // Invalid level
        },
      };

      expect(() => {
        new LogAnalyticsWorkspace(stack, "InvalidCapacity", props);
      }).toThrow(/capacityReservationLevel must be one of/);
    });

    it("should throw error when CapacityReservation SKU has no level", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "missing-capacity-level",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        sku: {
          name: "CapacityReservation",
        },
      };

      expect(() => {
        new LogAnalyticsWorkspace(stack, "MissingCapacityLevel", props);
      }).toThrow(/capacityReservationLevel must be one of/);
    });

    it("should accept valid retention values", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "valid-retention",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        retentionInDays: 365,
      };

      expect(() => {
        new LogAnalyticsWorkspace(stack, "ValidRetention", props);
      }).not.toThrow();
    });

    it("should accept valid CapacityReservation levels", () => {
      const validLevels = [100, 200, 300, 400, 500, 1000, 2000, 5000];

      validLevels.forEach((level, index) => {
        const props: LogAnalyticsWorkspaceProps = {
          name: `valid-capacity-${level}`,
          location: "eastus",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          sku: {
            name: "CapacityReservation",
            capacityReservationLevel: level,
          },
        };

        expect(() => {
          new LogAnalyticsWorkspace(stack, `ValidCapacity${index}`, props);
        }).not.toThrow();
      });
    });
  });

  // =============================================================================
  // Public Network Access Configuration
  // =============================================================================

  describe("Public Network Access Configuration", () => {
    it("should configure public network access for ingestion", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "network-ingestion",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        publicNetworkAccessForIngestion: "Disabled",
      };

      const workspace = new LogAnalyticsWorkspace(
        stack,
        "NetworkIngestion",
        props,
      );

      expect(workspace.props.publicNetworkAccessForIngestion).toBe("Disabled");
    });

    it("should configure public network access for query", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "network-query",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        publicNetworkAccessForQuery: "Disabled",
      };

      const workspace = new LogAnalyticsWorkspace(stack, "NetworkQuery", props);

      expect(workspace.props.publicNetworkAccessForQuery).toBe("Disabled");
    });

    it("should configure both public network access settings", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "network-both",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        publicNetworkAccessForIngestion: "Disabled",
        publicNetworkAccessForQuery: "Disabled",
      };

      const workspace = new LogAnalyticsWorkspace(stack, "NetworkBoth", props);

      expect(workspace.props.publicNetworkAccessForIngestion).toBe("Disabled");
      expect(workspace.props.publicNetworkAccessForQuery).toBe("Disabled");
    });
  });

  // =============================================================================
  // Workspace Features Configuration
  // =============================================================================

  describe("Workspace Features Configuration", () => {
    it("should configure enableDataExport feature", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "feature-export",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        features: {
          enableDataExport: true,
        },
      };

      const workspace = new LogAnalyticsWorkspace(
        stack,
        "FeatureExport",
        props,
      );

      expect(workspace.props.features?.enableDataExport).toBe(true);
    });

    it("should configure immediatePurgeDataOn30Days feature", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "feature-purge",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        features: {
          immediatePurgeDataOn30Days: true,
        },
      };

      const workspace = new LogAnalyticsWorkspace(stack, "FeaturePurge", props);

      expect(workspace.props.features?.immediatePurgeDataOn30Days).toBe(true);
    });

    it("should configure disableLocalAuth feature", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "feature-auth",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        features: {
          disableLocalAuth: true,
        },
      };

      const workspace = new LogAnalyticsWorkspace(stack, "FeatureAuth", props);

      expect(workspace.props.features?.disableLocalAuth).toBe(true);
    });

    it("should configure multiple features", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "feature-multi",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        features: {
          enableDataExport: true,
          immediatePurgeDataOn30Days: false,
          disableLocalAuth: true,
          enableLogAccessUsingOnlyResourcePermissions: true,
        },
      };

      const workspace = new LogAnalyticsWorkspace(stack, "FeatureMulti", props);

      expect(workspace.props.features?.enableDataExport).toBe(true);
      expect(workspace.props.features?.immediatePurgeDataOn30Days).toBe(false);
      expect(workspace.props.features?.disableLocalAuth).toBe(true);
      expect(
        workspace.props.features?.enableLogAccessUsingOnlyResourcePermissions,
      ).toBe(true);
    });
  });

  // =============================================================================
  // Property Transformation
  // =============================================================================

  describe("Property Transformation", () => {
    it("should generate correct Azure API format via createResourceBody", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "transform-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        retentionInDays: 60,
        sku: {
          name: "PerGB2018",
        },
      };

      const workspace = new LogAnalyticsWorkspace(
        stack,
        "TransformTest",
        props,
      );

      // Access the protected createResourceBody method
      const resourceBody = (workspace as any).createResourceBody(props);

      expect(resourceBody).toHaveProperty("properties");
      expect(resourceBody.properties).toHaveProperty("retentionInDays", 60);
      expect(resourceBody.properties).toHaveProperty("sku");
      expect(resourceBody.properties.sku.name).toBe("PerGB2018");
    });

    it("should include workspaceCapping when specified", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "capping-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        workspaceCapping: {
          dailyQuotaGb: 50,
        },
      };

      const workspace = new LogAnalyticsWorkspace(stack, "CappingTest", props);
      const resourceBody = (workspace as any).createResourceBody(props);

      expect(resourceBody.properties.workspaceCapping).toBeDefined();
      expect(resourceBody.properties.workspaceCapping.dailyQuotaGb).toBe(50);
    });

    it("should include identity when specified", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "identity-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        identity: {
          type: "SystemAssigned",
        },
      };

      const workspace = new LogAnalyticsWorkspace(stack, "IdentityTest", props);
      const resourceBody = (workspace as any).createResourceBody(props);

      expect(resourceBody.identity).toBeDefined();
      expect(resourceBody.identity.type).toBe("SystemAssigned");
    });

    it("should apply default values for retention and SKU", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "defaults-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      const workspace = new LogAnalyticsWorkspace(stack, "DefaultsTest", props);
      const resourceBody = (workspace as any).createResourceBody(props);

      expect(resourceBody.properties.retentionInDays).toBe(30);
      expect(resourceBody.properties.sku.name).toBe("PerGB2018");
      expect(resourceBody.properties.publicNetworkAccessForIngestion).toBe(
        "Enabled",
      );
      expect(resourceBody.properties.publicNetworkAccessForQuery).toBe(
        "Enabled",
      );
    });
  });

  // =============================================================================
  // Integration with Base Class
  // =============================================================================

  describe("Integration with Base Class", () => {
    it("should inherit from AzapiResource", () => {
      const workspace = new LogAnalyticsWorkspace(stack, "InheritanceTest", {
        name: "inheritance-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      // Verify it has AzapiResource properties
      expect(workspace).toHaveProperty("terraformResource");
      expect(workspace).toHaveProperty("resolvedApiVersion");
    });

    it("should have correct resourceType", () => {
      const workspace = new LogAnalyticsWorkspace(stack, "ResourceTypeTest", {
        name: "resource-type-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      // Access the protected resourceType method
      const resourceType = (workspace as any).resourceType();
      expect(resourceType).toBe("Microsoft.OperationalInsights/workspaces");
    });

    it("should resolve parent ID correctly", () => {
      const resourceGroupId = "/subscriptions/test-sub/resourceGroups/test-rg";

      const props: LogAnalyticsWorkspaceProps = {
        name: "parent-id-test",
        location: "eastus",
        resourceGroupId,
      };

      const workspace = new LogAnalyticsWorkspace(stack, "ParentIdTest", props);

      // Access the protected resolveParentId method
      const parentId = (workspace as any).resolveParentId(props);
      expect(parentId).toBe(resourceGroupId);
    });

    it("should generate resource outputs", () => {
      const workspace = new LogAnalyticsWorkspace(stack, "OutputsTest", {
        name: "outputs-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      expect(workspace.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(workspace.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(workspace.workspaceIdOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(workspace.customerIdOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(workspace.id).toMatch(/^\$\{.*\.id\}$/);
    });
  });

  // =============================================================================
  // CDK Terraform Integration
  // =============================================================================

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new LogAnalyticsWorkspace(stack, "SynthTest", {
        name: "synth-test",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        retentionInDays: 90,
        sku: {
          name: "PerGB2018",
        },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple workspaces in the same stack", () => {
      const workspace1 = new LogAnalyticsWorkspace(stack, "Workspace1", {
        name: "workspace-1",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      const workspace2 = new LogAnalyticsWorkspace(stack, "Workspace2", {
        name: "workspace-2",
        location: "westus2",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2022-10-01",
      });

      expect(workspace1.resolvedApiVersion).toBe("2023-09-01");
      expect(workspace2.resolvedApiVersion).toBe("2022-10-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  // =============================================================================
  // Complex Scenarios
  // =============================================================================

  describe("Complex Scenarios", () => {
    it("should handle comprehensive workspace configuration", () => {
      const props: LogAnalyticsWorkspaceProps = {
        name: "comprehensive-workspace",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        retentionInDays: 365,
        sku: {
          name: "CapacityReservation",
          capacityReservationLevel: 1000,
        },
        workspaceCapping: {
          dailyQuotaGb: 200,
        },
        publicNetworkAccessForIngestion: "Enabled",
        publicNetworkAccessForQuery: "Disabled",
        features: {
          enableDataExport: true,
          immediatePurgeDataOn30Days: false,
          disableLocalAuth: true,
        },
        forceCmkForQuery: true,
        identity: {
          type: "SystemAssigned",
        },
        tags: {
          environment: "production",
          team: "platform",
        },
      };

      const workspace = new LogAnalyticsWorkspace(
        stack,
        "ComprehensiveConfig",
        props,
      );
      const resourceBody = (workspace as any).createResourceBody(props);

      expect(resourceBody.properties.retentionInDays).toBe(365);
      expect(resourceBody.properties.sku.name).toBe("CapacityReservation");
      expect(resourceBody.properties.sku.capacityReservationLevel).toBe(1000);
      expect(resourceBody.properties.workspaceCapping.dailyQuotaGb).toBe(200);
      expect(resourceBody.properties.publicNetworkAccessForIngestion).toBe(
        "Enabled",
      );
      expect(resourceBody.properties.publicNetworkAccessForQuery).toBe(
        "Disabled",
      );
      expect(resourceBody.properties.features.enableDataExport).toBe(true);
      expect(resourceBody.properties.features.disableLocalAuth).toBe(true);
      expect(resourceBody.properties.forceCmkForQuery).toBe(true);
      expect(resourceBody.identity.type).toBe("SystemAssigned");
    });

    it("should handle workspace with defaultDataCollectionRuleResourceId", () => {
      const dcrId =
        "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/dataCollectionRules/test-dcr";

      const props: LogAnalyticsWorkspaceProps = {
        name: "dcr-workspace",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        defaultDataCollectionRuleResourceId: dcrId,
      };

      const workspace = new LogAnalyticsWorkspace(stack, "DcrWorkspace", props);
      const resourceBody = (workspace as any).createResourceBody(props);

      expect(resourceBody.properties.defaultDataCollectionRuleResourceId).toBe(
        dcrId,
      );
    });
  });
});
