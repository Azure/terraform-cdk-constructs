import * as cdktf from "cdktf";
import { AzureKeyVault } from '..';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import { execSync } from 'child_process';

// Get Tenant ID from Azure CLI for test TODO: Turn this into a helper function
let tenantid: string;
try {
  tenantid = execSync('az account show --query tenantId -o tsv').toString().trim();
} catch (error) {
  console.log('Azure CLI is not logged in. Setting tenant ID to all zeros.');
  tenantid = '123e4567-e89b-12d3-a456-426614174000';
}


const app = new App();

export class exampleAzureKeyVault extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-test`,

    });

    new AzureKeyVault(this, 'kv', {
      name: `kv-test`,
      location: 'eastus',
      sku: "standard",
      resource_group_name: resourceGroup.name ,
      tenant_id: tenantid,
      networkAcls: {
        bypass: 'AzureServices',
        defaultAction: 'Allow',
      },
      softDeleteRetentionDays: 7,
    });

    // Outputs to use for End to End Test
    const cdktfTerraformOutputRG = new cdktf.TerraformOutput(this, "resource_group_name", {
      value: resourceGroup.name,
    });

    cdktfTerraformOutputRG.overrideLogicalId("resource_group_name");
    

  }
}

new exampleAzureKeyVault(app, "testAzureKeyVault");

app.synth();