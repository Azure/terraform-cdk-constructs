/**
 * @description
 * The ARM role receiver is used to send an email to an ARM role.
 * @see {@link https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_action_group#arm_role_receiver}
 */
export interface ArmRoleReceiverProps {
  /**
   * The name of the ARM role receiver.
   */
  readonly name: string;

  /**
   * The ID of the ARM role to send the email to.
   */
  readonly roleId: string;

  /**
   * Whether to use the common alert schema for the email.
   * @default false
   */
  readonly useCommonAlertSchema?: boolean;
}
