import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import * as cdktf from "cdktf";
import { App } from "cdktf";
import { Construct } from "constructs";
import * as func from "..";
import { BaseTestStack } from "../../testing";
import { ServicePlanSkus } from "../serviceplanskus";

const app = new App();

export class exampleAzureLinuxFunctionApp extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
      features: {
        resourceGroup: {
          preventDeletionIfContainsResources: false,
        },
      },
    });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: "eastus",
      name: `rg-${this.name}`,
      tags: {
        test: "test",
      },
    });

    const logAnalyticsWorkspace = new LogAnalyticsWorkspace(
      this,
      "log_analytics",
      {
        location: "eastus",
        name: `la-${this.name}`,
        resourceGroupName: resourceGroup.name,
      },
    );

    // Consumption Function
    const consumptionFunctionApp = new func.FunctionAppLinux(
      this,
      "consumptionFA",
      {
        name: `fa${this.name}`,
        location: "eastus",
        resourceGroup: resourceGroup,
        tags: {
          test: "test",
        },
      },
    );

    new func.FunctionAppLinux(this, "consumptionFA2", {
      name: `fa${this.name}2`,
      location: "eastus",
      storageAccount: consumptionFunctionApp.storageAccount,
      servicePlan: consumptionFunctionApp.servicePlan,
      resourceGroup: resourceGroup,
      runtimeVersion: {
        pythonVersion: "3.8",
      },
      siteConfig: {
        cors: {
          allowedOrigins: ["*"],
        },
      },
      tags: {
        test: "test",
      },
    });

    // Premium Function
    new func.FunctionAppLinux(this, "premiumFA", {
      name: `faprem${this.name}`,
      location: "eastus",
      servicePlanSku: ServicePlanSkus.PremiumEP1,
      runtimeVersion: {
        dotnetVersion: "5.0",
      },
      tags: {
        test: "test",
      },
    });

    // Service Plan Function
    new func.FunctionAppLinux(this, "servicePlanFA", {
      name: `fasp${this.name}`,
      location: "eastus",
      servicePlanSku: ServicePlanSkus.ASPBasicB1,
      runtimeVersion: {
        pythonVersion: "3.8",
      },
      siteConfig: {
        cors: {
          allowedOrigins: ["*"],
        },
      },
      tags: {
        test: "test",
      },
    });

    //Diag Settings
    consumptionFunctionApp.addDiagSettings({
      name: "diagsettings",
      logAnalyticsWorkspaceId: logAnalyticsWorkspace.id,
      metricCategories: ["AllMetrics"],
    });

    // Create Terraform Outputs for Function Apps
    const cdktfTerraformOutputRG = new cdktf.TerraformOutput(
      this,
      "resource_group_name",
      {
        value: resourceGroup.name,
      },
    );

    const cdktfTerraformOutputFAid = new cdktf.TerraformOutput(
      this,
      "function_app_id",
      {
        value: consumptionFunctionApp.id,
      },
    );
    const cdktfTerraformOutputFAdefaulthost = new cdktf.TerraformOutput(
      this,
      "default_hostname",
      {
        value: consumptionFunctionApp.defaultHostname,
      },
    );

    const cdktfTerraformOutputFAname = new cdktf.TerraformOutput(
      this,
      "function_app_name",
      {
        value: consumptionFunctionApp.name,
      },
    );

    const cdktfTerraformOutputFAkind = new cdktf.TerraformOutput(
      this,
      "function_app_kind",
      {
        value: consumptionFunctionApp.kind,
      },
    );

    cdktfTerraformOutputFAkind.overrideLogicalId("function_app_kind");
    cdktfTerraformOutputFAname.overrideLogicalId("function_app_name");
    cdktfTerraformOutputFAdefaulthost.overrideLogicalId("default_hostname");
    cdktfTerraformOutputFAid.overrideLogicalId("function_app_id");
    cdktfTerraformOutputRG.overrideLogicalId("resource_group_name");
  }
}

new exampleAzureLinuxFunctionApp(app, "testAzureLinuxFunctionApp");

app.synth();
