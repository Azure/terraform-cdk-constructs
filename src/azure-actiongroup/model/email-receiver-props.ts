/**
 * Properties for an email receiver.
 * @see {@link https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_action_group#email_receiver}
 */
export interface EmailReceiversProps {
  /**
   * The name of the email receiver.
   */
  readonly name: string;

  /**
   * The email address of the receiver.
   */
  readonly emailAddress: string;

  /**
   * Whether to use the common alert schema for the email.
   * @default false
   */
  readonly useCommonAlertSchema?: boolean;
}
