import { KustoCluster } from "@cdktf/provider-azurerm/lib/kusto-cluster";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ComputeSpecification,
  IComputeSpecification,
} from "./compute-specification";
import { Database, DatabaseProps } from "./database";
import { Group } from "../../azure-resourcegroup";
import { AzureResource } from "../../core-azure/lib/index";

export interface ClusterProps {
  /**
   * The Azure Resource Group in which to create the Kusto Cluster.
   */
  readonly rg: Group;
  /**
   * The name of the Kusto Cluster to create.
   * Only 4-22 lowercase alphanumeric characters allowed, starting with a letter.
   */
  readonly name: string;
  /**
   * The SKU of the Kusto Cluster. All the allowed values are defined in the ComputeSpecification class.
   * @default devtestExtraSmallDv2
   */
  readonly sku?: IComputeSpecification;
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
   * Specifies if the purge operations are enabled. Based on the SKU, the number of zones allowed are different.
   * @default true
   */
  readonly enableZones?: boolean;
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
  readonly tags?: { [key: string]: string };
}

export class Cluster extends AzureResource {
  readonly kustoProps: ClusterProps;
  public readonly id: string;
  public readonly resourceGroupName: string;
  public readonly uri: string;

  constructor(scope: Construct, id: string, kustoProps: ClusterProps) {
    super(scope, id);
    this.kustoProps = kustoProps;
    this.resourceGroupName = kustoProps.rg.Name;

    /**
     * Define default values.
     */
    const sku = kustoProps.sku || ComputeSpecification.devtestExtraSmallDv2;
    const enableZones = kustoProps.enableZones || true;

    const defaults = {
      publicNetworkAccessEnabled: kustoProps.publicNetworkAccessEnabled || true,
      autoStopEnabled: kustoProps.autoStopEnabled || true,
      streamingIngestionEnabled: kustoProps.streamingIngestionEnabled || true,
      purgeEnabled: kustoProps.purgeEnabled || false,
      zones: enableZones ? sku.availibleZones : [],
      sku: {
        name: sku.skuName,
        capacity: kustoProps.capacity || 2,
      },
      identity: {
        type: "SystemAssigned",
        identityIds: [],
      },
    };

    /**
     * Create Kusto Cluster resource.
     */
    const azurermKustoCluster = new KustoCluster(this, "Kusto", {
      ...defaults,
      name: kustoProps.name,
      location: kustoProps.rg.Location,
      resourceGroupName: kustoProps.rg.Name,
      tags: kustoProps.tags,
    });

    if (kustoProps.identityType) {
      azurermKustoCluster.addOverride("identity", {
        type: kustoProps.identityType,
        identityIds: kustoProps.identityIds,
      });
    }

    if (kustoProps.minimumInstances && kustoProps.maximumInstances) {
      azurermKustoCluster.addOverride(
        "minimum_instances",
        kustoProps.minimumInstances,
      );
      azurermKustoCluster.addOverride(
        "maximum_instances",
        kustoProps.maximumInstances,
      );
    }

    this.id = azurermKustoCluster.id;
    this.uri = azurermKustoCluster.uri;

    // Outputs
    const cdktfTerraformOutputKustoId = new cdktf.TerraformOutput(
      this,
      "Kusto_id",
      {
        value: azurermKustoCluster.id,
      },
    );
    const cdktfTerraformOutputKustoUri = new cdktf.TerraformOutput(
      this,
      "Kusto_uri",
      {
        value: azurermKustoCluster.uri,
      },
    );
    const cdktfTerraformOutputDataIngestionUri = new cdktf.TerraformOutput(
      this,
      "Kusto_data_ingestion_uri",
      {
        value: azurermKustoCluster.dataIngestionUri,
      },
    );
    const cdktfTerraformOutputKustoIdentity = new cdktf.TerraformOutput(
      this,
      "Kusto_identity",
      {
        value: azurermKustoCluster.identity,
        sensitive: true,
      },
    );

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    cdktfTerraformOutputKustoId.overrideLogicalId("Kusto_id");
    cdktfTerraformOutputKustoUri.overrideLogicalId("Kusto_uri");
    cdktfTerraformOutputDataIngestionUri.overrideLogicalId(
      "Kusto_data_ingestion_uri",
    );
    cdktfTerraformOutputKustoIdentity.overrideLogicalId("Kusto_identity");
  }

  public addDatabase(databaseProps: DatabaseProps) {
    return new Database(this, databaseProps.name, databaseProps);
  }
}
