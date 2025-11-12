/**
 * Comprehensive tests for the MetricAlert implementation
 *
 * This test suite validates the MetricAlert class using the AzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * static and dynamic threshold configurations, dimension filtering, multi-resource alerts,
 * property transformation, and resource creation.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import {
  MetricAlert,
  MetricAlertProps,
  StaticThresholdCriteria,
  DynamicThresholdCriteria,
  MetricDimension,
  MetricAlertAction,
} from "../lib/metric-alert";

describe("MetricAlert - Implementation", () => {
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
    it("should create metric alert with minimal static threshold properties", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const props: MetricAlertProps = {
        name: "test-metric-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        ],
        criteria,
      };

      const metricAlert = new MetricAlert(stack, "TestMetricAlert", props);

      expect(metricAlert).toBeInstanceOf(MetricAlert);
      expect(metricAlert.props).toBe(props);
      expect(metricAlert.props.name).toBe("test-metric-alert");
      expect(metricAlert.props.severity).toBe(2);
      expect(metricAlert.props.scopes).toHaveLength(1);
    });

    it("should apply default values correctly", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const props: MetricAlertProps = {
        name: "default-metric-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        ],
        criteria,
      };

      const metricAlert = new MetricAlert(stack, "DefaultMetricAlert", props);

      expect(metricAlert).toBeInstanceOf(MetricAlert);
      expect(metricAlert.props.enabled).toBeUndefined(); // Should use default in createResourceBody
      expect(metricAlert.props.autoMitigate).toBeUndefined(); // Should use default in createResourceBody
    });

    it("should assign all properties correctly for static threshold", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const actions: MetricAlertAction[] = [
        {
          actionGroupId:
            "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/test-ag",
        },
      ];

      const props: MetricAlertProps = {
        name: "full-metric-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        description: "Alert for high CPU usage",
        severity: 2,
        enabled: true,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        ],
        evaluationFrequency: "PT5M",
        windowSize: "PT15M",
        criteria,
        actions,
        autoMitigate: true,
        tags: {
          environment: "test",
          team: "ops",
        },
      };

      const metricAlert = new MetricAlert(stack, "FullMetricAlert", props);

      expect(metricAlert.props.name).toBe("full-metric-alert");
      expect(metricAlert.props.description).toBe("Alert for high CPU usage");
      expect(metricAlert.props.severity).toBe(2);
      expect(metricAlert.props.enabled).toBe(true);
      expect(metricAlert.props.evaluationFrequency).toBe("PT5M");
      expect(metricAlert.props.windowSize).toBe("PT15M");
      expect(metricAlert.props.actions).toEqual(actions);
      expect(metricAlert.props.autoMitigate).toBe(true);
      expect(metricAlert.props.tags).toEqual({
        environment: "test",
        team: "ops",
      });
    });

    it("should verify schema registration occurs", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      // Create first metric alert to trigger schema registration
      new MetricAlert(stack, "FirstMetricAlert", {
        name: "first-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
      });

      // Create second metric alert to verify schemas are already registered
      const metricAlert = new MetricAlert(stack, "SecondMetricAlert", {
        name: "second-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm2",
        ],
        criteria,
      });

      expect(metricAlert).toBeInstanceOf(MetricAlert);
    });
  });

  // =============================================================================
  // Version Resolution
  // =============================================================================

  describe("Version Resolution", () => {
    it("should use default version 2018-03-01 when no version specified", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "DefaultVersion", {
        name: "default-version-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        ],
        criteria,
      });

      expect(metricAlert.resolvedApiVersion).toBe("2018-03-01");
    });

    it("should use explicit version when specified", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "PinnedVersion", {
        name: "pinned-version-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        ],
        criteria,
        apiVersion: "2018-03-01",
      });

      expect(metricAlert.resolvedApiVersion).toBe("2018-03-01");
    });

    it("should apply version configuration correctly", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const props: MetricAlertProps = {
        name: "versioned-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        ],
        criteria,
        apiVersion: "2018-03-01",
      };

      const metricAlert = new MetricAlert(stack, "VersionedAlert", props);

      expect(metricAlert.resolvedApiVersion).toBe("2018-03-01");
      expect(metricAlert).toBeInstanceOf(MetricAlert);
    });
  });

  // =============================================================================
  // Static Threshold Configuration
  // =============================================================================

  describe("Static Threshold Configuration", () => {
    it("should configure static threshold with GreaterThan operator", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "StaticGreaterThan", {
        name: "cpu-high-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        ],
        criteria,
      });

      expect(metricAlert.props.criteria.type).toBe("StaticThreshold");
      expect(
        (metricAlert.props.criteria as StaticThresholdCriteria).operator,
      ).toBe("GreaterThan");
      expect(
        (metricAlert.props.criteria as StaticThresholdCriteria).threshold,
      ).toBe(80);
    });

    it("should configure static threshold with LessThan operator", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Available Memory Bytes",
        operator: "LessThan",
        threshold: 1073741824, // 1GB in bytes
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "StaticLessThan", {
        name: "memory-low-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 1,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        ],
        criteria,
      });

      expect(
        (metricAlert.props.criteria as StaticThresholdCriteria).operator,
      ).toBe("LessThan");
      expect(
        (metricAlert.props.criteria as StaticThresholdCriteria).metricName,
      ).toBe("Available Memory Bytes");
    });

    it("should support all time aggregation methods", () => {
      const aggregations: Array<
        "Average" | "Count" | "Minimum" | "Maximum" | "Total"
      > = ["Average", "Count", "Minimum", "Maximum", "Total"];

      aggregations.forEach((aggregation, index) => {
        const criteria: StaticThresholdCriteria = {
          type: "StaticThreshold",
          metricName: "Percentage CPU",
          operator: "GreaterThan",
          threshold: 80,
          timeAggregation: aggregation,
        };

        const metricAlert = new MetricAlert(stack, `Aggregation${index}`, {
          name: `alert-${aggregation.toLowerCase()}`,
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          severity: 2,
          scopes: [
            "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
          ],
          criteria,
        });

        expect(
          (metricAlert.props.criteria as StaticThresholdCriteria)
            .timeAggregation,
        ).toBe(aggregation);
      });
    });

    it("should support all comparison operators", () => {
      const operators: Array<
        "GreaterThan" | "LessThan" | "GreaterOrEqual" | "LessOrEqual" | "Equals"
      > = [
        "GreaterThan",
        "LessThan",
        "GreaterOrEqual",
        "LessOrEqual",
        "Equals",
      ];

      operators.forEach((operator, index) => {
        const criteria: StaticThresholdCriteria = {
          type: "StaticThreshold",
          metricName: "Percentage CPU",
          operator,
          threshold: 80,
          timeAggregation: "Average",
        };

        const metricAlert = new MetricAlert(stack, `Operator${index}`, {
          name: `alert-${operator.toLowerCase()}`,
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          severity: 2,
          scopes: [
            "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
          ],
          criteria,
        });

        expect(
          (metricAlert.props.criteria as StaticThresholdCriteria).operator,
        ).toBe(operator);
      });
    });

    it("should configure static threshold with metric namespace", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        metricNamespace: "Microsoft.Compute/virtualMachines",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "WithNamespace", {
        name: "alert-with-namespace",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/test-vm",
        ],
        criteria,
      });

      expect(
        (metricAlert.props.criteria as StaticThresholdCriteria).metricNamespace,
      ).toBe("Microsoft.Compute/virtualMachines");
    });
  });

  // =============================================================================
  // Dynamic Threshold Configuration
  // =============================================================================

  describe("Dynamic Threshold Configuration", () => {
    it("should configure dynamic threshold with basic properties", () => {
      const criteria: DynamicThresholdCriteria = {
        type: "DynamicThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        alertSensitivity: "Medium",
        failingPeriods: {
          numberOfEvaluationPeriods: 4,
          minFailingPeriodsToAlert: 3,
        },
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "DynamicBasic", {
        name: "dynamic-cpu-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
        targetResourceType: "Microsoft.Compute/virtualMachines",
        targetResourceRegion: "eastus",
        criteria,
      });

      expect(metricAlert.props.criteria.type).toBe("DynamicThreshold");
      expect(
        (metricAlert.props.criteria as DynamicThresholdCriteria)
          .alertSensitivity,
      ).toBe("Medium");
      expect(
        (metricAlert.props.criteria as DynamicThresholdCriteria).failingPeriods
          .numberOfEvaluationPeriods,
      ).toBe(4);
    });

    it("should support all alert sensitivity levels", () => {
      const sensitivities: Array<"Low" | "Medium" | "High"> = [
        "Low",
        "Medium",
        "High",
      ];

      sensitivities.forEach((sensitivity, index) => {
        const criteria: DynamicThresholdCriteria = {
          type: "DynamicThreshold",
          metricName: "Percentage CPU",
          operator: "GreaterThan",
          alertSensitivity: sensitivity,
          failingPeriods: {
            numberOfEvaluationPeriods: 4,
            minFailingPeriodsToAlert: 3,
          },
          timeAggregation: "Average",
        };

        const metricAlert = new MetricAlert(stack, `Sensitivity${index}`, {
          name: `alert-${sensitivity.toLowerCase()}`,
          resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
          severity: 2,
          scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
          targetResourceType: "Microsoft.Compute/virtualMachines",
          criteria,
        });

        expect(
          (metricAlert.props.criteria as DynamicThresholdCriteria)
            .alertSensitivity,
        ).toBe(sensitivity);
      });
    });

    it("should configure dynamic threshold with GreaterOrLessThan operator", () => {
      const criteria: DynamicThresholdCriteria = {
        type: "DynamicThreshold",
        metricName: "Network In Total",
        operator: "GreaterOrLessThan",
        alertSensitivity: "High",
        failingPeriods: {
          numberOfEvaluationPeriods: 4,
          minFailingPeriodsToAlert: 4,
        },
        timeAggregation: "Total",
      };

      const metricAlert = new MetricAlert(stack, "DynamicBidirectional", {
        name: "network-anomaly-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
        targetResourceType: "Microsoft.Compute/virtualMachines",
        criteria,
      });

      expect(
        (metricAlert.props.criteria as DynamicThresholdCriteria).operator,
      ).toBe("GreaterOrLessThan");
    });

    it("should configure dynamic threshold with ignoreDataBefore", () => {
      const criteria: DynamicThresholdCriteria = {
        type: "DynamicThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        alertSensitivity: "Medium",
        failingPeriods: {
          numberOfEvaluationPeriods: 4,
          minFailingPeriodsToAlert: 3,
        },
        timeAggregation: "Average",
        ignoreDataBefore: "2024-01-01T00:00:00Z",
      };

      const metricAlert = new MetricAlert(stack, "DynamicIgnoreData", {
        name: "alert-ignore-before",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
        targetResourceType: "Microsoft.Compute/virtualMachines",
        criteria,
      });

      expect(
        (metricAlert.props.criteria as DynamicThresholdCriteria)
          .ignoreDataBefore,
      ).toBe("2024-01-01T00:00:00Z");
    });

    it("should configure varying failing periods", () => {
      const criteria: DynamicThresholdCriteria = {
        type: "DynamicThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        alertSensitivity: "Low",
        failingPeriods: {
          numberOfEvaluationPeriods: 6,
          minFailingPeriodsToAlert: 2,
        },
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "DynamicFailingPeriods", {
        name: "alert-flexible-periods",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 3,
        scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
        targetResourceType: "Microsoft.Compute/virtualMachines",
        criteria,
      });

      const failingPeriods = (
        metricAlert.props.criteria as DynamicThresholdCriteria
      ).failingPeriods;
      expect(failingPeriods.numberOfEvaluationPeriods).toBe(6);
      expect(failingPeriods.minFailingPeriodsToAlert).toBe(2);
    });
  });

  // =============================================================================
  // Dimension Filtering
  // =============================================================================

  describe("Dimension Filtering", () => {
    it("should configure single dimension with Include operator", () => {
      const dimensions: MetricDimension[] = [
        {
          name: "InstanceName",
          operator: "Include",
          values: ["vm1", "vm2"],
        },
      ];

      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
        dimensions,
      };

      const metricAlert = new MetricAlert(stack, "SingleDimension", {
        name: "alert-with-dimension",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
        targetResourceType: "Microsoft.Compute/virtualMachines",
        criteria,
      });

      const alertDimensions = (
        metricAlert.props.criteria as StaticThresholdCriteria
      ).dimensions!;
      expect(alertDimensions).toHaveLength(1);
      expect(alertDimensions[0].name).toBe("InstanceName");
      expect(alertDimensions[0].operator).toBe("Include");
      expect(alertDimensions[0].values).toEqual(["vm1", "vm2"]);
    });

    it("should configure dimension with Exclude operator", () => {
      const dimensions: MetricDimension[] = [
        {
          name: "InstanceName",
          operator: "Exclude",
          values: ["test-vm", "dev-vm"],
        },
      ];

      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
        dimensions,
      };

      const metricAlert = new MetricAlert(stack, "ExcludeDimension", {
        name: "alert-exclude-dimension",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
        targetResourceType: "Microsoft.Compute/virtualMachines",
        criteria,
      });

      const alertDimensions = (
        metricAlert.props.criteria as StaticThresholdCriteria
      ).dimensions!;
      expect(alertDimensions[0].operator).toBe("Exclude");
    });

    it("should configure multiple dimensions", () => {
      const dimensions: MetricDimension[] = [
        {
          name: "InstanceName",
          operator: "Include",
          values: ["vm1", "vm2"],
        },
        {
          name: "DiskName",
          operator: "Include",
          values: ["disk1"],
        },
      ];

      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Disk Read Bytes",
        operator: "GreaterThan",
        threshold: 10485760, // 10MB
        timeAggregation: "Total",
        dimensions,
      };

      const metricAlert = new MetricAlert(stack, "MultipleDimensions", {
        name: "alert-multi-dimension",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
        targetResourceType: "Microsoft.Compute/virtualMachines",
        criteria,
      });

      const alertDimensions = (
        metricAlert.props.criteria as StaticThresholdCriteria
      ).dimensions!;
      expect(alertDimensions).toHaveLength(2);
      expect(alertDimensions[1].name).toBe("DiskName");
    });

    it("should support dimensions in dynamic threshold", () => {
      const dimensions: MetricDimension[] = [
        {
          name: "Location",
          operator: "Include",
          values: ["eastus", "westus"],
        },
      ];

      const criteria: DynamicThresholdCriteria = {
        type: "DynamicThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        alertSensitivity: "Medium",
        failingPeriods: {
          numberOfEvaluationPeriods: 4,
          minFailingPeriodsToAlert: 3,
        },
        timeAggregation: "Average",
        dimensions,
      };

      const metricAlert = new MetricAlert(stack, "DynamicWithDimensions", {
        name: "dynamic-alert-dimensions",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
        targetResourceType: "Microsoft.Compute/virtualMachines",
        criteria,
      });

      const alertDimensions = (
        metricAlert.props.criteria as DynamicThresholdCriteria
      ).dimensions!;
      expect(alertDimensions).toHaveLength(1);
      expect(alertDimensions[0].name).toBe("Location");
    });
  });

  // =============================================================================
  // Multi-Resource Alerts
  // =============================================================================

  describe("Multi-Resource Alerts", () => {
    it("should configure multi-resource alert with single scope", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "SingleScope", {
        name: "single-scope-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
      });

      expect(metricAlert.props.scopes).toHaveLength(1);
    });

    it("should configure multi-resource alert with multiple scopes", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "MultipleScopes", {
        name: "multi-scope-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm2",
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm3",
        ],
        criteria,
      });

      expect(metricAlert.props.scopes).toHaveLength(3);
    });

    it("should configure resource group scope for multi-resource alert", () => {
      const criteria: DynamicThresholdCriteria = {
        type: "DynamicThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        alertSensitivity: "Medium",
        failingPeriods: {
          numberOfEvaluationPeriods: 4,
          minFailingPeriodsToAlert: 3,
        },
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "ResourceGroupScope", {
        name: "rg-scope-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
        targetResourceType: "Microsoft.Compute/virtualMachines",
        targetResourceRegion: "eastus",
        criteria,
      });

      expect(metricAlert.props.scopes[0]).toContain("/resourceGroups/test-rg");
      expect(metricAlert.props.targetResourceType).toBe(
        "Microsoft.Compute/virtualMachines",
      );
      expect(metricAlert.props.targetResourceRegion).toBe("eastus");
    });
  });

  // =============================================================================
  // Action Group Integration
  // =============================================================================

  describe("Action Group Integration", () => {
    it("should configure single action group", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const actions: MetricAlertAction[] = [
        {
          actionGroupId:
            "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/ops-ag",
        },
      ];

      const metricAlert = new MetricAlert(stack, "SingleAction", {
        name: "alert-single-action",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
        actions,
      });

      expect(metricAlert.props.actions).toHaveLength(1);
      expect(metricAlert.props.actions![0].actionGroupId).toContain("ops-ag");
    });

    it("should configure multiple action groups", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const actions: MetricAlertAction[] = [
        {
          actionGroupId:
            "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/ops-ag",
        },
        {
          actionGroupId:
            "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/dev-ag",
        },
      ];

      const metricAlert = new MetricAlert(stack, "MultipleActions", {
        name: "alert-multi-action",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
        actions,
      });

      expect(metricAlert.props.actions).toHaveLength(2);
    });

    it("should configure action with webhook properties", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const actions: MetricAlertAction[] = [
        {
          actionGroupId:
            "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/webhook-ag",
          webHookProperties: {
            customProperty1: "value1",
            customProperty2: "value2",
          },
        },
      ];

      const metricAlert = new MetricAlert(stack, "WebhookAction", {
        name: "alert-webhook-action",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
        actions,
      });

      expect(metricAlert.props.actions![0].webHookProperties).toEqual({
        customProperty1: "value1",
        customProperty2: "value2",
      });
    });
  });

  // =============================================================================
  // Property Transformation
  // =============================================================================

  describe("Property Transformation", () => {
    it("should generate correct Azure API format for static threshold", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const props: MetricAlertProps = {
        name: "transform-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
        tags: {
          environment: "production",
        },
      };

      const metricAlert = new MetricAlert(stack, "TransformTest", props);
      const resourceBody = (metricAlert as any).createResourceBody(props);

      expect(resourceBody).toHaveProperty("location");
      expect(resourceBody).toHaveProperty("tags");
      expect(resourceBody).toHaveProperty("properties");
      expect(resourceBody.properties).toHaveProperty("severity");
      expect(resourceBody.properties).toHaveProperty("criteria");
      expect(resourceBody.properties.criteria["odata.type"]).toBe(
        "Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria",
      );
      expect(resourceBody.properties.criteria).toHaveProperty("allOf");
    });

    it("should set location to global", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const props: MetricAlertProps = {
        name: "location-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
      };

      const metricAlert = new MetricAlert(stack, "LocationTest", props);
      const resourceBody = (metricAlert as any).createResourceBody(props);

      expect(resourceBody.location).toBe("global");
    });

    it("should transform static threshold criteria correctly", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const props: MetricAlertProps = {
        name: "criteria-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
      };

      const metricAlert = new MetricAlert(stack, "CriteriaTest", props);
      const resourceBody = (metricAlert as any).createResourceBody(props);

      expect(resourceBody.properties.criteria["odata.type"]).toBe(
        "Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria",
      );
      expect(resourceBody.properties.criteria.allOf).toHaveLength(1);
      expect(resourceBody.properties.criteria.allOf[0].criterionType).toBe(
        "StaticThresholdCriterion",
      );
      expect(resourceBody.properties.criteria.allOf[0].metricName).toBe(
        "Percentage CPU",
      );
      expect(resourceBody.properties.criteria.allOf[0].threshold).toBe(80);
    });

    it("should transform dynamic threshold criteria correctly", () => {
      const criteria: DynamicThresholdCriteria = {
        type: "DynamicThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        alertSensitivity: "Medium",
        failingPeriods: {
          numberOfEvaluationPeriods: 4,
          minFailingPeriodsToAlert: 3,
        },
        timeAggregation: "Average",
      };

      const props: MetricAlertProps = {
        name: "dynamic-criteria-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
        targetResourceType: "Microsoft.Compute/virtualMachines",
        criteria,
      };

      const metricAlert = new MetricAlert(stack, "DynamicCriteriaTest", props);
      const resourceBody = (metricAlert as any).createResourceBody(props);

      expect(resourceBody.properties.criteria.allOf[0].criterionType).toBe(
        "DynamicThresholdCriterion",
      );
      expect(resourceBody.properties.criteria.allOf[0].alertSensitivity).toBe(
        "Medium",
      );
      expect(resourceBody.properties.criteria.allOf[0].failingPeriods).toEqual({
        numberOfEvaluationPeriods: 4,
        minFailingPeriodsToAlert: 3,
      });
    });

    it("should apply default values in resource body", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const props: MetricAlertProps = {
        name: "defaults-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
      };

      const metricAlert = new MetricAlert(stack, "DefaultsTest", props);
      const resourceBody = (metricAlert as any).createResourceBody(props);

      expect(resourceBody.properties.enabled).toBe(true);
      expect(resourceBody.properties.autoMitigate).toBe(true);
      expect(resourceBody.properties.evaluationFrequency).toBe("PT5M");
      expect(resourceBody.properties.windowSize).toBe("PT15M");
    });
  });

  // =============================================================================
  // Integration with Base Class
  // =============================================================================

  describe("Integration with Base Class", () => {
    it("should inherit from AzapiResource", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "InheritanceTest", {
        name: "inheritance-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
      });

      expect(metricAlert).toHaveProperty("terraformResource");
      expect(metricAlert).toHaveProperty("resolvedApiVersion");
    });

    it("should have correct azapiResourceType", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "ResourceTypeTest", {
        name: "resource-type-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
      });

      const resourceType = (metricAlert as any).resourceType();
      expect(resourceType).toBe("Microsoft.Insights/metricAlerts");
    });

    it("should generate resource outputs", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "OutputsTest", {
        name: "outputs-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
      });

      expect(metricAlert.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(metricAlert.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(metricAlert.id).toMatch(/^\$\{.*\.id\}$/);
    });
  });

  // =============================================================================
  // Error Handling and Validation
  // =============================================================================

  describe("Error Handling", () => {
    it("should handle missing optional properties gracefully", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const props: MetricAlertProps = {
        name: "minimal-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
      };

      const metricAlert = new MetricAlert(stack, "MinimalAlert", props);
      const resourceBody = (metricAlert as any).createResourceBody(props);

      expect(resourceBody.properties.actions).toEqual([]);
      expect(resourceBody.properties.description).toBeUndefined();
    });

    it("should handle empty actions array", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const props: MetricAlertProps = {
        name: "empty-actions",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
        actions: [],
      };

      const metricAlert = new MetricAlert(stack, "EmptyActions", props);
      const resourceBody = (metricAlert as any).createResourceBody(props);

      expect(resourceBody.properties.actions).toEqual([]);
    });
  });

  // =============================================================================
  // Tag Management
  // =============================================================================

  describe("Tag Management", () => {
    it("should add tags using addTag method", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "AddTagTest", {
        name: "add-tag-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
        tags: {
          initial: "value",
        },
      });

      metricAlert.addTag("newTag", "newValue");

      expect(metricAlert.props.tags).toHaveProperty("newTag", "newValue");
      expect(metricAlert.props.tags).toHaveProperty("initial", "value");
    });

    it("should remove tags using removeTag method", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "RemoveTagTest", {
        name: "remove-tag-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
        tags: {
          toRemove: "value",
          toKeep: "value",
        },
      });

      metricAlert.removeTag("toRemove");

      expect(metricAlert.props.tags).not.toHaveProperty("toRemove");
      expect(metricAlert.props.tags).toHaveProperty("toKeep", "value");
    });

    it("should initialize tags object when adding to undefined tags", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const metricAlert = new MetricAlert(stack, "InitTagTest", {
        name: "init-tag-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
      });

      metricAlert.addTag("firstTag", "firstValue");

      expect(metricAlert.props.tags).toHaveProperty("firstTag", "firstValue");
    });
  });

  // =============================================================================
  // CDK Terraform Integration
  // =============================================================================

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      new MetricAlert(stack, "SynthTest", {
        name: "synth-test",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple metric alerts in the same stack", () => {
      const criteria1: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        operator: "GreaterThan",
        threshold: 80,
        timeAggregation: "Average",
      };

      const criteria2: DynamicThresholdCriteria = {
        type: "DynamicThreshold",
        metricName: "Available Memory Bytes",
        operator: "LessThan",
        alertSensitivity: "Medium",
        failingPeriods: {
          numberOfEvaluationPeriods: 4,
          minFailingPeriodsToAlert: 3,
        },
        timeAggregation: "Average",
      };

      const alert1 = new MetricAlert(stack, "MetricAlert1", {
        name: "cpu-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 2,
        scopes: [
          "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm1",
        ],
        criteria: criteria1,
      });

      const alert2 = new MetricAlert(stack, "MetricAlert2", {
        name: "memory-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        severity: 1,
        scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
        targetResourceType: "Microsoft.Compute/virtualMachines",
        criteria: criteria2,
        apiVersion: "2018-03-01",
      });

      expect(alert1.resolvedApiVersion).toBe("2018-03-01");
      expect(alert2.resolvedApiVersion).toBe("2018-03-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  // =============================================================================
  // Complex Scenarios
  // =============================================================================

  describe("Complex Scenarios", () => {
    it("should handle comprehensive static threshold configuration", () => {
      const dimensions: MetricDimension[] = [
        {
          name: "InstanceName",
          operator: "Include",
          values: ["vm1", "vm2", "vm3"],
        },
      ];

      const criteria: StaticThresholdCriteria = {
        type: "StaticThreshold",
        metricName: "Percentage CPU",
        metricNamespace: "Microsoft.Compute/virtualMachines",
        operator: "GreaterThan",
        threshold: 85,
        timeAggregation: "Average",
        dimensions,
      };

      const actions: MetricAlertAction[] = [
        {
          actionGroupId:
            "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/critical-ag",
          webHookProperties: {
            severity: "critical",
            environment: "production",
          },
        },
      ];

      const props: MetricAlertProps = {
        name: "comprehensive-static-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        description: "Comprehensive static threshold alert with all features",
        severity: 0,
        enabled: true,
        scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
        evaluationFrequency: "PT1M",
        windowSize: "PT5M",
        targetResourceType: "Microsoft.Compute/virtualMachines",
        targetResourceRegion: "eastus",
        criteria,
        actions,
        autoMitigate: false,
        tags: {
          environment: "production",
          criticality: "high",
          team: "platform",
        },
      };

      const metricAlert = new MetricAlert(stack, "ComprehensiveStatic", props);
      const resourceBody = (metricAlert as any).createResourceBody(props);

      expect(resourceBody.properties.severity).toBe(0);
      expect(resourceBody.properties.evaluationFrequency).toBe("PT1M");
      expect(resourceBody.properties.windowSize).toBe("PT5M");
      expect(resourceBody.properties.autoMitigate).toBe(false);
      expect(resourceBody.properties.criteria.allOf[0].dimensions).toHaveLength(
        1,
      );
      expect(resourceBody.properties.actions).toHaveLength(1);
    });

    it("should handle comprehensive dynamic threshold configuration", () => {
      const dimensions: MetricDimension[] = [
        {
          name: "Location",
          operator: "Include",
          values: ["eastus", "westus", "centralus"],
        },
        {
          name: "Environment",
          operator: "Exclude",
          values: ["dev", "test"],
        },
      ];

      const criteria: DynamicThresholdCriteria = {
        type: "DynamicThreshold",
        metricName: "Network Out Total",
        metricNamespace: "Microsoft.Compute/virtualMachines",
        operator: "GreaterOrLessThan",
        alertSensitivity: "High",
        failingPeriods: {
          numberOfEvaluationPeriods: 6,
          minFailingPeriodsToAlert: 4,
        },
        timeAggregation: "Total",
        dimensions,
        ignoreDataBefore: "2024-01-01T00:00:00Z",
      };

      const actions: MetricAlertAction[] = [
        {
          actionGroupId:
            "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/ops-ag",
        },
        {
          actionGroupId:
            "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Insights/actionGroups/security-ag",
        },
      ];

      const props: MetricAlertProps = {
        name: "comprehensive-dynamic-alert",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        description:
          "Comprehensive dynamic threshold alert for network anomalies",
        severity: 1,
        enabled: true,
        scopes: ["/subscriptions/test-sub/resourceGroups/test-rg"],
        evaluationFrequency: "PT15M",
        windowSize: "PT1H",
        targetResourceType: "Microsoft.Compute/virtualMachines",
        targetResourceRegion: "global",
        criteria,
        actions,
        autoMitigate: true,
        tags: {
          environment: "production",
          alertType: "anomaly",
          team: "security",
        },
      };

      const metricAlert = new MetricAlert(stack, "ComprehensiveDynamic", props);
      const resourceBody = (metricAlert as any).createResourceBody(props);

      expect(resourceBody.properties.criteria.allOf[0].criterionType).toBe(
        "DynamicThresholdCriterion",
      );
      expect(resourceBody.properties.criteria.allOf[0].dimensions).toHaveLength(
        2,
      );
      expect(resourceBody.properties.criteria.allOf[0].ignoreDataBefore).toBe(
        "2024-01-01T00:00:00Z",
      );
      expect(resourceBody.properties.actions).toHaveLength(2);
    });
  });
});
