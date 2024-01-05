import {
  KeyVaultKey,
  KeyVaultKeyRotationPolicy,
} from "@cdktf/provider-azurerm/lib/key-vault-key";
import { Construct } from "constructs";
import { AccessPolicy } from "./policy";
import { Vault } from "./vault";

export interface KeyProps {
  /**
   * The name of the key in the Azure Key Vault.
   */
  readonly name: string;

  readonly keyVaultId: Vault;

  /**
   * The type of key to create (e.g., RSA, EC, etc.).
   */
  readonly keyType: string;

  /**
   * The size of the key, typically specified for RSA keys.
   */
  readonly keySize?: number;

  /**
   * Additional options or attributes related to the key.
   */
  readonly keyOpts: string[]; // This is a guess based on the name; adjust the type if needed.

  /**
   * The policy for key rotation.
   */
  readonly rotationPolicy?: KeyVaultKeyRotationPolicy;

  /**
   * Expiration date of the key. Format: UTC, YYYY-MM-DDTHH:MM:SSZ.
   */
  readonly expires?: string;

  readonly accessPolicies: AccessPolicy[];
}

export class Key extends Construct {
  constructor(scope: Construct, id: string, props: KeyProps) {
    super(scope, id);

    const key = new KeyVaultKey(this, "AzureKeyVaultKey", {
      name: props.name,
      keyVaultId: props.keyVaultId.id,
      keyType: props.keyType,
      keySize: props.keySize,
      keyOpts: props.keyOpts,
      rotationPolicy: props.rotationPolicy,
      expirationDate: props.expires,
    });

    // Accumulate all the fqdn values
    const dependencies: string[] = [];
    for (const policy of props.accessPolicies) {
      dependencies.push(policy.fqdn);
    }

    // Add dependency on all access policies
    key.addOverride("depends_on", dependencies);
  }
}
