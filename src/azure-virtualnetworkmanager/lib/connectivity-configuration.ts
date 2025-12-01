/**
 * Azure Virtual Network Manager Connectivity Configuration implementation using AzapiResource framework
 *
 * This class provides a unified implementation for defining network topology (mesh or hub-and-spoke)
 * for virtual networks managed by Azure Virtual Network Manager.
 *
 * Supported API Versions:
 * - 2023-11-01 (Maintenance)
 * - 2024-05-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Support for mesh and hub-and-spoke topologies
 * - Full backward compatibility
 * - JSII compliance for multi-language support
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_CONNECTIVITY_CONFIGURATION_VERSIONS,
  CONNECTIVITY_CONFIGURATION_TYPE,
  ConnectivityGroupItem,
  Hub,
} from "./connectivity-configuration-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the Azure Virtual Network Manager Connectivity Configuration
 *
 * Extends AzapiResourceProps with Connectivity Configuration specific properties
 */
export interface ConnectivityConfigurationProps extends AzapiResourceProps {
  /**
   * Resource ID of the parent Network Manager
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/networkManagers/vnm"
   */
  readonly networkManagerId: string;

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
 * Properties for Connectivity Configuration body
 */
export interface ConnectivityConfigurationProperties {
  readonly description?: string;
  readonly connectivityTopology: string;
  readonly appliesToGroups: ConnectivityGroupItem[];
  readonly hubs?: Hub[];
  readonly isGlobal?: boolean;
  readonly deleteExistingPeering?: boolean;
}

/**
 * The resource body interface for Azure Connectivity Configuration API calls
 */
export interface ConnectivityConfigurationBody {
  readonly properties: ConnectivityConfigurationProperties;
}

/**
 * Azure Virtual Network Manager Connectivity Configuration implementation
 *
 * Connectivity configurations define the network topology (mesh or hub-and-spoke) for
 * virtual networks. They enable automated peering management at scale and support both
 * regional and global connectivity scenarios.
 *
 * @example
 * // Hub-and-spoke topology:
 * const hubSpokeConfig = new ConnectivityConfiguration(this, "hub-spoke", {
 *   name: "production-hub-spoke",
 *   networkManagerId: networkManager.id,
 *   description: "Hub-and-spoke for production",
 *   connectivityTopology: "HubAndSpoke",
 *   appliesToGroups: [{
 *     networkGroupId: productionGroup.id,
 *     groupConnectivity: "None",
 *     useHubGateway: true
 *   }],
 *   hubs: [{
 *     resourceId: hubVnet.id,
 *     resourceType: "Microsoft.Network/virtualNetworks"
 *   }]
 * });
 *
 * @example
 * // Mesh topology:
 * const meshConfig = new ConnectivityConfiguration(this, "mesh", {
 *   name: "development-mesh",
 *   networkManagerId: networkManager.id,
 *   description: "Mesh for development VNets",
 *   connectivityTopology: "Mesh",
 *   appliesToGroups: [{
 *     networkGroupId: devGroup.id,
 *     groupConnectivity: "DirectlyConnected",
 *     isGlobal: false
 *   }],
 *   isGlobal: false
 * });
 *
 * @stability stable
 */
export class ConnectivityConfiguration extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      CONNECTIVITY_CONFIGURATION_TYPE,
      ALL_CONNECTIVITY_CONFIGURATION_VERSIONS,
    );
  }

  /**
   * The input properties for this Connectivity Configuration instance
   */
  public readonly props: ConnectivityConfigurationProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;

  // Public properties
  public readonly resourceName: string;

  /**
   * Creates a new Azure Virtual Network Manager Connectivity Configuration using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Connectivity Configuration
   */
  constructor(
    scope: Construct,
    id: string,
    props: ConnectivityConfigurationProps,
  ) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    this.resourceName = `\${${this.terraformResource.fqn}.name}`;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Connectivity Configuration",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: this.resourceName,
      description: "The name of the Connectivity Configuration",
    });

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioningState",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the Connectivity Configuration",
      },
    );

    // Override logical IDs to match naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.provisioningStateOutput.overrideLogicalId("provisioningState");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Resolves the parent resource ID for the Connectivity Configuration
   * Connectivity Configurations are scoped to Network Managers
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as ConnectivityConfigurationProps;
    return typedProps.networkManagerId;
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2024-05-01";
  }

  /**
   * Gets the Azure resource type for Connectivity Configurations
   */
  protected resourceType(): string {
    return CONNECTIVITY_CONFIGURATION_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as ConnectivityConfigurationProps;

    // Process appliesToGroups to ensure groupConnectivity is set
    // Convert booleans to strings to avoid CDKTF filtering out false values
    const processedAppliesToGroups = typedProps.appliesToGroups.map((group) => {
      const processedGroup: any = {
        networkGroupId: group.networkGroupId,
        groupConnectivity: group.groupConnectivity || "None",
      };
      // Convert booleans to string representations for Azure API
      if (group.isGlobal !== undefined) {
        processedGroup.isGlobal = group.isGlobal ? "True" : "False";
      }
      if (group.useHubGateway !== undefined) {
        processedGroup.useHubGateway = group.useHubGateway ? "True" : "False";
      }
      return processedGroup;
    });

    const body: any = {
      properties: {
        description: typedProps.description,
        connectivityTopology: typedProps.connectivityTopology,
        appliesToGroups: processedAppliesToGroups,
        hubs: typedProps.hubs,
      },
    };

    // Convert top-level booleans to string representations for Azure API
    if (typedProps.isGlobal !== undefined) {
      body.properties.isGlobal = typedProps.isGlobal ? "True" : "False";
    }
    if (typedProps.deleteExistingPeering !== undefined) {
      body.properties.deleteExistingPeering = typedProps.deleteExistingPeering
        ? "True"
        : "False";
    }

    return body;
  }

  // =============================================================================
  // PUBLIC METHODS FOR CONNECTIVITY CONFIGURATION OPERATIONS
  // =============================================================================

  /**
   * Get the provisioning state of the Connectivity Configuration
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Get the connectivity topology type
   */
  public get topology(): "HubAndSpoke" | "Mesh" {
    return this.props.connectivityTopology;
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
