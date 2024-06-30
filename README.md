# Azure Terraform CDK Constructs
Welcome to the Azure Terraform CDK Constructs project! This library offers a comprehensive suite of L2 Constructs designed to simplify and enhance the experience of building and managing Azure infrastructure with the Cloud Development Kit for Terraform (CDKTF).

## Benefits of Using L2 Constructs

With L2 Constructs, you get the following benefits:

- **Abstraction**: Higher-level abstractions over Azure resources make your infrastructure code more declarative and easier to understand.
- **Reusability**: Encapsulate common patterns and best practices in your infrastructure code, promoting reusability across different projects and teams.
- **Rapid Development**: Accelerate your cloud development process with pre-built constructs that have been tested for common use cases, allowing you to focus on your unique application logic.
- **Direct IDE Integration**: Access detailed documentation directly within your Integrated Development Environment (IDE), streamlining your development workflow: ![alt text](https://raw.githubusercontent.com/Azure/terraform-cdk-constructs/main/docs/images/ide-documentation.png)


## Quick Example

This is a quick example that showcases the simplicity and power of L2 Constructs. We'll create a storage account, add a container to it, and then upload a blob—all with a few lines of intuitive, object-oriented code:

```typescript

// Create a new instance of a storage account as an object
const sa = new azcdk.azure_storageaccount.Account(stack, "storageaccount", {
  name: "testStorageAccount",
  location: "eastus",
});

// Add a container to the storage account by calling a method on the storage account object
const container = sa.addContainer("testcontainer");

// Add a blob to the container by calling a method on the container object
// The path "../../../test.txt" points to the source file to be uploaded as a blob
container.addBlob("testblob.txt", "../../../test.txt");
```



## Getting Started

This guide will walk you through the process of using the Azure L2 Constructs to define and provision infrastructure on Azure. 

### Prerequisites
Make sure you have Node.js and npm installed on your machine. These will be used to install the CDK for Terraform and Azure provider packages.

### Installation

First, install the CDK for Terraform CLI globally using npm:

```sh
npm install -g cdktf-cli
```

Next, initialize a new CDK for Terraform project with TypeScript template:
```sh
cdktf init --template="TypeScript" --local
```
Install the AzureRM provider for CDKTF:

```sh
npm install @cdktf/provider-azurerm
```

Then, add the Microsoft Terraform CDK constructs for Azure:

```sh
npm install @micrsoft/terraform-cdk-constructs

```


### Example 1: Creating a Storage Account
Now let's create a simple Azure storage account. The following TypeScript snippet defines a storage account resource using the CDKTF:

```typescript
// Import necessary modules and classes
import * as azcdk from "@microsoft/terraform-cdk-constructs";
import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";

// Define a new Terraform stack
class AzureAppInfra extends TerraformStack {
 constructor(scope: Construct, name: string) {
   super(scope, name);

   // Initialize Azure provider
   new AzurermProvider(this, "azureFeature", { features: {} });

   // Create a new Azure storage account with the specified name and location
   new azcdk.azure_storageaccount.Account(this, "storageaccount", {
     name: "test42348808",
     location: "eastus",
   });
 }
}

// Initialize the CDK app and synthesize Terraform configurations
const app = new App();
new AzureAppInfra(app, 'cdk');
app.synth();
```
After defining your infrastructure, generate the Terraform configuration files:
```sh
cdktf synth
```
Finally, deploy your infrastructure to Azure:

```sh
cdktf deploy
```
## Supported Languages

Currently, our CDK L2 constructs are available in the following languages:

| Language   | Status       |
|------------|--------------|
| TypeScript | [Available](https://www.npmjs.com/package/@microsoft/terraform-cdk-constructs)    |
| Python     | [Available](https://pypi.org/project/microsoft-cdktfconstructs/)  |
| Java       | Coming soon  |
| C#         | [Available](https://www.nuget.org/packages/Microsoft.Cdktf.Azure.TFConstructs)  |

Stay tuned for updates as we work to expand support to other popular programming languages!


## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

We welcome contributions to this project! See our documentation on [how to get started contributing](./docs/CONTRIBUTING.md). 

## Code Spaces

To open this repository in a Code Space, click the button below:

[![Open in Code Spaces](https://img.shields.io/badge/Open%20in%20Code%20Spaces-Terraform%20Azure%20CDK%20Modules%20Project-blue?logo=github)](https://github.com/microsoft/terraform-azure-cdk-modules/codespaces)

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
