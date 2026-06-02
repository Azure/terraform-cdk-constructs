/**
 * Unified Azure Application Insights implementation using AzapiResource framework
 *
 * This class provides a version-aware implementation for Azure Application Insights
 * components that automatically handles version management, schema validation, and
 * property transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2020-02-02 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full JSII compliance for multi-language support
 * - Workspace-based Application Insights (classic mode is retired)
 * - Configurable sampling, retention, IP masking, and network access
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_APPLICATION_INSIGHTS_VERSIONS,
  APPLICATION_INSIGHTS_TYPE,
} from "./application-insights-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Supported Application Insights application types
 *
 * Determines how telemetry is processed and visualized.
 */
export type ApplicationInsightsApplicationType =
  | "web"
  | "other"
  | "java"
  | "MobileCenter"
  | "Node.JS"
  | "ios"
  | "store";

/**
 * Allowed retention values (in days) for Application Insights
 */
export const APPLICATION_INSIGHTS_VALID_RETENTION_DAYS: number[] = [
  30, 60, 90, 120, 180, 270, 365, 550, 730,
];

/**
 * Properties for the unified Azure Application Insights component
 *
 * Extends AzapiResourceProps with Application Insights specific properties
 */
export interface ApplicationInsightsProps extends AzapiResourceProps {
  /**
   * Resource Group ID where the Application Insights component will be created
   * The component will be created as a child of this resource group
   */
  readonly resourceGroupId: string;

  /**
   * Resource ID of the Log Analytics workspace to associate with this component
   *
   * Required for workspace-based Application Insights (the only supported mode
   * since the classic mode was retired on February 29, 2024).
   */
  readonly workspaceResourceId: string;

  /**
   * Type of application being monitored
   *
   * Determines how telemetry data is processed and visualized.
   *
   * @defaultValue "web"
   */
  readonly applicationType?: ApplicationInsightsApplicationType;

  /**
   * Telemetry data retention period in days
   *
   * Allowed values: 30, 60, 90, 120, 180, 270, 365, 550, 730.
   *
   * @defaultValue 90
   */
  readonly retentionInDays?: number;

  /**
   * Telemetry sampling percentage
   *
   * Value between 0 and 100. When set below 100, only a subset of telemetry is
   * captured to reduce ingestion volume and cost.
   */
  readonly samplingPercentage?: number;

  /**
   * Whether IP address masking is disabled
   *
   * When false (default), Application Insights masks the last octet of client
   * IP addresses to protect end-user privacy.
   *
   * @defaultValue false
   */
  readonly disableIpMasking?: boolean;

  /**
   * Public network access for data ingestion
   *
   * @defaultValue "Enabled"
   */
  readonly publicNetworkAccessForIngestion?: "Enabled" | "Disabled";

  /**
   * Public network access for querying telemetry
   *
   * @defaultValue "Enabled"
   */
  readonly publicNetworkAccessForQuery?: "Enabled" | "Disabled";

  /**
   * Whether local (instrumentation key based) authentication is disabled
   *
   * When true, only Microsoft Entra ID (Azure AD) authentication can be used to
   * ingest and query telemetry.
   *
   * @defaultValue false
   */
  readonly disableLocalAuth?: boolean;

  /**
   * Force the use of a customer-provided storage account for the profiler and
   * snapshot debugger.
   *
   * @defaultValue false
   */
  readonly forceCustomerStorageForProfiler?: boolean;
}

/**
 * Unified Azure Application Insights implementation
 *
 * This class provides a single, version-aware implementation that automatically
 * handles version resolution, schema validation, and property transformation
 * while maintaining full JSII compliance.
 *
 * Application Insights is an extensible Application Performance Management (APM)
 * service that helps you monitor live web applications. It automatically detects
 * performance anomalies and includes powerful analytics tools to help diagnose
 * issues and understand application usage.
 *
 * Workspace-based Application Insights resources send telemetry to a Log
 * Analytics workspace, where you can use the full power of Kusto Query Language
 * (KQL) to analyze your data.
 *
 * @example
 * // Basic Application Insights component:
 * const appInsights = new ApplicationInsights(this, "my-appinsights", {
 *   name: "my-application-insights",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   workspaceResourceId: workspace.id,
 * });
 *
 * @example
 * // Application Insights with custom retention and sampling:
 * const appInsights = new ApplicationInsights(this, "production-ai", {
 *   name: "production-ai",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   workspaceResourceId: workspace.id,
 *   applicationType: "web",
 *   retentionInDays: 365,
 *   samplingPercentage: 50,
 *   tags: {
 *     environment: "production"
 *   }
 * });
 *
 * @stability stable
 */
export class ApplicationInsights extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      APPLICATION_INSIGHTS_TYPE,
      ALL_APPLICATION_INSIGHTS_VERSIONS,
    );
  }

  /**
   * The input properties for this Application Insights instance
   */
  public readonly props: ApplicationInsightsProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly instrumentationKeyOutput: cdktf.TerraformOutput;
  public readonly connectionStringOutput: cdktf.TerraformOutput;
  public readonly appIdOutput: cdktf.TerraformOutput;

  /**
   * Creates a new Azure Application Insights component using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Application Insights component
   */
  constructor(scope: Construct, id: string, props: ApplicationInsightsProps) {
    // Validate retention days if provided
    if (props.retentionInDays !== undefined) {
      if (
        !APPLICATION_INSIGHTS_VALID_RETENTION_DAYS.includes(
          props.retentionInDays,
        )
      ) {
        throw new Error(
          `retentionInDays must be one of ${APPLICATION_INSIGHTS_VALID_RETENTION_DAYS.join(", ")} days`,
        );
      }
    }

    // Validate sampling percentage if provided
    if (props.samplingPercentage !== undefined) {
      if (props.samplingPercentage < 0 || props.samplingPercentage > 100) {
        throw new Error("samplingPercentage must be between 0 and 100");
      }
    }

    super(scope, id, props);

    this.props = props;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Application Insights component",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Application Insights component",
    });

    this.instrumentationKeyOutput = new cdktf.TerraformOutput(
      this,
      "instrumentation_key",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.InstrumentationKey}`,
        description:
          "The instrumentation key of the Application Insights component",
        sensitive: true,
      },
    );

    this.connectionStringOutput = new cdktf.TerraformOutput(
      this,
      "connection_string",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.ConnectionString}`,
        description:
          "The connection string of the Application Insights component",
        sensitive: true,
      },
    );

    this.appIdOutput = new cdktf.TerraformOutput(this, "app_id", {
      value: `\${${this.terraformResource.fqn}.output.properties.AppId}`,
      description: "The App ID of the Application Insights component",
    });

    // Override logical IDs
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.instrumentationKeyOutput.overrideLogicalId("instrumentation_key");
    this.connectionStringOutput.overrideLogicalId("connection_string");
    this.appIdOutput.overrideLogicalId("app_id");
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Gets the default API version to use when no explicit version is specified
   * Returns the latest stable version as the default
   */
  protected defaultVersion(): string {
    return "2020-02-02";
  }

  /**
   * Gets the Azure resource type for Application Insights
   */
  protected resourceType(): string {
    return APPLICATION_INSIGHTS_TYPE;
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
   * Transforms the input properties into the JSON format expected by Azure REST API
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as ApplicationInsightsProps;

    const body: any = {
      kind: "web",
      properties: {
        Application_Type: typedProps.applicationType ?? "web",
        WorkspaceResourceId: typedProps.workspaceResourceId,
        RetentionInDays: typedProps.retentionInDays ?? 90,
        publicNetworkAccessForIngestion:
          typedProps.publicNetworkAccessForIngestion ?? "Enabled",
        publicNetworkAccessForQuery:
          typedProps.publicNetworkAccessForQuery ?? "Enabled",
      },
    };

    // Add optional properties only if specified
    if (typedProps.samplingPercentage !== undefined) {
      body.properties.SamplingPercentage = typedProps.samplingPercentage;
    }

    if (typedProps.disableIpMasking !== undefined) {
      body.properties.DisableIpMasking = typedProps.disableIpMasking;
    }

    if (typedProps.disableLocalAuth !== undefined) {
      body.properties.DisableLocalAuth = typedProps.disableLocalAuth;
    }

    if (typedProps.forceCustomerStorageForProfiler !== undefined) {
      body.properties.ForceCustomerStorageForProfiler =
        typedProps.forceCustomerStorageForProfiler;
    }

    return body;
  }

  /**
   * Resolves the parent resource ID for Application Insights
   * Application Insights is a top-level resource within a resource group
   *
   * @param props - The resource properties
   * @returns The parent resource ID (the resource group)
   */
  protected resolveParentId(props: any): string {
    return (props as ApplicationInsightsProps).resourceGroupId;
  }
}
