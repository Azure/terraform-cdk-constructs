import { Subnet } from "@cdktf/provider-azurerm/lib/subnet";
import { VirtualNetwork } from "@cdktf/provider-azurerm/lib/virtual-network";
import { Construct } from "constructs";
import { PeerProps, Peer, PeerSettings } from "./peering";
import { AzureResource } from "../../core-azure/lib";

/**
 * Configuration properties for defining a subnet within an Azure Virtual Network.
 */
export interface SubnetConfig {
  /**
   * The name of the subnet. This name must be unique within the context of the virtual network.
   */
  readonly name: string;

  /**
   * A list of address prefixes for the subnet. These are expressed in CIDR notation.
   * For example, '192.168.1.0/24' to define a subnet with a range of IP addresses.
   */
  readonly addressPrefixes: string[];
}

/**
 * Properties for defining an Azure Virtual Network.
 */
export interface NetworkProps {
  /**
   * The name of the resource group under which the virtual network will be created.
   */
  readonly resourceGroupName: string;

  /**
   * Optional: The name of the virtual network. Must be unique within the resource group.
   * If not provided, a default name will be assigned.
   */
  readonly name?: string;

  /**
   * Optional: The Azure region in which to create the virtual network, e.g., 'East US', 'West Europe'.
   * If not specified, the region of the resource group will be used.
   */
  readonly location?: string;

  /**
   * Optional: A list of address spaces for the virtual network, specified in CIDR notation.
   * For example, ['10.0.0.0/16'] defines a single address space. Multiple address spaces can be provided.
   */
  readonly addressSpace?: string[];

  /**
   * Optional: An array of subnet configurations to be created within the virtual network.
   * Each subnet is defined by its name and address prefix(es).
   */
  readonly subnets?: SubnetConfig[];
}

export class Network extends AzureResource {
  readonly props: NetworkProps;
  public readonly name: string;
  public resourceGroupName: string;
  public id: string;
  public readonly virtualNetwork: VirtualNetwork;
  public readonly subnets: { [name: string]: Subnet } = {}; // Map of subnet name to Subnet object

  constructor(scope: Construct, id: string, props: NetworkProps) {
    super(scope, id);

    this.props = props;

    const defaults = {
      name: props.name || `vnet-${this.node.path.split("/")[0]}`,
      location: props.location || "eastus",
      addressSpace: props.addressSpace || ["10.0.0.0/16"],
      subnets: props.subnets || [
        {
          name: "default",
          addressPrefixes: ["10.1.0.0/24"],
        },
      ],
    };

    // Create a virtual network
    const vnet = new VirtualNetwork(this, "vnet", {
      ...defaults,
      resourceGroupName: props.resourceGroupName,
    });

    this.name = vnet.name;
    this.id = vnet.id;
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
    }
  }

  // Create Vnet Peering Method
  public addVnetPeering(
    remoteVirtualNetwork: Network,
    localPeerSettings?: PeerSettings,
    remotePeerSettings?: PeerSettings,
  ) {
    const vnetPeerProps: PeerProps = {
      virtualNetwork: this,
      remoteVirtualNetwork: remoteVirtualNetwork,
      localToRemoteSettings: localPeerSettings,
      remoteToLocalSettings: remotePeerSettings,
    };
    new Peer(this, remoteVirtualNetwork.id, vnetPeerProps);
  }
}
