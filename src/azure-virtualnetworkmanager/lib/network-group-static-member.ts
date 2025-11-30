/**
 * Azure Virtual Network Manager Network Group Static Member implementation using AzapiResource framework
 *
 * This class provides a unified implementation for explicitly adding virtual networks or subnets
 * to a network group. Static members allow precise control over which resources receive
 * configurations applied to the network group.
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
  ALL_STATIC_MEMBER_VERSIONS,
  STATIC_MEMBER_TYPE,
} from "./network-group-static-member-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the Azure Virtual Network Manager Network Group Static Member
 *
 * Extends AzapiResourceProps with Static Member specific properties
 */
export interface NetworkGroupStaticMemberProps extends AzapiResourceProps {
  /**
   * Resource ID of the parent Network Group
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/networkManagers/vnm/networkGroups/prod-group"
   */
  readonly networkGroupId: string;

  /**
   * Full resource ID of the VNet or Subnet to add to the group
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet1"
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1"
   */
  readonly resourceId: string;

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Properties for Static Member body
 */
export interface NetworkGroupStaticMemberProperties {
  readonly resourceId: string;
}

/**
 * The resource body interface for Azure Static Member API calls
 */
export interface NetworkGroupStaticMemberBody {
  readonly properties: NetworkGroupStaticMemberProperties;
}

/**
 * Azure Virtual Network Manager Network Group Static Member implementation
 *
 * Static members explicitly add virtual networks or subnets to a network group,
 * providing precise control over which resources receive configurations applied
 * to the network group. This is in contrast to dynamic membership via Azure Policy.
 *
 * @example
 * // Add a VNet to a network group:
 * const vnetMember = new NetworkGroupStaticMember(this, "vnet-member", {
 *   name: "prod-vnet1-member",
 *   networkGroupId: productionGroup.id,
 *   resourceId: vnet.id
 * });
 *
 * @example
 * // Add a subnet to a network group:
 * const subnetMember = new NetworkGroupStaticMember(this, "subnet-member", {
 *   name: "prod-subnet1-member",
 *   networkGroupId: productionGroup.id,
 *   resourceId: subnet.id,
 *   apiVersion: "2024-05-01"
 * });
 *
 * @stability stable
 */
export class NetworkGroupStaticMember extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      STATIC_MEMBER_TYPE,
      ALL_STATIC_MEMBER_VERSIONS,
    );
  }

  /**
   * The input properties for this Static Member instance
   */
  public readonly props: NetworkGroupStaticMemberProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly resourceIdOutput: cdktf.TerraformOutput;

  // Public properties
  public readonly resourceName: string;

  /**
   * Creates a new Azure Virtual Network Manager Network Group Static Member using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Static Member
   */
  constructor(
    scope: Construct,
    id: string,
    props: NetworkGroupStaticMemberProps,
  ) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    this.resourceName = `\${${this.terraformResource.fqn}.name}`;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Static Member",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: this.resourceName,
      description: "The name of the Static Member",
    });

    // Use input resourceId since Azure API doesn't return it in the response
    this.resourceIdOutput = new cdktf.TerraformOutput(this, "resourceId", {
      value: props.resourceId,
      description: "The resource ID of the member VNet or Subnet",
    });

    // Override logical IDs to match naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.resourceIdOutput.overrideLogicalId("resourceId");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Resolves the parent resource ID for the Static Member
   * Static Members are scoped to Network Groups
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as NetworkGroupStaticMemberProps;
    return typedProps.networkGroupId;
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2024-05-01";
  }

  /**
   * Gets the Azure resource type for Static Members
   */
  protected resourceType(): string {
    return STATIC_MEMBER_TYPE;
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
    const typedProps = props as NetworkGroupStaticMemberProps;
    return {
      properties: {
        resourceId: typedProps.resourceId,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR STATIC MEMBER OPERATIONS
  // =============================================================================

  /**
   * Get the resource ID of the member VNet or Subnet
   * Returns the input resourceId since Azure API doesn't return it in the response
   */
  public get memberResourceId(): string {
    return this.props.resourceId;
  }

  /**
   * Get the region of the member resource
   */
  public get region(): string {
    return `\${${this.terraformResource.fqn}.output.properties.region}`;
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
