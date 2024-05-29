import { MonitorActionGroup } from "@cdktf/provider-azurerm/lib/monitor-action-group";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { AzureResource } from "../../core-azure/lib";
import * as model from "../model";

export class ActionGroup extends AzureResource {
  readonly props: model.ActionGroupProps;
  public resourceGroup: ResourceGroup;
  public id: string;
  /**
   * Manages an Azure Monitor Action Group, which is used to trigger actions or notifications based on alerts or conditions met within Azure Monitor.
   *
   * An Action Group in Azure Monitor defines a collection of individual actions that are triggered when the conditions of an associated alert rule are met. Actions can include sending emails, triggering Azure Functions, calling webhooks, and more. This class allows for configuring and managing these actions, making it essential for setting up comprehensive monitoring and response systems in Azure applications.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the Action Group.
   * @param props - Configuration properties for the Action Group. These properties may include:
   *                - `name`: The name of the Action Group.
   *                - `resourceGroup`: Optional. Reference to the resource group for deployment.
   *                - `shortName`: A shorter name for the Action Group used in notifications.
   *                - `enabled`: Specifies if the Action Group is active. Defaults to true.
   *                - `location`: The Azure region where the Action Group is hosted. Defaults to global.
   *                - `tags`: A dictionary of tags to apply to the Action Group for resource management.
   *                - Receivers: Configurations for various types of notifications (e.g., email, SMS, webhook).
   *
   * Example usage:
   * ```typescript
   * const actionGroup = new ActionGroup(this, 'myActionGroup', {
   *   name: 'criticalAlertsGroup',
   *   resourceGroup: myResourceGroup,
   *   shortName: 'Alerts',
   *   location: 'East US',
   *   emailReceivers: [{
   *     name: 'admin',
   *     emailAddress: 'admin@example.com'
   *   }],
   *   smsReceivers: [{
   *     name: 'adminSms',
   *     countryCode: '1',
   *     phoneNumber: '5551234567'
   *   }],
   *   tags: {
   *     environment: 'production'
   *   }
   * });
   * ```
   * This setup creates an Action Group that sends email and SMS notifications when triggered by an alert.
   */
  constructor(scope: Construct, id: string, props: model.ActionGroupProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroup = this.setupResourceGroup(props);

    /**
     * Define default values.
     */
    const defaults = {
      enabled: props.enabled ?? true,
      location: props.location ?? "global",
      tags: props.tags ?? {},
    };

    // Create the Action Group with the provided properties
    const azurermMonitorActionGroup = new MonitorActionGroup(
      this,
      "actiongroup",
      {
        ...defaults,
        name: props.name,
        resourceGroupName: this.resourceGroup.name,
        shortName: props.shortName,
        armRoleReceiver: cdktf.listMapper(
          model.monitorActionGroupArmRoleReceiverToTerraform,
          true,
        )(this.props.armRoleReceivers),

        emailReceiver: cdktf.listMapper(
          model.monitorActionGroupEmailReceiverToTerraform,
          true,
        )(this.props.emailReceivers),

        voiceReceiver: cdktf.listMapper(
          model.monitorActionGroupVoiceReceiverToTerraform,
          true,
        )(this.props.voiceReceivers),

        smsReceiver: cdktf.listMapper(
          model.monitorActionGroupSmsReceiverToTerraform,
          true,
        )(this.props.smsReceivers),

        webhookReceiver: cdktf.listMapper(
          model.monitorActionGroupWebhookReceiverToTerraform,
          true,
        )(this.props.webhookReceivers),

        eventHubReceiver: cdktf.listMapper(
          model.monitorActionGroupEventHubReceiverToTerraform,
          true,
        )(this.props.eventHubReceivers),

        azureAppPushReceiver: cdktf.listMapper(
          model.monitorActionGroupAzureAppPushReceiverToTerraform,
          true,
        )(this.props.azureAppPushReceivers),

        logicAppReceiver: cdktf.listMapper(
          model.monitorActionGroupLogicAppReceiverToTerraform,
          true,
        )(this.props.logicAppReceivers),
      },
    );

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
