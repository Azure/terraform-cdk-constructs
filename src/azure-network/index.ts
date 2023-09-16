
import { Construct } from 'constructs';
import {VirtualNetwork} from "@cdktf/provider-azurerm/lib/virtual-network";
import {Subnet} from "@cdktf/provider-azurerm/lib/subnet";


// Define the interface for the network configuration
interface SubnetConfig {
    name: string;
    addressPrefixes: string[];
  }

interface NetworkProps {
    resourceGroupName: string;
    name: string;
    location: string;
    addressSpace: string[];
    subnets: SubnetConfig[];
  }
  
export class Network extends Construct {
    readonly props: NetworkProps;
    public readonly name: string;
    public readonly subnetNames: string[];
    public readonly subnetIds: string[] = [];
    
  
    constructor(scope: Construct, id: string, props: NetworkProps) {
        super(scope, id);

        this.props = props;
        this.subnetNames = props.subnets.map(subnet => subnet.name);

        // Create a virtual network
        const vnet = new VirtualNetwork(this, 'MyVNet', {
        name: props.name,
        resourceGroupName: props.resourceGroupName,
        location: props.location,
        addressSpace: props.addressSpace,
        });

        this.name = vnet.name;
    
        // Create subnets within the virtual network
        for (const subnetConfig of props.subnets) {
            const subnet = new Subnet(this, subnetConfig.name, {
                name: subnetConfig.name,
                resourceGroupName: props.resourceGroupName,
                virtualNetworkName: vnet.name,
                addressPrefixes: subnetConfig.addressPrefixes,
            });

            this.subnetIds.push(subnet.id);
        };

        // Assuming the Subnet class has an 'id' property that provides the ID of the created subnet
        
    }
}