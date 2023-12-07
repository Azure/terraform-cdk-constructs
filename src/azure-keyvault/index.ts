import * as cdktf from 'cdktf';
import { Construct } from 'constructs';
import { KeyVault } from '@cdktf/provider-azurerm/lib/key-vault';
import { AzureKeyVaultSecret, AzureKeyVaultSecretProps } from './secret';
import { AzureKeyVaultPolicy, AzureKeyVaultPolicyProps } from './policy';
import { AzureKeyVaultCertificateIssuer, AzureKeyVaultSelfSignedCertificate, AzureKeyVaultSelfSignedCertificateProps } from './certificate';
import { AzureKeyVaultKey, AzureKeyVaultKeyProps } from './key';
import {AzureResource} from "../core-azure";


export interface KeyVaultProps {
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
    readonly resource_group_name: string;
    /**
     * The tags to assign to the Key Vault.
     */
    readonly tags?: { [key: string]: string; };
    /**
     * The tags to assign to the Key Vault.
     */
    readonly sku?: string;
    /**
     * The Name of the SKU used for this Key Vault. Possible values are standard and premium.
     */
    readonly tenant_id: string;
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

interface KeyVaultNetworkAcls {
  bypass: string;
  defaultAction: string;
}

interface GrantCustomAccessOptions {
  secretPermissions?: string[];
  certificatePermissions?: string[];
  keyPermissions?: string[];
  storagePermissions?: string[];
}


export class AzureKeyVault extends AzureResource {
  readonly props: KeyVaultProps;
  public readonly id: string;
  private accessPolicies: AzureKeyVaultPolicy[] = [];

  constructor(scope: Construct, id: string, props: KeyVaultProps) {
    super(scope, id);

    this.props = props;

    // Provide default values
    const purgeProtection = props.purgeProtection ?? true;
    const sku = props.sku ?? "standard";
    const softDeleteRetentionDays = props.softDeleteRetentionDays ?? 90;

    const azurermKeyVault = 
        new KeyVault(this, 'key_vault', {
            name: props.name,
            location: props.location,
            resourceGroupName: props.resource_group_name,
            tags: props.tags,
            skuName: sku,
            tenantId: props.tenant_id,
            networkAcls: props.networkAcls,
            purgeProtectionEnabled: purgeProtection,
            softDeleteRetentionDays: softDeleteRetentionDays,
        });
        this.id = azurermKeyVault.id;

    // Terraform Outputs
    const cdktfTerraformOutputKeyVaultid = new cdktf.TerraformOutput(this, "id", {
        value: azurermKeyVault.id,
      });
  
      /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
      cdktfTerraformOutputKeyVaultid.overrideLogicalId("id");

      const cdktfTerraformOutputKeyVaultname = new cdktf.TerraformOutput(this, "key_vault_name", {
        value: azurermKeyVault.name,
      });
  
      /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
      cdktfTerraformOutputKeyVaultname.overrideLogicalId("key_vault_name");
  }

  // Access Policy Methods
  public grantSecretReaderAccess(azureAdGroupId: string) {
      const policyProps: AzureKeyVaultPolicyProps = {
        keyVaultId: this,
        tenantId: this.props.tenant_id,
        objectId: azureAdGroupId,
        secretPermissions: [
          "Get",
          "List",
        ],
      };

      const policy =new AzureKeyVaultPolicy(this, `kv_secret_reader_access_${azureAdGroupId}`, policyProps);
      this.accessPolicies.push(policy);
  }

  public grantSecretAdminAccess(azureAdGroupId: string) {

    const policyProps: AzureKeyVaultPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenant_id,
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

    const policy =new AzureKeyVaultPolicy(this, `kv_secret_admin_access_${azureAdGroupId}`, policyProps);
    this.accessPolicies.push(policy);
  }

  public grantCertAdminAccess(azureAdGroupId: string) {

    const policyProps: AzureKeyVaultPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenant_id,
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

    const policy =new AzureKeyVaultPolicy(this, `kv_cert_admin_access_${azureAdGroupId}`, policyProps);
    this.accessPolicies.push(policy);
  }

  public grantCertReaderAccess(azureAdGroupId: string) {
    const policyProps: AzureKeyVaultPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenant_id,
      objectId: azureAdGroupId,
      certificatePermissions: [
        "Get",
        "List",
      ],
    };

    const policy =new AzureKeyVaultPolicy(this, `kv_cert_reader_access_${azureAdGroupId}`, policyProps);
    this.accessPolicies.push(policy);
  }

  public grantKeyAdminAccess(azureAdGroupId: string) {

    const policyProps: AzureKeyVaultPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenant_id,
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

    const policy =new AzureKeyVaultPolicy(this, `kv_key_admin_access_${azureAdGroupId}`, policyProps);
    this.accessPolicies.push(policy);
  }
  
  public grantKeyReaderAccess(azureAdGroupId: string) {
    const policyProps: AzureKeyVaultPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenant_id,
      objectId: azureAdGroupId,
      certificatePermissions: [
        "Get",
        "List",
      ],
    };

    const policy =new AzureKeyVaultPolicy(this, `kv_key_reader_access_${azureAdGroupId}`, policyProps);
    this.accessPolicies.push(policy);
  }

  public grantCustomAccess(azureAdGroupId: string, options: GrantCustomAccessOptions) {
    const policyProps: AzureKeyVaultPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenant_id,
      objectId: azureAdGroupId,
      ...options
    };

    const policy = new AzureKeyVaultPolicy(this, `kv_custom_policy_access_${azureAdGroupId}`, policyProps);
    this.accessPolicies.push(policy);
  }


  // Create Secret Methods
  public addSecret(keyVaultSecretName: string, secretValue: string, expirationDate?: string, contentType?: string) {
    const secretProps: AzureKeyVaultSecretProps = {
        keyVaultId: this,
        name: keyVaultSecretName,
        value: secretValue,
        expirationDate: expirationDate,
        contentType: contentType,
        accessPolicies: this.accessPolicies
    };

    new AzureKeyVaultSecret(this, keyVaultSecretName, secretProps);
  }

  // Create Key Methods
  public addRSAKey(keyVaultKeyName: string, expirationDate?: string) {
    const keyProps: AzureKeyVaultKeyProps = {
        keyVaultId: this,
        name: keyVaultKeyName,
        keyType: "RSA",
        keySize: 2048,
        keyOpts: [
          "decrypt",
          "encrypt",
          "sign",
          "unwrapKey",
          "verify",
          "wrapKey",
        ],
        expires: expirationDate,
        accessPolicies: this.accessPolicies
    };

    new AzureKeyVaultKey(this, keyVaultKeyName, keyProps);
  }

  public addKey(keyVaultKeyName: string, keyType: string, keySize: number, keyOpts: string[], expirationDate?: string) {
    const keyProps: AzureKeyVaultKeyProps = {
        keyVaultId: this,
        name: keyVaultKeyName,
        keyType: keyType,
        keySize: keySize,
        keyOpts: keyOpts,
        expires: expirationDate,
        accessPolicies: this.accessPolicies,
        
    };

    new AzureKeyVaultKey(this, keyVaultKeyName, keyProps);
  }

  // Create Certificate Methods

  public addSelfSignedCert( certName: string, subject: string, dnsNames: string[], actionType?: string, daysBeforeExpiry?: number) {
    const keyProps: AzureKeyVaultSelfSignedCertificateProps = {
        keyVaultId: this,
        name: certName,
        subject: subject,
        dnsNames: dnsNames,
        actionType: actionType,
        daysBeforeExpiry: daysBeforeExpiry,
        accessPolicies: this.accessPolicies
    };

    new AzureKeyVaultSelfSignedCertificate(this, certName, keyProps);
  }

  public addCertIssuer( name: string, provider: string) {
    new AzureKeyVaultCertificateIssuer(this, name, {
      name: name,
      providerName: provider,
      keyVaultId: this,
      accessPolicies: this.accessPolicies
    });
  }


}

