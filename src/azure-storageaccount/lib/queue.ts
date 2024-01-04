import {
  StorageQueue,
  StorageQueueConfig,
} from "@cdktf/provider-azurerm/lib/storage-queue";
import { Construct } from "constructs";

export class Queue extends Construct {
  public readonly name: string;

  constructor(scope: Construct, id: string, props: StorageQueueConfig) {
    super(scope, id);

    // Create a storage container
    const newQueue = new StorageQueue(this, "Queue", {
      name: props.name,
      storageAccountName: props.storageAccountName,
      metadata: props.metadata,
    });

    this.name = newQueue.name;
  }
}
