/**
 * Integration test for Azure Policy Definition
 *
 * This test demonstrates basic usage of the PolicyDefinition construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { PolicyDefinition } from "../lib/policy-definition";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("policy-definition-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Policy Definition usage
 */
class PolicyDefinitionExampleStack extends BaseTestStack {
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

    // Generate unique names for policy definitions
    const basicPolicyName = this.generateResourceName(
      "Microsoft.Authorization/policyDefinitions",
      "basic",
    );
    const parameterizedPolicyName = this.generateResourceName(
      "Microsoft.Authorization/policyDefinitions",
      "param",
    );

    // Example 1: Basic policy definition that denies resources without required tags
    new PolicyDefinition(this, "basic-policy", {
      name: basicPolicyName,
      displayName: "Require Environment Tag",
      description: "This policy ensures that resources have an Environment tag",
      policyType: "Custom",
      mode: "Indexed",
      policyRule: {
        if: {
          field: "tags['Environment']",
          exists: "false",
        },
        then: {
          effect: "deny",
        },
      },
      metadata: {
        category: "Tags",
        version: "1.0.0",
      },
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });

    // Example 2: Policy definition with parameters for flexible enforcement
    new PolicyDefinition(this, "parameterized-policy", {
      name: parameterizedPolicyName,
      displayName: "Require Specific Tag with Allowed Values",
      description:
        "This policy ensures that resources have a specific tag with a value from an allowed list",
      policyType: "Custom",
      mode: "All",
      policyRule: {
        if: {
          allOf: [
            {
              field: "[concat('tags[', parameters('tagName'), ']')]",
              exists: "true",
            },
            {
              field: "[concat('tags[', parameters('tagName'), ']')]",
              notIn: "[parameters('allowedValues')]",
            },
          ],
        },
        then: {
          effect: "[parameters('effect')]",
        },
      },
      parameters: {
        tagName: {
          type: "String",
          metadata: {
            displayName: "Tag Name",
            description: "Name of the tag to check",
          },
          defaultValue: "CostCenter",
        },
        allowedValues: {
          type: "Array",
          metadata: {
            displayName: "Allowed Tag Values",
            description: "List of allowed values for the tag",
          },
          defaultValue: ["Engineering", "Marketing", "Operations"],
        },
        effect: {
          type: "String",
          metadata: {
            displayName: "Effect",
            description: "The effect of the policy (audit or deny)",
          },
          allowedValues: ["audit", "deny"],
          defaultValue: "audit",
        },
      },
      metadata: {
        category: "Tags",
        version: "1.0.0",
      },
      tags: {
        ...this.systemTags(),
        example: "parameterized",
      },
    });
  }
}

describe("Policy Definition Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup policy definition resources", () => {
    const app = Testing.app();
    const stack = new PolicyDefinitionExampleStack(
      app,
      "test-policy-definition",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000); // 10 minute timeout for deployment and cleanup
});
