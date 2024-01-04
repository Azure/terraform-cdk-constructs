import { KeyVaultSecret } from "@cdktf/provider-azurerm/lib/key-vault-secret";
import { Construct } from "constructs";
import { AccessPolicy } from "./policy";
import { Vault } from "./vault";

export interface SecretProps {
  keyVaultId: Vault;
  name: string;
  value: string;
  expirationDate?: string;
  contentType?: string;
  accessPolicies: AccessPolicy[];
}

export class Secret extends Construct {
  constructor(scope: Construct, id: string, props: SecretProps) {
    super(scope, id);

    // Logic to add the secret to the provided keyVault instance
    // For example:
    const secret = new KeyVaultSecret(this, props.name, {
      keyVaultId: props.keyVaultId.id,
      name: props.name,
      value: props.value,
      contentType: props.contentType,
      expirationDate: props.expirationDate,
    });

    // Accumulate all the fqdn values
    const dependencies: string[] = [];
    for (const policy of props.accessPolicies) {
      dependencies.push(policy.fqdn);
    }

    // Add dependency on all access policies
    secret.addOverride("depends_on", dependencies);
  }
}
