import {
  EventhubAuthorizationRule,
  EventhubAuthorizationRuleConfig,
} from "@cdktf/provider-azurerm/lib/eventhub-authorization-rule";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { Vault } from "../../azure-keyvault";

export interface AuthorizationRuleProps {
  readonly name: string;
  /**
   * The name of the resource group in which the EventHub's parent Namespace exists.
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

export class AuthorizationRule extends Construct {
  readonly ehInstanceAuthProps: EventhubAuthorizationRuleConfig;
  private readonly primaryConnectionString: string;
  private readonly primaryKey: string;

  /**
   * Constructs a new Authorization Rule for an Azure Event Hub.
   *
   * This class creates an authorization rule which defines the permissions granted to users and applications
   * for accessing and managing the Event Hub. An Authorization Rule can grant listening, sending, and full manage
   * permissions based on the properties specified.
   *
   * @param scope - The scope in which to define this construct, typically used for managing lifecycles and creation order.
   * @param name - The unique name for this instance of the Authorization Rule.
   * @param ehInstanceAuthProps - The properties for configuring the Authorization Rule. The properties include:
   *                - `name`: Required. The name of the Authorization Rule.
   *                - `listen`: Optional. Specifies whether the rule allows listening to the Event Hub. Defaults to false.
   *                - `send`: Optional. Specifies whether the rule allows sending events to the Event Hub. Defaults to false.
   *                - `manage`: Optional. Specifies whether the rule allows managing the Event Hub, including sending and listening. Defaults to false.
   *                When `manage` is true, both `listen` and `send` are implicitly set to true.
   *
   * Example usage:
   * ```typescript
   * const authRule = new AuthorizationRule(this, 'exampleAuthRule', {
   *   name: 'myAuthRule',
   *   listen: true,
   *   send: true,
   *   manage: false // Only listening and sending are enabled; not managing.
   * });
   * ```
   *
   * @remarks
   * The primary connection string and primary key are accessible after the instance creation,
   * allowing for integration with other Azure services or client applications.
   */
  constructor(
    scope: Construct,
    name: string,
    ehInstanceAuthProps: EventhubAuthorizationRuleConfig,
  ) {
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

    const eventhubauthrule = new EventhubAuthorizationRule(
      this,
      ehInstanceAuthProps.name,
      {
        name: ehInstanceAuthProps.name,
        resourceGroupName: this.ehInstanceAuthProps.resourceGroupName,
        namespaceName: this.ehInstanceAuthProps.namespaceName,
        eventhubName: this.ehInstanceAuthProps.eventhubName,
        listen: listen,
        send: send,
        manage: manage,
      },
    );

    // Outputs
    this.primaryConnectionString = eventhubauthrule.primaryConnectionString;
    this.primaryKey = eventhubauthrule.primaryKey;

    const cdktfTerraformOutputEventhubAuthPrimaryConnectionString =
      new cdktf.TerraformOutput(this, "primary_connection_string", {
        value: eventhubauthrule.primaryConnectionString,
        sensitive: true,
      });
    const cdktfTerraformOutputEventhubAuthPrimaryKey =
      new cdktf.TerraformOutput(this, "primary_key", {
        value: eventhubauthrule.primaryKey,
        sensitive: true,
      });
    cdktfTerraformOutputEventhubAuthPrimaryConnectionString.overrideLogicalId(
      "primary_connection_string",
    );
    cdktfTerraformOutputEventhubAuthPrimaryKey.overrideLogicalId("primary_key");
  }

  addPrimaryConnectionStringToVault(
    vault: Vault,
    name: string,
    expirationDate?: string,
  ) {
    vault.addSecret(name, this.primaryConnectionString, expirationDate);
  }

  addPrimaryKeyToVault(vault: Vault, name: string, expirationDate?: string) {
    vault.addSecret(name, this.primaryKey, expirationDate);
  }
}
