/**
 * Properties for a logic app receiver.
 * @see {@link https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_action_group#logic_app_receiver}
 */
export interface LogicAppReceiverProps {
  /**
   * The name of the logic app receiver.
   */
  readonly name: string;

  /**
   * The Azure resource ID of the logic app.
   */
  readonly resourceId: string;

  /**
   * The callback url where HTTP request sent to.
   */
  readonly callbackUrl: string;

  /**
   * Whether to use the common alert schema for the email.
   * @default false
   */
  readonly useCommonAlertSchema?: boolean;
}
