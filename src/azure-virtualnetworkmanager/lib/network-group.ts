/**
 * Azure Virtual Network Manager Network Group implementation using AzapiResource framework
 *
 * This class provides a unified implementation for Azure Virtual Network Manager Network Groups
 * that automatically handles version management, schema validation, and property transformation
 * across all supported API versions.
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
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_NETWORK_GROUP_VERSIONS,
  NETWORK_GROUP_TYPE,
} from "./network-group-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the Azure Virtual Network Manager Network Group
 *
 * Extends AzapiResourceProps with Network Group specific properties
 */
export interface NetworkGroupProps extends AzapiResourceProps {
  /**
   * Resource ID of the parent Network Manager
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/networkManagers/vnm"
   */
  readonly networkManagerId: string;

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
 * Properties for Network Group body
 */
export interface NetworkGroupProperties {
  readonly description?: string;
  readonly memberType?: string;
}

/**
 * The resource body interface for Azure Network Group API calls
 */
export interface NetworkGroupBody {
  readonly properties?: NetworkGroupProperties;
}

/**
 * Azure Virtual Network Manager Network Group implementation
 *
 * Network Groups are logical containers for virtual networks or subnets that allow you to
 * apply connectivity, security, or routing configurations at scale. They are a foundational
 * component required by connectivity configurations, security admin configurations, and
 * routing configurations.
 *
 * @example
 * // Basic network group for production VNets:
 * const productionGroup = new NetworkGroup(this, "prod-group", {
 *   name: "production-vnets",
 *   networkManagerId: networkManager.id,
 *   description: "Production virtual networks",
 *   memberType: "VirtualNetwork"
 * });
 *
 * @example
 * // Network group with explicit version pinning:
 * const devGroup = new NetworkGroup(this, "dev-group", {
 *   name: "development-vnets",
 *   networkManagerId: networkManager.id,
 *   apiVersion: "2024-05-01",
 *   description: "Development virtual networks"
 * });
 *
 * @stability stable
 */
export class NetworkGroup extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      NETWORK_GROUP_TYPE,
      ALL_NETWORK_GROUP_VERSIONS,
    );
  }

  /**
   * The input properties for this Network Group instance
   */
  public readonly props: NetworkGroupProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;

  // Public properties
  public readonly resourceName: string;

  /**
   * Creates a new Azure Virtual Network Manager Network Group using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Network Group
   */
  constructor(scope: Construct, id: string, props: NetworkGroupProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    this.resourceName = `\${${this.terraformResource.fqn}.name}`;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Network Group",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: this.resourceName,
      description: "The name of the Network Group",
    });

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioningState",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the Network Group",
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
   * Resolves the parent resource ID for the Network Group
   * Network Groups are scoped to Network Managers
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as NetworkGroupProps;
    return typedProps.networkManagerId;
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2024-05-01";
  }

  /**
   * Gets the Azure resource type for Network Groups
   */
  protected resourceType(): string {
    return NETWORK_GROUP_TYPE;
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
    const typedProps = props as NetworkGroupProps;
    return {
      properties: {
        description: typedProps.description,
        memberType: typedProps.memberType,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR NETWORK GROUP OPERATIONS
  // =============================================================================

  /**
   * Get the provisioning state of the Network Group
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
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
