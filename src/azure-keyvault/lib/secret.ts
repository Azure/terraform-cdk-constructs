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

    // Accumulate all the fqdn values
    const dependencies: string[] = [];
    for (const policy of props.accessPolicies) {
      dependencies.push(policy.fqdn);
    }

    // Add dependency on all access policies
    secret.addOverride("depends_on", dependencies);
  }
}
