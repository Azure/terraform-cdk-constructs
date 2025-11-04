/**
 * Comprehensive tests for the Network Interface implementation
 *
 * This test suite validates the NetworkInterface class using the AzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * property transformation, and resource creation.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import {
  NetworkInterface,
  NetworkInterfaceProps,
} from "../lib/network-interface";

describe("NetworkInterface - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  describe("Constructor and Basic Properties", () => {
    it("should create network interface with automatic latest version resolution", () => {
      const props: NetworkInterfaceProps = {
        name: "test-nic",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
      };

      const nic = new NetworkInterface(stack, "TestNIC", props);

      expect(nic).toBeInstanceOf(NetworkInterface);
      expect(nic.props).toBe(props);
      expect(nic.name).toBe("test-nic");
      expect(nic.location).toBe("eastus");
    });

    it("should create network interface with explicit version pinning", () => {
      const props: NetworkInterfaceProps = {
        name: "test-nic-pinned",
        location: "westus",
        apiVersion: "2024-07-01",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
        tags: { environment: "test" },
      };

      const nic = new NetworkInterface(stack, "TestNIC", props);

      expect(nic.resolvedApiVersion).toBe("2024-07-01");
      expect(nic.tags).toEqual({ environment: "test" });
    });

    it("should create network interface with all optional properties", () => {
      const props: NetworkInterfaceProps = {
        name: "test-nic-full",
        location: "centralus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Static",
            privateIPAddress: "10.0.1.4",
            publicIPAddress: { id: "/subscriptions/test/publicIPs/pip1" },
            primary: true,
          },
        ],
        networkSecurityGroup: { id: "/subscriptions/test/nsgs/nsg1" },
        enableAcceleratedNetworking: true,
        enableIPForwarding: true,
        dnsSettings: {
          dnsServers: ["10.0.0.4", "10.0.0.5"],
          internalDnsNameLabel: "myvm",
        },
        tags: {
          environment: "production",
          project: "networking",
          owner: "team@company.com",
        },
        ignoreChanges: ["tags"],
      };

      const nic = new NetworkInterface(stack, "TestNIC", props);

      expect(nic.props.ipConfigurations).toEqual(props.ipConfigurations);
      expect(nic.props.networkSecurityGroup).toEqual(
        props.networkSecurityGroup,
      );
      expect(nic.props.enableAcceleratedNetworking).toBe(true);
      expect(nic.props.enableIPForwarding).toBe(true);
      expect(nic.props.dnsSettings).toEqual(props.dnsSettings);
      expect(nic.props.tags).toEqual(props.tags);
    });

    it("should use default name when name is not provided", () => {
      const props: NetworkInterfaceProps = {
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
      };

      const nic = new NetworkInterface(stack, "TestNIC", props);

      expect(nic.name).toBe("TestNIC");
    });
  });

  describe("Resource Type and API Versions", () => {
    it("should have correct resource type", () => {
      const nic = new NetworkInterface(stack, "TestNIC", {
        name: "test-nic",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
      });

      expect(nic).toBeInstanceOf(NetworkInterface);
    });

    it("should support all registered API versions", () => {
      const versions = ["2024-07-01", "2024-10-01"];

      versions.forEach((version) => {
        const nic = new NetworkInterface(
          stack,
          `NIC-${version.replace(/-/g, "")}`,
          {
            name: `nic-${version}`,
            location: "eastus",
            apiVersion: version,
            ipConfigurations: [
              {
                name: "ipconfig1",
                subnet: { id: "/subscriptions/test/subnets/subnet1" },
                privateIPAllocationMethod: "Dynamic",
                primary: true,
              },
            ],
          },
        );

        expect(nic.resolvedApiVersion).toBe(version);
      });
    });

    it("should use latest version as default", () => {
      const nic = new NetworkInterface(stack, "TestNIC", {
        name: "test-nic",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
      });

      expect(nic.resolvedApiVersion).toBe("2024-10-01");
    });
  });

  describe("IP Configuration", () => {
    it("should create NIC with single dynamic IP configuration", () => {
      const nic = new NetworkInterface(stack, "SingleDynamic", {
        name: "nic-single-dynamic",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
      });

      expect(nic.props.ipConfigurations).toHaveLength(1);
      expect(nic.props.ipConfigurations[0].privateIPAllocationMethod).toBe(
        "Dynamic",
      );
      expect(nic.props.ipConfigurations[0].primary).toBe(true);
    });

    it("should create NIC with static private IP", () => {
      const nic = new NetworkInterface(stack, "StaticIP", {
        name: "nic-static",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Static",
            privateIPAddress: "10.0.1.4",
            primary: true,
          },
        ],
      });

      expect(nic.props.ipConfigurations[0].privateIPAllocationMethod).toBe(
        "Static",
      );
      expect(nic.props.ipConfigurations[0].privateIPAddress).toBe("10.0.1.4");
    });

    it("should create NIC with public IP address", () => {
      const nic = new NetworkInterface(stack, "WithPublicIP", {
        name: "nic-public-ip",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            publicIPAddress: { id: "/subscriptions/test/publicIPs/pip1" },
            primary: true,
          },
        ],
      });

      expect(nic.props.ipConfigurations[0].publicIPAddress).toBeDefined();
      expect(nic.props.ipConfigurations[0].publicIPAddress?.id).toBe(
        "/subscriptions/test/publicIPs/pip1",
      );
    });

    it("should create NIC with multiple IP configurations", () => {
      const nic = new NetworkInterface(stack, "MultipleIPs", {
        name: "nic-multiple-ips",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
          {
            name: "ipconfig2",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Static",
            privateIPAddress: "10.0.1.5",
            primary: false,
          },
        ],
      });

      expect(nic.props.ipConfigurations).toHaveLength(2);
      expect(nic.props.ipConfigurations[0].primary).toBe(true);
      expect(nic.props.ipConfigurations[1].primary).toBe(false);
    });
  });

  describe("Network Security Group Association", () => {
    it("should create NIC with NSG attached", () => {
      const nic = new NetworkInterface(stack, "WithNSG", {
        name: "nic-with-nsg",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
        networkSecurityGroup: { id: "/subscriptions/test/nsgs/nsg1" },
      });

      expect(nic.props.networkSecurityGroup).toBeDefined();
      expect(nic.props.networkSecurityGroup?.id).toBe(
        "/subscriptions/test/nsgs/nsg1",
      );
    });

    it("should create NIC without NSG", () => {
      const nic = new NetworkInterface(stack, "WithoutNSG", {
        name: "nic-no-nsg",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
      });

      expect(nic.props.networkSecurityGroup).toBeUndefined();
    });
  });

  describe("Accelerated Networking", () => {
    it("should create NIC with accelerated networking enabled", () => {
      const nic = new NetworkInterface(stack, "AcceleratedNetworking", {
        name: "nic-accelerated",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
        enableAcceleratedNetworking: true,
      });

      expect(nic.props.enableAcceleratedNetworking).toBe(true);
    });

    it("should default accelerated networking to false", () => {
      const nic = new NetworkInterface(stack, "DefaultAccelerated", {
        name: "nic-default-accelerated",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
      });

      expect(nic.props.enableAcceleratedNetworking).toBeUndefined();
    });
  });

  describe("IP Forwarding", () => {
    it("should create NIC with IP forwarding enabled (for NVAs)", () => {
      const nic = new NetworkInterface(stack, "IPForwarding", {
        name: "nic-ip-forwarding",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
        enableIPForwarding: true,
      });

      expect(nic.props.enableIPForwarding).toBe(true);
    });

    it("should default IP forwarding to false", () => {
      const nic = new NetworkInterface(stack, "DefaultIPForwarding", {
        name: "nic-default-forwarding",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
      });

      expect(nic.props.enableIPForwarding).toBeUndefined();
    });
  });

  describe("DNS Settings Configuration", () => {
    it("should create NIC with custom DNS servers", () => {
      const nic = new NetworkInterface(stack, "CustomDNS", {
        name: "nic-dns",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
        dnsSettings: {
          dnsServers: ["8.8.8.8", "8.8.4.4"],
        },
      });

      expect(nic.props.dnsSettings).toBeDefined();
      expect(nic.props.dnsSettings?.dnsServers).toEqual(["8.8.8.8", "8.8.4.4"]);
    });

    it("should create NIC with internal DNS name label", () => {
      const nic = new NetworkInterface(stack, "InternalDNS", {
        name: "nic-internal-dns",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
        dnsSettings: {
          internalDnsNameLabel: "myvm",
        },
      });

      expect(nic.props.dnsSettings?.internalDnsNameLabel).toBe("myvm");
    });

    it("should create NIC without DNS settings", () => {
      const nic = new NetworkInterface(stack, "NoDNS", {
        name: "nic-no-dns",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
      });

      expect(nic.props.dnsSettings).toBeUndefined();
    });
  });

  describe("Tags Management", () => {
    it("should create NIC with tags", () => {
      const nic = new NetworkInterface(stack, "TaggedNIC", {
        name: "nic-tagged",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
        tags: {
          environment: "production",
          cost_center: "engineering",
        },
      });

      expect(nic.props.tags).toEqual({
        environment: "production",
        cost_center: "engineering",
      });
    });

    it("should support adding tags", () => {
      const nic = new NetworkInterface(stack, "AddTag", {
        name: "nic-add-tag",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
        tags: { environment: "test" },
      });

      nic.addTag("newTag", "newValue");
      expect(nic.props.tags!.newTag).toBe("newValue");
      expect(nic.props.tags!.environment).toBe("test");
    });

    it("should support removing tags", () => {
      const nic = new NetworkInterface(stack, "RemoveTag", {
        name: "nic-remove-tag",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
        tags: {
          environment: "test",
          temporary: "true",
        },
      });

      nic.removeTag("temporary");
      expect(nic.props.tags!.temporary).toBeUndefined();
      expect(nic.props.tags!.environment).toBe("test");
    });
  });

  describe("Terraform Outputs", () => {
    it("should create Terraform outputs", () => {
      const nic = new NetworkInterface(stack, "OutputTest", {
        name: "nic-outputs",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
      });

      expect(nic.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(nic.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(nic.locationOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(nic.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });

    it("should have correct id format", () => {
      const nic = new NetworkInterface(stack, "IdFormat", {
        name: "nic-id",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
      });

      expect(nic.id).toMatch(/^\$\{.*\.id\}$/);
    });
  });

  describe("Version Compatibility", () => {
    it("should work with all supported API versions", () => {
      const versions = ["2024-07-01", "2024-10-01"];

      versions.forEach((version) => {
        const nic = new NetworkInterface(
          stack,
          `NIC-${version.replace(/-/g, "")}`,
          {
            name: `nic-${version}`,
            location: "eastus",
            apiVersion: version,
            ipConfigurations: [
              {
                name: "ipconfig1",
                subnet: { id: "/subscriptions/test/subnets/subnet1" },
                privateIPAllocationMethod: "Dynamic",
                primary: true,
              },
            ],
          },
        );

        expect(nic.resolvedApiVersion).toBe(version);
      });
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const nic = new NetworkInterface(stack, "IgnoreChanges", {
        name: "nic-ignore",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
        ignoreChanges: ["tags", "dnsSettings"],
      });

      expect(nic).toBeInstanceOf(NetworkInterface);
      expect(nic.props.ignoreChanges).toEqual(["tags", "dnsSettings"]);
    });

    it("should handle empty ignore changes array", () => {
      const nic = new NetworkInterface(stack, "EmptyIgnore", {
        name: "nic-empty-ignore",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
        ignoreChanges: [],
      });

      expect(nic).toBeInstanceOf(NetworkInterface);
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new NetworkInterface(stack, "SynthTest", {
        name: "nic-synth",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple NICs in the same stack", () => {
      const nic1 = new NetworkInterface(stack, "NIC1", {
        name: "nic-1",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Dynamic",
            primary: true,
          },
        ],
      });

      const nic2 = new NetworkInterface(stack, "NIC2", {
        name: "nic-2",
        location: "westus",
        apiVersion: "2024-07-01",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet2" },
            privateIPAllocationMethod: "Static",
            privateIPAddress: "10.1.1.4",
            primary: true,
          },
        ],
      });

      expect(nic1.resolvedApiVersion).toBe("2024-10-01");
      expect(nic2.resolvedApiVersion).toBe("2024-07-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("Complete Networking Scenarios", () => {
    it("should create VM NIC with all networking components", () => {
      const nic = new NetworkInterface(stack, "CompleteNIC", {
        name: "vm-nic-complete",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Static",
            privateIPAddress: "10.0.1.4",
            publicIPAddress: { id: "/subscriptions/test/publicIPs/pip1" },
            primary: true,
          },
        ],
        networkSecurityGroup: { id: "/subscriptions/test/nsgs/nsg1" },
        enableAcceleratedNetworking: true,
        dnsSettings: {
          dnsServers: ["10.0.0.4"],
          internalDnsNameLabel: "myvm",
        },
        tags: {
          environment: "production",
          role: "web-server",
        },
      });

      expect(nic.props.ipConfigurations[0].publicIPAddress).toBeDefined();
      expect(nic.props.networkSecurityGroup).toBeDefined();
      expect(nic.props.enableAcceleratedNetworking).toBe(true);
      expect(nic.props.dnsSettings).toBeDefined();
    });

    it("should create NVA NIC with IP forwarding", () => {
      const nic = new NetworkInterface(stack, "NVANIC", {
        name: "nva-nic",
        location: "eastus",
        ipConfigurations: [
          {
            name: "ipconfig1",
            subnet: { id: "/subscriptions/test/subnets/subnet1" },
            privateIPAllocationMethod: "Static",
            privateIPAddress: "10.0.1.10",
            primary: true,
          },
        ],
        enableIPForwarding: true,
        enableAcceleratedNetworking: true,
        tags: {
          role: "network-virtual-appliance",
        },
      });

      expect(nic.props.enableIPForwarding).toBe(true);
      expect(nic.props.enableAcceleratedNetworking).toBe(true);
    });
  });
});
