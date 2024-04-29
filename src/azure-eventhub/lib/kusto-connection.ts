import { KustoEventhubDataConnection } from "@cdktf/provider-azurerm/lib/kusto-eventhub-data-connection";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Construct } from "constructs";

export interface BaseKustoDataConnectionProps {
  /**
   * The name of the Kusto EventHub Data Connection to create.
   */
  readonly name: string;

  /**
   * The location where the Kusto EventHub Data Connection should be created.
   */
  readonly location: string;

  /**
   * Specifies the Resource Group where the Kusto Database should exist.
   */
  readonly kustoResourceGroup: ResourceGroup;

  /**
   * Specifies the name of the Kusto Cluster this data connection will be added to.
   */
  readonly kustoClusterName: string;

  /**
   * Specifies the name of the Kusto Database this data connection will be added to.
   */
  readonly kustoDatabaseName: string;

  /**
   * Specifies the EventHub consumer group this data connection will use for ingestion.
   * @default "$Default"
   */
  readonly consumerGroup?: string;

  /**
   * Specifies the target table name used for the message ingestion. Table must exist before resource is created.
   */
  readonly tableName?: string | undefined;

  /**
   * The resource ID of a managed identity (system or user assigned) to be used to authenticate with event hub.
   */
  readonly identityId?: string | undefined;

  /**
   * Specifies the mapping rule used for the message ingestion. Mapping rule must exist before resource is created.
   */
  readonly mappingRuleName?: string | undefined;

  /**
   * Specifies the data format of the EventHub messages.
   * Allowed values: APACHEAVRO, AVRO, CSV, JSON, MULTIJSON, ORC, PARQUET, PSV, RAW, SCSV, SINGLEJSON, SOHSV, TSVE, TSV, TXT, and W3CLOGFILE.
   * @default "JSON"
   */
  readonly dataFormat?: string;

  /**
   * Indication for database routing information from the data connection, by default only database routing information is allowed.
   * Allowed values: Single, Multi.
   * @default "Single"
   */
  readonly databaseRoutingType?: string;

  /**
   * Specifies compression type for the connection. Allowed values: GZip and None.
   * @default "None"
   */
  readonly compression?: string;
}

export interface KustoDataConnectionProps extends BaseKustoDataConnectionProps {
  /**
   * Specifies the resource id of the EventHub this data connection will use for ingestion.
   */
  readonly eventhubId: string;
}

export class KustoDataConnection extends Construct {
  public readonly eventhubKustoDataConnectionProps: KustoDataConnectionProps;

  /**
   * Constructs a new Azure Kusto Data Connection for ingesting data from an EventHub.
   *
   * This class creates a data connection within a specified Kusto (Azure Data Explorer) database that connects
   * to an Azure EventHub. This setup enables seamless data ingestion from EventHub into the Kusto database,
   * allowing for real-time analytics on streamed data.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the data connection.
   * @param kustoDataConnectionProps - The properties for configuring the Kusto EventHub Data Connection. These properties include:
   *                - `name`: Required. The name of the data connection.
   *                - `location`: Required. The Azure region where the data connection will be created.
   *                - `kustoResourceGroup`: Required. The Resource Group where the Kusto database exists.
   *                - `kustoClusterName`: Required. The name of the Kusto Cluster to which this data connection will be added.
   *                - `kustoDatabaseName`: Required. The name of the Kusto Database to which this data connection will be added.
   *                - `eventhubId`: Required. The resource ID of the EventHub used for data ingestion.
   *                - `consumerGroup`: Optional. The EventHub consumer group used for ingestion. Defaults to "$Default".
   *                - `tableName`: Optional. The target table name in the Kusto database used for data ingestion.
   *                - `identityId`: Optional. The resource ID of a managed identity used for authentication with EventHub.
   *                - `mappingRuleName`: Optional. The mapping rule name used for data ingestion.
   *                - `dataFormat`: Optional. Specifies the data format of EventHub messages. Defaults to "JSON".
   *                - `databaseRoutingType`: Optional. Indicates the routing type for the database. Defaults to "Single".
   *                - `compression`: Optional. Specifies the compression type for the data connection. Defaults to "None".
   *
   * Example usage:
   * ```typescript
   * const kustoDataConnection = new KustoDataConnection(this, 'myDataConnection', {
   *   name: 'exampleDataConnection',
   *   location: 'East US',
   *   kustoResourceGroup: resourceGroup,
   *   kustoClusterName: 'exampleCluster',
   *   kustoDatabaseName: 'exampleDatabase',
   *   eventhubId: '/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.EventHub/namespaces/{namespace}/eventhubs/{eventhub}',
   *   consumerGroup: '$Default',
   *   tableName: 'destinationTable',
   *   dataFormat: 'JSON',
   *   databaseRoutingType: 'Single',
   *   compression: 'None'
   * });
   * ```
   */
  constructor(
    scope: Construct,
    id: string,
    kustoDataConnectionProps: KustoDataConnectionProps,
  ) {
    super(scope, id);

    this.eventhubKustoDataConnectionProps = kustoDataConnectionProps;

    const defaults = {
      tableName: kustoDataConnectionProps.tableName || undefined,
      identityId: kustoDataConnectionProps.identityId || undefined,
      mappingRuleName: kustoDataConnectionProps.mappingRuleName || undefined,
      consumerGroup: kustoDataConnectionProps.consumerGroup || "$Default",
      dataFormat: kustoDataConnectionProps.dataFormat || "JSON",
      databaseRoutingType:
        kustoDataConnectionProps.databaseRoutingType || "Single",
      compression: kustoDataConnectionProps.compression || "None",
    };

    new KustoEventhubDataConnection(
      this,
      `kusto-data-connection-${this.eventhubKustoDataConnectionProps.name}`,
      {
        name: this.eventhubKustoDataConnectionProps.name,
        location: this.eventhubKustoDataConnectionProps.location,
        resourceGroupName:
          this.eventhubKustoDataConnectionProps.kustoResourceGroup.name,
        clusterName: this.eventhubKustoDataConnectionProps.kustoClusterName,
        databaseName: this.eventhubKustoDataConnectionProps.kustoDatabaseName,
        eventhubId: this.eventhubKustoDataConnectionProps.eventhubId,
        ...defaults,
      },
    );
  }
}
