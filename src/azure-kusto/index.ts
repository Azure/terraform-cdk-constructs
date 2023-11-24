import * as cdktf from 'cdktf';
import { KustoCluster } from '@cdktf/provider-azurerm/lib/kusto-cluster';
import { Construct } from 'constructs';
import { AzureResourceGroup } from '../azure-resourcegroup/index';
import { AzureKustoDatabase, KustoDatabaseProps } from './database';
import { AzureResource } from '../core-azure/index';


export interface KustoProps {
  /**
   * The name of the Kusto Cluster to create.
   * Only 4-22 lowercase alphanumeric characters allowed, starting with a letter.
   */
  readonly name: string;
  /**
   * The name of the SKU.
   */
  readonly skuName: string;
  /**
   * The node count for the cluster.
   * @default 2
   */
  readonly capacity?: number;
  /**
   * The type of Managed Service Identity.
   * @default "SystemAssigned"
   */
  readonly identityType?: string;
  /**
   * A list of User Assigned Managed Identity IDs to be assigned to this Kusto Cluster.
   */
  readonly identityIds?: string[];
  /**
   * Is the public network access enabled?
   * @default true
   */
  readonly publicNetworkAccessEnabled?: boolean;
  /**
   * Specifies if the cluster could be automatically stopped.
   * (due to lack of data or no activity for many days).
   * @default true
   */
  readonly autoStopEnabled?: boolean;
  /**
   * Specifies if the streaming ingest is enabled.
   * @default true
   */
  readonly streamingIngestionEnabled?: boolean;
  /**
   * Specifies if the purge operations are enabled.
   * @default false
   */
  readonly purgeEnabled?: boolean;
  /**
   * Specifies the list of availability zones where the cluster should be provisioned.
   * @default ["1", "2", "3"]
   */
  readonly zones?: string[];
  /**
   * The minimum number of allowed instances. Must between 0 and 1000.
   */
  readonly minimumInstances?: number;
  /**
   * The maximum number of allowed instances. Must between 0 and 1000.
   */
  readonly maximumInstances?: number;
  /**
   * A mapping of tags to assign to the Kusto.
   */
  readonly tags?: { [key: string]: string; };
}


export class AzureKusto extends AzureResource {
  readonly kustoProps: KustoProps;
  public readonly rgName: string;
  public readonly location: string;
  public readonly id: string;
  public readonly uri: string;

  constructor(scope: Construct, id: string, rg: AzureResourceGroup, kustoProps: KustoProps) {
    super(scope, id);
    this.kustoProps = kustoProps;
    this.rgName = rg.Name;
    this.location = rg.Location;

    /**
     * Define default values.
     */
    const defaults = {
      publicNetworkAccessEnabled: kustoProps.publicNetworkAccessEnabled || true,
      autoStopEnabled: kustoProps.autoStopEnabled || true,
      streamingIngestionEnabled: kustoProps.streamingIngestionEnabled || true,
      purgeEnabled: kustoProps.purgeEnabled || false,
      zones: kustoProps.zones || ["1", "2", "3"],
      sku: {
        name: kustoProps.skuName,
        capacity: kustoProps.capacity || 2,
      },
      identity: {
        type: "SystemAssigned",
        identityIds: [],
      },
    }

    /**
     * Create Kusto Cluster resource.
     */
    const azurermKustoCluster = new KustoCluster(this, 'Kusto', {
      ...defaults,
      name: kustoProps.name,
      location: rg.Location,
      resourceGroupName: rg.Name,
      tags: kustoProps.tags,
    });

    if (kustoProps.identityType) {
      azurermKustoCluster.addOverride("identity", {
        type: kustoProps.identityType,
        identityIds: kustoProps.identityIds,
      });
    }

    if (kustoProps.minimumInstances && kustoProps.maximumInstances) {
      azurermKustoCluster.addOverride("minimum_instances", kustoProps.minimumInstances);
      azurermKustoCluster.addOverride("maximum_instances", kustoProps.maximumInstances);
    }

    this.id = azurermKustoCluster.id;
    this.uri = azurermKustoCluster.uri;

    // Outputs
    const cdktfTerraformOutputKustoId = new cdktf.TerraformOutput(this, "Kusto_id", {
      value: azurermKustoCluster.id,
    });
    const cdktfTerraformOutputKustoUri = new cdktf.TerraformOutput(this, "Kusto_uri", {
      value: azurermKustoCluster.uri,
    });
    const cdktfTerraformOutputDataIngestionUri = new cdktf.TerraformOutput(this, "Kusto_data_ingestion_uri", {
      value: azurermKustoCluster.dataIngestionUri,
    });
    const cdktfTerraformOutputKustoIdentity = new cdktf.TerraformOutput(this, "Kusto_identity", {
      value: azurermKustoCluster.identity,
      sensitive: true,
    });

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    cdktfTerraformOutputKustoId.overrideLogicalId("Kusto_id");
    cdktfTerraformOutputKustoUri.overrideLogicalId("Kusto_uri")
    cdktfTerraformOutputDataIngestionUri.overrideLogicalId("Kusto_data_ingestion_uri")
    cdktfTerraformOutputKustoIdentity.overrideLogicalId("Kusto_identity");
  }

  public addDatabase(databaseProps: KustoDatabaseProps) {
    return new AzureKustoDatabase(this, databaseProps.name, this, databaseProps);
  }
}