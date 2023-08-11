
import {AzureKeyVault} from './index';
import { KeyVaultAccessPolicyA } from '@cdktf/provider-azurerm/lib/key-vault-access-policy';
import { Construct } from 'constructs';


export interface AzureKeyVaultPolicyProps {
  keyVaultId: AzureKeyVault;
  tenantId: string;
  objectId: string;
  secretPermissions: string[];
}

export class AzureKeyVaultPolicy extends Construct {
  public readonly fqdn: string;

  constructor(scope: Construct, id: string, props: AzureKeyVaultPolicyProps) {
      super(scope, id);

      

      const policy = new KeyVaultAccessPolicyA(this, `secret_reader_access`, {
        keyVaultId: props.keyVaultId.id,
        tenantId: props.tenantId,
        objectId: props.objectId,
        secretPermissions: props.secretPermissions,
      });

      this.fqdn = "azurerm_key_vault_access_policy." + policy.friendlyUniqueId;
  }

}
