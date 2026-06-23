import * as cdktn from "cdktn";
import { Construct } from "constructs";
import {
  ALL_DATA_EXPLORER_SCRIPT_VERSIONS,
  DATA_EXPLORER_SCRIPT_TYPE,
} from "./data-explorer-table-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

export interface DataExplorerScriptProps extends AzapiResourceProps {
  readonly databaseId: string;
  readonly scriptContent?: string;
  readonly scriptUrl?: string;
  readonly scriptUrlSasToken?: string;
  readonly forceUpdateTag?: string;
  readonly continueOnErrors?: boolean;
}

export class DataExplorerScript extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      DATA_EXPLORER_SCRIPT_TYPE,
      ALL_DATA_EXPLORER_SCRIPT_VERSIONS,
    );
  }

  public readonly props: DataExplorerScriptProps;
  public readonly idOutput: cdktn.TerraformOutput;
  public readonly nameOutput: cdktn.TerraformOutput;

  constructor(scope: Construct, id: string, props: DataExplorerScriptProps) {
    super(scope, id, props);
    this.props = props;

    this.idOutput = new cdktn.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Data Explorer Script",
    });
    this.nameOutput = new cdktn.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Data Explorer Script",
    });

    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
  }

  protected defaultVersion(): string {
    return "2024-04-13";
  }

  protected resourceType(): string {
    return DATA_EXPLORER_SCRIPT_TYPE;
  }

  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  protected requiresLocation(): boolean {
    return false;
  }

  protected resolveParentId(props: any): string {
    const typedProps = props as DataExplorerScriptProps;
    return typedProps.databaseId;
  }

  protected createResourceBody(props: any): any {
    const typedProps = props as DataExplorerScriptProps;
    return {
      properties: {
        scriptContent: typedProps.scriptContent,
        scriptUrl: typedProps.scriptUrl,
        scriptUrlSasToken: typedProps.scriptUrlSasToken,
        forceUpdateTag: typedProps.forceUpdateTag,
        continueOnErrors: typedProps.continueOnErrors ?? false,
      },
    };
  }

  public get resourceId(): string {
    return this.id;
  }
}
