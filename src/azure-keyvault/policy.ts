
import {AzureKeyVault} from './index';
import { KeyVaultAccessPolicyA } from '@cdktf/provider-azurerm/lib/key-vault-access-policy';
import { Construct } from 'constructs';


export interface AzureKeyVaultPolicyProps {
  /**
   * The Azure Key Vault instance or its identifier.
   */
  readonly keyVaultId: AzureKeyVault;

  /**
   * The Azure Active Directory tenant ID where the Key Vault is hosted.
   * This is typically the directory ID of your Azure AD.
   */
  readonly tenantId: string;

  /**
   * The Azure Active Directory object ID for which the policy will be applied.
   * This can be a user, group, or service principal.
   */
  readonly objectId: string;

  /**
   * The permissions to secrets stored in the Key Vault.
   * Possible values might include: 'get', 'list', 'set', 'delete', etc.
   * If not provided, no secret permissions are set.
   */
  readonly secretPermissions?: string[];

  /**
   * The permissions to certificates stored in the Key Vault.
   * Possible values might include: 'get', 'list', 'create', 'update', etc.
   * If not provided, no certificate permissions are set.
   */
  readonly certificatePermissions?: string[];

  /**
   * The permissions to keys stored in the Key Vault.
   * Possible values might include: 'get', 'list', 'create', 'sign', etc.
   * If not provided, no key permissions are set.
   */
  readonly keyPermissions?: string[];

  /**
   * The permissions to storage accounts linked to the Key Vault.
   * Possible values might include: 'get', 'list', 'delete', 'set', etc.
   * If not provided, no storage permissions are set.
   */
  readonly storagePermissions?: string[];
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
        certificatePermissions: props.certificatePermissions,
        keyPermissions: props.keyPermissions,
        storagePermissions: props.storagePermissions,
      });

      this.fqdn = "azurerm_key_vault_access_policy." + policy.friendlyUniqueId;
  }

}
