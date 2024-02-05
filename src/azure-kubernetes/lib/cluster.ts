import {
  KubernetesCluster,
  KubernetesClusterDefaultNodePool,
  KubernetesClusterIdentity,
} from "@cdktf/provider-azurerm/lib/kubernetes-cluster";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Construct } from "constructs";
import { AzureResource } from "../../core-azure/lib";

export interface ClusterProps {
  readonly name: string;

  readonly location: string;

  readonly defaultNodePool: KubernetesClusterDefaultNodePool;

  readonly resourceGroup?: ResourceGroup;
  readonly identity?: KubernetesClusterIdentity;
  readonly tags?: { [key: string]: string };
}

export class Cluster extends AzureResource {
  public id: string;
  public resourceGroup: ResourceGroup;

  constructor(scope: Construct, id: string, props: ClusterProps) {
    super(scope, id);

    this.resourceGroup = this.setupResourceGroup(props);

    this.resourceGroup = this.resourceGroup;

    // Create the AKS Cluster
    const aks = new KubernetesCluster(this, "AKS", {
      name: props.name,
      location: props.location,
      resourceGroupName: this.resourceGroup.name,
      defaultNodePool: props.defaultNodePool,
      dnsPrefix: props.name,
      tags: props.tags,
      identity: props.identity,
    });

    this.id = aks.id;
  }

  private setupResourceGroup(props: ClusterProps): ResourceGroup {
    if (!props.resourceGroup) {
      // Create a new resource group
      const newResourceGroup = new ResourceGroup(this, "rg", {
        name: `rg-${props.name}`,
        location: props.location,
        tags: props.tags,
      });
      // Use the name of the new resource group
      return newResourceGroup;
    } else {
      // Use the provided resource group name
      return props.resourceGroup;
    }
  }
}
