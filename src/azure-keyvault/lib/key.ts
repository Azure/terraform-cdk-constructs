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
  public vaultKey: KeyVaultKey;

  /**
   * Constructs a new Key resource in Azure Key Vault.
   *
   * This class is responsible for the creation and management of a cryptographic key stored in Azure Key Vault.
   * The key can be used for a variety of cryptographic operations, such as encryption, decryption, signing, or
   * verifying signatures, depending on the permissions granted. It supports different key types and configurations,
   * allowing for customization to meet specific security requirements.
   *
   * @param scope - The scope in which to define this construct, usually representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the Key.
   * @param props - The properties for creating the key as defined in KeyProps. These properties include:
   *                - `name`: Required. The name of the key as it will appear in Azure Key Vault.
   *                - `keyVaultId`: Required. The ID of the Azure Key Vault where the key will be created.
   *                - `keyType`: Required. The type of cryptographic key to create (e.g., RSA, EC).
   *                - `keySize`: Optional. The size of the key, typically specified for RSA keys.
   *                - `keyOpts`: Optional. Additional options or attributes related to the key's capabilities such as encrypt, decrypt, wrapKey, unwrapKey.
   *                - `rotationPolicy`: Optional. The policy settings for rotating the key automatically.
   *                - `expires`: Optional. The expiration date of the key in UTC format (YYYY-MM-DDTHH:MM:SSZ).
   *                - `accessPolicies`: Required. Access policies defining who can access this key within the Key Vault.
   *
   * Example usage:
   * ```typescript
   * new Key(this, 'myKey', {
   *   name: 'encryptionKey',
   *   keyVaultId: myKeyVault,
   *   keyType: 'RSA',
   *   keySize: 2048,
   *   keyOpts: ['encrypt', 'decrypt', 'sign', 'verify'],
   *   rotationPolicy: {
   *     expiryTime: 'P90D'
   *   },
   *   expires: '2030-01-01T00:00:00Z',
   *   accessPolicies: [{ userId: 'user123', permissions: ['get', 'list', 'update'] }]
   * });
   * ```
   */
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
    this.vaultKey = key;

    // Accumulate all the fqdn values
    const dependencies: string[] = [];
    for (const policy of props.accessPolicies) {
      dependencies.push(policy.fqdn);
    }

    // Add dependency on all access policies
    key.addOverride("depends_on", dependencies);
  }
}
