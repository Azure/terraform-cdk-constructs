/**
 * The properties of a voice receiver.
 * @see {@link https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_action_group#voice_receiver}
 */
export interface VoiceReceiverProps {
  /**
   * The name of the voice receiver.
   */
  readonly name: string;

  /**
   * The country code of the voice receiver.
   */
  readonly countryCode: string;

  /**
   * The phone number of the voice receiver.
   */
  readonly phoneNumber: string;
}
