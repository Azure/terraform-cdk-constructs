/**
 * Azure SRE Agent (Microsoft.App/agents) construct using the
 * VersionedAzapiResource framework.
 *
 * Azure SRE Agent provides AI-powered Site Reliability Engineering agents
 * that can be configured with knowledge graphs, actions, incident
 * management integration and a default AI model.
 *
 * Supported API Versions:
 * - 2026-01-01 (Active, Latest, Stable)
 *
 * Reference:
 * https://github.com/Azure/azure-rest-api-specs/tree/main/specification/app/resource-manager/Microsoft.App/SreAgent
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { ALL_SRE_AGENT_VERSIONS, SRE_AGENT_TYPE } from "./sre-agent-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Managed Service Identity configuration for the SRE Agent.
 *
 * Mirrors the ManagedServiceIdentity shape used by Azure ARM resources.
 */
export interface SreAgentManagedIdentity {
  /**
   * The type of managed service identity.
   *
   * Allowed values: "None", "SystemAssigned", "UserAssigned",
   * "SystemAssigned,UserAssigned".
   */
  readonly type: string;

  /**
   * Set of user assigned identities, keyed by their ARM resource IDs.
   */
  readonly userAssignedIdentities?: { [key: string]: any };
}

/**
 * Agent identity configuration.
 *
 * Used by the SRE Agent runtime to obtain credentials for accessing
 * external systems on behalf of the agent.
 */
export interface SreAgentIdentity {
  /**
   * Initial sponsor group ID (required by the Azure API)
   */
  readonly initialSponsorGroupId: string;
}

/**
 * Properties for the Azure SRE Agent construct
 */
export interface SreAgentProps extends AzapiResourceProps {
  /**
   * The ARM resource ID of the parent resource group.
   *
   * If omitted, the resource will be scoped to the subscription, which
   * is typically not valid for tracked resources.
   */
  readonly resourceGroupId?: string;

  /**
   * The ARM resource ID of the Agent Space (Microsoft.App/agentSpaces)
   * that this Agent belongs to. Optional.
   */
  readonly agentSpaceId?: string;

  /**
   * Managed service identity configuration assigned to the SRE Agent.
   */
  readonly identity?: SreAgentManagedIdentity;

  /**
   * Agent identity configuration used by the SRE Agent runtime to
   * access external systems.
   */
  readonly agentIdentity?: SreAgentIdentity;

  /**
   * Default AI model configuration for the SRE Agent.
   *
   * Free-form object passed directly to the Azure REST API. Fields vary
   * depending on the chosen model provider (e.g. model name, deployment
   * name, endpoint).
   */
  readonly defaultModel?: { [key: string]: any };

  /**
   * Knowledge graph configuration.
   */
  readonly knowledgeGraphConfiguration?: { [key: string]: any };

  /**
   * Action configuration.
   */
  readonly actionConfiguration?: { [key: string]: any };

  /**
   * Log configuration.
   */
  readonly logConfiguration?: { [key: string]: any };

  /**
   * Incident management configuration.
   */
  readonly incidentManagementConfiguration?: { [key: string]: any };

  /**
   * Upgrade channel for the SRE Agent.
   */
  readonly upgradeChannel?: string;

  /**
   * Lifecycle ignore_changes rules.
   *
   * @example ["tags"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * Resource body for Azure SRE Agent API calls.
 *
 * Matches the Microsoft.App/agents Azure REST API schema.
 */
export interface SreAgentBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly identity?: SreAgentManagedIdentity;
  readonly properties?: { [key: string]: any };
}

/**
 * Azure SRE Agent (Microsoft.App/agents) construct.
 *
 * @example
 * // Basic SRE Agent
 * const agent = new SreAgent(this, "sre-agent", {
 *   name: "my-sre-agent",
 *   location: "eastus",
 *   resourceGroupId: resourceGroup.id,
 *   identity: { type: "SystemAssigned" },
 *   agentIdentity: {
 *     initialSponsorGroupId: "00000000-0000-0000-0000-000000000000",
 *   },
 * });
 *
 * @stability stable
 */
export class SreAgent extends AzapiResource {
  static {
    AzapiResource.registerSchemas(SRE_AGENT_TYPE, ALL_SRE_AGENT_VERSIONS);
  }

  /**
   * Input properties for this SRE Agent instance.
   */
  public readonly props: SreAgentProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;
  public readonly agentEndpointOutput: cdktf.TerraformOutput;
  public readonly provisioningStateOutput: cdktf.TerraformOutput;
  public readonly powerStateOutput: cdktf.TerraformOutput;

  constructor(scope: Construct, id: string, props: SreAgentProps) {
    super(scope, id, props);

    this.props = props;

    // Create Terraform outputs
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the SRE Agent",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the SRE Agent",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the SRE Agent",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the SRE Agent",
    });

    this.agentEndpointOutput = new cdktf.TerraformOutput(
      this,
      "agent_endpoint",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.agentEndpoint}`,
        description: "The data plane endpoint of the SRE Agent",
      },
    );

    this.provisioningStateOutput = new cdktf.TerraformOutput(
      this,
      "provisioning_state",
      {
        value: `\${${this.terraformResource.fqn}.output.properties.provisioningState}`,
        description: "The provisioning state of the SRE Agent",
      },
    );

    this.powerStateOutput = new cdktf.TerraformOutput(this, "power_state", {
      value: `\${${this.terraformResource.fqn}.output.properties.powerState}`,
      description: "The power state of the SRE Agent (Running or Stopped)",
    });

    // Override logical IDs to keep output names consistent
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.agentEndpointOutput.overrideLogicalId("agent_endpoint");
    this.provisioningStateOutput.overrideLogicalId("provisioning_state");
    this.powerStateOutput.overrideLogicalId("power_state");

    this._applyIgnoreChanges();
  }

  // =============================================================================
  // REQUIRED ABSTRACT METHODS
  // =============================================================================

  protected defaultVersion(): string {
    return "2026-01-01";
  }

  protected resourceType(): string {
    return SRE_AGENT_TYPE;
  }

  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  protected requiresLocation(): boolean {
    return true;
  }

  /**
   * Disable AZAPI provider schema validation for this resource.
   *
   * The Azure SRE Agent resource type (`Microsoft.App/agents`) was introduced
   * after the AZAPI provider version currently pinned by this repository and
   * is therefore not yet present in the provider's embedded schema. Disabling
   * schema validation lets the resource be applied against the live Azure API
   * (which is the source of truth) without requiring a provider upgrade.
   *
   * `ignoreMissingProperty` is also enabled because the API returns a number
   * of computed/read-only fields that aren't part of the request body.
   */
  protected customizeResourceConfig(config: any): any {
    return {
      ...config,
      schemaValidationEnabled: false,
      ignoreMissingProperty: true,
    };
  }

  /**
   * Build the resource body for the Microsoft.App/agents Azure REST API.
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as SreAgentProps;

    const properties: { [key: string]: any } = {};
    if (typedProps.agentSpaceId !== undefined) {
      properties.agentSpaceId = typedProps.agentSpaceId;
    }
    if (typedProps.agentIdentity !== undefined) {
      properties.agentIdentity = typedProps.agentIdentity;
    }
    if (typedProps.defaultModel !== undefined) {
      properties.defaultModel = typedProps.defaultModel;
    }
    if (typedProps.knowledgeGraphConfiguration !== undefined) {
      properties.knowledgeGraphConfiguration =
        typedProps.knowledgeGraphConfiguration;
    }
    if (typedProps.actionConfiguration !== undefined) {
      properties.actionConfiguration = typedProps.actionConfiguration;
    }
    if (typedProps.logConfiguration !== undefined) {
      properties.logConfiguration = typedProps.logConfiguration;
    }
    if (typedProps.incidentManagementConfiguration !== undefined) {
      properties.incidentManagementConfiguration =
        typedProps.incidentManagementConfiguration;
    }
    if (typedProps.upgradeChannel !== undefined) {
      properties.upgradeChannel = typedProps.upgradeChannel;
    }

    const body: SreAgentBody = {
      location: this.location!,
      tags: this.allTags(),
      identity: typedProps.identity,
      properties: Object.keys(properties).length > 0 ? properties : undefined,
    };

    return body;
  }

  // =============================================================================
  // PUBLIC READ-ONLY OUTPUTS
  // =============================================================================

  /**
   * The data plane endpoint of the SRE Agent (populated after creation).
   */
  public get agentEndpoint(): string {
    return `\${${this.terraformResource.fqn}.output.properties.agentEndpoint}`;
  }

  /**
   * The provisioning state of the SRE Agent (populated after creation).
   */
  public get provisioningState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.provisioningState}`;
  }

  /**
   * The power state of the SRE Agent (populated after creation).
   */
  public get powerState(): string {
    return `\${${this.terraformResource.fqn}.output.properties.powerState}`;
  }

  // =============================================================================
  // TAG MANAGEMENT
  // =============================================================================

  /**
   * Add a tag to the SRE Agent.
   */
  public addSreAgentTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the SRE Agent.
   */
  public removeSreAgentTag(key: string): void {
    if (this.props.tags && this.props.tags[key]) {
      delete this.props.tags[key];
    }
  }

  // =============================================================================
  // PRIVATE HELPERS
  // =============================================================================

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
