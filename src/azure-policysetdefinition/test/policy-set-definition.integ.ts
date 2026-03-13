/**
 * Integration test for Azure Policy Set Definition (Initiative)
 *
 * This test demonstrates basic usage of the PolicySetDefinition construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { DataAzapiClientConfig } from "../../core-azure/lib/azapi/providers-azapi/data-azapi-client-config";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { TerraformApplyCheckAndDestroy } from "../../testing";
import { PolicySetDefinition } from "../lib/policy-set-definition";

/**
 * Example stack demonstrating Policy Set Definition usage
 */
class PolicySetDefinitionExampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Create a client config to get the current subscription ID
    const clientConfig = new DataAzapiClientConfig(this, "client_config", {});

    // Use the current subscription for policy definitions
    const subscriptionId = `/subscriptions/\${${clientConfig.fqn}.subscription_id}`;

    // Basic Policy Set Definition with built-in policies
    new PolicySetDefinition(this, "basic-initiative", {
      displayName: "Basic Security Initiative",
      description:
        "A simple initiative to demonstrate Policy Set Definition construct",
      scope: subscriptionId,
      policyDefinitions: [
        {
          // Audit VMs that do not use managed disks
          policyDefinitionId:
            "/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d",
          policyDefinitionReferenceId: "auditManagedDisks",
        },
      ],
    });
  }
}

describe("Policy Set Definition Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup Policy Set Definition resources", () => {
    const app = Testing.app();
    const stack = new PolicySetDefinitionExampleStack(
      app,
      "test-policy-set-definition",
    );
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 600000); // 10 minute timeout for deployment and cleanup
});
