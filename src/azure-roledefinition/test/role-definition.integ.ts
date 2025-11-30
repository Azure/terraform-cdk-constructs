/**
 * Integration test for Azure Role Definition
 *
 * This test demonstrates basic usage of the RoleDefinition construct
 * and validates deployment, idempotency, and cleanup.
 *
 * The test creates custom RBAC roles with various permission configurations
 * at subscription scope.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { execSync } from "child_process";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { RoleDefinition } from "../lib/role-definition";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("role-definition-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Role Definition usage
 */
class RoleDefinitionExampleStack extends BaseTestStack {
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

    // Get the subscription ID dynamically from Azure CLI or environment variable
    let subscriptionId: string;
    try {
      subscriptionId =
        process.env.ARM_SUBSCRIPTION_ID ||
        execSync("az account show --query id -o tsv", {
          encoding: "utf-8",
        }).trim();
    } catch (error) {
      throw new Error(
        "Failed to get Azure subscription ID. Please ensure you are logged in with 'az login' or set ARM_SUBSCRIPTION_ID environment variable.",
      );
    }
    const subscriptionScope = `/subscriptions/${subscriptionId}`;

    // Note: Role definition IDs are auto-generated as GUIDs by Azure.
    // The 'name' parameter is not needed - Azure uses guid() to generate
    // deterministic IDs based on deployment context for idempotency.
    // Use 'roleName' for the human-readable display name and 'description'
    // for additional context.

    // Example 1: Basic read-only role for compute resources
    new RoleDefinition(this, "vm-reader-role", {
      roleName: "Virtual Machine Reader",
      description:
        "Can view virtual machines and their properties but cannot perform any actions",
      type: "CustomRole",
      permissions: [
        {
          actions: [
            "Microsoft.Compute/virtualMachines/read",
            "Microsoft.Compute/virtualMachines/instanceView/read",
            "Microsoft.Compute/disks/read",
            "Microsoft.Compute/snapshots/read",
            "Microsoft.Network/networkInterfaces/read",
            "Microsoft.Network/publicIPAddresses/read",
          ],
          notActions: [],
          dataActions: [],
          notDataActions: [],
        },
      ],
      assignableScopes: [subscriptionScope],
      tags: {
        ...this.systemTags(),
        example: "basic",
        purpose: "read-only-compute",
      },
    });

    // Example 2: Advanced role with control plane and data plane permissions
    new RoleDefinition(this, "storage-operator-role", {
      roleName: "Storage Operator",
      description:
        "Can manage storage accounts and read/write blob data but cannot delete resources",
      type: "CustomRole",
      permissions: [
        {
          // Control plane actions - manage storage accounts
          actions: [
            "Microsoft.Storage/storageAccounts/read",
            "Microsoft.Storage/storageAccounts/write",
            "Microsoft.Storage/storageAccounts/listkeys/action",
            "Microsoft.Storage/storageAccounts/regeneratekey/action",
            "Microsoft.Storage/storageAccounts/blobServices/containers/read",
            "Microsoft.Storage/storageAccounts/blobServices/containers/write",
          ],
          // Explicitly deny delete operations
          notActions: [
            "Microsoft.Storage/storageAccounts/delete",
            "Microsoft.Storage/storageAccounts/blobServices/containers/delete",
          ],
          // Data plane actions - read and write blobs
          dataActions: [
            "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
            "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write",
            "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action",
          ],
          // Explicitly deny delete operations on data plane
          notDataActions: [
            "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete",
          ],
        },
      ],
      assignableScopes: [
        subscriptionScope,
        // Can also be assigned at resource group level
        `${subscriptionScope}/resourceGroups/storage-rg`,
      ],
      tags: {
        ...this.systemTags(),
        example: "advanced",
        purpose: "storage-operations",
      },
    });
  }
}

describe("Role Definition Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup role definition resources", () => {
    const app = Testing.app();
    const stack = new RoleDefinitionExampleStack(app, "test-role-definition");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources (custom role definitions)
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
