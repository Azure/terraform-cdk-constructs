import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Testing, TerraformStack } from "cdktf";
import "cdktf/lib/testing/adapters/jest";
import * as apgw from "..";
import { TerraformPlan } from "../../testing";

describe("Application Gateway With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {
      features: {},
      skipProviderRegistration: true,
    });

    new apgw.Gateway(stack, "testAzureApplicationGatewayDefaults2", {
      name: "application-gateway",
      location: "eastus",
      skuTier: "WAF_v2",
      skuSize: "WAF_v2",
      capacity: 2,
      backendAddressPools: [
        { name: "backend-address-pool-1" },
        {
          name: "backend-address-pool-2",
          ipAddresses: ["10.0.0.4", "10.0.0.5", "10.0.0.6"],
        },
      ],
      httpListeners: [
        {
          name: "http-listener",
          frontendPortName: "frontend-port",
          frontendIpConfigurationName: "Public",
          protocol: "Http",
        },
      ],
      backendHttpSettings: [
        {
          name: "backend-http-setting",
          port: 80,
          protocol: "Http",
          requestTimeout: 20,
          cookieBasedAffinity: "Disabled",
        },
      ],
      requestRoutingRules: [
        {
          name: "request-routing-rule-1",
          httpListenerName: "http-listener",
          backendAddressPoolName: "backend-address-pool-1",
          backendHttpSettingsName: "backend-http-setting",
          ruleType: "Basic",
        },
        {
          name: "request-routing-rule-2",
          httpListenerName: "http-listener",
          backendAddressPoolName: "backend-address-pool-2",
          backendHttpSettingsName: "backend-http-setting",
          ruleType: "Basic",
        },
      ],
    });

    fullSynthResult = Testing.fullSynth(stack); // Save the result for reuse
  });

  it("renders an Application Gateway with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); // Compare the already prepared stack
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform(); // Use the saved result
  });

  it("check if this can be planned", () => {
    TerraformPlan(fullSynthResult); // Use the saved result
  });
});
