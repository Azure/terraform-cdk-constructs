import { ContainerRegistry } from "@cdktf/provider-azurerm/lib/container-registry";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { AzureResource } from "../../core-azure/lib";

export interface RegistryProps {
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
  readonly resourceGroupName: string;
  /**
   * The SKU of the Log Analytics Workspace.
   */
  readonly sku?: string;
  /**
   * The tags to assign to the Resource Group.
   */
  readonly tags?: { [key: string]: string };
  /**
   * Create enable Admin user.
   */
  readonly adminEnabled?: boolean;
  /**
   * Specify the locations to configure replication.
   */
  readonly geoReplicationLocations?: any;
}

export class Registry extends AzureResource {
  public readonly props: RegistryProps;
  public resourceGroupName: string;
  public id: string;

  constructor(scope: Construct, id: string, props: RegistryProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroupName = props.resourceGroupName;

    // Provide default values
    const sku = props.sku ?? "Basic";
    const admin_enabled = props.adminEnabled ?? false;
    const georeplication_locations = props.geoReplicationLocations ?? [];

    const azurermContainerRegistry = new ContainerRegistry(this, "acr", {
      location: props.location,
      name: props.name,
      resourceGroupName: props.resourceGroupName,
      sku: sku,
      tags: props.tags,
      adminEnabled: admin_enabled,
      georeplications: georeplication_locations,
    });

    this.id = azurermContainerRegistry.id;

    // Terraform Outputs
    const cdktfTerraformOutputACRid = new cdktf.TerraformOutput(this, "id", {
      value: azurermContainerRegistry.id,
    });

    const cdktfTerraformOutputACRName = new cdktf.TerraformOutput(
      this,
      "container_registry_name",
      {
        value: azurermContainerRegistry.name,
      },
    );

    const cdktfTerraformOutputACRloginserver = new cdktf.TerraformOutput(
      this,
      "login_server",
      {
        value: azurermContainerRegistry.loginServer,
      },
    );

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    cdktfTerraformOutputACRid.overrideLogicalId("id");
    cdktfTerraformOutputACRName.overrideLogicalId("container_registry_name");
    cdktfTerraformOutputACRloginserver.overrideLogicalId("login_server");
  }
}
