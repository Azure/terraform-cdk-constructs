import { Eventhub } from "@cdktf/provider-azurerm/lib/eventhub";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { AuthorizationRule, AuthorizationRuleProps } from "./authorization";
import { ConsumerGroup } from "./consumer";
import {
  KustoDataConnection,
  BaseKustoDataConnectionProps,
} from "./kusto-connection";

export interface BaseInstanceProps {
  /**
   * Specifies the name of the EventHub resource.
   */
  readonly name: string;
  /**
   * Specifies the current number of shards on the Event Hub.
   * When using a shared parent EventHub Namespace, maximum value is 32.
   * @default 2
   */
  readonly partitionCount?: number;
  /**
   * Specifies the number of days to retain the events for this Event Hub.
   * @default 1
   */
  readonly messageRetention?: number;
  /**
   * Specifies the status of the Event Hub resource. Possible values are Active, Disabled and SendDisabled.
   * @default "Active"
   */
  readonly status?: string;

  /**
   * TODO: capture_description
   * TOOD: destination
   */
}

export interface InstanceProps extends BaseInstanceProps {
  /**
   * The name of the resource group in which the EventHub's parent Namespace exists.
   */
  readonly resourceGroup: ResourceGroup;
  /**
   * Specifies the name of the EventHub Namespace.
   */
  readonly namespaceName: string;
}

export class Instance extends Construct {
  readonly ehInstanceProps: InstanceProps;
  readonly id: string;
  readonly name: string;
  readonly partitionIds: string[];

  /**
   * Constructs a new Event Hub instance.
   *
   * This class creates an Azure Event Hub instance within a specified namespace. Event Hubs is a highly scalable
   * data streaming platform and event ingestion service, capable of receiving and processing millions of events per second.
   * Event Hubs can process and store events, data, or telemetry produced by distributed software and devices.
   *
   * @param scope - The scope in which to define this construct, typically used for managing lifecycles and creation order.
   * @param name - The unique name for this instance of the Event Hub.
   * @param ehInstanceProps - The properties for configuring the Event Hub instance. The properties include:
   *                - `name`: Required. The name of the Event Hub instance.
   *                - `partitionCount`: Optional. The number of partitions for the Event Hub. Defaults to 2. Max value is 32 for shared namespaces.
   *                - `messageRetention`: Optional. The number of days to retain the messages. Defaults to 1.
   *                - `status`: Optional. Specifies the operational status of the Event Hub (Active, Disabled, SendDisabled). Defaults to "Active".
   *                - `resourceGroup`: Required. The name of the resource group in which the Event Hub's parent namespace exists.
   *                - `namespaceName`: Required. The name of the Event Hub Namespace where this instance will be created.
   *
   * Example usage:
   * ```typescript
   * const eventHubInstance = new Instance(this, 'myEventHubInstance', {
   *   name: 'exampleEventHub',
   *   namespaceName: 'exampleNamespace',
   *   resourceGroup: resourceGroup,
   *   partitionCount: 4,
   *   messageRetention: 7,
   *   status: 'Active'
   * });
   * ```
   */
  constructor(scope: Construct, name: string, ehInstanceProps: InstanceProps) {
    super(scope, name);

    this.ehInstanceProps = ehInstanceProps;

    const defaults = {
      partitionCount: ehInstanceProps.partitionCount || 2,
      messageRetention: ehInstanceProps.messageRetention || 1,
      status: ehInstanceProps.status || "Active",
    };

    const eventhubInstance = new Eventhub(
      this,
      `ehinstance-${ehInstanceProps.name}`,
      {
        name: ehInstanceProps.name,
        resourceGroupName: ehInstanceProps.resourceGroup.name,
        namespaceName: ehInstanceProps.namespaceName,
        ...defaults,
      },
    );

    // Outputs
    this.id = eventhubInstance.id;
    this.partitionIds = eventhubInstance.partitionIds;
    this.name = eventhubInstance.name;

    const cdktfTerraformOutputEventhubInstanceId = new cdktf.TerraformOutput(
      this,
      "id",
      {
        value: eventhubInstance.id,
      },
    );
    const cdktfTerraformOutputEventhubInstancePartitionIds =
      new cdktf.TerraformOutput(this, "partition_ids", {
        value: eventhubInstance.partitionIds,
      });

    cdktfTerraformOutputEventhubInstanceId.overrideLogicalId("id");
    cdktfTerraformOutputEventhubInstancePartitionIds.overrideLogicalId(
      "partition_ids",
    );
  }

  /**
   * Adds an Authorization Rule to an Event Hub instance.
   *
   * This method creates a new Authorization Rule associated with the specified Event Hub,
   * granting specified permissions such as 'listen', 'send', and 'manage' based on the properties provided.
   * The rule determines the access level granted to users and applications for the Event Hub.
   *
   * @param props - The properties for the Authorization Rule, which include:
   *                - `name`: Required. A unique identifier for the Authorization Rule within the Event Hub.
   *                - `listen`: Optional. Specifies if the rule allows listening to the Event Hub. Defaults to false.
   *                - `send`: Optional. Specifies if the rule allows sending events to the Event Hub. Defaults to false.
   *                - `manage`: Optional. Specifies if the rule allows managing the Event Hub. When set to true,
   *                            both 'listen' and 'send' are implicitly enabled. Defaults to false.
   *
   * @returns An instance of the AuthorizationRule class, configured with the specified permissions and associated
   *          with the Event Hub specified in the enclosing construct's properties.
   *
   * Example usage:
   * ```typescript
   * const eventHubAuthRule = eventHubInstance.addAuthorizationRule({
   *   name: 'myCustomAuthRule',
   *   listen: true,
   *   send: true,
   *   manage: false // Only listening and sending permissions are granted.
   * });
   * ```
   */
  public addAuthorizationRule(props: AuthorizationRuleProps) {
    return new AuthorizationRule(this, `ehauthrule-${props.name}`, {
      resourceGroupName: this.ehInstanceProps.resourceGroup.name,
      namespaceName: this.ehInstanceProps.namespaceName,
      eventhubName: this.name,
      ...props,
    });
  }

  /**
   * Adds a Consumer Group to an existing Event Hub instance.
   *
   * This method creates a new Consumer Group for the specified Event Hub. Consumer groups represent a view of the entire Event Hub,
   * allowing consumer applications to have separate, independent views of the event stream. They read the stream at their own pace
   * and maintain their own sequence point or offset. This enables a single Event Hub to support multiple consumer applications.
   *
   * @param name - The name of the Consumer Group to be added. This name must be unique within the Event Hub namespace.
   * @param userMetadata - Optional. User-defined metadata for the Consumer Group. This metadata is useful for storing additional
   *                       information about the consumer group, such as its purpose or operational details.
   *
   * @returns An instance of the ConsumerGroup class, configured with the specified properties and associated with the Event Hub
   *          specified in the enclosing construct's properties.
   *
   * Example usage:
   * ```typescript
   * const myConsumerGroup = eventHubInstance.addConsumerGroup('myConsumerGroupName', 'Metadata about this consumer group');
   * ```
   *
   * @remarks
   * Each consumer group can have multiple concurrent readers, but each partition in the Event Hub can only have one active consumer
   * from a specific consumer group at a time. Multiple consumer groups enable multiple consuming applications to each have a separate
   * view of the event stream, and to read the stream independently at their own pace and with their own offsets.
   */
  public addConsumerGroup(name: string, userMetadata?: string) {
    return new ConsumerGroup(this, `ehconsumergroup-${name}`, {
      resourceGroup: this.ehInstanceProps.resourceGroup,
      namespaceName: this.ehInstanceProps.namespaceName,
      eventhubName: this.name,
      name: name,
      userMetadata: userMetadata,
    });
  }

  /**
   * Adds a Kusto Data Connection to an existing Kusto Cluster and Database for ingesting data from an EventHub.
   *
   * This method configures a new Kusto Data Connection linked to the specified EventHub. It facilitates the ingestion of streaming data
   * into the Kusto database, allowing for real-time analytics on streamed data. This connection specifies how data from EventHub
   * is to be ingested into tables within the Kusto Database.
   *
   * @param props - The properties for the Kusto Data Connection, derived from BaseKustoDataConnectionProps, which include:
   *                - `name`: Required. The name of the data connection to create.
   *                - `location`: Required. The Azure region where the data connection will be created.
   *                - `kustoResourceGroup`: Required. The Resource Group where the Kusto database exists.
   *                - `kustoClusterName`: Required. The name of the Kusto Cluster to which this data connection will be added.
   *                - `kustoDatabaseName`: Required. The name of the Kusto Database to which this data connection will be added.
   *                - `consumerGroup`: Optional. The EventHub consumer group used for ingestion. Defaults to "$Default".
   *                - `tableName`: Optional. The target table name in the Kusto database used for data ingestion.
   *                - `identityId`: Optional. The resource ID of a managed identity used for authentication with EventHub.
   *                - `mappingRuleName`: Optional. The mapping rule name used for data ingestion.
   *                - `dataFormat`: Optional. Specifies the data format of EventHub messages. Defaults to "JSON".
   *                - `databaseRoutingType`: Optional. Indicates the routing type for the database. Defaults to "Single".
   *                - `compression`: Optional. Specifies the compression type for the data connection. Defaults to "None".
   *
   * @returns An instance of the KustoDataConnection class, configured with the specified properties and linked to the EventHub
   *          specified in the enclosing construct's properties.
   *
   * Example usage:
   * ```typescript
   * const kustoConnection = kustoInstance.addKustoDataConnection({
   *   name: 'myKustoDataConnection',
   *   location: 'West US',
   *   kustoResourceGroup: resourceGroup,
   *   kustoClusterName: 'myCluster',
   *   kustoDatabaseName: 'myDatabase',
   *   tableName: 'IngestionTable',
   *   consumerGroup: '$Default',
   *   dataFormat: 'JSON'
   * });
   * ```
   */
  public addKustoDataConnection(props: BaseKustoDataConnectionProps) {
    return new KustoDataConnection(
      this,
      `ehkustodataconnection-${this.ehInstanceProps.name}-${props.name}`,
      {
        eventhubId: this.id,
        ...props,
      },
    );
  }
}
