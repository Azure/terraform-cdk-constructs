/**
 * Integration test for Azure Virtual Network Gateway Connection
 *
 * This test demonstrates basic usage of the VirtualNetworkGatewayConnection construct
 * by creating a VNet-to-VNet connection between two virtual network gateways.
 *
 * Note: Virtual Network Gateways take 30-45 minutes each to provision,
 * so this test has an extended timeout (~120 minutes total).
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktn";
import { Construct } from "constructs";
import "cdktn/lib/testing/adapters/jest";
import { PublicIPAddress } from "../../azure-publicipaddress";
import { ResourceGroup } from "../../azure-resourcegroup";
import { Subnet } from "../../azure-subnet";
import { VirtualNetwork } from "../../azure-virtualnetwork";
import { VirtualNetworkGateway } from "../../azure-virtualnetworkgateway";
import { AzapiProvider } from "@cdktn/provider-azapi/lib/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { VirtualNetworkGatewayConnection } from "../lib/virtual-network-gateway-connection";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata(
  "virtual-network-gateway-connection-integration",
  {
    maxAgeHours: 4,
  },
);

/**
 * Example stack demonstrating Virtual Network Gateway Connection usage
 * Creates two gateways and a VNet-to-VNet connection between them
 */
class VirtualNetworkGatewayConnectionExampleStack extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      testRunOptions: {
        maxAgeHours: testMetadata.maxAgeHours,
        autoCleanup: testMetadata.autoCleanup,
        cleanupPolicy: testMetadata.cleanupPolicy,
      },
    });

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Generate unique names
    const rgName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "conn",
    );

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
      },
    });

    // ===== First Virtual Network and Gateway =====
    const vnet1 = new VirtualNetwork(this, "vnet1", {
      name: "vnet1-conn-example",
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.1.0.0/16"],
      },
      tags: {
        ...this.systemTags(),
      },
    });

    const gatewaySubnet1 = new Subnet(this, "gateway-subnet1", {
      name: "GatewaySubnet",
      virtualNetworkName: "vnet1-conn-example",
      virtualNetworkId: vnet1.id,
      resourceGroupId: resourceGroup.id,
      addressPrefix: "10.1.1.0/24",
    });

    const publicIp1 = new PublicIPAddress(this, "public-ip1", {
      name: "pip-gateway1-example",
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      sku: {
        name: "Standard",
        tier: "Regional",
      },
      publicIPAllocationMethod: "Static",
      tags: {
        ...this.systemTags(),
      },
    });

    const gateway1 = new VirtualNetworkGateway(this, "vpn-gateway1", {
      name: "vng1-conn-example",
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      gatewayType: "Vpn",
      vpnType: "RouteBased",
      sku: {
        name: "VpnGw1",
        tier: "VpnGw1",
      },
      ipConfigurations: [
        {
          name: "default",
          subnetId: gatewaySubnet1.id,
          publicIPAddressId: publicIp1.id,
        },
      ],
      tags: {
        ...this.systemTags(),
      },
    });

    // ===== Second Virtual Network and Gateway =====
    const vnet2 = new VirtualNetwork(this, "vnet2", {
      name: "vnet2-conn-example",
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      addressSpace: {
        addressPrefixes: ["10.2.0.0/16"],
      },
      tags: {
        ...this.systemTags(),
      },
    });

    const gatewaySubnet2 = new Subnet(this, "gateway-subnet2", {
      name: "GatewaySubnet",
      virtualNetworkName: "vnet2-conn-example",
      virtualNetworkId: vnet2.id,
      resourceGroupId: resourceGroup.id,
      addressPrefix: "10.2.1.0/24",
    });

    const publicIp2 = new PublicIPAddress(this, "public-ip2", {
      name: "pip-gateway2-example",
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      sku: {
        name: "Standard",
        tier: "Regional",
      },
      publicIPAllocationMethod: "Static",
      tags: {
        ...this.systemTags(),
      },
    });

    const gateway2 = new VirtualNetworkGateway(this, "vpn-gateway2", {
      name: "vng2-conn-example",
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      gatewayType: "Vpn",
      vpnType: "RouteBased",
      sku: {
        name: "VpnGw1",
        tier: "VpnGw1",
      },
      ipConfigurations: [
        {
          name: "default",
          subnetId: gatewaySubnet2.id,
          publicIPAddressId: publicIp2.id,
        },
      ],
      tags: {
        ...this.systemTags(),
      },
    });

    // ===== VNet-to-VNet Connections =====
    // Connection from gateway1 to gateway2
    new VirtualNetworkGatewayConnection(this, "vnet-to-vnet-conn1", {
      name: "conn1to2-example",
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      connectionType: "Vnet2Vnet",
      virtualNetworkGateway1: {
        id: gateway1.id,
      },
      virtualNetworkGateway2: {
        id: gateway2.id,
      },
      sharedKey: "SecureSharedKey123!",
      tags: {
        ...this.systemTags(),
        example: "vnet-to-vnet",
        direction: "1-to-2",
      },
    });

    // Connection from gateway2 to gateway1 (bidirectional)
    new VirtualNetworkGatewayConnection(this, "vnet-to-vnet-conn2", {
      name: "conn2to1-example",
      location: "eastus",
      resourceGroupId: resourceGroup.id,
      connectionType: "Vnet2Vnet",
      virtualNetworkGateway1: {
        id: gateway2.id,
      },
      virtualNetworkGateway2: {
        id: gateway1.id,
      },
      sharedKey: "SecureSharedKey123!",
      tags: {
        ...this.systemTags(),
        example: "vnet-to-vnet",
        direction: "2-to-1",
      },
    });
  }
}

describe.skip("Virtual Network Gateway Connection Integration Test", () => {
  // NOTE: This test takes 60-90 minutes due to gateway provisioning time (2 gateways).
  // This test provisions two complete VPN gateways and tests VNet-to-VNet connections.
  // SKIPPED BY DEFAULT: Run explicitly with: jest --testNamePattern="Virtual Network Gateway Connection"
  it("should deploy gateways and connections, validate idempotency, and cleanup", () => {
    const app = Testing.app();
    const stack = new VirtualNetworkGatewayConnectionExampleStack(
      app,
      "test-virtual-network-gateway-connection",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources (2 gateways + 2 connections)
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 7200000); // 120 minutes timeout (2 hours) for dual gateway provisioning
});
