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
