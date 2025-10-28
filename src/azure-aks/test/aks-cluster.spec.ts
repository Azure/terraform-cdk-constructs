/**
 * Comprehensive unit tests for Azure Kubernetes Service (AKS) Cluster
 *
 * This test suite validates the unified AksCluster class that uses the VersionedAzapiResource
 * framework. Tests cover automatic version resolution, explicit version pinning, schema validation,
 * property transformation, and full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ResourceGroup } from "../../azure-resourcegroup";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { AksCluster, AksClusterProps } from "../lib/aks-cluster";
import {
  ALL_AKS_CLUSTER_VERSIONS,
  AKS_CLUSTER_TYPE,
} from "../lib/aks-cluster-schemas";

describe("AksCluster - Unified Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;
  let resourceGroup: ResourceGroup;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Create a resource group for AKS cluster tests
    resourceGroup = new ResourceGroup(stack, "TestRG", {
      name: "test-rg",
      location: "eastus",
    });

    // Ensure AKS Cluster schemas are registered
    try {
      manager.registerResourceType(AKS_CLUSTER_TYPE, ALL_AKS_CLUSTER_VERSIONS);
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Basic Construction", () => {
    it("should create cluster with required properties only", () => {
      const props: AksClusterProps = {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
            mode: "System",
          },
        ],
      };

      const aksCluster = new AksCluster(stack, "TestAksCluster", props);

      expect(aksCluster).toBeInstanceOf(AksCluster);
      expect(aksCluster.props).toBe(props);
      expect(aksCluster.resolvedApiVersion).toBe("2025-07-01"); // Latest version
    });

    it("should create cluster with full configuration", () => {
      const props: AksClusterProps = {
        name: "test-aks-full",
        location: "westus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaksfull",
        kubernetesVersion: "1.28.3",
        sku: { name: "Standard", tier: "Standard" },
        identity: { type: "SystemAssigned" },
        agentPoolProfiles: [
          {
            name: "system",
            count: 3,
            vmSize: "Standard_D4s_v3",
            mode: "System",
            enableAutoScaling: true,
            minCount: 3,
            maxCount: 10,
          },
        ],
        networkProfile: {
          networkPlugin: "azure",
          serviceCidr: "10.0.0.0/16",
          dnsServiceIP: "10.0.0.10",
        },
        enableRBAC: true,
        tags: {
          environment: "test",
          project: "cdktf-constructs",
        },
      };

      const aksCluster = new AksCluster(stack, "TestAksCluster", props);

      expect(aksCluster).toBeInstanceOf(AksCluster);
      expect(aksCluster.props.kubernetesVersion).toBe("1.28.3");
      expect(aksCluster.props.enableRBAC).toBe(true);
      expect(aksCluster.tags).toEqual(props.tags);
    });

    it("should generate correct Terraform resource name", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.id).toMatch(/^\$\{.*\.id\}$/);
    });

    it("should set correct resource type", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.schema.resourceType).toBe(AKS_CLUSTER_TYPE);
    });

    it("should validate required properties are present", () => {
      expect(() => {
        new AksCluster(stack, "InvalidAksCluster", {
          name: "test-aks",
          location: "eastus",
          resourceGroupId: resourceGroup.id,
          dnsPrefix: "",
          agentPoolProfiles: [],
        } as AksClusterProps);
      }).toThrow();
    });

    it("should handle optional properties correctly", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        kubernetesVersion: "1.28.3",
        nodeResourceGroup: "test-node-rg",
      });

      expect(aksCluster.props.kubernetesVersion).toBe("1.28.3");
      expect(aksCluster.props.nodeResourceGroup).toBe("test-node-rg");
    });

    it("should apply default values when appropriate", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.tags).toEqual({});
    });
  });

  describe("Schema Registration", () => {
    it("should register schemas on first instantiation", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.schema).toBeDefined();
    });

    it("should not re-register schemas on subsequent instantiations", () => {
      new AksCluster(stack, "FirstAksCluster", {
        name: "test-aks-1",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks1",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(() => {
        new AksCluster(stack, "SecondAksCluster", {
          name: "test-aks-2",
          location: "eastus",
          resourceGroupId: resourceGroup.id,
          dnsPrefix: "testaks2",
          agentPoolProfiles: [
            {
              name: "default",
              count: 3,
              vmSize: "Standard_D2s_v3",
            },
          ],
        });
      }).not.toThrow();
    });

    it("should have all three API versions registered", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      const supportedVersions = aksCluster.supportedVersions();
      expect(supportedVersions).toContain("2024-10-01");
      expect(supportedVersions).toContain("2025-01-01");
      expect(supportedVersions).toContain("2025-07-01");
    });

    it("should set correct default API version", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.resolvedApiVersion).toBe("2025-07-01");
    });
  });

  describe("Version Management", () => {
    it("should use default version when not specified", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.resolvedApiVersion).toBe("2025-07-01");
      expect(aksCluster.latestVersion()).toBe("2025-07-01");
    });

    it("should use explicitly specified version", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        apiVersion: "2025-07-01",
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.resolvedApiVersion).toBe("2025-07-01");
    });

    it("should accept 2024-10-01 API version", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        apiVersion: "2024-10-01",
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.resolvedApiVersion).toBe("2024-10-01");
    });

    it("should accept 2025-07-01 API version", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        apiVersion: "2025-07-01",
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.resolvedApiVersion).toBe("2025-07-01");
    });

    it("should accept 2025-01-01 API version", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        apiVersion: "2025-01-01",
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.resolvedApiVersion).toBe("2025-01-01");
    });

    it("should reject invalid API versions", () => {
      expect(() => {
        new AksCluster(stack, "InvalidVersion", {
          name: "test-aks",
          location: "eastus",
          resourceGroupId: resourceGroup.id,
          apiVersion: "2026-01-01",
          dnsPrefix: "testaks",
          agentPoolProfiles: [
            {
              name: "default",
              count: 3,
              vmSize: "Standard_D2s_v3",
            },
          ],
        });
      }).toThrow("Unsupported API version '2026-01-01'");
    });

    it("should handle version migrations correctly", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        apiVersion: "2024-10-01",
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      const analysis = aksCluster.analyzeMigrationTo("2025-07-01");

      expect(analysis).toBeDefined();
      expect(analysis.fromVersion).toBe("2024-10-01");
      expect(analysis.toVersion).toBe("2025-07-01");
    });

    it("should validate schema compatibility across versions", () => {
      const versions = ["2024-10-01", "2025-01-01", "2025-07-01"];

      versions.forEach((version) => {
        const aksCluster = new AksCluster(
          stack,
          `AKS-${version.replace(/-/g, "")}`,
          {
            name: `test-aks-${version}`,
            location: "eastus",
            resourceGroupId: resourceGroup.id,
            apiVersion: version,
            dnsPrefix: "testaks",
            agentPoolProfiles: [
              {
                name: "default",
                count: 3,
                vmSize: "Standard_D2s_v3",
              },
            ],
          },
        );

        expect(aksCluster.schema.version).toBe(version);
        expect(aksCluster.schema.properties.location).toBeDefined();
        expect(aksCluster.schema.properties.dnsPrefix).toBeDefined();
        expect(aksCluster.schema.properties.agentPoolProfiles).toBeDefined();
      });
    });
  });

  describe("Property Handling", () => {
    it("should handle basic cluster properties", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "westus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.props.name).toBe("test-aks");
      expect(aksCluster.props.location).toBe("westus");
      expect(aksCluster.props.dnsPrefix).toBe("testaks");
    });

    it("should handle SystemAssigned identity configuration", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        identity: { type: "SystemAssigned" },
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.props.identity?.type).toBe("SystemAssigned");
    });

    it("should handle UserAssigned identity configuration", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        identity: {
          type: "UserAssigned",
          userAssignedIdentities: {
            "/subscriptions/test/resourceGroups/test/providers/Microsoft.ManagedIdentity/userAssignedIdentities/test":
              {},
          },
        },
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.props.identity?.type).toBe("UserAssigned");
      expect(aksCluster.props.identity?.userAssignedIdentities).toBeDefined();
    });

    it("should handle SKU configuration", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        sku: { name: "Standard", tier: "Standard" },
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.props.sku?.name).toBe("Standard");
      expect(aksCluster.props.sku?.tier).toBe("Standard");
    });

    it("should handle agent pool profiles correctly", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "system",
            count: 3,
            vmSize: "Standard_D4s_v3",
            mode: "System",
            enableAutoScaling: true,
            minCount: 3,
            maxCount: 10,
          },
          {
            name: "user",
            count: 2,
            vmSize: "Standard_D2s_v3",
            mode: "User",
          },
        ],
      });

      expect(aksCluster.props.agentPoolProfiles).toHaveLength(2);
      expect(aksCluster.props.agentPoolProfiles[0].name).toBe("system");
      expect(aksCluster.props.agentPoolProfiles[1].name).toBe("user");
    });

    it("should handle network profile with all options", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        networkProfile: {
          networkPlugin: "azure",
          networkPolicy: "calico",
          serviceCidr: "10.0.0.0/16",
          dnsServiceIP: "10.0.0.10",
          dockerBridgeCidr: "172.17.0.1/16",
          loadBalancerSku: "standard",
        },
      });

      expect(aksCluster.props.networkProfile?.networkPlugin).toBe("azure");
      expect(aksCluster.props.networkProfile?.networkPolicy).toBe("calico");
      expect(aksCluster.props.networkProfile?.serviceCidr).toBe("10.0.0.0/16");
    });

    it("should handle addon profiles", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        addonProfiles: {
          httpApplicationRouting: { enabled: true },
          omsagent: {
            enabled: true,
            config: { logAnalyticsWorkspaceResourceID: "/subscriptions/test" },
          },
        },
      });

      expect(
        aksCluster.props.addonProfiles?.httpApplicationRouting?.enabled,
      ).toBe(true);
      expect(aksCluster.props.addonProfiles?.omsagent?.enabled).toBe(true);
    });

    it("should handle security profiles with AAD and RBAC", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        aadProfile: {
          managed: true,
          enableAzureRBAC: true,
          adminGroupObjectIDs: ["group-id-1", "group-id-2"],
        },
        enableRBAC: true,
      });

      expect(aksCluster.props.aadProfile?.managed).toBe(true);
      expect(aksCluster.props.aadProfile?.enableAzureRBAC).toBe(true);
      expect(aksCluster.props.enableRBAC).toBe(true);
    });

    it("should handle auto-scaler profile", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        autoScalerProfile: {
          scaleDownDelayAfterAdd: "10m",
          scaleDownUnneededTime: "10m",
          scaleDownUtilizationThreshold: "0.5",
        },
      });

      expect(aksCluster.props.autoScalerProfile?.scaleDownDelayAfterAdd).toBe(
        "10m",
      );
    });

    it("should handle Windows profile", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        windowsProfile: {
          adminUsername: "azureuser",
          adminPassword: "P@ssw0rd1234!",
        },
      });

      expect(aksCluster.props.windowsProfile?.adminUsername).toBe("azureuser");
    });

    it("should handle Linux profile", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        linuxProfile: {
          adminUsername: "azureuser",
          ssh: {
            publicKeys: [{ keyData: "ssh-rsa AAAAB3..." }],
          },
        },
      });

      expect(aksCluster.props.linuxProfile?.adminUsername).toBe("azureuser");
    });

    it("should handle tags properly", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        tags: {
          environment: "production",
          cost: "center1",
        },
      });

      expect(aksCluster.tags).toEqual({
        environment: "production",
        cost: "center1",
      });
    });
  });

  describe("Validation", () => {
    it("should validate name format", () => {
      expect(() => {
        new AksCluster(stack, "InvalidName", {
          name: "invalid_name_with_underscores",
          location: "eastus",
          resourceGroupId: resourceGroup.id,
          dnsPrefix: "testaks",
          agentPoolProfiles: [
            {
              name: "default",
              count: 3,
              vmSize: "Standard_D2s_v3",
            },
          ],
          enableValidation: true,
        });
      }).toThrow();
    });

    it("should validate location is provided", () => {
      expect(() => {
        new AksCluster(stack, "MissingLocation", {
          name: "test-aks",
          location: "",
          resourceGroupId: resourceGroup.id,
          dnsPrefix: "testaks",
          agentPoolProfiles: [
            {
              name: "default",
              count: 3,
              vmSize: "Standard_D2s_v3",
            },
          ],
          enableValidation: true,
        });
      }).toThrow();
    });

    it("should validate DNS prefix format", () => {
      expect(() => {
        new AksCluster(stack, "InvalidDnsPrefix", {
          name: "test-aks",
          location: "eastus",
          resourceGroupId: resourceGroup.id,
          dnsPrefix: "invalid_dns_prefix",
          agentPoolProfiles: [
            {
              name: "default",
              count: 3,
              vmSize: "Standard_D2s_v3",
            },
          ],
          enableValidation: true,
        });
      }).toThrow();
    });

    it("should validate Kubernetes version format", () => {
      expect(() => {
        new AksCluster(stack, "InvalidK8sVersion", {
          name: "test-aks",
          location: "eastus",
          resourceGroupId: resourceGroup.id,
          dnsPrefix: "testaks",
          kubernetesVersion: "invalid-version",
          agentPoolProfiles: [
            {
              name: "default",
              count: 3,
              vmSize: "Standard_D2s_v3",
            },
          ],
          enableValidation: true,
        });
      }).toThrow();
    });

    it("should validate agent pool configuration", () => {
      // Creating with empty agent pool should not throw during construction
      // but would fail during Terraform validation
      const aksCluster = new AksCluster(stack, "InvalidAgentPool", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [],
        enableValidation: false, // Disable validation to allow construction
      });

      expect(aksCluster.props.agentPoolProfiles).toHaveLength(0);
    });

    it("should validate network profile constraints", () => {
      const aksCluster = new AksCluster(stack, "ValidNetwork", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        networkProfile: {
          networkPlugin: "azure",
          serviceCidr: "10.0.0.0/16",
          dnsServiceIP: "10.0.0.10",
        },
      });

      expect(aksCluster.props.networkProfile?.networkPlugin).toBe("azure");
    });

    it("should validate identity type combinations", () => {
      const aksCluster = new AksCluster(stack, "ValidIdentity", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        identity: { type: "SystemAssigned" },
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.props.identity?.type).toBe("SystemAssigned");
    });

    it("should validate SKU tiers", () => {
      const aksCluster = new AksCluster(stack, "ValidSku", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        sku: { name: "Standard", tier: "Standard" },
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.props.sku?.tier).toBe("Standard");
    });

    it("should validate public network access values", () => {
      expect(() => {
        new AksCluster(stack, "InvalidPublicAccess", {
          name: "test-aks",
          location: "eastus",
          resourceGroupId: resourceGroup.id,
          dnsPrefix: "testaks",
          publicNetworkAccess: "Invalid",
          agentPoolProfiles: [
            {
              name: "default",
              count: 3,
              vmSize: "Standard_D2s_v3",
            },
          ],
          enableValidation: true,
        });
      }).toThrow();
    });

    it("should validate support plan values", () => {
      expect(() => {
        new AksCluster(stack, "InvalidSupportPlan", {
          name: "test-aks",
          location: "eastus",
          resourceGroupId: resourceGroup.id,
          dnsPrefix: "testaks",
          supportPlan: "InvalidPlan",
          agentPoolProfiles: [
            {
              name: "default",
              count: 3,
              vmSize: "Standard_D2s_v3",
            },
          ],
          enableValidation: true,
        });
      }).toThrow();
    });
  });

  describe("Parent ID", () => {
    it("should determine parent ID from resourceGroupId", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.props.resourceGroupId).toBe(resourceGroup.id);
    });

    it("should construct correct parent ID format", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.props.resourceGroupId).toContain("/subscriptions/");
      expect(aksCluster.props.resourceGroupId).toContain("/resourceGroups/");
    });

    it("should handle resource group ID in different formats", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.props.resourceGroupId).toBeDefined();
    });
  });

  describe("Output Properties", () => {
    it("should expose id property", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.id).toBeDefined();
      expect(aksCluster.id).toMatch(/^\$\{.*\.id\}$/);
    });

    it("should expose name property", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.props.name).toBe("test-aks");
    });

    it("should expose fqdn property", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.fqdn).toBeDefined();
    });

    it("should expose kubeConfig property", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.kubeConfig).toBeDefined();
      expect(typeof aksCluster.kubeConfig).toBe("string");
    });

    it("should expose all terraform outputs", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aksCluster.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(aksCluster.locationOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(aksCluster.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(aksCluster.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(aksCluster.fqdnOutput).toBeInstanceOf(cdktf.TerraformOutput);
      // kubeConfig is retrieved via a resource action (not a direct output)
    });

    it("should handle undefined outputs gracefully", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(() => aksCluster.fqdn).not.toThrow();
      expect(() => aksCluster.kubeConfig).not.toThrow();
    });

    it("should type outputs correctly", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(typeof aksCluster.id).toBe("string");
      expect(typeof aksCluster.fqdn).toBe("string");
      expect(typeof aksCluster.kubeConfig).toBe("string");
    });
  });

  describe("Ignore Changes", () => {
    it("should support ignoreChanges for dynamic properties", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        ignoreChanges: ["kubernetesVersion"],
      });

      expect(aksCluster.props.ignoreChanges).toContain("kubernetesVersion");
    });

    it("should apply ignore changes to agentPoolProfiles", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        ignoreChanges: ["agentPoolProfiles"],
      });

      expect(aksCluster.props.ignoreChanges).toContain("agentPoolProfiles");
    });

    it("should apply ignore changes to tags", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        tags: { environment: "test" },
        ignoreChanges: ["tags"],
      });

      expect(aksCluster.props.ignoreChanges).toContain("tags");
    });

    it("should handle multiple ignore changes properties", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        ignoreChanges: ["kubernetesVersion", "agentPoolProfiles", "tags"],
      });

      expect(aksCluster.props.ignoreChanges).toHaveLength(3);
    });
  });

  describe("Tag Management", () => {
    it("should add tags correctly", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        tags: { environment: "test" },
      });

      aksCluster.addTag("newTag", "newValue");

      expect(aksCluster.props.tags!.newTag).toBe("newValue");
      expect(aksCluster.props.tags!.environment).toBe("test");
    });

    it("should remove tags correctly", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        tags: { environment: "test", cost: "center1" },
      });

      aksCluster.removeTag("environment");

      expect(aksCluster.props.tags!.environment).toBeUndefined();
      expect(aksCluster.props.tags!.cost).toBe("center1");
    });

    it("should merge with existing tags", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        tags: { environment: "test" },
      });

      aksCluster.addTag("cost", "center1");
      aksCluster.addTag("project", "cdktf");

      expect(aksCluster.props.tags!.environment).toBe("test");
      expect(aksCluster.props.tags!.cost).toBe("center1");
      expect(aksCluster.props.tags!.project).toBe("cdktf");
    });

    it("should handle undefined tags", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      aksCluster.addTag("firstTag", "firstValue");

      expect(aksCluster.props.tags!.firstTag).toBe("firstValue");
    });
  });

  describe("Complex Configuration", () => {
    it("should handle multi-node pool configuration", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "system",
            count: 3,
            vmSize: "Standard_D4s_v3",
            mode: "System",
          },
          {
            name: "user1",
            count: 2,
            vmSize: "Standard_D2s_v3",
            mode: "User",
          },
          {
            name: "user2",
            count: 5,
            vmSize: "Standard_D8s_v3",
            mode: "User",
            enableAutoScaling: true,
            minCount: 3,
            maxCount: 10,
          },
        ],
      });

      expect(aksCluster.props.agentPoolProfiles).toHaveLength(3);
    });

    it("should handle private cluster configuration", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        apiServerAccessProfile: {
          enablePrivateCluster: true,
          privateDNSZone: "system",
        },
      });

      expect(
        aksCluster.props.apiServerAccessProfile?.enablePrivateCluster,
      ).toBe(true);
    });

    it("should handle advanced networking with custom VNet", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
            vnetSubnetID:
              "/subscriptions/test/resourceGroups/test/providers/Microsoft.Network/virtualNetworks/test/subnets/test",
          },
        ],
        networkProfile: {
          networkPlugin: "azure",
          serviceCidr: "10.0.0.0/16",
          dnsServiceIP: "10.0.0.10",
          dockerBridgeCidr: "172.17.0.1/16",
        },
      });

      expect(aksCluster.props.networkProfile?.networkPlugin).toBe("azure");
      expect(aksCluster.props.agentPoolProfiles[0].vnetSubnetID).toBeDefined();
    });

    it("should handle all addon configurations", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
        addonProfiles: {
          httpApplicationRouting: { enabled: true },
          omsagent: {
            enabled: true,
            config: {
              logAnalyticsWorkspaceResourceID:
                "/subscriptions/test/resourceGroups/test/providers/Microsoft.OperationalInsights/workspaces/test",
            },
          },
          azurepolicy: { enabled: true },
          azureKeyvaultSecretsProvider: {
            enabled: true,
            config: { enableSecretRotation: "true" },
          },
        },
      });

      expect(
        aksCluster.props.addonProfiles?.httpApplicationRouting?.enabled,
      ).toBe(true);
      expect(aksCluster.props.addonProfiles?.omsagent?.enabled).toBe(true);
      expect(aksCluster.props.addonProfiles?.azurepolicy?.enabled).toBe(true);
    });

    it("should handle complete production-ready configuration", () => {
      const aksCluster = new AksCluster(stack, "TestAksCluster", {
        name: "prod-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        apiVersion: "2025-07-01",
        dnsPrefix: "prodaks",
        kubernetesVersion: "1.28.3",
        sku: { name: "Standard", tier: "Standard" },
        identity: { type: "SystemAssigned" },
        agentPoolProfiles: [
          {
            name: "system",
            count: 3,
            vmSize: "Standard_D4s_v3",
            mode: "System",
            enableAutoScaling: true,
            minCount: 3,
            maxCount: 10,
            availabilityZones: ["1", "2", "3"],
          },
        ],
        networkProfile: {
          networkPlugin: "azure",
          networkPolicy: "calico",
          serviceCidr: "10.0.0.0/16",
          dnsServiceIP: "10.0.0.10",
          loadBalancerSku: "standard",
        },
        enableRBAC: true,
        aadProfile: {
          managed: true,
          enableAzureRBAC: true,
        },
        apiServerAccessProfile: {
          enablePrivateCluster: true,
        },
        addonProfiles: {
          omsagent: {
            enabled: true,
            config: {
              logAnalyticsWorkspaceResourceID:
                "/subscriptions/test/resourceGroups/test/providers/Microsoft.OperationalInsights/workspaces/test",
            },
          },
        },
        tags: {
          environment: "production",
          cost: "center1",
        },
      });

      expect(aksCluster.resolvedApiVersion).toBe("2025-07-01");
      expect(aksCluster.props.enableRBAC).toBe(true);
      expect(aksCluster.props.agentPoolProfiles[0].enableAutoScaling).toBe(
        true,
      );
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new AksCluster(stack, "TestAksCluster", {
        name: "test-aks",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "testaks",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple AKS clusters in the same stack", () => {
      const aks1 = new AksCluster(stack, "AksCluster1", {
        name: "aks-1",
        location: "eastus",
        resourceGroupId: resourceGroup.id,
        dnsPrefix: "aks1",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      const aks2 = new AksCluster(stack, "AksCluster2", {
        name: "aks-2",
        location: "westus",
        resourceGroupId: resourceGroup.id,
        apiVersion: "2025-07-01",
        dnsPrefix: "aks2",
        agentPoolProfiles: [
          {
            name: "default",
            count: 3,
            vmSize: "Standard_D2s_v3",
          },
        ],
      });

      expect(aks1.resolvedApiVersion).toBe("2025-07-01");
      expect(aks2.resolvedApiVersion).toBe("2025-07-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });
});
