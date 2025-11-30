/**
 * Integration test for Azure Policy Assignment
 *
 * This test demonstrates basic usage of the PolicyAssignment construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Note: This test requires a policy definition to exist before assigning it.
 * It creates a simple policy definition first, then creates assignments
 * that reference it.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { PolicyDefinition } from "../../azure-policydefinition";
import { DataAzapiClientConfig } from "../../core-azure/lib/azapi/providers-azapi/data-azapi-client-config";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { PolicyAssignment } from "../lib/policy-assignment";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("policy-assignment-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Policy Assignment usage
 */
class PolicyAssignmentExampleStack extends BaseTestStack {
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

    // Get the current subscription ID from Azure
    const clientConfig = new DataAzapiClientConfig(
      this,
      "client_config_default",
    );

    // Generate unique names
    const policyDefinitionName = this.generateResourceName(
      "Microsoft.Authorization/policyDefinitions",
      "testpolicy",
    );
    const basicAssignmentName = this.generateResourceName(
      "Microsoft.Authorization/policyAssignments",
      "basic",
    );
    const advancedAssignmentName = this.generateResourceName(
      "Microsoft.Authorization/policyAssignments",
      "advanced",
    );

    // First, create a policy definition to assign
    const policyDefinition = new PolicyDefinition(this, "test-policy", {
      name: policyDefinitionName,
      displayName: "Test Policy for Assignment",
      description: "A simple test policy used to validate policy assignments",
      policyType: "Custom",
      mode: "Indexed",
      policyRule: {
        if: {
          field: "[concat('tags[''', parameters('tagName'), ''']')]",
          exists: "false",
        },
        then: {
          effect: "audit",
        },
      },
      parameters: {
        tagName: {
          type: "String",
          metadata: {
            displayName: "Tag Name",
            description: "Name of the tag to check",
          },
          defaultValue: "TestTag",
        },
      },
      metadata: {
        category: "Testing",
        version: "1.0.0",
      },
      tags: {
        ...this.systemTags(),
        purpose: "integration-test",
      },
    });

    // Use the actual subscription ID from the client config data source
    const subscriptionScope = `/subscriptions/${clientConfig.subscriptionId}`;

    // Example 1: Basic policy assignment at subscription scope
    // Add explicit dependsOn for proper destroy ordering
    new PolicyAssignment(this, "basic-assignment", {
      name: basicAssignmentName,
      displayName: "Basic Policy Assignment",
      description: "A basic policy assignment for testing",
      policyDefinitionId: policyDefinition.id,
      scope: subscriptionScope,
      enforcementMode: "Default",
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
      // IMPORTANT: Add explicit dependency on policy definition to ensure:
      // 1. Policy definition is created before assignment (apply)
      // 2. Policy assignment is destroyed before definition (destroy)
      // Azure RBAC/Policy has eventual consistency - explicit deps help ordering
      dependsOn: [policyDefinition.resource],
    });

    // Example 2: Advanced policy assignment with parameters, identity, and non-compliance messages
    // Add explicit dependsOn for proper destroy ordering
    new PolicyAssignment(this, "advanced-assignment", {
      name: advancedAssignmentName,
      location: "eastus", // Required when identity is specified
      displayName: "Advanced Policy Assignment",
      description: "An advanced policy assignment with parameters and identity",
      policyDefinitionId: policyDefinition.id,
      scope: subscriptionScope,
      enforcementMode: "DoNotEnforce", // Audit mode
      parameters: {
        tagName: {
          value: "Environment",
        },
      },
      metadata: {
        assignedBy: "integration-test",
        assignmentDate: new Date().toISOString(),
      },
      identity: {
        type: "SystemAssigned",
      },
      nonComplianceMessages: [
        {
          message:
            "Resources must have the required tag. This is a test policy assignment.",
        },
      ],
      tags: {
        ...this.systemTags(),
        example: "advanced",
      },
      // IMPORTANT: Add explicit dependency on policy definition to ensure:
      // 1. Policy definition is created before assignment (apply)
      // 2. Policy assignment is destroyed before definition (destroy)
      dependsOn: [policyDefinition.resource],
    });
  }
}

describe("Policy Assignment Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup policy assignment resources", () => {
    const app = Testing.app();
    const stack = new PolicyAssignmentExampleStack(
      app,
      "test-policy-assignment",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources (policy definition and assignments)
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
