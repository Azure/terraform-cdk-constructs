import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { AzureResource } from "../../core-azure/lib";

// Construct
/**
 * Properties for the resource group
 */
export interface GroupProps {
  /**
   * The Azure Region to deploy.
   */
  readonly location?: string;
  /**
   * The name of the Azure Resource Group.
   */
  readonly name?: string;

  /**
   * The tags to assign to the Resource Group.
   */
  readonly tags?: { [key: string]: string };
  /**
   * The lifecycle rules to ignore changes.
   */
  readonly ignoreChanges?: string[];
}

export class Group extends AzureResource {
  public resourceGroup: ResourceGroup;
  readonly props: GroupProps;
  idOutput: cdktf.TerraformOutput;
  locationOutput: cdktf.TerraformOutput;
  nameOutput: cdktf.TerraformOutput;

  public id: string;
  public readonly location: string;
  public readonly name: string;

  /**
   * Represents an Azure Resource Group.
   *
   * This class is responsible for the creation and management of an Azure Resource Group, which is a container that holds
   * related resources for an Azure solution. A resource group includes those resources that you want to manage as a group.
   * You decide how to allocate resources to resource groups based on what makes the most sense for your organization.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the Resource Group.
   * @param props - Optional properties for configuring the Resource Group. These can include:
   *                - `location`: The Azure region where the Resource Group will be created.
   *                - `name`: The name of the Resource Group, which must be unique within your Azure subscription.
   *                - `tags`: A dictionary of tags to apply to the Resource Group for organizational, billing, or other purposes.
   *                - `ignoreChanges`: A list of properties which should be ignored if changes are made after initial deployment,
   *                  useful in certain scenarios where properties are externally managed or should not trigger updates.
   *
   * Example usage:
   * ```typescript
   * new Group(this, 'MyResourceGroup', {
   *   location: 'East US',
   *   name: 'ApplicationResources',
   *   tags: {
   *     environment: 'production'
   *   }
   * });
   * ```
   * This class sets up the resource group and applies any specified configurations, making it ready to hold other Azure resources.
   */
  constructor(scope: Construct, id: string, props: GroupProps = {}) {
    super(scope, id);

    this.props = props;

    const defaults = {
      name: props.name || `rg-${this.node.path.split("/")[0]}`,
      location: props.location || "eastus",
    };

    const azurermResourceGroupRg = new ResourceGroup(this, "rg", {
      ...defaults,
      tags: props.tags,
    });

    azurermResourceGroupRg.addOverride("lifecycle", [
      {
        ignore_changes: props.ignoreChanges || [],
      },
    ]);

    this.id = azurermResourceGroupRg.id;
    this.name = azurermResourceGroupRg.name;
    this.location = azurermResourceGroupRg.location;
    this.resourceGroup = azurermResourceGroupRg;

    // Terraform Outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: azurermResourceGroupRg.id,
    });
    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: azurermResourceGroupRg.location,
    });
    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: azurermResourceGroupRg.name,
    });

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.idOutput.overrideLogicalId("id");
  }
}
