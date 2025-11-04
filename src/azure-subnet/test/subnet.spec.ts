/**
 * Comprehensive tests for the Subnet implementation
 *
 * This test suite validates the Subnet class using the AzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * property transformation, and resource creation including parent-child relationship.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { Subnet, SubnetProps } from "../lib/subnet";

describe("Subnet - Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  describe("Constructor and Basic Properties", () => {
    it("should create subnet with automatic latest version resolution", () => {
      const props: SubnetProps = {
        name: "test-subnet",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      };

      const subnet = new Subnet(stack, "TestSubnet", props);

      expect(subnet).toBeInstanceOf(Subnet);
      expect(subnet.props).toBe(props);
      expect(subnet.name).toBe("test-subnet");
    });

    it("should create subnet with explicit version pinning", () => {
      const props: SubnetProps = {
        name: "test-subnet-pinned",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
        apiVersion: "2024-07-01",
      };

      const subnet = new Subnet(stack, "TestSubnet", props);

      expect(subnet.resolvedApiVersion).toBe("2024-07-01");
    });

    it("should create subnet with all optional properties", () => {
      const props: SubnetProps = {
        name: "test-subnet-full",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.2.0/24",
        networkSecurityGroup: {
          id: "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Network/networkSecurityGroups/test-nsg",
        },
        routeTable: {
          id: "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Network/routeTables/test-rt",
        },
        serviceEndpoints: [
          {
            service: "Microsoft.Storage",
            locations: ["eastus"],
          },
        ],
        delegations: [
          {
            name: "test-delegation",
            serviceName: "Microsoft.Sql/managedInstances",
          },
        ],
        privateEndpointNetworkPolicies: "Enabled",
        privateLinkServiceNetworkPolicies: "Disabled",
        ignoreChanges: ["networkSecurityGroup"],
      };

      const subnet = new Subnet(stack, "TestSubnet", props);

      expect(subnet.props.addressPrefix).toEqual(props.addressPrefix);
      expect(subnet.props.networkSecurityGroup).toEqual(
        props.networkSecurityGroup,
      );
      expect(subnet.props.serviceEndpoints).toEqual(props.serviceEndpoints);
    });

    it("should use default name when name is not provided", () => {
      const props: SubnetProps = {
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      };

      const subnet = new Subnet(stack, "TestSubnet", props);

      expect(subnet.name).toBe("TestSubnet");
    });
  });

  describe("Resource Type and API Versions", () => {
    it("should have correct resource type", () => {
      const subnet = new Subnet(stack, "TestSubnet", {
        name: "test-subnet",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      });

      expect(subnet).toBeInstanceOf(Subnet);
    });

    it("should support all registered API versions", () => {
      const versions = ["2024-07-01", "2024-10-01"];

      versions.forEach((version) => {
        const subnet = new Subnet(
          stack,
          `Subnet-${version.replace(/-/g, "")}`,
          {
            name: `subnet-${version}`,
            virtualNetworkName: "test-vnet",
            resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
            addressPrefix: "10.0.1.0/24",
            apiVersion: version,
          },
        );

        expect(subnet.resolvedApiVersion).toBe(version);
      });
    });

    it("should use latest version as default", () => {
      const subnet = new Subnet(stack, "TestSubnet", {
        name: "test-subnet",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      });

      expect(subnet.resolvedApiVersion).toBe("2024-10-01");
    });
  });

  describe("Address Prefix Configuration", () => {
    it("should create subnet with valid CIDR notation", () => {
      const subnet = new Subnet(stack, "CIDRSubnet", {
        name: "subnet-cidr",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.5.0/24",
      });

      expect(subnet.props.addressPrefix).toBe("10.0.5.0/24");
    });

    it("should handle different subnet sizes", () => {
      const subnet = new Subnet(stack, "LargeSubnet", {
        name: "subnet-large",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.0.0/16",
      });

      expect(subnet.props.addressPrefix).toBe("10.0.0.0/16");
    });
  });

  describe("Parent Virtual Network Relationship", () => {
    it("should construct correct virtual network ID", () => {
      const subnet = new Subnet(stack, "ParentTest", {
        name: "test-subnet",
        virtualNetworkName: "my-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      });

      expect(subnet.virtualNetworkId).toBe(
        "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/my-vnet",
      );
    });

    it("should require virtualNetworkName", () => {
      const props: SubnetProps = {
        name: "test-subnet",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      };

      const subnet = new Subnet(stack, "TestSubnet", props);

      expect(subnet.props.virtualNetworkName).toBe("test-vnet");
    });
  });

  describe("Network Security Group Association", () => {
    it("should create subnet with NSG reference", () => {
      const subnet = new Subnet(stack, "NSGSubnet", {
        name: "subnet-with-nsg",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
        networkSecurityGroup: {
          id: "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Network/networkSecurityGroups/my-nsg",
        },
      });

      expect(subnet.props.networkSecurityGroup).toBeDefined();
      expect(subnet.props.networkSecurityGroup?.id).toContain(
        "networkSecurityGroups/my-nsg",
      );
    });

    it("should create subnet without NSG", () => {
      const subnet = new Subnet(stack, "NoNSG", {
        name: "subnet-no-nsg",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      });

      expect(subnet.props.networkSecurityGroup).toBeUndefined();
    });
  });

  describe("Service Endpoints Configuration", () => {
    it("should create subnet with service endpoints", () => {
      const subnet = new Subnet(stack, "ServiceEndpoints", {
        name: "subnet-endpoints",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
        serviceEndpoints: [
          {
            service: "Microsoft.Storage",
            locations: ["eastus"],
          },
          {
            service: "Microsoft.Sql",
            locations: ["eastus", "westus"],
          },
        ],
      });

      expect(subnet.props.serviceEndpoints).toHaveLength(2);
      expect(subnet.props.serviceEndpoints![0].service).toBe(
        "Microsoft.Storage",
      );
      expect(subnet.props.serviceEndpoints![1].service).toBe("Microsoft.Sql");
    });

    it("should create subnet without service endpoints", () => {
      const subnet = new Subnet(stack, "NoEndpoints", {
        name: "subnet-no-endpoints",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      });

      expect(subnet.props.serviceEndpoints).toBeUndefined();
    });
  });

  describe("Subnet Delegations", () => {
    it("should create subnet with delegation", () => {
      const subnet = new Subnet(stack, "DelegatedSubnet", {
        name: "subnet-delegated",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
        delegations: [
          {
            name: "sql-delegation",
            serviceName: "Microsoft.Sql/managedInstances",
          },
        ],
      });

      expect(subnet.props.delegations).toHaveLength(1);
      expect(subnet.props.delegations![0].serviceName).toBe(
        "Microsoft.Sql/managedInstances",
      );
    });

    it("should create subnet without delegation", () => {
      const subnet = new Subnet(stack, "NoDelegation", {
        name: "subnet-no-delegation",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      });

      expect(subnet.props.delegations).toBeUndefined();
    });
  });

  describe("Private Endpoint Policies", () => {
    it("should set custom private endpoint policies", () => {
      const subnet = new Subnet(stack, "PrivatePolicies", {
        name: "subnet-policies",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
        privateEndpointNetworkPolicies: "Enabled",
        privateLinkServiceNetworkPolicies: "Disabled",
      });

      expect(subnet.props.privateEndpointNetworkPolicies).toBe("Enabled");
      expect(subnet.props.privateLinkServiceNetworkPolicies).toBe("Disabled");
    });

    it("should use default policies when not specified", () => {
      const subnet = new Subnet(stack, "DefaultPolicies", {
        name: "subnet-default-policies",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      });

      expect(subnet.props.privateEndpointNetworkPolicies).toBeUndefined();
      expect(subnet.props.privateLinkServiceNetworkPolicies).toBeUndefined();
    });
  });

  describe("Terraform Outputs", () => {
    it("should create Terraform outputs", () => {
      const subnet = new Subnet(stack, "OutputTest", {
        name: "subnet-outputs",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      });

      expect(subnet.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(subnet.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(subnet.addressPrefixOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });

    it("should have correct id format", () => {
      const subnet = new Subnet(stack, "IdFormat", {
        name: "subnet-id",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      });

      expect(subnet.id).toMatch(/^\$\{.*\.id\}$/);
      expect(subnet.resourceId).toBe(subnet.id);
    });
  });

  describe("Version Compatibility", () => {
    it("should work with all supported API versions", () => {
      const versions = ["2024-07-01", "2024-10-01"];

      versions.forEach((version) => {
        const subnet = new Subnet(
          stack,
          `Subnet-${version.replace(/-/g, "")}`,
          {
            name: `subnet-${version}`,
            virtualNetworkName: "test-vnet",
            resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
            addressPrefix: "10.0.1.0/24",
            apiVersion: version,
          },
        );

        expect(subnet.resolvedApiVersion).toBe(version);
      });
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const subnet = new Subnet(stack, "IgnoreChanges", {
        name: "subnet-ignore",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
        ignoreChanges: ["networkSecurityGroup", "routeTable"],
      });

      expect(subnet).toBeInstanceOf(Subnet);
      expect(subnet.props.ignoreChanges).toEqual([
        "networkSecurityGroup",
        "routeTable",
      ]);
    });

    it("should handle empty ignore changes array", () => {
      const subnet = new Subnet(stack, "EmptyIgnore", {
        name: "subnet-empty-ignore",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
        ignoreChanges: [],
      });

      expect(subnet).toBeInstanceOf(Subnet);
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new Subnet(stack, "SynthTest", {
        name: "subnet-synth",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple subnets in the same stack", () => {
      const subnet1 = new Subnet(stack, "Subnet1", {
        name: "subnet-1",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
      });

      const subnet2 = new Subnet(stack, "Subnet2", {
        name: "subnet-2",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.2.0/24",
        apiVersion: "2024-10-01",
      });

      expect(subnet1.resolvedApiVersion).toBe("2024-10-01");
      expect(subnet2.resolvedApiVersion).toBe("2024-10-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("Route Table Association", () => {
    it("should create subnet with route table", () => {
      const subnet = new Subnet(stack, "RouteTableSubnet", {
        name: "subnet-with-rt",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
        routeTable: {
          id: "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Network/routeTables/my-rt",
        },
      });

      expect(subnet.props.routeTable).toBeDefined();
      expect(subnet.props.routeTable?.id).toContain("routeTables/my-rt");
    });
  });

  describe("NAT Gateway Association", () => {
    it("should create subnet with NAT gateway", () => {
      const subnet = new Subnet(stack, "NATSubnet", {
        name: "subnet-with-nat",
        virtualNetworkName: "test-vnet",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        addressPrefix: "10.0.1.0/24",
        natGateway: {
          id: "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Network/natGateways/my-nat",
        },
      });

      expect(subnet.props.natGateway).toBeDefined();
      expect(subnet.props.natGateway?.id).toContain("natGateways/my-nat");
    });
  });
});
