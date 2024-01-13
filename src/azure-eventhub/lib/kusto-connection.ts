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
