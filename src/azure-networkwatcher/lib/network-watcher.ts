/**
 * Unified Azure Network Watcher implementation using AzapiResource framework
 *
 * This class provides a version-aware implementation for Azure Network Watcher
 * that automatically handles version management, schema validation, and property
 * transformation across all supported API versions.
 *
 * IMPORTANT: Azure only allows one Network Watcher per subscription per region.
 * If you attempt to create a Network Watcher in a region where one already exists,
 * the deployment will fail.
 *
 * Supported API Versions:
 * - 2024-01-01 (Active, Latest)
 * - 2023-11-01 (Active, Backward Compatibility)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full JSII compliance for multi-language support
 *
 * Network Watcher is primarily used as a dependency for other Network Watcher features:
 * - Flow Logs
 * - Connection Monitor
 * - Packet Capture
 * - Network Diagnostic Tools
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_NETWORK_WATCHER_VERSIONS,
  NETWORK_WATCHER_TYPE,
} from "./network-watcher-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the unified Azure Network Watcher
 *
 * Extends AzapiResourceProps with Network Watcher specific properties.
 *
 * IMPORTANT: Azure only allows one Network Watcher per subscription per region.
 * Attempting to create multiple Network Watchers in the same region will fail.
 */
export interface NetworkWatcherProps extends AzapiResourceProps {
  /**
   * Resource Group ID where the Network Watcher will be created
   *
   * The Network Watcher will be created as a child of this resource group.
   * It's recommended to use a dedicated resource group for Network Watchers,
   * as Azure automatically creates one named "NetworkWatcherRG" when certain
   * network features are used.
   */
  readonly resourceGroupId: string;
}

/**
 * The resource body interface for Azure Network Watcher API calls
 *
 * Network Watcher is a simple resource with minimal properties.
 * The properties block is typically empty.
 */
export interface NetworkWatcherBody {
  readonly properties: { [key: string]: any };
}

/**
 * Unified Azure Network Watcher implementation
 *
 * This class provides a single, version-aware implementation that automatically handles version
 * resolution, schema validation, and property transformation while maintaining full JSII compliance.
 *
 * Network Watcher is a regional service that provides tools to monitor, diagnose, and gain
 * insights into your network health and performance in Azure. It serves as the anchor for
 * Network Watcher features like Flow Logs, Connection Monitor, and Packet Capture.
 *
 * IMPORTANT CONSTRAINT: Azure only allows one Network Watcher per subscription per region.
 * If you need Network Watcher functionality in multiple regions, you must create a separate
 * Network Watcher for each region.
 *
 * @example
 * // Basic Network Watcher:
 * const networkWatcher = new NetworkWatcher(this, "network-watcher", {
 *   name: "nw-eastus",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 * });
 *
 * @example
 * // Network Watcher with specific API version:
 * const networkWatcher = new NetworkWatcher(this, "network-watcher", {
 *   name: "nw-westus2",
 *   location: "westus2",
 *   resourceGroupId: resourceGroup.id,
 *   apiVersion: "2024-01-01",
 *   tags: {
 *     environment: "production",
 *   },
 * });
 *
 * @example
 * // Network Watcher for use with Flow Logs:
 * const networkWatcher = new NetworkWatcher(this, "network-watcher", {
 *   name: "NetworkWatcher_eastus",
 *   location: "eastus",
 *   resourceGroupId: networkWatcherRg.id,
 * });
 *
 * // Then use it with NSG Flow Logs
 * const flowLog = new NsgFlowLog(this, "flow-log", {
 *   networkWatcherId: networkWatcher.id,
 *   // ... other properties
 * });
 *
 * @stability stable
 */
export class NetworkWatcher extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      NETWORK_WATCHER_TYPE,
      ALL_NETWORK_WATCHER_VERSIONS,
    );
  }

  /**
   * The input properties for this Network Watcher instance
   */
  public readonly props: NetworkWatcherProps;

  // Output properties for easy access and referencing
  /**
   * Terraform output for the Network Watcher resource ID
   */
  public readonly idOutput: cdktf.TerraformOutput;

  /**
   * Terraform output for the Network Watcher name
   */
  public readonly nameOutput: cdktf.TerraformOutput;

  /**
   * Terraform output for the Network Watcher location
   */
  public readonly locationOutput: cdktf.TerraformOutput;

  /**
   * Terraform output for the Network Watcher provisioning state
   */
  public readonly provisioningStateOutput: cdktf.TerraformOutput;

  /**
   * Creates a new Azure Network Watcher using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * IMPORTANT: Azure only allows one Network Watcher per subscription per region.
   * Attempting to create a Network Watcher in a region where one already exists
   * will result in a deployment error.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Network Watcher
   */
  constructor(scope: Construct, id: string, props: NetworkWatcherProps) {
    super(scope, id, props);

    this.props = props;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Network Watcher",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Network Watcher",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.output.location}`,
      description: "The location of the Network Watcher",
    });

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioning_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the Network Watcher",
      },
    );

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.locationOutput.overrideLogicalId("location");
    this.provisioningStateOutput.overrideLogicalId("provisioning_state");
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   * Returns the latest stable version as the default
   */
  protected defaultVersion(): string {
    return "2024-01-01";
  }

  /**
   * Gets the Azure resource type for Network Watcher
   */
  protected resourceType(): string {
    return NETWORK_WATCHER_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   * Uses the framework's schema resolution to get the appropriate schema
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that this resource type requires a location
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   *
   * Network Watcher is a simple resource with an empty properties block.
   * All configuration is handled at the resource level (name, location, tags).
   */
  protected createResourceBody(_props: any): any {
    // Network Watcher has an empty properties block
    // The resource is configured primarily through name, location, and tags
    const body: any = {
      properties: {},
    };

    return body;
  }

  /**
   * Resolves the parent resource ID for Network Watcher
   * Network Watcher is a top-level resource within a resource group
   *
   * @param props - The resource properties
   * @returns The parent resource ID (the resource group)
   */
  protected resolveParentId(props: any): string {
    return (props as NetworkWatcherProps).resourceGroupId;
  }
}
