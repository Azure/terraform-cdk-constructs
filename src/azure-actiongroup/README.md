# Azure Action Group Construct

## What is Azure Action Group?

An Azure Action Group enable you to organize and manage notifications and responses triggered by Azure Monitor alerts. You can define recipients and a list of actions to execute when an alert is triggered. Official Documentation can be found [here](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/action-groups).

## Azure Action Group Class Properties

This class has several properties that control the Action Group resource's behaviour:

- `name`: The name of the Action Group resource.
- `resourceGroupName`: The name of the resource group that the Action Group resource will be created in.
- `shortName`: The short name of the Action Group resource. This will be used in SMS messages. The length should be in the range (1 - 12).
- `enabled`: (Optional) Whether the Action Group resource is enabled. Defaults to `true`.
- `location`: (Optional) The Azure Region where the Action Group resource should exist. Should be `global`,`swedencentral`, `germanywestcentral`, `northcentralus`, `southcentralus`, `eastus2`. Defaults to `global`.
- `tags`: (Optional) A mapping of tags to assign to the Action Group resource.
- `armRoleReceivers`: (Optional) A list of ARM role receivers to add to the Action Group resource.
- `emailReceivers`: (Optional) A list of email receivers to add to the Action Group resource.
- `smsReceivers`: (Optional) A list of SMS receivers to add to the Action Group resource.
- `voiceReceivers`: (Optional) A list of voice receivers to add to the Action Group resource.
- `webhookReceivers`: (Optional) A list of webhook receivers to add to the Action Group resource.
- `eventHubReceivers`: (Optional) A list of event hub receivers to add to the Action Group resource.
- [TODO] itsmReceivers
- [TODO] azureAppPushReceivers
- [TODO] automationRunbookReceivers
- [TODO] logicAppReceivers
- [TODO] azureFunctionReceivers

## Deploying a Kusto

You can deploy a Action Group using this class like so:

```typescript
// Create Resource Group first
import * as rg from "../azure-resourcegroup";
const resourceGroup = new rg.Group(this, "myResourceGroup", {
  name: "myResourceGroup",
  location: "eastus",
});

// Create Action Group
const actiongroup = new ag.ActionGroup(this, 'testAzureActionGroup', {
  name: "testactiongroup",
  resourceGroupName: resourceGroup.name,
  shortName: "testshortn",
  emailReceivers: [
    {
      name: "testemail1",
      emailAddress: "test1@email.com",
      useCommonAlertSchema: true,
    },
    {
      name: "testemail2",
      emailAddress: "test2@email.com",
    },
  ],
});

```

Full example can be found [here](test/ExampleAzureActionGroup.ts).
