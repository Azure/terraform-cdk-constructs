
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
  constructor(scope: Construct, id: string, props: AzureKeyVaultPolicyProps) {
      super(scope, id);

      new KeyVaultAccessPolicyA(this, `secret_reader_access`, {
        keyVaultId: props.keyVaultId.id,
        tenantId: props.tenantId,
        objectId: props.objectId,
        secretPermissions: props.secretPermissions,
      });
  }

}
