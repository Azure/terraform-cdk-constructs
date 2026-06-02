/**
 * Integration test for Azure Key Vault
 *
 * This test demonstrates basic usage of the KeyVault construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { KeyVault } from "../lib/key-vault";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("key-vault-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Key Vault usage
 */
class KeyVaultExampleStack extends BaseTestStack {
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
      "kv",
    );

    // Create a resource group
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: rgName,
      location: "eastus",
      tags: {
        ...this.systemTags(),
      },
    });

    // Generate unique Key Vault names (must be globally unique, 3-24 chars)
    const basicKvName = this.generateResourceName(
      "Microsoft.KeyVault/vaults",
      "basic",
    );
    const versionedKvName = this.generateResourceName(
      "Microsoft.KeyVault/vaults",
      "ver",
    );
    const securedKvName = this.generateResourceName(
      "Microsoft.KeyVault/vaults",
      "sec",
    );

    // Example 1: Basic Key Vault using current tenant from AZAPI client config
    new KeyVault(this, "basic-keyvault", {
      name: basicKvName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      // softDeleteRetentionInDays minimum 7 keeps test cleanup quick
      softDeleteRetentionInDays: 7,
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });

    // Example 2: Key Vault with specific API version and Premium SKU
    new KeyVault(this, "versioned-keyvault", {
      name: versionedKvName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "premium" },
      apiVersion: "2023-07-01",
      softDeleteRetentionInDays: 7,
      tags: {
        ...this.systemTags(),
        example: "versioned",
      },
    });

    // Example 3: Key Vault with hardened network and security settings
    new KeyVault(this, "secured-keyvault", {
      name: securedKvName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      sku: { name: "standard" },
      enableRbacAuthorization: true,
      enableSoftDelete: true,
      softDeleteRetentionInDays: 7,
      publicNetworkAccess: "Enabled",
      networkAcls: {
        defaultAction: "Allow",
        bypass: "AzureServices",
      },
      tags: {
        ...this.systemTags(),
        example: "secured",
      },
    });
  }
}

describe("Key Vault Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup key vault resources", () => {
    const app = Testing.app();
    const stack = new KeyVaultExampleStack(app, "test-key-vault");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 1200000); // 20 minute timeout for deployment and cleanup
});
