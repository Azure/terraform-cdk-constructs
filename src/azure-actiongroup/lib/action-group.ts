/**
 * Unified Azure Action Group implementation using AzapiResource framework
 *
 * This class provides a version-aware implementation for Azure Action Groups
 * that automatically handles version management, schema validation, and property
 * transformation across all supported API versions.
 *
 * Supported API Versions:
 * - 2021-09-01 (Active, Latest)
 *
 * Features:
 * - Automatic latest version resolution when no version is specified
 * - Explicit version pinning for stability requirements
 * - Schema-driven validation and transformation
 * - Full JSII compliance for multi-language support
 * - Support for multiple receiver types (email, SMS, webhook, etc.)
 */

import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ALL_ACTION_GROUP_VERSIONS,
  ACTION_GROUP_TYPE,
} from "./action-group-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

/**
 * Email receiver configuration
 */
export interface EmailReceiver {
  /**
   * The name of the email receiver
   */
  readonly name: string;

  /**
   * The email address to send notifications to
   */
  readonly emailAddress: string;

  /**
   * Whether to use common alert schema
   * @defaultValue false
   */
  readonly useCommonAlertSchema?: boolean;
}

/**
 * SMS receiver configuration
 */
export interface SmsReceiver {
  /**
   * The name of the SMS receiver
   */
  readonly name: string;

  /**
   * The country code (e.g., "1" for US)
   */
  readonly countryCode: string;

  /**
   * The phone number to send SMS to
   */
  readonly phoneNumber: string;
}

/**
 * Webhook receiver configuration
 */
export interface WebhookReceiver {
  /**
   * The name of the webhook receiver
   */
  readonly name: string;

  /**
   * The service URI to send webhooks to
   */
  readonly serviceUri: string;

  /**
   * Whether to use common alert schema
   * @defaultValue false
   */
  readonly useCommonAlertSchema?: boolean;
}

/**
 * Azure Function receiver configuration
 */
export interface AzureFunctionReceiver {
  /**
   * The name of the Azure Function receiver
   */
  readonly name: string;

  /**
   * The function app resource ID
   */
  readonly functionAppResourceId: string;

  /**
   * The function name
   */
  readonly functionName: string;

  /**
   * The HTTP trigger URL
   */
  readonly httpTriggerUrl: string;

  /**
   * Whether to use common alert schema
   * @defaultValue false
   */
  readonly useCommonAlertSchema?: boolean;
}

/**
 * Logic App receiver configuration
 */
export interface LogicAppReceiver {
  /**
   * The name of the Logic App receiver
   */
  readonly name: string;

  /**
   * The Logic App resource ID
   */
  readonly resourceId: string;

  /**
   * The callback URL
   */
  readonly callbackUrl: string;

  /**
   * Whether to use common alert schema
   * @defaultValue false
   */
  readonly useCommonAlertSchema?: boolean;
}

/**
 * Voice receiver configuration
 */
export interface VoiceReceiver {
  /**
   * The name of the voice receiver
   */
  readonly name: string;

  /**
   * The country code (e.g., "1" for US)
   */
  readonly countryCode: string;

  /**
   * The phone number to call
   */
  readonly phoneNumber: string;
}

/**
 * Properties for the unified Azure Action Group
 *
 * Extends AzapiResourceProps with Action Group specific properties
 */
export interface ActionGroupProps extends AzapiResourceProps {
  /**
   * Short name for SMS notifications (max 12 chars)
   * @example "OpsTeam"
   */
  readonly groupShortName: string;

  /**
   * Whether the action group is enabled
   * @defaultValue true
   */
  readonly enabled?: boolean;

  /**
   * Email notification receivers
   */
  readonly emailReceivers?: EmailReceiver[];

  /**
   * SMS notification receivers
   */
  readonly smsReceivers?: SmsReceiver[];

  /**
   * Webhook notification receivers
   */
  readonly webhookReceivers?: WebhookReceiver[];

  /**
   * Azure Function receivers
   */
  readonly azureFunctionReceivers?: AzureFunctionReceiver[];

  /**
   * Logic App receivers
   */
  readonly logicAppReceivers?: LogicAppReceiver[];

  /**
   * Voice call receivers
   */
  readonly voiceReceivers?: VoiceReceiver[];

  /**
   * Resource group ID where the action group will be created
   */
  readonly resourceGroupId?: string;
}

/**
 * Action Group properties for the request body
 */
export interface ActionGroupBodyProperties {
  readonly groupShortName: string;
  readonly enabled: boolean;
  readonly emailReceivers?: EmailReceiver[];
  readonly smsReceivers?: SmsReceiver[];
  readonly webhookReceivers?: WebhookReceiver[];
  readonly azureFunctionReceivers?: AzureFunctionReceiver[];
  readonly logicAppReceivers?: LogicAppReceiver[];
  readonly voiceReceivers?: VoiceReceiver[];
}

/**
 * The resource body interface for Azure Action Group API calls
 */
export interface ActionGroupBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties: ActionGroupBodyProperties;
}

/**
 * Unified Azure Action Group implementation
 *
 * This class provides a single, version-aware implementation that automatically handles version
 * resolution, schema validation, and property transformation while maintaining full JSII compliance.
 *
 * Action Groups serve as the central notification hub for Azure Monitor alerts, supporting
 * multiple receiver types including email, SMS, webhook, Azure Functions, Logic Apps, and voice calls.
 *
 * @example
 * // Basic action group with email notifications:
 * const actionGroup = new ActionGroup(this, "ops-team", {
 *   name: "ops-action-group",
 *   groupShortName: "OpsTeam",
 *   resourceGroupId: resourceGroup.id,
 *   emailReceivers: [{
 *     name: "ops-email",
 *     emailAddress: "ops@company.com",
 *     useCommonAlertSchema: true
 *   }]
 * });
 *
 * @example
 * // Action group with multiple receiver types:
 * const actionGroup = new ActionGroup(this, "critical-alerts", {
 *   name: "critical-action-group",
 *   groupShortName: "Critical",
 *   resourceGroupId: resourceGroup.id,
 *   emailReceivers: [{
 *     name: "oncall-email",
 *     emailAddress: "oncall@company.com",
 *     useCommonAlertSchema: true
 *   }],
 *   smsReceivers: [{
 *     name: "oncall-sms",
 *     countryCode: "1",
 *     phoneNumber: "5551234567"
 *   }],
 *   webhookReceivers: [{
 *     name: "pagerduty-webhook",
 *     serviceUri: "https://events.pagerduty.com/...",
 *     useCommonAlertSchema: true
 *   }]
 * });
 *
 * @stability stable
 */
export class ActionGroup extends AzapiResource {
  static {
    AzapiResource.registerSchemas(ACTION_GROUP_TYPE, ALL_ACTION_GROUP_VERSIONS);
  }

  /**
   * The input properties for this Action Group instance
   */
  public readonly props: ActionGroupProps;

  // Output properties for easy access and referencing
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;

  // Public properties

  /**
   * Creates a new Azure Action Group using the AzapiResource framework
   *
   * The constructor automatically handles version resolution, schema registration,
   * validation, and resource creation.
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Action Group
   */
  constructor(scope: Construct, id: string, props: ActionGroupProps) {
    super(scope, id, props);

    this.props = props;

    // Extract properties from the AZAPI resource outputs using Terraform interpolation

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Action Group",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Action Group",
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
   * Returns the most recent stable version as the default
   */
  protected defaultVersion(): string {
    return "2021-09-01";
  }

  /**
   * Gets the Azure resource type for Action Groups
   */
  protected resourceType(): string {
    return ACTION_GROUP_TYPE;
  }

  /**
   * Gets the API schema for the resolved version
   * Uses the framework's schema resolution to get the appropriate schema
   */
  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  /**
   * Creates the resource body for the Azure API call
   * Transforms the input properties into the JSON format expected by Azure REST API
   */
  protected createResourceBody(props: any): any {
    const typedProps = props as ActionGroupProps;
    return {
      location: "Global",
      tags: typedProps.tags || {},
      properties: {
        groupShortName: typedProps.groupShortName,
        enabled: typedProps.enabled !== undefined ? typedProps.enabled : true,
        emailReceivers: typedProps.emailReceivers || [],
        smsReceivers: typedProps.smsReceivers || [],
        webhookReceivers: typedProps.webhookReceivers || [],
        azureFunctionReceivers: typedProps.azureFunctionReceivers || [],
        logicAppReceivers: typedProps.logicAppReceivers || [],
        voiceReceivers: typedProps.voiceReceivers || [],
      },
    };
  }

  // =============================================================================
  // PUBLIC METHODS FOR ACTION GROUP OPERATIONS
  // =============================================================================

  /**
   * Add a tag to the Action Group
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Action Group
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public removeTag(key: string): void {
    if (this.props.tags && this.props.tags[key]) {
      delete this.props.tags[key];
    }
  }
}
