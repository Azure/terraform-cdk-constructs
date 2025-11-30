/**
 * Unified Azure Kubernetes Service (AKS) implementation using VersionedAzapiResource framework
 *
 * This class provides a single, version-aware implementation for AKS clusters that automatically
 * handles version management, schema validation, and property transformation across all supported
 * API versions.
 *
 * Supported API Versions:
 * - 2024-10-01 (Active)
 * - 2025-01-01 (Active)
 * - 2025-07-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full JSII compliance for multi-language support
 * - Comprehensive support for AKS features (networking, security, scaling, etc.)
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_AKS_CLUSTER_VERSIONS,
  AKS_CLUSTER_TYPE,
  AksClusterSku,
  AksClusterIdentity,
  AksClusterAgentPoolProfile,
  AksClusterNetworkProfile,
  AksClusterServicePrincipalProfile,
  AksClusterApiServerAccessProfile,
  AksClusterAutoScalerProfile,
  AksClusterWindowsProfile,
  AksClusterLinuxProfile,
  AksClusterAadProfile,
  AksClusterAddonProfiles,
  AksClusterOidcIssuerProfile,
  AksClusterSecurityProfile,
  AksClusterStorageProfile,
  AksClusterHttpProxyConfig,
  AksClusterWorkloadAutoScalerProfile,
  AksClusterMonitoringOptions,
} from "./aks-cluster-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
  MonitoringConfig,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ResourceAction } from "../../core-azure/lib/azapi/providers-azapi/resource-action";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the unified Azure Kubernetes Service cluster
 *
 * Extends AzapiResourceProps with AKS-specific properties
 */
export interface AksClusterProps extends AzapiResourceProps {
  /**
   * The SKU (pricing tier) for the AKS cluster
   * @example { name: "Base", tier: "Free" }
   * @example { name: "Standard", tier: "Standard" }
   */
  readonly sku?: AksClusterSku;

  /**
   * The identity configuration for the AKS cluster
   * @example { type: "SystemAssigned" }
   * @example { type: "UserAssigned", userAssignedIdentities: { "/subscriptions/.../resourceGroups/.../providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity": {} } }
   */
  readonly identity?: AksClusterIdentity;

  /**
   * The Kubernetes version for the cluster
   * @example "1.28.3"
   * @example "1.29.0"
   */
  readonly kubernetesVersion?: string;

  /**
   * DNS prefix for the cluster
   * @example "myakscluster"
   */
  readonly dnsPrefix: string;

  /**
   * The FQDN for the cluster (read-only)
   */
  readonly fqdn?: string;

  /**
   * The private FQDN for the cluster (read-only)
   */
  readonly privateFQDN?: string;

  /**
   * The agent pool profiles for the cluster node pools
   * At least one agent pool is required
   * @example [{ name: "default", count: 3, vmSize: "Standard_D2s_v3", mode: "System" }]
   */
  readonly agentPoolProfiles: AksClusterAgentPoolProfile[];

  /**
   * The service principal profile for the cluster
   */
  readonly servicePrincipalProfile?: AksClusterServicePrincipalProfile;

  /**
   * The network configuration for the cluster
   */
  readonly networkProfile?: AksClusterNetworkProfile;

  /**
   * The Azure Active Directory integration configuration
   */
  readonly aadProfile?: AksClusterAadProfile;

  /**
   * The auto-scaler configuration for the cluster
   */
  readonly autoScalerProfile?: AksClusterAutoScalerProfile;

  /**
   * The API server access configuration
   */
  readonly apiServerAccessProfile?: AksClusterApiServerAccessProfile;

  /**
   * The resource ID of the disk encryption set for encrypting disks
   */
  readonly diskEncryptionSetID?: string;

  /**
   * Whether to enable Kubernetes Role-Based Access Control
   * @default true
   */
  readonly enableRBAC?: boolean;

  /**
   * The name of the resource group for cluster nodes
   * If not specified, Azure will auto-generate the name
   */
  readonly nodeResourceGroup?: string;

  /**
   * The addon profiles for cluster addons
   */
  readonly addonProfiles?: AksClusterAddonProfiles;

  /**
   * The Linux profile for SSH access
   */
  readonly linuxProfile?: AksClusterLinuxProfile;

  /**
   * The Windows profile for Windows node pools
   */
  readonly windowsProfile?: AksClusterWindowsProfile;

  /**
   * The OIDC issuer profile for workload identity
   */
  readonly oidcIssuerProfile?: AksClusterOidcIssuerProfile;

  /**
   * The security profile for the cluster
   */
  readonly securityProfile?: AksClusterSecurityProfile;

  /**
   * The storage profile for CSI drivers
   */
  readonly storageProfile?: AksClusterStorageProfile;

  /**
   * The HTTP proxy configuration
   */
  readonly httpProxyConfig?: AksClusterHttpProxyConfig;

  /**
   * The workload auto-scaler profile
   */
  readonly workloadAutoScalerProfile?: AksClusterWorkloadAutoScalerProfile;

  /**
   * Whether to disable local accounts
   * @default false
   */
  readonly disableLocalAccounts?: boolean;

  /**
   * Whether the cluster is accessible from the public internet
   * @example "Enabled"
   * @example "Disabled"
   */
  readonly publicNetworkAccess?: string;

  /**
   * The support plan for the cluster
   * @example "KubernetesOfficial"
   * @example "AKSLongTermSupport"
   */
  readonly supportPlan?: string;

  /**
   * The lifecycle rules to ignore changes
   * Useful for properties that are externally managed or should not trigger updates
   * @example ["kubernetesVersion", "agentPoolProfiles"]
   */
  readonly ignoreChanges?: string[];

  /**
   * Resource group ID where the AKS cluster will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * The resource body interface for Azure AKS API calls
 */
export interface AksClusterBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly sku?: AksClusterSku;
  readonly identity?: AksClusterIdentity;
  readonly properties: AksClusterBodyProperties;
}

/**
 * AKS Cluster properties for the request body
 */
export interface AksClusterBodyProperties {
  readonly kubernetesVersion?: string;
  readonly dnsPrefix: string;
  readonly fqdn?: string;
  readonly privateFQDN?: string;
  readonly agentPoolProfiles: AksClusterAgentPoolProfile[];
  readonly servicePrincipalProfile?: AksClusterServicePrincipalProfile;
  readonly networkProfile?: AksClusterNetworkProfile;
  readonly aadProfile?: AksClusterAadProfile;
  readonly autoScalerProfile?: AksClusterAutoScalerProfile;
  readonly apiServerAccessProfile?: AksClusterApiServerAccessProfile;
  readonly diskEncryptionSetID?: string;
  readonly enableRBAC?: boolean;
  readonly nodeResourceGroup?: string;
  readonly addonProfiles?: AksClusterAddonProfiles;
  readonly linuxProfile?: AksClusterLinuxProfile;
  readonly windowsProfile?: AksClusterWindowsProfile;
  readonly oidcIssuerProfile?: AksClusterOidcIssuerProfile;
  readonly securityProfile?: AksClusterSecurityProfile;
  readonly storageProfile?: AksClusterStorageProfile;
  readonly httpProxyConfig?: AksClusterHttpProxyConfig;
  readonly workloadAutoScalerProfile?: AksClusterWorkloadAutoScalerProfile;
  readonly disableLocalAccounts?: boolean;
  readonly publicNetworkAccess?: string;
  readonly supportPlan?: string;
}

/**
 * Unified Azure Kubernetes Service cluster implementation
 *
 * This class provides a single, version-aware implementation that automatically handles version
 * resolution, schema validation, and property transformation while maintaining full JSII compliance.
 *
 * The class uses the VersionedAzapiResource framework to provide:
 * - Automatic latest version resolution (2025-07-01 as of this implementation)
 * - Support for explicit version pinning when stability is required
 * - Schema-driven property validation and transformation
 * - Migration analysis and deprecation warnings
 * - Full JSII compliance for multi-language support
 *
 * @example
 * // Basic AKS cluster with system node pool:
 * const aksCluster = new AksCluster(this, "aks", {
 *   name: "my-aks-cluster",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   dnsPrefix: "myaks",
 *   agentPoolProfiles: [{
 *     name: "system",
 *     count: 3,
 *     vmSize: "Standard_D2s_v3",
 *     mode: "System"
 *   }],
 *   identity: {
 *     type: "SystemAssigned"
 *   }
 * });
 *
 * @example
 * // AKS cluster with explicit version pinning and advanced networking:
 * const aksCluster = new AksCluster(this, "aks", {
 *   name: "my-aks-cluster",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   apiVersion: "2025-07-01",
 *   dnsPrefix: "myaks",
 *   kubernetesVersion: "1.28.3",
 *   agentPoolProfiles: [{
 *     name: "system",
 *     count: 3,
 *     vmSize: "Standard_D2s_v3",
 *     mode: "System",
 *     vnetSubnetID: subnet.id
 *   }],
 *   identity: {
 *     type: "SystemAssigned"
 *   },
 *   networkProfile: {
 *     networkPlugin: "azure",
 *     serviceCidr: "10.0.0.0/16",
 *     dnsServiceIP: "10.0.0.10"
 *   },
 *   enableRBAC: true
 * });
 *
 * @stability stable
 */
export class AksCluster extends AzapiResource {
  /**
   * Returns a production-ready monitoring configuration for AKS Clusters
   *
   * This static factory method provides a complete MonitoringConfig with sensible defaults
   * for AKS monitoring including node CPU, node memory, failed pod alerts, and deletion tracking.
   *
   * @param actionGroupId - The resource ID of the action group for alert notifications
   * @param workspaceId - Optional Log Analytics workspace ID for diagnostic settings
   * @param options - Optional configuration to customize thresholds and enable/disable specific alerts
   * @returns A complete MonitoringConfig object ready to use in AksCluster props
   *
   * @example
   * // Basic usage with all defaults
   * const aksCluster = new AksCluster(this, "aks", {
   *   // ... other properties ...
   *   monitoring: AksCluster.defaultMonitoring(actionGroup.id, workspace.id)
   * });
   *
   * @example
   * // Custom thresholds and severities
   * const aksCluster = new AksCluster(this, "aks", {
   *   // ... other properties ...
   *   monitoring: AksCluster.defaultMonitoring(
   *     actionGroup.id,
   *     workspace.id,
   *     {
   *       nodeCpuThreshold: 90,
   *       nodeMemoryThreshold: 90,
   *       enableFailedPodAlert: false
   *     }
   *   )
   * });
   *
   * @stability stable
   */
  public static defaultMonitoring(
    actionGroupId: string,
    workspaceId?: string,
    options?: AksClusterMonitoringOptions,
  ): MonitoringConfig {
    const metricAlerts: any[] = [];

    // High Node CPU Alert
    if (options?.enableNodeCpuAlert !== false) {
      metricAlerts.push({
        name: "high-node-cpu-alert",
        description: "Alert when AKS node CPU usage exceeds threshold",
        severity: (options?.nodeCpuAlertSeverity ?? 2) as 0 | 1 | 2 | 3 | 4,
        scopes: [], // Will be set automatically by base class
        evaluationFrequency: "PT5M",
        windowSize: "PT15M",
        criteria: {
          type: "StaticThreshold" as const,
          metricName: "node_cpu_usage_percentage",
          metricNamespace: "Microsoft.ContainerService/managedClusters",
          operator: "GreaterThan" as const,
          threshold: options?.nodeCpuThreshold ?? 80,
          timeAggregation: "Average" as const,
        },
        actions: [{ actionGroupId }],
      });
    }

    // High Node Memory Alert
    if (options?.enableNodeMemoryAlert !== false) {
      metricAlerts.push({
        name: "high-node-memory-alert",
        description: "Alert when AKS node memory usage exceeds threshold",
        severity: (options?.nodeMemoryAlertSeverity ?? 2) as 0 | 1 | 2 | 3 | 4,
        scopes: [], // Will be set automatically by base class
        evaluationFrequency: "PT5M",
        windowSize: "PT15M",
        criteria: {
          type: "StaticThreshold" as const,
          metricName: "node_memory_working_set_percentage",
          metricNamespace: "Microsoft.ContainerService/managedClusters",
          operator: "GreaterThan" as const,
          threshold: options?.nodeMemoryThreshold ?? 80,
          timeAggregation: "Average" as const,
        },
        actions: [{ actionGroupId }],
      });
    }

    // Failed Pods Alert
    if (options?.enableFailedPodAlert !== false) {
      metricAlerts.push({
        name: "failed-pods-alert",
        description: "Alert when pods are in failed state",
        severity: (options?.failedPodAlertSeverity ?? 1) as 0 | 1 | 2 | 3 | 4,
        scopes: [], // Will be set automatically by base class
        evaluationFrequency: "PT5M",
        windowSize: "PT15M",
        criteria: {
          type: "StaticThreshold" as const,
          metricName: "kube_pod_status_phase",
          metricNamespace: "Microsoft.ContainerService/managedClusters",
          operator: "GreaterThan" as const,
          threshold: options?.failedPodThreshold ?? 0,
          timeAggregation: "Average" as const,
          dimensions: [
            {
              name: "phase" as const,
              operator: "Include" as const,
              values: ["Failed"],
            },
          ],
        },
        actions: [{ actionGroupId }],
      });
    }

    // Build diagnostic settings if workspace ID is provided
    const diagnosticSettings = workspaceId
      ? {
          name: "aks-cluster-diagnostics",
          targetResourceId: "", // Will be set automatically by base class
          workspaceId: workspaceId,
          logs: [{ categoryGroup: "allLogs", enabled: true }],
          metrics: [{ category: "AllMetrics", enabled: true }],
        }
      : undefined;

    // Build activity log alerts
    const activityLogAlerts =
      options?.enableDeletionAlert !== false
        ? [
            {
              name: "aks-cluster-deletion-alert",
              description: "Alert when AKS cluster is deleted",
              scopes: [], // Will be set automatically by base class
              condition: {
                allOf: [
                  {
                    field: "operationName",
                    equalsValue:
                      "Microsoft.ContainerService/managedClusters/delete",
                  },
                ],
              },
              actions: {
                actionGroups: [{ actionGroupId }],
              },
            },
          ]
        : undefined;

    // Return complete config object
    return {
      enabled: true,
      diagnosticSettings: diagnosticSettings,
      metricAlerts: metricAlerts,
      activityLogAlerts: activityLogAlerts,
    };
  }

  static {
    AzapiResource.registerSchemas(AKS_CLUSTER_TYPE, ALL_AKS_CLUSTER_VERSIONS);
  }

  /**
   * The input properties for this AKS Cluster instance
   */
  public readonly props: AksClusterProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly fqdnOutput: cdktf.TerraformOutput;

  // Public properties that match common AKS interface patterns

  // Resource action for retrieving cluster credentials
  private readonly credentialAction: ResourceAction;

  /**
   * Creates a new Azure Kubernetes Service cluster using the VersionedAzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the AKS cluster
   */
  constructor(scope: Construct, id: string, props: AksClusterProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create resource action to retrieve cluster admin credentials
    this.credentialAction = new ResourceAction(this, "listCredentials", {
      type: `${AKS_CLUSTER_TYPE}@${this.resolvedApiVersion}`,
      resourceId: this.id,
      action: "listClusterAdminCredential",
      method: "POST",
      responseExportValues: ["*"],
    });

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the AKS Cluster",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the AKS Cluster",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the AKS Cluster",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the AKS Cluster",
    });

    this.fqdnOutput = new cdktf.TerraformOutput(this, "fqdn", {
      value: `\${${this.terraformResource.fqn}.output.properties.fqdn}`,
      description: "The FQDN of the AKS Cluster",
    });

    // Override logical IDs to match naming convention
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.fqdnOutput.overrideLogicalId("fqdn");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Indicates that this resource requires a location
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   * Returns the most recent stable version as the default
   */
  protected defaultVersion(): string {
    return "2025-07-01";
  }

  /**
   * Gets the Azure resource type for AKS Clusters
   */
  protected resourceType(): string {
    return AKS_CLUSTER_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   * Uses the framework's schema resolution to get the appropriate schema
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Creates the resource body for the Azure API call
   * Transforms the input properties into the JSON format expected by Azure REST API
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as AksClusterProps;
    return {
      location: this.location,
      tags: this.allTags(),
      sku: typedProps.sku,
      identity: typedProps.identity,
      properties: {
        kubernetesVersion: typedProps.kubernetesVersion,
        dnsPrefix: typedProps.dnsPrefix,
        fqdn: typedProps.fqdn,
        privateFQDN: typedProps.privateFQDN,
        agentPoolProfiles: typedProps.agentPoolProfiles,
        servicePrincipalProfile: typedProps.servicePrincipalProfile,
        networkProfile: typedProps.networkProfile,
        aadProfile: typedProps.aadProfile,
        autoScalerProfile: this._transformAutoScalerProfile(
          typedProps.autoScalerProfile,
        ),
        apiServerAccessProfile: typedProps.apiServerAccessProfile,
        diskEncryptionSetID: typedProps.diskEncryptionSetID,
        enableRBAC:
          typedProps.enableRBAC !== undefined ? typedProps.enableRBAC : true,
        nodeResourceGroup: typedProps.nodeResourceGroup,
        addonProfiles: typedProps.addonProfiles,
        linuxProfile: typedProps.linuxProfile,
        windowsProfile: typedProps.windowsProfile,
        oidcIssuerProfile: typedProps.oidcIssuerProfile,
        securityProfile: typedProps.securityProfile,
        storageProfile: typedProps.storageProfile,
        httpProxyConfig: typedProps.httpProxyConfig,
        workloadAutoScalerProfile: typedProps.workloadAutoScalerProfile,
        disableLocalAccounts: typedProps.disableLocalAccounts,
        publicNetworkAccess: typedProps.publicNetworkAccess,
        supportPlan: typedProps.supportPlan,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR AKS CLUSTER OPERATIONS
  // =============================================================================

  /**
   * Get the FQDN of the cluster
   */
  public get fqdn(): string {
    return `\${${this.terraformResource.fqn}.output.properties.fqdn}`;
  }

  /**
   * Get the private FQDN of the cluster (if private cluster is enabled)
   */
  public get privateFqdn(): string {
    return `\${${this.terraformResource.fqn}.output.properties.privateFQDN}`;
  }

  /**
   * Get the Kubernetes configuration for the cluster
   *
   * This retrieves the cluster admin credentials using an azapi_resource_action.
   * The kubeConfig is base64 encoded and contains the full kubectl configuration.
   */
  public get kubeConfig(): string {
    // Access the kubeConfig from the credential action's output
    // The output structure is: { kubeConfigs: [{ value: "base64-encoded-config" }] }
    return `\${${(this.credentialAction as any).fqn}.output.kubeConfigs[0].value}`;
  }

  /**
   * Get the current Kubernetes version running on the cluster
   */
  public get currentKubernetesVersion(): string {
    return `\${${this.terraformResource.fqn}.output.properties.currentKubernetesVersion}`;
  }

  /**
   * Get the node resource group name
   */
  public get nodeResourceGroupName(): string {
    return `\${${this.terraformResource.fqn}.output.properties.nodeResourceGroup}`;
  }

  /**
   * Add a tag to the AKS Cluster
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the AKS Cluster
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public removeTag(key: string): void {
    if (this.props.tags && this.props.tags[key]) {
      delete this.props.tags[key];
    }
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Transforms autoScalerProfile properties from camelCase to kebab-case
   * The Azure AKS API requires kebab-case for autoScalerProfile properties
   */
  private _transformAutoScalerProfile(
    profile?: AksClusterAutoScalerProfile,
  ): any {
    if (!profile) {
      return undefined;
    }

    return {
      "balance-similar-node-groups": profile.balanceSimilarNodeGroups,
      expander: profile.expander,
      "max-empty-bulk-delete": profile.maxEmptyBulkDelete,
      "max-graceful-termination-sec": profile.maxGracefulTerminationSec,
      "max-node-provision-time": profile.maxNodeProvisionTime,
      "max-total-unready-percentage": profile.maxTotalUnreadyPercentage,
      "new-pod-scale-up-delay": profile.newPodScaleUpDelay,
      "ok-total-unready-count": profile.okTotalUnreadyCount,
      "scan-interval": profile.scanInterval,
      "scale-down-delay-after-add": profile.scaleDownDelayAfterAdd,
      "scale-down-delay-after-delete": profile.scaleDownDelayAfterDelete,
      "scale-down-delay-after-failure": profile.scaleDownDelayAfterFailure,
      "scale-down-unneeded-time": profile.scaleDownUnneededTime,
      "scale-down-unready-time": profile.scaleDownUnreadyTime,
      "scale-down-utilization-threshold": profile.scaleDownUtilizationThreshold,
      "skip-nodes-with-local-storage": profile.skipNodesWithLocalStorage,
      "skip-nodes-with-system-pods": profile.skipNodesWithSystemPods,
    };
  }

  /**
   * Applies ignore changes lifecycle rules if specified in props
   */
  private _applyIgnoreChanges(): void {
    if (this.props.ignoreChanges && this.props.ignoreChanges.length > 0) {
      // Common properties that are safe to ignore for AKS clusters
      // kubernetesVersion changes frequently during upgrades
      // agentPoolProfiles can be managed separately
      const validIgnoreChanges = this.props.ignoreChanges.filter(
        (change) => change !== "dnsPrefix", // dnsPrefix cannot be changed after creation
      );

      if (validIgnoreChanges.length > 0) {
        this.terraformResource.addOverride("lifecycle", [
          {
            ignore_changes: validIgnoreChanges,
          },
        ]);
      }
    }
  }
}
