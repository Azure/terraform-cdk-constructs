import * as cdktn from "cdktn";
import { Construct } from "constructs";
import {
  ALL_DATA_EXPLORER_CLUSTER_VERSIONS,
  DATA_EXPLORER_CLUSTER_TYPE,
} from "./data-explorer-cluster-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

export interface DataExplorerClusterSku {
  readonly name: string;
  readonly capacity?: number;
  readonly tier: string;
}

export interface DataExplorerClusterIdentity {
  readonly type: string;
  readonly userAssignedIdentities?: {
    [key: string]: { [key: string]: string };
  };
}

export interface DataExplorerClusterTrustedExternalTenant {
  readonly value: string;
}

export interface DataExplorerClusterOptimizedAutoscale {
  readonly version: number;
  readonly isEnabled: boolean;
  readonly minimum: number;
  readonly maximum: number;
}

export interface DataExplorerClusterProps extends AzapiResourceProps {
  readonly sku: DataExplorerClusterSku;
  readonly identity?: DataExplorerClusterIdentity;
  readonly trustedExternalTenants?: DataExplorerClusterTrustedExternalTenant[];
  readonly optimizedAutoscale?: DataExplorerClusterOptimizedAutoscale;
  readonly enableDiskEncryption?: boolean;
  readonly enableStreamingIngest?: boolean;
  readonly enablePurge?: boolean;
  readonly resourceGroupId?: string;
}

export class DataExplorerCluster extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      DATA_EXPLORER_CLUSTER_TYPE,
      ALL_DATA_EXPLORER_CLUSTER_VERSIONS,
    );
  }

  public readonly props: DataExplorerClusterProps;
  public readonly idOutput: cdktn.TerraformOutput;
  public readonly locationOutput: cdktn.TerraformOutput;
  public readonly nameOutput: cdktn.TerraformOutput;
  public readonly tagsOutput: cdktn.TerraformOutput;
  public readonly uriOutput: cdktn.TerraformOutput;

  constructor(scope: Construct, id: string, props: DataExplorerClusterProps) {
    super(scope, id, props);
    this.props = props;

    this.idOutput = new cdktn.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Data Explorer Cluster",
    });
    this.locationOutput = new cdktn.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Data Explorer Cluster",
    });
    this.nameOutput = new cdktn.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Data Explorer Cluster",
    });
    this.tagsOutput = new cdktn.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Data Explorer Cluster",
    });
    this.uriOutput = new cdktn.TerraformOutput(this, "uri", {
      value: `\${${this.terraformResource.fqn}.output.properties.uri}`,
      description: "The URI of the Data Explorer Cluster",
    });

    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
    this.uriOutput.overrideLogicalId("uri");
  }

  protected defaultVersion(): string {
    return "2024-04-13";
  }

  protected resourceType(): string {
    return DATA_EXPLORER_CLUSTER_TYPE;
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
      lifecycle: {
        ignoreChanges: ["tags"],
      },
    };
  }

  protected createResourceBody(props: any): any {
    const typedProps = props as DataExplorerClusterProps;
    return {
      sku: typedProps.sku,
      identity: typedProps.identity,
      properties: {
        trustedExternalTenants: typedProps.trustedExternalTenants,
        optimizedAutoscale: typedProps.optimizedAutoscale,
        enableDiskEncryption: typedProps.enableDiskEncryption,
        enableStreamingIngest: typedProps.enableStreamingIngest,
        enablePurge: typedProps.enablePurge,
      },
    };
  }

  public get uri(): string {
    return `\${${this.terraformResource.fqn}.output.properties.uri}`;
  }

  public get dataIngestionUri(): string {
    return `\${${this.terraformResource.fqn}.output.properties.dataIngestionUri}`;
  }

  public get resourceId(): string {
    return this.id;
  }
}
