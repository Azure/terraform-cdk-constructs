/**
 * Properties of an EventHub Receiver.
 * @see {@link https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_action_group#event_hub_receiver}
 */
export interface EventhubReceiverProps {
  /**
   * The name of the EventHub Receiver, must be unique within action group.
   */
  readonly name: string;

  /**
   * The name of the EventHub Receiver.
   */
  readonly eventHubName: string;

  /**
   * The name of the EventHub namespace.
   */
  readonly eventHubNamespace: string;

  /**
   * Whether to use the common alert schema for the email.
   * @default false
   */
  readonly useCommonAlertSchema?: boolean;
}
