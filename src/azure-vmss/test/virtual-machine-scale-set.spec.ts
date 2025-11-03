/**
 * Comprehensive tests for the VirtualMachineScaleSet implementation
 *
 * This test suite validates the VirtualMachineScaleSet class using the AzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * property transformation, orchestration modes, and full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import { VirtualMachineScaleSet } from "../lib/virtual-machine-scale-set";
import {
  VirtualMachineScaleSetProps,
  ALL_VMSS_VERSIONS,
  VMSS_TYPE,
} from "../lib/vmss-schemas";

describe("VirtualMachineScaleSet - Comprehensive Tests", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure VMSS schemas are registered
    try {
      manager.registerResourceType(VMSS_TYPE, ALL_VMSS_VERSIONS);
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create VMSS with automatic latest version resolution", () => {
      const props: VirtualMachineScaleSetProps = {
        name: "test-vmss",
        location: "eastus",
        sku: {
          name: "Standard_D2s_v3",
          capacity: 3,
        },
      };

      const vmss = new VirtualMachineScaleSet(stack, "TestVMSS", props);

      expect(vmss).toBeInstanceOf(VirtualMachineScaleSet);
      expect(vmss.resolvedApiVersion).toBe("2025-04-01"); // Latest version
      expect(vmss.props).toBe(props);
      expect(vmss.name).toBe("test-vmss");
      expect(vmss.location).toBe("eastus");
    });

    it("should create VMSS with explicit version pinning", () => {
      const props: VirtualMachineScaleSetProps = {
        name: "test-vmss-pinned",
        location: "westus",
        apiVersion: "2025-01-02",
        sku: {
          name: "Standard_D2s_v3",
          capacity: 2,
        },
        tags: { environment: "test" },
      };

      const vmss = new VirtualMachineScaleSet(stack, "TestVMSS", props);

      expect(vmss.resolvedApiVersion).toBe("2025-01-02");
      expect(vmss.tags).toEqual({ environment: "test" });
    });

    it("should create VMSS with all optional properties", () => {
      const props: VirtualMachineScaleSetProps = {
        name: "test-vmss-full",
        location: "centralus",
        sku: {
          name: "Standard_D4s_v3",
          tier: "Standard",
          capacity: 5,
        },
        orchestrationMode: "Uniform",
        zones: ["1", "2", "3"],
        identity: {
          type: "SystemAssigned",
        },
        upgradePolicy: {
          mode: "Automatic",
        },
        virtualMachineProfile: {
          storageProfile: {
            imageReference: {
              publisher: "Canonical",
              offer: "0001-com-ubuntu-server-jammy",
              sku: "22_04-lts-gen2",
              version: "latest",
            },
            osDisk: {
              createOption: "FromImage",
              managedDisk: {
                storageAccountType: "Premium_LRS",
              },
            },
          },
          osProfile: {
            computerNamePrefix: "vmss-vm",
            adminUsername: "azureuser",
            linuxConfiguration: {
              disablePasswordAuthentication: true,
              ssh: {
                publicKeys: [
                  {
                    path: "/home/azureuser/.ssh/authorized_keys",
                    keyData: "ssh-rsa AAAAB3NzaC1yc2E...",
                  },
                ],
              },
            },
          },
          networkProfile: {
            networkInterfaceConfigurations: [
              {
                name: "nic-config",
                properties: {
                  primary: true,
                  ipConfigurations: [
                    {
                      name: "ip-config",
                      properties: {
                        subnet: {
                          id: "/subscriptions/test/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/test-subnet",
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        overprovision: true,
        zoneBalance: true,
        singlePlacementGroup: false,
        automaticRepairsPolicy: {
          enabled: true,
          gracePeriod: "PT30M",
        },
        tags: {
          environment: "production",
          project: "cdktf-constructs",
        },
        ignoreChanges: ["tags"],
        enableValidation: true,
        enableMigrationAnalysis: true,
      };

      const vmss = new VirtualMachineScaleSet(stack, "TestVMSS", props);

      expect(vmss.props.tags).toEqual(props.tags);
      expect(vmss.props.identity).toEqual(props.identity);
      expect(vmss.props.zones).toEqual(props.zones);
      expect(vmss.props.orchestrationMode).toBe("Uniform");
      expect(vmss.props.automaticRepairsPolicy).toEqual(
        props.automaticRepairsPolicy,
      );
    });

    it("should create VMSS with Flexible orchestration mode", () => {
      const props: VirtualMachineScaleSetProps = {
        name: "flexible-vmss",
        location: "eastus",
        sku: {
          name: "Standard_D2s_v3",
          capacity: 5,
        },
        orchestrationMode: "Flexible",
        platformFaultDomainCount: 1,
        singlePlacementGroup: false,
      };

      const vmss = new VirtualMachineScaleSet(stack, "FlexibleVMSS", props);

      expect(vmss).toBeInstanceOf(VirtualMachineScaleSet);
      expect(vmss.orchestrationMode).toBe("Flexible");
      expect(vmss.props.platformFaultDomainCount).toBe(1);
    });

    it("should create VMSS with rolling upgrade policy", () => {
      const props: VirtualMachineScaleSetProps = {
        name: "rolling-vmss",
        location: "eastus",
        sku: {
          name: "Standard_D2s_v3",
          capacity: 10,
        },
        upgradePolicy: {
          mode: "Rolling",
          rollingUpgradePolicy: {
            maxBatchInstancePercent: 20,
            maxUnhealthyInstancePercent: 20,
            maxUnhealthyUpgradedInstancePercent: 20,
            pauseTimeBetweenBatches: "PT5S",
            enableCrossZoneUpgrade: true,
            prioritizeUnhealthyInstances: true,
          },
          automaticOSUpgradePolicy: {
            enableAutomaticOSUpgrade: true,
            disableAutomaticRollback: false,
            useRollingUpgradePolicy: true,
          },
        },
      };

      const vmss = new VirtualMachineScaleSet(stack, "RollingVMSS", props);

      expect(vmss.props.upgradePolicy?.mode).toBe("Rolling");
      expect(vmss.props.upgradePolicy?.rollingUpgradePolicy).toBeDefined();
      expect(vmss.props.upgradePolicy?.automaticOSUpgradePolicy).toBeDefined();
    });

    it("should create VMSS with load balancer configuration", () => {
      const props: VirtualMachineScaleSetProps = {
        name: "lb-vmss",
        location: "eastus",
        sku: {
          name: "Standard_D2s_v3",
          capacity: 5,
        },
        virtualMachineProfile: {
          networkProfile: {
            networkInterfaceConfigurations: [
              {
                name: "nic-config",
                properties: {
                  primary: true,
                  ipConfigurations: [
                    {
                      name: "ip-config",
                      properties: {
                        subnet: {
                          id: "/subscriptions/test/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/test-subnet",
                        },
                        loadBalancerBackendAddressPools: [
                          {
                            id: "/subscriptions/test/resourceGroups/test-rg/providers/Microsoft.Network/loadBalancers/test-lb/backendAddressPools/test-pool",
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      };

      const vmss = new VirtualMachineScaleSet(stack, "LbVMSS", props);

      expect(
        vmss.props.virtualMachineProfile?.networkProfile
          ?.networkInterfaceConfigurations,
      ).toBeDefined();
    });
  });

  describe("Orchestration Modes", () => {
    it("should support Uniform orchestration mode", () => {
      const vmss = new VirtualMachineScaleSet(stack, "UniformVMSS", {
        name: "uniform-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        orchestrationMode: "Uniform",
      });

      expect(vmss.orchestrationMode).toBe("Uniform");
    });

    it("should support Flexible orchestration mode", () => {
      const vmss = new VirtualMachineScaleSet(stack, "FlexibleVMSS", {
        name: "flexible-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        orchestrationMode: "Flexible",
      });

      expect(vmss.orchestrationMode).toBe("Flexible");
    });

    it("should create VMSS without explicit orchestration mode", () => {
      const vmss = new VirtualMachineScaleSet(stack, "DefaultVMSS", {
        name: "default-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
      });

      expect(vmss.orchestrationMode).toBeUndefined();
    });

    it("should support Flexible mode with platform fault domain count", () => {
      const vmss = new VirtualMachineScaleSet(stack, "FlexibleFDVMSS", {
        name: "flexible-fd-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 5 },
        orchestrationMode: "Flexible",
        platformFaultDomainCount: 1,
      });

      expect(vmss.props.platformFaultDomainCount).toBe(1);
    });
  });

  describe("Upgrade Policies", () => {
    it("should support Automatic upgrade mode", () => {
      const vmss = new VirtualMachineScaleSet(stack, "AutoUpgradeVMSS", {
        name: "auto-upgrade-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        upgradePolicy: {
          mode: "Automatic",
        },
      });

      expect(vmss.props.upgradePolicy?.mode).toBe("Automatic");
    });

    it("should support Manual upgrade mode", () => {
      const vmss = new VirtualMachineScaleSet(stack, "ManualUpgradeVMSS", {
        name: "manual-upgrade-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        upgradePolicy: {
          mode: "Manual",
        },
      });

      expect(vmss.props.upgradePolicy?.mode).toBe("Manual");
    });

    it("should support Rolling upgrade mode with policy", () => {
      const vmss = new VirtualMachineScaleSet(stack, "RollingUpgradeVMSS", {
        name: "rolling-upgrade-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 10 },
        upgradePolicy: {
          mode: "Rolling",
          rollingUpgradePolicy: {
            maxBatchInstancePercent: 20,
            maxUnhealthyInstancePercent: 20,
            maxUnhealthyUpgradedInstancePercent: 20,
            pauseTimeBetweenBatches: "PT5S",
          },
        },
      });

      expect(vmss.props.upgradePolicy?.mode).toBe("Rolling");
      expect(
        vmss.props.upgradePolicy?.rollingUpgradePolicy?.maxBatchInstancePercent,
      ).toBe(20);
    });

    it("should support automatic OS upgrade policy", () => {
      const vmss = new VirtualMachineScaleSet(stack, "AutoOSUpgradeVMSS", {
        name: "auto-os-upgrade-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 5 },
        upgradePolicy: {
          mode: "Automatic",
          automaticOSUpgradePolicy: {
            enableAutomaticOSUpgrade: true,
            disableAutomaticRollback: false,
          },
        },
      });

      expect(
        vmss.props.upgradePolicy?.automaticOSUpgradePolicy
          ?.enableAutomaticOSUpgrade,
      ).toBe(true);
    });

    it("should support rolling upgrade with cross-zone upgrade", () => {
      const vmss = new VirtualMachineScaleSet(stack, "CrossZoneUpgradeVMSS", {
        name: "cross-zone-upgrade-vmss",
        location: "eastus",
        zones: ["1", "2", "3"],
        sku: { name: "Standard_D2s_v3", capacity: 9 },
        upgradePolicy: {
          mode: "Rolling",
          rollingUpgradePolicy: {
            maxBatchInstancePercent: 33,
            enableCrossZoneUpgrade: true,
          },
        },
      });

      expect(
        vmss.props.upgradePolicy?.rollingUpgradePolicy?.enableCrossZoneUpgrade,
      ).toBe(true);
    });

    it("should support prioritizing unhealthy instances", () => {
      const vmss = new VirtualMachineScaleSet(
        stack,
        "PrioritizeUnhealthyVMSS",
        {
          name: "prioritize-unhealthy-vmss",
          location: "eastus",
          sku: { name: "Standard_D2s_v3", capacity: 5 },
          upgradePolicy: {
            mode: "Rolling",
            rollingUpgradePolicy: {
              maxBatchInstancePercent: 20,
              prioritizeUnhealthyInstances: true,
            },
          },
        },
      );

      expect(
        vmss.props.upgradePolicy?.rollingUpgradePolicy
          ?.prioritizeUnhealthyInstances,
      ).toBe(true);
    });
  });

  describe("Scaling Configuration", () => {
    it("should support overprovision configuration", () => {
      const vmss = new VirtualMachineScaleSet(stack, "OverprovisionVMSS", {
        name: "overprovision-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 5 },
        overprovision: true,
      });

      expect(vmss.props.overprovision).toBe(true);
    });

    it("should support disabling extensions on overprovisioned VMs", () => {
      const vmss = new VirtualMachineScaleSet(stack, "NoExtOverprovisionVMSS", {
        name: "no-ext-overprovision-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 5 },
        overprovision: true,
        doNotRunExtensionsOnOverprovisionedVMs: true,
      });

      expect(vmss.props.doNotRunExtensionsOnOverprovisionedVMs).toBe(true);
    });

    it("should support single placement group configuration", () => {
      const vmss = new VirtualMachineScaleSet(stack, "SinglePlacementVMSS", {
        name: "single-placement-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 50 },
        singlePlacementGroup: false,
      });

      expect(vmss.props.singlePlacementGroup).toBe(false);
    });

    it("should support zone balance configuration", () => {
      const vmss = new VirtualMachineScaleSet(stack, "ZoneBalanceVMSS", {
        name: "zone-balance-vmss",
        location: "eastus",
        zones: ["1", "2", "3"],
        sku: { name: "Standard_D2s_v3", capacity: 9 },
        zoneBalance: true,
      });

      expect(vmss.props.zoneBalance).toBe(true);
    });

    it("should support automatic repairs policy", () => {
      const vmss = new VirtualMachineScaleSet(stack, "AutoRepairVMSS", {
        name: "auto-repair-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 5 },
        automaticRepairsPolicy: {
          enabled: true,
          gracePeriod: "PT30M",
          repairAction: "Replace",
        },
      });

      expect(vmss.props.automaticRepairsPolicy?.enabled).toBe(true);
      expect(vmss.props.automaticRepairsPolicy?.gracePeriod).toBe("PT30M");
    });
  });

  describe("Network Profile", () => {
    it("should support network interface configurations", () => {
      const vmss = new VirtualMachineScaleSet(stack, "NetworkVMSS", {
        name: "network-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        virtualMachineProfile: {
          networkProfile: {
            networkInterfaceConfigurations: [
              {
                name: "nic-config",
                properties: {
                  primary: true,
                  ipConfigurations: [
                    {
                      name: "ip-config",
                      properties: {
                        subnet: {
                          id: "/subscriptions/test/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/test-subnet",
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      });

      expect(
        vmss.props.virtualMachineProfile?.networkProfile
          ?.networkInterfaceConfigurations,
      ).toHaveLength(1);
    });

    it("should support accelerated networking", () => {
      const vmss = new VirtualMachineScaleSet(stack, "AccelNetVMSS", {
        name: "accel-net-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        virtualMachineProfile: {
          networkProfile: {
            networkInterfaceConfigurations: [
              {
                name: "nic-config",
                properties: {
                  primary: true,
                  enableAcceleratedNetworking: true,
                  ipConfigurations: [
                    {
                      name: "ip-config",
                      properties: {
                        subnet: {
                          id: "/test/subnet",
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      });

      expect(
        vmss.props.virtualMachineProfile?.networkProfile
          ?.networkInterfaceConfigurations?.[0].properties
          ?.enableAcceleratedNetworking,
      ).toBe(true);
    });

    it("should support public IP configuration", () => {
      const vmss = new VirtualMachineScaleSet(stack, "PublicIPVMSS", {
        name: "public-ip-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        virtualMachineProfile: {
          networkProfile: {
            networkInterfaceConfigurations: [
              {
                name: "nic-config",
                properties: {
                  primary: true,
                  ipConfigurations: [
                    {
                      name: "ip-config",
                      properties: {
                        subnet: {
                          id: "/test/subnet",
                        },
                        publicIPAddressConfiguration: {
                          name: "public-ip",
                          properties: {
                            idleTimeoutInMinutes: 15,
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      });

      expect(
        vmss.props.virtualMachineProfile?.networkProfile
          ?.networkInterfaceConfigurations?.[0].properties?.ipConfigurations[0]
          .properties?.publicIPAddressConfiguration,
      ).toBeDefined();
    });

    it("should support multiple IP configurations", () => {
      const vmss = new VirtualMachineScaleSet(stack, "MultiIPVMSS", {
        name: "multi-ip-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        virtualMachineProfile: {
          networkProfile: {
            networkInterfaceConfigurations: [
              {
                name: "nic-config",
                properties: {
                  primary: true,
                  ipConfigurations: [
                    {
                      name: "ip-config-1",
                      properties: {
                        subnet: { id: "/test/subnet1" },
                        primary: true,
                      },
                    },
                    {
                      name: "ip-config-2",
                      properties: {
                        subnet: { id: "/test/subnet2" },
                        primary: false,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      });

      expect(
        vmss.props.virtualMachineProfile?.networkProfile
          ?.networkInterfaceConfigurations?.[0].properties?.ipConfigurations,
      ).toHaveLength(2);
    });

    it("should support load balancer backend pools", () => {
      const vmss = new VirtualMachineScaleSet(stack, "LBBackendVMSS", {
        name: "lb-backend-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 5 },
        virtualMachineProfile: {
          networkProfile: {
            networkInterfaceConfigurations: [
              {
                name: "nic-config",
                properties: {
                  primary: true,
                  ipConfigurations: [
                    {
                      name: "ip-config",
                      properties: {
                        subnet: { id: "/test/subnet" },
                        loadBalancerBackendAddressPools: [
                          { id: "/test/lb/backend-pool" },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      });

      expect(
        vmss.props.virtualMachineProfile?.networkProfile
          ?.networkInterfaceConfigurations?.[0].properties?.ipConfigurations[0]
          .properties?.loadBalancerBackendAddressPools,
      ).toHaveLength(1);
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const vmss = new VirtualMachineScaleSet(stack, "TestVMSS", {
        name: "test-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
      });

      expect(vmss.resolvedApiVersion).toBe("2025-04-01");
      expect(vmss.latestVersion()).toBe("2025-04-01");
    });

    it("should support all registered API versions", () => {
      const vmss = new VirtualMachineScaleSet(stack, "TestVMSS", {
        name: "test-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
      });

      const supportedVersions = vmss.supportedVersions();
      expect(supportedVersions).toContain("2025-01-02");
      expect(supportedVersions).toContain("2025-02-01");
      expect(supportedVersions).toContain("2025-04-01");
    });

    it("should validate version support", () => {
      // Valid version
      expect(() => {
        new VirtualMachineScaleSet(stack, "ValidVersion", {
          name: "test-vmss",
          location: "eastus",
          apiVersion: "2025-02-01",
          sku: { name: "Standard_D2s_v3", capacity: 3 },
        });
      }).not.toThrow();

      // Invalid version
      expect(() => {
        new VirtualMachineScaleSet(stack, "InvalidVersion", {
          name: "test-vmss",
          location: "eastus",
          apiVersion: "2026-01-01",
          sku: { name: "Standard_D2s_v3", capacity: 3 },
        });
      }).toThrow("Unsupported API version '2026-01-01'");
    });

    it("should load correct schema for resolved version", () => {
      const vmss = new VirtualMachineScaleSet(stack, "TestVMSS", {
        name: "test-vmss",
        location: "eastus",
        apiVersion: "2025-01-02",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
      });

      expect(vmss.schema).toBeDefined();
      expect(vmss.schema.resourceType).toBe(VMSS_TYPE);
      expect(vmss.schema.version).toBe("2025-01-02");
      expect(vmss.schema.properties).toBeDefined();
    });

    it("should load version configuration correctly", () => {
      const vmss = new VirtualMachineScaleSet(stack, "TestVMSS", {
        name: "test-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
      });

      expect(vmss.versionConfig).toBeDefined();
      expect(vmss.versionConfig.version).toBe("2025-04-01");
      expect(vmss.versionConfig.supportLevel).toBe(VersionSupportLevel.ACTIVE);
    });
  });

  describe("Property Validation", () => {
    it("should validate properties when validation is enabled", () => {
      const props: VirtualMachineScaleSetProps = {
        name: "test-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        enableValidation: true,
      };

      expect(() => {
        new VirtualMachineScaleSet(stack, "TestVMSS", props);
      }).not.toThrow();
    });

    it("should have validation results for valid properties", () => {
      const vmss = new VirtualMachineScaleSet(stack, "TestVMSS", {
        name: "valid-vmss-name",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        enableValidation: true,
      });

      expect(vmss.validationResult).toBeDefined();
      expect(vmss.validationResult!.valid).toBe(true);
      expect(vmss.validationResult!.errors).toHaveLength(0);
    });

    it("should skip validation when disabled", () => {
      const vmss = new VirtualMachineScaleSet(stack, "TestVMSS", {
        name: "test-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        enableValidation: false,
      });

      expect(vmss).toBeDefined();
    });
  });

  describe("Migration Analysis", () => {
    it("should perform migration analysis between versions", () => {
      const vmss = new VirtualMachineScaleSet(stack, "TestVMSS", {
        name: "test-vmss",
        location: "eastus",
        apiVersion: "2025-01-02",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
      });

      const analysis = vmss.analyzeMigrationTo("2025-04-01");

      expect(analysis).toBeDefined();
      expect(analysis.fromVersion).toBe("2025-01-02");
      expect(analysis.toVersion).toBe("2025-04-01");
      expect(analysis.compatible).toBe(true);
    });

    it("should skip migration analysis when disabled", () => {
      const vmss = new VirtualMachineScaleSet(stack, "TestVMSS", {
        name: "test-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        enableMigrationAnalysis: false,
      });

      expect(vmss.migrationAnalysis).toBeUndefined();
    });
  });

  describe("Public Methods and Properties", () => {
    let vmss: VirtualMachineScaleSet;

    beforeEach(() => {
      vmss = new VirtualMachineScaleSet(stack, "TestVMSS", {
        name: "test-vmss",
        location: "eastus",
        sku: {
          name: "Standard_D2s_v3",
          tier: "Standard",
          capacity: 5,
        },
        orchestrationMode: "Uniform",
        tags: { environment: "test" },
      });
    });

    it("should have correct id format", () => {
      expect(vmss.id).toMatch(/^\$\{.*\.id\}$/);
    });

    it("should have uniqueId property", () => {
      expect(vmss.uniqueId).toMatch(/^\$\{.*\.output\.properties\.uniqueId\}$/);
    });

    it("should have provisioningState property", () => {
      expect(vmss.provisioningState).toMatch(
        /^\$\{.*\.output\.properties\.provisioningState\}$/,
      );
    });

    it("should have sku property", () => {
      expect(vmss.sku).toEqual({
        name: "Standard_D2s_v3",
        tier: "Standard",
        capacity: 5,
      });
    });

    it("should have capacity property", () => {
      expect(vmss.capacity).toBe(5);
    });

    it("should have orchestrationMode property", () => {
      expect(vmss.orchestrationMode).toBe("Uniform");
    });

    it("should support tag management", () => {
      // Test addTag
      vmss.addTag("newTag", "newValue");
      expect(vmss.props.tags!.newTag).toBe("newValue");
      expect(vmss.props.tags!.environment).toBe("test");

      // Test removeTag
      vmss.removeTag("environment");
      expect(vmss.props.tags!.environment).toBeUndefined();
      expect(vmss.props.tags!.newTag).toBe("newValue");
    });

    it("should add tags when no tags exist", () => {
      const vmssNoTags = new VirtualMachineScaleSet(stack, "NoTagsVMSS", {
        name: "no-tags-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
      });

      vmssNoTags.addTag("firstTag", "firstValue");
      expect(vmssNoTags.props.tags!.firstTag).toBe("firstValue");
    });

    it("should handle removing non-existent tags gracefully", () => {
      expect(() => {
        vmss.removeTag("nonExistentTag");
      }).not.toThrow();
    });
  });

  describe("Resource Creation and Terraform Outputs", () => {
    it("should create Terraform outputs", () => {
      const vmss = new VirtualMachineScaleSet(stack, "TestVMSS", {
        name: "test-vmss-outputs",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
      });

      expect(vmss.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(vmss.locationOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(vmss.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(vmss.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(vmss.uniqueIdOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });

    it("should handle minimal resource creation", () => {
      const vmss = new VirtualMachineScaleSet(stack, "MinimalVMSS", {
        name: "minimal-vmss",
        location: "eastus",
        sku: { name: "Standard_B1s", capacity: 2 },
      });

      expect(vmss).toBeDefined();
      expect(vmss.name).toBe("minimal-vmss");
      expect(vmss.location).toBe("eastus");
      expect(vmss.capacity).toBe(2);
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const vmss = new VirtualMachineScaleSet(stack, "IgnoreChangesVMSS", {
        name: "test-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        ignoreChanges: ["tags", "sku.capacity"],
      });

      expect(vmss).toBeInstanceOf(VirtualMachineScaleSet);
    });

    it("should filter out invalid ignore changes", () => {
      const vmss = new VirtualMachineScaleSet(stack, "FilteredIgnoreVMSS", {
        name: "test-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        ignoreChanges: ["tags", "name", "location"], // name should be filtered
      });

      expect(vmss).toBeInstanceOf(VirtualMachineScaleSet);
    });

    it("should handle empty ignore changes array", () => {
      const vmss = new VirtualMachineScaleSet(stack, "EmptyIgnoreVMSS", {
        name: "test-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        ignoreChanges: [],
      });

      expect(vmss).toBeInstanceOf(VirtualMachineScaleSet);
    });
  });

  describe("JSII Compliance", () => {
    it("should have JSII-compliant constructor", () => {
      expect(() => {
        new VirtualMachineScaleSet(stack, "JsiiTest", {
          name: "jsii-test",
          location: "eastus",
          sku: { name: "Standard_D2s_v3", capacity: 3 },
        });
      }).not.toThrow();
    });

    it("should have JSII-compliant properties", () => {
      const vmss = new VirtualMachineScaleSet(stack, "JsiiProps", {
        name: "jsii-props",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
      });

      expect(typeof vmss.id).toBe("string");
      expect(typeof vmss.name).toBe("string");
      expect(typeof vmss.location).toBe("string");
      expect(typeof vmss.tags).toBe("object");
      expect(typeof vmss.resolvedApiVersion).toBe("string");
      expect(typeof vmss.uniqueId).toBe("string");
    });

    it("should have JSII-compliant methods", () => {
      const vmss = new VirtualMachineScaleSet(stack, "JsiiMethods", {
        name: "jsii-methods",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
      });

      expect(typeof vmss.addTag).toBe("function");
      expect(typeof vmss.removeTag).toBe("function");
      expect(typeof vmss.latestVersion).toBe("function");
      expect(typeof vmss.supportedVersions).toBe("function");
      expect(typeof vmss.analyzeMigrationTo).toBe("function");
    });

    it("should serialize complex objects correctly", () => {
      const vmss = new VirtualMachineScaleSet(stack, "JsiiSerialization", {
        name: "jsii-serialization",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        tags: {
          complex: "value",
          nested: "data",
        },
      });

      // Should be able to serialize validation results
      expect(() => JSON.stringify(vmss.validationResult)).not.toThrow();

      // Should be able to serialize schema
      expect(() => JSON.stringify(vmss.schema)).not.toThrow();

      // Should be able to serialize version config
      expect(() => JSON.stringify(vmss.versionConfig)).not.toThrow();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new VirtualMachineScaleSet(stack, "SynthTest", {
        name: "synth-test",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should handle multiple VMSS in the same stack", () => {
      const vmss1 = new VirtualMachineScaleSet(stack, "VMSS1", {
        name: "vmss-1",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
      });

      const vmss2 = new VirtualMachineScaleSet(stack, "VMSS2", {
        name: "vmss-2",
        location: "westus",
        apiVersion: "2025-02-01",
        sku: { name: "Standard_D2s_v3", capacity: 5 },
      });

      expect(vmss1.resolvedApiVersion).toBe("2025-04-01");
      expect(vmss2.resolvedApiVersion).toBe("2025-02-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });

  describe("Version Compatibility", () => {
    it("should work with all supported API versions", () => {
      const versions = ["2025-01-02", "2025-02-01", "2025-04-01"];

      versions.forEach((version) => {
        const vmss = new VirtualMachineScaleSet(
          stack,
          `VMSS-${version.replace(/-/g, "")}`,
          {
            name: `test-vmss-${version}`,
            location: "eastus",
            apiVersion: version,
            sku: { name: "Standard_D2s_v3", capacity: 3 },
          },
        );

        expect(vmss.resolvedApiVersion).toBe(version);
        expect(vmss.schema.version).toBe(version);
      });
    });

    it("should handle schema differences across versions", () => {
      const versions = ["2025-01-02", "2025-02-01", "2025-04-01"];

      versions.forEach((version) => {
        const vmss = new VirtualMachineScaleSet(
          stack,
          `Schema-${version.replace(/-/g, "")}`,
          {
            name: `schema-test-${version}`,
            location: "eastus",
            apiVersion: version,
            sku: { name: "Standard_D2s_v3", capacity: 3 },
          },
        );

        expect(vmss.schema.properties.location).toBeDefined();
        expect(vmss.schema.properties.sku).toBeDefined();
        expect(vmss.schema.properties.name).toBeDefined();
      });
    });
  });

  describe("Additional Features", () => {
    it("should support proximity placement group", () => {
      const vmss = new VirtualMachineScaleSet(stack, "ProximityVMSS", {
        name: "proximity-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        proximityPlacementGroup: {
          id: "/subscriptions/test/resourceGroups/test-rg/providers/Microsoft.Compute/proximityPlacementGroups/test-ppg",
        },
      });

      expect(vmss.props.proximityPlacementGroup).toBeDefined();
    });

    it("should support host group", () => {
      const vmss = new VirtualMachineScaleSet(stack, "HostGroupVMSS", {
        name: "host-group-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        hostGroup: {
          id: "/subscriptions/test/resourceGroups/test-rg/providers/Microsoft.Compute/hostGroups/test-hg",
        },
      });

      expect(vmss.props.hostGroup).toBeDefined();
    });

    it("should support ultra SSD", () => {
      const vmss = new VirtualMachineScaleSet(stack, "UltraSSDVMSS", {
        name: "ultra-ssd-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 3 },
        additionalCapabilities: {
          ultraSSDEnabled: true,
        },
      });

      expect(vmss.props.additionalCapabilities?.ultraSSDEnabled).toBe(true);
    });

    it("should support scale-in policy", () => {
      const vmss = new VirtualMachineScaleSet(stack, "ScaleInPolicyVMSS", {
        name: "scale-in-policy-vmss",
        location: "eastus",
        sku: { name: "Standard_D2s_v3", capacity: 5 },
        scaleInPolicy: {
          rules: ["Default", "OldestVM"],
          forceDeletion: false,
        },
      });

      expect(vmss.props.scaleInPolicy?.rules).toEqual(["Default", "OldestVM"]);
      expect(vmss.props.scaleInPolicy?.forceDeletion).toBe(false);
    });
  });
});
