import * as cdktn from "cdktn";
import { Construct } from "constructs";
import {
  ALL_CONTAINER_APPS_JOB_VERSIONS,
  CONTAINER_APPS_JOB_TYPE,
} from "./container-apps-job-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

export interface ContainerAppsJobEnvVar {
  readonly name: string;
  readonly value?: string;
  readonly secretRef?: string;
}

export interface ContainerAppsJobContainerResources {
  readonly cpu?: number;
  readonly memory?: string;
}

export interface ContainerAppsJobContainer {
  readonly name: string;
  readonly image: string;
  readonly resources?: ContainerAppsJobContainerResources;
  readonly command?: string[];
  readonly args?: string[];
  readonly env?: ContainerAppsJobEnvVar[];
}

export interface ContainerAppsJobSecret {
  readonly name: string;
  readonly value?: string;
  readonly keyVaultUrl?: string;
  readonly identity?: string;
}

export interface ContainerAppsJobScaleRuleAuth {
  readonly secretRef: string;
  readonly triggerParameter: string;
}

export interface ContainerAppsJobScaleRule {
  readonly name: string;
  readonly type: string;
  readonly metadata?: { [key: string]: string };
  readonly auth?: ContainerAppsJobScaleRuleAuth[];
}

export interface ContainerAppsJobScheduleTriggerConfig {
  readonly cronExpression: string;
  readonly parallelism?: number;
  readonly replicaCompletionCount?: number;
}

export interface ContainerAppsJobManualTriggerConfig {
  readonly parallelism?: number;
  readonly replicaCompletionCount?: number;
}

export interface ContainerAppsJobEventTriggerScale {
  readonly maxExecutions?: number;
  readonly minExecutions?: number;
  readonly pollingInterval?: number;
  readonly rules?: ContainerAppsJobScaleRule[];
}

export interface ContainerAppsJobEventTriggerConfig {
  readonly parallelism?: number;
  readonly replicaCompletionCount?: number;
  readonly scale?: ContainerAppsJobEventTriggerScale;
}

export interface ContainerAppsJobRegistry {
  readonly server: string;
  readonly username?: string;
  readonly passwordSecretRef?: string;
  readonly identity?: string;
}

export interface ContainerAppsJobConfiguration {
  /** Trigger type: "Manual", "Schedule", or "Event" */
  readonly triggerType: string;
  /** Replica timeout in seconds */
  readonly replicaTimeout: number;
  /** Maximum number of retries */
  readonly replicaRetryLimit?: number;
  /** Cron expression for scheduled jobs */
  readonly scheduleTriggerConfig?: ContainerAppsJobScheduleTriggerConfig;
  /** Manual trigger config */
  readonly manualTriggerConfig?: ContainerAppsJobManualTriggerConfig;
  /** Event trigger config */
  readonly eventTriggerConfig?: ContainerAppsJobEventTriggerConfig;
  /** Secrets */
  readonly secrets?: ContainerAppsJobSecret[];
  /** Registries */
  readonly registries?: ContainerAppsJobRegistry[];
}

export interface ContainerAppsJobVolume {
  readonly name: string;
  readonly storageType?: string;
  readonly storageName?: string;
}

export interface ContainerAppsJobTemplate {
  readonly containers: ContainerAppsJobContainer[];
  readonly initContainers?: ContainerAppsJobContainer[];
  readonly volumes?: ContainerAppsJobVolume[];
}

export interface ContainerAppsJobIdentity {
  readonly type: string;
  readonly userAssignedIdentities?: { [key: string]: { [key: string]: string } };
}

export interface ContainerAppsJobProps extends AzapiResourceProps {
  /** Container Apps Environment ID */
  readonly environmentId: string;
  /** Job configuration */
  readonly configuration: ContainerAppsJobConfiguration;
  /** Job template */
  readonly template: ContainerAppsJobTemplate;
  /** Managed identity */
  readonly identity?: ContainerAppsJobIdentity;
  /** Resource group ID */
  readonly resourceGroupId?: string;
}

export class ContainerAppsJob extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      CONTAINER_APPS_JOB_TYPE,
      ALL_CONTAINER_APPS_JOB_VERSIONS,
    );
  }

  public readonly props: ContainerAppsJobProps;
  public readonly idOutput: cdktn.TerraformOutput;
  public readonly locationOutput: cdktn.TerraformOutput;
  public readonly nameOutput: cdktn.TerraformOutput;
  public readonly tagsOutput: cdktn.TerraformOutput;

  constructor(scope: Construct, id: string, props: ContainerAppsJobProps) {
    super(scope, id, props);
    this.props = props;

    this.idOutput = new cdktn.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Container Apps Job",
    });
    this.locationOutput = new cdktn.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Container Apps Job",
    });
    this.nameOutput = new cdktn.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Container Apps Job",
    });
    this.tagsOutput = new cdktn.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Container Apps Job",
    });

    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
  }

  protected defaultVersion(): string {
    return "2024-03-01";
  }

  protected resourceType(): string {
    return CONTAINER_APPS_JOB_TYPE;
  }

  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  protected requiresLocation(): boolean {
    return true;
  }

  protected createResourceBody(props: any): any {
    const typedProps = props as ContainerAppsJobProps;
    return {
      location: this.location!,
      tags: this.allTags(),
      identity: typedProps.identity,
      properties: {
        environmentId: typedProps.environmentId,
        configuration: typedProps.configuration,
        template: typedProps.template,
      },
    };
  }

  protected customizeResourceConfig(config: any): any {
    const updatedConfig = { ...config, ignoreCasing: true };

    if (updatedConfig.body && updatedConfig.body.location) {
      const { location: _location, ...bodyWithoutLocation } = updatedConfig.body;
      return {
        ...updatedConfig,
        body: bodyWithoutLocation,
        location: updatedConfig.location || _location,
      };
    }
    return updatedConfig;
  }

  public get resourceId(): string {
    return this.id;
  }
}
