import { KeyVault } from "@cdktf/provider-azurerm/lib/key-vault";
import { KeyVaultCertificate } from "@cdktf/provider-azurerm/lib/key-vault-certificate"; // Adjust the import path based on the actual module location.
import { KeyVaultKey } from "@cdktf/provider-azurerm/lib/key-vault-key";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  CertificateIssuer,
  SelfSignedCertificate,
  SelfSignedCertificateProps,
} from "./certificate";
import { Key, KeyProps } from "./key";
import { AccessPolicy, AccessPolicyProps } from "./policy";
import { Secret, SecretProps } from "./secret";
import { AzureResource } from "../../core-azure/lib";

export interface VaultProps {
  /**
   * The name of the Key Vault.
   */
  readonly name: string;
  /**
   * The Azure Region to deploy the Key Vault.
   */
  readonly location: string;
  /**
   * The name of the Azure Resource Group.
   */
  readonly resourceGroup: ResourceGroup;
  /**
   * The tags to assign to the Key Vault.
   */
  readonly tags?: { [key: string]: string };
  /**
   * The tags to assign to the Key Vault.
   */
  readonly sku?: string;
  /**
   * The Name of the SKU used for this Key Vault. Possible values are standard and premium.
   */
  readonly tenantId: string;
  /**
   * The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault.
   */
  readonly networkAcls?: KeyVaultNetworkAcls;
  /**
   * A map of IP network ACL rules. The key is the IP or IP range in CIDR notation.
   * The value is a description of that IP range.
   */
  readonly purgeProtection?: boolean;
  /**
   *  Specifies whether protection against purge is enabled for this Key Vault.
   * Setting this property to true activates protection against deletion of any active key, secret or certificate in the vault. The setting is effective only if soft delete is also enabled. The default value is false.
   * Once activated, the property cannot be reverted to false.
   */
  readonly softDeleteRetentionDays?: number;
  /**
   * The number of days that items should be retained for once soft-deleted.
   */
}

/**
 * Network Access Control Lists (ACLs) configuration for an Azure Key Vault.
 */
export interface KeyVaultNetworkAcls {
  /**
   * Specifies whether traffic is bypassed or not. Accepted values are 'AzureServices' or 'None'.
   * 'AzureServices' allows bypassing of the network ACLs for Azure services.
   * 'None' means no bypass, all traffic is subjected to the network ACLs.
   */
  readonly bypass: string;

  /**
   * The default action of the network rule set. Accepted values are 'Allow' or 'Deny'.
   * 'Allow' means that all traffic is allowed unless explicitly denied by a rule.
   * 'Deny' means that all traffic is denied unless explicitly allowed by a rule.
   */
  readonly defaultAction: string;
}

/**
 * Options for granting custom access permissions in Azure Key Vault.
 */
export interface GrantCustomAccessOptions {
  /**
   * Optional: A list of permissions to grant for secrets in the Key Vault.
   * Example permissions include 'get', 'list', 'set', 'delete', etc.
   */
  readonly secretPermissions?: string[];

  /**
   * Optional: A list of permissions to grant for certificates in the Key Vault.
   * Example permissions include 'get', 'list', 'create', 'delete', etc.
   */
  readonly certificatePermissions?: string[];

  /**
   * Optional: A list of permissions to grant for keys in the Key Vault.
   * Example permissions include 'encrypt', 'decrypt', 'wrapKey', 'unwrapKey', etc.
   */
  readonly keyPermissions?: string[];

  /**
   * Optional: A list of permissions to grant for storage accounts in the Key Vault.
   * Example permissions include 'get', 'list', 'delete', 'set', 'update', etc.
   */
  readonly storagePermissions?: string[];
}

export class Vault extends AzureResource {
  readonly props: VaultProps;
  public resourceGroup: ResourceGroup;
  public id: string;
  private accessPolicies: AccessPolicy[] = [];
  public keyVault: KeyVault;

  constructor(scope: Construct, id: string, props: VaultProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroup = props.resourceGroup;

    // Provide default values
    const purgeProtection = props.purgeProtection ?? true;
    const sku = props.sku ?? "standard";
    const softDeleteRetentionDays = props.softDeleteRetentionDays ?? 90;

    const azurermKeyVault = new KeyVault(this, "key_vault", {
      name: props.name,
      location: props.location,
      resourceGroupName: props.resourceGroup.name,
      tags: props.tags,
      skuName: sku,
      tenantId: props.tenantId,
      networkAcls: props.networkAcls,
      purgeProtectionEnabled: purgeProtection,
      softDeleteRetentionDays: softDeleteRetentionDays,
    });
    this.id = azurermKeyVault.id;
    this.keyVault = azurermKeyVault;

    // Terraform Outputs
    const cdktfTerraformOutputKeyVaultid = new cdktf.TerraformOutput(
      this,
      "id",
      {
        value: azurermKeyVault.id,
      },
    );

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    cdktfTerraformOutputKeyVaultid.overrideLogicalId("id");

    const cdktfTerraformOutputKeyVaultname = new cdktf.TerraformOutput(
      this,
      "key_vault_name",
      {
        value: azurermKeyVault.name,
      },
    );

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    cdktfTerraformOutputKeyVaultname.overrideLogicalId("key_vault_name");
  }

  // Access Policy Methods
  public grantSecretReaderAccess(azureAdGroupId: string) {
    const policyProps: AccessPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenantId,
      objectId: azureAdGroupId,
      secretPermissions: ["Get", "List"],
    };

    const policy = new AccessPolicy(
      this,
      `kv_secret_reader_access_${azureAdGroupId}`,
      policyProps,
    );
    this.accessPolicies.push(policy);
  }

  public grantSecretAdminAccess(azureAdGroupId: string) {
    const policyProps: AccessPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenantId,
      objectId: azureAdGroupId,
      secretPermissions: [
        "Get",
        "List",
        "Set",
        "Delete",
        "Backup",
        "Restore",
        "Recover",
      ],
    };

    const policy = new AccessPolicy(
      this,
      `kv_secret_admin_access_${azureAdGroupId}`,
      policyProps,
    );
    this.accessPolicies.push(policy);
  }

  public grantCertAdminAccess(azureAdGroupId: string) {
    const policyProps: AccessPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenantId,
      objectId: azureAdGroupId,
      certificatePermissions: [
        "Get",
        "List",
        "Set",
        "Delete",
        "Backup",
        "Restore",
        "Recover",
      ],
    };

    const policy = new AccessPolicy(
      this,
      `kv_cert_admin_access_${azureAdGroupId}`,
      policyProps,
    );
    this.accessPolicies.push(policy);
  }

  public grantCertReaderAccess(azureAdGroupId: string) {
    const policyProps: AccessPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenantId,
      objectId: azureAdGroupId,
      certificatePermissions: ["Get", "List"],
    };

    const policy = new AccessPolicy(
      this,
      `kv_cert_reader_access_${azureAdGroupId}`,
      policyProps,
    );
    this.accessPolicies.push(policy);
  }

  public grantKeyAdminAccess(azureAdGroupId: string) {
    const policyProps: AccessPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenantId,
      objectId: azureAdGroupId,
      keyPermissions: [
        "Get",
        "List",
        "Set",
        "Delete",
        "Backup",
        "Restore",
        "Recover",
      ],
    };

    const policy = new AccessPolicy(
      this,
      `kv_key_admin_access_${azureAdGroupId}`,
      policyProps,
    );
    this.accessPolicies.push(policy);
  }

  public grantKeyReaderAccess(azureAdGroupId: string) {
    const policyProps: AccessPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenantId,
      objectId: azureAdGroupId,
      certificatePermissions: ["Get", "List"],
    };

    const policy = new AccessPolicy(
      this,
      `kv_key_reader_access_${azureAdGroupId}`,
      policyProps,
    );
    this.accessPolicies.push(policy);
  }

  public grantCustomAccess(
    azureAdGroupId: string,
    options: GrantCustomAccessOptions,
  ) {
    const policyProps: AccessPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenantId,
      objectId: azureAdGroupId,
      ...options,
    };

    const policy = new AccessPolicy(
      this,
      `kv_custom_policy_access_${azureAdGroupId}`,
      policyProps,
    );
    this.accessPolicies.push(policy);
  }

  // Create Secret Methods
  public addSecret(
    keyVaultSecretName: string,
    secretValue: string,
    expirationDate?: string,
    contentType?: string,
  ) {
    const secretProps: SecretProps = {
      keyVaultId: this,
      name: keyVaultSecretName,
      value: secretValue,
      expirationDate: expirationDate,
      contentType: contentType,
      accessPolicies: this.accessPolicies,
    };

    new Secret(this, keyVaultSecretName, secretProps);
  }

  // Create Key Methods
  public addRSAKey(
    keyVaultKeyName: string,
    expirationDate?: string,
  ): KeyVaultKey {
    const keyProps: KeyProps = {
      keyVaultId: this,
      name: keyVaultKeyName,
      keyType: "RSA",
      keySize: 2048,
      keyOpts: ["decrypt", "encrypt", "sign", "unwrapKey", "verify", "wrapKey"],
      expires: expirationDate,
      accessPolicies: this.accessPolicies,
    };

    const key = new Key(this, keyVaultKeyName, keyProps);
    return key.vaultKey;
  }

  public addKey(
    keyVaultKeyName: string,
    keyType: string,
    keySize: number,
    keyOpts: string[],
    expirationDate?: string,
  ): KeyVaultKey {
    const keyProps: KeyProps = {
      keyVaultId: this,
      name: keyVaultKeyName,
      keyType: keyType,
      keySize: keySize,
      keyOpts: keyOpts,
      expires: expirationDate,
      accessPolicies: this.accessPolicies,
    };

    const key = new Key(this, keyVaultKeyName, keyProps);
    return key.vaultKey;
  }

  // Create Certificate Methods

  public addSelfSignedCert(
    certName: string,
    subject: string,
    dnsNames: string[],
    actionType?: string,
    daysBeforeExpiry?: number,
  ): KeyVaultCertificate {
    const keyProps: SelfSignedCertificateProps = {
      keyVaultId: this,
      name: certName,
      subject: subject,
      dnsNames: dnsNames,
      actionType: actionType,
      daysBeforeExpiry: daysBeforeExpiry,
      accessPolicies: this.accessPolicies,
    };
    const cert = new SelfSignedCertificate(this, certName, keyProps);

    return cert.certificate;
  }

  public addCertIssuer(name: string, provider: string) {
    new CertificateIssuer(this, name, {
      name: name,
      providerName: provider,
      keyVaultId: this,
      accessPolicies: this.accessPolicies,
    });
  }
}
