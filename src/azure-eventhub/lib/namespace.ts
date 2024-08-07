import { EventhubNamespace } from "@cdktf/provider-azurerm/lib/eventhub-namespace";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { Instance, BaseInstanceProps } from "./instance";
import { AzureResourceWithAlert } from "../../core-azure/lib";

export interface NamespaceProps {
  /**
   * An optional reference to the resource group in which to deploy the Event Hub Cluster.
   * If not provided, the Event Hub Cluster will be deployed in the default resource group.
   */
  readonly resourceGroup?: ResourceGroup;
  /**
   * The name of the EventHub Namespace to create.
   */
  readonly name: string;
  /**
   * Defines which tier to use. Valid options are Basic, Standard, and Premium.
   * @default "Basic"
   */
  readonly sku?: string;
  /**
   * Specifies the Capacity / Throughput Units for a Standard SKU namespace.
   * @default 2
   */
  readonly capacity?: number;
  /**
   * Specifies if the EventHub Namespace should be Auto Inflate enabled.
   * @default false
   */
  readonly autoInflateEnabled?: boolean;
  /**
   * Specifies the maximum number of throughput units when Auto Inflate is Enabled. Valid values range from 1 - 20.
   * @default 2
   */
  readonly maximumThroughputUnits?: number;
  /**
   * Specifies if the EventHub Namespace should be Zone Redundant (created across Availability Zones).
   * @default true
   */
  readonly zoneRedundant?: boolean;
  /**
   * The tags to assign to the Key Vault.
   */
  readonly tags?: { [key: string]: string };
  /**
   * The minimum supported TLS version for this EventHub Namespace. Valid values are: 1.0, 1.1 and 1.2.
   * @default "1.2"
   */
  readonly minimumTlsVersion?: string;
  /**
   * Is public network access enabled for the EventHub Namespace?
   * @default true
   */
  readonly publicNetworkAccessEnabled?: boolean;
  /**
   * Is SAS authentication enabled for the EventHub Namespace? North Central US Not supported.
   * @default false
   */
  readonly localAuthenticationEnabled?: boolean;
  /**
   * Specifies the type of Managed Service Identity that should be configured on this Event Hub Namespace. Possible values are SystemAssigned or UserAssigned.
   * @default "SystemAssigned"
   */
  readonly identityType?: string;
  /**
   * Specifies a list of User Assigned Managed Identity IDs to be assigned to this EventHub namespace.
   */
  readonly identityIds?: string[] | undefined;

  /**
   * TODO: network_rulesets
   */
}

export class Namespace extends AzureResourceWithAlert {
  readonly props: NamespaceProps;
  public resourceGroup: ResourceGroup;
  public id: string;
  readonly name: string;

  /**
   * Constructs a new Event Hub Namespace.
   *
   * This class creates an Azure Event Hub Namespace, which serves as a container for all messaging components.
   * Namespaces provide a scoping container for Event Hub resources within a specific region, which can be further
   * controlled and managed using the provided settings.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param name - The unique name for this instance of the Event Hub Namespace.
   * @param ehNamespaceProps - The properties for configuring the Event Hub Namespace. These properties include:
   *                - `resourceGroup`: Optional. Reference to the resource group for deployment.
   *                - `name`: Required. The name of the Event Hub Namespace to create.
   *                - `sku`: Optional. The SKU tier of the namespace (Basic, Standard, Premium). Defaults to "Basic".
   *                - `capacity`: Optional. Specifies the throughput units for a Standard SKU namespace. Defaults to 2.
   *                - `autoInflateEnabled`: Optional. Enables or disables Auto Inflate. Defaults to false.
   *                - `maximumThroughputUnits`: Optional. The maximum number of throughput units when Auto Inflate is enabled. Defaults to 2.
   *                - `zoneRedundant`: Optional. Specifies if the namespace should be zone redundant. Defaults to true.
   *                - `tags`: Optional. Tags for resource management and categorization.
   *                - `minimumTlsVersion`: Optional. Specifies the minimum supported TLS version. Defaults to "1.2".
   *                - `publicNetworkAccessEnabled`: Optional. Specifies if public network access is enabled. Defaults to true.
   *                - `localAuthenticationEnabled`: Optional. Specifies if SAS authentication is enabled. Defaults to false.
   *                - `identityType`: Optional. The type of Managed Service Identity. Defaults to "SystemAssigned".
   *                - `identityIds`: Optional. A list of User Assigned Managed Identity IDs.
   *
   * Example usage:
   * ```typescript
   * const eventHubNamespace = new Namespace(this, 'myNamespace', {
   *   resourceGroup: resourceGroup,
   *   name: 'myEventHubNamespace',
   *   sku: 'Standard',
   *   capacity: 4,
   *   autoInflateEnabled: true,
   *   maximumThroughputUnits: 10,
   *   zoneRedundant: false,
   *   tags: {
   *     department: 'IT'
   *   },
   *   minimumTlsVersion: '1.2',
   *   publicNetworkAccessEnabled: false,
   *   localAuthenticationEnabled: true,
   *   identityType: 'SystemAssigned'
   * });
   * ```
   */
  constructor(scope: Construct, name: string, props: NamespaceProps) {
    super(scope, name);

    this.props = props;
    this.resourceGroup = this.setupResourceGroup(props);

    const defaults = {
      sku: props.sku || "Basic",
      capacity: props.capacity || 2,
      autoInflateEnabled: props.autoInflateEnabled || false,
      maximumThroughputUnits: props.maximumThroughputUnits || 0,
      zoneRedundant: props.zoneRedundant || false,
      tags: props.tags || {},
      minimumTlsVersion: props.minimumTlsVersion || "1.2",
      publicNetworkAccessEnabled: props.publicNetworkAccessEnabled || true,
      localAuthenticationEnabled: props.localAuthenticationEnabled || true,
      identity: {
        type: props.identityType || "SystemAssigned",
        identityIds:
          props.identityType == "UserAssigned" ? props.identityIds : undefined,
      },
    };

    const eventhubNamespace = new EventhubNamespace(this, "ehnamespace", {
      name: props.name,
      resourceGroupName: this.resourceGroup.name,
      location: this.resourceGroup.location,
      ...defaults,
    });

    this.name = eventhubNamespace.name;

    // Outputs
    this.id = eventhubNamespace.id;
    const cdktfTerraformOutputEventhubNamespceId = new cdktf.TerraformOutput(
      this,
      "id",
      {
        value: eventhubNamespace.id,
      },
    );
    cdktfTerraformOutputEventhubNamespceId.overrideLogicalId("id");
  }

  /**
   * Creates and adds an Event Hub instance to the current namespace.
   *
   * This method sets up a new Event Hub instance within the namespace defined by this class. An Event Hub instance
   * serves as a container that processes and stores events. This method facilitates the setup of multiple Event Hubs
   * within a single namespace, each configured according to the specified properties.
   *
   * @param props - The properties for configuring the new Event Hub instance. These properties extend `BaseInstanceProps`, which include:
   *                - `name`: Required. The name of the Event Hub instance.
   *                - `partitionCount`: Optional. The number of partitions in the Event Hub. Default is 2.
   *                - `messageRetention`: Optional. The number of days to retain messages in the Event Hub. Default is 1.
   *                - `status`: Optional. The operational status of the Event Hub (Active, Disabled, SendDisabled). Default is "Active".
   *                Other properties from `BaseInstanceProps` can also be passed and will be used in the creation of the Event Hub.
   *
   * @returns An instance of the Event Hub (`Instance` class), configured with the specified properties.
   *
   * Example usage:
   * ```typescript
   * const eventHub = namespace.addEventhubInstance({
   *   name: 'myEventHub',
   *   partitionCount: 4,
   *   messageRetention: 7,
   *   status: 'Active'
   * });
   * ```
   *
   * @remarks
   * Ensure that the namespace has sufficient capacity and configuration to support the properties of the Event Hub being created,
   * especially in terms of partition count and throughput units if applicable.
   */
  addEventhubInstance(props: BaseInstanceProps) {
    return new Instance(this, props.name, {
      resourceGroup: this.resourceGroup,
      namespaceName: this.name,
      ...props,
    });
  }
}
