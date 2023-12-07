import { KustoDatabase } from '@cdktf/provider-azurerm/lib/kusto-database';
import { KustoDatabasePrincipalAssignment } from '@cdktf/provider-azurerm/lib/kusto-database-principal-assignment';
import { Construct } from 'constructs';
import { AzureKusto } from '.';
import { KustoProps } from './index';
import { KustoScript } from '@cdktf/provider-azurerm/lib/kusto-script';
import * as cdktf from 'cdktf';
import { Md5 } from 'ts-md5';

export interface KustoDatabaseProps {
  /**
   * The Azure Kusto to which this database belongs.
   */
  kusto: AzureKusto;
  /**
   * The name of the Kusto Database to create.
   */
  name: string;
  /**
   * The time the data that should be kept in cache for fast queries as ISO 8601 timespan.
   * Default is unlimited.
   */
  hotCachePeriod?: string;
  /**
   * The time the data should be kept before it stops being accessible to queries as ISO 8601 timespan.
   * Default is unlimited. 
   */
  softDeletePeriod?: string;
}

export interface KustoDatabaseAccessProps {
  /**
   * The name of the kusto principal assignment. 
   */
  readonly name: string,
  /**
   * The tenant id in which the principal resides. 
   */
  readonly tenantId: string,
  /**
   * The object id of the principal to assign to Kusto Database.
   */
  readonly principalId: string,
  /**
   * The type of the principal. Valid values include App, Group, User.
   */
  readonly principalType: string,
  /**
   * The database role assigned to the principal.
   * Valid values include Admin, Ingestor, Monitor, UnrestrictedViewer, User and Viewer.
   */
  readonly role: string,
}

export interface KustoTableSchemaProps {
  readonly columnName: string,
  readonly columnType: string,
}


export class AzureKustoDatabase extends Construct {
  public readonly kustoDbProps: KustoDatabaseProps;
  public readonly kustoProps: KustoProps;
  public readonly rg: string;
  public readonly id: string;

  constructor(scope: Construct, id: string, kustoDbProps: KustoDatabaseProps) {
    super(scope, id);
    this.kustoDbProps = kustoDbProps;
    this.kustoProps = kustoDbProps.kusto.kustoProps;
    this.rg = kustoDbProps.kusto.kustoProps.rg.Name;

    const kustoDatabase = new KustoDatabase(this, `kusto-db-${this.kustoDbProps.name}`, {
      name: this.kustoDbProps.name,
      location: kustoDbProps.kusto.kustoProps.rg.Location,
      resourceGroupName: kustoDbProps.kusto.kustoProps.rg.Name,
      clusterName: kustoDbProps.kusto.kustoProps.name,
    });

    if (this.kustoDbProps.hotCachePeriod) {
      kustoDatabase.addOverride("hot_cache_period", this.kustoDbProps.hotCachePeriod);
    }
    if (this.kustoDbProps.softDeletePeriod) {
      kustoDatabase.addOverride("soft_delete_period", this.kustoDbProps.softDeletePeriod);
    }

    // Outputs
    this.id = kustoDatabase.id;
    const cdktfTerraformOutputKustoDbId = new cdktf.TerraformOutput(this, 'id', {
      value: this.id,
    });
    cdktfTerraformOutputKustoDbId.overrideLogicalId('id')
  }

  public addPermission(kustoDatabaseAccessProps: KustoDatabaseAccessProps) {
    new KustoDatabasePrincipalAssignment(this, `kusto-db-${kustoDatabaseAccessProps.name}-access`, {
      name: kustoDatabaseAccessProps.name,
      resourceGroupName: this.rg,
      clusterName: this.kustoProps.name,
      databaseName: this.kustoDbProps.name,
      tenantId: kustoDatabaseAccessProps.tenantId,
      principalId: kustoDatabaseAccessProps.principalId,
      principalType: kustoDatabaseAccessProps.principalType,
      role: kustoDatabaseAccessProps.role,
    });
  }

  public addTable(tableName: string, tableSchema: KustoTableSchemaProps[]) {
    const schemaContent = tableSchema.map((column) => {
      return `${column.columnName}:${column.columnType}`;
    }).join(', ');
    const scriptContent = `.create table ${tableName} ( ${schemaContent} )`;

    new KustoScript(this, `kusto-db-${this.kustoDbProps.name}-table-${tableName}`, {
      name: tableName,
      databaseId: this.id,
      scriptContent: scriptContent,
      continueOnErrorsEnabled: false,
      forceAnUpdateWhenValueChanged: Md5.hashStr(scriptContent),
    });
  }

  public addScript(scriptName: string, scriptContent: string) {
    new KustoScript(this, `kusto-db-${this.kustoDbProps.name}-script-${scriptName}`, {
      name: `script-${scriptName}`,
      databaseId: this.id,
      scriptContent: scriptContent,
      continueOnErrorsEnabled: false,
      forceAnUpdateWhenValueChanged: Md5.hashStr(scriptContent),
    });
  }
}
