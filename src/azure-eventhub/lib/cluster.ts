import { EventhubCluster } from "@cdktf/provider-azurerm/lib/eventhub-cluster";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { AzureResource } from "../../core-azure/lib";

export interface ClusterProps {
  /**
   * The name of the Resource Group in which to create the EventHub Cluster.
   */
  readonly resourceGroup: ResourceGroup;
  readonly name: string;
  /**
   * The SKU name of the EventHub Cluster. The only supported value at this time is Dedicated_1.
   * @default "Dedicated_1"
   */
  readonly skuName?: string;
  /**
   * The tags to assign to the Application Insights resource.
   */
  readonly tags?: { [key: string]: string };
}

export class Cluster extends AzureResource {
  readonly ehClusterProps: ClusterProps;
  public id: string;
  public resourceGroup: ResourceGroup;

  constructor(scope: Construct, name: string, ehClusterProps: ClusterProps) {
    super(scope, name);

    this.ehClusterProps = ehClusterProps;
    this.resourceGroup = ehClusterProps.resourceGroup;

    const defaults = {
      skuName: ehClusterProps.skuName || "Dedicated_1",
      tags: ehClusterProps.tags || {},
    };

    const ehCluster = new EventhubCluster(this, "ehcluster", {
      name: ehClusterProps.name,
      resourceGroupName: ehClusterProps.resourceGroup.name,
      location: ehClusterProps.resourceGroup.location,
      ...defaults,
    });

    this.id = ehCluster.id;

    // Outputs
    const cdktfTerraformOutputEventhubId = new cdktf.TerraformOutput(
      this,
      "id",
      {
        value: ehCluster.id,
      },
    );
    cdktfTerraformOutputEventhubId.overrideLogicalId("id");
  }
}
