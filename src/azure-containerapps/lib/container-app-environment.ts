/**
 * Unified Azure Container App Managed Environment implementation using AzapiResource framework
 *
 * This class provides a single, version-aware implementation that automatically handles
 * version management, schema validation, and property transformation across all
 * supported API versions.
 *
 * Supported API Versions:
 * - 2024-03-01 (Active)
 * - 2025-07-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full backward compatibility with existing interface
 * - JSII compliance for multi-language support
 * - Log Analytics and Azure Monitor integration
 * - VNet injection for network isolation
 * - Workload profiles for compute customization
 * - Zone redundancy for high availability
 * - Peer authentication (mTLS) and traffic encryption (2025-07-01+)
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_CONTAINER_APP_ENVIRONMENT_VERSIONS,
  CONTAINER_APP_ENVIRONMENT_TYPE,
} from "./container-app-environment-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

// =============================================================================
// SUPPORTING INTERFACES
// =============================================================================

/**
 * Log Analytics configuration for the Container App Environment
 */
export interface ContainerAppEnvironmentLogAnalyticsConfig {
  /**
   * Log Analytics workspace customer ID (workspace ID)
   */
  readonly customerId: string;

  /**
   * Log Analytics workspace shared key
   */
  readonly sharedKey: string;
}

/**
 * Application logs configuration for the Container App Environment
 */
export interface ContainerAppEnvironmentAppLogsConfig {
  /**
   * Logs destination. Can be 'log-analytics', 'azure-monitor', or 'none'.
   * @default "log-analytics"
   */
  readonly destination?: string;

  /**
   * Log Analytics configuration. Required when destination is 'log-analytics'.
   */
  readonly logAnalyticsConfiguration?: ContainerAppEnvironmentLogAnalyticsConfig;
}

/**
 * VNet configuration for the Container App Environment
 */
export interface ContainerAppEnvironmentVnetConfig {
  /**
   * Resource ID of a subnet for infrastructure components.
   * Must be at least /21 for consumption-only environments or /23 for workload profile environments.
   */
  readonly infrastructureSubnetId?: string;

  /**
   * Whether the environment only has an internal load balancer (no public endpoint).
   * @default false
   */
  readonly internal?: boolean;
}

/**
 * Workload profile configuration
 */
export interface ContainerAppEnvironmentWorkloadProfile {
  /**
   * Friendly name of the workload profile
   */
  readonly name: string;

  /**
   * Workload profile type. Values include 'Consumption', 'GeneralPurpose',
   * 'MemoryOptimized', 'ComputeOptimized', 'D4', 'D8', 'D16', 'D32',
   * 'E4', 'E8', 'E16', 'E32'.
   */
  readonly workloadProfileType: string;

  /**
   * Minimum number of instances for this workload profile (not applicable for Consumption).
   */
  readonly minimumCount?: number;

  /**
   * Maximum number of instances for this workload profile (not applicable for Consumption).
   */
  readonly maximumCount?: number;
}

/**
 * Custom domain configuration for the environment
 */
export interface ContainerAppEnvironmentCustomDomainConfig {
  /**
   * Custom DNS suffix for the environment
   */
  readonly dnsSuffix?: string;

  /**
   * PFX or PEM certificate value (base64 encoded)
   */
  readonly certificateValue?: string;

  /**
   * Certificate password
   */
  readonly certificatePassword?: string;
}

/**
 * Mutual TLS settings for peer authentication
 */
export interface ContainerAppEnvironmentMtlsConfig {
  /**
   * Whether mTLS is enabled
   */
  readonly enabled?: boolean;
}

/**
 * Peer authentication settings (mTLS) for the Managed Environment.
 * Available in API version 2025-07-01+.
 */
export interface ContainerAppEnvironmentPeerAuthentication {
  /**
   * Mutual TLS settings
   */
  readonly mtls?: ContainerAppEnvironmentMtlsConfig;
}

/**
 * Encryption settings for peer traffic
 */
export interface ContainerAppEnvironmentEncryptionConfig {
  /**
   * Whether encryption is enabled
   */
  readonly enabled?: boolean;
}

/**
 * Peer traffic encryption settings for the Managed Environment.
 * Available in API version 2025-07-01+.
 */
export interface ContainerAppEnvironmentPeerTrafficConfig {
  /**
   * Encryption settings
   */
  readonly encryption?: ContainerAppEnvironmentEncryptionConfig;
}

/**
 * Ingress configuration settings for the Managed Environment.
 * Available in API version 2025-07-01+.
 */
export interface ContainerAppEnvironmentIngressConfig {
  /**
   * Workload profile name for the ingress component
   */
  readonly workloadProfileName?: string;

  /**
   * Termination grace period in seconds
   */
  readonly terminationGracePeriodSeconds?: number;

  /**
   * Header count limit
   */
  readonly headerCountLimit?: number;

  /**
   * Request idle timeout in seconds
   */
  readonly requestIdleTimeout?: number;
}

// =============================================================================
// MAIN PROPS INTERFACE
// =============================================================================

/**
 * Properties for the unified Azure Container App Environment
 *
 * Extends AzapiResourceProps with Container App Environment specific properties
 */
export interface ContainerAppEnvironmentProps extends AzapiResourceProps {
  /**
   * Application logs configuration
   */
  readonly appLogsConfiguration?: ContainerAppEnvironmentAppLogsConfig;

  /**
   * VNet configuration for the environment
   */
  readonly vnetConfiguration?: ContainerAppEnvironmentVnetConfig;

  /**
   * Workload profiles configured for the Managed Environment
   */
  readonly workloadProfiles?: ContainerAppEnvironmentWorkloadProfile[];

  /**
   * Whether or not this Managed Environment is zone-redundant.
   * @default false
   */
  readonly zoneRedundant?: boolean;

  /**
   * Azure Monitor instrumentation key used by Dapr to export
   * Service to Service communication telemetry
   */
  readonly daprAIInstrumentationKey?: string;

  /**
   * Application Insights connection string used by Dapr to export
   * Service to Service communication telemetry
   */
  readonly daprAIConnectionString?: string;

  /**
   * Custom domain configuration for the environment
   */
  readonly customDomainConfiguration?: ContainerAppEnvironmentCustomDomainConfig;

  /**
   * Name of the platform-managed resource group created for the Managed Environment
   * to host infrastructure resources.
   */
  readonly infrastructureResourceGroup?: string;

  /**
   * Peer authentication settings for the Managed Environment (mTLS).
   * Available in API version 2025-07-01+.
   */
  readonly peerAuthentication?: ContainerAppEnvironmentPeerAuthentication;

  /**
   * Peer traffic settings for the Managed Environment (encryption).
   * Available in API version 2025-07-01+.
   */
  readonly peerTrafficConfiguration?: ContainerAppEnvironmentPeerTrafficConfig;

  /**
   * Ingress configuration for the Managed Environment.
   * Available in API version 2025-07-01+.
   */
  readonly ingressConfiguration?: ContainerAppEnvironmentIngressConfig;

  /**
   * Property to allow or block all public traffic.
   * Allowed Values: 'Enabled', 'Disabled'.
   * Available in API version 2025-07-01+.
   */
  readonly publicNetworkAccess?: string;

  /**
   * The lifecycle rules to ignore changes.
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];

  /**
   * Resource group ID where the Container App Environment will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * The resource body interface for Azure Container App Environment API calls
 */
export interface ContainerAppEnvironmentBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties?: any;
}

// =============================================================================
// MAIN CLASS
// =============================================================================

/**
 * Unified Azure Container App Managed Environment implementation
 *
 * Azure Container App Environments provide the hosting infrastructure for
 * Container Apps. They manage the underlying Kubernetes cluster, networking,
 * and observability resources.
 *
 * Key features:
 * - Log Analytics and Azure Monitor integration for observability
 * - VNet injection for network isolation
 * - Workload profiles for compute customization (Consumption, Dedicated)
 * - Zone redundancy for high availability
 * - Custom domain support
 * - Dapr integration for microservice patterns
 * - Peer authentication (mTLS) and traffic encryption (2025-07-01+)
 *
 * @example
 * // Basic environment with Log Analytics:
 * const environment = new ContainerAppEnvironment(this, "env", {
 *   name: "my-container-env",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   appLogsConfiguration: {
 *     destination: "log-analytics",
 *     logAnalyticsConfiguration: {
 *       customerId: logAnalytics.workspaceId,
 *       sharedKey: logAnalytics.primarySharedKey,
 *     },
 *   },
 * });
 *
 * @example
 * // Environment with VNet injection and zone redundancy:
 * const environment = new ContainerAppEnvironment(this, "env", {
 *   name: "my-container-env",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   vnetConfiguration: {
 *     infrastructureSubnetId: subnet.id,
 *     internal: true,
 *   },
 *   zoneRedundant: true,
 * });
 *
 * @stability stable
 */
export class ContainerAppEnvironment extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      CONTAINER_APP_ENVIRONMENT_TYPE,
      ALL_CONTAINER_APP_ENVIRONMENT_VERSIONS,
    );
  }

  public readonly props: ContainerAppEnvironmentProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly defaultDomainOutput: cdktf.TerraformOutput;
  public readonly staticIpOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;

  /**
   * Creates a new Azure Container App Managed Environment
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Container App Environment
   */
  constructor(
    scope: Construct,
    id: string,
    props: ContainerAppEnvironmentProps,
  ) {
    super(scope, id, props);

    this.props = props;

    // Create Terraform outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Container App Environment",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Container App Environment",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Container App Environment",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Container App Environment",
    });

    this.defaultDomainOutput = new cdktf.TerraformOutput(
      this,
      "default_domain",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.defaultDomain}`,
        description: "The default domain of the Container App Environment",
      },
    );

    this.staticIpOutput = new cdktf.TerraformOutput(this, "static_ip", {
      value: `\${${this.terraformResource.fqn}.output.properties.staticIp}`,
      description: "The static IP of the Container App Environment",
    });

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioning_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the Container App Environment",
      },
    );

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.defaultDomainOutput.overrideLogicalId("default_domain");
    this.staticIpOutput.overrideLogicalId("static_ip");
    this.provisioningStateOutput.overrideLogicalId("provisioning_state");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2025-02-02-preview";
  }

  /**
   * Gets the Azure resource type for Container App Environments
   */
  protected resourceType(): string {
    return CONTAINER_APP_ENVIRONMENT_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Container App Environments
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as ContainerAppEnvironmentProps;

    const properties: any = {};

    // App logs configuration
    if (typedProps.appLogsConfiguration) {
      properties.appLogsConfiguration = typedProps.appLogsConfiguration;
    }

    // VNet configuration
    if (typedProps.vnetConfiguration) {
      properties.vnetConfiguration = typedProps.vnetConfiguration;
    }

    // Workload profiles
    if (typedProps.workloadProfiles) {
      properties.workloadProfiles = typedProps.workloadProfiles;
    }

    // Zone redundancy
    if (typedProps.zoneRedundant !== undefined) {
      properties.zoneRedundant = typedProps.zoneRedundant;
    }

    // Dapr AI instrumentation key
    if (typedProps.daprAIInstrumentationKey) {
      properties.daprAIInstrumentationKey = typedProps.daprAIInstrumentationKey;
    }

    // Dapr AI connection string
    if (typedProps.daprAIConnectionString) {
      properties.daprAIConnectionString = typedProps.daprAIConnectionString;
    }

    // Custom domain configuration
    if (typedProps.customDomainConfiguration) {
      properties.customDomainConfiguration =
        typedProps.customDomainConfiguration;
    }

    // Infrastructure resource group
    if (typedProps.infrastructureResourceGroup) {
      properties.infrastructureResourceGroup =
        typedProps.infrastructureResourceGroup;
    }

    // 2025-07-01+ properties
    if (typedProps.peerAuthentication) {
      properties.peerAuthentication = typedProps.peerAuthentication;
    }

    if (typedProps.peerTrafficConfiguration) {
      properties.peerTrafficConfiguration = typedProps.peerTrafficConfiguration;
    }

    if (typedProps.ingressConfiguration) {
      properties.ingressConfiguration = typedProps.ingressConfiguration;
    }

    if (typedProps.publicNetworkAccess) {
      properties.publicNetworkAccess = typedProps.publicNetworkAccess;
    }

    const body: ContainerAppEnvironmentBody = {
      location: this.location!,
      tags: this.allTags(),
      properties: Object.keys(properties).length > 0 ? properties : undefined,
    };

    return body;
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /**
   * Get the default domain of the Container App Environment
   */
  public get defaultDomain(): string {
    return `\${${this.terraformResource.fqn}.output.properties.defaultDomain}`;
  }

  /**
   * Get the static IP of the Container App Environment
   */
  public get staticIp(): string {
    return `\${${this.terraformResource.fqn}.output.properties.staticIp}`;
  }

  /**
   * Get the provisioning state of the Container App Environment
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Add a tag to the Container App Environment
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Container App Environment
   */
  public removeTag(key: string): void {
    if (this.props.tags && this.props.tags[key]) {
      delete this.props.tags[key];
    }
  }

  // =============================================================================
  // RESOURCE CONFIG CUSTOMIZATION
  // =============================================================================

  /**
   * Customizes the resource configuration to handle Azure value normalization.
   *
   * Azure normalizes values in API responses:
   * - Location: "eastus" → "East US"
   * - Enum values: "auto" → "Auto", "enabled" → "Enabled"
   *
   * This override:
   * 1. Removes `location` from the body (the framework passes it as a top-level
   *    attribute which the azapi provider normalizes properly)
   * 2. Enables `ignoreCasing` to suppress diffs from Azure's value normalization
   *    (e.g., "auto" vs "Auto" for transport, "enabled" vs "Enabled")
   */
  protected customizeResourceConfig(config: any): any {
    const updatedConfig = { ...config, ignoreCasing: true };

    // Remove location from body to prevent "East US" vs "eastus" drift
    // The framework handles location as a top-level azapi attribute instead
    if (updatedConfig.body && updatedConfig.body.location) {
      const { location: _location, ...bodyWithoutLocation } =
        updatedConfig.body;
      return {
        ...updatedConfig,
        body: bodyWithoutLocation,
        // Ensure location is set as top-level attribute
        location: updatedConfig.location || _location,
      };
    }
    return updatedConfig;
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Applies ignore changes lifecycle rules if specified in props
   */
  private _applyIgnoreChanges(): void {
    if (this.props.ignoreChanges && this.props.ignoreChanges.length > 0) {
      this.terraformResource.addOverride("lifecycle", [
        {
          ignore_changes: this.props.ignoreChanges,
        },
      ]);
    }
  }
}
