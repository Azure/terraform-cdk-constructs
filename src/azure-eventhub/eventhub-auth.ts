import { EventhubAuthorizationRule } from '@cdktf/provider-azurerm/lib/eventhub-authorization-rule';
import { Construct } from 'constructs';
import * as cdktf from 'cdktf';
import { AzureKeyVault } from '../azure-keyvault';



export interface EventhubAuthorizationRuleProps{
  readonly name: string;
  /**
   * The name of the resource group in which the EventHub's parent Namespace exists.
   */
  readonly resourceGroupName: string;
  /**
   * Specifies the name of the EventHub Namespace.
   */
  readonly namespaceName: string;
  /**
   * Specifies the name of the EventHub resource.
   */
  readonly eventhubName: string;
  /**
   * Does this Authorization Rule have permissions to Listen to the Event Hub?
   * @default false
   */
  readonly listen?: boolean;
  /**
   * Does this Authorization Rule have permissions to Send to the Event Hub?
   * @default false
   */
  readonly send?: boolean;
  /**
   * Does this Authorization Rule have permissions to Manage to the Event Hub? When this property is true - both listen and send must be too.
   * @default false
   */
  readonly manage?: boolean;
}


export class AzureEventhubAuthorizationRule extends Construct {
  readonly ehInstanceAuthProps: EventhubAuthorizationRuleProps;
  private readonly primaryConnectionString: string;
  private readonly primaryKey: string;

  constructor(scope: Construct, name: string, ehInstanceAuthProps: EventhubAuthorizationRuleProps) {
    super(scope, name);

    this.ehInstanceAuthProps = ehInstanceAuthProps;

    // Fix input properties
    let listen = ehInstanceAuthProps.listen || false;
    let send = ehInstanceAuthProps.send || false;
    let manage = ehInstanceAuthProps.manage || false;

    if (manage) {
      listen = true;
      send = true;
    }

    const eventhubauthrule = new EventhubAuthorizationRule(this, ehInstanceAuthProps.name, {
      name: ehInstanceAuthProps.name,
      resourceGroupName: this.ehInstanceAuthProps.resourceGroupName,
      namespaceName: this.ehInstanceAuthProps.namespaceName,
      eventhubName: this.ehInstanceAuthProps.eventhubName,
      listen: listen,
      send: send,
      manage: manage,
    });

    // Outputs
    this.primaryConnectionString = eventhubauthrule.primaryConnectionString;
    this.primaryKey = eventhubauthrule.primaryKey;

    const cdktfTerraformOutputEventhubAuthPrimaryConnectionString = new cdktf.TerraformOutput(this, 'primary_connection_string', {
      value: eventhubauthrule.primaryConnectionString,
      sensitive: true,
    });
    const cdktfTerraformOutputEventhubAuthPrimaryKey = new cdktf.TerraformOutput(this, 'primary_key', {
      value: eventhubauthrule.primaryKey,
      sensitive: true,
    });
    cdktfTerraformOutputEventhubAuthPrimaryConnectionString.overrideLogicalId('primary_connection_string');
    cdktfTerraformOutputEventhubAuthPrimaryKey.overrideLogicalId('primary_key');
  }

  addPrimaryConnectionStringToVault(vault: AzureKeyVault, name: string, expirationDate?: string) {
    vault.addSecret(name, this.primaryConnectionString, expirationDate);
  }

  addPrimaryKeyToVault(vault: AzureKeyVault, name: string, expirationDate?: string) {
    vault.addSecret(name, this.primaryKey, expirationDate);
  }
}