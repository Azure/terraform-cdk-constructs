import { NetworkInterface } from "@cdktf/provider-azurerm/lib/network-interface"; // Import the NetworkInterface class
import { NetworkInterfaceSecurityGroupAssociation } from "@cdktf/provider-azurerm/lib/network-interface-security-group-association";
import { NetworkSecurityGroup } from "@cdktf/provider-azurerm/lib/network-security-group";
import { NetworkSecurityRule } from "@cdktf/provider-azurerm/lib/network-security-rule";
import { Subnet } from "@cdktf/provider-azurerm/lib/subnet";
import { SubnetNetworkSecurityGroupAssociation } from "@cdktf/provider-azurerm/lib/subnet-network-security-group-association";
import { Construct } from "constructs";
import { AzureResource } from "../../core-azure/lib";

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

interface SecurityGroupProps {
  resourceGroupName: string;
  location: string;
  name: string;
  rules: RuleConfig[];
}

export class SecurityGroup extends AzureResource {
  readonly props: SecurityGroupProps;
  public readonly id: string;
  public readonly name: string;
  public readonly resourceGroupName: string;

  constructor(scope: Construct, id: string, props: SecurityGroupProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroupName = props.resourceGroupName;

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

interface SecurityGroupAssociationsProps {
  networkSecurityGroupId: string;
  subnetId?: string;
  networkInterfaceId?: string;
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
