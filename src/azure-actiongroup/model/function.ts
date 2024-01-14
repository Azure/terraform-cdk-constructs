import * as cdktf from "cdktf";
import { ArmRoleReceiverProps } from "./arm-role-receiver-props";
import { AzureAppPushReceiverProps } from "./azure-app-push-receiver-props";
import { EmailReceiversProps } from "./email-receiver-props";
import { EventhubReceiverProps } from "./eventhub-receiver-props";
import { LogicAppReceiverProps } from "./logic-app-receiver-props";
import { SmsReceiverProps } from "./sms-receiver-props";
import { VoiceReceiverProps } from "./voice-receiver-props";
import { WebhookReceiverProps } from "./webhook-receiver-props";

/**
 * Helper function to convert ArmRoleReceiverProps to Terraform format.
 */
export function monitorActionGroupArmRoleReceiverToTerraform(
  props?: ArmRoleReceiverProps,
): any {
  if (!cdktf.canInspect(props)) {
    return props;
  }
  return {
    name: props!.name,
    roleId: props!.roleId,
    useCommonAlertSchema: props!.useCommonAlertSchema || false,
  };
}

/**
 * Helper function to convert EmailReceiversProps to Terraform format.
 */
export function monitorActionGroupEmailReceiverToTerraform(
  props?: EmailReceiversProps,
): any {
  if (!cdktf.canInspect(props)) {
    return props;
  }
  return {
    name: props!.name,
    emailAddress: props!.emailAddress,
    useCommonAlertSchema: props!.useCommonAlertSchema || false,
  };
}

/**
 * Helper function to convert VoiceReceiverProps to Terraform format.
 */
export function monitorActionGroupVoiceReceiverToTerraform(
  props?: VoiceReceiverProps,
): any {
  if (!cdktf.canInspect(props)) {
    return props;
  }
  return {
    name: props!.name,
    countryCode: props!.countryCode,
    phoneNumber: props!.phoneNumber,
  };
}

/**
 * Helper function to convert SmsReceiverProps to Terraform format.
 */
export function monitorActionGroupSmsReceiverToTerraform(
  props?: SmsReceiverProps,
): any {
  if (!cdktf.canInspect(props)) {
    return props;
  }
  return {
    name: props!.name,
    countryCode: props!.countryCode,
    phoneNumber: props!.phoneNumber,
  };
}

/**
 * Helper function to convert WebhookReceiverProps to Terraform format.
 */
export function monitorActionGroupWebhookReceiverToTerraform(
  props?: WebhookReceiverProps,
): any {
  if (!cdktf.canInspect(props)) {
    return props;
  }
  return {
    name: props!.name,
    serviceUri: props!.serviceUri,
    useCommonAlertSchema: props!.useCommonAlertSchema || false,
  };
}

/**
 * Helper function to convert EventhubReceiverProps to Terraform format.
 */
export function monitorActionGroupEventHubReceiverToTerraform(
  props?: EventhubReceiverProps,
): any {
  if (!cdktf.canInspect(props)) {
    return props;
  }
  return {
    name: props!.name,
    eventHubName: props!.eventHubName,
    eventHubNamespace: props!.eventHubNamespace,
    useCommonAlertSchema: props!.useCommonAlertSchema || false,
  };
}

/**
 * Helper function to convert AzureAppPushReceiverProps to Terraform format.
 */
export function monitorActionGroupAzureAppPushReceiverToTerraform(
  props?: AzureAppPushReceiverProps,
): any {
  if (!cdktf.canInspect(props)) {
    return props;
  }
  return {
    name: props!.name,
    emailAddress: props!.emailAddress,
  };
}

/**
 * Helper function to convert LogicAppReceiverProps to Terraform format.
 */
export function monitorActionGroupLogicAppReceiverToTerraform(
  props?: LogicAppReceiverProps,
): any {
  if (!cdktf.canInspect(props)) {
    return props;
  }
  return {
    name: props!.name,
    resourceId: props!.resourceId,
    callbackUrl: props!.callbackUrl,
    useCommonAlertSchema: props!.useCommonAlertSchema || false,
  };
}
