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

  /**
   * Represents an Azure Network Security Group (NSG).
   *
   * This class is responsible for the creation and management of an Azure Network Security Group, which acts as a virtual firewall
   * for virtual network resources. A Network Security Group contains a list of security rules that allow or deny network traffic
   * to resources connected to Azure Virtual Networks (VNet). Each rule specifies a combination of source and destination, port,
   * and protocol, and an action (allow or deny) based on those combinations. This class allows for detailed configuration of these
   * rules to enforce security policies for inbound and outbound network traffic.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the security group.
   * @param props - The properties required to configure the Network Security Group, as defined in the SecurityGroupProps interface. These include:
   *                - `resourceGroup`: The Azure Resource Group under which the NSG will be deployed.
   *                - `location`: The Azure region where the NSG will be created.
   *                - `name`: The name of the NSG, which must be unique within the resource group.
   *                - `rules`: A list of rules that define the security policies for traffic control.
   *
   * Example usage:
   * ```typescript
   * new SecurityGroup(this, 'MySecurityGroup', {
   *   resourceGroup: myResourceGroup,
   *   location: 'East US',
   *   name: 'myNsg',
   *   rules: [{
   *     name: 'AllowSSH',
   *     priority: 100,
   *     direction: 'Inbound',
   *     access: 'Allow',
   *     protocol: 'Tcp',
   *     sourcePortRange: '*',
   *     destinationPortRange: '22',
   *     sourceAddressPrefix: '*',
   *     destinationAddressPrefix: '*'
   *   }]
   * });
   * ```
   * This class initializes a Network Security Group with specified rules, handling network security management tasks efficiently.
   */
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

  /**
   * Associates this Network Security Group with a specified subnet.
   *
   * This method facilitates the attachment of the security group to a subnet, applying the security group's rules to all
   * resources within the subnet. This is crucial for managing network access and security policies at the subnet level.
   *
   * @param subnet - The subnet object to which this network security group will be associated.
   *
   * Example usage:
   * ```typescript
   * const mySubnet = { id: 'subnet-123', name: 'SubnetA' };
   * mySecurityGroup.associateToSubnet(mySubnet);
   * ```
   * This operation ensures that the security rules defined in the network security group are enforced on all network interfaces
   * attached to the specified subnet.
   */
  public associateToSubnet(subnet: Subnet) {
    new SecurityGroupAssociations(this, subnet.name, {
      subnetId: subnet.id,
      networkSecurityGroupId: this.id,
    });
  }

  /**
   * Associates this Network Security Group with a specified network interface.
   *
   * This method attaches the security group to a network interface, applying the security group's rules to the network interface.
   * This allows for fine-grained control of network traffic to and from the specific network interface.
   *
   * @param networkInterface - The network interface object to which this network security group will be associated.
   *
   * Example usage:
   * ```typescript
   * const myNetworkInterface = { id: 'nic-456', name: 'NetworkInterfaceA' };
   * mySecurityGroup.associateToNetworkInterface(myNetworkInterface);
   * ```
   * This operation ensures that the security rules defined in the network security group are applied directly to the specified
   * network interface, controlling access in a more targeted manner.
   */
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
  /**
   * Manages the associations of Azure Network Security Groups with subnets and network interfaces.
   *
   * This class provides the functionality to associate a network security group with either subnets or network interfaces
   * within the Azure environment. By managing these associations, it helps enforce security rules at both the subnet level
   * and the network interface level, enhancing security configurations and compliance.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for the association instance.
   * @param props - The properties for the association. Includes the network security group ID and optionally a subnet ID or network interface ID.
   *
   * Example usage:
   * ```typescript
   * new SecurityGroupAssociations(this, 'MyAssociations', {
   *   networkSecurityGroupId: 'nsg-123',
   *   subnetId: 'subnet-123',
   *   networkInterfaceId: 'nic-456',
   * });
   * ```
   * Depending on the properties provided, this class will create the appropriate associations to apply the network security group
   * to the specified subnet or network interface.
   */
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
