import { EventhubCluster } from "@cdktf/provider-azurerm/lib/eventhub-cluster";
import { Group } from "../../azure-resourcegroup";
import { AzureResource } from "../../core-azure/lib";
import { Construct } from 'constructs';
import * as cdktf from 'cdktf';


export interface ClusterProps {
  /**
   * The name of the Resource Group in which to create the EventHub Cluster.
   */
  readonly rg: Group
  readonly name: string;
  /**
   * The SKU name of the EventHub Cluster. The only supported value at this time is Dedicated_1.
   * @default "Dedicated_1"
   */
  readonly skuName?: string;
  /** 
   * The tags to assign to the Application Insights resource.
   */
  readonly tags?: { [key: string]: string; };
}

export class Cluster extends AzureResource {
  readonly ehClusterProps: ClusterProps;
  readonly rgName: string;
  readonly rgLocation: string;
  readonly id: string;
  readonly resourceGroupName: string;

  constructor(scope: Construct, name: string, ehClusterProps: ClusterProps) {
    super(scope, name);

    this.ehClusterProps = ehClusterProps;
    this.rgName = ehClusterProps.rg.Name;
    this.rgLocation = ehClusterProps.rg.Location;

    const defaults = {
      skuName: ehClusterProps.skuName || 'Dedicated_1',
      tags: ehClusterProps.tags || {},
    }

    const ehCluster = new EventhubCluster(this, `ehcluster`, {
      name: ehClusterProps.name,
      resourceGroupName: this.rgName,
      location: this.rgLocation,
      ...defaults,
    });

    this.id = ehCluster.id;
    this.resourceGroupName = ehCluster.resourceGroupName;

    // Outputs
    const cdktfTerraformOutputEventhubId = new cdktf.TerraformOutput(this, 'id', {
      value: ehCluster.id,
    });
    cdktfTerraformOutputEventhubId.overrideLogicalId('id');
  }
}