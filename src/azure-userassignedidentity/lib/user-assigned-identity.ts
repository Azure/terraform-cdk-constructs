import * as cdktn from "cdktn";
import { Construct } from "constructs";
import {
  ALL_USER_ASSIGNED_IDENTITY_VERSIONS,
  USER_ASSIGNED_IDENTITY_TYPE,
} from "./user-assigned-identity-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

export interface UserAssignedIdentityProps extends AzapiResourceProps {
  /** Resource group ID where the identity will be created */
  readonly resourceGroupId?: string;
}

export interface UserAssignedIdentityBody {
  readonly location: string;
  readonly tags?: { [key: string]: string };
}

export class UserAssignedIdentity extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      USER_ASSIGNED_IDENTITY_TYPE,
      ALL_USER_ASSIGNED_IDENTITY_VERSIONS,
    );
  }

  public readonly props: UserAssignedIdentityProps;
  public readonly idOutput: cdktn.TerraformOutput;
  public readonly locationOutput: cdktn.TerraformOutput;
  public readonly nameOutput: cdktn.TerraformOutput;
  public readonly tagsOutput: cdktn.TerraformOutput;
  public readonly clientIdOutput: cdktn.TerraformOutput;
  public readonly principalIdOutput: cdktn.TerraformOutput;

  constructor(scope: Construct, id: string, props: UserAssignedIdentityProps) {
    super(scope, id, props);
    this.props = props;

    this.idOutput = new cdktn.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the User Assigned Identity",
    });
    this.locationOutput = new cdktn.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the User Assigned Identity",
    });
    this.nameOutput = new cdktn.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the User Assigned Identity",
    });
    this.tagsOutput = new cdktn.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the User Assigned Identity",
    });
    this.clientIdOutput = new cdktn.TerraformOutput(this, "client_id", {
      value: `\${${this.terraformResource.fqn}.output.properties.clientId}`,
      description: "The client ID of the User Assigned Identity",
    });
    this.principalIdOutput = new cdktn.TerraformOutput(this, "principal_id", {
      value: `\${${this.terraformResource.fqn}.output.properties.principalId}`,
      description: "The principal ID of the User Assigned Identity",
    });

    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.clientIdOutput.overrideLogicalId("client_id");
    this.principalIdOutput.overrideLogicalId("principal_id");
  }

  protected defaultVersion(): string {
    return "2023-01-31";
  }

  protected resourceType(): string {
    return USER_ASSIGNED_IDENTITY_TYPE;
  }

  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  protected requiresLocation(): boolean {
    return true;
  }

  protected createResourceBody(_props: any): any {
    return {
      location: this.location,
      tags: this.allTags(),
    };
  }

  /** Get the client ID of the managed identity */
  public get clientId(): string {
    return `\${${this.terraformResource.fqn}.output.properties.clientId}`;
  }

  /** Get the principal ID of the managed identity */
  public get principalId(): string {
    return `\${${this.terraformResource.fqn}.output.properties.principalId}`;
  }

  /** Get the tenant ID of the managed identity */
  public get tenantId(): string {
    return `\${${this.terraformResource.fqn}.output.properties.tenantId}`;
  }

  /** Get the full resource identifier */
  public get resourceId(): string {
    return this.id;
  }
}
