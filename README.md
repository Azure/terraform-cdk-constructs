# Azure Terraform CDK Constructs

Welcome to the Azure Terraform CDK Constructs project! This library offers Azure L2 Constructs using the AZAPI provider for direct Azure REST API access, providing immediate access to new Azure features and API versions.

## 🚀 Version 1.0.0 - AZAPI Provider Migration

**Breaking Change Notice:** Version 1.0.0 represents a major architectural shift from AzureRM provider to AZAPI provider. This migration provides:

- **Direct Azure REST API Access**: No dependency on AzureRM provider
- **Immediate Feature Access**: Get new Azure features as soon as they're available in Azure APIs
- **Version-Specific Implementations**: Multiple API versions supported for each service
- **Enhanced Type Safety**: Improved IDE support and compile-time validation
- **Included Provider Bindings**: AZAPI provider classes are included - no need to generate bindings

## Benefits of Using AZAPI L2 Constructs

With AZAPI L2 Constructs, you get the following benefits:

- **Direct API Access**: Bypass provider limitations and access Azure REST APIs directly
- **Version Flexibility**: Choose specific API versions for your resources
- **Rapid Feature Adoption**: Access new Azure features immediately without waiting for provider updates
- **Enhanced Abstraction**: Higher-level abstractions over Azure resources with type safety
- **Reusability**: Encapsulate common patterns and best practices in your infrastructure code
- **Direct IDE Integration**: Access detailed documentation directly within your IDE
- **Zero Provider Setup**: AZAPI provider bindings included in the package

## Currently Supported Services

| Service | API Versions | Status |
|---------|-------------|--------|
| Resource Groups | 2024-11-01, 2025-01-01, 2025-03-01 | ✅ Available |
| Storage Accounts | 2023-01-01, 2023-05-01, 2024-01-01 | ✅ Available |

*More services will be added in future releases using the same AZAPI architecture.*

## Quick Example

Create Azure resources using AZAPI provider:

```typescript
import * as azcdk from "@microsoft/terraform-cdk-constructs";
import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';

class AzureAppInfra extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // Create a new Azure Resource Group using AZAPI
    const rg = new azcdk.azure_resourcegroup.ResourceGroup(this, "resourcegroup", {
      name: "rg-myapp-prod",
      location: "eastus",
      tags: {
        environment: "production",
        project: "myapp"
      }
    });

    // Create a Storage Account
    new azcdk.azure_storageaccount.StorageAccount(this, "storage", {
      name: "mystorageaccount",
      location: "eastus",
      resourceGroupId: rg.id,
      sku: { name: "Standard_LRS" }
    });
  }
}

const app = new App();
new AzureAppInfra(app, 'cdk');
app.synth();
```

## Getting Started

### Prerequisites
- Node.js and npm installed (for TypeScript/JavaScript)
- Azure CLI configured with appropriate permissions

### Installation

Install the CDK for Terraform CLI globally:

```sh
npm install -g cdktf-cli
```

Initialize a new CDK for Terraform project:
```sh
cdktf init --template="TypeScript" --local
```

Install the Microsoft Terraform CDK constructs (includes AZAPI provider bindings):

```sh
npm install @microsoft/terraform-cdk-constructs
```

That's it! The AZAPI provider classes are included in the package, so you don't need to configure additional providers or generate bindings.

### Basic Usage Example

```typescript
import * as azcdk from "@microsoft/terraform-cdk-constructs";
import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';

class MyAzureInfra extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // Create a resource group
    const rg = new azcdk.azure_resourcegroup.ResourceGroup(this, "main-rg", {
      name: "rg-myproject-prod",
      location: "eastus",
      tags: {
        environment: "production",
        project: "myproject"
      }
    });

    // Create a storage account
    const storage = new azcdk.azure_storageaccount.StorageAccount(this, "storage", {
      name: "mystorageaccount",
      location: "eastus",
      resourceGroupId: rg.id,
      sku: { name: "Standard_LRS" },
      tags: {
        environment: "production",
        project: "myproject"
      }
    });
  }
}

const app = new App();
new MyAzureInfra(app, 'azure-infra');
app.synth();
```

## Version-Specific Usage

You can use specific API versions for fine-grained control:

```typescript
// Use latest version (recommended) - automatically resolves to newest API version
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { StorageAccount } from "@microsoft/terraform-cdk-constructs/azure-storageaccount";

// Or specify explicit API version for version pinning
const rg = new ResourceGroup(this, "rg", {
  name: "my-resource-group",
  location: "eastus",
  apiVersion: "2025-03-01"  // Pin to specific version
});

const storage = new StorageAccount(this, "storage", {
  name: "mystorageaccount",
  location: "eastus",
  resourceGroupId: rg.id,
  sku: { name: "Standard_LRS" },
  apiVersion: "2024-01-01"  // Pin to specific version
});
```

## Migration from v0.x

If you're migrating from version 0.x (AzureRM-based), please see our [Versioning and Migrations User Guide](./docs/versioning-and-migrations-user-guide.md) for detailed instructions.

## Deployment

Generate Terraform configuration:
```sh
cdktf synth
```

Deploy your infrastructure:
```sh
cdktf deploy
```

## Supported Languages

Thanks to JSII, this library is available in multiple programming languages:

| Language   | Package | Status |
|------------|---------|--------|
| TypeScript/JavaScript | [`@microsoft/terraform-cdk-constructs`](https://www.npmjs.com/package/@microsoft/terraform-cdk-constructs) | ✅ Available |
| Python     | [`microsoft-cdktfconstructs`](https://pypi.org/project/microsoft-cdktfconstructs/) | ✅ Available |
| Java       | [`com.microsoft.terraformcdkconstructs`](https://search.maven.org/artifact/com.microsoft.terraformcdkconstructs/cdktf-azure-constructs) | ✅ Available |
| C#/.NET    | [`Microsoft.Cdktf.Azure.TFConstructs`](https://www.nuget.org/packages/Microsoft.Cdktf.Azure.TFConstructs) | ✅ Available |

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

We welcome contributions to this project! See our documentation on [how to get started contributing](./CONTRIBUTING.md).

## Documentation

- [Architecture Documentation](./docs/ARCHITECTURE.md) - High-level architecture and design patterns
- [Versioning and Migrations User Guide](./docs/versioning-and-migrations-user-guide.md) - API version management and migration guidance
- [Testing Guide](./docs/testing.md) - Testing practices and utilities
- [Design Guide](./docs/design_guide.md) - Module design guidelines
- [API Documentation](./API.md) - Complete API reference

## Code Spaces

[![Open in GitHub Codespaces](https://img.shields.io/badge/Open%20in%20GitHub%20Codespaces-blue?logo=github)](https://github.com/Azure/terraform-cdk-constructs/codespaces)

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
