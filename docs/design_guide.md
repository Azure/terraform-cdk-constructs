# Azure CDK Library Design Guidelines

This document aims to establish a set of guidelines for the development of modules within the Azure Construct Library, with the objective of achieving a uniform and cohesive user experience throughout all constructs.

## Table of Contents
- [Introduction](#introduction)
- [Module Organization](#module-organization)
- [Construct Classes](#construct-classes)
- [Object-Oriented Design](#object-oriented-design)
- [Props](#props)
- [Defaults](#defaults)
  - [Essential Inputs](#essential-inputs)
  - [Default Configuration](#default-configuration)
  - [Simplified Props Structure](#simplified-props-structure)
  - [Documentation of Properties](#documentation-of-properties)
- [Implementation Details](#implementation-details)
  - [Stable Construct IDs](#stable-construct-ids)
- [Testing](#testing)
- [Naming and Coding Style](#naming-and-coding-style)
  - [Naming Conventions](#naming-conventions)
  - [Coding Style](#coding-style)


## Introduction

The guidelines in this document use TypeScript (and npm package names) since
this is the source programming language used to author the library, which is
later packaged and published to all programming languages through
[jsii](https://github.com/awslabs/jsii).

In the creation of modules for the CDK library, we adhere to these standards:

- **User-Centric Design**: Our modules focus on the user's way of thinking, not how the backend system works. We allow multiple methods to accomplish the same goal to cater to different users.
  
- **Comprehensive**: The CDK Library offers easy defaults to start with best practices but lets users adjust as they see fit. It uses a layered design, so users can pick their preferred complexity.

- **Open & Extensible**: It's an internally open framework that allows for customization. Anyone can contribute and share their constructs.

- **Made for jsii**: Built using jsii, the library supports all its languages. However, some language features might be restricted to ensure smooth translation across languages.

- **Backwards Compatibility when possible**: Rolling out changes to IaC code is combersome and time consuming. We will strive to make backwards compatible changes that do not affect the user and the coding experience. 
 
## Module Organization
Azure CDK module are organized into modules based on their Azure service such as a Storage Account or AKS cluster. They live in the `src` folder and start with the name of the provider followed by a `-` and then the name of the module in all lower case. Azure modules start with the `azure-` prefix. For example:

```
azure-applicationinsights
```

### Project Structure

The code for each construct shoudl live under `lib/' in each construct directoy. There should be a `lib/index.ts` file in each directoy that contains the imports for other files. You can run `npm run generate-index` to automatically generate the index.ts files in your construct directoy:
```
/src/azure-applicationinsights/lib/appinsights.ts // construct code
/src/azure-applicationsingiths/lib/index.ts // contains export

```

#### Construct Classes
Terraform constructs in the context of the CDK for Terraform (CDKTF) are also basic building blocks but for Terraform-based infrastructure as code. They encapsulate both low-level resources, like an individual Azure AKS cluster, and higher-level abstractions, which can be a combination of related resources that make up a complex infrastructure service, like a serverless application.

#### Object-Oriented Design

The Azure CDK enhances the developer experience by allowing the use of object references. This means that when developers use these modules, they can interact directly with the objects representing Azure resources, rather than just their individual attributes. This interaction is more intuitive as it gives access to all of the resource's runtime properties, like its unique Id. Additionally, developers can take advantage of the built-in logic that the object provides, making it easier to manage and use Azure resources in their code.

Here's an example when a user defines a Log Analytics Workspace, they can use built in methods to assign access or pass the object to another method to configure logging to this object:

```typescript
const logAnalytics = new AzureLogAnalytics(app, 'myla', {
        name: "la-test",
        location: 'eastus',
        resource_group_name: "rg-test",
      });

logAnalytics.addAccess(userObjectId, "Contributor") // Set contributor access on Log Analytics Workspace to user object id
aks.addLogging(logAnalytics) // configure AKS object to log to Log Analytics Workspace
```
The principle of "Separation of Concerns" in Object-Oriented (OO) design dictates that a class or module should only be responsible for a specific function or concern. It shouldn't be jumbled with other unrelated functionalities. This design makes systems more modular, easier to understand, and adaptable to changes.

In this example, the AKS class only knows that it needs to log somewhere, but it doesn't need to be concerned with the specifics of how Log Analytics works. That's the responsibility of the Log Analytics class.

This abstraction ensures two benefits:
- **Future-Proofing**: If, in the future, the way AKS interacts with Log Analytics changes, you can simply modify how the AKS class uses Log Analytics without making broad changes to the AKS class's public API.
- **Independence**: The Log Analytics class can undergo changes in its behavior or methods without impacting the classes that use it. This makes both classes more adaptable and resilient to changes.

In simpler words, think of this like a TV and a remote. The remote (akin to our AKS class) can change channels (log data), but it doesn't need to know the intricate workings of the TV (akin to Log Analytics). If the TV's internals change, the remote's basic functions remain the same. Separation of concerns ensures each device (or class in our case) does its job independently but can work together when needed.

#### Props

Props are essential when creating a construct because they define how you interact with it. Think of props as the starting point or the main settings for the construct. They cover all the features that the service offers and are designed to be easy for developers to understand and use, matching the way they naturally think about the service and what it can do.


Props are interfaces that contain `Props` at the end of the name:
```typescript
export interface KeyVaultProps {
    /**
     * The name of the Key Vault.
     */
    readonly name: string;
    /**
     * The Azure Region to deploy the Key Vault.
     */
    readonly location: string;
```
They are fed into the Class and allow for setting defaults:

```typescript
export class AzureKeyVault extends Construct {
  readonly props: KeyVaultProps;
  public readonly id: string;
  private accessPolicies: AzureKeyVaultPolicy[] = [];

  constructor(scope: Construct, id: string, props: KeyVaultProps) {
    super(scope, id);

    this.props = props;

    // Provide default values
    const purgeProtection = props.purgeProtection ?? true;
    const sku = props.sku ?? "standard";
    const softDeleteRetentionDays = props.softDeleteRetentionDays ?? 90;

    // Create Azure Key Vault resource and feed in values from props interface
    const azurermKeyVault = 
        new KeyVault(this, 'key_vault', {
            name: props.name,
            location: props.location,
            resourceGroupName: props.resource_group_name,
            tags: props.tags,
            skuName: sku,
            tenantId: props.tenant_id,
            networkAcls: props.networkAcls,
            purgeProtectionEnabled: purgeProtection,
            softDeleteRetentionDays: softDeleteRetentionDays,
        });
        this.id = azurermKeyVault.id;
```

The props interface creates the user experience when deploying the class:
```typescript
 new AzureKeyVault(stack, 'testAzureKeyVaultDefaults', {
      name: `kv-test`,
      location: 'eastus',
      resource_group_name: "rg-test" ,
      tenant_id: '123e4567-e89b-12d3-a456-426614174000',
    });

```
When you're setting up the properties (props) for an Azure resource in your code, look at how it's done in the Azure Portal—the web interface where you create and manage Azure resources. The Azure service teams put a lot of thought into making the Portal user-friendly. By understanding how the Portal guides a user to create a resource, you can get a good idea of how users think about the service. If your code's props are similar to the Portal's process, it will be easier for users to switch between using the Portal and using your code to manage Azure resources.

### Defaults

#### Essential Inputs
To ensure users have an effortless experience, design modules with only the essential required inputs. All other inputs can use defaults to provide the user with the best practice configuration:

```ts
// ❌ DO NOT - Create unecessary inputs with no defaults
new AzureAks(app, {
        // Provide values for all required properties
        certificates: {},
        clusterAdminGroupIds: [],
        clusterNodePoolSettings: clusterNodePoolSettings,
        clusterVersion: '1.25.5',
        environment: 'env',
        location: 'eastus',
        frontEndSubnetId: "/subscriptions/12345678-1234-9876-4563-123456789012/resourceGroups/example-resource-group/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/apgw",
        name: 'dev-tftest-platform',
        pipZones: "",
        apgwFrontendIpConfigurationPrivateIp: "10.8.0.50",
        wafConfiguration: {
          "enabled": false,
          "firewall_mode": "Detection",
          "rule_set_type": "OWASP",
...
```

```ts
// ✅ DO - create only the essential required inputs
new AzureAks(app, {
        clusterVersion: '1.25.5',
        location: 'eastus',
}

```
> A good way to identify the most appropriate default settings, consult the [Azure Portal](https://portal.azure.com/signin/index/) resource creation process. Often, you'll find they align. 

#### Default Configuration

Set a property (prop) as required only if you can't assign a default value or calculate it automatically. Choosing sensible default values makes it easier for developers to use your module.

The **@default** documentation tag must be included on all optional properties
of interfaces.

```ts
  /**
   * Application type for Application Insights resource
   * @default web will be the default option.
   */
  readonly applicationType?: string;
  /**
```

#### Simplified Props Structure

Avoid creating unnecessary sub-levels in your properties structure as it can make the code harder to work with, especially in certain programming languages like Java.

Instead, use a common prefix for related properties. This approach groups them together in both the documentation and when using code completion tools.

So rather than having a property setup like this:

```ts
new ApplicationGateway(this, 'appgw', {
      sku: {
        name: 'Standard_Small',
        tier: 'Standard',
        capacity: 2,
      },
});
```

It's better to simplify the structure like this:
```ts
new ApplicationGateway(this, 'appgw', {
      skuName: 'Standard_Small',
      skuTier: 'Standard',
      skuCapacity: 2,
});
```
This way, the properties are easier to find and use.

#### Documentation of Properties

Every prop must have detailed documentation. It is recommended to **copy** from
the official Azure Provider Terraform documentation so that language and style
will match the service.


## Implementation Details

The following guidelines and recommendations apply are related to the
implementation of Azure constructs..

### Stable Construct IDs

When you create a construct in your code, the second piece of information you provide is the construct ID. This ID is crucial because it helps to keep the resource's identity consistent over time, even when you update your infrastructure. The full path of the construct within the hierarchy of your code determines its stable identity, called the "logical ID".

Changing a logical ID by altering its path can lead to all the resources in that path being replaced on the next update, which can cause a lot of problems and is best avoided.

Always use the ID “Resource” for the main resource in an Azure construct. Think of construct IDs and their place in the code hierarchy as a promise you make to users; any change to them is a big deal and should be clearly communicated as such.

If you need to make sure each resource is unique and find yourself adding together IDs to do that, it may be a sign that you need a new level of abstraction, or you might just need a new construct instance to organize things:

```ts
const privateSubnets = new Construct(this, 'PrivateSubnets');
const publicSubnets = new Construct(this, 'PublishSubnets');

for (const az of availabilityZones) {
  new Subnet(privateSubnets, az);
  new Subnet(publicSubnets, az, { public: true });
}
```
In this example, privateSubnets and publicSubnets serve as separate groupings, ensuring that each Subnet within them is unique without needing to combine IDs.


## Testing

Check out the [Testing guide](testing.md) on how to write unit tests and integration tests.

## Naming and Coding Style

### Naming Conventions
- Use PascalCase for naming classes. Example: **BlobStorage**.
- Use camelCase for properties and methods. Example: **storageAccountName** or **createResourceGroup()**.
- For data structures that aren't classes, use PascalCase. Example: **ResourceOptions**.
- Enumerations should also be in PascalCase, but their individual members should be in UPPERCASE with underscores. Example: **SKU_TYPES { BASIC, STANDARD, PREMIUM }**.

### Coding Style
- Use 2 spaces to indent your code.
- Keep lines shorter than 150 characters.
- Prefer single quotes ' or backticks ` for strings.
- End statements with a semicolon ;.
- Write comments in lowercase and finish with a full stop.

Here's a quick example using these conventions:

```typescript
class BlobStorage {
  storageAccountName: string;

  constructor(accountName: string) {
    this.storageAccountName = accountName;
  }

  createContainer(containerName: string) {
    // code to create a container.
  }
}

interface ResourceConfigurationProps {
  location: string;
  tags?: string[];
}

enum SKU_TYPES {
  BASIC,
  STANDARD,
  PREMIUM,
}
```