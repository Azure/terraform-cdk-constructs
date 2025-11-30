/**
 * Unified Azure Resource Group implementation using VersionedAzapiResource framework
 *
 * This class replaces all version-specific Resource Group implementations with a single
 * unified class that automatically handles version management, schema validation, and
 * property transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2024-11-01 (Active)
 * - 2025-01-01 (Active)
 * - 2025-03-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full backward compatibility with existing Resource Group interface
 * - JSII compliance for multi-language support
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_RESOURCE_GROUP_VERSIONS,
  RESOURCE_GROUP_TYPE,
} from "./resource-group-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { DataAzapiClientConfig } from "../../core-azure/lib/azapi/providers-azapi/data-azapi-client-config";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the unified Azure Resource Group
 *
 * Extends VersionedAzapiResourceProps with Resource Group specific properties
 * while maintaining full compatibility with the original GroupProps interface.
 */
export interface ResourceGroupProps extends AzapiResourceProps {
  /**
   * Managed by information for the resource group.
   * Indicates what service or tool is managing this resource group.
   */
  readonly managedBy?: string;

  /**
   * The lifecycle rules to ignore changes.
   * Useful for properties that are externally managed or should not trigger updates.
   *
   * @example ["tags", "managedBy"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * The resource body interface for Azure Resource Group API calls
 * This matches the Azure REST API schema for resource groups
 */
export interface ResourceGroupBody {
  /**
   * The location of the resource group. Cannot be changed after creation.
   */
  readonly location: string;

  /**
   * The tags attached to the resource group.
   */
  readonly tags?: { [key: string]: string };

  /**
   * The ID of the resource that manages this resource group.
   */
  readonly managedBy?: string;
}

/**
 * Unified Azure Resource Group implementation
 *
 * This class provides a single, version-aware implementation that replaces all
 * version-specific Resource Group classes. It automatically handles version
 * resolution, schema validation, and property transformation while maintaining
 * full backward compatibility.
 *
 * The class uses the VersionedAzapiResource framework to provide:
 * - Automatic latest version resolution (2025-03-01 as of this implementation)
 * - Support for explicit version pinning when stability is required
 * - Schema-driven property validation and transformation
 * - Migration analysis and deprecation warnings
 * - Full JSII compliance for multi-language support
 *
 * @example
 * // Basic usage with automatic version resolution:
 * const resourceGroup = new ResourceGroup(this, "rg", {
 *   name: "my-resource-group",
 *   location: "eastus",
 *   tags: { environment: "production" }
 * });
 *
 * @example
 * // Usage with explicit version pinning:
 * const resourceGroup = new ResourceGroup(this, "rg", {
 *   name: "my-resource-group",
 *   location: "eastus",
 *   apiVersion: "2024-11-01", // Pin to specific version
 *   tags: { environment: "production" }
 * });
 *
 * @stability stable
 */
export class ResourceGroup extends AzapiResource {
  // Static initializer runs once when the class is first loaded
  static {
    AzapiResource.registerSchemas(
      RESOURCE_GROUP_TYPE,
      ALL_RESOURCE_GROUP_VERSIONS,
    );
  }

  /**
   * The input properties for this Resource Group instance
   */
  public readonly props: ResourceGroupProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;

  /**
   * Creates a new Azure Resource Group using the VersionedAzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation. It maintains full backward compatibility
   * with existing Resource Group implementations.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Resource Group
   */
  constructor(scope: Construct, id: string, props: ResourceGroupProps) {
    super(scope, id, props);

    this.props = props;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Resource Group",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Resource Group",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Resource Group",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Resource Group",
    });

    // Override logical IDs to match original naming convention
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
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
    return "2025-03-01";
  }

  /**
   * Gets the Azure resource type for Resource Groups
   */
  protected resourceType(): string {
    return RESOURCE_GROUP_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   * Uses the framework's schema resolution to get the appropriate schema
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Resource Groups
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   * Transforms the input properties into the JSON format expected by Azure REST API
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as ResourceGroupProps;

    return {
      location: this.location,
      tags: this.allTags(),
      managedBy: typedProps.managedBy,
    };
  }

  /**
   * Resolves the parent ID for Resource Groups
   * Resource Groups are top-level resources with subscription as parent
   */
  protected resolveParentId(_props: any): string {
    const clientConfig = new DataAzapiClientConfig(this, "client_config", {});
    return `/subscriptions/\${${clientConfig.fqn}.subscription_id}`;
  }

  // =============================================================================
  // PUBLIC METHODS FOR RESOURCE GROUP OPERATIONS
  // =============================================================================

  /**
   * Get the subscription ID from the Resource Group ID
   * Extracts the subscription ID from the Azure resource ID format
   */
  public get subscriptionId(): string {
    const idParts = this.id.split("/");
    const subscriptionIndex = idParts.indexOf("subscriptions");
    if (subscriptionIndex !== -1 && subscriptionIndex + 1 < idParts.length) {
      return idParts[subscriptionIndex + 1];
    }
    throw new Error("Unable to extract subscription ID from Resource Group ID");
  }

  /**
   * Get the full resource identifier for use in other Azure resources
   * Alias for the id property to match original interface
   */
  public get resourceId(): string {
    return this.id;
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Applies ignore changes lifecycle rules if specified in props
   */
  private _applyIgnoreChanges(): void {
    if (this.props.ignoreChanges && this.props.ignoreChanges.length > 0) {
      // Filter out properties that are not valid for AZAPI resource ignore_changes
      // managedBy should be in the resource body, not in ignore_changes
      const validIgnoreChanges = this.props.ignoreChanges.filter(
        (change) => change !== "managedBy",
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

// =============================================================================
// BACKWARD COMPATIBILITY EXPORTS
// =============================================================================

/**
 * Alias for ResourceGroup to maintain backward compatibility
 * @deprecated Use ResourceGroup instead
 */
export const Group = ResourceGroup;

/**
 * Type alias for ResourceGroupProps to maintain backward compatibility
 * @deprecated Use ResourceGroupProps instead
 */
export type GroupProps = ResourceGroupProps;

/**
 * Type alias for ResourceGroupBody to maintain backward compatibility
 * @deprecated Use ResourceGroupBody instead
 */
export type GroupBody = ResourceGroupBody;
