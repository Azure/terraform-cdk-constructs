import {
  KubernetesCluster,
  KubernetesClusterDefaultNodePool,
  KubernetesClusterIdentity,
} from "@cdktf/provider-azurerm/lib/kubernetes-cluster";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Construct } from "constructs";
import { AzureResource } from "../../core-azure/lib";

/**
 * Interface defining the properties required to create an AKS cluster.
 */
export interface ClusterProps {
  /** The name of the AKS cluster. Must be unique within the Azure region. */
  readonly name: string;

  /** The Azure region where the AKS cluster will be deployed. */
  readonly location: string;

  /** Configuration for the default node pool of the AKS cluster. */
  readonly defaultNodePool: KubernetesClusterDefaultNodePool;

  /**
   * The Azure Resource Group where the AKS cluster will be deployed.
   * Optional. If not provided, a new resource group will be created.
   */
  readonly resourceGroup?: ResourceGroup;

  /**
   * The identity used for the AKS cluster. Can be either SystemAssigned or UserAssigned.
   * Optional.
   */
  readonly identity?: KubernetesClusterIdentity;

  /**
   * Tags to be applied to the AKS cluster resources for organizational purposes.
   * Key-value pairs. Optional.
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Class representing the AKS cluster resource.
 */
export class Cluster extends AzureResource {
  /** The unique identifier of the AKS cluster resource. */
  public id: string;

  /** The Resource Group associated with the AKS cluster. */
  public resourceGroup: ResourceGroup;

  /**
   * Constructs a new AKS cluster.
   * @param scope The scope in which to define this construct.
   * @param id The unique ID or name for this construct.
   * @param props The properties required to configure the AKS cluster.
   */
  constructor(scope: Construct, id: string, props: ClusterProps) {
    super(scope, id);

    // Setup or reuse the provided resource group.
    this.resourceGroup = this.setupResourceGroup(props);

    // Create the AKS Cluster with the provided properties.
    const aks = new KubernetesCluster(this, "AKS", {
      name: props.name,
      location: props.location,
      resourceGroupName: this.resourceGroup.name,
      defaultNodePool: props.defaultNodePool,
      dnsPrefix: props.name,
      tags: props.tags,
      identity: props.identity,
    });

    // Assign the AKS cluster ID for external reference.
    this.id = aks.id;
  }

  /**
   * Sets up the Azure Resource Group for the AKS cluster.
   * If a resource group is not provided in the properties, a new one is created.
   * @param props The properties provided to configure the AKS cluster.
   * @returns The Resource Group where the AKS cluster will be deployed.
   */
  private setupResourceGroup(props: ClusterProps): ResourceGroup {
    if (!props.resourceGroup) {
      // Create a new resource group if not provided
      const newResourceGroup = new ResourceGroup(this, "rg", {
        name: `rg-${props.name}`,
        location: props.location,
        tags: props.tags,
      });
      return newResourceGroup;
    } else {
      // Use the provided resource group
      return props.resourceGroup;
    }
  }
}
