/**
 * Comprehensive tests for the ActivityLogAlert implementation
 *
 * This test suite validates the ActivityLogAlert class using the AzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * condition filtering, category types, scope configurations, action group integration,
 * property transformation, and resource creation.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import {
  ActivityLogAlert,
  ActivityLogAlertProps,
  ActivityLogAlertCondition,
} from "../lib/activity-log-alert";

describe("ActivityLogAlert - Implementation", () => {
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
    it("should create activity log alert with minimal required properties", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Compute/virtualMachines/delete",
          },
        ],
      };

      const props: ActivityLogAlertProps = {
        name: "test-activity-log-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "TestActivityLogAlert",
        props,
      );

      expect(activityLogAlert).toBeInstanceOf(ActivityLogAlert);
      expect(activityLogAlert.props).toBe(props);
      expect(activityLogAlert.props.name).toBe("test-activity-log-alert");
      expect(activityLogAlert.props.scopes).toHaveLength(1);
    });

    it("should apply default values correctly", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const props: ActivityLogAlertProps = {
        name: "default-activity-log-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "DefaultActivityLogAlert",
        props,
      );

      expect(activityLogAlert).toBeInstanceOf(ActivityLogAlert);
      expect(activityLogAlert.props.enabled).toBeUndefined(); // Should use default in createResourceBody
    });

    it("should assign all properties correctly", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Security" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Security/locations/alerts/activate/action",
          },
        ],
      };

      const actions = {
        actionGroups: [
          {
            actionGroupId:
              "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/test-ag",
          },
        ],
      };

      const props: ActivityLogAlertProps = {
        name: "full-activity-log-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        description: "Alert for security events",
        enabled: false,
        scopes: ["/subscriptions/test-sub"],
        condition,
        actions,
        tags: {
          environment: "test",
          team: "security",
        },
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "FullActivityLogAlert",
        props,
      );

      expect(activityLogAlert.props.name).toBe("full-activity-log-alert");
      expect(activityLogAlert.props.description).toBe(
        "Alert for security events",
      );
      expect(activityLogAlert.props.enabled).toBe(false);
      expect(activityLogAlert.props.condition).toEqual(condition);
      expect(activityLogAlert.props.actions).toEqual(actions);
      expect(activityLogAlert.props.tags).toEqual({
        environment: "test",
        team: "security",
      });
    });

    it("should verify schema registration occurs", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      // Create first activity log alert to trigger schema registration
      new ActivityLogAlert(stack, "FirstActivityLogAlert", {
        name: "first-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      // Create second activity log alert to verify schemas are already registered
      const activityLogAlert = new ActivityLogAlert(
        stack,
        "SecondActivityLogAlert",
        {
          name: "second-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub"],
          condition,
        },
      );

      expect(activityLogAlert).toBeInstanceOf(ActivityLogAlert);
    });
  });

  // =============================================================================
  // Version Resolution
  // =============================================================================

  describe("Version Resolution", () => {
    it("should use default version 2020-10-01 when no version specified", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "DefaultVersion", {
        name: "default-version-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      expect(activityLogAlert.resolvedApiVersion).toBe("2020-10-01");
    });

    it("should use explicit version when specified", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "PinnedVersion", {
        name: "pinned-version-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
        apiVersion: "2020-10-01",
      });

      expect(activityLogAlert.resolvedApiVersion).toBe("2020-10-01");
    });

    it("should apply version configuration correctly", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const props: ActivityLogAlertProps = {
        name: "versioned-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
        apiVersion: "2020-10-01",
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "VersionedAlert",
        props,
      );

      expect(activityLogAlert.resolvedApiVersion).toBe("2020-10-01");
      expect(activityLogAlert).toBeInstanceOf(ActivityLogAlert);
    });
  });

  // =============================================================================
  // Category Types
  // =============================================================================

  describe("Category Types", () => {
    it("should configure alert for Administrative category", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Compute/virtualMachines/delete",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "AdministrativeAlert",
        {
          name: "administrative-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub"],
          condition,
        },
      );

      expect(activityLogAlert.props.condition.allOf[0].equalsValue).toBe(
        "Administrative",
      );
    });

    it("should configure alert for ServiceHealth category", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "ServiceHealth" },
          { field: "properties.incidentType", equalsValue: "Incident" },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "ServiceHealthAlert",
        {
          name: "service-health-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub"],
          condition,
        },
      );

      expect(activityLogAlert.props.condition.allOf[0].equalsValue).toBe(
        "ServiceHealth",
      );
    });

    it("should configure alert for ResourceHealth category", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "ResourceHealth" },
          {
            field: "properties.currentHealthStatus",
            equalsValue: "Unavailable",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "ResourceHealthAlert",
        {
          name: "resource-health-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub"],
          condition,
        },
      );

      expect(activityLogAlert.props.condition.allOf[0].equalsValue).toBe(
        "ResourceHealth",
      );
    });

    it("should configure alert for Security category", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Security" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Security/locations/alerts/activate/action",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "SecurityAlert", {
        name: "security-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      expect(activityLogAlert.props.condition.allOf[0].equalsValue).toBe(
        "Security",
      );
    });

    it("should configure alert for Alert category", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Alert" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Insights/metricAlerts/write",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "AlertCategoryAlert",
        {
          name: "alert-category-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub"],
          condition,
        },
      );

      expect(activityLogAlert.props.condition.allOf[0].equalsValue).toBe(
        "Alert",
      );
    });

    it("should configure alert for Autoscale category", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Autoscale" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Insights/AutoscaleSettings/ScaleUpAction",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "AutoscaleAlert", {
        name: "autoscale-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      expect(activityLogAlert.props.condition.allOf[0].equalsValue).toBe(
        "Autoscale",
      );
    });
  });

  // =============================================================================
  // Condition Filtering
  // =============================================================================

  describe("Condition Filtering", () => {
    it("should configure single condition", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "SingleCondition", {
        name: "single-condition-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      expect(activityLogAlert.props.condition.allOf).toHaveLength(1);
      expect(activityLogAlert.props.condition.allOf[0].field).toBe("category");
    });

    it("should configure multiple conditions with AND logic", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Storage/storageAccounts/write",
          },
          { field: "status", equalsValue: "Succeeded" },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "MultipleConditions",
        {
          name: "multi-condition-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub"],
          condition,
        },
      );

      expect(activityLogAlert.props.condition.allOf).toHaveLength(3);
      expect(activityLogAlert.props.condition.allOf[1].field).toBe(
        "operationName",
      );
      expect(activityLogAlert.props.condition.allOf[2].field).toBe("status");
    });

    it("should filter by operation name", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Compute/virtualMachines/write",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "OperationNameFilter",
        {
          name: "operation-name-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub"],
          condition,
        },
      );

      expect(activityLogAlert.props.condition.allOf[1].equalsValue).toBe(
        "Microsoft.Compute/virtualMachines/write",
      );
    });

    it("should filter by resource type", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "resourceType",
            equalsValue: "Microsoft.Compute/virtualMachines",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "ResourceTypeFilter",
        {
          name: "resource-type-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub"],
          condition,
        },
      );

      const resourceTypeCondition = activityLogAlert.props.condition.allOf.find(
        (c) => c.field === "resourceType",
      );
      expect(resourceTypeCondition?.equalsValue).toBe(
        "Microsoft.Compute/virtualMachines",
      );
    });

    it("should filter by status Succeeded", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          { field: "status", equalsValue: "Succeeded" },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "StatusSucceededFilter",
        {
          name: "status-succeeded-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub"],
          condition,
        },
      );

      const statusCondition = activityLogAlert.props.condition.allOf.find(
        (c) => c.field === "status",
      );
      expect(statusCondition?.equalsValue).toBe("Succeeded");
    });

    it("should filter by status Failed", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Network/networkSecurityGroups/delete",
          },
          { field: "status", equalsValue: "Failed" },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "StatusFailedFilter",
        {
          name: "status-failed-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub"],
          condition,
        },
      );

      const statusCondition = activityLogAlert.props.condition.allOf.find(
        (c) => c.field === "status",
      );
      expect(statusCondition?.equalsValue).toBe("Failed");
    });

    it("should filter by status Started", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          { field: "status", equalsValue: "Started" },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "StatusStartedFilter",
        {
          name: "status-started-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub"],
          condition,
        },
      );

      const statusCondition = activityLogAlert.props.condition.allOf.find(
        (c) => c.field === "status",
      );
      expect(statusCondition?.equalsValue).toBe("Started");
    });

    it("should filter by resource group", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          { field: "resourceGroup", equalsValue: "production-rg" },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "ResourceGroupFilter",
        {
          name: "resource-group-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub"],
          condition,
        },
      );

      const rgCondition = activityLogAlert.props.condition.allOf.find(
        (c) => c.field === "resourceGroup",
      );
      expect(rgCondition?.equalsValue).toBe("production-rg");
    });

    it("should filter by subStatus", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          { field: "subStatus", equalsValue: "Created" },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "SubStatusFilter", {
        name: "substatus-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      const subStatusCondition = activityLogAlert.props.condition.allOf.find(
        (c) => c.field === "subStatus",
      );
      expect(subStatusCondition?.equalsValue).toBe("Created");
    });
  });

  // =============================================================================
  // Scope Configuration
  // =============================================================================

  describe("Scope Configuration", () => {
    it("should configure subscription-level scope", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "SubscriptionScope",
        {
          name: "subscription-scope-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/00000000-0000-0000-0000-000000000000"],
          condition,
        },
      );

      expect(activityLogAlert.props.scopes).toHaveLength(1);
      expect(activityLogAlert.props.scopes[0]).toContain("/subscriptions/");
    });

    it("should configure resource group scope", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "ResourceGroupScope",
        {
          name: "rg-scope-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub/resourceGroups/production-rg"],
          condition,
        },
      );

      expect(activityLogAlert.props.scopes[0]).toContain("/resourceGroups/");
    });

    it("should configure specific resource scope", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "ResourceScope", {
        name: "resource-scope-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/myaccount",
        ],
        condition,
      });

      expect(activityLogAlert.props.scopes[0]).toContain(
        "/providers/Microsoft.Storage/",
      );
    });

    it("should configure multiple scopes", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "MultipleScopes", {
        name: "multi-scope-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: [
          "/subscriptions/test-sub/resourceGroups/rg1",
          "/subscriptions/test-sub/resourceGroups/rg2",
          "/subscriptions/test-sub/resourceGroups/rg3",
        ],
        condition,
      });

      expect(activityLogAlert.props.scopes).toHaveLength(3);
    });
  });

  // =============================================================================
  // Operation Name Filtering
  // =============================================================================

  describe("Operation Name Filtering", () => {
    it("should filter storage account operations", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Storage/storageAccounts/write",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "StorageOperation", {
        name: "storage-operation-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      expect(activityLogAlert.props.condition.allOf[1].equalsValue).toBe(
        "Microsoft.Storage/storageAccounts/write",
      );
    });

    it("should filter virtual machine operations", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Compute/virtualMachines/delete",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "VMOperation", {
        name: "vm-operation-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      expect(activityLogAlert.props.condition.allOf[1].equalsValue).toBe(
        "Microsoft.Compute/virtualMachines/delete",
      );
    });

    it("should filter network security group operations", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "operationName",
            equalsValue:
              "Microsoft.Network/networkSecurityGroups/securityRules/write",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "NSGOperation", {
        name: "nsg-operation-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      expect(activityLogAlert.props.condition.allOf[1].equalsValue).toBe(
        "Microsoft.Network/networkSecurityGroups/securityRules/write",
      );
    });

    it("should filter SQL database operations", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Sql/servers/databases/write",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "SQLOperation", {
        name: "sql-operation-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      expect(activityLogAlert.props.condition.allOf[1].equalsValue).toBe(
        "Microsoft.Sql/servers/databases/write",
      );
    });

    it("should filter key vault operations", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "operationName",
            equalsValue: "Microsoft.KeyVault/vaults/delete",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "KeyVaultOperation",
        {
          name: "keyvault-operation-alert",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          scopes: ["/subscriptions/test-sub"],
          condition,
        },
      );

      expect(activityLogAlert.props.condition.allOf[1].equalsValue).toBe(
        "Microsoft.KeyVault/vaults/delete",
      );
    });
  });

  // =============================================================================
  // Action Group Integration
  // =============================================================================

  describe("Action Group Integration", () => {
    it("should configure single action group", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const actions = {
        actionGroups: [
          {
            actionGroupId:
              "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/ops-ag",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "SingleAction", {
        name: "single-action-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
        actions,
      });

      expect(activityLogAlert.props.actions?.actionGroups).toHaveLength(1);
      expect(
        activityLogAlert.props.actions?.actionGroups![0].actionGroupId,
      ).toContain("ops-ag");
    });

    it("should configure multiple action groups", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Security" }],
      };

      const actions = {
        actionGroups: [
          {
            actionGroupId:
              "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/ops-ag",
          },
          {
            actionGroupId:
              "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/security-ag",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "MultipleActions", {
        name: "multi-action-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
        actions,
      });

      expect(activityLogAlert.props.actions?.actionGroups).toHaveLength(2);
    });

    it("should configure action with webhook properties", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const actions = {
        actionGroups: [
          {
            actionGroupId:
              "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/webhook-ag",
            webhookProperties: {
              customProperty1: "value1",
              customProperty2: "value2",
            },
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "WebhookAction", {
        name: "webhook-action-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
        actions,
      });

      expect(
        activityLogAlert.props.actions?.actionGroups![0].webhookProperties,
      ).toEqual({
        customProperty1: "value1",
        customProperty2: "value2",
      });
    });

    it("should handle alert without actions", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "NoActions", {
        name: "no-actions-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      expect(activityLogAlert.props.actions).toBeUndefined();
    });
  });

  // =============================================================================
  // Property Transformation
  // =============================================================================

  describe("Property Transformation", () => {
    it("should generate correct Azure API format via createResourceBody", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Compute/virtualMachines/delete",
          },
        ],
      };

      const props: ActivityLogAlertProps = {
        name: "transform-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
        tags: {
          environment: "production",
        },
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "TransformTest",
        props,
      );

      // Access the protected createResourceBody method via the instance
      const resourceBody = (activityLogAlert as any).createResourceBody(props);

      expect(resourceBody).toHaveProperty("location");
      expect(resourceBody).toHaveProperty("tags");
      expect(resourceBody).toHaveProperty("properties");
      expect(resourceBody.properties).toHaveProperty("scopes");
      expect(resourceBody.properties).toHaveProperty("condition");
      expect(resourceBody.properties).toHaveProperty("enabled");
    });

    it("should set location to global", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const props: ActivityLogAlertProps = {
        name: "location-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "LocationTest",
        props,
      );
      const resourceBody = (activityLogAlert as any).createResourceBody(props);

      expect(resourceBody.location).toBe("global");
    });

    it("should transform tags correctly", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const props: ActivityLogAlertProps = {
        name: "tags-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
        tags: {
          environment: "dev",
          owner: "platform-team",
          cost_center: "engineering",
        },
      };

      const activityLogAlert = new ActivityLogAlert(stack, "TagsTest", props);
      const resourceBody = (activityLogAlert as any).createResourceBody(props);

      expect(resourceBody.tags).toEqual({
        environment: "dev",
        owner: "platform-team",
        cost_center: "engineering",
      });
    });

    it("should format condition object properly", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Storage/storageAccounts/write",
          },
          { field: "status", equalsValue: "Succeeded" },
        ],
      };

      const props: ActivityLogAlertProps = {
        name: "condition-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "ConditionTest",
        props,
      );
      const resourceBody = (activityLogAlert as any).createResourceBody(props);

      expect(resourceBody.properties.condition).toHaveProperty("allOf");
      expect(resourceBody.properties.condition.allOf).toHaveLength(3);
      expect(resourceBody.properties.condition.allOf[0]).toHaveProperty(
        "field",
      );
      expect(resourceBody.properties.condition.allOf[0]).toHaveProperty(
        "equals",
      );
    });

    it("should apply default enabled value", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const props: ActivityLogAlertProps = {
        name: "default-enabled-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "DefaultEnabledTest",
        props,
      );
      const resourceBody = (activityLogAlert as any).createResourceBody(props);

      expect(resourceBody.properties.enabled).toBe(true);
    });

    it("should respect explicit enabled value", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const props: ActivityLogAlertProps = {
        name: "explicit-enabled-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
        enabled: false,
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "ExplicitEnabledTest",
        props,
      );
      const resourceBody = (activityLogAlert as any).createResourceBody(props);

      expect(resourceBody.properties.enabled).toBe(false);
    });
  });

  // =============================================================================
  // Integration with Base Class
  // =============================================================================

  describe("Integration with Base Class", () => {
    it("should inherit from AzapiResource", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "InheritanceTest", {
        name: "inheritance-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      // Verify it has AzapiResource properties
      expect(activityLogAlert).toHaveProperty("terraformResource");
      expect(activityLogAlert).toHaveProperty("resolvedApiVersion");
    });

    it("should have correct azapiResourceType", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "ResourceTypeTest", {
        name: "resource-type-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      // Access the protected resourceType method
      const resourceType = (activityLogAlert as any).resourceType();
      expect(resourceType).toBe("Microsoft.Insights/activityLogAlerts");
    });

    it("should generate resource outputs", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "OutputsTest", {
        name: "outputs-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      expect(activityLogAlert.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(activityLogAlert.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(activityLogAlert.id).toMatch(/^\$\{.*\.id\}$/);
    });
  });

  // =============================================================================
  // Tag Management
  // =============================================================================

  describe("Tag Management", () => {
    it("should add tags using addTag method", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "AddTagTest", {
        name: "add-tag-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
        tags: {
          initial: "value",
        },
      });

      activityLogAlert.addTag("newTag", "newValue");

      expect(activityLogAlert.props.tags).toHaveProperty("newTag", "newValue");
      expect(activityLogAlert.props.tags).toHaveProperty("initial", "value");
    });

    it("should remove tags using removeTag method", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "RemoveTagTest", {
        name: "remove-tag-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
        tags: {
          toRemove: "value",
          toKeep: "value",
        },
      });

      activityLogAlert.removeTag("toRemove");

      expect(activityLogAlert.props.tags).not.toHaveProperty("toRemove");
      expect(activityLogAlert.props.tags).toHaveProperty("toKeep", "value");
    });

    it("should initialize tags object when adding to undefined tags", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "InitTagTest", {
        name: "init-tag-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      activityLogAlert.addTag("firstTag", "firstValue");

      expect(activityLogAlert.props.tags).toHaveProperty(
        "firstTag",
        "firstValue",
      );
    });
  });

  // =============================================================================
  // CDK Terraform Integration
  // =============================================================================

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      new ActivityLogAlert(stack, "SynthTest", {
        name: "synth-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple activity log alerts in the same stack", () => {
      const condition1: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "Administrative" }],
      };

      const condition2: ActivityLogAlertCondition = {
        allOf: [{ field: "category", equalsValue: "ServiceHealth" }],
      };

      const alert1 = new ActivityLogAlert(stack, "ActivityLogAlert1", {
        name: "alert-1",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition: condition1,
      });

      const alert2 = new ActivityLogAlert(stack, "ActivityLogAlert2", {
        name: "alert-2",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        scopes: ["/subscriptions/test-sub"],
        condition: condition2,
        apiVersion: "2020-10-01",
      });

      expect(alert1.resolvedApiVersion).toBe("2020-10-01");
      expect(alert2.resolvedApiVersion).toBe("2020-10-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  // =============================================================================
  // Complex Scenarios
  // =============================================================================

  describe("Complex Scenarios", () => {
    it("should handle comprehensive VM deletion alert", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Administrative" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Compute/virtualMachines/delete",
          },
          { field: "status", equalsValue: "Succeeded" },
          { field: "resourceGroup", equalsValue: "production-rg" },
        ],
      };

      const actions = {
        actionGroups: [
          {
            actionGroupId:
              "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/critical-ag",
            webhookProperties: {
              severity: "critical",
              alertType: "vm-deletion",
            },
          },
          {
            actionGroupId:
              "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/audit-ag",
          },
        ],
      };

      const props: ActivityLogAlertProps = {
        name: "comprehensive-vm-deletion-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        description: "Alert when production VMs are deleted",
        enabled: true,
        scopes: ["/subscriptions/test-sub"],
        condition,
        actions,
        tags: {
          environment: "production",
          criticality: "high",
          team: "ops",
          alertCategory: "security",
        },
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "ComprehensiveAlert",
        props,
      );
      const resourceBody = (activityLogAlert as any).createResourceBody(props);

      expect(resourceBody.properties.condition.allOf).toHaveLength(4);
      expect(resourceBody.properties.actions.actionGroups).toHaveLength(2);
      expect(resourceBody.properties.enabled).toBe(true);
      expect(resourceBody.tags).toHaveProperty("alertCategory", "security");
    });

    it("should handle service health incident alert", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "ServiceHealth" },
          { field: "properties.incidentType", equalsValue: "Incident" },
          {
            field: "properties.impactedServices[*].ServiceName",
            equalsValue: "Virtual Machines",
          },
        ],
      };

      const actions = {
        actionGroups: [
          {
            actionGroupId:
              "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/oncall-ag",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "ServiceHealthAlert",
        {
          name: "service-health-incident",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          description: "Alert on Azure service health incidents affecting VMs",
          scopes: ["/subscriptions/test-sub"],
          condition,
          actions,
        },
      );

      expect(activityLogAlert.props.condition.allOf).toHaveLength(3);
      expect(activityLogAlert.props.condition.allOf[0].equalsValue).toBe(
        "ServiceHealth",
      );
    });

    it("should handle resource health degraded alert", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "ResourceHealth" },
          { field: "properties.currentHealthStatus", equalsValue: "Degraded" },
          { field: "properties.cause", equalsValue: "PlatformInitiated" },
          {
            field: "resourceType",
            equalsValue: "Microsoft.Compute/virtualMachines",
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(
        stack,
        "ResourceHealthAlert",
        {
          name: "resource-health-degraded",
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          description: "Alert when VM health is degraded",
          scopes: ["/subscriptions/test-sub/resourceGroups/production-rg"],
          condition,
          actions: {
            actionGroups: [
              {
                actionGroupId:
                  "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/ops-ag",
              },
            ],
          },
        },
      );

      expect(activityLogAlert.props.condition.allOf).toHaveLength(4);
    });

    it("should handle security alert with multiple conditions", () => {
      const condition: ActivityLogAlertCondition = {
        allOf: [
          { field: "category", equalsValue: "Security" },
          {
            field: "operationName",
            equalsValue: "Microsoft.Security/locations/alerts/activate/action",
          },
          { field: "properties.severity", equalsValue: "High" },
        ],
      };

      const actions = {
        actionGroups: [
          {
            actionGroupId:
              "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/security-ag",
            webhookProperties: {
              priority: "high",
              escalate: "true",
            },
          },
        ],
      };

      const activityLogAlert = new ActivityLogAlert(stack, "SecurityAlert", {
        name: "high-severity-security-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        description: "Alert on high-severity security events",
        enabled: true,
        scopes: ["/subscriptions/test-sub"],
        condition,
        actions,
        tags: {
          environment: "production",
          alertType: "security",
          severity: "high",
        },
      });

      const resourceBody = (activityLogAlert as any).createResourceBody(
        activityLogAlert.props,
      );

      expect(resourceBody.properties.condition.allOf).toHaveLength(3);
      expect(
        resourceBody.properties.actions.actionGroups[0].webhookProperties,
      ).toHaveProperty("escalate", "true");
    });
  });
});
