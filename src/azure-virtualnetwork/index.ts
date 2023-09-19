
import { Construct } from 'constructs';
import {VirtualNetwork} from "@cdktf/provider-azurerm/lib/virtual-network";
import {Subnet} from "@cdktf/provider-azurerm/lib/subnet";
import {VirtualNetworkPeerProps, AzureVirtualNetworkPeer, PeerSettings} from "./peering"


// Define the interface for the network configuration
interface SubnetConfig {
    name: string;
    addressPrefixes: string[];
  }

interface AzureVirtualNetworkProps {
    resourceGroupName: string;
    name: string;
    location: string;
    addressSpace: string[];
    subnets: SubnetConfig[];
  }
  
export class AzureVirtualNetwork extends Construct {
    readonly props: AzureVirtualNetworkProps;
    public readonly name: string;
    public readonly resourceGroupName: string;
    public readonly id: string;
    public readonly virtualNetwork: VirtualNetwork;
    public readonly subnets: { [name: string]: Subnet } = {}; // Map of subnet name to Subnet object

    
  
    constructor(scope: Construct, id: string, props: AzureVirtualNetworkProps) {
        super(scope, id);

        this.props = props;
        

        // Create a virtual network
        const vnet = new VirtualNetwork(this, 'MyVNet', {
        name: props.name,
        resourceGroupName: props.resourceGroupName,
        location: props.location,
        addressSpace: props.addressSpace,
        });

        this.name = vnet.name;
        this.id = vnet.id
        this.resourceGroupName = vnet.resourceGroupName;
        this.virtualNetwork = vnet;
    
        // Create subnets within the virtual network
        for (const subnetConfig of props.subnets) {
            const subnet = new Subnet(this, subnetConfig.name, {
                name: subnetConfig.name,
                resourceGroupName: props.resourceGroupName,
                virtualNetworkName: vnet.name,
                addressPrefixes: subnetConfig.addressPrefixes,
            });

            this.subnets[subnetConfig.name] = subnet; // Populate the subnetsMap

        };
    }

    // Create Vnet Peering Method
    public addVnetPeering(remoteVirtualNetwork: AzureVirtualNetwork, localPeerSettings?: PeerSettings, remotePeerSettings?: PeerSettings) {
        const vnetPeerProps: VirtualNetworkPeerProps = {
            virtualNetwork: this,
            remoteVirtualNetwork: remoteVirtualNetwork,
            localToRemoteSettings:localPeerSettings,
            remoteToLocalSettings: remotePeerSettings,
        };
        new AzureVirtualNetworkPeer(this, remoteVirtualNetwork.id, vnetPeerProps);
    }

}