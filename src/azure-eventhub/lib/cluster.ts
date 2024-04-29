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

  /**
   * Constructs a new Event Hub Cluster.
   *
   * This class creates an Azure Event Hub Cluster which is a dedicated capacity resource for handling
   * high-throughput, low-latency event ingestion and streaming. It is used in scenarios where you need
   * predictable performance and cost regardless of the volume of data ingress or number of downstream
   * event consumers.
   *
   * @param scope - The scope in which to define this construct, usually representing the Cloud Development Kit (CDK) stack.
   * @param name - The unique name for this instance of the Event Hub Cluster.
   * @param ehClusterProps - The properties for configuring the Event Hub Cluster. These properties include:
   *                - `resourceGroup`: Required. The Azure Resource Group in which the cluster will be deployed.
   *                - `name`: Required. The name of the Event Hub Cluster.
   *                - `skuName`: Optional. The SKU name for the cluster, which determines the pricing and capabilities.
   *                             Currently, the only supported value is "Dedicated_1". Defaults to "Dedicated_1" if not specified.
   *                - `tags`: Optional. Tags for resource management and categorization.
   *
   * Example usage:
   * ```typescript
   * const eventHubCluster = new Cluster(this, 'myEventHubCluster', {
   *   resourceGroup: resourceGroup,
   *   name: 'myCluster',
   *   skuName: 'Dedicated_1', // This is optional since it defaults to 'Dedicated_1'
   *   tags: {
   *     department: 'IT'
   *   }
   * });
   * ```
   */
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
