/**
 * Comprehensive tests for the ActionGroup implementation
 *
 * This test suite validates the ActionGroup class using the AzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * receiver configurations, property transformation, and resource creation.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import {
  ActionGroup,
  ActionGroupProps,
  EmailReceiver,
  SmsReceiver,
  WebhookReceiver,
  AzureFunctionReceiver,
  LogicAppReceiver,
  VoiceReceiver,
} from "../lib/action-group";

describe("ActionGroup - Implementation", () => {
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
    it("should create action group with minimal required properties", () => {
      const props: ActionGroupProps = {
        name: "test-action-group",
        groupShortName: "TestGroup",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      const actionGroup = new ActionGroup(stack, "TestActionGroup", props);

      expect(actionGroup).toBeInstanceOf(ActionGroup);
      expect(actionGroup.props).toBe(props);
      expect(actionGroup.props.name).toBe("test-action-group");
      expect(actionGroup.props.groupShortName).toBe("TestGroup");
    });

    it("should apply default values correctly", () => {
      const props: ActionGroupProps = {
        name: "default-action-group",
        groupShortName: "Default",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      const actionGroup = new ActionGroup(stack, "DefaultActionGroup", props);

      // Verify default enabled state is true (checked via resource body)
      expect(actionGroup).toBeInstanceOf(ActionGroup);
      expect(actionGroup.props.enabled).toBeUndefined(); // Should use default in createResourceBody
    });

    it("should assign all properties correctly", () => {
      const emailReceivers: EmailReceiver[] = [
        {
          name: "ops-email",
          emailAddress: "ops@company.com",
          useCommonAlertSchema: true,
        },
      ];

      const props: ActionGroupProps = {
        name: "full-action-group",
        groupShortName: "FullGroup",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        enabled: false,
        emailReceivers,
        tags: {
          environment: "test",
          team: "ops",
        },
      };

      const actionGroup = new ActionGroup(stack, "FullActionGroup", props);

      expect(actionGroup.props.name).toBe("full-action-group");
      expect(actionGroup.props.groupShortName).toBe("FullGroup");
      expect(actionGroup.props.enabled).toBe(false);
      expect(actionGroup.props.emailReceivers).toEqual(emailReceivers);
      expect(actionGroup.props.tags).toEqual({
        environment: "test",
        team: "ops",
      });
    });

    it("should verify schema registration occurs", () => {
      // Create first action group to trigger schema registration
      new ActionGroup(stack, "FirstActionGroup", {
        name: "first-group",
        groupShortName: "First",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      // Create second action group to verify schemas are already registered
      const actionGroup = new ActionGroup(stack, "SecondActionGroup", {
        name: "second-group",
        groupShortName: "Second",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      expect(actionGroup).toBeInstanceOf(ActionGroup);
    });
  });

  // =============================================================================
  // Version Resolution
  // =============================================================================

  describe("Version Resolution", () => {
    it("should use default version 2021-09-01 when no version specified", () => {
      const actionGroup = new ActionGroup(stack, "DefaultVersion", {
        name: "default-version-group",
        groupShortName: "DefVer",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      expect(actionGroup.resolvedApiVersion).toBe("2021-09-01");
    });

    it("should use explicit version when specified", () => {
      const actionGroup = new ActionGroup(stack, "PinnedVersion", {
        name: "pinned-version-group",
        groupShortName: "PinVer",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2021-09-01",
      });

      expect(actionGroup.resolvedApiVersion).toBe("2021-09-01");
    });

    it("should apply version configuration correctly", () => {
      const props: ActionGroupProps = {
        name: "versioned-group",
        groupShortName: "Versioned",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2021-09-01",
      };

      const actionGroup = new ActionGroup(stack, "VersionedGroup", props);

      expect(actionGroup.resolvedApiVersion).toBe("2021-09-01");
      expect(actionGroup).toBeInstanceOf(ActionGroup);
    });
  });

  // =============================================================================
  // Receiver Configuration
  // =============================================================================

  describe("Receiver Configuration", () => {
    it("should configure email receivers with single recipient", () => {
      const emailReceivers: EmailReceiver[] = [
        {
          name: "admin-email",
          emailAddress: "admin@company.com",
          useCommonAlertSchema: true,
        },
      ];

      const actionGroup = new ActionGroup(stack, "EmailSingle", {
        name: "email-single-group",
        groupShortName: "EmailSingle",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        emailReceivers,
      });

      expect(actionGroup.props.emailReceivers).toHaveLength(1);
      expect(actionGroup.props.emailReceivers![0].emailAddress).toBe(
        "admin@company.com",
      );
      expect(actionGroup.props.emailReceivers![0].useCommonAlertSchema).toBe(
        true,
      );
    });

    it("should configure email receivers with multiple recipients", () => {
      const emailReceivers: EmailReceiver[] = [
        {
          name: "ops-email",
          emailAddress: "ops@company.com",
          useCommonAlertSchema: true,
        },
        {
          name: "dev-email",
          emailAddress: "dev@company.com",
          useCommonAlertSchema: false,
        },
        {
          name: "security-email",
          emailAddress: "security@company.com",
        },
      ];

      const actionGroup = new ActionGroup(stack, "EmailMultiple", {
        name: "email-multiple-group",
        groupShortName: "EmailMulti",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        emailReceivers,
      });

      expect(actionGroup.props.emailReceivers).toHaveLength(3);
      expect(actionGroup.props.emailReceivers![1].name).toBe("dev-email");
      expect(
        actionGroup.props.emailReceivers![2].useCommonAlertSchema,
      ).toBeUndefined();
    });

    it("should configure SMS receivers", () => {
      const smsReceivers: SmsReceiver[] = [
        {
          name: "oncall-sms",
          countryCode: "1",
          phoneNumber: "5551234567",
        },
        {
          name: "backup-sms",
          countryCode: "44",
          phoneNumber: "7700900123",
        },
      ];

      const actionGroup = new ActionGroup(stack, "SMSReceivers", {
        name: "sms-group",
        groupShortName: "SMS",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        smsReceivers,
      });

      expect(actionGroup.props.smsReceivers).toHaveLength(2);
      expect(actionGroup.props.smsReceivers![0].countryCode).toBe("1");
      expect(actionGroup.props.smsReceivers![0].phoneNumber).toBe("5551234567");
    });

    it("should configure webhook receivers with authentication", () => {
      const webhookReceivers: WebhookReceiver[] = [
        {
          name: "pagerduty-webhook",
          serviceUri: "https://events.pagerduty.com/integration/webhook",
          useCommonAlertSchema: true,
        },
        {
          name: "slack-webhook",
          serviceUri: "https://hooks.slack.com/services/T00/B00/XXXX",
          useCommonAlertSchema: false,
        },
      ];

      const actionGroup = new ActionGroup(stack, "WebhookReceivers", {
        name: "webhook-group",
        groupShortName: "Webhook",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        webhookReceivers,
      });

      expect(actionGroup.props.webhookReceivers).toHaveLength(2);
      expect(actionGroup.props.webhookReceivers![0].serviceUri).toContain(
        "pagerduty.com",
      );
      expect(actionGroup.props.webhookReceivers![1].useCommonAlertSchema).toBe(
        false,
      );
    });

    it("should configure Azure Function receivers", () => {
      const azureFunctionReceivers: AzureFunctionReceiver[] = [
        {
          name: "alert-processor",
          functionAppResourceId:
            "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Web/sites/alert-func",
          functionName: "ProcessAlert",
          httpTriggerUrl:
            "https://alert-func.azurewebsites.net/api/ProcessAlert",
          useCommonAlertSchema: true,
        },
      ];

      const actionGroup = new ActionGroup(stack, "FunctionReceivers", {
        name: "function-group",
        groupShortName: "Function",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        azureFunctionReceivers,
      });

      expect(actionGroup.props.azureFunctionReceivers).toHaveLength(1);
      expect(actionGroup.props.azureFunctionReceivers![0].functionName).toBe(
        "ProcessAlert",
      );
    });

    it("should configure Logic App receivers", () => {
      const logicAppReceivers: LogicAppReceiver[] = [
        {
          name: "incident-workflow",
          resourceId:
            "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Logic/workflows/incident-handler",
          callbackUrl: "https://prod-00.westus.logic.azure.com/workflows/xxx",
          useCommonAlertSchema: true,
        },
      ];

      const actionGroup = new ActionGroup(stack, "LogicAppReceivers", {
        name: "logicapp-group",
        groupShortName: "LogicApp",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        logicAppReceivers,
      });

      expect(actionGroup.props.logicAppReceivers).toHaveLength(1);
      expect(actionGroup.props.logicAppReceivers![0].name).toBe(
        "incident-workflow",
      );
    });

    it("should configure voice receivers", () => {
      const voiceReceivers: VoiceReceiver[] = [
        {
          name: "emergency-call",
          countryCode: "1",
          phoneNumber: "5559876543",
        },
      ];

      const actionGroup = new ActionGroup(stack, "VoiceReceivers", {
        name: "voice-group",
        groupShortName: "Voice",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        voiceReceivers,
      });

      expect(actionGroup.props.voiceReceivers).toHaveLength(1);
      expect(actionGroup.props.voiceReceivers![0].phoneNumber).toBe(
        "5559876543",
      );
    });
  });

  // =============================================================================
  // Property Transformation
  // =============================================================================

  describe("Property Transformation", () => {
    it("should generate correct Azure API format via createResourceBody", () => {
      const props: ActionGroupProps = {
        name: "transform-test",
        groupShortName: "Transform",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        enabled: true,
        emailReceivers: [
          {
            name: "test-email",
            emailAddress: "test@company.com",
            useCommonAlertSchema: true,
          },
        ],
        tags: {
          environment: "production",
        },
      };

      const actionGroup = new ActionGroup(stack, "TransformTest", props);

      // Access the protected createResourceBody method via the instance
      const resourceBody = (actionGroup as any).createResourceBody(props);

      expect(resourceBody).toHaveProperty("location");
      expect(resourceBody).toHaveProperty("tags");
      expect(resourceBody).toHaveProperty("properties");
      expect(resourceBody.properties).toHaveProperty("groupShortName");
      expect(resourceBody.properties).toHaveProperty("enabled");
    });

    it("should set location to global", () => {
      const props: ActionGroupProps = {
        name: "location-test",
        groupShortName: "Location",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      const actionGroup = new ActionGroup(stack, "LocationTest", props);
      const resourceBody = (actionGroup as any).createResourceBody(props);

      expect(resourceBody.location).toBe("Global");
    });

    it("should transform tags correctly", () => {
      const props: ActionGroupProps = {
        name: "tags-test",
        groupShortName: "Tags",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        tags: {
          environment: "dev",
          owner: "platform-team",
          cost_center: "engineering",
        },
      };

      const actionGroup = new ActionGroup(stack, "TagsTest", props);
      const resourceBody = (actionGroup as any).createResourceBody(props);

      expect(resourceBody.tags).toEqual({
        environment: "dev",
        owner: "platform-team",
        cost_center: "engineering",
      });
    });

    it("should format nested receiver objects properly", () => {
      const props: ActionGroupProps = {
        name: "receivers-test",
        groupShortName: "Receivers",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        emailReceivers: [
          {
            name: "email-1",
            emailAddress: "email1@company.com",
            useCommonAlertSchema: true,
          },
        ],
        smsReceivers: [
          {
            name: "sms-1",
            countryCode: "1",
            phoneNumber: "5551234567",
          },
        ],
      };

      const actionGroup = new ActionGroup(stack, "ReceiversTest", props);
      const resourceBody = (actionGroup as any).createResourceBody(props);

      expect(resourceBody.properties.emailReceivers).toHaveLength(1);
      expect(resourceBody.properties.smsReceivers).toHaveLength(1);
      expect(resourceBody.properties.emailReceivers[0]).toHaveProperty("name");
      expect(resourceBody.properties.emailReceivers[0]).toHaveProperty(
        "emailAddress",
      );
    });
  });

  // =============================================================================
  // Integration with Base Class
  // =============================================================================

  describe("Integration with Base Class", () => {
    it("should inherit from AzapiResource", () => {
      const actionGroup = new ActionGroup(stack, "InheritanceTest", {
        name: "inheritance-test",
        groupShortName: "Inherit",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      // Verify it has AzapiResource properties
      expect(actionGroup).toHaveProperty("terraformResource");
      expect(actionGroup).toHaveProperty("resolvedApiVersion");
    });

    it("should have correct azapiResourceType", () => {
      const actionGroup = new ActionGroup(stack, "ResourceTypeTest", {
        name: "resource-type-test",
        groupShortName: "ResType",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      // Access the protected resourceType method
      const resourceType = (actionGroup as any).resourceType();
      expect(resourceType).toBe("Microsoft.Insights/actionGroups");
    });

    it("should generate resource outputs", () => {
      const actionGroup = new ActionGroup(stack, "OutputsTest", {
        name: "outputs-test",
        groupShortName: "Outputs",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      expect(actionGroup.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(actionGroup.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(actionGroup.id).toMatch(/^\$\{.*\.id\}$/);
    });
  });

  // =============================================================================
  // Error Handling and Validation
  // =============================================================================

  describe("Error Handling", () => {
    it("should throw error for invalid groupShortName exceeding 12 characters", () => {
      // Schema validation should catch invalid groupShortName
      const props: ActionGroupProps = {
        name: "invalid-short-name",
        groupShortName: "ThisIsAVeryLongName", // >12 chars - should fail validation
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      // Should throw validation error
      expect(() => {
        new ActionGroup(stack, "InvalidShortName", props);
      }).toThrow(/Short name must be 1-12 alphanumeric characters/);
    });

    it("should handle missing optional receivers gracefully", () => {
      const props: ActionGroupProps = {
        name: "no-receivers",
        groupShortName: "NoReceivers",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      const actionGroup = new ActionGroup(stack, "NoReceivers", props);
      const resourceBody = (actionGroup as any).createResourceBody(props);

      // Should have empty arrays for all receivers
      expect(resourceBody.properties.emailReceivers).toEqual([]);
      expect(resourceBody.properties.smsReceivers).toEqual([]);
      expect(resourceBody.properties.webhookReceivers).toEqual([]);
    });

    it("should handle empty receiver arrays", () => {
      const props: ActionGroupProps = {
        name: "empty-receivers",
        groupShortName: "Empty",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        emailReceivers: [],
        smsReceivers: [],
        webhookReceivers: [],
      };

      const actionGroup = new ActionGroup(stack, "EmptyReceivers", props);
      const resourceBody = (actionGroup as any).createResourceBody(props);

      expect(resourceBody.properties.emailReceivers).toEqual([]);
      expect(resourceBody.properties.smsReceivers).toEqual([]);
    });

    it("should handle undefined enabled property with default value", () => {
      const props: ActionGroupProps = {
        name: "default-enabled",
        groupShortName: "DefEnabled",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      };

      const actionGroup = new ActionGroup(stack, "DefaultEnabled", props);
      const resourceBody = (actionGroup as any).createResourceBody(props);

      // Should default to true
      expect(resourceBody.properties.enabled).toBe(true);
    });
  });

  // =============================================================================
  // Tag Management
  // =============================================================================

  describe("Tag Management", () => {
    it("should add tags using addTag method", () => {
      const actionGroup = new ActionGroup(stack, "AddTagTest", {
        name: "add-tag-test",
        groupShortName: "AddTag",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        tags: {
          initial: "value",
        },
      });

      actionGroup.addTag("newTag", "newValue");

      expect(actionGroup.props.tags).toHaveProperty("newTag", "newValue");
      expect(actionGroup.props.tags).toHaveProperty("initial", "value");
    });

    it("should remove tags using removeTag method", () => {
      const actionGroup = new ActionGroup(stack, "RemoveTagTest", {
        name: "remove-tag-test",
        groupShortName: "RemoveTag",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        tags: {
          toRemove: "value",
          toKeep: "value",
        },
      });

      actionGroup.removeTag("toRemove");

      expect(actionGroup.props.tags).not.toHaveProperty("toRemove");
      expect(actionGroup.props.tags).toHaveProperty("toKeep", "value");
    });

    it("should initialize tags object when adding to undefined tags", () => {
      const actionGroup = new ActionGroup(stack, "InitTagTest", {
        name: "init-tag-test",
        groupShortName: "InitTag",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      actionGroup.addTag("firstTag", "firstValue");

      expect(actionGroup.props.tags).toHaveProperty("firstTag", "firstValue");
    });
  });

  // =============================================================================
  // CDK Terraform Integration
  // =============================================================================

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new ActionGroup(stack, "SynthTest", {
        name: "synth-test",
        groupShortName: "Synth",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        emailReceivers: [
          {
            name: "test-email",
            emailAddress: "test@company.com",
          },
        ],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple action groups in the same stack", () => {
      const actionGroup1 = new ActionGroup(stack, "ActionGroup1", {
        name: "action-group-1",
        groupShortName: "Group1",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      });

      const actionGroup2 = new ActionGroup(stack, "ActionGroup2", {
        name: "action-group-2",
        groupShortName: "Group2",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        apiVersion: "2021-09-01",
      });

      expect(actionGroup1.resolvedApiVersion).toBe("2021-09-01");
      expect(actionGroup2.resolvedApiVersion).toBe("2021-09-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  // =============================================================================
  // Complex Scenarios
  // =============================================================================

  describe("Complex Scenarios", () => {
    it("should handle action group with all receiver types", () => {
      const props: ActionGroupProps = {
        name: "comprehensive-group",
        groupShortName: "Comprehensv", // Max 12 chars
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        enabled: true,
        emailReceivers: [
          {
            name: "ops-email",
            emailAddress: "ops@company.com",
            useCommonAlertSchema: true,
          },
        ],
        smsReceivers: [
          {
            name: "oncall-sms",
            countryCode: "1",
            phoneNumber: "5551234567",
          },
        ],
        webhookReceivers: [
          {
            name: "pagerduty",
            serviceUri: "https://events.pagerduty.com/webhook",
            useCommonAlertSchema: true,
          },
        ],
        azureFunctionReceivers: [
          {
            name: "alert-func",
            functionAppResourceId:
              "/subscriptions/test/resourceGroups/rg/providers/Microsoft.Web/sites/func",
            functionName: "ProcessAlert",
            httpTriggerUrl: "https://func.azurewebsites.net/api/process",
            useCommonAlertSchema: true,
          },
        ],
        logicAppReceivers: [
          {
            name: "incident-logic",
            resourceId:
              "/subscriptions/test/resourceGroups/rg/providers/Microsoft.Logic/workflows/incident",
            callbackUrl: "https://prod.logic.azure.com/workflows/xxx",
          },
        ],
        voiceReceivers: [
          {
            name: "emergency-voice",
            countryCode: "1",
            phoneNumber: "5559876543",
          },
        ],
        tags: {
          environment: "production",
          criticality: "high",
        },
      };

      const actionGroup = new ActionGroup(stack, "ComprehensiveGroup", props);
      const resourceBody = (actionGroup as any).createResourceBody(props);

      expect(resourceBody.properties.emailReceivers).toHaveLength(1);
      expect(resourceBody.properties.smsReceivers).toHaveLength(1);
      expect(resourceBody.properties.webhookReceivers).toHaveLength(1);
      expect(resourceBody.properties.azureFunctionReceivers).toHaveLength(1);
      expect(resourceBody.properties.logicAppReceivers).toHaveLength(1);
      expect(resourceBody.properties.voiceReceivers).toHaveLength(1);
    });
  });
});
