/**
 * AzapiResource - A unified framework for version-aware Azure resource management
 *
 * This abstract base class provides a self-contained unified framework approach
 * for Azure resource management with automatic version management, schema-driven
 * property transformation, and migration analysis capabilities.
 *
 * Key Features:
 * - Automatic latest version resolution when no version is specified
 * - Support for explicit version pinning for stability
 * - Schema-driven property transformation between versions
 * - Migration analysis and deprecation warnings
 * - Built-in role assignment and diagnostic settings support
 * - JSII-compliant design for multi-language support
 *
 * This class replaces the previous dual-class approach (AzapiResource + AzapiResource)
 * with a single, self-contained implementation that handles all resource management needs.
 *
 * @packageDocumentation
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { DataAzapiClientConfig } from "./providers-azapi/data-azapi-client-config";
import { Resource, ResourceConfig } from "./providers-azapi/resource";
import { ResourceSchemaValidator } from "./resource-schema-validator";
import { ResourceVersionManager } from "./resource-version-manager";

// Type-only imports to avoid circular dependencies
import type { ActionGroupProps } from "../../../azure-actiongroup/lib/action-group";
import type { ActivityLogAlertProps } from "../../../azure-activitylogalert/lib/activity-log-alert";
import type { DiagnosticSettingsProps } from "../../../azure-diagnosticsettings/lib/diagnostic-settings";
import type { MetricAlertProps } from "../../../azure-metricalert/lib/metric-alert";
import { ApiVersionManager } from "../version-manager/api-version-manager";
import {
  ApiSchema,
  VersionConfig,
  ValidationResult,
  MigrationAnalysis,
} from "../version-manager/interfaces/version-interfaces";

/**
 * Retention policy configuration
 */
export interface RetentionPolicyConfig {
  readonly enabled: boolean;
  readonly days: number;
}

/**
 * Log configuration for diagnostic settings
 */
export interface DiagnosticLogConfig {
  readonly category?: string;
  readonly categoryGroup?: string;
  readonly enabled: boolean;
  readonly retentionPolicy?: RetentionPolicyConfig;
}

/**
 * Metric configuration for diagnostic settings
 */
export interface DiagnosticMetricConfig {
  /** Metric category name (used in newer API versions) */
  readonly category?: string;
  /** Time grain for metrics in ISO 8601 duration format (used in API version 2016-09-01, e.g., "PT1M") */
  readonly timeGrain?: string;
  readonly enabled: boolean;
  readonly retentionPolicy?: RetentionPolicyConfig;
}

/**
 * Monitoring configuration for Azure resources
 *
 * Provides integrated monitoring capabilities including diagnostic settings,
 * metric alerts, and activity log alerts. All monitoring is optional and
 * disabled by default.
 */
export interface MonitoringConfig {
  /**
   * Whether monitoring is enabled
   * @defaultValue true
   */
  readonly enabled?: boolean;

  /**
   * Diagnostic settings configuration
   * Uses the full DiagnosticSettings construct for consistency
   */
  readonly diagnosticSettings?: DiagnosticSettingsProps;

  /**
   * Action groups to create for this resource
   * Creates new ActionGroup instances as child constructs
   */
  readonly actionGroups?: ActionGroupProps[];

  /**
   * Metric alerts configuration
   * Creates MetricAlert instances scoped to this resource
   */
  readonly metricAlerts?: MetricAlertProps[];

  /**
   * Activity log alerts configuration
   * Creates ActivityLogAlert instances for this resource's operations
   */
  readonly activityLogAlerts?: ActivityLogAlertProps[];
}

/**
 * Properties for versioned Azure resources
 *
 * Combines base resource properties with version management capabilities
 * and advanced configuration options for the unified framework.
 */
export interface AzapiResourceProps extends cdktf.TerraformMetaArguments {
  /**
   * The name of the resource
   */
  readonly name?: string;

  /**
   * The location where the resource should be created
   *
   * @remarks
   * Location handling varies by resource type:
   * - **Top-level resources**: Most require an explicit location (e.g., "eastus", "westus")
   * - **Global resources**: Some use "global" as location (e.g., Private DNS Zones)
   * - **Child resources**: Inherit location from parent and should NOT set this property
   *
   * Each resource type may provide its own default through the `resolveLocation()` method.
   * If no location is specified and no default exists, resource creation may fail.
   *
   * @example
   * // Explicit location for most resources
   * location: "eastus"
   *
   * @example
   * // Global resource (Private DNS Zone)
   * location: "global"
   *
   * @example
   * // Child resource (Subnet) - do not set location
   * // location: undefined (inherited from parent Virtual Network)
   *
   * @defaultValue Varies by resource type - see specific resource documentation
   */
  readonly location?: string;

  /**
   * Tags to apply to the resource
   */
  readonly tags?: Record<string, string>;
  /**
   * Explicit API version to use for this resource
   *
   * If not specified, the latest active version will be automatically resolved.
   * Use this for version pinning when stability is required over latest features.
   *
   * @example "2024-11-01"
   * @defaultValue Latest active version from ApiVersionManager
   */
  readonly apiVersion?: string;

  /**
   * Whether to enable migration analysis warnings
   *
   * When true, the framework will analyze the current version for deprecation
   * status and provide migration recommendations in the deployment output.
   *
   * @defaultValue true
   */
  readonly enableMigrationAnalysis?: boolean;

  /**
   * Whether to validate properties against the schema
   *
   * When true, all properties will be validated against the API schema before
   * resource creation. Validation errors will cause deployment failures.
   *
   * @defaultValue true
   */
  readonly enableValidation?: boolean;

  /**
   * Whether to apply property transformations automatically
   *
   * When true, properties will be automatically transformed according to the
   * target schema's transformation rules. This enables backward compatibility.
   *
   * @defaultValue true
   */
  readonly enableTransformation?: boolean;

  /**
   * Monitoring configuration for this resource
   *
   * Enables integrated monitoring with diagnostic settings, metric alerts,
   * and activity log alerts. All monitoring is optional and disabled by default.
   *
   * @example
   * monitoring: {
   *   enabled: true,
   *   diagnosticSettings: {
   *     workspaceId: logAnalytics.id,
   *     metrics: ['AllMetrics'],
   *     logs: ['AuditLogs']
   *   },
   *   metricAlerts: [{
   *     name: 'high-cpu-alert',
   *     severity: 2,
   *     scopes: [], // Automatically set to this resource
   *     criteria: { ... },
   *     actions: [{ actionGroupId: actionGroup.id }]
   *   }]
   * }
   */
  readonly monitoring?: MonitoringConfig;
}

/**
 * Abstract base class for version-aware Azure resource management
 *
 * AzapiResource provides a unified framework for creating Azure resources
 * with automatic version management, schema validation, property transformation,
 * and migration analysis. It extends the existing AzapiResource class while
 * maintaining full backward compatibility.
 *
 * This class implements the core framework that enables:
 * - Automatic resolution of the latest API version when none is specified
 * - Explicit version pinning for environments requiring stability
 * - Schema-driven property validation and transformation
 * - Migration analysis with breaking change detection
 * - Deprecation warnings and upgrade recommendations
 *
 * Subclasses must implement the abstract methods to provide resource-specific
 * configuration while the framework handles all version management complexity.
 *
 * @example Basic usage with automatic version resolution:
 * class MyResource extends AzapiResource {
 *   protected getDefaultVersion(): string {
 *     return "2024-11-01"; // fallback if no versions registered
 *   }
 *
 *   protected getResourceType(): string {
 *     return "Microsoft.Resources/resourceGroups";
 *   }
 *
 *   protected getApiSchema(): ApiSchema {
 *     return this.resolveSchema();
 *   }
 *
 *   protected createResourceBody(props: any): any {
 *     return { location: props.location, tags: props.tags || {} };
 *   }
 * }
 *
 * @example Usage with explicit version pinning:
 * new MyResource(this, "resource", {
 *   name: "my-resource",
 *   location: "eastus",
 *   apiVersion: "2024-01-01" // Pin to specific version
 * });
 *
 * @stability stable
 */
export abstract class AzapiResource extends Construct {
  /**
   * Static helper for child classes to register their schemas in static initializers
   *
   * This method should be called in a static initializer block of each child class
   * to register all supported API versions and their schemas with the ApiVersionManager.
   * The static block runs once when the class is first loaded, ensuring schemas are
   * registered before any instances are created.
   *
   * @param resourceType - The Azure resource type (e.g., "Microsoft.Network/virtualNetworks")
   * @param versions - Array of version configurations containing schemas
   *
   * @example
   * static {
   *   AzapiResource.registerSchemas(
   *     "Microsoft.Network/virtualNetworks",
   *     ALL_VIRTUAL_NETWORK_VERSIONS
   *   );
   * }
   */
  protected static registerSchemas(
    resourceType: string,
    versions: VersionConfig[],
  ): void {
    ApiVersionManager.instance().registerResourceType(resourceType, versions);
  }

  /**
   * The Azure resource type (e.g., "Microsoft.Resources/resourceGroups")
   * @internal
   */
  protected _resourceType!: string;

  /**
   * The API version to use for this resource
   */
  protected apiVersion: string;

  /**
   * The underlying AZAPI Terraform resource
   */
  protected terraformResource!: cdktf.TerraformResource;

  /**
   * The name of the resource
   */
  public readonly name: string;

  /**
   * The location of the resource (optional - not all resources have a location)
   * Child resources typically inherit location from their parent
   */
  public readonly location?: string;

  /**
   * The Azure resource ID
   *
   * This property is automatically derived from the underlying Terraform resource.
   * Child classes no longer need to implement this property.
   */
  public get id(): string {
    return `\${${this.terraformResource.fqn}.id}`;
  }

  /**
   * The resolved API version being used for this resource instance
   *
   * This is the actual version that will be used for the Azure API call,
   * either explicitly specified in props or automatically resolved to
   * the latest active version.
   */
  public resolvedApiVersion: string;

  /**
   * The API schema for the resolved version
   *
   * Contains the complete schema definition including properties, validation
   * rules, and transformation mappings for the resolved API version.
   */
  public schema!: ApiSchema;

  /**
   * The version configuration for the resolved version
   *
   * Contains lifecycle information, breaking changes, and migration metadata
   * for the resolved API version.
   */
  public versionConfig!: VersionConfig;

  /**
   * Validation results for the resource properties
   *
   * Available after construction if validation is enabled. Contains detailed
   * information about any validation errors or warnings.
   */
  public validationResult?: ValidationResult;

  /**
   * Migration analysis results
   *
   * Available after construction if migration analysis is enabled and a
   * previous version can be determined for comparison.
   */
  public migrationAnalysis?: MigrationAnalysis;

  // Framework components
  private readonly _apiVersionManager: ApiVersionManager;
  private _versionManager!: ResourceVersionManager;
  private _schemaValidator!: ResourceSchemaValidator;

  /**
   * Internal mutable tags storage separate from input props
   * Combines props.tags with dynamically added tags via addTag()
   */
  private _tags: { [key: string]: string };

  // Monitoring resources (protected for subclass access)
  protected readonly monitoringActionGroups: Construct[] = [];
  protected readonly monitoringMetricAlerts: Construct[] = [];
  protected readonly monitoringActivityLogAlerts: Construct[] = [];

  /**
   * Creates a new AzapiResource instance
   *
   * The constructor handles all framework initialization including version resolution,
   * schema loading, property validation, transformation, and migration analysis.
   * It maintains full backward compatibility with the AzapiResource constructor.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the resource
   */
  constructor(scope: Construct, id: string, props: AzapiResourceProps = {}) {
    // Initialize the base Construct
    super(scope, id);

    // Initialize basic properties that don't require abstract methods
    // Use props.name if provided, otherwise fall back to construct ID
    // This supports both explicit naming and automatic ID-based naming
    this.name = this.resolveName(props);
    this.location = this.resolveLocation(props);

    // Initialize the API version manager
    this._apiVersionManager = ApiVersionManager.instance();

    // Initialize tags storage with empty object (will be populated in initialize())
    this._tags = {};

    // Note: We cannot initialize version manager here because it requires
    // calling abstract methods (resourceType() and defaultVersion())
    // which are not yet available in the base constructor.
    // Version resolution is deferred to initialize() method.

    // Step 1: Resolve the API version to use (doesn't call abstract methods yet)
    // This is a placeholder that will be properly set in initialize()
    this.resolvedApiVersion = props.apiVersion || "";
    this.apiVersion = this.resolvedApiVersion;

    // Step 2: Call initialize() to complete initialization after child class is ready
    this.initialize(props);
  }

  /**
   * Protected initialization method called after the constructor completes
   *
   * This method is called at the end of the constructor to perform initialization
   * that requires calling abstract methods. Child classes can override this method
   * if they need to extend initialization logic, but they MUST call super.initialize(props).
   *
   * @param props - Configuration properties for the resource
   */
  protected initialize(props: AzapiResourceProps): void {
    // Step 2: Set required abstract properties (now safe to call abstract methods)
    this._resourceType = this.resourceType();

    // Step 3: Initialize the version manager and resolve the API version
    this._versionManager = new ResourceVersionManager(
      this._resourceType,
      this.defaultVersion(),
    );
    this.resolvedApiVersion = this._versionManager.resolveApiVersion(
      props.apiVersion,
    );
    this.apiVersion = this.resolvedApiVersion;

    // Step 3.5: Initialize tags from props
    // This creates a mutable copy separate from the readonly props
    this._tags = { ...(props.tags || {}) };

    // Step 4: Load the schema and version configuration using the version manager
    this.schema = this._versionManager.schemaForVersion(
      this.resolvedApiVersion,
    );
    const versionConfig = this._versionManager.versionConfig(
      this.resolvedApiVersion,
    );

    if (!versionConfig) {
      throw new Error(
        `Version configuration not found for ${this.resourceType()}@${this.resolvedApiVersion}. ` +
          `Please ensure the version is registered with the ApiVersionManager.`,
      );
    }
    this.versionConfig = versionConfig;

    // Step 5: Initialize the schema validator
    this._schemaValidator = new ResourceSchemaValidator(this.schema);

    // Step 6: Process properties through the framework pipeline
    const processedProps = this._processProperties(props);

    // Step 7: Perform validation if enabled
    if (props.enableValidation !== false) {
      this.validationResult =
        this._schemaValidator.validateProps(processedProps);
      if (!this.validationResult.valid) {
        throw new Error(
          `Property validation failed for ${this.resourceType()}:\n` +
            this._schemaValidator
              .formatValidationErrors(this.validationResult)
              .join("\n"),
        );
      }
    }

    // Step 8: Perform migration analysis if enabled
    if (props.enableMigrationAnalysis !== false) {
      this.migrationAnalysis = this._performMigrationAnalysis();
    }

    // Step 9: Create the Azure resource
    this._createAzureResource(processedProps);

    // Step 10: Create monitoring resources if configured
    // Note: Monitoring resources are created lazily to avoid circular dependencies
    if (props.monitoring) {
      void this.createMonitoringResources(props.monitoring);
    }

    // Step 11: Log warnings and migration guidance
    this._logFrameworkMessages();
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   *
   * This method should return a sensible default version that can be used
   * as a fallback if the ApiVersionManager doesn't have any versions registered
   * for this resource type.
   *
   * @returns The default API version string (e.g., "2024-11-01")
   */
  protected abstract defaultVersion(): string;

  /**
   * Gets the Azure resource type for this resource
   *
   * This method should return the full Azure resource type identifier that
   * will be used for API calls and version management.
   *
   * @returns The Azure resource type (e.g., "Microsoft.Resources/resourceGroups")
   */
  protected abstract resourceType(): string;

  /**
   * Gets the API schema for the resolved version
   *
   * This method should return the complete API schema for the resolved version,
   * including all property definitions, validation rules, and transformation
   * mappings. Use the resolveSchema() helper method for standard schema resolution.
   *
   * @returns The API schema for the resolved version
   */
  protected abstract apiSchema(): ApiSchema;

  /**
   * Creates the resource body for the Azure API call
   *
   * This method should transform the input properties into the JSON body format
   * expected by the Azure REST API for the resolved version. The framework will
   * have already applied any necessary property transformations and validation.
   *
   * @param props - The processed and validated properties for the resource
   * @returns The resource body object to send to Azure API
   */
  protected abstract createResourceBody(props: any): any;

  /**
   * Override in child classes to provide default location
   * @returns Default location or undefined
   */
  protected defaultLocation(): string | undefined {
    return undefined;
  }

  /**
   * Override in child classes to indicate if location is required
   * @returns true if location is mandatory for this resource type
   */
  protected requiresLocation(): boolean {
    return false;
  }

  /**
   * Override in child classes to specify parent resource for location inheritance
   * @returns Parent resource or undefined
   */
  protected parentResourceForLocation(): AzapiResource | undefined {
    return undefined;
  }

  /**
   * Resolves location using template method pattern
   * Priority: props.location > parent location > default location > validation
   */
  protected resolveLocation(props: AzapiResourceProps): string | undefined {
    // 1. Explicit location in props
    if (props.location) {
      return props.location;
    }

    // 2. Inherit from parent resource
    const parent = this.parentResourceForLocation();
    if (parent && parent.location) {
      return parent.location;
    }

    // 3. Use child class default
    const defaultLoc = this.defaultLocation();
    if (defaultLoc) {
      return defaultLoc;
    }

    // 4. Validate if required
    if (this.requiresLocation()) {
      throw new Error(
        `Location is required for ${this.resourceType()} but was not provided ` +
          `and could not be inherited from parent resource.`,
      );
    }

    return undefined;
  }

  /**
   * Resolves the name for this resource
   *
   * This method centralizes name resolution logic. By default, it uses the
   * provided name or falls back to the construct ID.
   *
   * @param props - The resource properties
   * @returns The resolved resource name
   */
  protected resolveName(props: AzapiResourceProps): string {
    return props.name || this.node.id;
  }

  /**
   * Helper method for standard schema resolution
   *
   * Subclasses can use this method to resolve the schema for the current version
   * from the ApiVersionManager. This provides a standard implementation that
   * most resources can use without custom logic.
   *
   * @returns The API schema for the resolved version
   * @throws Error if the schema cannot be resolved
   */
  protected resolveSchema(): ApiSchema {
    const versionConfig = this._apiVersionManager.versionConfig(
      this.resourceType(),
      this.resolvedApiVersion,
    );

    if (!versionConfig) {
      throw new Error(
        `Cannot resolve schema: version configuration not found for ` +
          `${this.resourceType()}@${this.resolvedApiVersion}`,
      );
    }

    return versionConfig.schema;
  }

  /**
   * Gets the latest available version for this resource type
   *
   * This method provides access to the latest version resolution logic
   * for use in subclasses or external tooling.
   *
   * @returns The latest available version, or undefined if none found
   */
  public latestVersion(): string | undefined {
    return this._versionManager
      ? this._versionManager.latestVersion()
      : this._apiVersionManager.latestVersion(this.resourceType());
  }

  /**
   * Gets all supported versions for this resource type
   *
   * This method provides access to the version registry for use in
   * subclasses or external tooling.
   *
   * @returns Array of supported version strings, sorted by release date
   */
  public supportedVersions(): string[] {
    return this._versionManager
      ? this._versionManager.supportedVersions()
      : this._apiVersionManager.supportedVersions(this.resourceType());
  }

  /**
   * Analyzes migration from current version to a target version
   *
   * This method enables external tools to analyze migration requirements
   * between versions for planning and automation purposes.
   *
   * @param targetVersion - The target version to analyze migration to
   * @returns Detailed migration analysis results
   */
  public analyzeMigrationTo(targetVersion: string): MigrationAnalysis {
    return this._apiVersionManager.analyzeMigration(
      this.resourceType(),
      this.resolvedApiVersion,
      targetVersion,
    );
  }
  // =============================================================================
  // PRIVATE IMPLEMENTATION METHODS
  // =============================================================================

  /**
   * Processes properties through the framework pipeline
   */
  private _processProperties(props: AzapiResourceProps): any {
    let processedProps = { ...props };

    // Ensure name is set before processing
    // This is critical for validation to work correctly
    if (!processedProps.name) {
      processedProps.name = this.resolveName(props);
    }

    // Apply default values from the schema using the validator
    processedProps = this._schemaValidator.applyDefaults(processedProps);

    // Apply property transformations if enabled
    if (props.enableTransformation !== false) {
      // For transformation, we would need a source schema, but since we're not
      // migrating from a different version in this context, we'll skip transformation
      // This would be used when upgrading from one version to another
    }

    return processedProps;
  }

  /**
   * Performs migration analysis for the current version
   */
  private _performMigrationAnalysis(): MigrationAnalysis | undefined {
    // Check if the current version is deprecated using the version manager
    if (this._versionManager.isDeprecated(this.resolvedApiVersion)) {
      const latestVersion = this._versionManager.latestVersion();
      if (latestVersion && latestVersion !== this.resolvedApiVersion) {
        return this._apiVersionManager.analyzeMigration(
          this.resourceType(),
          this.resolvedApiVersion,
          latestVersion,
        );
      }
    }

    return undefined;
  }

  /**
   * Creates the underlying Azure resource
   */
  private _createAzureResource(props: any): void {
    // Ensure name is set in props for validation
    const propsWithName = {
      ...props,
      name: props.name || this.resolveName(props),
    };

    // Create the resource body using the subclass implementation
    const resourceBody = this.createResourceBody(propsWithName);

    // Determine the parent ID using the overrideable method
    const parentId = this.resolveParentId(propsWithName);

    // Find parent AzapiResource construct if parent ID references a resource
    const parentResource = this._findParentAzapiResource(parentId);

    // Create the AZAPI resource using the base class method
    const resourceName = this.resolveName(props);
    this.terraformResource = this.createAzapiResource(
      resourceBody,
      parentId,
      resourceName,
      this.location,
      parentResource,
      propsWithName.dependsOn,
      this._tags, // Pass tags directly instead of extracting from body
    );
  }

  /**
   * Finds the parent AzapiResource construct if the parentId references a resource
   * Returns undefined if parentId is a static string or parent not found
   * @private
   */
  private _findParentAzapiResource(
    parentId: string,
  ): AzapiResource | undefined {
    // Check if the parent is a string interpolation referencing another resource
    // Pattern: ${azapi_resource.resource_name_HASH.id} or ${construct.fqn}.id
    if (!parentId.includes("${")) {
      return undefined; // Parent is a static string ID, not a resource reference
    }

    // Try to find the parent AzapiResource in the construct tree
    // We need to search the entire tree to find the matching parent
    const root = this._findRoot();
    return this._findParentResource(root, parentId);
  }

  /**
   * Finds the root of the construct tree
   * @private
   */
  private _findRoot(): Construct {
    let current: Construct = this;
    while (current.node.scope) {
      current = current.node.scope;
    }
    return current;
  }

  /**
   * Recursively searches for a parent resource by matching parentId patterns
   * Enhanced to better handle Terraform interpolation syntax
   * @private
   */
  private _findParentResource(
    scope: Construct,
    parentId: string,
  ): AzapiResource | undefined {
    // Check all children of this scope
    for (const child of scope.node.children) {
      if (
        child instanceof AzapiResource &&
        child !== this &&
        child.terraformResource
      ) {
        const childFqn = child.terraformResource.fqn;

        // Match if the child's FQN appears anywhere in the parentId string
        // This handles cases like: ${azapi_resource.dns-resolver_resource_F1517BE4.id}
        // where childFqn would be: azapi_resource.dns-resolver_resource_F1517BE4
        if (parentId.includes(childFqn)) {
          return child;
        }
      }

      // Recursively search in child's subtree
      const found = this._findParentResource(child, parentId);
      if (found) {
        return found;
      }
    }

    return undefined;
  }

  /**
   * Resolves the parent resource ID for this resource.
   *
   * Override this method in child resource classes (like Subnet) that need
   * custom parent ID resolution logic. By default, this delegates to the
   * private _determineParentId method which handles standard resource types.
   *
   * @param props - The resource properties
   * @returns The parent resource ID
   */
  protected resolveParentId(props: any): string {
    return this._determineParentId(props);
  }

  /**
   * Determines the parent ID for the resource (internal implementation)
   *
   * This method provides the default parent ID resolution logic.
   * Resource-specific logic should be implemented in the overrideable resolveParentId() method.
   *
   * Default behavior:
   * - If resourceGroupId is provided in props, use it
   * - Otherwise, default to subscription scope
   */
  private _determineParentId(props: any): string {
    // If resource group ID is provided, use it as parent
    if (props.resourceGroupId) {
      return props.resourceGroupId;
    }

    // Default to subscription scope for resources without explicit parent
    const clientConfig = new DataAzapiClientConfig(
      this,
      "client_config_default",
      {},
    );
    return `/subscriptions/\${${clientConfig.fqn}.subscription_id}`;
  }

  /**
   * Logs framework messages including warnings and migration guidance
   */
  private _logFrameworkMessages(): void {
    // ANSI color codes for terminal output
    const RED = "\x1b[31m";
    const YELLOW = "\x1b[33m";
    const RESET = "\x1b[0m";
    const BOLD = "\x1b[1m";

    // Log deprecation warnings using the version manager
    if (
      this._versionManager.isDeprecated(this.resolvedApiVersion) &&
      !this._versionManager.isSunset(this.resolvedApiVersion)
    ) {
      console.warn(
        `${YELLOW}⚠️  API version ${this.resolvedApiVersion} for ${this.resourceType()} is deprecated. ` +
          `Consider upgrading to the latest version: ${this.latestVersion()}${RESET}`,
      );
    }

    if (this._versionManager.isSunset(this.resolvedApiVersion)) {
      console.error(
        `${RED}${BOLD}🚨 API version ${this.resolvedApiVersion} for ${this.resourceType()} has reached sunset. ` +
          `Immediate migration to ${this.latestVersion()} is required.${RESET}`,
      );
    }

    // Log migration analysis results
    if (this.migrationAnalysis && !this.migrationAnalysis.compatible) {
      console.warn(
        `${YELLOW}Migration from ${this.migrationAnalysis.fromVersion} to ${this.migrationAnalysis.toVersion} ` +
          `has ${this.migrationAnalysis.breakingChanges.length} breaking changes. ` +
          `Estimated effort: ${this.migrationAnalysis.estimatedEffort}${RESET}`,
      );
    }

    // Log validation warnings
    if (this.validationResult?.warnings.length) {
      this.validationResult.warnings.forEach((warning) => {
        console.warn(
          `${YELLOW}Property validation warning: ${warning}${RESET}`,
        );
      });
    }
  }

  // =============================================================================
  // MONITORING INTEGRATION METHODS
  // =============================================================================

  /**
   * Creates monitoring resources based on the monitoring configuration
   *
   * This method is called automatically during construction if monitoring is configured.
   * It creates action groups, metric alerts, and activity log alerts as child constructs.
   *
   * Protected to allow subclasses to override or extend monitoring behavior.
   *
   * @param config - The monitoring configuration from props
   */
  protected async createMonitoringResources(
    config: MonitoringConfig,
  ): Promise<void> {
    // Skip if monitoring is explicitly disabled
    if (config.enabled === false) {
      return;
    }

    // Create diagnostic settings using dynamic import to avoid circular dependency
    if (config.diagnosticSettings) {
      const { DiagnosticSettings } = await import(
        "../../../azure-diagnosticsettings/lib/diagnostic-settings"
      );
      new DiagnosticSettings(this, "monitoring-diagnostic-settings", {
        ...config.diagnosticSettings,
        targetResourceId: this.resourceId,
      });
    }

    // Create action groups using dynamic import
    if (config.actionGroups && config.actionGroups.length > 0) {
      const { ActionGroup } = await import(
        "../../../azure-actiongroup/lib/action-group"
      );
      config.actionGroups.forEach((actionGroupProps, index) => {
        const actionGroup = new ActionGroup(
          this,
          `monitoring-action-group-${index}`,
          actionGroupProps,
        );
        this.monitoringActionGroups.push(actionGroup);
      });
    }

    // Create metric alerts using dynamic import
    if (config.metricAlerts && config.metricAlerts.length > 0) {
      const { MetricAlert } = await import(
        "../../../azure-metricalert/lib/metric-alert"
      );
      config.metricAlerts.forEach((metricAlertProps, index) => {
        // If scopes not provided, default to this resource
        const propsWithScope: MetricAlertProps = {
          ...metricAlertProps,
          scopes: metricAlertProps.scopes || [this.resourceId],
        };

        const metricAlert = new MetricAlert(
          this,
          `monitoring-metric-alert-${index}`,
          propsWithScope,
        );
        this.monitoringMetricAlerts.push(metricAlert);
      });
    }

    // Create activity log alerts using dynamic import
    if (config.activityLogAlerts && config.activityLogAlerts.length > 0) {
      const { ActivityLogAlert } = await import(
        "../../../azure-activitylogalert/lib/activity-log-alert"
      );
      config.activityLogAlerts.forEach((activityLogAlertProps, index) => {
        // If scopes not provided, default to this resource
        const propsWithScope: ActivityLogAlertProps = {
          ...activityLogAlertProps,
          scopes: activityLogAlertProps.scopes || [this.resourceId],
        };

        const activityLogAlert = new ActivityLogAlert(
          this,
          `monitoring-activity-log-alert-${index}`,
          propsWithScope,
        );
        this.monitoringActivityLogAlerts.push(activityLogAlert);
      });
    }
  }

  // =============================================================================
  // RESOURCE MANAGEMENT METHODS (from AzapiResource)
  // =============================================================================

  /**
   * Creates the underlying AZAPI Terraform resource using the generated provider classes
   *
   * @param properties - The properties object to send to the Azure API (should include location if needed)
   * @param parentId - The parent resource ID (e.g., subscription or resource group)
   * @param name - The name of the resource
   * @param location - The location of the resource (optional, only for top-level resources without location in body)
   * @param parentResource - The parent resource for dependency tracking
   * @param dependsOn - Explicit dependencies for this resource
   * @param tags - Tags to apply to the resource (passed separately from body for proper idempotency)
   * @returns The created AZAPI resource
   */
  protected createAzapiResource(
    properties: Record<string, any>,
    parentId: string,
    name: string,
    location?: string,
    parentResource?: AzapiResource,
    dependsOn?: cdktf.ITerraformDependable[],
    tags?: Record<string, string>,
  ): cdktf.TerraformResource {
    // Determine if this is a child resource by counting path segments
    // Child resources have multiple segments (e.g., "Microsoft.Network/virtualNetworks/subnets")
    // Top-level resources have one segment (e.g., "Microsoft.Network/virtualNetworks")
    const resourceTypeParts = this._resourceType.split("/");
    const isChildResource = resourceTypeParts.length > 2;

    // Remove tags from properties to avoid duplicate specification error
    // The AZAPI provider requires tags at the top level only, not in the body
    // This prevents: "can't specify both the argument 'tags' and 'tags' in the argument 'body'"
    // Tags are now passed as a separate parameter for better clarity and idempotency
    const bodyWithoutTags = { ...properties };
    delete bodyWithoutTags.tags;

    // Build the configuration object for the generated AZAPI Resource class
    // Add location only if:
    // 1. This is a top-level resource (not a child resource)
    // 2. Location is provided as parameter
    // 3. Location is not already in the body
    // Child resources inherit location from their parent and should not specify it

    // Combine dependsOn arrays: explicit dependencies + parent resource dependency
    const combinedDependsOn: cdktf.ITerraformDependable[] = [];
    if (dependsOn && dependsOn.length > 0) {
      combinedDependsOn.push(...dependsOn);
    }

    // CRITICAL: Always add parent dependency when parent_id contains interpolations
    // This ensures proper destroy-time ordering even if parent detection fails
    if (parentResource?.terraformResource) {
      combinedDependsOn.push(parentResource.terraformResource);
    }

    const config: ResourceConfig = {
      type: `${this._resourceType}@${this.apiVersion}`,
      name: name,
      parentId: parentId,
      body: bodyWithoutTags,
      ...(!isChildResource && location && !properties.location && { location }),
      // Add tags at the top level if they exist
      // Tags are passed as a separate parameter and added here to ensure they're in the
      // initial Terraform configuration, providing proper idempotency
      ...(tags && Object.keys(tags).length > 0 && { tags }),
      // Add depends_on for explicit dependencies and parent resource
      ...(combinedDependsOn.length > 0 && { dependsOn: combinedDependsOn }),
    };

    // Create the AZAPI resource using the generated provider class
    return new Resource(this, "resource", config);
  }

  /**
   * Creates an AZAPI data source for reading existing resources
   *
   * @param resourceId - The full resource ID
   * @returns The created Terraform data source
   */
  protected createAzapiDataSource(
    resourceId: string,
  ): cdktf.TerraformDataSource {
    const dataSource = new cdktf.TerraformDataSource(this, "data", {
      terraformResourceType: "azapi_resource",
      terraformGeneratorMetadata: {
        providerName: "azapi",
      },
    });

    dataSource.addOverride("type", this._resourceType);
    dataSource.addOverride("resource_id", resourceId);

    return dataSource;
  }

  /**
   * Updates the resource with new properties
   *
   * @param properties - The new properties to apply
   */
  protected updateAzapiResource(properties: Record<string, any>): void {
    if (this.terraformResource) {
      this.terraformResource.addOverride("body", properties);
    }
  }

  /**
   * Gets the full resource ID
   */
  public get resourceId(): string {
    return this.terraformResource?.fqn || this.id;
  }

  /**
   * Gets the underlying Terraform resource for use in dependency declarations
   * This allows explicit dependency management between resources
   */
  public get resource(): cdktf.TerraformResource {
    return this.terraformResource;
  }

  /**
   * Gets the resource as a Terraform output value
   */
  public get output(): cdktf.TerraformOutput {
    return new cdktf.TerraformOutput(this, "output", {
      value: this.terraformResource?.fqn,
    });
  }

  /**
   * Adds an access role assignment for a specified Azure AD object
   *
   * Note: This method creates role assignments using AZAPI instead of AzureRM provider.
   *
   * @param objectId - The unique identifier of the Azure AD object
   * @param roleDefinitionName - The name of the Azure RBAC role to be assigned
   */
  public addAccess(objectId: string, roleDefinitionName: string): void {
    new AzapiRoleAssignment(this, `rbac-${objectId}-${roleDefinitionName}`, {
      objectId: objectId,
      roleDefinitionName: roleDefinitionName,
      scope: this.resourceId,
    });
  }

  /**
   * Adds a tag to this resource. The tag will be included in the Azure resource.
   *
   * This method provides proper immutability by storing tags separately from props.
   * Tags added via this method are combined with tags from props and included in
   * the deployed Azure resource.
   *
   * **Important:** In CDK for Terraform, tags should ideally be set during resource
   * construction via props. While this method allows adding tags after construction,
   * those tags are only included if added before the Terraform configuration is
   * synthesized. For best results, add all tags via props or call addTag() in the
   * same scope where the resource is created.
   *
   * @param key - The tag key
   * @param value - The tag value
   */
  public addTag(key: string, value: string): void {
    this._tags[key] = value;
  }

  /**
   * All tags on this resource (readonly view)
   *
   * This getter provides convenient access to all tags including those from props
   * and those added dynamically via addTag(). Returns a copy to maintain immutability.
   */
  public get tags(): { [key: string]: string } {
    return { ...this._tags };
  }

  /**
   * Protected method to retrieve all tags for use in createResourceBody implementations
   *
   * Subclasses should use this method when creating resource bodies to ensure
   * all tags (from props and addTag()) are included in the Azure resource.
   * Uses a non-getter name to avoid JSII conflicts with the tags property.
   *
   * @returns Object containing all tags
   */
  protected allTags(): { [key: string]: string } {
    return { ...this._tags };
  }
}

// =============================================================================
// HELPER CLASSES AND INTERFACES
// =============================================================================

/**
 * Properties for AZAPI role assignment
 */
export interface AzapiRoleAssignmentProps {
  readonly objectId: string;
  readonly roleDefinitionName: string;
  readonly scope: string;
}

/**
 * AZAPI-based role assignment construct
 */
export class AzapiRoleAssignment extends Construct {
  constructor(scope: Construct, id: string, props: AzapiRoleAssignmentProps) {
    super(scope, id);

    const properties = {
      principalId: props.objectId,
      roleDefinitionId: `[subscriptionResourceId('Microsoft.Authorization/roleDefinitions', roleDefinitionId('${props.roleDefinitionName}'))]`,
      scope: props.scope,
    };

    const config: ResourceConfig = {
      type: "Microsoft.Authorization/roleAssignments",
      name: "[guid()]",
      parentId: props.scope,
      body: properties,
    };
    new Resource(this, "role-assignment", config);
  }
}
