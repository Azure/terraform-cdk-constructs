import * as cdktf from "cdktf";
import { Construct } from 'constructs';
import {ContainerRegistry} from "@cdktf/provider-azurerm/lib/container-registry";

// Construct
/**
 * Properties for the container registry
 */
//  export interface ContainerRegistryGeoreplications {
//   /**
//   * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/azurerm/r/container_registry#location ContainerRegistry#location}
//   */
//   readonly location: string;
//   /**
//   * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/azurerm/r/container_registry#regional_endpoint_enabled ContainerRegistry#regional_endpoint_enabled}
//   */
//   readonly regionalEndpointEnabled?: boolean | cdktf.IResolvable;
//   /**
//   * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/azurerm/r/container_registry#tags ContainerRegistry#tags}
//   */
//   readonly tags?: {
//       [key: string]: string;
//   };
//   /**
//   * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/azurerm/r/container_registry#zone_redundancy_enabled ContainerRegistry#zone_redundancy_enabled}
//   */
//   readonly zoneRedundancyEnabled?: boolean | cdktf.IResolvable;
// }


 export interface ContainerRegistryProps {
  /**
   * The Azure Region to deploy.
   */
  readonly location: string;
  /**
   * The name of the Log Analytics Workspace.
   */
  readonly name: string;
  /**
   * The name of the Azure Resource Group.
   */
   readonly resource_group_name: string;
  /**
  * The SKU of the Log Analytics Workspace.
  */
  readonly sku: string;
  /**
   * The tags to assign to the Resource Group.
   */
   readonly tags?: { [key: string]: string; };   
  /**
  * Create enable Admin user.
  */
  readonly admin_enabled: boolean;
  /**
  * Specify the locations to configure replication.
  */
   readonly georeplication_locations: any;


}

export class AzureContainerRegistry extends Construct {
  readonly props: ContainerRegistryProps;
  
  constructor(scope: Construct, id: string, props: ContainerRegistryProps) {
    super(scope, id);

    this.props = props;;

    const azurermContainerRegistry =
      new ContainerRegistry(this, "acr", {
        location: props.location,
        name: props.name,
        resourceGroupName: props.resource_group_name,
        sku: props.sku,
        tags: props.tags,
        adminEnabled: props.admin_enabled,
        georeplications: props.georeplication_locations,
    });

    
    // Terraform Outputs
    const cdktfTerraformOutputACRid = new cdktf.TerraformOutput(this, "id", {
      value: azurermContainerRegistry.id,
    });

    const cdktfTerraformOutputACRloginserver = new cdktf.TerraformOutput(this, "login_server", {
      value: azurermContainerRegistry.loginServer,
    });

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    cdktfTerraformOutputACRid.overrideLogicalId("id");
    cdktfTerraformOutputACRloginserver.overrideLogicalId("login_server");

  }
}
