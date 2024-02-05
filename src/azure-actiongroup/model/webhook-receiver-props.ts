/**
 * Properties of a webhook receiver.
 * @see {@link https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_action_group#webhook_receiver}
 */
export interface WebhookReceiverProps {
  /**
   * The name of the webhook receiver.
   */
  readonly name: string;

  /**
   * The service URI of the webhook receiver.
   */
  readonly serviceUri: string;

  /**
   * The HTTP method of the webhook receiver.
   */
  readonly useCommonAlertSchema?: boolean;

  // TODO: Add support for aadAuth
  // aadAuth?: {};
}
