# Azure Key Vault Construct

This class represents a Key Vault in Azure. It provides a convenient way to manage Azure Key Vault resources.

## What is Azure Key Vault?

Azure Key Vault is a service for securely storing and accessing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, certificates, or cryptographic keys.

You can learn more about Azure Key Vault in the [official Azure documentation](https://docs.microsoft.com/en-us/azure/key-vault/general/overview).

## Key Vault Best Practices

- Consolidate your secrets, keys, and certificates into as few key vaults as possible.
- Use Azure RBAC roles for Key Vault for fine-grained access control.
- Enable soft delete and purge protection to prevent accidental deletion of secrets.
- Use Managed identities with Key Vault where possible.

## Key Vault Class Properties

This class has several properties that control the Key Vault's behaviour:

- `name`: The name of the Key Vault.
- `location`: The Azure Region where the Key Vault will be deployed.
- `resource_group_name`: The name of the Azure Resource Group.
- `tags`: The tags to assign to the Key Vault.
- `sku`: The Name of the SKU used for this Key Vault. Possible values are `standard` and `premium`.
- `tenant_id`: The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault.

## Deploying the Key Vault

You can deploy a Key Vault using this class like so:

```typescript
const azureKeyVault = new AzureKeyVault(this, 'myKeyVault', {
  name: 'myKeyVault',
  location: 'West US',
  resource_group_name: 'myResourceGroup',
  sku: 'standard',
  tenant_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  tags: {
    'env': 'production',
  },
});
```

This code will create a new Key Vault named myKeyVault in the West US Azure region with a production environment tag. The vault belongs to the resource group myResourceGroup, uses the standard pricing model, and will authenticate requests using the provided tenant ID.