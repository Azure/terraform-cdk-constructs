import * as cdktf from 'cdktf';
import { Construct } from 'constructs';
import { KeyVault } from '@cdktf/provider-azurerm/lib/key-vault';

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
    readonly sku: string;
    /**
     * The Name of the SKU used for this Key Vault. Possible values are standard and premium.
     */
    readonly tenant_id: string;
    /**
     * The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault.
     */
}

export class AzureKeyVault extends Construct {
  readonly props: KeyVaultProps;

  constructor(scope: Construct, id: string, props: KeyVaultProps) {
    super(scope, id);

    this.props = props;

    const azurermKeyVault = 
        new KeyVault(this, 'key_vault', {
            name: props.name,
            location: props.location,
            resourceGroupName: props.resource_group_name,
            tags: props.tags,
            skuName: props.sku,
            tenantId: props.tenant_id,
        });

    // Terraform Outputs
    const cdktfTerraformOutputKeyVaultid = new cdktf.TerraformOutput(this, "id", {
        value: azurermKeyVault.id,
      });
  
      /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
      cdktfTerraformOutputKeyVaultid.overrideLogicalId("id");
  }
}

