import { ContainerRegistry } from "@cdktf/provider-azurerm/lib/container-registry";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
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
   * An optional reference to the resource group in which to deploy the Container Registry.
   * If not provided, the Container Registry will be deployed in the default resource group.
   */
  readonly resourceGroup?: ResourceGroup;
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
  public resourceGroup: ResourceGroup;
  public id: string;

  /**
   * Constructs a new Azure Container Registry (ACR).
   *
   * This class creates an Azure Container Registry instance, which is a managed Docker registry service based on the Docker Registry 2.0 specification.
   * This service enables you to store and manage container images across all types of Azure deployments, you can also use it to build, store, and manage images for all types of container deployments.
   *
   * @param scope - The scope in which to define this construct, typically used for managing lifecycles and creation order.
   * @param id - The unique identifier for this construct instance.
   * @param props - The properties for configuring the Azure Container Registry. The properties include:
   *                - `location`: Required. The Azure region where the registry will be deployed.
   *                - `name`: Required. The name of the Container Registry.
   *                - `resourceGroup`: Optional. Reference to the resource group for deployment.
   *                - `sku`: Optional. The SKU of the Container Registry (e.g., Basic, Standard, Premium). Determines the features available.
   *                - `tags`: Optional. Tags for resource management.
   *                - `adminEnabled`: Optional. Specifies whether the admin user is enabled for the registry. Defaults to false if not set.
   *                - `geoReplicationLocations`: Optional. Specifies additional Azure regions where the registry should be geo-replicated.
   *
   * Example usage:
   * ```typescript
   * new Registry(this, 'myRegistry', {
   *   location: 'West US',
   *   name: 'myContainerRegistry',
   *   resourceGroup: resourceGroup,
   *   sku: 'Premium',
   *   adminEnabled: true,
   *   geoReplicationLocations: ['East US', 'West Europe']
   * });
   * ```
   */
  constructor(scope: Construct, id: string, props: RegistryProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroup = this.setupResourceGroup(props);

    // Provide default values
    const sku = props.sku ?? "Basic";
    const admin_enabled = props.adminEnabled ?? false;
    const georeplication_locations = props.geoReplicationLocations ?? [];

    const azurermContainerRegistry = new ContainerRegistry(this, "acr", {
      location: props.location,
      name: props.name,
      resourceGroupName: this.resourceGroup.name,
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
