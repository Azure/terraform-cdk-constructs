/**
 * Azure Subnet implementation using AzapiResource framework
 *
 * This class provides a unified implementation for Azure Subnets that
 * automatically handles version management, schema validation, and property
 * transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2024-07-01 (Active)
 * - 2024-10-01 (Active)
 * - 2025-01-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full backward compatibility
 * - JSII compliance for multi-language support
 * - Child resource with proper parent ID construction
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { ALL_SUBNET_VERSIONS, SUBNET_TYPE } from "./subnet-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Network Security Group reference for Subnet
 */
export interface SubnetNSGReference {
  /**
   * Network Security Group resource ID
   */
  readonly id: string;
}

/**
 * Route Table reference for Subnet
 */
export interface SubnetRouteTableReference {
  /**
   * Route Table resource ID
   */
  readonly id: string;
}

/**
 * NAT Gateway reference for Subnet
 */
export interface SubnetNATGatewayReference {
  /**
   * NAT Gateway resource ID
   */
  readonly id: string;
}

/**
 * Service endpoint configuration for Subnet
 */
export interface SubnetServiceEndpoint {
  /**
   * The service endpoint identifier
   * @example "Microsoft.Storage"
   */
  readonly service: string;

  /**
   * Optional locations where the service endpoint is available
   * @example ["eastus", "westus"]
   */
  readonly locations?: string[];
}

/**
 * Delegation configuration for Subnet
 */
export interface SubnetDelegation {
  /**
   * Name of the delegation
   */
  readonly name: string;

  /**
   * The service name to delegate to
   * @example "Microsoft.Sql/managedInstances"
   */
  readonly serviceName: string;

  /**
   * Optional actions allowed for the delegation
   */
  readonly actions?: string[];
}

/**
 * Properties for the Azure Subnet
 *
 * Extends AzapiResourceProps with Subnet specific properties
 */
export interface SubnetProps extends AzapiResourceProps {
  /**
   * Address prefix for the subnet in CIDR notation
   * Must be within the parent VNet's address space
   * @example "10.0.1.0/24"
   */
  readonly addressPrefix: string;

  /**
   * Name of the parent virtual network
   * Required for constructing the parent ID
   */
  readonly virtualNetworkName: string;

  /**
   * Optional: Full resource ID of the parent Virtual Network
   * When provided, creates a proper Terraform dependency on the VNet
   * If not provided, the parent ID will be constructed from resourceGroupId and virtualNetworkName
   */
  readonly virtualNetworkId?: string;

  /**
   * Network security group reference
   * Optional - can be attached later
   */
  readonly networkSecurityGroup?: SubnetNSGReference;

  /**
   * Route table reference
   * Optional - can be attached later
   */
  readonly routeTable?: SubnetRouteTableReference;

  /**
   * Service endpoints for the subnet
   * Enables private access to Azure services
   */
  readonly serviceEndpoints?: SubnetServiceEndpoint[];

  /**
   * Subnet delegations
   * Delegates subnet to specific Azure services
   */
  readonly delegations?: SubnetDelegation[];

  /**
   * Private endpoint network policies
   * Controls whether network policies apply to private endpoints
   * @defaultValue "Disabled"
   */
  readonly privateEndpointNetworkPolicies?: string;

  /**
   * Private link service network policies
   * Controls whether network policies apply to private link services
   * @defaultValue "Enabled"
   */
  readonly privateLinkServiceNetworkPolicies?: string;

  /**
   * NAT gateway reference
   * Optional - for outbound internet connectivity
   */
  readonly natGateway?: SubnetNATGatewayReference;

  /**
   * IP allocations for the subnet
   * Optional - for custom IP allocation
   */
  readonly ipAllocations?: any[];

  /**
   * Resource group ID where the parent VNet exists
   * Required for constructing the parent ID
   */
  readonly resourceGroupId: string;

  /**
   * The lifecycle rules to ignore changes
   * Useful for properties that are externally managed
   *
   * @example ["networkSecurityGroup", "routeTable"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Azure Subnet implementation
 *
 * This class provides a single, version-aware implementation that replaces
 * version-specific Subnet classes. It automatically handles version
 * resolution, schema validation, and property transformation while maintaining
 * full backward compatibility.
 *
 * **Child Resource Pattern**: Subnets are child resources of Virtual Networks.
 * This implementation overrides the `resolveParentId()` method to properly
 * construct the Virtual Network ID as the parent, following the enhanced base
 * class pattern for child resources.
 *
 * @example
 * // Basic usage with automatic version resolution:
 * const subnet = new Subnet(this, "subnet", {
 *   name: "my-subnet",
 *   virtualNetworkName: "my-vnet",
 *   resourceGroupId: resourceGroup.id,
 *   addressPrefix: "10.0.1.0/24"
 * });
 *
 * @example
 * // Usage with network security group:
 * const subnet = new Subnet(this, "subnet", {
 *   name: "my-subnet",
 *   virtualNetworkName: "my-vnet",
 *   resourceGroupId: resourceGroup.id,
 *   addressPrefix: "10.0.1.0/24",
 *   networkSecurityGroup: { id: nsg.id }
 * });
 *
 * @stability stable
 */
export class Subnet extends AzapiResource {
  /**
   * Static initialization flag to ensure schemas are registered only once
   */
  private static schemasRegistered = false;

  /**
   * Ensures that Subnet schemas are registered with the ApiVersionManager
   * This is called once during the first Subnet instantiation
   */
  private static ensureSchemasRegistered(): void {
    if (Subnet.schemasRegistered) {
      return;
    }

    const apiVersionManager = ApiVersionManager.instance();

    try {
      // Register all Subnet versions
      apiVersionManager.registerResourceType(SUBNET_TYPE, ALL_SUBNET_VERSIONS);

      Subnet.schemasRegistered = true;

      console.log(
        `Registered ${ALL_SUBNET_VERSIONS.length} API versions for ${SUBNET_TYPE}`,
      );
    } catch (error) {
      console.warn(
        `Failed to register Subnet schemas: ${error}. ` +
          `This may indicate the schemas are already registered or there's a configuration issue.`,
      );
      // Don't throw here as the schemas might already be registered
      Subnet.schemasRegistered = true;
    }
  }

  /**
   * The input properties for this Subnet instance
   */
  public readonly props: SubnetProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly addressPrefixOutput: cdktf.TerraformOutput;

  // Public properties that match the original Subnet interface
  public readonly id: string;

  /**
   * Creates a new Azure Subnet using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation. It maintains full backward compatibility
   * with existing Subnet implementations.
   *
   * **Parent ID Resolution**: Subnets are child resources of Virtual Networks.
   * The resolveParentId() method is overridden to return the Virtual Network ID
   * instead of the Resource Group ID, establishing the proper parent-child hierarchy.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Subnet
   */
  constructor(scope: Construct, id: string, props: SubnetProps) {
    // Ensure schemas are registered before calling super
    Subnet.ensureSchemasRegistered();

    // Call the parent constructor with the original props
    // Parent ID resolution is now handled by the overridden resolveParentId method
    super(scope, id, props);

    // Store the props
    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    this.id = `\${${this.terraformResource.fqn}.id}`;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Subnet",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Subnet",
    });

    this.addressPrefixOutput = new cdktf.TerraformOutput(
      this,
      "addressPrefix",
      {
        value: this.props.addressPrefix,
        description: "The address prefix of the Subnet",
      },
    );

    // Override logical IDs to match original naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.addressPrefixOutput.overrideLogicalId("addressPrefix");

    // Azure automatically expands service endpoint locations for high availability,
    // adding paired regions for disaster recovery. Ignore these changes to prevent drift.
    if (props.serviceEndpoints && props.serviceEndpoints.length > 0) {
      this.terraformResource.addOverride("lifecycle", {
        ignore_changes: ["body.properties.serviceEndpoints[0].locations"],
      });
    }

    // Apply additional ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   * Returns the most recent stable version as the default
   */
  protected defaultVersion(): string {
    return "2024-10-01";
  }

  /**
   * Gets the Azure resource type for Subnets
   */
  protected resourceType(): string {
    return SUBNET_TYPE;
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
    const typedProps = props as SubnetProps;
    return {
      properties: {
        addressPrefix: typedProps.addressPrefix,
        networkSecurityGroup: typedProps.networkSecurityGroup,
        routeTable: typedProps.routeTable,
        serviceEndpoints: typedProps.serviceEndpoints,
        delegations: typedProps.delegations,
        privateEndpointNetworkPolicies:
          typedProps.privateEndpointNetworkPolicies || "Disabled",
        privateLinkServiceNetworkPolicies:
          typedProps.privateLinkServiceNetworkPolicies || "Enabled",
        natGateway: typedProps.natGateway,
        ipAllocations: typedProps.ipAllocations,
      },
    };
  }

  /**
   * Resolves the parent ID for the Subnet resource.
   *
   * Subnets are child resources of Virtual Networks. This method overrides
   * the default parent ID resolution to return the Virtual Network ID instead
   * of the Resource Group ID.
   *
   * @param props - The resource properties
   * @returns The Virtual Network ID (parent resource ID)
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as SubnetProps;
    // If virtualNetworkId is provided, use it (creates Terraform dependency)
    // Otherwise construct it from resourceGroupId and virtualNetworkName (string concatenation)
    return (
      typedProps.virtualNetworkId ||
      `${typedProps.resourceGroupId}/providers/Microsoft.Network/virtualNetworks/${typedProps.virtualNetworkName}`
    );
  }

  /**
   * Override createAzapiResource to explicitly prevent location from being added
   * Subnets are child resources and inherit location from their parent VNet
   */
  protected createAzapiResource(
    properties: Record<string, any>,
    parentId: string,
    name: string,
    _location?: string,
  ): cdktf.TerraformResource {
    // Call parent implementation but pass undefined for location
    // This prevents the base class from adding location to the config
    return super.createAzapiResource(properties, parentId, name, undefined);
  }

  // =============================================================================
  // PUBLIC METHODS FOR SUBNET OPERATIONS
  // =============================================================================

  /**
   * Get the full resource identifier for use in other Azure resources
   * Alias for the id property to match original interface
   */
  public get resourceId(): string {
    return this.id;
  }

  /**
   * Get the address prefix value
   * Returns the address prefix from the input props since Azure API doesn't return it in output
   */
  public get addressPrefix(): string {
    return this.props.addressPrefix;
  }

  /**
   * Get the parent Virtual Network ID
   * Constructs the VNet resource ID from the subnet's parent reference
   */
  public get virtualNetworkId(): string {
    const typedProps = this.props as SubnetProps;
    return `${typedProps.resourceGroupId}/providers/Microsoft.Network/virtualNetworks/${typedProps.virtualNetworkName}`;
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
