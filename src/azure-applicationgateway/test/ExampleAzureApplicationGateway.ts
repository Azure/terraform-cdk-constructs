import { DataAzurermClientConfig } from "@cdktf/provider-azurerm/lib/data-azurerm-client-config";
import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { PublicIp } from "@cdktf/provider-azurerm/lib/public-ip";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Subnet } from "@cdktf/provider-azurerm/lib/subnet";
import { VirtualNetwork } from "@cdktf/provider-azurerm/lib/virtual-network";
import * as cdktf from "cdktf";
import { App } from "cdktf";
import { Construct } from "constructs";
import * as kv from "../../azure-keyvault";
import { BaseTestStack } from "../../testing";
import * as util from "../../util/azureTenantIdHelpers";
import * as apgw from "../lib";

const app = new App();

export class exampleAzureApplicationGateway extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const clientConfig = new DataAzurermClientConfig(
      this,
      "CurrentClientConfig",
      {},
    );

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
      lifecycle: {
        ignoreChanges: ["tags"],
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

    const vnet = new VirtualNetwork(this, "vnet", {
      name: `vnet-${this.name}`,
      location: "eastus",
      resourceGroupName: resourceGroup.name,
      addressSpace: ["10.0.0.0/24"],
    });

    const subnet = new Subnet(this, "subnet", {
      name: `subnet-${this.name}`,
      resourceGroupName: resourceGroup.name,
      virtualNetworkName: vnet.name,
      addressPrefixes: ["10.0.0.0/24"],
    });

    const publicIp = new PublicIp(this, "publicIp", {
      name: "testip",
      location: "eastus",
      resourceGroupName: resourceGroup.name,
      allocationMethod: "Static",
      sku: "Standard",
    });

    const publicIpwaf = new PublicIp(this, "publicIpwaf", {
      name: "testipwaf",
      location: "eastus",
      resourceGroupName: resourceGroup.name,
      allocationMethod: "Static",
      sku: "Standard",
    });

    const azureKeyVault = new kv.Vault(this, "keyvault", {
      name: `kv-${this.name}`,
      resourceGroup: resourceGroup,
      location: "eastus",
      tenantId: util.getAzureTenantId(),
    });
    azureKeyVault.grantCustomAccess(clientConfig.objectId, {
      secretPermissions: ["Get", "List", "Set", "Delete"],
      keyPermissions: [
        "Backup",
        "Create",
        "Decrypt",
        "Delete",
        "Encrypt",
        "Get",
        "Import",
        "List",
        "Purge",
        "Recover",
        "Restore",
        "Sign",
        "UnwrapKey",
        "Update",
        "Verify",
        "WrapKey",
        "Release",
        "Rotate",
        "GetRotationPolicy",
        "SetRotationPolicy",
      ],
      certificatePermissions: [
        "Get",
        "List",
        "Create",
        "Delete",
        "GetIssuers",
        "ManageIssuers",
      ],
    });

    const cert = azureKeyVault.addSelfSignedCert("ssl-cert", "CN=contoso.com", [
      "internal.contoso.com",
    ]);

    const applicationGateway = new apgw.Gateway(this, "appgw", {
      name: `apgw-${this.name}`,
      resourceGroup: resourceGroup,
      location: "eastus",
      skuTier: "Standard_v2",
      skuSize: "Standard_v2",
      capacity: 2,
      publicIpAddress: publicIp,
      subnet: subnet,
      backendAddressPools: [
        { name: "backend-address-pool-1" },
        {
          name: "backend-address-pool-2",
          ipAddresses: ["10.1.0.4", "10.1.0.5", "10.1.0.6"],
        },
      ],
      httpListeners: [
        {
          name: "http-listener",
          frontendPortName: "80",
          frontendIpConfigurationName: "Public-frontend-ip-configuration",
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
          priority: 1,
          backendAddressPoolName: "backend-address-pool-1",
          backendHttpSettingsName: "backend-http-setting",
          ruleType: "Basic",
        },
      ],
    });

    new apgw.Gateway(this, "appgw_waf", {
      name: `apgw-${this.name}waf`,
      resourceGroup: resourceGroup,
      location: "eastus",
      skuTier: "WAF_v2",
      skuSize: "WAF_v2",
      capacity: 2,
      publicIpAddress: publicIpwaf,
      tenantId: util.getAzureTenantId(),
      subnet: subnet,
      keyVault: azureKeyVault.keyVault,
      backendAddressPools: [
        { name: "backend-address-pool-1" },
        {
          name: "backend-address-pool-2",
          ipAddresses: ["10.1.0.4", "10.1.0.5", "10.1.0.6"],
        },
      ],
      httpListeners: [
        {
          name: "http-listener",
          frontendPortName: "443",
          frontendIpConfigurationName: "Public-frontend-ip-configuration",
          protocol: "Https",
          sslCertificateName: "internal.contoso.com",
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
          priority: 1,
          backendAddressPoolName: "backend-address-pool-1",
          backendHttpSettingsName: "backend-http-setting",
          ruleType: "Basic",
        },
      ],
      wafConfiguration: {
        enabled: true,
        firewallMode: "Detection",
        ruleSetType: "OWASP",
        ruleSetVersion: "3.0",
        disabledRuleGroup: [],
        fileUploadLimitMb: 100,
        requestBodyCheck: false,
        maxRequestBodySizeKb: 32,
      },
      probe: [
        {
          name: "probe-8080",
          interval: 3,
          protocol: "Http",
          path: "/status",
          timeout: 15,
          unhealthyThreshold: 3,
          port: 8080,
          host: "test",
        },
      ],
      redirectConfiguration: [
        {
          name: "http-redirect",
          redirectType: "Permanent",
          targetListenerName: "http-listener",
          includePath: true,
          includeQueryString: true,
        },
      ],
      urlPathMap: [
        {
          name: "url-path-map",
          defaultRedirectConfigurationName: "http-redirect",
          pathRule: [
            {
              name: "path-rule-01",
              redirectConfigurationName: "http-redirect",
              paths: ["/helloworld"],
            },
          ],
        },
      ],
      sslCertificate: [
        {
          name: "internal.contoso.com",
          keyVaultSecretId: cert.secretId,
        },
      ],
    });

    //Diag Settings
    applicationGateway.addDiagSettings({
      name: "diagsettings",
      logAnalyticsWorkspaceId: logAnalyticsWorkspace.id,
    });

    //RBAC
    applicationGateway.addAccess(clientConfig.objectId, "Contributor");

    // Outputs to use for End to End Test
    const cdktfTerraformOutputKVName = new cdktf.TerraformOutput(
      this,
      "resource_group_name",
      {
        value: resourceGroup.name,
      },
    );

    cdktfTerraformOutputKVName.overrideLogicalId("resource_group_name");
  }
}

new exampleAzureApplicationGateway(app, "testAzureApplicationGateway");

app.synth();
