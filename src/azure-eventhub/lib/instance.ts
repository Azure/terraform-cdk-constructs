import { Eventhub } from "@cdktf/provider-azurerm/lib/eventhub";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { AuthorizationRule, AuthorizationRuleProps } from "./authorization";
import { ConsumerGroupProps, ConsumerGroup } from "./consumer";
import {
  KustoDataConnection,
  KustoDataConnectionProps,
} from "./kusto-connection";

export interface InstanceProps {
  /**
   * Specifies the name of the EventHub resource.
   */
  readonly name: string;
  /**
   * The name of the resource group in which the EventHub's parent Namespace exists.
   */
  readonly resourceGroupName: string;
  /**
   * Specifies the name of the EventHub Namespace.
   */
  readonly namespaceName: string;
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

export class Instance extends Construct {
  readonly ehInstanceProps: InstanceProps;
  readonly id: string;
  readonly partitionIds: string[];

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
        resourceGroupName: ehInstanceProps.resourceGroupName,
        namespaceName: ehInstanceProps.namespaceName,
        ...defaults,
      },
    );

    // Outputs
    this.id = eventhubInstance.id;
    this.partitionIds = eventhubInstance.partitionIds;

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

  public addAuthorizationRule(
    props: Omit<
      AuthorizationRuleProps,
      "resourceGroupName" | "namespaceName" | "eventhubName"
    >,
  ) {
    return new AuthorizationRule(this, `ehauthrule-${props.name}`, {
      resourceGroupName: this.ehInstanceProps.resourceGroupName,
      namespaceName: this.ehInstanceProps.namespaceName,
      eventhubName: this.ehInstanceProps.name,
      ...props,
    });
  }

  public addConsumerGroup(
    props: Omit<
      ConsumerGroupProps,
      "resourceGroupName" | "namespaceName" | "eventhubName"
    >,
  ) {
    return new ConsumerGroup(this, `ehconsumergroup-${props.name}`, {
      resourceGroupName: this.ehInstanceProps.resourceGroupName,
      namespaceName: this.ehInstanceProps.namespaceName,
      eventhubName: this.ehInstanceProps.name,
      ...props,
    });
  }

  public addKustoDataConnection(
    props: Omit<KustoDataConnectionProps, "eventhubId">,
  ) {
    return new KustoDataConnection(
      this,
      `ehkustodataconnection-${this.ehInstanceProps.name}-${props.name}`,
      {
        eventhubId: this.id,
        ...props,
      },
    );
  }

  // TODO: addAccess method, No addDiagnostics method
  // TODO: addDNSrecord method
}
