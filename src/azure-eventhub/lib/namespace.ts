import { EventhubNamespace } from "@cdktf/provider-azurerm/lib/eventhub-namespace";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { Instance, BaseInstanceProps } from "./instance";
import { AzureResourceWithAlert } from "../../core-azure/lib";

export interface NamespaceProps {
  /**
   * The Azure Resource Group in which to create the EventHub Namespace.
   */
  readonly resourceGroup: ResourceGroup;
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
  readonly ehNamespaceProps: NamespaceProps;
  public resourceGroup: ResourceGroup;
  public id: string;
  readonly namespaceName: string;

  constructor(
    scope: Construct,
    name: string,
    ehNamespaceProps: NamespaceProps,
  ) {
    super(scope, name);

    this.ehNamespaceProps = ehNamespaceProps;
    this.resourceGroup = ehNamespaceProps.resourceGroup;
    this.namespaceName = ehNamespaceProps.name;

    const defaults = {
      sku: ehNamespaceProps.sku || "Basic",
      capacity: ehNamespaceProps.capacity || 2,
      autoInflateEnabled: ehNamespaceProps.autoInflateEnabled || false,
      maximumThroughputUnits: ehNamespaceProps.maximumThroughputUnits || 2,
      zoneRedundant: ehNamespaceProps.zoneRedundant || false,
      tags: ehNamespaceProps.tags || {},
      minimumTlsVersion: ehNamespaceProps.minimumTlsVersion || "1.2",
      publicNetworkAccessEnabled:
        ehNamespaceProps.publicNetworkAccessEnabled || true,
      localAuthenticationEnabled:
        ehNamespaceProps.localAuthenticationEnabled || true,
      identity: {
        type: ehNamespaceProps.identityType || "SystemAssigned",
        identityIds:
          ehNamespaceProps.identityType == "UserAssigned"
            ? ehNamespaceProps.identityIds
            : undefined,
      },
    };

    const eventhubNamespce = new EventhubNamespace(this, "ehnamespace", {
      name: ehNamespaceProps.name,
      resourceGroupName: this.resourceGroup.name,
      location: this.resourceGroup.location,
      ...defaults,
    });

    // Outputs
    this.id = eventhubNamespce.id;
    const cdktfTerraformOutputEventhubNamespceId = new cdktf.TerraformOutput(
      this,
      "id",
      {
        value: eventhubNamespce.id,
      },
    );
    cdktfTerraformOutputEventhubNamespceId.overrideLogicalId("id");
  }

  // Create an EventHub Instance Method
  addEventhubInstance(props: BaseInstanceProps) {
    return new Instance(this, "ehinstance", {
      resourceGroup: this.resourceGroup,
      namespaceName: this.namespaceName,
      ...props,
    });
  }
}
