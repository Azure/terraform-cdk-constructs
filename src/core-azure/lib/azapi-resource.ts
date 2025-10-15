import * as cdktf from "cdktf";
import { Construct } from "constructs";
// Import from the copied providers directory
import { Resource, ResourceConfig } from "./providers-azapi/resource";

/**
 * Base properties for all AZAPI resources
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
}

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
  readonly category: string;
  readonly enabled: boolean;
  readonly retentionPolicy?: RetentionPolicyConfig;
}

/**
 * Base class for all AZAPI-based Azure resources
 *
 * This class provides the foundation for creating Azure resources using the AZAPI provider,
 * which uses Azure REST API directly instead of the AzureRM provider. This allows for
 * immediate access to new Azure features and API versions without any dependency on AzureRM.
 */
export abstract class AzapiResource extends Construct {
  /**
   * The Azure resource type (e.g., "Microsoft.Resources/resourceGroups")
   */
  protected abstract readonly resourceType: string;

  /**
   * The API version to use for this resource
   */
  protected abstract readonly apiVersion: string;

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
   * The resource ID
   */
  public abstract readonly id: string;

  constructor(scope: Construct, id: string, props?: AzapiResourceProps) {
    super(scope, id);

    this.name = props?.name || this.node.id;
    this.location = props?.location || "eastus";
  }

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
    // Use spread operator to handle readonly properties correctly
    const config: ResourceConfig = {
      type: `${this.resourceType}@${this.apiVersion}`,
      name: name,
      parentId: parentId,
      body: properties,
      // Add location conditionally if provided and not already in properties
      ...(location && !properties.location && { location: location }),
    };

    // Create and return the AZAPI resource using the generated provider class
    // This provides type safety, IDE support, and automatic schema validation
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

    dataSource.addOverride("type", this.resourceType);
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
   * Adds an access role assignment for a specified Azure AD object (e.g., user, group, service principal) within this resource's scope.
   *
   * Note: This method creates role assignments using AZAPI instead of AzureRM provider.
   * This ensures no dependency on the AzureRM provider while maintaining the same functionality.
   *
   * @param objectId - The unique identifier of the Azure AD object (user, group, or service principal) that will receive the role assignment.
   * @param roleDefinitionName - The name of the Azure RBAC role to be assigned.
   *
   * Example usage:
   * ```typescript
   * resource.addAccess('user-object-id', 'Reader');
   * ```
   */
  public addAccess(objectId: string, roleDefinitionName: string): void {
    new AzapiRoleAssignment(this, `rbac-${objectId}-${roleDefinitionName}`, {
      objectId: objectId,
      roleDefinitionName: roleDefinitionName,
      scope: this.resourceId,
    });
  }

  /**
   * Adds diagnostic settings to this resource using AZAPI
   *
   * @param props - The diagnostic settings configuration
   */
  public addDiagnosticSettings(
    props: AzapiDiagnosticSettingsProps,
  ): AzapiDiagnosticSettings {
    return new AzapiDiagnosticSettings(this, "diagnostics", {
      ...props,
      targetResourceId: this.resourceId,
    });
  }
}

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

    // Use the generated Resource class instead of manual overrides
    const config: ResourceConfig = {
      type: "Microsoft.Authorization/roleAssignments",
      name: "[guid()]",
      parentId: props.scope,
      body: properties,
    };

    new Resource(this, "role-assignment", config);
  }
}

/**
 * Properties for AZAPI diagnostic settings
 */
export interface AzapiDiagnosticSettingsProps {
  readonly name?: string;
  readonly logAnalyticsWorkspaceId?: string;
  readonly eventhubAuthorizationRuleId?: string;
  readonly eventhubName?: string;
  readonly storageAccountId?: string;
  readonly targetResourceId?: string;
  readonly logs?: DiagnosticLogConfig[];
  readonly metrics?: DiagnosticMetricConfig[];
}

/**
 * AZAPI-based diagnostic settings construct
 */
export class AzapiDiagnosticSettings extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: AzapiDiagnosticSettingsProps,
  ) {
    super(scope, id);

    const properties: Record<string, any> = {};

    if (props.logAnalyticsWorkspaceId) {
      properties.workspaceId = props.logAnalyticsWorkspaceId;
    }

    if (props.eventhubAuthorizationRuleId) {
      properties.eventHubAuthorizationRuleId =
        props.eventhubAuthorizationRuleId;
    }

    if (props.eventhubName) {
      properties.eventHubName = props.eventhubName;
    }

    if (props.storageAccountId) {
      properties.storageAccountId = props.storageAccountId;
    }

    if (props.logs) {
      properties.logs = props.logs;
    }

    if (props.metrics) {
      properties.metrics = props.metrics;
    }

    // Use the generated Resource class instead of manual overrides
    const config: ResourceConfig = {
      type: "Microsoft.Insights/diagnosticSettings",
      name: props.name || "diagnostics",
      parentId: props.targetResourceId || "",
      body: properties,
    };

    new Resource(this, "diagnostic-settings", config);
  }
}
