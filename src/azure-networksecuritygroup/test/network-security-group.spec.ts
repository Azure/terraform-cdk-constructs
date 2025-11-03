/**
 * Comprehensive tests for the Network Security Group implementation
 *
 * This test suite validates the NetworkSecurityGroup class using the AzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * security rules configuration, and resource creation.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import {
  NetworkSecurityGroup,
  NetworkSecurityGroupProps,
} from "../lib/network-security-group";

describe("NetworkSecurityGroup - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  describe("Constructor and Basic Properties", () => {
    it("should create network security group with automatic latest version resolution", () => {
      const props: NetworkSecurityGroupProps = {
        name: "test-nsg",
        location: "eastus",
      };

      const nsg = new NetworkSecurityGroup(stack, "TestNSG", props);

      expect(nsg).toBeInstanceOf(NetworkSecurityGroup);
      expect(nsg.props).toBe(props);
      expect(nsg.name).toBe("test-nsg");
      expect(nsg.location).toBe("eastus");
    });

    it("should create network security group with explicit version pinning", () => {
      const props: NetworkSecurityGroupProps = {
        name: "test-nsg-pinned",
        location: "westus",
        apiVersion: "2024-07-01",
        tags: { environment: "test" },
      };

      const nsg = new NetworkSecurityGroup(stack, "TestNSG", props);

      expect(nsg.resolvedApiVersion).toBe("2024-07-01");
      expect(nsg.tags).toEqual({ environment: "test" });
    });

    it("should use default name when name is not provided", () => {
      const props: NetworkSecurityGroupProps = {
        location: "eastus",
      };

      const nsg = new NetworkSecurityGroup(stack, "TestNSG", props);

      expect(nsg.name).toBe("TestNSG");
    });
  });

  describe("Resource Type and API Versions", () => {
    it("should have correct resource type", () => {
      const nsg = new NetworkSecurityGroup(stack, "TestNSG", {
        name: "test-nsg",
        location: "eastus",
      });

      expect(nsg).toBeInstanceOf(NetworkSecurityGroup);
    });

    it("should support all registered API versions", () => {
      const versions = ["2024-07-01", "2024-10-01"];

      versions.forEach((version) => {
        const nsg = new NetworkSecurityGroup(
          stack,
          `NSG-${version.replace(/-/g, "")}`,
          {
            name: `nsg-${version}`,
            location: "eastus",
            apiVersion: version,
          },
        );

        expect(nsg.resolvedApiVersion).toBe(version);
      });
    });

    it("should use latest version as default", () => {
      const nsg = new NetworkSecurityGroup(stack, "TestNSG", {
        name: "test-nsg",
        location: "eastus",
      });

      expect(nsg.resolvedApiVersion).toBe("2024-10-01");
    });
  });

  describe("Security Rules - SSH Access", () => {
    it("should create NSG with SSH allow rule", () => {
      const nsg = new NetworkSecurityGroup(stack, "SSHRule", {
        name: "nsg-ssh",
        location: "eastus",
        securityRules: [
          {
            name: "allow-ssh",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "22",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 100,
              direction: "Inbound",
              description: "Allow SSH access",
            },
          },
        ],
      });

      expect(nsg.props.securityRules).toHaveLength(1);
      expect(nsg.props.securityRules![0].name).toBe("allow-ssh");
      expect(nsg.props.securityRules![0].properties.priority).toBe(100);
      expect(nsg.props.securityRules![0].properties.access).toBe("Allow");
    });

    it("should create NSG with SSH rule from specific IP", () => {
      const nsg = new NetworkSecurityGroup(stack, "SSHSpecificIP", {
        name: "nsg-ssh-specific",
        location: "eastus",
        securityRules: [
          {
            name: "allow-ssh-from-office",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "22",
              sourceAddressPrefix: "203.0.113.0/24",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 100,
              direction: "Inbound",
              description: "Allow SSH from office IP range",
            },
          },
        ],
      });

      expect(nsg.props.securityRules![0].properties.sourceAddressPrefix).toBe(
        "203.0.113.0/24",
      );
    });
  });

  describe("Security Rules - HTTP/HTTPS Access", () => {
    it("should create NSG with HTTP and HTTPS allow rules", () => {
      const nsg = new NetworkSecurityGroup(stack, "WebRules", {
        name: "nsg-web",
        location: "eastus",
        securityRules: [
          {
            name: "allow-http",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "80",
              sourceAddressPrefix: "Internet",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 100,
              direction: "Inbound",
              description: "Allow HTTP from Internet",
            },
          },
          {
            name: "allow-https",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "443",
              sourceAddressPrefix: "Internet",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 110,
              direction: "Inbound",
              description: "Allow HTTPS from Internet",
            },
          },
        ],
      });

      expect(nsg.props.securityRules).toHaveLength(2);
      expect(nsg.props.securityRules![0].properties.destinationPortRange).toBe(
        "80",
      );
      expect(nsg.props.securityRules![1].properties.destinationPortRange).toBe(
        "443",
      );
    });

    it("should create NSG with multiple port ranges", () => {
      const nsg = new NetworkSecurityGroup(stack, "MultiPort", {
        name: "nsg-multiport",
        location: "eastus",
        securityRules: [
          {
            name: "allow-web-ports",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRanges: ["80", "443", "8080"],
              sourceAddressPrefix: "Internet",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 100,
              direction: "Inbound",
            },
          },
        ],
      });

      expect(
        nsg.props.securityRules![0].properties.destinationPortRanges,
      ).toEqual(["80", "443", "8080"]);
    });
  });

  describe("Security Rules - Deny Rules", () => {
    it("should create NSG with deny all inbound rule", () => {
      const nsg = new NetworkSecurityGroup(stack, "DenyAll", {
        name: "nsg-deny-all",
        location: "eastus",
        securityRules: [
          {
            name: "deny-all-inbound",
            properties: {
              protocol: "*",
              sourcePortRange: "*",
              destinationPortRange: "*",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Deny",
              priority: 4096,
              direction: "Inbound",
              description: "Deny all inbound traffic",
            },
          },
        ],
      });

      expect(nsg.props.securityRules![0].properties.access).toBe("Deny");
      expect(nsg.props.securityRules![0].properties.priority).toBe(4096);
    });

    it("should create NSG with RDP deny rule", () => {
      const nsg = new NetworkSecurityGroup(stack, "DenyRDP", {
        name: "nsg-deny-rdp",
        location: "eastus",
        securityRules: [
          {
            name: "deny-rdp",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "3389",
              sourceAddressPrefix: "Internet",
              destinationAddressPrefix: "*",
              access: "Deny",
              priority: 200,
              direction: "Inbound",
              description: "Block RDP from Internet",
            },
          },
        ],
      });

      expect(nsg.props.securityRules![0].properties.access).toBe("Deny");
      expect(nsg.props.securityRules![0].properties.destinationPortRange).toBe(
        "3389",
      );
    });
  });

  describe("Security Rules - Priority Validation", () => {
    it("should create NSG with valid priority range (100-4096)", () => {
      const nsg = new NetworkSecurityGroup(stack, "ValidPriority", {
        name: "nsg-priority",
        location: "eastus",
        securityRules: [
          {
            name: "priority-100",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "80",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 100,
              direction: "Inbound",
            },
          },
          {
            name: "priority-4096",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "443",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 4096,
              direction: "Inbound",
            },
          },
        ],
      });

      expect(nsg.props.securityRules![0].properties.priority).toBe(100);
      expect(nsg.props.securityRules![1].properties.priority).toBe(4096);
    });

    it("should create NSG with multiple rules with different priorities", () => {
      const nsg = new NetworkSecurityGroup(stack, "MultiPriority", {
        name: "nsg-multi-priority",
        location: "eastus",
        securityRules: [
          {
            name: "high-priority",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "22",
              sourceAddressPrefix: "10.0.0.0/24",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 100,
              direction: "Inbound",
            },
          },
          {
            name: "medium-priority",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "80",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 200,
              direction: "Inbound",
            },
          },
          {
            name: "low-priority",
            properties: {
              protocol: "*",
              sourcePortRange: "*",
              destinationPortRange: "*",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Deny",
              priority: 4000,
              direction: "Inbound",
            },
          },
        ],
      });

      expect(nsg.props.securityRules).toHaveLength(3);
      expect(nsg.props.securityRules![0].properties.priority).toBe(100);
      expect(nsg.props.securityRules![1].properties.priority).toBe(200);
      expect(nsg.props.securityRules![2].properties.priority).toBe(4000);
    });
  });

  describe("Security Rules - Protocol Types", () => {
    it("should create NSG with TCP protocol", () => {
      const nsg = new NetworkSecurityGroup(stack, "TCPProtocol", {
        name: "nsg-tcp",
        location: "eastus",
        securityRules: [
          {
            name: "tcp-rule",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "80",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 100,
              direction: "Inbound",
            },
          },
        ],
      });

      expect(nsg.props.securityRules![0].properties.protocol).toBe("Tcp");
    });

    it("should create NSG with UDP protocol", () => {
      const nsg = new NetworkSecurityGroup(stack, "UDPProtocol", {
        name: "nsg-udp",
        location: "eastus",
        securityRules: [
          {
            name: "udp-rule",
            properties: {
              protocol: "Udp",
              sourcePortRange: "*",
              destinationPortRange: "53",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 100,
              direction: "Inbound",
              description: "Allow DNS queries",
            },
          },
        ],
      });

      expect(nsg.props.securityRules![0].properties.protocol).toBe("Udp");
    });

    it("should create NSG with ICMP protocol", () => {
      const nsg = new NetworkSecurityGroup(stack, "ICMPProtocol", {
        name: "nsg-icmp",
        location: "eastus",
        securityRules: [
          {
            name: "icmp-rule",
            properties: {
              protocol: "Icmp",
              sourcePortRange: "*",
              destinationPortRange: "*",
              sourceAddressPrefix: "10.0.0.0/16",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 100,
              direction: "Inbound",
              description: "Allow ping from VNet",
            },
          },
        ],
      });

      expect(nsg.props.securityRules![0].properties.protocol).toBe("Icmp");
    });

    it("should create NSG with any protocol", () => {
      const nsg = new NetworkSecurityGroup(stack, "AnyProtocol", {
        name: "nsg-any",
        location: "eastus",
        securityRules: [
          {
            name: "any-protocol",
            properties: {
              protocol: "*",
              sourcePortRange: "*",
              destinationPortRange: "*",
              sourceAddressPrefix: "10.0.0.0/8",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 100,
              direction: "Inbound",
            },
          },
        ],
      });

      expect(nsg.props.securityRules![0].properties.protocol).toBe("*");
    });
  });

  describe("Security Rules - Direction", () => {
    it("should create NSG with inbound rules", () => {
      const nsg = new NetworkSecurityGroup(stack, "InboundRules", {
        name: "nsg-inbound",
        location: "eastus",
        securityRules: [
          {
            name: "inbound-rule",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "80",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 100,
              direction: "Inbound",
            },
          },
        ],
      });

      expect(nsg.props.securityRules![0].properties.direction).toBe("Inbound");
    });

    it("should create NSG with outbound rules", () => {
      const nsg = new NetworkSecurityGroup(stack, "OutboundRules", {
        name: "nsg-outbound",
        location: "eastus",
        securityRules: [
          {
            name: "outbound-rule",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "443",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "Internet",
              access: "Allow",
              priority: 100,
              direction: "Outbound",
              description: "Allow HTTPS to Internet",
            },
          },
        ],
      });

      expect(nsg.props.securityRules![0].properties.direction).toBe("Outbound");
    });

    it("should create NSG with both inbound and outbound rules", () => {
      const nsg = new NetworkSecurityGroup(stack, "BothDirections", {
        name: "nsg-both",
        location: "eastus",
        securityRules: [
          {
            name: "inbound-web",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "80",
              sourceAddressPrefix: "Internet",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 100,
              direction: "Inbound",
            },
          },
          {
            name: "outbound-https",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "443",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "Internet",
              access: "Allow",
              priority: 100,
              direction: "Outbound",
            },
          },
        ],
      });

      expect(nsg.props.securityRules).toHaveLength(2);
      expect(nsg.props.securityRules![0].properties.direction).toBe("Inbound");
      expect(nsg.props.securityRules![1].properties.direction).toBe("Outbound");
    });
  });

  describe("Tags Management", () => {
    it("should create NSG with tags", () => {
      const nsg = new NetworkSecurityGroup(stack, "TaggedNSG", {
        name: "nsg-tagged",
        location: "eastus",
        tags: {
          environment: "production",
          cost_center: "security",
        },
      });

      expect(nsg.props.tags).toEqual({
        environment: "production",
        cost_center: "security",
      });
    });

    it("should support adding tags", () => {
      const nsg = new NetworkSecurityGroup(stack, "AddTag", {
        name: "nsg-add-tag",
        location: "eastus",
        tags: { environment: "test" },
      });

      nsg.addTag("newTag", "newValue");
      expect(nsg.props.tags!.newTag).toBe("newValue");
      expect(nsg.props.tags!.environment).toBe("test");
    });

    it("should support removing tags", () => {
      const nsg = new NetworkSecurityGroup(stack, "RemoveTag", {
        name: "nsg-remove-tag",
        location: "eastus",
        tags: {
          environment: "test",
          temporary: "true",
        },
      });

      nsg.removeTag("temporary");
      expect(nsg.props.tags!.temporary).toBeUndefined();
      expect(nsg.props.tags!.environment).toBe("test");
    });
  });

  describe("Terraform Outputs", () => {
    it("should create Terraform outputs", () => {
      const nsg = new NetworkSecurityGroup(stack, "OutputTest", {
        name: "nsg-outputs",
        location: "eastus",
      });

      expect(nsg.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(nsg.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(nsg.locationOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(nsg.securityRulesOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(nsg.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });

    it("should have correct id format", () => {
      const nsg = new NetworkSecurityGroup(stack, "IdFormat", {
        name: "nsg-id",
        location: "eastus",
      });

      expect(nsg.id).toMatch(/^\$\{.*\.id\}$/);
      expect(nsg.resourceId).toBe(nsg.id);
    });
  });

  describe("Flush Connection Configuration", () => {
    it("should create NSG with flush connection enabled", () => {
      const nsg = new NetworkSecurityGroup(stack, "FlushConnection", {
        name: "nsg-flush",
        location: "eastus",
        flushConnection: true,
      });

      expect(nsg.props.flushConnection).toBe(true);
    });

    it("should default flush connection to false", () => {
      const nsg = new NetworkSecurityGroup(stack, "DefaultFlush", {
        name: "nsg-default-flush",
        location: "eastus",
      });

      expect(nsg.props.flushConnection).toBeUndefined();
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const nsg = new NetworkSecurityGroup(stack, "IgnoreChanges", {
        name: "nsg-ignore",
        location: "eastus",
        ignoreChanges: ["tags", "securityRules"],
      });

      expect(nsg).toBeInstanceOf(NetworkSecurityGroup);
      expect(nsg.props.ignoreChanges).toEqual(["tags", "securityRules"]);
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new NetworkSecurityGroup(stack, "SynthTest", {
        name: "nsg-synth",
        location: "eastus",
        tags: { test: "synthesis" },
        securityRules: [
          {
            name: "test-rule",
            properties: {
              protocol: "Tcp",
              sourcePortRange: "*",
              destinationPortRange: "80",
              sourceAddressPrefix: "*",
              destinationAddressPrefix: "*",
              access: "Allow",
              priority: 100,
              direction: "Inbound",
            },
          },
        ],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple NSGs in the same stack", () => {
      const nsg1 = new NetworkSecurityGroup(stack, "NSG1", {
        name: "nsg-1",
        location: "eastus",
      });

      const nsg2 = new NetworkSecurityGroup(stack, "NSG2", {
        name: "nsg-2",
        location: "westus",
        apiVersion: "2024-07-01",
      });

      expect(nsg1.resolvedApiVersion).toBe("2024-10-01");
      expect(nsg2.resolvedApiVersion).toBe("2024-07-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("Version Compatibility", () => {
    it("should work with all supported API versions", () => {
      const versions = ["2024-07-01", "2024-10-01"];

      versions.forEach((version) => {
        const nsg = new NetworkSecurityGroup(
          stack,
          `NSG-${version.replace(/-/g, "")}`,
          {
            name: `nsg-${version}`,
            location: "eastus",
            apiVersion: version,
          },
        );

        expect(nsg.resolvedApiVersion).toBe(version);
      });
    });
  });
});
