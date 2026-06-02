/**
 * Integration test for Azure Static Web App
 *
 * This test demonstrates basic usage of the StaticWebApp construct
 * and validates deployment, idempotency, and cleanup.
 *
 * Run with: npm run integration:nostream
 */

import { Testing, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import "cdktf/lib/testing/adapters/jest";
import { ResourceGroup } from "../../azure-resourcegroup";
import { AzapiProvider } from "../../core-azure/lib/azapi/providers-azapi/provider";
import { TerraformApplyCheckAndDestroy } from "../../testing";
import { StaticWebApp } from "../lib/static-web-app";

/**
 * Example stack demonstrating Static Web App usage
 */
class StaticWebAppExampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Configure AZAPI provider
    new AzapiProvider(this, "azapi", {});

    // Create a resource group (Static Web Apps location is independent of the RG location)
    const resourceGroup = new ResourceGroup(this, "example-rg", {
      name: "staticwebapp-example-rg",
      location: "eastus2",
      tags: {
        environment: "example",
        purpose: "integration-test",
      },
    });

    // Example 1: Basic Free-tier Static Web App without source control integration
    new StaticWebApp(this, "basic-static-web-app", {
      name: "swa-basic-example",
      // Static Web Apps have a constrained set of supported regions
      location: "eastus2",
      resourceGroupId: resourceGroup.id,
      sku: {
        name: "Free",
        tier: "Free",
      },
      tags: {
        example: "basic",
      },
    });

    // Example 2: Static Web App with a specific API version pin
    new StaticWebApp(this, "versioned-static-web-app", {
      name: "swa-versioned-example",
      location: "eastus2",
      resourceGroupId: resourceGroup.id,
      sku: {
        name: "Free",
        tier: "Free",
      },
      apiVersion: "2023-12-01",
      tags: {
        example: "versioned",
      },
    });
  }
}

describe("Static Web App Integration Test", () => {
  it("should deploy, validate idempotency, and cleanup static web app resources", () => {
    const app = Testing.app();
    const stack = new StaticWebAppExampleStack(app, "test-static-web-app");
    const synthesized = Testing.fullSynth(stack);

    // This will:
    // 1. Run terraform apply to deploy resources
    // 2. Run terraform plan to check idempotency (no changes expected)
    // 3. Run terraform destroy to cleanup resources
    TerraformApplyCheckAndDestroy(synthesized);
  }, 600000); // 10 minute timeout for deployment and cleanup
});
