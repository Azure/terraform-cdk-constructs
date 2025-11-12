/**
 * Comprehensive tests for the DiagnosticSettings implementation
 *
 * This test suite validates the DiagnosticSettings class using the AzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * destination configurations, property transformation, and resource creation.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import {
  DiagnosticLogConfig,
  DiagnosticMetricConfig,
} from "../../core-azure/lib/azapi/azapi-resource";
import {
  DiagnosticSettings,
  DiagnosticSettingsProps,
} from "../lib/diagnostic-settings";

describe("DiagnosticSettings - Implementation", () => {
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
    it("should create diagnostic settings with Log Analytics workspace", () => {
      const props: DiagnosticSettingsProps = {
        name: "test-diagnostics",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
      };

      const diagnostics = new DiagnosticSettings(
        stack,
        "TestDiagnostics",
        props,
      );

      expect(diagnostics).toBeInstanceOf(DiagnosticSettings);
      expect(diagnostics.props).toBe(props);
      expect(diagnostics.props.name).toBe("test-diagnostics");
    });

    it("should create diagnostic settings with storage account", () => {
      const props: DiagnosticSettingsProps = {
        name: "storage-diagnostics",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/test-storage",
        storageAccountId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/archive-storage",
      };

      const diagnostics = new DiagnosticSettings(
        stack,
        "StorageDiagnostics",
        props,
      );

      expect(diagnostics.props.storageAccountId).toBeDefined();
    });

    it("should create diagnostic settings with event hub", () => {
      const props: DiagnosticSettingsProps = {
        name: "eventhub-diagnostics",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Network/networkSecurityGroups/test-nsg",
        eventHubAuthorizationRuleId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.EventHub/namespaces/test-eh/authorizationRules/test-rule",
        eventHubName: "monitoring-hub",
      };

      const diagnostics = new DiagnosticSettings(
        stack,
        "EventHubDiagnostics",
        props,
      );

      expect(diagnostics.props.eventHubAuthorizationRuleId).toBeDefined();
      expect(diagnostics.props.eventHubName).toBe("monitoring-hub");
    });

    it("should create diagnostic settings with multiple destinations", () => {
      const props: DiagnosticSettingsProps = {
        name: "multi-destination-diagnostics",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Sql/servers/test-sql",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
        storageAccountId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/archive-storage",
        eventHubAuthorizationRuleId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.EventHub/namespaces/test-eh/authorizationRules/test-rule",
        eventHubName: "audit-hub",
      };

      const diagnostics = new DiagnosticSettings(stack, "MultiDest", props);

      expect(diagnostics.props.workspaceId).toBeDefined();
      expect(diagnostics.props.storageAccountId).toBeDefined();
      expect(diagnostics.props.eventHubAuthorizationRuleId).toBeDefined();
    });
  });

  // =============================================================================
  // Version Resolution
  // =============================================================================

  describe("Version Resolution", () => {
    it("should use latest version 2021-05-01-preview when no version specified", () => {
      const diagnostics = new DiagnosticSettings(stack, "DefaultVersion", {
        name: "default-version-diagnostics",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
      });

      expect(diagnostics.resolvedApiVersion).toBe("2021-05-01-preview");
    });

    it("should use explicit stable version when specified", () => {
      const diagnostics = new DiagnosticSettings(stack, "StableVersion", {
        name: "stable-version-diagnostics",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
        apiVersion: "2016-09-01",
      });

      expect(diagnostics.resolvedApiVersion).toBe("2016-09-01");
    });

    it("should use preview version when explicitly specified", () => {
      const diagnostics = new DiagnosticSettings(stack, "PreviewVersion", {
        name: "preview-version-diagnostics",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
        apiVersion: "2021-05-01-preview",
      });

      expect(diagnostics.resolvedApiVersion).toBe("2021-05-01-preview");
    });
  });

  // =============================================================================
  // Validation Tests
  // =============================================================================

  describe("Validation", () => {
    it("should throw error when no destination is specified", () => {
      const props: DiagnosticSettingsProps = {
        name: "no-destination",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
      };

      expect(() => {
        new DiagnosticSettings(stack, "NoDestination", props);
      }).toThrow(/At least one destination/);
    });

    it("should throw error when eventHubAuthorizationRuleId without eventHubName", () => {
      const props: DiagnosticSettingsProps = {
        name: "missing-eventhub-name",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        eventHubAuthorizationRuleId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.EventHub/namespaces/test-eh/authorizationRules/test-rule",
      };

      expect(() => {
        new DiagnosticSettings(stack, "MissingEventHubName", props);
      }).toThrow(/eventHubName is required/);
    });

    it("should not throw when eventHubName provided with eventHubAuthorizationRuleId", () => {
      const props: DiagnosticSettingsProps = {
        name: "valid-eventhub",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        eventHubAuthorizationRuleId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.EventHub/namespaces/test-eh/authorizationRules/test-rule",
        eventHubName: "monitoring-hub",
      };

      expect(() => {
        new DiagnosticSettings(stack, "ValidEventHub", props);
      }).not.toThrow();
    });
  });

  // =============================================================================
  // Log and Metric Configuration
  // =============================================================================

  describe("Log and Metric Configuration", () => {
    it("should configure logs with specific categories", () => {
      const logs: DiagnosticLogConfig[] = [
        {
          category: "AuditEvent",
          enabled: true,
          retentionPolicy: {
            enabled: true,
            days: 90,
          },
        },
        {
          category: "SecurityEvent",
          enabled: true,
          retentionPolicy: {
            enabled: true,
            days: 365,
          },
        },
      ];

      const diagnostics = new DiagnosticSettings(stack, "LogCategories", {
        name: "log-categories",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/test-storage",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
        logs,
      });

      expect(diagnostics.props.logs).toHaveLength(2);
      expect(diagnostics.props.logs![0].category).toBe("AuditEvent");
      expect(diagnostics.props.logs![0].retentionPolicy?.days).toBe(90);
    });

    it("should configure logs with category groups", () => {
      const logs: DiagnosticLogConfig[] = [
        {
          categoryGroup: "allLogs",
          enabled: true,
        },
      ];

      const diagnostics = new DiagnosticSettings(stack, "LogCategoryGroup", {
        name: "log-category-group",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
        logs,
        apiVersion: "2021-05-01-preview", // Category groups available in preview
      });

      expect(diagnostics.props.logs).toHaveLength(1);
      expect(diagnostics.props.logs![0].categoryGroup).toBe("allLogs");
    });

    it("should configure metrics", () => {
      const metrics: DiagnosticMetricConfig[] = [
        {
          category: "AllMetrics",
          enabled: true,
          retentionPolicy: {
            enabled: true,
            days: 30,
          },
        },
      ];

      const diagnostics = new DiagnosticSettings(stack, "Metrics", {
        name: "metrics-config",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
        metrics,
      });

      expect(diagnostics.props.metrics).toHaveLength(1);
      expect(diagnostics.props.metrics![0].category).toBe("AllMetrics");
      expect(diagnostics.props.metrics![0].retentionPolicy?.days).toBe(30);
    });

    it("should configure both logs and metrics", () => {
      const logs: DiagnosticLogConfig[] = [
        {
          category: "Administrative",
          enabled: true,
        },
      ];

      const metrics: DiagnosticMetricConfig[] = [
        {
          category: "AllMetrics",
          enabled: true,
        },
      ];

      const diagnostics = new DiagnosticSettings(stack, "LogsAndMetrics", {
        name: "logs-and-metrics",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Network/networkSecurityGroups/test-nsg",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
        logs,
        metrics,
      });

      expect(diagnostics.props.logs).toHaveLength(1);
      expect(diagnostics.props.metrics).toHaveLength(1);
    });
  });

  // =============================================================================
  // Property Transformation
  // =============================================================================

  describe("Property Transformation", () => {
    it("should generate correct Azure API format via createResourceBody", () => {
      const props: DiagnosticSettingsProps = {
        name: "transform-test",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
        logs: [
          {
            category: "AuditEvent",
            enabled: true,
          },
        ],
        metrics: [
          {
            category: "AllMetrics",
            enabled: true,
          },
        ],
      };

      const diagnostics = new DiagnosticSettings(stack, "TransformTest", props);

      // Access the protected createResourceBody method
      const resourceBody = (diagnostics as any).createResourceBody(props);

      expect(resourceBody).toHaveProperty("properties");
      expect(resourceBody.properties).toHaveProperty("workspaceId");
      expect(resourceBody.properties).toHaveProperty("logs");
      expect(resourceBody.properties).toHaveProperty("metrics");
      expect(resourceBody).not.toHaveProperty("location");
      expect(resourceBody).not.toHaveProperty("tags");
    });

    it("should include logAnalyticsDestinationType when specified", () => {
      const props: DiagnosticSettingsProps = {
        name: "destination-type-test",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
        logAnalyticsDestinationType: "Dedicated",
      };

      const diagnostics = new DiagnosticSettings(
        stack,
        "DestinationType",
        props,
      );
      const resourceBody = (diagnostics as any).createResourceBody(props);

      expect(resourceBody.properties.logAnalyticsDestinationType).toBe(
        "Dedicated",
      );
    });

    it("should handle empty logs and metrics arrays", () => {
      const props: DiagnosticSettingsProps = {
        name: "empty-arrays-test",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
      };

      const diagnostics = new DiagnosticSettings(stack, "EmptyArrays", props);
      const resourceBody = (diagnostics as any).createResourceBody(props);

      expect(resourceBody.properties.logs).toEqual([]);
      expect(resourceBody.properties.metrics).toEqual([]);
    });
  });

  // =============================================================================
  // Integration with Base Class
  // =============================================================================

  describe("Integration with Base Class", () => {
    it("should inherit from AzapiResource", () => {
      const diagnostics = new DiagnosticSettings(stack, "InheritanceTest", {
        name: "inheritance-test",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
      });

      // Verify it has AzapiResource properties
      expect(diagnostics).toHaveProperty("terraformResource");
      expect(diagnostics).toHaveProperty("resolvedApiVersion");
    });

    it("should have correct azapiResourceType", () => {
      const diagnostics = new DiagnosticSettings(stack, "ResourceTypeTest", {
        name: "resource-type-test",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
      });

      // Access the protected resourceType method
      const resourceType = (diagnostics as any).resourceType();
      expect(resourceType).toBe("Microsoft.Insights/diagnosticSettings");
    });

    it("should resolve parent ID correctly", () => {
      const targetResourceId =
        "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm";

      const props: DiagnosticSettingsProps = {
        name: "parent-id-test",
        targetResourceId,
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
      };

      const diagnostics = new DiagnosticSettings(stack, "ParentIdTest", props);

      // Access the protected resolveParentId method
      const parentId = (diagnostics as any).resolveParentId(props);
      expect(parentId).toBe(targetResourceId);
    });

    it("should generate resource outputs", () => {
      const diagnostics = new DiagnosticSettings(stack, "OutputsTest", {
        name: "outputs-test",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
      });

      expect(diagnostics.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(diagnostics.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(diagnostics.id).toMatch(/^\$\{.*\.id\}$/);
    });
  });

  // =============================================================================
  // CDK Terraform Integration
  // =============================================================================

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new DiagnosticSettings(stack, "SynthTest", {
        name: "synth-test",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
        logs: [
          {
            category: "AuditEvent",
            enabled: true,
          },
        ],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple diagnostic settings in the same stack", () => {
      const diagnostics1 = new DiagnosticSettings(stack, "Diagnostics1", {
        name: "diagnostics-1",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
      });

      const diagnostics2 = new DiagnosticSettings(stack, "Diagnostics2", {
        name: "diagnostics-2",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm2",
        storageAccountId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/archive-storage",
        apiVersion: "2016-09-01",
      });

      expect(diagnostics1.resolvedApiVersion).toBe("2021-05-01-preview");
      expect(diagnostics2.resolvedApiVersion).toBe("2016-09-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  // =============================================================================
  // Complex Scenarios
  // =============================================================================

  describe("Complex Scenarios", () => {
    it("should handle comprehensive diagnostic settings configuration", () => {
      const logs: DiagnosticLogConfig[] = [
        {
          category: "AuditEvent",
          enabled: true,
          retentionPolicy: {
            enabled: true,
            days: 365,
          },
        },
        {
          category: "SecurityEvent",
          enabled: true,
          retentionPolicy: {
            enabled: true,
            days: 365,
          },
        },
        {
          category: "Administrative",
          enabled: false,
        },
      ];

      const metrics: DiagnosticMetricConfig[] = [
        {
          category: "AllMetrics",
          enabled: true,
          retentionPolicy: {
            enabled: true,
            days: 30,
          },
        },
      ];

      const props: DiagnosticSettingsProps = {
        name: "comprehensive-diagnostics",
        targetResourceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/test-storage",
        workspaceId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.OperationalInsights/workspaces/test-workspace",
        storageAccountId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/archive-storage",
        eventHubAuthorizationRuleId:
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.EventHub/namespaces/test-eh/authorizationRules/test-rule",
        eventHubName: "security-events",
        logs,
        metrics,
        logAnalyticsDestinationType: "Dedicated",
      };

      const diagnostics = new DiagnosticSettings(
        stack,
        "ComprehensiveConfig",
        props,
      );
      const resourceBody = (diagnostics as any).createResourceBody(props);

      expect(resourceBody.properties.workspaceId).toBeDefined();
      expect(resourceBody.properties.storageAccountId).toBeDefined();
      expect(resourceBody.properties.eventHubAuthorizationRuleId).toBeDefined();
      expect(resourceBody.properties.eventHubName).toBe("security-events");
      expect(resourceBody.properties.logs).toHaveLength(3);
      expect(resourceBody.properties.metrics).toHaveLength(1);
      expect(resourceBody.properties.logAnalyticsDestinationType).toBe(
        "Dedicated",
      );
    });
  });
});
