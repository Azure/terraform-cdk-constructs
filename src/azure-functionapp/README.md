# Azure Linux Function App Construct
This document provides an overview of the Azure Linux Function App construct, along with best practices for deployment and use.

## What is Azure Linux Function App?
Azure Linux Function App is a serverless compute service that enables you to run code without explicitly provisioning or managing infrastructure. It supports different programming languages and integrates with Azure services and other external services.

### Hosting Plans for Azure Linux Function App
Azure Linux Function App offers three hosting plans:

**Consumption Plan**: Automatically scales based on demand and is billed per execution. It's suitable for event-driven and intermittent workloads.

**Premium Plan**: Offers more CPU and memory than the Consumption Plan and includes features like VNet connectivity. It's suitable for more demanding, consistent workloads.

**Dedicated (App Service) Plan**: Provides dedicated resources for your functions, ideal for large-scale, continuous workloads.

#### When to Use Each Plan
**Consumption Plan**: Ideal for small, event-driven functions. Use when you expect irregular traffic and want to pay only for the compute time you use.

**Premium Plan**: Best for medium to large functions requiring more consistent performance and advanced features like VNet.

**App Service Plan**: Suited for enterprise-level applications that require constant, high-scale performance.

### Azure Service Plan SKUs Enum
The `ServicePlanSkus` enum provides various options for Azure Service Plans, ranging from Consumption to Isolated Plans. Each option caters to different scalability, performance, and cost requirements.

## Examples

By default a consumption plan Azure Function will be created. If `storageaccount`, `servicePlanId`, and `resourceGroupName` inputs are not configured, these resources will be automatically created and named after the 

**Function App**

```typescript
new AzureLinuxFunctionApp(this, 'DefaultFA', {
      name: `MyDefaultFA`,
      location: 'eastus',
      tags: {
        "test": "test"
      }
});
```

**Consumption Plan**

```typescript
 new AzureLinuxFunctionApp(this, 'ConsumptionFA', {
      name: `MyConsumptionFA`,
      location: 'eastus',
      storageAccount: storageAccount,
      servicePlan: servicePlan,
      resourceGroup: resourceGroup,
      runtimeVersion: {
        pythonVersion: '3.8',
      },
      siteConfig: {
        cors: {
          allowedOrigins: ['*'],
        },
      },
      tags: {
        "test": "test"
      }
});
```

**Premium Function**

To deploy Premium Functions, use the premium SKU type. The `ServicePlanSkus` can be used to easily select available SKUs:
```typescript
import { ServicePlanSkus } from '../serviceplanskus';


 new AzureLinuxFunctionApp(this, 'PremiumFA', {
      name: `MyPremiumFA`,
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
To deploy Premium Functions, use the premium SKU type. The `ServicePlanSkus` can be used to easily select available SKUs:

**Dedicated App Service Plan**

To deploy Premium Functions, use the premium SKU type. The `ServicePlanSkus` can be used to easily select available SKUs:

```typescript
new AzureLinuxFunctionApp(this, 'ServicePlanFA', {
      name: `MyServicePlanFA`,
      location: 'eastus',
      servicePlanSku: ServicePlanSkus.ASPBasicB1,
      runtimeVersion: {
        pythonVersion: '3.8',
      },
      siteConfig: {
        cors: {
          allowedOrigins: ['*'],
        },
      },
      tags: {
        "test": "test"
      }
});
```

### Best Practices for Azure Linux Function App
Choose the Right Hosting Plan: Select a plan based on your function's performance, reliability, and cost needs.

Configure Storage Correctly: Ensure the storage account is in the same region as your function app and use separate accounts for different apps for improved performance.

Optimize Deployments: Use the "run from package" approach and consider continuous deployment for reliability.

Write Robust Functions: Design functions to be stateless, handle large data sets efficiently, and avoid long-running executions.

Consider Concurrency: Understand your function app’s response to load and configure triggers appropriately for scalability.

Plan for Connections: Optimize outbound connections to adhere to the plan’s connection limits.

Monitor Effectively: Use Azure Application Insights and Azure Monitor for comprehensive monitoring of your functions.

Build in Redundancy: Employ a multi-regional approach for high availability and disaster recovery.