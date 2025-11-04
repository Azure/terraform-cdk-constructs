/**
 * Comprehensive tests for the unified VirtualMachine implementation
 *
 * This test suite validates the unified VirtualMachine class that replaces all
 * version-specific implementations using the VersionedAzapiResource framework.
 * Tests cover automatic version resolution, explicit version pinning, schema validation,
 * property transformation, and full backward compatibility.
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import { VirtualMachine, VirtualMachineProps } from "../lib/virtual-machine";
import {
  ALL_VIRTUAL_MACHINE_VERSIONS,
  VIRTUAL_MACHINE_TYPE,
} from "../lib/virtual-machine-schemas";

describe("VirtualMachine - Unified Implementation", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;
  let manager: ApiVersionManager;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    // Ensure Virtual Machine schemas are registered
    try {
      manager.registerResourceType(
        VIRTUAL_MACHINE_TYPE,
        ALL_VIRTUAL_MACHINE_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("Constructor and Basic Properties", () => {
    it("should create virtual machine with automatic latest version resolution", () => {
      const props: VirtualMachineProps = {
        name: "test-vm",
        location: "eastus",
        hardwareProfile: {
          vmSize: "Standard_D2s_v3",
        },
        storageProfile: {
          imageReference: {
            publisher: "Canonical",
            offer: "UbuntuServer",
            sku: "18.04-LTS",
            version: "latest",
          },
          osDisk: {
            createOption: "FromImage",
            managedDisk: {
              storageAccountType: "Premium_LRS",
            },
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/test/resourceGroups/test-rg/providers/Microsoft.Network/networkInterfaces/test-nic",
            },
          ],
        },
      };

      const vm = new VirtualMachine(stack, "TestVM", props);

      expect(vm).toBeInstanceOf(VirtualMachine);
      expect(vm.resolvedApiVersion).toBe("2025-04-01"); // Latest version
      expect(vm.props).toBe(props);
      expect(vm.name).toBe("test-vm");
      expect(vm.location).toBe("eastus");
    });

    it("should create virtual machine with explicit version pinning", () => {
      const props: VirtualMachineProps = {
        name: "test-vm-pinned",
        location: "westus",
        apiVersion: "2024-07-01",
        hardwareProfile: {
          vmSize: "Standard_D2s_v3",
        },
        storageProfile: {
          imageReference: {
            publisher: "Canonical",
            offer: "UbuntuServer",
            sku: "18.04-LTS",
            version: "latest",
          },
          osDisk: {
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/test/resourceGroups/test-rg/providers/Microsoft.Network/networkInterfaces/test-nic",
            },
          ],
        },
        tags: { environment: "test" },
      };

      const vm = new VirtualMachine(stack, "TestVM", props);

      expect(vm.resolvedApiVersion).toBe("2024-07-01");
      expect(vm.tags).toEqual({ environment: "test" });
    });

    it("should create virtual machine with all optional properties", () => {
      const props: VirtualMachineProps = {
        name: "test-vm-full",
        location: "centralus",
        hardwareProfile: {
          vmSize: "Standard_D4s_v3",
        },
        storageProfile: {
          imageReference: {
            publisher: "Canonical",
            offer: "UbuntuServer",
            sku: "18.04-LTS",
            version: "latest",
          },
          osDisk: {
            createOption: "FromImage",
            managedDisk: {
              storageAccountType: "Premium_LRS",
            },
          },
          dataDisks: [
            {
              lun: 0,
              createOption: "Empty",
              diskSizeGB: 512,
            },
          ],
        },
        osProfile: {
          computerName: "testvm",
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
          networkInterfaces: [
            {
              id: "/subscriptions/test/resourceGroups/test-rg/providers/Microsoft.Network/networkInterfaces/test-nic",
            },
          ],
        },
        identity: {
          type: "SystemAssigned",
        },
        zones: ["1", "2"],
        priority: "Regular",
        tags: {
          environment: "production",
          project: "cdktf-constructs",
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            enabled: true,
          },
        },
        ignoreChanges: ["tags", "osProfile.adminPassword"],
        enableValidation: true,
        enableMigrationAnalysis: true,
      };

      const vm = new VirtualMachine(stack, "TestVM", props);

      expect(vm.props.tags).toEqual(props.tags);
      expect(vm.props.identity).toEqual(props.identity);
      expect(vm.props.zones).toEqual(props.zones);
      expect(vm.props.ignoreChanges).toEqual(props.ignoreChanges);
    });

    it("should create Windows VM with Windows configuration", () => {
      const props: VirtualMachineProps = {
        name: "windows-vm",
        location: "eastus",
        hardwareProfile: {
          vmSize: "Standard_D2s_v3",
        },
        storageProfile: {
          imageReference: {
            publisher: "MicrosoftWindowsServer",
            offer: "WindowsServer",
            sku: "2022-datacenter",
            version: "latest",
          },
          osDisk: {
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerName: "winvm",
          adminUsername: "azureuser",
          adminPassword: "P@ssw0rd1234!",
          windowsConfiguration: {
            provisionVMAgent: true,
            enableAutomaticUpdates: true,
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/test/resourceGroups/test-rg/providers/Microsoft.Network/networkInterfaces/test-nic",
            },
          ],
        },
        licenseType: "Windows_Server",
      };

      const vm = new VirtualMachine(stack, "WindowsVM", props);

      expect(vm).toBeInstanceOf(VirtualMachine);
      expect(vm.props.licenseType).toBe("Windows_Server");
      expect(vm.props.osProfile?.windowsConfiguration).toBeDefined();
    });

    it("should create Spot VM with billing profile", () => {
      const props: VirtualMachineProps = {
        name: "spot-vm",
        location: "eastus",
        priority: "Spot",
        evictionPolicy: "Deallocate",
        billingProfile: {
          maxPrice: -1,
        },
        hardwareProfile: {
          vmSize: "Standard_D2s_v3",
        },
        storageProfile: {
          osDisk: {
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/test/resourceGroups/test-rg/providers/Microsoft.Network/networkInterfaces/test-nic",
            },
          ],
        },
      };

      const vm = new VirtualMachine(stack, "SpotVM", props);

      expect(vm.props.priority).toBe("Spot");
      expect(vm.props.evictionPolicy).toBe("Deallocate");
      expect(vm.props.billingProfile?.maxPrice).toBe(-1);
    });
  });

  describe("Framework Integration", () => {
    it("should resolve latest API version automatically", () => {
      const vm = new VirtualMachine(stack, "TestVM", {
        name: "test-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
      });

      expect(vm.resolvedApiVersion).toBe("2025-04-01");
      expect(vm.latestVersion()).toBe("2025-04-01");
    });

    it("should support all registered API versions", () => {
      const vm = new VirtualMachine(stack, "TestVM", {
        name: "test-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
      });

      const supportedVersions = vm.supportedVersions();
      expect(supportedVersions).toContain("2024-07-01");
      expect(supportedVersions).toContain("2024-11-01");
      expect(supportedVersions).toContain("2024-07-01");
    });

    it("should validate version support", () => {
      // Valid version
      expect(() => {
        new VirtualMachine(stack, "ValidVersion", {
          name: "test-vm",
          location: "eastus",
          apiVersion: "2024-11-01",
          hardwareProfile: { vmSize: "Standard_D2s_v3" },
          storageProfile: { osDisk: { createOption: "FromImage" } },
          networkProfile: {
            networkInterfaces: [{ id: "/test/nic" }],
          },
        });
      }).not.toThrow();

      // Invalid version
      expect(() => {
        new VirtualMachine(stack, "InvalidVersion", {
          name: "test-vm",
          location: "eastus",
          apiVersion: "2026-01-01",
          hardwareProfile: { vmSize: "Standard_D2s_v3" },
          storageProfile: { osDisk: { createOption: "FromImage" } },
          networkProfile: {
            networkInterfaces: [{ id: "/test/nic" }],
          },
        });
      }).toThrow("Unsupported API version '2026-01-01'");
    });

    it("should load correct schema for resolved version", () => {
      const vm = new VirtualMachine(stack, "TestVM", {
        name: "test-vm",
        location: "eastus",
        apiVersion: "2024-07-01",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
      });

      expect(vm.schema).toBeDefined();
      expect(vm.schema.resourceType).toBe(VIRTUAL_MACHINE_TYPE);
      expect(vm.schema.version).toBe("2024-07-01");
      expect(vm.schema.properties).toBeDefined();
    });

    it("should load version configuration correctly", () => {
      const vm = new VirtualMachine(stack, "TestVM", {
        name: "test-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
      });

      expect(vm.versionConfig).toBeDefined();
      expect(vm.versionConfig.version).toBe("2025-04-01");
      expect(vm.versionConfig.supportLevel).toBe(VersionSupportLevel.ACTIVE);
    });
  });

  describe("Property Validation", () => {
    it("should validate properties when validation is enabled", () => {
      const props: VirtualMachineProps = {
        name: "test-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        enableValidation: true,
      };

      expect(() => {
        new VirtualMachine(stack, "TestVM", props);
      }).not.toThrow();
    });

    it("should have validation results for valid properties", () => {
      const vm = new VirtualMachine(stack, "TestVM", {
        name: "valid-vm-name",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        enableValidation: true,
      });

      expect(vm.validationResult).toBeDefined();
      expect(vm.validationResult!.valid).toBe(true);
      expect(vm.validationResult!.errors).toHaveLength(0);
    });

    it("should skip validation when disabled", () => {
      const vm = new VirtualMachine(stack, "TestVM", {
        name: "test-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        enableValidation: false,
      });

      expect(vm).toBeDefined();
    });
  });

  describe("Migration Analysis", () => {
    it("should perform migration analysis between versions", () => {
      const vm = new VirtualMachine(stack, "TestVM", {
        name: "test-vm",
        location: "eastus",
        apiVersion: "2024-07-01",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
      });

      const analysis = vm.analyzeMigrationTo("2025-04-01");

      expect(analysis).toBeDefined();
      expect(analysis.fromVersion).toBe("2024-07-01");
      expect(analysis.toVersion).toBe("2025-04-01");
      expect(analysis.compatible).toBe(true);
    });

    it("should skip migration analysis when disabled", () => {
      const vm = new VirtualMachine(stack, "TestVM", {
        name: "test-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        enableMigrationAnalysis: false,
      });

      expect(vm.migrationAnalysis).toBeUndefined();
    });
  });

  describe("Resource Creation and Body", () => {
    it("should create correct resource body", () => {
      const vm = new VirtualMachine(stack, "TestVM", {
        name: "test-vm",
        location: "westus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: {
          imageReference: {
            publisher: "Canonical",
            offer: "UbuntuServer",
            sku: "18.04-LTS",
            version: "latest",
          },
          osDisk: {
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        tags: { environment: "test" },
        identity: { type: "SystemAssigned" },
      });

      expect(vm).toBeDefined();
      expect(vm.props.tags).toEqual({ environment: "test" });
      expect(vm.props.identity).toEqual({ type: "SystemAssigned" });
    });

    it("should handle minimal resource creation", () => {
      const vm = new VirtualMachine(stack, "MinimalVM", {
        name: "minimal-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_B1s" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
      });

      expect(vm).toBeDefined();
      expect(vm.name).toBe("minimal-vm");
      expect(vm.location).toBe("eastus");
      expect(vm.vmSize).toBe("Standard_B1s");
    });

    it("should create Terraform outputs", () => {
      const vm = new VirtualMachine(stack, "TestVM", {
        name: "test-vm-outputs",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
      });

      expect(vm.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(vm.locationOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(vm.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(vm.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(vm.vmIdOutput).toBeInstanceOf(cdktf.TerraformOutput);
    });
  });

  describe("Public Methods and Properties", () => {
    let vm: VirtualMachine;

    beforeEach(() => {
      vm = new VirtualMachine(stack, "TestVM", {
        name: "test-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: {
          osDisk: { createOption: "FromImage" },
        },
        osProfile: {
          computerName: "testcomputer",
          adminUsername: "azureuser",
        },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        tags: { environment: "test" },
      });
    });

    it("should have correct id format", () => {
      expect(vm.id).toMatch(/^\$\{.*\.id\}$/);
    });

    it("should have vmId property", () => {
      expect(vm.vmId).toMatch(/^\$\{.*\.output\.properties\.vmId\}$/);
    });

    it("should have provisioningState property", () => {
      expect(vm.provisioningState).toMatch(
        /^\$\{.*\.output\.properties\.provisioningState\}$/,
      );
    });

    it("should have computerName property", () => {
      expect(vm.computerName).toBe("testcomputer");
    });

    it("should have vmSize property", () => {
      expect(vm.vmSize).toBe("Standard_D2s_v3");
    });

    it("should support tag management", () => {
      // Test addTag
      vm.addTag("newTag", "newValue");
      expect(vm.props.tags!.newTag).toBe("newValue");
      expect(vm.props.tags!.environment).toBe("test");

      // Test removeTag
      vm.removeTag("environment");
      expect(vm.props.tags!.environment).toBeUndefined();
      expect(vm.props.tags!.newTag).toBe("newValue");
    });

    it("should add tags when no tags exist", () => {
      const vmNoTags = new VirtualMachine(stack, "NoTagsVM", {
        name: "no-tags-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
      });

      vmNoTags.addTag("firstTag", "firstValue");
      expect(vmNoTags.props.tags!.firstTag).toBe("firstValue");
    });

    it("should handle removing non-existent tags gracefully", () => {
      expect(() => {
        vm.removeTag("nonExistentTag");
      }).not.toThrow();
    });
  });

  describe("Ignore Changes Configuration", () => {
    it("should apply ignore changes lifecycle rules", () => {
      const vm = new VirtualMachine(stack, "IgnoreChangesVM", {
        name: "test-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        ignoreChanges: ["tags", "osProfile.adminPassword"],
      });

      expect(vm).toBeInstanceOf(VirtualMachine);
    });

    it("should filter out invalid ignore changes", () => {
      const vm = new VirtualMachine(stack, "FilteredIgnoreVM", {
        name: "test-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        ignoreChanges: ["tags", "name", "location"], // name should be filtered
      });

      expect(vm).toBeInstanceOf(VirtualMachine);
    });

    it("should handle empty ignore changes array", () => {
      const vm = new VirtualMachine(stack, "EmptyIgnoreVM", {
        name: "test-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        ignoreChanges: [],
      });

      expect(vm).toBeInstanceOf(VirtualMachine);
    });
  });

  describe("Version Compatibility", () => {
    it("should work with all supported API versions", () => {
      const versions = ["2024-07-01", "2024-11-01", "2025-04-01"];

      versions.forEach((version) => {
        const vm = new VirtualMachine(
          stack,
          `VM-${version.replace(/-/g, "")}`,
          {
            name: `test-vm-${version}`,
            location: "eastus",
            apiVersion: version,
            hardwareProfile: { vmSize: "Standard_D2s_v3" },
            storageProfile: { osDisk: { createOption: "FromImage" } },
            networkProfile: {
              networkInterfaces: [{ id: "/test/nic" }],
            },
          },
        );

        expect(vm.resolvedApiVersion).toBe(version);
        expect(vm.schema.version).toBe(version);
      });
    });

    it("should handle schema differences across versions", () => {
      const versions = ["2024-07-01", "2024-11-01", "2025-04-01"];

      versions.forEach((version) => {
        const vm = new VirtualMachine(
          stack,
          `Schema-${version.replace(/-/g, "")}`,
          {
            name: `schema-test-${version}`,
            location: "eastus",
            apiVersion: version,
            hardwareProfile: { vmSize: "Standard_D2s_v3" },
            storageProfile: { osDisk: { createOption: "FromImage" } },
            networkProfile: {
              networkInterfaces: [{ id: "/test/nic" }],
            },
          },
        );

        expect(vm.schema.properties.location).toBeDefined();
        expect(vm.schema.properties.hardwareProfile).toBeDefined();
        expect(vm.schema.properties.storageProfile).toBeDefined();
        expect(vm.schema.properties.networkProfile).toBeDefined();
      });
    });
  });

  describe("VM Configuration Scenarios", () => {
    it("should support VM with data disks", () => {
      const vm = new VirtualMachine(stack, "DataDisksVM", {
        name: "data-disks-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: {
          osDisk: { createOption: "FromImage" },
          dataDisks: [
            {
              lun: 0,
              createOption: "Empty",
              diskSizeGB: 512,
              managedDisk: {
                storageAccountType: "Premium_LRS",
              },
            },
            {
              lun: 1,
              createOption: "Empty",
              diskSizeGB: 1024,
              managedDisk: {
                storageAccountType: "Premium_LRS",
              },
            },
          ],
        },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
      });

      expect(vm.props.storageProfile.dataDisks).toHaveLength(2);
      expect(vm.props.storageProfile.dataDisks![0].lun).toBe(0);
      expect(vm.props.storageProfile.dataDisks![1].lun).toBe(1);
    });

    it("should support VM with managed identity", () => {
      const vm = new VirtualMachine(stack, "ManagedIdentityVM", {
        name: "identity-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        identity: {
          type: "UserAssigned",
          userAssignedIdentities: {
            "/subscriptions/test/resourceGroups/test-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/test-identity":
              {},
          },
        },
      });

      expect(vm.props.identity?.type).toBe("UserAssigned");
      expect(vm.props.identity?.userAssignedIdentities).toBeDefined();
    });

    it("should support VM in availability zones", () => {
      const vm = new VirtualMachine(stack, "ZonalVM", {
        name: "zonal-vm",
        location: "eastus",
        zones: ["1"],
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
      });

      expect(vm.props.zones).toEqual(["1"]);
    });

    it("should support VM with boot diagnostics", () => {
      const vm = new VirtualMachine(stack, "BootDiagVM", {
        name: "bootdiag-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            enabled: true,
            storageUri: "https://teststorage.blob.core.windows.net",
          },
        },
      });

      expect(vm.props.diagnosticsProfile?.bootDiagnostics?.enabled).toBe(true);
    });

    it("should support VM with security profile", () => {
      const vm = new VirtualMachine(stack, "SecureVM", {
        name: "secure-vm",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        securityProfile: {
          uefiSettings: {
            secureBootEnabled: true,
            vTpmEnabled: true,
          },
          securityType: "TrustedLaunch",
        },
      });

      expect(vm.props.securityProfile?.uefiSettings?.secureBootEnabled).toBe(
        true,
      );
      expect(vm.props.securityProfile?.securityType).toBe("TrustedLaunch");
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid API versions gracefully", () => {
      expect(() => {
        new VirtualMachine(stack, "InvalidAPI", {
          name: "test-vm",
          location: "eastus",
          apiVersion: "invalid-version",
          hardwareProfile: { vmSize: "Standard_D2s_v3" },
          storageProfile: { osDisk: { createOption: "FromImage" } },
          networkProfile: {
            networkInterfaces: [{ id: "/test/nic" }],
          },
        });
      }).toThrow("Unsupported API version 'invalid-version'");
    });

    it("should handle schema registration errors gracefully", () => {
      expect(() => {
        new VirtualMachine(stack, "SchemaTest", {
          name: "test-vm",
          location: "eastus",
          hardwareProfile: { vmSize: "Standard_D2s_v3" },
          storageProfile: { osDisk: { createOption: "FromImage" } },
          networkProfile: {
            networkInterfaces: [{ id: "/test/nic" }],
          },
        });
      }).not.toThrow();
    });
  });

  describe("JSII Compliance", () => {
    it("should have JSII-compliant constructor", () => {
      expect(() => {
        new VirtualMachine(stack, "JsiiTest", {
          name: "jsii-test",
          location: "eastus",
          hardwareProfile: { vmSize: "Standard_D2s_v3" },
          storageProfile: { osDisk: { createOption: "FromImage" } },
          networkProfile: {
            networkInterfaces: [{ id: "/test/nic" }],
          },
        });
      }).not.toThrow();
    });

    it("should have JSII-compliant properties", () => {
      const vm = new VirtualMachine(stack, "JsiiProps", {
        name: "jsii-props",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
      });

      expect(typeof vm.id).toBe("string");
      expect(typeof vm.name).toBe("string");
      expect(typeof vm.location).toBe("string");
      expect(typeof vm.tags).toBe("object");
      expect(typeof vm.resolvedApiVersion).toBe("string");
      expect(typeof vm.vmId).toBe("string");
      expect(typeof vm.vmSize).toBe("string");
    });

    it("should have JSII-compliant methods", () => {
      const vm = new VirtualMachine(stack, "JsiiMethods", {
        name: "jsii-methods",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
      });

      expect(typeof vm.addTag).toBe("function");
      expect(typeof vm.removeTag).toBe("function");
      expect(typeof vm.latestVersion).toBe("function");
      expect(typeof vm.supportedVersions).toBe("function");
      expect(typeof vm.analyzeMigrationTo).toBe("function");
    });

    it("should serialize complex objects correctly", () => {
      const vm = new VirtualMachine(stack, "JsiiSerialization", {
        name: "jsii-serialization",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        tags: {
          complex: "value",
          nested: "data",
        },
      });

      // Should be able to serialize validation results
      expect(() => JSON.stringify(vm.validationResult)).not.toThrow();

      // Should be able to serialize schema
      expect(() => JSON.stringify(vm.schema)).not.toThrow();

      // Should be able to serialize version config
      expect(() => JSON.stringify(vm.versionConfig)).not.toThrow();
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize to valid Terraform configuration", () => {
      new VirtualMachine(stack, "SynthTest", {
        name: "synth-test",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic" }],
        },
        tags: { test: "synthesis" },
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should work in complex CDK constructs", () => {
      class ComplexConstruct extends cdktf.TerraformStack {
        constructor(scope: cdktf.App, id: string) {
          super(scope, id);

          // Create multiple VMs
          const vm1 = new VirtualMachine(this, "PrimaryVM", {
            name: "primary-vm",
            location: "eastus",
            hardwareProfile: { vmSize: "Standard_D2s_v3" },
            storageProfile: { osDisk: { createOption: "FromImage" } },
            networkProfile: {
              networkInterfaces: [{ id: "/test/nic1" }],
            },
            tags: { tier: "primary" },
          });

          const vm2 = new VirtualMachine(this, "SecondaryVM", {
            name: "secondary-vm",
            location: "westus",
            apiVersion: "2024-07-01",
            hardwareProfile: { vmSize: "Standard_D2s_v3" },
            storageProfile: { osDisk: { createOption: "FromImage" } },
            networkProfile: {
              networkInterfaces: [{ id: "/test/nic2" }],
            },
            tags: { tier: "secondary" },
          });

          // Create outputs that reference the VMs
          new cdktf.TerraformOutput(this, "PrimaryVMId", {
            value: vm1.id,
          });

          new cdktf.TerraformOutput(this, "SecondaryVMId", {
            value: vm2.id,
          });
        }
      }

      expect(() => {
        new ComplexConstruct(app, "ComplexStack");
      }).not.toThrow();
    });

    it("should handle multiple VMs in the same stack", () => {
      const vm1 = new VirtualMachine(stack, "VM1", {
        name: "vm-1",
        location: "eastus",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic1" }],
        },
      });

      const vm2 = new VirtualMachine(stack, "VM2", {
        name: "vm-2",
        location: "westus",
        apiVersion: "2024-11-01",
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: { osDisk: { createOption: "FromImage" } },
        networkProfile: {
          networkInterfaces: [{ id: "/test/nic2" }],
        },
      });

      expect(vm1.resolvedApiVersion).toBe("2025-04-01");
      expect(vm2.resolvedApiVersion).toBe("2024-11-01");

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();
    });
  });
});
