/**
 * Unit tests for Azure Bastion Host construct
 *
 * Tests cover:
 * - Resource type validation
 * - API version support (2024-07-01, 2024-10-01)
 * - Basic creation scenarios
 * - SKU configurations (Developer, Basic, Standard, Premium)
 * - IP configuration (subnet + public IP)
 * - Developer SKU virtual network attachment
 * - Scale units and feature flags
 * - Availability zones
 * - Tags management
 * - Output properties
 * - Ignore changes lifecycle rules
 */

import { Testing } from "cdktn";
import * as cdktn from "cdktn";
import { BastionHost, BastionHostProps } from "../lib/bastion-host";

describe("BastionHost", () => {
  let app: cdktn.App;
  let stack: cdktn.TerraformStack;

  const standardIpConfig = {
    subnetId:
      "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet/subnets/AzureBastionSubnet",
    publicIpAddressId:
      "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/publicIPAddresses/bastion-pip",
  };

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktn.TerraformStack(app, "TestStack");
  });

  describe("Resource Type", () => {
    it("should have correct resource type", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
      });

      expect(bastion).toBeInstanceOf(BastionHost);
    });
  });

  describe("API Version Support", () => {
    it("should support API version 2024-07-01", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        apiVersion: "2024-07-01",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
      });

      expect(bastion.resolvedApiVersion).toBe("2024-07-01");
    });

    it("should support API version 2024-10-01", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        apiVersion: "2024-10-01",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
      });

      expect(bastion.resolvedApiVersion).toBe("2024-10-01");
    });

    it("should resolve to the latest version by default", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
      });

      expect(bastion.resolvedApiVersion).toBe("2024-10-01");
    });
  });

  describe("SKU Configurations", () => {
    it("should support the Standard SKU", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
      });

      expect(bastion.props.sku?.name).toBe("Standard");
    });

    it("should support the Basic SKU", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Basic" },
        ipConfiguration: standardIpConfig,
      });

      expect(bastion.props.sku?.name).toBe("Basic");
    });

    it("should support the Premium SKU with session recording", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Premium" },
        ipConfiguration: standardIpConfig,
        enableSessionRecording: true,
      });

      expect(bastion.props.sku?.name).toBe("Premium");
      expect(bastion.props.enableSessionRecording).toBe(true);
    });
  });

  describe("IP Configuration", () => {
    it("should accept an IP configuration referencing subnet and public IP", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
      });

      expect(bastion.props.ipConfiguration?.subnetId).toBe(
        standardIpConfig.subnetId,
      );
      expect(bastion.props.ipConfiguration?.publicIpAddressId).toBe(
        standardIpConfig.publicIpAddressId,
      );
    });

    it("should synthesize the ipConfigurations body block", () => {
      new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: { ...standardIpConfig, name: "myIpConf" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("ipConfigurations");
      expect(synthesized).toContain("myIpConf");
      expect(synthesized).toContain("AzureBastionSubnet");
    });

    it("should default the ip configuration name to IpConf", () => {
      new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("IpConf");
    });
  });

  describe("Developer SKU", () => {
    it("should attach to a virtual network instead of an IP configuration", () => {
      const vnetId =
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Network/virtualNetworks/vnet";
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Developer" },
        virtualNetworkId: vnetId,
      });

      expect(bastion.props.virtualNetworkId).toBe(vnetId);

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("virtualNetwork");
    });
  });

  describe("Scale Units and Feature Flags", () => {
    it("should accept scale units", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
        scaleUnits: 4,
      });

      expect(bastion.props.scaleUnits).toBe(4);
    });

    it("should accept all Standard feature flags", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
        enableTunneling: true,
        enableIpConnect: true,
        enableShareableLink: true,
        enableKerberos: true,
        disableCopyPaste: true,
      });

      expect(bastion.props.enableTunneling).toBe(true);
      expect(bastion.props.enableIpConnect).toBe(true);
      expect(bastion.props.enableShareableLink).toBe(true);
      expect(bastion.props.enableKerberos).toBe(true);
      expect(bastion.props.disableCopyPaste).toBe(true);
    });
  });

  describe("Availability Zones", () => {
    it("should accept availability zones", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
        zones: ["1", "2", "3"],
      });

      expect(bastion.props.zones).toEqual(["1", "2", "3"]);
    });
  });

  describe("Tags Management", () => {
    it("should add and remove tags", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
        tags: { env: "prod" },
      });

      bastion.addTag("team", "platform");
      expect(bastion.props.tags?.team).toBe("platform");

      bastion.removeTag("env");
      expect(bastion.props.tags?.env).toBeUndefined();
    });
  });

  describe("Output Properties", () => {
    it("should expose id, name, location, and tags outputs", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
      });

      expect(bastion.id).toBeDefined();
      expect(bastion.idOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(bastion.nameOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(bastion.locationOutput).toBeInstanceOf(cdktn.TerraformOutput);
      expect(bastion.tagsOutput).toBeInstanceOf(cdktn.TerraformOutput);
    });

    it("should have a correct id format and resourceId alias", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
      });

      expect(bastion.id).toMatch(/^\$\{.*\.id\}$/);
      expect(bastion.resourceId).toBe(bastion.id);
    });

    it("should expose a dnsName interpolation", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
      });

      expect(bastion.dnsName).toMatch(/dnsName/);
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
        ignoreChanges: ["tags"],
      });

      expect(bastion.props.ignoreChanges).toEqual(["tags"]);
    });

    it("should handle an empty ignore changes array", () => {
      const bastion = new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
        ignoreChanges: [],
      });

      expect(bastion).toBeInstanceOf(BastionHost);
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new BastionHost(stack, "test-bastion", {
        name: "test-bastion",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple Bastion hosts in the same stack", () => {
      const b1: BastionHostProps = {
        name: "bastion-1",
        location: "eastus",
        sku: { name: "Standard" },
        ipConfiguration: standardIpConfig,
      };
      const b2: BastionHostProps = {
        name: "bastion-2",
        location: "westus",
        apiVersion: "2024-07-01",
        sku: { name: "Basic" },
        ipConfiguration: standardIpConfig,
      };

      const bastion1 = new BastionHost(stack, "Bastion1", b1);
      const bastion2 = new BastionHost(stack, "Bastion2", b2);

      expect(bastion1.resolvedApiVersion).toBe("2024-10-01");
      expect(bastion2.resolvedApiVersion).toBe("2024-07-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });
});
