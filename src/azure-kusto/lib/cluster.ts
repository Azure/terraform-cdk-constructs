import { KustoCluster } from "@cdktf/provider-azurerm/lib/kusto-cluster";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import {
  ComputeSpecification,
  IComputeSpecification,
} from "./compute-specification";
import { Database, DatabaseProps } from "./database";
import { AzureResource } from "../../core-azure/lib/index";

export interface ClusterProps {
  /**
   * The Azure Resource Group in which to create the Kusto Cluster.
   */
  readonly resourceGroup: ResourceGroup;
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
  public id: string;
  public resourceGroup: ResourceGroup;
  public readonly uri: string;

  /**
   * Represents a Kusto (Azure Data Explorer) cluster in Azure.
   *
   * This class is responsible for the creation and management of a Kusto Cluster, which is a highly scalable and secure
   * analytics service for ingesting, storing, and analyzing large volumes of data. The cluster supports various configurations
   * tailored to the needs of specific data workloads and security requirements.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the cluster.
   * @param kustoProps - The properties required to configure the Kusto cluster, as defined in the ClusterProps interface.
   *
   * Example usage:
   * ```typescript
   * new Cluster(this, 'MyKustoCluster', {
   *   name: 'example-cluster',
   *   location: 'West US',
   *   resourceGroup: myResourceGroup,
   *   sku: { tier: 'Standard', name: 'D13_v2', capacity: 2 },
   *   tags: {
   *     project: 'Data Analytics'
   *   }
   * });
   * ```
   */
  constructor(scope: Construct, id: string, kustoProps: ClusterProps) {
    super(scope, id);
    this.kustoProps = kustoProps;
    this.resourceGroup = kustoProps.resourceGroup;

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
      location: kustoProps.resourceGroup.location,
      resourceGroupName: kustoProps.resourceGroup.name,
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

  /**
   * Adds a new database to the Azure Kusto Cluster.
   *
   * This method creates a database within the Azure Data Explorer (Kusto) cluster, defined by the properties provided.
   * A database in Kusto serves as a logical group to manage various tables and store data. It is essential for performing
   * data analytics and running queries. The database configuration can include settings like hot cache and soft delete periods,
   * which optimize query performance and manage data lifecycle according to specific requirements.
   *
   * @param databaseProps - The properties required to create the database. These properties should include:
   *                        - `kusto`: Reference to the Kusto cluster to which the database will be added.
   *                        - `name`: The name of the database, which must be unique within the cluster.
   *                        - `hotCachePeriod`: Optional. Specifies the duration that data should be kept in cache for faster query access.
   *                        - `softDeletePeriod`: Optional. Specifies the duration that data should be retained before it stops being accessible to queries.
   *                          Both the hot cache and soft delete periods should be specified in ISO 8601 duration format.
   *
   * @returns A `Database` object representing the newly created database within the Kusto cluster.
   *
   * Example usage:
   * ```typescript
   * const myDatabase = myCluster.addDatabase({
   *   kusto: myKustoCluster,
   *   name: 'OperationalData',
   *   hotCachePeriod: 'P14D', // 14 days
   *   softDeletePeriod: 'P365D' // 1 year
   * });
   * ```
   * This method facilitates the efficient setup and scaling of databases within an Azure Kusto cluster, allowing
   * for complex data analytics operations across large datasets.
   */
  public addDatabase(databaseProps: DatabaseProps) {
    return new Database(this, databaseProps.name, databaseProps);
  }
}
