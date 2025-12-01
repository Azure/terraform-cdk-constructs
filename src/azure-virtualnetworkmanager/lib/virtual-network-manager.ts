/**
 * Azure Virtual Network Manager implementation using AzapiResource framework
 *
 * This class provides a unified implementation for Azure Virtual Network Managers that
 * automatically handles version management, schema validation, and property
 * transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2023-11-01 (Maintenance)
 * - 2024-05-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full backward compatibility
 * - JSII compliance for multi-language support
 * - Convenience methods for creating child resources
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { ConnectivityConfiguration } from "./connectivity-configuration";
import {
  ConnectivityGroupItem,
  Hub,
} from "./connectivity-configuration-schemas";
import { NetworkGroup } from "./network-group";
import { SecurityAdminConfiguration } from "./security-admin-configuration";
import {
  ALL_VIRTUAL_NETWORK_MANAGER_VERSIONS,
  VIRTUAL_NETWORK_MANAGER_TYPE,
} from "./virtual-network-manager-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Scope configuration for Virtual Network Manager
 */
export interface NetworkManagerScopes {
  /**
   * Array of management group IDs that define the scope
   * @example ["/providers/Microsoft.Management/managementGroups/mg1"]
   */
  readonly managementGroups?: string[];

  /**
   * Array of subscription IDs that define the scope
   * @example ["/subscriptions/00000000-0000-0000-0000-000000000000"]
   */
  readonly subscriptions?: string[];
}

/**
 * Properties for the Azure Virtual Network Manager
 *
 * Extends AzapiResourceProps with Virtual Network Manager specific properties
 */
export interface VirtualNetworkManagerProps extends AzapiResourceProps {
  /**
   * Resource ID of the resource group where the network manager will be created
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg"
   */
  readonly resourceGroupId: string;

  /**
   * Defines the scope of management (management groups and/or subscriptions)
   * At least one of managementGroups or subscriptions must be specified
   */
  readonly networkManagerScopes: NetworkManagerScopes;

  /**
   * Array of features enabled for the network manager
   * Valid values: "Connectivity", "SecurityAdmin", "Routing"
   * @example ["Connectivity", "SecurityAdmin"]
   */
  readonly networkManagerScopeAccesses: (
    | "Connectivity"
    | "SecurityAdmin"
    | "Routing"
  )[];

  /**
   * Optional description of the network manager
   * @example "Central network management for production workloads"
   */
  readonly description?: string;

  /**
   * The lifecycle rules to ignore changes
   * Useful for properties that are externally managed
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Properties for adding a NetworkGroup via the convenience method
 * This interface excludes networkManagerId as it's automatically set
 */
export interface AddNetworkGroupProps extends AzapiResourceProps {
  /**
   * Optional description of the network group
   * @example "Production virtual networks for region East US"
   */
  readonly description?: string;

  /**
   * Type of members in this network group
   * @default undefined (can contain both VirtualNetwork and Subnet members)
   * @example "VirtualNetwork"
   * @example "Subnet"
   */
  readonly memberType?: "VirtualNetwork" | "Subnet";

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Properties for adding a ConnectivityConfiguration via the convenience method
 * This interface excludes networkManagerId as it's automatically set
 */
export interface AddConnectivityConfigurationProps extends AzapiResourceProps {
  /**
   * Optional description of the connectivity configuration
   * @example "Hub-and-spoke topology for production workloads"
   */
  readonly description?: string;

  /**
   * Connectivity topology type
   * - HubAndSpoke: Central hub with spoke VNets
   * - Mesh: All VNets can communicate directly
   * @example "HubAndSpoke"
   * @example "Mesh"
   */
  readonly connectivityTopology: "HubAndSpoke" | "Mesh";

  /**
   * Network groups to apply this configuration to
   * Each item specifies a network group and how it should connect
   */
  readonly appliesToGroups: ConnectivityGroupItem[];

  /**
   * Hub VNets for hub-and-spoke topology
   * Required when connectivityTopology is "HubAndSpoke"
   * @example [{ resourceId: "/subscriptions/.../virtualNetworks/hub-vnet", resourceType: "Microsoft.Network/virtualNetworks" }]
   */
  readonly hubs?: Hub[];

  /**
   * Enable global mesh connectivity
   * Allows mesh connectivity across regions
   * @default false
   */
  readonly isGlobal?: boolean;

  /**
   * Delete existing peerings when applying this configuration
   * @default false
   */
  readonly deleteExistingPeering?: boolean;

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Properties for adding a SecurityAdminConfiguration via the convenience method
 * This interface excludes networkManagerId as it's automatically set
 */
export interface AddSecurityAdminConfigurationProps extends AzapiResourceProps {
  /**
   * Optional description of the security admin configuration
   * @example "Organization-wide security rules for production workloads"
   */
  readonly description?: string;

  /**
   * Services to apply the security admin configuration on
   * @example ["None"]
   * @example ["All"]
   */
  readonly applyOnNetworkIntentPolicyBasedServices?: string[];

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Properties for Virtual Network Manager body
 */
export interface VirtualNetworkManagerProperties {
  readonly networkManagerScopes: NetworkManagerScopes;
  readonly networkManagerScopeAccesses: string[];
  readonly description?: string;
}

/**
 * The resource body interface for Azure Virtual Network Manager API calls
 */
export interface VirtualNetworkManagerBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties: VirtualNetworkManagerProperties;
}

/**
 * Azure Virtual Network Manager implementation
 *
 * This class provides a single, version-aware implementation that handles
 * version resolution, schema validation, and property transformation while maintaining
 * full backward compatibility.
 *
 * @example
 * // Basic usage with automatic version resolution:
 * const networkManager = new VirtualNetworkManager(this, "manager", {
 *   name: "my-network-manager",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   networkManagerScopes: {
 *     subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"]
 *   },
 *   networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"]
 * });
 *
 * @example
 * // Usage with explicit version pinning:
 * const networkManager = new VirtualNetworkManager(this, "manager", {
 *   name: "my-network-manager",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   apiVersion: "2024-05-01",
 *   networkManagerScopes: {
 *     subscriptions: ["/subscriptions/00000000-0000-0000-0000-000000000000"]
 *   },
 *   networkManagerScopeAccesses: ["Connectivity", "SecurityAdmin"]
 * });
 *
 * @stability stable
 */
export class VirtualNetworkManager extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      VIRTUAL_NETWORK_MANAGER_TYPE,
      ALL_VIRTUAL_NETWORK_MANAGER_VERSIONS,
    );
  }

  /**
   * The input properties for this Virtual Network Manager instance
   */
  public readonly props: VirtualNetworkManagerProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly scopeOutput: cdktf.TerraformOutput;
  public readonly scopeAccessesOutput: cdktf.TerraformOutput;

  // Public properties that match the standard interface
  public readonly resourceName: string;

  /**
   * Creates a new Azure Virtual Network Manager using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation. It maintains full backward compatibility
   * with existing Virtual Network Manager implementations.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Virtual Network Manager
   */
  constructor(scope: Construct, id: string, props: VirtualNetworkManagerProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    this.resourceName = `\${${this.terraformResource.fqn}.name}`;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Virtual Network Manager",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: this.resourceName,
      description: "The name of the Virtual Network Manager",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Virtual Network Manager",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Virtual Network Manager",
    });

    this.scopeOutput = new cdktf.TerraformOutput(this, "scope", {
      value: `\${${this.terraformResource.fqn}.output.properties.networkManagerScopes}`,
      description: "The management scope of the Virtual Network Manager",
    });

    this.scopeAccessesOutput = new cdktf.TerraformOutput(
      this,
      "scopeAccesses",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.networkManagerScopeAccesses}`,
        description: "The enabled features of the Virtual Network Manager",
      },
    );

    // Override logical IDs to match original naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.locationOutput.overrideLogicalId("location");
    this.tagsOutput.overrideLogicalId("tags");
    this.scopeOutput.overrideLogicalId("scope");
    this.scopeAccessesOutput.overrideLogicalId("scopeAccesses");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Resolves the parent resource ID for the Network Manager
   * Network Managers are scoped to resource groups
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as VirtualNetworkManagerProps;
    return typedProps.resourceGroupId;
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   * Returns the most recent stable version as the default
   */
  protected defaultVersion(): string {
    return "2024-05-01";
  }

  /**
   * Gets the Azure resource type for Virtual Network Managers
   */
  protected resourceType(): string {
    return "Microsoft.Network/networkManagers";
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
    const typedProps = props as VirtualNetworkManagerProps;
    return {
      location: typedProps.location,
      tags: this.allTags(),
      properties: {
        networkManagerScopes: typedProps.networkManagerScopes,
        networkManagerScopeAccesses: typedProps.networkManagerScopeAccesses,
        description: typedProps.description,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR VIRTUAL NETWORK MANAGER OPERATIONS
  // =============================================================================

  /**
   * Add a tag to the Virtual Network Manager
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
    // Apply the tag directly to the resource
    this.terraformResource.addOverride(`tags.${key}`, value);
  }

  /**
   * Remove a tag from the Virtual Network Manager
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public removeTag(key: string): void {
    if (this.props.tags && this.props.tags[key]) {
      delete this.props.tags[key];
      // Remove the tag from the resource
      this.terraformResource.addOverride(`tags.${key}`, null);
    }
  }

  // =============================================================================
  // CONVENIENCE METHODS FOR CHILD RESOURCES (OPTION A - HYBRID APPROACH)
  // =============================================================================

  /**
   * Convenience method to create a NetworkGroup
   *
   * This is a helper method that creates a NetworkGroup with the networkManagerId
   * automatically set to this Network Manager's ID. You can also create NetworkGroups
   * directly using: new NetworkGroup(scope, id, { networkManagerId: vnm.id, ...props })
   *
   * @param id - The unique identifier for the network group construct
   * @param props - NetworkGroup properties (networkManagerId will be set automatically)
   * @returns The created NetworkGroup instance
   *
   * @example
   * const prodGroup = networkManager.addNetworkGroup("prod-group", {
   *   name: "production-vnets",
   *   description: "Production virtual networks",
   *   memberType: "VirtualNetwork"
   * });
   */
  public addNetworkGroup(
    id: string,
    props: AddNetworkGroupProps,
  ): NetworkGroup {
    return new NetworkGroup(this, id, {
      ...props,
      networkManagerId: this.id,
    });
  }

  /**
   * Convenience method to create a ConnectivityConfiguration
   *
   * This is a helper method that creates a ConnectivityConfiguration with the
   * networkManagerId automatically set to this Network Manager's ID.
   *
   * @param id - The unique identifier for the connectivity configuration construct
   * @param props - ConnectivityConfiguration properties (networkManagerId will be set automatically)
   * @returns The created ConnectivityConfiguration instance
   *
   * @example
   * const hubSpoke = networkManager.addConnectivityConfiguration("hub-spoke", {
   *   name: "production-hub-spoke",
   *   connectivityTopology: "HubAndSpoke",
   *   appliesToGroups: [{ networkGroupId: prodGroup.id }],
   *   hubs: [{ resourceId: hubVnet.id, resourceType: "Microsoft.Network/virtualNetworks" }]
   * });
   */
  public addConnectivityConfiguration(
    id: string,
    props: AddConnectivityConfigurationProps,
  ): ConnectivityConfiguration {
    return new ConnectivityConfiguration(this, id, {
      ...props,
      networkManagerId: this.id,
    });
  }

  /**
   * Convenience method to create a SecurityAdminConfiguration
   *
   * This is a helper method that creates a SecurityAdminConfiguration with the
   * networkManagerId automatically set to this Network Manager's ID.
   *
   * @param id - The unique identifier for the security admin configuration construct
   * @param props - SecurityAdminConfiguration properties (networkManagerId will be set automatically)
   * @returns The created SecurityAdminConfiguration instance
   *
   * @example
   * const securityConfig = networkManager.addSecurityAdminConfiguration("security", {
   *   name: "production-security",
   *   description: "High-priority security rules for production"
   * });
   */
  public addSecurityAdminConfiguration(
    id: string,
    props: AddSecurityAdminConfigurationProps,
  ): SecurityAdminConfiguration {
    return new SecurityAdminConfiguration(this, id, {
      ...props,
      networkManagerId: this.id,
    });
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Applies ignore changes lifecycle rules if specified in props
   */
  private _applyIgnoreChanges(): void {
    if (this.props.ignoreChanges && this.props.ignoreChanges.length > 0) {
      this.terraformResource.addOverride("lifecycle", {
        ignore_changes: this.props.ignoreChanges,
      });
    }
  }
}
