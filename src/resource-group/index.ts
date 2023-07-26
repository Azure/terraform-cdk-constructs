import * as cdktf from "cdktf";
import { Construct } from 'constructs';
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {RoleAssignment} from "@cdktf/provider-azurerm/lib/role-assignment";
// Construct
/**
 * Properties for the resource group
 */
export interface ResourceGroupProps {
  /**
   * The Azure Region to deploy.
   */
  readonly location: string;
  /**
   * The name of the Azure Resource Group.
   */
  readonly name: string;
  /**
  * The RBAC groups to assign to the Resource Group.
  */
  readonly rbacGroups?: Map<string, string>;
  /**
   * The tags to assign to the Resource Group.
   */
  readonly tags?: { [key: string]: string; };    
}


export class AzureResourceGroup extends Construct {
  readonly props: ResourceGroupProps;
  IdOutput: cdktf.TerraformOutput
  LocationOutput: cdktf.TerraformOutput
  NameOutput: cdktf.TerraformOutput

  constructor(scope: Construct, id: string, props: ResourceGroupProps) {
    super(scope, id);

    this.props = props;;

    const azurermResourceGroupRg = new ResourceGroup(this, "rg", {
      location: props.location,
      name: props.name,
      tags: props.tags,
    });

    azurermResourceGroupRg.addOverride("lifecycle", [
      {
        ignore_changes: [
        ],
         
      },
    ]);
    
   
      props.rbacGroups?.forEach((v, k) => {
        new RoleAssignment(this, k, {
          principalId: k,
          roleDefinitionName: v,
          scope: azurermResourceGroupRg.id,
        });
      })
    

    // Terraform Outputs
    this.IdOutput = new cdktf.TerraformOutput(this, "id", {
      value: azurermResourceGroupRg.id,
    });
    this.LocationOutput = new cdktf.TerraformOutput(this,"location",{
        value: azurermResourceGroupRg.location,
      }
    );
    this.NameOutput = new cdktf.TerraformOutput(this,"name",{
      value: azurermResourceGroupRg.name,
    }
    );


      /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
      this.LocationOutput.overrideLogicalId("location");
      this.NameOutput.overrideLogicalId("name");
      this.IdOutput.overrideLogicalId("id")

  }
}