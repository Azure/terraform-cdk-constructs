import * as cdktn from "cdktn";
import { Construct } from "constructs";
import {
  ALL_EVENT_SUBSCRIPTION_VERSIONS,
  EVENT_SUBSCRIPTION_TYPE,
} from "./event-grid-event-subscription-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

export interface EventGridEventSubscriptionDestination {
  readonly endpointType: string;
  readonly properties?: { [key: string]: any };
}

export interface EventGridEventSubscriptionFilter {
  readonly subjectBeginsWith?: string;
  readonly subjectEndsWith?: string;
  readonly includedEventTypes?: string[];
  readonly isSubjectCaseSensitive?: boolean;
  readonly advancedFilters?: any[];
}

export interface EventGridEventSubscriptionRetryPolicy {
  readonly maxDeliveryAttempts?: number;
  readonly eventTimeToLiveInMinutes?: number;
}

export interface EventGridEventSubscriptionDeadLetterDestination {
  readonly endpointType: string;
  readonly properties?: { [key: string]: any };
}

export interface EventGridEventSubscriptionProps extends AzapiResourceProps {
  /** The scope resource ID (parent) for this event subscription */
  readonly scope: string;
  /** Event destination configuration */
  readonly destination: EventGridEventSubscriptionDestination;
  /** Filter criteria */
  readonly filter?: EventGridEventSubscriptionFilter;
  /** Event delivery schema (default: EventGridSchema) */
  readonly eventDeliverySchema?: string;
  /** Retry policy */
  readonly retryPolicy?: EventGridEventSubscriptionRetryPolicy;
  /** Dead letter destination */
  readonly deadLetterDestination?: EventGridEventSubscriptionDeadLetterDestination;
  /** Labels */
  readonly labels?: string[];
  /** Expiration time in UTC */
  readonly expirationTimeUtc?: string;
}

export class EventGridEventSubscription extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      EVENT_SUBSCRIPTION_TYPE,
      ALL_EVENT_SUBSCRIPTION_VERSIONS,
    );
  }

  public readonly props: EventGridEventSubscriptionProps;
  public readonly idOutput: cdktn.TerraformOutput;
  public readonly nameOutput: cdktn.TerraformOutput;

  constructor(
    scope: Construct,
    id: string,
    props: EventGridEventSubscriptionProps,
  ) {
    super(scope, id, props);
    this.props = props;

    this.idOutput = new cdktn.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Event Grid Event Subscription",
    });
    this.nameOutput = new cdktn.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Event Grid Event Subscription",
    });

    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
  }

  protected defaultVersion(): string {
    return "2025-02-15";
  }

  protected resourceType(): string {
    return EVENT_SUBSCRIPTION_TYPE;
  }

  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  protected requiresLocation(): boolean {
    return false;
  }

  protected supportsTags(): boolean {
    return false;
  }

  protected createResourceBody(props: any): any {
    const typedProps = props as EventGridEventSubscriptionProps;
    return {
      properties: {
        destination: typedProps.destination,
        filter: typedProps.filter,
        eventDeliverySchema:
          typedProps.eventDeliverySchema || "EventGridSchema",
        retryPolicy: typedProps.retryPolicy,
        deadLetterDestination: typedProps.deadLetterDestination,
        labels: typedProps.labels,
        expirationTimeUtc: typedProps.expirationTimeUtc,
      },
    };
  }

  protected resolveParentId(props: any): string {
    const typedProps = props as EventGridEventSubscriptionProps;
    return typedProps.scope;
  }

  public get resourceId(): string {
    return this.id;
  }
}
