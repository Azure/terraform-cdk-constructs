/**
 * Integration test for Azure Role Assignment
 *
 * This test demonstrates basic usage of the RoleAssignment construct
 * and validates deployment, idempotency, and cleanup.
 *
 * The test assigns built-in Reader role to a test principal
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
import { RoleAssignment } from "../lib/role-assignment";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("role-assignment-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Role Assignment usage
 */
class RoleAssignmentExampleStack extends BaseTestStack {
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

    // Get test principal ID from environment (required for integration tests)
    // This should be the Object ID of a user, group, or service principal
    const principalId =
      process.env.ARM_TEST_PRINCIPAL_ID ||
      "00000000-0000-0000-0000-000000000001";

    // Built-in Azure role definition IDs
    const readerRoleId =
      "/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7";
    const contributorRoleId =
      "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c";

    // Example 1: Assign Reader role at subscription scope
    // Note: name is not needed - Azure generates a deterministic GUID automatically
    new RoleAssignment(this, "reader-assignment", {
      roleDefinitionId: readerRoleId,
      principalId: principalId,
      scope: subscriptionScope,
      principalType: "ServicePrincipal",
      description: "Reader role assignment for integration testing",
      tags: {
        ...this.systemTags(),
        example: "basic",
        role: "reader",
      },
    });

    // Example 2: Assign Contributor role at subscription scope with description
    // Note: name is not needed - Azure generates a deterministic GUID automatically
    new RoleAssignment(this, "contributor-assignment", {
      roleDefinitionId: contributorRoleId,
      principalId: principalId,
      scope: subscriptionScope,
      principalType: "ServicePrincipal",
      description:
        "Contributor role assignment for integration testing - allows resource management but not role assignments",
      tags: {
        ...this.systemTags(),
        example: "advanced",
        role: "contributor",
      },
    });
  }
}

describe("Role Assignment Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup role assignment resources", () => {
    const app = Testing.app();
    const stack = new RoleAssignmentExampleStack(app, "test-role-assignment");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources (role assignments)
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
