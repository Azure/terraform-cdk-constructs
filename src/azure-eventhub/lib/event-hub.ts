/**
 * Azure Event Hub (entity) implementation using the AzapiResource framework
 *
 * This class provides a version-aware implementation for Azure Event Hubs
 * (Microsoft.EventHub/namespaces/eventhubs) that automatically handles version
 * management, schema validation, and property transformation across all
 * supported API versions.
 *
 * Supported API Versions:
 * - 2024-01-01 (Active, Latest)
 * - 2021-11-01 (Active, Backward Compatibility)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full JSII compliance for multi-language support
 * - Child resource with proper parent ID construction
 * - Partition count and message retention configuration
 */

import * as cdktn from "cdktn";
import { Construct } from "constructs";
import { ALL_EVENT_HUB_VERSIONS, EVENT_HUB_TYPE } from "./event-hub-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the Azure Event Hub (entity)
 *
 * Extends AzapiResourceProps with Event Hub specific properties
 */
export interface EventhubProps extends AzapiResourceProps {
  /**
   * Name of the parent Event Hubs namespace
   * Required for constructing the parent ID
   */
  readonly namespaceName: string;

  /**
   * Optional: Full resource ID of the parent Event Hubs namespace
   * When provided, creates a proper Terraform dependency on the namespace.
   * If not provided, the parent ID will be constructed from `resourceGroupId`
   * and `namespaceName`.
   */
  readonly namespaceId?: string;

  /**
   * Resource group ID where the parent namespace exists
   * Required for constructing the parent ID
   */
  readonly resourceGroupId: string;

  /**
   * Number of partitions for the Event Hub
   *
   * Partitions are immutable after creation. Valid range depends on the
   * namespace tier (1-32 for Standard, up to 1024 for Premium/Dedicated).
   *
   * @defaultValue 2
   */
  readonly partitionCount?: number;

  /**
   * Number of days to retain events
   *
   * Valid range is 1-7 for Standard tier, and up to 90 for Premium/Dedicated.
   *
   * @defaultValue 1
   */
  readonly messageRetentionInDays?: number;

  /**
   * Status of the Event Hub
   *
   * @defaultValue "Active"
   */
  readonly status?: "Active" | "Disabled" | "SendDisabled" | "ReceiveDisabled";
}

/**
 * Azure Event Hub (entity) implementation
 *
 * This class provides a single, version-aware implementation that automatically
 * handles version resolution, schema validation, and property transformation
 * while maintaining full JSII compliance.
 *
 * **Child Resource Pattern**: Event Hubs are child resources of Event Hubs
 * Namespaces. This implementation overrides the `resolveParentId()` method to
 * properly construct the namespace ID as the parent.
 *
 * @example
 * // Basic Event Hub within a namespace:
 * const hub = new Eventhub(this, "my-hub", {
 *   name: "my-event-hub",
 *   namespaceName: "my-eventhub-ns",
 *   resourceGroupId: resourceGroup.id,
 *   partitionCount: 4,
 *   messageRetentionInDays: 3,
 * });
 *
 * @example
 * // Event Hub with an explicit namespace reference (creates a dependency):
 * const hub = new Eventhub(this, "my-hub", {
 *   name: "my-event-hub",
 *   namespaceName: namespace.props.name!,
 *   namespaceId: namespace.id,
 *   resourceGroupId: resourceGroup.id,
 * });
 *
 * @stability stable
 */
export class Eventhub extends AzapiResource {
  static {
    AzapiResource.registerSchemas(EVENT_HUB_TYPE, ALL_EVENT_HUB_VERSIONS);
  }

  /**
   * The input properties for this Event Hub instance
   */
  public readonly props: EventhubProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktn.TerraformOutput;
  public readonly nameOutput: cdktn.TerraformOutput;

  /**
   * Creates a new Azure Event Hub using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Event Hub
   */
  constructor(scope: Construct, id: string, props: EventhubProps) {
    // Validate partition count if provided
    if (props.partitionCount !== undefined) {
      if (props.partitionCount < 1 || props.partitionCount > 1024) {
        throw new Error("partitionCount must be between 1 and 1024");
      }
    }

    // Validate message retention if provided
    if (props.messageRetentionInDays !== undefined) {
      if (
        props.messageRetentionInDays < 1 ||
        props.messageRetentionInDays > 90
      ) {
        throw new Error("messageRetentionInDays must be between 1 and 90");
      }
    }

    // Event Hubs (entities) do not support tags at the resource level.
    // Strip tags from props before passing to the parent constructor to prevent
    // the AZAPI provider from including tags in the resource body.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tags: _unusedTags, ...propsWithoutTags } = props;
    super(scope, id, propsWithoutTags as EventhubProps);

    this.props = props;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktn.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Event Hub",
    });

    this.nameOutput = new cdktn.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Event Hub",
    });

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
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
   * Gets the Azure resource type for Event Hubs
   */
  protected resourceType(): string {
    return EVENT_HUB_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Creates the resource body for the Azure API call
   * Transforms the input properties into the JSON format expected by Azure REST API
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as EventhubProps;

    const body: any = {
      properties: {
        partitionCount: typedProps.partitionCount ?? 2,
        messageRetentionInDays: typedProps.messageRetentionInDays ?? 1,
      },
    };

    if (typedProps.status) {
      body.properties.status = typedProps.status;
    }

    return body;
  }

  /**
   * Resolves the parent ID for the Event Hub resource.
   *
   * Event Hubs are child resources of Event Hubs Namespaces. This method
   * overrides the default parent ID resolution to return the namespace ID
   * instead of the Resource Group ID.
   *
   * @param props - The resource properties
   * @returns The Event Hubs Namespace ID (parent resource ID)
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as EventhubProps;
    return (
      typedProps.namespaceId ||
      `${typedProps.resourceGroupId}/providers/Microsoft.EventHub/namespaces/${typedProps.namespaceName}`
    );
  }

  /**
   * Event Hubs inherit location from their parent namespace, so no parent
   * resource reference is needed for location resolution.
   */
  protected parentResourceForLocation(): AzapiResource | undefined {
    return undefined;
  }
}
