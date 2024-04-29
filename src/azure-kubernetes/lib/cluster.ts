import {
  KubernetesCluster,
  KubernetesClusterDefaultNodePool,
  KubernetesClusterIdentity,
  KubernetesClusterAzureActiveDirectoryRoleBasedAccessControl,
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
   * Configures integration of Azure Active Directory (AAD) with Kubernetes Role-Based Access Control (RBAC) for the AKS cluster. This feature enables the use of AAD to manage user and group access permissions to the Kubernetes cluster resources, leveraging AAD's robust identity and access management capabilities.
   *
   * Utilizing AAD with Kubernetes RBAC provides:
   * - Enhanced security through AAD's identity protection features.
   * - Simplified user and group management by leveraging existing AAD definitions.
   * - Streamlined access control for Kubernetes resources, allowing for the definition of roles and role bindings based on AAD identities.
   *
   * This property is optional but highly recommended for clusters where security and access governance are a priority. It allows for finer-grained access control and integrates the cluster's authentication and authorization processes with corporate identity management systems.
   *
   * Example configuration might include specifying the AAD tenant details, enabling Azure RBAC for Kubernetes authorization, and optionally defining specific AAD groups for cluster admin roles.
   */
  readonly azureActiveDirectoryRoleBasedAccessControl?: KubernetesClusterAzureActiveDirectoryRoleBasedAccessControl;

  /**
   * A list of IP address ranges that are authorized to access the AKS API server. This enhances the security of your cluster by ensuring that only traffic from these IP ranges can communicate with the Kubernetes API server.
   *
   * Specifying this list helps to protect your cluster from unauthorized access attempts. It's a critical security measure for clusters that are exposed to the internet. If you specify an empty array, no IP addresses will be allowed to access the API server, effectively blocking all access. If this property is not defined, all IP addresses are allowed by default, which is not recommended for production environments.
   *
   * Example:
   * apiServerAuthorizedIpRanges: ['203.0.113.0/24', '198.51.100.0/24']
   *
   * It's important to configure this property carefully, based on your organization's network policies and access requirements.
   */
  readonly apiServerAuthorizedIpRanges?: string[];

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
   * Represents an Azure Kubernetes Service (AKS) cluster resource in Azure.
   *
   * This class is responsible for the creation and management of an AKS cluster, allowing for the deployment and orchestration
   * of containerized applications using Kubernetes within the Azure cloud platform.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the AKS cluster.
   * @param props - The properties required to configure the AKS cluster, as defined in the ClusterProps interface.
   *
   * Example usage:
   * ```typescript
   * new Cluster(this, 'MyAKSCluster', {
   *   name: 'example-cluster',
   *   location: 'East US',
   *   defaultNodePool: {
   *     vmSize: 'Standard_D2_v3',
   *     nodeCount: 3,
   *     type: 'VirtualMachineScaleSets'
   *   },
   *   resourceGroup: existingResourceGroup,
   *   tags: {
   *     environment: 'production'
   *   }
   * });
   * ```
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
      apiServerAuthorizedIpRanges: props.apiServerAuthorizedIpRanges,
      dnsPrefix: props.name,
      tags: props.tags,
      roleBasedAccessControlEnabled: true,
      azureActiveDirectoryRoleBasedAccessControl:
        props.azureActiveDirectoryRoleBasedAccessControl,
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
}
