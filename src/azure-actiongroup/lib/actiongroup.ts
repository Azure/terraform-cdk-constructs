import { MonitorActionGroup } from "@cdktf/provider-azurerm/lib/monitor-action-group";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { AzureResource } from "../../core-azure/lib";

export interface ActionGroupProps {
  /**
   * The name of the Action Group.
   */
  readonly name: string;
  /**
   * The name of the resource group in which to create the Action Group instance.
   */
  readonly resourceGroupName: string;
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

  readonly armRoleReceivers?: {
    name: string;
    roleId: string;
    useCommonAlertSchema?: boolean;
  }[];

  readonly emailReceivers?: {
    name: string;
    emailAddress: string;
    useCommonAlertSchema?: boolean;
  }[];

  readonly voiceReceivers?: {
    name: string;
    countryCode: string;
    phoneNumber: string;
  }[];

  readonly smsReceivers?: {
    name: string;
    countryCode: string;
    phoneNumber: string;
  }[];

  // TODO: add aadAuth webhook receiver
  readonly webhookReceivers?: {
    name: string;
    serviceUri: string;
    useCommonAlertSchema?: boolean;
    // aadAuth?: {};
  }[];

  readonly eventHubReceivers?: {
    name: string;
    eventHubId?: string;
    eventHubName?: string;
    eventHubNamespace?: string;
    subscriptionId?: string;
  }[];

  // TODO:
  // readonly itsmReceivers;
  // readonly azureAppPushReceivers;
  // readonly automationRunbookReceivers;
  // readonly logicAppReceivers;
  // readonly azureFunctionReceivers;
}

export class ActionGroup extends AzureResource {
  readonly props: ActionGroupProps;
  public resourceGroupName: string;
  public id: string;

  constructor(scope: Construct, id: string, props: ActionGroupProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroupName = props.resourceGroupName;

    /**
     * Define default values.
     */
    const defaults = {
      enabled: props.enabled || true,
      location: props.location || "global",
      tags: props.tags || {},
    };

    // Create the Action Group with the provided properties
    const azurermMonitorActionGroup = new MonitorActionGroup(
      this,
      "actiongroup",
      {
        ...defaults,
        name: props.name,
        resourceGroupName: props.resourceGroupName,
        shortName: props.shortName,
      },
    );

    if (props.armRoleReceivers) {
      for (const armRoleReceiver of props.armRoleReceivers) {
        armRoleReceiver.useCommonAlertSchema =
          armRoleReceiver.useCommonAlertSchema || false;
      }

      azurermMonitorActionGroup.addOverride("dynamic.arm_role_receiver", {
        for_each: props.armRoleReceivers,
        content: {
          name: "${arm_role_receiver.value.name}",
          role_id: "${arm_role_receiver.value.roleId}",
          use_common_alert_schema:
            "${arm_role_receiver.value.useCommonAlertSchema}",
        },
      });
    }

    if (props.emailReceivers) {
      for (const emailReceiver of props.emailReceivers) {
        emailReceiver.useCommonAlertSchema =
          emailReceiver.useCommonAlertSchema || false;
      }

      azurermMonitorActionGroup.addOverride("dynamic.email_receiver", {
        for_each: props.emailReceivers,
        content: {
          name: "${email_receiver.value.name}",
          email_address: "${email_receiver.value.emailAddress}",
          use_common_alert_schema:
            "${email_receiver.value.useCommonAlertSchema}",
        },
      });
    }

    if (props.voiceReceivers) {
      azurermMonitorActionGroup.addOverride("dynamic.voice_receiver", {
        for_each: props.voiceReceivers,
        content: {
          name: "${voice_receiver.value.name}",
          country_code: "${voice_receiver.value.countryCode}",
          phone_number: "${voice_receiver.value.phoneNumber}",
        },
      });
    }

    if (props.smsReceivers) {
      azurermMonitorActionGroup.addOverride("dynamic.sms_receiver", {
        for_each: props.smsReceivers,
        content: {
          name: "${sms_receiver.value.name}",
          country_code: "${sms_receiver.value.countryCode}",
          phone_number: "${sms_receiver.value.phoneNumber}",
        },
      });
    }

    if (props.webhookReceivers) {
      for (const webhookReceiver of props.webhookReceivers) {
        webhookReceiver.useCommonAlertSchema =
          webhookReceiver.useCommonAlertSchema || false;
      }

      azurermMonitorActionGroup.addOverride("dynamic.webhook_receiver", {
        for_each: props.webhookReceivers,
        content: {
          name: "${webhook_receiver.value.name}",
          service_uri: "${webhook_receiver.value.serviceUri}",
          use_common_alert_schema:
            "${webhook_receiver.value.useCommonAlertSchema}",
        },
      });
    }

    if (props.eventHubReceivers) {
      azurermMonitorActionGroup.addOverride("dynamic.event_hub_receiver", {
        for_each: props.eventHubReceivers,
        content: {
          name: "${event_hub_receiver.value.name}",
          event_hub_id: "${event_hub_receiver.value.eventHubId}",
          event_hub_name: "${event_hub_receiver.value.eventHubName}",
          event_hub_namespace: "${event_hub_receiver.value.eventHubNamespace}",
          subscription_id: "${event_hub_receiver.value.subscriptionId}",
        },
      });
    }

    // Terraform Outputs
    this.id = azurermMonitorActionGroup.id;

    const cdktfTerraformOutputActionGroupId = new cdktf.TerraformOutput(
      this,
      "id",
      {
        value: azurermMonitorActionGroup.id,
      },
    );

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    cdktfTerraformOutputActionGroupId.overrideLogicalId("id");
  }
}
