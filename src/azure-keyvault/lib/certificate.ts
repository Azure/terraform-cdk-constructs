import { KeyVaultCertificate } from "@cdktf/provider-azurerm/lib/key-vault-certificate"; // Adjust the import path based on the actual module location.
import { KeyVaultCertificateIssuer } from "@cdktf/provider-azurerm/lib/key-vault-certificate-issuer";
import { Construct } from "constructs";
import { AccessPolicy } from "./policy";
import { Vault } from "./vault";

export interface SelfSignedCertificateProps {
  /**
   * The name of the certificate in the Azure Key Vault.
   */
  readonly name: string;

  readonly subject: string;

  readonly dnsNames: string[];

  readonly keyVaultId: Vault;

  readonly actionType?: string;

  readonly daysBeforeExpiry?: number;

  readonly accessPolicies: AccessPolicy[];

  readonly tags?: { [key: string]: string };
}

export interface CertificateIssuerProps {
  /**
   * The name of the certificate issuer in the Azure Key Vault.
   */
  readonly name: string;

  readonly providerName: string;

  readonly keyVaultId: Vault;

  readonly accessPolicies: AccessPolicy[];

  readonly username?: string;

  readonly password?: string;
}

export class SelfSignedCertificate extends Construct {
  public certificate: KeyVaultCertificate;

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
