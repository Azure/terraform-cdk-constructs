# Azure Kusto (Azure Data Explorer) Construct

This class represents a Kusto (a.k.a Azure Data Explorer) resource in Azure. It provides a convenient way to manage Azure Kusto resources.

## What is Kusto?

Azure Kusto is a powerful and scalable solution for real-time data exploration and analysis, offering a range of features to handle large datasets and diverse data sources.

You can learn more about Azure Kusto in the [official Azure documentation](https://learn.microsoft.com/en-us/azure/data-explorer/data-explorer-overview).

## Kusto Best Practices

Coming soon.

## Kusto Class Properties

This class takes an azure resource group object as input.

- `azureResourceGroup`: The [Azure Resource Group object](../azure-resourcegroup/) where the Kusto resource will be deployed.

And has several properties that control the Kusto resource's behaviour:

- `name`: The name of the Kusto resource.
- `sku`: (Optional) The SKU of the Kusto resource. Defaults to "dev/test, Dv2/DSv2 Series, Extra small".
- `capacity`: (Optional) The node count for the cluster. Defaults to 2.
- `identityType`: (Optional) The type of Managed Service Identity. Defaults to "SystemAssigned".
- `identityIds`: (Optional) A list of User Assigned Managed Identity IDs to be assigned to this Kusto Cluster.
- `publicNetworkAccessEnabled`: (Optional) Is the public network access enabled? Defaults to true.
- `autoStopEnabled`: (Optional) Specifies if the cluster could be automatically stopped (due to lack of data or no activity for many days). Defaults to true.
- `streamingIngestionEnabled`: (Optional) Specifies if the streaming ingest is enabled. Defaults to true.
- `purgeEnabled`: (Optional) Specifies if the purge operations are enabled. Defaults to false.
- `enableZones`: (Optional) Specifies if the cluster is zone redundant or not. Will check if the sku supports zone redundancy. Defaults to true.
- `minimumInstances`: (Optional) The minimum number of allowed instances. Must between 0 and 1000.
- `maximumInstances`: (Optional) The maximum number of allowed instances. Must between 0 and 1000.
- `tags`: (Optional) A mapping of tags to assign to the Kusto.

## Deploying a Kusto

You can deploy a Kusto resource using this class like so:

```typescript
  // Create a Resource Group first
  const resourceGroup = new AzureResourceGroup(this, "myResourceGroup", {
    name: 'myResourceGroup',
    location: 'eastus',
  });

  // Create a Kusto Cluster with defult settings
  // import { ComputeSpecification } from '../compute-specification';
  const kustoCluster = new AzureKusto(this, "myKusto", {
    rg: resourceGroup,
    name: 'myKusto',
    sku: ComputeSpecification.devtestExtraSmallEav4,
  });

```

Full example can be found [here](test/ExampleAzureKusto.ts).

## Some convenient methods in the Kusto Class

- Add IAM role to Kusto Cluster

  ```typescript
  const objectId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
  const role = "Contributor"
  kustoCluster.addAccess(objectId, role);
  ```

- Add Diagnostics Log into LogAnalytics

  ```typescript
  logAnalyticsWorkspaceId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
  kustoCluster.addDiagSettings({
    name: "diagsettings", 
    logAnalyticsWorkspaceId: logAnalyticsWorkspaceId,
  })
  ```

- Create Database into the Kusto

  ```typescript
  const myKustoDB1 = kustoCluster.addDatabase({
      kusto: kustoCluster,
      name: "myDatabase1",
      hotCachePeriod: "P7D",
      softDeletePeriod: "P1D",
    });
  ```

- Add Permission to the Kusto Database
  
  ```typescript
  myKustoDB1.addPermission({
    name: "kustoPermission1",
    tenantId: `${tenantId}`,
    principalId: `${clientId}`,
    principalType: "User",
    role: "Admin",
  });
  ```

  This example will grant the user with `clientId` the `Admin` role to the Kusto Database `myKustoDB1`.

- Add Table to the Kusto Database

  ```typescript
  myKustoDB1.addTable('myTable', [
    {
      columnName: 'Timestamp',
      columnType: 'datetime',
    },
    {
      columnName: 'User',
      columnType: 'string',
    },
    {
      columnName: 'Value',
      columnType: 'int32',
    },
  ]);
  ```

  This example will create a table named `myTable` with three columns `Timestamp`, `User` and `Value` in the Kusto Database `myKustoDB1`.

- Run script for kusto table operations
  
    ```typescript
    const script = '.create table myTable2 ( Timestamp:datetime, User:string, Value:int32 )';
    testDB1.addScript('myScriptName', script);
    ```
  
    This example will run the script to create a table named `myTable2` with three columns `Timestamp`, `User` and `Value` in the Kusto Database `myKustoDB1`.
