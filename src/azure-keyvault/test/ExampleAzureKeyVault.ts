import * as cdktf from "cdktf";
import { AzureKeyVault } from '..';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup} from "@cdktf/provider-azurerm/lib/resource-group";
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { Construct } from 'constructs';
import { generateRandomString } from '../../util/randomString';
import { execSync } from 'child_process';

const rndName = generateRandomString(10);
const tenant_id = execSync('az account show --query tenantId -o tsv').toString().trim();


const app = new App();

export class exampleAzureKeyVault extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: `rg-${rndName}`,

    });

    const keyVault = new AzureKeyVault(this, 'testLA', {
      name: `kv-${rndName}`,
      location: 'eastus',
      sku: "standard",
      resource_group_name: resourceGroup.name ,
      tenant_id: tenant_id,
    });

    // Outputs to use for End to End Test
    const cdktfTerraformOutputRG = new cdktf.TerraformOutput(this, "resource_group_name", {
      value: resourceGroup.name,
    });
    const cdktfTerraformOutputLAName = new cdktf.TerraformOutput(this, "key_vault_name", {
      value: keyVault.props.name,
    });
    

    cdktfTerraformOutputRG.overrideLogicalId("resource_group_name");
    cdktfTerraformOutputLAName.overrideLogicalId("key_vault_name");

  }
}

new exampleAzureKeyVault(app, "testAzureKeyVault");

app.synth();