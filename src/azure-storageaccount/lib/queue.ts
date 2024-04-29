import {
  StorageQueue,
  StorageQueueConfig,
} from "@cdktf/provider-azurerm/lib/storage-queue";
import { Construct } from "constructs";

export class Queue extends Construct {
  public readonly name: string;

  /**
   * Represents an Azure Storage Queue within a specific Azure Storage Account.
   *
   * This class is responsible for the creation and management of an Azure Storage Queue, which is a service for storing large numbers
   * of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. A single queue message
   * can be up to 64 KB in size, and a queue can contain millions of messages, up to the total capacity limit of a storage account.
   * This class provides a way to manage messages in a scalable and secure manner.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the queue.
   * @param props - Configuration properties for the Azure Storage Queue. These properties may include:
   *                - `name`: The name of the queue, which must be unique within the storage account.
   *                - `storageAccountName`: The name of the storage account in which this queue is being created.
   *                - `metadata`: A dictionary of strings that represents metadata to associate with the queue.
   *                - `timeouts`: Custom timeout settings for CRUD operations on the queue to manage operation durations and retries.
   *
   * Example usage:
   * ```typescript
   * const myQueue = new Queue(this, 'MyQueue', {
   *   name: 'taskqueue',
   *   storageAccountName: 'mystorageaccount',
   *   metadata: {
   *     department: 'IT'
   *   }
   * });
   * ```
   * This class initializes a storage queue with the specified configurations. It can be used to enqueue and process messages as needed
   * within applications, providing a reliable messaging solution for asynchronous communication and coordination of tasks across systems.
   */
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
