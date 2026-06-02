/**
 * Integration test for Azure Cosmos DB Account
 *
 * This test demonstrates basic usage of the CosmosDbAccount construct
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
import { CosmosDbAccount } from "../lib/cosmos-db";

// Generate unique test run metadata for this test suite
const testMetadata = new TestRunMetadata("cosmos-db-integration", {
  maxAgeHours: 4,
});

/**
 * Example stack demonstrating Cosmos DB Account usage
 */
class CosmosDbExampleStack extends BaseTestStack {
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

    // Create a resource group
    const rgName = this.generateResourceName(
      "Microsoft.Resources/resourceGroups",
      "cosmos",
    );

    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: rgName,
      location: "centralus",
      tags: {
        ...this.systemTags(),
      },
    });

    // Generate unique cosmos db account names (must be globally unique)
    const basicName = this.generateResourceName(
      "Microsoft.DocumentDB/databaseAccounts",
      "basic",
    );
    const versionedName = this.generateResourceName(
      "Microsoft.DocumentDB/databaseAccounts",
      "vers",
    );
    const serverlessName = this.generateResourceName(
      "Microsoft.DocumentDB/databaseAccounts",
      "srvls",
    );

    // Example 1: Basic Cosmos DB account (Core SQL API)
    new CosmosDbAccount(this, "basic-cosmos", {
      name: basicName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      tags: {
        ...this.systemTags(),
        example: "basic",
      },
    });

    // Example 2: Cosmos DB account with specific API version and Strong consistency
    new CosmosDbAccount(this, "versioned-cosmos", {
      name: versionedName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      apiVersion: "2024-05-15",
      consistencyPolicy: {
        defaultConsistencyLevel: "Strong",
      },
      tags: {
        ...this.systemTags(),
        example: "versioned",
      },
    });

    // Example 3: Serverless Cosmos DB account
    new CosmosDbAccount(this, "serverless-cosmos", {
      name: serverlessName,
      location: resourceGroup.props.location!,
      resourceGroupId: resourceGroup.id,
      capabilities: [{ name: "EnableServerless" }],
      tags: {
        ...this.systemTags(),
        example: "serverless",
      },
    });
  }
}

describe("Cosmos DB Account Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup cosmos db resources", () => {
    const app = Testing.app();
    const stack = new CosmosDbExampleStack(app, "test-cosmos-db");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized, { verifyCleanup: true });
  }, 1800000); // 30 minute timeout (Cosmos DB account creation is slow)
});
