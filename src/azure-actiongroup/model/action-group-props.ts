import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { ArmRoleReceiverProps } from "./arm-role-receiver-props";
import { AzureAppPushReceiverProps } from "./azure-app-push-receiver-props";
import { EmailReceiversProps } from "./email-receiver-props";
import { EventhubReceiverProps } from "./eventhub-receiver-props";
import { LogicAppReceiverProps } from "./logic-app-receiver-props";
import { SmsReceiverProps } from "./sms-receiver-props";
import { VoiceReceiverProps } from "./voice-receiver-props";
import { WebhookReceiverProps } from "./webhook-receiver-props";

export interface ActionGroupProps {
  /**
   * The name of the Action Group.
   */
  readonly name: string;
  /**
   * The name of the resource group in which to create the Action Group instance.
   */
  readonly resourceGroup: ResourceGroup;
  /**
   * The short name of the action group. This will be used in SMS messages. The length should be in the range (1 - 12).
   */
  readonly shortName: string;
  /**
   * Whether this action group is enabled. If an action group is not enabled, then none of its receivers will receive communications. Defaults to true.
   * @default true
   */
  readonly enabled?: boolean;
  /**
   * The Azure Region where the Action Group should exist.
   * @default global
   */
  readonly location?: string;
  /**
   * A mapping of tags to assign to the resource.
   */
  readonly tags?: { [key: string]: string };

  readonly armRoleReceivers?: ArmRoleReceiverProps[];

  readonly emailReceivers?: EmailReceiversProps[];

  readonly voiceReceivers?: VoiceReceiverProps[];

  readonly smsReceivers?: SmsReceiverProps[];

  readonly webhookReceivers?: WebhookReceiverProps[];

  readonly eventHubReceivers?: EventhubReceiverProps[];

  readonly azureAppPushReceivers?: AzureAppPushReceiverProps[];

  readonly logicAppReceivers?: LogicAppReceiverProps[];

  // TODO:
  // readonly itsmReceivers;
  // readonly automationRunbookReceivers;
  // readonly azureFunctionReceivers;
}
