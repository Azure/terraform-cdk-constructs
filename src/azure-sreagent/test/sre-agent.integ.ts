/**
 * Integration test for Azure SRE Agent (Microsoft.App/agents)
 *
 * Validates deployment, idempotency, and cleanup of an SRE Agent inside
 * a freshly-created resource group.
 *
 * Run with: npm run integration:nostream
 */

import { Testing } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup/lib/resource-group";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { BaseTestStack, TerraformApplyCheckAndDestroy } from "../../testing";
import { TestRunMetadata } from "../../testing/lib/metadata";
import { SreAgent } from "../lib/sre-agent";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("sreagent-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating SRE Agent usage.
 */
class SreAgentExampleStack extends BaseTestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      testRunOptions: {
        maxAgeHours: testMetadata.maxAgeHours,
        autoCleanup: testMetadata.autoCleanup,
        cleanupPolicy: testMetadata.cleanupPolicy,
      },
    });

    new AzapiProvider(this, "azapi", {});

    const resourceGroupName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "sreagent",
    );
    const agentName = this.generateResourceName(
      "Microsoft.App/agents",
      "sreagent",
    );

    const resourceGroup = new ResourceGroup(this, "test-rg", {
      name: resourceGroupName,
      location: "eastus2",
      tags: {
        ...this.systemTags(),
        purpose: "sre-agent-testing",
      },
    });

    // NOTE: initialSponsorGroupId must be a valid Azure AD object id for the
    // deployment to succeed. In integration scenarios this should be supplied
    // through the testing environment (e.g. an env var). The placeholder GUID
    // below is sufficient for synthesis and plan validation.
    new SreAgent(this, "sre-agent", {
      name: agentName,
      location: "eastus2",
      resourceGroupId: resourceGroup.id,
      identity: { type: "SystemAssigned" },
      agentIdentity: {
        initialSponsorGroupId:
          process.env.SRE_AGENT_SPONSOR_GROUP_ID ||
          "00000000-0000-0000-0000-000000000000",
      },
      upgradeChannel: "Stable",
      tags: {
        ...this.systemTags(),
        example: "complete",
        environment: "test",
      },
    });
  }
}

describe("SreAgent Integration Test", () => {
  it("should deploy the SRE Agent, validate idempotency, and cleanup", () => {
    const app = Testing.app();
    const stack = new SreAgentExampleStack(app, "test-sreagent");
    const synthesized = Testing.fullSynth(stack);

    // 1. Run terraform apply to deploy the SRE Agent
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 600000);
});
