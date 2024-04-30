import { VirtualNetworkPeering } from "@cdktf/provider-azurerm/lib/virtual-network-peering";
import { Construct } from "constructs";
import { Network } from "./network";

/**
 * Interface defining the settings for peer connections.
 */
export interface PeerSettings {
  /**
   * Indicates whether virtual network access is allowed.
   * @default true
   */
  readonly allowVirtualNetworkAccess?: boolean;

  /**
   * Indicates whether forwarded traffic is allowed.
   * @default false
   */
  readonly allowForwardedTraffic?: boolean;

  /**
   * Indicates whether gateway transit is allowed.
   * @default false
   */
  readonly allowGatewayTransit?: boolean;

  /**
   * Indicates whether to use remote gateways.
   * @default false
   */
  readonly useRemoteGateways?: boolean;
}

/**
 * Interface defining the properties for virtual network peerings.
 */
export interface PeerProps {
  /**
   * ID of the local virtual network.
   */
  readonly virtualNetwork: Network;

  /**
   * ID of the remote virtual network.
   */
  readonly remoteVirtualNetwork: Network;

  /**
   * Settings applied from the local virtual network to the remote virtual network.
   */
  readonly localToRemoteSettings: PeerSettings | undefined;

  /**
   * Settings applied from the remote virtual network to the local virtual network.
   */
  readonly remoteToLocalSettings: PeerSettings | undefined;
}

export class Peer extends Construct {
  /**
   * Represents a Virtual Network Peering within Microsoft Azure.
   *
   * This class facilitates the peering between two virtual networks, allowing resources in either network to communicate
   * with each other as if they were within the same network. It supports advanced configurations such as traffic forwarding,
   * gateway transit, and access settings. This peering does not require a VPN gateway and offers low-latency, high-bandwidth
   * connections between resources in different virtual networks.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) application.
   * @param name - The unique name for this instance of the network peering.
   * @param props - Configuration properties for the network peering, derived from the PeerProps interface. These include:
   *                - `virtualNetwork`: The local virtual network object.
   *                - `remoteVirtualNetwork`: The remote virtual network object.
   *                - `localToRemoteSettings`: Configuration settings applied from the local virtual network to the remote virtual network.
   *                - `remoteToLocalSettings`: Configuration settings applied from the remote virtual network to the local virtual network.
   *
   * Example usage:
   * ```typescript
   * const vnetPeering = new Peer(this, 'VNetPeering', {
   *   virtualNetwork: myVNet,
   *   remoteVirtualNetwork: partnerVNet,
   *   localToRemoteSettings: {
   *     allowVirtualNetworkAccess: true,
   *     allowForwardedTraffic: false,
   *     allowGatewayTransit: false,
   *     useRemoteGateways: false
   *   },
   *   remoteToLocalSettings: {
   *     allowVirtualNetworkAccess: true,
   *     allowForwardedTraffic: true,
   *     allowGatewayTransit: false,
   *     useRemoteGateways: false
   *   }
   * });
   * ```
   * This class initializes a VNet peering with the specified configurations, enabling direct connectivity between
   * the specified virtual networks. It manages the creation and configuration of network peering settings, ensuring
   * that both VNets are appropriately linked and configured according to the defined properties.
   */
  constructor(scope: Construct, name: string, props: PeerProps) {
    super(scope, name);

    const localtoRemotePeerName =
      props.virtualNetwork.name + "to" + props.remoteVirtualNetwork.name;

    new VirtualNetworkPeering(this, "VNetPeerLocaltoRemote", {
      name: localtoRemotePeerName,
      resourceGroupName: props.virtualNetwork.resourceGroup.name,
      virtualNetworkName: props.virtualNetwork.name,
      remoteVirtualNetworkId: props.remoteVirtualNetwork.id,
      ...props.localToRemoteSettings,
    });

    const remoteToLocalPeerName =
      props.remoteVirtualNetwork.name + "to" + props.virtualNetwork.name;

    new VirtualNetworkPeering(this, "VNetPeerRemotetoLocal", {
      name: remoteToLocalPeerName,
      resourceGroupName: props.remoteVirtualNetwork.resourceGroup.name,
      virtualNetworkName: props.remoteVirtualNetwork.name,
      remoteVirtualNetworkId: props.virtualNetwork.id,
      ...props.remoteToLocalSettings,
    });
  }
}
