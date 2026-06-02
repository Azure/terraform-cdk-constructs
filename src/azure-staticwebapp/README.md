# Azure Static Web App Construct

This module provides a high-level TypeScript construct for managing Azure Static Web Apps using the Terraform CDK and Azure AZAPI provider.

## Features

- **Multiple API Version Support**: Supports the most recent stable API versions (2024-04-01, 2023-12-01, 2022-03-01)
- **Automatic Version Resolution**: Uses the latest API version by default
- **Version Pinning**: Lock to a specific API version for stability
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **JSII Compatible**: Can be used from TypeScript, Python, Java, and C#
- **Terraform Outputs**: Automatic creation of outputs for easy reference
- **Tag Management**: Built-in methods for managing resource tags
- **SKU Support**: Free and Standard SKU options
- **GitHub / Source Control Integration**: Optional repository, branch and build configuration

## Supported API Versions

| Version | Status | Release Date | Notes |
|---------|--------|--------------|-------|
| 2024-04-01 | Active (Latest) | 2024-04-01 | Recommended for new deployments |
| 2023-12-01 | Active | 2023-12-01 | Performance and reliability improvements |
| 2022-03-01 | Active | 2022-03-01 | Initial stable release |

## Installation

This module is part of the `@microsoft/terraform-cdk-constructs` package.

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Basic Usage

### Simple Free-tier Static Web App

```typescript
import { App, TerraformStack } from "cdktf";
import { AzapiProvider } from "@microsoft/terraform-cdk-constructs/core-azure";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";
import { StaticWebApp } from "@microsoft/terraform-cdk-constructs/azure-staticwebapp";

const app = new App();
const stack = new TerraformStack(app, "static-web-app-stack");

// Configure the Azure provider
new AzapiProvider(stack, "azapi", {});

// Create a resource group
const resourceGroup = new ResourceGroup(stack, "rg", {
  name: "my-resource-group",
  location: "eastus2",
});

// Create a Static Web App
const swa = new StaticWebApp(stack, "static-web-app", {
  name: "my-static-web-app",
  // Static Web Apps are only supported in a limited set of regions
  // (e.g. centralus, eastus2, eastasia, westeurope, westus2)
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Free",
    tier: "Free",
  },
  tags: {
    environment: "production",
    purpose: "marketing-site",
  },
});

app.synth();
```

## Advanced Usage

### Standard Static Web App with GitHub Integration

```typescript
const swa = new StaticWebApp(stack, "github-static-web-app", {
  name: "swa-github",
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
    tier: "Standard",
  },
  repositoryUrl: "https://github.com/my-org/my-repo",
  branch: "main",
  // Tip: pass the token via a Terraform variable instead of hard-coding it
  repositoryToken: process.env.GITHUB_TOKEN,
  buildProperties: {
    appLocation: "/",
    apiLocation: "api",
    outputLocation: "dist",
  },
  tags: {
    environment: "production",
  },
});
```

### Custom Build Commands

```typescript
const swa = new StaticWebApp(stack, "custom-build-static-web-app", {
  name: "swa-custom-build",
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
  repositoryUrl: "https://github.com/my-org/my-repo",
  branch: "main",
  buildProperties: {
    appLocation: "/",
    appBuildCommand: "npm run build",
    apiBuildCommand: "npm run build:api",
    outputLocation: "dist",
    skipGithubActionWorkflowGeneration: true,
  },
});
```

### Disabling Staging Environments

```typescript
const swa = new StaticWebApp(stack, "no-staging-static-web-app", {
  name: "swa-no-staging",
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard", tier: "Standard" },
  stagingEnvironmentPolicy: "Disabled",
});
```

### Pinning to a Specific API Version

```typescript
const swa = new StaticWebApp(stack, "versioned-static-web-app", {
  name: "swa-stable",
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
  apiVersion: "2023-12-01",
});
```

### Using Outputs

```typescript
const swa = new StaticWebApp(stack, "static-web-app", {
  name: "my-static-web-app",
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
});

// Access Static Web App ID for use in other resources
console.log(swa.id); // Terraform interpolation string
console.log(swa.resourceId); // Alias for id

// Access the default hostname
console.log(swa.defaultHostname);

// Use outputs for cross-stack references
new TerraformOutput(stack, "static-web-app-hostname", {
  value: swa.defaultHostname,
});
```

### Tag Management

```typescript
const swa = new StaticWebApp(stack, "static-web-app", {
  name: "my-static-web-app",
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
  tags: {
    environment: "production",
  },
});

// Add a tag
swa.addTag("cost-center", "engineering");

// Remove a tag
swa.removeTag("environment");
```

## API Reference

### StaticWebAppProps

Configuration properties for the Static Web App construct.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | No* | Name of the Static Web App. If not provided, uses the construct ID. |
| `location` | `string` | Yes | Azure region. Static Web Apps are supported in a limited set of regions. |
| `resourceGroupId` | `string` | No | Resource group ID. If not provided, uses subscription scope. |
| `sku` | `StaticWebAppSku` | No | SKU configuration (default: `Free`). |
| `repositoryUrl` | `string` | No | URL of the source code repository (e.g. GitHub). |
| `branch` | `string` | No | Source code branch in the repository. |
| `repositoryToken` | `string` | No | Token used to authenticate against the repository. Treat as a secret. |
| `buildProperties` | `StaticWebAppBuildProperties` | No | Build configuration for the static web app. |
| `stagingEnvironmentPolicy` | `string` | No | `Enabled` or `Disabled`. |
| `allowConfigFileUpdates` | `boolean` | No | Whether configuration file updates are allowed. |
| `tags` | `{ [key: string]: string }` | No | Resource tags. |
| `apiVersion` | `string` | No | Pin to a specific API version. |
| `ignoreChanges` | `string[]` | No | Properties to ignore during updates. |

### StaticWebAppSku

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | SKU name: `Free` or `Standard`. |
| `tier` | `string` | No | SKU tier: `Free` or `Standard`. |

### StaticWebAppBuildProperties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `appLocation` | `string` | No | Path to the app source within the repository. |
| `apiLocation` | `string` | No | Path to the Azure Functions API source. |
| `outputLocation` | `string` | No | Path of the build output relative to `appLocation`. |
| `appBuildCommand` | `string` | No | Custom build command for the app. |
| `apiBuildCommand` | `string` | No | Custom build command for the API. |
| `skipGithubActionWorkflowGeneration` | `boolean` | No | Skip generating the GitHub Action workflow. |
| `githubActionSecretNameOverride` | `string` | No | Override the GitHub Action secret name. |

### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The Azure resource ID of the Static Web App. |
| `resourceId` | `string` | Alias for `id`. |
| `tags` | `{ [key: string]: string }` | The tags assigned to the Static Web App. |
| `subscriptionId` | `string` | The subscription ID extracted from the resource ID. |
| `defaultHostname` | `string` | Terraform interpolation for the default hostname (e.g. `*.azurestaticapps.net`). |

### Outputs

The construct automatically creates Terraform outputs:

- `id`: The Static Web App resource ID
- `name`: The Static Web App name
- `location`: The Static Web App location
- `tags`: The Static Web App tags
- `default_hostname`: The default hostname (e.g. `<name>.azurestaticapps.net`)

### Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `addTag` | `key: string, value: string` | Add a tag to the Static Web App (requires redeployment). |
| `removeTag` | `key: string` | Remove a tag from the Static Web App (requires redeployment). |

## SKU Comparison

### Free SKU

- **Custom Domains**: 2 per app
- **SSL Certificates**: Free, automatically managed
- **Bandwidth**: Limited
- **Authentication**: Pre-configured providers only
- **Use Cases**: Personal, hobby and small project sites
- **Pricing**: Free

### Standard SKU

- **Custom Domains**: 5 per app
- **SSL Certificates**: Free, automatically managed; supports BYO certificates
- **Bandwidth**: Higher quotas
- **Authentication**: Custom providers and role-based authorization
- **SLA**: 99.95% uptime SLA
- **Use Cases**: Production workloads, business-critical sites
- **Pricing**: Per-app monthly cost (see Azure pricing page)

## Best Practices

### 1. Use Standard SKU for Production

```typescript
// ✅ Recommended
const swa = new StaticWebApp(stack, "static-web-app", {
  name: "prod-swa",
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
  sku: {
    name: "Standard",
    tier: "Standard",
  },
});
```

### 2. Pass Repository Tokens Through Variables

```typescript
// ✅ Recommended - read from environment / Terraform variable
const swa = new StaticWebApp(stack, "static-web-app", {
  name: "swa-github",
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
  repositoryUrl: "https://github.com/my-org/my-repo",
  branch: "main",
  repositoryToken: process.env.GITHUB_TOKEN,
});
```

### 3. Ignore Externally-Managed Properties

```typescript
// ✅ Good when GitHub Actions manages deployments
const swa = new StaticWebApp(stack, "static-web-app", {
  name: "swa-cicd",
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
  ignoreChanges: ["body.properties.repositoryToken"],
});
```

### 4. Apply Consistent Tags

```typescript
// ✅ Recommended - comprehensive tagging
const swa = new StaticWebApp(stack, "static-web-app", {
  name: "my-static-web-app",
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
  tags: {
    environment: "production",
    "cost-center": "engineering",
    "managed-by": "terraform",
    purpose: "marketing-site",
  },
});
```

## Common Use Cases

### Marketing or Documentation Site (Free)

```typescript
const marketingSwa = new StaticWebApp(stack, "marketing-swa", {
  name: "swa-marketing",
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Free", tier: "Free" },
});
```

### Production SPA with API (Standard + GitHub)

```typescript
const productionSwa = new StaticWebApp(stack, "prod-swa", {
  name: "swa-prod",
  location: "eastus2",
  resourceGroupId: resourceGroup.id,
  sku: { name: "Standard", tier: "Standard" },
  repositoryUrl: "https://github.com/my-org/my-app",
  branch: "main",
  buildProperties: {
    appLocation: "/",
    apiLocation: "api",
    outputLocation: "dist",
  },
});
```

## Troubleshooting

### Common Issues

1. **Unsupported Region**: Static Web Apps are only supported in a limited set of regions. Use one of `centralus`, `eastus2`, `eastasia`, `westeurope`, or `westus2`.

2. **Repository Token Permissions**: When integrating with GitHub, the personal access token must have the `repo` scope so the Static Web App can configure the GitHub Actions workflow.

3. **Naming Conflicts**: The Static Web App name does not need to be globally unique, but the generated `*.azurestaticapps.net` hostname does. Choose a unique name to avoid hostname collisions.

4. **API Version Errors**: If you encounter API version errors, verify the version is supported (2024-04-01, 2023-12-01, or 2022-03-01).

5. **Permission Issues**: Ensure your Azure service principal has `Website Contributor` or `Contributor` role on the target resource group.

## Related Constructs

- [`ResourceGroup`](../azure-resourcegroup/README.md) - Azure Resource Groups
- [`StorageAccount`](../azure-storageaccount/README.md) - Storage Accounts (useful for static asset hosting alternatives)
- [`FunctionApp`](../azure-functionapp/README.md) - Azure Functions (can back the Static Web App API)

## Additional Resources

- [Azure Static Web Apps Documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [Azure REST API Reference](https://learn.microsoft.com/en-us/rest/api/appservice/static-sites)
- [Terraform CDK Documentation](https://developer.hashicorp.com/terraform/cdktf)

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
