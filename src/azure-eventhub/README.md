# Azure Eventhub Construct

This class represents an Eventhub resource in Azure. It provides a convenient way to manage Azure Eventhub resources.

# What is Eventhub?

See [officail document](https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-features).

# Eventhub Best Practices

Coming soon...

# Create an Eventhub Namespace and Eventhub Instance

This class has several properties that control the Eventhub resource's behaviour:

- `rg`: The [Azure Resource Group object](../azure-resourcegroup/) in which to create the Eventhub Namespace.
- `name`: The name of the Eventhub Namespace to create.
- `sku`: (Optional) Defines which tier to use. Valid options are Basic, Standard, and Premium.
- `capacity`: (Optional) Specifies the Capacity / Throughput Units for a Standard SKU namespace. Default is 2.
- `autoInflateEnabled`: (Optional) Specifies if the EventHub Namespace should be Auto Inflate enabled. Default is false.
- `maximumThroughputUnits`: (Optional) Specifies the maximum number of throughput units when Auto Inflate is Enabled. Valid values range from 1 - 20. Default is 2.
- `zoneRedundant`: (Optional) Specifies if the EventHub Namespace should be Zone Redundant (created across Availability Zones). Default is true.
- `tags`: (Optional) The tags to assign to the Key Vault.
- `minimumTlsVersion`: (Optional) The minimum supported TLS version for this EventHub Namespace. Valid values are: 1.0, 1.1 and 1.2. Default is 1.2.
- `publicNetworkAccessEnabled`: (Optional) Is public network access enabled for the EventHub Namespace? Default is true.
- `localAuthenticationEnabled`: (Optional) Is SAS authentication enabled for the EventHub Namespace? North Central US Not supported. Default is false.
- `identityType`: (Optional) Specifies the type of Managed Service Identity that should be configured on this Event Hub Namespace. Possible values are SystemAssigned or UserAssigned. Default is SystemAssigned.
- `identityIds`: (Optional) Specifies a list of User Assigned Managed Identity IDs to be assigned to this EventHub namespace.

You can deploy a Eventhub Namespace using this class like:

  ```typescript
  // Create a Resource Group first
  const resourceGroup = new AzureResourceGroup(this, "rg", {
    name: 'myResourceGroup',
    location: 'eastus',
  });

  // Create Eventhub Namespace
  const eventhubNamespace = new AzureEventhubNamespace(this, "eventhub", {
    rg: resourceGroup,
    name: 'myEventhubNamespace',
    sku: "Basic",
  });

  // Add IAM role to Eventhub Namespace
  const objectId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
  const role = "Contributor";
  eventhubNamespace.addAccess(objectId, role);
  ```

Then, you can deploy several Eventhub Instances in the Eventhub Namespace using this class like:

  ```typescript
  // Create Eventhub Instance
  const eventhubInstance = eventhubNamespace.addEventhubInstance({
    name: `myEventhubInstance1`,
    partitionCount: 2,
    messageRetention: 1,
    status: "Active",
  });
  ```

And, there are several methods in the Eventhub Instance class to setup Authorization rule, Consumer Group, Kusto data connection, etc.

- Add Authorization Rule to Eventhub Instance

  ```typescript
  eventhubInstance.addAuthorizationRule({
    name: `test-rule`,
    listen: true,
    send: true,
    manage: false,
  });
  ```

- Add Consumer Group to Eventhub Instance

  ```typescript
  eventhubInstance.addConsumerGroup({
    name: `test-consumer-group`,
  });
  ```

- Add data connection between Eventhub Instance and Kusto database

  ```typescript
  // Add Kusto data connection
  eventhubInstance.addKustoDataConnection({
    name: `kustoDataConnection1`,
    location: 'eastus',
    resourceGroupName: 'myKustoRg',    // Kusto resource group
    clusterName: 'myKustoCluster',     // Kusto cluster name
    databaseName: "myKustoDatabase1",  // Kusto database name
  });
  ```
