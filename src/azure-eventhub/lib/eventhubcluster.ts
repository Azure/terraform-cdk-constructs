import { EventhubCluster } from "@cdktf/provider-azurerm/lib/eventhub-cluster";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { AzureResource } from "../../core-azure/lib";

export interface EventHubClusterProps {
  /**
   * An optional reference to the resource group in which to deploy the Event Hub Cluster.
   * If not provided, the Event Hub Cluster will be deployed in the default resource group.
   */
  readonly resourceGroup?: ResourceGroup;
  /**
   * The name of the EventHub Cluster.
   */
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
  readonly props: EventHubClusterProps;
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
   * @param props - The properties for configuring the Event Hub Cluster. These properties include:
   *                - `resourceGroup`: Optional. Reference to the resource group for deployment.
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
  constructor(scope: Construct, name: string, props: EventHubClusterProps) {
    super(scope, name);

    this.props = props;
    this.resourceGroup = this.setupResourceGroup(props);

    const defaults = {
      skuName: props.skuName || "Dedicated_1",
      tags: props.tags || {},
    };

    const ehCluster = new EventhubCluster(this, "ehcluster", {
      name: props.name,
      resourceGroupName: this.resourceGroup.name,
      location: this.resourceGroup.location,
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
