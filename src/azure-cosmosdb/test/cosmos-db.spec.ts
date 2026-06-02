/**
 * Unit tests for Azure Cosmos DB Account using VersionedAzapiResource framework
 */

import { Testing } from "cdktf";
import * as cdktf from "cdktf";
import { ResourceGroup } from "../../azure-resourcegroup";
import { CosmosDbAccount, CosmosDbAccountProps } from "../lib/cosmos-db";

describe("CosmosDbAccount", () => {
  let app: cdktf.App;
  let stack: cdktf.TerraformStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktf.TerraformStack(app, "TestStack");
  });

  describe("constructor", () => {
    it("should create a cosmos db account with required properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosaccount",
        location: "eastus",
        resourceGroupId: rg.id,
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos).toBeInstanceOf(CosmosDbAccount);
      expect(cosmos.props).toBe(props);
    });

    it("should create a cosmos db account with all properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosaccount",
        location: "eastus",
        resourceGroupId: rg.id,
        kind: "GlobalDocumentDB",
        consistencyPolicy: {
          defaultConsistencyLevel: "Strong",
        },
        capabilities: [{ name: "EnableServerless" }],
        publicNetworkAccess: "Enabled",
        enableAutomaticFailover: false,
        minimalTlsVersion: "Tls12",
        tags: {
          environment: "test",
          project: "cdktf-constructs",
        },
        identity: {
          type: "SystemAssigned",
        },
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos.props).toBe(props);
      expect(cosmos.tags).toEqual(props.tags);
    });

    it("should use default values for optional properties", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosaccount",
        location: "eastus",
        resourceGroupId: rg.id,
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos).toBeInstanceOf(CosmosDbAccount);
    });

    it("should create terraform outputs", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosaccount",
        location: "eastus",
        resourceGroupId: rg.id,
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos.idOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(cosmos.locationOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(cosmos.nameOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(cosmos.tagsOutput).toBeInstanceOf(cdktf.TerraformOutput);
      expect(cosmos.documentEndpointOutput).toBeInstanceOf(
        cdktf.TerraformOutput,
      );
    });
  });

  describe("kind configuration", () => {
    it("should accept GlobalDocumentDB kind", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosaccount",
        location: "eastus",
        resourceGroupId: rg.id,
        kind: "GlobalDocumentDB",
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos.props.kind).toBe("GlobalDocumentDB");
    });

    it("should accept MongoDB kind", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosmongo",
        location: "eastus",
        resourceGroupId: rg.id,
        kind: "MongoDB",
        capabilities: [{ name: "EnableMongo" }],
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos.props.kind).toBe("MongoDB");
    });
  });

  describe("consistency policy", () => {
    it("should configure Session consistency by default when none provided", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosconsistency",
        location: "eastus",
        resourceGroupId: rg.id,
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos).toBeInstanceOf(CosmosDbAccount);
    });

    it("should configure Strong consistency when specified", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosstrong",
        location: "eastus",
        resourceGroupId: rg.id,
        consistencyPolicy: {
          defaultConsistencyLevel: "Strong",
        },
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos.props.consistencyPolicy?.defaultConsistencyLevel).toBe(
        "Strong",
      );
    });

    it("should configure BoundedStaleness consistency", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosbounded",
        location: "eastus",
        resourceGroupId: rg.id,
        consistencyPolicy: {
          defaultConsistencyLevel: "BoundedStaleness",
          maxIntervalInSeconds: 86400,
          maxStalenessPrefix: 1000000,
        },
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos.props.consistencyPolicy?.defaultConsistencyLevel).toBe(
        "BoundedStaleness",
      );
      expect(cosmos.props.consistencyPolicy?.maxIntervalInSeconds).toBe(86400);
    });
  });

  describe("multi-region configuration", () => {
    it("should configure multiple geo locations with failover", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosgeo",
        location: "eastus",
        resourceGroupId: rg.id,
        enableAutomaticFailover: true,
        geoLocations: [
          {
            locationName: "eastus",
            failoverPriority: 0,
            isZoneRedundant: true,
          },
          { locationName: "westus", failoverPriority: 1 },
        ],
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos.props.enableAutomaticFailover).toBe(true);
      expect(cosmos.props.geoLocations).toHaveLength(2);
    });
  });

  describe("capabilities", () => {
    it("should configure serverless capability", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosserverless",
        location: "eastus",
        resourceGroupId: rg.id,
        capabilities: [{ name: "EnableServerless" }],
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos.props.capabilities).toEqual([{ name: "EnableServerless" }]);
    });
  });

  describe("tag management", () => {
    let cosmos: CosmosDbAccount;

    beforeEach(() => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmostags",
        location: "eastus",
        resourceGroupId: rg.id,
        tags: {
          environment: "test",
        },
      };

      cosmos = new CosmosDbAccount(stack, "TestCosmos", props);
    });

    it("should add a tag", () => {
      cosmos.addTag("newTag", "newValue");

      expect(cosmos.props.tags!.newTag).toBe("newValue");
      expect(cosmos.props.tags!.environment).toBe("test");
    });

    it("should remove an existing tag", () => {
      cosmos.removeTag("environment");

      expect(cosmos.props.tags!.environment).toBeUndefined();
    });

    it("should add a tag when no tags exist", () => {
      const rg = new ResourceGroup(stack, "TestRG2", {
        name: "test-rg2",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosnotags",
        location: "eastus",
        resourceGroupId: rg.id,
      };

      const c = new CosmosDbAccount(stack, "TestCosmosNoTags", props);
      c.addTag("firstTag", "firstValue");

      expect(c.props.tags!.firstTag).toBe("firstValue");
    });
  });

  describe("API versioning", () => {
    it("should use default version when not specified", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosdefault",
        location: "eastus",
        resourceGroupId: rg.id,
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos).toBeInstanceOf(CosmosDbAccount);
    });

    it("should accept specific API version", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosversioned",
        location: "eastus",
        resourceGroupId: rg.id,
        apiVersion: "2024-05-15",
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos.props.apiVersion).toBe("2024-05-15");
    });
  });

  describe("CDK Terraform integration", () => {
    it("should synthesize to valid Terraform", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmossynth",
        location: "eastus",
        resourceGroupId: rg.id,
        tags: {
          environment: "test",
        },
      };

      new CosmosDbAccount(stack, "TestCosmos", props);

      const synthesized = Testing.synth(stack);
      expect(synthesized).toBeDefined();

      const stackConfig = JSON.parse(synthesized);
      expect(stackConfig.resource).toBeDefined();
    });

    it("should have correct logical IDs for outputs", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmoslogical",
        location: "eastus",
        resourceGroupId: rg.id,
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos.idOutput).toBeDefined();
      expect(cosmos.locationOutput).toBeDefined();
      expect(cosmos.nameOutput).toBeDefined();
      expect(cosmos.tagsOutput).toBeDefined();
      expect(cosmos.documentEndpointOutput).toBeDefined();
    });
  });

  describe("endpoint properties", () => {
    it("should provide document endpoint", () => {
      const rg = new ResourceGroup(stack, "TestRG", {
        name: "test-rg",
        location: "eastus",
      });

      const props: CosmosDbAccountProps = {
        name: "testcosmosendpoint",
        location: "eastus",
        resourceGroupId: rg.id,
      };

      const cosmos = new CosmosDbAccount(stack, "TestCosmos", props);

      expect(cosmos.documentEndpoint).toBeDefined();
      expect(cosmos.documentEndpoint).toContain("documentEndpoint");
    });
  });
});
