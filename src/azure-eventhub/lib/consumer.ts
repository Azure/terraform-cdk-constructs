import { EventhubConsumerGroup } from "@cdktf/provider-azurerm/lib/eventhub-consumer-group";
import { TerraformOutput } from "cdktf";
import { Construct } from "constructs";



export interface ConsumerGroupProps {
  readonly name: string;
  /**
   * The name of the resource group in which the EventHub Consumer Group's grandparent Namespace exists.
   */
  readonly resourceGroupName: string;
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

  constructor(scope: Construct, name: string, ehConsumerGroupProps: ConsumerGroupProps) {
    super(scope, name);

    this.ehConsumerGroupProps = ehConsumerGroupProps;

    const eventhubConsumerGroup = new EventhubConsumerGroup(this, ehConsumerGroupProps.name, {
      name: ehConsumerGroupProps.name,
      resourceGroupName: ehConsumerGroupProps.resourceGroupName,
      namespaceName: ehConsumerGroupProps.namespaceName,
      eventhubName: ehConsumerGroupProps.eventhubName,
      userMetadata: ehConsumerGroupProps.userMetadata,
    })

    this.id = eventhubConsumerGroup.id;

    // Outputs
    const cdktfTerraformOutputEventhubConsumerGroupId = new TerraformOutput(this, 'id', {
      value: eventhubConsumerGroup.id,
    });
    cdktfTerraformOutputEventhubConsumerGroupId.overrideLogicalId('id');
  }
}