import { EventhubConsumerGroup } from "@cdktf/provider-azurerm/lib/eventhub-consumer-group";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { TerraformOutput } from "cdktf";
import { Construct } from "constructs";

export interface ConsumerGroupProps {
  readonly name: string;
  /**
   * The name of the resource group in which the EventHub Consumer Group's grandparent Namespace exists.
   */
  readonly resourceGroup: ResourceGroup;
  /**
   * Specifies the name of the grandparent EventHub Namespace.
   */
  readonly namespaceName: string;
  /**
   * Specifies the name of the EventHub.
   */
  readonly eventhubName: string;
  /**
   * Specifies the user metadata.
   */
  readonly userMetadata?: string;
}

export class ConsumerGroup extends Construct {
  readonly ehConsumerGroupProps: ConsumerGroupProps;
  readonly id: string;

  /**
   * Constructs a new Event Hub Consumer Group.
   *
   * An Event Hub Consumer Group is a view of an entire Event Hub that enables consumer applications to each have
   * a separate view of the event stream. They read the stream independently at their own pace and with their own
   * offsets. This class creates a consumer group for a specified Event Hub, allowing for decentralized and
   * scalable event processing.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param name - The unique name for this instance of the Consumer Group.
   * @param ehConsumerGroupProps - The properties for configuring the Consumer Group. These properties include:
   *                - `name`: Required. The name of the Consumer Group.
   *                - `resourceGroup`: Required. The Azure Resource Group in which the Consumer Group's grandparent Namespace exists.
   *                - `namespaceName`: Required. The name of the grandparent EventHub Namespace.
   *                - `eventhubName`: Required. The name of the Event Hub for which the consumer group is created.
   *                - `userMetadata`: Optional. User-defined metadata to provide additional context about the Consumer Group.
   *
   * Example usage:
   * ```typescript
   * const consumerGroup = new ConsumerGroup(this, 'myConsumerGroup', {
   *   resourceGroup: resourceGroup,
   *   namespaceName: 'exampleNamespace',
   *   eventhubName: 'exampleEventHub',
   *   name: 'myConsumerGroupName',
   *   userMetadata: 'Information about consumer group'
   * });
   * ```
   */
  constructor(
    scope: Construct,
    name: string,
    ehConsumerGroupProps: ConsumerGroupProps,
  ) {
    super(scope, name);

    this.ehConsumerGroupProps = ehConsumerGroupProps;

    const eventhubConsumerGroup = new EventhubConsumerGroup(
      this,
      ehConsumerGroupProps.name,
      {
        name: ehConsumerGroupProps.name,
        resourceGroupName: ehConsumerGroupProps.resourceGroup.name,
        namespaceName: ehConsumerGroupProps.namespaceName,
        eventhubName: ehConsumerGroupProps.eventhubName,
        userMetadata: ehConsumerGroupProps.userMetadata,
      },
    );

    this.id = eventhubConsumerGroup.id;

    // Outputs
    const cdktfTerraformOutputEventhubConsumerGroupId = new TerraformOutput(
      this,
      "id",
      {
        value: eventhubConsumerGroup.id,
      },
    );
    cdktfTerraformOutputEventhubConsumerGroupId.overrideLogicalId("id");
  }
}
