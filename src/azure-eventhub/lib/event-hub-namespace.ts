/**
 * Azure Event Hubs Namespace implementation using the AzapiResource framework
 *
 * This class provides a version-aware implementation for Azure Event Hubs
 * Namespaces (Microsoft.EventHub/namespaces) that automatically handles version
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
 * - SKU management (Basic, Standard, Premium)
 * - Auto-inflate throughput configuration
 * - Public network access and minimum TLS controls
 * - Managed identity support
 */

import * as cdktn from "cdktn";
import { Construct } from "constructs";
import {
  ALL_EVENT_HUB_NAMESPACE_VERSIONS,
  EVENT_HUB_NAMESPACE_TYPE,
} from "./event-hub-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * SKU configuration for an Event Hubs Namespace
 */
export interface EventhubNamespaceSku {
  /**
   * The SKU name for the namespace
   *
   * Available options:
   * - "Basic" - Basic tier (1 consumer group, 100 brokered connections)
   * - "Standard" - Standard tier (20 consumer groups, auto-inflate support)
   * - "Premium" - Premium tier (dedicated capacity, higher limits)
   *
   * @defaultValue "Standard"
   */
  readonly name: "Basic" | "Standard" | "Premium";

  /**
   * The billing tier of the namespace
   *
   * If not provided, defaults to the same value as `name`.
   */
  readonly tier?: "Basic" | "Standard" | "Premium";

  /**
   * The number of throughput units (Standard) or capacity units (Premium)
   *
   * Only applicable to Standard and Premium tiers.
   */
  readonly capacity?: number;
}

/**
 * Managed identity configuration for the namespace
 */
export interface EventhubNamespaceIdentity {
  /**
   * Type of managed identity
   */
  readonly type:
    | "SystemAssigned"
    | "UserAssigned"
    | "SystemAssigned,UserAssigned"
    | "None";

  /**
   * User-assigned identity resource IDs
   * Required when type includes UserAssigned
   */
  readonly userAssignedIdentities?: { [key: string]: any };
}

/**
 * Properties for the Azure Event Hubs Namespace
 *
 * Extends AzapiResourceProps with Event Hubs Namespace specific properties
 */
export interface EventhubNamespaceProps extends AzapiResourceProps {
  /**
   * Resource Group ID where the namespace will be created
   */
  readonly resourceGroupId: string;

  /**
   * SKU configuration for the namespace
   *
   * @defaultValue { name: "Standard" }
   */
  readonly sku?: EventhubNamespaceSku;

  /**
   * Whether to enable zone redundancy for the namespace
   */
  readonly zoneRedundant?: boolean;

  /**
   * Whether auto-inflate is enabled for the namespace (Standard tier)
   *
   * When enabled, throughput units automatically scale up to
   * `maximumThroughputUnits` based on load.
   */
  readonly isAutoInflateEnabled?: boolean;

  /**
   * The upper limit of throughput units when auto-inflate is enabled
   *
   * Valid values are between 0 and 40.
   */
  readonly maximumThroughputUnits?: number;

  /**
   * The minimum TLS version supported by the namespace
   *
   * @defaultValue "1.2"
   */
  readonly minimumTlsVersion?: "1.0" | "1.1" | "1.2";

  /**
   * Whether public network access is allowed for the namespace
   *
   * @defaultValue "Enabled"
   */
  readonly publicNetworkAccess?: "Enabled" | "Disabled";

  /**
   * Whether to disable SAS (local) authentication
   *
   * When enabled, only Azure AD authentication is allowed.
   */
  readonly disableLocalAuth?: boolean;

  /**
   * Managed identity configuration for the namespace
   */
  readonly identity?: EventhubNamespaceIdentity;
}

/**
 * Azure Event Hubs Namespace implementation
 *
 * This class provides a single, version-aware implementation that automatically
 * handles version resolution, schema validation, and property transformation
 * while maintaining full JSII compliance.
 *
 * An Event Hubs Namespace is a management container for Event Hubs. It provides
 * DNS-integrated network endpoints and a range of access control and network
 * integration management features.
 *
 * @example
 * // Basic Event Hubs Namespace with default settings:
 * const namespace = new EventhubNamespace(this, "my-namespace", {
 *   name: "my-eventhub-ns",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 * });
 *
 * @example
 * // Standard namespace with auto-inflate:
 * const namespace = new EventhubNamespace(this, "production-namespace", {
 *   name: "prod-eventhub-ns",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   sku: { name: "Standard", capacity: 2 },
 *   isAutoInflateEnabled: true,
 *   maximumThroughputUnits: 10,
 * });
 *
 * @stability stable
 */
export class EventhubNamespace extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      EVENT_HUB_NAMESPACE_TYPE,
      ALL_EVENT_HUB_NAMESPACE_VERSIONS,
    );
  }

  /**
   * The input properties for this Event Hubs Namespace instance
   */
  public readonly props: EventhubNamespaceProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktn.TerraformOutput;
  public readonly nameOutput: cdktn.TerraformOutput;

  /**
   * Creates a new Azure Event Hubs Namespace using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Event Hubs Namespace
   */
  constructor(scope: Construct, id: string, props: EventhubNamespaceProps) {
    // Validate maximum throughput units if provided
    if (props.maximumThroughputUnits !== undefined) {
      if (
        props.maximumThroughputUnits < 0 ||
        props.maximumThroughputUnits > 40
      ) {
        throw new Error("maximumThroughputUnits must be between 0 and 40");
      }
    }

    super(scope, id, props);

    this.props = props;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktn.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Event Hubs Namespace",
    });

    this.nameOutput = new cdktn.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Event Hubs Namespace",
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
   * Gets the Azure resource type for Event Hubs Namespaces
   */
  protected resourceType(): string {
    return EVENT_HUB_NAMESPACE_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
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
   * Transforms the input properties into the JSON format expected by Azure REST API
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as EventhubNamespaceProps;

    const skuName = typedProps.sku?.name ?? "Standard";
    const sku: any = {
      name: skuName,
      tier: typedProps.sku?.tier ?? skuName,
    };
    if (typedProps.sku?.capacity !== undefined) {
      sku.capacity = typedProps.sku.capacity;
    }

    const body: any = {
      sku,
      properties: {
        minimumTlsVersion: typedProps.minimumTlsVersion ?? "1.2",
        publicNetworkAccess: typedProps.publicNetworkAccess ?? "Enabled",
      },
    };

    if (typedProps.zoneRedundant !== undefined) {
      body.properties.zoneRedundant = typedProps.zoneRedundant;
    }

    if (typedProps.isAutoInflateEnabled !== undefined) {
      body.properties.isAutoInflateEnabled = typedProps.isAutoInflateEnabled;
    }

    if (typedProps.maximumThroughputUnits !== undefined) {
      body.properties.maximumThroughputUnits =
        typedProps.maximumThroughputUnits;
    }

    if (typedProps.disableLocalAuth !== undefined) {
      body.properties.disableLocalAuth = typedProps.disableLocalAuth;
    }

    if (typedProps.identity) {
      body.identity = typedProps.identity;
    }

    return body;
  }

  /**
   * Resolves the parent resource ID for the Event Hubs Namespace
   * Event Hubs Namespaces are top-level resources within a resource group
   *
   * @param props - The resource properties
   * @returns The parent resource ID (the resource group)
   */
  protected resolveParentId(props: any): string {
    return (props as EventhubNamespaceProps).resourceGroupId;
  }
}
