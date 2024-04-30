import { KeyVaultCertificate } from "@cdktf/provider-azurerm/lib/key-vault-certificate"; // Adjust the import path based on the actual module location.
import { KeyVaultCertificateIssuer } from "@cdktf/provider-azurerm/lib/key-vault-certificate-issuer";
import { Construct } from "constructs";
import { AccessPolicy } from "./policy";
import { Vault } from "./vault";

/**
 * Properties required to create a self-signed certificate within Azure Key Vault.
 */
export interface SelfSignedCertificateProps {
  /**
   * The name of the certificate to be stored in Azure Key Vault.
   */
  readonly name: string;

  /**
   * The subject name for the certificate, typically represented in X.509 distinguished name format.
   */
  readonly subject: string;

  /**
   * Additional DNS names to be included in the certificate. Useful for creating certificates valid for multiple hostnames.
   */
  readonly dnsNames: string[];

  /**
   * The ID of the Azure Key Vault where the certificate will be created and stored.
   */
  readonly keyVaultId: Vault;

  /**
   * Specifies the type of action to perform with the certificate, such as 'create' or 'renew'.
   */
  readonly actionType?: string;

  /**
   * Specifies the number of days before expiry when an action should be taken (e.g., renew the certificate).
   */
  readonly daysBeforeExpiry?: number;

  /**
   * Access policies defining who can access this certificate within the Azure Key Vault.
   */
  readonly accessPolicies: AccessPolicy[];

  /**
   * Tags to be associated with the certificate for organizational purposes.
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Properties required to configure a certificate issuer within Azure Key Vault.
 */
export interface CertificateIssuerProps {
  /**
   * The name of the certificate issuer as it will appear in Azure Key Vault.
   */
  readonly name: string;

  /**
   * The name of the provider that will issue the certificate, such as 'DigiCert' or 'GlobalSign'.
   */
  readonly providerName: string;

  /**
   * The ID of the Azure Key Vault where the issuer will be configured.
   */
  readonly keyVaultId: Vault;

  /**
   * Access policies defining who can manage this issuer and the certificates it issues within the Key Vault.
   */
  readonly accessPolicies: AccessPolicy[];

  /**
   * The username required to authenticate with the certificate provider (if applicable).
   */
  readonly username?: string;

  /**
   * The password required to authenticate with the certificate provider (if applicable).
   */
  readonly password?: string;
}

export class SelfSignedCertificate extends Construct {
  public certificate: KeyVaultCertificate;
  public id: string;
  public secretId: string;

  /**
   * Constructs a self-signed certificate within an Azure Key Vault.
   *
   * This class is responsible for the creation and management of a self-signed certificate, making it available
   * within an Azure Key Vault. The certificate can be used for testing or internal secure communications.
   *
   * @param scope - The scope in which to define this construct, usually representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the certificate.
   * @param props - The properties for creating the self-signed certificate as defined in SelfSignedCertificateProps.
   *
   * Example usage:
   * ```typescript
   * new SelfSignedCertificate(this, 'MySelfSignedCert', {
   *   name: 'exampleCert',
   *   subject: 'CN=example.com',
   *   dnsNames: ['example.com', 'www.example.com'],
   *   keyVaultId: myKeyVault,
   *   accessPolicies: [{ userId: 'user123', permissions: ['all'] }],
   *   tags: { project: 'My Project' }
   * });
   * ```
   */
  constructor(scope: Construct, id: string, props: SelfSignedCertificateProps) {
    super(scope, id);

    // Provide default values
    const actionType = props.actionType ?? "AutoRenew";
    const daysBeforeExpiry = props.daysBeforeExpiry ?? 45;

    const certificate = new KeyVaultCertificate(
      this,
      "AzureKeyVaultCertificate",
      {
        name: props.name,
        keyVaultId: props.keyVaultId.id,
        certificatePolicy: {
          issuerParameters: {
            name: "Self",
          },
          keyProperties: {
            keyType: "RSA",
            keySize: 2048,
            reuseKey: true,
            exportable: true,
          },
          lifetimeAction: [
            {
              action: {
                actionType: actionType,
              },
              trigger: {
                daysBeforeExpiry: daysBeforeExpiry,
              },
            },
          ],
          secretProperties: {
            contentType: "application/x-pkcs12",
          },
          x509CertificateProperties: {
            subject: props.subject,
            subjectAlternativeNames: {
              dnsNames: props.dnsNames,
            },
            keyUsage: [
              "cRLSign",
              "dataEncipherment",
              "digitalSignature",
              "keyAgreement",
              "keyCertSign",
              "keyEncipherment",
            ],
            extendedKeyUsage: ["1.3.6.1.5.5.7.3.1"],
            validityInMonths: 12,
          },
        },
      },
    );
    this.certificate = certificate;

    this.id = certificate.id;
    this.secretId = certificate.secretId;

    // Accumulate all the fqdn values
    const dependencies: string[] = [];
    for (const policy of props.accessPolicies) {
      dependencies.push(policy.fqdn);
    }

    // Add dependency on all access policies
    certificate.addOverride("depends_on", dependencies);
  }
}

export class CertificateIssuer extends Construct {
  /**
   * Constructs a new Certificate Issuer within an Azure Key Vault.
   *
   * This class is responsible for setting up a certificate issuer in Azure Key Vault. A certificate issuer is an entity
   * that issues digital certificates for use in SSL/TLS and other cryptographic security contexts. By configuring an issuer,
   * you can manage certificate lifecycle (issue, renew, revoke) through Azure Key Vault in conjunction with external certificate
   * authorities (CAs).
   *
   * @param scope - The scope in which to define this construct, usually representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the certificate issuer.
   * @param props - The properties for configuring the certificate issuer as defined in CertificateIssuerProps. These properties include:
   *                - `name`: Required. The name of the issuer as it will appear in Azure Key Vault.
   *                - `providerName`: Required. The name of the provider that will issue the certificates, such as 'DigiCert' or 'GlobalSign'.
   *                - `keyVaultId`: Required. The ID of the Azure Key Vault where the issuer will be configured.
   *                - `accessPolicies`: Required. Access policies defining who can manage this issuer within the Key Vault.
   *                - `username`: Optional. The username required to authenticate with the certificate provider (if applicable).
   *                - `password`: Optional. The password required to authenticate with the certificate provider (if applicable).
   *
   * Example usage:
   * ```typescript
   * new CertificateIssuer(this, 'MyCertIssuer', {
   *   name: 'MyIssuer',
   *   providerName: 'DigiCert',
   *   keyVaultId: myKeyVault,
   *   accessPolicies: [{ userId: 'user123', permissions: ['manageIssuer'] }],
   *   username: 'user@example.com',
   *   password: 'securepassword'
   * });
   * ```
   */
  constructor(scope: Construct, id: string, props: CertificateIssuerProps) {
    super(scope, id);

    const certificateIssuer = new KeyVaultCertificateIssuer(
      this,
      "AzureKeyVaultCertificate",
      {
        name: props.name,
        keyVaultId: props.keyVaultId.id,
        providerName: props.providerName,
      },
    );

    // Accumulate all the fqdn values
    const dependencies: string[] = [];
    for (const policy of props.accessPolicies) {
      dependencies.push(policy.fqdn);
    }

    // Add dependency on all access policies
    certificateIssuer.addOverride("depends_on", dependencies);
  }
}
