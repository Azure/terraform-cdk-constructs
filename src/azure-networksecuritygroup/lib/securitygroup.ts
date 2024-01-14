import { NetworkInterface } from "@cdktf/provider-azurerm/lib/network-interface"; // Import the NetworkInterface class
import { NetworkInterfaceSecurityGroupAssociation } from "@cdktf/provider-azurerm/lib/network-interface-security-group-association";
import { NetworkSecurityGroup } from "@cdktf/provider-azurerm/lib/network-security-group";
import { NetworkSecurityRule } from "@cdktf/provider-azurerm/lib/network-security-rule";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Subnet } from "@cdktf/provider-azurerm/lib/subnet";
import { SubnetNetworkSecurityGroupAssociation } from "@cdktf/provider-azurerm/lib/subnet-network-security-group-association";
import { Construct } from "constructs";
import { AzureResource } from "../../core-azure/lib";

/**
 * Configuration properties for defining a rule within an Azure Network Security Group.
 */
export interface RuleConfig {
  /**
   * The name of the security rule.
   */
  readonly name: string;

  /**
   * The priority of the rule. Lower numbers have higher priority. Allowed values are from 100 to 4096.
   */
  readonly priority: number;

  /**
   * The direction of the rule, which can be 'Inbound' or 'Outbound'.
   */
  readonly direction: string;

  /**
   * The access type of the rule, which determines whether the rule permits or denies traffic. Common values are 'Allow' or 'Deny'.
   */
  readonly access: string;

  /**
   * The protocol to which the rule applies, such as 'Tcp', 'Udp', or '*' (for all protocols).
   */
  readonly protocol: string;

  /**
   * The range of source ports to which the rule applies. Can be a single port or a range like '1024-2048'.
   */
  readonly sourcePortRange: string;

  /**
   * The range of destination ports to which the rule applies. Can also be a single port or a range.
   */
  readonly destinationPortRange: string;

  /**
   * The CIDR or source IP range or '*' to match any IP. This is the range of source IPs for which the rule applies.
   */
  readonly sourceAddressPrefix: string;

  /**
   * The CIDR or destination IP range or '*' to match any IP. This specifies the range of destination IPs for which the rule is applicable.
   */
  readonly destinationAddressPrefix: string;
}

/**
 * Properties for defining an Azure Network Security Group.
 */
export interface SecurityGroupProps {
  /**
   * The name of the resource group under which the network security group will be created.
   */
  readonly resourceGroup: ResourceGroup;

  /**
   * The Azure region in which to create the network security group, e.g., 'East US', 'West Europe'.
   */
  readonly location: string;

  /**
   * The name of the network security group. Must be unique within the resource group.
   */
  readonly name: string;

  /**
   * An array of rule configurations to be applied to the network security group.
   */
  readonly rules: RuleConfig[];
}

export class SecurityGroup extends AzureResource {
  readonly props: SecurityGroupProps;
  public id: string;
  public readonly name: string;
  public resourceGroup: ResourceGroup;

  constructor(scope: Construct, id: string, props: SecurityGroupProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroup = props.resourceGroup;

    // Create a network security group
    const nsg = new NetworkSecurityGroup(this, "nsg", {
      name: props.name,
      resourceGroupName: props.resourceGroup.name,
      location: props.location,
    });

    // Create security rules within the network security group
    for (const ruleConfig of props.rules) {
      new NetworkSecurityRule(this, ruleConfig.name, {
        name: ruleConfig.name,
        resourceGroupName: props.resourceGroup.name,
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
    new SecurityGroupAssociations(this, subnet.name, {
      subnetId: subnet.id,
      networkSecurityGroupId: this.id,
    });
  }

  // Method to associate the network security group to a network interface
  public associateToNetworkInterface(networkInterface: NetworkInterface) {
    new SecurityGroupAssociations(this, networkInterface.name, {
      networkInterfaceId: networkInterface.id,
      networkSecurityGroupId: this.id,
    });
  }
}

/**
 * Properties for associating Azure Network Security Groups with subnets and network interfaces.
 */
export interface SecurityGroupAssociationsProps {
  /**
   * The ID of the network security group to be associated.
   */
  readonly networkSecurityGroupId: string;

  /**
   * Optional subnet ID to associate with the network security group.
   * If provided, the security group will be associated with this subnet.
   */
  readonly subnetId?: string;

  /**
   * Optional network interface ID to associate with the network security group.
   * If provided, the security group will be associated with this network interface.
   */
  readonly networkInterfaceId?: string;
}

export class SecurityGroupAssociations extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: SecurityGroupAssociationsProps,
  ) {
    super(scope, id);
    // If subnetId is provided, create a SubnetNetworkSecurityGroupAssociation
    if (props.subnetId) {
      new SubnetNetworkSecurityGroupAssociation(this, "subassociation", {
        subnetId: props.subnetId,
        networkSecurityGroupId: props.networkSecurityGroupId,
      });
    }

    // If networkInterfaceId is provided, create a NetworkInterfaceSecurityGroupAssociation
    if (props.networkInterfaceId) {
      new NetworkInterfaceSecurityGroupAssociation(this, "nicassociation", {
        networkInterfaceId: props.networkInterfaceId,
        networkSecurityGroupId: props.networkSecurityGroupId,
      });
    }
  }
}
