import { Construct } from 'constructs';
import { StorageAccount } from '@cdktf/provider-azurerm/lib/storage-account';
import { AzureResource } from '../core-azure';



interface AzureStorageAccountProps {
    resourceGroupName: string;
    location: string;
    name: string;
    rules: RuleConfig[];
}

export class AzureStorageAccount extends AzureResource {
    readonly props: AzureStorageAccountProps;
    public readonly id: string;
    public readonly name: string;

    constructor(scope: Construct, id: string, props: AzureStorageAccountProps) {
        super(scope, id);

        this.props = props;

        // Create the storage account
        const storageAccount = new StorageAccount(this, 'storageaccount', {
            name: props.name,
            resourceGroupName: props.resourceGroupName,
            location: props.location,
            accountReplicationType: 'LRS',
            accountTier: 'Standard',
        });

        this.id = storageAccount.id;
        this.name = storageAccount.name;

        


              
        }

        this.id = nsg.id;
        this.name = nsg.name;
    }

}


interface AzureNetworkSecurityGroupAssociationsProps {
    networkSecurityGroupId: string;
    subnetId?: string;
    networkInterfaceId?: string;
}

export class AzureNetworkSecurityGroupAssociations extends Construct {

    constructor(scope: Construct, id: string, props: AzureNetworkSecurityGroupAssociationsProps) {
        super(scope, id);
        // If subnetId is provided, create a SubnetNetworkSecurityGroupAssociation
        if (props.subnetId) {
            new SubnetNetworkSecurityGroupAssociation(this, 'subassociation', {
                subnetId: props.subnetId,
                networkSecurityGroupId: props.networkSecurityGroupId,
            });
        }

        // If networkInterfaceId is provided, create a NetworkInterfaceSecurityGroupAssociation
        if (props.networkInterfaceId) {

            new NetworkInterfaceSecurityGroupAssociation(this, 'nicassociation', {
                networkInterfaceId: props.networkInterfaceId,
                networkSecurityGroupId: props.networkSecurityGroupId,
            });
        }
    }
}