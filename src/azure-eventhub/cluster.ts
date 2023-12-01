import { EventhubCluster } from "@cdktf/provider-azurerm/lib/eventhub-cluster";
import { AzureResourceGroup } from "../azure-resourcegroup";
import { AzureResource } from "../core-azure";
import { Construct } from 'constructs';
import * as cdktf from 'cdktf';


export interface EventhubClusterProps {
  /**
   * The name of the Resource Group in which to create the EventHub Cluster.
   */
  readonly rg: AzureResourceGroup
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

export class AzureEventhubCluster extends AzureResource {
  readonly ehClusterProps: EventhubClusterProps;
  readonly rgName: string;
  readonly rgLocation: string;
  readonly id: string;

  constructor(scope: Construct, name: string, ehClusterProps: EventhubClusterProps) {
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
    // Outputs
    const cdktfTerraformOutputEventhubId = new cdktf.TerraformOutput(this, 'id', {
      value: ehCluster.id,
    });
    cdktfTerraformOutputEventhubId.overrideLogicalId('id');
  }
}