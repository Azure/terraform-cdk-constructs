import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { App } from "cdktf";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import * as lake from "..";
import { BaseTestStack } from "../../testing";

const app = new App();

export class exampleAzureDataLake extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const clientConfig = new DataAzurermClientConfig(
      this,
      "CurrentClientConfig",
      {},
    );

    new AzurermProvider(this, "azureFeature", {
      features: {},
    });

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "rg", {
      name: `rg-${this.name}`,
      location: "eastus",
      lifecycle: {
        ignoreChanges: ["tags"],
      },
    });

    const dataLake = new lake.DataLake(this, "datalake", {
      resourceGroup: resourceGroup,
    });

    //RBAC
    dataLake.storageAccount.addAccess(clientConfig.objectId, "Contributor");
    dataLake.storageAccount.addAccess(
      clientConfig.objectId,
      "Storage Blob Data Contributor",
    );

    var filesystem = dataLake.addDataLakeFilesystem("datalake", {});
    filesystem.addDataLakePath("test", {});

    // Outputs to use for End to End Test
    const cdktfTerraformOutputRGName = new cdktf.TerraformOutput(
      this,
      "resource_group_name",
      {
        value: resourceGroup.name,
      },
    );
    cdktfTerraformOutputRGName.overrideLogicalId("resource_group_name");

    const cdktfTerraformOutputSAName = new cdktf.TerraformOutput(
      this,
      "storage_account_name",
      {
        value: dataLake.storageAccount.name,
      },
    );
    cdktfTerraformOutputSAName.overrideLogicalId("storage_account_name");

    const cdktfTerraformOutputSAtier = new cdktf.TerraformOutput(
      this,
      "storage_account_account_tier",
      {
        value: dataLake.storageAccount.accountTier,
      },
    );
    cdktfTerraformOutputSAtier.overrideLogicalId(
      "storage_account_account_tier",
    );

    const cdktfTerraformOutputSAkind = new cdktf.TerraformOutput(
      this,
      "storage_account_account_kind",
      {
        value: dataLake.storageAccount.accountKind,
      },
    );
    cdktfTerraformOutputSAkind.overrideLogicalId(
      "storage_account_account_kind",
    );
  }
}

new exampleAzureDataLake(app, "testAzureDataLake");

app.synth();
