import * as cdktn from "cdktn";
import { Construct } from "constructs";
import {
  ALL_SYSTEM_TOPIC_VERSIONS,
  SYSTEM_TOPIC_TYPE,
} from "./event-grid-system-topic-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

export interface EventGridSystemTopicIdentity {
  readonly type: string;
  readonly userAssignedIdentities?: { [key: string]: any };
}

export interface EventGridSystemTopicProps extends AzapiResourceProps {
  /** Source Azure resource ID for the system topic */
  readonly source: string;
  /** Topic type (e.g., "Microsoft.Storage.StorageAccounts") */
  readonly topicType: string;
  /** Managed identity configuration */
  readonly identity?: EventGridSystemTopicIdentity;
  /** Resource group ID */
  readonly resourceGroupId?: string;
}

export interface EventGridSystemTopicBodyProperties {
  readonly source: string;
  readonly topicType: string;
}

export interface EventGridSystemTopicBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
  readonly properties: EventGridSystemTopicBodyProperties;
  readonly identity?: EventGridSystemTopicIdentity;
}

export class EventGridSystemTopic extends AzapiResource {
  static {
    AzapiResource.registerSchemas(SYSTEM_TOPIC_TYPE, ALL_SYSTEM_TOPIC_VERSIONS);
  }

  public readonly props: EventGridSystemTopicProps;
  public readonly idOutput: cdktn.TerraformOutput;
  public readonly locationOutput: cdktn.TerraformOutput;
  public readonly nameOutput: cdktn.TerraformOutput;
  public readonly tagsOutput: cdktn.TerraformOutput;

  constructor(scope: Construct, id: string, props: EventGridSystemTopicProps) {
    super(scope, id, props);
    this.props = props;

    this.idOutput = new cdktn.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Event Grid System Topic",
    });
    this.locationOutput = new cdktn.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Event Grid System Topic",
    });
    this.nameOutput = new cdktn.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Event Grid System Topic",
    });
    this.tagsOutput = new cdktn.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Event Grid System Topic",
    });

    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
  }

  protected defaultVersion(): string {
    return "2025-02-15";
  }

  protected resourceType(): string {
    return SYSTEM_TOPIC_TYPE;
  }

  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  protected requiresLocation(): boolean {
    return true;
  }

  protected createResourceBody(props: any): any {
    const typedProps = props as EventGridSystemTopicProps;
    return {
      location: this.location,
      tags: this.allTags(),
      properties: {
        source: typedProps.source,
        topicType: typedProps.topicType,
      },
      identity: typedProps.identity,
    };
  }

  public get resourceId(): string {
    return this.id;
  }
}
