# Terraform-Azure-CDK-Modules

This repository contains code for building infrastructure using Terraform Azure CDK modules.



## Using the Libraries

This project includes several libraries for building infrastructure using Azure modules. Here are some examples of how to use them:

### Example 1: Creating a Virtual Machine

```typescript
import { VirtualMachine } from '@my-awesome-infra/virtual-machine';

const vm = new VirtualMachine({
  name: 'my-vm',
  location: 'eastus',
  resourceGroup: 'my-resource-group',
  size: 'Standard_D2s_v3',
  osDisk: {
    storageAccountType: 'Standard_LRS',
    diskSizeGB: 128,
  },
  adminUsername: 'admin',
  adminPassword: 'password',
});
```

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
