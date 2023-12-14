import { Construct } from 'constructs';
import {VirtualNetwork} from "@cdktf/provider-azurerm/lib/virtual-network";
import {Subnet} from "@cdktf/provider-azurerm/lib/subnet";
import {PeerProps, Peer, PeerSettings} from "./peering"
import { AzureResource } from '../../core-azure/lib';

// Define the interface for the network configuration
interface SubnetConfig {
    name: string;
    addressPrefixes: string[];
  }

interface NetworkProps {
    resourceGroupName: string;
    name?: string;
    location?: string;
    addressSpace?: string[];
    subnets?: SubnetConfig[];
  }
  
export class Network extends AzureResource {
    readonly props: NetworkProps;
    public readonly name: string;
    public readonly resourceGroupName: string;
    public readonly id: string;
    public readonly virtualNetwork: VirtualNetwork;
    public readonly subnets: { [name: string]: Subnet } = {}; // Map of subnet name to Subnet object

    
  
    constructor(scope: Construct, id: string, props: NetworkProps) {
        super(scope, id);

        this.props = props;

        const defaults = {
            name: props.name || `vnet-${this.node.path.split("/")[0]}`,
            location: props.location || "eastus",
            addressSpace: props.addressSpace || ["10.0.0.0/16"],
            subnets: props.subnets || [{
                name: "default",
                addressPrefixes: ["10.1.0.0/24"],
            }],
        }
        

        // Create a virtual network
        const vnet = new VirtualNetwork(this, "vnet", {
            ...defaults,
            resourceGroupName: props.resourceGroupName,
        });

        this.name = vnet.name;
        this.id = vnet.id
        this.resourceGroupName = vnet.resourceGroupName;
        this.virtualNetwork = vnet;
    
        // Create subnets within the virtual network
        for (const subnetConfig of defaults.subnets) {
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
    public addVnetPeering(remoteVirtualNetwork: Network, localPeerSettings?: PeerSettings, remotePeerSettings?: PeerSettings) {
        const vnetPeerProps: PeerProps = {
            virtualNetwork: this,
            remoteVirtualNetwork: remoteVirtualNetwork,
            localToRemoteSettings:localPeerSettings,
            remoteToLocalSettings: remotePeerSettings,
        };
        new Peer(this, remoteVirtualNetwork.id, vnetPeerProps);
    }

}