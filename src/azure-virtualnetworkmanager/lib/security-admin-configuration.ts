/**
 * Azure Virtual Network Manager Security Admin Configuration implementation using AzapiResource framework
 *
 * This class provides a unified implementation for defining high-priority security rules that
 * are evaluated before traditional NSGs. Security admin configurations enable centralized
 * security policy enforcement across virtual networks.
 *
 * Supported API Versions:
 * - 2023-11-01 (Maintenance)
 * - 2024-05-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - High-priority rules that override NSG rules
 * - Full backward compatibility
 * - JSII compliance for multi-language support
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_SECURITY_ADMIN_CONFIGURATION_VERSIONS,
  SECURITY_ADMIN_CONFIGURATION_TYPE,
} from "./security-admin-configuration-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Properties for the Azure Virtual Network Manager Security Admin Configuration
 *
 * Extends AzapiResourceProps with Security Admin Configuration specific properties
 */
export interface SecurityAdminConfigurationProps extends AzapiResourceProps {
  /**
   * Resource ID of the parent Network Manager
   * @example "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/networkManagers/vnm"
   */
  readonly networkManagerId: string;

  /**
   * Optional description of the security admin configuration
   * @example "Organization-wide security rules for production workloads"
   */
  readonly description?: string;

  /**
   * Services to apply the security admin configuration on
   * @example ["None"]
   * @example ["All"]
   */
  readonly applyOnNetworkIntentPolicyBasedServices?: string[];

  /**
   * The lifecycle rules to ignore changes
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Properties for Security Admin Configuration body
 */
export interface SecurityAdminConfigurationProperties {
  readonly description?: string;
  readonly applyOnNetworkIntentPolicyBasedServices?: string[];
}

/**
 * The resource body interface for Azure Security Admin Configuration API calls
 */
export interface SecurityAdminConfigurationBody {
  readonly properties?: SecurityAdminConfigurationProperties;
}

/**
 * Azure Virtual Network Manager Security Admin Configuration implementation
 *
 * Security admin configurations define high-priority security rules that are evaluated
 * BEFORE traditional Network Security Groups (NSGs). This allows organizations to enforce
 * security policies that cannot be overridden by individual teams managing NSGs.
 *
 * Key features:
 * - Three action types: Allow (NSG can still deny), Deny (stops traffic), AlwaysAllow (forces allow)
 * - Higher priority than NSG rules
 * - Centralized security policy enforcement
 * - Can block high-risk ports organization-wide
 *
 * @example
 * // Basic security admin configuration:
 * const securityConfig = new SecurityAdminConfiguration(this, "security-config", {
 *   name: "production-security",
 *   networkManagerId: networkManager.id,
 *   description: "High-priority security rules for production"
 * });
 *
 * @example
 * // Configuration with service-specific settings:
 * const securityConfig = new SecurityAdminConfiguration(this, "security-config", {
 *   name: "org-security-rules",
 *   networkManagerId: networkManager.id,
 *   description: "Organization-wide security enforcement",
 *   applyOnNetworkIntentPolicyBasedServices: ["None"],
 *   apiVersion: "2024-05-01"
 * });
 *
 * @stability stable
 */
export class SecurityAdminConfiguration extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      SECURITY_ADMIN_CONFIGURATION_TYPE,
      ALL_SECURITY_ADMIN_CONFIGURATION_VERSIONS,
    );
  }

  /**
   * The input properties for this Security Admin Configuration instance
   */
  public readonly props: SecurityAdminConfigurationProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;

  // Public properties
  public readonly resourceName: string;

  /**
   * Creates a new Azure Virtual Network Manager Security Admin Configuration using the AzapiResource framework
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Security Admin Configuration
   */
  constructor(
    scope: Construct,
    id: string,
    props: SecurityAdminConfigurationProps,
  ) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    this.resourceName = `\${${this.terraformResource.fqn}.name}`;

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Security Admin Configuration",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: this.resourceName,
      description: "The name of the Security Admin Configuration",
    });

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioningState",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description:
          "The provisioning state of the Security Admin Configuration",
      },
    );

    // Override logical IDs to match naming convention
    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
    this.provisioningStateOutput.overrideLogicalId("provisioningState");

    // Apply ignore changes if specified
    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS FROM AzapiResource
  // =============================================================================

  /**
   * Resolves the parent resource ID for the Security Admin Configuration
   * Security Admin Configurations are scoped to Network Managers
   */
  protected resolveParentId(props: any): string {
    const typedProps = props as SecurityAdminConfigurationProps;
    return typedProps.networkManagerId;
  }

  /**
   * Gets the default API version to use when no explicit version is specified
   */
  protected defaultVersion(): string {
    return "2024-05-01";
  }

  /**
   * Gets the Azure resource type for Security Admin Configurations
   */
  protected resourceType(): string {
    return SECURITY_ADMIN_CONFIGURATION_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Creates the resource body for the Azure API call
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as SecurityAdminConfigurationProps;
    return {
      properties: {
        description: typedProps.description,
        applyOnNetworkIntentPolicyBasedServices:
          typedProps.applyOnNetworkIntentPolicyBasedServices,
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR SECURITY ADMIN CONFIGURATION OPERATIONS
  // =============================================================================

  /**
   * Get the provisioning state of the Security Admin Configuration
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Applies ignore changes lifecycle rules if specified in props
   */
  private _applyIgnoreChanges(): void {
    if (this.props.ignoreChanges && this.props.ignoreChanges.length > 0) {
      this.terraformResource.addOverride("lifecycle", {
        ignore_changes: this.props.ignoreChanges,
      });
    }
  }
}
