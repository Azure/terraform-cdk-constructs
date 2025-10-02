import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Testing, TerraformStack } from "cdktf";
import { ActionGroup } from "..";
import { TerraformPlan } from "../../testing";
import "cdktf/lib/testing/adapters/jest";

import * as model from "../model";

describe("Action Group With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {
      features: {},
      skipProviderRegistration: true,
    });

    new ActionGroup(stack, "testAzureActionGroupDefaults", {
      name: "testactiongroup",
      shortName: "testshortn",
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Action Group with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    TerraformPlan(fullSynthResult); // Use the saved result
  });
});

describe("Action Group With Defaults 2", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test2");

    new AzurermProvider(stack, "azureFeature", {
      features: {},
      skipProviderRegistration: true,
    });

    new ActionGroup(stack, "testAzureActionGroupDefaults", {
      name: "testactiongroup",
      shortName: "testshortn",
      enabled: false,
      location: "global",
      tags: {
        test: "test",
      },
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Action Group with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    TerraformPlan(fullSynthResult); // Use the saved result
  });
});

/**
 * Unit Tests for Action Group Helper Functions
 */
describe("Action Group Helper Functions Unit Test for ArmRoleReceiverProps", () => {
  let armRoleReceiverProps1: model.ArmRoleReceiverProps = {
    name: "test_arm_role_receiver_1",
    roleId: "test-role-id-1",
    useCommonAlertSchema: true,
  };
  let armRoleReceiverProps2: model.ArmRoleReceiverProps = {
    name: "test_arm_role_receiver_2",
    roleId: "test-role-id-2",
  };
  let armRoleReceiverProps3: model.ArmRoleReceiverProps | undefined;

  it("arm role receiver prop with useCommonAlertSchema defined", () => {
    expect(
      model.monitorActionGroupArmRoleReceiverToTerraform(armRoleReceiverProps1),
    ).toMatchObject({
      name: "test_arm_role_receiver_1",
      roleId: "test-role-id-1",
      useCommonAlertSchema: true,
    });
  });

  it("arm role receiver prop without useCommonAlertSchema defined", () => {
    expect(
      model.monitorActionGroupArmRoleReceiverToTerraform(armRoleReceiverProps2),
    ).toMatchObject({
      name: "test_arm_role_receiver_2",
      roleId: "test-role-id-2",
      useCommonAlertSchema: false,
    });
  });

  it("arm role receiver prop undefined", () => {
    expect(
      model.monitorActionGroupArmRoleReceiverToTerraform(armRoleReceiverProps3),
    ).toBeUndefined();
  });
});

describe("Action Group Helper Functions Unit Test for EmailReceiversProps", () => {
  let emailReceiverProps1: model.EmailReceiversProps = {
    name: "test_email_receiver_1",
    emailAddress: "test-email-address-1",
    useCommonAlertSchema: true,
  };
  let emailReceiverProps2: model.EmailReceiversProps = {
    name: "test_email_receiver_2",
    emailAddress: "test-email-address-2",
  };
  let emailReceiverProps3: model.EmailReceiversProps | undefined;

  it("email receiver prop with useCommonAlertSchema defined", () => {
    expect(
      model.monitorActionGroupEmailReceiverToTerraform(emailReceiverProps1),
    ).toMatchObject({
      name: "test_email_receiver_1",
      emailAddress: "test-email-address-1",
      useCommonAlertSchema: true,
    });
  });

  it("email receiver prop without useCommonAlertSchema defined", () => {
    expect(
      model.monitorActionGroupEmailReceiverToTerraform(emailReceiverProps2),
    ).toMatchObject({
      name: "test_email_receiver_2",
      emailAddress: "test-email-address-2",
      useCommonAlertSchema: false,
    });
  });

  it("email receiver prop undefined", () => {
    expect(
      model.monitorActionGroupEmailReceiverToTerraform(emailReceiverProps3),
    ).toBeUndefined();
  });
});

describe("Action Group Helper Functions Unit Test for VoiceReceiverProps", () => {
  let voiceReceiverProps1: model.VoiceReceiverProps = {
    name: "test_voice_receiver_1",
    countryCode: "1",
    phoneNumber: "0123456789",
  };
  let voiceReceiverProps2: model.VoiceReceiverProps | undefined;

  it("voice receiver prop defined", () => {
    expect(
      model.monitorActionGroupVoiceReceiverToTerraform(voiceReceiverProps1),
    ).toMatchObject({
      name: "test_voice_receiver_1",
      countryCode: "1",
      phoneNumber: "0123456789",
    });
  });

  it("voice receiver prop undefined", () => {
    expect(
      model.monitorActionGroupVoiceReceiverToTerraform(voiceReceiverProps2),
    ).toBeUndefined();
  });
});

describe("Action Group Helper Functions Unit Test for SmsReceiverProps", () => {
  let smsReceiverProps1: model.SmsReceiverProps = {
    name: "test_sms_receiver_1",
    countryCode: "1",
    phoneNumber: "0123456789",
  };
  let smsReceiverProps2: model.SmsReceiverProps | undefined;

  it("sms receiver prop defined", () => {
    expect(
      model.monitorActionGroupSmsReceiverToTerraform(smsReceiverProps1),
    ).toMatchObject({
      name: "test_sms_receiver_1",
      countryCode: "1",
      phoneNumber: "0123456789",
    });
  });

  it("sms receiver prop undefined", () => {
    expect(
      model.monitorActionGroupSmsReceiverToTerraform(smsReceiverProps2),
    ).toBeUndefined();
  });
});

describe("Action Group Helper Functions Unit Test for WebhookReceiverProps", () => {
  let webhookReceiverProps1: model.WebhookReceiverProps = {
    name: "test_webhook_receiver_1",
    serviceUri: "https://test-webhook-uri-1",
    useCommonAlertSchema: true,
  };
  let webhookReceiverProps2: model.WebhookReceiverProps = {
    name: "test_webhook_receiver_2",
    serviceUri: "https://test-webhook-uri-2",
  };
  let webhookReceiverProps3: model.WebhookReceiverProps | undefined;

  it("webhook receiver prop with useCommonAlertSchema defined", () => {
    expect(
      model.monitorActionGroupWebhookReceiverToTerraform(webhookReceiverProps1),
    ).toMatchObject({
      name: "test_webhook_receiver_1",
      serviceUri: "https://test-webhook-uri-1",
      useCommonAlertSchema: true,
    });
  });

  it("webhook receiver prop without useCommonAlertSchema defined", () => {
    expect(
      model.monitorActionGroupWebhookReceiverToTerraform(webhookReceiverProps2),
    ).toMatchObject({
      name: "test_webhook_receiver_2",
      serviceUri: "https://test-webhook-uri-2",
      useCommonAlertSchema: false,
    });
  });

  it("webhook receiver prop undefined", () => {
    expect(
      model.monitorActionGroupWebhookReceiverToTerraform(webhookReceiverProps3),
    ).toBeUndefined();
  });
});

describe("Action Group Helper Functions Unit Test for EventhubReceiverProps", () => {
  let eventhubReceiverProps1: model.EventhubReceiverProps = {
    name: "test_eventhub_receiver_1",
    eventHubName: "testeventhubname1",
    eventHubNamespace: "testnamespace1",
    useCommonAlertSchema: true,
  };
  let eventhubReceiverProps2: model.EventhubReceiverProps = {
    name: "test_eventhub_receiver_2",
    eventHubName: "testeventhubname2",
    eventHubNamespace: "testnamespace2",
  };
  let eventhubReceiverProps3: model.EventhubReceiverProps | undefined;

  it("eventhub receiver prop with useCommonAlertSchema defined", () => {
    expect(
      model.monitorActionGroupEventHubReceiverToTerraform(
        eventhubReceiverProps1,
      ),
    ).toMatchObject({
      name: "test_eventhub_receiver_1",
      eventHubName: "testeventhubname1",
      eventHubNamespace: "testnamespace1",
      useCommonAlertSchema: true,
    });
  });

  it("eventhub receiver prop without useCommonAlertSchema defined", () => {
    expect(
      model.monitorActionGroupEventHubReceiverToTerraform(
        eventhubReceiverProps2,
      ),
    ).toMatchObject({
      name: "test_eventhub_receiver_2",
      eventHubName: "testeventhubname2",
      eventHubNamespace: "testnamespace2",
      useCommonAlertSchema: false,
    });
  });

  it("eventhub receiver prop undefined", () => {
    expect(
      model.monitorActionGroupEventHubReceiverToTerraform(
        eventhubReceiverProps3,
      ),
    ).toBeUndefined();
  });
});

describe("Action Group Helper Functions Unit Test for AzureAppPushReceiverProps", () => {
  let azureAppPushReceiverProps1: model.AzureAppPushReceiverProps = {
    name: "test_azure_app_push_receiver_1",
    emailAddress: "testemail@gtestemail.com",
  };
  let azureAppPushReceiverProps2: model.AzureAppPushReceiverProps | undefined;

  it("azure app push receiver prop with useCommonAlertSchema defined", () => {
    expect(
      model.monitorActionGroupAzureAppPushReceiverToTerraform(
        azureAppPushReceiverProps1,
      ),
    ).toMatchObject({
      name: "test_azure_app_push_receiver_1",
      emailAddress: "testemail@gtestemail.com",
    });
  });

  it("azure app push receiver prop undefined", () => {
    expect(
      model.monitorActionGroupAzureAppPushReceiverToTerraform(
        azureAppPushReceiverProps2,
      ),
    ).toBeUndefined();
  });
});

describe("Action Group Helper Functions Unit Test for LogicAppReceiverProps", () => {
  let logicAppReceiverProps1: model.LogicAppReceiverProps = {
    name: "test_logic_app_receiver_1",
    resourceId: "test/resource/id/1",
    callbackUrl: "https://test-logic-app-uri-1",
    useCommonAlertSchema: true,
  };
  let logicAppReceiverProps2: model.LogicAppReceiverProps = {
    name: "test_logic_app_receiver_2",
    resourceId: "test/resource/id/2",
    callbackUrl: "https://test-logic-app-uri-2",
  };
  let logicAppReceiverProps3: model.LogicAppReceiverProps | undefined;

  it("logic app receiver prop with useCommonAlertSchema defined", () => {
    expect(
      model.monitorActionGroupLogicAppReceiverToTerraform(
        logicAppReceiverProps1,
      ),
    ).toMatchObject({
      name: "test_logic_app_receiver_1",
      callbackUrl: "https://test-logic-app-uri-1",
      useCommonAlertSchema: true,
    });
  });

  it("logic app receiver prop without useCommonAlertSchema defined", () => {
    expect(
      model.monitorActionGroupLogicAppReceiverToTerraform(
        logicAppReceiverProps2,
      ),
    ).toMatchObject({
      name: "test_logic_app_receiver_2",
      callbackUrl: "https://test-logic-app-uri-2",
      useCommonAlertSchema: false,
    });
  });

  it("logic app receiver prop undefined", () => {
    expect(
      model.monitorActionGroupLogicAppReceiverToTerraform(
        logicAppReceiverProps3,
      ),
    ).toBeUndefined();
  });
});
