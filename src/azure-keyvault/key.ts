import { Construct } from 'constructs';
import {AzureKeyVault} from './index';
import { KeyVaultKey, KeyVaultKeyRotationPolicy} from '@cdktf/provider-azurerm/lib/key-vault-key';
import { AzureKeyVaultPolicy} from './policy';


export interface AzureKeyVaultKeyProps {
    /**
     * The name of the key in the Azure Key Vault.
     */
    readonly name: string;
  
    readonly keyVaultId: AzureKeyVault;
  
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


   

    accessPolicies: AzureKeyVaultPolicy[];
}
  

export class AzureKeyVaultKey extends Construct {

  constructor(scope: Construct, id: string, props: AzureKeyVaultKeyProps) {
      super(scope, id);

      const key = new KeyVaultKey(this, 'AzureKeyVaultKey', {
        name: props.name,
        keyVaultId: props.keyVaultId.id,
        keyType: props.keyType,
        keySize: props.keySize,
        keyOpts: props.keyOpts,
        rotationPolicy: props.rotationPolicy,

      });

      // Accumulate all the fqdn values
      const dependencies: string[] = [];
      for (const policy of props.accessPolicies) {
          dependencies.push(policy.fqdn);
      }

      // Add dependency on all access policies
      key.addOverride('depends_on', dependencies);

  }

}
