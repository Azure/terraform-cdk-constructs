import { Construct } from 'constructs';
import { NetworkSecurityGroup} from "@cdktf/provider-azurerm/lib/network-security-group";
import { NetworkSecurityRule } from "@cdktf/provider-azurerm/lib/network-security-rule";
import { Subnet } from "@cdktf/provider-azurerm/lib/subnet";
import { NetworkInterface } from "@cdktf/provider-azurerm/lib/network-interface"; // Import the NetworkInterface class
import { SubnetNetworkSecurityGroupAssociation } from "@cdktf/provider-azurerm/lib/subnet-network-security-group-association";
import { NetworkInterfaceSecurityGroupAssociation } from '@cdktf/provider-azurerm/lib/network-interface-security-group-association';
import { AzureResource } from '../core-azure';

export interface RuleConfig {
    name: string;
    priority: number;
    direction: string;
    access: string;
    protocol: string;
    sourcePortRange: string;
    destinationPortRange: string;
    sourceAddressPrefix: string;
    destinationAddressPrefix: string;
}

interface AzureNetworkSecurityGroupProps {
    resourceGroupName: string;
    location: string;
    name: string;
    rules: RuleConfig[];
}

export class AzureNetworkSecurityGroup extends AzureResource {
    readonly props: AzureNetworkSecurityGroupProps;
    public readonly id: string;
    public readonly name: string;

    constructor(scope: Construct, id: string, props: AzureNetworkSecurityGroupProps) {
        super(scope, id);

        this.props = props;

        // Create a network security group
        const nsg = new NetworkSecurityGroup(this, "nsg", {
            name: props.name,
            resourceGroupName: props.resourceGroupName,
            location: props.location,
        });

        // Create security rules within the network security group
        for (const ruleConfig of props.rules) {
            new NetworkSecurityRule(this, ruleConfig.name, {
                name: ruleConfig.name,
                resourceGroupName: props.resourceGroupName,
                networkSecurityGroupName: nsg.name,
                priority: ruleConfig.priority,
                direction: ruleConfig.direction,
                access: ruleConfig.access,
                protocol: ruleConfig.protocol,
                sourcePortRange: ruleConfig.sourcePortRange,
                destinationPortRange: ruleConfig.destinationPortRange,
                sourceAddressPrefix: ruleConfig.sourceAddressPrefix,
                destinationAddressPrefix: ruleConfig.destinationAddressPrefix,
            });


              
        }

        this.id = nsg.id;
        this.name = nsg.name;
    }



    // Method to associate the network security group to a subnet
    public associateToSubnet(subnet: Subnet) {
        new AzureNetworkSecurityGroupAssociations(this, subnet.name, {
            subnetId: subnet.id,
            networkSecurityGroupId: this.id,
        });
    }

    // Method to associate the network security group to a network interface
    public associateToNetworkInterface(networkInterface: NetworkInterface) {
        new AzureNetworkSecurityGroupAssociations(this, networkInterface.name , {
            networkInterfaceId: networkInterface.id,
            networkSecurityGroupId: this.id,
        });


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