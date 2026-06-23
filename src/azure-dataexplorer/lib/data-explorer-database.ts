import * as cdktn from "cdktn";
import { Construct } from "constructs";
import {
  ALL_DATA_EXPLORER_DATABASE_VERSIONS,
  DATA_EXPLORER_DATABASE_TYPE,
} from "./data-explorer-database-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

export interface DataExplorerDatabaseProps extends AzapiResourceProps {
  readonly clusterId: string;
  readonly kind?: string;
  readonly softDeletePeriod?: string;
  readonly hotCachePeriod?: string;
}

export class DataExplorerDatabase extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      DATA_EXPLORER_DATABASE_TYPE,
      ALL_DATA_EXPLORER_DATABASE_VERSIONS,
    );
  }

  public readonly props: DataExplorerDatabaseProps;
  public readonly idOutput: cdktn.TerraformOutput;
  public readonly nameOutput: cdktn.TerraformOutput;

  constructor(scope: Construct, id: string, props: DataExplorerDatabaseProps) {
    super(scope, id, props);
    this.props = props;

    this.idOutput = new cdktn.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Data Explorer Database",
    });
    this.nameOutput = new cdktn.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Data Explorer Database",
    });

    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
  }

  protected defaultVersion(): string {
    return "2024-04-13";
  }

  protected resourceType(): string {
    return DATA_EXPLORER_DATABASE_TYPE;
  }

  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  protected requiresLocation(): boolean {
    return true;
  }

  protected customizeResourceConfig(config: any): any {
    const baseConfig = super.customizeResourceConfig(config);
    return {
      ...baseConfig,
      ignoreCasing: true,
      location: this.location,
    };
  }

  protected createResourceBody(props: any): any {
    const typedProps = props as DataExplorerDatabaseProps;
    return {
      kind: typedProps.kind || "ReadWrite",
      properties: {
        softDeletePeriod: typedProps.softDeletePeriod,
        hotCachePeriod: typedProps.hotCachePeriod,
      },
    };
  }

  protected resolveParentId(props: any): string {
    const typedProps = props as DataExplorerDatabaseProps;
    return typedProps.clusterId;
  }

  public get resourceId(): string {
    return this.id;
  }
}
