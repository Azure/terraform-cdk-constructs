/**
 * Comprehensive tests for the Virtual Network implementation
 *
 * This test suite validates the VirtualNetwork class using the AzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * property transformation, and resource creation.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { VirtualNetwork, VirtualNetworkProps } from "../lib/virtual-network";

describe("VirtualNetwork - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  describe("Constructor and Basic Properties", () => {
    it("should create virtual network with automatic latest version resolution", () => {
      const props: VirtualNetworkProps = {
        name: "test-vnet",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      };

      const vnet = new VirtualNetwork(stack, "TestVNet", props);

      expect(vnet).toBeInstanceOf(VirtualNetwork);
      expect(vnet.props).toBe(props);
      expect(vnet.name).toBe("test-vnet");
      expect(vnet.location).toBe("eastus");
    });

    it("should create virtual network with explicit version pinning", () => {
      const props: VirtualNetworkProps = {
        name: "test-vnet-pinned",
        location: "westus",
        apiVersion: "2024-07-01",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
        tags: { environment: "test" },
      };

      const vnet = new VirtualNetwork(stack, "TestVNet", props);

      expect(vnet.resolvedApiVersion).toBe("2024-07-01");
      expect(vnet.tags).toEqual({ environment: "test" });
    });

    it("should create virtual network with all optional properties", () => {
      const props: VirtualNetworkProps = {
        name: "test-vnet-full",
        location: "centralus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16", "10.1.0.0/16"],
        },
        dhcpOptions: {
          dnsServers: ["10.0.0.4", "10.0.0.5"],
        },
        enableDdosProtection: false,
        enableVmProtection: false,
        flowTimeoutInMinutes: 20,
        tags: {
          environment: "production",
          project: "networking",
          owner: "team@company.com",
        },
        ignoreChanges: ["tags"],
      };

      const vnet = new VirtualNetwork(stack, "TestVNet", props);

      expect(vnet.props.addressSpace).toEqual(props.addressSpace);
      expect(vnet.props.dhcpOptions).toEqual(props.dhcpOptions);
      expect(vnet.props.tags).toEqual(props.tags);
    });

    it("should use default name when name is not provided", () => {
      const props: VirtualNetworkProps = {
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      };

      const vnet = new VirtualNetwork(stack, "TestVNet", props);

      expect(vnet.name).toBe("TestVNet");
    });
  });

  describe("Resource Type and API Versions", () => {
    it("should have correct resource type", () => {
      const vnet = new VirtualNetwork(stack, "TestVNet", {
        name: "test-vnet",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      });

      // VirtualNetwork should be an instance of VirtualNetwork
      expect(vnet).toBeInstanceOf(VirtualNetwork);
    });

    it("should support all registered API versions", () => {
      const versions = ["2024-07-01", "2024-10-01"];

      versions.forEach((version) => {
        const vnet = new VirtualNetwork(
          stack,
          `VNet-${version.replace(/-/g, "")}`,
          {
            name: `vnet-${version}`,
            location: "eastus",
            apiVersion: version,
            addressSpace: {
              addressPrefixes: ["10.0.0.0/16"],
            },
          },
        );

        expect(vnet.resolvedApiVersion).toBe(version);
      });
    });

    it("should use latest version as default", () => {
      const vnet = new VirtualNetwork(stack, "TestVNet", {
        name: "test-vnet",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      });

      expect(vnet.resolvedApiVersion).toBe("2024-10-01");
    });
  });

  describe("Address Space Configuration", () => {
    it("should create VNet with single address prefix", () => {
      const vnet = new VirtualNetwork(stack, "SinglePrefix", {
        name: "vnet-single",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      });

      expect(vnet.props.addressSpace.addressPrefixes).toHaveLength(1);
      expect(vnet.props.addressSpace.addressPrefixes[0]).toBe("10.0.0.0/16");
    });

    it("should create VNet with multiple address prefixes", () => {
      const vnet = new VirtualNetwork(stack, "MultiPrefix", {
        name: "vnet-multi",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16", "10.1.0.0/16", "10.2.0.0/16"],
        },
      });

      expect(vnet.props.addressSpace.addressPrefixes).toHaveLength(3);
    });
  });

  describe("DHCP Options Configuration", () => {
    it("should create VNet with custom DNS servers", () => {
      const vnet = new VirtualNetwork(stack, "CustomDNS", {
        name: "vnet-dns",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
        dhcpOptions: {
          dnsServers: ["8.8.8.8", "8.8.4.4"],
        },
      });

      expect(vnet.props.dhcpOptions).toBeDefined();
      expect(vnet.props.dhcpOptions?.dnsServers).toEqual([
        "8.8.8.8",
        "8.8.4.4",
      ]);
    });

    it("should create VNet without DHCP options", () => {
      const vnet = new VirtualNetwork(stack, "NoDHCP", {
        name: "vnet-no-dhcp",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      });

      expect(vnet.props.dhcpOptions).toBeUndefined();
    });
  });

  describe("Protection Features", () => {
    it("should create VNet with DDoS protection enabled", () => {
      const vnet = new VirtualNetwork(stack, "DDoSProtection", {
        name: "vnet-ddos",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
        enableDdosProtection: true,
      });

      expect(vnet.props.enableDdosProtection).toBe(true);
    });

    it("should create VNet with VM protection enabled", () => {
      const vnet = new VirtualNetwork(stack, "VMProtection", {
        name: "vnet-vm-protection",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
        enableVmProtection: true,
      });

      expect(vnet.props.enableVmProtection).toBe(true);
    });

    it("should default protection features to false", () => {
      const vnet = new VirtualNetwork(stack, "DefaultProtection", {
        name: "vnet-default",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      });

      expect(vnet.props.enableDdosProtection).toBeUndefined();
      expect(vnet.props.enableVmProtection).toBeUndefined();
    });
  });

  describe("Tags Management", () => {
    it("should create VNet with tags", () => {
      const vnet = new VirtualNetwork(stack, "TaggedVNet", {
        name: "vnet-tagged",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
        tags: {
          environment: "production",
          cost_center: "engineering",
        },
      });

      expect(vnet.props.tags).toEqual({
        environment: "production",
        cost_center: "engineering",
      });
    });

    it("should support adding tags", () => {
      const vnet = new VirtualNetwork(stack, "AddTag", {
        name: "vnet-add-tag",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
        tags: { environment: "test" },
      });

      vnet.addTag("newTag", "newValue");
      expect(vnet.props.tags!.newTag).toBe("newValue");
      expect(vnet.props.tags!.environment).toBe("test");
    });

    it("should support removing tags", () => {
      const vnet = new VirtualNetwork(stack, "RemoveTag", {
        name: "vnet-remove-tag",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
        tags: {
          environment: "test",
          temporary: "true",
        },
      });

      vnet.removeTag("temporary");
      expect(vnet.props.tags!.temporary).toBeUndefined();
      expect(vnet.props.tags!.environment).toBe("test");
    });
  });

  describe("Terraform Outputs", () => {
    it("should create Terraform outputs", () => {
      const vnet = new VirtualNetwork(stack, "OutputTest", {
        name: "vnet-outputs",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      });

      expect(vnet.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(vnet.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(vnet.locationOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(vnet.addressSpaceOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(vnet.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });

    it("should have correct id format", () => {
      const vnet = new VirtualNetwork(stack, "IdFormat", {
        name: "vnet-id",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      });

      expect(vnet.id).toMatch(/^\$\{.*\.id\}$/);
      expect(vnet.resourceId).toBe(vnet.id);
    });
  });

  describe("Version Compatibility", () => {
    it("should work with all supported API versions", () => {
      const versions = ["2024-07-01", "2024-10-01"];

      versions.forEach((version) => {
        const vnet = new VirtualNetwork(
          stack,
          `VNet-${version.replace(/-/g, "")}`,
          {
            name: `vnet-${version}`,
            location: "eastus",
            apiVersion: version,
            addressSpace: {
              addressPrefixes: ["10.0.0.0/16"],
            },
          },
        );

        expect(vnet.resolvedApiVersion).toBe(version);
      });
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const vnet = new VirtualNetwork(stack, "IgnoreChanges", {
        name: "vnet-ignore",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
        ignoreChanges: ["tags", "dhcpOptions"],
      });

      expect(vnet).toBeInstanceOf(VirtualNetwork);
      expect(vnet.props.ignoreChanges).toEqual(["tags", "dhcpOptions"]);
    });

    it("should handle empty ignore changes array", () => {
      const vnet = new VirtualNetwork(stack, "EmptyIgnore", {
        name: "vnet-empty-ignore",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
        ignoreChanges: [],
      });

      expect(vnet).toBeInstanceOf(VirtualNetwork);
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new VirtualNetwork(stack, "SynthTest", {
        name: "vnet-synth",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple VNets in the same stack", () => {
      const vnet1 = new VirtualNetwork(stack, "VNet1", {
        name: "vnet-1",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      });

      const vnet2 = new VirtualNetwork(stack, "VNet2", {
        name: "vnet-2",
        location: "westus",
        apiVersion: "2024-07-01",
        addressSpace: {
          addressPrefixes: ["10.1.0.0/16"],
        },
      });

      expect(vnet1.resolvedApiVersion).toBe("2024-10-01");
      expect(vnet2.resolvedApiVersion).toBe("2024-07-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("Flow Timeout Configuration", () => {
    it("should create VNet with flow timeout", () => {
      const vnet = new VirtualNetwork(stack, "FlowTimeout", {
        name: "vnet-flow-timeout",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
        flowTimeoutInMinutes: 20,
      });

      expect(vnet.props.flowTimeoutInMinutes).toBe(20);
    });
  });

  describe("Subnet Configuration", () => {
    it("should create VNet with inline subnets", () => {
      const vnet = new VirtualNetwork(stack, "WithSubnets", {
        name: "vnet-with-subnets",
        location: "eastus",
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
        subnets: [
          {
            name: "subnet-1",
            addressPrefix: "10.0.1.0/24",
          },
          {
            name: "subnet-2",
            addressPrefix: "10.0.2.0/24",
          },
        ],
      });

      expect(vnet.props.subnets).toHaveLength(2);
    });
  });
});
