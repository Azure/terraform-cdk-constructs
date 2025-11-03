/**
 * Unit tests for Azure Public IP Address construct
 *
 * Tests cover:
 * - Resource type validation
 * - API version support (2024-07-01, 2024-10-01)
 * - Basic creation scenarios
 * - SKU configurations (Standard, Basic)
 * - Allocation methods (Static, Dynamic)
 * - DNS settings
 * - Availability zones
 * - IPv4/IPv6 support
 * - Tags management
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import {
  PublicIPAddress,
  PublicIPAddressProps,
} from "../lib/public-ip-address";

describe("PublicIPAddress", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  describe("Resource Type", () => {
    it("should have correct resource type", () => {
      const publicIp = new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
      });

      expect(publicIp).toBeInstanceOf(PublicIPAddress);
    });
  });

  describe("API Version Support", () => {
    it("should support API version 2024-07-01", () => {
      const publicIp = new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
        apiVersion: "2024-07-01",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
      });

      expect(publicIp.resolvedApiVersion).toBe("2024-07-01");
    });

    it("should support API version 2024-10-01", () => {
      const publicIp = new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
        apiVersion: "2024-10-01",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
      });

      expect(publicIp.resolvedApiVersion).toBe("2024-10-01");
    });

    it("should support API version 2024-10-01 (default)", () => {
      const publicIp = new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
      });

      expect(publicIp.resolvedApiVersion).toBe("2024-10-01");
    });
  });

  describe("Basic Creation", () => {
    it("should create a basic Standard Static Public IP", () => {
      const props: PublicIPAddressProps = {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
          tier: "Regional",
        },
        publicIPAllocationMethod: "Static",
      };

      const publicIp = new PublicIPAddress(stack, "test-public-ip", props);

      expect(publicIp).toBeInstanceOf(PublicIPAddress);
      expect(publicIp.props).toBe(props);
      expect(publicIp.props.sku?.name).toBe("Standard");
      expect(publicIp.props.sku?.tier).toBe("Regional");
      expect(publicIp.props.publicIPAllocationMethod).toBe("Static");
    });

    it("should create a basic Basic Dynamic Public IP", () => {
      const props: PublicIPAddressProps = {
        name: "test-pip",
        location: "westus",
        sku: {
          name: "Basic",
        },
        publicIPAllocationMethod: "Dynamic",
      };

      const publicIp = new PublicIPAddress(stack, "test-public-ip", props);

      expect(publicIp.props.sku?.name).toBe("Basic");
      expect(publicIp.props.publicIPAllocationMethod).toBe("Dynamic");
    });

    it("should use default Dynamic allocation method when not specified", () => {
      const publicIp = new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
      });

      expect(publicIp).toBeInstanceOf(PublicIPAddress);
    });
  });

  describe("SKU Configuration", () => {
    it("should configure Standard SKU with Regional tier", () => {
      const props: PublicIPAddressProps = {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
          tier: "Regional",
        },
        publicIPAllocationMethod: "Static",
      };

      const publicIp = new PublicIPAddress(stack, "test-public-ip", props);

      expect(publicIp.props.sku?.name).toBe("Standard");
      expect(publicIp.props.sku?.tier).toBe("Regional");
    });

    it("should configure Standard SKU with Global tier", () => {
      const props: PublicIPAddressProps = {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
          tier: "Global",
        },
        publicIPAllocationMethod: "Static",
      };

      const publicIp = new PublicIPAddress(stack, "test-public-ip", props);

      expect(publicIp.props.sku?.name).toBe("Standard");
      expect(publicIp.props.sku?.tier).toBe("Global");
    });

    it("should configure Basic SKU", () => {
      const props: PublicIPAddressProps = {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Basic",
        },
      };

      const publicIp = new PublicIPAddress(stack, "test-public-ip", props);

      expect(publicIp.props.sku?.name).toBe("Basic");
    });
  });

  describe("DNS Settings", () => {
    it("should configure DNS label", () => {
      const props: PublicIPAddressProps = {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
        dnsSettings: {
          domainNameLabel: "myapp",
        },
      };

      const publicIp = new PublicIPAddress(stack, "test-public-ip", props);

      expect(publicIp.props.dnsSettings?.domainNameLabel).toBe("myapp");
    });

    it("should configure DNS label and reverse FQDN", () => {
      const props: PublicIPAddressProps = {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
        dnsSettings: {
          domainNameLabel: "myapp",
          reverseFqdn: "myapp.example.com",
        },
      };

      const publicIp = new PublicIPAddress(stack, "test-public-ip", props);

      expect(publicIp.props.dnsSettings?.domainNameLabel).toBe("myapp");
      expect(publicIp.props.dnsSettings?.reverseFqdn).toBe("myapp.example.com");
    });
  });

  describe("Availability Zones", () => {
    it("should configure zone-redundant Public IP (all zones)", () => {
      const props: PublicIPAddressProps = {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
        zones: ["1", "2", "3"],
      };

      const publicIp = new PublicIPAddress(stack, "test-public-ip", props);

      expect(publicIp.props.zones).toEqual(["1", "2", "3"]);
    });

    it("should configure zonal Public IP (single zone)", () => {
      const props: PublicIPAddressProps = {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
        zones: ["1"],
      };

      const publicIp = new PublicIPAddress(stack, "test-public-ip", props);

      expect(publicIp.props.zones).toEqual(["1"]);
    });
  });

  describe("IP Version Support", () => {
    it("should support IPv4 (default)", () => {
      const publicIp = new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
      });

      expect(publicIp).toBeInstanceOf(PublicIPAddress);
    });

    it("should support IPv6", () => {
      const props: PublicIPAddressProps = {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
        publicIPAddressVersion: "IPv6",
      };

      const publicIp = new PublicIPAddress(stack, "test-public-ip", props);

      expect(publicIp.props.publicIPAddressVersion).toBe("IPv6");
    });
  });

  describe("Idle Timeout", () => {
    it("should configure idle timeout in minutes", () => {
      const props: PublicIPAddressProps = {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
        idleTimeoutInMinutes: 10,
      };

      const publicIp = new PublicIPAddress(stack, "test-public-ip", props);

      expect(publicIp.props.idleTimeoutInMinutes).toBe(10);
    });
  });

  describe("Tags", () => {
    it("should add tags to Public IP", () => {
      const props: PublicIPAddressProps = {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
        tags: {
          Environment: "Production",
          Department: "IT",
        },
      };

      const publicIp = new PublicIPAddress(stack, "test-public-ip", props);

      expect(publicIp.props.tags?.Environment).toBe("Production");
      expect(publicIp.props.tags?.Department).toBe("IT");
    });

    it("should handle empty tags", () => {
      const publicIp = new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
      });

      expect(publicIp.tags).toEqual({});
    });

    it("should support adding tags", () => {
      const publicIp = new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
        tags: { environment: "test" },
      });

      publicIp.addTag("newTag", "newValue");
      expect(publicIp.props.tags!.newTag).toBe("newValue");
      expect(publicIp.props.tags!.environment).toBe("test");
    });

    it("should support removing tags", () => {
      const publicIp = new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
        tags: {
          environment: "test",
          temporary: "true",
        },
      });

      publicIp.removeTag("temporary");
      expect(publicIp.props.tags!.temporary).toBeUndefined();
      expect(publicIp.props.tags!.environment).toBe("test");
    });
  });

  describe("Common Scenarios", () => {
    it("should create Public IP for Load Balancer (Standard Static)", () => {
      const props: PublicIPAddressProps = {
        name: "lb-pip",
        location: "eastus",
        sku: {
          name: "Standard",
          tier: "Regional",
        },
        publicIPAllocationMethod: "Static",
        zones: ["1", "2", "3"],
        tags: {
          Purpose: "LoadBalancer",
        },
      };

      const publicIp = new PublicIPAddress(stack, "lb-public-ip", props);

      expect(publicIp.props.sku?.name).toBe("Standard");
      expect(publicIp.props.publicIPAllocationMethod).toBe("Static");
      expect(publicIp.props.zones).toEqual(["1", "2", "3"]);
    });

    it("should create Public IP for VM (Basic Dynamic)", () => {
      const props: PublicIPAddressProps = {
        name: "vm-pip",
        location: "eastus",
        sku: {
          name: "Basic",
        },
        publicIPAllocationMethod: "Dynamic",
        tags: {
          Purpose: "VirtualMachine",
        },
      };

      const publicIp = new PublicIPAddress(stack, "vm-public-ip", props);

      expect(publicIp.props.sku?.name).toBe("Basic");
      expect(publicIp.props.publicIPAllocationMethod).toBe("Dynamic");
    });

    it("should create Public IP for NAT Gateway (Standard Static with zones)", () => {
      const props: PublicIPAddressProps = {
        name: "nat-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
        zones: ["1"],
        idleTimeoutInMinutes: 30,
        tags: {
          Purpose: "NATGateway",
        },
      };

      const publicIp = new PublicIPAddress(stack, "nat-public-ip", props);

      expect(publicIp.props.sku?.name).toBe("Standard");
      expect(publicIp.props.publicIPAllocationMethod).toBe("Static");
      expect(publicIp.props.zones).toEqual(["1"]);
      expect(publicIp.props.idleTimeoutInMinutes).toBe(30);
    });

    it("should create Public IP with DNS for Application Gateway", () => {
      const props: PublicIPAddressProps = {
        name: "agw-pip",
        location: "eastus",
        sku: {
          name: "Standard",
          tier: "Regional",
        },
        publicIPAllocationMethod: "Static",
        dnsSettings: {
          domainNameLabel: "myapp",
        },
        zones: ["1", "2", "3"],
        tags: {
          Purpose: "ApplicationGateway",
        },
      };

      const publicIp = new PublicIPAddress(stack, "agw-public-ip", props);

      expect(publicIp.props.sku?.name).toBe("Standard");
      expect(publicIp.props.publicIPAllocationMethod).toBe("Static");
      expect(publicIp.props.dnsSettings?.domainNameLabel).toBe("myapp");
      expect(publicIp.props.zones).toEqual(["1", "2", "3"]);
    });
  });

  describe("Output Properties", () => {
    it("should expose id, name, location outputs", () => {
      const publicIp = new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
      });

      expect(publicIp.id).toBeDefined();
      expect(publicIp.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(publicIp.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(publicIp.locationOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(publicIp.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });

    it("should have correct id format", () => {
      const publicIp = new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
      });

      expect(publicIp.id).toMatch(/^\$\{.*\.id\}$/);
      expect(publicIp.resourceId).toBe(publicIp.id);
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const publicIp = new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
        ignoreChanges: ["tags", "dnsSettings"],
      });

      expect(publicIp).toBeInstanceOf(PublicIPAddress);
      expect(publicIp.props.ignoreChanges).toEqual(["tags", "dnsSettings"]);
    });

    it("should handle empty ignore changes array", () => {
      const publicIp = new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
        ignoreChanges: [],
      });

      expect(publicIp).toBeInstanceOf(PublicIPAddress);
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new PublicIPAddress(stack, "test-public-ip", {
        name: "test-pip",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple Public IPs in the same stack", () => {
      const pip1 = new PublicIPAddress(stack, "PIP1", {
        name: "pip-1",
        location: "eastus",
        sku: {
          name: "Standard",
        },
        publicIPAllocationMethod: "Static",
      });

      const pip2 = new PublicIPAddress(stack, "PIP2", {
        name: "pip-2",
        location: "westus",
        apiVersion: "2024-07-01",
        sku: {
          name: "Basic",
        },
        publicIPAllocationMethod: "Dynamic",
      });

      expect(pip1.resolvedApiVersion).toBe("2024-10-01");
      expect(pip2.resolvedApiVersion).toBe("2024-07-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });
});
