/**
 * Azure Network Security Group implementation using AzapiResource framework
 *
 * This class provides a unified implementation for Azure Network Security Groups that
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
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_NETWORK_SECURITY_GROUP_VERSIONS,
  NETWORK_SECURITY_GROUP_TYPE,
} from "./network-security-group-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Security rule configuration for Network Security Group
 */
export interface SecurityRule {
  /**
   * The name of the security rule
   * Must be unique within the NSG
   */
  readonly name: string;

  /**
   * Properties of the security rule
   */
  readonly properties: SecurityRuleProperties;
}

/**
 * Properties for a security rule
 */
export interface SecurityRuleProperties {
  /**
   * Network protocol this rule applies to
   * @example "Tcp", "Udp", "Icmp", "Esp", "Ah", "*"
   */
  readonly protocol: string;

  /**
   * The source port or range
   * @example "80", "8000-8999", "*"
   */
  readonly sourcePortRange?: string;

  /**
   * The source port ranges (for multiple ranges)
   * @example ["80", "443", "8080-8090"]
   */
  readonly sourcePortRanges?: string[];

  /**
   * The destination port or range
   * @example "443", "3389", "*"
   */
  readonly destinationPortRange?: string;

  /**
   * The destination port ranges (for multiple ranges)
   * @example ["80", "443"]
   */
  readonly destinationPortRanges?: string[];

  /**
   * The source address prefix
   * @example "10.0.0.0/16", "VirtualNetwork", "Internet", "*"
   */
  readonly sourceAddressPrefix?: string;

  /**
   * The source address prefixes (for multiple sources)
   * @example ["10.0.0.0/16", "10.1.0.0/16"]
   */
  readonly sourceAddressPrefixes?: string[];

  /**
   * The destination address prefix
   * @example "10.0.1.0/24", "VirtualNetwork", "*"
   */
  readonly destinationAddressPrefix?: string;

  /**
   * The destination address prefixes (for multiple destinations)
   * @example ["10.0.1.0/24", "10.0.2.0/24"]
   */
  readonly destinationAddressPrefixes?: string[];

  /**
   * Source application security groups
   */
  readonly sourceApplicationSecurityGroups?: any[];

  /**
   * Destination application security groups
   */
  readonly destinationApplicationSecurityGroups?: any[];

  /**
   * The network traffic is allowed or denied
   * Must be "Allow" or "Deny"
   */
  readonly access: string;

  /**
   * The priority of the rule
   * Value must be between 100 and 4096
   * Lower values have higher priority
   */
  readonly priority: number;

  /**
   * The direction of the rule
   * Must be "Inbound" or "Outbound"
   */
  readonly direction: string;

  /**
   * A description for this rule
   * Restricted to 140 characters
   */
  readonly description?: string;
}

/**
 * Properties for the Azure Network Security Group
 *
 * Extends AzapiResourceProps with Network Security Group specific properties
 */
export interface NetworkSecurityGroupProps extends AzapiResourceProps {
  /**
   * Security rules for the network security group
   * Optional - rules can also be added after creation
   */
  readonly securityRules?: SecurityRule[];

  /**
   * When enabled, flows created from NSG connections will be re-evaluated when rules are updated
   * @defaultValue false
   */
  readonly flushConnection?: boolean;

  /**
   * Resource group ID where the NSG will be created
   * Optional - will use the subscription scope if not provided
   */
  readonly resourceGroupId?: string;

  /**
   * The lifecycle rules to ignore changes
   * Useful for properties that are externally managed
   *
   * @example ["tags", "securityRules"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Azure Network Security Group implementation
 *
 * This class provides a single, version-aware implementation that replaces
 * version-specific Network Security Group classes. It automatically handles version
 * resolution, schema validation, and property transformation while maintaining
 * full backward compatibility.
 *
 * @example
 * // Basic usage with automatic version resolution:
 * const nsg = new NetworkSecurityGroup(this, "nsg", {
 *   name: "my-nsg",
 *   location: "eastus",
 *   securityRules: [{
 *     name: "allow-ssh",
 *     properties: {
 *       protocol: "Tcp",
 *       sourcePortRange: "*",
 *       destinationPortRange: "22",
 *       sourceAddressPrefix: "*",
 *       destinationAddressPrefix: "*",
 *       access: "Allow",
 *       priority: 100,
 *       direction: "Inbound"
 *     }
 *   }]
 * });
 *
 * @example
 * // Usage with explicit version pinning:
 * const nsg = new NetworkSecurityGroup(this, "nsg", {
 *   name: "my-nsg",
 *   location: "eastus",
 *   apiVersion: "2024-07-01",
 *   securityRules: [...]
 * });
 *
 * @stability stable
 */
export class NetworkSecurityGroup extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      NETWORK_SECURITY_GROUP_TYPE,
      ALL_NETWORK_SECURITY_GROUP_VERSIONS,
    );
  }

  /**
   * The input properties for this Network Security Group instance
   */
  public readonly props: NetworkSecurityGroupProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly securityRulesOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;

  // Public properties that match the original NetworkSecurityGroup interface

  /**
   * Creates a new Azure Network Security Group using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation. It maintains full backward compatibility
   * with existing Network Security Group implementations.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Network Security Group
   */
  constructor(scope: Construct, id: string, props: NetworkSecurityGroupProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Network Security Group",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Network Security Group",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Network Security Group",
    });

    this.securityRulesOutput = new cdktf.TerraformOutput(
      this,
      "securityRules",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.securityRules}`,
        description: "Security rules of the Network Security Group",
      },
    );

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Network Security Group",
    });

    // Override logical IDs to match original naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.locationOutput.overrideLogicalId("location");
    this.securityRulesOutput.overrideLogicalId("securityRules");
    this.tagsOutput.overrideLogicalId("tags");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM VersionedAzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   * Returns the most recent stable version as the default
   */
  protected defaultVersion(): string {
    return "2024-10-01";
  }

  /**
   * Gets the Azure resource type for Network Security Groups
   */
  protected resourceType(): string {
    return NETWORK_SECURITY_GROUP_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   * Uses the framework's schema resolution to get the appropriate schema
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Network Security Groups
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   * Transforms the input properties into the JSON format expected by Azure REST API
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as NetworkSecurityGroupProps;
    return {
      location: this.location,
      tags: this.allTags(),
      properties: {
        securityRules: typedProps.securityRules,
        flushConnection: typedProps.flushConnection || false,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR NETWORK SECURITY GROUP OPERATIONS
  // =============================================================================

  /**
   * Get the subscription ID from the Network Security Group ID
   * Extracts the subscription ID from the Azure resource ID format
   */
  public get subscriptionId(): string {
    const idParts = this.id.split("/");
    const subscriptionIndex = idParts.indexOf("subscriptions");
    if (subscriptionIndex !== -1 && subscriptionIndex + 1 < idParts.length) {
      return idParts[subscriptionIndex + 1];
    }
    throw new Error(
      "Unable to extract subscription ID from Network Security Group ID",
    );
  }

  /**
   * Get the full resource identifier for use in other Azure resources
   * Alias for the id property to match original interface
   */
  public get resourceId(): string {
    return this.id;
  }

  /**
   * Get the security rules output value
   * Returns the Terraform interpolation string for the security rules
   */
  public get securityRules(): string {
    return `\${${this.terraformResource.fqn}.output.properties.securityRules}`;
  }

  /**
   * Add a tag to the Network Security Group
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Network Security Group
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
