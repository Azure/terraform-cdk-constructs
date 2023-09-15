import { Testing, TerraformStack} from 'cdktf';
import 'cdktf/lib/testing/adapters/jest';
import {AzurermProvider} from "@cdktf/provider-azurerm/lib/provider";
import { AzureDiagnosticSettings } from '..';
import {AppConfiguration} from "@cdktf/provider-azurerm/lib/app-configuration";
import {exampleAzureDiagnosticSettings} from "./ExampleAzureDiagSettings";

describe('Azure Diagnostics With Defaults', () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {features: {}});

    const appconfig = new AppConfiguration(stack, 'testAzureApplicationConfiguration', {
      name: "myappconfigstore",
      location: "eastus",
      resourceGroupName: "myResourceGroup",
      sku: "standard",
    });

    new AzureDiagnosticSettings(stack, 'testAzureDiagnosticSettingsDefaults', {
      name: "diag-settings-test",
      targetResourceId: appconfig.id,
      storageAccountId: "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount",
      metricCategories: ["AllMetrics"],
      logCategories: ["AuditEvent", "Policy"],
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Diagnostic Settings with defaults and checks snapshot", () => {
    expect(
      Testing.synth(stack)
    ).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    expect(fullSynthResult).toPlanSuccessfully(); // Use the saved result
  });
});


describe('Azure Diagnostics With Defaults and no categories', () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {features: {}});

    const appconfig = new AppConfiguration(stack, 'testAzureAppConfigurationNoCat', {
      name: "myappconfigstore",
      location: "eastus",
      resourceGroupName: "myResourceGroup",
      sku: "standard",
    });

    new AzureDiagnosticSettings(stack, 'testAzureDiagnosticSettingsDefaultsNoCat', {
      name: "diag-settings-test",
      targetResourceId: appconfig.id,
      storageAccountId: "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount",
      //metricCategories: ["AllMetrics"],
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Azure Diagnostic Settings with defaults and checks snapshot", () => {
    expect(
      Testing.synth(stack)
    ).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    expect(fullSynthResult).toPlanSuccessfully(); // Use the saved result
  });
});

describe('Azure Diagnostic Settings Example', () => {
  
  it("renders the Azure Diagnostic Settings example and checks snapshot", () => {
    expect(
      Testing.synth(new exampleAzureDiagnosticSettings(Testing.app(), "testAzureDiagnosticSettingsExample"))
      
    ).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureDiagnosticSettings(Testing.app(), "testAzureDiagnosticSettingsExample"))).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
  
    
    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(new exampleAzureDiagnosticSettings(Testing.app(), "testAzureDiagnosticSettingsExample"))).toPlanSuccessfully();
  });
});
