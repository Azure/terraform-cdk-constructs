import { KustoDatabase } from '@cdktf/provider-azurerm/lib/kusto-database';
import { KustoDatabasePrincipalAssignment } from '@cdktf/provider-azurerm/lib/kusto-database-principal-assignment';
import { Construct } from 'constructs';
import { AzureKusto } from '.';
import { KustoProps } from './index';

export interface KustoDatabaseProps {
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

export class AzureKustoDatabase extends Construct {
  public readonly kustoDbProps: KustoDatabaseProps;
  public readonly kustoProps: KustoProps;
  public readonly rg: string;

  constructor(scope: Construct, id: string, kusto: AzureKusto, kustoDbProps: KustoDatabaseProps) {
    super(scope, id);
    this.kustoDbProps = kustoDbProps;
    this.kustoProps = kusto.kustoProps;
    this.rg = kusto.rgName;

    const kustoDatabase = new KustoDatabase(this, `kusto-db-${this.kustoDbProps.name}`, {
      name: this.kustoDbProps.name,
      location: kusto.location,
      resourceGroupName: kusto.rgName,
      clusterName: kusto.kustoProps.name,
    });

    if (this.kustoDbProps.hotCachePeriod) {
      kustoDatabase.addOverride("hot_cache_period", this.kustoDbProps.hotCachePeriod);
    }
    if (this.kustoDbProps.softDeletePeriod) {
      kustoDatabase.addOverride("soft_delete_period", this.kustoDbProps.softDeletePeriod);
    }
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
}
