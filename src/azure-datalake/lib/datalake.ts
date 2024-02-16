import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { StorageDataLakeGen2Path } from "@cdktf/provider-azurerm/lib/storage-data-lake-gen2-path";
import { Construct } from "constructs";
import * as sa from "../../azure-storageaccount";
import { AzureResource, DiagnosticSettings } from "../../core-azure";

export class DataLake extends AzureResource {
  readonly props: any;
  public resourceGroupName: string;
  public resourceGroup: ResourceGroup;

  private monitor: DiagnosticSettings;

  private storageAccount: sa.Account;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);

    this.props = props;
    /*
    if (!props.resourceGroup) {
      this.resourceGroup = new ResourceGroup(this, "rg", {
        name: `rg-${props.name}`,
        location: props.location,
        tags: props.tags,
      });
    } else {
      this.resourceGroup = props.resourceGroup;
    }
    */

    this.resourceGroup = this.setupResourceGroup(props);
    this.resourceGroupName = this.resourceGroup.name;

    this.storageAccount = new sa.Account(scope, id + "storageAccount", {
      name: "test42348808",
      location: "eastus",
      resourceGroup: this.resourceGroup,
    });

    // datalake filesystem

    this.monitor = this.addDiagSettings({
      name: "diagsettings",
      logAnalyticsWorkspaceId: props.logAnalyticsWorkspaceId,
      metricCategories: ["Capacity", "Transaction"],
    });
  }
}
