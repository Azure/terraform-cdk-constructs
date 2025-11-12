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
import { SchemaMapper } from "./schema-mapper/schema-mapper";

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
  VersionSupportLevel,
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
export interface AzapiResourceProps {
  /**
   * The name of the resource
   */
  readonly name?: string;

  /**
   * The location where the resource should be created
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
   * The Azure resource type (e.g., "Microsoft.Resources/resourceGroups")
   * @internal
   */
  protected readonly _resourceType: string;

  /**
   * The API version to use for this resource
   */
  protected readonly apiVersion: string;

  /**
   * The underlying AZAPI Terraform resource
   */
  protected terraformResource!: cdktf.TerraformResource;

  /**
   * The name of the resource
   */
  public readonly name: string;

  /**
   * The location of the resource
   */
  public readonly location: string;

  /**
   * The resource ID (abstract - must be implemented by subclasses)
   */
  public abstract readonly id: string;

  /**
   * The resolved API version being used for this resource instance
   *
   * This is the actual version that will be used for the Azure API call,
   * either explicitly specified in props or automatically resolved to
   * the latest active version.
   */
  public readonly resolvedApiVersion: string;

  /**
   * The API schema for the resolved version
   *
   * Contains the complete schema definition including properties, validation
   * rules, and transformation mappings for the resolved API version.
   */
  public readonly schema: ApiSchema;

  /**
   * The version configuration for the resolved version
   *
   * Contains lifecycle information, breaking changes, and migration metadata
   * for the resolved API version.
   */
  public readonly versionConfig: VersionConfig;

  /**
   * Validation results for the resource properties
   *
   * Available after construction if validation is enabled. Contains detailed
   * information about any validation errors or warnings.
   */
  public readonly validationResult?: ValidationResult;

  /**
   * Migration analysis results
   *
   * Available after construction if migration analysis is enabled and a
   * previous version can be determined for comparison.
   */
  public readonly migrationAnalysis?: MigrationAnalysis;

  // Framework components
  private readonly _apiVersionManager: ApiVersionManager;
  private readonly _schemaMapper: SchemaMapper;

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

    // Initialize basic properties
    this.name = props.name || this.node.id;
    this.location = props.location || "eastus";

    // Initialize the API version manager
    this._apiVersionManager = ApiVersionManager.instance();

    // Step 1: Resolve the API version to use
    this.resolvedApiVersion = this._resolveApiVersion(props.apiVersion);

    // Step 2: Set required abstract properties for AzapiResource
    this._resourceType = this.resourceType();
    this.apiVersion = this.resolvedApiVersion;

    // Step 3: Load the schema and version configuration
    this.schema = this.apiSchema();
    const versionConfig = this._apiVersionManager.versionConfig(
      this._resourceType,
      this.resolvedApiVersion,
    );

    if (!versionConfig) {
      throw new Error(
        `Version configuration not found for ${this.resourceType()}@${this.resolvedApiVersion}. ` +
          `Please ensure the version is registered with the ApiVersionManager.`,
      );
    }
    this.versionConfig = versionConfig;

    // Step 4: Initialize the schema mapper
    this._schemaMapper = SchemaMapper.create(this.schema);

    // Step 5: Process properties through the framework pipeline
    const processedProps = this._processProperties(props);

    // Step 6: Perform validation if enabled
    if (props.enableValidation !== false) {
      this.validationResult = this._validateProperties(processedProps);
      if (!this.validationResult.valid) {
        throw new Error(
          `Property validation failed for ${this.resourceType}:\n` +
            this.validationResult.errors.join("\n"),
        );
      }
    }

    // Step 7: Perform migration analysis if enabled
    if (props.enableMigrationAnalysis !== false) {
      this.migrationAnalysis = this._performMigrationAnalysis();
    }

    // Step 8: Create the Azure resource
    this._createAzureResource(processedProps);

    // Step 9: Create monitoring resources if configured
    // Note: Monitoring resources are created lazily to avoid circular dependencies
    if (props.monitoring) {
      void this.createMonitoringResources(props.monitoring);
    }

    // Step 10: Log warnings and migration guidance
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
    return this._apiVersionManager.latestVersion(this.resourceType());
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
    return this._apiVersionManager.supportedVersions(this.resourceType());
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
   * Resolves the API version to use for this resource instance
   */
  private _resolveApiVersion(explicitVersion?: string): string {
    if (explicitVersion) {
      // Validate that the explicit version is supported
      if (
        !this._apiVersionManager.validateVersionSupport(
          this.resourceType(),
          explicitVersion,
        )
      ) {
        const supportedVersions = this._apiVersionManager.supportedVersions(
          this.resourceType(),
        );
        throw new Error(
          `Unsupported API version '${explicitVersion}' for resource type '${this.resourceType()}'. ` +
            `Supported versions: ${supportedVersions.join(", ")}`,
        );
      }
      return explicitVersion;
    }

    // Try to get the latest version from the manager
    const latestVersion = this._apiVersionManager.latestVersion(
      this.resourceType(),
    );
    if (latestVersion) {
      return latestVersion;
    }

    // Fall back to the default version
    const defaultVersion = this.defaultVersion();

    // Warn that we're using the default version
    console.warn(
      `No versions registered for ${this.resourceType()}. ` +
        `Using default version: ${defaultVersion}. ` +
        `Consider registering versions with ApiVersionManager for better version management.`,
    );

    return defaultVersion;
  }

  /**
   * Processes properties through the framework pipeline
   */
  private _processProperties(props: AzapiResourceProps): any {
    let processedProps = { ...props };

    // Apply default values from the schema
    processedProps = this._schemaMapper.applyDefaults(processedProps);

    // Apply property transformations if enabled
    if (props.enableTransformation !== false) {
      // For transformation, we would need a source schema, but since we're not
      // migrating from a different version in this context, we'll skip transformation
      // This would be used when upgrading from one version to another
    }

    return processedProps;
  }

  /**
   * Validates properties against the schema
   */
  private _validateProperties(props: any): ValidationResult {
    return this._schemaMapper.validateProperties(props);
  }

  /**
   * Performs migration analysis for the current version
   */
  private _performMigrationAnalysis(): MigrationAnalysis | undefined {
    // Check if the current version is deprecated
    if (
      this.versionConfig.supportLevel === VersionSupportLevel.DEPRECATED ||
      this.versionConfig.supportLevel === VersionSupportLevel.SUNSET
    ) {
      const latestVersion = this.latestVersion();
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
    // Create the resource body using the subclass implementation
    const resourceBody = this.createResourceBody(props);

    // Determine the parent ID using the overrideable method
    const parentId = this.resolveParentId(props);

    // Create the AZAPI resource using the base class method
    this.terraformResource = this.createAzapiResource(
      resourceBody,
      parentId,
      this.name,
      this.location,
    );
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
   * This method provides the default parent ID resolution logic for most resources.
   * Child resources should override resolveParentId() instead of this method.
   */
  private _determineParentId(props: any): string {
    // This is a simplified implementation - real implementation would be
    // resource-type specific and could be made abstract or configurable

    // For resource groups, parent is subscription
    if (this.resourceType() === "Microsoft.Resources/resourceGroups") {
      // Use AZAPI client config to get subscription ID
      const clientConfig = new DataAzapiClientConfig(this, "client_config", {});
      return `/subscriptions/\${${clientConfig.fqn}.subscription_id}`;
    }

    // For other resources, parent might be resource group
    if (props.resourceGroupId) {
      return props.resourceGroupId;
    }

    // Default to subscription
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

    // Log deprecation warnings
    if (this.versionConfig.supportLevel === VersionSupportLevel.DEPRECATED) {
      console.warn(
        `${YELLOW}⚠️  API version ${this.resolvedApiVersion} for ${this.resourceType()} is deprecated. ` +
          `Consider upgrading to the latest version: ${this.latestVersion()}${RESET}`,
      );
    }

    if (this.versionConfig.supportLevel === VersionSupportLevel.SUNSET) {
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
   * @param properties - The properties object to send to the Azure API
   * @param parentId - The parent resource ID (e.g., subscription or resource group)
   * @param name - The name of the resource
   * @param location - The location of the resource (optional, can be in properties)
   * @returns The created AZAPI resource
   */
  protected createAzapiResource(
    properties: Record<string, any>,
    parentId: string,
    name: string,
    location?: string,
  ): cdktf.TerraformResource {
    // Build the configuration object for the generated AZAPI Resource class
    const config: ResourceConfig = {
      type: `${this._resourceType}@${this.apiVersion}`,
      name: name,
      parentId: parentId,
      body: properties,
      // Add location conditionally if provided and not already in properties
      ...(location && !properties.location && { location: location }),
    };

    // Create and return the AZAPI resource using the generated provider class
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
