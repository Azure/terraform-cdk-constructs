import { Construct } from 'constructs';
import { StorageAccount } from '@cdktf/provider-azurerm/lib/storage-account';
import { AzureResource } from '../core-azure';
import { ResourceGroup } from '@cdktf/provider-azurerm/lib/resource-group';


interface AzureStorageAccountProps {
    /**
     * The type of replication to use for the storage account. This determines how your data is replicated across Azure's infrastructure.
     * Example values: LRS (Locally Redundant Storage), GRS (Geo-Redundant Storage), RAGRS (Read Access Geo-Redundant Storage).
     */
    readonly accountReplicationType?: string;
  
    /**
     * The performance tier of the storage account. Determines the type of hardware and performance level.
     * Example values: Standard, Premium.
     */
    readonly accountTier?: string;
  
    /**
     * The Azure region in which to create the storage account.
     */
    readonly location: string;
  
    /**
     * The name of the storage account. Must be unique across Azure.
     */
    readonly name: string;
  
    /**
     * The name of the Azure resource group in which to create the storage account.
     */
    readonly resourceGroup?: ResourceGroup;
  
    /**
     * Tags to apply to the storage account, used for categorization and billing purposes.
     * Format: { [key: string]: string }
     */
    readonly tags?: { readonly [key: string]: string };
  
    /**
     * A boolean flag indicating whether to enforce HTTPS for data transfer to the storage account.
     */
    readonly enableHttpsTrafficOnly?: boolean;
  
    /**
     * Managed Service Identity (MSI) details. Used for enabling and managing Azure Active Directory (AAD) authentication.
     */
    readonly identity?: any; // Replace 'any' with a more specific type if available.
  
    /**
     * The data access tier of the storage account, which impacts storage costs and data retrieval speeds.
     * Example values: Hot, Cool.
     */
    readonly accessTier?: string;
  
    /**
     * A flag indicating whether the Hierarchical Namespace (HNS) is enabled, which is required for Azure Data Lake Storage Gen2 features.
     */
    readonly isHnsEnabled?: boolean;
  
    /**
     * The minimum TLS version to be used for securing connections to the storage account.
     * Example values: TLS1_0, TLS1_1, TLS1_2.
     */
    readonly minTlsVersion?: string;

    /**
     * A boolean flag indicating whether public network access to the storage account is allowed.
     */
    readonly publicNetworkAccessEnabled?: boolean;
  }
  

export class AzureStorageAccount extends AzureResource {
    readonly props: AzureStorageAccountProps;
    public readonly id: string;
    public readonly name: string;
    public readonly resourceGroup: ResourceGroup;
    public readonly accountKind: string;
    public readonly accountTier: string;

    constructor(scope: Construct, id: string, props: AzureStorageAccountProps) {
        super(scope, id);

        this.props = props;
        this.resourceGroup = this.setupResourceGroup(props);

        // default Storage Account Settings
        const defaults = {
            accountReplicationType: props.accountReplicationType || 'LRS',
            accountTier: props.accountTier || 'Standard',
            enableHttpsTrafficOnly: props. enableHttpsTrafficOnly || true,
            accessTier: props.accessTier || 'Hot',
            isHnsEnabled: props.isHnsEnabled ||  true,
            minTlsVersion: props.minTlsVersion ||  'TLS1_2',
            publicnetworkAccessEnabled: props.publicNetworkAccessEnabled || false,
        };


        // Create the storage account
        const storageAccount = new StorageAccount(this, 'storageaccount', {
            ...defaults,
            name: props.name,
            resourceGroupName: this.resourceGroup.name,
            location: props.location,
            tags: props.tags,
        });

        this.id = storageAccount.id;
        this.name = storageAccount.name;
        this.accountKind = storageAccount.accountKind;
        this.accountTier = storageAccount.accountTier;

        


              
    }

    private setupResourceGroup(props: AzureStorageAccountProps): ResourceGroup {

        if (!props.resourceGroup) {
          // Create a new resource group
          const newResourceGroup = new ResourceGroup(this, 'rg', {
            name: `rg-${props.name}`,
            location: props.location,
            tags: props.tags,
          });
          // Use the name of the new resource group
            return newResourceGroup;
        } else {
          // Use the provided resource group name
            return props.resourceGroup;
        }
      }

}