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
  public readonly resourceGroupName: string;
  readonly props: GroupProps;
  idOutput: cdktf.TerraformOutput;
  locationOutput: cdktf.TerraformOutput;
  nameOutput: cdktf.TerraformOutput;

  public readonly id: string;
  public readonly location: string;
  public readonly name: string;

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
    this.resourceGroupName = azurermResourceGroupRg.name;

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
