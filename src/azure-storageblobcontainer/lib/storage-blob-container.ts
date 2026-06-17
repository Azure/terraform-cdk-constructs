import * as cdktn from "cdktn";
import { Construct } from "constructs";
import {
  ALL_STORAGE_BLOB_CONTAINER_VERSIONS,
  STORAGE_BLOB_CONTAINER_TYPE,
} from "./storage-blob-container-schemas";
import {
  AzapiResource,
  AzapiResourceProps,
} from "../../core-azure/lib/azapi/azapi-resource";
import { ApiSchema } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";

export interface StorageBlobContainerImmutableStorageWithVersioning {
  readonly enabled: boolean;
}

export interface StorageBlobContainerProps extends AzapiResourceProps {
  /** The storage account ID (parent resource) */
  readonly storageAccountId: string;
  /** Public access level. Default: "None" */
  readonly publicAccess?: string;
  /** Container metadata */
  readonly metadata?: { [key: string]: string };
  /** Default encryption scope */
  readonly defaultEncryptionScope?: string;
  /** Deny encryption scope override */
  readonly denyEncryptionScopeOverride?: boolean;
  /** Immutable storage with versioning */
  readonly immutableStorageWithVersioning?: StorageBlobContainerImmutableStorageWithVersioning;
}

export class StorageBlobContainer extends AzapiResource {
  static {
    AzapiResource.registerSchemas(
      STORAGE_BLOB_CONTAINER_TYPE,
      ALL_STORAGE_BLOB_CONTAINER_VERSIONS,
    );
  }

  public readonly props: StorageBlobContainerProps;
  public readonly idOutput: cdktn.TerraformOutput;
  public readonly nameOutput: cdktn.TerraformOutput;

  constructor(scope: Construct, id: string, props: StorageBlobContainerProps) {
    super(scope, id, props);
    this.props = props;

    this.idOutput = new cdktn.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Storage Blob Container",
    });
    this.nameOutput = new cdktn.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Storage Blob Container",
    });

    this.idOutput.overrideLogicalId("id");
    this.nameOutput.overrideLogicalId("name");
  }

  protected defaultVersion(): string {
    return "2024-01-01";
  }

  protected resourceType(): string {
    return STORAGE_BLOB_CONTAINER_TYPE;
  }

  protected apiSchema(): ApiSchema {
    return this.resolveSchema();
  }

  protected requiresLocation(): boolean {
    return false;
  }

  protected createResourceBody(props: any): any {
    const typedProps = props as StorageBlobContainerProps;
    return {
      properties: {
        publicAccess: typedProps.publicAccess || "None",
        metadata: typedProps.metadata,
        defaultEncryptionScope: typedProps.defaultEncryptionScope,
        denyEncryptionScopeOverride: typedProps.denyEncryptionScopeOverride,
        immutableStorageWithVersioning:
          typedProps.immutableStorageWithVersioning,
      },
    };
  }

  /** Override parentId to use storage account's blob service as parent */
  protected resolveParentId(props: any): string {
    const typedProps = props as StorageBlobContainerProps;
    return `${typedProps.storageAccountId}/blobServices/default`;
  }

  public get resourceId(): string {
    return this.id;
  }
}
