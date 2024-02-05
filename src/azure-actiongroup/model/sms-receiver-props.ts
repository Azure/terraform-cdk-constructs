/**
 * The properties of an SMS receiver.
 * @see {@link https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_action_group#sms_receiver}
 */
export interface SmsReceiverProps {
  /**
   * The name of the SMS receiver.
   */
  readonly name: string;

  /**
   * The country code of the SMS receiver.
   */
  readonly countryCode: string;

  /**
   * The phone number of the SMS receiver.
   */
  readonly phoneNumber: string;
}
