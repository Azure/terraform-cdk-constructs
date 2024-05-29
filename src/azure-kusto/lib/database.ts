import { KustoDatabase } from "@cdktf/provider-azurerm/lib/kusto-database";
import { KustoDatabasePrincipalAssignment } from "@cdktf/provider-azurerm/lib/kusto-database-principal-assignment";
import { KustoScript } from "@cdktf/provider-azurerm/lib/kusto-script";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { Md5 } from "ts-md5";
import { ClusterProps, Cluster } from "./cluster";

export interface DatabaseProps {
  /**
   * The Azure Kusto cluster to which this database belongs.
   */
  readonly kusto: Cluster;
  /**
   * The name of the Kusto Database to create.
   */
  readonly name: string;
  /**
   * The time the data that should be kept in cache for fast queries as ISO 8601 timespan.
   * Default is unlimited.
   */
  readonly hotCachePeriod?: string;
  /**
   * The time the data should be kept before it stops being accessible to queries as ISO 8601 timespan.
   * Default is unlimited.
   */
  readonly softDeletePeriod?: string;
}

export interface DatabaseAccessProps {
  /**
   * The name of the kusto principal assignment.
   */
  readonly name: string;
  /**
   * The tenant id in which the principal resides.
   */
  readonly tenantId: string;
  /**
   * The object id of the principal to assign to Kusto Database.
   */
  readonly principalId: string;
  /**
   * The type of the principal. Valid values include App, Group, User.
   */
  readonly principalType: string;
  /**
   * The database role assigned to the principal.
   * Valid values include Admin, Ingestor, Monitor, UnrestrictedViewer, User and Viewer.
   */
  readonly role: string;
}

export interface TableSchemaProps {
  readonly columnName: string;
  readonly columnType: string;
}

export class Database extends Construct {
  public readonly kustoDbProps: DatabaseProps;
  public readonly kustoProps: ClusterProps;
  public readonly rg: string;
  public readonly id: string;

  /**
   * Represents a Kusto Database within an Azure Kusto Cluster.
   *
   * This class is responsible for the creation and management of a database in Azure Data Explorer (Kusto),
   * which stores data tables and provides a query engine. A Kusto database is a logical group of tables
   * and is associated with a specific Kusto cluster. The database supports configurations such as
   * hot cache period and soft delete period to optimize performance and data retention according to
   * specific workload requirements.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the Kusto database.
   * @param kustoDbProps - The properties required to configure the Kusto database. These include:
   *                       - `kusto`: Reference to the Kusto cluster to which the database will belong.
   *                       - `name`: The name of the database to be created within the Kusto cluster.
   *                       - `hotCachePeriod`: Optional. Specifies the duration that data should be kept in cache for faster query performance.
   *                                           Expressed in ISO 8601 duration format.
   *                       - `softDeletePeriod`: Optional. Specifies the duration that data should be retained before it stops being accessible.
   *                                             Expressed in ISO 8601 duration format.
   *
   * Example usage:
   * ```typescript
   * const myDatabase = new Database(this, 'MyKustoDatabase', {
   *   kusto: myKustoCluster,
   *   name: 'AnalyticsDB',
   *   hotCachePeriod: 'P30D',  // 30 days
   *   softDeletePeriod: 'P365D' // 365 days
   * });
   * ```
   *
   * This class sets up the database configurations and integrates it within the specified Kusto cluster,
   * providing capabilities to manage and query large datasets effectively.
   */
  constructor(scope: Construct, id: string, kustoDbProps: DatabaseProps) {
    super(scope, id);
    this.kustoDbProps = kustoDbProps;
    this.kustoProps = kustoDbProps.kusto.props;
    this.rg = kustoDbProps.kusto.resourceGroup.name;

    const kustoDatabase = new KustoDatabase(
      this,
      `kusto-db-${this.kustoDbProps.name}`,
      {
        name: this.kustoDbProps.name,
        location: kustoDbProps.kusto.resourceGroup.location,
        resourceGroupName: kustoDbProps.kusto.resourceGroup.name,
        clusterName: kustoDbProps.kusto.props.name,
      },
    );

    if (this.kustoDbProps.hotCachePeriod) {
      kustoDatabase.addOverride(
        "hot_cache_period",
        this.kustoDbProps.hotCachePeriod,
      );
    }
    if (this.kustoDbProps.softDeletePeriod) {
      kustoDatabase.addOverride(
        "soft_delete_period",
        this.kustoDbProps.softDeletePeriod,
      );
    }

    // Outputs
    this.id = kustoDatabase.id;
    const cdktfTerraformOutputKustoDbId = new cdktf.TerraformOutput(
      this,
      "id",
      {
        value: this.id,
      },
    );
    cdktfTerraformOutputKustoDbId.overrideLogicalId("id");
  }

  /**
   * Adds a database principal assignment in the Kusto cluster, assigning specified access rights to a principal.
   *
   * This method is used to grant access permissions to a specific user, group, or service principal within an Azure Active Directory.
   * These permissions determine the level of access that the principal has over the Kusto database, such as viewing, ingesting, or managing data.
   * The assignment is made by creating a KustoDatabasePrincipalAssignment resource, specifying the principal details and the type of role
   * they should assume.
   *
   * @param kustoDatabaseAccessProps - The properties defining the principal assignment. This includes:
   *   - `name`: A unique name identifying this principal assignment.
   *   - `tenantId`: The Azure Active Directory tenant ID where the principal resides.
   *   - `principalId`: The object ID of the principal (user, group, or service principal) in Azure AD.
   *   - `principalType`: The type of principal (e.g., User, Group, App).
   *   - `role`: The database role assigned to the principal. Roles can include Admin, User, Viewer, among others.
   *
   * Example usage:
   * ```typescript
   * myDatabase.addPermission({
   *   name: 'DataScienceTeamAccess',
   *   tenantId: 'tenant-id',
   *   principalId: 'principal-id',
   *   principalType: 'Group',
   *   role: 'Viewer'
   * });
   * ```
   * This method creates a new principal assignment, enabling specified access controls for the principal
   * on the Kusto database based on the role assigned. It is crucial for managing security and access
   * governance within the Kusto environment.
   */
  public addPermission(kustoDatabaseAccessProps: DatabaseAccessProps) {
    new KustoDatabasePrincipalAssignment(
      this,
      `kusto-db-${kustoDatabaseAccessProps.name}-access`,
      {
        name: kustoDatabaseAccessProps.name,
        resourceGroupName: this.rg,
        clusterName: this.kustoProps.name,
        databaseName: this.kustoDbProps.name,
        tenantId: kustoDatabaseAccessProps.tenantId,
        principalId: kustoDatabaseAccessProps.principalId,
        principalType: kustoDatabaseAccessProps.principalType,
        role: kustoDatabaseAccessProps.role,
      },
    );
  }

  /**
   * Adds a new table to an existing Azure Kusto database.
   *
   * This method creates a table within the specified Kusto database using a given schema. Tables in Kusto store structured data with
   * defined columns and types, which are crucial for storing and querying large datasets efficiently. The method constructs a Kusto
   * Data Explorer control command to create the table and then executes this command within the context of the database.
   *
   * @param tableName - The name of the table to create, which must be unique within the database.
   * @param tableSchema - An array of schema properties defining the columns of the table, including column names and their data types.
   *
   * Example usage:
   * ```typescript
   * myDatabase.addTable('SalesData', [
   *   { columnName: 'TransactionId', columnType: 'int' },
   *   { columnName: 'TransactionDate', columnType: 'datetime' },
   *   { columnName: 'Amount', columnType: 'real' }
   * ]);
   * ```
   * This method constructs the command to create the table and applies it directly within the Kusto database,
   * ensuring the table is ready for data ingestion and querying.
   */
  public addTable(tableName: string, tableSchema: TableSchemaProps[]) {
    const schemaContent = tableSchema
      .map((column) => {
        return `${column.columnName}:${column.columnType}`;
      })
      .join(", ");
    const scriptContent = `.create table ${tableName} ( ${schemaContent} )`;

    new KustoScript(
      this,
      `kusto-db-${this.kustoDbProps.name}-table-${tableName}`,
      {
        name: tableName,
        databaseId: this.id,
        scriptContent: scriptContent,
        continueOnErrorsEnabled: false,
        forceAnUpdateWhenValueChanged: Md5.hashStr(scriptContent),
      },
    );
  }

  /**
   * Adds and executes a control command or script within the Kusto database.
   *
   * This method facilitates the execution of Kusto Query Language (KQL) scripts or control commands within the specified
   * Kusto database. Scripts can perform a variety of functions, from schema modifications, like adding new tables or altering
   * existing ones, to data management operations, such as data ingestion or cleanup tasks. Each script is executed as a
   * KustoScript resource, which ensures that the script is applied correctly and atomically to the database.
   *
   * @param scriptName - A unique name for the script, which helps in identifying the script resource within the deployment.
   * @param scriptContent - The KQL script or control command to be executed. This should be a valid KQL command string.
   *
   * Example usage:
   * ```typescript
   * myDatabase.addScript('InitializeSalesTable', `
   *   .create table SalesData (TransactionId: int, TransactionDate: datetime, Amount: real)
   *   .alter-merge table SalesData policy retentionsoftdelete = 365d
   * `);
   * ```
   * This method will create a `KustoScript` resource that encapsulates the command, ensuring it is executed against the
   * database, and is tracked as part of the resource management within Azure.
   */
  public addScript(scriptName: string, scriptContent: string) {
    new KustoScript(
      this,
      `kusto-db-${this.kustoDbProps.name}-script-${scriptName}`,
      {
        name: `script-${scriptName}`,
        databaseId: this.id,
        scriptContent: scriptContent,
        continueOnErrorsEnabled: false,
        forceAnUpdateWhenValueChanged: Md5.hashStr(scriptContent),
      },
    );
  }
}
