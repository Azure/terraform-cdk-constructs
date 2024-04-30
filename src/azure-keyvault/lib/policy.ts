import { KeyVaultAccessPolicyA } from "@cdktf/provider-azurerm/lib/key-vault-access-policy";
import { Construct } from "constructs";
import { Vault } from "./vault";

export interface AccessPolicyProps {
  /**
   * The Azure Key Vault instance or its identifier.
   */
  readonly keyVaultId: Vault;

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

export class AccessPolicy extends Construct {
  public readonly fqdn: string;

  /**
   * Constructs a new Access Policy for Azure Key Vault.
   *
   * This class is responsible for setting up access policies that define what operations an Azure AD identity
   * can perform on the keys, secrets, certificates, and storage accounts within a specified Azure Key Vault.
   *
   * @param scope - The scope in which to define this construct, usually representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the access policy.
   * @param props - The properties for creating the access policy as defined in AccessPolicyProps. These include:
   *                - `keyVaultId`: The Azure Key Vault identifier where the policy will be set.
   *                - `tenantId`: The tenant ID of the Azure AD tenant where the Key Vault is hosted.
   *                - `objectId`: The object ID of the Azure AD identity (user, group, or service principal).
   *                - `secretPermissions`: Optional list of permissions to secrets within the Key Vault.
   *                - `certificatePermissions`: Optional list of permissions to certificates within the Key Vault.
   *                - `keyPermissions`: Optional list of permissions to keys within the Key Vault.
   *                - `storagePermissions`: Optional list of permissions to storage accounts linked to the Key Vault.
   *
   * Example usage:
   * ```typescript
   * new AccessPolicy(this, 'MyAccessPolicy', {
   *   keyVaultId: myKeyVault,
   *   tenantId: 'my-tenant-id',
   *   objectId: 'user-object-id',
   *   keyPermissions: ['get', 'list', 'update'],
   *   secretPermissions: ['get'],
   *   certificatePermissions: ['get', 'list'],
   *   storagePermissions: ['get', 'list']
   * });
   * ```
   */
  constructor(scope: Construct, id: string, props: AccessPolicyProps) {
    super(scope, id);

    const policy = new KeyVaultAccessPolicyA(this, "policy", {
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
