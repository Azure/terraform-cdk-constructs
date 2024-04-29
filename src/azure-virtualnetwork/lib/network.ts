import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
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
  readonly resourceGroup: ResourceGroup;

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
  public resourceGroup: ResourceGroup;
  public id: string;
  public readonly virtualNetwork: VirtualNetwork;
  public readonly subnets: { [name: string]: Subnet } = {}; // Map of subnet name to Subnet object
  /**
   * Represents an Azure Virtual Network (VNet) within Microsoft Azure.
   *
   * This class is responsible for the creation and management of a virtual network, which provides an isolated environment
   * where Azure resources, such as VMs and databases, can securely communicate with each other, the internet, and on-premises
   * networks. It supports configurations such as multiple address spaces and subnets, enabling complex networking scenarios.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) application.
   * @param id - The unique identifier for this instance of the network, used within the scope for reference.
   * @param props - Configuration properties for the Azure Virtual Network, derived from the NetworkProps interface. These include:
   *                - `resourceGroup`: The ResourceGroup within which the virtual network will be created.
   *                - `name`: Optional. The name of the virtual network. If not provided, a default name will be assigned.
   *                - `location`: Optional. The Azure region where the virtual network will be deployed. Defaults to the resource group's region.
   *                - `addressSpace`: Optional. A list of CIDR blocks that define the address spaces of the virtual network.
   *                - `subnets`: Optional. An array of subnets to be created within the virtual network, each defined by a name and a CIDR block.
   *
   * Example usage:
   * ```typescript
   * const network = new Network(this, 'MyVirtualNetwork', {
   *   resourceGroup: myResourceGroup,
   *   name: 'myVNet',
   *   location: 'West US',
   *   addressSpace: ['10.0.0.0/16'],
   *   subnets: [{ name: 'subnet1', addressPrefixes: ['10.0.1.0/24'] }]
   * });
   * ```
   * This class initializes a virtual network with the specified configurations and handles the provisioning of subnets
   * within the network, providing a foundational networking layer for hosting cloud resources.
   */
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
      resourceGroupName: props.resourceGroup.name,
    });

    this.name = vnet.name;
    this.id = vnet.id;
    this.resourceGroup = props.resourceGroup;
    this.virtualNetwork = vnet;

    // Create subnets within the virtual network
    for (const subnetConfig of defaults.subnets) {
      const subnet = new Subnet(this, subnetConfig.name, {
        name: subnetConfig.name,
        resourceGroupName: props.resourceGroup.name,
        virtualNetworkName: vnet.name,
        addressPrefixes: subnetConfig.addressPrefixes,
      });

      this.subnets[subnetConfig.name] = subnet; // Populate the subnetsMap
    }
  }

  /**
   * Establishes a peering connection between this virtual network and another remote virtual network.
   *
   * This method configures a two-way peering connection, allowing resources in both virtual networks to communicate
   * seamlessly. It sets up peering settings such as network access, traffic forwarding, and gateway transit based on
   * provided configurations.
   *
   * @param remoteVirtualNetwork - The remote virtual network with which to establish a peering connection.
   * @param localPeerSettings - Optional settings applied from this virtual network to the remote virtual network.
   *                             Controls aspects like virtual network access, traffic forwarding, and use of gateways.
   * @param remotePeerSettings - Optional settings applied from the remote virtual network to this virtual network.
   *                             Allows customization of how the remote network interacts with this one.
   *
   * Example usage:
   * ```typescript
   * // Assuming 'this' is a reference to a local virtual network instance.
   * const partnerVNet = new Network(this, 'PartnerVNet', { ... });
   * this.addVnetPeering(partnerVNet, {
   *   allowVirtualNetworkAccess: true,
   *   allowForwardedTraffic: false,
   *   allowGatewayTransit: true,
   *   useRemoteGateways: false
   * }, {
   *   allowVirtualNetworkAccess: true,
   *   allowForwardedTraffic: true,
   *   allowGatewayTransit: false,
   *   useRemoteGateways: false
   * });
   * ```
   * This method invokes the `Peer` class to create a peering between 'this' virtual network and 'partnerVNet'.
   * The settings control traffic behavior and access permissions in both directions of the peering.
   */
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
