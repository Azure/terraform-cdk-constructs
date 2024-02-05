/**
 * Properties of an Azure App Push Receiver.
 * @see {@link https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_action_group#azure_app_push_receiver}
 */
export interface AzureAppPushReceiverProps {
  /**
   * The name of the App Push Receiver.
   */
  readonly name: string;

  /**
   * The email address of the receiver.
   */
  readonly emailAddress: string;
}
