import {
  KeyVault,
  KeyVaultNetworkAcls,
} from "@cdktf/provider-azurerm/lib/key-vault";
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
  public keyVault: KeyVault;
  public resourceGroup: ResourceGroup;
  public id: string;
  private accessPolicies: AccessPolicy[] = [];

  /**
   * Constructs a new Azure Key Vault resource.
   *
   * This class creates and configures an Azure Key Vault, a secure store for managing secrets, keys, certificates, and other sensitive data.
   * It supports advanced configurations such as access policies, network rules, and data retention policies.
   *
   * @param scope - The scope in which to define this construct, usually representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the Key Vault.
   * @param props - The properties for creating the Key Vault as defined in VaultProps. These include settings for location, SKU, tenant ID, etc.
   *
   * Example usage:
   * ```typescript
   * new Vault(this, 'MyKeyVault', {
   *   name: 'mySecureVault',
   *   location: 'East US',
   *   resourceGroup: myResourceGroup,
   *   sku: 'premium',
   *   tenantId: 'my-tenant-id',
   *   softDeleteRetentionDays: 90,
   *   purgeProtection: true,
   *   tags: {
   *     project: 'My Application'
   *   }
   * });
   * ```
   */
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

  /**
   * Grants read-only access to secrets stored in the Key Vault to a specified Azure AD group.
   *
   * @param azureAdGroupId - The Azure Active Directory group ID that will receive read access to secrets.
   */
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

  /**
   * Grants administrative access to secrets stored in the Key Vault to a specified Azure AD group.
   *
   * @param azureAdGroupId - The Azure Active Directory group ID that will receive administrative access to secrets.
   */
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

  /**
   * Grants administrative access to certificates stored in the Key Vault to a specified Azure AD group.
   *
   * @param azureAdGroupId - The Azure Active Directory group ID that will receive administrative access to certificates.
   */
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

  /**
   * Grants read-only access to certificates stored in the Key Vault to a specified Azure AD group.
   *
   * @param azureAdGroupId - The Azure Active Directory group ID that will receive read access to certificates.
   */
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

  /**
   * Grants administrative access to keys stored in the Key Vault to a specified Azure AD group.
   *
   * @param azureAdGroupId - The Azure Active Directory group ID that will receive administrative access to keys.
   */
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

  /**
   * Grants read-only access to keys stored in the Key Vault to a specified Azure AD group.
   *
   * @param azureAdGroupId - The Azure Active Directory group ID that will receive read access to keys.
   */
  public grantKeyReaderAccess(azureAdGroupId: string) {
    const policyProps: AccessPolicyProps = {
      keyVaultId: this,
      tenantId: this.props.tenantId,
      objectId: azureAdGroupId,
      keyPermissions: ["Get", "List"],
    };

    const policy = new AccessPolicy(
      this,
      `kv_key_reader_access_${azureAdGroupId}`,
      policyProps,
    );
    this.accessPolicies.push(policy);
  }

  /**
   * Grants custom access based on specified options to an Azure AD group in the Key Vault.
   *
   * @param azureAdGroupId - The Azure Active Directory group ID that will receive the custom access.
   * @param options - Custom access options specifying various permissions for secrets, keys, certificates, and storage.
   */
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

  /**
   * Creates a new secret within the Azure Key Vault.
   *
   * This method facilitates the storage of sensitive information in the form of a secret within the Key Vault.
   * Secrets are protected items such as passwords, database connection strings, or any other piece of information
   * that needs to be securely stored and accessed. This method allows setting additional properties such as
   * expiration date and content type for better management and compliance.
   *
   * @param keyVaultSecretName - The unique name for the secret within the Key Vault.
   * @param secretValue - The sensitive information or data that needs to be securely stored as a secret.
   * @param expirationDate - Optional. The expiration date of the secret in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ).
   *                         If provided, the secret will no longer be valid after this date.
   * @param contentType - Optional. A description of the type of information the secret contains (e.g., 'password', 'connectionString').
   *                      This can be used by applications to handle the secret appropriately.
   *
   * Example usage:
   * ```typescript
   * vault.addSecret(
   *   'myDatabasePassword',
   *   'p@ssw0rd123!',
   *   '2030-01-01',
   *   'databasePassword'
   * );
   * ```
   * This method does not return a value. It creates a secret within the Key Vault with the specified properties.
   */
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

  /**
   * Creates an RSA cryptographic key within the Azure Key Vault.
   *
   * This method facilitates the creation of an RSA key, which is useful for a variety of cryptographic operations such as
   * encryption, decryption, digital signature verification, and more. The RSA key created by this method is configurable
   * with an optional expiration date and a default key size of 2048 bits. The key operations allowed include decryption,
   * encryption, signing, verifying signatures, and key wrapping/unwrapping.
   *
   * @param keyVaultKeyName - The unique name for the RSA key within the Key Vault.
   * @param expirationDate - Optional. The expiration date of the key in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ).
   *                         If provided, the key will no longer be valid after this date.
   * @returns A KeyVaultKey object representing the newly created RSA key within the vault.
   *
   * Example usage:
   * ```typescript
   * const rsaKey = vault.addRSAKey(
   *   'myRSAKey',
   *   '2030-01-01'
   * );
   * ```
   * This method returns the created KeyVaultKey object, allowing further operations or references to the key.
   */
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

  /**
   * Creates a cryptographic key within the Azure Key Vault.
   *
   * This method allows the creation of a cryptographic key of specified type and size within the Key Vault. The key can be
   * configured with specific operations it can perform, such as encryption, decryption, signing, etc. An optional expiration
   * date can also be set to control the key's lifecycle. This method is flexible, supporting various key types and sizes,
   * making it suitable for a wide range of cryptographic needs.
   *
   * @param keyVaultKeyName - The unique name for the cryptographic key within the Key Vault.
   * @param keyType - The type of cryptographic key to create (e.g., 'RSA', 'EC', 'oct-HSM').
   * @param keySize - The size of the cryptographic key in bits (e.g., 2048, 3072, 4096 for RSA).
   * @param keyOpts - A list of cryptographic operations that the key is allowed to perform. Possible values might include
   *                  'encrypt', 'decrypt', 'sign', 'verify', 'wrapKey', 'unwrapKey'.
   * @param expirationDate - Optional. The expiration date of the key in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ).
   *                         If provided, the key will no longer be valid after this date, aligning with best practices for key management.
   * @returns A KeyVaultKey object representing the newly created cryptographic key within the vault.
   *
   * Example usage:
   * ```typescript
   * const myKey = vault.addKey(
   *   'myKey',
   *   'RSA',
   *   2048,
   *   ['encrypt', 'decrypt', 'sign', 'verify'],
   *   '2030-12-31'
   * );
   * ```
   * This method returns the created KeyVaultKey object, enabling immediate use within the application for cryptographic operations.
   */
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

  /**
   * Creates a self-signed certificate within the Azure Key Vault.
   *
   * This method facilitates the creation of a self-signed certificate, which is a digital certificate that is signed by
   * its own creator rather than a trusted authority. Self-signed certificates can be useful for testing, internal
   * communications, or any scenario where public trust is not required. The method allows specifying subject details,
   * DNS names for the certificate, and managing its lifecycle with action types and expiry.
   *
   * @param certName - The unique name for the certificate within the Key Vault.
   * @param subject - The subject name of the certificate, typically formatted as an X.500 Distinguished Name (e.g., "CN=example.com").
   * @param dnsNames - An array of DNS names that should be associated with this certificate. This is useful for certificates
   *                   that need to be valid for multiple hostnames.
   * @param actionType - Optional. Specifies the action to be performed with the certificate, such as 'create' or 'renew'.
   * @param daysBeforeExpiry - Optional. Number of days before expiry when an action should be taken, useful for auto-renewal scenarios.
   * @returns A KeyVaultCertificate object representing the newly created self-signed certificate.
   *
   * Example usage:
   * ```typescript
   * const myCertificate = vault.addSelfSignedCert(
   *   'myCert',
   *   'CN=mydomain.com',
   *   ['mydomain.com', 'www.mydomain.com'],
   *   'create',
   *   30
   * );
   * ```
   * This method returns the KeyVaultCertificate object, enabling it to be used immediately within the application or stored for future use.
   */
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

  /**
   * Adds a certificate issuer to the Azure Key Vault.
   *
   * This method configures a certificate issuer within the Key Vault, allowing the Key Vault to issue certificates
   * through external providers. Configuring an issuer is essential for enabling automated certificate management
   * processes, such as issuance and renewal, directly through the Key Vault with a specified Certificate Authority (CA).
   *
   * @param name - The unique name for the certificate issuer within the Key Vault.
   * @param provider - The name of the external provider that will issue the certificates, such as 'DigiCert' or 'GlobalSign'.
   *
   * Example usage:
   * ```typescript
   * vault.addCertIssuer(
   *   'myCertIssuer',
   *   'DigiCert'
   * );
   * ```
   * This method configures a certificate issuer but does not return any value. The issuer details, including provider name
   * and any necessary credentials (managed externally or through additional method parameters), are set up in the Key Vault
   * for future certificate operations.
   */
  public addCertIssuer(name: string, provider: string) {
    new CertificateIssuer(this, name, {
      name: name,
      providerName: provider,
      keyVaultId: this,
      accessPolicies: this.accessPolicies,
    });
  }
}
