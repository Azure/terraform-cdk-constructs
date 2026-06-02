/**
 * Unified Azure Container App implementation using AzapiResource framework
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
 * - Ingress with external/internal access, TLS, CORS, sticky sessions
 * - Dapr sidecar integration for microservice patterns
 * - Horizontal scaling with HTTP, TCP, custom (KEDA), and Azure Queue rules
 * - Secrets management with Key Vault references
 * - Managed identity (SystemAssigned and UserAssigned)
 * - Init containers, volume mounts, and health probes
 * - Multiple revision mode for blue-green deployments
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_CONTAINER_APP_VERSIONS,
  CONTAINER_APP_TYPE,
} from "./container-app-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

// =============================================================================
// SUPPORTING INTERFACES
// =============================================================================

/**
 * Environment variable for a container
 */
export interface ContainerAppEnvVar {
  /**
   * Environment variable name
   */
  readonly name: string;

  /**
   * Non-secret environment variable value
   */
  readonly value?: string;

  /**
   * Name of the secret from which to pull the value
   */
  readonly secretRef?: string;
}

/**
 * Container resource requirements
 */
export interface ContainerAppContainerResources {
  /**
   * Required CPU in cores (e.g., 0.25, 0.5, 1.0, 2.0)
   */
  readonly cpu?: number;

  /**
   * Required memory (e.g., "0.5Gi", "1Gi", "2Gi")
   */
  readonly memory?: string;
}

/**
 * Volume mount for a container
 */
export interface ContainerAppVolumeMount {
  /**
   * Name of the volume to mount (must match a volume name)
   */
  readonly volumeName: string;

  /**
   * Path within the container to mount the volume
   */
  readonly mountPath: string;

  /**
   * Path within the volume from which the container's volume should be mounted
   */
  readonly subPath?: string;
}

/**
 * HTTP header for a probe
 */
export interface ContainerAppProbeHttpHeader {
  /**
   * The header field name
   */
  readonly name: string;

  /**
   * The header field value
   */
  readonly value: string;
}

/**
 * HTTP GET action for a probe
 */
export interface ContainerAppProbeHttpGet {
  /**
   * Path to access on the HTTP server
   */
  readonly path?: string;

  /**
   * Port number to access on the container
   */
  readonly port: number;

  /**
   * Scheme to use for connecting to the host (HTTP or HTTPS)
   */
  readonly scheme?: string;

  /**
   * Custom headers to set in the request
   */
  readonly httpHeaders?: ContainerAppProbeHttpHeader[];
}

/**
 * TCP socket action for a probe
 */
export interface ContainerAppProbeTcpSocket {
  /**
   * TCP port to connect to
   */
  readonly port: number;
}

/**
 * Container probe (liveness, readiness, or startup)
 */
export interface ContainerAppProbe {
  /**
   * The type of probe: Liveness, Readiness, or Startup
   */
  readonly type?: string;

  /**
   * HTTPGet specifies the HTTP request to perform
   */
  readonly httpGet?: ContainerAppProbeHttpGet;

  /**
   * TCPSocket specifies an action involving a TCP port
   */
  readonly tcpSocket?: ContainerAppProbeTcpSocket;

  /**
   * Number of seconds after the container has started before probes are initiated
   */
  readonly initialDelaySeconds?: number;

  /**
   * How often (in seconds) to perform the probe
   */
  readonly periodSeconds?: number;

  /**
   * Number of seconds after which the probe times out
   */
  readonly timeoutSeconds?: number;

  /**
   * Minimum consecutive successes for the probe to be considered successful
   */
  readonly successThreshold?: number;

  /**
   * Minimum consecutive failures for the probe to be considered failed
   */
  readonly failureThreshold?: number;
}

/**
 * Container definition
 */
export interface ContainerAppContainer {
  /**
   * Container image tag
   */
  readonly image: string;

  /**
   * Custom container name
   */
  readonly name: string;

  /**
   * Container resource requirements
   */
  readonly resources?: ContainerAppContainerResources;

  /**
   * Container environment variables
   */
  readonly env?: ContainerAppEnvVar[];

  /**
   * Container start command
   */
  readonly command?: string[];

  /**
   * Container start command arguments
   */
  readonly args?: string[];

  /**
   * List of probes for the container
   */
  readonly probes?: ContainerAppProbe[];

  /**
   * Container volume mounts
   */
  readonly volumeMounts?: ContainerAppVolumeMount[];
}

/**
 * Azure Queue scale rule configuration
 */
export interface ContainerAppAzureQueueScaleRule {
  /**
   * Azure Storage account name
   */
  readonly accountName?: string;

  /**
   * Azure Storage queue name
   */
  readonly queueName?: string;

  /**
   * Queue length threshold to trigger scaling
   */
  readonly queueLength?: number;

  /**
   * Managed identity to authenticate with the storage account
   */
  readonly identity?: string;
}

/**
 * Custom (KEDA) scale rule configuration
 */
export interface ContainerAppCustomScaleRule {
  /**
   * KEDA trigger type
   */
  readonly type: string;

  /**
   * Trigger metadata as key-value pairs
   */
  readonly metadata?: { [key: string]: string };

  /**
   * Managed identity for the custom scaler
   */
  readonly identity?: string;
}

/**
 * HTTP scale rule configuration
 */
export interface ContainerAppHttpScaleRule {
  /**
   * HTTP trigger metadata as key-value pairs
   */
  readonly metadata?: { [key: string]: string };
}

/**
 * TCP scale rule configuration
 */
export interface ContainerAppTcpScaleRule {
  /**
   * TCP trigger metadata as key-value pairs
   */
  readonly metadata?: { [key: string]: string };
}

/**
 * Scale rule definition
 */
export interface ContainerAppScaleRule {
  /**
   * Scale rule name
   */
  readonly name: string;

  /**
   * Azure Queue scale rule
   */
  readonly azureQueue?: ContainerAppAzureQueueScaleRule;

  /**
   * Custom scale rule (KEDA)
   */
  readonly custom?: ContainerAppCustomScaleRule;

  /**
   * HTTP scale rule
   */
  readonly http?: ContainerAppHttpScaleRule;

  /**
   * TCP scale rule
   */
  readonly tcp?: ContainerAppTcpScaleRule;
}

/**
 * Scale configuration for the Container App
 */
export interface ContainerAppScale {
  /**
   * Minimum number of replicas
   * @default 0
   */
  readonly minReplicas?: number;

  /**
   * Maximum number of replicas
   * @default 10
   */
  readonly maxReplicas?: number;

  /**
   * Cooldown period in seconds before scaling down (2025-07-01+)
   */
  readonly cooldownPeriod?: number;

  /**
   * Polling interval in seconds for checking scale rules (2025-07-01+)
   */
  readonly pollingInterval?: number;

  /**
   * Scaling rules
   */
  readonly rules?: ContainerAppScaleRule[];
}

/**
 * Volume definition for the Container App
 */
export interface ContainerAppVolume {
  /**
   * Volume name
   */
  readonly name: string;

  /**
   * Storage type: AzureFile, EmptyDir, NfsAzureFile, or Secret
   */
  readonly storageType?: string;

  /**
   * Name of the storage resource (for AzureFile and NfsAzureFile)
   */
  readonly storageName?: string;
}

/**
 * Service bind configuration (2025-07-01+)
 */
export interface ContainerAppServiceBind {
  /**
   * Resource ID of the service to bind to
   */
  readonly serviceId: string;

  /**
   * Name of the service binding
   */
  readonly name: string;
}

/**
 * Container App template
 */
export interface ContainerAppTemplate {
  /**
   * List of container definitions for the Container App
   */
  readonly containers: ContainerAppContainer[];

  /**
   * List of specialized containers that run before app containers
   */
  readonly initContainers?: ContainerAppContainer[];

  /**
   * Scaling properties for the Container App
   */
  readonly scale?: ContainerAppScale;

  /**
   * List of volume definitions for the Container App
   */
  readonly volumes?: ContainerAppVolume[];

  /**
   * User friendly suffix appended to the revision name
   */
  readonly revisionSuffix?: string;

  /**
   * Optional duration in seconds for graceful termination
   */
  readonly terminationGracePeriodSeconds?: number;

  /**
   * List of container app services bound to the app (2025-07-01+)
   */
  readonly serviceBinds?: ContainerAppServiceBind[];
}

/**
 * Traffic weight configuration for ingress
 */
export interface ContainerAppIngressTraffic {
  /**
   * Name of a revision
   */
  readonly revisionName?: string;

  /**
   * Indicates if this is the latest revision
   */
  readonly latestRevision?: boolean;

  /**
   * Traffic weight assigned to the revision
   */
  readonly weight?: number;

  /**
   * Associates a traffic label with a revision
   */
  readonly label?: string;
}

/**
 * IP security restriction for ingress
 */
export interface ContainerAppIngressIpSecurityRestriction {
  /**
   * Name for the restriction
   */
  readonly name: string;

  /**
   * Description of the restriction
   */
  readonly description?: string;

  /**
   * CIDR notation to match incoming IP address
   */
  readonly ipAddressRange: string;

  /**
   * Allow or Deny
   */
  readonly action: string;
}

/**
 * CORS policy for ingress
 */
export interface ContainerAppIngressCorsPolicy {
  /**
   * Allowed origins
   */
  readonly allowedOrigins?: string[];

  /**
   * Allowed methods
   */
  readonly allowedMethods?: string[];

  /**
   * Allowed headers
   */
  readonly allowedHeaders?: string[];

  /**
   * Expose headers
   */
  readonly exposeHeaders?: string[];

  /**
   * Max age in seconds
   */
  readonly maxAge?: number;

  /**
   * Allow credentials
   */
  readonly allowCredentials?: boolean;
}

/**
 * Sticky session configuration
 */
export interface ContainerAppIngressStickySessions {
  /**
   * Sticky session affinity: 'none' or 'sticky'
   */
  readonly affinity?: string;
}

/**
 * Additional port mapping for ingress (2025-07-01+)
 */
export interface ContainerAppIngressAdditionalPortMapping {
  /**
   * Whether the port is externally accessible
   */
  readonly external?: boolean;

  /**
   * Target port in the container
   */
  readonly targetPort: number;

  /**
   * Specifies the exposed port for the target port
   */
  readonly exposedPort?: number;
}

/**
 * Ingress configuration for the Container App
 */
export interface ContainerAppIngress {
  /**
   * Whether the ingress is externally accessible
   */
  readonly external?: boolean;

  /**
   * Target port in the container for incoming traffic
   */
  readonly targetPort?: number;

  /**
   * Ingress transport protocol: 'auto', 'http', 'http2', or 'tcp'
   * @default "auto"
   */
  readonly transport?: string;

  /**
   * Traffic weights for revisions
   */
  readonly traffic?: ContainerAppIngressTraffic[];

  /**
   * Custom domain bindings for the Container App's hostname
   */
  readonly customDomains?: any[];

  /**
   * IP security restrictions
   */
  readonly ipSecurityRestrictions?: ContainerAppIngressIpSecurityRestriction[];

  /**
   * CORS policy for the Container App
   */
  readonly corsPolicy?: ContainerAppIngressCorsPolicy;

  /**
   * Sticky sessions configuration
   */
  readonly stickySessions?: ContainerAppIngressStickySessions;

  /**
   * Client certificate mode
   */
  readonly clientCertificateMode?: string;

  /**
   * Additional port mappings for the Container App (2025-07-01+)
   */
  readonly additionalPortMappings?: ContainerAppIngressAdditionalPortMapping[];
}

/**
 * Dapr configuration for the Container App
 */
export interface ContainerAppDapr {
  /**
   * Whether Dapr is enabled
   */
  readonly enabled?: boolean;

  /**
   * Dapr application identifier
   */
  readonly appId?: string;

  /**
   * Port on which the Dapr side car will listen
   */
  readonly appPort?: number;

  /**
   * Protocol used by Dapr to communicate with the app: 'http' or 'grpc'
   * @default "http"
   */
  readonly appProtocol?: string;

  /**
   * Max size of HTTP request body in MB to handle by Dapr HTTP server
   */
  readonly httpMaxRequestSize?: number;

  /**
   * Max size of HTTP header read buffer in KB to handle by Dapr HTTP server
   */
  readonly httpReadBufferSize?: number;

  /**
   * Dapr log level: 'debug', 'info', 'warn', 'error'
   */
  readonly logLevel?: string;

  /**
   * Whether to enable API logging for the Dapr sidecar
   */
  readonly enableApiLogging?: boolean;

  /**
   * Maximum number of concurrent requests
   */
  readonly maxConcurrency?: number;

  /**
   * App health check configuration
   */
  readonly appHealth?: ContainerAppDaprHealthConfig;
}

/**
 * Dapr app health check configuration
 */
export interface ContainerAppDaprHealthConfig {
  /**
   * Whether app health check is enabled
   */
  readonly enabled?: boolean;

  /**
   * Health check endpoint path
   */
  readonly path?: string;

  /**
   * Probe interval in seconds
   */
  readonly probeIntervalSeconds?: number;

  /**
   * Probe timeout in milliseconds
   */
  readonly probeTimeoutMilliseconds?: number;

  /**
   * Number of consecutive failures before marking unhealthy
   */
  readonly threshold?: number;
}

/**
 * Container registry configuration
 */
export interface ContainerAppRegistry {
  /**
   * Container registry server URL
   */
  readonly server: string;

  /**
   * Managed identity to authenticate with the registry
   */
  readonly identity?: string;

  /**
   * Registry username
   */
  readonly username?: string;

  /**
   * Name of the secret containing the registry password
   */
  readonly passwordSecretRef?: string;
}

/**
 * Secret configuration for the Container App
 */
export interface ContainerAppSecret {
  /**
   * Secret name
   */
  readonly name: string;

  /**
   * Secret value (mutually exclusive with keyVaultUrl)
   */
  readonly value?: string;

  /**
   * Key Vault secret URI (mutually exclusive with value)
   */
  readonly keyVaultUrl?: string;

  /**
   * Resource ID of a managed identity to authenticate with Key Vault
   */
  readonly identity?: string;
}

/**
 * Identity settings for lifecycle phases (2025-07-01+)
 */
export interface ContainerAppIdentitySetting {
  /**
   * Resource ID of a managed identity or 'system' for system-assigned
   */
  readonly identity: string;

  /**
   * The lifecycle stage: 'All', 'Init', or 'Main'
   */
  readonly lifecycle: string;
}

/**
 * Java runtime configuration (2025-07-01+)
 */
export interface ContainerAppJavaRuntimeConfig {
  /**
   * Whether to enable Java metrics
   */
  readonly enableMetrics?: boolean;
}

/**
 * Runtime configuration (2025-07-01+)
 */
export interface ContainerAppRuntime {
  /**
   * Java runtime configuration
   */
  readonly java?: ContainerAppJavaRuntimeConfig;
}

/**
 * Service configuration for dev services
 */
export interface ContainerAppService {
  /**
   * Dev Service type (e.g., 'redis', 'postgres', 'kafka')
   */
  readonly type: string;
}

/**
 * Configuration properties for the Container App
 */
export interface ContainerAppConfiguration {
  /**
   * Active revisions mode: 'Single' or 'Multiple'
   * @default "Single"
   */
  readonly activeRevisionsMode?: string;

  /**
   * Ingress configuration
   */
  readonly ingress?: ContainerAppIngress;

  /**
   * Dapr configuration
   */
  readonly dapr?: ContainerAppDapr;

  /**
   * Collection of private container registry credentials
   */
  readonly registries?: ContainerAppRegistry[];

  /**
   * Collection of secrets used by a Container App
   */
  readonly secrets?: ContainerAppSecret[];

  /**
   * Maximum number of inactive revisions to keep
   */
  readonly maxInactiveRevisions?: number;

  /**
   * Container App to be a dev Container App Service (2025-07-01+)
   */
  readonly service?: ContainerAppService;

  /**
   * Runtime configuration (2025-07-01+)
   */
  readonly runtime?: ContainerAppRuntime;

  /**
   * Identity settings for lifecycle phases (2025-07-01+)
   */
  readonly identitySettings?: ContainerAppIdentitySetting[];
}

/**
 * Managed service identity configuration
 */
export interface ContainerAppIdentity {
  /**
   * Type of managed service identity:
   * 'None', 'SystemAssigned', 'UserAssigned', or 'SystemAssigned,UserAssigned'
   */
  readonly type: string;

  /**
   * User-assigned identity resource IDs
   */
  readonly userAssignedIdentities?: { [key: string]: any };
}

// =============================================================================
// MAIN PROPS INTERFACE
// =============================================================================

/**
 * Properties for the unified Azure Container App
 *
 * Extends AzapiResourceProps with Container App specific properties
 */
export interface ContainerAppProps extends AzapiResourceProps {
  /**
   * Resource ID of the Container App Environment where this app will be hosted
   */
  readonly environmentId: string;

  /**
   * Container App versioned application definition
   */
  readonly template: ContainerAppTemplate;

  /**
   * Non-versioned Container App configuration properties
   */
  readonly configuration?: ContainerAppConfiguration;

  /**
   * Managed identity configuration
   */
  readonly identity?: ContainerAppIdentity;

  /**
   * Workload profile name to pin for container app execution
   */
  readonly workloadProfileName?: string;

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];

  /**
   * Resource group ID where the Container App will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * The resource body interface for Azure Container App API calls
 */
export interface ContainerAppBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly identity?: any;
  readonly properties?: any;
}

// =============================================================================
// MAIN CLASS
// =============================================================================

/**
 * Unified Azure Container App implementation
 *
 * Azure Container Apps enable you to run microservices and containerized applications
 * on a serverless platform. They provide built-in support for ingress, scaling,
 * Dapr integration, and more.
 *
 * Key features:
 * - External and internal ingress with TLS, CORS, and sticky sessions
 * - Dapr sidecar integration for microservice patterns
 * - Horizontal auto-scaling with HTTP, TCP, custom (KEDA), and Azure Queue rules
 * - Secrets management with Azure Key Vault references
 * - Managed identity (SystemAssigned, UserAssigned, or both)
 * - Init containers for setup tasks
 * - Volume mounts (Azure Files, NFS, Ephemeral, Secret)
 * - Health probes (Liveness, Readiness, Startup)
 * - Multiple revision mode for blue-green and canary deployments
 * - Service binds for dev services (Redis, Postgres, Kafka)
 *
 * @example
 * // Basic Container App with a single container:
 * const app = new ContainerApp(this, "app", {
 *   name: "my-container-app",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   environmentId: environment.id,
 *   template: {
 *     containers: [{
 *       name: "my-app",
 *       image: "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest",
 *       resources: { cpu: 0.25, memory: "0.5Gi" },
 *     }],
 *   },
 * });
 *
 * @example
 * // Container App with external ingress and scaling:
 * const app = new ContainerApp(this, "app", {
 *   name: "my-web-app",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   environmentId: environment.id,
 *   template: {
 *     containers: [{
 *       name: "web",
 *       image: "myregistry.azurecr.io/myapp:latest",
 *       resources: { cpu: 0.5, memory: "1Gi" },
 *       env: [{ name: "PORT", value: "3000" }],
 *     }],
 *     scale: {
 *       minReplicas: 1,
 *       maxReplicas: 10,
 *       rules: [{
 *         name: "http-rule",
 *         http: { metadata: { concurrentRequests: "50" } },
 *       }],
 *     },
 *   },
 *   configuration: {
 *     ingress: {
 *       external: true,
 *       targetPort: 3000,
 *       transport: "http",
 *     },
 *   },
 * });
 *
 * @stability stable
 */
export class ContainerApp extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      CONTAINER_APP_TYPE,
      ALL_CONTAINER_APP_VERSIONS,
    );
  }

  public readonly props: ContainerAppProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly fqdnOutput: cdktf.TerraformOutput;
  public readonly latestRevisionFqdnOutput: cdktf.TerraformOutput;
  public readonly latestReadyRevisionNameOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;

  /**
   * Creates a new Azure Container App
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Container App
   */
  constructor(scope: Construct, id: string, props: ContainerAppProps) {
    super(scope, id, props);

    this.props = props;

    // Create Terraform outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Container App",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Container App",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Container App",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Container App",
    });

    this.fqdnOutput = new cdktf.TerraformOutput(this, "fqdn", {
      value: `\${${this.terraformResource.fqn}.output.properties.configuration.ingress.fqdn}`,
      description: "The FQDN of the Container App (from ingress)",
    });

    this.latestRevisionFqdnOutput = new cdktf.TerraformOutput(
      this,
      "latest_revision_fqdn",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.latestRevisionFqdn}`,
        description: "The FQDN of the latest revision of the Container App",
      },
    );

    this.latestReadyRevisionNameOutput = new cdktf.TerraformOutput(
      this,
      "latest_ready_revision_name",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.latestReadyRevisionName}`,
        description:
          "The name of the latest ready revision of the Container App",
      },
    );

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioning_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the Container App",
      },
    );

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.fqdnOutput.overrideLogicalId("fqdn");
    this.latestRevisionFqdnOutput.overrideLogicalId("latest_revision_fqdn");
    this.latestReadyRevisionNameOutput.overrideLogicalId(
      "latest_ready_revision_name",
    );
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
   * Gets the Azure resource type for Container Apps
   */
  protected resourceType(): string {
    return CONTAINER_APP_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Indicates that location is required for Container Apps
   */
  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as ContainerAppProps;

    const properties: any = {
      environmentId: typedProps.environmentId,
      template: typedProps.template,
    };

    // Configuration
    if (typedProps.configuration) {
      properties.configuration = typedProps.configuration;
    }

    // Workload profile name
    if (typedProps.workloadProfileName) {
      properties.workloadProfileName = typedProps.workloadProfileName;
    }

    const body: ContainerAppBody = {
      location: this.location!,
      tags: this.allTags(),
      properties,
    };

    // Identity (top-level, not inside properties)
    if (typedProps.identity) {
      (body as any).identity = typedProps.identity;
    }

    return body;
  }

  // =============================================================================
  // PUBLIC METHODS - Read-only Properties
  // =============================================================================

  /**
   * Get the FQDN of the Container App (from ingress configuration)
   */
  public get fqdn(): string {
    return `\${${this.terraformResource.fqn}.output.properties.configuration.ingress.fqdn}`;
  }

  /**
   * Get the FQDN of the latest revision
   */
  public get latestRevisionFqdn(): string {
    return `\${${this.terraformResource.fqn}.output.properties.latestRevisionFqdn}`;
  }

  /**
   * Get the name of the latest ready revision
   */
  public get latestReadyRevisionName(): string {
    return `\${${this.terraformResource.fqn}.output.properties.latestReadyRevisionName}`;
  }

  /**
   * Get the provisioning state of the Container App
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * Get the running status of the Container App
   */
  public get runningStatus(): string {
    return `\${${this.terraformResource.fqn}.output.properties.runningStatus}`;
  }

  /**
   * Add a tag to the Container App
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Container App
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
