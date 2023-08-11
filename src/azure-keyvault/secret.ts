
import {AzureKeyVault} from './index';
import { KeyVaultSecret } from '@cdktf/provider-azurerm/lib/key-vault-secret';
import { Construct } from 'constructs';


export interface AzureKeyVaultSecretProps {
  keyVaultId: AzureKeyVault;
  name: string;
  value: string;
  expirationDate?: string;
}

export class AzureKeyVaultSecret extends Construct {
  constructor(scope: Construct, id: string, props: AzureKeyVaultSecretProps) {
      super(scope, id);
      
      // Logic to add the secret to the provided keyVault instance
      // For example:
      new KeyVaultSecret(this, props.name, {
        keyVaultId: props.keyVaultId.id,
        name: props.name,
        value: props.value,
        expirationDate: props.expirationDate,
      });
  }

  // Add dependency on all access policies
      // for (const policy of AzureKeyVault.accessPolicies) {
      //   secret.addOverride('depends_on', ["azurerm_key_vault_access_policy." + policy.friendlyUniqueId]);
      // }
}