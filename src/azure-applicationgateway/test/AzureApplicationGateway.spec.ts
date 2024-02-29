import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { PublicIp } from "@cdktf/provider-azurerm/lib/public-ip";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Testing, TerraformStack } from "cdktf";
import { exampleAzureApplicationGateway } from "./ExampleAzureApplicationGateway";
import "cdktf/lib/testing/adapters/jest";
import * as apgw from "..";
import * as util from "../../util/azureTenantIdHelpers";

describe("Application Gateway With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", { features: {} });

    const resourceGroup = new ResourceGroup(stack, "MyResourceGroup", {
      name: "testrg",
      location: "eastus",
    });

    const publicIp = new PublicIp(stack, "publicIp", {
      name: "testip",
      location: "eastus",
      resourceGroupName: resourceGroup.name,
      allocationMethod: "Dynamic",
      sku: "Standard",
    });

    new apgw.Gateway(stack, "testAzureApplicationGatewayDefaults2", {
      name: "application-gateway",
      resourceGroup: resourceGroup,
      location: "eastus",
      skuTier: "WAF_v2",
      skuSize: "WAF_v2",
      capacity: 2,
      publicIpAddress: publicIp,
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
    expect(fullSynthResult).toPlanSuccessfully(); // Use the saved result
  });
});

describe("Application Gateway Example", () => {
  it("renders the Application Gateway and checks snapshot", () => {
    // Need to remove the tenant_id from the snapshot as it will change wherever the test is run
    const output = Testing.synth(
      new exampleAzureApplicationGateway(
        Testing.app(),
        "testAzureApplicationGateway",
      ),
    );
    const myObject: Record<string, any> = JSON.parse(output);

    expect(util.removeTenantIdFromSnapshot(myObject)).toMatchSnapshot();
  });

  it("check if the produced terraform configuration is valid", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureApplicationGateway(
          Testing.app(),
          "testAzureApplicationGateway",
        ),
      ),
    ).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    // We need to do a full synth to plan the terraform configuration
    expect(
      Testing.fullSynth(
        new exampleAzureApplicationGateway(
          Testing.app(),
          "testAzureApplicationGateway",
        ),
      ),
    ).toPlanSuccessfully();
  });
});
