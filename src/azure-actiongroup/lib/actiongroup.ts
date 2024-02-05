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

  constructor(scope: Construct, id: string, props: model.ActionGroupProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroup = props.resourceGroup;

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
        resourceGroupName: props.resourceGroup.name,
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
