import { KeyVaultSecret } from "@cdktf/provider-azurerm/lib/key-vault-secret";
import { Construct } from "constructs";
import { AccessPolicy } from "./policy";
import { Vault } from "./vault";

/**
 * Properties for defining an Azure Key Vault Secret.
 */
export interface SecretProps {
  /**
   * The Key Vault instance where the secret will be stored.
   */
  readonly keyVaultId: Vault;

  /**
   * The name of the secret. This name should be unique within the Key Vault instance.
   */
  readonly name: string;

  /**
   * The value of the secret. This could be any string, including tokens or passwords.
   */
  readonly value: string;

  /**
   * Optional expiration date for the secret. This should be in an appropriate date string format.
   * If provided, the secret will become invalid after this date.
   */
  readonly expirationDate?: string;

  /**
   * Optional content type for the secret. This can be used to describe the type of information
   * the secret contains, or how it can be used.
   */
  readonly contentType?: string;

  /**
   * A list of access policies that dictate which identities have what kind of access to the secret.
   * Each policy should detail the permissions and the identity it applies to.
   */
  readonly accessPolicies: AccessPolicy[];
}

export class Secret extends Construct {
  public secretId: string;

  /**
   * Constructs a new Azure Key Vault Secret within a specified Key Vault.
   *
   * This class facilitates the creation and management of a secret, allowing sensitive information to be stored securely
   * and accessed as needed while maintaining confidentiality and control through defined access policies.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the secret.
   * @param props - The properties for creating the secret as defined in SecretProps. These include:
   *                - `keyVaultId`: The ID of the Key Vault in which to store the secret.
   *                - `name`: The name of the secret.
   *                - `value`: The confidential data to be stored as the secret.
   *                - `expirationDate`: Optional. The expiration date of the secret.
   *                - `contentType`: Optional. A label hinting at the content type of the secret's value.
   *                - `accessPolicies`: Access policies that dictate permissions for the secret.
   *
   * Example usage:
   * ```typescript
   * new Secret(this, 'mySecret', {
   *   keyVaultId: myKeyVault,
   *   name: 'dbPassword',
   *   value: 'p@ssw0rd!',
   *   expirationDate: '2030-01-01T00:00:00Z',
   *   contentType: 'password',
   *   accessPolicies: [{
   *     objectId: '12345-user-object-id',
   *     permissions: ['get', 'list']
   *   }]
   * });
   * ```
   */
  constructor(scope: Construct, id: string, props: SecretProps) {
    super(scope, id);

    // Logic to add the secret to the provided keyVault instance
    // For example:
    const secret = new KeyVaultSecret(this, props.name, {
      keyVaultId: props.keyVaultId.id,
      name: props.name,
      value: props.value,
      contentType: props.contentType,
      expirationDate: props.expirationDate,
    });

    this.secretId = secret.id;

    // Accumulate all the fqdn values
    const dependencies: string[] = [];
    for (const policy of props.accessPolicies) {
      dependencies.push(policy.fqdn);
    }

    // Add dependency on all access policies
    secret.addOverride("depends_on", dependencies);
  }
}
