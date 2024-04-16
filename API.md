# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### AccessPolicy <a name="AccessPolicy" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.Initializer"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

new azure_keyvault.AccessPolicy(scope: Construct, id: string, props: AccessPolicyProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.isConstruct"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

azure_keyvault.AccessPolicy.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.property.fqdn">fqdn</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `fqdn`<sup>Required</sup> <a name="fqdn" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy.property.fqdn"></a>

```typescript
public readonly fqdn: string;
```

- *Type:* string

---


### Account <a name="Account" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account"></a>

Represents an Azure Storage Account within a Terraform deployment.

This class provides methods to easily manage storage resources such as Containers,
File Shares, Tables, Queues, and Network Rules.

Example usage:
```typescript
const storageAccount = new AzureStorageAccount(this, 'storageaccount', {
  name: 'myStorageAccount',
  location: 'East US',
  resourceGroup: myResourceGroup,
  accountReplicationType: 'LRS',
  accountTier: 'Standard',
  // other properties
});
```

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.Initializer"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

new azure_storageaccount.Account(scope: Construct, id: string, props: AccountProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | The scope in which to define this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.Initializer.parameter.id">id</a></code> | <code>string</code> | The scoped construct ID. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps</code> | Configuration properties for the Azure Storage Account. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which to define this construct.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.Initializer.parameter.id"></a>

- *Type:* string

The scoped construct ID.

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps

Configuration properties for the Azure Storage Account.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addDiagSettings">addDiagSettings</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addMetricAlert">addMetricAlert</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addQueryRuleAlert">addQueryRuleAlert</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addContainer">addContainer</a></code> | Adds a new container to the storage account. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addFileShare">addFileShare</a></code> | Adds a new file share to the storage account. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addNetworkRules">addNetworkRules</a></code> | Adds network rules to the storage account. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addQueue">addQueue</a></code> | Adds a new queue to the storage account. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addTable">addTable</a></code> | Adds a new table to the storage account. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

##### `addMetricAlert` <a name="addMetricAlert" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addMetricAlert"></a>

```typescript
public addMetricAlert(props: IBaseMetricAlertProps): void
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addMetricAlert.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps

---

##### `addQueryRuleAlert` <a name="addQueryRuleAlert" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addQueryRuleAlert"></a>

```typescript
public addQueryRuleAlert(props: BaseAzureQueryRuleAlertProps): void
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addQueryRuleAlert.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps

---

##### `addContainer` <a name="addContainer" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addContainer"></a>

```typescript
public addContainer(name: string, containerAccessType?: string, metadata?: {[ key: string ]: string}): Container
```

Adds a new container to the storage account.

###### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addContainer.parameter.name"></a>

- *Type:* string

The name of the container.

---

###### `containerAccessType`<sup>Optional</sup> <a name="containerAccessType" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addContainer.parameter.containerAccessType"></a>

- *Type:* string

The access type of the container (e.g., 'blob', 'private').

---

###### `metadata`<sup>Optional</sup> <a name="metadata" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addContainer.parameter.metadata"></a>

- *Type:* {[ key: string ]: string}

Metadata for the container.

---

##### `addFileShare` <a name="addFileShare" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addFileShare"></a>

```typescript
public addFileShare(name: string, props?: FileShareProps): FileShare
```

Adds a new file share to the storage account.

###### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addFileShare.parameter.name"></a>

- *Type:* string

The name of the file share.

---

###### `props`<sup>Optional</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addFileShare.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_storageaccount.FileShareProps

Optional properties for the file share (e.g., quota, access tier).

---

##### `addNetworkRules` <a name="addNetworkRules" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addNetworkRules"></a>

```typescript
public addNetworkRules(props: NetworkRulesProps): StorageAccountNetworkRulesA
```

Adds network rules to the storage account.

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addNetworkRules.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_storageaccount.NetworkRulesProps

Configuration properties for the network rules.

---

##### `addQueue` <a name="addQueue" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addQueue"></a>

```typescript
public addQueue(name: string, metadata?: {[ key: string ]: string}): Queue
```

Adds a new queue to the storage account.

###### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addQueue.parameter.name"></a>

- *Type:* string

The name of the queue.

---

###### `metadata`<sup>Optional</sup> <a name="metadata" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addQueue.parameter.metadata"></a>

- *Type:* {[ key: string ]: string}

Optional metadata for the queue.

---

##### `addTable` <a name="addTable" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addTable"></a>

```typescript
public addTable(name: string, acl?: StorageTableAcl[]): Table
```

Adds a new table to the storage account.

###### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addTable.parameter.name"></a>

- *Type:* string

The name of the table.

---

###### `acl`<sup>Optional</sup> <a name="acl" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.addTable.parameter.acl"></a>

- *Type:* @cdktf/provider-azurerm.storageTable.StorageTableAcl[]

Optional access control list for the table.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.isConstruct"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

azure_storageaccount.Account.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.accountKind">accountKind</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.accountTier">accountTier</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.location">location</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `accountKind`<sup>Required</sup> <a name="accountKind" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.accountKind"></a>

```typescript
public readonly accountKind: string;
```

- *Type:* string

---

##### `accountTier`<sup>Required</sup> <a name="accountTier" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.accountTier"></a>

```typescript
public readonly accountTier: string;
```

- *Type:* string

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Account.property.props"></a>

```typescript
public readonly props: AccountProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps

---


### AppInsights <a name="AppInsights" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.Initializer"></a>

```typescript
import { azure_applicationinsights } from '@microsoft/terraform-cdk-constructs'

new azure_applicationinsights.AppInsights(scope: Construct, id: string, props: AppInsightsProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.addDiagSettings">addDiagSettings</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.saveIKeyToKeyVault">saveIKeyToKeyVault</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

##### `saveIKeyToKeyVault` <a name="saveIKeyToKeyVault" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.saveIKeyToKeyVault"></a>

```typescript
public saveIKeyToKeyVault(keyVaultId: string, keyVaultSecretName?: string): void
```

###### `keyVaultId`<sup>Required</sup> <a name="keyVaultId" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.saveIKeyToKeyVault.parameter.keyVaultId"></a>

- *Type:* string

---

###### `keyVaultSecretName`<sup>Optional</sup> <a name="keyVaultSecretName" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.saveIKeyToKeyVault.parameter.keyVaultSecretName"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.isConstruct"></a>

```typescript
import { azure_applicationinsights } from '@microsoft/terraform-cdk-constructs'

azure_applicationinsights.AppInsights.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsights.property.props"></a>

```typescript
public readonly props: AppInsightsProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps

---


### AuthorizationRule <a name="AuthorizationRule" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

new azure_eventhub.AuthorizationRule(scope: Construct, name: string, ehInstanceAuthProps: EventhubAuthorizationRuleConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.Initializer.parameter.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.Initializer.parameter.ehInstanceAuthProps">ehInstanceAuthProps</a></code> | <code>@cdktf/provider-azurerm.eventhubAuthorizationRule.EventhubAuthorizationRuleConfig</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.Initializer.parameter.name"></a>

- *Type:* string

---

##### `ehInstanceAuthProps`<sup>Required</sup> <a name="ehInstanceAuthProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.Initializer.parameter.ehInstanceAuthProps"></a>

- *Type:* @cdktf/provider-azurerm.eventhubAuthorizationRule.EventhubAuthorizationRuleConfig

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.addPrimaryConnectionStringToVault">addPrimaryConnectionStringToVault</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.addPrimaryKeyToVault">addPrimaryKeyToVault</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addPrimaryConnectionStringToVault` <a name="addPrimaryConnectionStringToVault" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.addPrimaryConnectionStringToVault"></a>

```typescript
public addPrimaryConnectionStringToVault(vault: Vault, name: string, expirationDate?: string): void
```

###### `vault`<sup>Required</sup> <a name="vault" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.addPrimaryConnectionStringToVault.parameter.vault"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.Vault

---

###### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.addPrimaryConnectionStringToVault.parameter.name"></a>

- *Type:* string

---

###### `expirationDate`<sup>Optional</sup> <a name="expirationDate" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.addPrimaryConnectionStringToVault.parameter.expirationDate"></a>

- *Type:* string

---

##### `addPrimaryKeyToVault` <a name="addPrimaryKeyToVault" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.addPrimaryKeyToVault"></a>

```typescript
public addPrimaryKeyToVault(vault: Vault, name: string, expirationDate?: string): void
```

###### `vault`<sup>Required</sup> <a name="vault" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.addPrimaryKeyToVault.parameter.vault"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.Vault

---

###### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.addPrimaryKeyToVault.parameter.name"></a>

- *Type:* string

---

###### `expirationDate`<sup>Optional</sup> <a name="expirationDate" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.addPrimaryKeyToVault.parameter.expirationDate"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.isConstruct"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

azure_eventhub.AuthorizationRule.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.property.ehInstanceAuthProps">ehInstanceAuthProps</a></code> | <code>@cdktf/provider-azurerm.eventhubAuthorizationRule.EventhubAuthorizationRuleConfig</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `ehInstanceAuthProps`<sup>Required</sup> <a name="ehInstanceAuthProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRule.property.ehInstanceAuthProps"></a>

```typescript
public readonly ehInstanceAuthProps: EventhubAuthorizationRuleConfig;
```

- *Type:* @cdktf/provider-azurerm.eventhubAuthorizationRule.EventhubAuthorizationRuleConfig

---


### AzureResource <a name="AzureResource" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.Initializer"></a>

```typescript
import { core_azure } from '@microsoft/terraform-cdk-constructs'

new core_azure.AzureResource(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResource.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResource.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResource.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResource.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResource.addDiagSettings">addDiagSettings</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResource.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.isConstruct"></a>

```typescript
import { core_azure } from '@microsoft/terraform-cdk-constructs'

core_azure.AzureResource.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResource.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResource.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResource.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResource.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---


### AzureResourceWithAlert <a name="AzureResourceWithAlert" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.Initializer"></a>

```typescript
import { core_azure } from '@microsoft/terraform-cdk-constructs'

new core_azure.AzureResourceWithAlert(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.addDiagSettings">addDiagSettings</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.addMetricAlert">addMetricAlert</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.addQueryRuleAlert">addQueryRuleAlert</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

##### `addMetricAlert` <a name="addMetricAlert" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.addMetricAlert"></a>

```typescript
public addMetricAlert(props: IBaseMetricAlertProps): void
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.addMetricAlert.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps

---

##### `addQueryRuleAlert` <a name="addQueryRuleAlert" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.addQueryRuleAlert"></a>

```typescript
public addQueryRuleAlert(props: BaseAzureQueryRuleAlertProps): void
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.addQueryRuleAlert.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.isConstruct"></a>

```typescript
import { core_azure } from '@microsoft/terraform-cdk-constructs'

core_azure.AzureResourceWithAlert.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.core_azure.AzureResourceWithAlert.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---


### Blob <a name="Blob" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.Initializer"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

new azure_storageaccount.Blob(scope: Construct, id: string, props: StorageBlobConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.Initializer.parameter.props">props</a></code> | <code>@cdktf/provider-azurerm.storageBlob.StorageBlobConfig</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.Initializer.parameter.props"></a>

- *Type:* @cdktf/provider-azurerm.storageBlob.StorageBlobConfig

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.isConstruct"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

azure_storageaccount.Blob.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Blob.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---


### CertificateIssuer <a name="CertificateIssuer" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.Initializer"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

new azure_keyvault.CertificateIssuer(scope: Construct, id: string, props: CertificateIssuerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.isConstruct"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

azure_keyvault.CertificateIssuer.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuer.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### Cluster <a name="Cluster" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

new azure_eventhub.Cluster(scope: Construct, name: string, ehClusterProps: ClusterProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.Initializer.parameter.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.Initializer.parameter.ehClusterProps">ehClusterProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.Initializer.parameter.name"></a>

- *Type:* string

---

##### `ehClusterProps`<sup>Required</sup> <a name="ehClusterProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.Initializer.parameter.ehClusterProps"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.addDiagSettings">addDiagSettings</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.isConstruct"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

azure_eventhub.Cluster.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.property.ehClusterProps">ehClusterProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `ehClusterProps`<sup>Required</sup> <a name="ehClusterProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Cluster.property.ehClusterProps"></a>

```typescript
public readonly ehClusterProps: ClusterProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps

---


### Cluster <a name="Cluster" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster"></a>

Class representing the AKS cluster resource.

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.Initializer"></a>

```typescript
import { azure_kubernetes } from '@microsoft/terraform-cdk-constructs'

new azure_kubernetes.Cluster(scope: Construct, id: string, props: ClusterProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | The scope in which to define this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.Initializer.parameter.id">id</a></code> | <code>string</code> | The unique ID or name for this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps</code> | The properties required to configure the AKS cluster. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which to define this construct.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.Initializer.parameter.id"></a>

- *Type:* string

The unique ID or name for this construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps

The properties required to configure the AKS cluster.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.addDiagSettings">addDiagSettings</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.isConstruct"></a>

```typescript
import { azure_kubernetes } from '@microsoft/terraform-cdk-constructs'

azure_kubernetes.Cluster.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.property.id">id</a></code> | <code>string</code> | The unique identifier of the AKS cluster resource. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The Resource Group associated with the AKS cluster. |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

The unique identifier of the AKS cluster resource.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.Cluster.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The Resource Group associated with the AKS cluster.

---


### Cluster <a name="Cluster" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.Initializer"></a>

```typescript
import { azure_kusto } from '@microsoft/terraform-cdk-constructs'

new azure_kusto.Cluster(scope: Construct, id: string, kustoProps: ClusterProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.Initializer.parameter.kustoProps">kustoProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.Initializer.parameter.id"></a>

- *Type:* string

---

##### `kustoProps`<sup>Required</sup> <a name="kustoProps" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.Initializer.parameter.kustoProps"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.addDiagSettings">addDiagSettings</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.addDatabase">addDatabase</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

##### `addDatabase` <a name="addDatabase" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.addDatabase"></a>

```typescript
public addDatabase(databaseProps: DatabaseProps): Database
```

###### `databaseProps`<sup>Required</sup> <a name="databaseProps" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.addDatabase.parameter.databaseProps"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.isConstruct"></a>

```typescript
import { azure_kusto } from '@microsoft/terraform-cdk-constructs'

azure_kusto.Cluster.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.property.kustoProps">kustoProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.property.uri">uri</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `kustoProps`<sup>Required</sup> <a name="kustoProps" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.property.kustoProps"></a>

```typescript
public readonly kustoProps: ClusterProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps

---

##### `uri`<sup>Required</sup> <a name="uri" id="@microsoft/terraform-cdk-constructs.azure_kusto.Cluster.property.uri"></a>

```typescript
public readonly uri: string;
```

- *Type:* string

---


### ConsumerGroup <a name="ConsumerGroup" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

new azure_eventhub.ConsumerGroup(scope: Construct, name: string, ehConsumerGroupProps: ConsumerGroupProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.Initializer.parameter.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.Initializer.parameter.ehConsumerGroupProps">ehConsumerGroupProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.Initializer.parameter.name"></a>

- *Type:* string

---

##### `ehConsumerGroupProps`<sup>Required</sup> <a name="ehConsumerGroupProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.Initializer.parameter.ehConsumerGroupProps"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.isConstruct"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

azure_eventhub.ConsumerGroup.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.property.ehConsumerGroupProps">ehConsumerGroupProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.property.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `ehConsumerGroupProps`<sup>Required</sup> <a name="ehConsumerGroupProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.property.ehConsumerGroupProps"></a>

```typescript
public readonly ehConsumerGroupProps: ConsumerGroupProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroup.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---


### Container <a name="Container" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.Initializer"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

new azure_storageaccount.Container(scope: Construct, id: string, props: StorageContainerConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.Initializer.parameter.props">props</a></code> | <code>@cdktf/provider-azurerm.storageContainer.StorageContainerConfig</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.Initializer.parameter.props"></a>

- *Type:* @cdktf/provider-azurerm.storageContainer.StorageContainerConfig

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.addBlob">addBlob</a></code> | Adds a blob to an Azure Storage Container. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addBlob` <a name="addBlob" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.addBlob"></a>

```typescript
public addBlob(blobName: string, filePath: string, props?: StorageBlobConfig): Blob
```

Adds a blob to an Azure Storage Container.

###### `blobName`<sup>Required</sup> <a name="blobName" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.addBlob.parameter.blobName"></a>

- *Type:* string

The name of the blob to be added.

---

###### `filePath`<sup>Required</sup> <a name="filePath" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.addBlob.parameter.filePath"></a>

- *Type:* string

The file path or URL for the source of the blob's content.

---

###### `props`<sup>Optional</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.addBlob.parameter.props"></a>

- *Type:* @cdktf/provider-azurerm.storageBlob.StorageBlobConfig

Optional configuration properties for the blob, such as blob type, content type, and metadata.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.isConstruct"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

azure_storageaccount.Container.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Container.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---


### Database <a name="Database" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.Initializer"></a>

```typescript
import { azure_kusto } from '@microsoft/terraform-cdk-constructs'

new azure_kusto.Database(scope: Construct, id: string, kustoDbProps: DatabaseProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Database.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Database.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Database.Initializer.parameter.kustoDbProps">kustoDbProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.Initializer.parameter.id"></a>

- *Type:* string

---

##### `kustoDbProps`<sup>Required</sup> <a name="kustoDbProps" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.Initializer.parameter.kustoDbProps"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Database.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Database.addPermission">addPermission</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Database.addScript">addScript</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Database.addTable">addTable</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addPermission` <a name="addPermission" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.addPermission"></a>

```typescript
public addPermission(kustoDatabaseAccessProps: DatabaseAccessProps): void
```

###### `kustoDatabaseAccessProps`<sup>Required</sup> <a name="kustoDatabaseAccessProps" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.addPermission.parameter.kustoDatabaseAccessProps"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.DatabaseAccessProps

---

##### `addScript` <a name="addScript" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.addScript"></a>

```typescript
public addScript(scriptName: string, scriptContent: string): void
```

###### `scriptName`<sup>Required</sup> <a name="scriptName" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.addScript.parameter.scriptName"></a>

- *Type:* string

---

###### `scriptContent`<sup>Required</sup> <a name="scriptContent" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.addScript.parameter.scriptContent"></a>

- *Type:* string

---

##### `addTable` <a name="addTable" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.addTable"></a>

```typescript
public addTable(tableName: string, tableSchema: TableSchemaProps[]): void
```

###### `tableName`<sup>Required</sup> <a name="tableName" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.addTable.parameter.tableName"></a>

- *Type:* string

---

###### `tableSchema`<sup>Required</sup> <a name="tableSchema" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.addTable.parameter.tableSchema"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.TableSchemaProps[]

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Database.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.isConstruct"></a>

```typescript
import { azure_kusto } from '@microsoft/terraform-cdk-constructs'

azure_kusto.Database.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Database.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Database.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Database.property.kustoDbProps">kustoDbProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Database.property.kustoProps">kustoProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.Database.property.rg">rg</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `kustoDbProps`<sup>Required</sup> <a name="kustoDbProps" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.property.kustoDbProps"></a>

```typescript
public readonly kustoDbProps: DatabaseProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps

---

##### `kustoProps`<sup>Required</sup> <a name="kustoProps" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.property.kustoProps"></a>

```typescript
public readonly kustoProps: ClusterProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps

---

##### `rg`<sup>Required</sup> <a name="rg" id="@microsoft/terraform-cdk-constructs.azure_kusto.Database.property.rg"></a>

```typescript
public readonly rg: string;
```

- *Type:* string

---


### DiagnosticSettings <a name="DiagnosticSettings" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.Initializer"></a>

```typescript
import { core_azure } from '@microsoft/terraform-cdk-constructs'

new core_azure.DiagnosticSettings(scope: Construct, id: string, props: DiagnosticSettingsProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.isConstruct"></a>

```typescript
import { core_azure } from '@microsoft/terraform-cdk-constructs'

core_azure.DiagnosticSettings.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettings.property.props"></a>

```typescript
public readonly props: DiagnosticSettingsProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps

---


### File <a name="File" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.File"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.File.Initializer"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

new azure_storageaccount.File(scope: Construct, id: string, props: StorageShareFileConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.File.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.File.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.File.Initializer.parameter.props">props</a></code> | <code>@cdktf/provider-azurerm.storageShareFile.StorageShareFileConfig</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.File.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.File.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.File.Initializer.parameter.props"></a>

- *Type:* @cdktf/provider-azurerm.storageShareFile.StorageShareFileConfig

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.File.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.File.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.File.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.File.isConstruct"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

azure_storageaccount.File.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.File.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.File.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.File.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.File.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.File.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.File.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.File.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---


### FileShare <a name="FileShare" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.Initializer"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

new azure_storageaccount.FileShare(scope: Construct, id: string, props: StorageShareConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.Initializer.parameter.props">props</a></code> | <code>@cdktf/provider-azurerm.storageShare.StorageShareConfig</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.Initializer.parameter.props"></a>

- *Type:* @cdktf/provider-azurerm.storageShare.StorageShareConfig

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.addFile">addFile</a></code> | Adds a file to the Azure Storage File Share. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addFile` <a name="addFile" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.addFile"></a>

```typescript
public addFile(fileName: string, fileSource?: string, props?: StorageShareFileConfig): File
```

Adds a file to the Azure Storage File Share.

###### `fileName`<sup>Required</sup> <a name="fileName" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.addFile.parameter.fileName"></a>

- *Type:* string

The name of the file to be added.

---

###### `fileSource`<sup>Optional</sup> <a name="fileSource" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.addFile.parameter.fileSource"></a>

- *Type:* string

Optional path or URL to the source of the file's content.

---

###### `props`<sup>Optional</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.addFile.parameter.props"></a>

- *Type:* @cdktf/provider-azurerm.storageShareFile.StorageShareFileConfig

Optional configuration properties for the file, such as content type, encoding, and metadata.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.isConstruct"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

azure_storageaccount.FileShare.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.property.storageAccountName">storageAccountName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.property.storageShareName">storageShareName</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `storageAccountName`<sup>Required</sup> <a name="storageAccountName" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.property.storageAccountName"></a>

```typescript
public readonly storageAccountName: string;
```

- *Type:* string

---

##### `storageShareName`<sup>Required</sup> <a name="storageShareName" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShare.property.storageShareName"></a>

```typescript
public readonly storageShareName: string;
```

- *Type:* string

---


### FunctionAppLinux <a name="FunctionAppLinux" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.Initializer"></a>

```typescript
import { azure_functionapp } from '@microsoft/terraform-cdk-constructs'

new azure_functionapp.FunctionAppLinux(scope: Construct, id: string, props: FunctionAppLinuxProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - The scope in which to define this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.Initializer.parameter.id">id</a></code> | <code>string</code> | - The ID of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps</code> | - The properties for configuring the Azure Function App on Linux. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which to define this construct.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.Initializer.parameter.id"></a>

- *Type:* string

The ID of this construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps

The properties for configuring the Azure Function App on Linux.

The properties include:
  - `name`: Required. Unique name for the Function App within Azure.
  - `location`: Required. Azure Region for deployment.
  - `resourceGroup`: Optional. Reference to the resource group for deployment.
  - `storageAccount`: Optional. Reference to the storage account used by the Function App.
  - `runtimeVersion`: Optional. Specifies the runtime version (Node.js, .NET, Java, etc.).
  - `servicePlan`: Optional. ID of an existing App Service Plan.
  - `servicePlanSku`: Optional. SKU for the App Service Plan.
  - `tags`: Optional. Tags for resource management.
  - `siteConfig`: Optional. Additional site configuration settings.
  - Additional optional properties as described in `FunctionAppLinuxProps` interface.

Example usage:
```typescript
new FunctionAppLinux(this, 'premiumFA', {
name: `faprem${this.name}`,
location: 'eastus',
servicePlanSku: ServicePlanSkus.PremiumEP1,
runtimeVersion: {
dotnetVersion: '5.0',
},
tags: {
"test": "test"
}
});
```

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.addDiagSettings">addDiagSettings</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.isConstruct"></a>

```typescript
import { azure_functionapp } from '@microsoft/terraform-cdk-constructs'

azure_functionapp.FunctionAppLinux.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.defaultHostname">defaultHostname</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.kind">kind</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.servicePlan">servicePlan</a></code> | <code>@cdktf/provider-azurerm.servicePlan.ServicePlan</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.storageAccount">storageAccount</a></code> | <code>@cdktf/provider-azurerm.storageAccount.StorageAccount</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `defaultHostname`<sup>Required</sup> <a name="defaultHostname" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.defaultHostname"></a>

```typescript
public readonly defaultHostname: string;
```

- *Type:* string

---

##### `kind`<sup>Required</sup> <a name="kind" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.kind"></a>

```typescript
public readonly kind: string;
```

- *Type:* string

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `servicePlan`<sup>Required</sup> <a name="servicePlan" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.servicePlan"></a>

```typescript
public readonly servicePlan: ServicePlan;
```

- *Type:* @cdktf/provider-azurerm.servicePlan.ServicePlan

---

##### `storageAccount`<sup>Required</sup> <a name="storageAccount" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinux.property.storageAccount"></a>

```typescript
public readonly storageAccount: StorageAccount;
```

- *Type:* @cdktf/provider-azurerm.storageAccount.StorageAccount

---


### Gateway <a name="Gateway" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.Initializer"></a>

```typescript
import { azure_applicationgateway } from '@microsoft/terraform-cdk-constructs'

new azure_applicationgateway.Gateway(scope: Construct, id: string, props: IGatewayProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.addDiagSettings">addDiagSettings</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.isConstruct"></a>

```typescript
import { azure_applicationgateway } from '@microsoft/terraform-cdk-constructs'

azure_applicationgateway.Gateway.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.Gateway.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---


### Group <a name="Group" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.Initializer"></a>

```typescript
import { azure_resourcegroup } from '@microsoft/terraform-cdk-constructs'

new azure_resourcegroup.Group(scope: Construct, id: string, props?: GroupProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.addDiagSettings">addDiagSettings</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.isConstruct"></a>

```typescript
import { azure_resourcegroup } from '@microsoft/terraform-cdk-constructs'

azure_resourcegroup.Group.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.location">location</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.idOutput">idOutput</a></code> | <code>cdktf.TerraformOutput</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.locationOutput">locationOutput</a></code> | <code>cdktf.TerraformOutput</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.nameOutput">nameOutput</a></code> | <code>cdktf.TerraformOutput</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.props"></a>

```typescript
public readonly props: GroupProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps

---

##### `idOutput`<sup>Required</sup> <a name="idOutput" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.idOutput"></a>

```typescript
public readonly idOutput: TerraformOutput;
```

- *Type:* cdktf.TerraformOutput

---

##### `locationOutput`<sup>Required</sup> <a name="locationOutput" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.locationOutput"></a>

```typescript
public readonly locationOutput: TerraformOutput;
```

- *Type:* cdktf.TerraformOutput

---

##### `nameOutput`<sup>Required</sup> <a name="nameOutput" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.Group.property.nameOutput"></a>

```typescript
public readonly nameOutput: TerraformOutput;
```

- *Type:* cdktf.TerraformOutput

---


### Instance <a name="Instance" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

new azure_eventhub.Instance(scope: Construct, name: string, ehInstanceProps: InstanceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.Initializer.parameter.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.Initializer.parameter.ehInstanceProps">ehInstanceProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.Initializer.parameter.name"></a>

- *Type:* string

---

##### `ehInstanceProps`<sup>Required</sup> <a name="ehInstanceProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.Initializer.parameter.ehInstanceProps"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.addAuthorizationRule">addAuthorizationRule</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.addConsumerGroup">addConsumerGroup</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.addKustoDataConnection">addKustoDataConnection</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAuthorizationRule` <a name="addAuthorizationRule" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.addAuthorizationRule"></a>

```typescript
public addAuthorizationRule(props: AuthorizationRuleProps): AuthorizationRule
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.addAuthorizationRule.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRuleProps

---

##### `addConsumerGroup` <a name="addConsumerGroup" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.addConsumerGroup"></a>

```typescript
public addConsumerGroup(name: string, userMetadata?: string): ConsumerGroup
```

###### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.addConsumerGroup.parameter.name"></a>

- *Type:* string

---

###### `userMetadata`<sup>Optional</sup> <a name="userMetadata" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.addConsumerGroup.parameter.userMetadata"></a>

- *Type:* string

---

##### `addKustoDataConnection` <a name="addKustoDataConnection" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.addKustoDataConnection"></a>

```typescript
public addKustoDataConnection(props: BaseKustoDataConnectionProps): KustoDataConnection
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.addKustoDataConnection.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.isConstruct"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

azure_eventhub.Instance.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.property.ehInstanceProps">ehInstanceProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.property.partitionIds">partitionIds</a></code> | <code>string[]</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `ehInstanceProps`<sup>Required</sup> <a name="ehInstanceProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.property.ehInstanceProps"></a>

```typescript
public readonly ehInstanceProps: InstanceProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `partitionIds`<sup>Required</sup> <a name="partitionIds" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Instance.property.partitionIds"></a>

```typescript
public readonly partitionIds: string[];
```

- *Type:* string[]

---


### Key <a name="Key" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Key"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Key.Initializer"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

new azure_keyvault.Key(scope: Construct, id: string, props: KeyProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Key.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Key.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Key.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Key.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Key.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Key.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Key.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Key.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Key.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Key.isConstruct"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

azure_keyvault.Key.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Key.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Key.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Key.property.vaultKey">vaultKey</a></code> | <code>@cdktf/provider-azurerm.keyVaultKey.KeyVaultKey</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Key.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `vaultKey`<sup>Required</sup> <a name="vaultKey" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Key.property.vaultKey"></a>

```typescript
public readonly vaultKey: KeyVaultKey;
```

- *Type:* @cdktf/provider-azurerm.keyVaultKey.KeyVaultKey

---


### KustoDataConnection <a name="KustoDataConnection" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

new azure_eventhub.KustoDataConnection(scope: Construct, id: string, kustoDataConnectionProps: KustoDataConnectionProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.Initializer.parameter.kustoDataConnectionProps">kustoDataConnectionProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.Initializer.parameter.id"></a>

- *Type:* string

---

##### `kustoDataConnectionProps`<sup>Required</sup> <a name="kustoDataConnectionProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.Initializer.parameter.kustoDataConnectionProps"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.isConstruct"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

azure_eventhub.KustoDataConnection.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.property.eventhubKustoDataConnectionProps">eventhubKustoDataConnectionProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `eventhubKustoDataConnectionProps`<sup>Required</sup> <a name="eventhubKustoDataConnectionProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnection.property.eventhubKustoDataConnectionProps"></a>

```typescript
public readonly eventhubKustoDataConnectionProps: KustoDataConnectionProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps

---


### LinuxCluster <a name="LinuxCluster" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.Initializer"></a>

```typescript
import { azure_virtualmachinescaleset } from '@microsoft/terraform-cdk-constructs'

new azure_virtualmachinescaleset.LinuxCluster(scope: Construct, id: string, props: LinuxClusterProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - The scope in which this construct is defined. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.Initializer.parameter.id">id</a></code> | <code>string</code> | - The ID of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps</code> | - The properties for defining a Linux Virtual Machine. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which this construct is defined.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.Initializer.parameter.id"></a>

- *Type:* string

The ID of this construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps

The properties for defining a Linux Virtual Machine.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.addDiagSettings">addDiagSettings</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.isConstruct"></a>

```typescript
import { azure_virtualmachinescaleset } from '@microsoft/terraform-cdk-constructs'

azure_virtualmachinescaleset.LinuxCluster.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.property.fqn">fqn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `fqn`<sup>Required</sup> <a name="fqn" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.property.fqn"></a>

```typescript
public readonly fqn: string;
```

- *Type:* string

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxCluster.property.props"></a>

```typescript
public readonly props: LinuxClusterProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps

---


### LinuxVM <a name="LinuxVM" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.Initializer"></a>

```typescript
import { azure_virtualmachine } from '@microsoft/terraform-cdk-constructs'

new azure_virtualmachine.LinuxVM(scope: Construct, id: string, props: LinuxVMProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - The scope in which this construct is defined. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.Initializer.parameter.id">id</a></code> | <code>string</code> | - The ID of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps</code> | - The properties for defining a Linux Virtual Machine. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which this construct is defined.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.Initializer.parameter.id"></a>

- *Type:* string

The ID of this construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps

The properties for defining a Linux Virtual Machine.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.addDiagSettings">addDiagSettings</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.isConstruct"></a>

```typescript
import { azure_virtualmachine } from '@microsoft/terraform-cdk-constructs'

azure_virtualmachine.LinuxVM.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.property.publicIp">publicIp</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.property.props"></a>

```typescript
public readonly props: LinuxVMProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps

---

##### `publicIp`<sup>Optional</sup> <a name="publicIp" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVM.property.publicIp"></a>

```typescript
public readonly publicIp: string;
```

- *Type:* string

---


### MetricAlert <a name="MetricAlert" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.Initializer"></a>

```typescript
import { azure_metricalert } from '@microsoft/terraform-cdk-constructs'

new azure_metricalert.MetricAlert(scope: Construct, id: string, props: IMetricAlertProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - The scope in which this construct is defined. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.Initializer.parameter.id">id</a></code> | <code>string</code> | - The ID of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps</code> | - The properties required for Metric Alert. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which this construct is defined.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.Initializer.parameter.id"></a>

- *Type:* string

The ID of this construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps

The properties required for Metric Alert.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.isConstruct"></a>

```typescript
import { azure_metricalert } from '@microsoft/terraform-cdk-constructs'

azure_metricalert.MetricAlert.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlert.property.props"></a>

```typescript
public readonly props: IMetricAlertProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps

---


### Namespace <a name="Namespace" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

new azure_eventhub.Namespace(scope: Construct, name: string, ehNamespaceProps: NamespaceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.Initializer.parameter.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.Initializer.parameter.ehNamespaceProps">ehNamespaceProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.Initializer.parameter.name"></a>

- *Type:* string

---

##### `ehNamespaceProps`<sup>Required</sup> <a name="ehNamespaceProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.Initializer.parameter.ehNamespaceProps"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addDiagSettings">addDiagSettings</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addMetricAlert">addMetricAlert</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addQueryRuleAlert">addQueryRuleAlert</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addEventhubInstance">addEventhubInstance</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

##### `addMetricAlert` <a name="addMetricAlert" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addMetricAlert"></a>

```typescript
public addMetricAlert(props: IBaseMetricAlertProps): void
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addMetricAlert.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps

---

##### `addQueryRuleAlert` <a name="addQueryRuleAlert" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addQueryRuleAlert"></a>

```typescript
public addQueryRuleAlert(props: BaseAzureQueryRuleAlertProps): void
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addQueryRuleAlert.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps

---

##### `addEventhubInstance` <a name="addEventhubInstance" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addEventhubInstance"></a>

```typescript
public addEventhubInstance(props: BaseInstanceProps): Instance
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.addEventhubInstance.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_eventhub.BaseInstanceProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.isConstruct"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

azure_eventhub.Namespace.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.property.ehNamespaceProps">ehNamespaceProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.property.namespaceName">namespaceName</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `ehNamespaceProps`<sup>Required</sup> <a name="ehNamespaceProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.property.ehNamespaceProps"></a>

```typescript
public readonly ehNamespaceProps: NamespaceProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps

---

##### `namespaceName`<sup>Required</sup> <a name="namespaceName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.Namespace.property.namespaceName"></a>

```typescript
public readonly namespaceName: string;
```

- *Type:* string

---


### Network <a name="Network" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.Initializer"></a>

```typescript
import { azure_virtualnetwork } from '@microsoft/terraform-cdk-constructs'

new azure_virtualnetwork.Network(scope: Construct, id: string, props: NetworkProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.addDiagSettings">addDiagSettings</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.addVnetPeering">addVnetPeering</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

##### `addVnetPeering` <a name="addVnetPeering" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.addVnetPeering"></a>

```typescript
public addVnetPeering(remoteVirtualNetwork: Network, localPeerSettings?: PeerSettings, remotePeerSettings?: PeerSettings): void
```

###### `remoteVirtualNetwork`<sup>Required</sup> <a name="remoteVirtualNetwork" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.addVnetPeering.parameter.remoteVirtualNetwork"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network

---

###### `localPeerSettings`<sup>Optional</sup> <a name="localPeerSettings" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.addVnetPeering.parameter.localPeerSettings"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings

---

###### `remotePeerSettings`<sup>Optional</sup> <a name="remotePeerSettings" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.addVnetPeering.parameter.remotePeerSettings"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.isConstruct"></a>

```typescript
import { azure_virtualnetwork } from '@microsoft/terraform-cdk-constructs'

azure_virtualnetwork.Network.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.subnets">subnets</a></code> | <code>{[ key: string ]: @cdktf/provider-azurerm.subnet.Subnet}</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.virtualNetwork">virtualNetwork</a></code> | <code>@cdktf/provider-azurerm.virtualNetwork.VirtualNetwork</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.props"></a>

```typescript
public readonly props: NetworkProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps

---

##### `subnets`<sup>Required</sup> <a name="subnets" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.subnets"></a>

```typescript
public readonly subnets: {[ key: string ]: Subnet};
```

- *Type:* {[ key: string ]: @cdktf/provider-azurerm.subnet.Subnet}

---

##### `virtualNetwork`<sup>Required</sup> <a name="virtualNetwork" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network.property.virtualNetwork"></a>

```typescript
public readonly virtualNetwork: VirtualNetwork;
```

- *Type:* @cdktf/provider-azurerm.virtualNetwork.VirtualNetwork

---


### Peer <a name="Peer" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.Initializer"></a>

```typescript
import { azure_virtualnetwork } from '@microsoft/terraform-cdk-constructs'

new azure_virtualnetwork.Peer(scope: Construct, name: string, props: PeerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.Initializer.parameter.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.Initializer.parameter.name"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.isConstruct"></a>

```typescript
import { azure_virtualnetwork } from '@microsoft/terraform-cdk-constructs'

azure_virtualnetwork.Peer.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Peer.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### QueryRuleAlert <a name="QueryRuleAlert" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.Initializer"></a>

```typescript
import { azure_queryrulealert } from '@microsoft/terraform-cdk-constructs'

new azure_queryrulealert.QueryRuleAlert(scope: Construct, id: string, props: AzureQueryRuleAlertProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - The scope in which this construct is defined. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.Initializer.parameter.id">id</a></code> | <code>string</code> | - The ID of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps</code> | - The properties required for Azure Query Rule Alert. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which this construct is defined.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.Initializer.parameter.id"></a>

- *Type:* string

The ID of this construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps

The properties required for Azure Query Rule Alert.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.isConstruct"></a>

```typescript
import { azure_queryrulealert } from '@microsoft/terraform-cdk-constructs'

azure_queryrulealert.QueryRuleAlert.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.property.queryRuleAlertProps">queryRuleAlertProps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `queryRuleAlertProps`<sup>Required</sup> <a name="queryRuleAlertProps" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.property.queryRuleAlertProps"></a>

```typescript
public readonly queryRuleAlertProps: AzureQueryRuleAlertProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.QueryRuleAlert.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---


### Queue <a name="Queue" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.Initializer"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

new azure_storageaccount.Queue(scope: Construct, id: string, props: StorageQueueConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.Initializer.parameter.props">props</a></code> | <code>@cdktf/provider-azurerm.storageQueue.StorageQueueConfig</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.Initializer.parameter.props"></a>

- *Type:* @cdktf/provider-azurerm.storageQueue.StorageQueueConfig

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.isConstruct"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

azure_storageaccount.Queue.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Queue.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---


### Rbac <a name="Rbac" id="@microsoft/terraform-cdk-constructs.core_azure.Rbac"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.core_azure.Rbac.Initializer"></a>

```typescript
import { core_azure } from '@microsoft/terraform-cdk-constructs'

new core_azure.Rbac(scope: Construct, id: string, props: RbacProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.Rbac.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - The scope in which this construct is defined. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.Rbac.Initializer.parameter.id">id</a></code> | <code>string</code> | - The ID of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.Rbac.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.core_azure.RbacProps</code> | - The properties required for Azure RBAC. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.core_azure.Rbac.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which this construct is defined.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.core_azure.Rbac.Initializer.parameter.id"></a>

- *Type:* string

The ID of this construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.core_azure.Rbac.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.RbacProps

The properties required for Azure RBAC.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.Rbac.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.core_azure.Rbac.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.Rbac.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.core_azure.Rbac.isConstruct"></a>

```typescript
import { core_azure } from '@microsoft/terraform-cdk-constructs'

core_azure.Rbac.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.core_azure.Rbac.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.Rbac.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.core_azure.Rbac.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### Registry <a name="Registry" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.Initializer"></a>

```typescript
import { azure_containerregistry } from '@microsoft/terraform-cdk-constructs'

new azure_containerregistry.Registry(scope: Construct, id: string, props: RegistryProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.addDiagSettings">addDiagSettings</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.isConstruct"></a>

```typescript
import { azure_containerregistry } from '@microsoft/terraform-cdk-constructs'

azure_containerregistry.Registry.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.Registry.property.props"></a>

```typescript
public readonly props: RegistryProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps

---


### Secret <a name="Secret" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Secret"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.Initializer"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

new azure_keyvault.Secret(scope: Construct, id: string, props: SecretProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.isConstruct"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

azure_keyvault.Secret.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.property.secretId">secretId</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `secretId`<sup>Required</sup> <a name="secretId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Secret.property.secretId"></a>

```typescript
public readonly secretId: string;
```

- *Type:* string

---


### SecurityGroup <a name="SecurityGroup" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.Initializer"></a>

```typescript
import { azure_networksecuritygroup } from '@microsoft/terraform-cdk-constructs'

new azure_networksecuritygroup.SecurityGroup(scope: Construct, id: string, props: SecurityGroupProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.addDiagSettings">addDiagSettings</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.associateToNetworkInterface">associateToNetworkInterface</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.associateToSubnet">associateToSubnet</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

##### `associateToNetworkInterface` <a name="associateToNetworkInterface" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.associateToNetworkInterface"></a>

```typescript
public associateToNetworkInterface(networkInterface: NetworkInterface): void
```

###### `networkInterface`<sup>Required</sup> <a name="networkInterface" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.associateToNetworkInterface.parameter.networkInterface"></a>

- *Type:* @cdktf/provider-azurerm.networkInterface.NetworkInterface

---

##### `associateToSubnet` <a name="associateToSubnet" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.associateToSubnet"></a>

```typescript
public associateToSubnet(subnet: Subnet): void
```

###### `subnet`<sup>Required</sup> <a name="subnet" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.associateToSubnet.parameter.subnet"></a>

- *Type:* @cdktf/provider-azurerm.subnet.Subnet

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.isConstruct"></a>

```typescript
import { azure_networksecuritygroup } from '@microsoft/terraform-cdk-constructs'

azure_networksecuritygroup.SecurityGroup.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroup.property.props"></a>

```typescript
public readonly props: SecurityGroupProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps

---


### SecurityGroupAssociations <a name="SecurityGroupAssociations" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.Initializer"></a>

```typescript
import { azure_networksecuritygroup } from '@microsoft/terraform-cdk-constructs'

new azure_networksecuritygroup.SecurityGroupAssociations(scope: Construct, id: string, props: SecurityGroupAssociationsProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociationsProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociationsProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.isConstruct"></a>

```typescript
import { azure_networksecuritygroup } from '@microsoft/terraform-cdk-constructs'

azure_networksecuritygroup.SecurityGroupAssociations.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociations.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### SelfSignedCertificate <a name="SelfSignedCertificate" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.Initializer"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

new azure_keyvault.SelfSignedCertificate(scope: Construct, id: string, props: SelfSignedCertificateProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.isConstruct"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

azure_keyvault.SelfSignedCertificate.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.property.certificate">certificate</a></code> | <code>@cdktf/provider-azurerm.keyVaultCertificate.KeyVaultCertificate</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.property.secretId">secretId</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `certificate`<sup>Required</sup> <a name="certificate" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.property.certificate"></a>

```typescript
public readonly certificate: KeyVaultCertificate;
```

- *Type:* @cdktf/provider-azurerm.keyVaultCertificate.KeyVaultCertificate

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `secretId`<sup>Required</sup> <a name="secretId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificate.property.secretId"></a>

```typescript
public readonly secretId: string;
```

- *Type:* string

---


### Table <a name="Table" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Table"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.Initializer"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

new azure_storageaccount.Table(scope: Construct, id: string, props: StorageTableConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.Initializer.parameter.props">props</a></code> | <code>@cdktf/provider-azurerm.storageTable.StorageTableConfig</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.Initializer.parameter.props"></a>

- *Type:* @cdktf/provider-azurerm.storageTable.StorageTableConfig

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.isConstruct"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

azure_storageaccount.Table.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.Table.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---


### Vault <a name="Vault" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.Initializer"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

new azure_keyvault.Vault(scope: Construct, id: string, props: VaultProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addDiagSettings">addDiagSettings</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addCertIssuer">addCertIssuer</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addKey">addKey</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addRSAKey">addRSAKey</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addSecret">addSecret</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addSelfSignedCert">addSelfSignedCert</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantCertAdminAccess">grantCertAdminAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantCertReaderAccess">grantCertReaderAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantCustomAccess">grantCustomAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantKeyAdminAccess">grantKeyAdminAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantKeyReaderAccess">grantKeyReaderAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantSecretAdminAccess">grantSecretAdminAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantSecretReaderAccess">grantSecretReaderAccess</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

##### `addCertIssuer` <a name="addCertIssuer" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addCertIssuer"></a>

```typescript
public addCertIssuer(name: string, provider: string): void
```

###### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addCertIssuer.parameter.name"></a>

- *Type:* string

---

###### `provider`<sup>Required</sup> <a name="provider" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addCertIssuer.parameter.provider"></a>

- *Type:* string

---

##### `addKey` <a name="addKey" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addKey"></a>

```typescript
public addKey(keyVaultKeyName: string, keyType: string, keySize: number, keyOpts: string[], expirationDate?: string): KeyVaultKey
```

###### `keyVaultKeyName`<sup>Required</sup> <a name="keyVaultKeyName" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addKey.parameter.keyVaultKeyName"></a>

- *Type:* string

---

###### `keyType`<sup>Required</sup> <a name="keyType" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addKey.parameter.keyType"></a>

- *Type:* string

---

###### `keySize`<sup>Required</sup> <a name="keySize" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addKey.parameter.keySize"></a>

- *Type:* number

---

###### `keyOpts`<sup>Required</sup> <a name="keyOpts" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addKey.parameter.keyOpts"></a>

- *Type:* string[]

---

###### `expirationDate`<sup>Optional</sup> <a name="expirationDate" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addKey.parameter.expirationDate"></a>

- *Type:* string

---

##### `addRSAKey` <a name="addRSAKey" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addRSAKey"></a>

```typescript
public addRSAKey(keyVaultKeyName: string, expirationDate?: string): KeyVaultKey
```

###### `keyVaultKeyName`<sup>Required</sup> <a name="keyVaultKeyName" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addRSAKey.parameter.keyVaultKeyName"></a>

- *Type:* string

---

###### `expirationDate`<sup>Optional</sup> <a name="expirationDate" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addRSAKey.parameter.expirationDate"></a>

- *Type:* string

---

##### `addSecret` <a name="addSecret" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addSecret"></a>

```typescript
public addSecret(keyVaultSecretName: string, secretValue: string, expirationDate?: string, contentType?: string): void
```

###### `keyVaultSecretName`<sup>Required</sup> <a name="keyVaultSecretName" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addSecret.parameter.keyVaultSecretName"></a>

- *Type:* string

---

###### `secretValue`<sup>Required</sup> <a name="secretValue" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addSecret.parameter.secretValue"></a>

- *Type:* string

---

###### `expirationDate`<sup>Optional</sup> <a name="expirationDate" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addSecret.parameter.expirationDate"></a>

- *Type:* string

---

###### `contentType`<sup>Optional</sup> <a name="contentType" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addSecret.parameter.contentType"></a>

- *Type:* string

---

##### `addSelfSignedCert` <a name="addSelfSignedCert" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addSelfSignedCert"></a>

```typescript
public addSelfSignedCert(certName: string, subject: string, dnsNames: string[], actionType?: string, daysBeforeExpiry?: number): KeyVaultCertificate
```

###### `certName`<sup>Required</sup> <a name="certName" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addSelfSignedCert.parameter.certName"></a>

- *Type:* string

---

###### `subject`<sup>Required</sup> <a name="subject" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addSelfSignedCert.parameter.subject"></a>

- *Type:* string

---

###### `dnsNames`<sup>Required</sup> <a name="dnsNames" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addSelfSignedCert.parameter.dnsNames"></a>

- *Type:* string[]

---

###### `actionType`<sup>Optional</sup> <a name="actionType" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addSelfSignedCert.parameter.actionType"></a>

- *Type:* string

---

###### `daysBeforeExpiry`<sup>Optional</sup> <a name="daysBeforeExpiry" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.addSelfSignedCert.parameter.daysBeforeExpiry"></a>

- *Type:* number

---

##### `grantCertAdminAccess` <a name="grantCertAdminAccess" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantCertAdminAccess"></a>

```typescript
public grantCertAdminAccess(azureAdGroupId: string): void
```

###### `azureAdGroupId`<sup>Required</sup> <a name="azureAdGroupId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantCertAdminAccess.parameter.azureAdGroupId"></a>

- *Type:* string

---

##### `grantCertReaderAccess` <a name="grantCertReaderAccess" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantCertReaderAccess"></a>

```typescript
public grantCertReaderAccess(azureAdGroupId: string): void
```

###### `azureAdGroupId`<sup>Required</sup> <a name="azureAdGroupId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantCertReaderAccess.parameter.azureAdGroupId"></a>

- *Type:* string

---

##### `grantCustomAccess` <a name="grantCustomAccess" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantCustomAccess"></a>

```typescript
public grantCustomAccess(azureAdGroupId: string, options: GrantCustomAccessOptions): void
```

###### `azureAdGroupId`<sup>Required</sup> <a name="azureAdGroupId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantCustomAccess.parameter.azureAdGroupId"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantCustomAccess.parameter.options"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.GrantCustomAccessOptions

---

##### `grantKeyAdminAccess` <a name="grantKeyAdminAccess" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantKeyAdminAccess"></a>

```typescript
public grantKeyAdminAccess(azureAdGroupId: string): void
```

###### `azureAdGroupId`<sup>Required</sup> <a name="azureAdGroupId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantKeyAdminAccess.parameter.azureAdGroupId"></a>

- *Type:* string

---

##### `grantKeyReaderAccess` <a name="grantKeyReaderAccess" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantKeyReaderAccess"></a>

```typescript
public grantKeyReaderAccess(azureAdGroupId: string): void
```

###### `azureAdGroupId`<sup>Required</sup> <a name="azureAdGroupId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantKeyReaderAccess.parameter.azureAdGroupId"></a>

- *Type:* string

---

##### `grantSecretAdminAccess` <a name="grantSecretAdminAccess" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantSecretAdminAccess"></a>

```typescript
public grantSecretAdminAccess(azureAdGroupId: string): void
```

###### `azureAdGroupId`<sup>Required</sup> <a name="azureAdGroupId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantSecretAdminAccess.parameter.azureAdGroupId"></a>

- *Type:* string

---

##### `grantSecretReaderAccess` <a name="grantSecretReaderAccess" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantSecretReaderAccess"></a>

```typescript
public grantSecretReaderAccess(azureAdGroupId: string): void
```

###### `azureAdGroupId`<sup>Required</sup> <a name="azureAdGroupId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.grantSecretReaderAccess.parameter.azureAdGroupId"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.isConstruct"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

azure_keyvault.Vault.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.property.keyVault">keyVault</a></code> | <code>@cdktf/provider-azurerm.keyVault.KeyVault</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.property.props"></a>

```typescript
public readonly props: VaultProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps

---

##### `keyVault`<sup>Required</sup> <a name="keyVault" id="@microsoft/terraform-cdk-constructs.azure_keyvault.Vault.property.keyVault"></a>

```typescript
public readonly keyVault: KeyVault;
```

- *Type:* @cdktf/provider-azurerm.keyVault.KeyVault

---


### WindowsCluster <a name="WindowsCluster" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.Initializer"></a>

```typescript
import { azure_virtualmachinescaleset } from '@microsoft/terraform-cdk-constructs'

new azure_virtualmachinescaleset.WindowsCluster(scope: Construct, id: string, props: WindowsClusterProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - The scope in which this construct is defined. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.Initializer.parameter.id">id</a></code> | <code>string</code> | - The ID of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps</code> | - The properties for defining a Windows Virtual Machine. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which this construct is defined.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.Initializer.parameter.id"></a>

- *Type:* string

The ID of this construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps

The properties for defining a Windows Virtual Machine.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.addDiagSettings">addDiagSettings</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.isConstruct"></a>

```typescript
import { azure_virtualmachinescaleset } from '@microsoft/terraform-cdk-constructs'

azure_virtualmachinescaleset.WindowsCluster.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsCluster.property.props"></a>

```typescript
public readonly props: WindowsClusterProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps

---


### WindowsVM <a name="WindowsVM" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.Initializer"></a>

```typescript
import { azure_virtualmachine } from '@microsoft/terraform-cdk-constructs'

new azure_virtualmachine.WindowsVM(scope: Construct, id: string, props: WindowsVMProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - The scope in which this construct is defined. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.Initializer.parameter.id">id</a></code> | <code>string</code> | - The ID of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps</code> | - The properties for defining a Windows Virtual Machine. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which this construct is defined.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.Initializer.parameter.id"></a>

- *Type:* string

The ID of this construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps

The properties for defining a Windows Virtual Machine.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.addDiagSettings">addDiagSettings</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.isConstruct"></a>

```typescript
import { azure_virtualmachine } from '@microsoft/terraform-cdk-constructs'

azure_virtualmachine.WindowsVM.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.property.publicIp">publicIp</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.property.props"></a>

```typescript
public readonly props: WindowsVMProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps

---

##### `publicIp`<sup>Optional</sup> <a name="publicIp" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVM.property.publicIp"></a>

```typescript
public readonly publicIp: string;
```

- *Type:* string

---


### Workspace <a name="Workspace" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.Initializer"></a>

```typescript
import { azure_loganalytics } from '@microsoft/terraform-cdk-constructs'

new azure_loganalytics.Workspace(scope: Construct, id: string, props: WorkspaceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.Initializer.parameter.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.Initializer.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.addAccess">addAccess</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.addDiagSettings">addDiagSettings</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.addMetricAlert">addMetricAlert</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.addQueryRuleAlert">addQueryRuleAlert</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addAccess` <a name="addAccess" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.addAccess"></a>

```typescript
public addAccess(objectId: string, customRoleName: string): void
```

###### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.addAccess.parameter.objectId"></a>

- *Type:* string

---

###### `customRoleName`<sup>Required</sup> <a name="customRoleName" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.addAccess.parameter.customRoleName"></a>

- *Type:* string

---

##### `addDiagSettings` <a name="addDiagSettings" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.addDiagSettings"></a>

```typescript
public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.addDiagSettings.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps

---

##### `addMetricAlert` <a name="addMetricAlert" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.addMetricAlert"></a>

```typescript
public addMetricAlert(props: IBaseMetricAlertProps): void
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.addMetricAlert.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps

---

##### `addQueryRuleAlert` <a name="addQueryRuleAlert" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.addQueryRuleAlert"></a>

```typescript
public addQueryRuleAlert(props: BaseAzureQueryRuleAlertProps): void
```

###### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.addQueryRuleAlert.parameter.props"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.isConstruct"></a>

```typescript
import { azure_loganalytics } from '@microsoft/terraform-cdk-constructs'

azure_loganalytics.Workspace.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.property.props">props</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `id`<sup>Required</sup> <a name="id" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

---

##### `props`<sup>Required</sup> <a name="props" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Workspace.property.props"></a>

```typescript
public readonly props: WorkspaceProps;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps

---


## Structs <a name="Structs" id="Structs"></a>

### AccessPolicyProps <a name="AccessPolicyProps" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.Initializer"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

const accessPolicyProps: azure_keyvault.AccessPolicyProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.keyVaultId">keyVaultId</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.Vault</code> | The Azure Key Vault instance or its identifier. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.objectId">objectId</a></code> | <code>string</code> | The Azure Active Directory object ID for which the policy will be applied. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.tenantId">tenantId</a></code> | <code>string</code> | The Azure Active Directory tenant ID where the Key Vault is hosted. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.certificatePermissions">certificatePermissions</a></code> | <code>string[]</code> | The permissions to certificates stored in the Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.keyPermissions">keyPermissions</a></code> | <code>string[]</code> | The permissions to keys stored in the Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.secretPermissions">secretPermissions</a></code> | <code>string[]</code> | The permissions to secrets stored in the Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.storagePermissions">storagePermissions</a></code> | <code>string[]</code> | The permissions to storage accounts linked to the Key Vault. |

---

##### `keyVaultId`<sup>Required</sup> <a name="keyVaultId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.keyVaultId"></a>

```typescript
public readonly keyVaultId: Vault;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.Vault

The Azure Key Vault instance or its identifier.

---

##### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.objectId"></a>

```typescript
public readonly objectId: string;
```

- *Type:* string

The Azure Active Directory object ID for which the policy will be applied.

This can be a user, group, or service principal.

---

##### `tenantId`<sup>Required</sup> <a name="tenantId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.tenantId"></a>

```typescript
public readonly tenantId: string;
```

- *Type:* string

The Azure Active Directory tenant ID where the Key Vault is hosted.

This is typically the directory ID of your Azure AD.

---

##### `certificatePermissions`<sup>Optional</sup> <a name="certificatePermissions" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.certificatePermissions"></a>

```typescript
public readonly certificatePermissions: string[];
```

- *Type:* string[]

The permissions to certificates stored in the Key Vault.

Possible values might include: 'get', 'list', 'create', 'update', etc.
If not provided, no certificate permissions are set.

---

##### `keyPermissions`<sup>Optional</sup> <a name="keyPermissions" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.keyPermissions"></a>

```typescript
public readonly keyPermissions: string[];
```

- *Type:* string[]

The permissions to keys stored in the Key Vault.

Possible values might include: 'get', 'list', 'create', 'sign', etc.
If not provided, no key permissions are set.

---

##### `secretPermissions`<sup>Optional</sup> <a name="secretPermissions" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.secretPermissions"></a>

```typescript
public readonly secretPermissions: string[];
```

- *Type:* string[]

The permissions to secrets stored in the Key Vault.

Possible values might include: 'get', 'list', 'set', 'delete', etc.
If not provided, no secret permissions are set.

---

##### `storagePermissions`<sup>Optional</sup> <a name="storagePermissions" id="@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicyProps.property.storagePermissions"></a>

```typescript
public readonly storagePermissions: string[];
```

- *Type:* string[]

The permissions to storage accounts linked to the Key Vault.

Possible values might include: 'get', 'list', 'delete', 'set', etc.
If not provided, no storage permissions are set.

---

### AccountProps <a name="AccountProps" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.Initializer"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

const accountProps: azure_storageaccount.AccountProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.location">location</a></code> | <code>string</code> | The Azure region in which to create the storage account. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.name">name</a></code> | <code>string</code> | The name of the storage account. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.accessTier">accessTier</a></code> | <code>string</code> | The data access tier of the storage account, which impacts storage costs and data retrieval speeds. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.accountKind">accountKind</a></code> | <code>string</code> | Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.92.0/docs/resources/storage_account#account_kind StorageAccount#account_kind}. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.accountReplicationType">accountReplicationType</a></code> | <code>string</code> | The type of replication to use for the storage account. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.accountTier">accountTier</a></code> | <code>string</code> | The performance tier of the storage account. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.enableHttpsTrafficOnly">enableHttpsTrafficOnly</a></code> | <code>boolean</code> | A boolean flag indicating whether to enforce HTTPS for data transfer to the storage account. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.identity">identity</a></code> | <code>any</code> | Managed Service Identity (MSI) details. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.isHnsEnabled">isHnsEnabled</a></code> | <code>boolean</code> | A flag indicating whether the Hierarchical Namespace (HNS) is enabled, which is required for Azure Data Lake Storage Gen2 features. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.minTlsVersion">minTlsVersion</a></code> | <code>string</code> | The minimum TLS version to be used for securing connections to the storage account. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.publicNetworkAccessEnabled">publicNetworkAccessEnabled</a></code> | <code>boolean</code> | A boolean flag indicating whether public network access to the storage account is allowed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the Azure resource group in which to create the storage account. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Tags to apply to the storage account, used for categorization and billing purposes. |

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The Azure region in which to create the storage account.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the storage account.

Must be unique across Azure.

---

##### `accessTier`<sup>Optional</sup> <a name="accessTier" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.accessTier"></a>

```typescript
public readonly accessTier: string;
```

- *Type:* string

The data access tier of the storage account, which impacts storage costs and data retrieval speeds.

Example values: Hot, Cool.

---

##### `accountKind`<sup>Optional</sup> <a name="accountKind" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.accountKind"></a>

```typescript
public readonly accountKind: string;
```

- *Type:* string

Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.92.0/docs/resources/storage_account#account_kind StorageAccount#account_kind}.

---

##### `accountReplicationType`<sup>Optional</sup> <a name="accountReplicationType" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.accountReplicationType"></a>

```typescript
public readonly accountReplicationType: string;
```

- *Type:* string

The type of replication to use for the storage account.

This determines how your data is replicated across Azure's infrastructure.
Example values: LRS (Locally Redundant Storage), GRS (Geo-Redundant Storage), RAGRS (Read Access Geo-Redundant Storage).

---

##### `accountTier`<sup>Optional</sup> <a name="accountTier" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.accountTier"></a>

```typescript
public readonly accountTier: string;
```

- *Type:* string

The performance tier of the storage account.

Determines the type of hardware and performance level.
Example values: Standard, Premium.

---

##### `enableHttpsTrafficOnly`<sup>Optional</sup> <a name="enableHttpsTrafficOnly" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.enableHttpsTrafficOnly"></a>

```typescript
public readonly enableHttpsTrafficOnly: boolean;
```

- *Type:* boolean

A boolean flag indicating whether to enforce HTTPS for data transfer to the storage account.

---

##### `identity`<sup>Optional</sup> <a name="identity" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.identity"></a>

```typescript
public readonly identity: any;
```

- *Type:* any

Managed Service Identity (MSI) details.

Used for enabling and managing Azure Active Directory (AAD) authentication.

---

##### `isHnsEnabled`<sup>Optional</sup> <a name="isHnsEnabled" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.isHnsEnabled"></a>

```typescript
public readonly isHnsEnabled: boolean;
```

- *Type:* boolean

A flag indicating whether the Hierarchical Namespace (HNS) is enabled, which is required for Azure Data Lake Storage Gen2 features.

---

##### `minTlsVersion`<sup>Optional</sup> <a name="minTlsVersion" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.minTlsVersion"></a>

```typescript
public readonly minTlsVersion: string;
```

- *Type:* string

The minimum TLS version to be used for securing connections to the storage account.

Example values: TLS1_0, TLS1_1, TLS1_2.

---

##### `publicNetworkAccessEnabled`<sup>Optional</sup> <a name="publicNetworkAccessEnabled" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.publicNetworkAccessEnabled"></a>

```typescript
public readonly publicNetworkAccessEnabled: boolean;
```

- *Type:* boolean

A boolean flag indicating whether public network access to the storage account is allowed.

---

##### `resourceGroup`<sup>Optional</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the Azure resource group in which to create the storage account.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.AccountProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Tags to apply to the storage account, used for categorization and billing purposes.

Format: { [key: string]: string }

---

### AppInsightsProps <a name="AppInsightsProps" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps"></a>

Properties for the resource group.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.Initializer"></a>

```typescript
import { azure_applicationinsights } from '@microsoft/terraform-cdk-constructs'

const appInsightsProps: azure_applicationinsights.AppInsightsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.applicationType">applicationType</a></code> | <code>string</code> | The Application type. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.location">location</a></code> | <code>string</code> | The Azure Region to deploy. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.name">name</a></code> | <code>string</code> | The name of the Application Insights resource. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the Azure Resource Group to deploy to. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.dailyDataCapInGb">dailyDataCapInGb</a></code> | <code>number</code> | The Application Insights daily data cap in GB. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.dailyDataCapNotificationDisabled">dailyDataCapNotificationDisabled</a></code> | <code>boolean</code> | The Application Insights daily data cap notifications disabled. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.retentionInDays">retentionInDays</a></code> | <code>number</code> | The number of days of retention. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | The tags to assign to the Application Insights resource. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.workspaceId">workspaceId</a></code> | <code>string</code> | The id of the Log Analytics Workspace. |

---

##### `applicationType`<sup>Required</sup> <a name="applicationType" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.applicationType"></a>

```typescript
public readonly applicationType: string;
```

- *Type:* string

The Application type.

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The Azure Region to deploy.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Application Insights resource.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the Azure Resource Group to deploy to.

---

##### `dailyDataCapInGb`<sup>Optional</sup> <a name="dailyDataCapInGb" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.dailyDataCapInGb"></a>

```typescript
public readonly dailyDataCapInGb: number;
```

- *Type:* number

The Application Insights daily data cap in GB.

---

##### `dailyDataCapNotificationDisabled`<sup>Optional</sup> <a name="dailyDataCapNotificationDisabled" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.dailyDataCapNotificationDisabled"></a>

```typescript
public readonly dailyDataCapNotificationDisabled: boolean;
```

- *Type:* boolean

The Application Insights daily data cap notifications disabled.

---

##### `retentionInDays`<sup>Optional</sup> <a name="retentionInDays" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.retentionInDays"></a>

```typescript
public readonly retentionInDays: number;
```

- *Type:* number
- *Default:* 90

The number of days of retention.

Possible values are 30, 60, 90, 120, 180, 270, 365, 550 or 730. Defaults to 90.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

The tags to assign to the Application Insights resource.

---

##### `workspaceId`<sup>Optional</sup> <a name="workspaceId" id="@microsoft/terraform-cdk-constructs.azure_applicationinsights.AppInsightsProps.property.workspaceId"></a>

```typescript
public readonly workspaceId: string;
```

- *Type:* string
- *Default:* If no workspace id is provided, a new one will be created automatically in the same resource group. The name will be the same as the Application Insights resource with a "-la" suffix.

The id of the Log Analytics Workspace.

---

### AuthorizationRuleProps <a name="AuthorizationRuleProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRuleProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRuleProps.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

const authorizationRuleProps: azure_eventhub.AuthorizationRuleProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRuleProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRuleProps.property.listen">listen</a></code> | <code>boolean</code> | The name of the resource group in which the EventHub's parent Namespace exists. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRuleProps.property.manage">manage</a></code> | <code>boolean</code> | Does this Authorization Rule have permissions to Manage to the Event Hub? |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRuleProps.property.send">send</a></code> | <code>boolean</code> | Does this Authorization Rule have permissions to Send to the Event Hub? |

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRuleProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `listen`<sup>Optional</sup> <a name="listen" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRuleProps.property.listen"></a>

```typescript
public readonly listen: boolean;
```

- *Type:* boolean

The name of the resource group in which the EventHub's parent Namespace exists.

---

##### `manage`<sup>Optional</sup> <a name="manage" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRuleProps.property.manage"></a>

```typescript
public readonly manage: boolean;
```

- *Type:* boolean
- *Default:* false

Does this Authorization Rule have permissions to Manage to the Event Hub?

When this property is true - both listen and send must be too.

---

##### `send`<sup>Optional</sup> <a name="send" id="@microsoft/terraform-cdk-constructs.azure_eventhub.AuthorizationRuleProps.property.send"></a>

```typescript
public readonly send: boolean;
```

- *Type:* boolean
- *Default:* false

Does this Authorization Rule have permissions to Send to the Event Hub?

---

### AzureQueryRuleAlertProps <a name="AzureQueryRuleAlertProps" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.Initializer"></a>

```typescript
import { azure_queryrulealert } from '@microsoft/terraform-cdk-constructs'

const azureQueryRuleAlertProps: azure_queryrulealert.AzureQueryRuleAlertProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaOperator">criteriaOperator</a></code> | <code>string</code> | Specifies the criteria operator. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaQuery">criteriaQuery</a></code> | <code>string</code> | The query to run on logs. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaThreshold">criteriaThreshold</a></code> | <code>number</code> | Specifies the criteria threshold value that activates the alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriatimeAggregationMethod">criteriatimeAggregationMethod</a></code> | <code>string</code> | The type of aggregation to apply to the data points in aggregation granularity. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.evaluationFrequency">evaluationFrequency</a></code> | <code>string</code> | How often the scheduled query rule is evaluated, represented in ISO 8601 duration format. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.location">location</a></code> | <code>string</code> | The location of the Monitor Scheduled Query Rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.name">name</a></code> | <code>string</code> | The name of the Monitor Scheduled Query Rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the resource group in which the Monitor Scheduled Query Rule is created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.severity">severity</a></code> | <code>number</code> | Severity of the alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.windowDuration">windowDuration</a></code> | <code>string</code> | Specifies the period of time in ISO 8601 duration format on which the Scheduled Query Rule will be executed (bin size). |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.actionActionGroupId">actionActionGroupId</a></code> | <code>string[]</code> | Specifies the action group IDs to trigger when the alert fires. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.autoMitigationEnabled">autoMitigationEnabled</a></code> | <code>boolean</code> | Specifies the flag that indicates whether the alert should be automatically resolved or not. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaDimensionName">criteriaDimensionName</a></code> | <code>string</code> | Name of the dimension for criteria. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaDimensionOperator">criteriaDimensionOperator</a></code> | <code>string</code> | Operator for dimension values. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaDimensionValues">criteriaDimensionValues</a></code> | <code>string[]</code> | List of dimension values. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaFailMinimumFailingPeriodsToTriggerAlert">criteriaFailMinimumFailingPeriodsToTriggerAlert</a></code> | <code>number</code> | Specifies the number of violations to trigger an alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaFailNumberOfEvaluationPeriods">criteriaFailNumberOfEvaluationPeriods</a></code> | <code>number</code> | Specifies the number of evaluation periods. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaMetricMeasureColumn">criteriaMetricMeasureColumn</a></code> | <code>string</code> | Specifies the column containing the metric measure number. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.description">description</a></code> | <code>string</code> | Specifies the description of the scheduled query rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.displayName">displayName</a></code> | <code>string</code> | Specifies the display name of the alert rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.enabled">enabled</a></code> | <code>boolean</code> | Specifies the flag which indicates whether this scheduled query rule is enabled. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.muteActionsAfterAlertDuration">muteActionsAfterAlertDuration</a></code> | <code>string</code> | Mute actions for the chosen period of time in ISO 8601 duration format after the alert is fired. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.queryTimeRangeOverride">queryTimeRangeOverride</a></code> | <code>string</code> | Set this if the alert evaluation period is different from the query time range. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.skipQueryValidation">skipQueryValidation</a></code> | <code>boolean</code> | Specifies the flag which indicates whether the provided query should be validated or not. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | A mapping of tags which should be assigned to the Monitor Scheduled Query Rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.workspaceAlertsStorageEnabled">workspaceAlertsStorageEnabled</a></code> | <code>boolean</code> | Specifies the flag which indicates whether this scheduled query rule check if storage is configured. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.scopes">scopes</a></code> | <code>string[]</code> | Specifies the list of resource IDs that this scheduled query rule is scoped to. |

---

##### `criteriaOperator`<sup>Required</sup> <a name="criteriaOperator" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaOperator"></a>

```typescript
public readonly criteriaOperator: string;
```

- *Type:* string

Specifies the criteria operator.

Possible values are Equal, GreaterThan, GreaterThanOrEqual, LessThan,and LessThanOrEqual.

---

##### `criteriaQuery`<sup>Required</sup> <a name="criteriaQuery" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaQuery"></a>

```typescript
public readonly criteriaQuery: string;
```

- *Type:* string

The query to run on logs.

The results returned by this query are used to populate the alert.

---

##### `criteriaThreshold`<sup>Required</sup> <a name="criteriaThreshold" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaThreshold"></a>

```typescript
public readonly criteriaThreshold: number;
```

- *Type:* number

Specifies the criteria threshold value that activates the alert.

---

##### `criteriatimeAggregationMethod`<sup>Required</sup> <a name="criteriatimeAggregationMethod" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriatimeAggregationMethod"></a>

```typescript
public readonly criteriatimeAggregationMethod: string;
```

- *Type:* string

The type of aggregation to apply to the data points in aggregation granularity.

Possible values are Average, Count, Maximum, Minimum,and Total.

---

##### `evaluationFrequency`<sup>Required</sup> <a name="evaluationFrequency" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.evaluationFrequency"></a>

```typescript
public readonly evaluationFrequency: string;
```

- *Type:* string

How often the scheduled query rule is evaluated, represented in ISO 8601 duration format.

Possible values are PT1M, PT5M, PT10M, PT15M, PT30M, PT45M, PT1H, PT2H, PT3H, PT4H, PT5H, PT6H, P1D.

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The location of the Monitor Scheduled Query Rule.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Monitor Scheduled Query Rule.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the resource group in which the Monitor Scheduled Query Rule is created.

---

##### `severity`<sup>Required</sup> <a name="severity" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.severity"></a>

```typescript
public readonly severity: number;
```

- *Type:* number

Severity of the alert.

Should be an integer between 0 and 4. Value of 0 is severest.

---

##### `windowDuration`<sup>Required</sup> <a name="windowDuration" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.windowDuration"></a>

```typescript
public readonly windowDuration: string;
```

- *Type:* string

Specifies the period of time in ISO 8601 duration format on which the Scheduled Query Rule will be executed (bin size).

---

##### `actionActionGroupId`<sup>Optional</sup> <a name="actionActionGroupId" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.actionActionGroupId"></a>

```typescript
public readonly actionActionGroupId: string[];
```

- *Type:* string[]

Specifies the action group IDs to trigger when the alert fires.

---

##### `autoMitigationEnabled`<sup>Optional</sup> <a name="autoMitigationEnabled" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.autoMitigationEnabled"></a>

```typescript
public readonly autoMitigationEnabled: boolean;
```

- *Type:* boolean
- *Default:* false

Specifies the flag that indicates whether the alert should be automatically resolved or not.

---

##### `criteriaDimensionName`<sup>Optional</sup> <a name="criteriaDimensionName" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaDimensionName"></a>

```typescript
public readonly criteriaDimensionName: string;
```

- *Type:* string

Name of the dimension for criteria.

---

##### `criteriaDimensionOperator`<sup>Optional</sup> <a name="criteriaDimensionOperator" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaDimensionOperator"></a>

```typescript
public readonly criteriaDimensionOperator: string;
```

- *Type:* string

Operator for dimension values.

Possible values are Exclude, and Include.

---

##### `criteriaDimensionValues`<sup>Optional</sup> <a name="criteriaDimensionValues" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaDimensionValues"></a>

```typescript
public readonly criteriaDimensionValues: string[];
```

- *Type:* string[]

List of dimension values.

Use a wildcard * to collect all.

---

##### `criteriaFailMinimumFailingPeriodsToTriggerAlert`<sup>Optional</sup> <a name="criteriaFailMinimumFailingPeriodsToTriggerAlert" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaFailMinimumFailingPeriodsToTriggerAlert"></a>

```typescript
public readonly criteriaFailMinimumFailingPeriodsToTriggerAlert: number;
```

- *Type:* number

Specifies the number of violations to trigger an alert.

Should be smaller or equal to number_of_evaluation_periods.
Possible value is integer between 1 and 6.

---

##### `criteriaFailNumberOfEvaluationPeriods`<sup>Optional</sup> <a name="criteriaFailNumberOfEvaluationPeriods" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaFailNumberOfEvaluationPeriods"></a>

```typescript
public readonly criteriaFailNumberOfEvaluationPeriods: number;
```

- *Type:* number

Specifies the number of evaluation periods.

Possible value is integer between 1 and 6.

---

##### `criteriaMetricMeasureColumn`<sup>Optional</sup> <a name="criteriaMetricMeasureColumn" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.criteriaMetricMeasureColumn"></a>

```typescript
public readonly criteriaMetricMeasureColumn: string;
```

- *Type:* string

Specifies the column containing the metric measure number.

criteriaMetricMeasureColumn is required if criteriatimeAggregationMethod is Average, Maximum, Minimum, or Total.
And criteriaMetricMeasureColumn cannot be specified if criteriatimeAggregationMethod is Count.

---

##### `description`<sup>Optional</sup> <a name="description" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

Specifies the description of the scheduled query rule.

---

##### `displayName`<sup>Optional</sup> <a name="displayName" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.displayName"></a>

```typescript
public readonly displayName: string;
```

- *Type:* string

Specifies the display name of the alert rule.

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean
- *Default:* true

Specifies the flag which indicates whether this scheduled query rule is enabled.

---

##### `muteActionsAfterAlertDuration`<sup>Optional</sup> <a name="muteActionsAfterAlertDuration" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.muteActionsAfterAlertDuration"></a>

```typescript
public readonly muteActionsAfterAlertDuration: string;
```

- *Type:* string

Mute actions for the chosen period of time in ISO 8601 duration format after the alert is fired.

Possible values are PT5M, PT10M, PT15M, PT30M, PT45M, PT1H, PT2H, PT3H, PT4H, PT5H, PT6H, P1D and P2D.

---

##### `queryTimeRangeOverride`<sup>Optional</sup> <a name="queryTimeRangeOverride" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.queryTimeRangeOverride"></a>

```typescript
public readonly queryTimeRangeOverride: string;
```

- *Type:* string

Set this if the alert evaluation period is different from the query time range.

If not specified, the value is window_duration*number_of_evaluation_periods.
Possible values are PT5M, PT10M, PT15M, PT20M, PT30M, PT45M, PT1H, PT2H, PT3H, PT4H, PT5H, PT6H, P1D and P2D.

---

##### `skipQueryValidation`<sup>Optional</sup> <a name="skipQueryValidation" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.skipQueryValidation"></a>

```typescript
public readonly skipQueryValidation: boolean;
```

- *Type:* boolean
- *Default:* true

Specifies the flag which indicates whether the provided query should be validated or not.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

A mapping of tags which should be assigned to the Monitor Scheduled Query Rule.

---

##### `workspaceAlertsStorageEnabled`<sup>Optional</sup> <a name="workspaceAlertsStorageEnabled" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.workspaceAlertsStorageEnabled"></a>

```typescript
public readonly workspaceAlertsStorageEnabled: boolean;
```

- *Type:* boolean
- *Default:* false

Specifies the flag which indicates whether this scheduled query rule check if storage is configured.

---

##### `scopes`<sup>Required</sup> <a name="scopes" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.AzureQueryRuleAlertProps.property.scopes"></a>

```typescript
public readonly scopes: string[];
```

- *Type:* string[]

Specifies the list of resource IDs that this scheduled query rule is scoped to.

---

### BaseAzureQueryRuleAlertProps <a name="BaseAzureQueryRuleAlertProps" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.Initializer"></a>

```typescript
import { azure_queryrulealert } from '@microsoft/terraform-cdk-constructs'

const baseAzureQueryRuleAlertProps: azure_queryrulealert.BaseAzureQueryRuleAlertProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaOperator">criteriaOperator</a></code> | <code>string</code> | Specifies the criteria operator. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaQuery">criteriaQuery</a></code> | <code>string</code> | The query to run on logs. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaThreshold">criteriaThreshold</a></code> | <code>number</code> | Specifies the criteria threshold value that activates the alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriatimeAggregationMethod">criteriatimeAggregationMethod</a></code> | <code>string</code> | The type of aggregation to apply to the data points in aggregation granularity. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.evaluationFrequency">evaluationFrequency</a></code> | <code>string</code> | How often the scheduled query rule is evaluated, represented in ISO 8601 duration format. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.location">location</a></code> | <code>string</code> | The location of the Monitor Scheduled Query Rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.name">name</a></code> | <code>string</code> | The name of the Monitor Scheduled Query Rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the resource group in which the Monitor Scheduled Query Rule is created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.severity">severity</a></code> | <code>number</code> | Severity of the alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.windowDuration">windowDuration</a></code> | <code>string</code> | Specifies the period of time in ISO 8601 duration format on which the Scheduled Query Rule will be executed (bin size). |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.actionActionGroupId">actionActionGroupId</a></code> | <code>string[]</code> | Specifies the action group IDs to trigger when the alert fires. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.autoMitigationEnabled">autoMitigationEnabled</a></code> | <code>boolean</code> | Specifies the flag that indicates whether the alert should be automatically resolved or not. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaDimensionName">criteriaDimensionName</a></code> | <code>string</code> | Name of the dimension for criteria. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaDimensionOperator">criteriaDimensionOperator</a></code> | <code>string</code> | Operator for dimension values. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaDimensionValues">criteriaDimensionValues</a></code> | <code>string[]</code> | List of dimension values. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaFailMinimumFailingPeriodsToTriggerAlert">criteriaFailMinimumFailingPeriodsToTriggerAlert</a></code> | <code>number</code> | Specifies the number of violations to trigger an alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaFailNumberOfEvaluationPeriods">criteriaFailNumberOfEvaluationPeriods</a></code> | <code>number</code> | Specifies the number of evaluation periods. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaMetricMeasureColumn">criteriaMetricMeasureColumn</a></code> | <code>string</code> | Specifies the column containing the metric measure number. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.description">description</a></code> | <code>string</code> | Specifies the description of the scheduled query rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.displayName">displayName</a></code> | <code>string</code> | Specifies the display name of the alert rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.enabled">enabled</a></code> | <code>boolean</code> | Specifies the flag which indicates whether this scheduled query rule is enabled. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.muteActionsAfterAlertDuration">muteActionsAfterAlertDuration</a></code> | <code>string</code> | Mute actions for the chosen period of time in ISO 8601 duration format after the alert is fired. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.queryTimeRangeOverride">queryTimeRangeOverride</a></code> | <code>string</code> | Set this if the alert evaluation period is different from the query time range. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.skipQueryValidation">skipQueryValidation</a></code> | <code>boolean</code> | Specifies the flag which indicates whether the provided query should be validated or not. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | A mapping of tags which should be assigned to the Monitor Scheduled Query Rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.workspaceAlertsStorageEnabled">workspaceAlertsStorageEnabled</a></code> | <code>boolean</code> | Specifies the flag which indicates whether this scheduled query rule check if storage is configured. |

---

##### `criteriaOperator`<sup>Required</sup> <a name="criteriaOperator" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaOperator"></a>

```typescript
public readonly criteriaOperator: string;
```

- *Type:* string

Specifies the criteria operator.

Possible values are Equal, GreaterThan, GreaterThanOrEqual, LessThan,and LessThanOrEqual.

---

##### `criteriaQuery`<sup>Required</sup> <a name="criteriaQuery" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaQuery"></a>

```typescript
public readonly criteriaQuery: string;
```

- *Type:* string

The query to run on logs.

The results returned by this query are used to populate the alert.

---

##### `criteriaThreshold`<sup>Required</sup> <a name="criteriaThreshold" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaThreshold"></a>

```typescript
public readonly criteriaThreshold: number;
```

- *Type:* number

Specifies the criteria threshold value that activates the alert.

---

##### `criteriatimeAggregationMethod`<sup>Required</sup> <a name="criteriatimeAggregationMethod" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriatimeAggregationMethod"></a>

```typescript
public readonly criteriatimeAggregationMethod: string;
```

- *Type:* string

The type of aggregation to apply to the data points in aggregation granularity.

Possible values are Average, Count, Maximum, Minimum,and Total.

---

##### `evaluationFrequency`<sup>Required</sup> <a name="evaluationFrequency" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.evaluationFrequency"></a>

```typescript
public readonly evaluationFrequency: string;
```

- *Type:* string

How often the scheduled query rule is evaluated, represented in ISO 8601 duration format.

Possible values are PT1M, PT5M, PT10M, PT15M, PT30M, PT45M, PT1H, PT2H, PT3H, PT4H, PT5H, PT6H, P1D.

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The location of the Monitor Scheduled Query Rule.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Monitor Scheduled Query Rule.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the resource group in which the Monitor Scheduled Query Rule is created.

---

##### `severity`<sup>Required</sup> <a name="severity" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.severity"></a>

```typescript
public readonly severity: number;
```

- *Type:* number

Severity of the alert.

Should be an integer between 0 and 4. Value of 0 is severest.

---

##### `windowDuration`<sup>Required</sup> <a name="windowDuration" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.windowDuration"></a>

```typescript
public readonly windowDuration: string;
```

- *Type:* string

Specifies the period of time in ISO 8601 duration format on which the Scheduled Query Rule will be executed (bin size).

---

##### `actionActionGroupId`<sup>Optional</sup> <a name="actionActionGroupId" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.actionActionGroupId"></a>

```typescript
public readonly actionActionGroupId: string[];
```

- *Type:* string[]

Specifies the action group IDs to trigger when the alert fires.

---

##### `autoMitigationEnabled`<sup>Optional</sup> <a name="autoMitigationEnabled" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.autoMitigationEnabled"></a>

```typescript
public readonly autoMitigationEnabled: boolean;
```

- *Type:* boolean
- *Default:* false

Specifies the flag that indicates whether the alert should be automatically resolved or not.

---

##### `criteriaDimensionName`<sup>Optional</sup> <a name="criteriaDimensionName" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaDimensionName"></a>

```typescript
public readonly criteriaDimensionName: string;
```

- *Type:* string

Name of the dimension for criteria.

---

##### `criteriaDimensionOperator`<sup>Optional</sup> <a name="criteriaDimensionOperator" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaDimensionOperator"></a>

```typescript
public readonly criteriaDimensionOperator: string;
```

- *Type:* string

Operator for dimension values.

Possible values are Exclude, and Include.

---

##### `criteriaDimensionValues`<sup>Optional</sup> <a name="criteriaDimensionValues" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaDimensionValues"></a>

```typescript
public readonly criteriaDimensionValues: string[];
```

- *Type:* string[]

List of dimension values.

Use a wildcard * to collect all.

---

##### `criteriaFailMinimumFailingPeriodsToTriggerAlert`<sup>Optional</sup> <a name="criteriaFailMinimumFailingPeriodsToTriggerAlert" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaFailMinimumFailingPeriodsToTriggerAlert"></a>

```typescript
public readonly criteriaFailMinimumFailingPeriodsToTriggerAlert: number;
```

- *Type:* number

Specifies the number of violations to trigger an alert.

Should be smaller or equal to number_of_evaluation_periods.
Possible value is integer between 1 and 6.

---

##### `criteriaFailNumberOfEvaluationPeriods`<sup>Optional</sup> <a name="criteriaFailNumberOfEvaluationPeriods" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaFailNumberOfEvaluationPeriods"></a>

```typescript
public readonly criteriaFailNumberOfEvaluationPeriods: number;
```

- *Type:* number

Specifies the number of evaluation periods.

Possible value is integer between 1 and 6.

---

##### `criteriaMetricMeasureColumn`<sup>Optional</sup> <a name="criteriaMetricMeasureColumn" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.criteriaMetricMeasureColumn"></a>

```typescript
public readonly criteriaMetricMeasureColumn: string;
```

- *Type:* string

Specifies the column containing the metric measure number.

criteriaMetricMeasureColumn is required if criteriatimeAggregationMethod is Average, Maximum, Minimum, or Total.
And criteriaMetricMeasureColumn cannot be specified if criteriatimeAggregationMethod is Count.

---

##### `description`<sup>Optional</sup> <a name="description" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

Specifies the description of the scheduled query rule.

---

##### `displayName`<sup>Optional</sup> <a name="displayName" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.displayName"></a>

```typescript
public readonly displayName: string;
```

- *Type:* string

Specifies the display name of the alert rule.

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean
- *Default:* true

Specifies the flag which indicates whether this scheduled query rule is enabled.

---

##### `muteActionsAfterAlertDuration`<sup>Optional</sup> <a name="muteActionsAfterAlertDuration" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.muteActionsAfterAlertDuration"></a>

```typescript
public readonly muteActionsAfterAlertDuration: string;
```

- *Type:* string

Mute actions for the chosen period of time in ISO 8601 duration format after the alert is fired.

Possible values are PT5M, PT10M, PT15M, PT30M, PT45M, PT1H, PT2H, PT3H, PT4H, PT5H, PT6H, P1D and P2D.

---

##### `queryTimeRangeOverride`<sup>Optional</sup> <a name="queryTimeRangeOverride" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.queryTimeRangeOverride"></a>

```typescript
public readonly queryTimeRangeOverride: string;
```

- *Type:* string

Set this if the alert evaluation period is different from the query time range.

If not specified, the value is window_duration*number_of_evaluation_periods.
Possible values are PT5M, PT10M, PT15M, PT20M, PT30M, PT45M, PT1H, PT2H, PT3H, PT4H, PT5H, PT6H, P1D and P2D.

---

##### `skipQueryValidation`<sup>Optional</sup> <a name="skipQueryValidation" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.skipQueryValidation"></a>

```typescript
public readonly skipQueryValidation: boolean;
```

- *Type:* boolean
- *Default:* true

Specifies the flag which indicates whether the provided query should be validated or not.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

A mapping of tags which should be assigned to the Monitor Scheduled Query Rule.

---

##### `workspaceAlertsStorageEnabled`<sup>Optional</sup> <a name="workspaceAlertsStorageEnabled" id="@microsoft/terraform-cdk-constructs.azure_queryrulealert.BaseAzureQueryRuleAlertProps.property.workspaceAlertsStorageEnabled"></a>

```typescript
public readonly workspaceAlertsStorageEnabled: boolean;
```

- *Type:* boolean
- *Default:* false

Specifies the flag which indicates whether this scheduled query rule check if storage is configured.

---

### BaseDiagnosticSettingsProps <a name="BaseDiagnosticSettingsProps" id="@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.Initializer"></a>

```typescript
import { core_azure } from '@microsoft/terraform-cdk-constructs'

const baseDiagnosticSettingsProps: core_azure.BaseDiagnosticSettingsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.eventhubAuthorizationRuleId">eventhubAuthorizationRuleId</a></code> | <code>string</code> | Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#eventhub_authorization_rule_id MonitorDiagnosticSetting#eventhub_authorization_rule_id}. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.eventhubName">eventhubName</a></code> | <code>string</code> | Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#eventhub_name MonitorDiagnosticSetting#eventhub_name}. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.logAnalyticsDestinationType">logAnalyticsDestinationType</a></code> | <code>string</code> | When set to 'Dedicated' logs sent to a Log Analytics workspace will go into resource specific tables, instead of the legacy AzureDiagnostics table. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.logAnalyticsWorkspaceId">logAnalyticsWorkspaceId</a></code> | <code>string</code> | Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#log_analytics_workspace_id MonitorDiagnosticSetting#log_analytics_workspace_id}. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.logCategories">logCategories</a></code> | <code>string[]</code> | Log Diagnostic categories. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.metricCategories">metricCategories</a></code> | <code>string[]</code> | Diagnostic Metrics. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.name">name</a></code> | <code>string</code> | Name of the diagnostic settings resource. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.partnerSolutionId">partnerSolutionId</a></code> | <code>string</code> | Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#partner_solution_id MonitorDiagnosticSetting#partner_solution_id}. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.storageAccountId">storageAccountId</a></code> | <code>string</code> | Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#storage_account_id MonitorDiagnosticSetting#storage_account_id}. |

---

##### `eventhubAuthorizationRuleId`<sup>Optional</sup> <a name="eventhubAuthorizationRuleId" id="@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.eventhubAuthorizationRuleId"></a>

```typescript
public readonly eventhubAuthorizationRuleId: string;
```

- *Type:* string

Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#eventhub_authorization_rule_id MonitorDiagnosticSetting#eventhub_authorization_rule_id}.

---

##### `eventhubName`<sup>Optional</sup> <a name="eventhubName" id="@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.eventhubName"></a>

```typescript
public readonly eventhubName: string;
```

- *Type:* string

Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#eventhub_name MonitorDiagnosticSetting#eventhub_name}.

---

##### `logAnalyticsDestinationType`<sup>Optional</sup> <a name="logAnalyticsDestinationType" id="@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.logAnalyticsDestinationType"></a>

```typescript
public readonly logAnalyticsDestinationType: string;
```

- *Type:* string

When set to 'Dedicated' logs sent to a Log Analytics workspace will go into resource specific tables, instead of the legacy AzureDiagnostics table.

---

##### `logAnalyticsWorkspaceId`<sup>Optional</sup> <a name="logAnalyticsWorkspaceId" id="@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.logAnalyticsWorkspaceId"></a>

```typescript
public readonly logAnalyticsWorkspaceId: string;
```

- *Type:* string

Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#log_analytics_workspace_id MonitorDiagnosticSetting#log_analytics_workspace_id}.

---

##### `logCategories`<sup>Optional</sup> <a name="logCategories" id="@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.logCategories"></a>

```typescript
public readonly logCategories: string[];
```

- *Type:* string[]
- *Default:* null

Log Diagnostic categories.

---

##### `metricCategories`<sup>Optional</sup> <a name="metricCategories" id="@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.metricCategories"></a>

```typescript
public readonly metricCategories: string[];
```

- *Type:* string[]
- *Default:* null

Diagnostic Metrics.

---

##### `name`<sup>Optional</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Name of the diagnostic settings resource.

---

##### `partnerSolutionId`<sup>Optional</sup> <a name="partnerSolutionId" id="@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.partnerSolutionId"></a>

```typescript
public readonly partnerSolutionId: string;
```

- *Type:* string

Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#partner_solution_id MonitorDiagnosticSetting#partner_solution_id}.

---

##### `storageAccountId`<sup>Optional</sup> <a name="storageAccountId" id="@microsoft/terraform-cdk-constructs.core_azure.BaseDiagnosticSettingsProps.property.storageAccountId"></a>

```typescript
public readonly storageAccountId: string;
```

- *Type:* string

Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#storage_account_id MonitorDiagnosticSetting#storage_account_id}.

---

### BaseInstanceProps <a name="BaseInstanceProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseInstanceProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseInstanceProps.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

const baseInstanceProps: azure_eventhub.BaseInstanceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseInstanceProps.property.name">name</a></code> | <code>string</code> | Specifies the name of the EventHub resource. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseInstanceProps.property.messageRetention">messageRetention</a></code> | <code>number</code> | Specifies the number of days to retain the events for this Event Hub. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseInstanceProps.property.partitionCount">partitionCount</a></code> | <code>number</code> | Specifies the current number of shards on the Event Hub. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseInstanceProps.property.status">status</a></code> | <code>string</code> | Specifies the status of the Event Hub resource. |

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseInstanceProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Specifies the name of the EventHub resource.

---

##### `messageRetention`<sup>Optional</sup> <a name="messageRetention" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseInstanceProps.property.messageRetention"></a>

```typescript
public readonly messageRetention: number;
```

- *Type:* number
- *Default:* 1

Specifies the number of days to retain the events for this Event Hub.

---

##### `partitionCount`<sup>Optional</sup> <a name="partitionCount" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseInstanceProps.property.partitionCount"></a>

```typescript
public readonly partitionCount: number;
```

- *Type:* number
- *Default:* 2

Specifies the current number of shards on the Event Hub.

When using a shared parent EventHub Namespace, maximum value is 32.

---

##### `status`<sup>Optional</sup> <a name="status" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseInstanceProps.property.status"></a>

```typescript
public readonly status: string;
```

- *Type:* string
- *Default:* "Active"

Specifies the status of the Event Hub resource.

Possible values are Active, Disabled and SendDisabled.

---

### BaseKustoDataConnectionProps <a name="BaseKustoDataConnectionProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

const baseKustoDataConnectionProps: azure_eventhub.BaseKustoDataConnectionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.kustoClusterName">kustoClusterName</a></code> | <code>string</code> | Specifies the name of the Kusto Cluster this data connection will be added to. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.kustoDatabaseName">kustoDatabaseName</a></code> | <code>string</code> | Specifies the name of the Kusto Database this data connection will be added to. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.kustoResourceGroup">kustoResourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | Specifies the Resource Group where the Kusto Database should exist. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.location">location</a></code> | <code>string</code> | The location where the Kusto EventHub Data Connection should be created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.name">name</a></code> | <code>string</code> | The name of the Kusto EventHub Data Connection to create. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.compression">compression</a></code> | <code>string</code> | Specifies compression type for the connection. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.consumerGroup">consumerGroup</a></code> | <code>string</code> | Specifies the EventHub consumer group this data connection will use for ingestion. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.databaseRoutingType">databaseRoutingType</a></code> | <code>string</code> | Indication for database routing information from the data connection, by default only database routing information is allowed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.dataFormat">dataFormat</a></code> | <code>string</code> | Specifies the data format of the EventHub messages. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.identityId">identityId</a></code> | <code>string</code> | The resource ID of a managed identity (system or user assigned) to be used to authenticate with event hub. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.mappingRuleName">mappingRuleName</a></code> | <code>string</code> | Specifies the mapping rule used for the message ingestion. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.tableName">tableName</a></code> | <code>string</code> | Specifies the target table name used for the message ingestion. |

---

##### `kustoClusterName`<sup>Required</sup> <a name="kustoClusterName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.kustoClusterName"></a>

```typescript
public readonly kustoClusterName: string;
```

- *Type:* string

Specifies the name of the Kusto Cluster this data connection will be added to.

---

##### `kustoDatabaseName`<sup>Required</sup> <a name="kustoDatabaseName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.kustoDatabaseName"></a>

```typescript
public readonly kustoDatabaseName: string;
```

- *Type:* string

Specifies the name of the Kusto Database this data connection will be added to.

---

##### `kustoResourceGroup`<sup>Required</sup> <a name="kustoResourceGroup" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.kustoResourceGroup"></a>

```typescript
public readonly kustoResourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

Specifies the Resource Group where the Kusto Database should exist.

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The location where the Kusto EventHub Data Connection should be created.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Kusto EventHub Data Connection to create.

---

##### `compression`<sup>Optional</sup> <a name="compression" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.compression"></a>

```typescript
public readonly compression: string;
```

- *Type:* string
- *Default:* "None"

Specifies compression type for the connection.

Allowed values: GZip and None.

---

##### `consumerGroup`<sup>Optional</sup> <a name="consumerGroup" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.consumerGroup"></a>

```typescript
public readonly consumerGroup: string;
```

- *Type:* string
- *Default:* "$Default"

Specifies the EventHub consumer group this data connection will use for ingestion.

---

##### `databaseRoutingType`<sup>Optional</sup> <a name="databaseRoutingType" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.databaseRoutingType"></a>

```typescript
public readonly databaseRoutingType: string;
```

- *Type:* string
- *Default:* "Single"

Indication for database routing information from the data connection, by default only database routing information is allowed.

Allowed values: Single, Multi.

---

##### `dataFormat`<sup>Optional</sup> <a name="dataFormat" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.dataFormat"></a>

```typescript
public readonly dataFormat: string;
```

- *Type:* string
- *Default:* "JSON"

Specifies the data format of the EventHub messages.

Allowed values: APACHEAVRO, AVRO, CSV, JSON, MULTIJSON, ORC, PARQUET, PSV, RAW, SCSV, SINGLEJSON, SOHSV, TSVE, TSV, TXT, and W3CLOGFILE.

---

##### `identityId`<sup>Optional</sup> <a name="identityId" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.identityId"></a>

```typescript
public readonly identityId: string;
```

- *Type:* string

The resource ID of a managed identity (system or user assigned) to be used to authenticate with event hub.

---

##### `mappingRuleName`<sup>Optional</sup> <a name="mappingRuleName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.mappingRuleName"></a>

```typescript
public readonly mappingRuleName: string;
```

- *Type:* string

Specifies the mapping rule used for the message ingestion.

Mapping rule must exist before resource is created.

---

##### `tableName`<sup>Optional</sup> <a name="tableName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.BaseKustoDataConnectionProps.property.tableName"></a>

```typescript
public readonly tableName: string;
```

- *Type:* string

Specifies the target table name used for the message ingestion.

Table must exist before resource is created.

---

### CertificateIssuerProps <a name="CertificateIssuerProps" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps.Initializer"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

const certificateIssuerProps: azure_keyvault.CertificateIssuerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps.property.accessPolicies">accessPolicies</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy[]</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps.property.keyVaultId">keyVaultId</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.Vault</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps.property.name">name</a></code> | <code>string</code> | The name of the certificate issuer in the Azure Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps.property.providerName">providerName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps.property.password">password</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps.property.username">username</a></code> | <code>string</code> | *No description.* |

---

##### `accessPolicies`<sup>Required</sup> <a name="accessPolicies" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps.property.accessPolicies"></a>

```typescript
public readonly accessPolicies: AccessPolicy[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy[]

---

##### `keyVaultId`<sup>Required</sup> <a name="keyVaultId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps.property.keyVaultId"></a>

```typescript
public readonly keyVaultId: Vault;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.Vault

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the certificate issuer in the Azure Key Vault.

---

##### `providerName`<sup>Required</sup> <a name="providerName" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps.property.providerName"></a>

```typescript
public readonly providerName: string;
```

- *Type:* string

---

##### `password`<sup>Optional</sup> <a name="password" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps.property.password"></a>

```typescript
public readonly password: string;
```

- *Type:* string

---

##### `username`<sup>Optional</sup> <a name="username" id="@microsoft/terraform-cdk-constructs.azure_keyvault.CertificateIssuerProps.property.username"></a>

```typescript
public readonly username: string;
```

- *Type:* string

---

### ClusterProps <a name="ClusterProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

const clusterProps: azure_eventhub.ClusterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the Resource Group in which to create the EventHub Cluster. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps.property.skuName">skuName</a></code> | <code>string</code> | The SKU name of the EventHub Cluster. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | The tags to assign to the Application Insights resource. |

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the Resource Group in which to create the EventHub Cluster.

---

##### `skuName`<sup>Optional</sup> <a name="skuName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps.property.skuName"></a>

```typescript
public readonly skuName: string;
```

- *Type:* string
- *Default:* "Dedicated_1"

The SKU name of the EventHub Cluster.

The only supported value at this time is Dedicated_1.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ClusterProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

The tags to assign to the Application Insights resource.

---

### ClusterProps <a name="ClusterProps" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps"></a>

Interface defining the properties required to create an AKS cluster.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.Initializer"></a>

```typescript
import { azure_kubernetes } from '@microsoft/terraform-cdk-constructs'

const clusterProps: azure_kubernetes.ClusterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.defaultNodePool">defaultNodePool</a></code> | <code>@cdktf/provider-azurerm.kubernetesCluster.KubernetesClusterDefaultNodePool</code> | Configuration for the default node pool of the AKS cluster. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.location">location</a></code> | <code>string</code> | The Azure region where the AKS cluster will be deployed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.name">name</a></code> | <code>string</code> | The name of the AKS cluster. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.apiServerAuthorizedIpRanges">apiServerAuthorizedIpRanges</a></code> | <code>string[]</code> | A list of IP address ranges that are authorized to access the AKS API server. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.azureActiveDirectoryRoleBasedAccessControl">azureActiveDirectoryRoleBasedAccessControl</a></code> | <code>@cdktf/provider-azurerm.kubernetesCluster.KubernetesClusterAzureActiveDirectoryRoleBasedAccessControl</code> | Configures integration of Azure Active Directory (AAD) with Kubernetes Role-Based Access Control (RBAC) for the AKS cluster. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.identity">identity</a></code> | <code>@cdktf/provider-azurerm.kubernetesCluster.KubernetesClusterIdentity</code> | The identity used for the AKS cluster. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The Azure Resource Group where the AKS cluster will be deployed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Tags to be applied to the AKS cluster resources for organizational purposes. |

---

##### `defaultNodePool`<sup>Required</sup> <a name="defaultNodePool" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.defaultNodePool"></a>

```typescript
public readonly defaultNodePool: KubernetesClusterDefaultNodePool;
```

- *Type:* @cdktf/provider-azurerm.kubernetesCluster.KubernetesClusterDefaultNodePool

Configuration for the default node pool of the AKS cluster.

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The Azure region where the AKS cluster will be deployed.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the AKS cluster.

Must be unique within the Azure region.

---

##### `apiServerAuthorizedIpRanges`<sup>Optional</sup> <a name="apiServerAuthorizedIpRanges" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.apiServerAuthorizedIpRanges"></a>

```typescript
public readonly apiServerAuthorizedIpRanges: string[];
```

- *Type:* string[]

A list of IP address ranges that are authorized to access the AKS API server.

This enhances the security of your cluster by ensuring that only traffic from these IP ranges can communicate with the Kubernetes API server.

Specifying this list helps to protect your cluster from unauthorized access attempts. It's a critical security measure for clusters that are exposed to the internet. If you specify an empty array, no IP addresses will be allowed to access the API server, effectively blocking all access. If this property is not defined, all IP addresses are allowed by default, which is not recommended for production environments.

Example:
apiServerAuthorizedIpRanges: ['203.0.113.0/24', '198.51.100.0/24']

It's important to configure this property carefully, based on your organization's network policies and access requirements.

---

##### `azureActiveDirectoryRoleBasedAccessControl`<sup>Optional</sup> <a name="azureActiveDirectoryRoleBasedAccessControl" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.azureActiveDirectoryRoleBasedAccessControl"></a>

```typescript
public readonly azureActiveDirectoryRoleBasedAccessControl: KubernetesClusterAzureActiveDirectoryRoleBasedAccessControl;
```

- *Type:* @cdktf/provider-azurerm.kubernetesCluster.KubernetesClusterAzureActiveDirectoryRoleBasedAccessControl

Configures integration of Azure Active Directory (AAD) with Kubernetes Role-Based Access Control (RBAC) for the AKS cluster.

This feature enables the use of AAD to manage user and group access permissions to the Kubernetes cluster resources, leveraging AAD's robust identity and access management capabilities.

Utilizing AAD with Kubernetes RBAC provides:
- Enhanced security through AAD's identity protection features.
- Simplified user and group management by leveraging existing AAD definitions.
- Streamlined access control for Kubernetes resources, allowing for the definition of roles and role bindings based on AAD identities.

This property is optional but highly recommended for clusters where security and access governance are a priority. It allows for finer-grained access control and integrates the cluster's authentication and authorization processes with corporate identity management systems.

Example configuration might include specifying the AAD tenant details, enabling Azure RBAC for Kubernetes authorization, and optionally defining specific AAD groups for cluster admin roles.

---

##### `identity`<sup>Optional</sup> <a name="identity" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.identity"></a>

```typescript
public readonly identity: KubernetesClusterIdentity;
```

- *Type:* @cdktf/provider-azurerm.kubernetesCluster.KubernetesClusterIdentity

The identity used for the AKS cluster.

Can be either SystemAssigned or UserAssigned.
Optional.

---

##### `resourceGroup`<sup>Optional</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The Azure Resource Group where the AKS cluster will be deployed.

Optional. If not provided, a new resource group will be created.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_kubernetes.ClusterProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Tags to be applied to the AKS cluster resources for organizational purposes.

Key-value pairs. Optional.

---

### ClusterProps <a name="ClusterProps" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.Initializer"></a>

```typescript
import { azure_kusto } from '@microsoft/terraform-cdk-constructs'

const clusterProps: azure_kusto.ClusterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.name">name</a></code> | <code>string</code> | The name of the Kusto Cluster to create. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The Azure Resource Group in which to create the Kusto Cluster. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.autoStopEnabled">autoStopEnabled</a></code> | <code>boolean</code> | Specifies if the cluster could be automatically stopped. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.capacity">capacity</a></code> | <code>number</code> | The node count for the cluster. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.enableZones">enableZones</a></code> | <code>boolean</code> | Specifies if the purge operations are enabled. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.identityIds">identityIds</a></code> | <code>string[]</code> | A list of User Assigned Managed Identity IDs to be assigned to this Kusto Cluster. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.identityType">identityType</a></code> | <code>string</code> | The type of Managed Service Identity. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.maximumInstances">maximumInstances</a></code> | <code>number</code> | The maximum number of allowed instances. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.minimumInstances">minimumInstances</a></code> | <code>number</code> | The minimum number of allowed instances. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.publicNetworkAccessEnabled">publicNetworkAccessEnabled</a></code> | <code>boolean</code> | Is the public network access enabled? |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.purgeEnabled">purgeEnabled</a></code> | <code>boolean</code> | Specifies if the purge operations are enabled. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.sku">sku</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | The SKU of the Kusto Cluster. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.streamingIngestionEnabled">streamingIngestionEnabled</a></code> | <code>boolean</code> | Specifies if the streaming ingest is enabled. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | A mapping of tags to assign to the Kusto. |

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Kusto Cluster to create.

Only 4-22 lowercase alphanumeric characters allowed, starting with a letter.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The Azure Resource Group in which to create the Kusto Cluster.

---

##### `autoStopEnabled`<sup>Optional</sup> <a name="autoStopEnabled" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.autoStopEnabled"></a>

```typescript
public readonly autoStopEnabled: boolean;
```

- *Type:* boolean
- *Default:* true

Specifies if the cluster could be automatically stopped.

(due to lack of data or no activity for many days).

---

##### `capacity`<sup>Optional</sup> <a name="capacity" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.capacity"></a>

```typescript
public readonly capacity: number;
```

- *Type:* number
- *Default:* 2

The node count for the cluster.

---

##### `enableZones`<sup>Optional</sup> <a name="enableZones" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.enableZones"></a>

```typescript
public readonly enableZones: boolean;
```

- *Type:* boolean
- *Default:* true

Specifies if the purge operations are enabled.

Based on the SKU, the number of zones allowed are different.

---

##### `identityIds`<sup>Optional</sup> <a name="identityIds" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.identityIds"></a>

```typescript
public readonly identityIds: string[];
```

- *Type:* string[]

A list of User Assigned Managed Identity IDs to be assigned to this Kusto Cluster.

---

##### `identityType`<sup>Optional</sup> <a name="identityType" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.identityType"></a>

```typescript
public readonly identityType: string;
```

- *Type:* string
- *Default:* "SystemAssigned"

The type of Managed Service Identity.

---

##### `maximumInstances`<sup>Optional</sup> <a name="maximumInstances" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.maximumInstances"></a>

```typescript
public readonly maximumInstances: number;
```

- *Type:* number

The maximum number of allowed instances.

Must between 0 and 1000.

---

##### `minimumInstances`<sup>Optional</sup> <a name="minimumInstances" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.minimumInstances"></a>

```typescript
public readonly minimumInstances: number;
```

- *Type:* number

The minimum number of allowed instances.

Must between 0 and 1000.

---

##### `publicNetworkAccessEnabled`<sup>Optional</sup> <a name="publicNetworkAccessEnabled" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.publicNetworkAccessEnabled"></a>

```typescript
public readonly publicNetworkAccessEnabled: boolean;
```

- *Type:* boolean
- *Default:* true

Is the public network access enabled?

---

##### `purgeEnabled`<sup>Optional</sup> <a name="purgeEnabled" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.purgeEnabled"></a>

```typescript
public readonly purgeEnabled: boolean;
```

- *Type:* boolean
- *Default:* false

Specifies if the purge operations are enabled.

---

##### `sku`<sup>Optional</sup> <a name="sku" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.sku"></a>

```typescript
public readonly sku: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification
- *Default:* devtestExtraSmallDv2

The SKU of the Kusto Cluster.

All the allowed values are defined in the ComputeSpecification class.

---

##### `streamingIngestionEnabled`<sup>Optional</sup> <a name="streamingIngestionEnabled" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.streamingIngestionEnabled"></a>

```typescript
public readonly streamingIngestionEnabled: boolean;
```

- *Type:* boolean
- *Default:* true

Specifies if the streaming ingest is enabled.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_kusto.ClusterProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

A mapping of tags to assign to the Kusto.

---

### ConsumerGroupProps <a name="ConsumerGroupProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

const consumerGroupProps: azure_eventhub.ConsumerGroupProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps.property.eventhubName">eventhubName</a></code> | <code>string</code> | Specifies the name of the EventHub. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps.property.namespaceName">namespaceName</a></code> | <code>string</code> | Specifies the name of the grandparent EventHub Namespace. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the resource group in which the EventHub Consumer Group's grandparent Namespace exists. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps.property.userMetadata">userMetadata</a></code> | <code>string</code> | Specifies the user metadata. |

---

##### `eventhubName`<sup>Required</sup> <a name="eventhubName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps.property.eventhubName"></a>

```typescript
public readonly eventhubName: string;
```

- *Type:* string

Specifies the name of the EventHub.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `namespaceName`<sup>Required</sup> <a name="namespaceName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps.property.namespaceName"></a>

```typescript
public readonly namespaceName: string;
```

- *Type:* string

Specifies the name of the grandparent EventHub Namespace.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the resource group in which the EventHub Consumer Group's grandparent Namespace exists.

---

##### `userMetadata`<sup>Optional</sup> <a name="userMetadata" id="@microsoft/terraform-cdk-constructs.azure_eventhub.ConsumerGroupProps.property.userMetadata"></a>

```typescript
public readonly userMetadata: string;
```

- *Type:* string

Specifies the user metadata.

---

### DatabaseAccessProps <a name="DatabaseAccessProps" id="@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseAccessProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseAccessProps.Initializer"></a>

```typescript
import { azure_kusto } from '@microsoft/terraform-cdk-constructs'

const databaseAccessProps: azure_kusto.DatabaseAccessProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseAccessProps.property.name">name</a></code> | <code>string</code> | The name of the kusto principal assignment. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseAccessProps.property.principalId">principalId</a></code> | <code>string</code> | The object id of the principal to assign to Kusto Database. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseAccessProps.property.principalType">principalType</a></code> | <code>string</code> | The type of the principal. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseAccessProps.property.role">role</a></code> | <code>string</code> | The database role assigned to the principal. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseAccessProps.property.tenantId">tenantId</a></code> | <code>string</code> | The tenant id in which the principal resides. |

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseAccessProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the kusto principal assignment.

---

##### `principalId`<sup>Required</sup> <a name="principalId" id="@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseAccessProps.property.principalId"></a>

```typescript
public readonly principalId: string;
```

- *Type:* string

The object id of the principal to assign to Kusto Database.

---

##### `principalType`<sup>Required</sup> <a name="principalType" id="@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseAccessProps.property.principalType"></a>

```typescript
public readonly principalType: string;
```

- *Type:* string

The type of the principal.

Valid values include App, Group, User.

---

##### `role`<sup>Required</sup> <a name="role" id="@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseAccessProps.property.role"></a>

```typescript
public readonly role: string;
```

- *Type:* string

The database role assigned to the principal.

Valid values include Admin, Ingestor, Monitor, UnrestrictedViewer, User and Viewer.

---

##### `tenantId`<sup>Required</sup> <a name="tenantId" id="@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseAccessProps.property.tenantId"></a>

```typescript
public readonly tenantId: string;
```

- *Type:* string

The tenant id in which the principal resides.

---

### DatabaseProps <a name="DatabaseProps" id="@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps.Initializer"></a>

```typescript
import { azure_kusto } from '@microsoft/terraform-cdk-constructs'

const databaseProps: azure_kusto.DatabaseProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps.property.kusto">kusto</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.Cluster</code> | The Azure Kusto cluster to which this database belongs. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps.property.name">name</a></code> | <code>string</code> | The name of the Kusto Database to create. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps.property.hotCachePeriod">hotCachePeriod</a></code> | <code>string</code> | The time the data that should be kept in cache for fast queries as ISO 8601 timespan. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps.property.softDeletePeriod">softDeletePeriod</a></code> | <code>string</code> | The time the data should be kept before it stops being accessible to queries as ISO 8601 timespan. |

---

##### `kusto`<sup>Required</sup> <a name="kusto" id="@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps.property.kusto"></a>

```typescript
public readonly kusto: Cluster;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.Cluster

The Azure Kusto cluster to which this database belongs.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Kusto Database to create.

---

##### `hotCachePeriod`<sup>Optional</sup> <a name="hotCachePeriod" id="@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps.property.hotCachePeriod"></a>

```typescript
public readonly hotCachePeriod: string;
```

- *Type:* string

The time the data that should be kept in cache for fast queries as ISO 8601 timespan.

Default is unlimited.

---

##### `softDeletePeriod`<sup>Optional</sup> <a name="softDeletePeriod" id="@microsoft/terraform-cdk-constructs.azure_kusto.DatabaseProps.property.softDeletePeriod"></a>

```typescript
public readonly softDeletePeriod: string;
```

- *Type:* string

The time the data should be kept before it stops being accessible to queries as ISO 8601 timespan.

Default is unlimited.

---

### DataExport <a name="DataExport" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.DataExport"></a>

Properties for defining a data export in a Log Analytics Workspace.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.DataExport.Initializer"></a>

```typescript
import { azure_loganalytics } from '@microsoft/terraform-cdk-constructs'

const dataExport: azure_loganalytics.DataExport = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.DataExport.property.enabled">enabled</a></code> | <code>boolean</code> | Indicates whether the data export is enabled. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.DataExport.property.exportDestinationId">exportDestinationId</a></code> | <code>string</code> | The ID of the destination resource for the export. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.DataExport.property.name">name</a></code> | <code>string</code> | The name of the data export. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.DataExport.property.tableNames">tableNames</a></code> | <code>string[]</code> | An array of table names to be included in the data export. |

---

##### `enabled`<sup>Required</sup> <a name="enabled" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.DataExport.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

Indicates whether the data export is enabled.

---

##### `exportDestinationId`<sup>Required</sup> <a name="exportDestinationId" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.DataExport.property.exportDestinationId"></a>

```typescript
public readonly exportDestinationId: string;
```

- *Type:* string

The ID of the destination resource for the export.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.DataExport.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the data export.

---

##### `tableNames`<sup>Required</sup> <a name="tableNames" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.DataExport.property.tableNames"></a>

```typescript
public readonly tableNames: string[];
```

- *Type:* string[]

An array of table names to be included in the data export.

---

### DiagnosticSettingsProps <a name="DiagnosticSettingsProps" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.Initializer"></a>

```typescript
import { core_azure } from '@microsoft/terraform-cdk-constructs'

const diagnosticSettingsProps: core_azure.DiagnosticSettingsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.eventhubAuthorizationRuleId">eventhubAuthorizationRuleId</a></code> | <code>string</code> | Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#eventhub_authorization_rule_id MonitorDiagnosticSetting#eventhub_authorization_rule_id}. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.eventhubName">eventhubName</a></code> | <code>string</code> | Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#eventhub_name MonitorDiagnosticSetting#eventhub_name}. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.logAnalyticsDestinationType">logAnalyticsDestinationType</a></code> | <code>string</code> | When set to 'Dedicated' logs sent to a Log Analytics workspace will go into resource specific tables, instead of the legacy AzureDiagnostics table. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.logAnalyticsWorkspaceId">logAnalyticsWorkspaceId</a></code> | <code>string</code> | Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#log_analytics_workspace_id MonitorDiagnosticSetting#log_analytics_workspace_id}. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.logCategories">logCategories</a></code> | <code>string[]</code> | Log Diagnostic categories. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.metricCategories">metricCategories</a></code> | <code>string[]</code> | Diagnostic Metrics. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.name">name</a></code> | <code>string</code> | Name of the diagnostic settings resource. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.partnerSolutionId">partnerSolutionId</a></code> | <code>string</code> | Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#partner_solution_id MonitorDiagnosticSetting#partner_solution_id}. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.storageAccountId">storageAccountId</a></code> | <code>string</code> | Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#storage_account_id MonitorDiagnosticSetting#storage_account_id}. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.targetResourceId">targetResourceId</a></code> | <code>string</code> | Target resource id to enable diagnostic settings on. |

---

##### `eventhubAuthorizationRuleId`<sup>Optional</sup> <a name="eventhubAuthorizationRuleId" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.eventhubAuthorizationRuleId"></a>

```typescript
public readonly eventhubAuthorizationRuleId: string;
```

- *Type:* string

Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#eventhub_authorization_rule_id MonitorDiagnosticSetting#eventhub_authorization_rule_id}.

---

##### `eventhubName`<sup>Optional</sup> <a name="eventhubName" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.eventhubName"></a>

```typescript
public readonly eventhubName: string;
```

- *Type:* string

Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#eventhub_name MonitorDiagnosticSetting#eventhub_name}.

---

##### `logAnalyticsDestinationType`<sup>Optional</sup> <a name="logAnalyticsDestinationType" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.logAnalyticsDestinationType"></a>

```typescript
public readonly logAnalyticsDestinationType: string;
```

- *Type:* string

When set to 'Dedicated' logs sent to a Log Analytics workspace will go into resource specific tables, instead of the legacy AzureDiagnostics table.

---

##### `logAnalyticsWorkspaceId`<sup>Optional</sup> <a name="logAnalyticsWorkspaceId" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.logAnalyticsWorkspaceId"></a>

```typescript
public readonly logAnalyticsWorkspaceId: string;
```

- *Type:* string

Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#log_analytics_workspace_id MonitorDiagnosticSetting#log_analytics_workspace_id}.

---

##### `logCategories`<sup>Optional</sup> <a name="logCategories" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.logCategories"></a>

```typescript
public readonly logCategories: string[];
```

- *Type:* string[]
- *Default:* null

Log Diagnostic categories.

---

##### `metricCategories`<sup>Optional</sup> <a name="metricCategories" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.metricCategories"></a>

```typescript
public readonly metricCategories: string[];
```

- *Type:* string[]
- *Default:* null

Diagnostic Metrics.

---

##### `name`<sup>Optional</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Name of the diagnostic settings resource.

---

##### `partnerSolutionId`<sup>Optional</sup> <a name="partnerSolutionId" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.partnerSolutionId"></a>

```typescript
public readonly partnerSolutionId: string;
```

- *Type:* string

Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#partner_solution_id MonitorDiagnosticSetting#partner_solution_id}.

---

##### `storageAccountId`<sup>Optional</sup> <a name="storageAccountId" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.storageAccountId"></a>

```typescript
public readonly storageAccountId: string;
```

- *Type:* string

Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/azurerm/3.71.0/docs/resources/monitor_diagnostic_setting#storage_account_id MonitorDiagnosticSetting#storage_account_id}.

---

##### `targetResourceId`<sup>Required</sup> <a name="targetResourceId" id="@microsoft/terraform-cdk-constructs.core_azure.DiagnosticSettingsProps.property.targetResourceId"></a>

```typescript
public readonly targetResourceId: string;
```

- *Type:* string

Target resource id to enable diagnostic settings on.

---

### FileShareProps <a name="FileShareProps" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShareProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShareProps.Initializer"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

const fileShareProps: azure_storageaccount.FileShareProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShareProps.property.accessTier">accessTier</a></code> | <code>string</code> | The access tier of the storage share. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShareProps.property.acl">acl</a></code> | <code>any</code> | A list of access control rules for the storage share. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShareProps.property.enabledProtocol">enabledProtocol</a></code> | <code>string</code> | The protocol to use when accessing the storage share. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShareProps.property.metadata">metadata</a></code> | <code>{[ key: string ]: string}</code> | A mapping of tags to assign to the storage share. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShareProps.property.quota">quota</a></code> | <code>number</code> | The maximum size of the storage share, in gigabytes. |

---

##### `accessTier`<sup>Optional</sup> <a name="accessTier" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShareProps.property.accessTier"></a>

```typescript
public readonly accessTier: string;
```

- *Type:* string

The access tier of the storage share.

This property is only applicable to storage shares with a premium account type.
Example values: Hot, Cool.

---

##### `acl`<sup>Optional</sup> <a name="acl" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShareProps.property.acl"></a>

```typescript
public readonly acl: any;
```

- *Type:* any

A list of access control rules for the storage share.

---

##### `enabledProtocol`<sup>Optional</sup> <a name="enabledProtocol" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShareProps.property.enabledProtocol"></a>

```typescript
public readonly enabledProtocol: string;
```

- *Type:* string

The protocol to use when accessing the storage share.

Example values: SMB, NFS.

---

##### `metadata`<sup>Optional</sup> <a name="metadata" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShareProps.property.metadata"></a>

```typescript
public readonly metadata: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

A mapping of tags to assign to the storage share.

Format: { [key: string]: string }

---

##### `quota`<sup>Optional</sup> <a name="quota" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.FileShareProps.property.quota"></a>

```typescript
public readonly quota: number;
```

- *Type:* number

The maximum size of the storage share, in gigabytes.

---

### FunctionAppLinuxProps <a name="FunctionAppLinuxProps" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps"></a>

Properties for the Azure Linux Function App.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.Initializer"></a>

```typescript
import { azure_functionapp } from '@microsoft/terraform-cdk-constructs'

const functionAppLinuxProps: azure_functionapp.FunctionAppLinuxProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.location">location</a></code> | <code>string</code> | The Azure Region where the Function App will be deployed, e.g., 'East US', 'West Europe'. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.name">name</a></code> | <code>string</code> | The name of the Function App. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.appSettings">appSettings</a></code> | <code>{[ key: string ]: string}</code> | Application settings for the Azure Function App. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.authSettings">authSettings</a></code> | <code>@cdktf/provider-azurerm.linuxFunctionApp.LinuxFunctionAppAuthSettings</code> | Optional authentication settings for the Function App. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.authSettingsV2">authSettingsV2</a></code> | <code>@cdktf/provider-azurerm.linuxFunctionApp.LinuxFunctionAppAuthSettingsV2</code> | Optional advanced version of authentication settings for the Function App. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.builtinLoggingEnabled">builtinLoggingEnabled</a></code> | <code>boolean</code> | Optional flag to enable built-in logging capabilities. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.clientCertificateEnabled">clientCertificateEnabled</a></code> | <code>boolean</code> | Optional flag to enable client certificate authentication. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.clientCertificateExclusionPaths">clientCertificateExclusionPaths</a></code> | <code>string</code> | Optional paths that are excluded from client certificate authentication. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.clientCertificateMode">clientCertificateMode</a></code> | <code>string</code> | Optional mode for client certificate requirement (e.g., 'Required', 'Optional'). |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.connectionString">connectionString</a></code> | <code>@cdktf/provider-azurerm.linuxFunctionApp.LinuxFunctionAppConnectionString[]</code> | Optional connection string for external services or databases. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.enabled">enabled</a></code> | <code>boolean</code> | Optional flag to enable or disable the Function App. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.functionsExtensionVersion">functionsExtensionVersion</a></code> | <code>string</code> | Optional version setting for the Azure Functions runtime. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.httpsOnly">httpsOnly</a></code> | <code>boolean</code> | Optional flag to enforce HTTPS only traffic. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.identity">identity</a></code> | <code>@cdktf/provider-azurerm.linuxFunctionApp.LinuxFunctionAppIdentity</code> | Optional identity configuration for the Function App, for use in Managed Service Identity scenarios. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.publicNetworkAccessEnabled">publicNetworkAccessEnabled</a></code> | <code>boolean</code> | Optional flag to enable or disable public network access to the Function App. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | An optional reference to the resource group in which to deploy the Function App. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.runtimeVersion">runtimeVersion</a></code> | <code>@cdktf/provider-azurerm.linuxFunctionApp.LinuxFunctionAppSiteConfigApplicationStack</code> | Optional runtime version specification for the Function App, such as Node.js, .NET, or Java version. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlan">servicePlan</a></code> | <code>@cdktf/provider-azurerm.servicePlan.ServicePlan</code> | Optional ID of an existing App Service Plan to host the Function App. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlanAppServiceEnvironmentId">servicePlanAppServiceEnvironmentId</a></code> | <code>string</code> | Optional ID for the App Service Environment to be used by the service plan. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlanMaximumElasticWorkerCount">servicePlanMaximumElasticWorkerCount</a></code> | <code>number</code> | Optional maximum count of elastic workers for the App Service Plan. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlanPerSiteScalingEnabled">servicePlanPerSiteScalingEnabled</a></code> | <code>boolean</code> | Optional flag to enable per-site scaling for the App Service Plan. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlanSku">servicePlanSku</a></code> | <code>string</code> | Optional SKU for the App Service Plan, defines the pricing tier and capabilities. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlanWorkerCount">servicePlanWorkerCount</a></code> | <code>number</code> | Optional worker count for the App Service Plan. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlanZoneBalancingEnabled">servicePlanZoneBalancingEnabled</a></code> | <code>boolean</code> | Optional flag to enable zone balancing for the App Service Plan. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.siteConfig">siteConfig</a></code> | <code>@cdktf/provider-azurerm.linuxFunctionApp.LinuxFunctionAppSiteConfig</code> | Optional site configuration for additional settings like environment variables, and connection strings. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.storageAccount">storageAccount</a></code> | <code>@cdktf/provider-azurerm.storageAccount.StorageAccount</code> | An optional reference to the storage account to be used by the Function App. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.storageAccountAccessKey">storageAccountAccessKey</a></code> | <code>string</code> | Optional access key for the storage account. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.storageUsesManagedIdentity">storageUsesManagedIdentity</a></code> | <code>boolean</code> | Optional flag indicating if the storage account uses a Managed Identity. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Optional tags for categorizing and managing the Function App resources within Azure. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.virtualNetworkSubnetId">virtualNetworkSubnetId</a></code> | <code>string</code> | Optional ID of a virtual network subnet for the Function App. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.zipDeployFile">zipDeployFile</a></code> | <code>string</code> | Optional path to a ZIP file for deployment to the Function App. |

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The Azure Region where the Function App will be deployed, e.g., 'East US', 'West Europe'.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Function App.

This name must be unique within Azure.

---

##### `appSettings`<sup>Optional</sup> <a name="appSettings" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.appSettings"></a>

```typescript
public readonly appSettings: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Application settings for the Azure Function App.

---

##### `authSettings`<sup>Optional</sup> <a name="authSettings" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.authSettings"></a>

```typescript
public readonly authSettings: LinuxFunctionAppAuthSettings;
```

- *Type:* @cdktf/provider-azurerm.linuxFunctionApp.LinuxFunctionAppAuthSettings

Optional authentication settings for the Function App.

---

##### `authSettingsV2`<sup>Optional</sup> <a name="authSettingsV2" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.authSettingsV2"></a>

```typescript
public readonly authSettingsV2: LinuxFunctionAppAuthSettingsV2;
```

- *Type:* @cdktf/provider-azurerm.linuxFunctionApp.LinuxFunctionAppAuthSettingsV2

Optional advanced version of authentication settings for the Function App.

---

##### `builtinLoggingEnabled`<sup>Optional</sup> <a name="builtinLoggingEnabled" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.builtinLoggingEnabled"></a>

```typescript
public readonly builtinLoggingEnabled: boolean;
```

- *Type:* boolean

Optional flag to enable built-in logging capabilities.

---

##### `clientCertificateEnabled`<sup>Optional</sup> <a name="clientCertificateEnabled" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.clientCertificateEnabled"></a>

```typescript
public readonly clientCertificateEnabled: boolean;
```

- *Type:* boolean

Optional flag to enable client certificate authentication.

---

##### `clientCertificateExclusionPaths`<sup>Optional</sup> <a name="clientCertificateExclusionPaths" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.clientCertificateExclusionPaths"></a>

```typescript
public readonly clientCertificateExclusionPaths: string;
```

- *Type:* string

Optional paths that are excluded from client certificate authentication.

---

##### `clientCertificateMode`<sup>Optional</sup> <a name="clientCertificateMode" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.clientCertificateMode"></a>

```typescript
public readonly clientCertificateMode: string;
```

- *Type:* string

Optional mode for client certificate requirement (e.g., 'Required', 'Optional').

---

##### `connectionString`<sup>Optional</sup> <a name="connectionString" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.connectionString"></a>

```typescript
public readonly connectionString: LinuxFunctionAppConnectionString[];
```

- *Type:* @cdktf/provider-azurerm.linuxFunctionApp.LinuxFunctionAppConnectionString[]

Optional connection string for external services or databases.

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

Optional flag to enable or disable the Function App.

---

##### `functionsExtensionVersion`<sup>Optional</sup> <a name="functionsExtensionVersion" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.functionsExtensionVersion"></a>

```typescript
public readonly functionsExtensionVersion: string;
```

- *Type:* string

Optional version setting for the Azure Functions runtime.

---

##### `httpsOnly`<sup>Optional</sup> <a name="httpsOnly" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.httpsOnly"></a>

```typescript
public readonly httpsOnly: boolean;
```

- *Type:* boolean

Optional flag to enforce HTTPS only traffic.

---

##### `identity`<sup>Optional</sup> <a name="identity" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.identity"></a>

```typescript
public readonly identity: LinuxFunctionAppIdentity;
```

- *Type:* @cdktf/provider-azurerm.linuxFunctionApp.LinuxFunctionAppIdentity

Optional identity configuration for the Function App, for use in Managed Service Identity scenarios.

---

##### `publicNetworkAccessEnabled`<sup>Optional</sup> <a name="publicNetworkAccessEnabled" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.publicNetworkAccessEnabled"></a>

```typescript
public readonly publicNetworkAccessEnabled: boolean;
```

- *Type:* boolean

Optional flag to enable or disable public network access to the Function App.

---

##### `resourceGroup`<sup>Optional</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

An optional reference to the resource group in which to deploy the Function App.

If not provided, the Function App will be deployed in the default resource group.

---

##### `runtimeVersion`<sup>Optional</sup> <a name="runtimeVersion" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.runtimeVersion"></a>

```typescript
public readonly runtimeVersion: LinuxFunctionAppSiteConfigApplicationStack;
```

- *Type:* @cdktf/provider-azurerm.linuxFunctionApp.LinuxFunctionAppSiteConfigApplicationStack

Optional runtime version specification for the Function App, such as Node.js, .NET, or Java version.

---

##### `servicePlan`<sup>Optional</sup> <a name="servicePlan" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlan"></a>

```typescript
public readonly servicePlan: ServicePlan;
```

- *Type:* @cdktf/provider-azurerm.servicePlan.ServicePlan

Optional ID of an existing App Service Plan to host the Function App.

If not provided, a new plan will be created.

---

##### `servicePlanAppServiceEnvironmentId`<sup>Optional</sup> <a name="servicePlanAppServiceEnvironmentId" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlanAppServiceEnvironmentId"></a>

```typescript
public readonly servicePlanAppServiceEnvironmentId: string;
```

- *Type:* string

Optional ID for the App Service Environment to be used by the service plan.

---

##### `servicePlanMaximumElasticWorkerCount`<sup>Optional</sup> <a name="servicePlanMaximumElasticWorkerCount" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlanMaximumElasticWorkerCount"></a>

```typescript
public readonly servicePlanMaximumElasticWorkerCount: number;
```

- *Type:* number

Optional maximum count of elastic workers for the App Service Plan.

---

##### `servicePlanPerSiteScalingEnabled`<sup>Optional</sup> <a name="servicePlanPerSiteScalingEnabled" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlanPerSiteScalingEnabled"></a>

```typescript
public readonly servicePlanPerSiteScalingEnabled: boolean;
```

- *Type:* boolean

Optional flag to enable per-site scaling for the App Service Plan.

---

##### `servicePlanSku`<sup>Optional</sup> <a name="servicePlanSku" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlanSku"></a>

```typescript
public readonly servicePlanSku: string;
```

- *Type:* string

Optional SKU for the App Service Plan, defines the pricing tier and capabilities.

---

##### `servicePlanWorkerCount`<sup>Optional</sup> <a name="servicePlanWorkerCount" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlanWorkerCount"></a>

```typescript
public readonly servicePlanWorkerCount: number;
```

- *Type:* number

Optional worker count for the App Service Plan.

---

##### `servicePlanZoneBalancingEnabled`<sup>Optional</sup> <a name="servicePlanZoneBalancingEnabled" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.servicePlanZoneBalancingEnabled"></a>

```typescript
public readonly servicePlanZoneBalancingEnabled: boolean;
```

- *Type:* boolean

Optional flag to enable zone balancing for the App Service Plan.

---

##### `siteConfig`<sup>Optional</sup> <a name="siteConfig" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.siteConfig"></a>

```typescript
public readonly siteConfig: LinuxFunctionAppSiteConfig;
```

- *Type:* @cdktf/provider-azurerm.linuxFunctionApp.LinuxFunctionAppSiteConfig

Optional site configuration for additional settings like environment variables, and connection strings.

---

##### `storageAccount`<sup>Optional</sup> <a name="storageAccount" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.storageAccount"></a>

```typescript
public readonly storageAccount: StorageAccount;
```

- *Type:* @cdktf/provider-azurerm.storageAccount.StorageAccount

An optional reference to the storage account to be used by the Function App.

If not provided, a new storage account will be created.

---

##### `storageAccountAccessKey`<sup>Optional</sup> <a name="storageAccountAccessKey" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.storageAccountAccessKey"></a>

```typescript
public readonly storageAccountAccessKey: string;
```

- *Type:* string

Optional access key for the storage account.

---

##### `storageUsesManagedIdentity`<sup>Optional</sup> <a name="storageUsesManagedIdentity" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.storageUsesManagedIdentity"></a>

```typescript
public readonly storageUsesManagedIdentity: boolean;
```

- *Type:* boolean

Optional flag indicating if the storage account uses a Managed Identity.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Optional tags for categorizing and managing the Function App resources within Azure.

---

##### `virtualNetworkSubnetId`<sup>Optional</sup> <a name="virtualNetworkSubnetId" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.virtualNetworkSubnetId"></a>

```typescript
public readonly virtualNetworkSubnetId: string;
```

- *Type:* string

Optional ID of a virtual network subnet for the Function App.

---

##### `zipDeployFile`<sup>Optional</sup> <a name="zipDeployFile" id="@microsoft/terraform-cdk-constructs.azure_functionapp.FunctionAppLinuxProps.property.zipDeployFile"></a>

```typescript
public readonly zipDeployFile: string;
```

- *Type:* string

Optional path to a ZIP file for deployment to the Function App.

---

### GrantCustomAccessOptions <a name="GrantCustomAccessOptions" id="@microsoft/terraform-cdk-constructs.azure_keyvault.GrantCustomAccessOptions"></a>

Options for granting custom access permissions in Azure Key Vault.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_keyvault.GrantCustomAccessOptions.Initializer"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

const grantCustomAccessOptions: azure_keyvault.GrantCustomAccessOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.GrantCustomAccessOptions.property.certificatePermissions">certificatePermissions</a></code> | <code>string[]</code> | Optional: A list of permissions to grant for certificates in the Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.GrantCustomAccessOptions.property.keyPermissions">keyPermissions</a></code> | <code>string[]</code> | Optional: A list of permissions to grant for keys in the Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.GrantCustomAccessOptions.property.secretPermissions">secretPermissions</a></code> | <code>string[]</code> | Optional: A list of permissions to grant for secrets in the Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.GrantCustomAccessOptions.property.storagePermissions">storagePermissions</a></code> | <code>string[]</code> | Optional: A list of permissions to grant for storage accounts in the Key Vault. |

---

##### `certificatePermissions`<sup>Optional</sup> <a name="certificatePermissions" id="@microsoft/terraform-cdk-constructs.azure_keyvault.GrantCustomAccessOptions.property.certificatePermissions"></a>

```typescript
public readonly certificatePermissions: string[];
```

- *Type:* string[]

Optional: A list of permissions to grant for certificates in the Key Vault.

Example permissions include 'get', 'list', 'create', 'delete', etc.

---

##### `keyPermissions`<sup>Optional</sup> <a name="keyPermissions" id="@microsoft/terraform-cdk-constructs.azure_keyvault.GrantCustomAccessOptions.property.keyPermissions"></a>

```typescript
public readonly keyPermissions: string[];
```

- *Type:* string[]

Optional: A list of permissions to grant for keys in the Key Vault.

Example permissions include 'encrypt', 'decrypt', 'wrapKey', 'unwrapKey', etc.

---

##### `secretPermissions`<sup>Optional</sup> <a name="secretPermissions" id="@microsoft/terraform-cdk-constructs.azure_keyvault.GrantCustomAccessOptions.property.secretPermissions"></a>

```typescript
public readonly secretPermissions: string[];
```

- *Type:* string[]

Optional: A list of permissions to grant for secrets in the Key Vault.

Example permissions include 'get', 'list', 'set', 'delete', etc.

---

##### `storagePermissions`<sup>Optional</sup> <a name="storagePermissions" id="@microsoft/terraform-cdk-constructs.azure_keyvault.GrantCustomAccessOptions.property.storagePermissions"></a>

```typescript
public readonly storagePermissions: string[];
```

- *Type:* string[]

Optional: A list of permissions to grant for storage accounts in the Key Vault.

Example permissions include 'get', 'list', 'delete', 'set', 'update', etc.

---

### GroupProps <a name="GroupProps" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps"></a>

Properties for the resource group.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps.Initializer"></a>

```typescript
import { azure_resourcegroup } from '@microsoft/terraform-cdk-constructs'

const groupProps: azure_resourcegroup.GroupProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps.property.ignoreChanges">ignoreChanges</a></code> | <code>string[]</code> | The lifecycle rules to ignore changes. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps.property.location">location</a></code> | <code>string</code> | The Azure Region to deploy. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps.property.name">name</a></code> | <code>string</code> | The name of the Azure Resource Group. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | The tags to assign to the Resource Group. |

---

##### `ignoreChanges`<sup>Optional</sup> <a name="ignoreChanges" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps.property.ignoreChanges"></a>

```typescript
public readonly ignoreChanges: string[];
```

- *Type:* string[]

The lifecycle rules to ignore changes.

---

##### `location`<sup>Optional</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The Azure Region to deploy.

---

##### `name`<sup>Optional</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Azure Resource Group.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_resourcegroup.GroupProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

The tags to assign to the Resource Group.

---

### InstanceProps <a name="InstanceProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

const instanceProps: azure_eventhub.InstanceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps.property.name">name</a></code> | <code>string</code> | Specifies the name of the EventHub resource. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps.property.messageRetention">messageRetention</a></code> | <code>number</code> | Specifies the number of days to retain the events for this Event Hub. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps.property.partitionCount">partitionCount</a></code> | <code>number</code> | Specifies the current number of shards on the Event Hub. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps.property.status">status</a></code> | <code>string</code> | Specifies the status of the Event Hub resource. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps.property.namespaceName">namespaceName</a></code> | <code>string</code> | Specifies the name of the EventHub Namespace. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the resource group in which the EventHub's parent Namespace exists. |

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Specifies the name of the EventHub resource.

---

##### `messageRetention`<sup>Optional</sup> <a name="messageRetention" id="@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps.property.messageRetention"></a>

```typescript
public readonly messageRetention: number;
```

- *Type:* number
- *Default:* 1

Specifies the number of days to retain the events for this Event Hub.

---

##### `partitionCount`<sup>Optional</sup> <a name="partitionCount" id="@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps.property.partitionCount"></a>

```typescript
public readonly partitionCount: number;
```

- *Type:* number
- *Default:* 2

Specifies the current number of shards on the Event Hub.

When using a shared parent EventHub Namespace, maximum value is 32.

---

##### `status`<sup>Optional</sup> <a name="status" id="@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps.property.status"></a>

```typescript
public readonly status: string;
```

- *Type:* string
- *Default:* "Active"

Specifies the status of the Event Hub resource.

Possible values are Active, Disabled and SendDisabled.

---

##### `namespaceName`<sup>Required</sup> <a name="namespaceName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps.property.namespaceName"></a>

```typescript
public readonly namespaceName: string;
```

- *Type:* string

Specifies the name of the EventHub Namespace.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_eventhub.InstanceProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the resource group in which the EventHub's parent Namespace exists.

---

### KeyProps <a name="KeyProps" id="@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.Initializer"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

const keyProps: azure_keyvault.KeyProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.accessPolicies">accessPolicies</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy[]</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.keyOpts">keyOpts</a></code> | <code>string[]</code> | Additional options or attributes related to the key. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.keyType">keyType</a></code> | <code>string</code> | The type of key to create (e.g., RSA, EC, etc.). |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.keyVaultId">keyVaultId</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.Vault</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.name">name</a></code> | <code>string</code> | The name of the key in the Azure Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.expires">expires</a></code> | <code>string</code> | Expiration date of the key. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.keySize">keySize</a></code> | <code>number</code> | The size of the key, typically specified for RSA keys. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.rotationPolicy">rotationPolicy</a></code> | <code>@cdktf/provider-azurerm.keyVaultKey.KeyVaultKeyRotationPolicy</code> | The policy for key rotation. |

---

##### `accessPolicies`<sup>Required</sup> <a name="accessPolicies" id="@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.accessPolicies"></a>

```typescript
public readonly accessPolicies: AccessPolicy[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy[]

---

##### `keyOpts`<sup>Required</sup> <a name="keyOpts" id="@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.keyOpts"></a>

```typescript
public readonly keyOpts: string[];
```

- *Type:* string[]

Additional options or attributes related to the key.

---

##### `keyType`<sup>Required</sup> <a name="keyType" id="@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.keyType"></a>

```typescript
public readonly keyType: string;
```

- *Type:* string

The type of key to create (e.g., RSA, EC, etc.).

---

##### `keyVaultId`<sup>Required</sup> <a name="keyVaultId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.keyVaultId"></a>

```typescript
public readonly keyVaultId: Vault;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.Vault

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the key in the Azure Key Vault.

---

##### `expires`<sup>Optional</sup> <a name="expires" id="@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.expires"></a>

```typescript
public readonly expires: string;
```

- *Type:* string

Expiration date of the key.

Format: UTC, YYYY-MM-DDTHH:MM:SSZ.

---

##### `keySize`<sup>Optional</sup> <a name="keySize" id="@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.keySize"></a>

```typescript
public readonly keySize: number;
```

- *Type:* number

The size of the key, typically specified for RSA keys.

---

##### `rotationPolicy`<sup>Optional</sup> <a name="rotationPolicy" id="@microsoft/terraform-cdk-constructs.azure_keyvault.KeyProps.property.rotationPolicy"></a>

```typescript
public readonly rotationPolicy: KeyVaultKeyRotationPolicy;
```

- *Type:* @cdktf/provider-azurerm.keyVaultKey.KeyVaultKeyRotationPolicy

The policy for key rotation.

---

### KustoDataConnectionProps <a name="KustoDataConnectionProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

const kustoDataConnectionProps: azure_eventhub.KustoDataConnectionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.kustoClusterName">kustoClusterName</a></code> | <code>string</code> | Specifies the name of the Kusto Cluster this data connection will be added to. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.kustoDatabaseName">kustoDatabaseName</a></code> | <code>string</code> | Specifies the name of the Kusto Database this data connection will be added to. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.kustoResourceGroup">kustoResourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | Specifies the Resource Group where the Kusto Database should exist. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.location">location</a></code> | <code>string</code> | The location where the Kusto EventHub Data Connection should be created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.name">name</a></code> | <code>string</code> | The name of the Kusto EventHub Data Connection to create. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.compression">compression</a></code> | <code>string</code> | Specifies compression type for the connection. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.consumerGroup">consumerGroup</a></code> | <code>string</code> | Specifies the EventHub consumer group this data connection will use for ingestion. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.databaseRoutingType">databaseRoutingType</a></code> | <code>string</code> | Indication for database routing information from the data connection, by default only database routing information is allowed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.dataFormat">dataFormat</a></code> | <code>string</code> | Specifies the data format of the EventHub messages. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.identityId">identityId</a></code> | <code>string</code> | The resource ID of a managed identity (system or user assigned) to be used to authenticate with event hub. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.mappingRuleName">mappingRuleName</a></code> | <code>string</code> | Specifies the mapping rule used for the message ingestion. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.tableName">tableName</a></code> | <code>string</code> | Specifies the target table name used for the message ingestion. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.eventhubId">eventhubId</a></code> | <code>string</code> | Specifies the resource id of the EventHub this data connection will use for ingestion. |

---

##### `kustoClusterName`<sup>Required</sup> <a name="kustoClusterName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.kustoClusterName"></a>

```typescript
public readonly kustoClusterName: string;
```

- *Type:* string

Specifies the name of the Kusto Cluster this data connection will be added to.

---

##### `kustoDatabaseName`<sup>Required</sup> <a name="kustoDatabaseName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.kustoDatabaseName"></a>

```typescript
public readonly kustoDatabaseName: string;
```

- *Type:* string

Specifies the name of the Kusto Database this data connection will be added to.

---

##### `kustoResourceGroup`<sup>Required</sup> <a name="kustoResourceGroup" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.kustoResourceGroup"></a>

```typescript
public readonly kustoResourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

Specifies the Resource Group where the Kusto Database should exist.

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The location where the Kusto EventHub Data Connection should be created.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Kusto EventHub Data Connection to create.

---

##### `compression`<sup>Optional</sup> <a name="compression" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.compression"></a>

```typescript
public readonly compression: string;
```

- *Type:* string
- *Default:* "None"

Specifies compression type for the connection.

Allowed values: GZip and None.

---

##### `consumerGroup`<sup>Optional</sup> <a name="consumerGroup" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.consumerGroup"></a>

```typescript
public readonly consumerGroup: string;
```

- *Type:* string
- *Default:* "$Default"

Specifies the EventHub consumer group this data connection will use for ingestion.

---

##### `databaseRoutingType`<sup>Optional</sup> <a name="databaseRoutingType" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.databaseRoutingType"></a>

```typescript
public readonly databaseRoutingType: string;
```

- *Type:* string
- *Default:* "Single"

Indication for database routing information from the data connection, by default only database routing information is allowed.

Allowed values: Single, Multi.

---

##### `dataFormat`<sup>Optional</sup> <a name="dataFormat" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.dataFormat"></a>

```typescript
public readonly dataFormat: string;
```

- *Type:* string
- *Default:* "JSON"

Specifies the data format of the EventHub messages.

Allowed values: APACHEAVRO, AVRO, CSV, JSON, MULTIJSON, ORC, PARQUET, PSV, RAW, SCSV, SINGLEJSON, SOHSV, TSVE, TSV, TXT, and W3CLOGFILE.

---

##### `identityId`<sup>Optional</sup> <a name="identityId" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.identityId"></a>

```typescript
public readonly identityId: string;
```

- *Type:* string

The resource ID of a managed identity (system or user assigned) to be used to authenticate with event hub.

---

##### `mappingRuleName`<sup>Optional</sup> <a name="mappingRuleName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.mappingRuleName"></a>

```typescript
public readonly mappingRuleName: string;
```

- *Type:* string

Specifies the mapping rule used for the message ingestion.

Mapping rule must exist before resource is created.

---

##### `tableName`<sup>Optional</sup> <a name="tableName" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.tableName"></a>

```typescript
public readonly tableName: string;
```

- *Type:* string

Specifies the target table name used for the message ingestion.

Table must exist before resource is created.

---

##### `eventhubId`<sup>Required</sup> <a name="eventhubId" id="@microsoft/terraform-cdk-constructs.azure_eventhub.KustoDataConnectionProps.property.eventhubId"></a>

```typescript
public readonly eventhubId: string;
```

- *Type:* string

Specifies the resource id of the EventHub this data connection will use for ingestion.

---

### LAFunctions <a name="LAFunctions" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions"></a>

Properties for defining a Log Analytics function.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions.Initializer"></a>

```typescript
import { azure_loganalytics } from '@microsoft/terraform-cdk-constructs'

const lAFunctions: azure_loganalytics.LAFunctions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions.property.displayName">displayName</a></code> | <code>string</code> | The display name for the function. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions.property.functionAlias">functionAlias</a></code> | <code>string</code> | The alias to be used for the function. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions.property.functionParameters">functionParameters</a></code> | <code>string[]</code> | A list of parameters for the function. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions.property.name">name</a></code> | <code>string</code> | The name of the function. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions.property.query">query</a></code> | <code>string</code> | The query that the function will execute. |

---

##### `displayName`<sup>Required</sup> <a name="displayName" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions.property.displayName"></a>

```typescript
public readonly displayName: string;
```

- *Type:* string

The display name for the function.

---

##### `functionAlias`<sup>Required</sup> <a name="functionAlias" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions.property.functionAlias"></a>

```typescript
public readonly functionAlias: string;
```

- *Type:* string

The alias to be used for the function.

---

##### `functionParameters`<sup>Required</sup> <a name="functionParameters" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions.property.functionParameters"></a>

```typescript
public readonly functionParameters: string[];
```

- *Type:* string[]

A list of parameters for the function.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the function.

---

##### `query`<sup>Required</sup> <a name="query" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions.property.query"></a>

```typescript
public readonly query: string;
```

- *Type:* string

The query that the function will execute.

---

### LinuxClusterProps <a name="LinuxClusterProps" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.Initializer"></a>

```typescript
import { azure_virtualmachinescaleset } from '@microsoft/terraform-cdk-constructs'

const linuxClusterProps: azure_virtualmachinescaleset.LinuxClusterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the resource group in which the virtual machine scale set will be created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.adminPassword">adminPassword</a></code> | <code>string</code> | The admin password for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.adminSshKey">adminSshKey</a></code> | <code>cdktf.IResolvable \| @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineAdminSshKey[]</code> | An array of SSH keys for the admin user. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.adminUsername">adminUsername</a></code> | <code>string</code> | The admin username for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.bootDiagnosticsStorageURI">bootDiagnosticsStorageURI</a></code> | <code>string</code> | Boot diagnostics settings for the VMSS. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.customData">customData</a></code> | <code>string</code> | Custom data to pass to the virtual machines upon creation. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.enableSshAzureADLogin">enableSshAzureADLogin</a></code> | <code>boolean</code> | Enable SSH Azure AD Login, required managed identity to be set. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.identity">identity</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineIdentity</code> | Managed identity settings for the VMs. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.instances">instances</a></code> | <code>number</code> | The number of VM instances in the scale set. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.location">location</a></code> | <code>string</code> | The Azure location where the virtual machine scale set should be created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.name">name</a></code> | <code>string</code> | The name of the virtual machine scale set. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.osDisk">osDisk</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineOsDisk</code> | The OS disk configuration for the virtual machines. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.overprovision">overprovision</a></code> | <code>boolean</code> | Specifies if the VMSS should be overprovisioned. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.publicIPAddress">publicIPAddress</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachineScaleSet.LinuxVirtualMachineScaleSetNetworkInterfaceIpConfigurationPublicIpAddress[]</code> | The allocation method for the public IP. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.scaleInPolicy">scaleInPolicy</a></code> | <code>string</code> | Specifies the scale-in policy for the VMSS. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.sku">sku</a></code> | <code>string</code> | The size of the virtual machines in the scale set. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.sourceImageId">sourceImageId</a></code> | <code>string</code> | The ID of the source image for the virtual machines. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.sourceImageReference">sourceImageReference</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference</code> | The source image reference for the virtual machines. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.subnet">subnet</a></code> | <code>@cdktf/provider-azurerm.subnet.Subnet</code> | The subnet in which the virtual machines will be placed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Tags to apply to the virtual machine scale set. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.upgradePolicyMode">upgradePolicyMode</a></code> | <code>string</code> | Specifies the scale set's upgrade policy settings. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.userData">userData</a></code> | <code>string</code> | Custom data to pass to the virtual machines upon creation. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.zones">zones</a></code> | <code>string[]</code> | The availability zone(s) in which the VMs should be placed. |

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the resource group in which the virtual machine scale set will be created.

---

##### `adminPassword`<sup>Optional</sup> <a name="adminPassword" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.adminPassword"></a>

```typescript
public readonly adminPassword: string;
```

- *Type:* string

The admin password for the virtual machine.

---

##### `adminSshKey`<sup>Optional</sup> <a name="adminSshKey" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.adminSshKey"></a>

```typescript
public readonly adminSshKey: IResolvable | LinuxVirtualMachineAdminSshKey[];
```

- *Type:* cdktf.IResolvable | @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineAdminSshKey[]

An array of SSH keys for the admin user.

---

##### `adminUsername`<sup>Optional</sup> <a name="adminUsername" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.adminUsername"></a>

```typescript
public readonly adminUsername: string;
```

- *Type:* string

The admin username for the virtual machine.

---

##### `bootDiagnosticsStorageURI`<sup>Optional</sup> <a name="bootDiagnosticsStorageURI" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.bootDiagnosticsStorageURI"></a>

```typescript
public readonly bootDiagnosticsStorageURI: string;
```

- *Type:* string

Boot diagnostics settings for the VMSS.

---

##### `customData`<sup>Optional</sup> <a name="customData" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.customData"></a>

```typescript
public readonly customData: string;
```

- *Type:* string

Custom data to pass to the virtual machines upon creation.

---

##### `enableSshAzureADLogin`<sup>Optional</sup> <a name="enableSshAzureADLogin" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.enableSshAzureADLogin"></a>

```typescript
public readonly enableSshAzureADLogin: boolean;
```

- *Type:* boolean
- *Default:* false

Enable SSH Azure AD Login, required managed identity to be set.

---

##### `identity`<sup>Optional</sup> <a name="identity" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.identity"></a>

```typescript
public readonly identity: LinuxVirtualMachineIdentity;
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineIdentity

Managed identity settings for the VMs.

---

##### `instances`<sup>Optional</sup> <a name="instances" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.instances"></a>

```typescript
public readonly instances: number;
```

- *Type:* number
- *Default:* 2

The number of VM instances in the scale set.

---

##### `location`<sup>Optional</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string
- *Default:* "eastus"

The Azure location where the virtual machine scale set should be created.

---

##### `name`<sup>Optional</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* Uses the name derived from the construct path.

The name of the virtual machine scale set.

---

##### `osDisk`<sup>Optional</sup> <a name="osDisk" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.osDisk"></a>

```typescript
public readonly osDisk: LinuxVirtualMachineOsDisk;
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineOsDisk
- *Default:* Uses a disk with caching set to "ReadWrite" and storage account type "Standard_LRS".

The OS disk configuration for the virtual machines.

---

##### `overprovision`<sup>Optional</sup> <a name="overprovision" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.overprovision"></a>

```typescript
public readonly overprovision: boolean;
```

- *Type:* boolean
- *Default:* true

Specifies if the VMSS should be overprovisioned.

---

##### `publicIPAddress`<sup>Optional</sup> <a name="publicIPAddress" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.publicIPAddress"></a>

```typescript
public readonly publicIPAddress: LinuxVirtualMachineScaleSetNetworkInterfaceIpConfigurationPublicIpAddress[];
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachineScaleSet.LinuxVirtualMachineScaleSetNetworkInterfaceIpConfigurationPublicIpAddress[]

The allocation method for the public IP.

---

##### `scaleInPolicy`<sup>Optional</sup> <a name="scaleInPolicy" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.scaleInPolicy"></a>

```typescript
public readonly scaleInPolicy: string;
```

- *Type:* string

Specifies the scale-in policy for the VMSS.

---

##### `sku`<sup>Optional</sup> <a name="sku" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.sku"></a>

```typescript
public readonly sku: string;
```

- *Type:* string
- *Default:* "Standard_B2s"

The size of the virtual machines in the scale set.

---

##### `sourceImageId`<sup>Optional</sup> <a name="sourceImageId" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.sourceImageId"></a>

```typescript
public readonly sourceImageId: string;
```

- *Type:* string

The ID of the source image for the virtual machines.

---

##### `sourceImageReference`<sup>Optional</sup> <a name="sourceImageReference" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.sourceImageReference"></a>

```typescript
public readonly sourceImageReference: LinuxVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference
- *Default:* Uses a default Ubuntu image.

The source image reference for the virtual machines.

---

##### `subnet`<sup>Optional</sup> <a name="subnet" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.subnet"></a>

```typescript
public readonly subnet: Subnet;
```

- *Type:* @cdktf/provider-azurerm.subnet.Subnet

The subnet in which the virtual machines will be placed.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Tags to apply to the virtual machine scale set.

---

##### `upgradePolicyMode`<sup>Optional</sup> <a name="upgradePolicyMode" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.upgradePolicyMode"></a>

```typescript
public readonly upgradePolicyMode: string;
```

- *Type:* string

Specifies the scale set's upgrade policy settings.

---

##### `userData`<sup>Optional</sup> <a name="userData" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.userData"></a>

```typescript
public readonly userData: string;
```

- *Type:* string

Custom data to pass to the virtual machines upon creation.

---

##### `zones`<sup>Optional</sup> <a name="zones" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.LinuxClusterProps.property.zones"></a>

```typescript
public readonly zones: string[];
```

- *Type:* string[]

The availability zone(s) in which the VMs should be placed.

---

### LinuxVMProps <a name="LinuxVMProps" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.Initializer"></a>

```typescript
import { azure_virtualmachine } from '@microsoft/terraform-cdk-constructs'

const linuxVMProps: azure_virtualmachine.LinuxVMProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the resource group in which the virtual machine will be created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.additionalCapabilities">additionalCapabilities</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineAdditionalCapabilities</code> | Additional capabilities like Ultra Disk compatibility. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.adminPassword">adminPassword</a></code> | <code>string</code> | The admin password for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.adminSshKey">adminSshKey</a></code> | <code>cdktf.IResolvable \| @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineAdminSshKey[]</code> | An array of SSH keys for the admin user. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.adminUsername">adminUsername</a></code> | <code>string</code> | The admin username for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.availabilitySetId">availabilitySetId</a></code> | <code>string</code> | The ID of the availability set in which the VM should be placed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.bootDiagnosticsStorageURI">bootDiagnosticsStorageURI</a></code> | <code>string</code> | Bootdiagnostics settings for the VM. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.customData">customData</a></code> | <code>string</code> | Custom data to pass to the virtual machine upon creation. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.enableSshAzureADLogin">enableSshAzureADLogin</a></code> | <code>boolean</code> | Enable SSH Azure AD Login, required managed identity to be set. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.identity">identity</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineIdentity</code> | Managed identity settings for the VM. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.location">location</a></code> | <code>string</code> | The Azure location where the virtual machine should be created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.name">name</a></code> | <code>string</code> | The name of the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.osDisk">osDisk</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineOsDisk</code> | The OS disk configuration for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.publicIPAllocationMethod">publicIPAllocationMethod</a></code> | <code>string</code> | The allocation method for the public IP. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.secret">secret</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSecret[]</code> | An array of secrets to be passed to the VM. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.size">size</a></code> | <code>string</code> | The size of the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.sourceImageId">sourceImageId</a></code> | <code>string</code> | The ID of the source image for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.sourceImageReference">sourceImageReference</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference</code> | The source image reference for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.subnet">subnet</a></code> | <code>@cdktf/provider-azurerm.subnet.Subnet</code> | The subnet in which the virtual machine will be placed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Tags to apply to the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.userData">userData</a></code> | <code>string</code> | Custom data to pass to the virtual machine upon creation. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.zone">zone</a></code> | <code>string</code> | The availability zone in which the VM should be placed. |

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the resource group in which the virtual machine will be created.

---

##### `additionalCapabilities`<sup>Optional</sup> <a name="additionalCapabilities" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.additionalCapabilities"></a>

```typescript
public readonly additionalCapabilities: LinuxVirtualMachineAdditionalCapabilities;
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineAdditionalCapabilities

Additional capabilities like Ultra Disk compatibility.

---

##### `adminPassword`<sup>Optional</sup> <a name="adminPassword" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.adminPassword"></a>

```typescript
public readonly adminPassword: string;
```

- *Type:* string

The admin password for the virtual machine.

---

##### `adminSshKey`<sup>Optional</sup> <a name="adminSshKey" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.adminSshKey"></a>

```typescript
public readonly adminSshKey: IResolvable | LinuxVirtualMachineAdminSshKey[];
```

- *Type:* cdktf.IResolvable | @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineAdminSshKey[]

An array of SSH keys for the admin user.

---

##### `adminUsername`<sup>Optional</sup> <a name="adminUsername" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.adminUsername"></a>

```typescript
public readonly adminUsername: string;
```

- *Type:* string

The admin username for the virtual machine.

---

##### `availabilitySetId`<sup>Optional</sup> <a name="availabilitySetId" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.availabilitySetId"></a>

```typescript
public readonly availabilitySetId: string;
```

- *Type:* string

The ID of the availability set in which the VM should be placed.

---

##### `bootDiagnosticsStorageURI`<sup>Optional</sup> <a name="bootDiagnosticsStorageURI" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.bootDiagnosticsStorageURI"></a>

```typescript
public readonly bootDiagnosticsStorageURI: string;
```

- *Type:* string

Bootdiagnostics settings for the VM.

---

##### `customData`<sup>Optional</sup> <a name="customData" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.customData"></a>

```typescript
public readonly customData: string;
```

- *Type:* string

Custom data to pass to the virtual machine upon creation.

---

##### `enableSshAzureADLogin`<sup>Optional</sup> <a name="enableSshAzureADLogin" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.enableSshAzureADLogin"></a>

```typescript
public readonly enableSshAzureADLogin: boolean;
```

- *Type:* boolean

Enable SSH Azure AD Login, required managed identity to be set.

---

##### `identity`<sup>Optional</sup> <a name="identity" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.identity"></a>

```typescript
public readonly identity: LinuxVirtualMachineIdentity;
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineIdentity

Managed identity settings for the VM.

---

##### `location`<sup>Optional</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string
- *Default:* "eastus"

The Azure location where the virtual machine should be created.

---

##### `name`<sup>Optional</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* Uses the name derived from the construct path.

The name of the virtual machine.

---

##### `osDisk`<sup>Optional</sup> <a name="osDisk" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.osDisk"></a>

```typescript
public readonly osDisk: LinuxVirtualMachineOsDisk;
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineOsDisk
- *Default:* Uses a disk with caching set to "ReadWrite" and storage account type "Standard_LRS".

The OS disk configuration for the virtual machine.

---

##### `publicIPAllocationMethod`<sup>Optional</sup> <a name="publicIPAllocationMethod" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.publicIPAllocationMethod"></a>

```typescript
public readonly publicIPAllocationMethod: string;
```

- *Type:* string

The allocation method for the public IP.

---

##### `secret`<sup>Optional</sup> <a name="secret" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.secret"></a>

```typescript
public readonly secret: LinuxVirtualMachineSecret[];
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSecret[]

An array of secrets to be passed to the VM.

---

##### `size`<sup>Optional</sup> <a name="size" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.size"></a>

```typescript
public readonly size: string;
```

- *Type:* string
- *Default:* "Standard_B2s"

The size of the virtual machine.

---

##### `sourceImageId`<sup>Optional</sup> <a name="sourceImageId" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.sourceImageId"></a>

```typescript
public readonly sourceImageId: string;
```

- *Type:* string

The ID of the source image for the virtual machine.

---

##### `sourceImageReference`<sup>Optional</sup> <a name="sourceImageReference" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.sourceImageReference"></a>

```typescript
public readonly sourceImageReference: LinuxVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference
- *Default:* Uses WindowsServer2022DatacenterCore.

The source image reference for the virtual machine.

---

##### `subnet`<sup>Optional</sup> <a name="subnet" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.subnet"></a>

```typescript
public readonly subnet: Subnet;
```

- *Type:* @cdktf/provider-azurerm.subnet.Subnet
- *Default:* Uses the default subnet from a new virtual network.

The subnet in which the virtual machine will be placed.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Tags to apply to the virtual machine.

---

##### `userData`<sup>Optional</sup> <a name="userData" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.userData"></a>

```typescript
public readonly userData: string;
```

- *Type:* string

Custom data to pass to the virtual machine upon creation.

---

##### `zone`<sup>Optional</sup> <a name="zone" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxVMProps.property.zone"></a>

```typescript
public readonly zone: string;
```

- *Type:* string

The availability zone in which the VM should be placed.

---

### MetricAlertActionProp <a name="MetricAlertActionProp" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertActionProp"></a>

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#action}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#action})

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertActionProp.Initializer"></a>

```typescript
import { azure_metricalert } from '@microsoft/terraform-cdk-constructs'

const metricAlertActionProp: azure_metricalert.MetricAlertActionProp = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertActionProp.property.actionGroupId">actionGroupId</a></code> | <code>string[]</code> | The ID of the Action Group. |

---

##### `actionGroupId`<sup>Required</sup> <a name="actionGroupId" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertActionProp.property.actionGroupId"></a>

```typescript
public readonly actionGroupId: string[];
```

- *Type:* string[]

The ID of the Action Group.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#action_group_id}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#action_group_id})

---

### MetricAlertCriteriaBaseProps <a name="MetricAlertCriteriaBaseProps" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps"></a>

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#criteria}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#criteria})

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps.Initializer"></a>

```typescript
import { azure_metricalert } from '@microsoft/terraform-cdk-constructs'

const metricAlertCriteriaBaseProps: azure_metricalert.MetricAlertCriteriaBaseProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps.property.aggregation">aggregation</a></code> | <code>string</code> | The aggregation type to apply to the metric. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps.property.metricName">metricName</a></code> | <code>string</code> | The name of the metric to monitor. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps.property.metricNamespace">metricNamespace</a></code> | <code>string</code> | The namespace of the metric. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps.property.operator">operator</a></code> | <code>string</code> | The operator to apply to the metric. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps.property.dimension">dimension</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp[]</code> | One or more dimensions. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps.property.skipMetricValidation">skipMetricValidation</a></code> | <code>boolean</code> | Skip the metric validation to allow creating an alert rule on a custom metric that isn't yet emitted? |

---

##### `aggregation`<sup>Required</sup> <a name="aggregation" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps.property.aggregation"></a>

```typescript
public readonly aggregation: string;
```

- *Type:* string

The aggregation type to apply to the metric.

Possible values are Average, Count, Minimum, Maximum and Total.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#aggregation}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#aggregation})

---

##### `metricName`<sup>Required</sup> <a name="metricName" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps.property.metricName"></a>

```typescript
public readonly metricName: string;
```

- *Type:* string

The name of the metric to monitor.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_name}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_name})

---

##### `metricNamespace`<sup>Required</sup> <a name="metricNamespace" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps.property.metricNamespace"></a>

```typescript
public readonly metricNamespace: string;
```

- *Type:* string

The namespace of the metric.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_namespace}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_namespace})

---

##### `operator`<sup>Required</sup> <a name="operator" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps.property.operator"></a>

```typescript
public readonly operator: string;
```

- *Type:* string

The operator to apply to the metric.

Possible values are Equals, NotEquals, GreaterThan, GreaterThanOrEqual, LessThan and LessThanOrEqual.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#operator}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#operator})

---

##### `dimension`<sup>Optional</sup> <a name="dimension" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps.property.dimension"></a>

```typescript
public readonly dimension: MetricAlertCriteriaDimensionProp[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp[]

One or more dimensions.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension})

---

##### `skipMetricValidation`<sup>Optional</sup> <a name="skipMetricValidation" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaBaseProps.property.skipMetricValidation"></a>

```typescript
public readonly skipMetricValidation: boolean;
```

- *Type:* boolean
- *Default:* false.

Skip the metric validation to allow creating an alert rule on a custom metric that isn't yet emitted?

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#skip_metric_validation}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#skip_metric_validation})

---

### MetricAlertCriteriaDimensionProp <a name="MetricAlertCriteriaDimensionProp" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp"></a>

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension})

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp.Initializer"></a>

```typescript
import { azure_metricalert } from '@microsoft/terraform-cdk-constructs'

const metricAlertCriteriaDimensionProp: azure_metricalert.MetricAlertCriteriaDimensionProp = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp.property.name">name</a></code> | <code>string</code> | The dimension name. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp.property.operator">operator</a></code> | <code>string</code> | The dimension operator. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp.property.values">values</a></code> | <code>string[]</code> | The dimension values. |

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The dimension name.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension_name}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension_name})

---

##### `operator`<sup>Required</sup> <a name="operator" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp.property.operator"></a>

```typescript
public readonly operator: string;
```

- *Type:* string

The dimension operator.

Possible values are Include, Exclude and StartsWith.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension_operator}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension_operator})

---

##### `values`<sup>Required</sup> <a name="values" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp.property.values"></a>

```typescript
public readonly values: string[];
```

- *Type:* string[]

The dimension values.

Use a wildcard * to collect all.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension_values}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension_values})

---

### MetricAlertCriteriaProp <a name="MetricAlertCriteriaProp" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp"></a>

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#criteria}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#criteria})

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.Initializer"></a>

```typescript
import { azure_metricalert } from '@microsoft/terraform-cdk-constructs'

const metricAlertCriteriaProp: azure_metricalert.MetricAlertCriteriaProp = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.aggregation">aggregation</a></code> | <code>string</code> | The aggregation type to apply to the metric. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.metricName">metricName</a></code> | <code>string</code> | The name of the metric to monitor. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.metricNamespace">metricNamespace</a></code> | <code>string</code> | The namespace of the metric. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.operator">operator</a></code> | <code>string</code> | The operator to apply to the metric. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.dimension">dimension</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp[]</code> | One or more dimensions. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.skipMetricValidation">skipMetricValidation</a></code> | <code>boolean</code> | Skip the metric validation to allow creating an alert rule on a custom metric that isn't yet emitted? |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.threshold">threshold</a></code> | <code>number</code> | The threshold value for the metric that triggers the alert. |

---

##### `aggregation`<sup>Required</sup> <a name="aggregation" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.aggregation"></a>

```typescript
public readonly aggregation: string;
```

- *Type:* string

The aggregation type to apply to the metric.

Possible values are Average, Count, Minimum, Maximum and Total.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#aggregation}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#aggregation})

---

##### `metricName`<sup>Required</sup> <a name="metricName" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.metricName"></a>

```typescript
public readonly metricName: string;
```

- *Type:* string

The name of the metric to monitor.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_name}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_name})

---

##### `metricNamespace`<sup>Required</sup> <a name="metricNamespace" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.metricNamespace"></a>

```typescript
public readonly metricNamespace: string;
```

- *Type:* string

The namespace of the metric.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_namespace}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_namespace})

---

##### `operator`<sup>Required</sup> <a name="operator" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.operator"></a>

```typescript
public readonly operator: string;
```

- *Type:* string

The operator to apply to the metric.

Possible values are Equals, NotEquals, GreaterThan, GreaterThanOrEqual, LessThan and LessThanOrEqual.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#operator}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#operator})

---

##### `dimension`<sup>Optional</sup> <a name="dimension" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.dimension"></a>

```typescript
public readonly dimension: MetricAlertCriteriaDimensionProp[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp[]

One or more dimensions.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension})

---

##### `skipMetricValidation`<sup>Optional</sup> <a name="skipMetricValidation" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.skipMetricValidation"></a>

```typescript
public readonly skipMetricValidation: boolean;
```

- *Type:* boolean
- *Default:* false.

Skip the metric validation to allow creating an alert rule on a custom metric that isn't yet emitted?

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#skip_metric_validation}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#skip_metric_validation})

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The threshold value for the metric that triggers the alert.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#threshold}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#threshold})

---

### MetricAlertDynamicCritiriaProps <a name="MetricAlertDynamicCritiriaProps" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps"></a>

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dynamic_criteria}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dynamic_criteria})

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.Initializer"></a>

```typescript
import { azure_metricalert } from '@microsoft/terraform-cdk-constructs'

const metricAlertDynamicCritiriaProps: azure_metricalert.MetricAlertDynamicCritiriaProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.aggregation">aggregation</a></code> | <code>string</code> | The aggregation type to apply to the metric. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.metricName">metricName</a></code> | <code>string</code> | The name of the metric to monitor. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.metricNamespace">metricNamespace</a></code> | <code>string</code> | The namespace of the metric. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.operator">operator</a></code> | <code>string</code> | The operator to apply to the metric. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.dimension">dimension</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp[]</code> | One or more dimensions. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.skipMetricValidation">skipMetricValidation</a></code> | <code>boolean</code> | Skip the metric validation to allow creating an alert rule on a custom metric that isn't yet emitted? |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.alertSensitivity">alertSensitivity</a></code> | <code>string</code> | The extent of deviation required to trigger an alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.evaluationFailureCount">evaluationFailureCount</a></code> | <code>number</code> | The number of violations to trigger an alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.evaluationTotalCount">evaluationTotalCount</a></code> | <code>number</code> | he number of aggregated lookback points. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.ignoreDataBefore">ignoreDataBefore</a></code> | <code>string</code> | The ISO8601 date from which to start learning the metric historical data and calculate the dynamic thresholds. |

---

##### `aggregation`<sup>Required</sup> <a name="aggregation" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.aggregation"></a>

```typescript
public readonly aggregation: string;
```

- *Type:* string

The aggregation type to apply to the metric.

Possible values are Average, Count, Minimum, Maximum and Total.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#aggregation}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#aggregation})

---

##### `metricName`<sup>Required</sup> <a name="metricName" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.metricName"></a>

```typescript
public readonly metricName: string;
```

- *Type:* string

The name of the metric to monitor.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_name}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_name})

---

##### `metricNamespace`<sup>Required</sup> <a name="metricNamespace" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.metricNamespace"></a>

```typescript
public readonly metricNamespace: string;
```

- *Type:* string

The namespace of the metric.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_namespace}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#metric_namespace})

---

##### `operator`<sup>Required</sup> <a name="operator" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.operator"></a>

```typescript
public readonly operator: string;
```

- *Type:* string

The operator to apply to the metric.

Possible values are Equals, NotEquals, GreaterThan, GreaterThanOrEqual, LessThan and LessThanOrEqual.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#operator}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#operator})

---

##### `dimension`<sup>Optional</sup> <a name="dimension" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.dimension"></a>

```typescript
public readonly dimension: MetricAlertCriteriaDimensionProp[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaDimensionProp[]

One or more dimensions.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dimension})

---

##### `skipMetricValidation`<sup>Optional</sup> <a name="skipMetricValidation" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.skipMetricValidation"></a>

```typescript
public readonly skipMetricValidation: boolean;
```

- *Type:* boolean
- *Default:* false.

Skip the metric validation to allow creating an alert rule on a custom metric that isn't yet emitted?

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#skip_metric_validation}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#skip_metric_validation})

---

##### `alertSensitivity`<sup>Required</sup> <a name="alertSensitivity" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.alertSensitivity"></a>

```typescript
public readonly alertSensitivity: string;
```

- *Type:* string

The extent of deviation required to trigger an alert.

Possible values are Low, Medium and High.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#alert_sensitivity}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#alert_sensitivity})

---

##### `evaluationFailureCount`<sup>Optional</sup> <a name="evaluationFailureCount" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.evaluationFailureCount"></a>

```typescript
public readonly evaluationFailureCount: number;
```

- *Type:* number
- *Default:* 4

The number of violations to trigger an alert.

Should be smaller or equal to evaluation_total_count.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#evaluation_failure_count}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#evaluation_failure_count})

---

##### `evaluationTotalCount`<sup>Optional</sup> <a name="evaluationTotalCount" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.evaluationTotalCount"></a>

```typescript
public readonly evaluationTotalCount: number;
```

- *Type:* number
- *Default:* 4

he number of aggregated lookback points.

The lookback time window is calculated based on the aggregation granularity (window_size) and the selected number of aggregated points.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#evaluation_total_count}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#evaluation_total_count})

---

##### `ignoreDataBefore`<sup>Optional</sup> <a name="ignoreDataBefore" id="@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps.property.ignoreDataBefore"></a>

```typescript
public readonly ignoreDataBefore: string;
```

- *Type:* string

The ISO8601 date from which to start learning the metric historical data and calculate the dynamic thresholds.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#ignore_data_before}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#ignore_data_before})

---

### NamespaceProps <a name="NamespaceProps" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.Initializer"></a>

```typescript
import { azure_eventhub } from '@microsoft/terraform-cdk-constructs'

const namespaceProps: azure_eventhub.NamespaceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.name">name</a></code> | <code>string</code> | The name of the EventHub Namespace to create. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The Azure Resource Group in which to create the EventHub Namespace. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.autoInflateEnabled">autoInflateEnabled</a></code> | <code>boolean</code> | Specifies if the EventHub Namespace should be Auto Inflate enabled. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.capacity">capacity</a></code> | <code>number</code> | Specifies the Capacity / Throughput Units for a Standard SKU namespace. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.identityIds">identityIds</a></code> | <code>string[]</code> | Specifies a list of User Assigned Managed Identity IDs to be assigned to this EventHub namespace. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.identityType">identityType</a></code> | <code>string</code> | Specifies the type of Managed Service Identity that should be configured on this Event Hub Namespace. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.localAuthenticationEnabled">localAuthenticationEnabled</a></code> | <code>boolean</code> | Is SAS authentication enabled for the EventHub Namespace? |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.maximumThroughputUnits">maximumThroughputUnits</a></code> | <code>number</code> | Specifies the maximum number of throughput units when Auto Inflate is Enabled. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.minimumTlsVersion">minimumTlsVersion</a></code> | <code>string</code> | The minimum supported TLS version for this EventHub Namespace. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.publicNetworkAccessEnabled">publicNetworkAccessEnabled</a></code> | <code>boolean</code> | Is public network access enabled for the EventHub Namespace? |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.sku">sku</a></code> | <code>string</code> | Defines which tier to use. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | The tags to assign to the Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.zoneRedundant">zoneRedundant</a></code> | <code>boolean</code> | Specifies if the EventHub Namespace should be Zone Redundant (created across Availability Zones). |

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the EventHub Namespace to create.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The Azure Resource Group in which to create the EventHub Namespace.

---

##### `autoInflateEnabled`<sup>Optional</sup> <a name="autoInflateEnabled" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.autoInflateEnabled"></a>

```typescript
public readonly autoInflateEnabled: boolean;
```

- *Type:* boolean
- *Default:* false

Specifies if the EventHub Namespace should be Auto Inflate enabled.

---

##### `capacity`<sup>Optional</sup> <a name="capacity" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.capacity"></a>

```typescript
public readonly capacity: number;
```

- *Type:* number
- *Default:* 2

Specifies the Capacity / Throughput Units for a Standard SKU namespace.

---

##### `identityIds`<sup>Optional</sup> <a name="identityIds" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.identityIds"></a>

```typescript
public readonly identityIds: string[];
```

- *Type:* string[]

Specifies a list of User Assigned Managed Identity IDs to be assigned to this EventHub namespace.

---

##### `identityType`<sup>Optional</sup> <a name="identityType" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.identityType"></a>

```typescript
public readonly identityType: string;
```

- *Type:* string
- *Default:* "SystemAssigned"

Specifies the type of Managed Service Identity that should be configured on this Event Hub Namespace.

Possible values are SystemAssigned or UserAssigned.

---

##### `localAuthenticationEnabled`<sup>Optional</sup> <a name="localAuthenticationEnabled" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.localAuthenticationEnabled"></a>

```typescript
public readonly localAuthenticationEnabled: boolean;
```

- *Type:* boolean
- *Default:* false

Is SAS authentication enabled for the EventHub Namespace?

North Central US Not supported.

---

##### `maximumThroughputUnits`<sup>Optional</sup> <a name="maximumThroughputUnits" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.maximumThroughputUnits"></a>

```typescript
public readonly maximumThroughputUnits: number;
```

- *Type:* number
- *Default:* 2

Specifies the maximum number of throughput units when Auto Inflate is Enabled.

Valid values range from 1 - 20.

---

##### `minimumTlsVersion`<sup>Optional</sup> <a name="minimumTlsVersion" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.minimumTlsVersion"></a>

```typescript
public readonly minimumTlsVersion: string;
```

- *Type:* string
- *Default:* "1.2"

The minimum supported TLS version for this EventHub Namespace.

Valid values are: 1.0, 1.1 and 1.2.

---

##### `publicNetworkAccessEnabled`<sup>Optional</sup> <a name="publicNetworkAccessEnabled" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.publicNetworkAccessEnabled"></a>

```typescript
public readonly publicNetworkAccessEnabled: boolean;
```

- *Type:* boolean
- *Default:* true

Is public network access enabled for the EventHub Namespace?

---

##### `sku`<sup>Optional</sup> <a name="sku" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.sku"></a>

```typescript
public readonly sku: string;
```

- *Type:* string
- *Default:* "Basic"

Defines which tier to use.

Valid options are Basic, Standard, and Premium.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

The tags to assign to the Key Vault.

---

##### `zoneRedundant`<sup>Optional</sup> <a name="zoneRedundant" id="@microsoft/terraform-cdk-constructs.azure_eventhub.NamespaceProps.property.zoneRedundant"></a>

```typescript
public readonly zoneRedundant: boolean;
```

- *Type:* boolean
- *Default:* true

Specifies if the EventHub Namespace should be Zone Redundant (created across Availability Zones).

---

### NetworkProps <a name="NetworkProps" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps"></a>

Properties for defining an Azure Virtual Network.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps.Initializer"></a>

```typescript
import { azure_virtualnetwork } from '@microsoft/terraform-cdk-constructs'

const networkProps: azure_virtualnetwork.NetworkProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the resource group under which the virtual network will be created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps.property.addressSpace">addressSpace</a></code> | <code>string[]</code> | Optional: A list of address spaces for the virtual network, specified in CIDR notation. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps.property.location">location</a></code> | <code>string</code> | Optional: The Azure region in which to create the virtual network, e.g., 'East US', 'West Europe'. If not specified, the region of the resource group will be used. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps.property.name">name</a></code> | <code>string</code> | Optional: The name of the virtual network. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps.property.subnets">subnets</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualnetwork.SubnetConfig[]</code> | Optional: An array of subnet configurations to be created within the virtual network. |

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the resource group under which the virtual network will be created.

---

##### `addressSpace`<sup>Optional</sup> <a name="addressSpace" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps.property.addressSpace"></a>

```typescript
public readonly addressSpace: string[];
```

- *Type:* string[]

Optional: A list of address spaces for the virtual network, specified in CIDR notation.

For example, ['10.0.0.0/16'] defines a single address space. Multiple address spaces can be provided.

---

##### `location`<sup>Optional</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

Optional: The Azure region in which to create the virtual network, e.g., 'East US', 'West Europe'. If not specified, the region of the resource group will be used.

---

##### `name`<sup>Optional</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Optional: The name of the virtual network.

Must be unique within the resource group.
If not provided, a default name will be assigned.

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.NetworkProps.property.subnets"></a>

```typescript
public readonly subnets: SubnetConfig[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualnetwork.SubnetConfig[]

Optional: An array of subnet configurations to be created within the virtual network.

Each subnet is defined by its name and address prefix(es).

---

### NetworkRulesProps <a name="NetworkRulesProps" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.NetworkRulesProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.NetworkRulesProps.Initializer"></a>

```typescript
import { azure_storageaccount } from '@microsoft/terraform-cdk-constructs'

const networkRulesProps: azure_storageaccount.NetworkRulesProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.NetworkRulesProps.property.defaultAction">defaultAction</a></code> | <code>string</code> | The default action of the network rule set. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.NetworkRulesProps.property.bypass">bypass</a></code> | <code>string[]</code> | Specifies which traffic to bypass from the network rules. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.NetworkRulesProps.property.ipRules">ipRules</a></code> | <code>string[]</code> | An array of IP rules to allow access to the storage account. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.NetworkRulesProps.property.privateLinkAccess">privateLinkAccess</a></code> | <code>@cdktf/provider-azurerm.storageAccountNetworkRules.StorageAccountNetworkRulesPrivateLinkAccessA[]</code> | An array of objects representing the private link access settings. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_storageaccount.NetworkRulesProps.property.virtualNetworkSubnetIds">virtualNetworkSubnetIds</a></code> | <code>string[]</code> | An array of virtual network subnet IDs that are allowed to access the storage account. |

---

##### `defaultAction`<sup>Required</sup> <a name="defaultAction" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.NetworkRulesProps.property.defaultAction"></a>

```typescript
public readonly defaultAction: string;
```

- *Type:* string

The default action of the network rule set.

Options are 'Allow' or 'Deny'. Set to 'Deny' to enable network rules and restrict
access to the storage account. 'Allow' permits access by default.

---

##### `bypass`<sup>Optional</sup> <a name="bypass" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.NetworkRulesProps.property.bypass"></a>

```typescript
public readonly bypass: string[];
```

- *Type:* string[]

Specifies which traffic to bypass from the network rules.

The possible values are 'AzureServices', 'Logging', 'Metrics',
and 'None'. Bypassing 'AzureServices' enables Azure's internal services to access the storage account.

---

##### `ipRules`<sup>Optional</sup> <a name="ipRules" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.NetworkRulesProps.property.ipRules"></a>

```typescript
public readonly ipRules: string[];
```

- *Type:* string[]

An array of IP rules to allow access to the storage account.

These are specified as CIDR ranges.
Example: ['1.2.3.4/32', '5.6.7.0/24'] to allow specific IPs/subnets.

---

##### `privateLinkAccess`<sup>Optional</sup> <a name="privateLinkAccess" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.NetworkRulesProps.property.privateLinkAccess"></a>

```typescript
public readonly privateLinkAccess: StorageAccountNetworkRulesPrivateLinkAccessA[];
```

- *Type:* @cdktf/provider-azurerm.storageAccountNetworkRules.StorageAccountNetworkRulesPrivateLinkAccessA[]

An array of objects representing the private link access settings.

Each object in the array defines the sub-resource name
(e.g., 'blob', 'file') and its respective private endpoint connections for the storage account.

---

##### `virtualNetworkSubnetIds`<sup>Optional</sup> <a name="virtualNetworkSubnetIds" id="@microsoft/terraform-cdk-constructs.azure_storageaccount.NetworkRulesProps.property.virtualNetworkSubnetIds"></a>

```typescript
public readonly virtualNetworkSubnetIds: string[];
```

- *Type:* string[]

An array of virtual network subnet IDs that are allowed to access the storage account.

This enables you to secure the storage
account to a specific virtual network and subnet within Azure.

---

### PeerProps <a name="PeerProps" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerProps"></a>

Interface defining the properties for virtual network peerings.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerProps.Initializer"></a>

```typescript
import { azure_virtualnetwork } from '@microsoft/terraform-cdk-constructs'

const peerProps: azure_virtualnetwork.PeerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerProps.property.remoteVirtualNetwork">remoteVirtualNetwork</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network</code> | ID of the remote virtual network. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerProps.property.virtualNetwork">virtualNetwork</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network</code> | ID of the local virtual network. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerProps.property.localToRemoteSettings">localToRemoteSettings</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings</code> | Settings applied from the local virtual network to the remote virtual network. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerProps.property.remoteToLocalSettings">remoteToLocalSettings</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings</code> | Settings applied from the remote virtual network to the local virtual network. |

---

##### `remoteVirtualNetwork`<sup>Required</sup> <a name="remoteVirtualNetwork" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerProps.property.remoteVirtualNetwork"></a>

```typescript
public readonly remoteVirtualNetwork: Network;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network

ID of the remote virtual network.

---

##### `virtualNetwork`<sup>Required</sup> <a name="virtualNetwork" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerProps.property.virtualNetwork"></a>

```typescript
public readonly virtualNetwork: Network;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualnetwork.Network

ID of the local virtual network.

---

##### `localToRemoteSettings`<sup>Optional</sup> <a name="localToRemoteSettings" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerProps.property.localToRemoteSettings"></a>

```typescript
public readonly localToRemoteSettings: PeerSettings;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings

Settings applied from the local virtual network to the remote virtual network.

---

##### `remoteToLocalSettings`<sup>Optional</sup> <a name="remoteToLocalSettings" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerProps.property.remoteToLocalSettings"></a>

```typescript
public readonly remoteToLocalSettings: PeerSettings;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings

Settings applied from the remote virtual network to the local virtual network.

---

### PeerSettings <a name="PeerSettings" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings"></a>

Interface defining the settings for peer connections.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings.Initializer"></a>

```typescript
import { azure_virtualnetwork } from '@microsoft/terraform-cdk-constructs'

const peerSettings: azure_virtualnetwork.PeerSettings = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings.property.allowForwardedTraffic">allowForwardedTraffic</a></code> | <code>boolean</code> | Indicates whether forwarded traffic is allowed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings.property.allowGatewayTransit">allowGatewayTransit</a></code> | <code>boolean</code> | Indicates whether gateway transit is allowed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings.property.allowVirtualNetworkAccess">allowVirtualNetworkAccess</a></code> | <code>boolean</code> | Indicates whether virtual network access is allowed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings.property.useRemoteGateways">useRemoteGateways</a></code> | <code>boolean</code> | Indicates whether to use remote gateways. |

---

##### `allowForwardedTraffic`<sup>Optional</sup> <a name="allowForwardedTraffic" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings.property.allowForwardedTraffic"></a>

```typescript
public readonly allowForwardedTraffic: boolean;
```

- *Type:* boolean
- *Default:* false

Indicates whether forwarded traffic is allowed.

---

##### `allowGatewayTransit`<sup>Optional</sup> <a name="allowGatewayTransit" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings.property.allowGatewayTransit"></a>

```typescript
public readonly allowGatewayTransit: boolean;
```

- *Type:* boolean
- *Default:* false

Indicates whether gateway transit is allowed.

---

##### `allowVirtualNetworkAccess`<sup>Optional</sup> <a name="allowVirtualNetworkAccess" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings.property.allowVirtualNetworkAccess"></a>

```typescript
public readonly allowVirtualNetworkAccess: boolean;
```

- *Type:* boolean
- *Default:* true

Indicates whether virtual network access is allowed.

---

##### `useRemoteGateways`<sup>Optional</sup> <a name="useRemoteGateways" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.PeerSettings.property.useRemoteGateways"></a>

```typescript
public readonly useRemoteGateways: boolean;
```

- *Type:* boolean
- *Default:* false

Indicates whether to use remote gateways.

---

### Queries <a name="Queries" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Queries"></a>

Properties for defining a saved query in a Log Analytics Workspace.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Queries.Initializer"></a>

```typescript
import { azure_loganalytics } from '@microsoft/terraform-cdk-constructs'

const queries: azure_loganalytics.Queries = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Queries.property.category">category</a></code> | <code>string</code> | The category of the saved query. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Queries.property.displayName">displayName</a></code> | <code>string</code> | The display name for the saved query. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Queries.property.name">name</a></code> | <code>string</code> | The name of the saved query. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.Queries.property.query">query</a></code> | <code>string</code> | The query string. |

---

##### `category`<sup>Required</sup> <a name="category" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Queries.property.category"></a>

```typescript
public readonly category: string;
```

- *Type:* string

The category of the saved query.

---

##### `displayName`<sup>Required</sup> <a name="displayName" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Queries.property.displayName"></a>

```typescript
public readonly displayName: string;
```

- *Type:* string

The display name for the saved query.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Queries.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the saved query.

---

##### `query`<sup>Required</sup> <a name="query" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.Queries.property.query"></a>

```typescript
public readonly query: string;
```

- *Type:* string

The query string.

---

### RbacProps <a name="RbacProps" id="@microsoft/terraform-cdk-constructs.core_azure.RbacProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.core_azure.RbacProps.Initializer"></a>

```typescript
import { core_azure } from '@microsoft/terraform-cdk-constructs'

const rbacProps: core_azure.RbacProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.RbacProps.property.objectId">objectId</a></code> | <code>string</code> | The unique identifier for objects in Azure AD, such as users, groups, or service principals. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.RbacProps.property.roleDefinitionName">roleDefinitionName</a></code> | <code>string</code> | The human-readable name of the Azure RBAC role, e.g., "Virtual Machine Contributor". |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.RbacProps.property.scope">scope</a></code> | <code>string</code> | The scope at which the RBAC role assignment is applied. |
| <code><a href="#@microsoft/terraform-cdk-constructs.core_azure.RbacProps.property.roleDefinitionUUID">roleDefinitionUUID</a></code> | <code>string</code> | The universally unique identifier (UUID) for the Azure RBAC role definition. |

---

##### `objectId`<sup>Required</sup> <a name="objectId" id="@microsoft/terraform-cdk-constructs.core_azure.RbacProps.property.objectId"></a>

```typescript
public readonly objectId: string;
```

- *Type:* string

The unique identifier for objects in Azure AD, such as users, groups, or service principals.

---

##### `roleDefinitionName`<sup>Required</sup> <a name="roleDefinitionName" id="@microsoft/terraform-cdk-constructs.core_azure.RbacProps.property.roleDefinitionName"></a>

```typescript
public readonly roleDefinitionName: string;
```

- *Type:* string

The human-readable name of the Azure RBAC role, e.g., "Virtual Machine Contributor".

---

##### `scope`<sup>Required</sup> <a name="scope" id="@microsoft/terraform-cdk-constructs.core_azure.RbacProps.property.scope"></a>

```typescript
public readonly scope: string;
```

- *Type:* string

The scope at which the RBAC role assignment is applied.

This could be a subscription, resource group, or a specific resource.

---

##### `roleDefinitionUUID`<sup>Optional</sup> <a name="roleDefinitionUUID" id="@microsoft/terraform-cdk-constructs.core_azure.RbacProps.property.roleDefinitionUUID"></a>

```typescript
public readonly roleDefinitionUUID: string;
```

- *Type:* string

The universally unique identifier (UUID) for the Azure RBAC role definition.

To find the UUID for a role using Azure CLI, use the command:
`az role definition list --name "Role Name" --query "[].name" -o tsv`

---

### RegistryProps <a name="RegistryProps" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.Initializer"></a>

```typescript
import { azure_containerregistry } from '@microsoft/terraform-cdk-constructs'

const registryProps: azure_containerregistry.RegistryProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.location">location</a></code> | <code>string</code> | The Azure Region to deploy. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.name">name</a></code> | <code>string</code> | The name of the Log Analytics Workspace. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the Azure Resource Group. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.adminEnabled">adminEnabled</a></code> | <code>boolean</code> | Create enable Admin user. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.geoReplicationLocations">geoReplicationLocations</a></code> | <code>any</code> | Specify the locations to configure replication. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.sku">sku</a></code> | <code>string</code> | The SKU of the Log Analytics Workspace. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | The tags to assign to the Resource Group. |

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The Azure Region to deploy.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Log Analytics Workspace.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the Azure Resource Group.

---

##### `adminEnabled`<sup>Optional</sup> <a name="adminEnabled" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.adminEnabled"></a>

```typescript
public readonly adminEnabled: boolean;
```

- *Type:* boolean

Create enable Admin user.

---

##### `geoReplicationLocations`<sup>Optional</sup> <a name="geoReplicationLocations" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.geoReplicationLocations"></a>

```typescript
public readonly geoReplicationLocations: any;
```

- *Type:* any

Specify the locations to configure replication.

---

##### `sku`<sup>Optional</sup> <a name="sku" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.sku"></a>

```typescript
public readonly sku: string;
```

- *Type:* string

The SKU of the Log Analytics Workspace.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_containerregistry.RegistryProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

The tags to assign to the Resource Group.

---

### RuleConfig <a name="RuleConfig" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig"></a>

Configuration properties for defining a rule within an Azure Network Security Group.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.Initializer"></a>

```typescript
import { azure_networksecuritygroup } from '@microsoft/terraform-cdk-constructs'

const ruleConfig: azure_networksecuritygroup.RuleConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.access">access</a></code> | <code>string</code> | The access type of the rule, which determines whether the rule permits or denies traffic. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.destinationAddressPrefix">destinationAddressPrefix</a></code> | <code>string</code> | The CIDR or destination IP range or '*' to match any IP. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.destinationPortRange">destinationPortRange</a></code> | <code>string</code> | The range of destination ports to which the rule applies. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.direction">direction</a></code> | <code>string</code> | The direction of the rule, which can be 'Inbound' or 'Outbound'. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.name">name</a></code> | <code>string</code> | The name of the security rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.priority">priority</a></code> | <code>number</code> | The priority of the rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.protocol">protocol</a></code> | <code>string</code> | The protocol to which the rule applies, such as 'Tcp', 'Udp', or '*' (for all protocols). |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.sourceAddressPrefix">sourceAddressPrefix</a></code> | <code>string</code> | The CIDR or source IP range or '*' to match any IP. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.sourcePortRange">sourcePortRange</a></code> | <code>string</code> | The range of source ports to which the rule applies. |

---

##### `access`<sup>Required</sup> <a name="access" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.access"></a>

```typescript
public readonly access: string;
```

- *Type:* string

The access type of the rule, which determines whether the rule permits or denies traffic.

Common values are 'Allow' or 'Deny'.

---

##### `destinationAddressPrefix`<sup>Required</sup> <a name="destinationAddressPrefix" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.destinationAddressPrefix"></a>

```typescript
public readonly destinationAddressPrefix: string;
```

- *Type:* string

The CIDR or destination IP range or '*' to match any IP.

This specifies the range of destination IPs for which the rule is applicable.

---

##### `destinationPortRange`<sup>Required</sup> <a name="destinationPortRange" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.destinationPortRange"></a>

```typescript
public readonly destinationPortRange: string;
```

- *Type:* string

The range of destination ports to which the rule applies.

Can also be a single port or a range.

---

##### `direction`<sup>Required</sup> <a name="direction" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.direction"></a>

```typescript
public readonly direction: string;
```

- *Type:* string

The direction of the rule, which can be 'Inbound' or 'Outbound'.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the security rule.

---

##### `priority`<sup>Required</sup> <a name="priority" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.priority"></a>

```typescript
public readonly priority: number;
```

- *Type:* number

The priority of the rule.

Lower numbers have higher priority. Allowed values are from 100 to 4096.

---

##### `protocol`<sup>Required</sup> <a name="protocol" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.protocol"></a>

```typescript
public readonly protocol: string;
```

- *Type:* string

The protocol to which the rule applies, such as 'Tcp', 'Udp', or '*' (for all protocols).

---

##### `sourceAddressPrefix`<sup>Required</sup> <a name="sourceAddressPrefix" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.sourceAddressPrefix"></a>

```typescript
public readonly sourceAddressPrefix: string;
```

- *Type:* string

The CIDR or source IP range or '*' to match any IP.

This is the range of source IPs for which the rule applies.

---

##### `sourcePortRange`<sup>Required</sup> <a name="sourcePortRange" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig.property.sourcePortRange"></a>

```typescript
public readonly sourcePortRange: string;
```

- *Type:* string

The range of source ports to which the rule applies.

Can be a single port or a range like '1024-2048'.

---

### RuleOverrides <a name="RuleOverrides" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleOverrides"></a>

Properties for defining overrides for a rule in an Azure Network Security Group.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleOverrides.Initializer"></a>

```typescript
import { azure_networksecuritygroup } from '@microsoft/terraform-cdk-constructs'

const ruleOverrides: azure_networksecuritygroup.RuleOverrides = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleOverrides.property.destinationAddressPrefix">destinationAddressPrefix</a></code> | <code>string</code> | Optional destination address prefix to be matched for the rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleOverrides.property.priority">priority</a></code> | <code>number</code> | Optional priority for the rule. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleOverrides.property.sourceAddressPrefix">sourceAddressPrefix</a></code> | <code>string</code> | Optional source address prefix to be matched for the rule. |

---

##### `destinationAddressPrefix`<sup>Optional</sup> <a name="destinationAddressPrefix" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleOverrides.property.destinationAddressPrefix"></a>

```typescript
public readonly destinationAddressPrefix: string;
```

- *Type:* string

Optional destination address prefix to be matched for the rule.

Similar to the source address prefix,
this can be a specific IP address or a range. If not provided, it defaults to matching any destination address.

---

##### `priority`<sup>Optional</sup> <a name="priority" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleOverrides.property.priority"></a>

```typescript
public readonly priority: number;
```

- *Type:* number

Optional priority for the rule.

Rules are processed in the order of their priority,
with lower numbers processed before higher numbers. If not provided, a default priority will be assigned.

---

##### `sourceAddressPrefix`<sup>Optional</sup> <a name="sourceAddressPrefix" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleOverrides.property.sourceAddressPrefix"></a>

```typescript
public readonly sourceAddressPrefix: string;
```

- *Type:* string

Optional source address prefix to be matched for the rule.

This can be an IP address or a range of IP addresses.
If not specified, the default behavior is to match any source address.

---

### SecretProps <a name="SecretProps" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps"></a>

Properties for defining an Azure Key Vault Secret.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps.Initializer"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

const secretProps: azure_keyvault.SecretProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps.property.accessPolicies">accessPolicies</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy[]</code> | A list of access policies that dictate which identities have what kind of access to the secret. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps.property.keyVaultId">keyVaultId</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.Vault</code> | The Key Vault instance where the secret will be stored. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps.property.name">name</a></code> | <code>string</code> | The name of the secret. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps.property.value">value</a></code> | <code>string</code> | The value of the secret. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps.property.contentType">contentType</a></code> | <code>string</code> | Optional content type for the secret. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps.property.expirationDate">expirationDate</a></code> | <code>string</code> | Optional expiration date for the secret. |

---

##### `accessPolicies`<sup>Required</sup> <a name="accessPolicies" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps.property.accessPolicies"></a>

```typescript
public readonly accessPolicies: AccessPolicy[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy[]

A list of access policies that dictate which identities have what kind of access to the secret.

Each policy should detail the permissions and the identity it applies to.

---

##### `keyVaultId`<sup>Required</sup> <a name="keyVaultId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps.property.keyVaultId"></a>

```typescript
public readonly keyVaultId: Vault;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.Vault

The Key Vault instance where the secret will be stored.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the secret.

This name should be unique within the Key Vault instance.

---

##### `value`<sup>Required</sup> <a name="value" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps.property.value"></a>

```typescript
public readonly value: string;
```

- *Type:* string

The value of the secret.

This could be any string, including tokens or passwords.

---

##### `contentType`<sup>Optional</sup> <a name="contentType" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps.property.contentType"></a>

```typescript
public readonly contentType: string;
```

- *Type:* string

Optional content type for the secret.

This can be used to describe the type of information
the secret contains, or how it can be used.

---

##### `expirationDate`<sup>Optional</sup> <a name="expirationDate" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SecretProps.property.expirationDate"></a>

```typescript
public readonly expirationDate: string;
```

- *Type:* string

Optional expiration date for the secret.

This should be in an appropriate date string format.
If provided, the secret will become invalid after this date.

---

### SecurityGroupAssociationsProps <a name="SecurityGroupAssociationsProps" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociationsProps"></a>

Properties for associating Azure Network Security Groups with subnets and network interfaces.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociationsProps.Initializer"></a>

```typescript
import { azure_networksecuritygroup } from '@microsoft/terraform-cdk-constructs'

const securityGroupAssociationsProps: azure_networksecuritygroup.SecurityGroupAssociationsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociationsProps.property.networkSecurityGroupId">networkSecurityGroupId</a></code> | <code>string</code> | The ID of the network security group to be associated. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociationsProps.property.networkInterfaceId">networkInterfaceId</a></code> | <code>string</code> | Optional network interface ID to associate with the network security group. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociationsProps.property.subnetId">subnetId</a></code> | <code>string</code> | Optional subnet ID to associate with the network security group. |

---

##### `networkSecurityGroupId`<sup>Required</sup> <a name="networkSecurityGroupId" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociationsProps.property.networkSecurityGroupId"></a>

```typescript
public readonly networkSecurityGroupId: string;
```

- *Type:* string

The ID of the network security group to be associated.

---

##### `networkInterfaceId`<sup>Optional</sup> <a name="networkInterfaceId" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociationsProps.property.networkInterfaceId"></a>

```typescript
public readonly networkInterfaceId: string;
```

- *Type:* string

Optional network interface ID to associate with the network security group.

If provided, the security group will be associated with this network interface.

---

##### `subnetId`<sup>Optional</sup> <a name="subnetId" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupAssociationsProps.property.subnetId"></a>

```typescript
public readonly subnetId: string;
```

- *Type:* string

Optional subnet ID to associate with the network security group.

If provided, the security group will be associated with this subnet.

---

### SecurityGroupProps <a name="SecurityGroupProps" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps"></a>

Properties for defining an Azure Network Security Group.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps.Initializer"></a>

```typescript
import { azure_networksecuritygroup } from '@microsoft/terraform-cdk-constructs'

const securityGroupProps: azure_networksecuritygroup.SecurityGroupProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps.property.location">location</a></code> | <code>string</code> | The Azure region in which to create the network security group, e.g., 'East US', 'West Europe'. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps.property.name">name</a></code> | <code>string</code> | The name of the network security group. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the resource group under which the network security group will be created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps.property.rules">rules</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig[]</code> | An array of rule configurations to be applied to the network security group. |

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The Azure region in which to create the network security group, e.g., 'East US', 'West Europe'.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the network security group.

Must be unique within the resource group.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the resource group under which the network security group will be created.

---

##### `rules`<sup>Required</sup> <a name="rules" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.SecurityGroupProps.property.rules"></a>

```typescript
public readonly rules: RuleConfig[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig[]

An array of rule configurations to be applied to the network security group.

---

### SelfSignedCertificateProps <a name="SelfSignedCertificateProps" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.Initializer"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

const selfSignedCertificateProps: azure_keyvault.SelfSignedCertificateProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.accessPolicies">accessPolicies</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy[]</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.dnsNames">dnsNames</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.keyVaultId">keyVaultId</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_keyvault.Vault</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.name">name</a></code> | <code>string</code> | The name of the certificate in the Azure Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.subject">subject</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.actionType">actionType</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.daysBeforeExpiry">daysBeforeExpiry</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |

---

##### `accessPolicies`<sup>Required</sup> <a name="accessPolicies" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.accessPolicies"></a>

```typescript
public readonly accessPolicies: AccessPolicy[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.AccessPolicy[]

---

##### `dnsNames`<sup>Required</sup> <a name="dnsNames" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.dnsNames"></a>

```typescript
public readonly dnsNames: string[];
```

- *Type:* string[]

---

##### `keyVaultId`<sup>Required</sup> <a name="keyVaultId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.keyVaultId"></a>

```typescript
public readonly keyVaultId: Vault;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_keyvault.Vault

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the certificate in the Azure Key Vault.

---

##### `subject`<sup>Required</sup> <a name="subject" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.subject"></a>

```typescript
public readonly subject: string;
```

- *Type:* string

---

##### `actionType`<sup>Optional</sup> <a name="actionType" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.actionType"></a>

```typescript
public readonly actionType: string;
```

- *Type:* string

---

##### `daysBeforeExpiry`<sup>Optional</sup> <a name="daysBeforeExpiry" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.daysBeforeExpiry"></a>

```typescript
public readonly daysBeforeExpiry: number;
```

- *Type:* number

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_keyvault.SelfSignedCertificateProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

### SubnetConfig <a name="SubnetConfig" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.SubnetConfig"></a>

Configuration properties for defining a subnet within an Azure Virtual Network.

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.SubnetConfig.Initializer"></a>

```typescript
import { azure_virtualnetwork } from '@microsoft/terraform-cdk-constructs'

const subnetConfig: azure_virtualnetwork.SubnetConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.SubnetConfig.property.addressPrefixes">addressPrefixes</a></code> | <code>string[]</code> | A list of address prefixes for the subnet. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualnetwork.SubnetConfig.property.name">name</a></code> | <code>string</code> | The name of the subnet. |

---

##### `addressPrefixes`<sup>Required</sup> <a name="addressPrefixes" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.SubnetConfig.property.addressPrefixes"></a>

```typescript
public readonly addressPrefixes: string[];
```

- *Type:* string[]

A list of address prefixes for the subnet.

These are expressed in CIDR notation.
For example, '192.168.1.0/24' to define a subnet with a range of IP addresses.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_virtualnetwork.SubnetConfig.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the subnet.

This name must be unique within the context of the virtual network.

---

### TableSchemaProps <a name="TableSchemaProps" id="@microsoft/terraform-cdk-constructs.azure_kusto.TableSchemaProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_kusto.TableSchemaProps.Initializer"></a>

```typescript
import { azure_kusto } from '@microsoft/terraform-cdk-constructs'

const tableSchemaProps: azure_kusto.TableSchemaProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.TableSchemaProps.property.columnName">columnName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.TableSchemaProps.property.columnType">columnType</a></code> | <code>string</code> | *No description.* |

---

##### `columnName`<sup>Required</sup> <a name="columnName" id="@microsoft/terraform-cdk-constructs.azure_kusto.TableSchemaProps.property.columnName"></a>

```typescript
public readonly columnName: string;
```

- *Type:* string

---

##### `columnType`<sup>Required</sup> <a name="columnType" id="@microsoft/terraform-cdk-constructs.azure_kusto.TableSchemaProps.property.columnType"></a>

```typescript
public readonly columnType: string;
```

- *Type:* string

---

### VaultProps <a name="VaultProps" id="@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.Initializer"></a>

```typescript
import { azure_keyvault } from '@microsoft/terraform-cdk-constructs'

const vaultProps: azure_keyvault.VaultProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.location">location</a></code> | <code>string</code> | The Azure Region to deploy the Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.name">name</a></code> | <code>string</code> | The name of the Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the Azure Resource Group. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.tenantId">tenantId</a></code> | <code>string</code> | The Name of the SKU used for this Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.networkAcls">networkAcls</a></code> | <code>@cdktf/provider-azurerm.keyVault.KeyVaultNetworkAcls</code> | The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.purgeProtection">purgeProtection</a></code> | <code>boolean</code> | A map of IP network ACL rules. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.sku">sku</a></code> | <code>string</code> | The tags to assign to the Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.softDeleteRetentionDays">softDeleteRetentionDays</a></code> | <code>number</code> | Specifies whether protection against purge is enabled for this Key Vault. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | The tags to assign to the Key Vault. |

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The Azure Region to deploy the Key Vault.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Key Vault.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the Azure Resource Group.

---

##### `tenantId`<sup>Required</sup> <a name="tenantId" id="@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.tenantId"></a>

```typescript
public readonly tenantId: string;
```

- *Type:* string

The Name of the SKU used for this Key Vault.

Possible values are standard and premium.

---

##### `networkAcls`<sup>Optional</sup> <a name="networkAcls" id="@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.networkAcls"></a>

```typescript
public readonly networkAcls: KeyVaultNetworkAcls;
```

- *Type:* @cdktf/provider-azurerm.keyVault.KeyVaultNetworkAcls

The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault.

---

##### `purgeProtection`<sup>Optional</sup> <a name="purgeProtection" id="@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.purgeProtection"></a>

```typescript
public readonly purgeProtection: boolean;
```

- *Type:* boolean

A map of IP network ACL rules.

The key is the IP or IP range in CIDR notation.
The value is a description of that IP range.

---

##### `sku`<sup>Optional</sup> <a name="sku" id="@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.sku"></a>

```typescript
public readonly sku: string;
```

- *Type:* string

The tags to assign to the Key Vault.

---

##### `softDeleteRetentionDays`<sup>Optional</sup> <a name="softDeleteRetentionDays" id="@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.softDeleteRetentionDays"></a>

```typescript
public readonly softDeleteRetentionDays: number;
```

- *Type:* number

Specifies whether protection against purge is enabled for this Key Vault.

Setting this property to true activates protection against deletion of any active key, secret or certificate in the vault. The setting is effective only if soft delete is also enabled. The default value is false.
Once activated, the property cannot be reverted to false.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_keyvault.VaultProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

The tags to assign to the Key Vault.

---

### WindowsClusterProps <a name="WindowsClusterProps" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.Initializer"></a>

```typescript
import { azure_virtualmachinescaleset } from '@microsoft/terraform-cdk-constructs'

const windowsClusterProps: azure_virtualmachinescaleset.WindowsClusterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.adminPassword">adminPassword</a></code> | <code>string</code> | The admin password for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.adminUsername">adminUsername</a></code> | <code>string</code> | The admin username for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the resource group in which the virtual machine will be created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.boostrapCustomData">boostrapCustomData</a></code> | <code>string</code> | Custom data to bootstrap the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.bootDiagnosticsStorageURI">bootDiagnosticsStorageURI</a></code> | <code>string</code> | Bootdiagnostics settings for the VM. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.customData">customData</a></code> | <code>string</code> | Custom data to pass to the virtual machine upon creation. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.instances">instances</a></code> | <code>number</code> | The number of VM instances in the scale set. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.location">location</a></code> | <code>string</code> | The Azure location where the virtual machine should be created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.name">name</a></code> | <code>string</code> | The name of the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.osDisk">osDisk</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineOsDisk</code> | The OS disk configuration for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.overprovision">overprovision</a></code> | <code>boolean</code> | Specifies if the VMSS should be overprovisioned. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.publicIPAddress">publicIPAddress</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachineScaleSet.WindowsVirtualMachineScaleSetNetworkInterfaceIpConfigurationPublicIpAddress[]</code> | The allocation method for the public IP. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.scaleInPolicy">scaleInPolicy</a></code> | <code>string</code> | Specifies the scale-in policy for the VMSS. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.sku">sku</a></code> | <code>string</code> | The size of the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.sourceImageId">sourceImageId</a></code> | <code>string</code> | The ID of the source image for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.sourceImageReference">sourceImageReference</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference</code> | The source image reference for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.subnet">subnet</a></code> | <code>@cdktf/provider-azurerm.subnet.Subnet</code> | The subnet in which the virtual machine will be placed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Tags to apply to the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.upgradePolicyMode">upgradePolicyMode</a></code> | <code>string</code> | Specifies the scale set's upgrade policy settings. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.zones">zones</a></code> | <code>string[]</code> | The availability zone(s) in which the VMs should be placed. |

---

##### `adminPassword`<sup>Required</sup> <a name="adminPassword" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.adminPassword"></a>

```typescript
public readonly adminPassword: string;
```

- *Type:* string

The admin password for the virtual machine.

---

##### `adminUsername`<sup>Required</sup> <a name="adminUsername" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.adminUsername"></a>

```typescript
public readonly adminUsername: string;
```

- *Type:* string

The admin username for the virtual machine.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the resource group in which the virtual machine will be created.

---

##### `boostrapCustomData`<sup>Optional</sup> <a name="boostrapCustomData" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.boostrapCustomData"></a>

```typescript
public readonly boostrapCustomData: string;
```

- *Type:* string

Custom data to bootstrap the virtual machine.

Automatically triggers Azure Custom Script extension to deploy code in custom data.

---

##### `bootDiagnosticsStorageURI`<sup>Optional</sup> <a name="bootDiagnosticsStorageURI" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.bootDiagnosticsStorageURI"></a>

```typescript
public readonly bootDiagnosticsStorageURI: string;
```

- *Type:* string

Bootdiagnostics settings for the VM.

---

##### `customData`<sup>Optional</sup> <a name="customData" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.customData"></a>

```typescript
public readonly customData: string;
```

- *Type:* string

Custom data to pass to the virtual machine upon creation.

---

##### `instances`<sup>Optional</sup> <a name="instances" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.instances"></a>

```typescript
public readonly instances: number;
```

- *Type:* number
- *Default:* 2

The number of VM instances in the scale set.

---

##### `location`<sup>Optional</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string
- *Default:* "eastus"

The Azure location where the virtual machine should be created.

---

##### `name`<sup>Optional</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* Uses the name derived from the construct path.

The name of the virtual machine.

---

##### `osDisk`<sup>Optional</sup> <a name="osDisk" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.osDisk"></a>

```typescript
public readonly osDisk: WindowsVirtualMachineOsDisk;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineOsDisk
- *Default:* Uses a disk with caching set to "ReadWrite" and storage account type "Standard_LRS".

The OS disk configuration for the virtual machine.

---

##### `overprovision`<sup>Optional</sup> <a name="overprovision" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.overprovision"></a>

```typescript
public readonly overprovision: boolean;
```

- *Type:* boolean
- *Default:* true

Specifies if the VMSS should be overprovisioned.

---

##### `publicIPAddress`<sup>Optional</sup> <a name="publicIPAddress" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.publicIPAddress"></a>

```typescript
public readonly publicIPAddress: WindowsVirtualMachineScaleSetNetworkInterfaceIpConfigurationPublicIpAddress[];
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachineScaleSet.WindowsVirtualMachineScaleSetNetworkInterfaceIpConfigurationPublicIpAddress[]

The allocation method for the public IP.

---

##### `scaleInPolicy`<sup>Optional</sup> <a name="scaleInPolicy" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.scaleInPolicy"></a>

```typescript
public readonly scaleInPolicy: string;
```

- *Type:* string

Specifies the scale-in policy for the VMSS.

---

##### `sku`<sup>Optional</sup> <a name="sku" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.sku"></a>

```typescript
public readonly sku: string;
```

- *Type:* string
- *Default:* "Standard_B2s"

The size of the virtual machine.

---

##### `sourceImageId`<sup>Optional</sup> <a name="sourceImageId" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.sourceImageId"></a>

```typescript
public readonly sourceImageId: string;
```

- *Type:* string

The ID of the source image for the virtual machine.

---

##### `sourceImageReference`<sup>Optional</sup> <a name="sourceImageReference" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.sourceImageReference"></a>

```typescript
public readonly sourceImageReference: WindowsVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference
- *Default:* Uses WindowsServer2022DatacenterCore.

The source image reference for the virtual machine.

---

##### `subnet`<sup>Optional</sup> <a name="subnet" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.subnet"></a>

```typescript
public readonly subnet: Subnet;
```

- *Type:* @cdktf/provider-azurerm.subnet.Subnet
- *Default:* Uses the default subnet from a new virtual network.

The subnet in which the virtual machine will be placed.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Tags to apply to the virtual machine.

---

##### `upgradePolicyMode`<sup>Optional</sup> <a name="upgradePolicyMode" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.upgradePolicyMode"></a>

```typescript
public readonly upgradePolicyMode: string;
```

- *Type:* string

Specifies the scale set's upgrade policy settings.

---

##### `zones`<sup>Optional</sup> <a name="zones" id="@microsoft/terraform-cdk-constructs.azure_virtualmachinescaleset.WindowsClusterProps.property.zones"></a>

```typescript
public readonly zones: string[];
```

- *Type:* string[]

The availability zone(s) in which the VMs should be placed.

---

### WindowsVMProps <a name="WindowsVMProps" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.Initializer"></a>

```typescript
import { azure_virtualmachine } from '@microsoft/terraform-cdk-constructs'

const windowsVMProps: azure_virtualmachine.WindowsVMProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.adminPassword">adminPassword</a></code> | <code>string</code> | The admin password for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.adminUsername">adminUsername</a></code> | <code>string</code> | The admin username for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the resource group in which the virtual machine will be created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.boostrapCustomData">boostrapCustomData</a></code> | <code>string</code> | Custom data to bootstrap the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.bootDiagnosticsStorageURI">bootDiagnosticsStorageURI</a></code> | <code>string</code> | Bootdiagnostics settings for the VM. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.customData">customData</a></code> | <code>string</code> | Custom data to pass to the virtual machine upon creation. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.location">location</a></code> | <code>string</code> | The Azure location where the virtual machine should be created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.name">name</a></code> | <code>string</code> | The name of the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.osDisk">osDisk</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineOsDisk</code> | The OS disk configuration for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.publicIPAllocationMethod">publicIPAllocationMethod</a></code> | <code>string</code> | The allocation method for the public IP. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.size">size</a></code> | <code>string</code> | The size of the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.sourceImageId">sourceImageId</a></code> | <code>string</code> | The ID of the source image for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.sourceImageReference">sourceImageReference</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference</code> | The source image reference for the virtual machine. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.subnet">subnet</a></code> | <code>@cdktf/provider-azurerm.subnet.Subnet</code> | The subnet in which the virtual machine will be placed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Tags to apply to the virtual machine. |

---

##### `adminPassword`<sup>Required</sup> <a name="adminPassword" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.adminPassword"></a>

```typescript
public readonly adminPassword: string;
```

- *Type:* string

The admin password for the virtual machine.

---

##### `adminUsername`<sup>Required</sup> <a name="adminUsername" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.adminUsername"></a>

```typescript
public readonly adminUsername: string;
```

- *Type:* string

The admin username for the virtual machine.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the resource group in which the virtual machine will be created.

---

##### `boostrapCustomData`<sup>Optional</sup> <a name="boostrapCustomData" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.boostrapCustomData"></a>

```typescript
public readonly boostrapCustomData: string;
```

- *Type:* string

Custom data to bootstrap the virtual machine.

Automatically triggers Azure Custom Script extension to deploy code in custom data.

---

##### `bootDiagnosticsStorageURI`<sup>Optional</sup> <a name="bootDiagnosticsStorageURI" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.bootDiagnosticsStorageURI"></a>

```typescript
public readonly bootDiagnosticsStorageURI: string;
```

- *Type:* string

Bootdiagnostics settings for the VM.

---

##### `customData`<sup>Optional</sup> <a name="customData" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.customData"></a>

```typescript
public readonly customData: string;
```

- *Type:* string

Custom data to pass to the virtual machine upon creation.

---

##### `location`<sup>Optional</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string
- *Default:* "eastus"

The Azure location where the virtual machine should be created.

---

##### `name`<sup>Optional</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* Uses the name derived from the construct path.

The name of the virtual machine.

---

##### `osDisk`<sup>Optional</sup> <a name="osDisk" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.osDisk"></a>

```typescript
public readonly osDisk: WindowsVirtualMachineOsDisk;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineOsDisk
- *Default:* Uses a disk with caching set to "ReadWrite" and storage account type "Standard_LRS".

The OS disk configuration for the virtual machine.

---

##### `publicIPAllocationMethod`<sup>Optional</sup> <a name="publicIPAllocationMethod" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.publicIPAllocationMethod"></a>

```typescript
public readonly publicIPAllocationMethod: string;
```

- *Type:* string

The allocation method for the public IP.

---

##### `size`<sup>Optional</sup> <a name="size" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.size"></a>

```typescript
public readonly size: string;
```

- *Type:* string
- *Default:* "Standard_B2s"

The size of the virtual machine.

---

##### `sourceImageId`<sup>Optional</sup> <a name="sourceImageId" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.sourceImageId"></a>

```typescript
public readonly sourceImageId: string;
```

- *Type:* string

The ID of the source image for the virtual machine.

---

##### `sourceImageReference`<sup>Optional</sup> <a name="sourceImageReference" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.sourceImageReference"></a>

```typescript
public readonly sourceImageReference: WindowsVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference
- *Default:* Uses WindowsServer2022DatacenterCore.

The source image reference for the virtual machine.

---

##### `subnet`<sup>Optional</sup> <a name="subnet" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.subnet"></a>

```typescript
public readonly subnet: Subnet;
```

- *Type:* @cdktf/provider-azurerm.subnet.Subnet
- *Default:* Uses the default subnet from a new virtual network.

The subnet in which the virtual machine will be placed.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsVMProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Tags to apply to the virtual machine.

---

### WorkspaceProps <a name="WorkspaceProps" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps"></a>

#### Initializer <a name="Initializer" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.Initializer"></a>

```typescript
import { azure_loganalytics } from '@microsoft/terraform-cdk-constructs'

const workspaceProps: azure_loganalytics.WorkspaceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.location">location</a></code> | <code>string</code> | The Azure Region to deploy. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.name">name</a></code> | <code>string</code> | The name of the Log Analytics Workspace. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the Azure Resource Group. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.dataExport">dataExport</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_loganalytics.DataExport[]</code> | Create a DataExport for the Log Analytics Workspace. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.functions">functions</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions[]</code> | A collection of Log Analytic functions. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.queries">queries</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_loganalytics.Queries[]</code> | A collection of log saved log analytics queries. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.retention">retention</a></code> | <code>number</code> | The number of days of retention. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.sku">sku</a></code> | <code>string</code> | The SKU of the Log Analytics Workspace. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | The tags to assign to the Resource Group. |

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The Azure Region to deploy.

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Log Analytics Workspace.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the Azure Resource Group.

---

##### `dataExport`<sup>Optional</sup> <a name="dataExport" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.dataExport"></a>

```typescript
public readonly dataExport: DataExport[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_loganalytics.DataExport[]

Create a DataExport for the Log Analytics Workspace.

---

##### `functions`<sup>Optional</sup> <a name="functions" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.functions"></a>

```typescript
public readonly functions: LAFunctions[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_loganalytics.LAFunctions[]

A collection of Log Analytic functions.

---

##### `queries`<sup>Optional</sup> <a name="queries" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.queries"></a>

```typescript
public readonly queries: Queries[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_loganalytics.Queries[]

A collection of log saved log analytics queries.

---

##### `retention`<sup>Optional</sup> <a name="retention" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.retention"></a>

```typescript
public readonly retention: number;
```

- *Type:* number

The number of days of retention.

Default is 30.

---

##### `sku`<sup>Optional</sup> <a name="sku" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.sku"></a>

```typescript
public readonly sku: string;
```

- *Type:* string

The SKU of the Log Analytics Workspace.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_loganalytics.WorkspaceProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

The tags to assign to the Resource Group.

---

## Classes <a name="Classes" id="Classes"></a>

### ComputeSpecification <a name="ComputeSpecification" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.Initializer"></a>

```typescript
import { azure_kusto } from '@microsoft/terraform-cdk-constructs'

new azure_kusto.ComputeSpecification()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---



#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraLargeStandardD32dv4">computeOptimizedExtraLargeStandardD32dv4</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraLargeStandardD32dv5">computeOptimizedExtraLargeStandardD32dv5</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraSmallD11v2">computeOptimizedExtraSmallD11v2</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraSmallStandardE2adsv5">computeOptimizedExtraSmallStandardE2adsv5</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraSmallStandardE2av4">computeOptimizedExtraSmallStandardE2av4</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraSmallStandardE2dv4">computeOptimizedExtraSmallStandardE2dv4</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraSmallStandardE2dv5">computeOptimizedExtraSmallStandardE2dv5</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedIsolatedStandardE64iv3">computeOptimizedIsolatedStandardE64iv3</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedIsolatedStandardE80idsv4">computeOptimizedIsolatedStandardE80idsv4</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedLargeD14v2">computeOptimizedLargeD14v2</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedLargeD16dv5">computeOptimizedLargeD16dv5</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedLargeStandardE16adsv5">computeOptimizedLargeStandardE16adsv5</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedLargeStandardE16av4">computeOptimizedLargeStandardE16av4</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedLargeStandardE16dv4">computeOptimizedLargeStandardE16dv4</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedLargeStandardE16dv5">computeOptimizedLargeStandardE16dv5</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedMediumD13v2">computeOptimizedMediumD13v2</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedMediumStandardE8adsv5">computeOptimizedMediumStandardE8adsv5</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedMediumStandardE8av4">computeOptimizedMediumStandardE8av4</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedMediumStandardE8dv4">computeOptimizedMediumStandardE8dv4</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedMediumStandardE8dv5">computeOptimizedMediumStandardE8dv5</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedSmallD12v2">computeOptimizedSmallD12v2</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedSmallStandardE4adsv5">computeOptimizedSmallStandardE4adsv5</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedSmallStandardE4av4">computeOptimizedSmallStandardE4av4</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedSmallStandardE4dv4">computeOptimizedSmallStandardE4dv4</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedSmallStandardE4dv5">computeOptimizedSmallStandardE4dv5</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.devtestExtraSmallDv2">devtestExtraSmallDv2</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.devtestExtraSmallEav4">devtestExtraSmallEav4</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.standardE16asv44TBPS">standardE16asv44TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.standardE16sv54TBPS">standardE16sv54TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedExtraLargeStandardL32asv3">storageOptimizedExtraLargeStandardL32asv3</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedExtraLargeStandardL32sv3">storageOptimizedExtraLargeStandardL32sv3</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardDS14v24TBPS">storageOptimizedLargeStandardDS14v24TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardE16asv43TBPS">storageOptimizedLargeStandardE16asv43TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardE16asv53TBPS">storageOptimizedLargeStandardE16asv53TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardE16asv54TBPS">storageOptimizedLargeStandardE16asv54TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardE16sv43TBPS">storageOptimizedLargeStandardE16sv43TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardE16sv44TBPS">storageOptimizedLargeStandardE16sv44TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardEC16adsv5">storageOptimizedLargeStandardEC16adsv5</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardEC16asv53TBPS">storageOptimizedLargeStandardEC16asv53TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardEC16asv54TBPS">storageOptimizedLargeStandardEC16asv54TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardL16asv3">storageOptimizedLargeStandardL16asv3</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardL16sv3">storageOptimizedLargeStandardL16sv3</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargestorageOptimizedLargeStandardE16sv53TBPS">storageOptimizedLargestorageOptimizedLargeStandardE16sv53TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumSStandardE8sv41TBPS">storageOptimizedMediumSStandardE8sv41TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardDS13v21TBPS">storageOptimizedMediumStandardDS13v21TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardDS13v22TBPS">storageOptimizedMediumStandardDS13v22TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8asv41TBPS">storageOptimizedMediumStandardE8asv41TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8asv42TBPS">storageOptimizedMediumStandardE8asv42TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8asv51TBPS">storageOptimizedMediumStandardE8asv51TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8asv52TBPS">storageOptimizedMediumStandardE8asv52TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8sv42TBPS">storageOptimizedMediumStandardE8sv42TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8sv51TBPS">storageOptimizedMediumStandardE8sv51TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8sv52TBPS">storageOptimizedMediumStandardE8sv52TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardEC8adsv5">storageOptimizedMediumStandardEC8adsv5</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardEC8asv51TBPS">storageOptimizedMediumStandardEC8asv51TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardEC8asv52TBPS">storageOptimizedMediumStandardEC8asv52TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardL8asv3">storageOptimizedMediumStandardL8asv3</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardL8sv3">storageOptimizedMediumStandardL8sv3</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedStandardDS14v23TBPS">storageOptimizedStandardDS14v23TBPS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification</code> | *No description.* |

---

##### `computeOptimizedExtraLargeStandardD32dv4`<sup>Required</sup> <a name="computeOptimizedExtraLargeStandardD32dv4" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraLargeStandardD32dv4"></a>

```typescript
public readonly computeOptimizedExtraLargeStandardD32dv4: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedExtraLargeStandardD32dv5`<sup>Required</sup> <a name="computeOptimizedExtraLargeStandardD32dv5" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraLargeStandardD32dv5"></a>

```typescript
public readonly computeOptimizedExtraLargeStandardD32dv5: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedExtraSmallD11v2`<sup>Required</sup> <a name="computeOptimizedExtraSmallD11v2" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraSmallD11v2"></a>

```typescript
public readonly computeOptimizedExtraSmallD11v2: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedExtraSmallStandardE2adsv5`<sup>Required</sup> <a name="computeOptimizedExtraSmallStandardE2adsv5" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraSmallStandardE2adsv5"></a>

```typescript
public readonly computeOptimizedExtraSmallStandardE2adsv5: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedExtraSmallStandardE2av4`<sup>Required</sup> <a name="computeOptimizedExtraSmallStandardE2av4" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraSmallStandardE2av4"></a>

```typescript
public readonly computeOptimizedExtraSmallStandardE2av4: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedExtraSmallStandardE2dv4`<sup>Required</sup> <a name="computeOptimizedExtraSmallStandardE2dv4" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraSmallStandardE2dv4"></a>

```typescript
public readonly computeOptimizedExtraSmallStandardE2dv4: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedExtraSmallStandardE2dv5`<sup>Required</sup> <a name="computeOptimizedExtraSmallStandardE2dv5" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedExtraSmallStandardE2dv5"></a>

```typescript
public readonly computeOptimizedExtraSmallStandardE2dv5: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedIsolatedStandardE64iv3`<sup>Required</sup> <a name="computeOptimizedIsolatedStandardE64iv3" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedIsolatedStandardE64iv3"></a>

```typescript
public readonly computeOptimizedIsolatedStandardE64iv3: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedIsolatedStandardE80idsv4`<sup>Required</sup> <a name="computeOptimizedIsolatedStandardE80idsv4" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedIsolatedStandardE80idsv4"></a>

```typescript
public readonly computeOptimizedIsolatedStandardE80idsv4: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedLargeD14v2`<sup>Required</sup> <a name="computeOptimizedLargeD14v2" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedLargeD14v2"></a>

```typescript
public readonly computeOptimizedLargeD14v2: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedLargeD16dv5`<sup>Required</sup> <a name="computeOptimizedLargeD16dv5" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedLargeD16dv5"></a>

```typescript
public readonly computeOptimizedLargeD16dv5: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedLargeStandardE16adsv5`<sup>Required</sup> <a name="computeOptimizedLargeStandardE16adsv5" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedLargeStandardE16adsv5"></a>

```typescript
public readonly computeOptimizedLargeStandardE16adsv5: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedLargeStandardE16av4`<sup>Required</sup> <a name="computeOptimizedLargeStandardE16av4" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedLargeStandardE16av4"></a>

```typescript
public readonly computeOptimizedLargeStandardE16av4: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedLargeStandardE16dv4`<sup>Required</sup> <a name="computeOptimizedLargeStandardE16dv4" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedLargeStandardE16dv4"></a>

```typescript
public readonly computeOptimizedLargeStandardE16dv4: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedLargeStandardE16dv5`<sup>Required</sup> <a name="computeOptimizedLargeStandardE16dv5" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedLargeStandardE16dv5"></a>

```typescript
public readonly computeOptimizedLargeStandardE16dv5: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedMediumD13v2`<sup>Required</sup> <a name="computeOptimizedMediumD13v2" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedMediumD13v2"></a>

```typescript
public readonly computeOptimizedMediumD13v2: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedMediumStandardE8adsv5`<sup>Required</sup> <a name="computeOptimizedMediumStandardE8adsv5" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedMediumStandardE8adsv5"></a>

```typescript
public readonly computeOptimizedMediumStandardE8adsv5: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedMediumStandardE8av4`<sup>Required</sup> <a name="computeOptimizedMediumStandardE8av4" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedMediumStandardE8av4"></a>

```typescript
public readonly computeOptimizedMediumStandardE8av4: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedMediumStandardE8dv4`<sup>Required</sup> <a name="computeOptimizedMediumStandardE8dv4" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedMediumStandardE8dv4"></a>

```typescript
public readonly computeOptimizedMediumStandardE8dv4: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedMediumStandardE8dv5`<sup>Required</sup> <a name="computeOptimizedMediumStandardE8dv5" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedMediumStandardE8dv5"></a>

```typescript
public readonly computeOptimizedMediumStandardE8dv5: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedSmallD12v2`<sup>Required</sup> <a name="computeOptimizedSmallD12v2" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedSmallD12v2"></a>

```typescript
public readonly computeOptimizedSmallD12v2: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedSmallStandardE4adsv5`<sup>Required</sup> <a name="computeOptimizedSmallStandardE4adsv5" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedSmallStandardE4adsv5"></a>

```typescript
public readonly computeOptimizedSmallStandardE4adsv5: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedSmallStandardE4av4`<sup>Required</sup> <a name="computeOptimizedSmallStandardE4av4" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedSmallStandardE4av4"></a>

```typescript
public readonly computeOptimizedSmallStandardE4av4: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedSmallStandardE4dv4`<sup>Required</sup> <a name="computeOptimizedSmallStandardE4dv4" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedSmallStandardE4dv4"></a>

```typescript
public readonly computeOptimizedSmallStandardE4dv4: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `computeOptimizedSmallStandardE4dv5`<sup>Required</sup> <a name="computeOptimizedSmallStandardE4dv5" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.computeOptimizedSmallStandardE4dv5"></a>

```typescript
public readonly computeOptimizedSmallStandardE4dv5: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `devtestExtraSmallDv2`<sup>Required</sup> <a name="devtestExtraSmallDv2" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.devtestExtraSmallDv2"></a>

```typescript
public readonly devtestExtraSmallDv2: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `devtestExtraSmallEav4`<sup>Required</sup> <a name="devtestExtraSmallEav4" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.devtestExtraSmallEav4"></a>

```typescript
public readonly devtestExtraSmallEav4: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `standardE16asv44TBPS`<sup>Required</sup> <a name="standardE16asv44TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.standardE16asv44TBPS"></a>

```typescript
public readonly standardE16asv44TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `standardE16sv54TBPS`<sup>Required</sup> <a name="standardE16sv54TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.standardE16sv54TBPS"></a>

```typescript
public readonly standardE16sv54TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedExtraLargeStandardL32asv3`<sup>Required</sup> <a name="storageOptimizedExtraLargeStandardL32asv3" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedExtraLargeStandardL32asv3"></a>

```typescript
public readonly storageOptimizedExtraLargeStandardL32asv3: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedExtraLargeStandardL32sv3`<sup>Required</sup> <a name="storageOptimizedExtraLargeStandardL32sv3" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedExtraLargeStandardL32sv3"></a>

```typescript
public readonly storageOptimizedExtraLargeStandardL32sv3: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedLargeStandardDS14v24TBPS`<sup>Required</sup> <a name="storageOptimizedLargeStandardDS14v24TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardDS14v24TBPS"></a>

```typescript
public readonly storageOptimizedLargeStandardDS14v24TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedLargeStandardE16asv43TBPS`<sup>Required</sup> <a name="storageOptimizedLargeStandardE16asv43TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardE16asv43TBPS"></a>

```typescript
public readonly storageOptimizedLargeStandardE16asv43TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedLargeStandardE16asv53TBPS`<sup>Required</sup> <a name="storageOptimizedLargeStandardE16asv53TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardE16asv53TBPS"></a>

```typescript
public readonly storageOptimizedLargeStandardE16asv53TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedLargeStandardE16asv54TBPS`<sup>Required</sup> <a name="storageOptimizedLargeStandardE16asv54TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardE16asv54TBPS"></a>

```typescript
public readonly storageOptimizedLargeStandardE16asv54TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedLargeStandardE16sv43TBPS`<sup>Required</sup> <a name="storageOptimizedLargeStandardE16sv43TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardE16sv43TBPS"></a>

```typescript
public readonly storageOptimizedLargeStandardE16sv43TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedLargeStandardE16sv44TBPS`<sup>Required</sup> <a name="storageOptimizedLargeStandardE16sv44TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardE16sv44TBPS"></a>

```typescript
public readonly storageOptimizedLargeStandardE16sv44TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedLargeStandardEC16adsv5`<sup>Required</sup> <a name="storageOptimizedLargeStandardEC16adsv5" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardEC16adsv5"></a>

```typescript
public readonly storageOptimizedLargeStandardEC16adsv5: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedLargeStandardEC16asv53TBPS`<sup>Required</sup> <a name="storageOptimizedLargeStandardEC16asv53TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardEC16asv53TBPS"></a>

```typescript
public readonly storageOptimizedLargeStandardEC16asv53TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedLargeStandardEC16asv54TBPS`<sup>Required</sup> <a name="storageOptimizedLargeStandardEC16asv54TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardEC16asv54TBPS"></a>

```typescript
public readonly storageOptimizedLargeStandardEC16asv54TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedLargeStandardL16asv3`<sup>Required</sup> <a name="storageOptimizedLargeStandardL16asv3" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardL16asv3"></a>

```typescript
public readonly storageOptimizedLargeStandardL16asv3: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedLargeStandardL16sv3`<sup>Required</sup> <a name="storageOptimizedLargeStandardL16sv3" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargeStandardL16sv3"></a>

```typescript
public readonly storageOptimizedLargeStandardL16sv3: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedLargestorageOptimizedLargeStandardE16sv53TBPS`<sup>Required</sup> <a name="storageOptimizedLargestorageOptimizedLargeStandardE16sv53TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedLargestorageOptimizedLargeStandardE16sv53TBPS"></a>

```typescript
public readonly storageOptimizedLargestorageOptimizedLargeStandardE16sv53TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumSStandardE8sv41TBPS`<sup>Required</sup> <a name="storageOptimizedMediumSStandardE8sv41TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumSStandardE8sv41TBPS"></a>

```typescript
public readonly storageOptimizedMediumSStandardE8sv41TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardDS13v21TBPS`<sup>Required</sup> <a name="storageOptimizedMediumStandardDS13v21TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardDS13v21TBPS"></a>

```typescript
public readonly storageOptimizedMediumStandardDS13v21TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardDS13v22TBPS`<sup>Required</sup> <a name="storageOptimizedMediumStandardDS13v22TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardDS13v22TBPS"></a>

```typescript
public readonly storageOptimizedMediumStandardDS13v22TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardE8asv41TBPS`<sup>Required</sup> <a name="storageOptimizedMediumStandardE8asv41TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8asv41TBPS"></a>

```typescript
public readonly storageOptimizedMediumStandardE8asv41TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardE8asv42TBPS`<sup>Required</sup> <a name="storageOptimizedMediumStandardE8asv42TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8asv42TBPS"></a>

```typescript
public readonly storageOptimizedMediumStandardE8asv42TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardE8asv51TBPS`<sup>Required</sup> <a name="storageOptimizedMediumStandardE8asv51TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8asv51TBPS"></a>

```typescript
public readonly storageOptimizedMediumStandardE8asv51TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardE8asv52TBPS`<sup>Required</sup> <a name="storageOptimizedMediumStandardE8asv52TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8asv52TBPS"></a>

```typescript
public readonly storageOptimizedMediumStandardE8asv52TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardE8sv42TBPS`<sup>Required</sup> <a name="storageOptimizedMediumStandardE8sv42TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8sv42TBPS"></a>

```typescript
public readonly storageOptimizedMediumStandardE8sv42TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardE8sv51TBPS`<sup>Required</sup> <a name="storageOptimizedMediumStandardE8sv51TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8sv51TBPS"></a>

```typescript
public readonly storageOptimizedMediumStandardE8sv51TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardE8sv52TBPS`<sup>Required</sup> <a name="storageOptimizedMediumStandardE8sv52TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardE8sv52TBPS"></a>

```typescript
public readonly storageOptimizedMediumStandardE8sv52TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardEC8adsv5`<sup>Required</sup> <a name="storageOptimizedMediumStandardEC8adsv5" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardEC8adsv5"></a>

```typescript
public readonly storageOptimizedMediumStandardEC8adsv5: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardEC8asv51TBPS`<sup>Required</sup> <a name="storageOptimizedMediumStandardEC8asv51TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardEC8asv51TBPS"></a>

```typescript
public readonly storageOptimizedMediumStandardEC8asv51TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardEC8asv52TBPS`<sup>Required</sup> <a name="storageOptimizedMediumStandardEC8asv52TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardEC8asv52TBPS"></a>

```typescript
public readonly storageOptimizedMediumStandardEC8asv52TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardL8asv3`<sup>Required</sup> <a name="storageOptimizedMediumStandardL8asv3" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardL8asv3"></a>

```typescript
public readonly storageOptimizedMediumStandardL8asv3: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedMediumStandardL8sv3`<sup>Required</sup> <a name="storageOptimizedMediumStandardL8sv3" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedMediumStandardL8sv3"></a>

```typescript
public readonly storageOptimizedMediumStandardL8sv3: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---

##### `storageOptimizedStandardDS14v23TBPS`<sup>Required</sup> <a name="storageOptimizedStandardDS14v23TBPS" id="@microsoft/terraform-cdk-constructs.azure_kusto.ComputeSpecification.property.storageOptimizedStandardDS14v23TBPS"></a>

```typescript
public readonly storageOptimizedStandardDS14v23TBPS: IComputeSpecification;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification

---


### LinuxImageReferences <a name="LinuxImageReferences" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences.Initializer"></a>

```typescript
import { azure_virtualmachine } from '@microsoft/terraform-cdk-constructs'

new azure_virtualmachine.LinuxImageReferences()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---



#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences.property.centOS75">centOS75</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences.property.centOS85Gen2">centOS85Gen2</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences.property.debian10">debian10</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences.property.debian11BackportsGen2">debian11BackportsGen2</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences.property.ubuntuServer1804LTS">ubuntuServer1804LTS</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences.property.ubuntuServer2204LTS">ubuntuServer2204LTS</a></code> | <code>@cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference</code> | *No description.* |

---

##### `centOS75`<sup>Required</sup> <a name="centOS75" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences.property.centOS75"></a>

```typescript
public readonly centOS75: LinuxVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference

---

##### `centOS85Gen2`<sup>Required</sup> <a name="centOS85Gen2" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences.property.centOS85Gen2"></a>

```typescript
public readonly centOS85Gen2: LinuxVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference

---

##### `debian10`<sup>Required</sup> <a name="debian10" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences.property.debian10"></a>

```typescript
public readonly debian10: LinuxVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference

---

##### `debian11BackportsGen2`<sup>Required</sup> <a name="debian11BackportsGen2" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences.property.debian11BackportsGen2"></a>

```typescript
public readonly debian11BackportsGen2: LinuxVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference

---

##### `ubuntuServer1804LTS`<sup>Required</sup> <a name="ubuntuServer1804LTS" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences.property.ubuntuServer1804LTS"></a>

```typescript
public readonly ubuntuServer1804LTS: LinuxVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference

---

##### `ubuntuServer2204LTS`<sup>Required</sup> <a name="ubuntuServer2204LTS" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.LinuxImageReferences.property.ubuntuServer2204LTS"></a>

```typescript
public readonly ubuntuServer2204LTS: LinuxVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.linuxVirtualMachine.LinuxVirtualMachineSourceImageReference

---


### PreconfiguredRules <a name="PreconfiguredRules" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.Initializer"></a>

```typescript
import { azure_networksecuritygroup } from '@microsoft/terraform-cdk-constructs'

new azure_networksecuritygroup.PreconfiguredRules()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.addDestinationAddress">addDestinationAddress</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.addPriority">addPriority</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.addSourceAddress">addSourceAddress</a></code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.applyRuleOverrides">applyRuleOverrides</a></code> | *No description.* |

---

##### `addDestinationAddress` <a name="addDestinationAddress" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.addDestinationAddress"></a>

```typescript
import { azure_networksecuritygroup } from '@microsoft/terraform-cdk-constructs'

azure_networksecuritygroup.PreconfiguredRules.addDestinationAddress(rule: RuleConfig, destinationAddressPrefix: string)
```

###### `rule`<sup>Required</sup> <a name="rule" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.addDestinationAddress.parameter.rule"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

###### `destinationAddressPrefix`<sup>Required</sup> <a name="destinationAddressPrefix" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.addDestinationAddress.parameter.destinationAddressPrefix"></a>

- *Type:* string

---

##### `addPriority` <a name="addPriority" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.addPriority"></a>

```typescript
import { azure_networksecuritygroup } from '@microsoft/terraform-cdk-constructs'

azure_networksecuritygroup.PreconfiguredRules.addPriority(rule: RuleConfig, priority: number)
```

###### `rule`<sup>Required</sup> <a name="rule" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.addPriority.parameter.rule"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

###### `priority`<sup>Required</sup> <a name="priority" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.addPriority.parameter.priority"></a>

- *Type:* number

---

##### `addSourceAddress` <a name="addSourceAddress" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.addSourceAddress"></a>

```typescript
import { azure_networksecuritygroup } from '@microsoft/terraform-cdk-constructs'

azure_networksecuritygroup.PreconfiguredRules.addSourceAddress(rule: RuleConfig, sourceAddressPrefix: string)
```

###### `rule`<sup>Required</sup> <a name="rule" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.addSourceAddress.parameter.rule"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

###### `sourceAddressPrefix`<sup>Required</sup> <a name="sourceAddressPrefix" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.addSourceAddress.parameter.sourceAddressPrefix"></a>

- *Type:* string

---

##### `applyRuleOverrides` <a name="applyRuleOverrides" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.applyRuleOverrides"></a>

```typescript
import { azure_networksecuritygroup } from '@microsoft/terraform-cdk-constructs'

azure_networksecuritygroup.PreconfiguredRules.applyRuleOverrides(baseRule: RuleConfig, overrides: RuleOverrides)
```

###### `baseRule`<sup>Required</sup> <a name="baseRule" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.applyRuleOverrides.parameter.baseRule"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

###### `overrides`<sup>Required</sup> <a name="overrides" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.applyRuleOverrides.parameter.overrides"></a>

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleOverrides

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowADDSWebServices">activeDirectoryAllowADDSWebServices</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowADGCReplication">activeDirectoryAllowADGCReplication</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowADGCReplicationSSL">activeDirectoryAllowADGCReplicationSSL</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowADReplication">activeDirectoryAllowADReplication</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowADReplicationSSL">activeDirectoryAllowADReplicationSSL</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowADReplicationTrust">activeDirectoryAllowADReplicationTrust</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowDFSGroupPolicy">activeDirectoryAllowDFSGroupPolicy</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowDNS">activeDirectoryAllowDNS</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowFileReplication">activeDirectoryAllowFileReplication</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowKerberosAuthentication">activeDirectoryAllowKerberosAuthentication</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowNETBIOSAuthentication">activeDirectoryAllowNETBIOSAuthentication</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowNETBIOSReplication">activeDirectoryAllowNETBIOSReplication</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowPasswordChangeKerberes">activeDirectoryAllowPasswordChangeKerberes</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowRPCReplication">activeDirectoryAllowRPCReplication</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowSMTPReplication">activeDirectoryAllowSMTPReplication</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowWindowsTime">activeDirectoryAllowWindowsTime</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.cassandra">cassandra</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.cassandraJmx">cassandraJmx</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.cassandraThrift">cassandraThrift</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.couchDb">couchDb</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.couchDbHttps">couchDbHttps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.dnsTcp">dnsTcp</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.dnsUdp">dnsUdp</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.dynamicPorts">dynamicPorts</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.elasticSearch">elasticSearch</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.ftp">ftp</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.https">https</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.httpTcp">httpTcp</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.httpUdp">httpUdp</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.imap">imap</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.imaps">imaps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.kestrel">kestrel</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.ldap">ldap</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.memcached">memcached</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.mongoDB">mongoDB</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.mssql">mssql</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.mySQL">mySQL</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.neo4J">neo4J</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.pop3">pop3</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.pop3s">pop3s</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.postgreSQL">postgreSQL</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.rabbitMQ">rabbitMQ</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.rdp">rdp</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.redis">redis</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.riak">riak</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.riakJMX">riakJMX</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.smtp">smtp</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.smtps">smtps</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.ssh">ssh</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.winRM">winRM</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig</code> | *No description.* |

---

##### `activeDirectoryAllowADDSWebServices`<sup>Required</sup> <a name="activeDirectoryAllowADDSWebServices" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowADDSWebServices"></a>

```typescript
public readonly activeDirectoryAllowADDSWebServices: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowADGCReplication`<sup>Required</sup> <a name="activeDirectoryAllowADGCReplication" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowADGCReplication"></a>

```typescript
public readonly activeDirectoryAllowADGCReplication: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowADGCReplicationSSL`<sup>Required</sup> <a name="activeDirectoryAllowADGCReplicationSSL" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowADGCReplicationSSL"></a>

```typescript
public readonly activeDirectoryAllowADGCReplicationSSL: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowADReplication`<sup>Required</sup> <a name="activeDirectoryAllowADReplication" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowADReplication"></a>

```typescript
public readonly activeDirectoryAllowADReplication: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowADReplicationSSL`<sup>Required</sup> <a name="activeDirectoryAllowADReplicationSSL" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowADReplicationSSL"></a>

```typescript
public readonly activeDirectoryAllowADReplicationSSL: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowADReplicationTrust`<sup>Required</sup> <a name="activeDirectoryAllowADReplicationTrust" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowADReplicationTrust"></a>

```typescript
public readonly activeDirectoryAllowADReplicationTrust: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowDFSGroupPolicy`<sup>Required</sup> <a name="activeDirectoryAllowDFSGroupPolicy" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowDFSGroupPolicy"></a>

```typescript
public readonly activeDirectoryAllowDFSGroupPolicy: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowDNS`<sup>Required</sup> <a name="activeDirectoryAllowDNS" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowDNS"></a>

```typescript
public readonly activeDirectoryAllowDNS: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowFileReplication`<sup>Required</sup> <a name="activeDirectoryAllowFileReplication" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowFileReplication"></a>

```typescript
public readonly activeDirectoryAllowFileReplication: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowKerberosAuthentication`<sup>Required</sup> <a name="activeDirectoryAllowKerberosAuthentication" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowKerberosAuthentication"></a>

```typescript
public readonly activeDirectoryAllowKerberosAuthentication: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowNETBIOSAuthentication`<sup>Required</sup> <a name="activeDirectoryAllowNETBIOSAuthentication" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowNETBIOSAuthentication"></a>

```typescript
public readonly activeDirectoryAllowNETBIOSAuthentication: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowNETBIOSReplication`<sup>Required</sup> <a name="activeDirectoryAllowNETBIOSReplication" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowNETBIOSReplication"></a>

```typescript
public readonly activeDirectoryAllowNETBIOSReplication: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowPasswordChangeKerberes`<sup>Required</sup> <a name="activeDirectoryAllowPasswordChangeKerberes" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowPasswordChangeKerberes"></a>

```typescript
public readonly activeDirectoryAllowPasswordChangeKerberes: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowRPCReplication`<sup>Required</sup> <a name="activeDirectoryAllowRPCReplication" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowRPCReplication"></a>

```typescript
public readonly activeDirectoryAllowRPCReplication: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowSMTPReplication`<sup>Required</sup> <a name="activeDirectoryAllowSMTPReplication" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowSMTPReplication"></a>

```typescript
public readonly activeDirectoryAllowSMTPReplication: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `activeDirectoryAllowWindowsTime`<sup>Required</sup> <a name="activeDirectoryAllowWindowsTime" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.activeDirectoryAllowWindowsTime"></a>

```typescript
public readonly activeDirectoryAllowWindowsTime: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `cassandra`<sup>Required</sup> <a name="cassandra" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.cassandra"></a>

```typescript
public readonly cassandra: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `cassandraJmx`<sup>Required</sup> <a name="cassandraJmx" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.cassandraJmx"></a>

```typescript
public readonly cassandraJmx: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `cassandraThrift`<sup>Required</sup> <a name="cassandraThrift" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.cassandraThrift"></a>

```typescript
public readonly cassandraThrift: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `couchDb`<sup>Required</sup> <a name="couchDb" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.couchDb"></a>

```typescript
public readonly couchDb: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `couchDbHttps`<sup>Required</sup> <a name="couchDbHttps" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.couchDbHttps"></a>

```typescript
public readonly couchDbHttps: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `dnsTcp`<sup>Required</sup> <a name="dnsTcp" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.dnsTcp"></a>

```typescript
public readonly dnsTcp: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `dnsUdp`<sup>Required</sup> <a name="dnsUdp" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.dnsUdp"></a>

```typescript
public readonly dnsUdp: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `dynamicPorts`<sup>Required</sup> <a name="dynamicPorts" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.dynamicPorts"></a>

```typescript
public readonly dynamicPorts: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `elasticSearch`<sup>Required</sup> <a name="elasticSearch" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.elasticSearch"></a>

```typescript
public readonly elasticSearch: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `ftp`<sup>Required</sup> <a name="ftp" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.ftp"></a>

```typescript
public readonly ftp: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `https`<sup>Required</sup> <a name="https" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.https"></a>

```typescript
public readonly https: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `httpTcp`<sup>Required</sup> <a name="httpTcp" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.httpTcp"></a>

```typescript
public readonly httpTcp: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `httpUdp`<sup>Required</sup> <a name="httpUdp" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.httpUdp"></a>

```typescript
public readonly httpUdp: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `imap`<sup>Required</sup> <a name="imap" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.imap"></a>

```typescript
public readonly imap: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `imaps`<sup>Required</sup> <a name="imaps" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.imaps"></a>

```typescript
public readonly imaps: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `kestrel`<sup>Required</sup> <a name="kestrel" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.kestrel"></a>

```typescript
public readonly kestrel: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `ldap`<sup>Required</sup> <a name="ldap" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.ldap"></a>

```typescript
public readonly ldap: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `memcached`<sup>Required</sup> <a name="memcached" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.memcached"></a>

```typescript
public readonly memcached: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `mongoDB`<sup>Required</sup> <a name="mongoDB" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.mongoDB"></a>

```typescript
public readonly mongoDB: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `mssql`<sup>Required</sup> <a name="mssql" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.mssql"></a>

```typescript
public readonly mssql: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `mySQL`<sup>Required</sup> <a name="mySQL" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.mySQL"></a>

```typescript
public readonly mySQL: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `neo4J`<sup>Required</sup> <a name="neo4J" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.neo4J"></a>

```typescript
public readonly neo4J: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `pop3`<sup>Required</sup> <a name="pop3" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.pop3"></a>

```typescript
public readonly pop3: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `pop3s`<sup>Required</sup> <a name="pop3s" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.pop3s"></a>

```typescript
public readonly pop3s: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `postgreSQL`<sup>Required</sup> <a name="postgreSQL" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.postgreSQL"></a>

```typescript
public readonly postgreSQL: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `rabbitMQ`<sup>Required</sup> <a name="rabbitMQ" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.rabbitMQ"></a>

```typescript
public readonly rabbitMQ: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `rdp`<sup>Required</sup> <a name="rdp" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.rdp"></a>

```typescript
public readonly rdp: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `redis`<sup>Required</sup> <a name="redis" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.redis"></a>

```typescript
public readonly redis: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `riak`<sup>Required</sup> <a name="riak" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.riak"></a>

```typescript
public readonly riak: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `riakJMX`<sup>Required</sup> <a name="riakJMX" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.riakJMX"></a>

```typescript
public readonly riakJMX: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `smtp`<sup>Required</sup> <a name="smtp" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.smtp"></a>

```typescript
public readonly smtp: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `smtps`<sup>Required</sup> <a name="smtps" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.smtps"></a>

```typescript
public readonly smtps: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `ssh`<sup>Required</sup> <a name="ssh" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.ssh"></a>

```typescript
public readonly ssh: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---

##### `winRM`<sup>Required</sup> <a name="winRM" id="@microsoft/terraform-cdk-constructs.azure_networksecuritygroup.PreconfiguredRules.property.winRM"></a>

```typescript
public readonly winRM: RuleConfig;
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_networksecuritygroup.RuleConfig

---


### WindowsImageReferences <a name="WindowsImageReferences" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences"></a>

#### Initializers <a name="Initializers" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.Initializer"></a>

```typescript
import { azure_virtualmachine } from '@microsoft/terraform-cdk-constructs'

new azure_virtualmachine.WindowsImageReferences()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---



#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windows10Enterprise">windows10Enterprise</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windows10Pro">windows10Pro</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2012R2Datacenter">windowsServer2012R2Datacenter</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2012R2DatacenterCore">windowsServer2012R2DatacenterCore</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2016Datacenter">windowsServer2016Datacenter</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2016DatacenterCore">windowsServer2016DatacenterCore</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2019Datacenter">windowsServer2019Datacenter</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2019DatacenterCore">windowsServer2019DatacenterCore</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2022Datacenter">windowsServer2022Datacenter</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2022DatacenterCore">windowsServer2022DatacenterCore</a></code> | <code>@cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference</code> | *No description.* |

---

##### `windows10Enterprise`<sup>Required</sup> <a name="windows10Enterprise" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windows10Enterprise"></a>

```typescript
public readonly windows10Enterprise: WindowsVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference

---

##### `windows10Pro`<sup>Required</sup> <a name="windows10Pro" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windows10Pro"></a>

```typescript
public readonly windows10Pro: WindowsVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference

---

##### `windowsServer2012R2Datacenter`<sup>Required</sup> <a name="windowsServer2012R2Datacenter" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2012R2Datacenter"></a>

```typescript
public readonly windowsServer2012R2Datacenter: WindowsVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference

---

##### `windowsServer2012R2DatacenterCore`<sup>Required</sup> <a name="windowsServer2012R2DatacenterCore" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2012R2DatacenterCore"></a>

```typescript
public readonly windowsServer2012R2DatacenterCore: WindowsVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference

---

##### `windowsServer2016Datacenter`<sup>Required</sup> <a name="windowsServer2016Datacenter" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2016Datacenter"></a>

```typescript
public readonly windowsServer2016Datacenter: WindowsVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference

---

##### `windowsServer2016DatacenterCore`<sup>Required</sup> <a name="windowsServer2016DatacenterCore" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2016DatacenterCore"></a>

```typescript
public readonly windowsServer2016DatacenterCore: WindowsVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference

---

##### `windowsServer2019Datacenter`<sup>Required</sup> <a name="windowsServer2019Datacenter" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2019Datacenter"></a>

```typescript
public readonly windowsServer2019Datacenter: WindowsVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference

---

##### `windowsServer2019DatacenterCore`<sup>Required</sup> <a name="windowsServer2019DatacenterCore" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2019DatacenterCore"></a>

```typescript
public readonly windowsServer2019DatacenterCore: WindowsVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference

---

##### `windowsServer2022Datacenter`<sup>Required</sup> <a name="windowsServer2022Datacenter" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2022Datacenter"></a>

```typescript
public readonly windowsServer2022Datacenter: WindowsVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference

---

##### `windowsServer2022DatacenterCore`<sup>Required</sup> <a name="windowsServer2022DatacenterCore" id="@microsoft/terraform-cdk-constructs.azure_virtualmachine.WindowsImageReferences.property.windowsServer2022DatacenterCore"></a>

```typescript
public readonly windowsServer2022DatacenterCore: WindowsVirtualMachineSourceImageReference;
```

- *Type:* @cdktf/provider-azurerm.windowsVirtualMachine.WindowsVirtualMachineSourceImageReference

---


## Protocols <a name="Protocols" id="Protocols"></a>

### IBaseMetricAlertProps <a name="IBaseMetricAlertProps" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps"></a>

- *Implemented By:* @microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps, @microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.name">name</a></code> | <code>string</code> | The name of the Metric Alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.action">action</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertActionProp[]</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.criteria">criteria</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp[]</code> | One ore more criteria. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.description">description</a></code> | <code>string</code> | The description of this Metric Alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.dynamicCriteria">dynamicCriteria</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps[]</code> | One ore more dynamic criteria. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | A mapping of tags to assign to the resource. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.targetResourceLocation">targetResourceLocation</a></code> | <code>string</code> | The location of the target resource. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.targetResourceType">targetResourceType</a></code> | <code>string</code> | The resource type (e.g. Microsoft.Compute/virtualMachines) of the target resource. This is Required when using a Subscription as scope, a Resource Group as scope or Multiple Scopes. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.automitigate">automitigate</a></code> | <code>boolean</code> | Should the alerts in this Metric Alert be auto resolved? |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.enabled">enabled</a></code> | <code>boolean</code> | Should this Metric Alert be enabled? |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.frequency">frequency</a></code> | <code>string</code> | The evaluation frequency of this Metric Alert, represented in ISO 8601 duration format. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.severity">severity</a></code> | <code>number</code> | The severity of this Metric Alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.windowSize">windowSize</a></code> | <code>string</code> | The period of time that is used to monitor alert activity, represented in ISO 8601 duration format. |

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Metric Alert.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#name}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#name})

---

##### `action`<sup>Optional</sup> <a name="action" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.action"></a>

```typescript
public readonly action: MetricAlertActionProp[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertActionProp[]

---

##### `criteria`<sup>Optional</sup> <a name="criteria" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.criteria"></a>

```typescript
public readonly criteria: MetricAlertCriteriaProp[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp[]

One ore more criteria.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#criteria}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#criteria})

---

##### `description`<sup>Optional</sup> <a name="description" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

The description of this Metric Alert.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#description}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#description})

---

##### `dynamicCriteria`<sup>Optional</sup> <a name="dynamicCriteria" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.dynamicCriteria"></a>

```typescript
public readonly dynamicCriteria: MetricAlertDynamicCritiriaProps[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps[]

One ore more dynamic criteria.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dynamic_criteria}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dynamic_criteria})

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

A mapping of tags to assign to the resource.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#tags}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#tags})

---

##### `targetResourceLocation`<sup>Optional</sup> <a name="targetResourceLocation" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.targetResourceLocation"></a>

```typescript
public readonly targetResourceLocation: string;
```

- *Type:* string

The location of the target resource.

This is Required when using a Subscription as scope, a Resource Group as scope or Multiple Scopes.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#target_resource_location}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#target_resource_location})

---

##### `targetResourceType`<sup>Optional</sup> <a name="targetResourceType" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.targetResourceType"></a>

```typescript
public readonly targetResourceType: string;
```

- *Type:* string

The resource type (e.g. Microsoft.Compute/virtualMachines) of the target resource. This is Required when using a Subscription as scope, a Resource Group as scope or Multiple Scopes.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#target_resource_type}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#target_resource_type})

---

##### `automitigate`<sup>Optional</sup> <a name="automitigate" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.automitigate"></a>

```typescript
public readonly automitigate: boolean;
```

- *Type:* boolean
- *Default:* true

Should the alerts in this Metric Alert be auto resolved?

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#auto_mitigate}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#auto_mitigate})

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean
- *Default:* true

Should this Metric Alert be enabled?

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#enabled}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#enabled})

---

##### `frequency`<sup>Optional</sup> <a name="frequency" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.frequency"></a>

```typescript
public readonly frequency: string;
```

- *Type:* string
- *Default:* PT5M

The evaluation frequency of this Metric Alert, represented in ISO 8601 duration format.

Possible values are PT1M, PT5M, PT15M, PT30M and PT1H.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#frequency}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#frequency})

---

##### `severity`<sup>Optional</sup> <a name="severity" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.severity"></a>

```typescript
public readonly severity: number;
```

- *Type:* number
- *Default:* 3

The severity of this Metric Alert.

Possible values are 0, 1, 2, 3 and 4.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#severity}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#severity})

---

##### `windowSize`<sup>Optional</sup> <a name="windowSize" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps.property.windowSize"></a>

```typescript
public readonly windowSize: string;
```

- *Type:* string
- *Default:* PT5M

The period of time that is used to monitor alert activity, represented in ISO 8601 duration format.

This value must be greater than frequency. Possible values are PT1M, PT5M, PT15M, PT30M, PT1H, PT6H, PT12H and P1D.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#window_size}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#window_size})

---

### IComputeSpecification <a name="IComputeSpecification" id="@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification"></a>

- *Implemented By:* @microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.availibleZones">availibleZones</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.cache">cache</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.memory">memory</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.series">series</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.size">size</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.skuName">skuName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.vCPU">vCPU</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.workload">workload</a></code> | <code>string</code> | *No description.* |

---

##### `availibleZones`<sup>Required</sup> <a name="availibleZones" id="@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.availibleZones"></a>

```typescript
public readonly availibleZones: string[];
```

- *Type:* string[]

---

##### `cache`<sup>Required</sup> <a name="cache" id="@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.cache"></a>

```typescript
public readonly cache: number;
```

- *Type:* number

---

##### `memory`<sup>Required</sup> <a name="memory" id="@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.memory"></a>

```typescript
public readonly memory: number;
```

- *Type:* number

---

##### `series`<sup>Required</sup> <a name="series" id="@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.series"></a>

```typescript
public readonly series: string;
```

- *Type:* string

---

##### `size`<sup>Required</sup> <a name="size" id="@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.size"></a>

```typescript
public readonly size: string;
```

- *Type:* string

---

##### `skuName`<sup>Required</sup> <a name="skuName" id="@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.skuName"></a>

```typescript
public readonly skuName: string;
```

- *Type:* string

---

##### `vCPU`<sup>Required</sup> <a name="vCPU" id="@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.vCPU"></a>

```typescript
public readonly vCPU: number;
```

- *Type:* number

---

##### `workload`<sup>Required</sup> <a name="workload" id="@microsoft/terraform-cdk-constructs.azure_kusto.IComputeSpecification.property.workload"></a>

```typescript
public readonly workload: string;
```

- *Type:* string

---

### IGatewayProps <a name="IGatewayProps" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps"></a>

- *Implemented By:* @microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.backendAddressPools">backendAddressPools</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayBackendAddressPool[]</code> | The backend address pools for the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.backendHttpSettings">backendHttpSettings</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayBackendHttpSettings[]</code> | The backend HTTP settings for the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.capacity">capacity</a></code> | <code>number</code> | The capacity (instance count) of the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.httpListeners">httpListeners</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayHttpListener[]</code> | The HTTP listeners for the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.location">location</a></code> | <code>string</code> | The location where the Application Gateway will be deployed (e.g., region). |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.name">name</a></code> | <code>string</code> | The name of the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.requestRoutingRules">requestRoutingRules</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayRequestRoutingRule[]</code> | The request routing rules for the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The resource group under which the Application Gateway will be deployed. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.skuSize">skuSize</a></code> | <code>string</code> | The size of the SKU for the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.skuTier">skuTier</a></code> | <code>string</code> | The SKU tier of the Application Gateway (e.g., Standard, WAF). |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.authenticationCertificate">authenticationCertificate</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayAuthenticationCertificate[]</code> | Optional authentication certificates for mutual authentication. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.autoscaleConfiguration">autoscaleConfiguration</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayAutoscaleConfiguration</code> | Optional autoscale configuration for dynamically adjusting the capacity of the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.customErrorConfiguration">customErrorConfiguration</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayCustomErrorConfiguration[]</code> | Optional custom error configurations to specify custom error pages. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.enableHttp2">enableHttp2</a></code> | <code>boolean</code> | Flag to enable HTTP2. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.fipsEnabled">fipsEnabled</a></code> | <code>boolean</code> | Flag to enable FIPS-compliant algorithms. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.firewallPolicyId">firewallPolicyId</a></code> | <code>string</code> | Optional ID of the firewall policy. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.forceFirewallPolicyAssociation">forceFirewallPolicyAssociation</a></code> | <code>boolean</code> | Flag to enforce association of the firewall policy. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.frontendPorts">frontendPorts</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayFrontendPort[]</code> | Optional frontend ports for the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.identity">identity</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayIdentity</code> | Optional identity for the Application Gateway, used for accessing other Azure resources. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.keyVault">keyVault</a></code> | <code>@cdktf/provider-azurerm.keyVault.KeyVault</code> | Optional Key Vault resource for storing SSL certificates. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.privateLinkConfiguration">privateLinkConfiguration</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayPrivateLinkConfiguration[]</code> | Optional configurations for enabling Private Link on the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.probe">probe</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayProbe[]</code> | Optional probes for health checks of the backend HTTP settings. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.redirectConfiguration">redirectConfiguration</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayRedirectConfiguration[]</code> | Optional configurations for redirect rules. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.rewriteRuleSet">rewriteRuleSet</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayRewriteRuleSet[]</code> | Optional rewrite rule sets for modifying HTTP request and response headers and bodies. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.sslCertificate">sslCertificate</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewaySslCertificate[]</code> | Optional SSL certificates for enabling HTTPS on the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.sslPolicy">sslPolicy</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewaySslPolicy</code> | Optional SSL policy configurations, defining the protocol and cipher suites used. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.sslProfile">sslProfile</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewaySslProfile[]</code> | Optional SSL profiles for managing SSL termination and policy settings. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.subnet">subnet</a></code> | <code>@cdktf/provider-azurerm.subnet.Subnet</code> | Optional subnet for the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Optional tags for the Application Gateway resource. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.tenantId">tenantId</a></code> | <code>string</code> | Optional tenant ID for use with Key Vault, if applicable. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.timeouts">timeouts</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayTimeouts</code> | Optional timeout settings for the Application Gateway resources. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.trustedClientCertificate">trustedClientCertificate</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayTrustedClientCertificate[]</code> | Optional trusted client certificates for mutual authentication. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.trustedRootCertificate">trustedRootCertificate</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayTrustedRootCertificate[]</code> | Optional trusted root certificates for backend authentication. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.urlPathMap">urlPathMap</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayUrlPathMap[]</code> | Optional URL path map for routing based on URL paths. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.wafConfiguration">wafConfiguration</a></code> | <code>@cdktf/provider-azurerm.applicationGateway.ApplicationGatewayWafConfiguration</code> | Optional Web Application Firewall (WAF) configuration to provide enhanced security. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.zones">zones</a></code> | <code>string[]</code> | Optional availability zones for the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.privateIpAddress">privateIpAddress</a></code> | <code>string</code> | Optional private IP address for the frontend of the Application Gateway. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.privateIpAddressAllocation">privateIpAddressAllocation</a></code> | <code>string</code> | Allocation method for the private IP address (e.g., Static, Dynamic). |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.publicIpAddress">publicIpAddress</a></code> | <code>@cdktf/provider-azurerm.publicIp.PublicIp</code> | Optional public IP address for the frontend of the Application Gateway. |

---

##### `backendAddressPools`<sup>Required</sup> <a name="backendAddressPools" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.backendAddressPools"></a>

```typescript
public readonly backendAddressPools: ApplicationGatewayBackendAddressPool[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayBackendAddressPool[]

The backend address pools for the Application Gateway.

---

##### `backendHttpSettings`<sup>Required</sup> <a name="backendHttpSettings" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.backendHttpSettings"></a>

```typescript
public readonly backendHttpSettings: ApplicationGatewayBackendHttpSettings[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayBackendHttpSettings[]

The backend HTTP settings for the Application Gateway.

---

##### `capacity`<sup>Required</sup> <a name="capacity" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.capacity"></a>

```typescript
public readonly capacity: number;
```

- *Type:* number

The capacity (instance count) of the Application Gateway.

---

##### `httpListeners`<sup>Required</sup> <a name="httpListeners" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.httpListeners"></a>

```typescript
public readonly httpListeners: ApplicationGatewayHttpListener[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayHttpListener[]

The HTTP listeners for the Application Gateway.

---

##### `location`<sup>Required</sup> <a name="location" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.location"></a>

```typescript
public readonly location: string;
```

- *Type:* string

The location where the Application Gateway will be deployed (e.g., region).

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Application Gateway.

---

##### `requestRoutingRules`<sup>Required</sup> <a name="requestRoutingRules" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.requestRoutingRules"></a>

```typescript
public readonly requestRoutingRules: ApplicationGatewayRequestRoutingRule[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayRequestRoutingRule[]

The request routing rules for the Application Gateway.

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The resource group under which the Application Gateway will be deployed.

---

##### `skuSize`<sup>Required</sup> <a name="skuSize" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.skuSize"></a>

```typescript
public readonly skuSize: string;
```

- *Type:* string

The size of the SKU for the Application Gateway.

---

##### `skuTier`<sup>Required</sup> <a name="skuTier" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.skuTier"></a>

```typescript
public readonly skuTier: string;
```

- *Type:* string

The SKU tier of the Application Gateway (e.g., Standard, WAF).

---

##### `authenticationCertificate`<sup>Optional</sup> <a name="authenticationCertificate" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.authenticationCertificate"></a>

```typescript
public readonly authenticationCertificate: ApplicationGatewayAuthenticationCertificate[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayAuthenticationCertificate[]

Optional authentication certificates for mutual authentication.

---

##### `autoscaleConfiguration`<sup>Optional</sup> <a name="autoscaleConfiguration" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.autoscaleConfiguration"></a>

```typescript
public readonly autoscaleConfiguration: ApplicationGatewayAutoscaleConfiguration;
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayAutoscaleConfiguration

Optional autoscale configuration for dynamically adjusting the capacity of the Application Gateway.

---

##### `customErrorConfiguration`<sup>Optional</sup> <a name="customErrorConfiguration" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.customErrorConfiguration"></a>

```typescript
public readonly customErrorConfiguration: ApplicationGatewayCustomErrorConfiguration[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayCustomErrorConfiguration[]

Optional custom error configurations to specify custom error pages.

---

##### `enableHttp2`<sup>Optional</sup> <a name="enableHttp2" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.enableHttp2"></a>

```typescript
public readonly enableHttp2: boolean;
```

- *Type:* boolean

Flag to enable HTTP2.

---

##### `fipsEnabled`<sup>Optional</sup> <a name="fipsEnabled" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.fipsEnabled"></a>

```typescript
public readonly fipsEnabled: boolean;
```

- *Type:* boolean

Flag to enable FIPS-compliant algorithms.

---

##### `firewallPolicyId`<sup>Optional</sup> <a name="firewallPolicyId" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.firewallPolicyId"></a>

```typescript
public readonly firewallPolicyId: string;
```

- *Type:* string

Optional ID of the firewall policy.

---

##### `forceFirewallPolicyAssociation`<sup>Optional</sup> <a name="forceFirewallPolicyAssociation" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.forceFirewallPolicyAssociation"></a>

```typescript
public readonly forceFirewallPolicyAssociation: boolean;
```

- *Type:* boolean

Flag to enforce association of the firewall policy.

---

##### `frontendPorts`<sup>Optional</sup> <a name="frontendPorts" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.frontendPorts"></a>

```typescript
public readonly frontendPorts: ApplicationGatewayFrontendPort[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayFrontendPort[]

Optional frontend ports for the Application Gateway.

---

##### `identity`<sup>Optional</sup> <a name="identity" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.identity"></a>

```typescript
public readonly identity: ApplicationGatewayIdentity;
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayIdentity

Optional identity for the Application Gateway, used for accessing other Azure resources.

---

##### `keyVault`<sup>Optional</sup> <a name="keyVault" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.keyVault"></a>

```typescript
public readonly keyVault: KeyVault;
```

- *Type:* @cdktf/provider-azurerm.keyVault.KeyVault

Optional Key Vault resource for storing SSL certificates.

---

##### `privateLinkConfiguration`<sup>Optional</sup> <a name="privateLinkConfiguration" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.privateLinkConfiguration"></a>

```typescript
public readonly privateLinkConfiguration: ApplicationGatewayPrivateLinkConfiguration[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayPrivateLinkConfiguration[]

Optional configurations for enabling Private Link on the Application Gateway.

---

##### `probe`<sup>Optional</sup> <a name="probe" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.probe"></a>

```typescript
public readonly probe: ApplicationGatewayProbe[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayProbe[]

Optional probes for health checks of the backend HTTP settings.

---

##### `redirectConfiguration`<sup>Optional</sup> <a name="redirectConfiguration" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.redirectConfiguration"></a>

```typescript
public readonly redirectConfiguration: ApplicationGatewayRedirectConfiguration[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayRedirectConfiguration[]

Optional configurations for redirect rules.

---

##### `rewriteRuleSet`<sup>Optional</sup> <a name="rewriteRuleSet" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.rewriteRuleSet"></a>

```typescript
public readonly rewriteRuleSet: ApplicationGatewayRewriteRuleSet[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayRewriteRuleSet[]

Optional rewrite rule sets for modifying HTTP request and response headers and bodies.

---

##### `sslCertificate`<sup>Optional</sup> <a name="sslCertificate" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.sslCertificate"></a>

```typescript
public readonly sslCertificate: ApplicationGatewaySslCertificate[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewaySslCertificate[]

Optional SSL certificates for enabling HTTPS on the Application Gateway.

---

##### `sslPolicy`<sup>Optional</sup> <a name="sslPolicy" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.sslPolicy"></a>

```typescript
public readonly sslPolicy: ApplicationGatewaySslPolicy;
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewaySslPolicy

Optional SSL policy configurations, defining the protocol and cipher suites used.

---

##### `sslProfile`<sup>Optional</sup> <a name="sslProfile" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.sslProfile"></a>

```typescript
public readonly sslProfile: ApplicationGatewaySslProfile[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewaySslProfile[]

Optional SSL profiles for managing SSL termination and policy settings.

---

##### `subnet`<sup>Optional</sup> <a name="subnet" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.subnet"></a>

```typescript
public readonly subnet: Subnet;
```

- *Type:* @cdktf/provider-azurerm.subnet.Subnet

Optional subnet for the Application Gateway.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Optional tags for the Application Gateway resource.

---

##### `tenantId`<sup>Optional</sup> <a name="tenantId" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.tenantId"></a>

```typescript
public readonly tenantId: string;
```

- *Type:* string

Optional tenant ID for use with Key Vault, if applicable.

---

##### `timeouts`<sup>Optional</sup> <a name="timeouts" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.timeouts"></a>

```typescript
public readonly timeouts: ApplicationGatewayTimeouts;
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayTimeouts

Optional timeout settings for the Application Gateway resources.

---

##### `trustedClientCertificate`<sup>Optional</sup> <a name="trustedClientCertificate" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.trustedClientCertificate"></a>

```typescript
public readonly trustedClientCertificate: ApplicationGatewayTrustedClientCertificate[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayTrustedClientCertificate[]

Optional trusted client certificates for mutual authentication.

---

##### `trustedRootCertificate`<sup>Optional</sup> <a name="trustedRootCertificate" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.trustedRootCertificate"></a>

```typescript
public readonly trustedRootCertificate: ApplicationGatewayTrustedRootCertificate[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayTrustedRootCertificate[]

Optional trusted root certificates for backend authentication.

---

##### `urlPathMap`<sup>Optional</sup> <a name="urlPathMap" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.urlPathMap"></a>

```typescript
public readonly urlPathMap: ApplicationGatewayUrlPathMap[];
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayUrlPathMap[]

Optional URL path map for routing based on URL paths.

---

##### `wafConfiguration`<sup>Optional</sup> <a name="wafConfiguration" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.wafConfiguration"></a>

```typescript
public readonly wafConfiguration: ApplicationGatewayWafConfiguration;
```

- *Type:* @cdktf/provider-azurerm.applicationGateway.ApplicationGatewayWafConfiguration

Optional Web Application Firewall (WAF) configuration to provide enhanced security.

---

##### `zones`<sup>Optional</sup> <a name="zones" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.zones"></a>

```typescript
public readonly zones: string[];
```

- *Type:* string[]

Optional availability zones for the Application Gateway.

---

##### `privateIpAddress`<sup>Optional</sup> <a name="privateIpAddress" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.privateIpAddress"></a>

```typescript
public readonly privateIpAddress: string;
```

- *Type:* string

Optional private IP address for the frontend of the Application Gateway.

---

##### `privateIpAddressAllocation`<sup>Optional</sup> <a name="privateIpAddressAllocation" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.privateIpAddressAllocation"></a>

```typescript
public readonly privateIpAddressAllocation: string;
```

- *Type:* string

Allocation method for the private IP address (e.g., Static, Dynamic).

---

##### `publicIpAddress`<sup>Optional</sup> <a name="publicIpAddress" id="@microsoft/terraform-cdk-constructs.azure_applicationgateway.IGatewayProps.property.publicIpAddress"></a>

```typescript
public readonly publicIpAddress: PublicIp;
```

- *Type:* @cdktf/provider-azurerm.publicIp.PublicIp

Optional public IP address for the frontend of the Application Gateway.

---

### IMetricAlertProps <a name="IMetricAlertProps" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps"></a>

- *Extends:* @microsoft/terraform-cdk-constructs.azure_metricalert.IBaseMetricAlertProps

- *Implemented By:* @microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.name">name</a></code> | <code>string</code> | The name of the Metric Alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.action">action</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertActionProp[]</code> | *No description.* |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.criteria">criteria</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp[]</code> | One ore more criteria. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.description">description</a></code> | <code>string</code> | The description of this Metric Alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.dynamicCriteria">dynamicCriteria</a></code> | <code>@microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps[]</code> | One ore more dynamic criteria. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | A mapping of tags to assign to the resource. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.targetResourceLocation">targetResourceLocation</a></code> | <code>string</code> | The location of the target resource. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.targetResourceType">targetResourceType</a></code> | <code>string</code> | The resource type (e.g. Microsoft.Compute/virtualMachines) of the target resource. This is Required when using a Subscription as scope, a Resource Group as scope or Multiple Scopes. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.automitigate">automitigate</a></code> | <code>boolean</code> | Should the alerts in this Metric Alert be auto resolved? |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.enabled">enabled</a></code> | <code>boolean</code> | Should this Metric Alert be enabled? |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.frequency">frequency</a></code> | <code>string</code> | The evaluation frequency of this Metric Alert, represented in ISO 8601 duration format. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.severity">severity</a></code> | <code>number</code> | The severity of this Metric Alert. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.windowSize">windowSize</a></code> | <code>string</code> | The period of time that is used to monitor alert activity, represented in ISO 8601 duration format. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.resourceGroup">resourceGroup</a></code> | <code>@cdktf/provider-azurerm.resourceGroup.ResourceGroup</code> | The name of the resource group in which the Metric Alert is created. |
| <code><a href="#@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.scopes">scopes</a></code> | <code>string[]</code> | A set of strings of resource IDs at which the metric criteria should be applied. |

---

##### `name`<sup>Required</sup> <a name="name" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the Metric Alert.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#name}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#name})

---

##### `action`<sup>Optional</sup> <a name="action" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.action"></a>

```typescript
public readonly action: MetricAlertActionProp[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertActionProp[]

---

##### `criteria`<sup>Optional</sup> <a name="criteria" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.criteria"></a>

```typescript
public readonly criteria: MetricAlertCriteriaProp[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertCriteriaProp[]

One ore more criteria.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#criteria}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#criteria})

---

##### `description`<sup>Optional</sup> <a name="description" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

The description of this Metric Alert.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#description}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#description})

---

##### `dynamicCriteria`<sup>Optional</sup> <a name="dynamicCriteria" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.dynamicCriteria"></a>

```typescript
public readonly dynamicCriteria: MetricAlertDynamicCritiriaProps[];
```

- *Type:* @microsoft/terraform-cdk-constructs.azure_metricalert.MetricAlertDynamicCritiriaProps[]

One ore more dynamic criteria.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dynamic_criteria}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#dynamic_criteria})

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

A mapping of tags to assign to the resource.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#tags}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#tags})

---

##### `targetResourceLocation`<sup>Optional</sup> <a name="targetResourceLocation" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.targetResourceLocation"></a>

```typescript
public readonly targetResourceLocation: string;
```

- *Type:* string

The location of the target resource.

This is Required when using a Subscription as scope, a Resource Group as scope or Multiple Scopes.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#target_resource_location}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#target_resource_location})

---

##### `targetResourceType`<sup>Optional</sup> <a name="targetResourceType" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.targetResourceType"></a>

```typescript
public readonly targetResourceType: string;
```

- *Type:* string

The resource type (e.g. Microsoft.Compute/virtualMachines) of the target resource. This is Required when using a Subscription as scope, a Resource Group as scope or Multiple Scopes.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#target_resource_type}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#target_resource_type})

---

##### `automitigate`<sup>Optional</sup> <a name="automitigate" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.automitigate"></a>

```typescript
public readonly automitigate: boolean;
```

- *Type:* boolean
- *Default:* true

Should the alerts in this Metric Alert be auto resolved?

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#auto_mitigate}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#auto_mitigate})

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean
- *Default:* true

Should this Metric Alert be enabled?

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#enabled}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#enabled})

---

##### `frequency`<sup>Optional</sup> <a name="frequency" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.frequency"></a>

```typescript
public readonly frequency: string;
```

- *Type:* string
- *Default:* PT5M

The evaluation frequency of this Metric Alert, represented in ISO 8601 duration format.

Possible values are PT1M, PT5M, PT15M, PT30M and PT1H.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#frequency}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#frequency})

---

##### `severity`<sup>Optional</sup> <a name="severity" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.severity"></a>

```typescript
public readonly severity: number;
```

- *Type:* number
- *Default:* 3

The severity of this Metric Alert.

Possible values are 0, 1, 2, 3 and 4.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#severity}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#severity})

---

##### `windowSize`<sup>Optional</sup> <a name="windowSize" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.windowSize"></a>

```typescript
public readonly windowSize: string;
```

- *Type:* string
- *Default:* PT5M

The period of time that is used to monitor alert activity, represented in ISO 8601 duration format.

This value must be greater than frequency. Possible values are PT1M, PT5M, PT15M, PT30M, PT1H, PT6H, PT12H and P1D.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#window_size}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#window_size})

---

##### `resourceGroup`<sup>Required</sup> <a name="resourceGroup" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.resourceGroup"></a>

```typescript
public readonly resourceGroup: ResourceGroup;
```

- *Type:* @cdktf/provider-azurerm.resourceGroup.ResourceGroup

The name of the resource group in which the Metric Alert is created.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#resource_group_name}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#resource_group_name})

---

##### `scopes`<sup>Required</sup> <a name="scopes" id="@microsoft/terraform-cdk-constructs.azure_metricalert.IMetricAlertProps.property.scopes"></a>

```typescript
public readonly scopes: string[];
```

- *Type:* string[]

A set of strings of resource IDs at which the metric criteria should be applied.

> [{@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#scopes}]({@link https://www.terraform.io/docs/providers/azurerm/r/monitor_metric_alert.html#scopes})

---

