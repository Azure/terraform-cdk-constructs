import { Testing } from "cdktn";
import * as cdktn from "cdktn";
import { ApiVersionManager } from "../../core-azure/lib/version-manager/api-version-manager";
import { VersionSupportLevel } from "../../core-azure/lib/version-manager/interfaces/version-interfaces";
import {
  DataExplorerCluster,
  DataExplorerClusterProps,
} from "../lib/data-explorer-cluster";
import {
  ALL_DATA_EXPLORER_CLUSTER_VERSIONS,
  DATA_EXPLORER_CLUSTER_TYPE,
} from "../lib/data-explorer-cluster-schemas";
import {
  DataExplorerDatabase,
  DataExplorerDatabaseProps,
} from "../lib/data-explorer-database";
import {
  ALL_DATA_EXPLORER_DATABASE_VERSIONS,
  DATA_EXPLORER_DATABASE_TYPE,
} from "../lib/data-explorer-database-schemas";
import {
  DataExplorerScript,
  DataExplorerScriptProps,
} from "../lib/data-explorer-table";
import {
  ALL_DATA_EXPLORER_SCRIPT_VERSIONS,
  DATA_EXPLORER_SCRIPT_TYPE,
} from "../lib/data-explorer-table-schemas";

describe("DataExplorer - Unified Implementation", () => {
  let app: cdktn.App;
  let stack: cdktn.TerraformStack;
  let manager: ApiVersionManager;

  beforeEach(() => {
    app = Testing.app();
    stack = new cdktn.TerraformStack(app, "TestStack");
    manager = ApiVersionManager.instance();

    try {
      manager.registerResourceType(
        DATA_EXPLORER_CLUSTER_TYPE,
        ALL_DATA_EXPLORER_CLUSTER_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }

    try {
      manager.registerResourceType(
        DATA_EXPLORER_DATABASE_TYPE,
        ALL_DATA_EXPLORER_DATABASE_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }

    try {
      manager.registerResourceType(
        DATA_EXPLORER_SCRIPT_TYPE,
        ALL_DATA_EXPLORER_SCRIPT_VERSIONS,
      );
    } catch (error) {
      // Ignore if already registered
    }
  });

  describe("DataExplorerCluster", () => {
    const clusterProps: DataExplorerClusterProps = {
      name: "test-cluster",
      location: "eastus",
      resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
      sku: {
        name: "Dev(No SLA)_Standard_E2a_v4",
        capacity: 1,
        tier: "Basic",
      },
    };

    it("should create cluster with automatic latest version resolution", () => {
      const cluster = new DataExplorerCluster(stack, "TestCluster", clusterProps);

      expect(cluster).toBeInstanceOf(DataExplorerCluster);
      expect(cluster.resolvedApiVersion).toBe("2024-04-13");
      expect(cluster.props).toBe(clusterProps);
      expect(cluster.location).toBe("eastus");
    });

    it("should create cluster with all optional properties", () => {
      const props: DataExplorerClusterProps = {
        ...clusterProps,
        tags: { environment: "test" },
        identity: { type: "SystemAssigned" },
        trustedExternalTenants: [{ value: "11111111-1111-1111-1111-111111111111" }],
        optimizedAutoscale: {
          version: 1,
          isEnabled: true,
          minimum: 1,
          maximum: 2,
        },
        enableDiskEncryption: true,
        enableStreamingIngest: true,
        enablePurge: true,
      };

      const cluster = new DataExplorerCluster(stack, "FullCluster", props);

      expect(cluster.props.identity).toEqual({ type: "SystemAssigned" });
      expect(cluster.props.enablePurge).toBe(true);
      expect(cluster.props.optimizedAutoscale?.maximum).toBe(2);
    });

    it("should require location to be provided", () => {
      expect(() => {
        new DataExplorerCluster(stack, "MissingLocation", {
          name: "test-cluster",
          sku: clusterProps.sku,
        });
      }).toThrow("Location is required for Microsoft.Kusto/clusters");
    });

    it("should support framework version metadata", () => {
      const cluster = new DataExplorerCluster(stack, "FrameworkCluster", clusterProps);

      expect(cluster.latestVersion()).toBe("2024-04-13");
      expect(cluster.supportedVersions()).toEqual(["2024-04-13"]);
      expect(cluster.schema.resourceType).toBe(DATA_EXPLORER_CLUSTER_TYPE);
      expect(cluster.versionConfig.supportLevel).toBe(VersionSupportLevel.ACTIVE);
    });

    it("should resolve parent ID from resource group", () => {
      const cluster = new DataExplorerCluster(stack, "ParentCluster", clusterProps);
      const parentId = (cluster as any).resolveParentId(clusterProps);

      expect(parentId).toBe(clusterProps.resourceGroupId);
    });

    it("should create the expected resource body", () => {
      const props: DataExplorerClusterProps = {
        ...clusterProps,
        enableStreamingIngest: true,
      };
      const cluster = new DataExplorerCluster(stack, "BodyCluster", props);
      const body = (cluster as any).createResourceBody(props);

      expect(body.sku).toEqual(clusterProps.sku);
      expect(body.properties.enableStreamingIngest).toBe(true);
    });

    it("should expose outputs and URIs", () => {
      const cluster = new DataExplorerCluster(stack, "OutputCluster", clusterProps);

      expect(cluster.idOutput).toBeDefined();
      expect(cluster.locationOutput).toBeDefined();
      expect(cluster.nameOutput).toBeDefined();
      expect(cluster.tagsOutput).toBeDefined();
      expect(cluster.uriOutput).toBeDefined();
      expect(cluster.uri).toContain("output.properties.uri");
      expect(cluster.dataIngestionUri).toContain(
        "output.properties.dataIngestionUri",
      );
    });
  });

  describe("DataExplorerDatabase", () => {
    const databaseProps: DataExplorerDatabaseProps = {
      name: "test-db",
      location: "eastus",
      clusterId:
        "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Kusto/clusters/test-cluster",
      kind: "ReadWrite",
    };

    it("should create database with automatic latest version resolution", () => {
      const database = new DataExplorerDatabase(
        stack,
        "TestDatabase",
        databaseProps,
      );

      expect(database).toBeInstanceOf(DataExplorerDatabase);
      expect(database.resolvedApiVersion).toBe("2024-04-13");
      expect(database.props).toBe(databaseProps);
    });

    it("should default kind to ReadWrite", () => {
      const database = new DataExplorerDatabase(stack, "DefaultKind", {
        name: "default-kind-db",
        location: "eastus",
        clusterId: databaseProps.clusterId,
      });
      const body = (database as any).createResourceBody(database.props);

      expect(body.kind).toBe("ReadWrite");
    });

    it("should support framework version metadata", () => {
      const database = new DataExplorerDatabase(
        stack,
        "FrameworkDatabase",
        databaseProps,
      );

      expect(database.latestVersion()).toBe("2024-04-13");
      expect(database.supportedVersions()).toEqual(["2024-04-13"]);
      expect(database.schema.resourceType).toBe(DATA_EXPLORER_DATABASE_TYPE);
      expect(database.versionConfig.supportLevel).toBe(VersionSupportLevel.ACTIVE);
    });

    it("should require location and should resolve parent ID correctly", () => {
      const database = new DataExplorerDatabase(
        stack,
        "ParentDatabase",
        databaseProps,
      );

      expect((database as any).requiresLocation()).toBe(true);
      expect((database as any).resolveParentId(databaseProps)).toBe(
        databaseProps.clusterId,
      );
    });

    it("should create the expected resource body", () => {
      const props: DataExplorerDatabaseProps = {
        ...databaseProps,
        softDeletePeriod: "P365D",
        hotCachePeriod: "P31D",
      };
      const database = new DataExplorerDatabase(stack, "BodyDatabase", props);
      const body = (database as any).createResourceBody(props);

      expect(body.kind).toBe("ReadWrite");
      expect(body.properties.softDeletePeriod).toBe("P365D");
      expect(body.properties.hotCachePeriod).toBe("P31D");
    });

    it("should expose outputs", () => {
      const database = new DataExplorerDatabase(
        stack,
        "OutputDatabase",
        databaseProps,
      );

      expect(database.idOutput).toBeDefined();
      expect(database.nameOutput).toBeDefined();
      expect(database.resourceId).toBe(database.id);
    });
  });

  describe("DataExplorerScript", () => {
    const scriptProps: DataExplorerScriptProps = {
      name: "test-table-script",
      databaseId:
        "/subscriptions/test-sub/resourceGroups/test-rg/providers/Microsoft.Kusto/clusters/test-cluster/databases/test-db",
      scriptContent:
        ".create table TestTable (Column1: string, Column2: int)",
    };

    it("should create script with automatic latest version resolution", () => {
      const script = new DataExplorerScript(stack, "TestScript", scriptProps);

      expect(script).toBeInstanceOf(DataExplorerScript);
      expect(script.resolvedApiVersion).toBe("2024-04-13");
      expect(script.props).toBe(scriptProps);
    });

    it("should support framework version metadata", () => {
      const script = new DataExplorerScript(stack, "FrameworkScript", scriptProps);

      expect(script.latestVersion()).toBe("2024-04-13");
      expect(script.supportedVersions()).toEqual(["2024-04-13"]);
      expect(script.schema.resourceType).toBe(DATA_EXPLORER_SCRIPT_TYPE);
      expect(script.versionConfig.supportLevel).toBe(VersionSupportLevel.ACTIVE);
    });

    it("should not require location and should resolve parent ID correctly", () => {
      const script = new DataExplorerScript(stack, "ParentScript", scriptProps);

      expect((script as any).requiresLocation()).toBe(false);
      expect((script as any).resolveParentId(scriptProps)).toBe(
        scriptProps.databaseId,
      );
    });

    it("should create the expected resource body", () => {
      const props: DataExplorerScriptProps = {
        ...scriptProps,
        forceUpdateTag: "test-run",
      };
      const script = new DataExplorerScript(stack, "BodyScript", props);
      const body = (script as any).createResourceBody(props);

      expect(body.properties.scriptContent).toBe(scriptProps.scriptContent);
      expect(body.properties.forceUpdateTag).toBe("test-run");
      expect(body.properties.continueOnErrors).toBe(false);
    });

    it("should expose outputs", () => {
      const script = new DataExplorerScript(stack, "OutputScript", scriptProps);

      expect(script.idOutput).toBeDefined();
      expect(script.nameOutput).toBeDefined();
      expect(script.resourceId).toBe(script.id);
    });
  });

  describe("CDK Terraform Integration", () => {
    it("should synthesize all ADX resources in one stack", () => {
      const cluster = new DataExplorerCluster(stack, "SynthCluster", {
        name: "synth-cluster",
        location: "eastus",
        resourceGroupId: "/subscriptions/test-sub/resourceGroups/test-rg",
        sku: {
          name: "Dev(No SLA)_Standard_E2a_v4",
          capacity: 1,
          tier: "Basic",
        },
      });

      const database = new DataExplorerDatabase(stack, "SynthDatabase", {
        name: "synth-db",
        location: "eastus",
        clusterId: cluster.id,
        kind: "ReadWrite",
      });

      new DataExplorerScript(stack, "SynthScript", {
        name: "synth-script",
        databaseId: database.id,
        scriptContent:
          ".create table TestTable (Column1: string, Column2: int)",
      });

      const synthesized = Testing.synth(stack);
      expect(synthesized).toContain("Microsoft.Kusto/clusters@2024-04-13");
      expect(synthesized).toContain(
        "Microsoft.Kusto/clusters/databases@2024-04-13",
      );
      expect(synthesized).toContain(
        "Microsoft.Kusto/clusters/databases/scripts@2024-04-13",
      );
      expect(synthesized).toContain("TestTable");
    });
  });
});
