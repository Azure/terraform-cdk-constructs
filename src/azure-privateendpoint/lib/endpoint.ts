import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { PrivateEndpoint, PrivateEndpointConfig } from "@cdktf/provider-azurerm/lib/private-endpoint";
import { Construct } from "constructs";
import { AzureResource } from "../../core-azure";

export class AzurePrivateEndpoint extends AzureResource {
  readonly props: any;
  public resourceGroupName: string;
  public resourceGroup: ResourceGroup;
  public readonly endpoint: PrivateEndpoint;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);

    this.resourceGroup = this.setupResourceGroup(props);
    this.resourceGroupName = this.resourceGroup.name;

    var config : PrivateEndpointConfig = {
      ...props,
      resourceGroupName: this.resourceGroupName,
    }

    this.endpoint = new PrivateEndpoint(scope, id + "endpoint", config)
  }
  
}
